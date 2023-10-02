---
title: Connect Microsoft Sentinel to other Microsoft services with a Windows agent-based data connector
description: Learn how to connect Microsoft Sentinel to Microsoft services with Windows agent-based connections.
author: yelevin
ms.topic: how-to
ms.date: 07/18/2023
ms.author: yelevin
---

# Connect Microsoft Sentinel to other Microsoft services with a Windows agent-based data connector

This article describes how to connect Microsoft Sentinel to other Microsoft services by using a Windows agent-based connections. Microsoft Sentinel uses the Azure foundation to provide built-in, service-to-service support for data ingestion from many Azure and Microsoft 365 services, Amazon Web Services, and various Windows Server services. There are a few different methods through which these connections are made.

This article presents information that is common to the group of Windows agent-based data connectors.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Azure Monitor Agent

Some connectors based on the Azure Monitor Agent (AMA) are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Azure Monitor Agent is currently supported only for Windows Security Events, Windows Forwarded Events, and Windows DNS Events. 

The [Azure Monitor agent](../azure-monitor/agents/azure-monitor-agent-overview.md) uses **Data collection rules (DCRs)** to define the data to collect from each agent. Data collection rules offer you two distinct advantages:

- **Manage collection settings at scale** while still allowing unique, scoped configurations for subsets of machines. They are independent of the workspace and independent of the virtual machine, which means they can be defined once and reused across machines and environments. See [Configure data collection for the Azure Monitor agent](../azure-monitor/agents/data-collection-rule-azure-monitor-agent.md).

- **Build custom filters** to choose the exact events you want to ingest. The Azure Monitor Agent uses these rules to filter the data *at the source* and ingest only the events you want, while leaving everything else behind. This can save you a lot of money in data ingestion costs!

See below how to create data collection rules.

### Prerequisites

- You must have read and write permissions on the Microsoft Sentinel workspace.

- To collect events from any system that is not an Azure virtual machine, the system must have [**Azure Arc**](../azure-monitor/agents/azure-monitor-agent-manage.md) installed and enabled *before* you enable the Azure Monitor Agent-based connector.

  This includes:

  - Windows servers installed on physical machines
  - Windows servers installed on on-premises virtual machines
  - Windows servers installed on virtual machines in non-Azure clouds

- Data connector specific requirements:

    |Data connector  |Licensing, costs, and other information  |
    |---------|---------|
    |Windows Forwarded Events|- You must have Windows Event Collection (WEC) enabled and running.<br>Install the Azure Monitor Agent on the WEC machine. <br>- We recommend installing the [Advanced Security Information Model (ASIM)](normalization.md) parsers to ensure full support for data normalization. You can deploy these parsers from the [`Azure-Sentinel` GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASim%20WindowsEvent) using the **Deploy to Azure** button there.|
 
### Instructions

1. From the Microsoft Sentinel navigation menu, select **Data connectors**. Select your connector from the list, and then select **Open connector page** on the details pane. Then follow the on-screen instructions under the **Instructions** tab, as described through the rest of this section.

1. Verify that you have the appropriate permissions as described under the **Prerequisites** section on the connector page.

1. Under **Configuration**, select **+Add data collection rule**. The **Create data collection rule** wizard will open to the right.

1. Under **Basics**, enter a **Rule name** and specify a **Subscription** and **Resource group** where the data collection rule (DCR) will be created. This *does not* have to be the same resource group or subscription the monitored machines and their associations are in, as long as they are in the same tenant.

1. In the **Resources** tab, select **+Add resource(s)** to add machines to which the Data Collection Rule will apply. The **Select a scope** dialog will open, and you will see a list of available subscriptions. Expand a subscription to see its resource groups, and expand a resource group to see the available machines. You will see Azure virtual machines and Azure Arc-enabled servers in the list. You can mark the check boxes of subscriptions or resource groups to select all the machines they contain, or you can select individual machines. Select **Apply** when you've chosen all your machines. At the end of this process, the Azure Monitor Agent will be installed on any selected machines that don't already have it installed.

1. On the **Collect** tab, choose the events you would like to collect: select **All events** or **Custom** to specify other logs or to filter events using [XPath queries](../azure-monitor/agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries) (see note below). Enter expressions in the box that evaluate to specific XML criteria for events to collect, then select **Add**. You can enter up to 20 expressions in a single box, and up to 100 boxes in a rule.

    Learn more about [data collection rules](../azure-monitor/essentials/data-collection-rule-overview.md) from the Azure Monitor documentation.

    > [!NOTE]
    >
    > - The Windows Security Events connector offers two other [**pre-built event sets**](windows-security-event-id-reference.md) you can choose to collect: **Common** and **Minimal**.
    >
    > - The Azure Monitor agent supports XPath queries for **[XPath version 1.0](/windows/win32/wes/consuming-events#xpath-10-limitations) only**.

1. When you've added all the filter expressions you want, select **Next: Review + create**.

1. When you see the "Validation passed" message, select **Create**. 

You'll see all your data collection rules (including those created through the API) under **Configuration** on the connector page. From there you can edit or delete existing rules.

> [!TIP]
> Use the PowerShell cmdlet **Get-WinEvent** with the *-FilterXPath* parameter to test the validity of an XPath query. The following script shows an example:
>
> ```powershell
> $XPath = '*[System[EventID=1035]]'
> Get-WinEvent -LogName 'Application' -FilterXPath $XPath
> ```
>
> - If events are returned, the query is valid.
> - If you receive the message "No events were found that match the specified selection criteria," the query may be valid, but there are no matching events on the local machine.
> - If you receive the message "The specified query is invalid," the query syntax is invalid.

### Create data collection rules using the API

You can also create data collection rules using the API ([see schema](/rest/api/monitor/data-collection-rules)), which can make life easier if you're creating many rules (if you're an MSSP, for example). Here's an example (for the [Windows Security Events via AMA](./data-connectors/windows-security-events-via-ama.md) connector) that you can use as a template for creating a rule:

**Request URL and header**

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Insights/dataCollectionRules/myCollectionRule?api-version=2019-11-01-preview
```

**Request body**

```json
{
    "location": "eastus",
    "properties": {
        "dataSources": {
            "windowsEventLogs": [
                {
                    "streams": [
                        "Microsoft-SecurityEvent"
                    ],
                    "xPathQueries": [
                        "Security!*[System[(EventID=) or (EventID=4688) or (EventID=4663) or (EventID=4624) or (EventID=4657) or (EventID=4100) or (EventID=4104) or (EventID=5140) or (EventID=5145) or (EventID=5156)]]"
                    ],
                    "name": "eventLogsDataSource"
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.OperationalInsights/workspaces/centralTeamWorkspace",
                    "name": "centralWorkspace"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-SecurityEvent"
                ],
                "destinations": [
                    "centralWorkspace"
                ]
            }
        ]
    }
}
```

See this [complete description of data collection rules](../azure-monitor/essentials/data-collection-rule-overview.md) from the Azure Monitor documentation.

## Log Analytics Agent (Legacy)

The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you start planning your migration to the AMA. For more information, see [AMA migration for Microsoft Sentinel](ama-migrate.md).

### Prerequisites

- You must have read and write permissions on the Log Analytics workspace, and any workspace that contains machines you want to collect logs from.
- You must have the **Log Analytics Contributor** role on the SecurityInsights (Microsoft Sentinel) solution on those workspaces, in addition to any Microsoft Sentinel roles.

### Instructions

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Select your service (**DNS** or **Windows Firewall**) and then select **Open connector page**.

1. Install and onboard the agent on the device that generates the logs.

    | Machine type  | Instructions  |
    | --------- | --------- |
    | **For an Azure Windows VM** | 1. Under **Choose where to install the agent**, expand **Install agent on Azure Windows virtual machine**. <br><br>2. Select the **Download & install agent for Azure Windows Virtual machines >** link. <br><br>3. In the **Virtual machines** blade, select a virtual machine to install the agent on, and then select **Connect**. Repeat this step for each VM you wish to connect. |
    | **For any other Windows machine** | 1. Under **Choose where to install the agent**, expand **Install agent on non-Azure Windows Machine** <br><br>2. Select the **Download & install agent for non-Azure Windows machines >** link.  <br><br>3. In the **Agents management** blade, on the **Windows servers** tab, select the **Download Windows Agent** link for either 32-bit or 64-bit systems, as appropriate.  <br><br>4. Using the downloaded executable file, install the agent on the Windows systems of your choice, and configure it using the **Workspace ID and Keys** that appear below the download links in the previous step. |

To allow Windows systems without the necessary internet connectivity to still stream events to Microsoft Sentinel, download and install the **Log Analytics Gateway** on a separate machine, using the **Download Log Analytics Gateway** link on the **Agents Management** page, to act as a proxy.  You still need to install the Log Analytics agent on each Windows system whose events you want to collect.

For more information on this scenario, see the [**Log Analytics gateway** documentation](../azure-monitor/agents/gateway.md).

For additional installation options and further details, see the [**Log Analytics agent** documentation](../azure-monitor/agents/agent-windows.md).

### Determine the logs to send

For the Windows DNS Server and Windows Firewall connectors, select the **Install solution** button. For the legacy Security Events connector, choose the **event set** you wish to send and select **Update**. For more information, see [Windows security event sets that can be sent to Microsoft Sentinel](windows-security-event-id-reference.md).

You can find and query the data for these services using the table names in their respective sections in the [Data connectors reference](data-connectors-reference.md) page.

### Troubleshoot your Windows DNS Server data connector

If your DNS events don't show up in Microsoft Sentinel:

1. Make sure that DNS analytics logs on your servers are [enabled](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn800669(v=ws.11)#to-enable-dns-diagnostic-logging).
1. Go to Azure DNS Analytics.
1. In the **Configuration** area, change any of the settings and save your changes. Change your settings back if you need to, and then save your changes again.
1. Check your Azure DNS Analytics to make sure that your events and queries display properly.

For more information, see [Gather insights about your DNS infrastructure with the DNS Analytics Preview solution](/previous-versions/azure/azure-monitor/insights/dns-analytics).

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
