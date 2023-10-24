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

# Create and edit data collection rules (DCRs) in Azure Monitor
There are multiple methods for creating a [data collection rule (DCR)](./data-collection-rule-overview.md) in Azure Monitor. In some cases, Azure Monitor will create and manage the DCR according to settings that you configure in the Azure portal. In other cases, you might need to create your own DCRs to customize particular scenarios.

This article describes the different methods for creating and editing a DCR. For the contents of the DCR itself, see [Structure of a data collection rule in Azure Monitor](./data-collection-rule-structure.md).

## Permissions
 You require the following permissions to create DCRs and associations:

| Built-in role | Scopes | Reason |
|:---|:---|:---|
| [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Create or edit DCRs, assign rules to the machine, deploy associations). |
| [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)<br>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, virtual machine scale sets</li><li>Azure Arc-enabled servers</li></ul> | Deploy agent extensions on the VM. |
| Any role that includes the action *Microsoft.Resources/deployments/** | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Deploy Azure Resource Manager templates. |

## Automated methods

| Scenario | Resources | Description |
|:---|:---|:---|
| Azure Monitor Agent | [Configure data collection for Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md) | Use the Azure portal to create a DCR that specifies events and performance counters to collect from a machine with Azure Monitor Agent. Then apply that rule to one or more virtual machines. Azure Monitor Agent will be installed on any machines that don't currently have it.  |
| Text logs | [Collect text logs with Azure Monitor Agent](../agents/data-collection-text-log.md?tabs=portal) | Create a DCR to collect entries from a text log.  |
| Workspace transformation | [Configure ingestion-time transformations by using the Azure portal](../logs/tutorial-workspace-transformations-portal.md) | Create a transformation for any supported table in a Log Analytics workspace. The transformation is defined in a DCR that's then associated with the workspace. It's applied to any data sent to that table from a legacy workload that doesn't use a DCR. |


## Manually create a DCR



## [CLI](#tab/cli)

```dotnetcli
az monitor data-collection rule create --resource-group "myResourceGroup" --location "eastus" --name "myCollectionRule" --data-flows destinations="centralWorkspace" streams="Microsoft-Perf" streams="Microsoft-Syslog" streams="Microsoft-WindowsEvent" --log-analytics name="centralWorkspace" resource-id="/subscriptions/703362b3-f278-4e4b-9179-c76eaf41ffc2/resourceGroups/myResourceGroup/providers/Microsoft.OperationalInsights/workspaces/centralTeamWorkspace" --performance-counters name="cloudTeamCoreCounters" counter-specifiers="\\Processor(_Total)\\% Processor Time" counter-specifiers="\\Memory\\Committed Bytes" counter-specifiers="\\LogicalDisk(_Total)\\Free Megabytes" counter-specifiers="\\PhysicalDisk(_Total)\\Avg. Disk Queue Length" sampling-frequency=15 transfer-period="PT1M" streams="Microsoft-Perf" --performance-counters name="appTeamExtraCounters" counter-specifiers="\\Process(_Total)\\Thread Count" sampling-frequency=30 transfer-period="PT5M" streams="Microsoft-Perf" --syslog name="cronSyslog" facility-names="cron" log-levels="Debug" log-levels="Critical" log-levels="Emergency" streams="Microsoft-Syslog" --syslog name="syslogBase" facility-names="syslog" log-levels="Alert" log-levels="Critical" log-levels="Emergency" streams="Microsoft-Syslog" --windows-event-logs name="cloudSecurityTeamEvents" transfer-period="PT1M" streams="Microsoft-WindowsEvent" x-path-queries="Security!" --windows-event-logs name="appTeam1AppEvents" transfer-period="PT5M" streams="Microsoft-WindowsEvent" x-path-queries="System![System[(Level = 1 or Level = 2 or Level = 3)]]" x-path-queries="Application!*[System[(Level = 1 or Level = 2 or Level = 3)]]"
```


## [PowerShell](#tab/powershell)

```powershell
New-AzDataCollectionRule    -Location 'east-us' `
                            -ResourceGroupName 'my-resource-group' `
                            -RuleName 'myDCRName' `
                            -RuleFile 'C:\MyNewDCR.json' `
                            -Description 'This is my new DCR' `
```

## [ARM](#tab/arm)


## [API](#tab/api)



## Work with data collection rules
To work with DCRs outside of the Azure portal, see the following resources:

| Method | Resources |
|:---|:---|
| API        | Directly edit the DCR in any JSON editor and then [install it by using the REST API](/rest/api/monitor/datacollectionrules). |
| CLI        | Create DCRs and associations with the [Azure CLI](/cli/azure/monitor/data-collection/rule). |
| PowerShell | Work with DCRs and associations with the following Azure PowerShell cmdlets:<br>[Get-AzDataCollectionRule](/powershell/module/az.monitor/get-azdatacollectionrule)<br>[New-AzDataCollectionRule](/powershell/module/az.monitor/new-azdatacollectionrule)<br>[Set-AzDataCollectionRule](/powershell/module/az.monitor/set-azdatacollectionrule)<br>[Update-AzDataCollectionRule](/powershell/module/az.monitor/update-azdatacollectionrule)<br>[Remove-AzDataCollectionRule](/powershell/module/az.monitor/remove-azdatacollectionrule)<br>[Get-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/get-azdatacollectionruleassociation)<br>[New-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/new-azdatacollectionruleassociation)<br>[Remove-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/remove-azdatacollectionruleassociation)



# Examples

| Scenario | Resources | Description |
|:---|:---|:---|
| | [Use Azure Policy to install Azure Monitor Agent and associate with a DCR](../agents/azure-monitor-agent-manage.md#use-azure-policy) | Use Azure Policy to install Azure Monitor Agent and associate one or more DCRs with any virtual machines or virtual machine scale sets as they're created in your subscription.
| Text logs | [Configure custom logs by using the Azure portal](../logs/tutorial-logs-ingestion-portal.md)<br>[Configure custom logs by using Azure Resource Manager templates and the REST API](../logs/tutorial-logs-ingestion-api.md)<br>[Collect text logs with Azure Monitor Agent](../agents/data-collection-text-log.md?tabs=portal) | Send custom data by using a REST API or Agent. The API call connects to a data collection endpoint and specifies a DCR to use. The agent uses the DCR to configure the collection of data on a machine. The DCR specifies the target table and potentially includes a transformation that filters and modifies the data before it's stored in a Log Analytics workspace.  |
| Azure Event Hubs | [Ingest events from Azure Event Hubs to Azure Monitor Logs](../logs/ingest-logs-event-hub.md)| Collect data from multiple sources to an event hub and ingest the data you need directly into tables in one or more Log Analytics workspaces. This is a highly scalable method of collecting data from a wide range of sources with minimum configuration.|
| Workspace transformation | [Configure ingestion-time transformations by using Azure Resource Manager templates and the REST API](../logs/tutorial-workspace-transformations-api.md) | Create a transformation for any supported table in a Log Analytics workspace. The transformation is defined in a DCR that's then associated with the workspace. It's applied to any data sent to that table from a legacy workload that doesn't use a DCR. |


## Edit a DCR
To edit a DCR, you need to 

## Next steps

- [Read about the detailed structure of a data collection rule](data-collection-rule-structure.md)
- [Get details on transformations in a data collection rule](data-collection-transformations.md)
