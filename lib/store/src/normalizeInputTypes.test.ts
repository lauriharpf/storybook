import { normalizeInputType, normalizeInputTypes } from './normalizeInputTypes';

describe('normalizeInputType', () => {
  it('does nothing to strict types', () => {
    expect(
      normalizeInputType(
        {
          name: 'name',
          type: { name: 'string' },
          control: { type: 'string' },
          description: 'description',
          defaultValue: 'defaultValue',
        },
        'arg'
      )
    ).toEqual({
      name: 'name',
      type: { name: 'string' },
      control: { type: 'string' },
      description: 'description',
      defaultValue: 'defaultValue',
    });
  });

  it('fills in unstrict types', () => {
    expect(
      normalizeInputType(
        {
          type: 'string',
          control: 'string',
          description: 'description',
          defaultValue: 'defaultValue',
        },
        'arg'
      )
    ).toEqual({
      name: 'arg',
      type: { name: 'string' },
      control: { type: 'string' },
      description: 'description',
      defaultValue: 'defaultValue',
    });
  });
});

describe('normalizeInputTypes', () => {
  it('maps over keys', () => {
    expect(
      normalizeInputTypes({
        a: { type: 'string' },
        b: { type: 'number' },
      })
    ).toEqual({
      a: { name: 'a', type: { name: 'string' } },
      b: { name: 'b', type: { name: 'number' } },
    });
  });
});
