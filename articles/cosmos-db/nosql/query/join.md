---
title: Self-joins
titleSuffix: Azure Cosmos DB for NoSQL
description: Use the JOIN keyword to perform a self-join in Azure Cosmos DB for NoSQL.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# Self-joins in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

In Azure Cosmos DB for NoSQL, data is schema-free and typically denormalized. Instead of joining data across entities and sets, like you would in a relational database, joins occur within a single item. Specifically, joins are scoped to that item and can't occur across multiple items and containers.

> [!TIP]
> If you find yourself needing to join across items and containers, consider reworking your [data model](../../modeling-data.md) to avoid this.

## Self-join with a single item

Let's look at an example of a self-join within an item. Consider a container with a single item. This item represents a product with various tags:

```json
[
  {
    "id": "863e778d-21c9-4e2a-a984-d31f947c665c",
    "categoryId": "e592b992-d453-42ee-a74e-0de2cc97db42",
    "name": "Teapo Surfboard (6'10\") Grape",
    "sku": "teapo-surfboard-72109",
    "tags": [
      {
        "id": "556dc4f5-1dbd-41dc-9674-fda626e5d15c",
        "slug": "tail-shape-swallow",
        "name": "Tail Shape: Swallow"
      },
      {
        "id": "ac097b9a-8a30-4fd1-8cb6-69d3388ee8a2",
        "slug": "length-inches-82",
        "name": "Length: 82 inches"
      },
      {
        "id": "ce62b524-8e96-4999-b3e1-61ae7a672e2e",
        "slug": "color-group-purple",
        "name": "Color Group: Purple"
      }
    ]
  }
]
```

What if you need to find the **color group** of this product? Typically, you would need to write a query that has a filter checking every potential index in the `tags` array for a value with a prefix of `color-group-`.

```sql
SELECT
  * 
FROM
  products p
WHERE
  STARTSWITH(p.tags[0].slug, "color-group-") OR
  STARTSWITH(p.tags[1].slug, "color-group-") OR
  STARTSWITH(p.tags[2].slug, "color-group-")
```

This technique can become untenable quickly. The complexity or length of the query syntax increases the number of potential items in the array. Also, this query isn't flexible enough to handle future products, which may have more than three tags.

In a traditional relational database, the tags would be separated into a separate table and a cross-table join is performed with a filter applied to the results. In the API for NoSQL, we can perform a self-join operation within the item using the `JOIN` keyword.

```sql
SELECT
  p.id,
  p.sku,
  t.slug
FROM
  products p
JOIN
  t IN p.tags
```

This query returns a simple array with an item for each value in the tags array.

```json
[
  {
    "id": "863e778d-21c9-4e2a-a984-d31f947c665c",
    "sku": "teapo-surfboard-72109",
    "slug": "tail-shape-swallow"
  },
  {
    "id": "863e778d-21c9-4e2a-a984-d31f947c665c",
    "sku": "teapo-surfboard-72109",
    "slug": "length-inches-82"
  },
  {
    "id": "863e778d-21c9-4e2a-a984-d31f947c665c",
    "sku": "teapo-surfboard-72109",
    "slug": "color-group-purple"
  }
]
```

Let's break down the query. The query now has two aliases: `p` for each product item in the result set, and `t` for the self-joined `tags` array. The `*` keyword is only valid to project all fields if it can infer the input set, but now there are two input sets (`p` and `t`). Because of this constraint, we must explicitly define our returned fields as `id` and `sku` from the product along with `slug` from the tags. To make this query easier to read and understand, we can drop the `id` field and use an alias for the tag's `name` field to rename it to `tag`.

```sql
SELECT
  p.sku,
  t.name AS tag
FROM
  products p
JOIN
  t IN p.tags
```

```json
[
  {
    "sku": "teapo-surfboard-72109",
    "tag": "Tail Shape: Swallow"
  },
  {
    "sku": "teapo-surfboard-72109",
    "tag": "Length: 82 inches"
  },
  {
    "sku": "teapo-surfboard-72109",
    "tag": "Color Group: Purple"
  }
]
```

Finally, we can use a filter to find the tag `color-group-purple`. Because we used the `JOIN` keyword, our filter is flexible enough to handle any variable number of tags.

```sql
SELECT
  p.sku,
  t.name AS tag
FROM
  products p
JOIN
  t IN p.tags
WHERE
  STARTSWITH(t.slug, "color-group-")
```

```json
[
  {
    "sku": "teapo-surfboard-72109",
    "tag": "Color Group: Purple"
  }
]
```

## Self-joining multiple items

Let's move on to a sample where we need to find a value within an array that exists in multiple items. For this example, consider a container with two product items. Each item contains relevant tags for that item.

```json
[
  {
    "id": "80d62f31-9892-48e5-9b9b-5714d551b8b3",
    "categoryId": "19cd9b93-bdc5-4082-97fe-2c80c2fd77dd",
    "categoryName": "Sleeping Bags",
    "name": "Maresse Sleeping Bag (6') Ming",
    "sku": "maresse-sleeping-bag-65503",
    "tags": [
      {
        "id": "f50f3ee1-e150-4821-922b-ebe6ad82f313",
        "slug": "bag-shape-mummy",
        "name": "Bag Shape: Mummy"
      },
      {
        "id": "8564fb66-63ea-464a-872a-7598433b9479",
        "slug": "bag-insulation-down-fill",
        "name": "Bag Insulation: Down Fill"
      }
    ]
  },
  {
    "id": "6e9f51c1-6b45-440f-af5a-2abc96cd083d",
    "categoryId": "19cd9b93-bdc5-4082-97fe-2c80c2fd77dd",
    "categoryName": "Sleeping Bags",
    "name": "Vareno Sleeping Bag (6') Turmeric",
    "sku": "vareno-sleeping-bag-65508",
    "tags": [
      {
        "id": "e02502ce-367e-4fb4-940e-93d994fa6062",
        "slug": "bag-insulation-synthetic-fill",
        "name": "Bag Insulation: Synthetic Fill"
      },
      {
        "id": "c0844995-3db9-4dbb-8d9d-d2c2a6151b94",
        "slug": "color-group-yellow",
        "name": "Color Group: Yellow"
      },
      {
        "id": "f50f3ee1-e150-4821-922b-ebe6ad82f313",
        "slug": "bag-shape-mummy",
        "name": "Bag Shape: Mummy"
      }
    ]
  }
]
```

What if you needed to find every item with a **mummy** bag shape? You could search for the tag `bag-shape-mummy`, but you would need to write a complex query that accounts for two characteristics of these items:

- The tag with a `bag-shape-` prefix occurs at different indexes in each array. For the **Vareno** sleeping bag, the tag is the third item (index: `2`). For the **Maresse** sleeping bag, the tag is the first item (index: `0`).

- The `tags` array for each item is a different length. The **Vareno** sleeping bag has two tags while the **Maresse** sleeping bag has three.

Here, the `JOIN` keyword is a great tool to create a cross product of the items and tags. Joins create a complete cross product of the sets participating in the join. The result is a set of tuples with every permutation of the item and the values within the targeted array.

A join operation on our sample sleeping bag products and tags creates the following items:

| Item | Tag |
| --- | --- |
| Maresse Sleeping Bag (6') Ming | Bag Shape: Mummy |
| Maresse Sleeping Bag (6') Ming | Bag Insulation: Down Fill |
| Vareno Sleeping Bag (6') Turmeric | Bag Insulation: Synthetic Fill |
| Vareno Sleeping Bag (6') Turmeric | Color Group: Yellow |
| Vareno Sleeping Bag (6') Turmeric | Bag Shape: Mummy |

Here's the SQL query and JSON result set for a join that includes multiple items in the container.

```sql
SELECT
  p.sku,
  t.name AS tag
FROM
  products p
JOIN
  t IN p.tags
WHERE
  p.categoryName = "Sleeping Bags"
```

```json
[
  {
    "sku": "maresse-sleeping-bag-65503",
    "tag": "Bag Shape: Mummy"
  },
  {
    "sku": "maresse-sleeping-bag-65503",
    "tag": "Bag Insulation: Down Fill"
  },
  {
    "sku": "vareno-sleeping-bag-65508",
    "tag": "Bag Insulation: Synthetic Fill"
  },
  {
    "sku": "vareno-sleeping-bag-65508",
    "tag": "Color Group: Yellow"
  },
  {
    "sku": "vareno-sleeping-bag-65508",
    "tag": "Bag Shape: Mummy"
  }
]
```

Just like with the single item, you can apply a filter here to find only items that match a specific tag. For example, this query finds all items with a tag named `bag-shape-mummy` to meet the initial requirement mentioned earlier in this section.

```sql
SELECT
  p.sku,
  t.name AS tag
FROM
  products p
JOIN
  t IN p.tags
WHERE
  p.categoryName = "Sleeping Bags" AND
  t.slug = "bag-shape-mummy"
```

```json
[
  {
    "sku": "maresse-sleeping-bag-65503",
    "tag": "Bag Shape: Mummy"
  },
  {
    "sku": "vareno-sleeping-bag-65508",
    "tag": "Bag Shape: Mummy"
  }
]
```

You can also change the filter to get a different result set. For example, this query finds all items that have a tag named `bag-insulation-synthetic-fill`.

```sql
SELECT
  p.sku,
  t.name AS tag
FROM
  products p
JOIN
  t IN p.tags
WHERE
  p.categoryName = "Sleeping Bags" AND
  t.slug = "bag-insulation-synthetic-fill"
```

```json
[
  {
    "sku": "vareno-sleeping-bag-65508",
    "tag": "Bag Insulation: Synthetic Fill"
  }
]
```

## Next steps

- [`SELECT` clause](select.md)
- [`FROM` clause](from.md)
- [Subqueries](subquery.md)
