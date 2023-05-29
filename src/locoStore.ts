import { Direction, type LocoIdentifier } from '@trainlink-org/trainlink-types';

/**
 * A class to represent one locomotive
 */
export class Loco {
    readonly name: string;
    readonly address: number;
    protected _speed = 0;
    protected _direction = Direction.forward;
    private functions: boolean[] = [];

    constructor(name?: string, address?: number) {
        name ??= '';
        address ??= 3;
        this.name = name;
        // Validate input
        if (address >= 0 && address <= 10293) {
            this.address = address;
        } else {
            this.address = 3; //Default value if given value out of range
        }
        for (let i = 0; i <= 28; i++) {
            this.functions[i] = false;
        }
    }

    set speed(newSpeed: number) {
        //Check speed is valid
        if (newSpeed >= 0 && newSpeed <= 126) {
            this._speed = newSpeed;
        }
    }

    get speed() {
        return this._speed;
    }

    set direction(newDirection: Direction) {
        this._direction = newDirection;
    }

    get direction() {
        return this._direction;
    }

    setFunction(functionNum: number, state: boolean) {
        if (functionNum >= 0 && functionNum <= 28) {
            this.functions[functionNum] = state;
        }
    }

    getFunction(functionNum: number) {
        if (functionNum >= 0 && functionNum <= 28) {
            return this.functions[functionNum];
        }
        return false;
    }

    toString() {
        return `${this.name} ${this.address} - ${this.speed} ${this.direction}`;
    }

    static fromJson(d: Record<string, unknown>): Loco {
        return Object.assign(new Loco(), d);
    }
}

/**
 * The base class for a LocoStore
 */
export abstract class LocoStoreBase {
    protected objectStore: Map<number, Loco>; //Stores the actual loco objects
    protected nameStore: Map<string, number>; //For getting the address from the name

    /**
     * Creates a new empty LocoStore
     */
    constructor() {
        this.objectStore = new Map();
        this.nameStore = new Map();
    }

    /**
     *  Adds a {@link Loco} to the LocoStore
     * 	@param loco The {@link Loco} to add to the LocoStore
     */
    add(loco: Loco): void {
        this.objectStore.set(loco.address, loco);
        this.nameStore.set(loco.name, loco.address);
    }

    getLoco(identifier: string | number): Promise<Loco> {
        return new Promise<Loco>((resolve, reject) => {
            const loco = this.getLocoFromIdentifier(identifier);
            if (loco) {
                resolve(loco);
            } else {
                reject('Loco not found in store');
            }
        });
    }

    getAllLocos(): IterableIterator<Loco> {
        return this.objectStore.values();
    }

    /**
     * Deletes a {@link Loco} from the store
     * @param identifier The identifier of the {@link Loco} to delete
     * @returns true if successful, false if not
     */
    deleteLoco(identifier: string | number): boolean {
        const loco = this.getLocoFromIdentifier(identifier);
        if (loco !== undefined) {
            return (
                this.nameStore.delete(loco.name) &&
                this.objectStore.delete(loco.address)
            );
        }
        return false;
    }

    /**
     * Updates a {@link Loco} in the store
     * @param identifier The identifier of the {@link Loco} to update
     * @param name The new name for the Loco
     * @param address The new address for the Loco
     */
    updateLoco(identifier: LocoIdentifier, name?: string, address?: number) {
        const loco = this.getLocoFromIdentifier(identifier);
        if (loco) {
            name ??= loco.name;
            address ??= loco.address;

            const newLoco = new Loco(name, address);
            newLoco.speed = loco.speed;
            newLoco.direction = loco.direction;

            this.objectStore.delete(loco.address);
            this.nameStore.delete(loco.name);

            this.objectStore.set(newLoco.address, newLoco);
            this.nameStore.set(newLoco.name, newLoco.address);
        }
    }

    toString() {
        let string = '\nContents of LocoStore\n--------------------\n';
        this.objectStore.forEach((loco, key) => {
            string += `${key} => ${loco.name} ${loco.address} - ${loco.speed} ${loco.direction}\n`;
        });
        return string;
    }

    /**
     * Used to get a loco given either the name or address
     * @param identifier Identifier of {@link Loco} to find
     * @returns \{@link Loco} if found, undefined if not.
     */
    protected getLocoFromIdentifier(
        identifier: LocoIdentifier
    ): Loco | undefined {
        let locoId: number;
        if (typeof identifier === 'string') {
            const locoIdUndef = this.nameStore.get(identifier);
            if (locoIdUndef !== undefined) {
                locoId = locoIdUndef;
            } else {
                return undefined;
            }
        } else {
            locoId = identifier;
        }
        return this.objectStore.get(locoId);
    }
}

/**
 * The base type for a client side locoStore, used to allow completely different transport methods to be used.
 */
export interface LocoStoreClient {
    onLoaded(callback: () => void): void;
    listener(
        throttle: Throttle,
        throttleID: number,
        callback: () => void
    ): void;
}

/**
 * Describes a throttle, used by the client side locoStore
 */
export interface Throttle {
    locoAddress: number;
    name: string;
    speed: number;
    direction: Direction;
    sliderDisabled: boolean;
    disabled: boolean;
}
