<properties
	pageTitle="Comparison: Apache Storm vs. Azure Stream Analytics | Microsoft Azure"
	description="Learn how to use Stream Analytics for real-time Twitter sentiment analysis. Step-by-step guidance from event generation to data on a live dashboard."
	keywords="real-time twitter,sentiment analysis,social media analysis,social media analytics tools"
	services="stream-analytics"
	documentationCenter=""
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="big-data"
	ms.date="06/23/2015"
	ms.author="jeffstok"/>

# Comparison of Apache Storm and Azure Stream Analytics #
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
            <td width="623" colspan="3" valign="top">
                <p>
                    <strong>General</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Open Source</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    No. Microsoft proprietary offering
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Yes. Apache licensed technology
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Microsoft Supported</strong>
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
                    No hardware requirement. It’s an Azure Service
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No hardware requirement. It’s an Azure Service
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Cluster concept </strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    No. Azure Stream Analytics is a Job Service. Customers don’t maintain their clusters. Customers author and monitor job without the worry
                    for cluster management
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Storm on HDInsight is a managed PaaS service. Customers provision Storm Clusters that can run Streaming workload
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Price</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Stream Analytics is priced by volume of data processed and the number of streaming units required to process it.
                </p>
                <p>
                    <a href="http://azure.microsoft.com/en-us/pricing/details/stream-analytics/">Link to the pricing page</a>
                    .
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    The Unit of purchase is cluster.
                </p>
                <p>
                    <a href="http://azure.microsoft.com/en-us/pricing/details/hdinsight/">Link to the pricing page</a>
                    .
                </p>
            </td>
        </tr>
        <tr>
            <td width="623" colspan="3" valign="top">
                <p>
                    <strong>Authoring</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Capabilities: SQL DSL</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Yes. Easy to use SQL language support
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No. Customer write code in Java C# or use Trident APIs
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Capabilities: Temporal operators</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Windowed aggregates, and temporal joins are supported out of the box.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Temporal operators need to be implemented by customer.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Development Experience</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Interactive authoring and debugging experience through Azure Portal on sampled data.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Development, debugging and monitoring experience through the Visual Studio experience for .NET users and for Java and other languages
                    customers use IDE of their choice.
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
                    When things don’t work, using job status and then looking via Management services logs is the only option, no way to setup Logs to verbose
                    mode
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Detailed logs available for debugging purposes. Two ways to surface logs to user via visual studio or user can RDP into cluster to get access to logs.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Support for UDF (User Defined Functions)</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Currently no support for UDFs
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Yes. Can be written in C#, Java or the language of your choice.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Extensible - custom code </strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    None
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Yes. Ability to write custom code. Can be done in C#, Java or other supported languages on Storm.
                </p>
            </td>
        </tr>
        <tr>
            <td width="623" colspan="3" valign="top">
                <p>
                    <strong>Input and Output</strong>
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
                <p>
                    A streaming job can have a set of inputs. Currently restricted to Event Hubs, Azure Blobs.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No restrictions. Connectors available for Event Hubs, Service Bus, Kafka etc. Unsupported ones can be implemented via custom code
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Input Data formats</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Avro, JSON, CSV.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No restrictions. Can be implemented via custom code
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
                    A streaming job can have multiple outputs. Currently restricted to Event Hubs, Blob Storage, Azure Table, Azure SQL DB, and PowerBI.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Support for many outputs in a topology, each output can have custom logic for downstream processing. Out of the box it comes with connectors for PowerBI, Event Hubs, Azure Blob Store, DocumentDB, SQL and HBase. Unsupported ones can be implemented via custom code
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Data Encoding formats</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    UTF-8
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No restrictions. Can be implemented via custom code
                </p>
            </td>
        </tr>
        <tr>
            <td width="623" colspan="3" valign="top">
                <p>
                    <strong>Management and operations</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Job Deployment model</strong>
                </p>
                <p>
                    - <strong>Portal</strong>
                </p>
                <p>
                    - <strong>Visual Studio</strong>
                </p>
                <p>
                    - <strong>PowerShell</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Via portal, PowerShell and REST APIs
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Via portal, PowerShell, Visual studio and REST APIs
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
                    Via Azure Portal and REST APIs
                </p>
                <p>
                    User can configure Azure alerts.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Via Storm UI and REST APIs
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
                    Number of Streaming Units for each job. Each Streaming Unit processes up to 1MB/s. Max of 50 units by default. Call to increase limit.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Number of nodes in the HDI Storm cluster. No limit on number of nodes (top limit defined by your Azure quota).
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Data process limits</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Scale up or down number of Streaming Units to optimize for costs.
                </p>
                <p>
                    Goal to scale up to 1 GB/s
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Scale up or down cluster size to have more resources. There is no limit to data processed since Azure would allow to create cluster of any size
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Job update by user</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Stop and resume from last place stopped
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Stop and resume from last place stopped based on the watermark
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
                    Automatic update for bug fix and security update without job downtime.
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
                    <strong>Business continuity through a Highly Available Service with guaranteed SLA’s</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    SLA of 99.9% uptime
                </p>
                <p>
                    Auto-recovery from failures
                </p>
                <p>
                    Recovery of stateful temporal operators is built-in.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    SLA of 99.9% uptime of the Storm cluster. Apache Storm is a fault tolerant streaming platform however its Customer responsibility to ensure
                    their streaming jobs run uninterrupted.
                </p>
            </td>
        </tr>
        <tr>
            <td width="623" colspan="3" valign="top">
                <p>
                    <strong>Advanced Features</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Late arrival and out of order event handling</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Built-in configurable policies to reorder, drop events or adjust event time.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Customer needs to implement logic to handle.
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
                    Reference data available from Azure Blobs with max size of 100 MB of in-memory lookup cache. Refreshing of reference data is managed by the
                    service.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No limits on size or sources. Connectors available for HBase, DocumentDB, SQL Server /Azure. Unsupported ones can be implemented via custom
                    code.
                </p>
                <p>
                    Refreshing of reference data need to be handled by custom code
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
                    Yes, by configuring published Azure Machine Learning models as functions during ASA job creation
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Available through Storm Bolts
                </p>
            </td>
        </tr>
    </tbody>
</table>