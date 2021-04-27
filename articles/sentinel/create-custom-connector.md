---
title: Resources for creating Azure Sentinel custom connectors | Microsoft Docs
description: Learn about available resources for creating custom connectors for Azure Sentinel. Methods include the Log Analytics agent and API, Logstash, Logic Apps, PowerShell, and Azure Functions.
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
ms.date: 02/09/2021
ms.author: bagol
---

# Resources for creating Azure Sentinel custom connectors

Azure Sentinel provides a wide range of [built-in connectors for Azure services and external solutions](connect-data-sources.md), and also supports ingesting data from some sources without a dedicated connector.

If you're unable to connect your data source to Azure Sentinel using any of the existing solutions available, consider creating your own data source connector.

For a full list of supported connectors, see the [Azure Sentinel: The connectors grand (CEF, Syslog, Direct, Agent, Custom, and more)](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-the-connectors-grand-cef-syslog-direct-agent/ba-p/803891) blog post.

## Compare custom connector methods

The following table compares essential details about each method for creating custom connectors described in this article. Select the links in the table for more details about each method.

|Method description  |Capability | Serverless    |Complexity  |
|---------|---------|---------|---------|
|**[Log Analytics Agent](#connect-with-the-log-analytics-agent)** <br>Best for collecting files from on-premises and IaaS sources   | File collection only  |   No      |Low         |
|**[Logstash](#connect-with-logstash)** <br>Best for on-premises and IaaS sources, any source for which a plugin is available, and organizations already familiar with Logstash  | Available plugins, plus custom plugin, capabilities provide significant flexibility.   |   No; requires a VM or VM cluster to run           |   Low; supports many scenarios with plugins      |
|**[Logic Apps](#connect-with-logic-apps)** <br>High cost; avoid for high-volume data <br>Best for low-volume cloud sources  | Codeless programming allows for limited flexibility, without support for implementing algorithms.<br><br> If no available action already supports your requirements, creating a custom action may add complexity.    |    Yes         |   Low; simple, codeless development      |
|**[PowerShell](#connect-with-powershell)** <br>Best for prototyping and periodic file uploads | Direct support for file collection. <br><br>PowerShell can be used to collect more sources, but will require coding and configuring the script as a service.      |No               |  Low       |
|**[Log Analytics API](#connect-with-the-log-analytics-api)** <br>Best for ISVs implementing integration, and for unique collection requirements   | Supports all capabilities available with the code.  | Depends on the implementation           |     High    |
|**[Azure Functions](#connect-with-azure-functions)** Best for high-volume cloud sources, and for unique collection requirements  | Supports all capabilities available with the code.  |  Yes             |     High; requires programming knowledge    |
|     |         |                |

> [!TIP]
> For comparisons of using Logic Apps and Azure Functions for the same connector, see:
> 
> - [Ingest Fastly Web Application Firewall logs into Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/ingest-fastly-web-application-firewall-logs-into-azure-sentinel/ba-p/1238804)
> - Office 365 (Azure Sentinel GitHub community): [Logic App connector](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Get-O365Data) | [Azure Function connector](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/O365%20Data)
> 

## Connect with the Log Analytics agent

If your data source delivers events in files, we recommend that you use the Azure Monitor Log Analytics agent to create your custom connector.

- For more information, see [Collecting custom logs in Azure Monitor](../azure-monitor/agents/data-sources-custom-logs.md).

- For an example of this method, see [Collecting custom JSON data sources with the Log Analytics agent for Linux in Azure Monitor](../azure-monitor/agents/data-sources-json.md).

## Connect with Logstash

If you're familiar with [Logstash](https://www.elastic.co/logstash), you may want to use Logstash with the [Logstash output plug-in for Azure Sentinel](connect-logstash.md) to create your custom connector.

With the Azure Sentinel Logstash Output plugin, you can use any Logstash input and filtering plugins, and configure Azure Sentinel as the output for a Logstash pipeline. Logstash has a large library of plugins that enable input from various sources, such as Event Hubs, Apache Kafka, Files, Databases, and Cloud services. Use filtering plug-ins to parse events, filter unnecessary events, obfuscate values, and more.

For examples of using Logstash as a custom connector, see:

- [Hunting for Capital One Breach TTPs in AWS logs using Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/hunting-for-capital-one-breach-ttps-in-aws-logs-using-azure/ba-p/1019767) (blog)
- [Radware Azure Sentinel implementation guide](https://support.radware.com/ci/okcsFattach/get/1025459_3)

For examples of useful Logstash plugins, see:

- [Cloudwatch input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-cloudwatch.html)
- [Azure Event Hubs plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-azure_event_hubs.html)
- [Google Cloud Storage input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-google_cloud_storage.html)
- [Google_pubsub input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-google_pubsub.html)

> [!TIP]
> Logstash also enables scaled data collection using a cluster. For more information, see [Using a load-balanced Logstash VM at scale](https://techcommunity.microsoft.com/t5/azure-sentinel/scaling-up-syslog-cef-collection/ba-p/1185854).
>

## Connect with Logic Apps

Use an [Azure Logic App](../logic-apps/index.yml) to create a serverless, custom connector for Azure Sentinel.

> [!NOTE]
> While creating serverless connectors using Logic Apps may be convenient, using Logic Apps for your connectors may be costly for large volumes of data.
>
> We recommend that you use this method only for low-volume data sources, or enriching your data uploads.
>

1. **Use one of the following triggers to start your Logic Apps**:

    |Trigger  |Description  |
    |---------|---------|
    |**A recurring task**     |   For example, schedule your Logic App to retrieve data regularly from specific files, databases, or external APIs. <br>For more information, see [Create, schedule, and run recurring tasks and workflows in Azure Logic Apps](../connectors/connectors-native-recurrence.md).      |
    |**On-demand triggering**     | Run your Logic App on-demand for manual data collection and testing. <br>For more information, see  [Call, trigger, or nest logic apps using HTTPS endpoints](../logic-apps/logic-apps-http-endpoint.md).        |
    |**HTTP/S endpoint**     |  Recommended for streaming, and if the source system can start the data transfer. <br>For more information, see [Call service endpoints over HTTP or HTTPs](../connectors/connectors-native-http.md).       |
    |     |         |

1. **Use any of the Logic App connectors that read information to get your events**. For example:

    - [Connect to a REST API](/connectors/custom-connectors/)
    - [Connect to a SQL Server](/connectors/sql/)
    - [Connect to a file system](/connectors/filesystem/)

    > [!TIP]
    > Custom connectors to REST APIs, SQL Servers, and file systems also support retrieving data from on-premises data sources. For more information, see [Install on-premises data gateway](/connectors/filesystem/) documentation.
    >

1. **Prepare the information you want to retrieve**.

    For example, use the [parse JSON action](../logic-apps/logic-apps-perform-data-operations.md#parse-json-action) to access properties in JSON content, enabling you to select those properties from the dynamic content list when you specify inputs for your Logic App.

    For more information, see [Perform data operations in Azure Logic Apps](../logic-apps/logic-apps-perform-data-operations.md).

1. **Write the data to Log Analytics**.

    For more information, see the [Azure Log Analytics Data Collector](/connectors/azureloganalyticsdatacollector/) documentation.

For examples of how you can create a custom connector for Azure Sentinel using Logic Apps, see:

- [Create a data pipeline with the Data Collector API](/connectors/azureloganalyticsdatacollector/)
- [Palo Alto Prisma Logic App connector using a webhook](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Ingest-Prisma) (Azure Sentinel GitHub community)
- [Secure your Microsoft Teams calls with scheduled activation](https://techcommunity.microsoft.com/t5/azure-sentinel/secure-your-calls-monitoring-microsoft-teams-callrecords/ba-p/1574600) (blog)
- [Ingesting AlienVault OTX threat indicators into Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/ingesting-alien-vault-otx-threat-indicators-into-azure-sentinel/ba-p/1086566) (blog)

## Connect with PowerShell

The [Upload-AzMonitorLog PowerShell script](https://www.powershellgallery.com/packages/Upload-AzMonitorLog/) enables you to use PowerShell to stream events or context information to Azure Sentinel from the command line. This streaming effectively creates a custom connector between your data source and Azure Sentinel.

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

1. In Azure Sentinel, select **Settings** on the left, and then select the **Workspace settings** tab.

1. Under **Get started with Log Analytics** > **1 Connect a data source**, select **Windows and Linux agents management**.

1. Find your workspace ID, primary key, and secondary key on the **Windows servers** tabs.
## Connect with the Log Analytics API

You can stream events to Azure Sentinel by using the Log Analytics Data Collector API to call a RESTful endpoint directly.

While calling a RESTful endpoint directly requires more programming, it also provides more flexibility.

For more information, see the [Log Analytics Data collector API](../azure-monitor/logs/data-collector-api.md), especially the following examples:

- [C#](../azure-monitor/logs/data-collector-api.md#c-sample)
- [Python 2](../azure-monitor/logs/data-collector-api.md#python-2-sample)

## Connect with Azure Functions

Use Azure Functions together with a RESTful API and various coding languages, such as [PowerShell](../azure-functions/functions-reference-powershell.md), to create a serverless custom connector.

For examples of this method, see:

- [Connect your VMware Carbon Black Cloud Endpoint Standard to Azure Sentinel with Azure Function](connect-vmware-carbon-black.md)
- [Connect your Okta Single Sign-On to Azure Sentinel with Azure Function](connect-okta-single-sign-on.md)
- [Connect your Proofpoint TAP to Azure Sentinel with Azure Function](connect-proofpoint-tap.md)
- [Connect your Qualys VM to Azure Sentinel with Azure Function](connect-qualys-vm.md)
- [Ingesting XML, CSV, or other formats of data](../azure-monitor/logs/create-pipeline-datacollector-api.md#ingesting-xml-csv-or-other-formats-of-data)
- [Monitoring Zoom with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/monitoring-zoom-with-azure-sentinel/ba-p/1341516) (blog)
- [Deploy a Function App for getting Office 365 Management API data into Azure Sentinel](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/O365%20Data) (Azure Sentinel GitHub community)

## Parse your custom connector data

You can use your custom connector's built-in parsing technique to extract the relevant information and populate the relevant fields in Azure Sentinel.

For example:

- **If you've used Logstash**, use the [Grok](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html) filter plugin to parse your data.
- **If you've used an Azure function**, parse your data with code. For more information, see [Parsers](normalization.md#parsers).

Azure Sentinel supports parsing at query time. Parsing at query time enables you to push data in at the original format, and then parse on demand, when needed.

Parsing at query time also means you don't need to know your data's exact structure ahead of time, when you create your custom connector, or even the information you'll need to extract. Instead, parse your data at any time, even during an investigation.

> [!NOTE]
> Updating your parser also applies to data that you've already ingested into Azure Sentinel.
> 
## Next steps

Use the data ingested into Azure Sentinel to secure your environment with any of the following processes:

- [Get visibility into alerts](quickstart-get-visibility.md)
- [Visualize and monitor your data](tutorial-monitor-your-data.md)
- [Investigate incidents](tutorial-investigate-cases.md)
- [Detect threats](tutorial-detect-threats-built-in.md)
- [Automate threat prevention](tutorial-respond-threats-playbook.md)
- [Hunt for threats](hunting.md)
