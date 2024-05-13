import { widget as Widget } from '$:/core/modules/widgets/widget.js'; import { IChangedTiddlers } from 'tiddlywiki';
import * as JSONEditor from '@json-editor/json-editor';
import type { JSONSchema4 } from 'json-schema';
import 'node_modules/spectre.css/dist/spectre.min.css';
import './index.css';

class JsonEditorWidget extends Widget {
  editor?: JSONEditor.JSONEditor<unknown>;
  containerElement?: HTMLDivElement;
  errorValidatorInfoElement ?: HTMLSpanElement;
  currenTiddlerTitle?: string;

  private initEditor(schema: JSONSchema4, container: HTMLDivElement, startval: Record<string, any>): JSONEditor.JSONEditor<unknown> | undefined {
    return new JSONEditor.JSONEditor(container, {
      schema: {},
      theme: 'spectre',
      iconlib: 'spectre',
      disable_edit_json: true,
      form_name_root: 'SuperTag',
      startval: startval,
      no_additional_properties: true,
      use_default_values: true,
    })
  }

  public refresh(_changedTiddlers: IChangedTiddlers) {
    return false;
  }

  public render(parent: Element, nextSibling: Element | null): void {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    this.currenTiddlerTitle = this.getAttribute('tiddler') ?? this.getVariable('currentTiddler');

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

      // Get json-editor attributes
      // Init json-editor
      this.editor = this.initEditor({}, editorElement, {})
    }
  }
}

declare let exports: {
  RandomNumber: typeof JsonEditorWidget;
};
exports.RandomNumber = JsonEditorWidget;
