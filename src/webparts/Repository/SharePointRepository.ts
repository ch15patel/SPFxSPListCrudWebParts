import { SPFI } from "@pnp/sp";
//import { Web } from "@pnp/sp/webs";
import { ISharePointBaseRepository } from "./ISharePointBaseRepository";
import { IListItem } from "../Common/IListItem";
import IQueryOption from "../Common/IQueryOption";

export default class SharePointRepository<T extends IListItem> implements ISharePointBaseRepository<T>{
    protected _list: import("@pnp/sp/lists").IList;
    protected _web: import("@pnp/sp/webs").IWeb;
    protected _sp: SPFI;

    constructor(sp: SPFI, listTitle: string, webUrl?: string) {        
        this._web = sp.web;
        this._list = this._web.lists.getByTitle(listTitle);
        this._sp = sp;
    }

    // Get all items
    public async getAll(): Promise<T[]> {
        try {
            const items = await this._list.items();
            return items;
        }
        catch (error) {
            return Promise.reject(error.message);
        }
    }

    // Get one by Id, optional query options
    public async getOne(id: number, queryOptions?: Omit<IQueryOption, "top" | "filter">): Promise<T> {
        let result = this._list.items.getById(id);
        if (queryOptions) {
            if (queryOptions.expand)
                result = result.expand(...queryOptions.expand);
            if (queryOptions.select)
                result = result.select(...queryOptions.select);
        }
        try {
            const item = await result();
            return item;
        }
        catch (error) {
            return Promise.reject(error.message);
        }
    }

    // Get items using CAML query
    public async getItemsByCAMLQuery(query: import("@pnp/sp/lists").ICamlQuery, ...expands: string[]): Promise<T[]> {
        return this._list.getItemsByCAMLQuery(query, ...expands);
    }

    // Get items using query options
    public async getItemsByQuery(queryOptions: IQueryOption): Promise<T[]> {
        const { filter, select, expand, top, skip } = queryOptions;
        let result = this._list.items;
        if (filter) result = result.filter(filter);
        if (select) result = result.select(...select);
        if (expand) result = result.expand(...expand);
        if (top) result = result.top(top);
        if (skip) result = result.skip(skip);
        return result();
    }
}