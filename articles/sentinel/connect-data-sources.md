---
title: Microsoft Sentinel data connectors
description: Learn about supported data connectors, like Microsoft Defender XDR (formerly Microsoft 365 Defender), Microsoft 365 and Office 365, Microsoft Entra ID, ATP, and Defender for Cloud Apps to Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 03/02/2024
ms.author: yelevin
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customer intent: As a security architect or SOC analyst, I want to understand what data connectors are in Microsoft Sentinel.
---

# Microsoft Sentinel data connectors

After you onboard Microsoft Sentinel into your workspace, use data connectors to start ingesting your data into Microsoft Sentinel. Microsoft Sentinel comes with many out of the box connectors for Microsoft services, which integrate in real time. For example, the Microsoft Defender XDR connector is a service-to-service connector that integrates data from Office 365, Microsoft Entra ID, Microsoft Defender for Identity, and Microsoft Defender for Cloud Apps.

Built-in connectors enable connection to the broader security ecosystem for non-Microsoft products. For example, use Syslog, Common Event Format (CEF), or REST APIs to connect your data sources with Microsoft Sentinel.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

<a name="agent-options"></a>
<a name="data-connection-methods"></a>
<a name="map-data-types-with-microsoft-sentinel-connection-options"></a>

## Data connectors provided with solutions

Microsoft Sentinel solutions provide packaged security content, including data connectors, workbooks, analytics rules, playbooks, and more. When you deploy a solution with a data connector, you get the data connector together with related content in the same deployment.

The Microsoft Sentinel **Data connectors** page lists the installed or in-use data connectors.

#### [Azure portal](#tab/azure-portal)

:::image type="content" source="media/connect-data-sources/data-connector-list.png" alt-text="Screenshot of the data connectors gallery." lightbox="media/connect-data-sources/data-connector-list.png":::

#### [Defender portal](#tab/defender-portal)

:::image type="content" source="media/connect-data-sources/data-connector-list-defender.png" alt-text="Screenshot of the data connectors gallery." lightbox="media/connect-data-sources/data-connector-list-defender.png":::

---

To add more data connectors, install the solution associated with the data connector from the **Content Hub**. For more information, see the following articles:

- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [About Microsoft Sentinel content and solutions](sentinel-solutions.md)
- [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md)
- [Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md)
- [Advanced Security Information Model (ASIM) based domain solutions for Microsoft Sentinel](domain-based-essential-solutions.md)

## REST API integration for data connectors

Many security technologies provide a set of APIs for retrieving log files. Some data sources can use those APIs to connect to Microsoft Sentinel.

Data connectors that use APIs either integrate from the provider side or integrate using Azure Functions, as described in the following sections.

### Integration on the provider side

An API integration built by the provider connects with the provider data sources and pushes data into Microsoft Sentinel custom log tables by using the Azure Monitor Data Collector API. For more information, see [Send log data to Azure Monitor by using the HTTP Data Collector API](/azure/azure-monitor/logs/data-collector-api?branch=main&tabs=powershell).

To learn about REST API integration, read your provider documentation and [Connect your data source to Microsoft Sentinel's REST-API to ingest data](connect-rest-api-template.md).

### Integration using Azure Functions

Integrations that use Azure Functions to connect with a provider API first format the data, and then send it to Microsoft Sentinel custom log tables using the Azure Monitor Data Collector API.

For more information, see:
-  [Send log data to Azure Monitor by using the HTTP Data Collector API](/azure/azure-monitor/logs/data-collector-api?branch=main&tabs=powershell)
- [Use Azure Functions to connect your data source to Microsoft Sentinel](connect-azure-functions-template.md)
- [Azure Functions documentation](../azure-functions/index.yml)

Integrations that use Azure Functions might have extra data ingestion costs, because you host Azure Functions in your Azure organization. Learn more about [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

## Agent-based integration for data connectors

Microsoft Sentinel can use the Syslog protocol to connect an agent to any data source that can perform real-time log streaming. For example, most on-premises data sources connect by using agent-based integration.

The following sections describe the different types of Microsoft Sentinel agent-based data connectors. To configure connections using agent-based mechanisms, follow the steps in each Microsoft Sentinel data connector page.

### Syslog

You can stream events from Linux-based, Syslog-supporting devices into Microsoft Sentinel by using the Azure Monitor Agent (AMA). Depending on the device type, the agent is installed either directly on the device, or on a dedicated Linux-based log forwarder. The AMA receives events from the Syslog daemon over UDP. The Syslog daemon forwards events to the agent internally, communicating over UDS (Unix Domain Sockets). The AMA then transmits these events to the Microsoft Sentinel workspace.

Here's a simple flow that shows how Microsoft Sentinel streams Syslog data.

1. The device's built-in Syslog daemon collects local events of the specified types, and forwards the events locally to the agent. 
1. The agent streams the events to your Log Analytics workspace. 
1. After successful configuration, the data appears in the Log Analytics Syslog table.

For more information, see [Tutorial: Forward Syslog data to a Log Analytics workspace with Microsoft Sentinel by using Azure Monitor Agent](forward-syslog-monitor-agent.md).


### Common Event Format (CEF)

Log formats vary, but many sources support CEF-based formatting. The Microsoft Sentinel agent, which is actually the Log Analytics agent, converts CEF-formatted logs into a format that Log Analytics can ingest.

For data sources that emit data in CEF, set up the Syslog agent and then configure the CEF data flow. After successful configuration, the data appears in the **CommonSecurityLog** table.

For more information, see  [Get CEF-formatted logs from your device or appliance into Microsoft Sentinel](connect-common-event-format.md).

### Custom logs

For some data sources, you can collect logs as files on Windows or Linux computers using the Log Analytics custom log collection agent.

To connect using the Log Analytics custom log collection agent, follow the steps in each Microsoft Sentinel data connector page. After successful configuration, the data appears in custom tables.

For more information, see [Collect data in custom log formats to Microsoft Sentinel with the Log Analytics agent](connect-custom-logs.md).

## Service-to-service integration for data connectors

Microsoft Sentinel uses the Azure foundation to provide out-of-the-box service-to-service support for Microsoft services and Amazon Web Services.

For more information, see the following articles:
- [Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)

## Data connector support

Both Microsoft and other organizations author Microsoft Sentinel data connectors. Each data connector has one of the following support types listed on the data connector page in Microsoft Sentinel.

| Support type| Description|
|-------------|------------|
|**Microsoft-supported**|Applies to:<ul><li>Data connectors for data sources where Microsoft is the data provider and author.</li><li>Some Microsoft-authored data connectors for non-Microsoft data sources.</li></ul>Microsoft supports and maintains data connectors in this category according to the [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview).<br><br>Partners or the Community support data connectors authored by any party other than Microsoft.|
|**Partner-supported**|Applies to data connectors authored by parties other than Microsoft.<br><br>The partner company provides support or maintenance for these data connectors. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Microsoft Sentinel page for that data connector.<br><br>For any issues with a partner-supported data connector, contact the specified data connector support contact.|
|**Community-supported**|Applies to data connectors authored by Microsoft or partner developers that don't have listed contacts for data connector support and maintenance on the data connector page in Microsoft Sentinel.<br><br>For questions or issues with these data connectors, you can [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Microsoft Sentinel GitHub community](https://aka.ms/threathunters).|

For more information, see [Find support for a data connector](configure-data-connector.md#find-support-for-a-data-connector).

## Next steps

For more information about data connectors, see the following articles.

- [Connect your data sources to Microsoft Sentinel by using data connectors](configure-data-connector.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md)

For a basic Infrastructure as Code (IaC) reference of Bicep, Azure Resource Manager, and Terraform to deploy data connectors in Microsoft Sentinel, see [Microsoft Sentinel data connector IaC reference](/azure/templates/microsoft.securityinsights/dataconnectors).
