---
title: 'Analytics platforms: Apache Storm comparison to Stream Analytics | Microsoft Docs'
description: Get guidance choosing a cloud analytics platform by using an Apache Storm comparison to Stream Analytics. Understand features and differences.
keywords: analytics platform, analytics platforms, cloud analytics platform, storm comparison
services: stream-analytics
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: b9aac017-9866-4d0a-b98f-6f03881e9339
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/27/2017
ms.author: jeffstok

---
# Choosing a streaming analytics platform: comparing Apache Storm and Azure Stream Analytics
Azure provides multiple solutions for analyzing streaming data: [Azure Streaming Analytics](https://docs.microsoft.com/azure/stream-analytics/) and [Apache Storm on Azure HDInsight](https://azure.microsoft.com/services/hdinsight/apache-storm/). Both analytics platforms provide the benefits of a PaaS solution. But the platforms have some significant differences in their capabilities as well as in how you configure and manage them. 

This article provides a side-by-side comparison of features to help you choose between Apache Storm and Azure Stream Analytics as a cloud analytics platform. 

## General features

<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong> </strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    <strong>Azure Stream Analytics</strong>
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    <strong>Apache Storm on HDInsight</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Open source?</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    No. Azure Stream Analytics is a Microsoft proprietary offering.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Yes. Apache Storm is an Apache licensed technology.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Microsoft support?</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Yes
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Yes
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Hardware requirements</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    None. Azure Stream Analytics is an Azure Service.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    None. Apache Storm is an Azure Service.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Top-level unit</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Users deploy and monitor streaming jobs.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Users deploy and monitor a whole cluster, which can host multiple Storm jobs as well as other workloads (including batch).
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Pricing</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Priced by volume of data processed and the number of streaming units required per hour that the job is running. 
                </p>
                    <p>For more information, see <a href="http://azure.microsoft.com/pricing/details/stream-analytics/">Stream Analytics Pricing</a>.</p>
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    The unit of purchase is cluster-based, and is charged based on the time the cluster is running, independent of jobs deployed.
                </p>
                <p>
                    For more information, see <a href="http://azure.microsoft.com/pricing/details/hdinsight/">HDInsight pricing</a>.
                </p>
            </td>
        </tr>
    </tbody>
</table>

## Authoring

<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong> </strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    <strong>Azure Stream Analytics</strong>
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    <strong>Apache Storm on HDInsight</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Capabilities: SQL DSL?</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Yes. Stream Analytics provides a SQL-like language for creating transformations.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No. Users write code in Java or C#, or use Trident APIs.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Capabilities: Temporal operators?</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Windowed aggregates and temporal joins are supported by default.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Temporal operators must be implemented by the user.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Development experience</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Users can create, debug, and monitor jobs through the Azure portal, using sample data derived from a live stream.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Users using .NET can develop, debug, and monitor through Visual Studio. Users using Java or other languages can use the IDE of their choice.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Debugging support</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Basic job status and operations logs are available to help debug. Stream Analytics currently does not let users specify what content or how much content is included in the logs (i.e., verbose mode).
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Detailed logs are available. Users can access logs in Visual Studio or by logging in to the cluster and accessing the logs directly.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Support for user-defined functions (UDFs)</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Queries support JavaScript UDFs. For more information, see <a href="https://docs.microsoft.com/azure/stream-analytics/stream-analytics-javascript-user-defined-functions">JavaScript UDF integration</a>.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    UDFs can be written in C#, Java, or any other language.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Extensibility using custom code?</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    No. There is no support for extensible code in Stream Analytics.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Yes. Users can write custom code in C#, Java, or any other language supported on Storm.
                </p>
            </td>
        </tr>
    </tbody>
</table>

## Data sources (inputs) and outputs ##

<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong> </strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    <strong>Azure Stream Analytics</strong>
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    <strong>Apache Storm on HDInsight</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                 <strong>Input data sources</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>Azure Event Hubs and Azure Blob storage.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Connectors are available for Azure Event Hubs, Azure Service Bus, Kafka, and more. Users can create additional connectors using custom code.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Input data formats</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Avro, JSON, CSV
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Users can implement any format using custom code.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Outputs</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    A streaming job can have multiple outputs. Supported outputs are Azure Event Hubs, Azure Blob storage, Azure Table storage, Azure SQL DB, and Power BI.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Storm supports many outputs in a topology, and each output can have custom logic for downstream processing. Storm includes connectors for Power BI, Azure Event Hubs, Azure Blob storage, Azure Cosmos DB, SQL, and HBase. Users can create additional connectors using custom code.    
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Data-encoding formats</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Data must be formatted using UTF-8.
                </p>
            </td>   
            <td width="246" valign="top">
                <p>
                    Users can implement any data encoding format using custom code.
                </p>
            </td>
        </tr>
    </tbody>
</table>

## Management and operations ##

<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong> </strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    <strong>Azure Stream Analytics</strong>
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    <strong>Apache Storm on HDInsight</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Job deployment model</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Azure portal, PowerShell, and REST APIs.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Azure portal, PowerShell, Visual Studio, and REST APIs.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Monitoring (stats, counters, etc.)</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Monitoring is implemented using Azure portal and REST APIs. Users can also configure Azure alerts.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Monitoring is implemented using the Storm UI and REST APIs.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Scalability</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Scalability is determined by the number of Streaming Units (SUs) for each job. Each Streaming Unit processes up to 1 MB/second, with a maximum 50 units. For more information, see <a href="https://docs.microsoft.com/azure/stream-analytics/stream-analytics-scale-jobs">Scale to increase throughput</a>.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Scalability is determined by the number of nodes in the HDInsight Storm cluster. The top limit on the number of nodes is defined by the user's Azure quota.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Data processing limits</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Users can increase data processing or optimize costs by increasing or decreasing the number of Streaming Units, with an upper limit of 1 GB/second.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Users can scale cluster size up or down.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Stop/Resume</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Stop and resume from last place stopped.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Stop and resume from last place stopped based on a watermark.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Service and framework update</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Automatic patching with no downtime.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Automatic patching with no downtime.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Business continuity through a Highly Available Service with guaranteed SLAs</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <ul>
                <li>SLA of 99.9% uptime</li>
                <li>Auto-recovery from failures</li>
                <li>Built-in recovery of stateful temporal operators</li>
                </ul>
            </td>
            <td width="246" valign="top">
                <p>
                    SLA of 99.9% uptime of the Storm cluster. 
                </p>
                <p>
                    Apache Storm is a fault-tolerant streaming platform. However, it is the user's responsibility to ensure that streaming jobs run uninterrupted.
                </p>
            </td>
        </tr>
    </tbody>
</table>

## Advanced features ##

<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong> </strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    <strong>Azure Stream Analytics</strong>
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    <strong>Apache Storm on HDInsight</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Late arrival and out-of-order event handling</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Built-in configurable policies can reorder events, drop events, or adjust event time.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Users must implement logic to handle this scenario.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Reference data</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Reference data is available from Azure Blob storage with a maximum of 100 MB of in-memory cache. Reference data is refreshed by the service.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No limits on data size. Connectors are available for HBase, Azure Cosmos DB, SQL Server, and Azure. Users can create additional connectors using custom code. Reference data must be refreshed using custom code.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Integration with Machine Learning</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Published Azure Machine Learning models can be configured as functions during job creation. For more information, see <a href="https://docs.microsoft.com/azure/stream-analytics/stream-analytics-scale-with-machine-learning-functions">Scale for Machine Learning functions</a>.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Available through Storm Bolts.
                </p>
            </td>
        </tr>
    </tbody>
</table>
