---
title: Resources for creating Microsoft Sentinel custom connectors | Microsoft Docs
description: Learn about available resources for creating custom connectors for Microsoft Sentinel. Methods include the Log Analytics agent and API, Logstash, Logic Apps, PowerShell, and Azure Functions.
author: limwainstein
ms.topic: conceptual
ms.date: 01/09/2023
ms.author: lwainstein
---

# Resources for creating Microsoft Sentinel custom connectors

Microsoft Sentinel provides a wide range of [built-in connectors for Azure services and external solutions](connect-data-sources.md), and also supports ingesting data from some sources without a dedicated connector.

If you're unable to connect your data source to Microsoft Sentinel using any of the existing solutions available, consider creating your own data source connector.

For a full list of supported connectors, see the [Microsoft Sentinel: The connectors grand (CEF, Syslog, Direct, Agent, Custom, and more)](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-the-connectors-grand-cef-syslog-direct-agent/ba-p/803891) blog post.

## Compare custom connector methods

The following table compares essential details about each method for creating custom connectors described in this article. Select the links in the table for more details about each method.

|Method description  |Capability | Serverless    |Complexity  |
|---------|---------|---------|---------|
| **[Codeless Connector Platform (CCP)](#connect-with-the-codeless-connector-platform)** <br>Best for less technical audiences to create SaaS connectors using a configuration file instead of advanced development. | Supports all capabilities available with the code. | Yes | Low; simple, codeless development
|**[Log Analytics Agent](#connect-with-the-log-analytics-agent)** <br>Best for collecting files from on-premises and IaaS sources   | File collection only  |   No      |Low         |
|**[Logstash](#connect-with-logstash)** <br>Best for on-premises and IaaS sources, any source for which a plugin is available, and organizations already familiar with Logstash  | Available plugins, plus custom plugin, capabilities provide significant flexibility.   |   No; requires a VM or VM cluster to run           |   Low; supports many scenarios with plugins      |
|**[Logic Apps](#connect-with-logic-apps)** <br>High cost; avoid for high-volume data <br>Best for low-volume cloud sources  | Codeless programming allows for limited flexibility, without support for implementing algorithms.<br><br> If no available action already supports your requirements, creating a custom action may add complexity.    |    Yes         |   Low; simple, codeless development      |
|**[PowerShell](#connect-with-powershell)** <br>Best for prototyping and periodic file uploads | Direct support for file collection. <br><br>PowerShell can be used to collect more sources, but will require coding and configuring the script as a service.      |No               |  Low       |
|**[Log Analytics API](#connect-with-the-log-analytics-api)** <br>Best for ISVs implementing integration, and for unique collection requirements   | Supports all capabilities available with the code.  | Depends on the implementation           |     High    |
|**[Azure Functions](#connect-with-azure-functions)** <br>Best for high-volume cloud sources, and for unique collection requirements  | Supports all capabilities available with the code.  |  Yes             |     High; requires programming knowledge    |


> [!TIP]
> For comparisons of using Logic Apps and Azure Functions for the same connector, see:
>
> - [Ingest Fastly Web Application Firewall logs into Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/ingest-fastly-web-application-firewall-logs-into-azure-sentinel/ba-p/1238804)
> - Office 365 (Microsoft Sentinel GitHub community): [Logic App connector](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Get-O365Data) | [Azure Function connector](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/O365%20Data)
>

## Connect with the Codeless Connector Platform

The Codeless Connector Platform (CCP) provides a configuration file that can be used by both customers and partners, and then deployed to your own workspace, or as a solution to Microsoft Sentinel's solution's gallery.

Connectors created using the CCP are fully SaaS, without any requirements for service installations, and also include health monitoring and full support from Microsoft Sentinel.

For more information, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md).

## Connect with the Log Analytics agent

If your data source delivers events in files, we recommend that you use the Azure Monitor Log Analytics agent to create your custom connector.

- For more information, see [Collecting custom logs in Azure Monitor](../azure-monitor/agents/data-sources-custom-logs.md).

- For an example of this method, see [Collecting custom JSON data sources with the Log Analytics agent for Linux in Azure Monitor](../azure-monitor/agents/data-sources-json.md).

## Connect with Logstash

If you're familiar with [Logstash](https://www.elastic.co/logstash), you may want to use Logstash with the [Logstash output plug-in for Microsoft Sentinel](connect-logstash.md) to create your custom connector.

With the Microsoft Sentinel Logstash Output plugin, you can use any Logstash input and filtering plugins, and configure Microsoft Sentinel as the output for a Logstash pipeline. Logstash has a large library of plugins that enable input from various sources, such as Event Hubs, Apache Kafka, Files, Databases, and Cloud services. Use filtering plug-ins to parse events, filter unnecessary events, obfuscate values, and more.

For examples of using Logstash as a custom connector, see:

- [Hunting for Capital One Breach TTPs in AWS logs using Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/hunting-for-capital-one-breach-ttps-in-aws-logs-using-azure/ba-p/1019767) (blog)
- [Radware Microsoft Sentinel implementation guide](https://support.radware.com/ci/okcsFattach/get/1025459_3)

For examples of useful Logstash plugins, see:

- [Cloudwatch input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-cloudwatch.html)
- [Azure Event Hubs plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-azure_event_hubs.html)
- [Google Cloud Storage input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-google_cloud_storage.html)
- [Google_pubsub input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-google_pubsub.html)

> [!TIP]
> Logstash also enables scaled data collection using a cluster. For more information, see [Using a load-balanced Logstash VM at scale](https://techcommunity.microsoft.com/t5/azure-sentinel/scaling-up-syslog-cef-collection/ba-p/1185854).
>

## Connect with Logic Apps

Use [Azure Logic Apps](../logic-apps/index.yml) to create a serverless, custom connector for Microsoft Sentinel.

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

For examples of how you can create a custom connector for Microsoft Sentinel using Logic Apps, see:

- [Create a data pipeline with the Data Collector API](/connectors/azureloganalyticsdatacollector/)
- [Palo Alto Prisma Logic App connector using a webhook](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Ingest-Prisma) (Microsoft Sentinel GitHub community)
- [Secure your Microsoft Teams calls with scheduled activation](https://techcommunity.microsoft.com/t5/azure-sentinel/secure-your-calls-monitoring-microsoft-teams-callrecords/ba-p/1574600) (blog)
- [Ingesting AlienVault OTX threat indicators into Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/ingesting-alien-vault-otx-threat-indicators-into-azure-sentinel/ba-p/1086566) (blog)

## Connect with PowerShell

The [Upload-AzMonitorLog PowerShell script](https://www.powershellgallery.com/packages/Upload-AzMonitorLog/) enables you to use PowerShell to stream events or context information to Microsoft Sentinel from the command line. This streaming effectively creates a custom connector between your data source and Microsoft Sentinel.

For example, the following script uploads a CSV file to Microsoft Sentinel:

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
|**WorkspaceId**     |   Your Microsoft Sentinel workspace ID, where you'll be storing your data.  [Find your workspace ID and key](#find-your-workspace-id-and-key).  |
|**WorkspaceKey**     |   The primary or secondary key for the Microsoft Sentinel workspace where you'll be storing your data. [Find your workspace ID and key](#find-your-workspace-id-and-key).  |
|**LogTypeName**     |    The name of the custom log table where you want to store the data. A suffix of **_CL** will automatically be added to the end of your table name.  |
|**AddComputerName**     |   When this parameter exists, the script adds the current computer name to every log record, in a field named **Computer**.      |
|**TaggedAzureResourceId**     | When this parameter exists, the script associates all uploaded log records with the specified Azure resource. <br><br>This association enables the uploaded log records for resource-context queries, and adheres to resource-centric, role-based access control.       |
|**AdditionalDataTaggingName**     |      When this parameter exists, the script adds another field to every log record, with the configured name, and the value that's configured for the **AdditionalDataTaggingValue** parameter. <br><br>In this case, **AdditionalDataTaggingValue** must not be empty. |
|**AdditionalDataTaggingValue**     |   When this parameter exists, the script adds another field to every log record, with the configured value, and the field name configured for the **AdditionalDataTaggingName** parameter. <br><br>If the **AdditionalDataTaggingName** parameter is empty, but a value is configured, the default field name is **DataTagging**.       |


### Find your workspace ID and key

Find the details for the **WorkspaceID** and **WorkspaceKey** parameters in Microsoft Sentinel:

1. In Microsoft Sentinel, select **Settings** on the left, and then select the **Workspace settings** tab.

1. Under **Get started with Log Analytics** > **1 Connect a data source**, select **Windows and Linux agents management**.

1. Find your workspace ID, primary key, and secondary key on the **Windows servers** tabs.

## Connect with the Log Analytics API

You can stream events to Microsoft Sentinel by using the Log Analytics Data Collector API to call a RESTful endpoint directly.

While calling a RESTful endpoint directly requires more programming, it also provides more flexibility.

For more information, see the [Log Analytics Data collector API](../azure-monitor/logs/data-collector-api.md), especially the following examples:

- [C#](../azure-monitor/logs/data-collector-api.md#sample-requests)
- [Python](../azure-monitor/logs/data-collector-api.md#sample-requests)

## Connect with Azure Functions

Use Azure Functions together with a RESTful API and various coding languages, such as [PowerShell](../azure-functions/functions-reference-powershell.md), to create a serverless custom connector.

For examples of this method, see:

- [Connect your VMware Carbon Black Cloud Endpoint Standard to Microsoft Sentinel with Azure Function](./data-connectors/vmware-carbon-black-cloud-using-azure-functions.md)
- [Connect your Okta Single Sign-On to Microsoft Sentinel with Azure Function](./data-connectors/okta-single-sign-on-using-azure-function.md)
- [Connect your Proofpoint TAP to Microsoft Sentinel with Azure Function](./data-connectors/proofpoint-tap-using-azure-functions.md)
- [Connect your Qualys VM to Microsoft Sentinel with Azure Function](data-connectors/qualys-vulnerability-management-using-azure-functions.md)
- [Ingesting XML, CSV, or other formats of data](../azure-monitor/logs/create-pipeline-datacollector-api.md#ingesting-xml-csv-or-other-formats-of-data)
- [Monitoring Zoom with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/monitoring-zoom-with-azure-sentinel/ba-p/1341516) (blog)
- [Deploy a Function App for getting Office 365 Management API data into Microsoft Sentinel](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/O365%20Data) (Microsoft Sentinel GitHub community)

## Parse your custom connector data

To take advantage of the data collected with your custom connector, [develop Advanced Security Information Model (ASIM) parsers](normalization-develop-parsers.md) to work with your connector. Using [ASIM](normalization.md) enables Microsoft Sentinel's built-in content to use your custom data and makes it easier for analysts to query the data.

If your connector method allows for it, you can implement part of the parsing as part of the connector to improve query time parsing performance:
- **If you've used Logstash**, use the [Grok](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html) filter plugin to parse your data.
- **If you've used an Azure function**, parse your data with code.

You will still need to implement ASIM parsers, but implementing part of the parsing directly with the connector simplifies the parsing and improves performance.

## Next steps

Use the data ingested into Microsoft Sentinel to secure your environment with any of the following processes:

- [Get visibility into alerts](get-visibility.md)
- [Visualize and monitor your data](monitor-your-data.md)
- [Investigate incidents](investigate-cases.md)
- [Detect threats](detect-threats-built-in.md)
- [Automate threat prevention](tutorial-respond-threats-playbook.md)
- [Hunt for threats](hunting.md)

Also, learn about one example of creating a custom connector to monitor Zoom: [Monitoring Zoom with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/monitoring-zoom-with-azure-sentinel/ba-p/1341516).
