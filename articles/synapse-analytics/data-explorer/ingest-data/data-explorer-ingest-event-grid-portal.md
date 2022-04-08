---
title: Ingest data from Event Grid into Azure Synapse Data Explorer (Preview)
description: Learn how to ingest (load) data into Azure Synapse Data Explorer from Event Grid.
ms.topic: how-to
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
ms.service: synapse-analytics
ms.subservice: data-explorer

# Customer intent: As a database administrator, I want Azure Synapse Data Explorer to track my blob storage and ingest new blobs.
---

# Ingest blobs into Azure Synapse Data Explorer by subscribing to Event Grid notifications (Preview)

<!-- > [!div class="op_single_selector"]
> * [One-click](one-click-ingestion-new-table.md)
> * [Portal](ingest-data-event-grid.md)
> * [C#](data-connection-event-grid-csharp.md)
> * [Python](data-connection-event-grid-python.md)
> * [Azure Resource Manager template](data-connection-event-grid-resource-manager.md) -->

[!INCLUDE [data-connector-intro](../includes/data-explorer-ingest-data-intro.md)]

In this article, you learn how to ingest blobs from your storage account into Azure Synapse Data Explorer using an Event Grid data connection. You'll create an Event Grid data connection that sets an [Azure Event Grid](../../../event-grid/overview.md) subscription. The Event Grid subscription routes events from your storage account to Data Explorer via an Azure Event Hub. Then you'll see an example of the data flow throughout the system.

For general information about ingesting into Data Explorer from Event Grid, see [Connect to Event Grid](data-explorer-ingest-event-grid-overview.md).<!-- To create resources manually in the Azure portal, see [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md). -->

## Prerequisites

[!INCLUDE [data-explorer-ingest-prerequisites](../includes/data-explorer-ingest-prerequisites.md)]

- Create a target table to which Event Hubs will send data
    1. In Synapse Studio, on the left-side pane, select **Develop**.
    1. Under **KQL scripts**, Select **&plus;** (Add new resource) > **KQL script**. On the right-side pane, you can name your script.
    1. In the **Connect to** menu, select *contosodataexplorer*.
    1. In the **Use database** menu, select *TestDatabase*.
    1. Paste in the following command, and select **Run** to create the table.

        ```Kusto
        .create table TestTable (TimeStamp: datetime, Value: string, Source:string)
        ```

        > [!TIP]
        > Verify that the table was successfully created. On the left-side pane, select **Data**, select the *contosodataexplorer* more menu, and then select **Refresh**. Under *contosodataexplorer*, expand **Tables** and make sure that the *TestTable* table appears in the list.

    1. Copy the following command into the window and select **Run** to map the incoming JSON data to the column names and data types of the table (TestTable).

        ```Kusto
        .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"TimeStamp","path":"$.TimeStamp"},{"column":"Value","path":"$.Value"},{"column":"Source","path":"$.Source"}]'
        ```

* Create [a storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).
* Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](../../../storage/blobs/data-lake-storage-introduction.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create an Event Grid data connection

Now connect the storage account to Data Explorer, so that data flowing into the storage is streamed to the test table. This connection can be created in the Azure portal under Data Explorer.

1. Under the Data Explorer pool you created, select **Databases** > **TestDatabase**.

    :::image type="content" source="../media/ingest-data-event-grid/select-test-database.png" alt-text="Select test database.":::

1. Select **Data connections** and **Add data connection**.

    :::image type="content" source="../media/ingest-data-event-grid/event-hub-connection.png" alt-text="Select data ingestion and Add data connection.":::

#### Data connection - Basics tab

1. Select the connection type: **Blob storage**.

1. Fill out the form with the following information:

    :::image type="content" source="../media/ingest-data-event-grid/data-connection-basics.png" alt-text="Fill out Event Grid form with connection basics.":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Data connection name | *test-grid-connection* | The name of the connection that you want to create in Data Explorer.|
    | Storage account subscription | Your subscription ID | The subscription ID where your storage account is.|
    | Storage account | *gridteststorage1* | The name of the storage account that you created previously.|
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. |
    | Resources creation | *Automatic* | Define whether you want Data Explorer to create an Event Grid Subscription, an Event Hub namespace, and an Event Hub for you. <!-- To create resources manually, see [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md) -->|

1. Select **Filter settings** if you want to track specific subjects. Set the filters for the notifications as follows:
    * **Prefix** field is the *literal* prefix of the subject. As the pattern applied is *startswith*, it can span multiple containers, folders, or blobs. No wildcards are allowed.
        * To define a filter on the blob container, the field *must* be set as follows: *`/blobServices/default/containers/[container prefix]`*.
        * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), the field *must* be set as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
    * **Suffix** field is the *literal* suffix of the blob. No wildcards are allowed.
    * **Case-Sensitive** field indicates whether the prefix and suffix filters are case-sensitive
    * For more information about filtering events, see [Blob storage events](../../../storage/blobs/storage-blob-event-overview.md#filtering-events).

    :::image type="content" source="../media/ingest-data-event-grid/filter-settings.png" alt-text="Filter settings Event Grid.":::

1. Select **Next: Ingest properties**.

> [!NOTE]
> We recommend updating the data connection to use managed identities to access the storage account as soon as soon as the option becomes available for your cluster.

#### Data connection - Ingest properties tab

1. Fill out the form with the following information. Table and mapping names are case-sensitive:

   :::image type="content" source="../media/ingest-data-event-grid/data-connection-ingest-properties.png" alt-text="Review and create table and mapping ingestion properties.":::

    Ingest properties:

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Table name | *TestTable* | The table you created in **TestDatabase**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHEAVRO, RAW, and W3CLOG. Supported compression options are Zip and Gzip. |
    | Mapping | *TestMapping* | The mapping you created in **TestDatabase**, which maps incoming JSON data to the column names and data types of **TestTable**.|
    | Advanced settings | *My data has headers* | Ignores headers. Supported for *SV type files.|

   > [!NOTE]
   > You don't have to specify all **Default routing settings**. Partial settings are also accepted.
1. Select **Next: Review + Create**

#### Data connection - Review + Create tab

1. Review the resources that were auto created for you and select **Create**.

    :::image type="content" source="../media/ingest-data-event-grid/create-event-grid-data-connection-review-create.png" alt-text="Review and create data connection for Event Grid.":::

### Deployment

Wait until the deployment is completed. If your deployment failed, select **Operation details** next to the failed stage to get more information for the failure reason. Select **Redeploy** to try to deploy the resources again. You can alter the parameters before deployment.

:::image type="content" source="../media/ingest-data-event-grid/deploy-event-grid-resources.png" alt-text="Deploy Event Grid resources.":::

## Generate sample data

Now that Data Explorer and the storage account are connected, you can create sample data.

### Upload blob to the storage container

We'll work with a small shell script that issues a few basic Azure CLI commands to interact with Azure Storage resources. This script does the following actions:

1. Creates a new container in your storage account.
1. Uploads an existing file (as a blob) to that container.
1. Lists the blobs in the container.

You can use [Azure Cloud Shell](../../../cloud-shell/overview.md) to execute the script directly in the portal.

Save the data into a file and upload it with this script:

```json
{"TimeStamp": "1987-11-16 12:00","Value": "Hello World","Source": "TestSource"}
```

```azurecli
    #!/bin/bash
    ### A simple Azure Storage example script

    export AZURE_STORAGE_ACCOUNT=<storage_account_name>
    export AZURE_STORAGE_KEY=<storage_account_key>

    export container_name=<container_name>
    export blob_name=<blob_name>
    export file_to_upload=<file_to_upload>
    export destination_file=<destination_file>

    echo "Creating the container..."
    az storage container create --name $container_name

    echo "Uploading the file..."
    az storage blob upload --container-name $container_name --file $file_to_upload --name $blob_name --metadata "rawSizeBytes=1024"

    echo "Listing the blobs..."
    az storage blob list --container-name $container_name --output table

    echo "Done"
```

> [!NOTE]
> To achieve the best ingestion performance, the *uncompressed* size of the compressed blobs submitted for ingestion must be communicated. Because Event Grid notifications contain only basic details, the size information must be explicitly communicated. The uncompressed size information can be provided by setting the `rawSizeBytes` property on the blob metadata with the *uncompressed* data size in bytes.

### Rename blob

If you're ingesting data from ADLSv2 storage and have defined *Blob renamed* as the event type for the data connection, the trigger for blob ingestion is blob renaming. To rename a blob, navigate to the blob in Azure portal, right-click on the blob and select **Rename**:

   :::image type="content" source="../media/ingest-data-event-grid/rename-blob-in-the-portal.png" alt-text="Rename blob in Azure portal.":::

### Ingestion properties

You can specify the [ingestion properties](data-explorer-ingest-event-grid-overview.md#ingestion-properties) of the blob ingestion via the blob metadata.

> [!NOTE]
> Data Explorer won't delete the blobs post ingestion.
> Retain the blobs for three to five days.
> Use [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage blob deletion.

## Review the data flow

> [!NOTE]
> Data Explorer has an aggregation (batching) policy for data ingestion designed to optimize the ingestion process.
> By default, the policy is configured to 5 minutes.
> You'll be able to alter the policy at a later time if needed. In this article you can expect a latency of a few minutes.

1. In the Azure portal, under your Event Grid, you see the spike in activity while the app is running.

    :::image type="content" source="../media/ingest-data-event-grid/event-grid-graph.png" alt-text="Activity graph for Event Grid.":::

1. To check how many messages have made it to the database so far, run the following query in your test database.

    ```kusto
    TestTable
    | count
    ```

1. To see the content of the messages, run the following query in your test database.

    ```kusto
    TestTable
    ```

    The result set should look like the following image:

    :::image type="content" source="../media/ingest-data-event-grid/table-result.png" alt-text="Message result set for Event Grid.":::

## Clean up resources

If you don't plan to use your Event Grid again, clean up the Event Grid Subscription, Event Hub namespace, and Event Hub that were autocreated for you, to avoid incurring costs.

1. In Azure portal, go to the left menu and select **All resources**.

    :::image type="content" source="../media/ingest-data-event-grid/clean-up-resources-select-all-resource.png" alt-text="Select all resources for Event Grid cleanup.":::

1. Search for your Event Hub Namespace and select **Delete** to delete it:

    :::image type="content" source="../media/ingest-data-event-grid/clean-up-resources-find-event-hub-namespace-delete.png" alt-text="Clean up Event Hub namespace.":::

1. In the Delete resources form, confirm the deletion to delete the Event Hub Namespace and Event Hub resources.

1. Go to your storage account. In the left menu, select **Events**:

    :::image type="content" source="../media/ingest-data-event-grid/clean-up-resources-select-events.png" alt-text="Select events to clean up for Event Grid.":::

1. Below the graph, Select your Event Grid Subscription and then select **Delete** to delete it:

    :::image type="content" source="../media/ingest-data-event-grid/delete-event-grid-subscription.png" alt-text="Delete Event Grid subscription.":::

1. To delete your Event Grid data connection, go to your Data Explorer cluster. On the left menu, select **Databases**.

1. Select your database **TestDatabase**:

    :::image type="content" source="../media/ingest-data-event-grid/clean-up-resources-select-database.png" alt-text="Select database to clean up resources.":::

1. On the left menu, select **Data ingestion**:

    :::image type="content" source="../media/ingest-data-event-grid/clean-up-resources-select-data-ingestion.png" alt-text="Select data ingestion to clean up resources.":::

1. Select your data connection *test-grid-connection* and then select **Delete** to delete it.

## Next steps

- [Analyze with Data Explorer](../../get-started-analyze-data-explorer.md)
- [Monitor Data Explorer pools](../data-explorer-monitor-pools.md)