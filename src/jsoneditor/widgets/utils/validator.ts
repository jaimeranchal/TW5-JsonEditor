export interface ErrorMessage { type:string, area: string, text: string}; 

const types: Record<string,string> = {
  'info': 'Information',
  'warn': 'Warning',
  'error': 'Error'
};

const areas: Record<string,string> = {
  'widgetCall': 'Syntax error in widget call'
};

const texts: Record<string,string> = {
  'schema001': 'Schema cannot be empty',
  'mode001': "SaveMode values can be 'json', 'tw5' or empty" 
};

export class Validator {
  messages: ErrorMessage[] = [];

  addMessage(type:string, area:string, text:string) {
    this.messages.push({
      'type': types[type],
      'area': areas[area],
      'text': texts[text]
    })
  }

  checkSchema(schema?:string): boolean {
    if (schema === undefined) {
      this.addMessage('error', 'widgetCall', 'schema001');
      return false;
    }
    return true;
  }
  checkMode(mode?:string): boolean {
    if (mode !== 'json' || 'tw5' || undefined) {
      this.addMessage('error', 'widgetCall', 'mode001');
      return false;
    }
    return true;
  }

  checkTiddler(title:string): boolean {
    if (title === undefined) {
    }
    /* Check if tiddler exists */
    $tw.wiki.getTiddler(title)
    return true;
  }

  printMessages(container: Element, domNodes: Element[] ): void {
    // Do nothing if there are no errors
    if (this.messages === undefined || this.messages.length == 0) return;

    let errorContainer = document.createElement('div');
    this.messages.forEach(message => {
        let errorSpan = document.createElement('span');
        errorSpan.className = 'label label-warning';
        errorSpan.textContent = `${message.type}: [${message.area}] ${message.text}`;
        errorContainer.appendChild(errorSpan);
    });

    container.appendChild(errorContainer);
    domNodes.push(container);
  }
}