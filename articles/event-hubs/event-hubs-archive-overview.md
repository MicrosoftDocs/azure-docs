---
title: Archive telemetry data with Azure Event Hubs Archive overview | Microsoft Docs
description: Overview of the Azure Event Hubs Archive feature.
services: event-hubs
documentationcenter: ''
author: djrosanova
manager: timlt
editor: ''

ms.assetid: e53cdeea-8a6a-474e-9f96-59d43c0e8562
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/22/2017
ms.author: darosa;sethm

---
# Azure Event Hubs Archive
Azure Event Hubs Archive enables you to automatically deliver the streaming data in Event Hubs to a Blob storage account of your choice with added flexibility to specify a time or size interval of your choosing. Setting up Archive is fast, there are no administrative costs to run it, and it scales automatically with Event Hubs [throughput units](event-hubs-features.md#capacity). Event Hubs Archive is the easiest way to load streaming data into Azure and enables you to focus on data processing rather than on data capture.

Event Hubs Archive enables you to process real-time and batch-based pipelines on the same stream. This enables you to build solutions that can grow with your needs over time. Whether you're building batch-based systems today with an eye towards future real-time processing, or you want to add an efficient cold path to an existing real-time solution, Event Hubs Archive makes working with streaming data easier.

## How Event Hubs Archive works
Event Hubs is a time-retention durable buffer for telemetry ingress, similar to a distributed log. The key to scaling in Event Hubs is the [partitioned consumer model](event-hubs-features.md#partitions). Each partition is an independent segment of data and is consumed independently. Over time this data ages off, based on the configurable retention period. As a result, a given event hub never gets "too full."

Event Hubs Archive enables you to specify your own Azure Blob Storage account and Container which will be used to store the archived data. This account can be in the same region as your event hub or in another region, adding to the flexibility of the Event Hubs Archive feature.

Archived data is written in [Apache Avro][Apache Avro] format: a compact, fast, binary format that provides rich data structures with inline schema. This format is widely used in the Hadoop ecosystem, as well as by Stream Analytics and Azure Data Factory. More information about working with Avro is available later in this article.

### Archive windowing
Event Hubs Archive enables you to set up a "window" to control archiving. This window is a minimum size and time configuration with a "first wins policy," meaning that the first trigger encountered causes an archive operation. If you have a fifteen-minute, 100 MB archive window and send 1 MB per second, the size window will trigger before the time window. Each partition archives independently and writes a completed block blob at the time of archive, named for the time at which the archive interval was encountered. The naming convention is as follows:

```
[Namespace]/[EventHub]/[Partition]/[YYYY]/[MM]/[DD]/[HH]/[mm]/[ss]
```

### Scaling to throughput units
Event Hubs traffic is controlled by [throughput units](event-hubs-features.md#capacity). A single throughput unit allows 1 MB per second or 1000 events per second of ingress and twice that amount of egress. Standard Event Hubs can be configured with 1-20 throughput units, and you can purchase more via a quota increase [support request][support request]. Usage beyond your purchased throughput units is throttled. Event Hubs Archive copies data directly from the internal Event Hubs storage, bypassing throughput unit egress quotas and saving your egress for other processing readers, such as Stream Analytics or Spark.

Once configured, Event Hubs Archive runs automatically as soon as you send your first event. It continues running at all times. To make it easier to for your downstream processing to know that the process is working, Event Hubs writes empty files when there is no data. This provides a predictable cadence and marker that can feed your batch processors.

## Setting up Event Hubs Archive
You can configure Archive at the event hub creation time via the portal, or Azure Resource Manager. You simply enable Archive by clicking the **On** button. You configure a Storage Account and container by clicking the **Container** section of the blade. Because Event Hubs Archive uses service-to-service authentication with storage, you do not need to specify a storage connection string. The resource picker selects the resource URI for your storage account automatically. If you use Azure Resource Manager, you must supply this URI explicitly as a string.

The default time window is 5 minutes. The minimum value is 1, the maximum 15. The **Size** window has a range of 10-500 MB.

![][1]

## Adding Archive to an existing event hub
Archive can be configured on existing event hubs that are in an Event Hubs namespace. The feature is not available on older **Messaging** or **Mixed** type namespaces. To enable Archive on an existing event hub, or to change your Archive settings, click your namespace to load the **Essentials** blade, then click the event hub for which you want to enable or change the Archive setting. Finally, click on the **Properties** section of the open blade as shown in the following figure.

![][2]

You can also configure Event Hubs Archive via Azure Resource Manager templates. For more information, see [this article](event-hubs-resource-manager-namespace-event-hub-enable-archive.md).

## Exploring the archive and working with Avro
Once configured, Event Hubs Archive creates files in the Azure Storage account and container provided on the configured time window. You can view these files in any tool such as [Azure Storage Explorer][Azure Storage Explorer]. You can download the files locally to work on them.

The files produced by Event Hubs Archive have the following Avro schema:

![][3]

An easy way to explore Avro files is by using the [Avro Tools][Avro Tools] jar from Apache. After downloading this jar, you can see the schema of a specific Avro file by running the following command:

```
java -jar avro-tools-1.8.1.jar getschema \<name of archive file\>
```

This command returns

```
{

    "type":"record",
    "name":"EventData",
    "namespace":"Microsoft.ServiceBus.Messaging",
    "fields":[
                 {"name":"SequenceNumber","type":"long"},
                 {"name":"Offset","type":"string"},
                 {"name":"EnqueuedTimeUtc","type":"string"},
                 {"name":"SystemProperties","type":{"type":"map","values":["long","double","string","bytes"]}},
                 {"name":"Properties","type":{"type":"map","values":["long","double","string","bytes"]}},
                 {"name":"Body","type":["null","bytes"]}
             ]
}
```

You can also use Avro Tools to convert the file to JSON format and perform other processing.

To perform more advanced processing, download and install Avro for your choice of platform. At the time of this writing, there are implementations available for C, C++, C\#, Java, NodeJS, Perl, PHP, Python, and Ruby.

Apache Avro has complete Getting Started guides for [Java][Java] and [Python][Python]. You can also read the [Getting Started with Event Hubs Archive](event-hubs-archive-python.md) article.

## How Event Hubs Archive is charged
Event Hubs Archive is metered similarly to throughput units, as an hourly charge. The charge is directly proportional to the number of throughput units purchased for the namespace. As throughput units are increased and decreased, Event Hubs Archive increases and decreases to provide matching performance. The meters occur in tandem. The charge for Event Hubs Archive is $0.10 per hour per throughput unit, offered at a 50% discount during the preview period.

Event Hubs Archive is the easiest way to get data into Azure. Using Azure Data Lake, Azure Data Factory, and Azure HDInsight, you can perform batch processing and other analytics of your choosing using familiar tools and platforms at any scale you need.

## Next steps
You can learn more about Event Hubs by visiting the following links:

* A complete [sample application that uses Event Hubs][sample application that uses Event Hubs].
* The [Scale out Event Processing with Event Hubs][Scale out Event Processing with Event Hubs] sample.
* [Event Hubs overview][Event Hubs overview]

[Apache Avro]: http://avro.apache.org/
[support request]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade
[1]: ./media/event-hubs-archive-overview/event-hubs-archive1.png
[2]: media/event-hubs-archive-overview/event-hubs-archive2.png
[Azure Storage Explorer]: http://azurestorageexplorer.codeplex.com/
[3]: ./media/event-hubs-archive-overview/event-hubs-archive3.png
[Avro Tools]: http://www-us.apache.org/dist/avro/avro-1.8.1/java/avro-tools-1.8.1.jar
[Java]: http://avro.apache.org/docs/current/gettingstartedjava.html
[Python]: http://avro.apache.org/docs/current/gettingstartedpython.html
[Event Hubs overview]: event-hubs-what-is-event-hubs.md
[sample application that uses Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-286fd097
[Scale out Event Processing with Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-45f43fc3
