import { widget as Widget } from '$:/core/modules/widgets/widget.js'; 
import { IChangedTiddlers } from 'tiddlywiki';
import * as JSONEditor from '@json-editor/json-editor';
import 'node_modules/spectre.css/dist/spectre.min.css';
import 'node_modules/spectre.css/dist/spectre-icons.css';
import './index.css';
import { initEditor } from '../utils/initEditor';
import { ErrorMessage, Validator } from '../utils/validator';
import { personSchema } from '../sampledata/schemas'; // only during testing

class JsonEditorWidget extends Widget {
  /* Attributes */
  //---------------------------------------------------------------------------
  editor?: JSONEditor.JSONEditor<unknown>;
  containerElement?: HTMLDivElement;
  errorValidatorInfoElement ?: HTMLSpanElement;
  schema?: string;      // JSON schema as string
  saveOptions?: { 
    mode: string,
    outputTiddler: string | undefined,
    outputField: string | undefined
  }
  validator: Validator = new Validator();


  /* Methods */
  //---------------------------------------------------------------------------
  private setAttributes(): void {
    let saveMode = this.getAttribute('saveMode') ?? 'json';

    // check for errors
    if (this.validator.checkSchema(this.getAttribute('schema'))) {
      this.schema = this.getAttribute('schema');
    }

    if (this.validator.checkMode(this.getAttribute('saveMode'))) {
      let mode = this.getAttribute('saveMode') ?? 'json';
      this.saveOptions = { mode: mode, outputTiddler: "", outputField: "" }; 
    }
    
    switch (this.saveOptions?.mode) {
      case 'json':
        let tiddler = this.getAttribute('tiddler');
        let field = this.getAttribute('field');
        this.saveOptions.outputTiddler = this.validator.checkTiddler(tiddler) === true ?
                                         tiddler :
                                         this.getVariable('currentTiddler');
        break;
      case 'tw5':
        break;
      default:
        break;
    }
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

    this.validator.printMessages(parent, this.domNodes);

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
