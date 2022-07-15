---
title: Microsoft Sentinel data connectors | Microsoft Docs
description: Learn how to connect data sources like Microsoft 365 Defender (formerly Microsoft Threat Protection), Microsoft 365 and Office 365, Azure AD, ATP, and Defender for Cloud Apps to Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
ms.author: yelevin
---

# Microsoft Sentinel data connectors

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

After onboarding Microsoft Sentinel into your workspace, connect data sources to start ingesting your data into Microsoft Sentinel. Microsoft Sentinel comes with many connectors for Microsoft products, available out of the box and providing real-time integration. For example, service-to-service connectors include Microsoft 365 Defender connectors and Microsoft 365 sources, such as Office 365, Azure Active Directory (Azure AD), Microsoft Defender for Identity, and Microsoft Defender for Cloud Apps.

You can also enable built-in connectors to the broader security ecosystem for non-Microsoft products. For example, you can use [Syslog](#syslog), [Common Event Format (CEF)](#common-event-format-cef), or [REST APIs](#rest-api-integration) to connect your data sources with Microsoft Sentinel.

The **Data connectors** page, accessible from the Microsoft Sentinel navigation menu, shows the full list of connectors that Microsoft Sentinel provides, and their status in your workspace. Select the connector you want to connect, and then select **Open connector page**.

![Data connectors gallery](./media/collect-data/collect-data-page.png)

This article describes supported data connection methods. For more information, see [Microsoft Sentinel data connectors reference](data-connectors-reference.md) and the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

<a name="agent-options"></a>
<a name="data-connection-methods"></a>
<a name="map-data-types-with-microsoft-sentinel-connection-options"></a>

## Enable a data connector

The **Data connectors** page, accessible from the Microsoft Sentinel navigation menu, shows the full list of connectors that Microsoft Sentinel provides, and their status. Select the connector you want to connect, and then select **Open connector page**.

![Data connectors gallery](./media/collect-data/collect-data-page.png)

You'll need to have fulfilled all the prerequisites, and you'll see complete instructions on the connector page to ingest the data to Microsoft Sentinel. It may take some time for data to start arriving. After you connect, you see a summary of the data in the **Data received** graph, and the connectivity status of the data types.

![Configure data connectors](./media/collect-data/opened-connector-page.png)

In the **Next steps** tab, you'll see additional content that Microsoft Sentinel provides for the specific data type - sample queries, visualization workbooks, and analytics rule templates to help you detect and investigate threats.

![Next steps for connectors](./media/collect-data/data-insights.png)

For more information, see the relevant section for your data connector in the [data connectors reference](data-connectors-reference.md).

## REST API integration

Many security technologies provide a set of APIs for retrieving log files, and some data sources can use those APIs to connect to Microsoft Sentinel.

Data connectors that use APIs either integrate from the provider side or integrate using Azure Functions, as described in the following sections.

For a complete listing and information about these connectors, see the [data connectors reference](data-connectors-reference.md).

### REST API integration on the provider side

An API integration that is built by the provider connects with the provider data sources and pushes data into Microsoft Sentinel custom log tables using the [Azure Monitor Data Collector API](../azure-monitor/logs/data-collector-api.md).

For more information, see your provider documentation and [Connect your data source to Microsoft Sentinel's REST-API to ingest data](connect-rest-api-template.md).

### REST API integration using Azure Functions

Integrations that use [Azure Functions](../azure-functions/index.yml) to connect with a provider API first format the data, and then send it to Microsoft Sentinel custom log tables using the [Azure Monitor Data Collector API](../azure-monitor/logs/data-collector-api.md).

To configure these data connectors to connect with the provider API and collect logs in Microsoft Sentinel, follow the steps shown for each data connector in Microsoft Sentinel.

For more information, see [Use Azure Functions to connect your data source to Microsoft Sentinel](connect-azure-functions-template.md).

> [!IMPORTANT]
> Integrations that use Azure Functions may incur additional data ingestion costs, because you host Azure Functions on your Azure tenant. For more information, see the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).

## Agent-based integration

Microsoft Sentinel can use the Syslog protocol to connect via an agent to any data source that can perform real-time log streaming. For example, most on-premises data sources connect via agent-based integration.

The following sections describe the different types of Microsoft Sentinel agent-based data connectors. Follow the steps in each Microsoft Sentinel data connector page to configure connections using agent-based mechanisms.

For a complete listing of firewalls, proxies, and endpoints that connect to Microsoft Sentinel through CEF or Syslog, see the [data connectors reference](data-connectors-reference.md).

### Syslog

You can stream events from Linux-based, Syslog-supporting devices into Microsoft Sentinel by using the Log Analytics agent for Linux, formerly called the OMS agent. The Log Analytics agent is supported for any device that allows you to install the Log Analytics agent directly on the device.

The device's built-in Syslog daemon collects local events of the specified types, and forwards them locally to the agent, which then streams them to your Log Analytics workspace. After successful configuration, the data appears in the Log Analytics Syslog table.

Depending on the device type, the agent is installed either directly on the device, or on a dedicated Linux-based log forwarder. The Log Analytics agent receives events from the Syslog daemon over UDP. If a Linux machine is expected to collect a high volume of Syslog events, it sends events over TCP from the Syslog daemon to the agent, and from there to Log Analytics.

For more information, see [Connect Syslog-based appliances to Microsoft Sentinel](connect-syslog.md).

### Common Event Format (CEF)

Log formats vary, but many sources support CEF-based formatting. The Microsoft Sentinel agent, which is actually the Log Analytics agent, converts CEF-formatted logs into a format that Log Analytics can ingest.

For data sources that emit data in CEF, set up the Syslog agent and then configure the CEF data flow. After successful configuration, the data appears in the **CommonSecurityLog** table.

For more information, see [Connect CEF-based appliances to Microsoft Sentinel](connect-common-event-format.md).

### Custom logs

Some data sources have logs available for collection as files on Windows or Linux. You can collect these logs by using the Log Analytics custom log collection agent.

Follow the steps in each Microsoft Sentinel data connector page to connect using the Log Analytics custom log collection agent. After successful configuration, the data appears in custom tables.

For more information, see [Collect data in custom log formats to Microsoft Sentinel with the Log Analytics agent](connect-custom-logs.md).

## Service-to-service integration

Microsoft Sentinel uses the Azure foundation to provide out-of-the-box, service-to-service support for  Microsoft services and Amazon Web Services.

For more information, see [Connect to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md) and the [data connectors reference](data-connectors-reference.md).

## Deploy as part of a solution

[Microsoft Sentinel solutions](sentinel-solutions.md) provide packages of security content, including data connectors, workbooks, analytics rules, playbooks, and more. When you deploy a solution with a data connector, you'll get the data connector together with related content in the same deployment.

For more information, see [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md) and the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

## Data connector support

Both Microsoft and other organizations author Microsoft Sentinel data connectors. Each data connector has one of the following support types:

| Support type| Description|
|-------------|------------|
|**Microsoft-supported**|Applies to:<ul><li>Data connectors for data sources where Microsoft is the data provider and author.</li><li>Some Microsoft-authored data connectors for non-Microsoft data sources.</li></ul>Microsoft supports and maintains data connectors in this category in accordance with [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview).<br><br>Partners or the Community support data connectors that are authored by any party other than Microsoft.|
|**Partner-supported**|Applies to data connectors authored by parties other than Microsoft.<br><br>The partner company provides support or maintenance for these data connectors. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Microsoft Sentinel page for that data connector.<br><br>For any issues with a partner-supported data connector, contact the specified data connector support contact.|
|**Community-supported**|Applies to data connectors authored by Microsoft or partner developers that don't have listed contacts for data connector support and maintenance on the specified data connector page in Microsoft Sentinel.<br><br>For questions or issues with these data connectors, you can [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Microsoft Sentinel GitHub community](https://aka.ms/threathunters).|

### Find the support contact for a data connector

To find the support contact information for a data connector:

1. In the Microsoft Sentinel left menu, select **Data connectors**.

1. Select the connector you want to find support information for.

1. View the **Supported by** field on the side panel for the data connector.

   ![Screenshot showing the Supported by field for a data connector in Microsoft Sentinel.](./media/collect-data/connectors.png)

   The **Supported by** field has a support contact link you can use to access support and maintenance for the selected data connector.

## Next steps

- To get started with Microsoft Sentinel, you need a subscription to Microsoft Azure. If you don't have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md) and [get visibility into your data and potential threats](get-visibility.md).
