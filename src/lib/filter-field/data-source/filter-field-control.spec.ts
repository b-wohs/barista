import { filterDistinctDefPredicate, generateDtFilterFieldDistinctId } from './filter-field-control';
import { autocompleteDef, optionDef, groupDef } from '../types';

// ROOT
// - AUT (distinct)
// - - OÖ (distinct)
// - - - Städte
// - - - - Linz
// - - - - Wels
// - - - - Steyr
// - - Wien

const cities = groupDef('Cities', [
  optionDef('Linz', 'Linz', null, null, null),
  optionDef('Wels', 'Wels', null, null, null),
  optionDef('Steyr', 'Steyr', null, null, null),
], {}, null, null);
let uA = autocompleteDef([cities], true, {}, null);
uA = optionDef('OÖ', {}, uA, null, null);

cities.group!.options.forEach((city) => {
  city.option!.parentGroup = cities;
  city.option!.parentAutocomplete = uA;
});

const wien = optionDef('Wien', 'Wien', null, null, null);
let aut = autocompleteDef([uA, wien], true, {}, null);
aut = optionDef('AUT', {}, aut, null, null);
wien.option!.parentAutocomplete = aut;
uA.option!.parentAutocomplete = aut;

const root = autocompleteDef([aut], false, {}, null);
aut.option!.parentAutocomplete = root;

aut.option!.distinctId = generateDtFilterFieldDistinctId(aut, '');
uA.option!.distinctId = generateDtFilterFieldDistinctId(uA, aut.option!.distinctId!);
cities.group!.options.forEach((city) => {
  city.option!.distinctId = generateDtFilterFieldDistinctId(city, uA.option!.distinctId!);
});
wien.option!.distinctId = generateDtFilterFieldDistinctId(wien, aut.option!.distinctId!);

describe('filterDistinctDefPredicate', () => {
  it('should return true for all levels when providing no distinct ids', () => {
    expect(filterDistinctDefPredicate(cities.group!.options[0], new Set())).toBe(true);
    expect(filterDistinctDefPredicate(cities, new Set())).toBe(true);
    expect(filterDistinctDefPredicate(uA, new Set())).toBe(true);
    expect(filterDistinctDefPredicate(wien, new Set())).toBe(true);
    expect(filterDistinctDefPredicate(aut, new Set())).toBe(true);
    expect(filterDistinctDefPredicate(root, new Set())).toBe(true);
  });

  it('should filter out leaf option (Linz) if its distinct id is listed in the set', () => {
    const distinctIds = new Set([cities.group!.options[0].option!.distinctId!]);
    expect(filterDistinctDefPredicate(cities.group!.options[0], distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(cities.group!.options[1], distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(cities, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(uA, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(wien, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(aut, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(root, distinctIds)).toBe(true);
  });

  it('should filter out parent option (OÖ) and group (cities) if all children are removed', () => {
    const distinctIds = new Set([
      cities.group!.options[0].option!.distinctId!,
      cities.group!.options[1].option!.distinctId!,
      cities.group!.options[2].option!.distinctId!,
    ]);
    expect(filterDistinctDefPredicate(cities.group!.options[0], distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(cities.group!.options[1], distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(cities.group!.options[2], distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(cities, distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(uA, distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(wien, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(aut, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(root, distinctIds)).toBe(true);
  });

  it('should NOT filter out parent options and groups if all children are removed and autocomplete distinct flag is false', () => {
    const distinctIds = new Set([
      cities.group!.options[0].option!.distinctId!,
      cities.group!.options[1].option!.distinctId!,
      cities.group!.options[2].option!.distinctId!,
    ]);
    uA.autocomplete!.distinct = false;
    expect(filterDistinctDefPredicate(cities.group!.options[0], distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(cities.group!.options[1], distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(cities.group!.options[2], distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(cities, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(uA, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(wien, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(aut, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(root, distinctIds)).toBe(true);
  });

  it('should filter out all parent options and groups if all children at all levels are remvoed', () => {
    const distinctIds = new Set([
      cities.group!.options[0].option!.distinctId!,
      cities.group!.options[1].option!.distinctId!,
      cities.group!.options[2].option!.distinctId!,
      wien.option!.distinctId!,
    ]);
    uA.autocomplete!.distinct = true;
    expect(filterDistinctDefPredicate(cities.group!.options[0], distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(cities.group!.options[1], distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(cities.group!.options[2], distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(cities, distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(uA, distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(wien, distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(aut, distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(root, distinctIds)).toBe(false);
  });

  it('should NOT filter out parent options and groups if only some children are removed', () => {
    const distinctIds = new Set([
      cities.group!.options[0].option!.distinctId!,
      cities.group!.options[1].option!.distinctId!,
      cities.group!.options[2].option!.distinctId!,
      wien.option!.distinctId!,
    ]);
    uA.autocomplete!.distinct = false;
    expect(filterDistinctDefPredicate(cities.group!.options[0], distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(cities.group!.options[1], distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(cities.group!.options[2], distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(cities, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(uA, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(wien, distinctIds)).toBe(false);
    expect(filterDistinctDefPredicate(aut, distinctIds)).toBe(true);
    expect(filterDistinctDefPredicate(root, distinctIds)).toBe(true);
  });
});