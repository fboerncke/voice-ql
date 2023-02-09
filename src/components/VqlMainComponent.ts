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
import { VqlAskTableNameComponent } from './VqlAskTableNameComponent';
import { VqlAskColumnNameComponent } from './VqlAskColumnNameComponent';

@Component()
export class VqlMainComponent extends MagicPrototyperBaseComponent {
  START() {
    // initialize component
    this.$session.data['SqliteDbFileName'] = './voiceql.sqlite';
    this.$session.data['TableNameList'] = ['vornamen', 'empty', 'griechisch'];

    return this.$send({
      message: {
        speech: this.$t('VQL_MAIN_COMPONENT_STARTSPEECH'),
        text: this.$t('VQL_MAIN_COMPONENT_STARTTEXT')
      },
      reprompt: this.$t('VQL_MAIN_COMPONENT_STARTREPROMPT'),
      listen: true,
      quickReplies: this.$t('VQL_MAIN_COMPONENT_STARTQUICKREPLIES') as unknown as QuickReplyValue[]
    });
  }

  /**
   * Implementation of WelcomeIntent handler
   */
  @Intents(['WelcomeIntent'])
  async welcomeIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_WELCOME_INTENT_QUICKREPLIES')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_WELCOME_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_WELCOME_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_WELCOME_INTENT_REPROMPT'),
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
   * Implementation of NameOfAllTablesIntent handler
   */
  @Intents(['NameOfAllTablesIntent'])
  async nameOfAllTablesIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_TABLES_INTENT_QUICKREPLIES')
      );

      this.$session.data.vqlContext = await VQL.getTableNames(this);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_TABLES_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_TABLES_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_TABLES_INTENT_REPROMPT'),
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
   * Implementation of SwitchToTableIntent handler
   */
  @Intents(['SwitchToTableIntent'])
  async switchToTableIntent(): Promise<any> {
    try {
      const tableName = this.$entities.tableName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_QUICKREPLIES')
      );

      if (!(tableName !== undefined && this.$t('TableNameList').indexOf(tableName) > -1)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.metadataReportIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      // there may be another intent implementation with the same name in another component
      this.$session.data.vqlContext = await VQL.setCurrentTable(this, tableName);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_REPROMPT'),
        listen: true,
        quickReplies
      });
    } catch (e) {
      const error = e as Error;
      console.error('Unexpected error: ' + error.message);
      console.error({ error });
      if (error === undefined) {
        return this.sayMessage({
          message: this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_ERRORSPEECH_1')
        });
      }
      if (error.message === 'INVALID_TABLE_NAME') {
        return this.sayMessage({
          message: this.$t('VQL_MAIN_COMPONENT_SWITCH_TO_TABLE_INTENT_ERRORSPEECH_2')
        });
      }
      // Default error handler

      return this.sayMessage({ message: this.$t('ERROR_HANDLER_MESSAGE') + ': ' + error.message });
    }
  }

  /**
   * Implementation of AskCurrentTableNameIntent handler
   */
  @Intents(['AskCurrentTableNameIntent'])
  async askCurrentTableNameIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
              )
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.askCurrentTableNameIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_ASK_CURRENT_TABLE_NAME_INTENT_REPROMPT'),
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
   * Implementation of MetadataReportIntent handler
   */
  @Intents(['MetadataReportIntent'])
  async metadataReportIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.metadataReportIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      this.$session.data.vqlContext = await VQL.getMetadata(this);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_METADATA_REPORT_INTENT_REPROMPT'),
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
   * Implementation of CurrentStatusReportIntent handler
   */
  @Intents(['CurrentStatusReportIntent'])
  async currentStatusReportIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
              )
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.currentStatusReportIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      this.$session.data.vqlContext = await VQL.getMetadata(this);
      this.$request.conditionUtterance = VQL.prepareConditionDescriptionUtterance(
        this.$session.data.vqlContext,
        this.$t('LOCALIZED_COMPARATOR')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_CURRENT_STATUS_REPORT_INTENT_REPROMPT'),
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
   * Implementation of HowManyColumnsIntent handler
   */
  @Intents(['HowManyColumnsIntent'])
  async howManyColumnsIntent(): Promise<any> {
    try {
      const tableName = this.$entities.tableName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_QUICKREPLIES')
      );

      if (!(VQL.hasTable(this) || tableName !== undefined)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.howManyColumnsIntent
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
          speech: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_COLUMNS_INTENT_REPROMPT'),
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
   * Implementation of HowManyRowsWithConditionIntent handler
   */
  @Intents(['HowManyRowsWithConditionIntent'])
  async howManyRowsWithConditionIntent(): Promise<any> {
    try {
      const tableName = this.$entities.tableName?.resolved;
      const filterColumnName = this.$entities.filterColumnName?.resolved;
      const rowSynonym = this.$entities.rowSynonym?.resolved;
      const comparator = this.$entities.comparator?.resolved;
      const integerNumber = this.$entities.integerNumber?.resolved;
      const someString = this.$entities.someString?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t(
            'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_1'
          ) !== 'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
              )
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.howManyRowsWithConditionIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(VQL.hasTable(this) || tableName !== undefined)) {
        if (
          this.$t(
            'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_2'
          ) !== 'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDQUICKREPLIES_2'
              )
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.howManyRowsWithConditionIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (
        !(
          filterColumnName == undefined ||
          this.$session.data.vqlContext.currentTable.columnNames.includes(filterColumnName)
        )
      ) {
        if (
          this.$t(
            'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_3'
          ) !== 'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_ASSERTIONFAILEDQUICKREPLIES_3'
              )
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      //this.$request.filterColumn =  this.$entities?.filterColumnName?.resolved;
      //this.$session.data.vqlContext.currentTable.filterColumn = filterColumnName;
      //this.$session.data.vqlContext.currentTable.comparator = comparator;
      //const fallbackComparator = this.$entities.comparator_0?.resolved;
      //if(this.$session.data.vqlContext.currentTable.comparator===undefined) {this.$session.data.vqlContext.currentTable.comparator=fallbackComparator }
      if (filterColumnName != undefined) {
        this.$session.data.vqlContext.currentTable.filterColumn = filterColumnName;
      }
      if (comparator != undefined) {
        this.$session.data.vqlContext.currentTable.comparator = comparator;
      }
      if (integerNumber !== undefined) {
        this.$session.data.vqlContext.currentTable.filterValue = integerNumber;
      }
      if (someString !== undefined) {
        this.$session.data.vqlContext.currentTable.filterValue = someString;
      }
      this.$request.conditionUtterance = VQL.prepareConditionDescriptionUtterance(
        this.$session.data.vqlContext,
        this.$t('LOCALIZED_COMPARATOR')
      );
      this.$session.data.vqlContext.currentTable.rowNumber = 1;
      this.$session.data.vqlContext = await VQL.buildAndPerformQueryFromContext(
        this.$session.data.vqlContext,
        'SELECT COUNT (*) AS NUM_OF_ROWS ',
        true
      );
      this.$request.conditionUtterance = VQL.prepareConditionDescriptionUtterance(
        this.$session.data.vqlContext,
        this.$t('LOCALIZED_COMPARATOR')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_HOW_MANY_ROWS_WITH_CONDITION_INTENT_REPROMPT'),
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
   * Implementation of NameOfAllColumnsIntent handler
   */
  @Intents(['NameOfAllColumnsIntent'])
  async nameOfAllColumnsIntent(): Promise<any> {
    try {
      const tableName = this.$entities.tableName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_QUICKREPLIES')
      );

      if (!(VQL.hasTable(this) || tableName !== undefined)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
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
          speech: this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_NAME_OF_ALL_COLUMNS_INTENT_REPROMPT'),
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
   * Implementation of NameOfSpecificColumnIntent handler
   */
  @Intents(['NameOfSpecificColumnIntent'])
  async nameOfSpecificColumnIntent(): Promise<any> {
    try {
      const integerNumber = this.$entities.integerNumber?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
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
      if (
        !(
          integerNumber !== undefined &&
          Number(integerNumber) > 0 &&
          Number(integerNumber) <= this.$session.data.vqlContext.currentTable.columnNames.length
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_2'
              )
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$session.data.vqlContext = await VQL.getNthColumnName(this, integerNumber);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_NAME_OF_SPECIFIC_COLUMN_INTENT_REPROMPT'),
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
   * Implementation of ReadCurrentRowIntent handler
   */
  @Intents(['ReadCurrentRowIntent'])
  async readCurrentRowIntent(): Promise<any> {
    try {
      const rowSynonym = this.$entities.rowSynonym?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.readCurrentRowIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$session.data.vqlContext = await VQL.getCurrentRowFromTable(this);
      this.$request.rowContentDescription = VQL.prepareRowContentDescriptionUtterance(
        this.$session.data.vqlContext,
        this.$t('LOCALIZED_AND'),
        this.$t('LOCALIZED_EMPTY')
      );
      this.$request.rowNumber = this.$session.data.vqlContext.currentTable.rowNumber;

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_ROW_INTENT_REPROMPT'),
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
   * Implementation of FirstRowIntent handler
   */
  @Intents(['FirstRowIntent'])
  async firstRowIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.firstRowIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_FIRST_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$session.data.vqlContext.currentTable.rowNumber = 1;
      this.$session.data.vqlContext = await VQL.getCurrentRowFromTable(this);
      return this.readCurrentRowIntent();

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
   * Implementation of NextRowIntent handler
   */
  @Intents(['NextRowIntent'])
  async nextRowIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.firstRowIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          this.$session.data.vqlContext.currentTable.rowNumber <
          this.$session.data.vqlContext.currentTable.numOfRows
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            text: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_NEXT_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_3')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$session.data.vqlContext.currentTable.rowNumber =
        this.$session.data.vqlContext.currentTable.rowNumber + 1;
      this.$session.data.vqlContext = await VQL.getCurrentRowFromTable(this);
      return this.readCurrentRowIntent();

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
   * Implementation of PreviousRowIntent handler
   */
  @Intents(['PreviousRowIntent'])
  async previousRowIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.firstRowIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.rowNumber > 1)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            text: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_PREVIOUS_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_3')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$session.data.vqlContext.currentTable.rowNumber =
        this.$session.data.vqlContext.currentTable.rowNumber - 1;
      this.$session.data.vqlContext = await VQL.getCurrentRowFromTable(this);
      return this.readCurrentRowIntent();

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
   * Implementation of LastRowIntent handler
   */
  @Intents(['LastRowIntent'])
  async lastRowIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.lastRowIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_LAST_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$session.data.vqlContext.currentTable.rowNumber =
        this.$session.data.vqlContext.currentTable.numOfRows;
      this.$session.data.vqlContext = await VQL.getCurrentRowFromTable(this);
      return this.readCurrentRowIntent();

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
   * Implementation of GotoRowIntent handler
   */
  @Intents(['GotoRowIntent'])
  async gotoRowIntent(): Promise<any> {
    try {
      const integerNumber = this.$entities.integerNumber?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.firstRowIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          integerNumber !== undefined &&
          Number(integerNumber) > 0 &&
          Number(integerNumber) <= this.$session.data.vqlContext.currentTable.numOfRows
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            text: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDSPEECH_3'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_GOTO_ROW_INTENT_ASSERTIONFAILEDQUICKREPLIES_3')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$session.data.vqlContext.currentTable.rowNumber = integerNumber;
      this.$session.data.vqlContext = await VQL.getCurrentRowFromTable(this);
      return this.readCurrentRowIntent();

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
   * Implementation of SortByColumnIntent handler
   */
  @Intents(['SortByColumnIntent'])
  async sortByColumnIntent(): Promise<any> {
    try {
      const columnName = this.$entities.columnName?.resolved;
      const sortOrder = this.$entities.sortOrder?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
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
      if (
        !(
          columnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(columnName)
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SORT_BY_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$delegate(VqlAskColumnNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.sortByColumnIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (columnName != undefined) {
        this.$session.data.vqlContext.currentTable.sortColumn = columnName;
      }
      this.$session.data.vqlContext.currentTable.sortOrder =
        sortOrder !== undefined && (sortOrder === 'asc' || sortOrder === 'desc')
          ? sortOrder
          : 'asc';
      return this.readCurrentRowIntent();

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
   * Implementation of SortOrderIntent handler
   */
  @Intents(['SortOrderIntent'])
  async sortOrderIntent(): Promise<any> {
    try {
      const sortOrder = this.$entities.sortOrder?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_SORT_ORDER_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SORT_ORDER_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_SORT_ORDER_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SORT_ORDER_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_SORT_ORDER_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SORT_ORDER_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SORT_ORDER_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
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
      this.$session.data.vqlContext.currentTable.sortOrder =
        sortOrder !== undefined && (sortOrder === 'asc' || sortOrder === 'desc')
          ? sortOrder
          : 'asc';
      return this.readCurrentRowIntent();

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
   * Implementation of BiggestValueInColumnIntent handler
   */
  @Intents(['BiggestValueInColumnIntent'])
  async biggestValueInColumnIntent(): Promise<any> {
    try {
      const columnName = this.$entities.columnName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
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
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_2'
              )
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          columnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(columnName)
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_3'
              )
            )
          });
        }
        return this.$delegate(VqlAskColumnNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.biggestValueInColumnIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (columnName != undefined) {
        this.$session.data.vqlContext.currentTable.columnName = columnName;
      }
      this.$session.data.vqlContext = await VQL.getMaxValueFromColumn(this);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_BIGGEST_VALUE_IN_COLUMN_INTENT_REPROMPT'),
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
   * Implementation of SmallestValueInColumnIntent handler
   */
  @Intents(['SmallestValueInColumnIntent'])
  async smallestValueInColumnIntent(): Promise<any> {
    try {
      const columnName = this.$entities.columnName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
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
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_2'
              )
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          columnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(columnName)
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_3'
              )
            )
          });
        }
        return this.$delegate(VqlAskColumnNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.smallestValueInColumnIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (columnName != undefined) {
        this.$session.data.vqlContext.currentTable.columnName = columnName;
      }
      this.$session.data.vqlContext = await VQL.getMinValueFromColumn(this);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_SMALLEST_VALUE_IN_COLUMN_INTENT_REPROMPT'),
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
   * Implementation of AverageValueInColumnIntent handler
   */
  @Intents(['AverageValueInColumnIntent'])
  async averageValueInColumnIntent(): Promise<any> {
    try {
      const columnName = this.$entities.columnName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
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
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_2'
              )
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          columnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(columnName)
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_3'
              )
            )
          });
        }
        return this.$delegate(VqlAskColumnNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.averageValueInColumnIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (columnName != undefined) {
        this.$session.data.vqlContext.currentTable.columnName = columnName;
      }
      this.$session.data.vqlContext = await VQL.getAvgValueFromColumn(this);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_AVERAGE_VALUE_IN_COLUMN_INTENT_REPROMPT'),
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
   * Implementation of SumOfValueInColumnIntent handler
   */
  @Intents(['SumOfValueInColumnIntent'])
  async sumOfValueInColumnIntent(): Promise<any> {
    try {
      const columnName = this.$entities.columnName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
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
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_2'
              )
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          columnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(columnName)
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_3'
              )
            )
          });
        }
        return this.$delegate(VqlAskColumnNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.sumOfValueInColumnIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (columnName != undefined) {
        this.$session.data.vqlContext.currentTable.columnName = columnName;
      }
      this.$session.data.vqlContext = await VQL.getSumValueFromColumn(this);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_SUM_OF_VALUE_IN_COLUMN_INTENT_REPROMPT'),
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
   * Implementation of NumberOfDistinctValuesInColumnIntent handler
   */
  @Intents(['NumberOfDistinctValuesInColumnIntent'])
  async numberOfDistinctValuesInColumnIntent(): Promise<any> {
    try {
      const columnName = this.$entities.columnName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t(
            'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
          ) !==
          'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_1'
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
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t(
            'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
          ) !==
          'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_2'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_2'
              )
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          columnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(columnName)
        )
      ) {
        if (
          this.$t(
            'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
          ) !==
          'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            text: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDSPEECH_3'
            ),
            quickReplies: this.processQuickReplies(
              this.$t(
                'VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_ASSERTIONFAILEDQUICKREPLIES_3'
              )
            )
          });
        }
        return this.$delegate(VqlAskColumnNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.numberOfDistinctValuesInColumnIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (columnName != undefined) {
        this.$session.data.vqlContext.currentTable.columnName = columnName;
      }
      this.$session.data.vqlContext = await VQL.getNumberOfDistinctValuesInColumn(this);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_NUMBER_OF_DISTINCT_VALUES_IN_COLUMN_INTENT_REPROMPT'),
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
   * Implementation of SelectStatementIntent handler
   */
  @Intents(['SelectStatementIntent'])
  async selectStatementIntent(): Promise<any> {
    try {
      const selectSynonym = this.$entities.selectSynonym?.resolved;
      const rowSynonym = this.$entities.rowSynonym?.resolved;
      const projectionColumnName = this.$entities.projectionColumnName?.resolved;
      const tableName = this.$entities.tableName?.resolved;
      const filterColumnName = this.$entities.filterColumnName?.resolved;
      const comparator = this.$entities.comparator?.resolved;
      const integerNumber = this.$entities.integerNumber?.resolved;
      const someString = this.$entities.someString?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.metadataReportIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          VQL.hasTable(this) ||
          (projectionColumnName !== undefined &&
            this.$session.data.vqlContext.currentTable.columnNames.includes(projectionColumnName))
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_3'),
            text: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_3'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_3'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDQUICKREPLIES_3')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          filterColumnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(filterColumnName)
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_4') !==
          'VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_4'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_4'),
            text: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_4'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDSPEECH_4'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SELECT_STATEMENT_INTENT_ASSERTIONFAILEDQUICKREPLIES_4')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      // select vorname von tabelle vornamen where anzahl groesser als zwei
      this.$request.filterColumn = this.$entities?.filterColumnName?.resolved;
      if (tableName !== undefined) {
        await VQL.setCurrentTable(this, tableName);
      }
      this.$session.data.vqlContext.currentTable.projectionColumnNames =
        projectionColumnName === undefined ? undefined : [projectionColumnName];
      this.$session.data.vqlContext.currentTable.filterColumn = filterColumnName;
      this.$session.data.vqlContext.currentTable.comparator = comparator;
      const fallbackComparator = this.$entities.comparator_0?.resolved;
      if (this.$session.data.vqlContext.currentTable.comparator === undefined) {
        this.$session.data.vqlContext.currentTable.comparator = fallbackComparator;
      }
      if (integerNumber !== undefined) {
        this.$session.data.vqlContext.currentTable.filterValue = integerNumber;
      }
      if (someString !== undefined) {
        this.$session.data.vqlContext.currentTable.filterValue = someString;
      }
      this.$session.data.vqlContext.currentTable.rowNumber = 1;
      return this.readCurrentRowIntent();

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
   * Implementation of SetProjectionIntent handler
   */
  @Intents(['SetProjectionIntent'])
  async setProjectionIntent(): Promise<any> {
    try {
      const selectSynonym = this.$entities.selectSynonym?.resolved;
      const projectionColumnName = this.$entities.projectionColumnName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.setProjectionIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (!(this.$session.data.vqlContext.currentTable.numOfRows > 0)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      if (
        !(
          VQL.hasTable(this) ||
          (projectionColumnName !== undefined &&
            this.$session.data.vqlContext.currentTable.columnNames.includes(projectionColumnName))
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_3') !==
          'VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_3'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_3'),
            text: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_3'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_3'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SET_PROJECTION_INTENT_ASSERTIONFAILEDQUICKREPLIES_3')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$session.data.vqlContext.currentTable.projectionColumnNames =
        projectionColumnName === undefined ? undefined : [projectionColumnName];
      this.$session.data.vqlContext.currentTable.rowNumber = 1;
      return this.readCurrentRowIntent();

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
   * Implementation of ResetProjectionIntent handler
   */
  @Intents(['ResetProjectionIntent'])
  async resetProjectionIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_RESET_PROJECTION_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_RESET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_RESET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_RESET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_RESET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_RESET_PROJECTION_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_RESET_PROJECTION_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.resetProjectionIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      this.$session.data.vqlContext.currentTable.projectionColumnNames = undefined;
      return this.readCurrentRowIntent();

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
   * Implementation of SetFilterIntent handler
   */
  @Intents(['SetFilterIntent'])
  async setFilterIntent(): Promise<any> {
    try {
      const filterColumnName = this.$entities.filterColumnName?.resolved;
      const rowSynonym = this.$entities.rowSynonym?.resolved;
      const comparator = this.$entities.comparator?.resolved;
      const integerNumber = this.$entities.integerNumber?.resolved;
      const someString = this.$entities.someString?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1'),
            text: this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.setFilterIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      if (
        !(
          filterColumnName !== undefined &&
          this.$session.data.vqlContext.currentTable.columnNames.includes(filterColumnName)
        )
      ) {
        if (
          this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_2') !==
          'VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_2'
        ) {
          this.$send({
            message: this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_2'),
            text: this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_2'),
            reprompt: this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDSPEECH_2'),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_SET_FILTER_INTENT_ASSERTIONFAILEDQUICKREPLIES_2')
            )
          });
        }
        return this.$send({
          speech: this.$t("' + i18nKey + '")
        });
      }
      this.$request.filterColumn = this.$entities?.filterColumnName?.resolved;
      //this.$session.data.vqlContext.currentTable.projectionColumnNames = projectionColumnName === undefined ? undefined : [projectionColumnName];
      this.$session.data.vqlContext.currentTable.filterColumn = filterColumnName;
      this.$session.data.vqlContext.currentTable.comparator = comparator;
      const fallbackComparator = this.$entities.comparator_0?.resolved;
      if (this.$session.data.vqlContext.currentTable.comparator === undefined) {
        this.$session.data.vqlContext.currentTable.comparator = fallbackComparator;
      }
      if (integerNumber !== undefined) {
        this.$session.data.vqlContext.currentTable.filterValue = integerNumber;
      }
      if (someString !== undefined) {
        this.$session.data.vqlContext.currentTable.filterValue = someString;
      }
      this.$session.data.vqlContext.currentTable.rowNumber = 1;
      return this.readCurrentRowIntent();

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
   * Implementation of ReadCurrentFilterIntent handler
   */
  @Intents(['ReadCurrentFilterIntent'])
  async readCurrentFilterIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_QUICKREPLIES')
      );

      if (!VQL.hasTable(this)) {
        if (
          this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1') !==
          'VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1'
        ) {
          this.$send({
            message: this.$t(
              'VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            text: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1'),
            reprompt: this.$t(
              'VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_ASSERTIONFAILEDSPEECH_1'
            ),
            quickReplies: this.processQuickReplies(
              this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_ASSERTIONFAILEDQUICKREPLIES_1')
            )
          });
        }
        return this.$delegate(VqlAskTableNameComponent, {
          resolve: {
            ['error']: this.helpIntent,
            ['continue']: this.readCurrentFilterIntent
          },
          config: {
            duty: 'comeBack'
          }
        });
      }
      this.$request.conditionUtterance = VQL.prepareConditionDescriptionUtterance(
        this.$session.data.vqlContext,
        this.$t('LOCALIZED_COMPARATOR')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_READ_CURRENT_FILTER_INTENT_REPROMPT'),
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
   * Implementation of ResetFilterIntent handler
   */
  @Intents(['ResetFilterIntent'])
  async resetFilterIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_RESET_FILTER_INTENT_QUICKREPLIES')
      );

      this.$session.data.vqlContext.currentTable.filterColumn = undefined;
      this.$session.data.vqlContext.currentTable.comparator = undefined;
      this.$session.data.vqlContext.currentTable.filterValue = undefined;
      this.$session.data.vqlContext.currentTable.rowNumber = 1;
      return this.readCurrentRowIntent();

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
   * Implementation of DropDeleteUpdateIntent handler
   */
  @Intents(['DropDeleteUpdateIntent'])
  async dropDeleteUpdateIntent(): Promise<any> {
    try {
      const tableName = this.$entities.tableName?.resolved;
      const columnName = this.$entities.columnName?.resolved;

      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_DROP_DELETE_UPDATE_INTENT_QUICKREPLIES')
      );

      //console.log(columnNumber);
      // console.log(quickReplies);

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_DROP_DELETE_UPDATE_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_DROP_DELETE_UPDATE_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_DROP_DELETE_UPDATE_INTENT_REPROMPT'),
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
   * Implementation of ThanksIntent handler
   */
  @Intents(['ThanksIntent'])
  async thanksIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_THANKS_INTENT_QUICKREPLIES')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_THANKS_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_THANKS_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_THANKS_INTENT_REPROMPT'),
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
   * Implementation of BadWordIntent handler
   */
  @Intents(['BadWordIntent'])
  async badWordIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_BAD_WORD_INTENT_QUICKREPLIES')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_BAD_WORD_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_BAD_WORD_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_BAD_WORD_INTENT_REPROMPT'),
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
   * Implementation of StopIntent handler
   */
  @Intents(['StopIntent'])
  async stopIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_STOP_INTENT_QUICKREPLIES')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_STOP_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_STOP_INTENT_TEXT')
        },

        listen: false,
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
   * Implementation of CancelIntent handler
   */
  @Intents(['CancelIntent'])
  async cancelIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_CANCEL_INTENT_QUICKREPLIES')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_CANCEL_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_CANCEL_INTENT_TEXT')
        },

        listen: false,
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
        this.$t('VQL_MAIN_COMPONENT_HELP_INTENT_QUICKREPLIES')
      );

      if (this.$component.config?.duty === 'comeBack') {
        return this.$resolve('continue');
      }

      return this.$send({
        message: {
          speech: this.$t('VQL_MAIN_COMPONENT_HELP_INTENT_SPEECH'),
          text: this.$t('VQL_MAIN_COMPONENT_HELP_INTENT_TEXT')
        },
        reprompt: this.$t('VQL_MAIN_COMPONENT_HELP_INTENT_REPROMPT'),
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
   * Implementation of StartOverIntent handler
   */
  @Intents(['StartOverIntent'])
  async startOverIntent(): Promise<any> {
    try {
      const quickReplies = this.processQuickReplies(
        this.$t('VQL_MAIN_COMPONENT_START_OVER_INTENT_QUICKREPLIES')
      );

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
