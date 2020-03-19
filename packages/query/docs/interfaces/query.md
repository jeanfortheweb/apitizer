[@apitizer/query](../README.md) › [Query](query.md)

# Interface: Query

Defines a query builder.

## Hierarchy

* **Query**

## Index

### Methods

* [clear](query.md#clear)
* [empty](query.md#empty)
* [get](query.md#get)
* [param](query.md#param)
* [params](query.md#params)

## Methods

###  clear

▸ **clear**(): *[Query](query.md)*

*Defined in [index.ts:30](https://github.com/jeanfortheweb/apitizer/blob/35edc53/packages/query/src/index.ts#L30)*

Removes all current set parameters.

**Returns:** *[Query](query.md)*

___

###  empty

▸ **empty**(): *boolean*

*Defined in [index.ts:35](https://github.com/jeanfortheweb/apitizer/blob/35edc53/packages/query/src/index.ts#L35)*

Checks if the builder contains any parameters.

**Returns:** *boolean*

___

###  get

▸ **get**(): *string*

*Defined in [index.ts:40](https://github.com/jeanfortheweb/apitizer/blob/35edc53/packages/query/src/index.ts#L40)*

Returns the query as a string.

**Returns:** *string*

___

###  param

▸ **param**(`name`: string, `value`: string | undefined): *[Query](query.md)*

*Defined in [index.ts:17](https://github.com/jeanfortheweb/apitizer/blob/35edc53/packages/query/src/index.ts#L17)*

Sets a single query parameter.
Setting a parameter to undefined or null deletes the parameter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Parameter. |
`value` | string &#124; undefined | Value.  |

**Returns:** *[Query](query.md)*

___

###  params

▸ **params**(`params`: Record‹string, string | undefined›): *[Query](query.md)*

*Defined in [index.ts:25](https://github.com/jeanfortheweb/apitizer/blob/35edc53/packages/query/src/index.ts#L25)*

Sets a group of query parameters.
Setting a parameter to undefined or null deletes the parameter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | Record‹string, string &#124; undefined› | Parameters.  |

**Returns:** *[Query](query.md)*
