/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import StackBlitzSDK from '@stackblitz/sdk';

const indexHtml = '<my-app>loading</my-app>';

const mainTs = `import './polyfills';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './demo/app.module';

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;

  // Otherwise, log the boot error
}).catch(err => console.error(err));`;

const polyfills = "import 'zone.js/dist/zone';";

const demoAppModuleTs = `
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
`;
const demoAppComponent = `
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent  {}
`;

const demoAppTemplate = `
`;

@Injectable()
export class BaStackblitzService {
  /**
   * Opens a live example in stackblitz.
   * The live example provides the names and sources that
   * should be used in stackblitz.
   */
  openInStackblitz(
    name: string,
    classSource: string,
    templateSource: string,
    // stylesSource: string,
  ): void {
    console.log(name);
    StackBlitzSDK.openProject(
      {
        title: `Barista demo: ${name}`,
        description: 'Barista demo',
        template: 'angular-cli',
        dependencies: {
          '@dynatrace/barista': '5.0.0',
          '@dynatrace/barista-icons': 'latest',
          '@dynatrace/barista-fonts': 'latest',
        },
        files: {
          'index.html': indexHtml,
          'main.ts': mainTs,
          'polyfills.ts': polyfills,
          'demo/app.module.ts': demoAppModuleTs,
          'demo/app.component.ts': classSource.replace(
            '...',
            "selector: 'dt-barista-demo'",
          ),
          'demo/app.component.html': templateSource,
        },
      },
      {},
    );
  }
}
