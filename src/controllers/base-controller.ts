//import EventEmitter from 'eventemitter3';
import ObservableStore, { IObservableStore } from './observable-store';

/**
 * Controller class that provides configuration, state management, and events
 */
export abstract class BaseController {
    /**
     * The persistable store
     */
    private readonly _store: IObservableStore<any>;

    /**
     * The UI's volatile calculated store
     */
    private readonly _UIStore: IObservableStore<any>;

    /**
     * It returns the controller's UI's volatile calculated store
     * (Used only by certain controllers)
     */
    public get UIStore(): IObservableStore<any> {
        return this._UIStore;
    }

    /**
     * It returns the controller's store
     */
    public get store(): IObservableStore<any> {
        return this._store;
    }

    /**
     * Creates a BaseController instance.
     *
     * @param state - Initial state to set on this controller
     */
    constructor(state?: any, memState?: any) {
       // super();
        this._store = new ObservableStore(state);
        this._UIStore = new ObservableStore(memState || ({} as unknown as any));
    }
}
