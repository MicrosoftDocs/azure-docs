---
title: Connect Microsoft Sentinel to other Microsoft services with a Windows agent-based data connector
description: Learn how to connect Microsoft Sentinel to Microsoft services with Windows agent-based connections.
author: yelevin
ms.topic: how-to
ms.date: 10/06/2024
ms.author: yelevin


#Customer intent: As a security engineer, I want to connect Microsoft Sentinel to various data sources using Windows agent-based connectors so that I can efficiently ingest and manage security event data for comprehensive threat detection and response.

---

# Connect Microsoft Sentinel to other Microsoft services with a Windows agent-based data connector

This article describes how to connect Microsoft Sentinel to other Microsoft services Windows agent-based connections. Microsoft Sentinel uses the Azure Monitor Agent to provide built-in, service-to-service support for data ingestion from many Azure and Microsoft 365 services, Amazon Web Services, and various Windows Server services.

The [Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-overview) uses **Data collection rules (DCRs)** to define the data to collect from each agent. Data collection rules offer you two distinct advantages:

- **Manage collection settings at scale** while still allowing unique, scoped configurations for subsets of machines. They are independent of the workspace and independent of the virtual machine, which means they can be defined once and reused across machines and environments. See [Configure data collection for the Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-data-collection).

- **Build custom filters** to choose the exact events you want to ingest. The Azure Monitor Agent uses these rules to filter the data *at the source* and ingest only the events you want, while leaving everything else behind. This can save you a lot of money in data ingestion costs!

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

> [!IMPORTANT]
> Some connectors based on the Azure Monitor Agent (AMA) are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- You must have read and write permissions on the Microsoft Sentinel workspace.

- To collect events from any system that is not an Azure virtual machine, the system must have [**Azure Arc**](/azure/azure-monitor/agents/azure-monitor-agent-manage) installed and enabled *before* you enable the Azure Monitor Agent-based connector.

  This includes:

  - Windows servers installed on physical machines
  - Windows servers installed on on-premises virtual machines
  - Windows servers installed on virtual machines in non-Azure clouds

- For the Windows Forwarded Events data connector:

    - You must have Windows Event Collection (WEC) enabled and running, with the Azure Monitor Agent installed on the WEC machine.
    - We recommend installing the [Advanced Security Information Model (ASIM)](normalization.md) parsers to ensure full support for data normalization. You can deploy these parsers from the [`Azure-Sentinel` GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASim%20WindowsEvent) using the **Deploy to Azure** button there.

 - Install the related Microsoft Sentinel solution from the Content Hub in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

## Create data collection rules via the GUI

1. From Microsoft Sentinel, select **Configuration**> **Data connectors**. Select your connector from the list, and then select **Open connector page** on the details pane. Then follow the on-screen instructions under the **Instructions** tab, as described through the rest of this section.

1. Verify that you have the appropriate permissions as described under the **Prerequisites** section on the connector page.

1. Under **Configuration**, select **+Add data collection rule**. The **Create data collection rule** wizard will open to the right.

1. Under **Basics**, enter a **Rule name** and specify a **Subscription** and **Resource group** where the data collection rule (DCR) will be created. This *does not* have to be the same resource group or subscription the monitored machines and their associations are in, as long as they are in the same tenant.

1. In the **Resources** tab, select **+Add resource(s)** to add machines to which the Data Collection Rule will apply. The **Select a scope** dialog will open, and you will see a list of available subscriptions. Expand a subscription to see its resource groups, and expand a resource group to see the available machines. You will see Azure virtual machines and Azure Arc-enabled servers in the list. You can mark the check boxes of subscriptions or resource groups to select all the machines they contain, or you can select individual machines. Select **Apply** when you've chosen all your machines. At the end of this process, the Azure Monitor Agent will be installed on any selected machines that don't already have it installed.

1. On the **Collect** tab, choose the events you would like to collect: select **All events** or **Custom** to specify other logs or to filter events using [XPath queries](/azure/azure-monitor/agents/data-collection-windows-events#filter-events-using-xpath-queries). Enter expressions in the box that evaluate to specific XML criteria for events to collect, then select **Add**. You can enter up to 20 expressions in a single box, and up to 100 boxes in a rule.

    For more information, see the [Azure Monitor documentation](/azure/azure-monitor/essentials/data-collection-rule-overview).

    > [!NOTE]
    >
    > - The Windows Security Events connector offers two other [**pre-built event sets**](windows-security-event-id-reference.md) you can choose to collect: **Common** and **Minimal**.
    >
    > - The Azure Monitor Agent supports XPath queries for **[XPath version 1.0](/windows/win32/wes/consuming-events#xpath-10-limitations) only**.

    To test the validity of an XPath query, use the PowerShell cmdlet **Get-WinEvent** with the *-FilterXPath* parameter. For example:

    ```powershell
    $XPath = '*[System[EventID=1035]]'
    Get-WinEvent -LogName 'Application' -FilterXPath $XPath
    ```

    - If events are returned, the query is valid.
    - If you receive the message "No events were found that match the specified selection criteria," the query may be valid, but there are no matching events on the local machine.
    - If you receive the message "The specified query is invalid," the query syntax is invalid.

1. When you've added all the filter expressions you want, select **Next: Review + create**.

1. When you see the **Validation passed** message, select **Create**.

You'll see all your data collection rules, including those [created through the API](#create-data-collection-rules-using-the-api), under **Configuration** on the connector page. From there you can edit or delete existing rules.

## Create data collection rules using the API

You can also create data collection rules using the API, which can make life easier if you're creating many rules, such as if you're an MSSP. Here's an example (for the [Windows Security Events via AMA](./data-connectors/windows-security-events-via-ama.md) connector) that you can use as a template for creating a rule:

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

For more information, see:

- [Data collection rules (DCRs) in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)
- [Data collection rules API schema](/rest/api/monitor/data-collection-rules)

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
