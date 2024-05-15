---
title: Capture streaming events - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of the Capture feature that allows you to capture events streaming through Azure Event Hubs. 
ms.topic: article
ms.date: 05/16/2023
---

# Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage
Azure Event Hubs enables you to automatically capture the streaming data in Event Hubs in an [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Storage Gen 1 or Gen 2](https://azure.microsoft.com/services/data-lake-store/) account of your choice, with the added flexibility of specifying a time or size interval. Setting up Capture is fast, there are no administrative costs to run it, and it scales automatically with Event Hubs [throughput units](event-hubs-scalability.md#throughput-units) in the standard tier or [processing units](event-hubs-scalability.md#processing-units) in the premium tier. Event Hubs Capture is the easiest way to load streaming data into Azure, and enables you to focus on data processing rather than on data capture.

:::image type="content" source="./media/event-hubs-features/capture.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage":::

> [!NOTE]
> Configuring Event Hubs Capture to use Azure Data Lake Storage **Gen 2** is same as configuring it to use an Azure Blob Storage. For details, see [Configure Event Hubs Capture](event-hubs-capture-enable-through-portal.md). 

Event Hubs Capture enables you to process real-time and batch-based pipelines on the same stream. This means you can build solutions that grow with your needs over time. Whether you're building batch-based systems today with an eye towards future real-time processing, or you want to add an efficient cold path to an existing real-time solution, Event Hubs Capture makes working with streaming data easier.

> [!IMPORTANT]
> - The destination storage (Azure Storage or Azure Data Lake Storage) account  must be in the same subscription as the event hub when not using managed identity for authentication.
> - Event Hubs doesn't support capturing events in a premium storage account.
> - Event Hubs capture supports any non-premium Azure storage account with support for block blobs.

## How Event Hubs Capture works

Event Hubs is a time-retention durable buffer for telemetry ingress, similar to a distributed log. The key to scaling in Event Hubs is the [partitioned consumer model](event-hubs-scalability.md#partitions). Each partition is an independent segment of data and is consumed independently. Over time this data ages off, based on the configurable retention period. As a result, a given event hub never gets "too full."

Event Hubs Capture enables you to specify your own Azure Blob storage account and container, or Azure Data Lake Storage account, which are used to store the captured data. These accounts can be in the same region as your event hub or in another region, adding to the flexibility of the Event Hubs Capture feature.

Captured data is written in [Apache Avro][Apache Avro] format: a compact, fast, binary format that provides rich data structures with inline schema. This format is widely used in the Hadoop ecosystem, Stream Analytics, and Azure Data Factory. More information about working with Avro is available later in this article.

> [!NOTE]
> When you use no code editor in the Azure portal, you can capture streaming data in Event Hubs in an Azure Data Lake Storage Gen2 account in the **Parquet** format. For more information, see [How to: capture data from Event Hubs in Parquet format](../stream-analytics/capture-event-hub-data-parquet.md?toc=%2Fazure%2Fevent-hubs%2Ftoc.json) and [Tutorial: capture Event Hubs data in Parquet format and analyze with Azure Synapse Analytics](../stream-analytics/event-hubs-parquet-capture-tutorial.md?toc=%2Fazure%2Fevent-hubs%2Ftoc.json).

### Capture windowing

Event Hubs Capture enables you to set up a window to control capturing. This window is a minimum size and time configuration with a "first wins policy," meaning that the first trigger encountered causes a capture operation. If you have a fifteen-minute, 100 MB capture window and send 1 MB per second, the size window triggers before the time window. Each partition captures independently and writes a completed block blob at the time of capture, named for the time at which the capture interval was encountered. The storage naming convention is as follows:

```
{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}
```

The date values are padded with zeroes; an example filename might be:

```
https://mystorageaccount.blob.core.windows.net/mycontainer/mynamespace/myeventhub/0/2017/12/08/03/03/17.avro
```

If your Azure storage blob is temporarily unavailable, Event Hubs Capture will retain your data for the data retention period configured on your event hub and back fill the data once your storage account is available again.

### Scaling throughput units or processing units

In the standard tier of Event Hubs, the traffic is controlled by [throughput units](event-hubs-scalability.md#throughput-units) and in the premium tier Event Hubs, it's controlled by [processing units](event-hubs-scalability.md#processing-units). Event Hubs Capture copies data directly from the internal Event Hubs storage, bypassing throughput unit or processing unit egress quotas and saving your egress for other processing readers, such as Stream Analytics or Spark.

Once configured, Event Hubs Capture runs automatically when you send your first event, and continues running. To make it easier for your downstream processing to know that the process is working, Event Hubs writes empty files when there's no data. This process provides a predictable cadence and marker that can feed your batch processors.

## Setting up Event Hubs Capture

You can configure Capture at the event hub creation time using the [Azure portal](https://portal.azure.com), or using Azure Resource Manager templates. For more information, see the following articles:

- [Enable Event Hubs Capture using the Azure portal](event-hubs-capture-enable-through-portal.md)
- [Create an Event Hubs namespace with an event hub and enable Capture using an Azure Resource Manager template](event-hubs-resource-manager-namespace-event-hub-enable-capture.md)

> [!NOTE]
> If you enable the Capture feature for an existing event hub, the feature captures events that arrive at the event hub **after** the feature is turned on. It doesn't capture events that existed in the event hub before the feature was turned on. 

## How Event Hubs Capture is charged

The capture feature is included in the premium tier so there is no additional charge for that tier. For the Standard tier, the feature is charged monthly, and the charge is directly proportional to the number of throughput units or processing units purchased for the namespace. As throughput units or processing units are increased and decreased, Event Hubs Capture meters increase and decrease to provide matching performance. The meters occur in tandem. For pricing details, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/). 

Capture doesn't consume egress quota as it is billed separately. 

## Integration with Event Grid 
You can create an Azure Event Grid subscription with an Event Hubs namespace as its source. The following tutorial shows you how to create an Event Grid subscription with an event hub as a source and an Azure Functions app as a sink: [Process and migrate captured Event Hubs data to an Azure Synapse Analytics using Event Grid and Azure Functions](store-captured-data-data-warehouse.md).

## Explore captured files
To learn how to explore captured Avro files, see [Explore captured Avro files](explore-captured-avro-files.md).

## Azure Storage account as a destination
To enable capture on an event hub with Azure Storage as the capture destination, or update properties on an event hub with Azure Storage as the capture destination, the user or service principal must have an RBAC role with the following permissions assigned at the storage account scope. 

```
Microsoft.Storage/storageAccounts/blobServices/containers/write
Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write
```
 

Without above permission, you will see below error: 

```
Generic: Linked access check failed for capture storage destination <StorageAccount Arm Id>.
User or the application with object id <Object Id> making the request doesn't have the required data plane write permissions.
Please enable Microsoft.Storage/storageAccounts/blobServices/containers/write, Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write permission(s) on above resource for the user or the application and retry.
TrackingId:<ID>, SystemTracker:mynamespace.servicebus.windows.net:myhub, Timestamp:<TimeStamp>
```

The [Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner) is a built-in role with above permissions, so add the user account or the service principal to this role.  

## Next steps
Event Hubs Capture is the easiest way to get data into Azure. Using Azure Data Lake, Azure Data Factory, and Azure HDInsight, you can perform batch processing and other analytics using familiar tools and platforms of your choosing, at any scale you need.

Learn how to enable this feature using the Azure portal and Azure Resource Manager template:

- [Use the Azure portal to enable Event Hubs Capture](event-hubs-capture-enable-through-portal.md)
- [Use an Azure Resource Manager template to enable Event Hubs Capture](event-hubs-resource-manager-namespace-event-hub-enable-capture.md)


[Apache Avro]: https://avro.apache.org/
[Apache Drill]: https://drill.apache.org/
[Apache Spark]: https://spark.apache.org/
[support request]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade
[Azure Storage Explorer]: https://github.com/microsoft/AzureStorageExplorer/releases
[3]: ./media/event-hubs-capture-overview/event-hubs-capture3.png
[Avro Tools]: https://downloads.apache.org/avro/stable/java/
[Java]: https://avro.apache.org/docs/current/gettingstartedjava.html
[Python]: https://avro.apache.org/docs/current/gettingstartedpython.html
[Event Hubs overview]: ./event-hubs-about.md
[HDInsight: Address files in Azure storage]: ../hdinsight/hdinsight-hadoop-use-blob-storage.md
[Azure Databricks: Azure Blob Storage]:https://docs.databricks.com/spark/latest/data-sources/azure/azure-storage.html
[Apache Drill: Azure Blob Storage Plugin]:https://drill.apache.org/docs/azure-blob-storage-plugin/
[Streaming at Scale: Event Hubs Capture]:https://github.com/yorek/streaming-at-scale/tree/master/event-hubs-capture
