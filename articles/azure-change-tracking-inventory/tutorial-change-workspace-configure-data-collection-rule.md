---
title: Tutorial - Change a workspace and configure data collection rule
description: In this tutorial, learn how to change a workspace and configure data collection rule for Azure Change Tracking and Inventory.
services: automation
ms.custom: linux-related-content
ms.date: 11/06/2025
ms.topic: tutorial
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
#Customer intent: As a customer, I want to change a workspace for my virtual machine so that I can manage data collection more effectively.
---

# Tutorial: Change a workspace and configure data collection rule

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This tutorial describes how to change a workspace and configure data collection rule.

## Prerequisites

Before you change a workspace for your virtual machine and configure data collection rule, ensure you've enabled Change Tracking and Inventory on your VM using a data collection rule (DCR). For detailed information on how you can create a Data Collection Rule (DCR), see [Create DCR](create-data-collection-rule.md).

## Configure Windows, Linux files, and Windows Registry using Data Collection Rules

To configure Windows, Linux files, and Windows Registry using Data Collection Rules, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select the virtual machine.
 
   :::image type="content" source="media/create-data-collection-rule/select-virtual-machine-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/create-data-collection-rule/select-virtual-machine-portal-expanded.png"::: 

1. Select a specific VM for which you would like to configure the Change tracking settings.
1. Under **Operations**, select **Change tracking** to view all the changes that have taken place on the VM.
   
   :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/azure-change-tracking-inline.png" alt-text="Screenshot of selecting the change tracking to view the changes on the virtual machine." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/azure-change-tracking-expanded.png":::

1. Select **Settings** to view the **Data Collection Rule Configuration** (DCR) pane. Here, you can do the following actions:
   1. Configure changes on a VM at a granular level.  
   1. Select the filter to configure the workspace.
   1. Use the filter to view all the DCRs that are configured to the specific LA workspace level.

   >[!NOTE]
   >The settings that you configure apply to all virtual machines associated with the specified DCR. For more information about DCR, see [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview).

1. Select **+ Add** to configure new file settings. Use the procedure as specified for Windows, Linux files, and Windows Registry.

   :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/configure-file-settings-inline.png" alt-text="Screenshot to configure new file settings." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/configure-file-settings-expanded.png":::
   
#### [Windows Files](#tab/windows)

On the **Windows Files** tab > Select **+ Add** > **Add windows file setting** pane, enter the information for the file or folder to track and select **Add**. The following table describes the properties that you can use to enter the information.

|**Property**|**Description**|
|---|---|
|Enabled | True if the setting is applied, and false otherwise.|
|Item Name | Friendly name of the file to be tracked. | 
|Group | A group name to group files logically| 
|Path | The path to check for the file, for example, **c:\temp\*.txt**. You can also use environment variables, such as **%winDir%\System32\\\*.*.** |
|Path Type | The type of path. Possible values are File and Folder.|
|Recursion | True if recursion is used when looking for the item to be tracked, and False otherwise. |

#### [Linux Files](#tab/linux)

On the **Linux Files** tab > Select **+ Add** > **Add Linux file setting** pane, enter the information for the file or directory to track, and then select **Add**. The following table describes the properties that you can use to enter the information. 
    
|**Property**|**Description**|
|---|---|
|Enabled | True if the setting is applied, and false otherwise.|
|Item Name | Friendly name of the file to be tracked. | 
|Group | A group name to group files logically| 
|Path | The path to check for the file, for example, /etc/*.conf.  
|Path Type | The type of path. Possible values are File and Folder.|
|Recursion | True if recursion is used when looking for the item to be tracked, and False otherwise. |

#### [Windows Registry](#tab/windows-registry)

On the **Windows Registry** tab > Select **+ Add** > **Add Windows registry setting** pane, enter the information for the registry key to track, and then select **Add**. The following table describes the properties that you can use to enter the information.

|**Property**|**Description**|
|---|---|
|Enabled | True if the setting is applied, and false otherwise.|
|Item Name | Friendly name of the registry key to be tracked. | 
|Group | A group name to group keys logically| 
|Windows Registry Key | The name of the Windows registry key.
   
---

You can now view the virtual machines configured to the DCR from the **Data collection rules** pane in the Azure portal.

### Configure file content changes

To configure file content changes, follow these steps:

1. In your virtual machine, under **Operations**, select **Change tracking** > **Settings**.
1. On the **Data Collection Rule Configuration** pane, select the **File Content** tab > **Link** to link the storage account.

    :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/file-content-inline.png" alt-text="Screenshot of selecting the link option to connect with the Storage account." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/file-content-expanded.png":::

1. On the **Content Location for Change Tracking** pane, select your **Subscription** and **Storage** account to be used for file content change tracking.
1. Confirm if you are using **System Assigned Managed Identity**. 
1. Select **Upload file content for all settings**, and then select **Save** to ensure that the file content changes for all the files residing in this DCR are tracked.

#### [System Assigned Managed Identity](#tab/sa-mi)

When the storage account is linked using the system assigned managed identity, a blob is created. For system-assigned managed identity, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), go to **Storage accounts**, and select the storage account.
1. On the **Storage accounts** pane, under **Data storage**, select **Containers** > **Changetracking blob** > **Access Control (IAM)**.
1. On the **Changetrackingblob | Access Control (IAM)** pane, select **Add** and, then select **Add role assignment**.

    :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/blob-add-role-inline.png" alt-text="Screenshot of selecting to add role." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/blob-add-role-expanded.png":::

1. On the **Add role assignment** pane, use the search for **Blob Data contributor** to assign a storage Blob contributor role for the specific VM. This permission provides access to read, write, and delete storage blob containers and data.

    :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/blob-contributor-inline.png" alt-text="Screenshot of selecting the contributor role for storage blog." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/blob-contributor-expanded.png":::

1. Select the role and assign it to your virtual machine.

     :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/blob-add-role-virtual-machine-inline.png" alt-text="Screenshot of assigning the role to VM." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/blob-add-role-virtual-machine-expanded.png":::

#### [User Assigned Managed Identity](#tab/ua-mi)

For user-assigned managed identity, follow these steps to assign the user assigned managed identity to the VM and provide the permission.

1. On the **Storage accounts** pane, under **Data storage**, select **Containers** > **Changetracking blob** > **Access Control (IAM)**.
1. On **Changetrackingblob | Access Control (IAM)** pane, select **Add**, and then select **Add role assignment**.
1. Search for **Storage Blob Data Contributor**, select the role and assign it to your user-assigned managed identity.

     :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/user-assigned-add-role-inline.png" alt-text="Screenshot of adding the role to user-assigned managed identity." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/user-assigned-add-role-expanded.png":::

1. Go to your virtual machine, under **Settings**, select **Identity**. Under the **User assigned** tab, select **+ Add**.

1. In the **Add user assigned managed identity**, select the **Subscription** and add the user-assigned managed identity.
     :::image type="content" source="media/tutorial-change-workspace-configure-data-collection-rule/user-assigned-assign-role-inline.png" alt-text="Screenshot of assigning the role to user-assigned managed identity." lightbox="media/tutorial-change-workspace-configure-data-collection-rule/user-assigned-assign-role-expanded.png":::
---

#### Upgrade the extension version for Windows and Linux

> [!NOTE]
> Ensure that ChangeTracking-Linux/ ChangeTracking-Windows extension version is upgraded to the current general release version: [GA Extension Version](../azure-change-tracking-inventory/extension-version-details.md)

Use the following command to upgrade the extension version:

```azurecli-interactive
az vm extension set -n {ExtensionName} --publisher Microsoft.Azure.ChangeTrackingAndInventory --ids {VirtualMachineResourceId} 
```
The extension for Windows is `Vms - ChangeTracking-Windows`and for Linux is `Vms - ChangeTracking-Linux`.

### Configure using wildcards
 
To configure the monitoring of files and folders using wildcards, consider the following: 

- Wildcards are required for tracking multiple files. 
- Wildcards can only be used in the last segment of a path, such as C:\folder\file or /etc/.conf* 
- If an environment variable includes a path that is not valid, validation will succeed but the path will fail when inventory runs. 
- When setting the path, avoid general paths such as *C: \* which will result in too many folders being traversed. 

## Next steps

To enable Azure Change Tracking and Inventory (CTI) from the Azure portal, see [Quickstart: Enable Azure Change Tracking and Inventory](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md).
