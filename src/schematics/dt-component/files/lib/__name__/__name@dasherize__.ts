import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-<%=dasherize(name)%>',
  templateUrl: '<%=dasherize(name)%>.html',
  styleUrls: ['<%=dasherize(name)%>.scss'],
  host: {
    class: 'dt-<%=dasherize(name)%>',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class Dt<%= classify(name) %> {

}