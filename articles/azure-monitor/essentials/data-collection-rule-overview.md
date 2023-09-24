---
title: Data collection rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/08/2023
ms.reviewer: nikeist
ms.custom: references_regions
---

# Data collection rules in Azure Monitor
Data collection rules (DCRs) define the [data collection process in Azure Monitor](../essentials/data-collection.md). DCRs specify what data should be collected, how to transform that data, and where to send that data. Some DCRs will be created and managed by Azure Monitor to collect a specific set of data to enable insights and visualizations. You might also create your own DCRs to define the set of data required for other scenarios.

## View data collection rules
To view your DCRs in the Azure portal, select **Data Collection Rules** under **Settings** on the **Monitor** menu.

> [!NOTE]
> Although this view shows all DCRs in the specified subscriptions, selecting the **Create** button will create a data collection for Azure Monitor Agent. Similarly, this page will only allow you to modify DCRs for Azure Monitor Agent. For guidance on how to create and update DCRs for other workflows, see [Create a data collection rule](#create-a-data-collection-rule).

:::image type="content" source="media/data-collection-rule-overview/view-data-collection-rules.png" lightbox="media/data-collection-rule-overview/view-data-collection-rules.png" alt-text="Screenshot that shows DCRs in the Azure portal.":::

## Create a data collection rule
The following resources describe different scenarios for creating DCRs. In some cases, the DCR might be created for you. In other cases, you might need to create and edit it yourself.

| Scenario | Resources | Description |
|:---|:---|:---|
| Azure Monitor Agent | [Configure data collection for Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md) | Use the Azure portal to create a DCR that specifies events and performance counters to collect from a machine with Azure Monitor Agent. Then apply that rule to one or more virtual machines. Azure Monitor Agent will be installed on any machines that don't currently have it.  |
| | [Use Azure Policy to install Azure Monitor Agent and associate with a DCR](../agents/azure-monitor-agent-manage.md#use-azure-policy) | Use Azure Policy to install Azure Monitor Agent and associate one or more DCRs with any virtual machines or virtual machine scale sets as they're created in your subscription.
| Text logs | [Configure custom logs by using the Azure portal](../logs/tutorial-logs-ingestion-portal.md)<br>[Configure custom logs by using Azure Resource Manager templates and the REST API](../logs/tutorial-logs-ingestion-api.md)<br>[Configure text logs by using Azure Monitoring Agent](../agents/data-collection-text-log.md) | Send custom data by using a REST API or Agent. The API call connects to a data collection endpoint and specifies a DCR to use. The agent uses the DCR to configure the collection of data on a machine. The DCR specifies the target table and potentially includes a transformation that filters and modifies the data before it's stored in a Log Analytics workspace.  |
| Azure Event Hubs | [Ingest events from Azure Event Hubs to Azure Monitor Logs](../logs/ingest-logs-event-hub.md)| Collect data from multiple sources to an event hub and ingest the data you need directly into tables in one or more Log Analytics workspaces. This is a highly scalable method of collecting data from a wide range of sources with minimum configuration.|
| Workspace transformation | [Configure ingestion-time transformations by using the Azure portal](../logs/tutorial-workspace-transformations-portal.md)<br>[Configure ingestion-time transformations by using Azure Resource Manager templates and the REST API](../logs/tutorial-workspace-transformations-api.md) | Create a transformation for any supported table in a Log Analytics workspace. The transformation is defined in a DCR that's then associated with the workspace. It's applied to any data sent to that table from a legacy workload that doesn't use a DCR. |

## Work with data collection rules
To work with DCRs outside of the Azure portal, see the following resources:

| Method | Resources |
|:---|:---|
| API        | Directly edit the DCR in any JSON editor and then [install it by using the REST API](/rest/api/monitor/datacollectionrules). |
| CLI        | Create DCRs and associations with the [Azure CLI](https://github.com/Azure/azure-cli-extensions/blob/master/src/monitor-control-service/README.md). |
| PowerShell | Work with DCRs and associations with the following Azure PowerShell cmdlets:<br>[Get-AzDataCollectionRule](/powershell/module/az.monitor/get-azdatacollectionrule)<br>[New-AzDataCollectionRule](/powershell/module/az.monitor/new-azdatacollectionrule)<br>[Set-AzDataCollectionRule](/powershell/module/az.monitor/set-azdatacollectionrule)<br>[Update-AzDataCollectionRule](/powershell/module/az.monitor/update-azdatacollectionrule)<br>[Remove-AzDataCollectionRule](/powershell/module/az.monitor/remove-azdatacollectionrule)<br>[Get-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/get-azdatacollectionruleassociation)<br>[New-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/new-azdatacollectionruleassociation)<br>[Remove-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/remove-azdatacollectionruleassociation)

## Structure of a data collection rule
Data collection rules are formatted in JSON. Although you might not need to interact with them directly, there are scenarios where you might need to directly edit a DCR. For a description of this structure and the different elements used for different workflows, see [Data collection rule structure](data-collection-rule-structure.md).

## Permissions
When you use programmatic methods to create DCRs and associations, you require the following permissions:

| Built-in role | Scopes | Reason |
|:---|:---|:---|
| [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Create or edit DCRs, assign rules to the machine, deploy associations). |
| [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)<br>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, virtual machine scale sets</li><li>Azure Arc-enabled servers</li></ul> | Deploy agent extensions on the VM. |
| Any role that includes the action *Microsoft.Resources/deployments/** | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Deploy Azure Resource Manager templates. |

## Limits
For limits that apply to each DCR, see [Azure Monitor service limits](../service-limits.md#data-collection-rules).

## Supported regions
Data collection rules are available in all public regions where Log Analytics workspaces and the Azure Government and China clouds are supported. Air-gapped clouds aren't yet supported.

**Single region data residency** is a preview feature to enable storing customer data in a single region and is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and the Brazil South (Sao Paulo State) Region of the Brazil Geo. Single-region residency is enabled by default in these regions.

## Data resiliency and high availability
A rule gets created and stored in a particular region and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-paired-regions) within the same geography. The service is deployed to all three [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region. For this reason, it's a *zone-redundant service*, which further increases availability.

## Next steps

- [Read about the detailed structure of a data collection rule](data-collection-rule-structure.md)
- [Get details on transformations in a data collection rule](data-collection-transformations.md)
