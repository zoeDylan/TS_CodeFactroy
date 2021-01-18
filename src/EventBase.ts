/** 事件缓存类型 */
export enum E_EventCacheType {
    /** 仅添加到队列 */
    Push,
    /** 添加到队列，被清理自动发送 */
    Push_And_Send,
    /** 仅覆盖之前 */
    Cover,
    /** 覆盖之前，被清理自动发送 */
    Cover_And_Send
}

/** 事件缓存项 */
class EventCacheItem {
    /** 事件名称 */
    name: any
    /** 缓存类型 */
    cacheType: E_EventCacheType
    /** 事件数据 */
    data: any[]
}


/** 事件项 */
class EventItem {
    /** id记录 */
    static EventItemId = 0
    constructor() {
        EventItem.EventItemId += 1;
        this._id = `EventItem_${EventItem.EventItemId}`
    }
    /** 事件id */
    private _id: string
    /** 事件id */
    get id(): string { return this._id }
    /** 事件名称 */
    name: any
    /** 事件回调 */
    callback: Function
    /** 作用域 */
    caller: any
    /** 是否只执行一次 */
    isOnce: boolean
    /** 是否进行回执检查 */
    isOnTick: boolean
}

/** 事件基类 */
export class EventBase<T_EventType = string> {

    /** 输出debug信息 */
    public debugLog(...str: any[]) { console.error(`【${this.name}】`, ...str); }

    /** 事件名称 */
    public name: string = "EventBase"

    /** 事件列表 */
    private _eventList: EventItem[] = [];

    /**
     * 监听事件
     * @param name 事件名称
     * @param callback 回调函数
     * @param caller 调用者/作用域
     * @param once 是否只执行一次
     * @param onTick 是否进行回执检查
     */
    public on(name: T_EventType, callback: Function, caller = null, once = false, onTick = false) {
        const item = new EventItem();
        item.name = name;
        item.callback = callback;
        item.caller = caller;
        item.isOnce = once;
        item.isOnTick = onTick;

        // 内存泄漏检测
        if (this._eventList.filter(item => item.name === name && item.callback === callback && item.caller === caller).length > 0) {
            this.debugLog('二次注册事件：', name, callback, caller, once);
        }
        // 添加缓存
        this._eventList.push(item);
    }

    /**
     * 监听回执检查
     * @param name 事件名称
     * @param callback 回调寒霜
     * @param caller 调用者
     * @description 当返回true，会自动取消监听事件。
     */
    public onTick(name: T_EventType, callback: Function, caller = null) { this.on(name, callback, caller, false, true) }

    /** 
     * 监听事件,只执行一次
     * @param name 事件名称
     * @param callback 回调函数
     * @param caller 调用者/作用域
     */
    public once(name: T_EventType, callback: Function, caller = null) { this.on(name, callback, caller, true); }

    /**
     * 关闭事件监听
     * @param name 事件名称
     * @param callback 回调函数
     * @param caller 调用者/作用域
     */
    public off(name: T_EventType, callback: Function, caller = null) {
        /** 事件项 根据对象寻址特性，匹配到对应的事件项 */
        this._eventList = this._eventList.filter(item => !(item.name === name && item.callback === callback && item.caller === caller));
    }

    /**
     * 发送事件
     * @param name 事件名称
     * @param data 携带参数
     */
    public send(name: T_EventType, ...data: any[]) {
        const eventList = this._eventList.filter(item => item.name === name);
        eventList.forEach(item => {
            if (item.isOnce) this.off(name, item.callback, item.caller); // 只执行一次的进行移除
            if (!item.callback) return; // 没有回调

            // 执行事件回调
            let result: boolean = null;
            if (!item.caller) result = item.callback(...data); // 没有指定作用域
            else result = item.callback.apply(item.caller, data); // 指定作用域

            // 回调回执
            if (!item.isOnce && item.isOnTick && result) this.off(name, item.callback, item.caller);
        });
    }

    /** 事件缓存 */
    private _eventCache: EventCacheItem[] = [];

    /**
     * 事件缓存
     * @param name 事件名称
     * @param cacheType 添加类型, 默认：仅添加到队列
     * @param data 携带参数
     */
    public cacheEvent(name: T_EventType, cacheType: E_EventCacheType = E_EventCacheType.Push, ...data: any[]) {
        // 清理之前的
        if (cacheType === E_EventCacheType.Cover || cacheType === E_EventCacheType.Cover_And_Send) this.clearCacheEvent(name);
        const eventCacheItem = new EventCacheItem();
        eventCacheItem.name = name;
        eventCacheItem.cacheType = cacheType;
        eventCacheItem.data = data;
        this._eventCache.push(eventCacheItem);
    }

    /**
     * 发送缓存事件
     * @param name 事件名称，不填默认发送全部缓存事件
     */
    public sendCacheEvent(name: T_EventType = null) {
        if (name === null) {
            this._eventCache.forEach(item => this.send(item.name, ...item.data));
            this._eventCache = [];
        } else {
            this._eventCache = this._eventCache.filter(item => {
                if (item.name !== name) return true;
                this.send(item.name, ...item.data);
                return false;
            })
        }
    }

    /**
     * 清理事件缓存
     * @param name 事件名称，不填默认清理全部
     */
    public clearCacheEvent(name: T_EventType = null) {
        this._eventCache = this._eventCache.filter(item => {
            if (name !== null && item.name !== name) return true; // 不是相同事件，不进行处理。

            // 被清理自动发送
            if (item.cacheType === E_EventCacheType.Cover_And_Send || item.cacheType === E_EventCacheType.Push_And_Send) this.send(item.name, ...item.data);

            return false;
        });
    }

    /** 销毁 */
    public destroy() {
        this._eventList = [];
        this._eventCache = [];
    }
}