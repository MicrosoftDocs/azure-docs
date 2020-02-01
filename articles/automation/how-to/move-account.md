---
title: Move your Azure Automation account to another subscription
description: This article describes how to move your Automation account to another subscription
services: automation
ms.service: automation
ms.subservice: process-automation
author: mgoedtel
ms.author: magoedte
ms.date: 03/11/2019
ms.topic: conceptual
manager: carmonm
---
# Move your Azure Automation account to another subscription

Azure provides you the ability to move some resources to a new resource group or subscription. You can move resources through the Azure portal, PowerShell, the Azure CLI, or the REST API. To learn more about the process, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

Azure Automation accounts are one of the resources that can be moved. In this article, you'll learn the steps to move Automation accounts to another resource or subscription.

The high-level steps to moving your Automation account are:

1. Remove your solutions.
2. Unlink your workspace.
3. Move the Automation account.
4. Delete and re-create the Run As accounts.
5. Re-enable your solutions.

## Remove solutions

To unlink your workspace from your Automation account, these solutions must be removed from your workspace:
- **Change Tracking and Inventory**
- **Update Management**
- **Start/Stop VMs during off hours**

In your resource group, find each solution and select **Delete**. On the **Delete Resources** page, confirm the resources to be removed, and select **Delete**.

![Delete solutions from the Azure portal](../media/move-account/delete-solutions.png)

You can accomplish the same task with the [Remove-AzureRmResource](/powershell/module/azurerm.resources/remove-azurermresource) cmdlet as shown in the following example:

```azurepowershell-interactive
$workspaceName = <myWorkspaceName>
$resourceGroupName = <myResourceGroup>
Remove-AzureRmResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "ChangeTracking($workspaceName)" -ResourceGroupName $resourceGroupName
Remove-AzureRmResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "Updates($workspaceName)" -ResourceGroupName $resourceGroupName
Remove-AzureRmResource -ResourceType 'Microsoft.OperationsManagement/solutions' -ResourceName "Start-Stop-VM($workspaceName)" -ResourceGroupName $resourceGroupName
```

### Additional steps for Start/Stop VMs

For the **Start/Stop VMs** solution, you also need to remove the alert rules created by the solution.

In the Azure portal, go to your resource group and select **Monitoring** > **Alerts** > **Manage alert rules**.

![Alerts page showing selection of Manage Alert rules](../media/move-account/alert-rules.png)

On the **Rules** page, you should see a list of the alerts configured in that resource group. The **Start/Stop VMs** solution creates three alert rules:

* AutoStop_VM_Child
* ScheduledStartStop_Parent
* SequencedStartStop_Parent

Select these three alert rules, and then select **Delete**. This action will remove these alert rules.

![Rules page requesting confirmation of deletion for selected rules](../media/move-account/delete-rules.png)

> [!NOTE]
> If you don't see any alert rules on the **Rules** page, change the **Status** to show **Disabled** alerts, because you might have disabled them.

When the alert rules are removed, remove the action group that was created for the **Start/Stop VMs** solution notifications.

In the Azure portal, select **Monitor** > **Alerts** > **Manage action groups**.

Select **StartStop_VM_Notification** from the list. On the action group page, select **Delete**.

![Action group page, select delete](../media/move-account/delete-action-group.png)

Similarly, you can delete your action group by using PowerShell with the [Remove-AzureRmActionGroup](/powershell/module/azurerm.insights/remove-azurermactiongroup) cmdlet, as seen in the following example:

```azurepowershell-interactive
Remove-AzureRmActionGroup -ResourceGroupName <myResourceGroup> -Name StartStop_VM_Notification
```

## Unlink your workspace

In the Azure portal, select **Automation account** > **Related Resources** > **Linked workspace**. Select **Unlink workspace** to unlink the workspace from your Automation account.

![Unlink a workspace from an Automation account](../media/move-account/unlink-workspace.png)

## Move your Automation account

After removing the previous items, you can continue to remove your Automation account and its runbooks. In the Azure portal, browse to the resource group of your Automation account. Select **Move** > **Move to another subscription**.

![Resource group page, move to another subscription](../media/move-account/move-resources.png)

Select the resources in your resource group that you want to move. Ensure you include your **Automation account**, **Runbook**, and **Log Analytics workspace** resources.

After the move is complete, there are additional steps required to make everything work.

## Re-create Run As accounts

[Run As accounts](../manage-runas-account.md) create a service principal in Azure Active Directory to authenticate with Azure resources. When you change subscriptions, the Automation account no longer uses the existing Run As account.

Go to your Automation account in the new subscription and select **Run as accounts** under **Account Settings**. You'll see that the Run As accounts show as incomplete now.

![Run As accounts are incomplete](../media/move-account/run-as-accounts.png)

Select each Run As account. On the **Properties** page, select **Delete** to delete the Run As account.

> [!NOTE]
> If you do not have permissions to create or view the Run As accounts, you'll see the following message: `You do not have permissions to create an Azure Run As account (service principal) and grant the Contributor role to the service principal.` To learn about the permissions required to configure a Run As account, see [Permissions required to configure Run As accounts](../manage-runas-account.md#permissions).

After the Run As accounts are deleted, select **Create** under **Azure Run As account**. On the **Add Azure Run As account** page, select **Create** to create the Run As account and service principal. Repeat the preceding steps with the **Azure Classic Run As account**.

## Enable solutions

After you re-create the Run As accounts, you'll re-enable the solutions that you removed before the move. To turn on **Change Tracking and Inventory** and **Update Management**, select the respective capability in your Automation account. Choose the Log Analytics workspace you moved over and select **Enable**.

![Re-enable solutions in your moved Automation account](../media/move-account/reenable-solutions.png)

Machines that are onboarded with your solutions will be visible when you've connected the existing Log Analytics workspace.

To turn on the **Start/Stop VMs** during off-hours solution, you'll need to redeploy the solution. Under **Related Resources**, select **Start/Stop VMs** > **Learn more about and enable the solution** > **Create** to start the deployment.

On the **Add Solution** page, choose your Log Analytics Workspace and Automation account.

![Add Solution menu](../media/move-account/add-solution-vm.png)

For detailed instructions on configuring the solution, see [Start/Stop VMs during off-hours solution in Azure Automation](../automation-solution-vm-management.md).

## Post-move verification

When the move is complete, check the following list of tasks that should be verified:

|Capability|Tests|Troubleshooting link|
|---|---|---|
|Runbooks|A runbook can successfully run and connect to Azure resources.|[Troubleshoot runbooks](../troubleshoot/runbooks.md)
|Source control|You can run a manual sync on your source control repo.|[Source control integration](../source-control-integration.md)|
|Change tracking and inventory|Verify you see current inventory data from your machines.|[Troubleshoot change tracking](../troubleshoot/change-tracking.md)|
|Update management|Verify you see your machines and they're healthy.</br>Run a test software update deployment.|[Troubleshoot update management](../troubleshoot/update-management.md)|
|Shared resources|Verify that you see all of your shared resources, such as [Credentials](../shared-resources/credentials.md), [Variables](../shared-resources/variables.md), etc.|

## Next steps

To learn more about moving resources in Azure, see [Move resources in Azure](../../azure-resource-manager/management/move-support-resources.md).
