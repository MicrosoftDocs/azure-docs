---
title: Materialized views (preview)
titleSuffix: Azure Cosmos DB for Apache Cassandra
description: This documentation is provided as a resource for participants in the preview of Azure Cosmos DB Cassandra API Materialized View.
author: dileepraotv-github
ms.author: turao
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 11/17/2022
ms.custom: ignite-2022, devx-track-azurecli
---

# Materialized views in Azure Cosmos DB for Apache Cassandra (preview)

[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

> [!IMPORTANT]
> Materialized views in Azure Cosmos DB for Cassandra is currently in preview. You can enable this feature using the Azure portal. This preview of materialized views is provided without a service-level agreement. At this time, materialized views are not recommended for production workloads. Certain features of this preview may not be supported or may have constrained capabilities. For more information, see [supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Materialized views, when defined, help provide a means to efficiently query a base table (or container in Azure Cosmos DB) with filters that aren't primary keys. When users write to the base table, the materialized view is built automatically in the background. This view can have a different primary key for efficient lookups. The view will also only contain columns explicitly projected from the base table. This view will be a read-only table.

You can query a column store without specifying a partition key by using secondary indexes. However, the query won't be effective for columns with high or low cardinality. The query could scan through all data for a small result set. Such queries end up being expensive as they end up inadvertently executing as a cross-partition query.

With a materialized view, you can:

- Use as lookup or mapping table to persist cross partition scans that would otherwise be expensive queries.
- Provide a SQL-based conditional predicate to populate only certain columns and data that meet the pre-condition.
- Create real-time views that simplify event-based scenarios that are commonly stored as separate collections using change feed triggers.

## Benefits of materialized views

Materialized views have many benefits that include, but aren't limited to:

- You can implement server-side denormalization using materialized views. With server-side denormalization, you can avoid multiple independent tables and computationally complex denormalization in client applications.
- Materialized views automatically updating views to keep them consistent with the base table. This automatic update abstracts the responsibilities of your client applications with would typically implement custom logic to perform dual writes to the base table and the view.
- Materialized views optimize read performance by reading from a single view.
- You can specify throughput for the materialized view independently.
- You can configure a materialized view builder layer to map to your requirements to hydrate a view.
- Materialized views improve write performance as write operations only need to be written to the base table.
- Additionally, the Azure Cosmos DB implementation of materialized views is based on a pull model. This implementation doesn't affect write performance.

## Get started with materialized views

Create new API for Cassandra accounts by using the Azure CLI to enable the materialized views feature either with a native command or a REST API operation.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your API for Cassandra account.

1. In the resource menu, select **Settings**.

1. In the **Settings** section, select **Materialized View for Cassandra API (Preview)**.

1. In the new dialog, select **Enable** to enable this feature for this account.

    :::image type="content" source="media/materialized-views/enable-in-portal.png" lightbox="media/materialized-views/enable-in-portal.png" alt-text="Screenshot of the Materialized Views feature being enabled in the Azure portal.":::

### [Azure CLI](#tab/azure-cli)

1. Sign-in to the Azure CLI.

    ```azurecli
    az login
    ```

    > [!NOTE]
    > If you do not have the Azure CLI installed, see [how to install the Azure CLI](/cli/azure/install-azure-cli).

1. Install the [`cosmosdb-preview`](https://github.com/azure/azure-cli-extensions/tree/main/src/cosmosdb-preview) extension.

    ```azurecli
    az extension add \
        --name cosmosdb-preview
    ```

1. Create shell variables for `accountName` and `resourceGroupName`.

    ```azurecli
    # Variable for resource group name
    resourceGroupName="<resource-group-name>"
    
    # Variable for account name
    accountName="<account-name>"
    ```

1. Enable the preview materialized views feature for the account using [`az cosmosdb update`](/cli/azure/cosmosdb#az-cosmosdb-update).

    ```azurecli
    az cosmosdb update \
        --resource-group $resourceGroupName \
        --name $accountName \
        --enable-materialized-views true \
        --capabilities CassandraEnableMaterializedViews
    ```

### [REST API](#tab/rest-api)

1. Sign-in to the Azure CLI.

    ```azurecli
    az login
    ```

    > [!NOTE]
    > If you do not have the Azure CLI installed, see [how to install the Azure CLI](/cli/azure/install-azure-cli).

1. Create shell variables for `accountName` and `resourceGroupName`.

    ```azurecli
    # Variable for resource group name
    resourceGroupName="<resource-group-name>"
    
    # Variable for account name
    accountName="<account-name>"
    ```

1. Create a new JSON file with the capabilities manifest.

    ```json
    {
      "properties": {
        "capabilities": [
          {
            "name": "CassandraEnableMaterializedViews"
          }
        ],
        "enableMaterializedViews": true
      }
    }
    ```

    > [!NOTE]
    > In this example, we named the JSON file **capabilities.json**.

1. Get the unique identifier for your existing account using [`az cosmosdb show`](/cli/azure/cosmosdb#az-cosmosdb-show).

    ```azurecli
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $accountName \
        --query id
    ```

    Store the unique identifier in a shell variable named `$uri`.

    ```azurecli
    uri=$(
        az cosmosdb show \
            --resource-group $resourceGroupName \
            --name $accountName \
            --query id \
            --output tsv
    )
    ```

1. Enable the preview materialized views feature for the account using the REST API and [`az rest`](/cli/azure/reference-index#az-rest) with an HTTP `PATCH` verb.

    ```azurecli
    az rest \
        --method PATCH \
        --uri "https://management.azure.com/$uri/?api-version=2021-11-15-preview" \
        --body @capabilities.json 
    ```

---

## Under the hood

The API for Cassandra uses a materialized view builder compute layer to maintain the views.

You get the flexibility to configure the view builder's compute instances based on your latency and lag requirements to hydrate the views. From a technical stand point, this compute layer helps manage connections between partitions in a more efficient manner even when the data size is large and the number of partitions is high.

The compute containers are shared among all materialized views within an Azure Cosmos DB account. Each provisioned compute container spawns off multiple tasks that read the change feed from base table partitions and writes data to the target materialized view\[s\]. The compute container transforms the data per the materialized view definition for each materialized view in the account.

## Create a materialized view builder

Create a materialized view builder to automatically transform data and write to a materialized view.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your API for Cassandra account.

1. In the resource menu, select **Materialized Views Builder**.

1. On the **Materialized Views Builder** page, configure the SKU and number of instances for the builder.

    > [!NOTE]
    > This resource menu option and page will only appear when the Materialized Views feature is enabled for the account.

1. Select **Save**.

### [Azure CLI](#tab/azure-cli)

1. Enable the materialized views builder for the account using [`az cosmosdb service create`](/cli/azure/cosmosdb/service#az-cosmosdb-service-create).

    ```azurecli
    az cosmosdb service create \
        --resource-group $resourceGroupName \
        --name materialized-views-builder \
        --account-name $accountName \
        --count 1 \
        --kind MaterializedViewsBuilder \
        --size Cosmos.D4s
    ```

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
    az rest \
        --method PUT \
        --uri "https://management.azure.com/$uri/services/materializedViewsBuilder?api-version=2021-11-15-preview" \
        --body @builder.json 
    ```

1. Wait a couple of minutes and check the status using `az rest` again with the HTTP `GET` verb. The status in the output should now be `Running`:

    ```azurecli
        az rest \
            --method GET \
            --uri "https://management.azure.com/$uri/services/materializedViewsBuilder?api-version=2021-11-15-preview"
    ```

---

## Create a materialized view

Once your account and Materialized View Builder is set up, you should be able to create Materialized views using CQLSH.

> [!NOTE]
> If you do not already have the standalone CQLSH tool installed, see [install the CQLSH Tool](support.md#cql-shell). You should also [update your connection string](manage-data-cqlsh.md#update-your-connection-string) in the tool.

Here are a few sample commands to create a materialized view:

1. First, create a **keyspace** name `uprofile`.

    ```sql
    CREATE KEYSPACE IF NOT EXISTS uprofile WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 };
    ```

1. Next, create a table named `user` within the keyspace.

    ```sql
    CREATE TABLE IF NOT EXISTS uprofile.USER (user_id INT PRIMARY KEY, user_name text, user_bcity text);
    ```

1. Now, create a materialized view named `user_by_bcity` within the same keyspace. Specify, using a query, how data is projected into the view from the base table.

    ```sql
    CREATE MATERIALIZED VIEW uprofile.user_by_bcity AS 
    SELECT
        user_id,
        user_name,
        user_bcity 
    FROM
        uprofile.USER 
    WHERE
        user_id IS NOT NULL 
        AND user_bcity IS NOT NULL PRIMARY KEY (user_bcity, user_id);
    ```

1. Insert rows into the base table.

    ```sql
    INSERT INTO
        uprofile.USER (user_id, user_name, user_bcity) 
    VALUES
        (
            101, 'johnjoe', 'New York' 
        );
    
    INSERT INTO
        uprofile.USER (user_id, user_name, user_bcity) 
    VALUES
        (
            102, 'james', 'New York' 
        );
    ```

1. Query the materialized view.

    ```sql
    SELECT * FROM user_by_bcity; 
    ```

1. Observe the output from the materialized view.

    ```output
     user_bcity | user_id | user_name 
    ------------+---------+----------- 
       New York |     101 |   johnjoe 
       New York |     102 |     james 
    
    (2 rows) 
    ```

Optionally, you can also use the resource provider to create or update a materialized view.

- [Create or Update a view in API for Cassandra](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/cassandra-resources/create-update-cassandra-view)
- [Get a view in API for Cassandra](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/cassandra-resources/get-cassandra-view)
- [List views in API for Cassandra](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/cassandra-resources/list-cassandra-views)
- [Delete a view in API for Cassandra](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/cassandra-resources/delete-cassandra-view)
- [Update the throughput of a view in API for Cassandra](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/cassandra-resources/update-cassandra-view-throughput)

## Current limitations

There are a few limitations with the API for Cassandra's preview implementation of materialized views:

- Materialized views can't be created on a table that existed before support for materialized views was enabled on the account. To use materialized views, create a new table after the feature is enabled.
- For the materialized view definition’s `WHERE` clause, only `IS NOT NULL` filters are currently allowed.
- After a materialized view is created against a base table, `ALTER TABLE ADD` operations aren't allowed on the base table’s schema. `ALTER TABLE APP` is allowed only if none of the materialized views have selected `*` in their definition.
- There are limits on partition key size (**2 Kb**) and total length of clustering key size (**1 Kb**). If this size limit is exceeded, the responsible message will end up in poison message queue.
- If a base table has user-defined types (UDTs) and materialized view definition has either `SELECT * FROM` or has the UDT in one of projected columns, UDT updates aren't permitted on the account.
- Materialized views may become inconsistent with the base table for a few rows after automatic regional failover. To avoid this inconsistency, rebuild the materialized view after the failover.
- Creating materialized view builder instances with **32 cores** isn't supported. If needed, you can create multiple builder instances with a smaller number of cores.

In addition to the above limitations, consider the following extra limitations:

- Availability zones
  - Materialized views can't be enabled on an account that has availability zone enabled regions.
  - Adding a new region with an availability zone isn't supported once `enableMaterializedViews` is set to true on the account.
- Periodic backup and restore
  - Materialized views aren't automatically restored with the restore process. You'll need to re-create the materialized views after the restore process is complete. Then, you should configure `enableMaterializedViews` on their restored account before creating the materialized views and builders again.
- Apache Cassandra
  - Defining conflict resolution policy on materialized views isn't allowed.
  - Write operations aren't allowed on materialized views.
  - Cross document queries and use of aggregate functions aren't supported on materialized views.
  - A materialized view's schema can't be modified after creation.
  - Deleting the base table isn't allowed if at least one materialized view is defined on it. All the views must first be deleted and then the base table can be deleted.
  - Defining materialized views on containers with static columns isn't allowed.

## Next steps

> [!div class="nextstepaction"]
> [Review frequently asked questions (FAQ) about materialized views in API for Cassandra](materialized-views-faq.yml)
