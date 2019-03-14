---
title: View Azure activity logs to monitor resources | Microsoft Docs
description: Use the activity logs to review user actions and errors. Shows Azure Portal PowerShell, Azure CLI, and REST.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
ms.assetid: fcdb3125-13ce-4c3b-9087-f514c5e41e73
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 01/23/2019
ms.author: tomfitz

---
# View activity logs to audit actions on resources

Through activity logs, you can determine:

* what operations were taken on the resources in your subscription
* who started the operation
* when the operation occurred
* the status of the operation
* the values of other properties that might help you research the operation

The activity log contains all write operations (PUT, POST, DELETE) performed on your resources. It doesn't include read operations (GET). For a list of resource actions, see [Azure Resource Manager Resource Provider operations](../role-based-access-control/resource-provider-operations.md). You can use the audit logs to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

Activity logs are kept for 90 days. You can query for any range of dates, as long as the starting date isn't more than 90 days in the past.

You can retrieve information from the activity logs through the portal, PowerShell, Azure CLI, Insights REST API, or [Insights .NET Library](https://www.nuget.org/packages/Microsoft.Azure.Insights/).

## The Azure portal

1. To view the activity logs through the portal, select **Monitor**.

    ![Select monitor](./media/resource-group-audit/select-monitor.png)

1. Select **Activity Log**.

    ![Select activity log](./media/resource-group-audit/select-activity-log.png)

1. You see a summary of recent operations. A default set of filters is applied to the operations.

    ![View summary of recent operations](./media/resource-group-audit/audit-summary.png)

1. To quickly run a pre-defined set of filters, select **Quick Insights** and pick one of the options.

    ![select query](./media/resource-group-audit/quick-insights.png)

1. To focus on specific operations, change the filters or apply new ones. For example, the following image shows a new value for the **Timespan** and **Resource type** is set to storage accounts. 

    ![Set filter options](./media/resource-group-audit/set-filter.png)

1. If you need to run the query again later, select **Pin current filters**.

    ![Pin filters](./media/resource-group-audit/pin-filters.png)

1. Give the filter a name.

    ![Name filters](./media/resource-group-audit/name-filters.png)

1. The filter is available in the dashboard.

    ![Show filter on dashboard](./media/resource-group-audit/show-dashboard.png)

## PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

* To retrieve log entries, run the **Get-AzLog** command. You provide additional parameters to filter the list of entries. If you don't specify a start and end time, entries for the last seven days are returned.

  ```azurepowershell-interactive
  Get-AzLog -ResourceGroup ExampleGroup
  ```

    The following example shows how to use the activity log to research operations taken during a specified time. The start and end dates are specified in a date format.

  ```azurepowershell-interactive
  Get-AzLog -ResourceGroup ExampleGroup -StartTime 2019-01-09T06:00 -EndTime 2019-01-15T06:00
  ```

    Or, you can use date functions to specify the date range, such as the last 14 days.

  ```azurepowershell-interactive
  Get-AzLog -ResourceGroup ExampleGroup -StartTime (Get-Date).AddDays(-14)
  ```

* You can look up the actions taken by a particular user, even for a resource group that no longer exists.

  ```azurepowershell-interactive
  Get-AzLog -ResourceGroup deletedgroup -StartTime (Get-Date).AddDays(-14) -Caller someone@contoso.com
  ```

* You can filter for failed operations.

  ```azurepowershell-interactive
  Get-AzLog -ResourceGroup ExampleGroup -Status Failed
  ```

* You can focus on one error by looking at the status message for that entry.

  ```azurepowershell-interactive
  ((Get-AzLog -ResourceGroup ExampleGroup -Status Failed).Properties[0].Content.statusMessage | ConvertFrom-Json).error
  ```

* You can select specific values to limit the data that is returned.

  ```azurepowershell-interactive
  Get-AzLog -ResourceGroupName ExampleGroup | Format-table EventTimeStamp, Caller, @{n='Operation'; e={$_.OperationName.value}}, @{n='Status'; e={$_.Status.value}}, @{n='SubStatus'; e={$_.SubStatus.LocalizedValue}}
  ```

* Depending on the start time you specify, the previous commands can return a long list of operations for the resource group. You can filter the results for what you are looking for by providing search criteria. For example, you can filter by the type of operation.

  ```azurepowershell-interactive
  Get-AzLog -ResourceGroup ExampleGroup | Where-Object {$_.OperationName.value -eq "Microsoft.Resources/deployments/write"}
  ```

## Azure CLI

* To retrieve log entries, run the [az monitor activity-log list](/cli/azure/monitor/activity-log#az-monitor-activity-log-list) command with an offset to indicate the time span.

  ```azurecli-interactive
  az monitor activity-log list --resource-group ExampleGroup --offset 7d
  ```

  The following example shows how to use the activity log to research operations taken during a specified time. The start and end dates are specified in a date format.

  ```azurecli-interactive
  az monitor activity-log list -g ExampleGroup --start-time 2019-01-01 --end-time 2019-01-15
  ```

* You can look up the actions taken by a particular user, even for a resource group that no longer exists.

  ```azurecli-interactive
  az monitor activity-log list -g ExampleGroup --caller someone@contoso.com --offset 5d
  ```

* You can filter for failed operations.

  ```azurecli-interactive
  az monitor activity-log list -g demoRG --status Failed --offset 1d
  ```

* You can focus on one error by looking at the status message for that entry.

  ```azurecli-interactive
  az monitor activity-log list -g ExampleGroup --status Failed --offset 1d --query [].properties.statusMessage
  ```

* You can select specific values to limit the data that is returned.

  ```azurecli-interactive
  az monitor activity-log list -g ExampleGroup --offset 1d --query '[].{Operation: operationName.value, Status: status.value, SubStatus: subStatus.localizedValue}'
  ```

* Depending on the start time you specify, the previous commands can return a long list of operations for the resource group. You can filter the results for what you are looking for by providing search criteria. For example, you can filter by the type of operation.

  ```azurecli-interactive
  az monitor activity-log list -g ExampleGroup --offset 1d --query "[?operationName.value=='Microsoft.Storage/storageAccounts/write']"
  ```

## REST API

The REST operations for working with the activity log are part of the [Insights REST API](https://msdn.microsoft.com/library/azure/dn931943.aspx). To retrieve activity log events, see [List the management events in a subscription](https://msdn.microsoft.com/library/azure/dn931934.aspx).

## Next steps

* Azure Activity logs can be used with Power BI to gain greater insights about the actions in your subscription. See [View and analyze Azure Activity Logs in Power BI and more](https://azure.microsoft.com/blog/analyze-azure-audit-logs-in-powerbi-more/).
* To learn about setting security policies, see [Azure Role-based Access Control](../role-based-access-control/role-assignments-portal.md).
* To learn about the commands for viewing deployment operations, see [View deployment operations](resource-manager-deployment-operations.md).
* To learn how to prevent deletions on a resource for all users, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).
* To see the list of operations available for each Microsoft Azure Resource Manager provider, see [Azure Resource Manager Resource Provider operations](../role-based-access-control/resource-provider-operations.md)
