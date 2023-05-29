import { Direction } from '@trainlink-org/trainlink-types';
import { Loco, LocoStoreBase } from '../src';

describe('Test creating Loco', () => {
    test('Create Loco with parameters', () => {
        const loco = new Loco('Test', 5);
        expect(loco.name).toBe('Test');
        expect(loco.address).toBe(5);
    });
    test('Create Loco with no parameters', () => {
        const loco = new Loco();
        expect(loco.name).toBe('');
        expect(loco.address).toBe(3);
    });
    test('Create Loco with invalid address', () => {
        const loco = new Loco('', -1);
        expect(loco.name).toBe('');
        expect(loco.address).toBe(3);
    });
});

describe('Test Loco functionality', () => {
    const loco = new Loco('Test', 5);
    test('Set and get speed', () => {
        expect(loco.speed).toBe(0);
        loco.speed = 100;
        expect(loco.speed).toBe(100);
        loco.speed = 200;
        expect(loco.speed).toBe(100);
    });
    test('Set and get direction', () => {
        expect(loco.direction).toBe(Direction.forward);
        loco.direction = Direction.stopped;
        expect(loco.direction).toBe(Direction.stopped);
    });
    test('Set and get functions', () => {
        expect(loco.getFunction(0)).toBe(false);
        loco.setFunction(0, true);
        expect(loco.getFunction(0)).toBe(true);
        expect(loco.getFunction(29)).toBe(false);
    });
    test('Test toString() method', () => {
        loco.speed = 10;
        loco.direction = Direction.forward;
        expect(loco.toString()).toBe('Test 5 - 10 Forward');
    });
    test('Test fromJson', () => {
        const json = JSON.stringify(loco);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Loco.fromJson(JSON.parse(json))).toEqual(loco);
    });
});

class LocoStore extends LocoStoreBase {}

describe('Test LocoStoreBase', () => {
    const store = new LocoStore();
    test('Add a new loco and fetch it', async () => {
        const loco = new Loco('Test', 23);
        store.add(loco);
        await expect(store.getLoco('Test')).resolves.toEqual(loco);
        await expect(store.getLoco(23)).resolves.toEqual(loco);
        expect(store.getAllLocos()).toContain(loco);
    });
    test('Fetch a non-existant Loco', async () => {
        await expect(store.getLoco(1)).rejects.toMatch('not found');
        await expect(store.getLoco('Name')).rejects.toMatch('not found');
    });
    test('Delete a loco from the store', () => {
        expect(store.deleteLoco(1)).toBe(false);
        const loco = new Loco('', 24);
        store.add(loco);
        expect(store.deleteLoco(24)).toBe(true);
    });
    test('Update a loco', async () => {
        const loco = new Loco('', 25);
        store.add(loco);
        store.updateLoco(25);
        await expect(store.getLoco(25)).resolves.toEqual(loco);
        store.updateLoco(25, 'UpdateTest', 26);
        await expect(store.getLoco(26)).resolves.toBeDefined();
        const updatedLoco = await store.getLoco(26);
        expect(updatedLoco.name).toBe('UpdateTest');
    });
    test('Test toString method', () => {
        const newStore = new LocoStore();
        const loco = new Loco('Test', 42);
        newStore.add(loco);
        expect(newStore.toString()).toMatch('Test 42 - 0 Forward');
    });
});
