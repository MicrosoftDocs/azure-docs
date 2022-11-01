---
title: Design a Log Analytics workspace architecture
description: Describes the considerations and recommendations for customers preparing to deploy a workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 05/25/2022

---

# Design a Log Analytics workspace architecture
While a single [Log Analytics workspace](log-analytics-workspace-overview.md) may be sufficient for many environments using Azure Monitor and Microsoft Sentinel, many organizations will create multiple workspaces to optimize costs and better meet different business requirements. This article presents a set of criteria for determining whether to use a single workspace or multiple workspaces and the configuration and placement of those workspaces to meet your particular requirements while optimizing your costs.

> [!NOTE]
> This article includes both Azure Monitor and Microsoft Sentinel since many customers need to consider both in their design, and most of the decision criteria applies to both. If you only use one of these services, then you can simply ignore the other in your evaluation.

## Design strategy
Your design should always start with a single workspace since this reduces the complexity of managing multiple workspaces and in querying data from them. There are no performance limitations from the amount of data in your workspace, and multiple services and data sources can send data to the same workspace. As you identify criteria to create additional workspaces, your design should use the fewest number that will match your particular requirements.

Designing a workspace configuration includes evaluation of multiple criteria, some of which may be in conflict. For example, you may be able to reduce egress charges by creating a separate workspace in each Azure region, but consolidating into a single workspace might allow you to reduce charges even more with a commitment tier. Evaluate each of the criteria below independently and consider your particular requirements and priorities in determining which design will be most effective for your particular environment.


## Design criteria
The following table briefly presents the criteria that you should consider in designing your workspace architecture. The sections below describe each of these criteria in full detail.

| Criteria | Description |
|:---|:---|
| [Segregate operational and security data](#segregate-operational-and-security-data) | Many customers will create separate workspaces for their operational and security data for data ownership and the additional cost from Microsoft Sentinel. In some cases though, you may be able to save cost by consolidating into a single workspace to qualify for a commitment tier. |
| [Azure tenants](#azure-tenants) | If you have multiple Azure tenants, you'll usually create a workspace in each because several data sources can only send monitoring data to a workspace in the same Azure tenant. |
| [Azure regions](#azure-regions) | Each workspace resides in a particular Azure region, and you may have regulatory or compliance requirements to store data in particular locations. |
| [Data ownership](#data-ownership) | You may choose to create separate workspaces to define data ownership, for example by subsidiaries or affiliated companies. | 
| [Split billing](#split-billing) | By placing workspaces in separate subscriptions, they can be billed to different parties. |
| [Data retention and archive](#data-retention-and-archive) | You can set different retention settings for each table in a workspace, but you need a separate workspace if you require different retention settings for different resources that send data to the same tables. |
| [Commitment tiers](#commitment-tiers) | Commitment tiers allow you to reduce your ingestion cost by committing to a minimum amount of daily data in a single workspace. |
| [Legacy agent limitations](#legacy-agent-limitations) | Legacy virtual machine agents have limitations on the number of workspaces they can connect to. |
| [Data access control](#data-access-control) | Configure access to the workspace and to different tables and data from different resources. |

### Segregate operational and security data
Most customers who use both Azure Monitor and Microsoft Sentinel will create a dedicated workspace for each to segregate ownership of data between your operational and security teams and also to optimize costs. If Microsoft Sentinel is enabled in a workspace, then all data in that workspace is subject to Sentinel pricing, even if it's operational data collected by Azure Monitor. While a workspace with Sentinel gets 3 months of free data retention instead of 31 days, this will typically result in higher cost for operational data in a workspace without Sentinel. See [Azure Monitor Logs pricing details](cost-logs.md#workspaces-with-microsoft-sentinel).

The exception is if combining data in the same workspace helps you reach a [commitment tier](#commitment-tiers), which provides a discount to your ingestion charges. For example, consider an organization that has operational data and security data each ingesting about 50 GB per day. Combining the data in the same workspace would allow a commitment tier at 100 GB per day that would provide a 15% discount for Azure Monitor and 50% discount for Sentinel.

If you create separate workspaces for other criteria then you'll usually create additional workspace pairs. For example, if you have two Azure tenants, you may create four workspaces - an operational and security workspace in each tenant.


- **If you use both Azure Monitor and Microsoft Sentinel**, create a separate workspace for each. Consider combining the two if it helps you reach a commitment tier.
- **If you use both Microsoft Sentinel and Microsoft Defender for Cloud**, consider using the same workspace for both solutions to keep security data in one place.


### Azure tenants
Most resources can only send monitoring data to a workspace in the same Azure tenant. Virtual machines using the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) or the [Log Analytics agents](../agents/log-analytics-agent.md) can send data to workspaces in separate Azure tenants, which may be a scenario that you consider as a [service provider](#multiple-tenant-strategies).

- **If you have a single Azure tenant**, then create a single workspace for that tenant.
- **If you have multiple Azure tenants**, then create a workspace for each tenant. See [Multiple tenant strategies](#multiple-tenant-strategies) for other options including strategies for service providers.
 
### Azure regions
Log Analytics workspaces each reside in a [particular Azure region](https://azure.microsoft.com/global-infrastructure/geographies/), and you may have regulatory or compliance purposes for keeping data in a particular region. For example, an international company might locate a workspace in each major geographical region, such as United States and Europe.

- **If you have requirements for keeping data in a particular geography**, create a separate workspace for each region with such requirements.
- **If you do not have requirements for keeping data in a particular geography**, use a single workspace for all regions.

You should also consider potential [bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/) that may apply when sending data to a workspace from a resource in another region, although these charges are usually minor relative to data ingestion costs for most customers. These charges will typically result from sending data to the workspace from a virtual machine. Monitoring data from other Azure resources using [diagnostic settings](../essentials/diagnostic-settings.md) does not [incur egress charges](../usage-estimated-costs.md#data-transfer-charges).

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator) to estimate the cost and determine which regions you actually need. Consider workspaces in multiple regions if bandwidth charges are significant.


- **If bandwidth charges are significant enough to justify the additional complexity**, create a separate workspace for each region with virtual machines.
- **If bandwidth charges are not significant enough to justify the additional complexity**, use a single workspace for all regions.


### Data ownership
You may have a requirement to segregate data or define boundaries based on ownership. For example, you may have different subsidiaries or affiliated companies that require delineation of their monitoring data. 

- **If you require data segregation**, use a separate workspace for each data owner.
- **If you do not require data segregation**, use a single workspace for all data owners.

### Split billing
You may need to split billing between different parties or perform charge back to a customer or internal business unit. [Azure Cost Management + Billing](../usage-estimated-costs.md#azure-cost-management--billing) allows you to view charges by workspace. You can also use a log query to view [billable data volume by Azure resource, resource group, or subscription](analyze-usage.md#data-volume-by-azure-resource-resource-group-or-subscription), which may be sufficient for your billing requirements.

- **If you do not need to split billing or perform charge back**, use a single workspace for all cost owners.
- **If you need to split billing or perform charge back**, consider whether [Azure Cost Management + Billing](../usage-estimated-costs.md#azure-cost-management--billing) or a log query provides granular enough cost reporting for your requirements. If not, use a separate workspace for each cost owner.

### Data retention and archive
You can configure default [data retention and archive settings](data-retention-archive.md) for a workspace or [configure different settings for each table](data-retention-archive.md#set-retention-and-archive-policy-by-table). You may require different settings for different sets of data in a particular table. If this is the case, then you would need to separate that data into different workspaces, each with unique retention settings.

- **If you can use the same retention and archive settings for all data in each table**, use a single workspace for all resources.
- **If you can require different retention and archive settings for different resources in the same table**, use a separate workspace for different resources.



### Commitment tiers
[Commitment tiers](../logs/cost-logs.md#commitment-tiers) provide a discount to your workspace ingestion costs when you commit to a particular amount of daily data. You may choose to consolidate data in a single workspace in order to reach the level of a particular tier. This same volume of data spread across multiple workspaces would not be eligible for the same tier, unless you have a dedicated cluster.

If you can commit to daily ingestion of at least 500 GB/day, then you should implement a [dedicated cluster](../logs/cost-logs.md#dedicated-clusters) which provides additional functionality and performance. Dedicated clusters also allow you to combine the data from multiple workspaces in the cluster to reach the level of a commitment tier.

- **If you will ingest at least 500 GB/day across all resources**, create a dedicated cluster and set the appropriate commitment tier.
- **If you will ingest at least 100 GB/day across resources**, consider combining them into a single workspace to take advantage of a commitment tier.



### Legacy agent limitations
While you should avoid sending duplicate data to multiple workspaces because of the additional charges, you may have virtual machines connected to multiple workspaces. The most common scenario is an agent connected to separate workspaces for Azure Monitor and Microsoft Sentinel.

 The [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and [Log Analytics agent for Windows](../agents/log-analytics-agent.md) can connect to multiple workspaces. The [Log Analytics agent for Linux](../agents/log-analytics-agent.md) though can only connect to a single workspace.

- **If you use the Log Analytics agent for Linux**, migrate to the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) or ensure that your Linux machines only require access to a single workspace.


### Data access control
When you grant a user [access to a workspace](manage-access.md#azure-rbac), they have access to all data in that workspace. This is appropriate for a member of a central administration or security team who must access data for all resources. Access to the workspace is also determined by resource-context RBAC and table-level RBAC.

[Resource-context RBAC](manage-access.md#access-mode)
By default, if a user has read access to an Azure resource, they inherit permissions to any of that resource's monitoring data sent to the workspace. This allows users to access information about resources they manage without being granted explicit access to the workspace. If you need to block this access, you can change the [access control mode](manage-access.md#access-control-mode) to require explicit workspace permissions.

- **If you want users to be able to access data for their resources**, keep the default access control mode of *Use resource or workspace permissions*.
- **If you want to explicitly assign permissions for all users**, change the access control mode to *Require workspace permissions*.


[Table-level RBAC](manage-access.md#set-table-level-read-access)
With table-level RBAC, you can grant or deny access to specific tables in the workspace. This allows you to implement granular permissions required for specific situations in your environment.

For example, you might grant access to only specific tables collected by Sentinel to an internal auditing team. Or you might deny access to security related tables to resource owners who need operational data related to their resources.

- **If you don't require granular access control by table**, grant the operations and security team access to their resources and allow resource owners to use resource-context RBAC for their resources.
- **If you require granular access control by table**, grant or deny access to specific tables using table-level RBAC.


## Working with multiple workspaces
Since many designs will include multiple workspaces, Azure Monitor and Microsoft Sentinel include features to assist you in analyzing this data across workspaces. For details, see the following:

- [Create a log query across multiple workspaces and apps in Azure Monitor](cross-workspace-query.md)
- [Extend Microsoft Sentinel across workspaces and tenants](../../sentinel/extend-sentinel-across-workspaces-tenants.md).
## Multiple tenant strategies
Environments with multiple Azure tenants, including service providers (MSPs), independent software vendors (ISVs), and large enterprises, often require a strategy where a central administration team has access to administer workspaces located in other tenants. Each of the tenants may represent separate customers or different business units. 

> [!NOTE]
> For partners and service providers who are part of the [Cloud Solution Provider (CSP) program](https://partner.microsoft.com/membership/cloud-solution-provider), Log Analytics in Azure Monitor is one of the Azure services available in Azure CSP subscriptions.

There are two basic strategies for this functionality as described below.

### Distributed architecture
In a distributed architecture, a Log Analytics workspace is created in each Azure tenant. This is the only option you can use if you're monitoring Azure services other than virtual machines.

There are two options to allow service provider administrators to access the workspaces in the customer tenants.


- Use [Azure Lighthouse](../../lighthouse/overview.md) to access each customer tenant. The service provider administrators are included in an Azure AD user group in the service provider’s tenant, and this group is granted access during the onboarding process for each customer. The administrators can then access each customer’s workspaces from within their own service provider tenant, rather than having to log into each customer’s tenant individually. For more information, see [Monitor customer resources at scale](../../lighthouse/how-to/monitor-at-scale.md).

- Add individual users from the service provider as [Azure Active Directory guest users (B2B)](../../active-directory/external-identities/what-is-b2b.md). The customer tenant administrators manage individual access for each service provider administrator, and the service provider administrators must log in to the directory for each tenant in the Azure portal to be able to access these workspaces. 


Advantages to this strategy are:

- Logs can be collected from all types of resources.
- The customer can confirm specific levels of permissions with [Azure delegated resource management](../../lighthouse/concepts/architecture.md), or can manage access to the logs using their own [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).
- Each customer can have different settings for their workspace such as retention and data cap.
- Isolation between customers for regulatory and compliance.
- The charge for each workspace in included in the bill for the customer's subscription.

Disadvantages to this strategy are:

- Centrally visualizing and analyzing data across customer tenants with tools such as Azure Monitor Workbooks can result in slower experiences, especially when analyzing data across more than 50 workspaces.
- If customers are not onboarded for Azure delegated resource management, service provider administrators must be provisioned in the customer directory. This makes it more difficult for the service provider to manage a large number of customer tenants at once.
### Centralized
A single workspace is created in the service provider's subscription. This option can only collect data from customer virtual machines. Agents installed on the virtual machines are configured to send their logs to this central workspace.

Advantages to this strategy are:

- Easy to manage a large number of customers.
- Service provider has full ownership over the logs and the various artifacts such as functions and saved queries.
- Service provider can perform analytics across all of its customers.

Disadvantages to this strategy are:

- Logs can only be collected from virtual machines with an agent. It will not work with PaaS, SaaS and Azure fabric data sources.
- It may be difficult to separate data between customers, since their data shares a single workspace. Queries need to use the computer's fully qualified domain name (FQDN) or the Azure subscription ID.
- All data from all customers will be stored in the same region with a single bill and same retention and configuration settings.


### Hybrid
In a hybrid model, each tenant has its own workspace, and some mechanism is used to pull data into a central location for reporting and analytics. This data could include a small number of data types or a summary of the activity such as daily statistics.

There are two options to implement logs in a central location:

- Central workspace. The service provider creates a workspace in its tenant and use a script that utilizes the [Query API](api/overview.md) with the [logs ingestion API](logs-ingestion-api-overview.md) to bring the data from the tenant workspaces to this central location. Another option is to use [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) to copy data to the central workspace.

- Power BI. The tenant workspaces export data to Power BI using the integration between the [Log Analytics workspace and Power BI](log-powerbi.md). 


## Next steps

- [Learn more about designing and configuring data access in a workspace.](manage-access.md)
- [Get sample workspace architectures for Microsoft Sentinel.](../../sentinel/sample-workspace-designs.md)
