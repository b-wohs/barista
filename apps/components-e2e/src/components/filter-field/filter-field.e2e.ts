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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  clickOption,
  errorBox,
  input,
  clearAll,
  filterTags,
  focusFilterFieldInput,
  getFilterfieldTags,
} from './filter-field.po';
import { Selector } from 'testcafe';
import { waitForAngular } from '../../utils';

fixture('Filter Field')
  .page('http://localhost:4200/filter-field')
  .beforeEach(async () => waitForAngular());

test('should not show a error box if there is no validator provided', async () => {
  await clickOption(1)
    .typeText(input, 'abc')
    .expect(errorBox.exists)
    .notOk();
});

test('should show a error box if does not meet the validation function', async () => {
  await clickOption(3)
    .typeText(input, 'a')
    // Wait for the filter field to refresh the error message.
    .wait(250)
    .expect(errorBox.exists)
    .ok()
    .expect(errorBox.innerText)
    .match(/min 3 characters/gm);
});

// TODO: lukas.holzer investigate why this test is flaky on Browserstack
// tslint:disable-next-line: dt-no-focused-tests
test('should show is required error when the input is dirty', async () => {
  await clickOption(3)
    .typeText(input, 'a')
    .pressKey('backspace')
    .expect(errorBox.exists)
    .ok()
    .expect(errorBox.innerText)
    .match(/field is required/gm);
});

test('should hide the error box when the node was deleted', async () => {
  await clickOption(3)
    .pressKey('backspace')
    .pressKey('backspace')
    .expect(errorBox.exists)
    .notOk();
});

test('should remove all filters when clicking the clear-all button', async () => {
  // Create a new filter by clicking the outer- and inner-option
  await clickOption(4);
  await clickOption(1)
    // Click somewhere outside so the clear-all button appears
    .click(Selector('.outside'))
    .wait(300)
    .expect(clearAll.exists)
    .ok()
    // Click the clear all-button, the created filter should be removed
    .click(clearAll)
    .wait(300)
    .expect(filterTags.exists)
    .notOk();
});

test('should choose a freetext node with the keyboard and submit the correct value', async (testController: TestController) => {
  // Focus the filter field.
  await focusFilterFieldInput();

  // Select the test autocomplete
  await testController
    .pressKey('down down down down enter')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the free text node and start typing
    .pressKey('down down down enter')
    .typeText(input, 'Custom selection')
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250)
    // Confirm the text typed in
    .pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text optionsCustom selection');
});

test('should choose a freetext node with the keyboard and submit an empty value', async (testController: TestController) => {
  // Focus the filter field.
  await focusFilterFieldInput();

  // Select the test autocomplete
  await testController
    .pressKey('down down down down enter')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the free text node and start typing
    .pressKey('down down down enter')
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250)
    // Confirm the text typed in
    .pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text options');
});

test('should choose a freetext node with the keyboard and submit an empyty value immediately', async (testController: TestController) => {
  await focusFilterFieldInput();

  // Select the test autocomplete
  await testController
    .pressKey('down down down down enter')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the free text node and start typing
    .pressKey('down down down enter')
    // Focus the filter field
    .pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text options');
});

test('should choose a freetext node with the mouse and submit the correct value immediately', async (testController: TestController) => {
  // Select the test autocomplete
  await clickOption(5)
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250);

  // Select the free text node and start typing
  await clickOption(4)
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250)
    // Send the correct value into the input field
    .typeText(input, 'Custom selection');

  // Focus the filter field
  await focusFilterFieldInput();

  // Submit the value immediately
  await testController.pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text optionsCustom selection');
});

test('should choose a freetext node with the mouse and submit an empty value immediately', async (testController: TestController) => {
  // Select the test autocomplete
  await clickOption(5)
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250);

  // Select the free text node and start typing
  await clickOption(4)
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250);

  // Confirm the text typed in
  await focusFilterFieldInput();

  // Submit the empty value immediately
  await testController.pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text options');
});
