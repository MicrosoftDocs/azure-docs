---
title: Azure Security Center free vs Azure Defender enabled
description: Learn about the benefits of enabling Azure Defender for cloud workload protection in Azure Security Center
author: memildin
ms.author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 03/23/2021
---

# Azure Security Center free vs Azure Defender enabled
Azure Defender is free for the first 30 days. At the end of 30 days, should you choose to continue using the service, we'll automatically start charging for usage.

You can upgrade from the **Pricing & settings** page, as described in [Quickstart: Enable Azure Defender](enable-azure-defender.md). For pricing details in your currency of choice and according to your region, see [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/).

## What are the benefits of enabling Azure Defender?

Security Center is offered in two modes:

- **Azure Defender OFF** (Free) - Security Center without Azure Defender is enabled for free on all your Azure subscriptions when you visit the Azure Security Center dashboard in the Azure portal for the first time, or if enabled programmatically via API. Using this free mode provides security policy, continuous security assessment, and actionable security recommendations to help you protect your Azure resources.

- **Azure Defender ON** - Enabling Azure Defender extends the capabilities of the free mode to workloads running in private and other public clouds, providing unified security management and threat protection across your hybrid cloud workloads. Some of the major features of Azure Defender:

    - **Microsoft Defender for Endpoint** - Azure Defender for servers includes [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender) for comprehensive endpoint detection and response (EDR). Learn more about the benefits of using Microsoft Defender for Endpoint together with Azure Defender in [Use Security Center's integrated EDR solution](security-center-wdatp.md).
    - **Vulnerability scanning for virtual machines and container registries** - Easily deploy a scanner to all of your virtual machines that provides the industry's most advanced solution for vulnerability management. View, investigate, and remediate the findings directly within Security Center. 
    - **Hybrid security** – Get a unified view of security across all of your on-premises and cloud workloads. Apply security policies and continuously assess the security of your hybrid cloud workloads to ensure compliance with security standards. Collect, search, and analyze security data from multiple sources, including firewalls and other partner solutions.
    - **Threat protection alerts** - Advanced behavioral analytics and the Microsoft Intelligent Security Graph provide an edge over evolving cyber-attacks. Built-in behavioral analytics and machine learning can identify attacks and zero-day exploits. Monitor networks, machines, and cloud services for incoming attacks and post-breach activity. Streamline investigation with interactive tools and contextual threat intelligence.
    - **Access and application controls** (AAC) - Block malware and other unwanted applications by applying machine learning powered recommendations adapted to your specific workloads to create allow and deny lists. Reduce the network attack surface with just-in-time, controlled access to management ports on Azure VMs. AAC drastically reduces exposure to brute force and other network attacks.
    - **Container security features** - Benefit from vulnerability management and real-time threat protection on your containerized environments. When enabling the **Azure Defender for container registries**, it may take up to 12 hrs until all the features are enabled. Charges are based on the number of unique container images pushed to your connected registry. After an image has been scanned once, you won't be charged for it again unless it's modified and pushed once more.
    - **Breadth threat protection for resources connected to the Azure environment** - Azure Defender includes Azure-native breadth threat protection for the Azure services common to all of your resources: Azure Resource Manager, Azure DNS, Azure network layer, and Azure Key Vault. Azure Defender has unique visibility into the Azure management layer and the Azure DNS layer, and can therefore protect cloud resources that are connected to those layers.


## FAQ - Pricing and billing 

- [How can I track who in my organization enabled Azure Defender changes in Security Center?](#how-can-i-track-who-in-my-organization-enabled-azure-defender-changes-in-security-center)
- [What are the plans offered by Security Center?](#what-are-the-plans-offered-by-security-center)
- [How do I enable Azure Defender for my subscription?](#how-do-i-enable-azure-defender-for-my-subscription)
- [Can I enable Azure Defender for servers on a subset of servers in my subscription?](#can-i-enable-azure-defender-for-servers-on-a-subset-of-servers-in-my-subscription)
- [If I already have a license for Microsoft Defender for Endpoint can I get a discount for Azure Defender?](#if-i-already-have-a-license-for-microsoft-defender-for-endpoint-can-i-get-a-discount-for-azure-defender)
- [My subscription has Azure Defender for servers enabled, do I pay for not-running servers?](#my-subscription-has-azure-defender-for-servers-enabled-do-i-pay-for-not-running-servers)
- [Will I be charged for machines without the Log Analytics agent installed?](#will-i-be-charged-for-machines-without-the-log-analytics-agent-installed)
- [If a Log Analytics agent reports to multiple workspaces, will I be charged twice?](#if-a-log-analytics-agent-reports-to-multiple-workspaces-will-i-be-charged-twice)
- [If a Log Analytics agent reports to multiple workspaces, is the 500-MB free data ingestion available on all of them?](#if-a-log-analytics-agent-reports-to-multiple-workspaces-is-the-500-mb-free-data-ingestion-available-on-all-of-them)
- [Is the 500-MB free data ingestion calculated for an entire workspace or strictly per machine?](#is-the-500-mb-free-data-ingestion-calculated-for-an-entire-workspace-or-strictly-per-machine)
- [What data types are included in the 500-MB data daily allowance?](#what-data-types-are-included-in-the-500-mb-data-daily-allowance)


### How can I track who in my organization enabled Azure Defender changes in Security Center?
Azure Subscriptions may have multiple administrators with permissions to change the pricing settings. To find out which user made a change, use the Azure Activity Log.

:::image type="content" source="media/security-center-pricing/logged-change-to-pricing.png" alt-text="Azure Activity log showing a pricing change event":::

If the user's info isn't listed in the **Event initiated by** column, explore the event's JSON for the relevant details.

:::image type="content" source="media/security-center-pricing/tracking-pricing-changes-in-activity-log.png" alt-text="Azure Activity log JSON explorer":::


### What are the plans offered by Security Center? 
Security Center has two offerings: 

- Azure Security Center free 
- Azure Defender  

### How do I enable Azure Defender for my subscription? 
You can use any of the following ways to enable Azure Defender for your subscription: 

| Method                                          | Instructions                                                                                                                                       |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure Security Center pages of the Azure portal | [Enable Azure Defender](enable-azure-defender.md)                                                                                                  |
| REST API                                        | [Pricings API](/rest/api/securitycenter/pricings)                                                                                                  |
| Azure CLI                                       | [az security pricing](/cli/azure/security/pricing)                                                                                                 |
| PowerShell                                      | [Set-AzSecurityPricing](/powershell/module/az.security/set-azsecuritypricing)                                                                      |
| Azure Policy                                    | [Bundle Pricings](https://github.com/Azure/Azure-Security-Center/blob/master/Pricing%20%26%20Settings/ARM%20Templates/Set-ASC-Bundle-Pricing.json) |
|                                                 |                                                                                                                                                    |

### Can I enable Azure Defender for servers on a subset of servers in my subscription?
No. When you enable [Azure Defender for servers](defender-for-servers-introduction.md) on a subscription, all the servers in the subscription will be protected by Azure Defender. 

An alternative is to enable Azure Defender for servers at the Log Analytics workspace level. If you do this, only servers reporting to that workspace will be protected and billed. However, several capabilities will be unavailable. These include just-in-time VM access, network detections, regulatory compliance, adaptive network hardening, adaptive application control, and more. 

### If I already have a license for Microsoft Defender for Endpoint can I get a discount for Azure Defender?
If you've already got a license for Microsoft Defender for Endpoint, you won't have to pay for that part of your Azure Defender license.

To confirm your discount, contact Security Center's support team and provide the relevant workspace ID, region, and license information for each relevant license.

### My subscription has Azure Defender for servers enabled, do I pay for not-running servers? 
No. When you enable [Azure Defender for servers](defender-for-servers-introduction.md) on a subscription, you won't be charged for any machines that are in the deallocated power state while they're in that state. Machines are billed according to their power state as shown in the following table:

| State        | Description                                                                                                                                      | Instance usage billed |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| Starting     | VM is starting up.                                                                                                                               | Not billed            |
| Running      | Normal working state for a VM                                                                                                                    | Billed                |
| Stopping     | This is a transitional state. When completed, it will show as Stopped.                                                                           | Billed                |
| Stopped      | The VM has been shut down from within the guest OS or using the PowerOff APIs. Hardware is still allocated to the VM and it remains on the host. | Billed                |
| Deallocating | Transitional state. When completed, the VM will show as Deallocated.                                                                             | Not billed            |
| Deallocated  | The VM has been stopped successfully and removed from the host.                                                                                  | Not billed            |

:::image type="content" source="media/security-center-pricing/deallocated-virtual-machines.png" alt-text="Azure Virtual Machines showing a deallocated machine":::

### Will I be charged for machines without the Log Analytics agent installed?
Yes. When you enable [Azure Defender for servers](defender-for-servers-introduction.md) on a subscription, the machines in that subscription get a range of protections even if you haven't installed the Log Analytics agent.

### If a Log Analytics agent reports to multiple workspaces, will I be charged twice? 
Yes. If you've configured your Log Analytics agent to send data to two or more different Log Analytics workspaces (multi-homing), you'll be charged for every workspace that has a 'Security' or 'AntiMalware' solutions installed. 

### If a Log Analytics agent reports to multiple workspaces, is the 500-MB free data ingestion available on all of them?
Yes. If you've configured your Log Analytics agent to send data to two or more different Log Analytics workspaces (multi-homing), you'll get 500-MB free data ingestion. It's calculated per node, per reported workspace, per day, and available for every workspace that has a 'Security' or 'AntiMalware' solutions installed. You'll be charged for any data ingested over the 500 MB.

### Is the 500-MB free data ingestion calculated for an entire workspace or strictly per machine?
You’ll get 500-MB free data ingestion per day, for every machine connected to the workspace. Specifically for security data types directly collected by Azure Security Center.

This data is a daily rate averaged across all nodes. So even if some machines send 100-MB and others send 800-MB, if the total doesn’t exceed the **[number of machines] x 500-MB** free limit, you won’t be charged extra.

### What data types are included in the 500-MB data daily allowance?

Security Center's billing is closely tied to the billing for Log Analytics. Security Center provides a 500 MB/node/day allocation against the following subset of [security data types](/azure/azure-monitor/reference/tables/tables-category#security):
- WindowsEvent
- SecurityAlert
- SecurityBaseline
- SecurityBaselineSummary
- SecurityDetection
- SecurityEvent
- WindowsFirewall
- MaliciousIPCommunication
- LinuxAuditLog
- SysmonEvent
- ProtectionStatus
- Update and UpdateSummary data types when the Update Management solution is not running on the workspace or solution targeting is enabled

If the workspace is in the legacy Per Node pricing tier, the Security Center and Log Analytics allocations are combined and applied jointly to all billable ingested data.

## Next steps
This article explained Security Center's pricing options. For related material, see:

- [How to optimize your Azure workload costs](https://azure.microsoft.com/blog/how-to-optimize-your-azure-workload-costs/)
- [Pricing details in your currency of choice, and according to your region](https://azure.microsoft.com/pricing/details/security-center/)
- You may want to manage your costs and limit the amount of data collected for a solution by limiting it to a particular set of agents. [Solution targeting](../azure-monitor/insights/solution-targeting.md) allows you to apply a scope to the solution and target a subset of computers in the workspace. If you're using solution targeting, Security Center lists the workspace as not having a solution.
