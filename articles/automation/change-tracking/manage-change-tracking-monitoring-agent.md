---
title: Manage change tracking and inventory in Azure Automation using Azure Monitoring Agent
description: This article tells how to use change tracking and inventory to track software and Microsoft service changes in your environment using Azure Monitoring Agent
services: automation
ms.subservice: change-inventory-management
ms.date: 07/17/2023
ms.topic: conceptual
---

# Manage change tracking and inventory using Azure Monitoring Agent

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article describes how to manage change tracking, and includes the procedure on how you can change a workspace and configure data collection rule.

>[!NOTE]
>Before using the procedures in this article, ensure that you've enabled Change Tracking and Inventory on your VMs. For detailed information on how you can enable, see [Enable change tracking and inventory from portal](enable-vms-monitoring-agent.md)


## Configure Windows, Linux files, and Windows Registry using Data Collection Rules

To manage tracking and inventory, ensure that you enable Change tracking with AMA on your VM. 

1. In the [Azure portal](https://portal.azure.com), select the virtual machine.
1. Select a specific VM for which you would like to configure the Change tracking settings. 
1. Under **Operations**, select **Change tracking**
1. Select **Settings** to view the **Data Collection Rule Configuration** (DCR) page. Here, you can do the following actions:
   1. Configure changes on a VM at a granular level.  
   1. Select the filter to configure the workspace.
   1. Use the filter to view all the DCRs that are configured to the specific LA workspace level.

   >[!NOTE]
   >The settings that you configure are applicable to all the VMs that are attached to a specific DCR. For more information about DCR, see [Data collection rules in Azure Monitor](../../azure-monitor/essentials/data-collection-rule-overview.md).

1. Select **Add** to configure new file settings
   
   #### [Windows Files](#tab/windows)

    In the **Add Windows File setting** pane, enter the information for the file or folder to track and 
    click **Save**. The following table defines the properties that you can use for the information.

    |**Property**|**Description**|
    |---|---|
    |Enabled | True if the setting is applied, and false otherwise.|
    |Item Name | Friendly name of the file to be tracked. | 
    |Group | A group name to group files logically| 
    |Path | The path to check for the file, for example, **c:\temp\*.txt.** You can also use environment variables, such as %winDir%\System32\\\*.*. 
    |Path Type | The type of path. Possible values are File and Folder.|
    |Recursion | True if recursion is used when looking for the item to be tracked, and False otherwise. |

   #### [Linux Files](#tab/linux)

    In the **Add Linux File for Change Tracking** page, enter the information for the file or directory to 
    track and then select **Save**. The following table defines the properties that you can use for the information. 
    
    |**Property**|**Description**|
    |---|---|
    |Enabled | True if the setting is applied, and false otherwise.|
    |Item Name | Friendly name of the file to be tracked. | 
    |Group | A group name to group files logically| 
    |Path | The path to check for the file, for example, /etc/*.conf.  
    |Path Type | The type of path. Possible values are File and Folder.|
    |Recursion | True if recursion is used when looking for the item to be tracked, and False otherwise. |
   
---

You can now view the virtual machines configured to the DCR.


### Configure file content changes

To configure file content changes, follow these steps:

1. In your virtual machine, under **Operations**, select **Change tracking** > **Settings**.
1. In the **Data Collection Rule Configuration (Preview)** page, select **File Content** > **Link** to link the storage account.

    :::image type="content" source="media/manage-change-tracking-monitoring-agent/file-content-inline.png" alt-text="Screenshot of selecting the link option to connect with the Storage account." lightbox="media/manage-change-tracking-monitoring-agent/file-content-expanded.png":::

1. In **Content Location for Change Tracking** screen, select your **Subscription**, **Storage** and confirm if you are using **System Assigned Managed Identity**. 
1. Select **Upload file content for all settings**, and then select **Save**. It ensures that the file content changes for all the files residing in this DCR will be tracked.

#### [System Assigned Managed Identity](#tab/sa-mi)

When the storage account is linked using the system assigned managed identity, a blob is created.

1. From [Azure portal](https://portal.azure.com), go to **Storage accounts**, and select the storage account.
1. In the storage account page, under **Data storage**, select **Containers** > **Changetracking blob** > **Access Control (IAM)**.
1. In the **Changetrackingblob | Access Control (IAM)** page, select **Add** and then select **Add role assignment**.

    :::image type="content" source="media/manage-change-tracking-monitoring-agent/blob-add-role-inline.png" alt-text="Screenshot of selecting to add role." lightbox="media/manage-change-tracking-monitoring-agent/blob-add-role-expanded.png":::

1. In the **Add role assignment** page, use the search for **Blob Data contributor** to assign a storage Blob contributor role for the specific VM. This permission provides access to read, write, and delete storage blob containers and data.

    :::image type="content" source="media/manage-change-tracking-monitoring-agent/blob-contributor-inline.png" alt-text="Screenshot of selecting the contributor role for storage blog." lightbox="media/manage-change-tracking-monitoring-agent/blob-contributor-expanded.png":::

1. Select the role and assign it to your virtual machine.

     :::image type="content" source="media/manage-change-tracking-monitoring-agent/blob-add-role-vm-inline.png" alt-text="Screenshot of assigning the role to VM." lightbox="media/manage-change-tracking-monitoring-agent/blob-add-role-vm-expanded.png":::

#### [User Assigned Managed Identity](#tab/ua-mi)

For user-assigned managed identity, follow these steps to assign the user assigned managed identity to the VM and provide the permission.

1. In the storage account page, under **Data storage**, select **Containers** > **Changetracking blob** > **Access Control (IAM)**.
1. In **Changetrackingblob | Access Control (IAM)** page, select **Add** and then select **Add role assignment**.
1. Search for **Storage Blob Data Contributor**, select the role and assign it to your user-assigned managed identity.
    
     :::image type="content" source="media/manage-change-tracking-monitoring-agent/user-assigned-add-role-inline.png" alt-text="Screenshot of adding the role to user-assigned managed identity." lightbox="media/manage-change-tracking-monitoring-agent/user-assigned-add-role-expanded.png":::

1. Go to your virtual machine, under **Settings**, select **Identity**, under **User assigned** tab, select **+Add**.

1. In the **Add user assigned managed identity**, select the **Subscription** and add the user-assigned managed identity.
     :::image type="content" source="media/manage-change-tracking-monitoring-agent/user-assigned-assign-role-inline.png" alt-text="Screenshot of assigning the role to user-assigned managed identity." lightbox="media/manage-change-tracking-monitoring-agent/user-assigned-assign-role-expanded.png":::
---

#### Upgrade the extension version

> [!NOTE]
> Ensure that ChangeTracking-Linux/ ChangeTracking-Windows extension version is upgraded to 2.13

Use the following command to upgrade the extension version:

```azurecli-interactive
az vm extension set -n {ExtensionName} --publisher Microsoft.Azure.ChangeTrackingAndInventory --ids {VirtualMachineResourceId} 
```
The extension for Windows is `Vms - ChangeTracking-Windows`and for Linux is `Vms - ChangeTracking-Linux`.

### Configure using wildcards
 
To configure the monitoring of files and folders using wildcards, do the following: 

- Wildcards are required for tracking multiple files. 
- Wildcards can only be used in the last segment of a path, such as C:\folder\file or /etc/.conf* 
- If an environment variable includes a path that is not valid, validation will succeed but the path will fail when inventory runs. 
- When setting the path avoid general paths such as c:.** which will result in too many folders being traversed. 


## Disable Change Tracking from a virtual machine 

To remove change tracking with Azure Monitoring Agent from a virtual machine, follow these steps:

### Disassociate Data Collection Rule (DCR) from a VM

1. In Azure portal, select **Virtual Machines** and in the search, select the specific Virtual Machine. 
1. In the Virtual Machine page, under **Operations**, select **Change tracking** or in the search, enter Change tracking and select it from the search result.
1. Select **Settings** > **DCR** to view all the virtual machines associated with the DCR.
1. Select the specific VM for which you want to disable the DCR.
1. Select **Delete**.
   
   :::image type="content" source="media/manage-change-tracking-monitoring-agent/disable-dcr-inline.png" alt-text="Screenshot of selecting a VM to dissociate the DCR from the VM." lightbox="media/manage-change-tracking-monitoring-agent/disable-dcr-expanded.png":::

   A notification appears to confirm the disassociation of the DCR for the selected VM.

### Uninstall change tracking extension

1. In the Azure portal, select **Virtual Machines** and in the search, select the specific VM for which you have already disassociated the DCR.
1. In the Virtual Machines page, under **Settings**, select **Extensions + applications**.
1. In the **VM |Extensions + applications** page, under **Extensions** tab, select **MicrosoftAzureChangeTrackingAndInventoryChangeTracking-Windows/Linux**.

   :::image type="content" source="media/manage-change-tracking-monitoring-agent/uninstall-extensions-inline.png" alt-text="Screenshort of selecting the extension for a VM that is already disassociated from the DCR." lightbox="media/manage-change-tracking-monitoring-agent/uninstall-extensions-expanded.png":::

1. Select **Uninstall**.

## Next steps

* To learn about alerts, see [Configuring alerts](../change-tracking/configure-alerts.md).
