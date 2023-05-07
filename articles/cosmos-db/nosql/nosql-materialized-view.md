---
title: Materialized views (preview)
titleSuffix: Azure Cosmos DB NoSQL API
description: This documentation is provided as a resource for participants in the preview of Materialized View Feature for Azure Cosmos DB NoSQL API.
author: AbhinavDAIICT
ms.author: abtripathi
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 04/05/2022
ms.custom: build-2023
---

# Materialized View Feature for Azure Cosmos DB NoSQL API (preview)

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!IMPORTANT]
> Materialized View Feature for Azure Cosmos DB NoSQL API is currently in preview. You can enable this feature using the Azure portal. This preview of materialized views is provided without a service-level agreement. At this time, materialized views are not recommended for production workloads. Certain features of this preview may not be supported or may have constrained capabilities. For more information, see [supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Materialized views, when defined, help provide a means to efficiently query a base container in Azure Cosmos DB with filters that do not include partition key. When users write to the base container, the materialized view is built automatically in the background. This view can have a different partition key for efficient lookups. The view will also only contain fields explicitly projected from the base container. This view will be a read-only table.

Many a times, business use case require applications to make queries that do not specify the partition key. In such cases, the queries could scan through all data for a small result set. Such queries end up being expensive as they end up inadvertently executing as a cross-partition query.

With a materialized view feature, you can:

- Use them as lookup or mapping container to persist cross partition scans that would otherwise be expensive queries.
- Provide a SQL-based predicate (without conditions) to populate only certain fields.
- Create real-time views that simplify event-based scenarios that are commonly stored as separate collections using change feed triggers.

## Benefits of materialized views

Materialized views have many benefits that include, but aren't limited to:

- You can implement server-side denormalization using materialized views. With server-side denormalization, you can avoid multiple independent tables and computationally complex denormalization in client applications.
- Materialized views automatically update views to keep them consistent with the base container. This automatic update abstracts the responsibilities of your client applications that would otherwise typically implement custom logic to perform dual writes to the base container and the view.
- Materialized views optimize read performance by reading from a single view.
- You can specify throughput for the materialized view independently.
- You can configure a materialized view builder layer to map to your requirements to hydrate a view.
- Materialized views improve write performance (when compared to multi-container-write strategy) as write operations only need to be written to the base container.
- Additionally, the Azure Cosmos DB implementation of materialized views is based on a pull model. This implementation doesn't affect write performance.

## Get started with materialized views

Use Azure CLI to enable the materialized views feature either with a native command or a REST API operation on you Cosmos DB NoSQL API database account.

1. Sign-in to the Azure CLI.

    ```azurecli
    az login
    ```

    > [!NOTE]
    > If you do not have the Azure CLI installed, see [how to install the Azure CLI](/cli/azure/install-azure-cli).
    > For using variables as specified in subsequent sections, you need BASH in your CLI.

1. Let's define all the variables that will be required for this exercise.
    ```azurecli
    # Variable for subscriptionId
    subscriptionId="subscription-name>"
    
    # Variable for resource group name
    resourceGroupName="<resource-group-name>"
    
    # Variable for account name
    accountName="<account-name>"
    
    # Variable for database name
    databaseName="<database-name>"
    
    # Variable for new materialized view container name
    mvName="<new-materialized-view-name>"
    ```

  > [!NOTE]
  > In this example, we will set mvName to "mv-demo". After creating the Materialized View, we'll see the materialized view container with the name mv-demo in the portal

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your NoSQL API account.

1. In the resource menu (the left menu panel), select **Settings**.

1. In the **Feautres** section under **Settings**, toggle the "Off" to "On" for  **Materialized View for NoSQL API (Preview)**.

1. In the new dialog, select **Enable** to enable this feature for this account.


### [REST API](#tab/rest-api)
1. Create a new JSON file with the capabilities manifest.

    ```json
    {
      "properties": {
        "enableMaterializedViews": true
      }
    }
    ```

    > [!NOTE]
    > In this example, we named the JSON file **capabilities.json**.

1. Construct the different parts of the URL that will be used for making a REST API call to enable Materialized Views feature for the account.

    ```azurecli
   URL1="https://management.azure.com/subscriptions/"; \
   URL2="$subscriptionId/resourceGroups/"; \
   URL3="$resourceGroup/providers/"; \
   URL4="Microsoft.DocumentDb/databaseAccounts/"; \
   URL5="$accountName?api-version=2022-11-15-preview";
    ```

1. Enable the preview materialized views feature for the account using the REST API and [`az rest`](/cli/azure/reference-index#az-rest) with an HTTP `PATCH` verb.

    ```azurecli
    az rest --method PATCH --uri $URL1$URL2$URL3$URL4$URL5 --body @capabilities.json
    ```

---

## Under the hood

The Cosmos DB NoSQL API uses a materialized view builder compute layer to maintain the views.

You get the flexibility to configure the view builder's compute instances based on your latency and lag requirements to hydrate the views. From a technical stand point, this compute layer helps manage connections between partitions in a more efficient manner even when the data size is large and the number of partitions is high.

The compute containers are shared among all materialized views within an Azure Cosmos DB account. Each provisioned compute container spawns off multiple tasks that read the change feed from base container partitions and writes data to the target materialized view\[s\]. The compute container transforms the data per the materialized view definition for each materialized view in the account.

## Create a materialized view builder

Create a materialized view builder to automatically transform data and write to a materialized view.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your NoSQL API account.

1. In the resource menu, select **Materialized Views Builder**.

1. On the **Materialized Views Builder** page, configure the SKU and number of instances for the builder.

    > [!NOTE]
    > This resource menu option and page will only appear when the Materialized Views feature is enabled for the account.

1. Select **Save**.


### [REST API](#tab/rest-api)

1. Create a new JSON file with the builder manifest.

    ```json
    {
      "properties": {
        "serviceType": "materializedViewsBuilder",
        "instanceCount": 1,
        "instanceSize": "Cosmos.D4s"
      }
    }
    ```

    > [!NOTE]
    > In this example, we named the JSON file **builder.json**.

1. Enable the materialized views builder for the account using the REST API and `az rest` with an HTTP `PUT` verb.

    ```azurecli

   URL1="https://management.azure.com/subscriptions/"; \
   URL2="$subscriptionId/resourceGroups/"; \
   URL3="$resourceGroup/providers/"; \
   URL4="Microsoft.DocumentDb/databaseAccounts/"; \
   URL5="$accountName/";\
   URL6="services/materializedViewsBuilder?api-version=2022-11-15-preview";
   
	az rest --method PUT --uri $URL1$URL2$URL3$URL4$URL5$URL6 --body @builder.json
    ```

1. Wait for a couple of minutes and check the status using `az rest` again with the HTTP `GET` verb. The status in the output should now be `Running`:

    ```azurecli
        az rest --method GET --uri $URL1$URL2$URL3$URL4$URL5$URL6
    ```

---

## Create a materialized view

Once your account and Materialized View Builder is set up, you should be able to create Materialized views using  REST API.



Here are a few sample commands to create a materialized view:

1. Use Azure Portal/SDK/CLI/REST API to create the source container with accountId field as the PartitionKey. Name this container as "mv-src"
    > [!NOTE]
    > accountId is recommended only for this Get Started. Users make their own Partition Key choices as per their use case.

3.  Insert a few items in the source container. To better understand this Getting Started, please make sure that the items mandatorily have accountId, mobileNumber, and email fields . A sample item could look like this:
    ```json
    {
      "accountId": "acc-id-1",
      "email":"email-1",
      "mobile":"mobile-1"
    }
    ```
    > [!NOTE]
    > We can define Materialized View on an empty base container as well.

1. Now, let's create a materialized view named `mv-demo` with a Partition Key that is different from the source container Partition Key. Let's specify "mobile" as the Partition Key for the Materialized View container.
	1. First, we'll create an ARM template for our Materialized View and save it in the "mv_definition.json" file. Below is the content of the mv_definition file:
        ```json
          {
            "location": "North Central US",
            "tags": {},
            "properties": {
              "resource": {
                "id": "mv-demo",
                "partitionKey": {
                  "paths": [
                    "/mobile"
                  ],
                  "kind": "Hash"
                },
                "materializedViewDefinition": {
                  "sourceCollectionName": "mv-src",
                  "definition": "select * from ROOT"
                }
              },
              "options": {
                "throughput": 400
              }
            }
          }

        ```
  
	2. In the above template, notice that the partitionKey path is set as /mobile and we also have additional parameters to specify the source collection and the definition to populate the materialized view.

1. Now we make a REST API call to create the materialized view as defined in the mv_definition.json file. We'll use Azure CLI to make the REST API call.
	1. We already have the subscriptionId, resourceGroup, databaseAccount, databaseName, and mvName variables set in bash. We'll construct parts of the URL using these variables as below:

        ```azurecli
        URL1="https://management.azure.com/subscriptions/"; \
        URL2="$subscriptionId/resourceGroups/"; \
        URL3="$resourceGroup/providers/"; \
        URL4="Microsoft.DocumentDb/databaseAccounts/"; \
        URL5="$accountName/sqlDatabases/";\
        URL6="$databaseName/containers/";\
        URL7="$mvName?api-version=2022-11-15-preview";
        ```
	1. Now we will make the REST API call to create the Materilized View as below:
        ```azurecli
        az rest --method PUT body @mv_definition.json --uri $URL1$URL2$URL3$URL4$URL5$URL6$URL7 --headers content-type=application/json
        ```
	1. Check the status of MV container creation using the REST API call
        ```azurecli
        az rest --method GET  --uri $URL1$URL2$URL3$URL4$URL5$URL6$URL7 --headers content-type=application/json --query "{mvCreateStatus: properties.Status}"
        ```
---
Once the materialized  view is created, the materialized view container will automatically sync changes with the source container. Try executing CRUD operations in the source container and observe the same changes in the mv container. 
  > [!NOTE]
  > Materialized View containers are read-only container for the end-user so they can only be modified automatically by the Materialized View Builders.



## Current limitations

There are a few limitations with the Cosmos DB NoSQL API Materialized View Feature while in preview:

- Materialized views can't be created on a table that existed before support for materialized views was enabled on the account. To use materialized views, create a new table after the feature is enabled.
- Where clause in the materialized view definition is not supported.
- You can project source container items’ Json object property list only in materialized view definition. At present, the list can be only first level of properties in JSON tree.
- In materialized view definition, aliases are not supported for fields of documents.
- It is recommended that MV is created when the source container is still empty or has very few items.  This is a temporary issue and a fix is underway.
- Restoring from backups does not restore materialized views. You need to re-create the materialized views after the restore process is complete.
- All materialized views defined on a specific source container must be deleted before deleting the source container.
- PITR, hierarchical partitioning, end to end encryption features are not supported on source containers on which materialized views are created.
- Role based Access Control is currently not supported.
- Cross-tenant customer-managed-key based encryption is not supported on materialized views.

In addition to the above limitations, consider the following extra limitations:

- Availability zones
  - Materialized views can't be enabled on an account that has availability zone enabled regions.
  - Adding a new region with an availability zone isn't supported once `enableMaterializedViews` is set to true on the account.
- Periodic backup and restore
  - Materialized views aren't automatically restored with the restore process. You'll need to re-create the materialized views after the restore process is complete. Then, you should configure `enableMaterializedViews` on their restored account before creating the materialized views and builders again.


## Next steps

> [!div class="nextstepaction"]
> 1.	[Understanding cross-partition queries in Azure Cosmos DB](http://https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/how-to-query-container "Understanding cross-partition queries in Azure Cosmos DB")
>2.	[Data modelling and partitioning ](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/model-partition-example "Data modelling and partitioning ")

