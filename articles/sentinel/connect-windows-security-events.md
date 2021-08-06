---
title: Connect Windows security event data to Azure Sentinel (tabbed version) | Microsoft Docs
description: Learn to use the Windows Security Events connector to stream all security events from your Windows systems to your Azure Sentinel workspace. 
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: d51d2e09-a073-41c8-b396-91d60b057e6a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/06/2021
ms.author: yelevin

---
# Connect to Windows servers to collect security events

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

The Windows Security Events connector lets you stream security events from any Windows server (physical or virtual, on-premises or in any cloud) connected to your Azure Sentinel workspace. This enables you to view Windows security events in your dashboards, to use them in creating custom alerts, and to rely on them to improve your investigations, giving you more insight into your organization's network and expanding your security operations capabilities.

## Connector options

The Windows Security Events connector supports the following versions:

|Connector version  |Description  |
|---------|---------|
|**Security events**     |Legacy version, based on the Log Analytics Agent, and sometimes known as the Microsoft Monitoring Agent (MMA) or the OMS agent. <br><br>Limited to 10,000 events per second. To ensure optimal performance, make sure to keep to 8,500 events per second or fewer.       |
|**Windows Security Events**     |Newer version, currently in preview, and based on the Azure Monitor Agent (AMA.)   <br><br>Supports additional features, such as pre-ingestion log filtering and individual data collection rules for certain groups of machines.      |
|     |         |


> [!NOTE]
> The MMA for Linux does not support multi-homing, which sends logs to multiple workspaces. If you require multi-homing, we recommend that you use the **Windows Security Events** connector.

> [!TIP]
> If you need multiple agents, you may want to use a virtual machine scale that's set to run multiple agents for log ingestion, or use several machines. Both the Security events and Windows Security events connector can then be used with a load balancer to ensure that the machines are not overloaded, and to prevent data duplication.
>

This article presents information on both versions of the connector. Select from the tabs below to view the information relevant to your selected connector.


# [Log Analytics Agent (Legacy)](#tab/LAA)

You can select which events to stream from among the following sets: <a name="event-sets"></a>

- **All events** - All Windows security and AppLocker events.
- **Common** - A standard set of events for auditing purposes. A full user audit trail is included in this set. For example, it contains both user sign-in and user sign-out events (event IDs 4624, 4634). There are also auditing actions such as security group changes, key domain controller Kerberos operations, and other types of events in line with accepted best practices.

    The **Common** event set may contain some types of events that aren't so common.  This is because the main point of the **Common** set is to reduce the volume of events to a more manageable level, while still maintaining full audit trail capability.

- **Minimal** - A small set of events that might indicate potential threats. This set does not contain a full audit trail. It covers only events that might indicate a successful breach, and other important events that have very low rates of occurrence. For example, it contains successful and failed user logons (event IDs 4624, 4625), but it doesn't contain sign-out information (4634) which, while important for auditing, is not meaningful for breach detection and has relatively high volume. Most of the data volume of this set is comprised of sign-in events and process creation events (event ID 4688).

- **None** - No security or AppLocker events. (This setting is used to disable the connector.)

> [!NOTE]
> Security Events collection within the context of a single workspace can be configured from either Azure Security Center or Azure Sentinel, but not both. If you are onboarding Azure Sentinel in a workspace that is already getting Azure Defender alerts from Azure Security Center, and is set to collect Security Events, you have two options:
> - Leave the Security Events collection in Azure Security Center as is. You will be able to query and analyze these events in Azure Sentinel as well as in Azure Defender. You will not, however, be able to monitor the connector's connectivity status or change its configuration in Azure Sentinel. If this is important to you, consider the second option.
>
> - [Disable Security Events collection](../security-center/security-center-enable-data-collection.md) in Azure Security Center, and only then add the Security Events connector in Azure Sentinel. As with the first option, you will be able to query and analyze events in both Azure Sentinel and Azure Defender/ASC, but you will now be able to monitor the connector's connectivity status or change its configuration in - and only in - Azure Sentinel.

# [Azure Monitor Agent (New)](#tab/AMA)

> [!IMPORTANT]
>
> - The Windows Security Events data connector based on the Azure Monitor Agent (AMA) is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The [Azure Monitor agent](../azure-monitor/agents/azure-monitor-agent-overview.md) uses **Data collection rules (DCR)** to define the data to collect from each agent. Data collection rules let you manage collection settings at scale while still allowing unique, scoped configurations for subsets of machines. They are independent of the workspace and independent of the virtual machine, which means they can be defined once and reused across machines and environments. See [Configure data collection for the Azure Monitor agent](../azure-monitor/agents/data-collection-rule-azure-monitor-agent.md).

Besides the pre-selected sets of events (**All events**, **Minimal**, or **Common**) that you could choose to ingest with the old connector, **data collection rules** let you build custom filters to choose the exact events you want to ingest. The Azure Monitor Agent uses these rules to filter the data *at the source* and ingest only the events you want, while leaving everything else behind. This can save you a lot of money in data ingestion costs!

This document shows you how to create data collection rules.

> [!NOTE]
> **Coexistence with other agents**
> 
> The Azure Monitor agent can coexist with the existing agents, so you can continue to use the legacy connector during evaluation or migration. This is particularly important while the new connector is in preview,due to the limited support for existing solutions. You should be careful though in collecting duplicate data since this could skew query results and result in additional charges for data ingestion and retention.

---
## Collect security events from non-Azure machines

To collect security events from any system that is not an Azure virtual machine, the system must have [**Azure Arc**](../azure-monitor/agents/azure-monitor-agent-install.md) installed and enabled *before* you enable either of these connectors.

This includes:
- Windows servers installed on physical machines
- Windows servers installed on on-premises virtual machines
- Windows servers installed on virtual machines in non-Azure clouds

## Set up the Windows Security Events connector

To collect your Windows security events in Azure Sentinel:

# [Log Analytics Agent (Legacy)](#tab/LAA)

1. From the Azure Sentinel navigation menu, select **Data connectors**. From the list of connectors, click on **Security Events**, and then on the **Open connector page** button on the lower right. Then follow the on-screen instructions under the **Instructions** tab, as described through the rest of this section.

1. Verify that you have the appropriate permissions as described under the **Prerequisites** section on the connector page.

1. Download and install the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) (also known as the Microsoft Monitoring Agent or MMA) on the machines for which you want to stream security events into Azure Sentinel.

    For Azure Virtual Machines:
    
    1. Click on **Install agent on Azure Windows Virtual Machine**, and then on the link that appears below.
    1. For each virtual machine that you want to connect, click on its name in the list that appears on the right, and then click **Connect**.

    For non-Azure Windows machines (physical, virtual on-prem, or virtual in another cloud):

    1. Click on **Install agent on non-Azure Windows Machine**, and then on the link that appears below.
    1. Click on the appropriate download links that appear on the right, under **Windows Computers**.
    1. Using the downloaded executable file, install the agent on the Windows systems of your choice, and configure it using the **Workspace ID and Keys** that appear below the download links mentioned above.

    > [!NOTE]
    >
    > To allow Windows systems without the necessary internet connectivity to still stream events to Azure Sentinel, download and install the **OMS Gateway** on a separate machine, using the link on the lower right, to act as a proxy.  You will still need to install the Log Analytics agent on each Windows system whose events you want to collect.
    >
    > For more information on this scenario, see the [**Log Analytics gateway** documentation](../azure-monitor/agents/gateway.md).

    For additional installation options and further details, see the [**Log Analytics agent** documentation](../azure-monitor/agents/agent-windows.md).

1. Select which event set (All, Common, or Minimal) you want to stream. See the [lists of event IDs included](#event-id-reference) in the Minimal and Common event sets.

1. Click **Update**.

1. To use the relevant schema in Log Analytics for Windows security events, type `SecurityEvent` in the query window.

# [Azure Monitor Agent (New)](#tab/AMA)

1. From the Azure Sentinel navigation menu, select **Data connectors**. From the list of connectors, click on **Windows Security Events (Preview)**, and then on the **Open connector page** button on the lower right. Then follow the on-screen instructions under the **Instructions** tab, as described through the rest of this section.

1. Verify that you have the appropriate permissions as described under the **Prerequisites** section on the connector page.

    1. You must have read and write permissions on your workspace and on all data sources from which you will be ingesting Windows security events.

    1. To collect events from Windows machines that are not Azure VMs, the machines (physical or virtual) must have Azure Arc installed and enabled. [Learn more](../azure-monitor/agents/azure-monitor-agent-install.md).

1. Under **Configuration**, select **+Add data collection rule**. The **Create data collection rule** wizard will open to the right.

1. Under **Basics**, enter a **Rule name** and specify a **Subscription** and **Resource group** where the data collection rule (DCR) will be created. This *does not* have to be the same resource group or subscription the monitored machines and their associations are in, as long as they are in the same tenant.

1. In the **Resources** tab, select **+Add resource(s)** to add machines to which the Data Collection Rule will apply. The **Select a scope** dialog will open, and you will see a list of available subscriptions. Expand a subscription to see its resource groups, and expand a resource group to see the available machines. You will see Azure virtual machines and Azure Arc–enabled servers in the list. You can mark the check boxes of subscriptions or resource groups to select all the machines they contain, or you can select individual machines. Select **Apply** when you've chosen all your machines. At the end of this process, the Azure Monitor Agent will be installed on any selected machines that don't already have it installed.

1. On the **Collect** tab, choose the [set of events](#event-id-reference) you would like to collect, or select **Custom** to specify other logs or to filter events using [XPath queries](../azure-monitor/agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries). Enter expressions in the box that evaluate to specific XML criteria for events to collect, then select **Add**. You can enter up to 20 expressions in a single box, and up to 100 boxes in a rule.

    Learn more about [data collection rules](../azure-monitor/agents/data-collection-rule-overview.md#create-a-dcr) from the Azure Monitor documentation.

    > [!NOTE]
    > - Make sure to query only Windows Security and AppLocker logs. Events from other Windows logs, or from security logs from other environments, may not adhere to the Windows Security Events schema and won't be parsed properly, in which case they won’t be ingested to your workspace.
    >
    > - The Azure Monitor agent supports XPath queries for **[XPath version 1.0](/windows/win32/wes/consuming-events#xpath-10-limitations) only**.

1. When you've added all the filter expressions you want, select **Next: Review + create**.

1. When you see the "Validation passed" message, select **Create**. 

You'll see all your data collection rules (including those created through the API) under **Configuration** on the connector page. From there you can edit or delete existing rules.

> [!TIP]
> Use the PowerShell cmdlet **Get-WinEvent** with the *-FilterXPath* parameter to test the validity of an XPath query. The following script shows an example:
> ```powershell
> $XPath = '*[System[EventID=1035]]'
> Get-WinEvent -LogName 'Application' -FilterXPath $XPath
> ```
> - If events are returned, the query is valid.
> - If you receive the message No events were found that match the specified selection criteria., the query may be valid, but there are no matching events on the local machine.
> - If you receive the message The specified query is invalid , the query syntax is invalid.

### Create data collection rules using the API

You can also create data collection rules using the API ([see schema](/rest/api/monitor/data-collection-rules)), which can make life easier if you're creating many rules (if you're an MSSP, for example). Here's an example you can use as a template for creating a rule:

**Request URL and header**

```http
PUT https://management.azure.com/subscriptions/703362b3-f278-4e4b-9179-c76eaf41ffc2/resourceGroups/myResourceGroup/providers/Microsoft.Insights/dataCollectionRules/myCollectionRule?api-version=2019-11-01-preview
```
**Request URL and header**

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
                    "workspaceResourceId": "/subscriptions/703362b3-f278-4e4b-9179-c76eaf41ffc2/resourceGroups/myResourceGroup/providers/Microsoft.OperationalInsights/workspaces/centralTeamWorkspace",
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



---

## Validate connectivity

It may take around 20 minutes until your logs start to appear in Log Analytics. 

### Configure the Security events / Windows Security Events connector for anomalous RDP login detection

> [!IMPORTANT]
> Anomalous RDP login detection is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Sentinel can apply machine learning (ML) to Security events data to identify anomalous Remote Desktop Protocol (RDP) login activity. Scenarios include:

- **Unusual IP** - the IP address has rarely or never been observed in the last 30 days

- **Unusual geo-location** - the IP address, city, country, and ASN have rarely or never been observed in the last 30 days

- **New user** - a new user logs in from an IP address and geo-location, both or either of which were not expected to be seen based on data from the 30 days prior.

**Configuration instructions**

1. You must be collecting RDP login data (Event ID 4624) through the **Security events** or **Windows Security Events** data connectors. Make sure you have selected an [event set](#event-id-reference) besides "None", or created a data collection rule that includes this event ID, to stream into Azure Sentinel.

1. From the Azure Sentinel portal, click **Analytics**, and then click the **Rule templates** tab. Choose the **(Preview) Anomalous RDP Login Detection** rule, and move the **Status** slider to **Enabled**.

    > [!NOTE]
    > As the machine learning algorithm requires 30 days' worth of data to build a baseline profile of user behavior, you must allow 30 days of Windows Security events data to be collected before any incidents can be detected.

## Event ID reference

The following list provides a complete breakdown of the Security and App Locker event IDs for each set:

| Event set | Collected event IDs |
| --- | --- |
| **Minimal** | 1102, 4624, 4625, 4657, 4663, 4688, 4700, 4702, 4719, 4720, 4722, 4723, 4724, 4727, 4728, 4732, 4735, 4737, 4739, 4740, 4754, 4755, 4756, 4767, 4799, 4825, 4946, 4948, 4956, 5024, 5033, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8222 |
| **Common** | 1, 299, 300, 324, 340, 403, 404, 410, 411, 412, 413, 431, 500, 501, 1100, 1102, 1107, 1108, 4608, 4610, 4611, 4614, 4622, 4624, 4625, 4634, 4647, 4648, 4649, 4657, 4661, 4662, 4663, 4665, 4666, 4667, 4688, 4670, 4672, 4673, 4674, 4675, 4689, 4697, 4700, 4702, 4704, 4705, 4716, 4717, 4718, 4719, 4720, 4722, 4723, 4724, 4725, 4726, 4727, 4728, 4729, 4733, 4732, 4735, 4737, 4738, 4739, 4740, 4742, 4744, 4745, 4746, 4750, 4751, 4752, 4754, 4755, 4756, 4757, 4760, 4761, 4762, 4764, 4767, 4768, 4771, 4774, 4778, 4779, 4781, 4793, 4797, 4798, 4799, 4800, 4801, 4802, 4803, 4825, 4826, 4870, 4886, 4887, 4888, 4893, 4898, 4902, 4904, 4905, 4907, 4931, 4932, 4933, 4946, 4948, 4956, 4985, 5024, 5033, 5059, 5136, 5137, 5140, 5145, 5632, 6144, 6145, 6272, 6273, 6278, 6416, 6423, 6424, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8222, 26401, 30004 |
|

## Next steps
In this document, you learned how to connect Windows security events to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started detecting threats with Azure Sentinel, using [built-in](tutorial-detect-threats-built-in.md) or [custom](tutorial-detect-threats-custom.md) rules.
