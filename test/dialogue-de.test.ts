import { TestSuite } from '@jovotech/framework';

/*
|--------------------------------------------------------------------------
| UNIT TESTING
|--------------------------------------------------------------------------
|
| Run `npm test` to execute this test.
| Learn more here: www.jovo.tech/docs/unit-testing
|
*/

const testSuiteDE = new TestSuite({ locale: 'de' });

test('welcome message de', async () => {
  const { output } = await testSuiteDE.run({
    type: 'LAUNCH'
  });
  expect(output[0].message).toEqual(
    expect.objectContaining({ speech: expect.stringMatching('Willkommen') })
  );
  expect(output[0].listen).toEqual(true);
  expect(output[0].reprompt).toContain('Metadaten');
});

test('help intent message de', async () => {
  const { output } = await testSuiteDE.run([
    {
      type: 'LAUNCH'
    },
    {
      intent: 'HelpIntent'
    }
  ]);
  expect(output[0].message).toEqual(
    expect.objectContaining({ speech: expect.stringMatching('Metadaten') })
  );
  expect(output[0].message).toEqual(
    expect.objectContaining({ text: expect.stringMatching('Metadaten') })
  );
});

test('previous intent message de', async () => {
  const { output } = await testSuiteDE.run([
    {
      type: 'LAUNCH'
    },
    {
      intent: 'PreviousRowIntent'
    }
  ]);
  expect(output[0].message).toContain('Wähle erst eine Tabelle aus.');
});

test('SwitchToTableIntent with missing tableName de', async () => {
  const { output } = await testSuiteDE.run([
    {
      type: 'LAUNCH'
    },
    {
      intent: 'SwitchToTableIntent'
    }
  ]);
  expect(output[0].message).toContain('verstanden');
});

test('SwitchToTableIntent which does not exist de', async () => {
  const { output } = await testSuiteDE.run([
    {
      type: 'LAUNCH'
    },
    {
      intent: 'SwitchToTableIntent',
      entities: {
        tableName: {
          value: 'dieserTabellennameExistiertNicht'
        }
      }
    }
  ]);
  expect(output[0].message).toContain('verstanden');
});

test.skip('SwitchToTableIntent griechisch de', async () => {
  const { output } = await testSuiteDE.run([
    {
      type: 'LAUNCH'
    },
    {
      intent: 'SwitchToTableIntent',
      entities: {
        tableName: {
          value: 'griechisch'
        }
      }
    }
  ]);
  console.log({ output });

  expect(output[0].message).toContain('verstanden');
});
