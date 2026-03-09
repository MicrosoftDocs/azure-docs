---
title: 'Tutorial: Change a Workspace and Configure Data Collection Rules'
description: In this tutorial, learn how to change a workspace and configure data collection rules for Azure Change Tracking and Inventory.
services: automation
ms.custom: linux-related-content
ms.date: 11/06/2025
ms.topic: tutorial
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
#Customer intent: As a customer, I want to change a workspace for my virtual machine so that I can manage data collection more effectively.
---

# Tutorial: Change a workspace and configure data collection rules

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This tutorial describes how to change a workspace and configure data collection rules.

## Prerequisites

Before you change a workspace for your virtual machine (VM) and configure data collection rules (DCRs), ensure that you enabled Azure Change Tracking and Inventory on your VM by using a DCR. For detailed information on how you can create a DCR, see [Create a DCR](create-data-collection-rule.md).

## Configure Windows, Linux files, and the Windows registry by using DCRs

To configure Windows, Linux files, and the Windows registry by using DCRs, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select the VM.
 
   :::image type="content" source="media/create-data-collection-rule/select-virtual-machine-portal-inline.png" alt-text="Screenshot showing how to select a VM from the portal." lightbox="media/create-data-collection-rule/select-virtual-machine-portal-expanded.png"::: 

1. Select a specific VM for which you want to configure the **Change tracking** settings.
1. Under **Operations**, select **Change tracking** to view all the changes that took place on the VM.
   
   :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/azure-change-tracking-inline.png" alt-text="Screenshot that shows selecting Change tracking to view the changes on the VM." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/azure-change-tracking-expanded.png":::

1. Select **Settings** to view the **Data Collection Rule Configuration** pane. Here, you can do the following actions:

   - Configure changes on a VM at a granular level.  
   - Select the filter to configure the workspace.
   - Use the filter to view all the DCRs that are configured to the specific Azure Monitor Logs workspace level.

   >[!NOTE]
   >The settings that you configure apply to all VMs associated with the specified DCR. For more information about DCR, see [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview).

1. Select **+ Add** to configure new file settings. Use the procedure as specified for Windows, Linux files, and the Windows registry.

   :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/configure-file-settings-inline.png" alt-text="Screenshot that shows how to configure new file settings." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/configure-file-settings-expanded.png":::

#### [Windows Files](#tab/windows)

On the **Windows Files** tab, select **+ Add** > **Add Windows file setting**. Enter the information for the file or folder to track, and select **Add**. The following table describes the properties that you can use to enter the information.

|Property|Description|
|---|---|
|Enabled | True if the setting is applied, and false otherwise.|
|Item name | The friendly name of the file to be tracked. | 
|Group | A group name to group files logically.| 
|Path | The path to check for the file, for example, `c:\temp\*.txt`. You can also use environment variables, such as `%winDir%\System32\*.*.` |
|Path type | The type of path. Possible values are File and Folder.|
|Recursion | True if recursion is used when you look for the item to be tracked, and false otherwise. |

#### [Linux Files](#tab/linux)

On the **Linux Files** tab, select **+ Add** > **Add Linux file setting**. Enter the information for the file or directory to track, and then select **Add**. The following table describes the properties that you can use to enter the information.
    
|Property|Description|
|---|---|
|Enabled | True if the setting is applied, and false otherwise.|
|Item name | The friendly name of the file to be tracked. | 
|Group | A group name to group files logically.| 
|Path | The path to check for the file, for example, `/etc/*.conf`.
|Path type | The type of path. Possible values are file and folder.|
|Recursion | True, if recursion is used when you look for the item to be tracked, and false otherwise. |

#### [Windows Registry](#tab/windows-registry)

On the **Windows Registry** tab, select **+ Add** > **Add Windows registry setting**. Enter the information for the registry key to track, and then select **Add**. The following table describes the properties that you can use to enter the information.

|Property|Description|
|---|---|
|Enabled | True if the setting is applied, and false otherwise.|
|Item name | The friendly name of the registry key to be tracked. | 
|Group | A group name to group keys logically.| 
|Windows registry key | The name of the Windows registry key.

---

You can now view the VMs configured to the DCR from the **Data collection rules** pane in the Azure portal.

### Configure file content changes

To configure file content changes, follow these steps:

1. In your VM, under **Operations**, select **Change tracking** > **Settings**.
1. On the **Data Collection Rule Configuration** pane, select **File Content** > **Link** to link the storage account.

    :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/file-content-inline.png" alt-text="Screenshot that shows selecting the link option to connect with the storage account." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/file-content-expanded.png":::

1. On the **Content Location for Change Tracking** pane, select your subscription and storage account to use for file content Change Tracking.
1. Confirm that you're using **System Assigned Managed Identity**.
1. Select **Upload file content for all settings**. Select **Save** to ensure that the file content changes for all the files residing in this DCR are tracked.

#### [System-assigned managed identity](#tab/sa-mi)

When the storage account is linked by using the system-assigned managed identity, a blob is created. For system-assigned managed identity, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), go to **Storage accounts**, and select the storage account.
1. On the **Storage accounts** pane, under **Data storage**, select **Containers** > **changetracking blob** > **Access Control (IAM)**.
1. On the **changetrackingblob | Access Control (IAM)** pane, select **Add**, and then select **Add role assignment**.

    :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/blob-add-role-inline.png" alt-text="Screenshot that shows selecting to add a role." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/blob-add-role-expanded.png":::

1. On the **Add role assignment** pane, enter **Blob Data contributor** in search to assign an Azure Blob Storage contributor role for the specific VM. This permission provides access to read, write, and delete access to Blob Storage containers and data.

    :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/blob-contributor-inline.png" alt-text="Screenshot that shows selecting the contributor role for Blob Storage." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/blob-contributor-expanded.png":::

1. Select the role and assign it to your VM.

     :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/blob-add-role-virtual-machine-inline.png" alt-text="Screenshot that shows assigning the role to a VM." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/blob-add-role-virtual-machine-expanded.png":::

#### [User-assigned managed identity](#tab/ua-mi)

For user-assigned managed identity, follow these steps to assign the user-assigned managed identity to the VM and provide the permission.

1. On the **Storage accounts** pane, under **Data storage**, select **Containers** > **changetracking blob** > **Access Control (IAM)**.
1. On the **changetrackingblob | Access Control (IAM)** pane, select **Add** > **Add role assignment**.
1. Search for **Storage Blob Data Contributor**, select the role, and assign it to your user-assigned managed identity.

     :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/user-assigned-add-role-inline.png" alt-text="Screenshot that shows adding the role to user-assigned managed identity." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/user-assigned-add-role-expanded.png":::

1. Go to your VM, and under **Settings**, select **Identity**. Under the **User assigned** tab, select **+ Add**.

1. On the **Add user assigned managed identity** pane, select the subscription, and add the user-assigned managed identity.

     :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/user-assigned-assign-role-inline.png" alt-text="Screenshot that shows assigning the role to user-assigned managed identity." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/user-assigned-assign-role-expanded.png":::
---

#### Upgrade the extension version for Windows and Linux

> [!NOTE]
> Ensure that the ChangeTracking-Linux/ChangeTracking-Windows extension version is upgraded to the current general availability (GA) version: [GA Extension version](../azure-change-tracking-inventory/extension-version-details.md)

Use the following command to upgrade the extension version:

```azurecli-interactive
az vm extension set -n {ExtensionName} --publisher Microsoft.Azure.ChangeTrackingAndInventory --ids {VirtualMachineResourceId} 
```

The extension for Windows is `Vms - ChangeTracking-Windows`. The extension for Linux is `Vms - ChangeTracking-Linux`.

### Configure by using wildcards

To configure the monitoring of files and folders by using wildcards, consider the following points:

- Wildcards are required for tracking multiple files.
- Wildcards can be used only in the last segment of a path, such as `C:\folder\file` or `/etc/.conf*`.
- If an environment variable includes a path that isn't valid, validation succeeds but the path fails when inventory runs.
- When you set the path, avoid general paths such as `*C:\*`, which results in too many folders being traversed.

## Related content

- To enable Azure Change Tracking and Inventory from the Azure portal, see [Quickstart: Enable Azure Change Tracking and Inventory](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md).
