import { Direction } from '@trainlink-org/trainlink-types';
import { Loco } from '../src';

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
});
