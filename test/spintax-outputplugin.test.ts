import { Jovo } from '@jovotech/framework';
import { SpintaxOutputPlugin } from 'jovo-v4-community-plugin-spintax-output';

test('test 01', () => {
  const jovo = { $output: [{ message: 'alpha', reprompt: 'beta' }] };
  new SpintaxOutputPlugin().processSpintaxExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('alpha');
  expect(jovo.$output[0].reprompt).toBe('beta');
});

test('test 02', () => {
  const jovo = {
    $output: [
      { message: 'alpha', reprompt: 'beta' },
      { message: 'gamma', reprompt: '[delta|delta]' }
    ]
  };
  new SpintaxOutputPlugin().processSpintaxExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('alpha');
  expect(jovo.$output[0].reprompt).toBe('beta');
  expect(jovo.$output[1].message).toBe('gamma');
  expect(jovo.$output[1].reprompt).toBe('delta');
});

test('test 03', () => {
  const jovo = {
    $output: [{ message: 'alpha' }, { message: 'beta' }, { message: 'gamma' }]
  };

  new SpintaxOutputPlugin().processSpintaxExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('alpha');
  expect(jovo.$output[1].message).toBe('beta');
  expect(jovo.$output[2].message).toBe('gamma');
});

test('test 04', () => {
  const jovo = {
    $output: [{ message: 'alpha' }, { message: '[beta|beta]' }, { message: '[gamma]' }]
  };

  new SpintaxOutputPlugin().processSpintaxExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('alpha');
  expect(jovo.$output[1].message).toBe('beta');
  expect(jovo.$output[2].message).toBe('gamma');
});

test('test 05', () => {
  const jovo = {
    $output: [
      { message: 'alpha' },
      { message: '[beta|beta]' },
      { message: '[gamma]' },
      {
        message: {
          speech: 'alpha',
          text: 'beta'
        }
      },
      {
        message: {
          speech: '[gamma|gamma]',
          text: '[delta]'
        }
      }
    ]
  };

  new SpintaxOutputPlugin().processSpintaxExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toBe('alpha');
  expect(jovo.$output[1].message).toBe('beta');
  expect(jovo.$output[2].message).toBe('gamma');

  expect(jovo.$output[3].message).toStrictEqual({
    speech: 'alpha',
    text: 'beta'
  });
  expect(jovo.$output[4].message).toStrictEqual({
    speech: 'gamma',
    text: 'delta'
  });
});

test('test 06', () => {
  const jovo = {
    $output: [
      {
        message: {
          speech: 'alpha'
        }
      },
      { message: 'alpha' },
      { message: '[beta|beta]' },
      { message: '[gamma]' },
      {
        message: {
          text: '[delta]'
        }
      }
    ]
  };

  new SpintaxOutputPlugin().processSpintaxExpressionsInOutput(jovo as Jovo);
  expect(jovo.$output[0].message).toStrictEqual({
    speech: 'alpha'
  });
  expect(jovo.$output[1].message).toBe('alpha');
  expect(jovo.$output[2].message).toBe('beta');
  expect(jovo.$output[3].message).toBe('gamma');
  expect(jovo.$output[4].message).toStrictEqual({
    text: 'delta'
  });
});
