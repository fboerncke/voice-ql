const { DebuggerConfig } = require('@jovotech/plugin-debugger');

const debuggerConfig = new DebuggerConfig({
  locales: ['de', 'en'],
  buttons: [
    {
      label: 'LAUNCH',
      input: {
        type: 'LAUNCH'
      }
    },
    {
      label: 'Help',
      input: {
        intent: 'HelpIntent'
      }
    },
    {
      label: 'Stop',
      input: {
        intent: 'StopIntent'
      }
    }
  ]
});

module.exports = debuggerConfig;
