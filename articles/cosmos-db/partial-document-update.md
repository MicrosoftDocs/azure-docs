---
title: Partial document update
titleSuffix: Azure Cosmos DB for NoSQL
description: Learn how to conditionally modify a document using the partial document update feature in Azure Cosmos DB for NoSQL.
ms.author: sidandrews
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 04/03/2023
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
> The *Partial document update* operation is based on the [JSON Patch RFC](https://www.rfc-editor.org/rfc/rfc6902#appendix-A.14). Property names in paths need to escape the `~` and `/` characters as `~0` and `~1`, respectively.

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
  "categoryId": "road-bikes",
  "tags": ["r-series"]
}
```

A JSON Patch document:

```json
[
  { "op": "add", "path": "/color", "value": "silver" },
  { "op": "remove", "path": "/used" },
  { "op": "set", "path": "/price", "value": 355.45 }
  { "op": "incr", "path": "/inventory/quantity", "value": 10 },
  { "op": "add", "path": "/tags/-", "value": "featured-bikes" },
  { "op": "move", "from": "/color", "path": "/inventory/color" }
]
```

The resulting JSON document:

```json
{
  "id": "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
  "name": "R-410 Road Bicycle",
  "price": 355.45,
  "inventory": {
    "quantity": 25,
    "color": "silver"
  },
  "categoryId": "road-bikes",
  "tags": ["r-series", "featured-bikes"]
}
```

## Supported operations

This table summarizes the operations supported by this feature.

> [!NOTE] 
> _target path_ refers to a location within the JSON document

| Operation type | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Add**        | `Add` performs one of the following, depending on the target path: <br/> &bull; If the target path specifies an element that doesn't exist, it's added. <br/> &bull; If the target path specifies an element that already exists, its value is replaced. <br/> &bull; If the target path is a valid array index, a new element is inserted into the array at the specified index. This shifts existing elements after the new element. <br/> &bull; If the index specified is equal to the length of the array, it appends an element to the array. Instead of specifying an index, you can also use the `-` character. It also results in the element being appended to the array.<br /> **Note**: Specifying an index greater than the array length results in an error. |
| **Set**        | `Set` operation is similar to `Add` except with the Array data type. If the target path is a valid array index, the existing element at that index is updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Replace**    | `Replace` operation is similar to `Set` except it follows _strict_ replace only semantics. In case the target path specifies an element or an array that doesn't exist, it results in an error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Remove**     | `Remove` performs one of the following, depending on the target path: <br/> &bull; If the target path specifies an element that doesn't exist, it results in an error. <br/> &bull; If the target path specifies an element that already exists, it's removed. <br/> &bull; If the target path is an array index, it's deleted and any elements above the specified index are shifted back one position.<br /> **Note**: Specifying an index equal to or greater than the array length would result in an error.                                                                                                                                                                                                                                                           |
| **Increment**  | This operator increments a field by the specified value. It can accept both positive and negative values. If the field doesn't exist, it creates the field and sets it to the specified value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Move**       | This operator removes the value at a specified location and adds it to the target location. The operation object MUST contain a "from" member, which is a string containing a JSON Pointer value that references the location in the target document to move the value from. The "from" location MUST exist for the operation to be successful.If the "path" location suggests an object that does not exist, it will create the object and set the value equal to the value at "from" location<br/> &bull;If the "path" location suggests an object that already exists, it will replace the value at "path" location with the value at "from" location<br/> &bull;"Path" attribute cannot be a JSON child of the "from" JSON location<br />                              |

## Supported modes

Partial document update feature supports the following modes of operation. Refer to the [Getting Started](partial-document-update-getting-started.md) document for code examples.

- **Single document patch**: You can patch a single document based on its ID and the partition key. It's possible to execute multiple patch operations on a single document. The maximum limit is 10 operations.

- **Multi-document patch**: Multiple documents within the same partition key can be patched as a [part of a transaction](transactional-batch.md). This multi-document transaction is committed only if all the operations succeed in the order they're described. If any operation fails, the entire transaction is rolled back.

- **Conditional Update**: For the aforementioned modes, it's also possible to add a SQL-like filter predicate (for example, `from c where c.taskNum = 3`) such that the operation fails if the precondition specified in the predicate isn't satisfied.

- You can also use the bulk APIs of supported SDKs to execute one or more patch operations on multiple documents.

## Similarities and differences

Let's compare the similarities and differences between the supported modes.

### Add vs Set

`Set` operation is similar to `Add` for all data types except `Array`. An `Add` operation at any (valid) index, results in the addition of an element at the specified index and any existing elements in array end up shifting after the existing element. This behavior is in contrast to `Set` operation that updates the existing element at the specified index.

### Add vs Replace

`Add` operation adds a property if it doesn't already exist (including `Array` data type). `Replace` operation fails if the property doesn't exist (applies to `Array` data type as well).

### Set vs Replace

`Set` operation adds a property if it doesn't already exist (except if there was an `Array`). `Replace` operation fails if the property doesn't exist (applies to `Array` data type as well).

> [!NOTE] 
> `Replace` is a good candidate where the user expects some of the properties to be always present and allows you to assert/enforce that.

## REST API reference for Partial document update

The [Azure Cosmos DB REST API](/rest/api/cosmos-db/) provides programmatic access to Azure Cosmos DB resources to create, query, and delete databases, document collections, and documents. In addition to executing insert, replace, delete, read, enumerate, and query operations on JSON documents in a collection, you can use the `PATCH` HTTP method for Partial document update operation. Refer to [the Azure Cosmos DB REST API Reference](/rest/api/cosmos-db/patch-a-document) for details.

For example, here's what the request looks like for a `set` operation using Partial document update.

```output
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
```

```json
{
  "operations": [
    {
      "op": "set",
      "path": "/Parents/0/FamilyName",
      "value": "Bob"
    }
  ]
}
```

## Document level vs path level conflict resolution

If your Azure Cosmos DB account is configured with multiple write regions, [conflicts and conflict resolution policies](conflict-resolution-policies.md) are applicable at the document level, with Last Write Wins (`LWW`) being the default conflict resolution policy. For partial document updates, patch operations across multiple regions detect and resolve conflicts at a more granular path level.

Conflict resolution can be better understood with an example.

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

Different clients issue Patch operations concurrently across different regions:

- `Set` attribute `/level` to platinum
- `Remove` 67890 from `/phone`

:::image type="content" source="./media/partial-document-update/patch-multi-region-conflict-resolution.png" alt-text="An image that shows conflict resolution in concurrent multi-region partial update operations." border="false" lightbox="./media/partial-document-update/patch-multi-region-conflict-resolution.png":::

Since Patch requests were made to nonconflicting paths within the document, these requests are conflict resolved automatically and transparently (as opposed to Last Writer Wins at a document level).

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

Change feed in Azure Cosmos DB listens to a container for any changes and then outputs documents that were changed. Using change feed, you see all updates to documents including both partial and full document updates. When you process items from the change feed, the full document is returned even if the update was the result of a patch operation.

For more information about the change feed in Azure Cosmos DB, see [Change feed in Azure Cosmos DB](change-feed.md).

## Next steps

- Learn how to [get started](partial-document-update-getting-started.md) with Partial Document Update using, .NET, Java and Node
- [Frequently asked questions](partial-document-update-faq.yml) about Partial Document Update
