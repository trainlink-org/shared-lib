import { Loco } from '../src';

describe('Test Loco', () => {
    test('Create Loco', () => {
        const loco = new Loco('Test', 3);
        expect(loco.name).toBe('Test');
    });
});
