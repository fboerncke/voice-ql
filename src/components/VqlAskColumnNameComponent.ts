/**
 * The contents of this file is generated code. You should therefore
 * not make any changes. They will be lost after the next build process.
 * Use the underlying MagicPrototyper model file if you intend to make any changes.
 **/

import { Component, Intents, QuickReplyValue } from '@jovotech/framework';
import { MagicPrototyperBaseComponent } from 'jovo-v4-community-hook-magic-prototyper';

// this comes from MagicPrototyperMpdel.json file;
import * as VQL from '../backend/VQLprocessor';
// end of configured import;
import { VqlMainComponent } from './VqlMainComponent';
import { VqlAskTableNameComponent } from './VqlAskTableNameComponent';

@Component()
export class VqlAskColumnNameComponent extends MagicPrototyperBaseComponent {
  START() {
    // initialize component
    this.$session.data['SqliteDbFileName'] = './voiceql.sqlite';
    this.$session.data['TableNameList'] = ['vornamen', 'empty', 'griechisch'];

    return this.$send({
      message: {
        speech: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_STARTSPEECH'),
        text: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_STARTTEXT')
      },
      reprompt: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_STARTREPROMPT'),
      listen: true,
      quickReplies: this.$t(
        'VQL_ASK_COLUMN_NAME_COMPONENT_STARTQUICKREPLIES'
      ) as unknown as QuickReplyValue[]
    });
  }

  /**
   * Implementation of ChooseValidColumnNameIntent handler
   */
  @Intents(['ChooseValidColumnNameIntent'])
  async chooseValidColumnNameIntent(): Promise<any> {
    try {
      const columnName = this.$entities.columnName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_CHOOSE_VALID_COLUMN_NAME_INTENT_QUICKREPLIES')
      );

      if (
        !(
          columnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(columnName)
        )
      ) {
        if (
          this.$t(
            'VQL_ASK_COLUMN_NAME_COMPONENT_CHOOSE_VALID_COLUMN_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
          ) !==
          'VQL_ASK_COLUMN_NAME_COMPONENT_CHOOSE_VALID_COLUMN_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_ASK_COLUMN_NAME_COMPONENT_CHOOSE_VALID_COLUMN_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_ASK_COLUMN_NAME_COMPONENT_CHOOSE_VALID_COLUMN_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_ASK_COLUMN_NAME_COMPONENT_CHOOSE_VALID_COLUMN_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_ASK_COLUMN_NAME_COMPONENT_CHOOSE_VALID_COLUMN_NAME_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
              )
            )
          });
        }
        return this.$delegate(VqlAskColumnNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.chooseValidColumnNameIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (columnName != undefined) {
        this.$session.data.vqlContext.currentTable.sortColumn = columnName;
      }

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }
    } catch (e) {
      const error = e as Error;
      console.error('Unexpected error: ' + error.message);
      console.error({ error });

      // Default error handler

      return this.sayMessage({ message: this.$t('ERROR_HANDLER_MESSAGE') + ': ' + error.message });
    }
  }

  /**
   * Implementation of NameOfAllColumnsIntent handler
   */
  @Intents(['NameOfAllColumnsIntent'])
  async nameOfAllColumnsIntent(): Promise<any> {
    try {
      const tableName = this.$entities.tableName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_QUICKREPLIES')
      );

      if (!(VQL.hasTable(this) || tableName !== undefined)) {
        if (
          this.$t(
            'VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
          ) !== 'VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
              )
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.nameOfAllColumnsIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (tableName !== undefined) {
        this.$session.data.vqlContext = await VQL.setCurrentTable(this, tableName);
      }
      this.$session.data.vqlContext = await VQL.getColumnNames(this);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_SPEECH'),
          text: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_REPROMPT'),
        listen: true,
        quickReplies
      });
    } catch (e) {
      const error = e as Error;
      console.error('Unexpected error: ' + error.message);
      console.error({ error });

      // Default error handler

      return this.sayMessage({ message: this.$t('ERROR_HANDLER_MESSAGE') + ': ' + error.message });
    }
  }

  /**
   * Implementation of HelpIntent handler
   */
  @Intents(['HelpIntent'])
  async helpIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_HELP_INTENT_QUICKREPLIES')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_HELP_INTENT_SPEECH'),
          text: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_HELP_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_ASK_COLUMN_NAME_COMPONENT_HELP_INTENT_REPROMPT'),
        listen: true,
        quickReplies
      });
    } catch (e) {
      const error = e as Error;
      console.error('Unexpected error: ' + error.message);
      console.error({ error });

      // Default error handler

      return this.sayMessage({ message: this.$t('ERROR_HANDLER_MESSAGE') + ': ' + error.message });
    }
  }

  // footer content
  UNHANDLED() {
    return this.$send({
      message: {
        speech: this.$t('UNHANDLED_ERROR_HANDLER_MESSAGE') + '',
        text: this.$t('UNHANDLED_ERROR_HANDLER_MESSAGE') + ''
      },
      reprompt: this.$t('UNHANDLED_ERROR_HANDLER_MESSAGE') + '',
      listen: true,
      quickReplies: this.processQuickReplies(this.$t('UNHANDLED_ERROR_HANDLER_QUICK_REPLIES'))
    });
  }
}
