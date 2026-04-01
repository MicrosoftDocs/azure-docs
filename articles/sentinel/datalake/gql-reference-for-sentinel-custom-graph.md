---
title: Graph Query Language (GQL) reference for Microsoft Sentinel graph (Preview)
description: Learn the fundamental concepts, functions, and operators of Graph Query Language (GQL) for querying graph data in Microsoft Sentinel graph.
author: EdB-MSFT
ms.author: edbaynash
ms.date: 03/23/2026
ms.topic: reference
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform
---

# Graph Query Language (GQL) reference for Microsoft Sentinel graph (preview)

 Applies to: Microsoft Sentinel Graph

> [!NOTE]
> GQL support is in preview. Features and syntax can change based on feedback and ongoing development.


This reference covers the fundamental concepts, functions, and operators of Graph Query Language (GQL). Graph Query Language (GQL) is built on mathematical graph theory concepts that provide a solid foundation for querying graph data. Understanding these fundamentals helps you write more effective queries and better understand how GQL processes your data. GQL also provides a rich set of functions and operators to work with graph patterns, nodes, edges, and properties.

## Fundamental concepts 

This section covers the core concepts that form the foundation of graph data analysis with GQL.

### Graph patterns 

Graph patterns are the core building blocks of GQL queries. They describe the structure you want to find in your graph data using a declarative syntax that mirrors the visual representation of graphs.

### Node patterns

Node patterns specify how to match individual nodes in your graph:

```gql 
(n)                 -- Any node
(n:Person)          -- Node with Person label
(n:Person&City)     -- Node with Person AND City label
(:Person)           -- Person node, don't bind variable
```

**Key concepts:**

- **Variable binding**: `(n)` creates a variable n that you can reference later in the query

- **Anonymous nodes**: `(:Person)` matches nodes without creating a variable

- **Label filtering**: `:Person` restricts matches to nodes with the Person label

- **Label combinations**: Use `&` for AND, `|` for OR operations

### Edge patterns

Edge patterns define how nodes connect to each other:

```gql 
-[e]->                  -- Directed outgoing edge, any label 
-[e:works_at]->         -- Directed edge, works_at label
-[e:knows|likes]-->    -- knows OR likes edge
<-[e]-                  -- Directed incoming edge
-[e]-                   -- Undirected (any direction) 
```

**Key concepts:**

- **Direction**: `->` for outgoing, `<-` for incoming, `-` for any direction

- **Edge types**: Use labels like `:works_at` to filter by relationship type

- **Multiple types**: `knows|likes` matches either relationship type

### Label expressions

Labels provide semantic meaning to nodes and edges. GQL supports complex label expressions:

```gql
:Person&amp;Company     -- Both Person AND Company labels 
:Person|Company        -- Person OR Company labels
:!Company               -- NOT Company label
:(Person|!Company)&City -- Complex expressions with parentheses 
```
### Operators


- `&` (AND): Node must have all specified labels

- `|` (OR): Node must have at least one specified label

- `!` (NOT): Node must not have the specified label

- `()` : Parentheses for grouping complex expressions

### Path patterns

Path patterns describe multi-hop relationships in your graph:

```gql
(a)-[e1]->;(b)-[e2]->(c)     -- 2-hop path 
(a)-[e]->;{2,4}(b)              -- 2 to 4 hops
(a)-[e]->{1,}(b)             -- 1 or more hops
(a)-[:knows|likes]->;{1,3}(b)  -- 1-3 hops via knows/likes 
p=()-[:works_at]->()         -- Binding a path variable 
```

**Variable-length paths:**

- `{2,4}`: Exactly 2 to 4 hops
- `{1,}`: 1 or more hops (unbounded)
- `{,3}`: Up to 3 hops
- `{5}`: Exactly 5 hops

### Path variables

- `p=()->()`: Captures the entire path for later analysis

- Access with `NODES(p)`, `RELATIONSHIPS(p)`, `PATH_LENGTH(p)`

### Multiple patterns

GQL supports complex, non-linear graph structures:

```gql
(a)->(b), (a)->(c)          -- Multiple edges from same node
(a)->(b)<-(c), (b)->(d)     -- Non-linear structures
```

**Pattern composition:**

- Use commas `,` to separate multiple patterns
- All patterns must match simultaneously
- Variables can be shared across patterns

## Match modes 

GQL supports different path matching modes that control how patterns are matched against graph data. These modes affect performance, result completeness, and the types of paths that are returned.

Match modes control how graph elements can be reused across pattern variables within a single MATCH clause.

### DIFFERENT EDGES (default)

The default mode. A matched edge can't bind to more than one edge variable, but nodes can be reused freely.

```gql
MATCH (a)-[r1]->(b)-[r2]->(c) 
-- r1 and r2 must be different edges
-- a, b, c can be the same or different nodes 
```

### REPEATABLE ELEMENTS

Allows both edges and nodes to be reused across pattern variables without restrictions.

```gql
MATCH REPEATABLE ELEMENTS (a)-[r1]->(b)-[r2]->(c)
-- r1 and r2 can be the same edge
-- a, b, c can be the same or different nodes
```

## Path modes 

Path modes control which types of paths are included in results based on repetition constraints.

### TRAIL

Filters out paths that have repeating edges. Nodes can repeat, but each edge can only appear once per path.

```gql
MATCH TRAIL (a)-[]->{1,3}(b)
-- No edge can appear twice in the same path
-- Nodes may repeat
```

## Functions and operators reference 

Graph Query Language (GQL) provides a rich set of functions and operators to work with graph patterns, nodes, edges, and properties.

### Core GQL functions and operators 

The following table lists the core GQL functions and operators, and examples.


| GQL Function/Operator | Description | GQL Example |
|---|---|---|
| MATCH | Find graph patterns | MATCH (a)-[r]->(b) |
| OPTIONAL MATCH | Find patterns that might not exist | OPTIONAL MATCH (p)->(c:City) |
| WHERE | Filter patterns and properties | WHERE person.age > 25 |
| FILTER | Equivalent to WHERE but used without MATCH clauses | FILTER p.name = 'Carol' OR c.name = 'Seattle' |
| IS NULL | Check for null values | WHERE person.age IS NULL |
| IS NOT NULL | Check for non-null values | WHERE person.age IS NOT NULL |
| RETURN | Project results | RETURN person.name, person.age |
| DISTINCT | Return unique values | RETURN DISTINCT person.name |
| COUNT(*) | Count all rows | RETURN COUNT(*) |
| COUNT() | Count non-null values | RETURN COUNT(person.name) |
| SUM() | Sum numeric values | RETURN SUM(person.age) |
| MIN() | Minimum value | RETURN MIN(person.age) |
| MAX() | Maximum value | RETURN MAX(person.age) |
| AVG() | Average value | RETURN AVG(person.age) |
| COLLECT_LIST() | Collect values into array | RETURN COLLECT_LIST(person.name) |
| SIZE() | Array length | RETURN SIZE(COLLECT_LIST(n.firstName)) |
| labels() | Show labels for a node or edge | RETURN labels(entity) |
| UPPER() | Convert to uppercase | RETURN UPPER(person.name) |
| LOWER() | Convert to lowercase | RETURN LOWER(person.name) |
| STARTS WITH | String starts with pattern | WHERE person.name STARTS WITH 'Tom' |
| ENDS WITH | String ends with pattern | WHERE person.name ENDS WITH 'Hanks' |
| CONTAINS | String contains pattern | WHERE person.name CONTAINS 'Tom' |
| \|\| | String concatenation | RETURN n.firstName \|\| ' ' \|\| n.lastName |
| TRIM() | Remove whitespace from both ends | RETURN TRIM(' abc ') |
| STRING_JOIN() | Join array elements with delimiter | RETURN STRING_JOIN(["a", "b" \|\| "c"], "-") |
| CAST() | Convert data types | CAST(person.age AS STRING) |
| ZONED_DATETIME() | Create datetime from string | ZONED_DATETIME('2024-01-01') |
| PATH_LENGTH() | Get the length of a path | RETURN PATH_LENGTH(path_variable) |
| ORDER BY | Sort results | ORDER BY person.age DESC |
| LIMIT | Limit result count | LIMIT 10 |
| & (AND) | Label intersection | MATCH (p:Person & Male) |
| \| (OR) | Label union | MATCH (n:Person \| Movie) |
| ! (NOT) | Label negation | MATCH (p:!Female) |



## Best practices 

+  GQL doesn't clearly define how dynamic types should be handled. To avoid runtime errors, explicitly cast nested fields to their expected type (see CAST).

### Performance optimization 

Use these strategies to optimize GQL query performance in production environments:

> [!TIP]
> Start with simple patterns, then increase complexity if needed. Monitor query performance and adjust path lengths and filters to improve results.
>

**Limit path matching scope**:

- Use specific label filters to reduce the search space: MATCH (start:SpecificType) instead of MATCH (start)

- Limit variable length paths with reasonable bounds: MATCH (a)-[]->{1,3}(b) instead of unbounded paths

- Apply WHERE clauses early to filter results before expensive operations.

**Use COUNT(*) for existence checks**:

If you only need to check if a pattern exists, use COUNT(*) instead of returning full results.

```gql
MATCH (user:User)-[:SUSPICIOUS_ACTIVITY]->(target)
WHERE user.id = 'user123'
RETURN COUNT(*) > 0 AS HasSuspiciousActivity
```

## Limitations 

- **Query structure**: All GQL queries must start with a MATCH statement.

- **Reserved keywords**: Some GQL keywords can't be used as identifiers in queries. Some reserved keywords aren't immediately obvious (for example, DATE is a reserved keyword). If your graph data has property names that conflict with GQL reserved keywords, use different property names in your graph schema or rename them to avoid parsing conflicts.

> [!IMPORTANT]
> When you design your graph schema, some common property names might conflict with GQL reserved keywords. Avoid or rename these property names.

- **No INSERT/CREATE support**: Operations to change graph structures aren't supported. 

- **Optional matches**: Supported only for node patterns (not edges).

- **Entity equivalence checks not supported**: GQL's `(MATCH (n)-[]-(n2) WHERE n1 <> n2)` isn't supported. Use explicit field comparisons instead, for example `n.id <> n2.id`

- **Time and timezone**: The engine operates in UTC. Datetime literals must use zoned datetime; only the UTC zone is supported via `ZONED_DATETIME("2011-12-31 23:59:59.9")`.

- **Duration granularity**: Durations support up to days and smaller units down to nanoseconds. Larger-than-day units (for example, weeks, months, years) aren't supported.


## Labels() custom GQL function 

The `labels()` function shows the labels for a node or edge as an array.

**Syntax:**

`labels(entity)`

**Parameters:**
`entity`: A node or edge variable from a matched pattern.

**Returns:**

Returns an array of strings with all labels for the specified entity.

**Examples:**

Show labels for matched nodes:

```gql
MATCH (entity)
RETURN entity.name, labels(entity)
```

**Output**

This query shows the name and all labels for each node in the graph.

| **entity.name** | **labels(entity)** |
|---|---|
| john.doe | ["User"] |
| admin.user | ["User"] |
| web-server | ["System"] |
| database | ["System"] |
| domain-controller | ["System"] |

Show labels in projections with aliases:

```gql
MATCH (n)-[e]->(target)
RETURN n.name, labels(n) AS n_labels, labels(e) AS edge_labels, target.name
```

This query shows node names, their labels, and the labels of connecting edges.

| **n.name** | **n_labels** | **edge_labels** | **target.name** |
|---|---|---|---|
| john.doe | ["User"] | ["CAN_ACCESS"] | web-server |
| admin.user | ["User"] | ["CAN_ACCESS"] | domain-controller |
| web-server | ["System"] | ["CAN_ACCESS"] | database |
| domain-controller | ["System"] | ["CAN_ACCESS"] | database |
