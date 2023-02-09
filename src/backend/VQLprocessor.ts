import initSqlJs from 'sql.js';
import { SqlValue } from 'sql.js';
import fs from 'fs';

import { Jovo } from '@jovotech/framework/dist/types/Jovo';
import { VQLcontext } from './VoiceQlTypes';

/**
 * VQL Implementation for Jovo
 *
 * Note: tables do not guarantee a specific order
 *
 * Every call in this file is atomic, includes open the db
 *
 */
async function openSqliteDatabase(pathName: string) {
  const filebuffer = fs.readFileSync(pathName);
  const SQL = await initSqlJs();
  const db = new SQL.Database(filebuffer);
  return db;
}

export async function getMetadata(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext = initializeVQLcontext(jovoContext);
  const db = await openSqliteDatabase(vqlContext.dbName);

  // Determine name of columns
  let nameOfColumns: string[] = [];
  if (vqlContext?.currentTable?.name !== undefined) {
    const statementFirst = 'PRAGMA table_info("' + vqlContext.currentTable.name + '")';
    vqlContext.latestSqlStatements = [statementFirst];

    const firstRawResult = db.exec(statementFirst);
    if (firstRawResult.length > 0) {
      nameOfColumns = firstRawResult[0].values //  "values" contains column information
        .map((sqlValueArray: SqlValue[]) =>
          getSqlValueAsTrimmedString(sqlValueArray[1]).toLowerCase()
        );
    }
  }

  // Determine number of columns
  const numOfColumns = nameOfColumns.length;

  // Determine number of rows
  let numOfRows = 0;
  if (numOfColumns > 0) {
    // if table exists
    const statementSecond = 'SELECT count(*) AS NUM_OF_ROWS FROM ' + vqlContext.currentTable.name;
    vqlContext.latestSqlStatements.push(statementSecond);
    const secondRawResult = db.exec(statementSecond);
    numOfRows = getSqlValueAsInteger(secondRawResult[0].values[0][0]);
    vqlContext.currentTable.numOfRows = numOfRows;
  }

  vqlContext.latestQueryResult = {
    nameOfColumns,
    numOfColumns,
    numOfRows
  };
  return vqlContext;
}

export async function getTableNames(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext = initializeVQLcontext(jovoContext);
  const db = await openSqliteDatabase(vqlContext.dbName);
  const statement =
    "SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ";
  const rawResult = db.exec(statement);

  // [["alpha"],["beta "]] ==> ["alpha", "beta"]
  const result: string[] = rawResult[0].values.map((x: SqlValue[]) =>
    getSqlValueAsTrimmedString(x[0]).toLowerCase()
  );
  //vqlContext.tableNames = result;
  vqlContext.latestSqlStatements = [statement];
  vqlContext.latestQueryResult = result;
  return vqlContext;
}

export async function setCurrentTable(jovoContext: Jovo, tableName: string): Promise<VQLcontext> {
  const vqlContext = initializeVQLcontext(jovoContext);
  const db = await openSqliteDatabase(vqlContext.dbName);
  try {
    const statementFirst = 'PRAGMA table_info("' + tableName + '")';
    const rawResult = db.exec(statementFirst);
    // be prepared that table may not exist
    if (rawResult[0] !== undefined) {
      const result: string[] = rawResult[0].values //  "values" contains column information
        .map((sqlValueArray: SqlValue[]) =>
          getSqlValueAsTrimmedString(sqlValueArray[1]).toLowerCase()
        );

      let numOfRows = 0;
      // if table exists
      const statementSecond = 'SELECT count(*) AS NUM_OF_ROWS FROM ' + tableName;
      vqlContext.latestSqlStatements.push(statementSecond);
      const secondRawResult = db.exec(statementSecond);
      numOfRows = getSqlValueAsInteger(secondRawResult[0].values[0][0]);

      vqlContext.currentTable.name = tableName;
      vqlContext.currentTable.columnNames = result;
      vqlContext.currentTable.numOfRows = numOfRows;

      vqlContext.latestSqlStatements = [statementFirst, statementSecond];
      vqlContext.latestQueryResult = result;
    }

    vqlContext.currentTable.filterColumn = undefined;
    vqlContext.currentTable.comparator = undefined;
    vqlContext.currentTable.filterValue = undefined;

    vqlContext.currentTable.rowNumber = 1;

    return vqlContext;
  } catch (error) {
    console.log({ error });

    throw new Error('INVALID_TABLE_NAME');
  }
}

export async function getColumnNames(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext = initializeVQLcontext(jovoContext);
  const db = await openSqliteDatabase(vqlContext.dbName);

  const statement = 'PRAGMA table_info("' + vqlContext.currentTable.name + '")';
  const rawResult = db.exec(statement);
  const result: string[] = rawResult[0].values //  "values" contains column information
    .map((sqlValueArray: SqlValue[]) => getSqlValueAsTrimmedString(sqlValueArray[1]).toLowerCase());

  vqlContext.currentTable.columnNames = result;
  vqlContext.latestSqlStatements = [statement];
  vqlContext.latestQueryResult = {
    columnNames: result,
    numOfColumns: result.length
  };
  return vqlContext;
}

/* return number of rows */
export async function getNumRows(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext = initializeVQLcontext(jovoContext);

  const queryPrefix = 'SELECT count(*) ';
  return await buildAndPerformQueryFromContext(vqlContext, queryPrefix, false);
}

export async function getNthColumnName(
  jovoContext: Jovo,
  columnNumberCandidate: string | undefined
): Promise<VQLcontext> {
  const vqlContext = initializeVQLcontext(jovoContext);
  if (isNaN(Number(columnNumberCandidate))) {
    return vqlContext; // makes no sense to proceed
  }
  vqlContext.currentTable.columnNumber = Number(columnNumberCandidate);
  const db = await openSqliteDatabase(vqlContext.dbName);
  const statement = 'PRAGMA table_info("' + vqlContext.currentTable.name + '")';
  const rawResult = db.exec(statement);
  const resultArray = rawResult[0].values.map((x: SqlValue[]) =>
    getSqlValueAsTrimmedString(x[1]).toLowerCase()
  );
  const result = resultArray[vqlContext.currentTable.columnNumber - 1];
  vqlContext.latestSqlStatements = [statement];
  vqlContext.latestQueryResult = result;
  return vqlContext;
}

export async function getCurrentRowFromTable(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext = initializeVQLcontext(jovoContext);

  const projectionColumnNames: string[] = vqlContext.currentTable.projectionColumnNames;
  let columnFilter = '*';

  if (
    projectionColumnNames !== undefined &&
    projectionColumnNames !== null &&
    projectionColumnNames.length > 0
  ) {
    columnFilter = projectionColumnNames[0];
  }

  return await buildAndPerformQueryFromContext(vqlContext, 'SELECT ' + columnFilter + ' ');
}

export async function getAvgValueFromColumn(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext: VQLcontext = initializeVQLcontext(jovoContext);
  const queryPrefix = 'SELECT AVG("' + vqlContext.currentTable.columnName + '") ';
  return await buildAndPerformQueryFromContext(vqlContext, queryPrefix);
}

export async function getSumValueFromColumn(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext: VQLcontext = initializeVQLcontext(jovoContext);
  const queryPrefix = 'SELECT SUM("' + vqlContext.currentTable.columnName + '") ';
  return await buildAndPerformQueryFromContext(vqlContext, queryPrefix);
}

export async function getNumberOfDistinctValuesInColumn(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext: VQLcontext = initializeVQLcontext(jovoContext);
  const queryPrefix = 'SELECT COUNT(DISTINCT("' + vqlContext.currentTable.columnName + '")) ';
  return await buildAndPerformQueryFromContext(vqlContext, queryPrefix);
}

export async function getMaxValueFromColumn(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext: VQLcontext = initializeVQLcontext(jovoContext);
  const queryPrefix = 'SELECT MAX("' + vqlContext.currentTable.columnName + '") ';
  return await buildAndPerformQueryFromContext(vqlContext, queryPrefix);
}

export async function getMinValueFromColumn(jovoContext: Jovo): Promise<VQLcontext> {
  const vqlContext = initializeVQLcontext(jovoContext);
  const queryPrefix = 'SELECT MIN("' + vqlContext.currentTable.columnName + '") ';
  return await buildAndPerformQueryFromContext(vqlContext, queryPrefix);
}

export async function buildAndPerformQueryFromContext(
  vqlContext: VQLcontext,
  prefix: string,
  limitOneLine = true
): Promise<VQLcontext> {
  const db = await openSqliteDatabase(vqlContext.dbName);

  let ORDER_BY = '';
  if (vqlContext.currentTable.sortColumn !== undefined) {
    ORDER_BY = ' ORDER BY ' + vqlContext.currentTable.sortColumn;
    if (vqlContext.currentTable.sortOrder !== undefined) {
      // 'asc' or 'desc'
      ORDER_BY = ORDER_BY + ' ' + vqlContext.currentTable.sortOrder;
    }
  }

  let WHERE_CLAUSE = '';
  if (vqlContext.currentTable.filterColumn !== undefined) {
    const comparator = vqlContext.currentTable.comparator;
    let filterValue = vqlContext.currentTable.filterValue;
    const STRING_MODE = isNaN(Number(filterValue));

    if (STRING_MODE) {
      WHERE_CLAUSE = ' WHERE lower(' + vqlContext.currentTable.filterColumn + ') ';
    } else {
      WHERE_CLAUSE = ' WHERE ' + vqlContext.currentTable.filterColumn + ' ';
    }

    if (comparator === 'less') {
      WHERE_CLAUSE = WHERE_CLAUSE + '<';
    } else if (comparator === 'greater') {
      WHERE_CLAUSE = WHERE_CLAUSE + '>';
    } else if (comparator === 'like' || (comparator === 'equal' && STRING_MODE)) {
      WHERE_CLAUSE = WHERE_CLAUSE + 'LIKE';
    } else if (comparator === 'equal') {
      WHERE_CLAUSE = WHERE_CLAUSE + '=';
    } else {
      console.log('Not implemented yet: ' + comparator);
      // TODO: in the future you might want to add more
      // conditions like "not equal", <=, >=, "find between (range)", ...
    }
    if (filterValue !== undefined) {
      if (STRING_MODE) {
        filterValue = filterValue.toString().replace(/[- ]/g, '%');
        WHERE_CLAUSE = WHERE_CLAUSE + " lower('%" + filterValue + "%') ";
      } else {
        WHERE_CLAUSE = WHERE_CLAUSE + ' ' + filterValue;
      }
    }
  }

  // determine number of rows in the current filtered result set
  const numOfResultRowsStatement =
    'SELECT COUNT (*) AS NUM_OF_ROWS FROM ("' +
    vqlContext.currentTable.name +
    '") ' +
    WHERE_CLAUSE +
    ORDER_BY;
  try {
    const rawResult = db.exec(numOfResultRowsStatement);
    vqlContext.currentTable.numOfRows = getSqlValueAsInteger(rawResult[0].values[0][0]);
    vqlContext.latestSqlStatements = [numOfResultRowsStatement];
  } catch (error) {
    console.error('Could not determine number of rows: ' + numOfResultRowsStatement);
    console.error(error);
  }

  // execute statement
  let statement =
    prefix + ' FROM ("' + vqlContext.currentTable.name + '") ' + WHERE_CLAUSE + ORDER_BY;

  if (limitOneLine) {
    statement += ' LIMIT ' + (vqlContext.currentTable.rowNumber - 1) + ',1';
  }

  let result: string[] = [];
  try {
    // console.log(statement);
    const rawResult = db.exec(statement);

    if (rawResult[0] !== undefined) {
      // in next line number becomes string: 1 => "1"
      result = Object.values(rawResult[0].values[0]).map((x) =>
        getSqlValueAsTrimmedString(x).toLowerCase()
      );
    }
    vqlContext.latestSqlStatements.push(statement);
  } catch (error) {
    console.error('Could not execute query: ' + statement);
    console.error(error);
    result = ['Error. '];
  }

  vqlContext.latestQueryResult = result;
  return vqlContext;
}

export async function getCellValueFromTableByCoordinate(
  vqlContext: VQLcontext
): Promise<VQLcontext> {
  const db = await openSqliteDatabase(vqlContext.dbName);
  const statement =
    'SELECT *  FROM ("' +
    vqlContext.currentTable.name +
    '") LIMIT ' +
    (vqlContext.currentTable.rowNumber - 1) +
    ',1';
  const rawResult = db.exec(statement);
  const result = getSqlValueAsTrimmedString(
    rawResult[0].values[0][vqlContext.currentTable.columnNumber]
  );
  vqlContext.latestSqlStatements = [statement];
  vqlContext.latestQueryResult = result;
  return vqlContext;
}

export async function getAllValueFromTable(vqlContext: VQLcontext): Promise<VQLcontext> {
  const db = await openSqliteDatabase(vqlContext.dbName);
  const statement = 'SELECT * FROM ("' + vqlContext.currentTable.name + '")';
  const rawResult = db.exec(statement);
  vqlContext.latestSqlStatements = [statement];
  vqlContext.latestQueryResult = getSqlValueAsTrimmedString(rawResult[0].values[0][0]);
  return vqlContext;
}

export function hasTable(jovoContext: Jovo): boolean {
  if (jovoContext?.$session?.data?.vqlContext?.currentTable?.name === undefined) {
    return false;
  }
  return true;
}

export function isInvalid(jovoContext: Jovo): boolean {
  if (jovoContext?.$session?.data?.vqlContext?.currentTable?.name === undefined) {
    return true;
  }
  return false;
}

function initializeVQLcontext(jovoContext: Jovo): VQLcontext {
  let vqlContext: VQLcontext = jovoContext.$session.data.vqlContext;
  if (vqlContext === undefined) {
    vqlContext = {
      dbName: jovoContext.$session.data['SqliteDbFileName'],
      //tableNames: jovoContext.$session.data['TableNameList'],
      currentTable: {
        name: undefined,
        columnNames: [],
        numOfRows: 0,

        projectionColumnNames: [],

        // cache simple filter restriction
        filterColumn: undefined,
        comparator: undefined,
        filterValue: undefined,

        // cache order rule
        sortColumn: undefined,
        sortOrder: 'asc',

        columnName: undefined,
        // for 'cursor' (requires ordering)
        rowNumber: 1,
        columnNumber: 1
      },
      //TODO latestNlRequest: '',
      latestSqlStatements: [] as string[],
      latestQueryResult: {}
      //TODO latestNlResponse: ''
    };
  }
  return vqlContext;
}

function getSqlValueAsTrimmedString(sqlValue: SqlValue): string {
  if (sqlValue === null) {
    return '';
  } else {
    return sqlValue.toString().trim();
  }
}

function getSqlValueAsInteger(sqlValue: SqlValue): number {
  return getSqlValueAsIntegerOrNull(sqlValue, 0) as number;
}

function getSqlValueAsIntegerOrNull(
  sqlValue: SqlValue,
  defaultValue: number | null
): number | null {
  if (sqlValue === null) {
    return defaultValue;
  } else {
    return parseInt(sqlValue.toString().trim());
  }
}

/**
 *
 * @param vqlContext
 * @param localizedAnd
 * @param localizedEmpty
 * @returns
 */
export function prepareRowContentDescriptionUtterance(
  vqlContext: VQLcontext,
  localizedAnd: string,
  localizedEmpty: string
): string {
  let columnNamesArray: string[] = vqlContext.currentTable.columnNames;
  const projectionColumnNamesArray: string[] = vqlContext.currentTable.projectionColumnNames;
  const columnContentArray: string[] = vqlContext.latestQueryResult as string[];

  // projectionColumnNames wins over columnNamesArray
  if (projectionColumnNamesArray !== undefined && projectionColumnNamesArray.length !== 0) {
    columnNamesArray = projectionColumnNamesArray;
  }

  const rowMap: { [key: string]: string } = {};
  for (let i = 0; i <= columnNamesArray.length - 1; i++) {
    rowMap[columnNamesArray[i] as string] = columnContentArray[i];
  }

  const zippedArray: string[] = [];

  // render first length -1 elements
  for (let i = 0; i < columnNamesArray.length - 1; i++) {
    zippedArray.push(columnNamesArray[i]);
    zippedArray.push(': '); // sounds like a break
    const value = rowMap[columnNamesArray[i]]; // columnContentArray[i];
    if (value === undefined || value === null || value === '') {
      zippedArray.push(' ' + localizedEmpty + ' ');
    } else {
      zippedArray.push(columnContentArray[i]);
    }
    zippedArray.push(' : '); // sounds like a break
  }

  // render localized "and"
  if (columnNamesArray.length > 1) {
    zippedArray.push(' ' + localizedAnd + ' ');
  }

  // render last element
  zippedArray.push(columnNamesArray[columnNamesArray.length - 1]);
  zippedArray.push(': '); // sounds like a break

  const value = rowMap[columnNamesArray[columnNamesArray.length - 1]]; // //columnContentArray[columnContentArray.length - 1];
  if (value === undefined || value === null || value === '') {
    zippedArray.push(' ' + localizedEmpty + ' ');
  } else {
    zippedArray.push(value);
  }

  // array ==> string
  return zippedArray.join(' ').trim();
}

/**
 *
 * @param vqlContext
 * @param localizedAnd
 * @param localizedEmpty
 * @returns
 */
export function prepareConditionDescriptionUtterance(
  vqlContext: VQLcontext,
  localizedComparator: any
): string {
  const filterColumn = vqlContext.currentTable.filterColumn;
  const comparator: string | undefined = vqlContext.currentTable.comparator;
  const filterValue = vqlContext.currentTable.filterValue;

  let utterance = '';

  if (filterColumn === undefined || comparator === undefined || filterValue === undefined) {
    return utterance;
  }

  utterance = filterColumn + ' ' + localizedComparator[comparator] + ' ' + filterValue;
  return utterance.trim();
}
