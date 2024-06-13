---
title: Delete and recover an Azure Log Analytics workspace | Microsoft Docs
description: Learn how to delete your Log Analytics workspace if you created one in a personal subscription or restructure your workspace model.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: yossi-y
ms.date: 07/30/2023
ms.custom:
---

# Delete and recover an Azure Log Analytics workspace

This article explains the concept of Azure Log Analytics workspace soft-delete and how to recover a deleted workspace in a soft-delete state. It also explains how to delete a workspace permanently instead of deleting it into a soft-delete state.

## Permissions required

- To delete a Log Analytics workspace into a soft-delete state or permanently, you need `microsoft.operationalinsights/workspaces/delete` permissions to the workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.
- To recover a Log Analytics workspace in a soft-delete state, you need `Microsoft.OperationalInsights/workspaces/write` permissions to the workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.

## Considerations when you delete a workspace

When you delete a Log Analytics workspace into a soft-delete state, a soft-delete operation is performed to allow the recovery of the workspace, including its data and connected agents, within 14 days. This process occurs whether the deletion was accidental or intentional.

After the soft-delete period, the workspace resource and its data are nonrecoverable and queued for purge completely within 30 days. The workspace name is released and you can use it to create a new workspace.

> [!NOTE]
> If you want to override the soft-delete behavior and permanently delete your workspace, follow the steps in [Delete a workspace permanently](#delete-a-workspace-permanently).

The soft-delete operation deletes the workspace resource, and any associated users' permission is broken. If users are associated with other workspaces, they can continue using Log Analytics with those other workspaces.

Be careful when you delete a workspace because there might be important data and configuration that might negatively affect your service operation. Review what agents, solutions, and other Azure services store their data in Log Analytics, such as:

* Management solutions.
* Azure Automation.
* Agents running on Windows and Linux virtual machines.
* Agents running on Windows and Linux computers in your environment.
* System Center Operations Manager.

## Delete a workspace into a soft-delete state

The workspace delete operation removes the workspace Azure Resource Manager resource. Its configuration and data are kept for 14 days, although it will look as if the workspace is deleted. Any agents and System Center Operations Manager management groups configured to report to the workspace remain in an orphaned state during the soft-delete period. The service provides a mechanism for [recovering the deleted workspace](#recover-a-workspace-in-a-soft-delete-state), including its data and connected resources, essentially undoing the deletion.

> [!NOTE]
> Installed solutions and linked services like your Azure Automation account are permanently removed from the workspace at deletion time and can't be recovered. These resources should be reconfigured after the recovery operation to bring the workspace back to its previously configured state.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, select **All services**. In the list of resources, enter **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**.
1. In the list of Log Analytics workspaces, select a workspace. Select **Delete**.
1. A confirmation page appears that shows the data ingestion to the workspace over the past week.
1. Enter the name of the workspace to confirm and then select **Delete**.

   :::image type="content" source="media/delete-workspace/workspace-delete.png" alt-text="Screenshot that shows confirming the deletion of a workspace." lightbox="media/delete-workspace/workspace-delete.png":::

### [REST API](#tab/rest-api)

To delete a workspace into a soft-delete state, call the [Workspaces - Delete API](/rest/api/loganalytics/workspaces/delete):

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}?api-version=2022-10-01
```

### [PowerShell](#tab/powershell)

To delete a workspace into a soft-delete state, run the [Remove-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/remove-azoperationalinsightsworkspace) cmdlet.

```PowerShell
PS C:\>Remove-AzOperationalInsightsWorkspace -ResourceGroupName "resource-group-name" -Name "workspace-name"
```

### [CLI](#tab/cli)

To delete a workspace into a soft-delete state, run the [az monitor log-analytics workspace delete](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-delete) command.

```azurecli
az monitor log-analytics workspace delete --resource-group MyResourceGroup --workspace-name MyWorkspace
```

---

## Recover a workspace in a soft-delete state

When you delete a Log Analytics workspace accidentally or intentionally, the service places the workspace in a soft-delete state and makes it inaccessible to any operation. The name of the deleted workspace is preserved during the soft-delete period. It can't be used to create a new workspace. After the soft-delete period, the workspace is nonrecoverable and scheduled for permanent deletion, and its name is released and can be used when creating a new workspace.

You can recover your workspace during the soft-delete period, including its data, configuration, and connected agents. The workspace recovery is performed by re-creating the Log Analytics workspace with the details of the deleted workspace, including:

- Subscription ID
- Resource group name
- Workspace name
- Region

> [!IMPORTANT]
> If your workspace was deleted as part of a resource group delete operation, you must first re-create the resource group.

The workspace and all its data are brought back after the recovery operation. However, solutions and linked services were permanently removed from the workspace when it was deleted into a soft-delete state. These resources should be reconfigured to bring the workspace to its previously configured state. After you recover the workspace, some of the data might not be available for query until the associated solutions are reinstalled and their schemas are added to the workspace.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, select **All services**. In the list of resources, enter **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**. You see the list of workspaces you have in the selected scope.
1. Select **Open recycle bin** on the top left menu to open a page with workspaces in a soft-delete state that can be recovered.

   <!-- convertborder later -->
   :::image type="content" source="media/delete-workspace/recover-menu.png" lightbox="media/delete-workspace/recover-menu.png" alt-text="Screenshot that shows the Log Analytics workspaces screen and Open recycle bin on the menu bar." border="false":::

1. Select the workspace. Then select **Recover** to recover the workspace.
   <!-- convertborder later -->
   :::image type="content" source="media/delete-workspace/recover-workspace.png" lightbox="media/delete-workspace/recover-workspace.png" alt-text="Screenshot that shows the Recycle bin with a workspace and the Recover button." border="false":::

### [REST API](#tab/rest-api)

To recover the workspace, create it again with the same name, in the same subscription, resource group and location by calling the [Workspaces - Create Or Update API](/rest/api/loganalytics/workspaces/create-or-update).

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}?api-version=2022-10-01
```

### [PowerShell](#tab/powershell)

To recover a workspace in a soft delete state, run the [Restore-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/restore-azoperationalinsightsworkspace) cmdlet.

```PowerShell
PS C:\>Select-AzSubscription "subscription-name-the-workspace-was-in"
PS C:\>Restore-AzOperationalInsightsWorkspace -ResourceGroupName "resource-group-name-the-workspace-was-in" -Name "deleted-workspace-name" -Location "region-name-the-workspace-was-in"
```

### [CLI](#tab/cli)

To recover a workspace in a soft delete state, run the [az monitor log-analytics workspace recover](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-recover) command:


```azurecli
az monitor log-analytics workspace recover --resource-group MyResourceGroup --workspace-name MyWorkspace
```

---

## Delete a workspace permanently
The soft-delete method might not fit in some scenarios, such as development and testing, where you need to repeat a deployment with the same settings and workspace name. In such cases, you can permanently delete your workspace and "override" the soft-delete period. The permanent workspace delete operation releases the workspace name. You can create a new workspace by using the same name.

> [!IMPORTANT]
> - Use the permanent workspace delete operation with caution because it's irreversible. You won't be able to recover your workspace and its data.
> - If the workspace you want to delete permanently is in a soft-delete state, you must first [recover the workspace](#recover-a-workspace-in-a-soft-delete-state) before you can delete it permanently.

### [Azure portal](#tab/azure-portal)

To permanently delete a workspace by using the Azure portal: 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, select **All services**. In the list of resources, enter **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**.
1. In the list of Log Analytics workspaces, select a workspace. Select **Delete**.
1. A confirmation page appears that shows the data ingestion to the workspace over the past week.
1. Select the **Delete the workspace permanently** checkbox.
1. Enter the name of the workspace to confirm and then select **Delete**.

   :::image type="content" source="media/delete-workspace/workspace-delete.png" alt-text="Screenshot that shows confirming the deletion of a workspace." lightbox="media/delete-workspace/workspace-delete.png":::

### [REST API](#tab/rest-api)

To delete a workspace permanently, call the [Workspaces - Delete API](/rest/api/loganalytics/workspaces/delete) and add the `force` URI parameter:

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}?api-version=2022-10-01&force=true
```

### [PowerShell](#tab/powershell)

To delete a workspace permanently, run the [Remove-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/remove-azoperationalinsightsworkspace) cmdlet and add the `-ForceDelete` tag. The `-ForceDelete` option is currently available with Az.OperationalInsights 2.3.0 or higher.

```powershell
PS C:\>Remove-AzOperationalInsightsWorkspace -ResourceGroupName "resource-group-name" -Name "workspace-name" -ForceDelete
```

### [CLI](#tab/cli)

To delete a workspace permanently, run the [az monitor log-analytics workspace delete](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-delete) command and add the `--force` parameter.

```azurecli
az monitor log-analytics workspace delete --force --resource-group MyResourceGroup --workspace-name MyWorkspace
```

---

## Troubleshooting

Use the following section to troubleshoot issues with deleting or recovering a Log Analytics workspace.

### I'm not sure if the workspace I deleted can be recovered

If you aren't sure if a deleted workspace is in a soft-delete state and can be recovered, in the Azure portal, select [Open recycle bin](?tabs=azure-portal#recover-a-workspace-in-a-soft-delete-state) on the **Log Analytics workspaces** page to see a list of soft-deleted workspaces per subscription. Permanently deleted workspaces aren't included in the list.

### Resolve the "This workspace name is already in use" or "conflict" error message

If you receive one of these error messages when you create a workspace, it could be because:

* The workspace name isn't available because it's being used by someone in your organization or another customer.
* The workspace was deleted in the last 14 days and its name was kept reserved for the soft-delete period. To resolve, follow these steps:

  1. [Recover](#recover-a-workspace-in-a-soft-delete-state) your workspace in a soft-delete state, which allows you to delete it permanently.
  1. [Permanently delete](#delete-a-workspace-permanently) the workspace you recovered. When you delete a workspace permanently, its name is no longer reserved.
  1. [Create a new workspace](./quick-create-workspace.md) by using the same workspace name.

  After the deletion call is successfully completed on the back end, you can restore the workspace and finish the permanent delete operation by using one of the methods suggested earlier.

### I'm receiving 204 response code with "Resource not found" when deleting a workspace

If you get a 204 response code with "Resource not found" when you delete a workspace, consecutive retries operations might have occurred. The 204 code is an empty response, which usually means that the resource doesn't exist, so the delete finished without doing anything.

### I'm receiving error code 404 when attempting to recover my workspace 

If you deleted your resource group and your workspace was included, you can see the deleted workspace on the [Open recycle bin](?tabs=azure-portal#recover-a-workspace-in-a-soft-delete-state) page in the Azure portal. The recovery operation will fail with the error code 404 because the resource group doesn't exist. [Re-create your resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md) and try the recovery again.

## Next steps

If you need to create a new Log Analytics workspace, see [Create a Log Analytics workspace](./quick-create-workspace.md).
