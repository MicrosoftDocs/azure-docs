---
title: Data Collection Rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
ms.date: 07/15/2022
ms.reviewer: nikeist
ms.custom: references_regions
---

# Data collection rules in Azure Monitor
Data Collection Rules (DCRs) define the [data collection process in Azure Monitor](../essentials/data-collection.md). DCRs specify what data should be collected, how to transform that data, and where to send that data. Some DCRs will be created and managed by Azure Monitor to collect a specific set of data to enable insights and visualizations. You may also create your own DCRs to define the set of data required for other scenarios.


## View data collection rules
To view your data collection rules in the Azure portal, select **Data Collection Rules** from the **Monitor** menu.

> [!NOTE]
> While this view shows all data collection rules in the specified subscriptions, clicking the **Create** button will create a data collection for Azure Monitor agent. Similarly, this page will only allow you to modify data collection rules for the Azure Monitor agent. See [Creating a data collection rule](#create-a-data-collection-rule) below for guidance on creating and updating data collection rules for other workflows.

:::image type="content" source="media/data-collection-rule-overview/view-data-collection-rules.png" lightbox="media/data-collection-rule-overview/view-data-collection-rules.png" alt-text="Screenshot of data collection rules in the Azure portal.":::

## Create a data collection rule
The following resources describe different scenarios for creating data collection rules. In some cases, the data collection rule may be created for you, while in others you may need to create and edit it yourself. 

| Scenario | Resources | Description |
|:---|:---|:---|
| Azure Monitor agent | [Configure data collection for the Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md) | Use the Azure portal to create a data collection rule that specifies events and performance counters to collect from a machine with the Azure Monitor agent and then apply that rule to one or more virtual machines. The Azure Monitor agent will be installed on any machines that don't currently have it.  |
| | [Use Azure Policy to install Azure Monitor agent and associate with DCR](../agents/azure-monitor-agent-manage.md#use-azure-policy) | Use Azure Policy to install the Azure Monitor agent and associate one or more data collection rules with any virtual machines or virtual machine scale sets as they're created in your subscription.
| Custom logs | [Configure custom logs using the Azure portal](../logs/tutorial-logs-ingestion-portal.md)<br>[Configure custom logs using Resource Manager templates and REST API](../logs/tutorial-logs-ingestion-api.md) | Send custom data using a REST API. The API call connects to a DCE and specifies a DCR to use. The DCR specifies the target table and potentially includes a transformation that filters and modifies the data before it's stored in a Log Analytics workspace.  |
| Workspace transformation | [Configure ingestion-time transformations using the Azure portal](../logs/tutorial-workspace-transformations-portal.md)<br>[Configure ingestion-time transformations using Resource Manager templates and REST API](../logs/tutorial-workspace-transformations-api.md) | Create a transformation for any supported table in a Log Analytics workspace. The transformation is defined in a DCR that's then associated with the workspace and applied to any data sent to that table from a legacy workload that doesn't use a DCR. |

##  Work with data collection rules
See the following resources for working with data collection rules outside of the Azure portal.

| Method | Resources |
|:---|:---|
| API        | Directly edit the data collection rule in any JSON editor and then [install using the REST API](/rest/api/monitor/datacollectionrules). |
| CLI        | Create DCR and associations with [Azure CLI](https://github.com/Azure/azure-cli-extensions/blob/master/src/monitor-control-service/README.md). |
| PowerShell | Work with DCR and associations with the following Azure PowerShell cmdlets.<br>[Get-AzDataCollectionRule](/powershell/module/az.monitor/get-azdatacollectionrule)<br>[New-AzDataCollectionRule](/powershell/module/az.monitor/new-azdatacollectionrule)<br>[Set-AzDataCollectionRule](/powershell/module/az.monitor/set-azdatacollectionrule)<br>[Update-AzDataCollectionRule](/powershell/module/az.monitor/update-azdatacollectionrule)<br>[Remove-AzDataCollectionRule](/powershell/module/az.monitor/remove-azdatacollectionrule)<br>[Get-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/get-azdatacollectionruleassociation)<br>[New-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/new-azdatacollectionruleassociation)<br>[Remove-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/remove-azdatacollectionruleassociation)




## Structure of a data collection rule
Data collection rules are formatted in JSON. While you may not need to interact with them directly, there are scenarios where you may need to directly edit a data collection rule. See [Data collection rule structure](data-collection-rule-structure.md) for a description of this structure and the different elements used for different workflows.

## Permissions 
When using programmatic methods to create data collection rules and associations, you require the following permissions:  

| Built-in Role | Scope(s) | Reason |  
|:---|:---|:---|  
| [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing data collection rule</li></ul> | Create or edit data collection rules |
| [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)<br>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, virtual machine scale sets</li><li>Arc-enabled servers</li></ul> | Deploy associations (i.e. to assign rules to the machine) |
| Any role that includes the action *Microsoft.Resources/deployments/** | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing data collection rule</li></ul> | Deploy ARM templates |

## Limits
For limits that apply to each data collection rule, see [Azure Monitor service limits](../service-limits.md#data-collection-rules).


## Supported regions
Data collection rules are available in all public regions where Log Analytics workspace are supported, as well as the Azure Government and China clouds. Air-gapped clouds are not yet supported.

**Single region data residency** is a preview feature to enable storing customer data in a single region and is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and Brazil South (Sao Paulo State) Region of Brazil Geo. Single region residency is enabled by default in these regions.


## Data resiliency and high availability
A rule gets created and stored in a particular region and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies) within the same geography. The service is deployed to all three [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region, making it a **zone-redundant service** which further increases availability.


## Next steps

- [Read about the detailed structure of a data collection rule.](data-collection-rule-structure.md)
- [Get details on transformations in a data collection rule.](data-collection-transformations.md)
