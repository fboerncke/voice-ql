import * as VQLprocessor from '../src/backend/VQLprocessor';
import { Jovo } from '@jovotech/framework/dist/types/Jovo';
import { VQLcontext } from '../src/backend/VoiceQlTypes';

test('VQL processor getMetadata', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'experiment'
          }
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getMetadata(jovoContext as unknown as Jovo);
  // console.log(JSON.stringify(vqlContext));
  expect(vqlContext.latestQueryResult).toEqual({
    nameOfColumns: ['frequency', 'alter'],
    numOfColumns: 2,
    numOfRows: 0
  });
});

test('VQL processor getMetadata non existing table name', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'thisIsAnonExistingTableName'
          },
          latestSqlStatements: []
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getMetadata(jovoContext as unknown as Jovo);
  //console.log(JSON.stringify(vqlContext));
  expect(vqlContext.latestQueryResult).toEqual({
    nameOfColumns: [],
    numOfColumns: 0,
    numOfRows: 0
  });
});

test('VQL processor getMetadata non existing table entry in config', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {},
          latestSqlStatements: []
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getMetadata(jovoContext as unknown as Jovo);
  // console.log(JSON.stringify(vqlContext));
  expect(vqlContext.latestQueryResult).toEqual({
    nameOfColumns: [],
    numOfColumns: 0,
    numOfRows: 0
  });
});

test('VQL processor getTableNames', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite'
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getTableNames(jovoContext as unknown as Jovo);
  // console.log(JSON.stringify(vqlContext));
  expect(vqlContext.latestQueryResult).toEqual(['vornamen', 'experiment']);
});

test('VQL processor getCurrentRowFromTable', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'vornamen',
            columnNames: undefined,

            // cache simple filter restriction
            filterColumn: undefined,
            comparator: 'like',
            filterValue: '%',

            // cache order rule
            sortColumn: undefined,
            sortOrder: 'asc',

            // for 'cursor' (requires ordering)
            rowNumber: 1,
            columnNumber: 1
          }
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getCurrentRowFromTable(
    jovoContext as unknown as Jovo
  );
  expect(vqlContext.latestQueryResult).toEqual([
    '1',
    'marie',
    '122',
    'w',
    '',
    '2012',
    'charlottenburg-wilmersdorf'
  ]);
  expect(vqlContext.latestSqlStatements).toEqual([
    'SELECT COUNT (*) AS NUM_OF_ROWS FROM ("vornamen") ',
    'SELECT *  FROM ("vornamen")  LIMIT 0,1'
  ]);
});

test('VQL processor getCurrentRowFromTable order by', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'vornamen',
            columnNames: undefined,

            // cache simple filter restriction
            filterColumn: undefined,
            comparator: 'like',
            filterValue: '%',

            // cache order rule
            sortColumn: 'anzahl',
            sortOrder: 'desc',

            // for 'cursor' (requires ordering)
            rowNumber: 1,
            columnNumber: 1
          }
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getCurrentRowFromTable(
    jovoContext as unknown as Jovo
  );
  expect(vqlContext.latestQueryResult).toEqual([
    '95302',
    'marie',
    '128',
    'w',
    '',
    '2015',
    'pankow'
  ]);
  expect(vqlContext.latestSqlStatements).toEqual([
    'SELECT COUNT (*) AS NUM_OF_ROWS FROM ("vornamen")  ORDER BY anzahl desc',
    'SELECT *  FROM ("vornamen")  ORDER BY anzahl desc LIMIT 0,1'
  ]);
});

test('VQL processor getCurrentRowFromTable where clause', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'vornamen',
            columnNames: undefined,

            // cache simple filter restriction
            filterColumn: 'anzahl',
            comparator: 'less',
            filterValue: 4,

            // cache order rule
            sortColumn: 'anzahl',
            sortOrder: 'desc',

            // for 'cursor' (requires ordering)
            rowNumber: 1,
            columnNumber: 1
          }
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getCurrentRowFromTable(
    jovoContext as unknown as Jovo
  );
  expect(vqlContext.latestQueryResult).toEqual([
    '308707',
    'oliver',
    '3',
    'm',
    '3',
    '2021',
    'treptow-koepenick'
  ]);
  expect(vqlContext.latestSqlStatements).toEqual([
    'SELECT COUNT (*) AS NUM_OF_ROWS FROM ("vornamen")  WHERE anzahl < 4 ORDER BY anzahl desc',
    'SELECT *  FROM ("vornamen")  WHERE anzahl < 4 ORDER BY anzahl desc LIMIT 0,1'
  ]);
});

test('VQL processor SELECT vorname  FROM (vornamen)  WHERE vorname like "%Maria%" order by anzahl asc', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'vornamen',
            columnNames: undefined,

            // cache simple filter restriction
            filterColumn: 'vorname',
            comparator: 'like',
            filterValue: 'Maria',

            // cache order rule
            sortColumn: 'anzahl',
            sortOrder: 'asc',

            // for 'cursor' (requires ordering)
            rowNumber: 1,
            columnNumber: 1
          }
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getCurrentRowFromTable(
    jovoContext as unknown as Jovo
  );
  expect(vqlContext.latestQueryResult).toEqual([
    '1230',
    'antonia-maria',
    '1',
    'w',
    '',
    '2012',
    'charlottenburg-wilmersdorf'
  ]);
});

test('VQL processor SELECT COUNT(vorname)  FROM (vornamen)  WHERE vorname like "%Maria%" order by anzahl asc', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'vornamen',
            columnNames: undefined,

            // cache simple filter restriction
            filterColumn: 'vorname',
            comparator: 'like',
            filterValue: 'Maria',

            // cache order rule
            sortColumn: 'anzahl',
            sortOrder: 'asc',

            // for 'cursor' (requires ordering)
            rowNumber: 1,
            columnNumber: 1
          }
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.getNumRows(jovoContext as unknown as Jovo);
  expect(vqlContext.latestQueryResult).toEqual(['1071']);
});

test('VQL processor set existing table', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'experiment',
            columnNames: undefined,

            // cache simple filter restriction
            filterColumn: undefined,
            comparator: undefined,
            filterValue: undefined,

            // cache order rule
            sortColumn: undefined,
            sortOrder: 'asc',

            // for 'cursor' (requires ordering)
            rowNumber: 1,
            columnNumber: 1
          },
          // TODO latestNlRequest: '',
          latestSqlStatements: [] as string[],
          latestQueryResult: {},
          // TODO latestNlResponse: ''
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.setCurrentTable(
    jovoContext as unknown as Jovo,
    'vornamen'
  );

  expect(vqlContext.latestQueryResult).toEqual([
    'id',
    'vorname',
    'anzahl',
    'geschlecht',
    'position',
    'jahr',
    'bezirk'
  ]);
});

test('VQL processor set non existing table', async () => {
  const jovoContext = {
    $session: {
      data: {
        vqlContext: {
          dbName: './test/testcase-data.sqlite',
          currentTable: {
            name: 'experiment',
            columnNames: undefined,

            // cache simple filter restriction
            filterColumn: undefined,
            comparator: undefined,
            filterValue: undefined,

            // cache order rule
            sortColumn: undefined,
            sortOrder: 'asc',

            // for 'cursor' (requires ordering)
            rowNumber: 1,
            columnNumber: 1
          },
          // TODO latestNlRequest: '',
          latestSqlStatements: [] as string[],
          latestQueryResult: {},
          // TODO latestNlResponse: ''
        }
      }
    }
  };
  const vqlContext: VQLcontext = await VQLprocessor.setCurrentTable(
    jovoContext as unknown as Jovo,
    'nonExistingTableName'
  );

  expect(vqlContext.latestQueryResult).toEqual({});
});
