---
title: Design a Log Analytics workspace architecture
description: The article describes the considerations and recommendations for customers preparing to deploy a workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 04/05/2023

---

# Design a Log Analytics workspace architecture

A single [Log Analytics workspace](log-analytics-workspace-overview.md) might be sufficient for many environments that use Azure Monitor and Microsoft Sentinel. But many organizations will create multiple workspaces to optimize costs and better meet different business requirements. This article presents a set of criteria for determining whether to use a single workspace or multiple workspaces. It also discusses the configuration and placement of those workspaces to meet your requirements while optimizing your costs.

> [!NOTE]
> This article discusses Azure Monitor and Microsoft Sentinel because many customers need to consider both in their design. Most of the decision criteria apply to both services. If you use only one of these services, you can ignore the other in your evaluation.

## Design strategy
Your design should always start with a single workspace to reduce the complexity of managing multiple workspaces and in querying data from them. There are no performance limitations from the amount of data in your workspace. Multiple services and data sources can send data to the same workspace. As you identify criteria to create more workspaces, your design should use the fewest number that will match your requirements.

Designing a workspace configuration includes evaluation of multiple criteria. But some of the criteria might be in conflict. For example, you might be able to reduce egress charges by creating a separate workspace in each Azure region. Consolidating into a single workspace might allow you to reduce charges even more with a commitment tier. Evaluate each of the criteria independently. Consider your requirements and priorities to determine which design will be most effective for your environment.

## Design criteria
The following table presents criteria to consider when you design your workspace architecture. The sections that follow describe the criteria.

| Criteria | Description |
|:---|:---|
| [Operational and security data](#operational-and-security-data) | You may choose to combine operational data from Azure Monitor in the same workspace as security data from Microsoft Sentinel or separate each into their own workspace. Combining them gives you better visibility across all your data, while your security standards might require separating them so that your security team has a dedicated workspace. You may also have cost implications to each strategy. |
| [Azure tenants](#azure-tenants) | If you have multiple Azure tenants, you'll usually create a workspace in each one. Several data sources can only send monitoring data to a workspace in the same Azure tenant. |
| [Azure regions](#azure-regions) | Each workspace resides in a particular Azure region. You might have regulatory or compliance requirements to store data in specific locations. |
| [Data ownership](#data-ownership) | You might choose to create separate workspaces to define data ownership. For example, you might create workspaces by subsidiaries or affiliated companies. | 
| [Split billing](#split-billing) | By placing workspaces in separate subscriptions, they can be billed to different parties. |
| [Data retention and archive](#data-retention-and-archive) | You can set different retention settings for each table in a workspace. You need a separate workspace if you require different retention settings for different resources that send data to the same tables. |
| [Commitment tiers](#commitment-tiers) | Commitment tiers allow you to reduce your ingestion cost by committing to a minimum amount of daily data in a single workspace. |
| [Legacy agent limitations](#legacy-agent-limitations) | Legacy virtual machine agents have limitations on the number of workspaces they can connect to. |
| [Data access control](#data-access-control) | Configure access to the workspace and to different tables and data from different resources. |
|[Reslience](#resilience)| To ensure that data in your workspace is available in the event of a region failure, you can ingest data into multiple workspaces in different regions.|

### Operational and security data
The decision whether to combine your operational data from Azure Monitor in the same workspace as security data from Microsoft Sentinel or separate each into their own workspace depends on your security requirements and the potential cost implications for your environment.

**Dedicated workspaces**
Creating dedicated workspaces for Azure Monitor and Microsoft Sentinel will allow you to segregate ownership of data between operational and security teams. This approach may also help to optimize costs since when Microsoft Sentinel is enabled in a workspace, all data in that workspace is subject to Microsoft Sentinel pricing even if it's operational data collected by Azure Monitor. 

A workspace with Microsoft Sentinel gets three months of free data retention instead of 31 days. This scenario typically results in higher costs for operational data in a workspace without Microsoft Sentinel. See [Azure Monitor Logs pricing details](cost-logs.md#workspaces-with-microsoft-sentinel).


**Combined workspace**
Combining your data from Azure Monitor and Microsoft Sentinel in the same workspace gives you better visibility across all of your data allowing you to easily combine both in queries and workbooks. If access to the security data should be limited to a particular team, you can use [table level RBAC](../logs/manage-access.md#set-table-level-read-access) to block particular users from tables with security data or limit users to accessing the workspace using [resource-context](../logs/manage-access.md#access-mode).

This configuration may result in cost savings if it helps you reach a [commitment tier](#commitment-tiers), which provides a discount to your ingestion charges. For example, consider an organization that has operational data and security data each ingesting about 50 GB per day. Combining the data in the same workspace would allow a commitment tier at 100 GB per day. That scenario would provide a 15% discount for Azure Monitor and a 50% discount for Microsoft Sentinel.

If you create separate workspaces for other criteria, you'll usually create more workspace pairs. For example, if you have two Azure tenants, you might create four workspaces with an operational and security workspace in each tenant.

- **If you use both Azure Monitor and Microsoft Sentinel:** Consider separating each in a dedicated workspace if required by your security team or if it results in a cost savings. Consider combining the two for better visibility of your combined monitoring data or if it helps you reach a commitment tier.
- **If you use both Microsoft Sentinel and Microsoft Defender for Cloud:** Consider using the same workspace for both solutions to keep security data in one place.

### Azure tenants
Most resources can only send monitoring data to a workspace in the same Azure tenant. Virtual machines that use [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) or the [Log Analytics agents](../agents/log-analytics-agent.md) can send data to workspaces in separate Azure tenants. You might consider this scenario as a [service provider](#multiple-tenant-strategies).

- **If you have a single Azure tenant:** Create a single workspace for that tenant.
- **If you have multiple Azure tenants:** Create a workspace for each tenant. For other options including strategies for service providers, see [Multiple tenant strategies](#multiple-tenant-strategies).

### Azure regions
Each Log Analytics workspace resides in a [particular Azure region](https://azure.microsoft.com/global-infrastructure/geographies/). You might have regulatory or compliance purposes for keeping data in a particular region. For example, an international company might locate a workspace in each major geographical region, such as the United States and Europe.

- **If you have requirements for keeping data in a particular geography:** Create a separate workspace for each region with such requirements.
- **If you don't have requirements for keeping data in a particular geography:** Use a single workspace for all regions.

Also consider potential [bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/) that might apply when you're sending data to a workspace from a resource in another region. These charges are usually minor relative to data ingestion costs for most customers. These charges typically result from sending data to the workspace from a virtual machine. Monitoring data from other Azure resources by using [diagnostic settings](../essentials/diagnostic-settings.md) doesn't [incur egress charges](../cost-usage.md#data-transfer-charges).

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator) to estimate the cost and determine which regions you need. Consider workspaces in multiple regions if bandwidth charges are significant.

- **If bandwidth charges are significant enough to justify the extra complexity:** Create a separate workspace for each region with virtual machines.
- **If bandwidth charges aren't significant enough to justify the extra complexity:** Use a single workspace for all regions.

### Data ownership
You might have a requirement to segregate data or define boundaries based on ownership. For example, you might have different subsidiaries or affiliated companies that require delineation of their monitoring data.

- **If you require data segregation:** Use a separate workspace for each data owner.
- **If you don't require data segregation:** Use a single workspace for all data owners.

### Split billing
You might need to split billing between different parties or perform charge back to a customer or internal business unit. You can use [Azure Cost Management + Billing](../cost-usage.md#azure-cost-management--billing) to view charges by workspace. You can also use a log query to view [billable data volume by Azure resource, resource group, or subscription](analyze-usage.md#data-volume-by-azure-resource-resource-group-or-subscription). This approach might be sufficient for your billing requirements.

- **If you don't need to split billing or perform charge back:** Use a single workspace for all cost owners.
- **If you need to split billing or perform charge back:** Consider whether [Azure Cost Management + Billing](../cost-usage.md#azure-cost-management--billing) or a log query provides cost reporting that's granular enough for your requirements. If not, use a separate workspace for each cost owner.

### Data retention and archive
You can configure default [data retention and archive settings](data-retention-archive.md) for a workspace or [configure different settings for each table](data-retention-archive.md#configure-retention-and-archive-at-the-table-level). You might require different settings for different sets of data in a particular table. If so, you need to separate that data into different workspaces, each with unique retention settings.

- **If you can use the same retention and archive settings for all data in each table:** Use a single workspace for all resources.
- **If you require different retention and archive settings for different resources in the same table:** Use a separate workspace for different resources.

### Commitment tiers
[Commitment tiers](../logs/cost-logs.md#commitment-tiers) provide a discount to your workspace ingestion costs when you commit to a specific amount of daily data. You might choose to consolidate data in a single workspace to reach the level of a particular tier. This same volume of data spread across multiple workspaces wouldn't be eligible for the same tier, unless you have a dedicated cluster.

If you can commit to daily ingestion of at least 500 GB per day, you should implement a [dedicated cluster](../logs/cost-logs.md#dedicated-clusters) that provides extra functionality and performance. Dedicated clusters also allow you to combine the data from multiple workspaces in the cluster to reach the level of a commitment tier.

- **If you'll ingest at least 500 GB per day across all resources:** Create a dedicated cluster and set the appropriate commitment tier.
- **If you'll ingest at least 100 GB per day across resources:** Consider combining them into a single workspace to take advantage of a commitment tier.

### Legacy agent limitations
You should avoid sending duplicate data to multiple workspaces because of the extra charges, but you might have virtual machines connected to multiple workspaces. The most common scenario is an agent connected to separate workspaces for Azure Monitor and Microsoft Sentinel.

 [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) and the [Log Analytics agent for Windows](../agents/log-analytics-agent.md) can connect to multiple workspaces. The [Log Analytics agent for Linux](../agents/log-analytics-agent.md) can only connect to a single workspace.

- **If you use the Log Analytics agent for Linux:** Migrate to [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) or ensure that your Linux machines only require access to a single workspace.

### Data access control
When you grant a user [access to a workspace](manage-access.md#azure-rbac), the user has access to all data in that workspace. This access is appropriate for a member of a central administration or security team who must access data for all resources. Access to the workspace is also determined by resource-context role-based access control (RBAC) and table-level RBAC.

[Resource-context RBAC](manage-access.md#access-mode): By default, if a user has read access to an Azure resource, they inherit permissions to any of that resource's monitoring data sent to the workspace. This level of access allows users to access information about resources they manage without being granted explicit access to the workspace. If you need to block this access, you can change the [access control mode](manage-access.md#access-control-mode) to require explicit workspace permissions.

- **If you want users to be able to access data for their resources:** Keep the default access control mode of **Use resource or workspace permissions**.
- **If you want to explicitly assign permissions for all users:** Change the access control mode to **Require workspace permissions**.

[Table-level RBAC](manage-access.md#set-table-level-read-access): With table-level RBAC, you can grant or deny access to specific tables in the workspace. In this way, you can implement granular permissions required for specific situations in your environment.

For example, you might grant access to only specific tables collected by Microsoft Sentinel to an internal auditing team. Or you might deny access to security-related tables to resource owners who need operational data related to their resources.

- **If you don't require granular access control by table:** Grant the operations and security team access to their resources and allow resource owners to use resource-context RBAC for their resources.
- **If you require granular access control by table:** Grant or deny access to specific tables by using table-level RBAC.

### Resilience

To ensure that critical data in your workspace is available in the event of a region failure, you can ingest some or all of your data into multiple workspaces in different regions.

This option requires managing integration with other services and products separately for each workspace. Even though the data will be available in the alternate workspace in case of failure, resources that rely on the data, such as alerts and workbooks, won't know to switch over to the alternate workspace. Consider storing ARM templates for critical resources with configuration for the alternate workspace in Azure DevOps, or as disabled policies that can quickly be enabled in a failover scenario.

## Work with multiple workspaces
Many designs will include multiple workspaces, so Azure Monitor and Microsoft Sentinel include features to assist you in analyzing this data across workspaces. For more information, see:

- [Create a log query across multiple workspaces and apps in Azure Monitor](cross-workspace-query.md)
- [Extend Microsoft Sentinel across workspaces and tenants](../../sentinel/extend-sentinel-across-workspaces-tenants.md)

## Multiple tenant strategies
Environments with multiple Azure tenants, including Microsoft service providers (MSPs), independent software vendors (ISVs), and large enterprises, often require a strategy where a central administration team has access to administer workspaces located in other tenants. Each of the tenants might represent separate customers or different business units.

> [!NOTE]
> For partners and service providers who are part of the [Cloud Solution Provider (CSP) program](https://partner.microsoft.com/membership/cloud-solution-provider), Log Analytics in Azure Monitor is one of the Azure services available in Azure CSP subscriptions.

Two basic strategies for this functionality are described in the following sections.

### Distributed architecture
In a distributed architecture, a Log Analytics workspace is created in each Azure tenant. This option is the only one you can use if you're monitoring Azure services other than virtual machines.

There are two options to allow service provider administrators to access the workspaces in the customer tenants:

- Use [Azure Lighthouse](../../lighthouse/overview.md) to access each customer tenant. The service provider administrators are included in a Microsoft Entra user group in the service provider's tenant. This group is granted access during the onboarding process for each customer. The administrators can then access each customer's workspaces from within their own service provider tenant instead of having to sign in to each customer's tenant individually. For more information, see [Monitor customer resources at scale](../../lighthouse/how-to/monitor-at-scale.md).
- Add individual users from the service provider as [Microsoft Entra guest users (B2B)](../../active-directory/external-identities/what-is-b2b.md). The customer tenant administrators manage individual access for each service provider administrator. The service provider administrators must sign in to the directory for each tenant in the Azure portal to access these workspaces.

Advantages to this strategy:

- Logs can be collected from all types of resources.
- The customer can confirm specific levels of permissions with [Azure delegated resource management](../../lighthouse/concepts/architecture.md). Or the customer can manage access to the logs by using their own [Azure RBAC](../../role-based-access-control/overview.md).
- Each customer can have different settings for their workspace, such as retention and data cap.
- Isolation between customers for regulatory and compliance.
- The charge for each workspace is included in the bill for the customer's subscription.

Disadvantages to this strategy:

- Centrally visualizing and analyzing data across customer tenants with tools such as Azure Monitor workbooks can result in slower experiences. This is the case especially when analyzing data across more than 50 workspaces.
- If customers aren't onboarded for Azure delegated resource management, service provider administrators must be provisioned in the customer directory. This requirement makes it more difficult for the service provider to manage many customer tenants at once.

### Centralized
A single workspace is created in the service provider's subscription. This option can only collect data from customer virtual machines. Agents installed on the virtual machines are configured to send their logs to this central workspace.

Advantages to this strategy:

- It's easy to manage many customers.
- The service provider has full ownership over the logs and the various artifacts, such as functions and saved queries.
- A service provider can perform analytics across all of its customers.

Disadvantages to this strategy:

- Logs can only be collected from virtual machines with an agent. It won't work with PaaS, SaaS, or Azure Service Fabric data sources.
- It might be difficult to separate data between customers because their data shares a single workspace. Queries need to use the computer's fully qualified domain name or the Azure subscription ID.
- All data from all customers will be stored in the same region with a single bill and the same retention and configuration settings.

### Hybrid
In a hybrid model, each tenant has its own workspace. A mechanism is used to pull data into a central location for reporting and analytics. This data could include a small number of data types or a summary of the activity, such as daily statistics.

There are two options to implement logs in a central location:

- **Central workspace**: The service provider creates a workspace in its tenant and uses a script that utilizes the [Query API](api/overview.md) with the [logs ingestion API](logs-ingestion-api-overview.md) to bring the data from the tenant workspaces to this central location. Another option is to use [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) to copy data to the central workspace.
- **Power BI**: The tenant workspaces export data to Power BI by using the integration between the [Log Analytics workspace and Power BI](log-powerbi.md).

## Next steps

- Learn more about [designing and configuring data access in a workspace](manage-access.md).
- Get [sample workspace architectures for Microsoft Sentinel](../../sentinel/sample-workspace-designs.md).
