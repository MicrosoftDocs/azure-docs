---
title: Partial Document Update 
description: This article provides a conceptual overview of Partial Document Update in Azure Cosmos DB
author: abhirockzz
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 08/23/2021
ms.author: abhishgu
---

# Azure Cosmos DB Partial Document Update
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Azure Cosmos DB Partial Document Update feature (also known as Patch API) provides a convenient way to modify a document (item) in a container. Currently, to update a document the client needs to read it, execute Optimistic Concurrency Control checks (if necessary), update the document locally and then send it over the wire as a whole document Replace API call. 

Partial Document Update improves this experience significantly, since the client only needs to send the modified properties/fields in a document without the need to perform a full document replace operation. Its key benefits include:

- **Improved developer productivity**: Providing convenient API for ease of use and the ability to conditionally update the document. 
- **Performance improvements**: Avoid extra CPU cycles on client side, reduced end-to-end latency and network bandwidth.
- **Support for Multi-region writes** (formerly "multi-master"): Conflict resolution to be transparent and automatic with Partial updates on discrete paths with the same document.
 
## Supported operations

The table below summarizes the operations supported by this feature.


| **Operation Type** | **Description** |
| ------------ | -------- |
| **Add**      | `Add` performs one of the following, depending on the target path: <br/><ul><li>If the target path specifies an element that does not exist, it is added</li><li>If the target path specifies an element that already exists, its value is replaced</li><li>If the target path is a valid array index, a new element will be inserted into the array at the specified index - shifting the existing elements to the right</li><li>If the index specified is equal to the length of array, it will append an element to the array.</li></ul> <br/>Note: Specifying an index greater than the array length will result in an error. |
| **Set**      | `Set` is similar to `Add` except in the case of Array data type - if the target path is a valid array index, the existing element at that index will get updated.| 
| **Replace**      | `Replace` is similar to `Set` except follows _strict_ replace only semantics. In case the target path specifies an element that does not exist (including an Array), it results in an error.  | 
| **Remove**     | `Remove` performs one of the following, depending on the target path: <br/><ul><li>If the target path specifies an element that does not exist, it results in an error. </li><li> If the target path specifies an element that already exists, it is removed. </li><li> If the target path is an array index, it will be deleted and any elements above the specified index are shifted one position to the left.</li></ul> <br/>Note: Specifying an index equal to or greater than the array length would result in an error.  |
| **Increment**     | This operator increments a field by a specified value. It can accept both positive and negative values. If the field does not exist, increment creates the field and sets the field to the specified value. |

## Supported modes

Partial Document Update feature supports following modes of operation. Refer to the [Getting Started](partial-document-update-getting-started.md) document for code examples.

You can patch a single document based on ID and partition key. It is possible to execute multiple patch operations on a single document limited to a [maximum of 10 operations](partial-document-update-faq.yml#is-there-a-limit-to-the-number-of-partial-document-update-operations-).

Multiple documents (within the same partition key) can be patched as [part of a transaction](transactional-batch.md), which will be committed only if all operations succeed in the order they are described. However, if any operation fails, the entire transaction is rolled back.

It is also possible to use the respective Bulk APIs (of the supported SDKs) to execute one or more patch operations on multiple documents.

For the aforementioned modes, it is also possible to add a SQL-like filter predicate (for example, *from c where c.taskNum = 3*) such that the operation fails if the pre-condition specified in the predicate is not satisfied. 

## Add, Set, Replace operations - similarities and differences

### Add vs Set

`Set` operation is similar to `Add` for all data types except `Array`. An `Add` operation at any (valid) index, results in the addition of an element at the specified index and any existing elements in array end up shifting to the right. This is in contrast to `Set` operation that updates the existing element at the specified index. 

### Add vs Replace

`Add` operation adds a property if it doesn't already exist (including `Array` data type). `Replace` operation will fail if the property does not exist (applies to `Array` data type as well).

### Set vs Replace

`Set` operation adds a property if it doesn't already exist (except if there was an `Array`). `Replace` operation will fail if the property does not exist (applies to `Array` data type as well).

> [!NOTE]
> `Replace` is a good candidate where the user expects some of the properties to be always present and allows you to assert/enforce that.

## Partial document update specification

The client facing component of the Partial Document Update capability is implemented as a top-level REST API. Here is an example of how a `Conditional Add` operation is modeled by Azure Cosmos DB:

```bash
PATCH /dbs/{db}/colls/{coll}/documents/{doc}
HTTP/1.1
Content-Type:application/json-patch+json

{
   "condition":"from c where (c.TotalDue = 0 OR NOT IS_DEFINED(c.TotalDue))", 
   "operations":[ 
      { 
         "op":"add", 
         "path":"amount", 
         "value":80000 
      }
   ]
} 
```

> [!NOTE]
> In this case, the value at path `amount` will be set to `80000` (the operation) *only* if the value of `TotalDue` is 0 or it’s not present (the condition).

## Document level vs Path level conflict resolution  

If your Azure Cosmos DB account is configured with multiple write regions, [conflicts and conflict resolution policies](conflict-resolution-policies.md) are applicable at the document level, with Last Write Wins (`LWW`) being the default conflict resolution policy. For partial document updates, patch operations across multiple regions detect and resolve conflicts at a more granular path level.

This can be better understood with an example.

Assume that you have following document in Azure Cosmos DB:

```json
{  
   "id":1, 
   "name":"John Doe", 
   "email":"jdoe@contoso.com", 
   "phone":[  
      "12345",
      "67890"
   ], 
   "level":"gold",
} 
```

The below Patch operations are issued concurrently by different clients in different regions:

- `Set` attribute `/level` to platinum  
- `Remove` 67890 from `/phone`

:::image type="content" source="./media/partial-document-update/patch-multi-region-conflict-resolution.png" alt-text="An image that shows conflict resolution in concurrent multi-master patch write operations" border="false":::

Since Patch requests were made to non-conflicting paths within the document, these will be conflict resolved automatically and transparently (as opposed to Last Writer Wins at a document level).    

The client will see the following document after conflict resolution:

```json
{  
   "id":1, 
   "name":"John Doe", 
   "email":"jdoe@contoso.com", 
   "phone":[  
      "12345"
   ], 
   "level":"platinum",
} 
```

> [!NOTE]
> In case the same property of a document is being concurrently patched across multiple regions, the regular [conflict resolution policies](conflict-resolution-policies.md) apply.

## Next steps

- Learn how to [get started](partial-document-update-getting-started.md) with Partial Document Update using, .NET, Java and Node
- [Frequently asked questions](partial-document-update-faq.yml) about Partial Document Update