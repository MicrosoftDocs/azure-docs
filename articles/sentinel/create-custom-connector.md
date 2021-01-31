---
title: Creating custom connectors for Azure Sentinel | Microsoft Docs
description: Extend Azure Sentinel to your own connector if there isn't yet a built-in connector for your data source.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/28/2021
ms.author: bagol
---

# Creating custom connectors for Azure Sentinel

Azure Sentinel provides a wide range of [built-in connectors for Azure services and external solutions](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-the-connectors-grand-cef-syslog-direct-agent/ba-p/803891), and also supports ingesting data from some sources without a dedicated connector. For example, you can [collect telemetry from on-premises and IaaS servers](https://techcommunity.microsoft.com/t5/Azure-Sentinel/Azure-Sentinel-Agent-Collecting-telemetry-from-on-prem-and-IaaS/ba-p/811760),  and [collect log files from Microsoft services and applications](https://techcommunity.microsoft.com/t5/Azure-Sentinel/Collecting-Azure-PaaS-services-logs-in-Azure-Sentinel/ba-p/792669).

If you are unable to connect to Azure Sentinel using any of the existing solutions available, you may consider creating your own data source connector to ingest vent data and import context and enrichment data from your data source to Azure Sentinel.

## Use the Log Analytics agent to create your connector

If your data source delivers events in files, we recommend that you use the Azure Monitor Log Analytics agent, which can collect events stored in files.

For more information, see [Collecting custom logs in Azure Monitor](/azure/azure-monitor/platform/data-sources-custom-logs).

The Log Analytics agent is based on [Fluentd](https://www.fluentd.org/), and can use any [Fluentd input plugin](https://www.fluentd.org/plugins/all#input-output) bundled with the agent to collect events and then forward them to an Azure Sentinel workspace.

- For an example of this method, see [Collecting custom JSON data sources with the Log Analytics agent for Linux in Azure Monitor](/azure/azure-monitor/platform/data-sources-json).

- For more information about other collection roles supported by the Log Analytics agent, see the [Azure Sentinel Agent: Collecting from servers and workstations, on-prem and in the cloud
](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-agent-collecting-from-servers-and-workstations-on/ba-p/811760) blog.

## Use Fluentd or Fluent Bit to create your connector

If the Log Analytics agent is not flexible enough for your data source, you may want to use [Fluentd](https://www.fluentd.org/) directly or its lighter sibling, [Fluent Bit](https://docs.fluentbit.io/manual/).

For more information, see:

[FluentD plug-in for Log Analytics output](https://github.com/yokawasa/fluent-plugin-azure-loganalytics)
[Fluent Bit plug-in for Azure Sentinel](https://docs.fluentbit.io/manual/pipeline/outputs/azure)
 

## Use Logstash to create your connector

If you're familiar with [Logstash](https://www.elastic.co/logstash), you may want to use the [Logstash output plug-in for Azure Sentinel](connect-logstash.md).

The Logstash plugin enables you to leverage any Logstash input plugin, and configure Azure Sentinel as the output for a Logstash pipeline.

Sample use cases for the Logstash plug-in include:

- [Collecting AWS CloudWatch data](https://techcommunity.microsoft.com/t5/azure-sentinel/hunting-for-capital-one-breach-ttps-in-aws-logs-using-azure/ba-p/1019767). See *Ingest S3 Logs to Azure Sentinel via Logstash*.
- [Using a load-balanced Logstash VM at scale](https://techcommunity.microsoft.com/t5/azure-sentinel/scaling-up-syslog-cef-collection/ba-p/1185854)


## Using Logic Apps to create your connector

Create an Azure Sentinel playbook to use a Logic App as a serverless, custom connector. 

> [!NOTE]
> While creating serverless connectors may be convenient, using Logic Apps for your connectors may be costly for large volumes of data. We recommend that you use this method only for low-volume data sources, or enriching your data uploads.
>

1. **Use one of the following triggers to start your playbook**:

    - **A recurring task**. For example, schedule your Logic App to retrieve data from specific files, databases, or external APIs on a regular basis. For more information, see [Create, schedule, and run recurring tasks and workflows in Azure Logic Apps](/azure/connectors/connectors-native-recurrence). 
    - **On-demand triggering**. Run your Logic App on-demand for manual data collection and testing. For more information, see  [Call, trigger, or nest logic apps using HTTPS endpoints](/azure/logic-apps/logic-apps-http-endpoint).
    - **HTTP/S endpoint**. Recommended for streaming, and if the source system can initiate the data transfer. For more information, see [Call service endpoints over HTTP or HTTPs](/azure/connectors/connectors-native-http).

1. **Build one of the following types of custom connectors**:

    - [Connect to a REST API](/connectors/custom-connectors/)
    - [Connect to a SQL Server](/connectors/sql/)
    - [Connect to a file system](/connectors/filesystem/)

    > [!TIP]
    > Custom connectors to REST APIs, SQL Servers, and file systems also support retrieving data from on-premises data sources. For more information, see [Install on-premises data gateway](/connectors/filesystem/) documentation. 
    >

1. **Prepare the information you want to retrieve**. 

    For example, use the [parse JSON action](/azure/logic-apps/logic-apps-perform-data-operations#parse-json-action) to access properties in JSON content, enabling you to select those properties from the dynamic content list when you specify inputs for your Logic App.

    For more information, see [Perform data operations in Azure Logic Apps](/azure/logic-apps/logic-apps-perform-data-operations).

1. **Write the data to Log Analytics**.

    For more information, see the [Azure Log Analytics Data Collector](/connectors/azureloganalyticsdatacollector/) documentation.

### Sample custom connectors that use Logic Apps

For examples of how you can create a custom connector for Azure Sentinel using Logic Apps, see:

- [Create a data pipeline with the Data Collector API](/connectors/azureloganalyticsdatacollector/)
- [Sending Proofpoint TAP logs to Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-proofpoint-tap-logs-to-azure-sentinel/ba-p/767727) (blog)


## Use PowerShell to create your custom connector

The [Upload-AzMonitorLog PowerShell script](https://www.powershellgallery.com/packages/Upload-AzMonitorLog/) enables you to use PowerShell to stream events or context information to Azure Sentinel from the command line. 

For example, the following script uploads a CSV file to Azure Sentinel:

``` PowerShell
Import-Csv .\testcsv.csv 
| .\Upload-AzMonitorLog.ps1 
-WorkspaceId '69f7ec3e-cae3-458d-b4ea-6975385-6e426'
-WorkspaceKey $WSKey
-LogTypeName 'MyNewCSV'
-AddComputerName 
-AdditionalDataTaggingName "MyAdditionalField" 
-AdditionalDataTaggingValue "Foo"
```

The [Upload-AzMonitorLog PowerShell script](https://www.powershellgallery.com/packages/Upload-AzMonitorLog/) script uses the following parameters:

|Parameter  |Description  |
|---------|---------|
|**WorkspaceId**     |   Your Azure Sentinel workspace ID, where you'll be storing your data.    |
|**WorkspaceKey**     |   The primary or secondary key for the Azure Sentinel workspace where you'll be storing your data. <br><br>You can find this workspace ID in Azure Sentinel > Advanced Settings > Windows Server tab. |
|**LogTypeName**     |    The name of the custom log table where you want to store the data. A suffix of **_CL** will automatically be added to the end of your table name.  |
|**AddComputerName**     |   When turned on, the script adds the current computer name to every log record, in a field named **Computer**.      |
|**TaggedAzureResourceId**     | When this parameter exists, the script associates all uploaded log records with the specified Azure resource. <br><br>This enables these log records for resource-context queries, as well as adheres to resource-centric, role-based access control.       |
|**AdditionalDataTaggingName**     |      When this parameter exists, the script adds an additional field to every log record, with the configured name, and the value that's configured for the **AdditionalDataTaggingValue** parameter. In this case, **AdditionalDataTaggingValue** must not be empty. |
|**AdditionalDataTaggingValue**     |   When this parameter exists, the script adds an additional field to every log record, with the configured value, and the field name configured for the **AdditionalDataTaggingName** parameter. <br><br>If the **AdditionalDataTaggingName** parameter is empty, but a value is configured, the default field name is **DataTagging**.       |
|     |         |

## Create a custom collector via a direct API

Instead of using the Log Analytics Collector API to stream events to Azure Sentinel, you can call a RESTful endpoint directly to stream events to Azure Sentinel.

While calling a RESTful endpoint directly requires more programming, it also provides more flexibility. 

For more information, see the [Log Analytics Data collector API](/azure/azure-monitor/platform/data-collector-api), especially the following examples:

- [C#](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-collector-api#c-sample)
- [Python 2](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-collector-api#python-2-sample)
 
## Use Azure Functions to create your custom connector

For an additional serverless option, you can use Azure Functions to implement a connector using the API connector and any language, including [PowerShell](/azure/azure-functions/functions-reference-powershell?tabs=portal).

For examples of this method, see:

- [Ingesting XML, CSV, or other formats of data](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/create-pipeline-datacollector-api#ingesting-xml-csv-or-other-formats-of-data)
- [Deploy a Function App for getting Office 365 Management API data into Azure Sentinel](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/O365%20Data) (GitHub)
- [Universal logging for LISA app](https://microsoft.github.io/techcasestudies/azure%20functions/2017/05/15/LisaApp.html) (Technical Case Studies)

## Parsing your custom connector data

You can use your custom connector's built-in parsing technique to extract the relevant information and populate the relevant fields in Azure Sentinel.

FOr example, if you've used Logstash, use the [Grok](https://www.elastic.co/guide/logstash/current/plugins-filters-grok.html) filter plugin to parse your data. And if you've used the Log Analytics agent, use the  [Fluentd parsers](https://docs.fluentd.org/parser). 

Azure Sentinel also allows parsing at query time, which is more flexible and simplifies the import process. 

Parsing at query time enables you to push data in at the original format, and then parse on demand, when needed. Updating your parser will also apply to data that you've already ingested into Azure Sentinel.

Parsing at query time also means that you don't need to know your data's exact structure when you create your custom connector, or even identify the information you need to extract. 

Parsing at query time can be implemented at any stage, even during an investigation. 
 
> [!TIP]
> JSON, XML, and CSV are especially convenient for parsing at query time. Azure Sentinel has built-in parsing functions for JSON, XML, and CSV, as well as a JSON parsing tool. For more information, see [Using JSON fields in Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/tip-easily-use-json-fields-in-sentinel/ba-p/768747) (blog).
> 

Save your parsers as functions, and use those functions instead of Azure Sentinel tables in any query, including hunting an detection queries. For more information, see:

- [Data normalization in Azure Sentinel](normalization.md#parsers)
- [Parse text in Azure Monitor logs](/azure/azure-monitor/log-query/parse-text)


## Next steps
In this article, you learned how to run a hunting investigation with Azure Sentinel. To learn more about Azure Sentinel, see the following articles:


- [Use notebooks to run automated hunting campaigns](notebooks.md)
- [Use bookmarks to save interesting information while hunting](bookmarks.md)