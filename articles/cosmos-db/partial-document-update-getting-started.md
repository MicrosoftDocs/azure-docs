---
title: Getting started with Azure Cosmos DB Partial Document Update
description: This article provides example for how to use Partial Document Update with .NET, Java, Node SDKs
author: rothja
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 12/09/2021
ms.author: jroth
ms.custom: ignite-fall-2021
---

# Azure Cosmos DB Partial Document Update: Getting Started
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

This article provides examples for how to use Partial Document Update with .NET, Java, Node SDKs, along with common errors that you may encounter. Code samples for the following scenarios have been provided:

- Executing a single patch operation
- Combining multiple patch operations
- Conditional patch syntax based on filter predicate
- Executing patch operation as part of a Transaction

## .NET

Support for Partial document update (Patch API) in the [Azure Cosmos DB .NET v3 SDK](sql/sql-api-sdk-dotnet-standard.md) is available from version *3.23.0* onwards. You can download it from the [NuGet Gallery](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.23.0)

> [!NOTE]
> A complete partial document update sample can be found in the [.NET v3 samples repository](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs) on GitHub.

**Executing a single patch operation**

```csharp
ItemResponse<SalesOrder> response = await container.PatchItemAsync<SalesOrder>(
    id: order.Id,
    partitionKey: new PartitionKey(order.AccountNumber),
    patchOperations: new[] { PatchOperation.Replace("/TotalDue", 0) });

SalesOrder updated = response.Resource;
```

**Combining multiple patch operations**

```csharp
List<PatchOperation> patchOperations = new List<PatchOperation>();
patchOperations.Add(PatchOperation.Add("/nonExistentParent/Child", "bar"));
patchOperations.Add(PatchOperation.Remove("/cost"));
patchOperations.Add(PatchOperation.Increment("/taskNum", 6));
patchOperations.Add(patchOperation.Set("/existingPath/newproperty",value));

container.PatchItemAsync<item>(
                id: 5,
                partitionKey: new PartitionKey("task6"),
                patchOperations: patchOperations );
```

**Conditional patch syntax based on filter predicate**

```csharp
PatchItemRequestOptions patchItemRequestOptions = new PatchItemRequestOptions
{
    FilterPredicate = "from c where (c.TotalDue = 0 OR NOT IS_DEFINED(c.TotalDue))"
};
response = await container.PatchItemAsync<SalesOrder>(
    id: order.Id,
    partitionKey: new PartitionKey(order.AccountNumber),
    patchOperations: new[] { PatchOperation.Replace("/ShippedDate", DateTime.UtcNow) },
    patchItemRequestOptions);

SalesOrder updated = response.Resource;
```

**Executing patch operation as a part of a Transaction**


```csharp
List<PatchOperation> patchOperationsUpdateTask = new List<PatchOperation>()
            {
                PatchOperation.Add("/children/1/pk", "patched"),
                PatchOperation.Remove("/description"),
                PatchOperation.Add("/taskNum", 8),
		        PatchOperation.Replace("/taskNum", 12)
            };

TransactionalBatchPatchItemRequestOptions requestOptionsFalse = new TransactionalBatchPatchItemRequestOptions()
            {
                FilterPredicate = "from c where c.taskNum = 3"
            };

TransactionalBatchInternal transactionalBatchInternalFalse = (TransactionalBatchInternal)containerInternal.CreateTransactionalBatch(new Cosmos.PartitionKey(testItem.pk));
transactionalBatchInternalFalse.PatchItem(id: testItem1.id, patchOperationsUpdateTaskNum12, requestOptionsFalse);
transactionalBatchInternalFalse.PatchItem(id: testItem2.id, patchOperationsUpdateTaskNum12, requestOptionsFalse);
transactionalBatchInternalFalse.ExecuteAsync());
```

## Java

Support for Partial document update (Patch API) in the [Azure Cosmos DB Java v4 SDK](sql/sql-api-sdk-java-v4.md) is available from version *4.21.0* onwards. You can either add it to the list of dependencies in your `pom.xml` or download it directly from [Maven](https://mvnrepository.com/artifact/com.azure/azure-cosmos).

```xml
<dependency>
	<groupId>com.azure</groupId>
	<artifactId>azure-cosmos</artifactId>
	<version>4.21.0</version>
</dependency>
```

> [!NOTE]
> The full sample can be found in the [Java SDK v4 samples repository](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/tree/main/src/main/java/com/azure/cosmos/examples/patch/sync) on GitHub

**Executing a single patch operation**

```java
CosmosPatchOperations cosmosPatchOperations = CosmosPatchOperations.create();
cosmosPatchOperations.add("/registered", true);

CosmosPatchItemRequestOptions options = new CosmosPatchItemRequestOptions();

CosmosItemResponse<Family> response = this.container.patchItem(id, new PartitionKey(partitionKey),
                                      cosmosPatchOperations, options, Family.class);
```

**Combining multiple patch operations**

```java
CosmosPatchOperations cosmosPatchOperations = CosmosPatchOperations.create();
cosmosPatchOperations.add("/registered", true)
                     .replace("/parents/0/familyName", "Doe");
CosmosPatchItemRequestOptions options = new CosmosPatchItemRequestOptions();

CosmosItemResponse<Family> response = this.container.patchItem(id, new PartitionKey(partitionKey),
                                      cosmosPatchOperations, options, Family.class);
```

**Conditional patch syntax based on filter predicate**

```java
CosmosPatchOperations cosmosPatchOperations = CosmosPatchOperations.create();
                                                                   .add("/vaccinated", true);
CosmosPatchItemRequestOptions options = new CosmosPatchItemRequestOptions();
options.setFilterPredicate("from f where f.registered = true");

CosmosItemResponse<Family> response = this.container.patchItem(id, new PartitionKey(partitionKey),
                                      cosmosPatchOperations, options, Family.class);
```

**Executing patch operation as a part of a Transaction**

```java
CosmosBatch batch = CosmosBatch.createCosmosBatch(new PartitionKey(family.getLastName()));
batch.createItemOperation(family);

CosmosPatchOperations cosmosPatchOperations = CosmosPatchOperations.create().add("/registered", false);
batch.patchItemOperation(family.getId(), cosmosPatchOperations);

CosmosBatchResponse response = container.executeCosmosBatch(batch);
if (response.isSuccessStatusCode()) {
    // if transactional batch succeeds   
}
```

## Node.js

Support for Partial document update (Patch API) in the [Azure Cosmos DB JavaScript SDK](sql/sql-api-sdk-node.md) is available from version *3.15.0* onwards. You can download it from the [NPM Registry](https://www.npmjs.com/package/@azure/cosmos/v/3.15.0)

> [!NOTE]
> A complete partial document update sample can be found in the [.js v3 samples repository](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples/v3/typescript/src/ItemManagement.ts#L167) on GitHub.

**Executing a single patch operation**

```javascript
const patchSource = itemDefList[1];

const replaceOperation: PatchOperation[] = 
    [{ 
      op: "replace", 
      path: "/lastName", 
      value: "Martin" 
    }];

const { resource: patchSource1 } = await container.item(patchSource.lastName).patch(replaceOperation); 
console.log(`Patched ${patchSource1.lastName} to new ${patchSource1.lastName}.`); 
```

**Combining multiple patch operations**

```javascript
const multipleOperations: PatchOperation[] = [ 
    { 
      op: "add", 
      path: "/aka", 
      value: "MeFamily" 
    }, 
    { 
      op: "add", 
      path: "/years", 
      value: 12 
    }, 
    { 
      op: "replace", 
      path: "/lastName", 
      value: "Jose" 
    }, 
    { 
      op: "remove", 
      path: "/parents" 
    }, 
    { 
      op: "set", 
      path: "/children/firstName", 
      value: "Anderson" 
    }, 
    { 
      op: "incr", 
      path: "/years", 
      value: 5 
    } 
  ]; 

const { resource: patchSource2  } = await container.item(patchSource.id).patch(multipleOperations); 
 ```

**Conditional patch syntax based on filter predicate**

```javascript
const operations : PatchOperation[] = [ 
    { 
      op: "add", 
      path: "/newImproved", 
      value: "it works" 
    } 
  ]; 

const condition = "from c where NOT IS_DEFINED(c.newImproved)"; 

const { resource: patchSource3 } = await container 
    .item(patchSource.id) 
    .patch({ condition, operations }); 

console.log(`Patched ${patchSource3} to new ${patchSource3}.`); 
```

## Support for Server-Side programming

Partial Document Update operations can also be [executed on the server-side](stored-procedures-triggers-udfs.md) using Stored procedures, triggers, and user-defined functions.


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
> Definition of validateOptionsAndCallback can be found in the [.js DocDbWrapperScript](https://github.com/Azure/azure-cosmosdb-js-server/blob/1dbe69893d09a5da29328c14ec087ef168038009/utils/DocDbWrapperScript.js#L289) on GitHub.


**Sample parameter for patch operation**

```javascript
function () {
   var doc = {
      "id": "exampleDoc",
      "field1": {
         "field2": 10,
         "field3": 20
      }
   };
   var isAccepted = __.createDocument(__.getSelfLink(), doc, (err, doc) => {
         if (err) throw err;
         var patchSpec = [
            {"op": "add", "path": "/field1/field2", "value": 20}, 
            {"op": "remove", "path": "/field1/field3"}
         ];
         isAccepted = __.patchDocument(doc._self, patchSpec, (err, doc) => {
               if (err) throw err;
               else {
                  getContext().getResponse().setBody(docPatched);
               }
            }
         }
         if(!isAccepted) throw new Error("patch was't accepted")
      }
   }
   if(!isAccepted) throw new Error("create wasn't accepted")
}
```

## Troubleshooting

Here is a list of common errors that you might encounter while using this feature:

| **Error Message** | **Description** |
| ------------ | -------- |
| Invalid patch request: check syntax of patch specification| The Patch operation syntax is invalid. Please review [the specification](partial-document-update.md#rest-api-reference-for-partial-document-update)
| Invalid patch request: Cannot patch system property `SYSTEM_PROPERTY`. | Patching system-generated properties like `_id`, `_ts`, `_etag`, `_rid` is not supported. To learn more: [Partial Document Update FAQs](partial-document-update-faq.yml#is-partial-document-update-supported-for-system-generated-properties-) 
| The number of patch operations cannot exceed 10 | There is a limit of 10 patch operations that can be added in a single patch specification. To learn more: [Partial Document Update FAQs](partial-document-update-faq.yml#is-there-a-limit-to-the-number-of-partial-document-update-operations-)
| For Operation(`PATCH_OPERATION_INDEX`): Index(`ARRAY_INDEX`) to operate on is out of array bounds | The index of array element to be patched is out of bounds 
| For Operation(`PATCH_OPERATION_INDEX`)): Node(`PATH`) to be replaced has been removed earlier in the transaction.| The path you are trying to patch does not exist.
| For Operation(`PATCH_OPERATION_INDEX`): Node(`PATH`) to be removed is absent. Note: it may also have been removed earlier in the transaction.  | The path you are trying to patch does not exist.
| For Operation(`PATCH_OPERATION_INDEX`): Node(`PATH`) to be replaced is absent. | The path you are trying to patch does not exist.
| For Operation(`PATCH_OPERATION_INDEX`): Node(`PATH`) is not a number.| Increment operation can only work on integer and float. To learn more: [Supported Operations](partial-document-update.md#supported-operations)
| For Operation(`PATCH_OPERATION_INDEX`): Add Operation can only create a child object of an existing node(array or object) and cannot create path recursively, no path found beyond: `PATH`. | Child paths can be added to an object or array node type. Also, to create `n`th child, `n-1`th child should be present 
| For Operation(`PATCH_OPERATION_INDEX`): Given Operation can only create a child object of an existing node(array or object) and cannot create path recursively, no path found beyond: `PATH`. | Child paths can be added to an object or array node type. Also, to create `n`th child, `n-1`th child should be present 

## Next steps

- Learn more about conceptual overview of [Partial Document Update](partial-document-update.md)
