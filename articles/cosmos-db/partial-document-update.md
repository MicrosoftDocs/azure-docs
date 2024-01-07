---
title: Partial document update in Azure Cosmos DB
description: Learn about partial document update in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 04/29/2022
ms.author: sidandrews
ms.custom: ignite-fall-2021, ignite-2022
---

# Partial document update in Azure Cosmos DB

[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

Azure Cosmos DB Partial Document Update feature (also known as Patch API) provides a convenient way to modify a document in a container. Currently, to update a document the client needs to read it, execute Optimistic Concurrency Control checks (if necessary), update the document locally and then send it over the wire as a whole document Replace API call.

Partial document update feature improves this experience significantly. The client can only send the modified properties/fields in a document without doing a full document replace operation. Key benefits of this feature include:

- **Improved developer productivity**: Provides a convenient API for ease of use and the ability to conditionally update the document.
- **Performance improvements**: Avoids extra CPU cycles on the client side, reduces end-to-end latency and network bandwidth.
- **Multi-region writes**: Supports automatic and transparent conflict resolution with partial updates on discrete paths within the same document.

> [!NOTE]
> *Partial document update* operation is based on the [RFC spec](https://www.rfc-editor.org/rfc/rfc6902#appendix-A.14). To escape a ~ character you need to add 0 or a 1 to the end.

An example target JSON document:

```json
{
 "id": "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
 "name": "R-410 Road Bicycle",
 "price": 455.95,
 "inventory": {
   "quantity": 15
 },
 "used": false,
 "categoryId": "road-bikes"
}
```

A JSON Patch document:

```json
[
 { "op": "add", "path": "/color", "value": "silver" },
 { "op": "remove", "path": "/used" },
 { "op": "set", "path": "/price", "value": 355.45 }
 { "op": "incr", "path": "/inventory/quantity", "value": 10 }
]
```

The resulting JSON document:

```json
{
 "id": "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
 "name": "R-410 Road Bicycle",
 "price": 355.45,
 "inventory": {
   "quantity": 25
 },
 "categoryId": "road-bikes",
 "color": "silver"
}
```

## Supported operations

The table below summarizes the operations supported by this feature.

> [!NOTE] 
> *target path* refers to a location within the JSON document

| **Operation type** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Add**            | `Add` performs one of the following, depending on the target path: <br/><ul><li>If the target path specifies an element that does not exist, it is added.</li><li>If the target path specifies an element that already exists, its value is replaced.</li><li>If the target path is a valid array index, a new element will be inserted into the array at the specified index. It shifts existing elements to the right.</li><li>If the index specified is equal to the length of the array, it will append an element to the array. Instead of specifying an index, you can also use the `-` character. It will also result in the element being appended to the array.</li></ul> <br/> **Note**: Specifying an index greater than the array length will result in an error. |
| **Set**            | `Set` operation is similar to `Add` except in the case of Array data type - if the target path is a valid array index, the existing element at that index is updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Replace**        | `Replace` operation is similar to `Set` except it follows *strict* replace only semantics. In case the target path specifies an element or an array that does not exist, it results in an error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Remove**         | `Remove` performs one of the following, depending on the target path: <br/><ul><li>If the target path specifies an element that does not exist, it results in an error. </li><li> If the target path specifies an element that already exists, it is removed. </li><li> If the target path is an array index, it will be deleted and any elements above the specified index are shifted one position to the left.</li></ul> <br/> **Note**: Specifying an index equal to or greater than the array length would result in an error.                                                                                                                                                                                                                                           |
| **Increment**      | This operator increments a field by the specified value. It can accept both positive and negative values. If the field does not exist, it creates the field and sets it to the specified value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Supported modes

Partial document update feature supports the following modes of operation. Refer to the [Getting Started](partial-document-update-getting-started.md) document for code examples.

- **Single document patch**: You can patch a single document based on its ID and the partition key. It is possible to execute multiple patch operations on a single document. The maximum limit is 10 operations.

- **Multi-document patch**: Multiple documents within the same partition key can be patched as a [part of a transaction](transactional-batch.md). This transaction will be committed only if all the operations succeed in the order they are described. If any operation fails, the entire transaction is rolled back.

- **Conditional Update**: For the aforementioned modes, it is also possible to add a SQL-like filter predicate (for example, `from c where c.taskNum = 3`) such that the operation fails if the pre-condition specified in the predicate is not satisfied.

- You can also use the bulk APIs of supported SDKs to execute one or more patch operations on multiple documents.

## Similarities and differences

### Add vs Set

`Set` operation is similar to `Add` for all data types except `Array`. An `Add` operation at any (valid) index, results in the addition of an element at the specified index and any existing elements in array end up shifting to the right. This is in contrast to `Set` operation that updates the existing element at the specified index.

### Add vs Replace

`Add` operation adds a property if it doesn't already exist (including `Array` data type). `Replace` operation will fail if the property does not exist (applies to `Array` data type as well).

### Set vs Replace

`Set` operation adds a property if it doesn't already exist (except if there was an `Array`). `Replace` operation will fail if the property does not exist (applies to `Array` data type as well).

> [!NOTE] 
> `Replace` is a good candidate where the user expects some of the properties to be always present and allows you to assert/enforce that.

## REST API reference for Partial document update

The [Azure Cosmos DB REST API](/rest/api/cosmos-db/) provides programmatic access to Azure Cosmos DB resources to create, query, and delete databases, document collections, and documents. In addition to executing insert, replace, delete, read, enumerate, and query operations on JSON documents in a collection, you can use the `PATCH` HTTP method for Partial document update operation. Refer to [the Azure Cosmos DB REST API Reference](/rest/api/cosmos-db/patch-a-document) for details.

For example, here is what the request looks like for a `set` operation using Partial document update.

```json
PATCH https://querydemo.documents.azure.com/dbs/FamilyDatabase/colls/FamilyContainer/docs/Andersen.1 HTTP/1.1
x-ms-documentdb-partitionkey: ["Andersen"]
x-ms-date: Tue, 29 Mar 2016 02:28:29 GMT
Authorization: type%3dmaster%26ver%3d1.0%26sig%3d92WMAkQv0Zu35zpKZD%2bcGSH%2b2SXd8HGxHIvJgxhO6%2fs%3d
Content-Type:application/json_patch+json
Cache-Control: no-cache
User-Agent: Microsoft.Azure.DocumentDB/2.16.12
x-ms-version: 2015-12-16
Accept: application/json
Host: querydemo.documents.azure.com
Cookie: x-ms-session-token#0=602; x-ms-session-token=602
Content-Length: calculated when request is sent
Connection: keep-alive

{"operations":[{ "op" :"set", "path":"/Parents/0/FamilyName","value":"Bob" }]}
```

## Document level vs path level conflict resolution

If your Azure Cosmos DB account is configured with multiple write regions, [conflicts and conflict resolution policies](conflict-resolution-policies.md) are applicable at the document level, with Last Write Wins (`LWW`) being the default conflict resolution policy. For partial document updates, patch operations across multiple regions detect and resolve conflicts at a more granular path level.

This can be better understood with an example.

Assume that you have following document in Azure Cosmos DB:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "jdoe@contoso.com",
  "phone": ["12345", "67890"],
  "level": "gold"
}
```

The below Patch operations are issued concurrently by different clients in different regions:

- `Set` attribute `/level` to platinum
- `Remove` 67890 from `/phone`

:::image type="content" source="./media/partial-document-update/patch-multi-region-conflict-resolution.png" alt-text="An image that shows conflict resolution in concurrent multi-region partial update operations." border="false" lightbox="./media/partial-document-update/patch-multi-region-conflict-resolution.png":::

Since Patch requests were made to non-conflicting paths within the document, these will be conflict resolved automatically and transparently (as opposed to Last Writer Wins at a document level).

The client will see the following document after conflict resolution:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "jdoe@contoso.com",
  "phone": ["12345"],
  "level": "platinum"
}
```

> [!NOTE]
> In case the same property of a document is being concurrently patched across multiple regions, the regular [conflict resolution policies](conflict-resolution-policies.md) apply.

## Change feed

Change feed in Azure Cosmos DB listens to a container for any changes and then outputs documents that were changed. Using change feed, you see all updates to documents including both partial and full document updates. When you process items from the change feed, the full document is returned even if the update is triggered by a patch operation.

For more information about the change feed in Azure Cosmos DB, see [Change feed in Azure Cosmos DB](change-feed.md).

## Next steps

- Learn how to [get started](partial-document-update-getting-started.md) with Partial Document Update using, .NET, Java and Node
- [Frequently asked questions](partial-document-update-faq.yml) about Partial Document Update
