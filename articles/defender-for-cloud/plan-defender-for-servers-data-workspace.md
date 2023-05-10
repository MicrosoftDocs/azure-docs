---
title: Plan Defender for Servers data residency and workspaces 
description: Review data residency and workspace design for Microsoft Defender for Servers.
ms.topic: conceptual
ms.author: benmansheim
author: bmansheim
ms.date: 11/06/2022
ms.custom: references_regions
---
# Plan data residency and workspaces for Defender for Servers

This article helps you understand how your data is stored in Microsoft Defender for Servers and how Log Analytics workspaces are used in Defender for Servers.

Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Before you begin

This article is the *second* article in the Defender for Servers planning guide series. Begin by [planning your deployment](plan-defender-for-servers.md).

## Understand data residency

Data residency refers to the physical or geographic location of your organization's data.

Before you deploy Defender for Servers, it's important for you to understand data residency for your organization:

- Review [general Azure data residency considerations](https://azure.microsoft.com/blog/making-your-data-residency-choices-easier-with-azure/).
- Review the table in the next section to understand where Defender for Cloud stores data.

### Storage locations

Understand where Defender for Cloud stores data and how you can work with your data:

**Data** | **Location**
--- | ---  
**Security alerts and recommendations** | - Stored in the Defender for Cloud back end and accessible via the Azure portal, Azure Resource Graph, and REST APIs.<br/><br/> - You can export the data to a Log Analytics workspace by using [continuous export](continuous-export.md).
**Machine information** | - Stored in a Log Analytics workspace.<br/><br/> - You can use either the default Defender for Cloud workspace or a custom workspace. Data is stored in accordance with the workspace location.

## Workspace considerations

In Defender for Cloud, you can store server data in the default Log Analytics workspace for your Defender for Cloud deployment or in a custom workspace.

Here's more information:

- By default, when you enable Defender for Cloud for the first time, a new resource group and a default workspace are created in the subscription region for each subscription that has Defender for Cloud enabled.
- When you use only free foundational cloud security posture management (CSPM), Defender for Cloud sets up the default workspace with the *SecurityCenterFree* solution enabled.
- When you turn on a Defender for Cloud plan (including Defender for Servers), the plan is enabled for the default workspace, and the *Security* solution is enabled.
- If you have virtual machines in multiple locations, Defender for Cloud creates multiple workspaces accordingly to ensure data compliance.
- Default workspace names are in the format `[subscription-id]-[geo]`.

## Default workspaces

Defender for Cloud default workspaces are created in the following locations:

**Server location** | **Workspace location**
--- | ---
United States, Canada, Europe, United Kingdom, Korea, India, Japan, China, Australia | The workspace is created in the matching location.
Brazil | United States
East Asia, Southeast Asia | Asia

## Custom workspaces

You can store your server information in the default workspace or you can use a custom workspace. A custom workspace must meet these requirements:

- You must enable the Defender for Servers plan in the custom workspace.
- The custom workspace must be associated with the Azure subscription in which Defender for Cloud is enabled.
- You must have at least read permissions for the workspace.
- If the *Security & Audit* solution is installed in a workspace, Defender for Cloud uses the existing solution.

## Log Analytics pricing FAQ

- [Will I be charged for machines without the Log Analytics agent installed?](#will-i-be-charged-for-machines-without-the-log-analytics-agent-installed)
- [If a Log Analytics agent reports to multiple workspaces, will I be charged twice?](#if-a-log-analytics-agent-reports-to-multiple-workspaces-will-i-be-charged-twice)
- [If a Log Analytics agent reports to multiple workspaces, is the 500-MB free data ingestion available on all of them?](#if-a-log-analytics-agent-reports-to-multiple-workspaces-is-the-500-mb-free-data-ingestion-available-on-all-of-them)
- [Is the 500-MB free data ingestion calculated for an entire workspace or strictly per machine?](#is-the-500-mb-free-data-ingestion-calculated-for-an-entire-workspace-or-strictly-per-machine)
- [What data types are included in the 500-MB data daily allowance?](#what-data-types-are-included-in-the-500-mb-data-daily-allowance)
- [How can I monitor my daily usage](#how-can-i-monitor-my-daily-usage)
- [How can I manage my costs?](#how-can-i-manage-my-costs)

### If I enable Defender for Clouds Servers plan on the subscription level, do I need to enable it on the workspace level?

When you enable the Servers plan on the subscription level, Defender for Cloud will enable the Servers plan on your default workspaces automatically. Connect to the default workspace by selecting **Connect Azure VMs to the default workspace(s) created by Defender for Cloud** option and selecting **Apply**.

:::image type="content" source="media/plan-defender-for-servers-data-workspace/connect-workspace.png" alt-text="Screenshot showing how to auto-provision Defender for Cloud to manage your workspaces.":::

However, if you're using a custom workspace in place of the default workspace, you'll need to enable the Servers plan on all of your custom workspaces that don't have it enabled. 

If you're using a custom workspace and enable the plan on the subscription level only, the `Microsoft Defender for servers should be enabled on workspaces` recommendation will appear on the Recommendations page. This recommendation will give you the option to enable the servers plan on the workspace level with the Fix button. You're charged for all VMs in the subscription even if the Servers plan isn't enabled for the workspace. The VMs won't benefit from features that depend on the Log Analytics workspace, such as Microsoft Defender for Endpoint, VA solution (MDVM/Qualys), and Just-in-Time VM access.

Enabling the Servers plan on both the subscription and its connected workspaces, won't incur a double charge. The system will identify each unique VM.

If you enable the Servers plan on cross-subscription workspaces, connected VMs from all subscriptions will be billed, including subscriptions that don't have the Servers plan enabled.

### Will I be charged for machines without the Log Analytics agent installed?

Yes. When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on an Azure subscription or a connected AWS account, you'll be charged for all machines that are connected to your Azure subscription or AWS account. The term machines include Azure virtual machines, Azure Virtual Machine Scale Sets instances, and Azure Arc-enabled servers. Machines that don't have Log Analytics installed are covered by protections that don't depend on the Log Analytics agent.

### If a Log Analytics agent reports to multiple workspaces, will I be charged twice?

If a machine, reports to multiple workspaces, and all of them have Defender for Servers enabled, the machines will be billed for each attached workspace.

### If a Log Analytics agent reports to multiple workspaces, is the 500-MB free data ingestion available on all of them?

Yes. If you configure your Log Analytics agent to send data to two or more different Log Analytics workspaces (multi-homing), you'll get 500-MB free data ingestion for each workspace. It's calculated per node, per reported workspace, per day, and available for every workspace that has a 'Security' or 'AntiMalware' solution installed. You'll be charged for any data ingested over the 500-MB limit.

### Is the 500-MB free data ingestion calculated for an entire workspace or strictly per machine?

You'll get 500-MB free data ingestion per day, for every VM connected to the workspace. Specifically for the [security data types](#what-data-types-are-included-in-the-500-mb-data-daily-allowance) that are directly collected by Defender for Cloud. 

This data is a daily rate averaged across all nodes. Your total daily free limit is equal to **[number of machines] x 500 MB**. So even if some machines send 100 MB and others send 800 MB, if the total doesn't exceed your total daily free limit, you won't be charged extra.

### What data types are included in the 500-MB data daily allowance?
Defender for Cloud's billing is closely tied to the billing for Log Analytics. [Microsoft Defender for Servers](defender-for-servers-introduction.md) provides a 500 MB/node/day allocation for machines against the following subset of [security data types](/azure/azure-monitor/reference/tables/tables-category#security):

- [SecurityAlert](/azure/azure-monitor/reference/tables/securityalert)
- [SecurityBaseline](/azure/azure-monitor/reference/tables/securitybaseline)
- [SecurityBaselineSummary](/azure/azure-monitor/reference/tables/securitybaselinesummary)
- [SecurityDetection](/azure/azure-monitor/reference/tables/securitydetection)
- [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent)
- [WindowsFirewall](/azure/azure-monitor/reference/tables/windowsfirewall)
- [SysmonEvent](/azure/azure-monitor/reference/tables/sysmonevent)
- [ProtectionStatus](/azure/azure-monitor/reference/tables/protectionstatus)
- [Update](/azure/azure-monitor/reference/tables/update) and [UpdateSummary](/azure/azure-monitor/reference/tables/updatesummary) when the Update Management solution isn't running in the workspace or solution targeting is enabled.

If the workspace is in the legacy Per Node pricing tier, the Defender for Cloud and Log Analytics allocations are combined and applied jointly to all billable ingested data.

### How can I monitor my daily usage?

You can view your data usage in two different ways, the Azure portal, or by running a script.

**To view your usage in the Azure portal**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Log Analytics workspaces**.

1. Select your workspace.

1. Select **Usage and estimated costs**.

    :::image type="content" source="media/plan-defender-for-servers-data-workspace/data-usage.png" alt-text="Screenshot of your data usage of your log analytics workspace. " lightbox="media/plan-defender-for-servers-data-workspace/data-usage.png":::

You can also view estimated costs under different pricing tiers by selecting :::image type="icon" source="media/plan-defender-for-servers-data-workspace/drop-down-icon.png" border="false"::: for each pricing tier.

:::image type="content" source="media/plan-defender-for-servers-data-workspace/estimated-costs.png" alt-text="Screenshot showing how to view estimated costs under additional pricing tiers." lightbox="media/plan-defender-for-servers-data-workspace/estimated-costs.png":::

**To view your usage by using a script**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Log Analytics workspaces** > **Logs**.

1. Select your time range. Learn about [time ranges](../azure-monitor/logs/log-analytics-tutorial.md).

1. Copy and past the following query into the **Type your query here** section.

    ```azurecli
    let Unit= 'GB';
    Usage
    | where IsBillable == 'TRUE'
    | where DataType in ('SecurityAlert', 'SecurityBaseline', 'SecurityBaselineSummary', 'SecurityDetection', 'SecurityEvent', 'WindowsFirewall', 'MaliciousIPCommunication', 'SysmonEvent', 'ProtectionStatus', 'Update', 'UpdateSummary')
    | project TimeGenerated, DataType, Solution, Quantity, QuantityUnit
    | summarize DataConsumedPerDataType = sum(Quantity)/1024 by  DataType, DataUnit = Unit
    | sort by DataConsumedPerDataType desc
    ```

1. Select **Run**.

    :::image type="content" source="media/plan-defender-for-servers-data-workspace/select-run.png" alt-text="Screenshot showing where to enter your query and where the select run button is located." lightbox="media/plan-defender-for-servers-data-workspace/select-run.png":::

You can learn how to [Analyze usage in Log Analytics workspace](../azure-monitor/logs/analyze-usage.md).

Based on your usage, you won't be billed until you've used your daily allowance. If you're receiving a bill, it's only for the data used after the 500-MB limit is reached, or for other service that doesn't fall under the coverage of Defender for Cloud.

### How can I manage my costs?

You may want to manage your costs and limit the amount of data collected for a solution by limiting it to a particular set of agents. Use [solution targeting](/previous-versions/azure/azure-monitor/insights/solution-targeting) to apply a scope to the solution and target a subset of computers in the workspace. If you're using solution targeting, Defender for Cloud lists the workspace as not having a solution.
> [!IMPORTANT]
> Solution targeting has been deprecated because the Log Analytics agent is being replaced with the Azure Monitor agent and solutions in Azure Monitor are being replaced with insights. You can continue to use solution targeting if you already have it configured, but it is not available in new regions.
> The feature will not be supported after August 31, 2024.
> Regions that support solution targeting until the deprecation date are:
> 
> | Region code | Region name |
> | :--- | :---------- |
> | CCAN | canadacentral |
> | CHN | switzerlandnorth |
> | CID | centralindia |
> | CQ | brazilsouth |
> | CUS | centralus |
> | DEWC | germanywestcentral |
> | DXB | UAENorth |
> | EA | eastasia |
> | EAU | australiaeast |
> | EJP | japaneast |
> | EUS | eastus |
> | EUS2 | eastus2 |
> | NCUS | northcentralus |
> | NEU | NorthEurope |
> | NOE | norwayeast |
> | PAR | FranceCentral |
> | SCUS | southcentralus |
> | SE | KoreaCentral |
> | SEA | southeastasia |
> | SEAU | australiasoutheast |
> | SUK | uksouth |
> | WCUS | westcentralus |
> | WEU | westeurope |
> | WUS | westus |
> | WUS2 | westus2 |
>
> | Air-gapped clouds | Region code | Region name |
> | :---- | :---- | :---- |
> | UsNat | EXE | usnateast | 
> | UsNat | EXW | usnatwest | 
> | UsGov | FF | usgovvirginia | 
> | China | MC | ChinaEast2 | 
> | UsGov | PHX | usgovarizona | 
> | UsSec | RXE | usseceast | 
> | UsSec | RXW | ussecwest | 

## Next steps

After you work through these planning steps, review [Defender for Server access roles](plan-defender-for-servers-roles.md).
