---
title: Get started with change data capture in analytical store
titleSuffix: Azure Cosmos DB
description: Enable change data capture in Azure Cosmos DB analytical store for an existing account to consume a continuous and incremental feed of changed data.
author: Rodrigossz
ms.author: rosouz
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/18/2023
---

# Get started with change data capture in the analytical store for Azure Cosmos DB (Preview)

[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

Use Change data capture (CDC) in Azure Cosmos DB analytical store as a source to [Azure Data Factory](../data-factory/index.yml) or [Azure Synapse Analytics](../synapse-analytics/index.yml) to capture specific changes to your data.


> [!NOTE]
> Please note that the linked service interface for Azure Cosmos DB for MongoDB API is not available on Dataflow yet. However, you would be able to use your account’s document endpoint with the “Azure Cosmos DB for NoSQL” linked service interface as a work around until the Mongo linked service is supported. On a NoSQL linked service, choose “Enter Manually” to provide the Cosmos DB account info and use account’s document endpoint (eg: `https://[your-database-account-uri].documents.azure.com:443/`) instead of the MongoDB endpoint (eg: `mongodb://[your-database-account-uri].mongo.cosmos.azure.com:10255/`)  

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.

## Enable analytical store

First, enable Azure Synapse Link at the account level and then enable analytical store for the containers that's appropriate for your workload.

1. Enable Azure Synapse Link: [Enable Azure Synapse Link for an Azure Cosmos DB account](configure-synapse-link.md#enable-synapse-link) 

1. Enable analytical store for your containers:

    | Option | Guide |
    | --- | --- |
    | **Enable for a specific new container** | [Enable Azure Synapse Link for your new containers](configure-synapse-link.md#new-container) |
    | **Enable for a specific existing container** | [Enable Azure Synapse Link for your existing containers](configure-synapse-link.md#existing-container) |

## Create a target Azure resource using data flows

The change data capture feature of the analytical store is available through the data flow feature of [Azure Data Factory](../data-factory/concepts-data-flow-overview.md) or [Azure Synapse Analytics](../synapse-analytics/concepts-data-flow-overview.md). For this guide, use Azure Data Factory.

> [!IMPORTANT]
> You can alternatively use Azure Synapse Analytics. First, [create an Azure Synapse workspace](../synapse-analytics/quickstart-create-workspace.md), if you don't already have one. Within the newly created workspace, select the **Develop** tab, select **Add new resource**, and then select **Data flow**.

1. [Create an Azure Data Factory](../data-factory/quickstart-create-data-factory.md), if you don't already have one.

    > [!TIP]
    > If possible, create the data factory in the same region where your Azure Cosmos DB account resides.

1. Launch the newly created data factory.

1. In the data factory, select the **Data flows** tab, and then select **New data flow**.

1. Give the newly created data flow a unique name. In this example, the data flow is named `cosmoscdc`.

    :::image type="content" source="media/get-started-change-data-capture/data-flow-name.png" lightbox="media/get-started-change-data-capture/data-flow-name.png" alt-text="Screnshot of a new data flow with the name cosmoscdc.":::

## Configure source settings for the analytical store container

Now create and configure a source to flow data from the Azure Cosmos DB account's analytical store.

1. Select **Add Source**.

    :::image type="content" source="media/get-started-change-data-capture/add-source.png" alt-text="Screenshot of the add source menu option.":::

1. In the **Output stream name** field, enter **cosmos**.

    :::image type="content" source="media/get-started-change-data-capture/source-name.png" alt-text="Screenshot of naming the newly created source cosmos.":::

1. In the **Source type** section, select **Inline**.

    :::image type="content" source="media/get-started-change-data-capture/inline-source-type.png" alt-text="Screenshot of selecting the inline source type.":::

1. In the **Dataset** field, select **Azure - Azure Cosmos DB for NoSQL**.

    :::image type="content" source="media/get-started-change-data-capture/dataset-type-cosmos.png" alt-text="Screenshot of selecting Azure Cosmos DB for NoSQL as the dataset type.":::

1. Create a new linked service for your account named **cosmoslinkedservice**. Select your existing Azure Cosmos DB for NoSQL account in the **New linked service** popup dialog and then select **Ok**. In this example, we select a pre-existing Azure Cosmos DB for NoSQL account named `msdocs-cosmos-source` and a database named `cosmicworks`.

    :::image type="content" source="media/get-started-change-data-capture/new-linked-service.png" alt-text="Screenshot of the New linked service dialog with an Azure Cosmos DB account selected.":::

1. Select **Analytical** for the store type.

    :::image type="content" source="media/get-started-change-data-capture/linked-service-analytical.png" alt-text="Screenshot of the analytical option selected for a linked service.":::

1. Select the **Source options** tab.

1. Within **Source options**, select your target container and enable **Data flow debug**. In this example, the container is named `products`.

    :::image type="content" source="media/get-started-change-data-capture/container-name.png" alt-text="Screenshot of a source container selected named products.":::

1. Select **Data flow debug**. In the **Turn on data flow debug** popup dialog, retain the default options and then select **Ok**.

    :::image type="content" source="media/get-started-change-data-capture/enable-data-flow-debug.png" alt-text="Screenshot of the toggle option to enable data flow debug.":::

1. The **Source options** tab also contains other options you may wish to enable. This table describes those options:

| Option | Description |
| --- | --- |
| Capture intermediate updates | Enable this option if you would like to capture the history of changes to items including the intermediate changes between change data capture reads. |
| Capture Deletes | Enable this option to capture user-deleted records and apply them on the Sink. Deletes can't be applied on Azure Data Explorer and Azure Cosmos DB Sinks. |
| Capture Transactional store TTLs | Enable this option to capture Azure Cosmos DB transactional store (time-to-live) TTL deleted records and apply on the Sink. TTL-deletes can't be applied on Azure Data Explorer and Azure Cosmos DB sinks. |
| Batchsize in bytes | This setting is in fact **gigabytes**. Specify the size in gigabytes if you would like to batch the change data capture feeds |
| Extra Configs | Extra Azure Cosmos DB analytical store configs and their values. (ex: `spark.cosmos.allowWhiteSpaceInFieldNames -> true`) |

### Working with source options
  
When you check any of the `Capture intermediate updates`, `Capture Deltes`, and `Capture Transactional store TTLs` options, your CDC process will create and populate the `__usr_opType` field in sink with the following values:

| Value | Description | Option
| --- | --- | --- |
| 1 | UPDATE | Capture Intermediate updates |
| 2 | INSERT | There isn't an option for inserts, it's on by default |
| 3 | USER_DELETE | Capture Deletes |
| 4 | TTL_DELETE |  Capture Transactional store TTLs|
  
If you have to differentiate the TTL deleted records from documents deleted by users or applications, you have check both `Capture intermediate updates` and `Capture Transactional store TTLs` options. Then you have to adapt your CDC processes or applications or queries to use `__usr_opType` according to what is necessary for your business needs.

>[!TIP]
> If there is a need for the downstream consumers to restore the order of updates with the “capture intermediate updates” option checked,  the system timestamp `_ts` field can be used as the ordering field.
  
  
## Create and configure sink settings for update and delete operations

First, create a straightforward [Azure Blob Storage](../storage/blobs/index.yml) sink and then configure the sink to filter data to only specific operations.

1. [Create an Azure Blob Storage](../data-factory/quickstart-create-data-factory.md) account and container, if you don't already have one. For the next examples, we'll use an account named `msdocsblobstorage` and a container named `output`.

    > [!TIP]
    > If possible, create the storage account in the same region where your Azure Cosmos DB account resides.

1. Back in Azure Data Factory, create a new sink for the change data captured from your `cosmos` source.

    :::image type="content" source="media/get-started-change-data-capture/add-sink.png" alt-text="Screenshot of adding a new sink that's connected to the existing source.":::

1. Give the sink a unique name. In this example, the sink is named `storage`.

    :::image type="content" source="media/get-started-change-data-capture/sink-name.png" alt-text="Screenshot of naming the newly created sink storage.":::

1. In the **Sink type** section, select **Inline**. In the **Dataset** field, select **Delta**.

    :::image type="content" source="media/get-started-change-data-capture/sink-dataset-type.png" alt-text="Screenshot of selecting and Inline Delta dataset type for the sink.":::

1. Create a new linked service for your account using **Azure Blob Storage** named **storagelinkedservice**. Select your existing Azure Blob Storage account in the **New linked service** popup dialog and then select **Ok**. In this example, we select a pre-existing Azure Blob Storage account named `msdocsblobstorage`.

    :::image type="content" source="media/get-started-change-data-capture/new-linked-service-sink-type.png" alt-text="Screenshot of the service type options for a new Delta linked service.":::

    :::image type="content" source="media/get-started-change-data-capture/new-linked-service-sink-config.png" alt-text="Screenshot of the New linked service dialog with an Azure Blob Storage account selected.":::

1. Select the **Settings** tab.

1. Within **Settings**, set the **Folder path** to the name of the blob container. In this example, the container's name is `output`.

    :::image type="content" source="media/get-started-change-data-capture/sink-container-name.png" alt-text="Screenshot of the blob container named output set as the sink target.":::

1. Locate the **Update method** section and change the selections to only allow **delete** and **update** operations. Also, specify the **Key columns** as a **List of columns** using the field `_{rid}` as the unique identifier.

    :::image type="content" source="media/get-started-change-data-capture/sink-methods-columns.png" alt-text="Screenshot of update methods and key columns being specified for the sink.":::

1. Select **Validate** to ensure you haven't made any errors or omissions. Then, select **Publish** to publish the data flow.

    :::image type="content" source="media/get-started-change-data-capture/validate-publish-data-flow.png" alt-text="Screenshot of the option to validate and then publish the current data flow.":::

## Schedule change data capture execution

After a data flow has been published, you can add a new pipeline to move and transform your data.

1. Create a new pipeline. Give the pipeline a unique name. In this example, the pipeline is named `cosmoscdcpipeline`.

    :::image type="content" source="media/get-started-change-data-capture/new-pipeline.png" alt-text="Screenshot of the new pipeline option within the resources section.":::

1. In the **Activities** section, expand the **Move &amp; transform** option and then select **Data flow**.

    :::image type="content" source="media/get-started-change-data-capture/data-flow-activity.png" alt-text="Screenshot of the data flow activity option within the activities section.":::

1. Give the data flow activity a unique name. In this example, the activity is named `cosmoscdcactivity`.

1. In the **Settings** tab, select the data flow named `cosmoscdc` you created earlier in this guide. Then, select a compute size based on the data volume and required latency for your workload.

    :::image type="content" source="media/get-started-change-data-capture/data-flow-settings.png" alt-text="Screenshot of the configuration settings for both the data flow and compute size for the activity.":::

    > [!TIP]
    > For incremental data sizes greater than 100 GB, we recommend the **Custom** size with a core count of 32 (+16 driver cores).

1. Select **Add trigger**. Schedule this pipeline to execute at a cadence that makes sense for your workload. In this example, the pipeline is configured to execute every five minutes.

    :::image type="content" source="media/get-started-change-data-capture/add-trigger.png" alt-text="Screenshot of the add trigger button for a new pipeline.":::

    :::image type="content" source="media/get-started-change-data-capture/trigger-configuration.png" alt-text="Screenshot of a trigger configuration based on a schedule, starting in the year 2023, that runs every five minutes.":::

    > [!NOTE]
    > The minimum recurrence window for change data capture executions is one minute.

1. Select **Validate** to ensure you haven't made any errors or omissions. Then, select **Publish** to publish the pipeline.

1. Observe the data placed into the Azure Blob Storage container as an output of the data flow using Azure Cosmos DB analytical store change data capture.

    :::image type="content" source="media/get-started-change-data-capture/output-files.png" alt-text="Screnshot of the output files from the pipeline in the Azure Blob Storage container.":::

    > [!NOTE]
    > The initial cluster startup time may take up to three minutes. To avoid cluster startup time in the subsequent change data capture executions, configure the Dataflow cluster **Time to live** value. For more information about the itegration runtime and TTL, see [integration runtime in Azure Data Factory](../data-factory/concepts-integration-runtime.md).

## Concurrent jobs

The batch size in the source options, or situations when the sink is slow to ingest the stream of changes, may cause the execution of multiple jobs at the same time. To avoid this situation, set the **Concurrency** option to 1 in the Pipeline settings, to make sure that new executions are not triggered until the current execution completes.


## Next steps

- Review the [overview of Azure Cosmos DB analytical store](analytical-store-introduction.md)
