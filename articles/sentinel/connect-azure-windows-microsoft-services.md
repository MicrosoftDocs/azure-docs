---
title: Connect Microsoft Sentinel to Azure, Windows, and Microsoft services
description: Learn how to connect Microsoft Sentinel to Azure and Microsoft 365 cloud services and to Windows Server event logs.
author: yelevin
ms.topic: how-to
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Microsoft Sentinel uses the Azure foundation to provide built-in, service-to-service support for data ingestion from many Azure and Microsoft 365 services, Amazon Web Services, and various Windows Server services. There are a few different methods through which these connections are made, and this article describes how to make these connections.

This article describes the collection of Windows Security Events. For Windows DNS events, learn about the [Windows DNS Events via AMA connector (Preview)](connect-dns-ama.md).

## Types of connections

This article discusses the following types of connectors:

- **API-based** connections
- **Diagnostic settings** connections, some of which are managed by Azure Policy
- **Log Analytics agent**-based connections

This article presents information that is common to groups of connectors. See the accompanying [data connector reference](data-connectors-reference.md) page for information that is unique to each connector, such as licensing prerequisites and Log Analytics tables for data storage.

The following integrations are both more unique and more popular, and are treated individually, with their own articles:

- [Microsoft 365 Defender](connect-microsoft-365-defender.md)
- [Microsoft Defender for Cloud](connect-defender-for-cloud.md)
- [Azure Active Directory](connect-azure-active-directory.md)
- [Windows Security Events](connect-windows-security-events.md)
- [Amazon Web Services (AWS) CloudTrail](connect-aws.md)

## API-based connections

### Prerequisites

- You must have read and write permissions on the Log Analytics workspace.
- You must have the Global administrator or Security administrator role on your Microsoft Sentinel workspace's tenant.

### Instructions

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Select your service from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. Select **Connect** to start streaming events and/or alerts from your service into Microsoft Sentinel.

1. If on the connector page there is a section titled **Create incidents - recommended!**, select **Enable** if you want to automatically create incidents from alerts.

You can find and query the data for each service using the table names that appear in the section for the service's connector in the [Data connectors reference](data-connectors-reference.md) page.

## Diagnostic settings-based connections

The configuration of some connectors of this type is managed by Azure Policy. Select the **Azure Policy** tab below for instructions. For the other connectors of this type, select the **Standalone** tab.

# [Standalone](#tab/SA)

### Prerequisites

To ingest data into Microsoft Sentinel:

- You must have read and write permissions on the Microsoft Sentinel workspace.

### Instructions

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Select your resource type from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, select the link to open the resource configuration page.

    If presented with a list of resources of the desired type, select the link for a resource whose logs you want to ingest.

1. From the resource navigation menu, select **Diagnostic settings**.

1. Select **+ Add diagnostic setting** at the bottom of the list.

1. In the **Diagnostics settings** screen, enter a name in the **Diagnostic settings name** field.

    Mark the **Send to Log Analytics** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics Workspace** (where Microsoft Sentinel resides).

1. Mark the check boxes of the types of logs and metrics you want to collect. See our recommended choices for each resource type in the section for the resource's connector in the [Data connectors reference](data-connectors-reference.md) page.

1. Select **Save** at the top of the screen.

For more information, see also [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md) in the Azure Monitor documentation.

# [Azure Policy](#tab/AP)

### Prerequisites

To ingest data into Microsoft Sentinel:

- You must have read and write permissions on the Microsoft Sentinel workspace.

- To use Azure Policy to apply a log streaming policy to your resources, you must have the Owner role for the policy assignment scope.

### Instructions

Connectors of this type use Azure Policy to apply a single diagnostic settings configuration to a collection of resources of a single type, defined as a scope. You can see the log types ingested from a given resource type on the left side of the connector page for that resource, under **Data types**.

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Select your resource type from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, expand any expanders you see there and select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy, with a policy name pre-populated.

    1. In the **Basics** tab, select the button with the three dots under **Scope** to choose your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab:
       - Clear the **Only show parameters that require input** check box.
       - If you see **Effect** and **Setting name** fields, leave them as is.
       - Choose your Microsoft Sentinel workspace from the **Log Analytics workspace** drop-down list.
       - The remaining drop-down fields represent the available diagnostic log types. Leave marked as “True” all the log types you want to ingest.

    1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

---

> [!NOTE]
>
> With this type of data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

You can find and query the data for each resource type using the table name that appears in the section for the resource's connector in the [Data connectors reference](data-connectors-reference.md) page. For more information, see [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md?tabs=CMD) in the Azure Monitor documentation.

## Windows agent-based connections

> [!NOTE]
>
> The [Windows DNS Events via AMA connector (Preview)](connect-dns-ama.md) also uses the Azure Monitor Agent. This connector streams and filter events from Windows Domain Name System (DNS) server logs.

# [Azure Monitor Agent](#tab/AMA)

> [!IMPORTANT]
>
> Some connectors based on the Azure Monitor Agent (AMA) are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> 
> The Azure Monitor Agent is currently supported only for Windows Security Events and Windows Forwarded Events.

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

You can also create data collection rules using the API ([see schema](/rest/api/monitor/data-collection-rules)), which can make life easier if you're creating many rules (if you're an MSSP, for example). Here's an example (for the [Windows Security Events via AMA](data-connectors-reference.md#windows-security-events-via-ama) connector) that you can use as a template for creating a rule:

**Request URL and header**

```http
PUT https://management.azure.com/subscriptions/703362b3-f278-4e4b-9179-c76eaf41ffc2/resourceGroups/myResourceGroup/providers/Microsoft.Insights/dataCollectionRules/myCollectionRule?api-version=2019-11-01-preview
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

See this [complete description of data collection rules](../azure-monitor/essentials/data-collection-rule-overview.md) from the Azure Monitor documentation.

# [Log Analytics Agent (Legacy)](#tab/LAA)

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you start planning your migration to the AMA. For more information, see [AMA migration for Microsoft Sentinel](ama-migrate.md).
>

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


> [!NOTE]
>
> To allow Windows systems without the necessary internet connectivity to still stream events to Microsoft Sentinel, download and install the **Log Analytics Gateway** on a separate machine, using the **Download Log Analytics Gateway** link on the **Agents Management** page, to act as a proxy.  You still need to install the Log Analytics agent on each Windows system whose events you want to collect.
>
> For more information on this scenario, see the [**Log Analytics gateway** documentation](../azure-monitor/agents/gateway.md).

For additional installation options and further details, see the [**Log Analytics agent** documentation](../azure-monitor/agents/agent-windows.md).


#### Determine the logs to send

For the Windows DNS Server and Windows Firewall connectors, select the **Install solution** button. For the legacy Security Events connector, choose the **event set** you wish to send and select **Update**. For more information, see [Windows security event sets that can be sent to Microsoft Sentinel](windows-security-event-id-reference.md).

You can find and query the data for these services using the table names in their respective sections in the [Data connectors reference](data-connectors-reference.md) page.

---

## Next steps

In this document, you learned how to connect Azure, Microsoft, and Windows services, as well as Amazon Web Services, to Microsoft Sentinel. 
- Learn about [Microsoft Sentinel data connectors](connect-data-sources.md) in general.
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md).
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).