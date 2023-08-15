---
title: Materialized views (preview)
titleSuffix: Azure Cosmos DB for NoSQL
description: Learn how to efficiently query a base container by using predefined filters in materialized views for Azure Cosmos DB for NoSQL.
author: AbhinavTrips
ms.author: abtripathi
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: build-2023
ms.topic: how-to
ms.date: 06/09/2023
---

# Materialized views for Azure Cosmos DB for NoSQL (preview)

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!IMPORTANT]
> The materialized view feature of Azure Cosmos DB for NoSQL is currently in preview. You can enable this feature by using the Azure portal. This preview is provided without a service-level agreement. At this time, we don't recommend that you use materialized views for production workloads. Certain features of this preview might not be supported or might have constrained capabilities. For more information, see the [supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Applications frequently are required to make queries that don't specify a partition key. In these cases, the queries might scan through all data for a small result set. The queries end up being expensive because they inadvertently run as a cross-partition query.

Materialized views, when defined, help provide a way to efficiently query a base container in Azure Cosmos DB by using filters that don't include the partition key. When users write to the base container, the materialized view is built automatically in the background. This view can have a different partition key for efficient lookups. The view also contains only fields that are explicitly projected from the base container. This view is a read-only table.

With a materialized view, you can:

- Use the view as a lookup or mapping container to persist cross-partition scans that would otherwise be expensive queries.
- Provide a SQL-based predicate (without conditions) to populate only specific fields.
- Use change feed triggers to create real-time views to simplify event-based scenarios that are commonly stored as separate containers.

The benefits of using materialized views include, but aren't limited to:

- You can implement server-side denormalization by using materialized views. With server-side denormalization, you can avoid multiple independent tables and computationally complex denormalization in client applications.
- Materialized views automatically update views to keep views consistent with the base container. This automatic update abstracts the responsibilities of your client applications that would otherwise typically implement custom logic to perform dual writes to the base container and the view.
- Materialized views optimize read performance by reading from a single view.
- You can specify throughput for the materialized view independently.
- You can configure a materialized view builder layer to map to your requirements to hydrate a view.
- Materialized views improve write performance (compared to a multi-container-write strategy) because write operations need to be written only to the base container.
- The Azure Cosmos DB implementation of materialized views is based on a pull model. This implementation doesn't affect write performance.

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](../try-free.md) before you commit.

## Enable materialized views

Use the Azure CLI to enable the materialized views feature either by using a native command or a REST API operation on your Cosmos DB for NoSQL account.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your API for NOSQL account.

1. In the resource menu, select **Settings**.

1. In the **Features** section under **Settings**, toggle the **Materialized View for NoSQL API (Preview)** option to **On**.

1. In the new dialog, select **Enable** to enable this feature for the account.

### [Azure CLI](#tab/azure-cli)

1. Sign in to the Azure CLI.

    ```azurecli
    az login
    ```

   > [!NOTE]
   > If you need to first install the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

1. Define the variables for the resource group and account name for your existing API for NoSQL account.

    ```azurecli
    # Variable for resource group name
    resourceGroupName="<resource-group-name>"
    
    # Variable for account name
    accountName="<account-name>"
    
    # Variable for Azure subscription
    subscriptionId="<subscription-id>"
    ```

1. Create a new JSON file named *capabilities.json* by using the capabilities manifest.

    ```json
    {
      "properties": {
        "enableMaterializedViews": true
      }
    }
    ```

1. Get the identifier of the account and store it in a shell variable named `$accountId`.

    ```azurecli
    accountId="/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/$accountName"
    ```

1. Enable the preview materialized views feature for the account by using the REST API and [az rest](/cli/azure/reference-index#az-rest) with an HTTP `PATCH` verb.

    ```azurecli
    az rest \
        --method PATCH \
        --uri "https://management.azure.com/$accountId?api-version=2022-11-15-preview" \
        --body @capabilities.json
    ```

---

## Create a materialized view builder

Create a materialized view builder to automatically transform data and write to a materialized view.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your API for NoSQL account.

1. In the resource menu, select **Materialized Views Builder**.

1. On the **Materialized Views Builder** page, configure the SKU and the number of instances for the builder.

   > [!NOTE]
   > This resource menu option and page appear only when the materialized views feature is enabled for the account.

1. Select **Save**.

### [Azure CLI](#tab/azure-cli)

1. Create a new JSON file named *builder.json* by using the builder manifest:

    ```json
    {
      "properties": {
        "serviceType": "materializedViewsBuilder",
        "instanceCount": 1,
        "instanceSize": "Cosmos.D4s"
      }
    }
    ```

1. Enable the materialized views builder for the account by using the REST API and `az rest` with an HTTP `PUT` verb:

    ```azurecli
    az rest \
        --method PUT \
        --uri "https://management.azure.com$accountId/services/materializedViewsBuilder?api-version=2022-11-15-preview" \
        --body @builder.json
    ```

1. Wait for a couple of minutes, and then check the status by using `az rest` again with the HTTP `GET` verb. The status in the output should now be `Running`.

    ```azurecli
    az rest \
        --method GET \
        --uri "https://management.azure.com$accountId/services/materializedViewsBuilder?api-version=2022-11-15-preview"
    ```

---

Azure Cosmos DB For NoSQL uses a materialized view builder compute layer to maintain the views.

You have the flexibility of configuring the view builder's compute instances based on your latency and lag requirements to hydrate the views. From a technical standpoint, this compute layer helps you manage connections between partitions in a more efficient manner, even when the data size is large and the number of partitions is high.

The compute containers are shared among all materialized views within an Azure Cosmos DB account. Each provisioned compute container initiates multiple tasks that read the change feed from the base container partitions and write data to the target materialized view or views. The compute container transforms the data per the materialized view definition for each materialized view in the account.

## Create a materialized view

After your account and the materialized view builder are set up, you should be able to create materialized views by using the REST API.

### [Azure portal / Azure CLI](#tab/azure-portal+azure-cli)

1. Use the Azure portal, the Azure SDK, the Azure CLI, or the REST API to create a source container that has `/accountId` as the partition key path. Name this source container `mv-src.

   > [!NOTE]
   > The `/accountId` field is used only as an example in this article. For your own containers, select a partition key that works for your solution.

1. Insert a few items in the source container. To follow the examples that are shown in this article, make sure that the items have `accountId`, `fullName`, and `emailAddress` fields. A sample item might look like this example:

    ```json
    {
      "accountId": "prikrylova-libuse",
      "emailAddress": "libpri@contoso.com",
      "name": {
        "first": "Libuse",
        "last": "Prikrylova"
      }
    }
    ```

   > [!NOTE]
   > In this example, you populate the source container with sample data. You can also create a materialized view from an empty source container.

1. Now, create a materialized view named `mv-target` with a partition key path that is different from the source container. For this example, specify `/emailAddress` as the partition key path for the `mv-target` container.

    1. First, create a definition manifest for a materialized view and save it in a JSON file named *definition.json*:

        ```json
        {
          "location": "North Central US",
          "tags": {},
          "properties": {
            "resource": {
              "id": "mv-target",
              "partitionKey": {
                "paths": [
                  "/emailAddress"
                ],
                "kind": "Hash"
              },
              "materializedViewDefinition": {
                "sourceCollectionId": "mv-src",
                "definition": "SELECT s.accountId, s.emailAddress FROM s"
              }
            },
            "options": {
              "throughput": 400
            }
          }
        }        
        ```

   > [!NOTE]
   > In the template, notice that the partitionKey path is set as `/emailAddress`. We also have more parameters to specify the source collection and the definition to populate the materialized view.

1. Now, make a REST API call to create the materialized view as defined in the *mv_definition.json* file. Use the Azure CLI to make the REST API call.

    1. Create a variable for the name of the materialized view and source database name:

        ```azurecli
        materializedViewName="mv-target"
        
        # Variable for database name used in later section
        databaseName="<database-that-contains-source-collection>"
        ```

    1. If you haven't already, get the identifier of the account and store it in a shell variable named `$accountId`.

        ```azurecli
        accountId="/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/$accountName"
        ```

    1. Make a REST API call to create the materialized view:

        ```azurecli
        az rest \
            --method PUT \
            --uri "https://management.azure.com$accountId/sqlDatabases/";\
                  "$databaseName/containers/$materializedViewName?api-version=2022-11-15-preview" \
            --body @definition.json \
            --headers content-type=application/json
        ```

    1. Check the status of the materialized view container creation by using the REST API:

        ```azurecli
        az rest \
            --method GET \
            --uri "https://management.azure.com$accountId/sqlDatabases/";\
                  "$databaseName/containers/$materializedViewName?api-version=2022-11-15-preview" \
            --headers content-type=application/json \
            --query "{mvCreateStatus: properties.Status}"
        ```

---

After the materialized view is created, the materialized view container automatically syncs changes with the source container. Try executing create, read, update, and delete (CRUD) operations in the source container. You'll see the same changes in the materialized view container.

> [!NOTE]
> Materialized view containers are read-only containers for users. The containers can be automatically modified only by a materialized view builder.

## Current limitations

There are a few limitations with the Azure Cosmos DB for NoSQL API materialized view feature while it is in preview:

- Materialized views can't be created on a container that existed before support for materialized views was enabled on the account. To use materialized views, create a new container after the feature is enabled.
- `WHERE` clauses aren't supported in the materialized view definition.
- You can project only the source container item's JSON `object` property list in the materialized view definition. Currently, the list can contain only one level of properties in the JSON tree.
- In the materialized view definition, aliases aren't supported for fields of documents.
- We recommend that you create a materialized view when the source container is still empty or has only a few items.
- Restoring a container from a backup doesn't restore materialized views. You must re-create the materialized views after the restore process is finished.
- You must delete all materialized views that are defined on a specific source container before you delete the source container.
- Point-in-time restore, hierarchical partitioning, and end-to-end encryption aren't supported on source containers that have materialized views associated with them.
- Role-based access control is currently not supported for materialized views.
- Cross-tenant customer-managed key (CMK) encryption isn't supported on materialized views.
- Currently, this feature can't be enabled if any of the following features are enabled: partition merge, analytical store, or continuous backup.

Note the additional following limitations:

- Availability zones
  - Materialized views can't be enabled on an account that has availability zone-enabled regions.
  - Adding a new region with an availability zone isn't supported after `enableMaterializedViews` is set to `true` on the account.
- Periodic backup and restore
  - Materialized views aren't automatically restored by using the restore process. You must re-create the materialized views after the restore process is finished. Then, you should configure `enableMaterializedViews` on the restored account before you create the materialized views and builders again.

## Next steps

> [!div class="nextstepaction"]
> [Data modeling and partitioning](model-partition-example.md)
