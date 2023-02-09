import { JexlOutputPlugin } from 'jovo-v4-community-plugin-jexl-output';
import { Jovo } from '@jovotech/framework';

test('test 01', () => {
  const jovo = { $output: [{ message: '${1+1}', reprompt: '${2+2}' }] };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('2');
  expect(jovo.$output[0].reprompt).toBe('4');
});

test('test 02', () => {
  const jovo = { $output: [{ message: ' ${1+1} ', reprompt: ' ${2+2} ' }] };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe(' 2 ');
  expect(jovo.$output[0].reprompt).toBe(' 4 ');
});

test('test 03', () => {
  const jovo = {
    $output: [{ message: ' ${1+1} ${3+3} ', reprompt: ' ${2+2} ${4+4} ' }]
  };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe(' 2 6 ');
  expect(jovo.$output[0].reprompt).toBe(' 4 8 ');
});

test('test 03', () => {
  const jovo = {
    $output: [{ message: ' ${1+1} ${3+3} ', reprompt: ' ${2+2} ${4+4} ' }]
  };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe(' 2 6 ');
  expect(jovo.$output[0].reprompt).toBe(' 4 8 ');
});

test('test 04', () => {
  const jovo = {
    $output: [{ message: ' ${1+1} ${3+3} ', reprompt: ' ${2+2} ${4+4} ' }]
  };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe(' 2 6 ');
  expect(jovo.$output[0].reprompt).toBe(' 4 8 ');
});

test('test 05', () => {
  const jovo = {
    $output: [{ message: '${Math.min(1,3)}', reprompt: '${Math.max(1,3)}' }]
  };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('1');
  expect(jovo.$output[0].reprompt).toBe('3');
});

test('test 06', () => {
  const jovo = {
    $output: [
      {
        message: "${Voca.reverse('racecar')}",
        reprompt: "${Voca.reverse('backwards')}"
      }
    ]
  };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('racecar');
  expect(jovo.$output[0].reprompt).toBe('sdrawkcab');
});

test('test 07', () => {
  const jovo = {
    $output: [
      { message: '${1+1}', reprompt: '${2+2}' },
      { message: '${3+3}', reprompt: '${4+4}' }
    ]
  };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('2');
  expect(jovo.$output[0].reprompt).toBe('4');
  expect(jovo.$output[1].message).toBe('6');
  expect(jovo.$output[1].reprompt).toBe('8');
});

test('test 08', () => {
  const jovo = { $output: [{ message: '${1+1}' }, { message: '${3+3}' }] };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('2');
  expect(jovo.$output[1].message).toBe('6');
});

test('test 09', () => {
  const jovo = { $output: [{ reprompt: '${2+2}' }, { reprompt: '${4+4}' }] };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].reprompt).toBe('4');
  expect(jovo.$output[1].reprompt).toBe('8');
});

test('test 10', () => {
  const jovo = {
    $output: [
      { message: '${1+1}' },
      { message: '${2+2}' },
      { message: '${3+3}' },
      {
        message: {
          speech: '${4+4}',
          text: '${5+5}'
        }
      },
      {
        message: {
          speech: '${6+6}',
          text: '${7+7}'
        }
      }
    ]
  };

  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);

  expect(jovo.$output[0].message).toBe('2');
  expect(jovo.$output[1].message).toBe('4');
  expect(jovo.$output[2].message).toBe('6');
  expect(jovo.$output[3].message).toStrictEqual({
    speech: '8',
    text: '10'
  });
  expect(jovo.$output[4].message).toStrictEqual({
    speech: '12',
    text: '14'
  });
});

test('test 11', () => {
  const jovo = {
    $output: [
      { message: '${1+1}' },
      { message: '${2+2}' },
      { message: '${3+3}' },
      {
        message: {
          speech: '${4+4}'
        }
      },
      {
        message: {
          text: '${7+7}'
        }
      }
    ]
  };

  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);

  expect(jovo.$output[0].message).toBe('2');
  expect(jovo.$output[1].message).toBe('4');
  expect(jovo.$output[2].message).toBe('6');
  expect(jovo.$output[3].message).toStrictEqual({
    speech: '8'
  });
  expect(jovo.$output[4].message).toStrictEqual({
    text: '14'
  });
});

test('test empty string', () => {
  const jovo = { $output: [{ reprompt: '' }, { reprompt: '' }] };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].reprompt).toBe('');
  expect(jovo.$output[1].reprompt).toBe('');
});

test('test whitespace', () => {
  const jovo = { $output: [{ reprompt: ' ' }, { reprompt: ' ' }] };
  new JexlOutputPlugin().processJexlExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].reprompt).toBe(' ');
  expect(jovo.$output[1].reprompt).toBe(' ');
});
