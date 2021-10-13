---
# Mandatory fields.
title: Azure Digital Twins query language reference - MATCH clauses
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language MATCH clause
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/07/2021
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query language reference: MATCH clause

This document contains reference information on the **MATCH clause** for the [Azure Digital Twins query language](concepts-query-language.md).

The `MATCH` clause is used in the Azure Digital Twins query language as part of the [FROM clause](reference-query-clause-from.md). `MATCH` allows you to specify which pattern should be followed while traversing relationships in the Azure Digital Twins graph (this is also known as a "variable hop" query pattern).

This clause is optional while querying.

## Core syntax: MATCH

`MATCH` supports any query that finds a path between twins with an unpredictable number of hops, based on certain relationship conditions. 

The **relationship condition** can include one or more of the following details:
* [Relationship direction](#specify-relationship-direction) (left-to-right, right-to-left, or non-directional)
* [Relationship name](#specify-number-of-hops) (single name or a list of possibilities)
* [Number of "hops"](#specify-number-of-hops) from one twin to another (exact number or range)
* [A query variable assignment](#assign-query-variable-to-relationship-and-specify-relationship-properties) to represent the relationship within the query text. This will also allow you to filter on relationship properties.

A query with a `MATCH` clause must also use the [WHERE clause](reference-query-clause-where.md) to specify the `$dtId` for at least one of the twins it references.

>[!NOTE]
>`MATCH` is a superset of all `JOIN` queries that can be performed in the query store.

### Syntax

Here's the basic `MATCH` syntax. 

The placeholder values shown in the `MATCH` clause that should be replaced with your values are `twin_1`, `relationship_condition`, and `twin_2`. The placeholder values in the `WHERE` clause that should be replaced with your values are `twin_or_twin_collection` and `twin_ID`.

```sql
--SELECT ... FROM ...  
MATCH (twin_1)-[relationship_condition]-(twin_2)
WHERE twin_or_twin_collection.$dtId = 'twin_ID' 
-- AND ... 
```

You can leave out the name of one of the twins in order to allow any twin name to work in that spot.

You can also change the number of relationship conditions, to have multiple [chained](#combining-match-operations) relationship conditions or no relationship condition at all:

```sql
--Chained relationship conditions
-- SELECT ... FROM ... 
MATCH (twin_1)-[relationship_condition]-(twin_2)-[relationship_condition]-(twin_3)...
WHERE twin_or_twin_collection.$dtId = 'twin_ID' 
```

```sql
-- No relationship condition
-- SELECT ... FROM ... 
MATCH (twin_1)
WHERE twin_or_twin_collection.$dtId = 'twin_ID' 
```

For more detail about each type of relationship condition and how to combine them, see the other sections of this document.

### Example

Here is an example query using `MATCH`.

The query specifies a [relationship direction](#specify-relationship-direction), and searches for building and sensor twins where...
* the sensor is targeted by any relationship from a building with a `$dtId` of Building21, and 
* the sensor has a temperature above 50.
The building and sensor are both included in the query result.

```sql
SELECT building, sensor FROM DIGITALTWINS 
MATCH (building)-[]->(sensor) 
WHERE building.$dtId= 'Building21' AND sensor.temperature > 50  
```

## Specify relationship direction

Use the relationship condition in the `MATCH` clause to specify a relationship direction between the twins. Possible directions include left-to-right, right-to-left, or non-directional. Cyclic relationships are automatically detected, so that a relationship is traversed only once.

> [!NOTE]
> It's possible to represent bi-directional relationships by using [chaining](#combining-match-operations).

### Syntax

>[!NOTE]
> The examples in this section focus on relationship direction. They don't specify relationship names, they default to a single hop, and they don't assign query variables to the relationships. For instructions on how to do more with these other conditions, see [Specify relationship name](#specify-number-of-hops), [Specify number of hops](#specify-number-of-hops), and [Assign query variable to relationship](#assign-query-variable-to-relationship-and-specify-relationship-properties). For information about how to use several of these together in the same query, see [Combining MATCH operations](#combining-match-operations).


Directional relationship descriptions use a visual depiction of an arrow to indicate the direction of the relationship. The arrow includes a space set aside by square brackets (`[]`) for an optional [relationship name](#specify-number-of-hops). 

This section shows the syntax for different directions of relationships. The placeholder values that should be replaced with your values are `source_twin` and `target_twin`.

For a **left-to-right** relationship, use the following syntax.

```sql
-- SELECT ... FROM ...
MATCH (source_twin)-[]->(target_twin)
-- WHERE ...
```

For a **right-to-left** relationship, use the following syntax.

```sql
-- SELECT ... FROM ...
MATCH (target_twin)<-[]-(source_twin)
-- WHERE ...
```

For a **non-directional** relationship, use the following syntax. This will not specify a direction for the relationship, so relationships of any direction will be included in the result.

```sql
-- SELECT ... FROM ...
MATCH (source_twin)-[]-(target_twin)
-- WHERE ...
```

>[!TIP]
>Non-directional queries require additional processing, which may result in increased latency and cost.

### Examples

The first example shows a **left-to-right** directional traversal. This query finds twins *room* and *factory* where...
* *room* targets *factory* (with any named type of relationship)
* *room* has a temperature value that's greater than 50
* *factory* has a `$dtId` of 'ABC'

```sql
SELECT room, factory FROM DIGITALTWINS MATCH (room)-[]->(factory) 
WHERE room.temperature > 50 AND factory.$dtId = 'ABC' 
```

The following example shows a **right-to-left** directional traversal. This query looks similar to the one above, but the direction of the relationship between *room* and *factory* is reversed. This query finds twins *room* and *factory* where...
* *factory* targets *room* (with any named type of relationship)
* *factory* has a `$dtId` of 'ABC'
* *room* has a temperature value that's greater than 50

```sql
SELECT room, factory FROM DIGITALTWINS MATCH (room)<-[]-(factory) 
WHERE factory.$dtId = 'ABC' AND room.temperature > 50  
```

The following example shows a **non-directional** traversal. This query finds twins *room* and *factory* where...
* *room* and *factory* share any type of relationship, going in either direction
* *factory* has a `$dtId` of 'ABC'
* *room* has a humidity value that's greater than 70

```sql
SELECT factory, room FROM DIGITALTWINS MATCH (factory)-[]-(room) 
WHERE factory.$dtId ='ABC'  AND room.humidity > 70 
```

## Specify relationship name

Optionally, you can use the relationship condition in the `MATCH` clause to specify names for the relationships between the twins. You can specify a single name, or a list of possible names. The optional relationship name is included as part of the [arrow syntax to specify relationship direction](#specify-relationship-direction).

If you don't provide a relationship name, the query will include all relationship names by default.

>[!TIP]
>Specifying relationship names in the query can improve performance and make results more predictable.

### Syntax

>[!NOTE]
> The examples in this section focus on relationship name. They all show non-directional relationships, they default to a single hop, and they don't assign query variables to the relationships. For instructions on how to do more with these other conditions, see [Specify relationship direction](#specify-relationship-direction), [Specify number of hops](#specify-number-of-hops), and [Assign query variable to relationship](#assign-query-variable-to-relationship-and-specify-relationship-properties). For information about how to use several of these together in the same query, see [Combining MATCH operations](#combining-match-operations).

Specify the name of a relationship to traverse in the `MATCH` clause within square brackets (`[]`). This section shows the syntax of specifying named relationships.

For a **single name**, use the following syntax. The placeholder values that should be replaced with your values are `twin_1`, `relationship_name`, and `twin_2`.

```sql
-- SELECT ... FROM ...
MATCH (twin_1)-[:relationship_name]-(twin_2)
-- WHERE ...
```

For **multiple possible names**, use the following syntax. The placeholder values that should be replaced with your values are `twin_1`, `relationship_name_option_1`, `relationship_name_option_2`, `twin_2`, and the note to continue the pattern as needed for the number of relationship names you want to enter.

```sql
-- SELECT ... FROM ...
MATCH (twin_1)-[:relationship_name_option_1|relationship_name_option_2|continue pattern as needed...]-(twin_2)
-- WHERE ...
```

(Default) To leave name **unspecified**, leave the brackets empty of name information, like this:

```sql
-- SELECT ... FROM ...
MATCH (twin_1)-[]-(twin_2)
-- WHERE ...
```

### Examples

The following example shows a **single relationship name**. This query finds twins *building* and *sensor* where...
* *building* has a 'contains' relationship to *sensor* (going in either direction)
* *building* has a `$dtId` of 'Seattle21'

```sql
SELECT building, sensor FROM DIGITALTWINS   
MATCH (building)-[:contains]-(sensor)  
WHERE building.$dtId = 'Seattle21'
```

The following example shows **multiple possible relationship names**. This query looks similar to the one above, but there are multiple possible relationship names that are included in the result. This query finds twins *building* and *sensor* where...
* *building* has either a 'contains' or 'isAssociatedWith' relationship to *sensor* (going in either direction)
* *building* has a `$dtId` of 'Seattle21'

```sql
SELECT building, sensor FROM DIGITALTWINS   
MATCH (building)-[:contains|isAssociatedWith]-(sensor)  
WHERE building.$dtId = 'Seattle21'
```

The following example has **no specified relationship name**. As a result, relationships with any name will be included in the query result. This query finds twins *building* and *sensor* where...
* *building* has a relationship to *sensor* with any name (and going in either direction)
* *building* has a `$dtId` of 'Seattle21'

```sql
SELECT building, sensor FROM DIGITALTWINS   
MATCH (building-[]-(sensor)  
WHERE building.$dtId = 'Seattle21'
```

## Specify number of hops

Optionally, you can use the relationship condition in the `MATCH` clause to specify the number of hops for the relationships between the twins. You can specify an exact number or a range. This optional value is included as part of the [arrow syntax to specify relationship direction](#specify-relationship-direction).

If you don't provide a number of hops, the query will default to one hop.

>[!IMPORTANT]
>If you specify a number of hops that is greater than one, you can't [assign a query variable to the relationship](#assign-query-variable-to-relationship-and-specify-relationship-properties). Only one of these conditions can be used within the same query. 

### Syntax

>[!NOTE]
>The examples in this section focus on number of hops. They all show non-directional relationships without specifying names. For instructions on how to do more with these other conditions, see [Specify relationship direction](#specify-relationship-direction) and [Specify relationship name](#specify-number-of-hops). For information about how to use several of these together in the same query, see [Combining MATCH operations](#combining-match-operations).

Specify the number of hops to traverse in the `MATCH` clause within the square brackets (`[]`).

To specify an **exact number of hops**, use the following syntax. The placeholder values that should be replaced with your values are `twin_1`, `number_of_hops`, and `twin_2`.

```sql
-- SELECT ... FROM ... 
MATCH (twin_1)-[*number_of_hops]-(twin_2)
-- WHERE ...
```

To specify a **range of hops**, use the following syntax. The placeholder values that should be replaced with your values are `twin_1`, `starting_limit`,  `ending_limit` and `twin_2`. The starting limit **is not** included in the range, while the ending limit **is** included.

```sql
-- SELECT ... FROM ...
MATCH (twin_1)-[*starting_limit..ending_limit]-(twin_2)
-- WHERE ...
```

You can also leave out the starting limit to indicate "anything up to" (and including) the ending limit. An ending limit must always be provided.

```sql
-- SELECT ... FROM ...
MATCH (twin_1)-[*..ending_limit]-(twin_2)
-- WHERE ...
```

(Default) To default to **one hop**, leave the brackets empty of hop information, like this:

```sql
-- SELECT ... FROM ... 
MATCH (twin_1)-[]-(twin_2)
-- WHERE ...
```

### Examples

The following example specifies an **exact number of hops**. The query will only return relationships between twins *r* and *c* that are exactly 3 hops.

```sql
SELECT * FROM DIGITALTWINS 
MATCH (r)-[*3]-(c)
WHERE r.$dtId = '0'
```

The following example specifies a **range of hops**. The query will return relationships between twins *r* and *c* that are between 1 and 3 hops (meaning the number of hops is either 2 or 3).

```sql
SELECT * FROM DIGITALTWINS 
MATCH (r)-[*1..3]-(c)
WHERE r.$dtId = '0'
```

You can also show a range by providing only one boundary. In the following example, the query will return relationships between twins *r* and *c* that are at most 2 hops (meaning the number of hops is either 1 or 2).

```sql
SELECT * FROM DIGITALTWINS 
MATCH (r)-[*..2]-(c)
WHERE r.$dtId = '0'
```

The following example has no specified number of hops, so will default to **one hop**.

```sql
SELECT * FROM DIGITALTWINS  
MATCH (r)-[]-(c)
WHERE r.$dtId = '0'
```

## Assign query variable to relationship (and specify relationship properties)

Optionally, you can assign a query variable to the relationship referenced in the `MATCH` clause, so that you can refer to it by name in the query text.

A useful result of doing this is the ability to filter on relationship properties in your `WHERE` clause.

>[!IMPORTANT]
> Assigning a query variable to the relationship is only supported when the query specifies a single hop. Within a query, you must choose between specifying a relationship name and [specifying a greater number of hops](#specify-number-of-hops).

### Syntax

>[!NOTE]
>The examples in this section focus on a query variable for the relationship. They all show non-directional relationships without specifying names. For instructions on how to do more with these other conditions, see [Specify relationship direction](#specify-relationship-direction) and [Specify relationship name](#specify-number-of-hops). For information about how to use several of these together in the same query, see [Combining MATCH operations](#combining-match-operations).

To assign a query variable to the relationship, put the name in the square brackets (`[]`). The placeholder values that should be replaced with your values are `twin_1`, `relationship_variable`, and `twin_2`.

```sql
-- SELECT ... FROM ...   
MATCH (twin_1)-[relationship_variable]-(twin_2>) 
-- WHERE ... 
```

### Examples

The following example assigns a query variable 'r' to the relationship. Later, in the `WHERE` clause, it uses the variable to specify that the relationship *r* should have a length property that's equal to 10.

```sql
SELECT t, c, r FROM DIGITALTWINS   
MATCH (t)-[r]-(c)  
WHERE t.$dtId = 'thermostat-15' AND r.length = 10 
```

## Combining MATCH operations

You can combine multiple relationship conditions in the same query. You can also chain multiple relationship conditions to express bi-directional relationships or other larger combinations.

### Syntax

In a single query, you can combine [relationship direction](#specify-relationship-direction), [relationship name](#specify-number-of-hops), and **one** of either [number of hops](#specify-number-of-hops) or [a query variable assignment](#assign-query-variable-to-relationship-and-specify-relationship-properties).

These syntax examples show how these attributes can be combined. You can also leave out any of the optional details shown in placeholders to omit that part of the condition.

To specify **relationship direction, relationship name, and number of hops** within a single query, use the following syntax within the relationship condition. The placeholder values that should be replaced with your values are `twin_1` and `twin_2`, `optional_left_angle_bracket` and `optional_right_angle_bracket`, `relationship_name(s)`, and `number_of_hops`.

```sql
-- SELECT ... FROM ...
MATCH (twin_1)optional_left_angle_bracket-[:relationship_name(s)*number_of_hops]-optional_right_angle_bracket(twin_2)
-- WHERE
```

To specify **relationship direction, relationship name, and a query variable for the relationship** within a single query, use the following syntax within the relationship condition. The placeholder values that should be replaced with your values are `twin_1` and `twin_2`, `optional_left_angle_bracket` and `optional_right_angle_bracket`, `relationship_variable`, and `relationship_name(s)`.

```sql
-- SELECT ... FROM ...
MATCH (twin_1)optional_left_angle_bracket-[relationship_variable:relationship_name(s)]-optional_right_angle_bracket(twin_2)
-- WHERE
```

>[!NOTE]
>As per the options for [specifying relationship direction](#specify-relationship-direction), you must pick between a left angle bracket for a left-to-right relationship or a right angle bracket for a right-to-left relationship. You can't include both on the same arrow, but can represent bi-directional relationships by chaining.

You can **chain** multiple relationship conditions together, like this. The placeholder values that should be replaced with your values are `twin_1`, all instances of `relationship_condition`, and `twin_2`.

```sql
-- Chained relationship conditions
-- SELECT ... FROM ... 
MATCH (twin_1)-[relationship_condition]-(twin_2)-[relationship_condition]-(twin_3)...
WHERE twin_or_twin_collection.$dtId = 'twin_ID' 
```

### Examples

Here's an example that combines **relationship direction, relationship name, and number of hops**. The following query finds twins *t* and *c*, where the relationship between *t* and *c* meets these conditions:
* the relationship is left-to-right, with *t* as the source and *c* as the target
* the relationship has a name of either 'contains' or 'isAssociatedWith'
* the relationship has either 4 or 5 hops

The query also specifies that twin *t* has a `$dtId` of 'thermostat-15'.

```sql
SELECT t, c FROM DIGITALTWINS    
MATCH (t)-[:contains|isAssociatedWith*3..5]->(c) 
WHERE t.$dtId = 'thermostat-15'
```

Here is an example that combines **relationship direction, relationship name, and a named query variable for the relationship**. The following query finds twins *t* and *c*, where the relationship between *t* and *c* is assigned to a query variable *r* and meets these conditions:
* the relationship is left-to-right, with *t* as the source and *c* as the target
* the relationship has a name of either 'contains' or 'isAssociatedWith'
* the relationship, which is given a query variable *r*, has a length property equal to 10

The query also specifies that twin *t* has a `$dtId` of 'thermostat-15'.

```sql
SELECT t, c FROM DIGITALTWINS    
MATCH (t)-[r:contains|isAssociatedWith]->(c) 
WHERE t.$dtId = 'thermostat-15' AND r.length = 10
```

The following example illustrates **chained** relationship conditions. The query finds twins *t1*, *t2*, and *c*, where...
* the relationship between *t1* and *c* meets these conditions:
    - the relationship is left-to-right, with *t* as the source and *c* as the target
    - the relationship has a name of either 'contains' or 'isAssociatedWith'
    - the relationship, which is given query variable *r*, has a length property equal to 10
* the relationship between *c* and *t2* meets these conditions:
    - the relationship is right-to-left, with *t2* as the source and *c* as the target
    - the relationship has a name of either 'has' or 'includes'
    - the relationship has up to 3 (so 1, 2, or 3) hops

The query also specifies that twin *t1* has a `$dtId` of 'thermostat-15' and twin *t2* has a temperature of 55.

```sql
SELECT t1, t2, c FROM DIGITALTWINS    
MATCH (t1)-[r:contains|isAssociatedWith]->(c)<-[has|includes*..3]-(t2)  
WHERE t1.$dtId = 'thermostat-15'  AND r.length = 10 AND t2.temperature = 55  
```

You can also use chained relationship conditions to express **bi-directional relationships**. The following query finds twins *t* and *c*, where the relationship between *t* and *c* is assigned to a query variable *r* and meets these conditions:
* the relationship is bi-directional, so it goes from *t* to *c* and also from *c* to t
* the relationship has a name of 'isAssociatedWith'
* the relationship, given a variable name of *r*, has a length property of 10

The query also specifies that twin *t* has a `$dtId` of 'thermostat-15'.

```sql
SELECT t, c FROM DIGITALTWINS    
MATCH (t)-[r:isAssociatedWith]->(c)<-[r:isAssociatedWith]-(t)
WHERE t.$dtId = 'thermostat-15'  AND r.length = 10
```

## Limitations

The following limits apply to queries using `MATCH`:
* Only one `MATCH` expression is supported per query statement
* `$dtId` is required in the `WHERE` clause
* Assigning a query variable to the relationship is only supported when the query specifies a single hop
* The maximum hops supported in a query is 10