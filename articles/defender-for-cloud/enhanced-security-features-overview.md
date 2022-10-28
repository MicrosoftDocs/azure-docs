---
title: Understand the basic and extended security features of Microsoft Defender for Cloud 
description: Learn about the benefits of enabling enhanced security in Microsoft Defender for Cloud
ms.topic: overview
ms.date: 07/21/2022
ms.custom: references_regions, ignite-2022
---

# Microsoft Defender for Cloud's basic and enhanced security features

Defender for Cloud offers many enhanced security features that can help protect your organization against threats and attacks.

- **Basic security features** (Free) - When you open Defender for Cloud in the Azure portal for the first time or if you enable it through the API, Defender for Cloud is enabled for free on all your Azure subscriptions. By default, Defender for Cloud provides the [secure score](secure-score-security-controls.md), [security policy and basic recommendations](security-policy-concept.md), and [network security assessment](protect-network-resources.md) to help you protect your Azure resources.

    If you want to try out the enhanced security features, [enable enhanced security features](enable-enhanced-security.md) for free for the first 30 days. At the end of 30 days, if you decide to continue using the service, we'll automatically start charging for usage. For pricing details in your local currency or region, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

- **Enhanced security features** (Paid) - When you enable the enhanced security features, Defender for Cloud can provide unified security management and threat protection across your hybrid cloud workloads, including:

    - **Microsoft Defender for Endpoint** - Microsoft Defender for Servers includes [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender) for comprehensive endpoint detection and response (EDR). Learn more about the benefits of using Microsoft Defender for Endpoint together with Defender for Cloud in [Use Defender for Cloud's integrated EDR solution](integration-defender-for-endpoint.md).
    - **Vulnerability assessment for virtual machines, container registries, and SQL resources** - Easily enable vulnerability assessment solutions to discover, manage, and resolve vulnerabilities. View, investigate, and remediate the findings directly from within Defender for Cloud.
    - **Multicloud security** - Connect your accounts from Amazon Web Services (AWS) and Google Cloud Platform (GCP) to protect resources and workloads on those platforms with a range of Microsoft Defender for Cloud security features.
    - **Hybrid security** – Get a unified view of security across all of your on-premises and cloud workloads. Apply security policies and continuously assess the security of your hybrid cloud workloads to ensure compliance with security standards. Collect, search, and analyze security data from multiple sources, including firewalls and other partner solutions.
    - **Threat protection alerts** - Advanced behavioral analytics and the Microsoft Intelligent Security Graph provide an edge over evolving cyber-attacks. Built-in behavioral analytics and machine learning can identify attacks and zero-day exploits. Monitor networks, machines, data stores (SQL servers hosted inside and outside Azure, Azure SQL databases, Azure SQL Managed Instance, and Azure Storage) and cloud services for incoming attacks and post-breach activity. Streamline investigation with interactive tools and contextual threat intelligence.
    - **Track compliance with a range of standards** - Defender for Cloud continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in [Microsoft cloud security benchmark](/security/benchmark/azure/introduction). When you enable the enhanced security features, you can apply a range of other industry standards, regulatory standards, and benchmarks according to your organization's needs. Add standards and track your compliance with them from the [regulatory compliance dashboard](update-regulatory-compliance-packages.md).
    - **Access and application controls** - Block malware and other unwanted applications by applying machine learning powered recommendations adapted to your specific workloads to create allowlists and blocklists. Reduce the network attack surface with just-in-time, controlled access to management ports on Azure VMs. Access and application control drastically reduce exposure to brute force and other network attacks.
    - **Container security features** - Benefit from vulnerability management and real-time threat protection on your containerized environments. Charges are based on the number of unique container images pushed to your connected registry. After an image has been scanned once, you won't be charged for it again unless it's modified and pushed once more.
    - **Breadth threat protection for resources connected to Azure** - Cloud-native threat protection for the Azure services common to all of your resources: Azure Resource Manager, Azure DNS, Azure network layer, and Azure Key Vault. Defender for Cloud has unique visibility into the Azure management layer and the Azure DNS layer, and can therefore protect cloud resources that are connected to those layers.
    - **Manage your Cloud Security Posture Management (CSPM)** - CSPM offers you the ability to remediate security issues and review your security posture through the tools provided. These tools include:
        - Security governance and regulatory compliance
        - Cloud security graph
        - Attack path analysis
        - Agentless scanning for machines
    
        Learn more about [CSPM](concept-cloud-security-posture-management.md).

## FAQ - Pricing and billing 

- [How can I track who in my organization enabled a Microsoft Defender plan in Defender for Cloud?](#how-can-i-track-who-in-my-organization-enabled-a-microsoft-defender-plan-in-defender-for-cloud)
- [What are the plans offered by Defender for Cloud?](#what-are-the-plans-offered-by-defender-for-cloud)
- [How do I enable Defender for Cloud's enhanced security for my subscription?](#how-do-i-enable-defender-for-clouds-enhanced-security-for-my-subscription)
- [Can I enable Microsoft Defender for Servers on a subset of servers?](#can-i-enable-microsoft-defender-for-servers-on-a-subset-of-servers)
- [If I already have a license for Microsoft Defender for Endpoint, can I get a discount for Defender for Servers?](#if-i-already-have-a-license-for-microsoft-defender-for-endpoint-can-i-get-a-discount-for-defender-for-servers)
- [My subscription has Microsoft Defender for Servers enabled, which machines do I pay for?](#my-subscription-has-microsoft-defender-for-servers-enabled-which-machines-do-i-pay-for)
- [Will I be charged for machines without the Log Analytics agent installed?](#will-i-be-charged-for-machines-without-the-log-analytics-agent-installed)
- [If a Log Analytics agent reports to multiple workspaces, will I be charged twice?](#if-a-log-analytics-agent-reports-to-multiple-workspaces-will-i-be-charged-twice)
- [If a Log Analytics agent reports to multiple workspaces, is the 500-MB free data ingestion available on all of them?](#if-a-log-analytics-agent-reports-to-multiple-workspaces-is-the-500-mb-free-data-ingestion-available-on-all-of-them)
- [Is the 500-MB free data ingestion calculated for an entire workspace or strictly per machine?](#is-the-500-mb-free-data-ingestion-calculated-for-an-entire-workspace-or-strictly-per-machine)
- [What data types are included in the 500-MB data daily allowance?](#what-data-types-are-included-in-the-500-mb-data-daily-allowance)
- [How can I monitor my daily usage](#how-can-i-monitor-my-daily-usage)

### How can I track who in my organization enabled a Microsoft Defender plan in Defender for Cloud?
Azure Subscriptions may have multiple administrators with permissions to change the pricing settings. To find out which user made a change, use the Azure Activity Log.

:::image type="content" source="media/enhanced-security-features-overview/logged-change-to-pricing.png" alt-text="Azure Activity log showing a pricing change event.":::

If the user's info isn't listed in the **Event initiated by** column, explore the event's JSON for the relevant details.

:::image type="content" source="media/enhanced-security-features-overview/tracking-pricing-changes-in-activity-log.png" alt-text="Azure Activity log JSON explorer.":::


### What are the plans offered by Defender for Cloud? 
The free offering from Microsoft Defender for Cloud offers the secure score and related tools. Enabling enhanced security turns on all of the Microsoft Defender plans to provide a range of security benefits for all your resources in Azure, hybrid, and multicloud environments.  

### How do I enable Defender for Cloud's enhanced security for my subscription? 
You can use any of the following ways to enable enhanced security for your subscription: 

| Method                                          | Instructions                                                                                                                                       |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Defender for Cloud pages of the Azure portal    | [Enable enhanced protections](enable-enhanced-security.md)                                                                                         |
| REST API                                        | [Pricings API](/rest/api/defenderforcloud/pricings)                                                                                                  |
| Azure CLI                                       | [az security pricing](/cli/azure/security/pricing)                                                                                                 |
| PowerShell                                      | [Set-AzSecurityPricing](/powershell/module/az.security/set-azsecuritypricing)                                                                      |
| Azure Policy                                    | [Bundle Pricings](https://github.com/Azure/Azure-Security-Center/blob/master/Pricing%20%26%20Settings/ARM%20Templates/Set-ASC-Bundle-Pricing.json) |


### Can I enable Microsoft Defender for Servers on a subset of servers?

No. When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on an Azure subscription or a connected AWS account, all of the connected machines will be protected by Defender for Servers.

Another alternative is to enable Microsoft Defender for Servers at the Log Analytics workspace level. If you do this, only servers reporting to that workspace will be protected and billed. However, several capabilities will be unavailable. These include Microsoft Defender for Endpoint, VA solution (TVM/Qualys), just-in-time VM access, and more. 

### If I already have a license for Microsoft Defender for Endpoint, can I get a discount for Defender for Servers?

If you already have a license for **Microsoft Defender for Endpoint for Servers Plan 2**, you won't have to pay for that part of your Microsoft Defender for Servers license. Learn more about [this license](/microsoft-365/security/defender-endpoint/minimum-requirements#licensing-requirements).

To request your discount, [contact Defender for Cloud's support team](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). You'll need to provide the relevant workspace ID, region, and number of Microsoft Defender for Endpoint for servers licenses applied for machines in the given workspace.

The discount will be effective starting from the approval date, and won't take place retroactively.

### My subscription has Microsoft Defender for Servers enabled, which machines do I pay for?

When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on a subscription, all machines in that subscription (including machines that are part of PaaS services and reside in this subscription) are billed according to their power state as shown in the following table:

| State        | Description                                                                                                                                      | Instance usage billed |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| Starting     | VM is starting up.                                                                                                                               | Not billed            |
| Running      | Normal working state for a VM                                                                                                                    | Billed                |
| Stopping     | This state is transitional. When completed, it will show as Stopped.                                                                           | Billed                |
| Stopped      | The VM has been shut down from within the guest OS or using the PowerOff APIs. Hardware is still allocated to the VM and it remains on the host. | Billed                |
| Deallocating | This state is transitional. When completed, the VM will show as Deallocated.                                                                             | Not billed            |
| Deallocated  | The VM has been stopped successfully and removed from the host.                                                                                  | Not billed            |

:::image type="content" source="media/enhanced-security-features-overview/deallocated-virtual-machines.png" alt-text="Azure Virtual Machines showing a deallocated machine.":::

### If I enable Defender for Clouds Servers plan on the subscription level, do I need to enable it on the workspace level?

When you enable the Servers plan on the subscription level, Defender for Cloud will enable the Servers plan on your default workspaces automatically. Connect to the default workspace by selecting **Connect Azure VMs to the default workspace(s) created by Defender for Cloud** option and selecting **Apply**.

:::image type="content" source="media/enhanced-security-features-overview/connect-workspace.png" alt-text="Screenshot showing how to auto-provision Defender for Cloud to manage your workspaces.":::

However, if you're using a custom workspace in place of the default workspace, you'll need to enable the Servers plan on all of your custom workspaces that don't have it enabled. 

If you're using a custom workspace and enable the plan on the subscription level only, the `Microsoft Defender for servers should be enabled on workspaces` recommendation will appear on the Recommendations page. This recommendation will give you the option to enable the servers plan on the workspace level with the Fix button. You're charged for all VMs in the subscription even if the Servers plan isn't enabled for the workspace. The VMs won't benefit from features that depend on the Log Analytics workspace, such as Microsoft Defender for Endpoint, VA solution (TVM/Qualys), and Just-in-Time VM access.

Enabling the Servers plan on both the subscription and its connected workspaces, won't incur a double charge. The system will identify each unique VM.

If you enable the Servers plan on cross-subscription workspaces, connected VMs from all subscriptions will be billed, including subscriptions that don't have the Servers plan enabled.

### Will I be charged for machines without the Log Analytics agent installed?

Yes. When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on an Azure subscription or a connected AWS account, you'll be charged for all machines that are connected to your Azure subscription or AWS account. The term machines include Azure virtual machines, Azure virtual machine scale sets instances, and Azure Arc-enabled servers. Machines that don't have Log Analytics installed are covered by protections that don't depend on the Log Analytics agent.

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

### How can I monitor my daily usage

You can view your data usage in two different ways, the Azure portal, or by running a script.

**To view your usage in the Azure portal**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Log Analytics workspaces**.

1. Select your workspace.

1. Select **Usage and estimated costs**.

    :::image type="content" source="media/enhanced-security-features-overview/data-usage.png" alt-text="Screenshot of your data usage of your log analytics workspace. " lightbox="media/enhanced-security-features-overview/data-usage.png":::

You can also view estimated costs under different pricing tiers by selecting :::image type="icon" source="media/enhanced-security-features-overview/drop-down-icon.png" border="false"::: for each pricing tier.

:::image type="content" source="media/enhanced-security-features-overview/estimated-costs.png" alt-text="Screenshot showing how to view estimated costs under additional pricing tiers." lightbox="media/enhanced-security-features-overview/estimated-costs.png":::

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

    :::image type="content" source="media/enhanced-security-features-overview/select-run.png" alt-text="Screenshot showing where to enter your query and where the select run button is located." lightbox="media/enhanced-security-features-overview/select-run.png":::

You can learn how to [Analyze usage in Log Analytics workspace](../azure-monitor/logs/analyze-usage.md).

Based on your usage, you won't be billed until you've used your daily allowance. If you're receiving a bill, it's only for the data used after the 500-MB limit is reached, or for other service that doesn't fall under the coverage of Defender for Cloud.

## Next steps
This article explained Defender for Cloud's pricing options. For related material, see:

- [How to optimize your Azure workload costs](https://azure.microsoft.com/blog/how-to-optimize-your-azure-workload-costs/)
- [Pricing details according to currency or region](https://azure.microsoft.com/pricing/details/defender-for-cloud/)
- You may want to manage your costs and limit the amount of data collected for a solution by limiting it to a particular set of agents. Use [solution targeting](../azure-monitor/insights/solution-targeting.md) to apply a scope to the solution and target a subset of computers in the workspace. If you're using solution targeting, Defender for Cloud lists the workspace as not having a solution.
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
