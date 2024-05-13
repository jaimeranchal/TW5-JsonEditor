 import * as JSONEditor from '@json-editor/json-editor';
//  import type { ITiddlerFields } from 'tiddlywiki';
import type { JSONSchema4 } from 'json-schema';

export function initEditor(schema: JSONSchema4,
                           container: HTMLDivElement, 
                           startval: Record<string, any>)
                           : JSONEditor.JSONEditor<unknown> | undefined {
  if (!$tw.browser) return;

  // json-editor module is imported asynchronously
  import('@json-editor/json-editor').then(JSONEditor =>{
    return new JSONEditor.JSONEditor(container, {
      schema: schema,
      theme: 'spectre',
      iconlib: 'spectre',
      disable_edit_json: true,
      form_name_root: 'JSON Editor',
      // startval: startval,
      object_layout: 'grid',
      no_additional_properties: true,
      use_default_values: true,
    })
  })
}
