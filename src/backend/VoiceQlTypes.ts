/**
 * This object is kept in session scope to allow flexible dialogues.
 */
export type VQLcontext = {
  dbName: string;
  //tableNames: string[] | undefined; // list of table names in this db
  currentTable: {
    name: string | undefined; // current table name
    columnNames: string[]; // list of column names of current table
    numOfRows: number; // number of rows according to filter (defined below)
    projectionColumnNames: string[]; // list of column names that are read/shown

    // cache simple filter restriction
    filterColumn: string | undefined; // name of column for filter
    comparator: 'less' | 'equal' | 'greater' | 'like' | undefined; // comparator used in filter
    filterValue: string | number | undefined; // compare value for filter

    columnName: string | undefined;

    // order rule
    sortColumn: string | undefined; // SORT BY {sortColumn}
    sortOrder: 'asc' | 'desc'; // ascending / descending

    // for 'cursor' (requires ordering)
    rowNumber: number; //
    columnNumber: number;
  };
  // TODO latestNlRequest: string;
  latestSqlStatements: string[];
  latestQueryResult: string | string[] | flatMap;
  // TODO latestNlResponse: string;
};

export type flatMap = { [key: string]: string | string[] | number };
