---
title: View activity logs for RBAC changes | Microsoft Docs
description: View activity logs for role-based access control changes for the past 90 days.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 2bc68595-145e-4de3-8b71-3a21890d13d9
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/23/2017
ms.author: rolyon
ms.reviewer: rqureshi
ms.custom: H1Hack27Feb2017
---
# View activity logs for role-based access control changes

Any time someone makes changes to role definitions or role assignments within your subscriptions, the changes get logged in [Azure Activity Log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md) in the Administrative category. You can view the activity logs to see all the role-based access control changes for the past 90 days.

## Operations that are logged

Here are the RBAC-related operations that are logged in Activity Log:

- Get role definition
- Create or update custom role definition
- Delete custom role definition
- Get role assignment
- Create role assignment
- Delete role assignment

## Portal

The easiest way to get started is to view the activity logs with the Azure portal. The following screenshot shows an example of an activity log that has been filtered to display the **Administrative** category along with role definition and role assignment operations. It also includes a link to download the logs as a CSV file.

![Activity logs using the portal - screenshot](./media/change-history-report/activity-log-portal.png)

For information more information, see [View events in activity log](/azure/azure-resource-manager/resource-group-audit?toc=%2fazure%2fmonitoring-and-diagnostics%2ftoc.json).

## PowerShell

To view activity logs with Azure PowerShell use the [Get-AzureRmLog](/powershell/module/azurerm.insights/get-azurermlog) command.

This command lists all role assignment changes in a subscription for the past seven days:

```azurepowershell
Get-AzureRmLog -StartTime (Get-Date).AddDays(-7) | Where-Object {$_.Authorization.Action -like 'Microsoft.Authorization/roleAssignments/*'}
```

This command lists all role definition changes in a resource group for the past seven days:

```azurepowershell
Get-AzureRmLog -ResourceGroupName pharma-sales-projectforecast -StartTime (Get-Date).AddDays(-7) | Where-Object {$_.Authorization.Action -like 'Microsoft.Authorization/roleDefinitions/*'}
```

This command lists all role assignment and role definition changes in a subscription for the past seven days and displays the results in a list:

```azurepowershell
Get-AzureRmLog -StartTime (Get-Date).AddDays(-7) | Where-Object {$_.Authorization.Action -like 'Microsoft.Authorization/role*'} | Format-List Caller,EventTimestamp,{$_.Authorization.Action},Properties
```

```Examples
Caller                  : alain@example.com
EventTimestamp          : 4/20/2018 9:18:07 PM
$_.Authorization.Action : Microsoft.Authorization/roleAssignments/write
Properties              :
                          statusCode     : Created
                          serviceRequestId: 11111111-1111-1111-1111-111111111111

Caller                  : alain@example.com
EventTimestamp          : 4/20/2018 9:18:05 PM
$_.Authorization.Action : Microsoft.Authorization/roleAssignments/write
Properties              :
                          requestbody    : {"Id":"22222222-2222-2222-2222-222222222222","Properties":{"PrincipalId":"33333333-3333-3333-3333-333333333333","RoleDefinitionId":"/subscriptions/00000000-0000-0000-0000-000000000000/providers
                          /Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c","Scope":"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales-projectforecast"}}

```

## Azure CLI

To view activity logs with the Azure CLI use the [az monitor activity-log list](/cli/azure/monitor/activity-log#az-monitor-activity-log-list) command.

This command lists the activity logs in a resource group since the start time:

```azurecli
az monitor activity-log list --resource-group pharma-sales-projectforecast --start-time 2018-04-20T00:00:00Z
```

This command lists the activity logs for the Authorization resource provider since the start time:

```azurecli
az monitor activity-log list --resource-provider "Microsoft.Authorization" --start-time 2018-04-20T00:00:00Z
```

## See also
* [View events in activity log](/azure/azure-resource-manager/resource-group-audit?toc=%2fazure%2fmonitoring-and-diagnostics%2ftoc.json)
* [Monitor Subscription Activity with the Azure Activity Log](/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs)
