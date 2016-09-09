<properties
	pageTitle="Analytics platforms: Apache Storm comparison to Stream Analytics | Microsoft Azure"
	description="Get guidance choosing a cloud analytics platform by using an Apache Storm comparison to Stream Analytics. Understand features and differences."
	keywords="analytics platform, analytics platforms, cloud analytics platform, storm comparison"
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
	ms.date="07/27/2016"
	ms.author="jeffstok"/>

# Help choosing a streaming analytics platform: Apache Storm comparison to Azure Stream Analytics

Get guidance choosing a cloud analytics platform by using this Apache Storm comparison to Azure Stream Analytics. Understand the value propositions of Stream Analytics versus Apache Storm as a managed service on Azure HDInsight, so you can choose the right solution for your business use cases.

Both analytics platforms provide benefits of a PaaS solution, there are a few major distinguishing capabilities that differentiate them. Capabilities as well as the limitations of these services are listed below to help you land on the solution you need to achieve your goals.

## Storm comparison to Stream Analytics: General features ##
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
                    <strong>Open Source</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    No, Azure Stream Analytics is a Microsoft proprietary offering.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Yes, Apache Storm is an Apache licensed technology.
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
                    There are no hardware requirements. Azure Stream Analytics is an Azure Service.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    There are no hardware requirements. Apache Storm is an Azure Service.
                </p>
            </td>
        </tr>
        <tr>
            <td width="174" valign="top">
                <p>
                    <strong>Top Level Unit</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    With Azure Stream Analytics customers deploy and monitor streaming jobs.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    With Apache Storm on HDInsight customers deploy and monitor a whole cluster, which can host multiple Storm jobs as well as other  workloads (incl. batch).
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
                    Stream Analytics is priced by volume of data processed and the number of streaming units (per hour the job is running) required.
                </p>
                <p>
                    <a href="http://azure.microsoft.com/en-us/pricing/details/stream-analytics/">Further pricing information can be found here.</a>
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    For Apache Storm on HDInsight, the unit of purchase is cluster-based, and is charged based on the time the cluster is running, independent of jobs deployed.
                </p>
                <p>
                    <a href="http://azure.microsoft.com/en-us/pricing/details/hdinsight/">Further pricing information can be found here.</a>
                </p>
            </td>
        </tr>
    </tbody>
</table>
## Authoring on each analytics platform ##
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
                    <strong>Capabilities: SQL DSL</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>
                    Yes, an easy to use SQL language support is available.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No, users must write code in Java C# or use Trident APIs.
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
                    Temporal operators must to be implemented by the user.
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
                    Interactive authoring and debugging experience through Azure Portal on sample data.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Development, debugging and monitoring experience is provided through the Visual Studio experience for .NET users, while for Java and other languages developers may use the IDE of their choice.
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
                    Stream Analytics offers basic job status and Operations logs as a way of debugging, but currently does not offer flexibility in what/how much is included in the logs ie: verbose mode.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Detailed logs are available for debugging purposes. There are two ways to surface logs to user, via visual Studio or user can RDP into the cluster to access logs.
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
                    Currently there is no support for UDFs.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    UDFs can be written in C#, Java or the language of your choice.
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
                    There is no support for extensible code in Stream Analytics.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Yes, there is availability to write custom code in C#, Java or other supported languages on Storm.
                </p>
            </td>
        </tr>
    </tbody>
</table>
## Data sources and outputs ##
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
				 <strong>Input Data Sources</strong>
                </p>
            </td>
            <td width="204" valign="top">
                <p>The supported input sources are Azure Event Hubs and Azure Blobs.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    There are connectors available for Event Hubs, Service Bus, Kafka, etc. Unsupported connectors may be implemented via custom code.
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
                    Supported input formats are Avro, JSON, CSV.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Any format may be implemented via custom code.
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
                    A streaming job may have multiple outputs. Supported Outputs: Azure Event Hubs, Azure Blob Storage, Azure Tables, Azure SQL DB, and PowerBI.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Support for many outputs in a topology, each output may have custom logic for downstream processing. Out of the box Storm includes connectors for PowerBI, Azure Event Hubs, Azure Blob Store, Azure DocumentDB, SQL and HBase. Unsupported connectors may be implemented via custom code.
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
                    Stream Analytics requires UTF-8 data format to be utilized.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Any data encoding format may be implemented via custom code.
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
                    <strong>Job Deployment model</strong>
                </p>
                <p>
                    - <strong>Azure Portal</strong>
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
                    Deployment is implemented via Azure Portal, PowerShell and REST APIs.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Depolyment is implemented via Azure Portal, PowerShell, Visual Studio and REST APIs.
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
                    Monitoring is implemented via Azure Portal and REST APIs.
                </p>
                <p>
                    The user may also configure Azure alerts.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    Monitoring is implemented via Storm UI and REST APIs.
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
                    Number of nodes in the HDI Storm cluster. No limit on number of nodes (Top limit defined by your Azure quota). Call to increase limit.
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
                    Users can scale up or down number of Streaming Units to increase data processing or optimize costs.
                </p>
                <p>
                    Scale up to 1 GB/s
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    User can scale up or down cluster size to meet needs.
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
                    Stop and resume from last place stopped based on the watermark.
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
                    SLA of 99.9% uptime of the Storm cluster. Apache Storm is a fault tolerant streaming platform however it is the customers' responsibility to ensure their streaming jobs run uninterrupted.
                </p>
            </td>
        </tr>
    </tbody>
</table>
## Advanced Features ##
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
                    User must implement logic to handle this scenario.
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
                    Reference data available from Azure Blobs with max size of 100 MB of in-memory lookup cache. Refreshing of reference data is managed by the service.
                </p>
            </td>
            <td width="246" valign="top">
                <p>
                    No limits on data size. Connectors available for HBase, DocumentDB, SQL Server and Azure. Unsupported connectors may be implemented via custom code.
                </p>
                <p>
                    Refreshing of reference data must be handled by custom code.
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
                    By configuring published Azure Machine Learning models as functions during ASA job creation <a href="http://blogs.msdn.com/b/streamanalytics/archive/2015/05/24/real-time-scoring-of-streaming-data-using-machine-learning-models.aspx">(private preview)</a>.
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
