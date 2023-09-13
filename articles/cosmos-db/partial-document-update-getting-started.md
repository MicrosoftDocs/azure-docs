---
title: Get started with partial document update
titleSuffix: Azure Cosmos DB for NoSQL
description: Learn how to use the partial document update feature with the .NET, Java, and Node SDKs for Azure Cosmos DB for NoSQL.
author: AbhinavTrips
ms.author: abtripathi
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.custom: ignite-fall-2021, ignite-2022, devx-track-dotnet, devx-track-extended-java
ms.date: 05/23/2023
---

# Get started with Azure Cosmos DB Partial Document Update

[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

This article provides examples that illustrate how to use Partial Document Update with .NET, Java, and Node SDKs. It also describes common errors that you might encounter.

This article links to code samples for the following scenarios:

- Run a single patch operation
- Combine multiple patch operations
- Use conditional patch syntax based on filter predicate
- Run patch operation as part of a transaction

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.

## [.NET](#tab/dotnet)

Support for Partial Document Update (Patch API) in the [Azure Cosmos DB .NET v3 SDK](nosql/sdk-dotnet-v3.md) is available starting with version *3.23.0*. You can download it from the [NuGet Gallery](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.23.0).

> [!NOTE]
> Find a complete Partial Document Update sample in the [.NET v3 samples repository](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs) on GitHub.

- Run a single patch operation:

    ```csharp
    ItemResponse<Product> response = await container.PatchItemAsync<Product>(
        id: "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
        partitionKey: new PartitionKey("road-bikes"),
        patchOperations: new[] {
            PatchOperation.Replace("/price", 355.45)
        }
    );
    
    Product updated = response.Resource;
    ```

- Combine multiple patch operations:

    ```csharp
    List<PatchOperation> operations = new ()
    {
        PatchOperation.Add("/color", "silver"),
        PatchOperation.Remove("/used"),
        PatchOperation.Increment("/price", 50.00),
        PatchOperation.Add("/tags/-", "featured-bikes")
    };
    
    ItemResponse<Product> response = await container.PatchItemAsync<Product>(
        id: "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
        partitionKey: new PartitionKey("road-bikes"),
        patchOperations: operations
    );
    ```

- Use conditional patch syntax based on filter predicate:

    ```csharp
    PatchItemRequestOptions options = new()
    {
        FilterPredicate = "FROM products p WHERE p.used = false"
    };
    
    List<PatchOperation> operations = new ()
    {
        PatchOperation.Replace($"/price", 100.00),
    };
    
    ItemResponse<Product> response = await container.PatchItemAsync<Product>(
        id: "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
        partitionKey: new PartitionKey("road-bikes"),
        patchOperations: operations,
        requestOptions: options
    );
    ```

- Run patch operation as a part of a transaction:

    ```csharp
    TransactionalBatchPatchItemRequestOptions options = new()
    {
        FilterPredicate = "FROM products p WHERE p.used = false"
    };
    
    List<PatchOperation> operations = new ()
    {
        PatchOperation.Add($"/new", true),
        PatchOperation.Remove($"/used")
    };
    
    TransactionalBatch batch = container.CreateTransactionalBatch(
        partitionKey: new PartitionKey("road-bikes")
    );
    batch.PatchItem(
        id: "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
        patchOperations: operations,
        requestOptions: options
    );
    batch.PatchItem(
        id: "892f609b-8885-44df-a9ed-cce6c0bd2b9e",
        patchOperations: operations,
        requestOptions: options
    );
    
    TransactionalBatchResponse response = await batch.ExecuteAsync();
    bool success = response.IsSuccessStatusCode;
    ```

## [Java](#tab/java)

Support for Partial Document Update (Patch API) in the [Azure Cosmos DB Java v4 SDK](nosql/sdk-java-v4.md) is available starting with version *4.21.0*. You can either add it to the list of dependencies in your `pom.xml` or download it directly from [Maven](https://mvnrepository.com/artifact/com.azure/azure-cosmos).

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-cosmos</artifactId>
  <version>LATEST</version>
</dependency>
```

> [!NOTE]
> Find the full sample in the [Java SDK v4 samples repository](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/tree/main/src/main/java/com/azure/cosmos/examples/patch/sync) on GitHub.

- Run a single patch operation:

    ```java
    CosmosItemResponse<Product> response = container.patchItem(
        "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
        new PartitionKey("road-bikes"),
        CosmosPatchOperations
            .create()
            .replace("/price", 355.45),
        Product.class
    );

    Product updated = response.getItem();
    ```

- Combine multiple patch operations:

    ```java
    CosmosPatchOperations operations = CosmosPatchOperations
        .create()
        .add("/color", "silver")
        .remove("/used")
        .increment("/price", 50);

    CosmosItemResponse<Product> response = container.patchItem(
        "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
        new PartitionKey("road-bikes"),
        operations,
        Product.class
    );
    ```

- Use conditional patch syntax based on filter predicate:

    ```java
    CosmosPatchItemRequestOptions options = new CosmosPatchItemRequestOptions();
    options.setFilterPredicate("FROM products p WHERE p.used = false");

    CosmosPatchOperations operations = CosmosPatchOperations
        .create()
        .replace("/price", 100.00);

    CosmosItemResponse<Product> response = container.patchItem(
        "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
        new PartitionKey("road-bikes"),
        operations,
        options,
        Product.class
    );
    ```

- Run patch operation as a part of a transaction:

    ```java
    CosmosBatchPatchItemRequestOptions options = new CosmosBatchPatchItemRequestOptions();
    options.setFilterPredicate("FROM products p WHERE p.used = false");

    CosmosPatchOperations operations = CosmosPatchOperations
        .create()
        .add("/new", true)
        .remove("/used");

    CosmosBatch batch = CosmosBatch.createCosmosBatch(
        new PartitionKey("road-bikes")
    );
    batch.patchItemOperation(
        "e379aea5-63f5-4623-9a9b-4cd9b33b91d5",
        operations,
        options
    );
    batch.patchItemOperation(
        "892f609b-8885-44df-a9ed-cce6c0bd2b9e",
        operations,
        options
    );

    CosmosBatchResponse response = container.executeCosmosBatch(batch);
    boolean success = response.isSuccessStatusCode();
    ```

## [Node.js](#tab/nodejs)

Support for Partial Document Update (Patch API) in the [Azure Cosmos DB JavaScript SDK](nosql/sdk-nodejs.md) is available starting with version *3.15.0*. You can download it from the [npm Registry](https://www.npmjs.com/package/@azure/cosmos).

> [!NOTE]
> Find a complete Partial Document Update sample in the [.js v3 samples repository](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples/v3/typescript/src/ItemManagement.ts#L167) on GitHub. In the sample, as the container is created without a partition key specified, the JavaScript SDK resolves the partition key values from the items through the container's partition key definition.

- Run a single patch operation:

    ```javascript
    const operations =
    [
        { op: 'replace', path: '/price', value: 355.45 }
    ];
    
    const { resource: updated } = await container
        .item(
            'e379aea5-63f5-4623-9a9b-4cd9b33b91d5', 
            'road-bikes'
        )
        .patch(operations);
    ```

- Combine multiple patch operations:

    ```javascript
    const operations =
    [
        { op: 'add', path: '/color', value: 'silver' },
        { op: 'remove', path: '/used' }
    ];
    
    const { resource: updated } = await container
        .item(
            'e379aea5-63f5-4623-9a9b-4cd9b33b91d5', 
            'road-bikes'
        )
        .patch(operations);
    ```

- Use conditional patch syntax based on filter predicate:

    ```javascript
    const filter = 'FROM products p WHERE p.used = false'

    const operations =
    [
        { op: 'replace', path: '/price', value: 100.00 }
    ];
    
    const { resource: updated } = await container
        .item(
            'e379aea5-63f5-4623-9a9b-4cd9b33b91d5', 
            'road-bikes'
        )
        .patch(
            body = operations,
            options = filter
        );
    ```

---

## [Python (Preview)](#tab/python)

Support for Partial Document Update (Patch API) in the [Azure Cosmos DB Python SDK](nosql/sdk-python.md) is available in Preview starting with version *4.4.0b2*. You can download it from the [pip Registry](https://pypi.org/project/azure-cosmos/4.4.0b2/).

> [!NOTE]
> Find a complete Partial Document Update sample in the [python samples repository](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/cosmos/azure-cosmos/samples/document_management.py#L105C8-L122) on GitHub. 

- Run a single patch operation:

    ```python
    operations =
    [
        { op: 'replace', path: '/price', value: 355.45 }
    ]
    
    response = container.patch_item(item='e379aea5-63f5-4623-9a9b-4cd9b33b91d5', partition_key='road-bikes', patch_operations=operations)
    
    ```

- Combine multiple patch operations:

    ```python
    operations =
    [
        { op: 'add', path: '/color', value: 'silver' },
        { op: 'remove', path: '/used' }
    ]
    
    response = container.patch_item(item='e379aea5-63f5-4623-9a9b-4cd9b33b91d5', partition_key='road-bikes', patch_operations=operations)

    ```

- Use conditional patch syntax based on filter predicate:

    ```python
    filter = "from products p WHERE p.used = false"

    operations =
    [
        { op: 'replace', path: '/price', value: 100.00 }
    ]

    try:
        container.patch_item(item='e379aea5-63f5-4623-9a9b-4cd9b33b91d5', partition_key='road-bikes', patch_operations=operations, filter_predicate=filter)
    except exceptions.CosmosHttpResponseError as e:
        print('\nError occured. {0}'.format(e.message))
    
    ```

---

## Support for server-side programming

Partial Document Update operations can also be [executed on the server-side](stored-procedures-triggers-udfs.md) using stored procedures, triggers, and user-defined functions.

```javascript
this.patchDocument = function (documentLink, patchSpec, options, callback) {
    if (arguments.length < 2) {
        throw new Error(ErrorCodes.BadRequest, sprintf(errorMessages.invalidFunctionCall, 'patchDocument', 2, arguments.length));
    }
    if (patchSpec === null || !(typeof patchSpec === "object" || Array.isArray(patchSpec))) {
        throw new Error(ErrorCodes.BadRequest, errorMessages.patchSpecMustBeObjectOrArray);
    }

    var documentIdTuple = validateDocumentLink(documentLink, false);
    var collectionRid = documentIdTuple.collId;
    var documentResourceIdentifier = documentIdTuple.docId;
    var isNameRouted = documentIdTuple.isNameRouted;

    patchSpec = JSON.stringify(patchSpec);
    var optionsCallbackTuple = validateOptionsAndCallback(options, callback);

    options = optionsCallbackTuple.options;
    callback = optionsCallbackTuple.callback;

    var etag = options.etag || '';
    var indexAction = options.indexAction || '';

    return collectionObjRaw.patch(
        collectionRid,
        documentResourceIdentifier,
        isNameRouted,
        patchSpec,
        etag,
        indexAction,
        function (err, response) {
            if (callback) {
                if (err) {
                    callback(err);
                } else {
                    callback(undefined, JSON.parse(response.body), response.options);
                }
            } else {
                if (err) {
                    throw err;
                }
            }
        }
    );
}; 
```

> [!NOTE]
> Find the definition of `validateOptionsAndCallback` in the [.js DocDbWrapperScript](https://github.com/Azure/azure-cosmosdb-js-server/blob/1dbe69893d09a5da29328c14ec087ef168038009/utils/DocDbWrapperScript.js#L289) on GitHub.

Sample stored procedure for patch operation:

```javascript
function patchDemo() {
    var doc = {
        "id": "exampleDoc",
        "fields": {
            "field1": "exampleString",
            "field2": 20,
            "field3": 40
        }
    };
    
    var isAccepted = __.createDocument(__.getSelfLink(), doc, (err, doc) => {
        if (err) {
            throw err;
        }
        else {
            getContext().getResponse().setBody("Example document successfully created.");
            
            var patchSpec = [
                { "op": "add", "path": "/fields/field1", "value": "newExampleString" },
                { "op": "remove", "path": "/fields/field2" },
                { "op": "incr", "path": "/fields/field3", "value": 10 }
            ];
            
            var isAccepted = __.patchDocument(doc._self, patchSpec, (err, doc) => {
                if (err) {
                    throw err;
                }
                else {
                    getContext().getResponse().appendBody(" Example document successfully patched.");
                }
            });
            
            if (!isAccepted) throw new Error("Patch wasn't accepted");
        }
    });

    if (!isAccepted) throw new Error("Create wasn't accepted.");
}
```

## Troubleshooting

Here's some common errors that you might encounter while using this feature:

| **Error Message** | **Description** |
| ------------ | -------- |
| Invalid patch request: check syntax of patch specification. | The patch operation syntax is invalid. For more information, see [the Partial Document Update specification](partial-document-update.md#rest-api-reference-for-partial-document-update). |
| Invalid patch request: Can't patch system property `SYSTEM_PROPERTY`. | System-generated properties like `_id`, `_ts`, `_etag`, `_rid` aren't modifiable using a patch operation. For more information, see [Partial Document Update FAQs](partial-document-update-faq.yml#is-partial-document-update-supported-for-system-generated-properties-). |
| The number of patch operations can't exceed 10. | There's a limit of 10 patch operations that can be added in a single patch specification. For more information, see [Partial Document Update FAQs](partial-document-update-faq.yml#is-there-a-limit-to-the-number-of-partial-document-update-operations-). |
| For Operation(`PATCH_OPERATION_INDEX`): Index(`ARRAY_INDEX`) to operate on is out of array bounds. | The index of array element to be patched is out of bounds. |
| For Operation(`PATCH_OPERATION_INDEX`)): Node(`PATH`) to be replaced has been removed earlier in the transaction. | The path you're trying to patch doesn't exist. |
| For Operation(`PATCH_OPERATION_INDEX`): Node(`PATH`) to be removed is absent. Note: it might also have been removed earlier in the transaction. | The path you're trying to patch doesn't exist. |
| For Operation(`PATCH_OPERATION_INDEX`): Node(`PATH`) to be replaced is absent. | The path you're trying to patch doesn't exist. |
| For Operation(`PATCH_OPERATION_INDEX`): Node(`PATH`) isn't a number. | Increment operation can only work on integer and float. For more information, see: [Supported Operations](partial-document-update.md#supported-operations). |
| For Operation(`PATCH_OPERATION_INDEX`): Add Operation can only create a child object of an existing node (array or object) and can't create path recursively, no path found beyond: `PATH`. | Child paths can be added to an object or array node type. Also, to create `n`th child, `n-1`th child should be present. |
| For Operation(`PATCH_OPERATION_INDEX`): Given Operation can only create a child object of an existing node(array or object) and can't create path recursively, no path found beyond: `PATH`. | Child paths can be added to an object or array node type. Also, to create `n`th child, `n-1`th child should be present. |

## Next steps

- [Frequently asked questions about Partial Document Update in Azure Cosmos DB](partial-document-update-faq.yml)
