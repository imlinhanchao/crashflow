/**
 * DataSourceDto
 */
export class DataSource {
  name: string = '';

  description: string = '';
  /**
   * 查询数量
   */
  count?: number;
  /**
   * 查询显示字段
   */
  fields: DataField[] = [];
  /**
   * 查询分组字段
   */
  group: string[] = [];
  /**
   * 起始 index
   */
  index?: number;
  /**
   * 查询排序字段
   */
  order: DataOrder[] = [];
  /**
   * 查询 SQL Where 条件
   */
  where: SQLWhere = {
    items: [{
      type: '支出'
    }],
    relational: 'and',
  };
}

/**
* DataFieldDto
*/
export class DataField {
  /**
   * 字段
   */
  field: string;
  /**
   * 函数，字段函数
   */
  fun?: SQLFn;
  /**
   * 字段名
   */
  label: string;

  constructor(field: string = '', label: string = '', fun: SQLFn | undefined = undefined) {
    this.field = field;
    this.label = label;
    this.fun = fun;
  }
}

/**
* SQLFnParam
*/
export class SQLFnParam {
  /**
   * 参数类型
   */
  type: Type = Type.Col;
  /**
   * 参数值
   */
  value: number | SQLFn | string = '';

  constructor(type: Type = Type.Col, value: number | SQLFn | string = '') {
    this.type = type;
    this.value = value;
  }

  static col(value: string) {
    return new SQLFnParam(Type.Col, value);
  }

  static fn(value: SQLFn) {
    return new SQLFnParam(Type.Fn, value);
  }

  static value(value: number | string) {
    return new SQLFnParam(Type.Value, value);
  }

  toString() {
    if (this.type === Type.Col) {
      return '`' + this.value + '`';
    } else if (this.type === Type.Fn) {
      return this.value.toString();
    } else {
      return isNaN(Number(this.value)) ? `'${this.value}'` : this.value === 'true' || this.value === 'false' ? this.value : this.value;
    }
  }
}

/**
* 字段函数
*/
export class SQLFn {
  /**
   * 函数名
   */
  name: string;
  /**
   * 函数参数列表
   */
  params: SQLFnParam[];

  constructor(name: string = '', ...params: SQLFnParam[]) {
    this.name = name;
    this.params = params;
  }

  toString() {
    return this.name ? `${this.name}(${this.params.map(param => param.toString()).join(', ')})` : '?';
  }
}

/**
* 参数类型
*/
export enum Type {
  /**
   * 字段
   */
  Col = "col",
  /**
   * 函数
   */
  Fn = "fn",
  /**
   * 值
   */
  Value = "value",
}

/**
* 排序字段
*/
export class DataOrder {
  /**
   * 字段
   */
  field: string;
  /**
   * 函数，字段函数
   */
  fun?: SQLFn;
  /**
   * 排序，排序方式
   */
  order: Order;

  constructor(field: string = '', order: Order = Order.Desc, fun?: SQLFn) {
    this.field = field;
    this.order = order;
    this.fun = fun;
  }
}

/**
* 排序，排序方式
*/
export enum Order {
  Asc = "ASC",
  Desc = "DESC",
}

const prefixs = {
  between: 'between',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  like: 'like',
  ne: '!=',
  eq: '=',
  in: 'in',
  notIn: 'not in',
}

/**
* 查询条件
*/
export class SQLWhere {
  /**
   * 条件
   */
  items: (Recordable<any> | SQLWhere)[] = [];
  /**
   * 关系
   */
  relational: 'and' | 'or' = 'and';

  toString() {
    return SQLWhere.expression(this);
  }

  constructor(items: (Recordable<any> | SQLWhere)[] = [], relational: 'and' | 'or' = 'and') {
    this.items = items;
    this.relational = relational;
  }

  static and(...items: (Recordable<any> | SQLWhere)[]) {
    return new SQLWhere(items, 'and');
  }

  static or(...items: (Recordable<any> | SQLWhere)[]) {
    return new SQLWhere(items, 'or');
  }

  /**
   * 查询条件转字符串
   * @param where 查询条件
   * @returns 
   */
  static expression(where: SQLWhere): string {
    return where.items.map(item => {
      if (item instanceof SQLWhere || item.relational) {
        return `(${SQLWhere.expression(item as SQLWhere)})`;
      } else {
        return SQLWhere.formula(item);
      }
    }).join(` ${where.relational} `);
  }

  /**
   * 单位表达式转字符串
   * @param query 单位表达式
   * @returns 
   */
  static formula(query: Recordable<any>) {
    return Object.keys(query).map(key => {
      const [prefix, ...fields] = key.split('_');
      const field = fields.join('_');
      if (prefixs[prefix] && query[key]) {
        if (prefix == 'like') {
          return `${field} like '%${query[key]}%'`;
        } else if (Array.isArray(query[key])) {
          return `${field} ${prefixs[prefix]} (${query[key].join(',')})`;
        } else {
          return `${field} ${prefixs[prefix]} ${typeof query[key] === 'string' ? `'${query[key]}'` : query[key]}`;
        }
      }

    }).join(' and ');
  }
}