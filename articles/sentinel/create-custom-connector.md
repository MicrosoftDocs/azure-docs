---
title: Resources for creating Azure Sentinel custom connectors | Microsoft Docs
description: Learn about available resources for creating custom connectors for Azure Sentinel, including the Log Analytics agent, Fluentd, Logstash, Logic Apps, PowerShell, API, and Azure Functions.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/01/2021
ms.author: bagol
---

# Resources for creating Azure Sentinel custom connectors

Azure Sentinel provides a wide range of [built-in connectors for Azure services and external solutions](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-the-connectors-grand-cef-syslog-direct-agent/ba-p/803891), and also supports ingesting data from some sources without a dedicated connector. 

If you are unable to connect your data source to Azure Sentinel using any of the existing solutions available, consider creating your own data source connector using the methods described in this article.

## Azure Monitor Log Analytics agent

If your data source delivers events in files, we recommend that you use the Azure Monitor Log Analytics agent to create your custom connector.

- For more information, see [Collecting custom logs in Azure Monitor](/azure/azure-monitor/platform/data-sources-custom-logs).

- For an example of this method, see [Collecting custom JSON data sources with the Log Analytics agent for Linux in Azure Monitor](/azure/azure-monitor/platform/data-sources-json).
 
## Use Logstash to create your connector

If you're familiar with [Logstash](https://www.elastic.co/logstash), you may want to use Logstash with the [Logstash output plug-in for Azure Sentinel](connect-logstash.md) to create your custom connector.

You can use any Logstash input and filtering plugins and configure Azure Sentinel as the output for a Logstash pipeline. Logstash's large library of plug-ins enables input from sources such as Event Hubs, Apache Kafka, Files, Databases, and Cloud services. Use filtering plug-ins to parse events, filter unnecessary events, obfuscate values, and more.

For an example of using Logstash as a custom connector, see [Collecting AWS CloudWatch data](https://techcommunity.microsoft.com/t5/azure-sentinel/hunting-for-capital-one-breach-ttps-in-aws-logs-using-azure/ba-p/1019767) (*Ingest S3 Logs to Azure Sentinel via Logstash*).

> [!TIP]
> Logstash also enables scaled data collection using a cluster. For more information, see [Using a load-balanced Logstash VM at scale](https://techcommunity.microsoft.com/t5/azure-sentinel/scaling-up-syslog-cef-collection/ba-p/1185854).
> 

## Using Logic Apps to create your connector

Create an Azure Sentinel playbook to use a Logic App as a serverless, custom connector. 

> [!NOTE]
> While creating serverless connectors may be convenient, using Logic Apps for your connectors may be costly for large volumes of data. 
>
> We recommend that you use this method only for low-volume data sources, or enriching your data uploads.
>

1. **Use one of the following triggers to start your playbook**:

    - **A recurring task**. For example, schedule your Logic App to retrieve data regularly from specific files, databases, or external APIs. For more information, see [Create, schedule, and run recurring tasks and workflows in Azure Logic Apps](/azure/connectors/connectors-native-recurrence). 
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

For examples of how you can create a custom connector for Azure Sentinel using Logic Apps, see:

- [Create a data pipeline with the Data Collector API](/connectors/azureloganalyticsdatacollector/)
- [Sending enriched Azure Sentinel alerts to 3rd party SIEM and ticketing systems](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-enriched-azure-sentinel-alerts-to-3rd-party-siem-and/ba-p/1456976) (blog)
- [Ingesting AlienVault OTX threat indicators into Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/ingesting-alien-vault-otx-threat-indicators-into-azure-sentinel/ba-p/1086566) (blog)
- [Sending Proofpoint TAP logs to Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-proofpoint-tap-logs-to-azure-sentinel/ba-p/767727) (blog)


## Use PowerShell to create your custom connector

The [Upload-AzMonitorLog PowerShell script](https://www.powershellgallery.com/packages/Upload-AzMonitorLog/) enables you to use PowerShell to stream events or context information to Azure Sentinel from the command line, effectively creating a custom connector between your data source and Azure Sentinel.

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
|**WorkspaceId**     |   Your Azure Sentinel workspace ID, where you'll be storing your data.  [Find your workspace ID and key](#find-your-workspace-id-and-key).  |
|**WorkspaceKey**     |   The primary or secondary key for the Azure Sentinel workspace where you'll be storing your data. [Find your workspace ID and key](#find-your-workspace-id-and-key).  |
|**LogTypeName**     |    The name of the custom log table where you want to store the data. A suffix of **_CL** will automatically be added to the end of your table name.  |
|**AddComputerName**     |   When this parameter exists, the script adds the current computer name to every log record, in a field named **Computer**.      |
|**TaggedAzureResourceId**     | When this parameter exists, the script associates all uploaded log records with the specified Azure resource. <br><br>This association enables the uploaded log records for resource-context queries, and adheres to resource-centric, role-based access control.       |
|**AdditionalDataTaggingName**     |      When this parameter exists, the script adds another field to every log record, with the configured name, and the value that's configured for the **AdditionalDataTaggingValue** parameter. <br><br>In this case, **AdditionalDataTaggingValue** must not be empty. |
|**AdditionalDataTaggingValue**     |   When this parameter exists, the script adds another field to every log record, with the configured value, and the field name configured for the **AdditionalDataTaggingName** parameter. <br><br>If the **AdditionalDataTaggingName** parameter is empty, but a value is configured, the default field name is **DataTagging**.       |
|     |         |

### Find your workspace ID and key

Find the details for the **WorkspaceID** and **WorkspaceKey** parameters in Azure Sentinel:

1. In Azure Sentinel, select **Settings** on the left. 

1. Under **Get started with Log Analytics** > **1 Connect a data source**, select **Windows and Linux agents management**. 

1. Find your workspace ID, primary key, and secondary key on the **Windows servers** tabs.
## Create a custom collector via a direct API

Instead of using the Log Analytics Collector API to stream events to Azure Sentinel, you can call a RESTful endpoint directly to stream events to Azure Sentinel.

While calling a RESTful endpoint directly requires more programming, it also provides more flexibility. 

For more information, see the [Log Analytics Data collector API](/azure/azure-monitor/platform/data-collector-api), especially the following examples:

- [C#](https://docs.microsoft.com/azure/azure-monitor/platform/data-collector-api#c-sample)
- [Python 2](https://docs.microsoft.com/azure/azure-monitor/platform/data-collector-api#python-2-sample)
 
## Use Azure Functions to create your custom connector

Use Azure Functions to create a serverless, custom connector using the API connector and any language, including [PowerShell](/azure/azure-functions/functions-reference-powershell?tabs=portal).

For examples of this method, see:

- [Ingesting XML, CSV, or other formats of data](/azure/azure-monitor/platform/create-pipeline-datacollector-api#ingesting-xml-csv-or-other-formats-of-data)
- [Monitoring Zoom with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/monitoring-zoom-with-azure-sentinel/ba-p/1341516) (blog)
- [Deploy a Function App for getting Office 365 Management API data into Azure Sentinel](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/O365%20Data) (GitHub)
- [Universal logging for LISA app](https://microsoft.github.io/techcasestudies/azure%20functions/2017/05/15/LisaApp.html) (Technical Case Studies)

## Parsing your custom connector data

You can use your custom connector's built-in parsing technique to extract the relevant information and populate the relevant fields in Azure Sentinel.

For example:

- **If you've used Logstash**, use the [Grok](https://www.elastic.co/guide/logstash/current/plugins-filters-grok.html) filter plugin to parse your data. 
- **If you've used the Log Analytics agent**, use the  [Fluentd parsers](https://docs.fluentd.org/parser) to parse your data.

Azure Sentinel also allows parsing at query time, which enables you to push data in at the original format, and then parse on demand, when needed. 

When you parse at query time, you don't need to know your data's exact structure when you create your custom connector, or even identify the information you need to extract. Instead, you can parse your data at any time, even during an investigation. 

Updating your parser also applies to data that you've already ingested into Azure Sentinel.

Save your parsers as functions, and use those functions instead of Azure Sentinel tables in any query, including hunting and detection queries. For more information, see:

- [Data normalization in Azure Sentinel](normalization.md#parsers)
- [Parse text in Azure Monitor logs](/azure/azure-monitor/log-query/parse-text)
 
> [!TIP]
> JSON, XML, and CSV are especially convenient for parsing at query time. Azure Sentinel has built-in parsing functions for JSON, XML, and CSV, as well as a JSON parsing tool. 
>
> For more information, see [Using JSON fields in Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/tip-easily-use-json-fields-in-sentinel/ba-p/768747) (blog).
> 


## Next steps

Use the data ingested into Azure Sentinel to secure your environment with any of the following processes:

- [Get visibility into alerts](quickstart-get-visibility.md)
- [Visualize and monitor your data](tutorial-monitor-your-data.md)
- [Investigate incidents](tutorial-investigate-cases.md)
- [Detect threats](tutorial-detect-threats-built-in.md)
- [Automate threat prevention](tutorial-respond-threats-playbook.md)
- [Hunt for threats](hunting.md)
