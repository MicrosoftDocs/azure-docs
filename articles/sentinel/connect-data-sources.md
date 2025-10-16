---
title: Microsoft Sentinel data connectors
description: Learn about supported data connectors, like Microsoft Defender XDR (formerly Microsoft 365 Defender), Microsoft 365 and Office 365, Microsoft Entra ID, ATP, and Defender for Cloud Apps to Microsoft Sentinel.
author: guywi-ms
ms.author: guywild
ms.topic: conceptual
ms.date: 11/06/2024
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
#Customer intent: As a security engineer, I want to use data connectors to integrate various data sources into Microsoft Sentinel so that I can enhance threat detection and response capabilities.
---

# Microsoft Sentinel data connectors

After you onboard Microsoft Sentinel into your workspace, use data connectors to start ingesting your data into Microsoft Sentinel. Microsoft Sentinel comes with many out of the box connectors for Microsoft services, which integrate in real time. For example, the Microsoft Defender XDR connector is a service-to-service connector that integrates data from Office 365, Microsoft Entra ID, Microsoft Defender for Identity, and Microsoft Defender for Cloud Apps.

Built-in connectors enable connection to the broader security ecosystem for non-Microsoft products. For example, use Syslog, Common Event Format (CEF), or REST APIs to connect your data sources with Microsoft Sentinel.

> [!NOTE]
> For information about feature availability in US Government clouds, see the Microsoft Sentinel tables in [Cloud feature availability for US Government customers](/azure/security/fundamentals/feature-availability).

## Data management considerations for Microsoft Sentinel data lake

The following considerations must be factored into your compliance and data management planning:

+ **GDPR and Data Retention**
    + Tenant admins can exercise GDPR rights using the Purge feature for the analytics tier. This doesn't affect the data lake tier. 
    + Specific records can't be purged from the Sentinel data lake. The data lake retains ingested data for the defined retention period, even if the data is deleted at the source or in the analytics tier.

+	**Purview Integration**. Changes to Purview settings don't have any effect on data stored in the Sentinel data lake.

+   **Storage Location** Sentinel data lake storage locations are selected by the tenant admin and may differ from the primary storage location of the source services.



[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

<a name="agent-options"></a>
<a name="data-connection-methods"></a>
<a name="map-data-types-with-microsoft-sentinel-connection-options"></a>

## Data connectors provided with solutions

Microsoft Sentinel solutions provide packaged security content, including data connectors, workbooks, analytics rules, playbooks, and more. When you deploy a solution with a data connector, you get the data connector together with related content in the same deployment.

The Microsoft Sentinel **Data connectors** page lists the installed or in-use data connectors.

#### [Defender portal](#tab/defender-portal)

:::image type="content" source="media/connect-data-sources/data-connector-list-defender.png" alt-text="Screenshot of the data connectors gallery." lightbox="media/connect-data-sources/data-connector-list-defender.png":::

#### [Azure portal](#tab/azure-portal)

:::image type="content" source="media/connect-data-sources/data-connector-list.png" alt-text="Screenshot of the data connectors gallery." lightbox="media/connect-data-sources/data-connector-list.png":::

---

To add more data connectors, install the solution associated with the data connector from the **Content Hub**. For more information, see the following articles:

- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [About Microsoft Sentinel content and solutions](sentinel-solutions.md)
- [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md)
- [Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md)
- [Advanced Security Information Model (ASIM) based domain solutions for Microsoft Sentinel](domain-based-essential-solutions.md)

## Create custom connectors

If you're unable to connect your data source to Microsoft Sentinel using any of the existing solutions available, consider creating your own data source connector. For example, many security solutions provide a set of APIs for retrieving log files and other security data from their product or service. Those APIs connect to Microsoft Sentinel with one of the following methods:

- The data source APIs are configured with the [Codeless Connector Framework](create-codeless-connector.md).
- The data connector uses the Log Ingestion API for Azure Monitor as part of an [Azure Function](connect-azure-functions-template.md) or [Logic App](create-custom-connector.md#connect-with-logic-apps).

You can also use Azure Monitor Agent directly or Logstash to create your custom connector. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

## Agent-based integration for data connectors

Microsoft Sentinel can use agents provided by the Azure Monitor service (on which Microsoft Sentinel is based) to collect data from any data source that can perform real-time log streaming. For example, most on-premises data sources connect by using agent-based integration.

The following sections describe the different types of Microsoft Sentinel agent-based data connectors. To configure connections using agent-based mechanisms, follow the steps in each Microsoft Sentinel data connector page.

<a name="syslog"></a><a name="common-event-format-cef"></a>

### Syslog and Common Event Format (CEF)

You can stream events from Linux-based, Syslog-supporting devices into Microsoft Sentinel by using the Azure Monitor Agent (AMA). Log formats vary, but many sources support CEF-based formatting. Depending on the device type, the agent is installed either directly on the device, or on a dedicated Linux-based log forwarder. The AMA receives plain Syslog or CEF event messages from the Syslog daemon over UDP. The Syslog daemon forwards events to the agent internally, communicating over TCP or UDS (Unix Domain Sockets), depending on the version. The AMA then transmits these events to the Microsoft Sentinel workspace.

Here's a simple flow that shows how Microsoft Sentinel streams Syslog data.

1. The device's built-in Syslog daemon collects local events of the specified types, and forwards the events locally to the agent. 
1. The agent streams the events to your Log Analytics workspace. 
1. After successful configuration, Syslog messages appear in the Log Analytics *Syslog* table, and CEF messages in the *CommonSecurityLog* table.

For more information, see [Syslog and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md).

### Custom logs

For some data sources, you can collect logs as files on Windows or Linux computers using the Log Analytics custom log collection agent.

To connect using the Log Analytics custom log collection agent, follow the steps in each Microsoft Sentinel data connector page. After successful configuration, the data appears in custom tables.

For more information, see [Custom Logs via AMA data connector - Configure data ingestion to Microsoft Sentinel from specific applications](unified-connector-custom-device.md).

## Service-to-service integration for data connectors

Microsoft Sentinel uses the Azure foundation to provide out-of-the-box service-to-service support for Microsoft services and Amazon Web Services.

For more information, see the following articles:
- [Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)

## Data connector support

Both Microsoft and other organizations author Microsoft Sentinel data connectors. Each data connector has one of the following support types listed on the data connector page in Microsoft Sentinel.

| Support type | Description |
| ------------ | ----------- |
| **Microsoft-supported** | Applies to:<ul><li>Data connectors for data sources where Microsoft is the data provider and author.</li><li>Some Microsoft-authored data connectors for non-Microsoft data sources.</li></ul>Microsoft supports and maintains data connectors in this category according to the [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview).<br><br>Partners or the Community support data connectors authored by any party other than Microsoft. |
| **Partner-supported** | Applies to data connectors authored by parties other than Microsoft.<br><br>The partner company provides support or maintenance for these data connectors. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Microsoft Sentinel page for that data connector.<br><br>For any issues with a partner-supported data connector, contact the specified data connector support contact. |
| **Community-supported** | Applies to data connectors authored by Microsoft or partner developers that don't have listed contacts for data connector support and maintenance on the data connector page in Microsoft Sentinel.<br><br>For questions or issues with these data connectors, you can [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Microsoft Sentinel GitHub community](https://aka.ms/threathunters). |

For more information, see [Find support for a data connector](configure-data-connector.md#find-support-for-a-data-connector).

## Next steps

For more information about data connectors, see the following articles.

- [Connect your data sources to Microsoft Sentinel by using data connectors](configure-data-connector.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md)

For a basic Infrastructure as Code (IaC) reference of Bicep, Azure Resource Manager, and Terraform to deploy data connectors in Microsoft Sentinel, see [Microsoft Sentinel data connector IaC reference](/azure/templates/microsoft.securityinsights/dataconnectors).
