---
title: Move a Log Analytics workspace in Azure Monitor | Microsoft Docs
description: Learn how to move your Log Analytics workspace to another subscription or resource group.
ms.topic: conceptual
ms.service:  azure-monitor
author: yossi-y
ms.author: yossiy
ms.date: 09/01/2022
ms.custom: devx-track-azurepowershell

---

# Move a Log Analytics workspace to different subscription or resource group

In this article, you'll learn the steps to move Log Analytics workspace to another resource group or subscription in the same region. You can learn more about moving Azure resources through the Azure portal, PowerShell, the Azure CLI, or the REST API. at [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). 

> [!IMPORTANT]
> You can't move a workspace to a different region using this procedure. Follow [move a Log Analytics workspace to another region](./move-workspace-region.md) article to move workspace across regions.

## Verify Active Directory tenant
The workspace source and destination subscriptions must exist within the same Azure Active Directory tenant. Use Azure PowerShell to verify that both subscriptions have the same tenant ID.

```powershell
(Get-AzSubscription -SubscriptionName <your-source-subscription>).TenantId
(Get-AzSubscription -SubscriptionName <your-destination-subscription>).TenantId
```

## Workspace move considerations
- Managed solutions that are installed in the workspace will be moved in this operation. 
- The move operation requires that there are no Linked Services to workspace. Solutions that rely on Linked Services must be removed prior to the move, including Automation account. These solutions must be removed before you can unlink your automation account. Data collection for the solutions will stop, their tables removed from UI, but data remains in workspace per tables retention period. When adding solutions after the move, ingestion is restored and tables become visible with data. 
  - Update Management
  - Change Tracking
  - Start/Stop VMs during off-hours
  - Microsoft Defender for Cloud
- Workspace keys (both primary and secondary) are re-generated with workspace move operation. If you keep a copy of your workspace keys in key vault, update them with the new keys generated after the workspace move. 
- Connected [MMA agents](../agents/log-analytics-agent.md) remain connected and keep sending data to the workspace after the move. [AMA agents](../agents/azure-monitor-agent-overview.md) via DCR will be disconnected during the move and should be reconfigured after the move.

>[!IMPORTANT]
> **Microsoft Sentinel customers**
> - Currently, after Microsoft Sentinel is deployed on a workspace, moving the workspace to another resource group or subscription isn't supported. 
> - If you have already moved the workspace, disable all active rules under **Analytics** and re-enable them after five minutes. This should be an effective solution in most cases, though, to reiterate, it is unsupported and undertaken at your own risk.
> - It could take Azure Resource Manager a few hours to complete and solutions may be unresponsive during the operation.
> 
> **Re-create alerts**
> - All alerts must be re-created because the permissions are based on workspace Resource ID, which changes during a workspace move or resource name change. Alerts in workspaces created after 1-June 2019, or in workspaces that were [upgraded from legacy Log Analytics alert API to scheduledQueryRules API](../alerts/alerts-log-api-switch.md) can be exported in template and deployed after the move. You can [check if scheduledQueryRules API is used for alerts in your workspace](../alerts/alerts-log-api-switch.md#check-switching-status-of-workspace). Alternatively, you can configure alerts manually in target workspace
>
> **Update resource paths**
> - After a workspace move, any Azure or external resources that point to the workspace must be reviewed and updated to point to the new resource target path.
> 
>   *Examples:*
>   - [Azure Monitor alert rules](../alerts/alerts-resource-move.md)
>   - Third-party applications
>   - Custom scripting
>

### Delete solutions in Azure portal
Use the following procedure to remove the solutions using the Azure portal:

1. Open the menu for the resource group that any solutions are installed in.
2. Select the solutions to remove.
3. Click **Delete Resources** and then confirm the resources to be removed by clicking **Delete**.

[![Delete solutions](media/move-workspace/delete-solutions.png)](media/move-workspace/delete-solutions.png#lightbox)

### Delete using PowerShell

To remove the solutions using PowerShell, use the [Remove-AzResource](/powershell/module/az.resources/remove-azresource) cmdlet as shown in the following example:

```powershell
Remove-AzResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "ChangeTracking(<workspace-name>)" -ResourceGroupName <resource-group-name>
Remove-AzResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "Updates(<workspace-name>)" -ResourceGroupName <resource-group-name>
Remove-AzResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "Start-Stop-VM(<workspace-name>)" -ResourceGroupName <resource-group-name>
```

### Remove alert rules for Start/Stop VMs solution
To remove **Start/Stop VMs** solution, you also need to remove the alert rules created by the solution. Use the following procedure in the Azure portal to remove these rules.

1. Open the **Monitor** menu and then select **Alerts**.
2. Click **Manage alert rules**.
3. Select the following three alert rules, and then click **Delete**.

   - AutoStop_VM_Child
   - ScheduledStartStop_Parent
   - SequencedStartStop_Parent

    [![Delete rules](media/move-workspace/delete-rules.png)](media/move-workspace/delete-rules.png#lightbox)

## Unlink Automation account
Use the following procedure to unlink the Automation account from the workspace using the Azure portal:

1. Open the **Automation accounts** menu and then select the account to remove.
2. In the **Related Resources** section of the menu, select **Linked workspace**. 
3. Click **Unlink workspace** to unlink the workspace from your Automation account.

    [![Unlink workspace](media/move-workspace/unlink-workspace.png)](media/move-workspace/unlink-workspace.png#lightbox)

## Move your workspace

### Azure portal
Use the following procedure to move your workspace using the Azure portal:

1. Open the **Log Analytics workspaces** menu and then select your workspace.
2. In the **Overview** page, click **change** next to either **Resource group** or **Subscription**.
3. A new page opens with a list of resources related to the workspace. Select the resources to move to the same destination subscription and resource group as the workspace. 
4. Select a destination **Subscription** and **Resource group**. If you're moving the workspace to another resource group in the same subscription, you won't see the **Subscription** option.
5. Click **OK** to move the workspace and selected resources.

    [![Screenshot shows the Overview pane in the Log Analytics workspace with options to change the resource group and subscription name.](media/move-workspace/portal.png)](media/move-workspace/portal.png#lightbox)

### PowerShell
To move your workspace using PowerShell, use the [Move-AzResource](/powershell/module/AzureRM.Resources/Move-AzureRmResource) as in the following example:

```powershell
Move-AzResource -ResourceId "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup01/providers/Microsoft.OperationalInsights/workspaces/MyWorkspace" -DestinationSubscriptionId "00000000-0000-0000-0000-000000000000" -DestinationResourceGroupName "MyResourceGroup02"
```

> [!IMPORTANT]
> After the move operation, removed solutions and Automation account link should be reconfigured to bring the workspace back to its previous state.

## Next steps
- For a list of which resources support move, see [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).
