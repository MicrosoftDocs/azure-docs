---
title: FROM
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL clause that identifies the source of data for a query.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# FROM clause (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The FROM (``FROM <from_specification>``) clause is optional, unless the source is filtered or projected later in the query. A query like ``SELECT * FROM products`` enumerates over an entire container regardless of the name. You can also use the special identifier ``ROOT`` for the container instead of using the container name.

The ``FROM`` clause enforces the following rules per query:

- The container can be aliased, such as ``SELECT p.id FROM products AS p`` or simply ``SELECT p.id FROM products p``. Here, ``p`` is the alias for the container. The container doesn't necessarily need to be named ``products`` or ``p``. ``AS`` is an optional keyword to [alias](working-with-json.md#alias-values) the identifier.  
- Once aliased, the original source name can't be bound. For example, ``SELECT products.id FROM products p`` is syntactically invalid because the identifier ``products`` has been aliased and can't be resolved anymore.  
- All referenced properties must be fully qualified, to avoid any ambiguous bindings in the absence of strict schema adherence. For example, ``SELECT id FROM products p`` is syntactically invalid because the property ``id`` isn't bound. The query should instead reference the property ``id`` using ``p.id`` (or ``<alias>.<property-name>``).

## Syntax

```sql  
FROM <from_specification>  
  
<from_specification> ::=
        <from_source> {[ JOIN <from_source>][,...n]}  
  
<from_source> ::=
          <container_expression> [[AS] input_alias]  
        | input_alias IN <container_expression>  
  
<container_expression> ::=
        ROOT
     | container_name  
     | input_alias  
     | <container_expression> '.' property_name  
     | <container_expression> '[' "property_name" | array_index ']'
```  

## Arguments

| | Description |
| --- | --- |
| **``<from_source>``** | Specifies a data source, with or without an alias. If alias isn't specified, it's inferred from the ``<container_expression>`` using following rules. If the expression is a ``container_name``, then ``container_name`` is used as an alias. If the expression is ``<container_expression>``, then ``property_name`` is used as an alias. If the expression is a ``container_name``, then ``container_name`` is used as an alias. |
| **AS ``input_alias``** | Specifies that the ``input_alias`` is a set of values returned by the underlying container expression. |
| **``input_alias`` IN** | Specifies that the ``input_alias`` should represent the set of values obtained by iterating over all array elements of each array returned by the underlying container expression. Any value returned by underlying container expression that isn't an array is ignored. |
| **``<container_expression>``** | Specifies the container expression to be used to retrieve the items. |
| **``ROOT``** | Specifies that the item should be retrieved from the default, currently connected container. |
| **``container_name``** | Specifies that the item should be retrieved from the provided container. The name of the container must match the name of the container currently connected to. |
| **``input_alias``** | Specifies that the item should be retrieved from the other source defined by the provided alias. |
| **``<container_expression> '.' property_name``** | Specifies that the item should be retrieved by accessing the ``property_name`` property. |
| **``<container_expression> '[' "property_name" \| array_index ']'``** | Specifies that the item should be retrieved by accessing the ``property_name`` property or ``array_index`` array element for all items retrieved by specified container expression. |

## Remarks

All aliases provided or inferred in the ``<from_source>``(s) must be unique. The Syntax ``<container_expression> '.' property_name`` is the same as ``<container_expression> '[' "property_name" ']'``. However, the latter syntax can be used if a property name contains a nonidentifier character.  

### Handling missing properties, missing array elements, and undefined values

If a container expression accesses properties or array elements and that value doesn't exist, that value is ignored and not processed further.  

### Container expression context scoping  

A container expression may be container-scoped or item-scoped:  

- An expression is container-scoped, if the underlying source of the container expression is either ``ROOT`` or ``container_name``. Such an expression represents a set of items retrieved from the container directly, and isn't dependent on the processing of other container expressions.  

- An expression is item-scoped, if the underlying source of the container expression is ``input_alias`` introduced earlier in the query. Such an expression represents a set of items obtained by evaluating the container expression. This evaluation is performed in the scope of each item belonging to the set associated with the aliased container. The resulting set is a union of sets obtained by evaluating the container expression for each of the items in the underlying set.

## Examples

In this first example, the ``FROM`` clause is used to specify the current container as a source, give it a unique name, and then alias it. The alias is then used to project specific fields in the query results.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/from/query.sql" range="1-6" highlight="5-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/from/result.json":::

In this next example, the ``FROM`` clause can also reduce the source to a smaller subset. To enumerate only a subtree in each item, the subroot can become the source. An array or object subroot can be used as a source.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/from-field/query.sql" range="1-4" highlight="3-4":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/from-field/result.json":::

## Related content

- [``SELECT`` clause](select.md)
- [``WHERE`` clause](where.md)
