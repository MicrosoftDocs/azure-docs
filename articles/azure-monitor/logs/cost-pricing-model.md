---
title: Azure Monitor Logs pricing model
description: Learn how to change the pricing plan and manage data volume and retention policy for your Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Azure Monitor Logs pricing model


## Pricing model

The default pricing for Log Analytics is a **Pay-As-You-Go** model that's based on ingested data volume and, optionally, for longer data retention. Data volume is measured as the size of the data that will be stored in GB (10^9 bytes). Each Log Analytics workspace is charged as a separate service and contributes to the bill for your Azure subscription. The amount of data ingestion can be considerable, depending on the following factors: 

  - The set of management solutions enabled and their configuration
  - The number and type of monitored resources
  - Type of data collected from each monitored resource
  
## Commitment Tiers
In addition to the Pay-As-You-Go model, Log Analytics has **Commitment Tiers**, which can save you as much as 30 percent compared to the Pay-As-You-Go price. With the commitment tier pricing, you can commit to buy data ingestion starting at 100 GB/day at a lower price than Pay-As-You-Go pricing. Any usage above the commitment level (overage) is billed at that same price per GB as provided by the current commitment tier. The commitment tiers have a 31-day commitment period from the time a commitment tier is selected. 

- During the commitment period, you can change to a higher commitment tier (which restarts the 31-day commitment period), but you can't move back to Pay-As-You-Go or to a lower commitment tier until after you finish the commitment period. 
- At the end of the commitment period, the workspace retains the selected commitment tier, and the workspace can be moved to Pay-As-You-Go or to a different commitment tier at any time. 
 
Billing for the commitment tiers is done on a daily basis. [Learn more](https://azure.microsoft.com/pricing/details/monitor/) about Log Analytics Pay-As-You-Go and Commitment Tier pricing. 


> [!NOTE]
> Starting June 2, 2021, **Capacity Reservations** are now called **Commitment Tiers**. Data collected above your commitment tier level (overage) is now billed at the same price-per-GB as the current commitment tier level, lowering costs compared to the old method of billing at the Pay-As-You-Go rate, and reducing the need for users with large data volumes to fine-tune their commitment level. Three new commitment tiers were also added: 1000, 2000, and 5000 GB/day. 


## Data size calculation
In all pricing tiers, an event's data size is calculated from a string representation of the properties that are stored in the Log Analytics workspace for this event, regardless of whether the data is sent from an agent or added during the ingestion process. This includes any [custom fields](custom-fields.md) that are added as data is collected and then stored in the workspace. 

### Excluded columns
The following [standard columns](log-standard-columns.md) that are common to all tables, are excluded in the calculation of the event size. All other columns stored in Log Analytics are included in the calculation of the event size.

- `_ResourceId`
- `_SubscriptionId`
- `_ItemId`
- `_IsBillable`
- `_BilledSize`
- `Type`

To determine whether an event was excluded from billing for data ingestion, you can use the [_IsBillable](log-standard-columns.md#_isbillable) property as shown [below](#data-volume-for-specific-events). Usage is reported in GB (10^9 bytes). 

### Excluded tables
The following tables are free from data ingestion charges altogether.

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)
- [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat)
- [Usage](/azure/azure-monitor/reference/tables/usage)
- [Operation](/azure/azure-monitor/reference/tables/operation) types

### Charges for other solutions and services
Some solutions have more solution-specific policies about free data ingestion, for instance [Azure Migrate](https://azure.microsoft.com/pricing/details/azure-migrate/) makes dependency visualization data free for the first 180-days of a Server Assessment. Services such as [Microsoft Defender for Cloud](https://azure.microsoft.com/pricing/details/azure-defender/), [Microsoft Sentinel](https://azure.microsoft.com/pricing/details/azure-sentinel/), and [Configuration management](https://azure.microsoft.com/pricing/details/automation/) have their own pricing models. 

See the documentation for different services and solutions for any unique billing calculations.

## Azure Monitor Logs Dedicated Clusters

[Azure Monitor Logs Dedicated Clusters](logs-dedicated-clusters.md) are collections of workspaces in a single managed Azure Data Explorer cluster to support advanced scenarios, like [Customer-Managed Keys](customer-managed-keys.md). Dedicated clusters use the same commitment tier pricing model as workspaces, except that a cluster must have a commitment level of at least 500 GB/day. There is no Pay-As-You-Go option for clusters. The cluster commitment tier has a 31-day commitment period after the commitment level is increased. During the commitment period, the commitment tier level can't be reduced, but it can be increased at any time. When workspaces are associated to a cluster, the data ingestion billing for those workspaces is done at the cluster level using the configured commitment tier level. Learn more about [creating a Log Analytics Clusters](customer-managed-keys.md#create-cluster) and [associating workspaces to it](customer-managed-keys.md#link-workspace-to-cluster). 

The cluster commitment tier level is programmatically configured with Azure Resource Manager using the `Capacity` parameter under `Sku`. The `Capacity` is specified in units of GB and can have values of 500, 1000, 2000 or 5000 GB/day. Any usage above the commitment level (overage) is billed at that same price per GB as provided by the current commitment tier.  For more information, see [Azure Monitor customer-managed key](customer-managed-keys.md).

There are two modes of billing for usage on a cluster. These can be specified by the `billingType` parameter when [creating a cluster](logs-dedicated-clusters.md#create-a-dedicated-cluster) or set after creation.  

- **Cluster (default)**: Billing for ingested data is done at the cluster level. The ingested data quantities from each workspace associated to a cluster are aggregated to calculate the daily bill for the cluster. Per-node allocations from [Microsoft Defender for Cloud](../../security-center/index.yml) are applied at the workspace level prior to this aggregation of aggregated data across all workspaces in the cluster. 

- **Workspaces**: Commitment tier costs for your cluster are attributed proportionately to the workspaces in the cluster, by each workspace's data ingestion volume (after accounting for per-node allocations from [Microsoft Defender for Cloud](../../security-center/index.yml) for each workspace.) If the total data volume ingested into a cluster for a day is less than the commitment tier, each workspace is billed for its ingested data at the effective per-GB commitment tier rate by billing them a fraction of the commitment tier, and the unused part of the commitment tier is billed to the cluster resource. If the total data volume ingested into a cluster for a day is more than the commitment tier, each workspace is billed for a fraction of the commitment tier, based on its fraction of the ingested data that day and each workspace for a fraction of the ingested data above the commitment tier. If the total data volume ingested into a workspace for a day is above the commitment tier, nothing is billed to the cluster resource.

In cluster billing options, data retention is billed for each workspace. Cluster billing starts when the cluster is created, regardless of whether workspaces are associated with the cluster. Workspaces associated to a cluster no longer have their own pricing tier.

## Log Analytics and Microsoft Defender for Cloud

[Microsoft Defender for Servers (part of Defender for Cloud)](../../security-center/index.yml) billing is closely tied to Log Analytics billing. Microsoft Defender for Servers [bills by the number of monitored services](https://azure.microsoft.com/pricing/details/azure-defender/) and provides 500 MB/server/day data allocation that is applied to the following subset of [security data types](/azure/azure-monitor/reference/tables/tables-category#security) (WindowsEvent, SecurityAlert, SecurityBaseline, SecurityBaselineSummary, SecurityDetection, SecurityEvent, WindowsFirewall, MaliciousIPCommunication, LinuxAuditLog, SysmonEvent, ProtectionStatus) and the Update and UpdateSummary data types when the Update Management solution isn't running on the workspace or solution targeting is enabled ([learn more](../../security-center/security-center-pricing.md#what-data-types-are-included-in-the-500-mb-data-daily-allowance)). The count of monitored servers is calculated on an hourly granularity. The daily data allocation contributions from each monitored server are aggregated at the workspace level. If the workspace is in the legacy Per Node pricing tier, the Microsoft Defender for Cloud and Log Analytics allocations are combined and applied jointly to all billable ingested data.  

To view the daily Defender for Servers data allocations for a workspace, you need to [export your usage details](#viewing-log-analytics-usage-on-your-azure-bill), open the usage spreadsheet and filter the meter category to "Insight and Analytics".  You'll then see usage with the meter name "Data Included per Node" which has a zero price per GB.  The consumed quantity column will show the number of GBs of Defender for Cloud data allocation for the day. (If the workspace is in the legacy Per Node Log Analytics pricing tier, this meter will also include the data allocations from this Log Analytics pricing tier.) 

## Tracking pricing tier changes

Changes to a workspace's pricing pier are recorded in the [Activity Log](../essentials/activity-log.md) with events with an **Operation** of *Create Workspace*. The event's **Change history** tab will show the old and new pricing tiers in the  `properties.sku.name` row.  Click the **Activity Log** option from your workspace to see events scoped to a particular workspace. To monitor changes the pricing tier, you can create an alert for the *Create Workspace* operation. 

## Legacy pricing tiers

Subscriptions that contained a Log Analytics workspace or Application Insights resource on April 2, 2018, or are linked to an Enterprise Agreement that started before February 1, 2019 and is still active, will continue to have access to use the legacy pricing tiers: **Free Trial**, **Standalone (Per GB)**, and **Per Node (OMS)**. Workspaces in the Free Trial pricing tier will have daily data ingestion limited to 500 MB (except for security data types collected by [Microsoft Defender for Cloud](../../security-center/index.yml)) and the data retention is limited to seven days. The Free Trial pricing tier is intended only for evaluation purposes. No SLA is provided for the Free tier.  Workspaces in the Standalone or Per Node pricing tiers have user-configurable retention from 30 to 730 days.

Usage on the Standalone pricing tier is billed by the ingested data volume. It is reported in the **Log Analytics** service and the meter is named "Data Analyzed". 

The Per Node pricing tier charges per monitored VM (node) on an hour granularity. For each monitored node, the workspace is allocated 500 MB of data per day that's not billed. This allocation is calculated with hourly granularity and is aggregated at the workspace level each day. Data ingested above the aggregate daily data allocation is billed per GB as data overage. On your bill, the service will be **Insight and Analytics** for Log Analytics usage if the workspace is in the Per Node pricing tier. Usage is reported on three meters:

- **Node**: this is usage for the number of monitored nodes (VMs) in units of node months.
- **Data Overage per Node**: this is the number of GB of data ingested in excess of the aggregated data allocation.
- **Data Included per Node**: this is the amount of ingested data that was covered by the aggregated data allocation. This meter is also used when the workspace is in all pricing tiers to show the amount of data covered by the Microsoft Defender for Cloud.

> [!TIP]
> If your workspace has access to the **Per Node** pricing tier but you're wondering whether it would cost less in a Pay-As-You-Go tier, you can [use the query below](#evaluating-the-legacy-per-node-pricing-tier) to easily get a recommendation. 

Workspaces created before April 2016 can continue to use the **Standard** and **Premium** pricing tiers that have fixed data retention of 30 days and 365 days, respectively. New workspaces can't be created in the **Standard** or **Premium** pricing tiers, and if a workspace is moved out of these tiers, it can't be moved back. Data ingestion meters on your Azure bill for these legacy tiers are called "Data analyzed."

### Legacy pricing tiers and Microsoft Defender for Cloud

There are also some behaviors between the use of legacy Log Analytics tiers and how usage is billed for [Microsoft Defender for Cloud](../../security-center/index.yml). 

- If the workspace is in the legacy Standard or Premium tier, Microsoft Defender for Cloud is billed only for Log Analytics data ingestion, not per node.
- If the workspace is in the legacy Per Node tier, Microsoft Defender for Cloud is billed using the current [Microsoft Defender for Cloud node-based pricing model](https://azure.microsoft.com/pricing/details/security-center/). 
- In other pricing tiers (including commitment tiers), if Microsoft Defender for Cloud was enabled before June 19, 2017, Microsoft Defender for Cloud is billed only for Log Analytics data ingestion. Otherwise, Microsoft Defender for Cloud is billed using the current Microsoft Defender for Cloud node-based pricing model.

More details of pricing tier limitations are available at [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md#log-analytics-workspaces).

None of the legacy pricing tiers have regional-based pricing.  

> [!NOTE]
> To use the entitlements that come from purchasing OMS E1 Suite, OMS E2 Suite, or OMS Add-On for System Center, choose the Log Analytics *Per Node* pricing tier.


## Changing pricing tier

### Azure portal

To change the Log Analytics pricing tier of your workspace:

1. In the Azure portal, open **Usage and estimated costs** from your workspace; you'll see a list of each of the pricing tiers available to this workspace.

2. Review the estimated costs for each pricing tier. This estimate is based on the last 31 days of usage, so this cost estimate relies on the last 31 days being representative of your typical usage. In the example below, you can see how, based on the data patterns from the last 31 days, this workspace would cost less in the Pay-As-You-Go tier (#1) compared to the 100 GB/day commitment tier (#2).  

:::image type="content" source="media/manage-cost-storage/pricing-tier-estimated-costs.png" alt-text="Pricing tiers":::
    
3. After reviewing the estimated costs based on the last 31 days of usage, if you decide to change the pricing tier, select **Select**.  

### Azure Resource Manager
You can also [set the pricing tier via Azure Resource Manager](./resource-manager-workspace.md) using the `sku` object to set the pricing tier, and the `capacityReservationLevel` parameter if the pricing tier is `capacityresrvation`. (Learn more about [setting workspace properties via ARM](/azure/templates/microsoft.operationalinsights/2020-08-01/workspaces?tabs=json#workspacesku-object).) Here is a sample Azure Resource Manager template to set your workspace to a 300 GB/day commitment tier (in Resource Manager, it's called `capacityreservation`). 

```
{
  "$schema": https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#,
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "YourWorkspaceName",
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2020-08-01",
      "location": "yourWorkspaceRegion",
      "properties": {
                    "sku": {
                      "name": "capacityreservation",
                      "capacityReservationLevel": 300
                    }
      }
    }
  ]
}
```

To use this template in PowerShell, after [installing the Azure Az PowerShell module](/powershell/azure/install-az-ps), sign in to Azure using `Connect-AzAccount`, select the subscription containing your workspace using `Select-AzSubscription -SubscriptionId YourSubscriptionId`, and apply the template (saved in a file named template.json):

```
New-AzResourceGroupDeployment -ResourceGroupName "YourResourceGroupName" -TemplateFile "template.json"
```

To set the pricing tier to other values such as Pay-As-You-Go (called `pergb2018` for the SKU), omit the `capacityReservationLevel` property. Learn more about [creating ARM templates](../../azure-resource-manager/templates/template-tutorial-create-first-template.md),  [adding a resource to your template](../../azure-resource-manager/templates/template-tutorial-add-resource.md), and [applying templates](../resource-manager-samples.md). 
