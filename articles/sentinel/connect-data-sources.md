---
title: Microsoft Sentinel data connectors
description: Learn about supported data connectors, like Microsoft 365 Defender (formerly Microsoft Threat Protection), Microsoft 365 and Office 365, Azure AD, ATP, and Defender for Cloud Apps to Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 05/16/2023
ms.author: yelevin
---

# Microsoft Sentinel data connectors

After you onboard Microsoft Sentinel into your workspace, use data connectors to start ingesting your data into Microsoft Sentinel. Microsoft Sentinel comes with many out of the box connectors for Microsoft services, which integrate in real time. For example, the Microsoft 365 Defender connector is a [service-to-service connector](#service-to-service-integration-for-data-connectors) that integrates data from Office 365, Azure Active Directory (Azure AD), Microsoft Defender for Identity, and Microsoft Defender for Cloud Apps.

Built-in connectors enable connection to the broader security ecosystem for non-Microsoft products. For example, use [Syslog](#syslog), [Common Event Format (CEF)](#common-event-format-cef), or [REST APIs](#rest-api-integration-for-data-connectors) to connect your data sources with Microsoft Sentinel.

Learn about [types of Microsoft Sentinel data connectors](data-connectors-reference.md) or learn about the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

The Microsoft Sentinel **Data connectors** page shows the full list of connectors and their status for your workspace. Soon this page will only show the list of in-use data connectors. For more information on this upcoming change, see [Out-of-the-box content centralization changes](sentinel-content-centralize.md)

:::image type="content" source="media/connect-data-sources/open-data-connector-page.png" alt-text="Screenshot of the data connectors gallery." lightbox="media/connect-data-sources/open-data-connector-page.png":::

To add more data connectors, install the solution associated with the data connector from the **Content Hub**. For more information, see the following articles:
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md)
- [Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md)

<a name="agent-options"></a>
<a name="data-connection-methods"></a>
<a name="map-data-types-with-microsoft-sentinel-connection-options"></a>

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Enable a data connector

From the **Data connectors** page, select the active or custom connector you want to connect, and then select **Open connector page**. If you don't see the data connector you want, install the solution associated with it from the **Content Hub**. 

- Once you fulfill all the prerequisites listed in the **Instructions** tab, the connector page describes how to ingest the data to Microsoft Sentinel. It may take some time for data to start arriving.
- After you connect, you see a summary of the data in the **Data received** graph, and the connectivity status of the data types.  
        
    :::image type="content" source="media/connect-data-sources/azure-ad-opened-connector-page.png" alt-text="Screenshot showing how to configure data connectors." border="false"::: 

Learn about your specific data connector in the [data connectors reference](data-connectors-reference.md).

## REST API integration for data connectors

Many security technologies provide a set of APIs for retrieving log files, and some data sources can use those APIs to connect to Microsoft Sentinel.

Data connectors that use APIs either integrate from the provider side or integrate using Azure Functions, as described in the following sections.

Learn more about data connectors in the [data connectors reference](data-connectors-reference.md).

### REST API integration on the provider side

An API integration built by the provider connects with the provider data sources and pushes data into Microsoft Sentinel custom log tables using the [Azure Monitor Data Collector API](../azure-monitor/logs/data-collector-api.md).

To learn about REST API integration, read your provider documentation and [Connect your data source to Microsoft Sentinel's REST-API to ingest data](connect-rest-api-template.md).

### REST API integration using Azure Functions

Integrations that use [Azure Functions](../azure-functions/index.yml) to connect with a provider API first format the data, and then send it to Microsoft Sentinel custom log tables using the [Azure Monitor Data Collector API](../azure-monitor/logs/data-collector-api.md). Learn how to [use Azure Functions to connect your data source to Microsoft Sentinel](connect-azure-functions-template.md).

> [!IMPORTANT]
> Integrations that use Azure Functions may have extra data ingestion costs, because you host Azure Functions on your Azure tenant. Learn more about [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

## Agent-based integration for data connectors

Microsoft Sentinel can use the Syslog protocol to connect an agent to any data source that can perform real-time log streaming. For example, most on-premises data sources connect using agent-based integration.

The following sections describe the different types of Microsoft Sentinel agent-based data connectors. Follow the steps in each Microsoft Sentinel data connector page to configure connections using agent-based mechanisms.

Learn which firewalls, proxies, and endpoints connect to Microsoft Sentinel through CEF or Syslog in the [data connectors reference](data-connectors-reference.md).

### Syslog

You can stream events from Linux-based, Syslog-supporting devices into Microsoft Sentinel using the [Azure Monitor Agent (AMA)](forward-syslog-monitor-agent.md). Depending on the device type, the agent is installed either directly on the device, or on a dedicated Linux-based log forwarder. The AMA receives events from the Syslog daemon over UDP. The Syslog daemon forwards events to the agent internally, communicating over UDS (Unix Domain Sockets). The AMA then transmits these events to the Microsoft Sentinel workspace.

Here is a simple flow that shows how Microsoft Sentinel streams Syslog data.

1. The device's built-in Syslog daemon collects local events of the specified types, and forwards the events locally to the agent. 
1. The agent streams the events to your Log Analytics workspace. 
1. After successful configuration, the data appears in the Log Analytics Syslog table.

### Common Event Format (CEF)

Log formats vary, but many sources support CEF-based formatting. The Microsoft Sentinel agent, which is actually the Log Analytics agent, converts CEF-formatted logs into a format that Log Analytics can ingest.

For data sources that emit data in CEF, set up the Syslog agent and then configure the CEF data flow. After successful configuration, the data appears in the **CommonSecurityLog** table.

Learn how to [connect CEF-based appliances to Microsoft Sentinel](connect-common-event-format.md).

### Custom logs

For some data sources, you can collect logs as files on Windows or Linux computers using the Log Analytics custom log collection agent.

Follow the steps in each Microsoft Sentinel data connector page to connect using the Log Analytics custom log collection agent. After successful configuration, the data appears in custom tables.

Learn how to [collect data in custom log formats to Microsoft Sentinel with the Log Analytics agent](connect-custom-logs.md).

## Service-to-service integration for data connectors

Microsoft Sentinel uses the Azure foundation to provide out-of-the-box, service-to-service support for Microsoft services and Amazon Web Services.

Learn how to [connect to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md) or learn about data connector types in the [data connectors reference](data-connectors-reference.md).

## Deploy data connectors as part of a solution

[Microsoft Sentinel solutions](sentinel-solutions.md) provide packages of security content, including data connectors, workbooks, analytics rules, playbooks, and more. When you deploy a solution with a data connector, you get the data connector together with related content in the same deployment.

Learn how to [centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md) or learn about the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

## Data connector support

Both Microsoft and other organizations author Microsoft Sentinel data connectors. Each data connector has one of these support types:

| Support type| Description|
|-------------|------------|
|**Microsoft-supported**|Applies to:<ul><li>Data connectors for data sources where Microsoft is the data provider and author.</li><li>Some Microsoft-authored data connectors for non-Microsoft data sources.</li></ul>Microsoft supports and maintains data connectors in this category according to the [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview).<br><br>Partners or the Community support data connectors that are authored by any party other than Microsoft.|
|**Partner-supported**|Applies to data connectors authored by parties other than Microsoft.<br><br>The partner company provides support or maintenance for these data connectors. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Microsoft Sentinel page for that data connector.<br><br>For any issues with a partner-supported data connector, contact the specified data connector support contact.|
|**Community-supported**|Applies to data connectors authored by Microsoft or partner developers that don't have listed contacts for data connector support and maintenance on the specified data connector page in Microsoft Sentinel.<br><br>For questions or issues with these data connectors, you can [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Microsoft Sentinel GitHub community](https://aka.ms/threathunters).|

### Find the support contact for a data connector

1. In the Microsoft Sentinel **Data connectors** page, select the relevant connector.
1. To access support and maintenance for the connector, use the support contact link in the **Supported by** field on the side panel for the connecter. 

  :::image type="content" source="media/connect-data-sources/support.png" alt-text="Screenshot showing the Supported by field for a data connector in Microsoft Sentinel." lightbox="media/connect-data-sources/support.png":::     

## Next steps

- To get started with Microsoft Sentinel, you need a subscription to Microsoft Azure. If you don't have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md) and [get visibility into your data and potential threats](get-visibility.md).
- To learn about custom data connectors, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).
- For a basic Infrastructure as Code (IaC) reference of Bicep, ARM and Terraform to deploy data connectors in Microsoft Sentinel, see [Microsoft Sentinel data connector IaC reference](/azure/templates/microsoft.securityinsights/dataconnectors).