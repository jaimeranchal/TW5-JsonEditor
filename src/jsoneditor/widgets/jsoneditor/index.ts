import { widget as Widget } from '$:/core/modules/widgets/widget.js'; import { IChangedTiddlers } from 'tiddlywiki';
import * as JSONEditor from '@json-editor/json-editor';
import 'node_modules/spectre.css/dist/spectre.min.css';
import 'node_modules/spectre.css/dist/spectre-icons.css';
import './index.css';
import { initEditor } from '../utils/initEditor';

import { personSchema } from '../sampledata/schemas'; // only during testing

const errorTypes = {
  'widgetCall': 'Syntax error in widget call'
}
const messages = {
  'schemaErr': 'Schema cannot be empty',
  'saveModeErr': "SaveMode values can be 'json', 'tw5' or empty" 
}

class JsonEditorWidget extends Widget {
  /* Attributes */
  //---------------------------------------------------------------------------
  editor?: JSONEditor.JSONEditor<unknown>;
  containerElement?: HTMLDivElement;
  errorValidatorInfoElement ?: HTMLSpanElement;
  schema?: string;      // JSON schema as string
  saveOptions?: { 
    mode: string,
    outputTiddler: string,
    outputField: string
  }
  errorMessages?: { error: string, message: string}[];


  /* Methods */
  //---------------------------------------------------------------------------
  private setAttributes(): void {
    let schema = this.getAttribute('schema');
    let saveMode = this.getAttribute('saveMode') ?? 'json';
    let tiddler = this.getAttribute('tiddler');
    let field = this.getAttribute('field');
    let errors: typeof this.errorMessages = []

    // check for errors
    if (schema === undefined) {
      errors.push({ 
        'error': errorTypes.widgetCall, 
        'message': messages.schemaErr 
      });
    }

    switch (saveMode) {
      case 'json':
        let options = { 
          mode: saveMode,
          outputTiddler: tiddler ?? this.getVariable('currentTiddler'),
          outputField: field ?? 'json-data'
        }
        this.saveOptions = options;
        break;
      case 'tw5':
        break;
      default:
        errors.push({ 
          'error': errorTypes.widgetCall, 
          'message': messages.saveModeErr 
        });
        break;
    }

    if (errors.length > 0) this.errorMessages = errors;
  }
  private printErrors(container: Element): void {
    let errorContainer = document.createElement('div');
    this.errorMessages?.forEach(error => {
      let errorSpan = document.createElement('span');
      errorSpan.className = 'label label-warning';
      errorSpan.textContent = `${error.error}: ${error.message}`;
      errorContainer.appendChild(errorSpan);
    });

    container.appendChild(errorContainer);
    this.domNodes.push(container);
  }

  public refresh(_changedTiddlers: IChangedTiddlers): boolean {
    const changedAttributes = this.computeAttributes();
    // Check if required widget parameters have been changed
    if ($tw.utils.count(changedAttributes) > 0) {
      this.refreshSelf();
      return true;
    }
    // else do nothing
    return false;
  }

  public refreshSelf(): void {
    if (this.editor === undefined) return;
    // set values for fields being edited
  }

  public render(parent: Element, nextSibling: Element | null): void {

    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    this.setAttributes();

    if (this.errorMessages !== undefined) {
      this.printErrors(parent);
      return
    }

    if (this.editor === undefined) {
      // create container elements
      const containerElement = $tw.utils.domMaker('p', { class: 'jsedit' });
      const editorElement = document.createElement('div');
      const errorValidatorInfoElement = document.createElement('span');

      // save them as widget properties
      this.containerElement = containerElement;
      this.errorValidatorInfoElement = errorValidatorInfoElement;

      // Add nodes to the container
      containerElement.appendChild(editorElement);
      containerElement.appendChild(errorValidatorInfoElement);

      parent.insertBefore(containerElement, nextSibling);
      this.domNodes.push(containerElement);

      // Get json-editor attributes and check for errors in widget call
      // Init json-editor
      this.editor = initEditor(JSON.parse(personSchema), editorElement, {})
    }
  }
}

declare let exports: Record<string, typeof JsonEditorWidget>;
exports['json-editor'] = JsonEditorWidget;
