---
title: Capture Streaming Events
description: Learn how Azure Event Hubs Capture automatically saves streaming data to Azure Blob Storage or Data Lake Storage for processing.
ms.topic: concept-article
ms.date: 05/20/2025
#customer intent: As a developer, I want to know how to capture events that flow through an event hub to Azure Blob Storage or Azure Data Lake Storage.
---

# Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage

The Azure Event Hubs Capture feature automatically captures streaming data that flows through Event Hubs to an [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Storage](https://azure.microsoft.com/services/data-lake-store/) account. To control when Event Hubs stores the data, you can specify a time or a size interval. You can quickly enable or set up the Event Hubs Capture feature. It doesn't require administrative costs to run, and it scales automatically with Event Hubs capacity.

The Standard tier uses [throughput units](event-hubs-scalability.md#throughput-units), and the Premium tier uses [processing units](event-hubs-scalability.md#processing-units). Event Hubs Capture simplifies the process of loading streaming data into Azure and enables you to focus on data processing rather than data capture.

:::image type="content" source="./media/event-hubs-features/capture.png" alt-text="Diagram that shows a process that captures Event Hubs data into Blob Storage or Data Lake Storage." border="false":::

Use Event Hubs Capture to process real-time and batch-based pipelines on the same stream. This approach helps you build solutions that grow with your needs over time. If you use batch-based systems and plan to add real-time processing later, or if you want to add an efficient cold path to an existing real-time solution, Event Hubs Capture simplifies working with streaming data.

## Important points to consider

- The destination storage account, either Blob Storage or Data Lake Storage, must reside in the same subscription as the event hub when you don't use managed identity for authentication.

- Event Hubs doesn't support capturing events in premium Azure Storage accounts.
- Event Hubs Capture supports nonpremium Storage accounts that allow block blobs.

## How Event Hubs Capture works

Event Hubs serves as a time-retention durable buffer for telemetry ingress, similar to a distributed log. The [partitioned consumer model](event-hubs-scalability.md#partitions) enables scalability. Each partition is an independent segment of data and is consumed independently. This data is deleted after the configurable retention period, so the event hub never gets *too full*.

Event Hubs Capture enables you to specify a Blob Storage account and container, or a Data Lake Storage account, to store captured data. These accounts can reside in the same region as your event hub or in another region, which adds flexibility.

Event Hubs Capture writes captured data in [Apache Avro](https://avro.apache.org/) format, which is a compact, fast, binary format that provides rich data structures with inline schema. The Hadoop ecosystem, Azure Stream Analytics, and Azure Data Factory use this format. Later sections in this article provide more information about working with Avro.

> [!NOTE]
> - When you use the no-code editor in the Azure portal, you can capture streaming data in Event Hubs to a Data Lake Storage account in the Parquet format. For more information, see [Capture data from Event Hubs in Parquet format](../stream-analytics/capture-event-hub-data-parquet.md) and [Capture Event Hubs data in Parquet format and analyze it by using Azure Synapse Analytics](../stream-analytics/event-hubs-parquet-capture-tutorial.md).
>
> - To configure Event Hubs Capture with Data Lake Storage, follow the same steps as configuring it with Blob Storage. For more information, see [Configure Event Hubs Capture](event-hubs-capture-enable-through-portal.md).
>
> - Data Lake Storage Gen1 is retired and no longer supported for Event Hubs Capture. If you use Gen1, migrate to Gen2 to ensure compatibility and continued support.

### Capture windowing

To control capturing, use Event Hubs Capture to set up a window that uses a minimum size and time configuration. The system applies a *first wins* policy, which means that the first condition met—either size or time—triggers the capture. For example, if you have a fifteen-minute, 100-megabyte (MB) capture window and send 1 MB per second, the size window triggers before the time window.

Each partition captures data independently and writes a completed block blob at the time of capture. The blob name reflects the time when the capture interval was encountered.

The storage naming convention follows this structure:

```
{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}
```

The date values are padded with zeroes. The following filename shows an example:

```
https://mystorageaccount.blob.core.windows.net/mycontainer/mynamespace/myeventhub/0/2017/12/08/03/03/17.avro
```

If your Storage blob becomes temporarily unavailable, Event Hubs Capture retains your data for the data retention period that you configure on your event hub. After your Storage account becomes available again, Event Hubs Capture backfills the data.

### Scale throughput units or processing units

In the Standard tier of Event Hubs, [throughput units](event-hubs-scalability.md#throughput-units) control traffic. In the Premium tier, [processing units](event-hubs-scalability.md#processing-units) control traffic. Event Hubs Capture copies data directly from the internal Event Hubs storage, which bypasses throughput unit or processing unit egress quotas and saves your egress for other processing readers such as Stream Analytics or Apache Spark.

After you configure Event Hubs Capture, it starts automatically when you send your first event and continues running. To help downstream systems confirm that the process works, Event Hubs writes empty files when no data is available. This process provides a predictable cadence and marker that can feed your batch processors.

## Set up Event Hubs Capture

To configure Capture when you create an event hub, use the [Azure portal](https://portal.azure.com) or an Azure Resource Manager template (ARM template). For more information, see the following articles:

- [Enable Event Hubs Capture by using the Azure portal](event-hubs-capture-enable-through-portal.md)
- [Create an Event Hubs namespace that includes an event hub and enable Capture by using an ARM template](event-hubs-resource-manager-namespace-event-hub-enable-capture.md)

> [!NOTE]
> If you enable the Capture feature for an existing event hub, the feature captures only the events that arrive *after* you turn it on. It doesn't capture events that exist before activation. 

## Event Hubs Capture billing

The Event Hubs Premium tier includes the Capture feature. For the Standard tier, Azure charges for Capture monthly based on the number of throughput units for the namespace. As you scale throughput units up or down, Event Hubs Capture adjusts its metering to match performance. These meters scale in tandem.

Capture doesn't consume egress quota because Azure bills it separately.

For more information, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

## Integrate with Azure Event Grid

You can create an Azure Event Grid subscription with an Event Hubs namespace as its source. For more information about how to create an Event Grid subscription with an event hub as a source and an Azure Functions app as the sink, see [Migrate captured Event Hubs data to Azure Synapse Analytics](../event-grid/event-hubs-integration.md).

## Explore captured files

To learn how to explore captured Avro files, see [Explore captured Avro files](explore-captured-avro-files.md).

## Azure Storage account as a destination

To enable Capture on an event hub that uses Storage as the capture destination, or to update properties on an event hub that uses Storage as the capture destination, the user or service principal must have a role-based access control (RBAC) role that includes the following permissions assigned at the storage account scope:

```
Microsoft.Storage/storageAccounts/blobServices/containers/write
Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write
```

Without this permission, the following error appears: 

```
Generic: Linked access check failed for capture storage destination <StorageAccount Arm Id>.
User or the application with object id <Object Id> making the request doesn't have the required data plane write permissions.
Please enable Microsoft.Storage/storageAccounts/blobServices/containers/write, Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write permission(s) on above resource for the user or the application and retry.
TrackingId:<ID>, SystemTracker:mynamespace.servicebus.windows.net:myhub, Timestamp:<TimeStamp>
```

To resolve this problem, add the user account or the service principal to the [Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner) built-in role, which includes the required permissions.

## Related content

Event Hubs Capture provides a straightforward way to ingest data into Azure. With Data Lake Storage, Azure Data Factory, and Azure HDInsight, you can perform batch processing and analytics by using familiar tools and platforms at any scale.

To enable this feature, use the Azure portal or an ARM template:

- [Use the Azure portal to enable Event Hubs Capture](event-hubs-capture-enable-through-portal.md)
- [Use an ARM template to enable Event Hubs Capture](event-hubs-resource-manager-namespace-event-hub-enable-capture.md)

For more information about data redundancy options for your Capture destination storage account, see [Reliability in Blob Storage](/azure/reliability/reliability-storage-blob).
