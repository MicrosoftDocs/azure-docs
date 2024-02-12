---
title: Move a Log Analytics workspace in Azure Monitor | Microsoft Docs
description: Learn how to move your Log Analytics workspace to another subscription or resource group.
ms.topic: conceptual
ms.service:  azure-monitor
ms.reviewer: yossiy
ms.date: 10/30/2023
ms.custom: devx-track-azurepowershell

---

# Move a Log Analytics workspace to a different subscription or resource group

In this article, you'll learn the steps to move a Log Analytics workspace to another resource group or subscription in the same region. To move a workspace across regions, see [Move a Log Analytics workspace to another region](./move-workspace-region.md).

> [!TIP] 
> To learn more about how to move Azure resources through the Azure portal, PowerShell, the Azure CLI, or the REST API, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

## Prerequisites

- The subscription or resource group where you want to move your Log Analytics workspace must be located in the same region as the Log Analytics workspace you're moving.
- The move operation requires that no services can be linked to the workspace. Prior to the move, delete solutions that rely on linked services, including an Azure Automation account. These solutions must be removed before you can unlink your Automation account. Data collection for the solutions will stop and their tables will be removed from the UI, but data remains in workspace for the retention period defined for table. When you add solutions back after the move, ingestion restored and tables become visible with data. Linked services include:
  - Update management
  - Change tracking
  - Start/Stop VMs during off-hours
  - Microsoft Defender for Cloud
- Connected [Log Analytics agents](../agents/log-analytics-agent.md) and [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) remain connected to the workspace after the move with no interruption to ingestion.
- Alerts should be re-created after the move, since permissions for alerts is based on workspace resource ID, which changes with the move. Alerts created after June 1, 2019, or in workspaces that were [upgraded from the legacy Log Analytics Alert API to the scheduledQueryRules API](../alerts/alerts-log-api-switch.md) can be exported in templates and deployed after the move. You can [check if the scheduledQueryRules API is used for alerts in your workspace](../alerts/alerts-log-api-switch.md#check-switching-status-of-workspace). Alternatively, you can configure alerts manually in the target workspace.
- Update resource paths after a workspace move for Azure or external resources that point to the workspace. For example: [Azure Monitor alert rules](../alerts/alerts-resource-move.md), Third-party applications, Custom scripting, etc.

## Permissions required

| Action | Permissions required |
|:---|:---|
| Verify the Microsoft Entra tenant. | `Microsoft.AzureActiveDirectory/b2cDirectories/read` permissions, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example. |
| Delete a solution. | `Microsoft.OperationsManagement/solutions/delete` permissions on the solution, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |
| Remove alert rules for the Start/Stop VMs solution. | `microsoft.insights/scheduledqueryrules/delete` permissions, as provided by the [Monitoring Contributor built-in role](../../role-based-access-control/built-in-roles.md#monitoring-contributor), for example. |
| Unlink the Automation account | `Microsoft.OperationalInsights/workspaces/linkedServices/delete` permissions on the linked Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |
| Move a Log Analytics workspace. | `Microsoft.OperationalInsights/workspaces/delete` and `Microsoft.OperationalInsights/workspaces/write` permissions on the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |

## Considerations and limits

Consider these points before you move a Log Analytics workspace:

- It can take Azure Resource Manager a few hours to complete. Solutions might be unresponsive during the operation.
- Managed solutions that are installed in the workspace, will be moved as well.
- Managed solutions are workspace's objects and can't be moved independently.
- Workspace keys (both primary and secondary) are regenerated with a workspace move operation. If you keep a copy of your workspace keys in Azure Key Vault, update them with the new keys generated after the workspace is moved.

>[!IMPORTANT]
> **Microsoft Sentinel customers**
> - Currently, after Microsoft Sentinel is deployed on a workspace, moving the workspace to another resource group or subscription isn't supported.
> - If you've already moved the workspace, disable all active rules under **Analytics** and reenable them after five minutes. This solution should be effective in most cases, although it's unsupported and undertaken at your own risk.

## Verify the Microsoft Entra tenant
The workspace source and destination subscriptions must exist within the same Microsoft tenant. Use Azure PowerShell to verify that both subscriptions have the same Entra tenant ID.

### [Portal](#tab/azure-portal)

[Find your Microsoft Entra tenant](../../azure-portal/get-subscription-tenant-id.md#find-your-azure-ad-tenant) for the source and destination subscriptions.

### [REST API](#tab/rest-api)

To fetch the tenant ID for the source and destination subscriptions, call the [Subscriptions - Get API](/rest/api/resources/subscriptions/get):

```http
GET https://management.azure.com/subscriptions/{subscriptionId}?api-version=2020-01-01
```

### [CLI](#tab/cli)

Run the [az account tenant](/cli/azure/account/tenant) command:

```azurecli
az account tenant list --subscription <your-source-subscription>
az account tenant list --subscription <your-destination-subscription>
```

### [PowerShell](#tab/PowerShell)

Run the [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription/) command:

```powershell
(Get-AzSubscription -SubscriptionName <your-source-subscription>).TenantId
(Get-AzSubscription -SubscriptionName <your-destination-subscription>).TenantId
```

---

## Delete solutions

### [Portal](#tab/azure-portal)

1. Open the menu for the resource group where any solutions are installed.
1. Select the solutions to remove.
1. Select **Delete Resources** and then confirm the resources to be removed by selecting **Delete**.
   <!-- convertborder later -->
   :::image type="content" source="media/move-workspace/delete-solutions.png" lightbox="media/move-workspace/delete-solutions.png" alt-text="Screenshot that shows deleting solutions." border="false":::

### [REST API](#tab/rest-api)

To delete the solution, call the [Resources - Delete API](/rest/api/resources/resources/delete): 

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{parentResourcePath}/{resourceType}/{resourceName}?api-version=2021-04-01
```

### [CLI](#tab/cli)

To remove solutions, run the [az resource delete](/cli/azure/resource#az-resource-delete) command. You need to specify the name of the resource, resource type, and resource group for the solution you want to delete:

```azurecli
az resource delete --name <resource-name> --resource-type <resource-type> --resource-group <resource-group-name>
```

### [PowerShell](#tab/PowerShell)

To remove solutions, use the [Remove-AzResource](/powershell/module/az.resources/remove-azresource) cmdlet as shown in the following example:

```powershell
Remove-AzResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "ChangeTracking(<workspace-name>)" -ResourceGroupName <resource-group-name>
Remove-AzResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "Updates(<workspace-name>)" -ResourceGroupName <resource-group-name>
Remove-AzResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "Start-Stop-VM(<workspace-name>)" -ResourceGroupName <resource-group-name>
```

---

### Remove alert rules for the Start/Stop VMs solution

To remove the **Start/Stop VMs** solution, you also need to remove the alert rules created by the solution.

### [Portal](#tab/azure-portal)

1. Open the **Monitor** menu and then select **Alerts**.
1. Select **Manage alert rules**.
1. Select the following three alert rules, and then select **Delete**:

   - AutoStop_VM_Child
   - ScheduledStartStop_Parent
   - SequencedStartStop_Parent
    <!-- convertborder later -->
    :::image type="content" source="media/move-workspace/delete-rules.png" lightbox="media/move-workspace/delete-rules.png" alt-text="Screenshot that shows deleting rules." border="false":::

### [REST API](#tab/rest-api)

Delete the following alert rules by calling the Scheduled Query Rules - Delete API:

   - AutoStop_VM_Child
   - ScheduledStartStop_Parent
   - SequencedStartStop_Parent

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/scheduledQueryRules/{ruleName}?api-version=2023-03-15-preview
```

### [CLI](#tab/cli)

Delete the following alert rules by running the [az monitor scheduled-query delete](/cli/azure/monitor/scheduled-query#az-monitor-scheduled-query-delete) command:

- AutoStop_VM_Child
- ScheduledStartStop_Parent
- SequencedStartStop_Parent

```azurecli
az monitor scheduled-query delete [--ids]
                                  [--name]
                                  [--resource-group]
                                  [--subscription]
                                  [--yes]
```

### [PowerShell](#tab/PowerShell)

Delete the following alert rules by running the [Remove-AzScheduledQueryRule](/powershell/module/az.monitor/remove-azscheduledqueryrule) command: 

- AutoStop_VM_Child
- ScheduledStartStop_Parent
- SequencedStartStop_Parent

---

## Unlink the Automation account

### [Portal](#tab/azure-portal)

See [Delete a standalone Automation account linked to workspace](../../automation/delete-account.md#delete-a-standalone-automation-account-linked-to-workspace).

### [ REST API](#tab/rest-api)

Call the [Linked Services - Delete API](/rest/api/loganalytics/linked-services/delete).

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/linkedServices/{linkedServiceName}?api-version=2020-08-01
```

### [CLI](#tab/cli)

Not supported.

### [PowerShell](#tab/PowerShell)

Not supported.

---

## Move your workspace

### [Portal](#tab/azure-portal)

1. Open the **Log Analytics workspaces** menu and then select your workspace.
1. On the **Overview** page, select **change** next to either **Resource group** or **Subscription name**.
1. A new page opens with a list of resources related to the workspace. Select the resources to move to the same destination subscription and resource group as the workspace.
1. Select a destination **Subscription** and **Resource group**. If you're moving the workspace to another resource group in the same subscription, you won't see the **Subscription** option.
1. Select **OK** to move the workspace and selected resources.

    :::image type="content" source="media/move-workspace/portal.png" lightbox="media/move-workspace/portal.png" alt-text="Screenshot that shows the Overview pane in the Log Analytics workspace with options to change the resource group and subscription name.":::

### [ REST API](#tab/rest-api)

To move your workspace, call the [Resources - Move Resources API](/rest/api/resources/resources/move-resources).

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{sourceResourceGroupName}/moveResources?api-version=2021-04-01
```

### [CLI](#tab/cli)

To move your workspace, run the [az resource move](/cli/azure/resource#az-resource-move) command:

```azurecli
az resource move --destination-group
                 --ids
                 [--destination-subscription-id]
```

### [PowerShell](#tab/PowerShell)

To move your workspace, run the [Move-AzResource](/powershell/module/AzureRM.Resources/Move-AzureRmResource) cmdlet as shown in the following example:

```powershell
Move-AzResource -ResourceId "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup01/providers/Microsoft.OperationalInsights/workspaces/MyWorkspace" -DestinationSubscriptionId "00000000-0000-0000-0000-000000000000" -DestinationResourceGroupName "MyResourceGroup02"
```

---

> [!IMPORTANT]
> After the move operation, removed solutions and the Automation account link should be reconfigured to bring the workspace back to its previous state.

## Next steps
For a list of which resources support the move operation, see [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).
