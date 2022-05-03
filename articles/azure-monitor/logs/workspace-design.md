---
title: Design a Log Analytics workspace configuration in Azure Monitor
description: Describes the considerations and recommendations for customers preparing to deploy a workspace in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/19/2022

---

# Design a Log Analytics workspace configuration in Azure Monitor
[Azure Monitor Logs](data-platform-logs.md) stores data in a [Log Analytics workspace](log-analytics-workspace-overview.md), which is a container where data is collected and aggregated. While a single workspace may be sufficient for many implementations, multiple workspaces may be required to optimize your costs and better achieve different business objectives. This article presents different criteria for determining whether to use a single workspace or multiple workspaces and the configuration and placement of those workspace to meet your particular requirements while optimizing your costs. 



## Typical models
The following sections provide a high level description of the basic models that your workspace design should follow. 

### Centralized
All logs are stored in a central workspace, which is administered by a single team. Granular access is configured in the workspace to provide required access to particular tables for different sets of users. Resource-level access is enabled on the workspace to allow any Azur eresource own to view data collected by their resource without requiring explicit permissions in Azure Monitor. Default data retention is configured for the workspace with retention for individual tables with special requirements configured separately.

This configuration makes it easy to search across resources and cross-correlate logs. The workspace can grow significantly with no effect on performance and the potential to configure a commitment tier to reduce ingestion cost.

The primary challenge with this configuration is the additional administrative overhead to maintain access control to different users. There may also be aspects of your environment in addition to business requirements that prevent you from using a centralized configuration.

### Decentralized
Each team has their own workspace created in a resource group they own and manage, and log data is segregated per resource. In this scenario, the workspace can be kept secure and access control is consistent with resource access. Table-level and resource-level access may not be required since most users with access to the workspace have the same requirements.

This configuration makes administration easy since little access control configuration needs to be performed. This assumes though that each workspace is managed by a different team as opposed to a centralized team responsible for the multiple workspaces.

The primary challenge with this configuration is corelating log data across workspaces. There are features in Azure Monitor to assist with this correlation such as [cross-workspace queries](cross-workspace-queries.md) and the ability to select multiple subscriptions and workspaces in insights and workbooks. Distributing data across workspaces also may prevent you from taking advantage of a commitment tier which can reduce ingestion costs.

### Hybrid
A hybrid configuration is a centralized configuration with additional workspaces created for specific unique requirements. This realizes the advantages of the centralized model but creates a minimal number of decentralized workspaces as required. 


## Design criteria
Designing a workspace configuration can be a complex process that includes evaluation of multiple criteria, and different criterion may lead to competing recommendations. For example, you may be able to reduce egress charges by creating a separate workspace in each Azure region, but consolidating into a single workspace might allow you to reduce charges with a commitment tier. Evaluate each criterion independently and consider your particular requirements and priorities in determining which design will be most effective for your particular environment.

Since a single workspace can collect data from Azure Monitor in addition to other Azure services that use a Log Analytics workspace, you should consider the data from all services that you use in your design. One of the criterion specifically includes Azure Sentinel since it has unique considerations that can significantly impact your design.


The following table briefly presents the criteria that you should consider when determining whether to create additional workspaces. The sections below describe each of these criteria in full detail.

| Criteria | Description |
|:---|:---|
| [Azure tenants](#azure-tenants) | Microsoft Sentinel supports data collection from Microsoft and Azure SaaS resources only within its own Azure Active Directory (Azure AD) tenant boundary. Therefore, each Azure AD tenant requires a separate workspace. |  |
| [Split billing](#split-billing) | By placing workspaces in separate subscriptions, they can be billed to different parties. |
| [Azure regions](#azure-regions) | Each workspaces resides in a particular Azure region, and you may have regulatory or compliance requirements to store data in particular locations.  |
| [Data retention and archive](#data-retention-and-archive) | You can set different retention settings for each table in a workspace, but you may choose to rely on the default retention for the workspace. |
| [Commitment tiers](#commitment-tiers) | Commitment tiers allow you to reduce your ingestion cost by committing to a minimum amount of daily data in a single workspace. |
| [Azure Sentinel](#azure-services) | You should typically create a dedicated workspace for Azure Sentinel data, but there are circumstances where combining data can result in lower cost. |
| [Data ownership](#data-ownership) | The boundaries of data ownership, for example by subsidiaries or affiliated companies, are better delineated using separate workspaces. | 
| [Data access control](#data-access-control) | You can configure granular access to different sets of data within a workspace, but you may also choose to separate data for different teams into different workspaces for an addition level of control. |
| [Data retention and archive](#date-retention-and-archive) | You can set different retention settings for each table in a workspace, but you may choose to rely on the default retention for the workspace. |
| [Legacy agent limitations](#legacy-agent-limitations) | Legacy virtual machine agents have limitations on the number of workspaces they can connect to. |


### Azure tenants<a name="azure-tenants"></a>
Most resources can only send monitoring data to the workspace in the same Azure tenant. Virtual machines using the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) or the [Log Analytics agents](../agents/log-analytics-agent.md) can send data to workspaces in separate Azure tenants, which may be a scenario that you consider as a service provider. If you're using Azure Sentinel and are collecting logs with a tenant boundary such as Office 365 or Microsoft 365 Defender though, then you should create a separate workspace for each tenant.

- **If you have a single Azure tenant**, then create a single workspace for that tenant.
- **If you have multiple Azure tenants**, then see [Log Analytics workspace design for service providers] to determine whether you should create a separate workspace for each tenant.
 
### Split billing<a name="split-billing"></a>
You may need to split billing between different parties or perform charge back to an internal business unit. [Azure Cost Management + Billing](../usage-estimated-costs.md#azure-cost-management--billing) allows you to view charges by workspace. 

- **If you do not need to split billing or perform charge back**, use a single workspace for all cost owners.
- **If you need to split billing or perform charge back**, consider whether [Azure Cost Management + Billing](../usage-estimated-costs.md#azure-cost-management--billing) provides granular enough cost reporting for your requirements.
- **If Azure Cost Management + Billing is sufficient**, use a single workspace for all cost owners.
- **If Azure Cost Management + Billing is not sufficient**, use a separate workspace for each cost owner.

### Azure regions<a name="azure-regions"></a>
Log Analytics workspaces each reside in a [particular Azure region](https://azure.microsoft.com/global-infrastructure/geographies/), and you may regulatory or compliance purposes for keeping data in a particular region.


- **If you have requirements for keeping data in a particular geography**, create a separate workspace for each region with such requirements.
- **If you do not have requirements for keeping data in a particular geography**, use a single workspace for all regions.

You should also consider potential [egress charges](https://azure.microsoft.com/pricing/details/bandwidth/) that may apply when sending data to a workspace from a resource in another region. This will typically be when sending data to the workspace from a virtual machine using the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) or [Log Analytics agent](../agents/log-analytics-agent.md) since monitoring data from other Azure resources using [diagnostic settings](../essentials/diagnostic-settings.md) does not [incur egress charges](../usage-estimated-costs#data-transfer-charges.md).

Use the [Azure pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator) to estimate the cost and determine which regions you actually need. Consider combining workspaces for regions with low egress costs. Bandwidth costs may be only a small part of your Azure bill when compared with separate ingestion costs for Azure Monitor and Azure Sentinel.

For example, you might estimate your costs similar to the following:

- 1,000 VMs, each generating 1 GB / day.
- Each VM sending data from a US region to an EU region.
- 2:1 compression rate at the agent.
- 
The calculation for this estimated cost would be: `1000 VMs * (1GB/day ÷ 2) * 30 days/month * $0.05/GB = $750/month bandwidth cost`. This is the cost that you would compare to the cost and complexity of creating separate workspaces. For example, this additional cost may be greater than the cost savings for combining workspaces in a single region to take advantage of a commitment tier.

- **If egress charges are significant enough to justify the additional complexity**, create a separate workspace for each region with virtual machines.
- **If egress charges are not significant enough to justify the additional complexity**, use a single workspace for all regions.



### Data retention and archive<a name="data-retention-and-archive"></a>
You can configure default [data retention and archive settings](data-retention-archive.md) for a workspace or configure different settings for each table. You may require different settings for different sets of data in a particular table. If this is the case, then you need to store 

- **If you can use the same retention and archive settings for all data in each table**, use a single workspace for all resources.
- **If you can require different retention and archive settings for different resources in the same table**, use a separate workspace for different resources.



### Commitment tiers<a name="commitment-tiers"></a>
[Commitment tiers](../logs/cost-logs.md#commitment-tiers) provide a discount to your workspace ingestion costs when you commit to a particular amount of daily data. You may choose to consolidate data in a single workspace in order to reach the level of a particular tier. This same volume of data spread across multiple workspaces would not be eligible for the same tier, unless you have a dedicated cluster.

If you can commit to daily ingestion of at least 500 GB/day, then you should implement a [dedicated cluster](../logs/cost-logs.md#dedicated-clusters) which provides additional functionality and performance. Dedicated clusters also allow you to combine the data from multiple workspaces in the cluster to reach ahe level of a commitment tier.

- **If you will ingest at least 500 GB/day across all resources**, create a dedicated cluster and set the appropriate commitment tier.
- **If you will ingest at least 100 GB/day across resources**, consider combining them into a single workspace to take advantage of a commitment tier.
- **If you will ingest less than 100 GB/day**, don't consolidate workspaces for ingestion cost.



### Azure Sentinel<a name="azure-sentinel"></a>
If Azure Sentinel is enabled in a workspace, then all data in that workspace is subject to Sentinel pricing, even if it's operational data collected by Azure Monitor. This will typically encourage you to create workspaces dedicated to Sentinel data. Combining the data though may allow you to reach a commitment tier providing cost savings the operational and security each have an ingestion size between GB/day and 100 GB/day. 

For example, consider an organization that has security logs ingesting at 50 GB/day and operations logs ingesting at 50 GB/day. Compare the differences in creating separate workspaces for the Operations and Security Operations Center (SOC) teams and consolidating all data in a single workspace.

> [NOTE]
> The costs and terms listed in the following table are fictional and used for example purposes only. For current cost information, see the Azure Monitor and Azure Sentinel pricing.

| Workspace architecture| Description |
|:---|:---|
| The Operations team and Security Operations Center (SOC) team each have their own workspace. Microsoft Sentinel is only enabled in the SOC workspace. | **SOC workspace**<br>50 GB/day for \$6,500 per month.<br>First three months of retention free.<br><br>**Operations workspace**<br>50 GB/day for \$3,500 per month<br><br>**Total**<br>Cost for both workspace is \$10,000 per month. |
| The Operations team and Security Operations Center (SOC) teams share a single workspace with Microsoft Sentinel enabled. | **Single workspace**<br>100 GB/day<br>Qualifyies for commitment tier (15% for Azure Monitor, 50% for Sentinel)<br>First 31 days of retention free. |

Since the combined data in this example qualifies for a commitment tier, it results in a \$1,000 per month cost savings. The increased cost from Sentinel is outweighed by the discount from the commitment tier. The operational data would also get 3 months of free data retention instead of 31 days.

- **If your operational and security data each have an ingestion size between 50 GB/day and 100 GB/day**, combine operational and security data in the same workspace and configure a commitment tier.
- **If your operational and security data don't qualify for a commitment tier or each qualify for a commitment tier on their own**, create separate workspaces for operational and security data so that operational data isn't subject to Sentinel pricing.


### Data ownership<a name="data-ownership"></a>
You may have a requirement to segregate data or define boundaries based on ownership. For example, you may have different subsidiaries or affiliated companies that require delineation. 

- **If you require data segregation**, use a separate workspace for each data owner.
- **If you do not require data segregation**, use a single workspace for all data owners.


### Data access control<a name="data-access-control"></a>
While a workspace can be used as a boundary for access control, you can configure granular permissions for the workspace based on the following:

- **Table-level.** Configure different permissions for each table in the workspace.
- **Resource-level.** User has access to data in all tables collected for Azure resources they have read access.

Each workspace has an [access control mode](workspace-access-control.md#access-control-mode) that defines how permissions are determined for that workspace. You can specify whether users require explicit access to the workspace and its tables, or that users have access to any data collected for their resources whether or not they have workspace permissions.

Resource-level access requires data to include the Resource ID of an Azure resource. Data for non-Azure resources and custom tables. In this case, you may need to configure table-level access.  


- **If you do not require granular access control**, use a single workspace with an access control mode of *Require workspace permissions*.
- **If you require granular access control by resource**, use a single workspace with an access control mode of *Use resource or workspace permissions*. 
- **If you require granular access control by table**, use a single workspace with an access control mode of *Require workspace permissions*.
- **If you require access control for non-Azure resources and need more granular control than table-level**, create a separate workspace with *Require workspace permissions* for the unique data.


### Legacy agent limitations<a name="legacy-agent-limitations"></a>
While you should typically avoid sending duplicate data to multiple workspaces, there may be cases where virtual machines should send to multiple workspaces. A common example is when you separate your operational data and security data in separate workspaces. In this case, you must be be aware of any limitations of the agents used by your virtual machines.

Virtual machines using the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) can send data to any number of workspaces. The [Log Analytics agents](../agents/log-analytics-agent.md) has the following limitations:

- The Windows agent can report up to four workspaces.
- The Linux agent does not support multi-homing and can only report to a single workspace.
## Next steps

- Get additional details for workspace design specific to Azure Sentinel.
- Learn more about designing and configuring data access in a workspace.