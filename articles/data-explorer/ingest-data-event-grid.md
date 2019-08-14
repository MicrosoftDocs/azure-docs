---
title: 'Ingest Azure Blobs into Azure Data Explorer'
description: In this article, you learn how to send storage account data to Azure Data Explorer using an Event Grid subscription.
author: radennis
ms.author: radennis
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/03/2019

# Customer intent: As a database administrator, I want Azure Data Explorer to track my blob storage and ingest new blobs.
---

# Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications

Azure Data Explorer is a fast and scalable data exploration service for log and telemetry data. It offers continuous ingestion (data loading) from blobs written to blob containers. 

In this article, you learn how to set an [Azure Event Grid](/azure/event-grid/overview) subscription, and route events to Azure Data Explorer via an event hub. To begin, you should have a storage account with an event grid subscription that sends notifications to Azure Event Hubs. Then you'll create an Event Grid data connection and see the data flow throughout the system.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [A cluster and database](create-cluster-database-portal.md).
* [A storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).
* [An event hub](https://docs.microsoft.com/azure/event-hubs/event-hubs-create).

## Create an Event Grid subscription in your storage account

1. In the Azure portal, find your storage account.
1. Select **Events** > **Event Subscription**.

    ![Query application link](media/ingest-data-event-grid/create-event-grid-subscription.png)

1. In the **Create Event Subscription** window within the **Basic** tab, provide the following values:

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Name | *test-grid-connection* | The name of the event grid that you want to create.|
    | Event Schema | *Event Grid schema* | The schema that should be used for the event grid. |
    | Topic Type | *Storage account* | The type of event grid topic. |
    | Topic Resource | *gridteststorage* | The name of your storage account. |
    | Subscribe to all event types | *clear* | Don't get notified on all events. |
    | Defined Event Types | *Blob created* | Which specific events to get notified for. |
    | Endpoint Type | *Event hubs* | The type of endpoint to which you send the events. |
    | Endpoint | *test-hub* | The event hub you created. |
    | | |

1. Select the **Additional Features** tab if you want to track files from a specific container. Set the filters for the notifications as follows:
    * **Subject Begins With** field is the *literal* prefix of the blob container. As the pattern applied is *startswith*, it can span multiple containers. No wildcards are allowed.
     It *must* be set as follows: *`/blobServices/default/containers/`*[container prefix]
    * **Subject Ends With** field is the *literal* suffix of the blob. No wildcards are allowed.

## Create a target table in Azure Data Explorer

Create a table in Azure Data Explorer where Event Hubs will send data. Create the table in the cluster and database prepared in the prerequisites.

1. In the Azure portal, under your cluster, select **Query**.

    ![Query application link](media/ingest-data-event-grid/query-explorer-link.png)

1. Copy the following command into the window and select **Run** to create the table (TestTable) that will receive the ingested data.

    ```Kusto
    .create table TestTable (TimeStamp: datetime, Value: string, Source:string)
    ```

    ![Run create query](media/ingest-data-event-grid/run-create-table.png)

1. Copy the following command into the window and select **Run** to map the incoming JSON data to the column names and data types of the table (TestTable).

    ```Kusto
    .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"TimeStamp","path":"$.TimeStamp"},{"column":"Value","path":"$.Value"},{"column":"Source","path":"$.Source"}]'
    ```

## Create an Event Grid data connection in Azure Data Explorer

Now connect to the event grid from Azure Data Explorer, so that data flowing into the blob container is streamed to the test table.

1. Select **Notifications** on the toolbar to verify that the event hub deployment was successful.

1. Under the cluster you created, select **Databases** > **TestDatabase**.

    ![Select test database](media/ingest-data-event-grid/select-test-database.png)

1. Select **Data ingestion** > **Add data connection**.

    ![Data ingestion](media/ingest-data-event-grid/data-ingestion-create.png)

1.  Select the connection type: **Blob Storage**.

1. Fill out the form with the following information, and select **Create**.

    ![Event hub connection](media/ingest-data-event-grid/create-event-grid-data-connection.png)

     Data source:

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Data connection name | *test-hub-connection* | The name of the connection that you want to create in Azure Data Explorer.|
    | Storage account subscription | Your subscription ID | The subscription ID where your storage account resides.|
    | Storage account | *gridteststorage* | The name of the storage account that you created previously.|
    | Event Grid | *test-grid-connection* | The name of the event grid that you created. |
    | Event Hub name | *test-hub* | The event hub that you created. This field is automatically filled when you pick an event grid. |
    | Consumer group | *test-group* | The consumer group defined in the event hub that you created. |
    | | |

    Target table:

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Table | *TestTable* | The table you created in **TestDatabase**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, PSV, SOH, SCSV, TSV, and TXT. Supported compression options: Zip and GZip |
    | Column mapping | *TestMapping* | The mapping you created in **TestDatabase**, which maps incoming JSON data to the column names and data types of **TestTable**.|
    | | |
    
## Generate sample data

Now that Azure Data Explorer and the storage account are connected, you can create sample data and upload it to the blob storage.

We'll work with a small shell script that issues a few basic Azure CLI commands to interact with Azure Storage resources. This script creates a new container in your storage account, uploads an existing file (as a blob) to that container, and then lists the blobs in the container. You can use [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) to execute the script directly in the portal.

Save the data into a file and upload it with this script:

```Json
{"TimeStamp": "1987-11-16 12:00","Value": "Hello World","Source": "TestSource"}
```

```bash
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
    az storage blob upload --container-name $container_name --file $file_to_upload --name $blob_name

    echo "Listing the blobs..."
    az storage blob list --container-name $container_name --output table

    echo "Done"
```

## Review the data flow

> [!NOTE]
> Azure Data Explorer has an aggregation (batching) policy for data ingestion designed to optimize the ingestion process.
By default, the policy is configured to 5 minutes.
You’ll be able to alter the policy at a later time if needed. In this article you can expect a latency of a few minutes.

1. In the Azure portal, under your event grid, you see the spike in activity while the app is running.

    ![Event grid graph](media/ingest-data-event-grid/event-grid-graph.png)

1. To check how many messages have made it to the database so far, run the following query in your test database.

    ```Kusto
    TestTable
    | count
    ```

1. To see the content of the messages, run the following query in your test database.

    ```Kusto
    TestTable
    ```

    The result set should look like the following.

    ![Message result set](media/ingest-data-event-grid/table-result.png)

## Clean up resources

If you don't plan to use your event grid again, clean up **test-hub-rg**, to avoid incurring costs.

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created.  

    If the left menu is collapsed, select ![Expand button](media/ingest-data-event-grid/expand.png) to expand it.

   ![Select resource group to delete](media/ingest-data-event-grid/delete-resources-select.png)

1. Under **test-resource-group**, select **Delete resource group**.

1. In the new window, enter the name of the resource group to delete (*test-hub-rg*), and then select **Delete**.

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
