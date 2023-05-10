---
title: Manage file access logs in Azure NetApp Files
description: File access logs provide file access logging for individual volumes, capturing file system operations on selected volume
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 05/09/2023
ms.author: anfdocs
ms.custom: references_regions
---
# Manage file access logs in Azure NetApp Files

File access logs provide file access logging for individual volumes, capturing file system operations on selected volumes. The logs capture [standard file operation](#recognized-events). File access logs are provided on top of the platform logging captured in the [Azure Activity Log](../azure-monitor/essentials/activity-log.md). This article describes how to manage file access logs using Azure NetApp Files. 

**File access logs supports SMB3, NFSv4.1, and dual protocols.**

## Considerations

* Once file access logs are enabled on a volume, they can take up to five minutes to become visible. 
* File access logs occasionally create duplicate logs that must be manually filtered. 
* If you delete any diagnostic settings configured for `ANFFileAccess`, it will disable file access logs for any volumes with that setting. 
* Before enabling file access logs on a volume, either [ACLs](configure-access-control-lists.md) or Audit ACEs need to be set on a file or directory. You must set ACLs or Audit ACEs after mounting a volume.  
* File access logs provide no explicit or implicit expectations or guarantees around logging for auditing and compliance purposes. 

## Recognized events

The events capture in file access logs depend on the protocol your volume uses. 

### Logged NFS events
* Close
* Create
* Get attributes
* Link
* `Nverify`
* Open
* Open attribute
* Read
* Remove
* Rename
* Set attribute 
* Verify 
* Write

### Logged SMB events
* Create
* Delete
* Get attributes
* Hard link
* Open object
* Open object with the intent to delete
* Read
* Rename
* Set attribute 
* Unlink
* Write

## Register the feature

The file access logs feature is currently in preview. If you're using this feature for the first time, you need to register the feature first. 

1. Register the feature:
    `Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFFileAccessLogs`
1. Check the status:
    `Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFFileAccessLogs`

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.

## Supported regions

While in preview, file access logs is supported in:

* East US 2
* Japan East

<!-- 9 may 2023 -->
## Set SACLs or Audit ACEs on files and directories  

You must set system access control lists (SACLs) for SMB shares or Audit ACEs (for NFSv4.1 shares) for auditing. 

After mounting the volume, SACLs (for an SMB/CIFS share) or Audit ACEs (for an NFSv4.1 mount) needs to be set on files/directories for auditing of file operations to happen on the volume. 

### [Set SACLs for SMB shares](#tab/sacls-smb)

There are three ways to set SACLs for access logs. 

If you're logging access events on all files and directories within a volume, set SACLs by applying Storage-Level Access Guard security. 

If you're logging access events on individual files and directories, setting of SACLs with:
* The Windows Explorer GUI
* The `fsecurity` command 

>[!NOTE]
> Select only the events you need to log. Selecting too many log options may impact system performance. 

To enable logging access on individual files and directories, complete the following steps on the  Windows administration host. 

#### Steps 

To enable logging access on individual files and directories, complete the following steps on the  Windows administration host. 

1. Select the file or directory for which to enable logging access. 
1. Right-click the file or directory, then select **Properties**. 
1. Select the **Security** tab then **Advanced**.
1. Select the **Auditing** tab. Add, edit, or remove the auditing options you want. 

### [Set Audit ACEs for NFSv4.1 shares](#tab/sacls-nfs)

Configure logging for UNIX security style files and directories by adding audit ACEs to NFSv4.1 ACLs to monitoring of certain NFS file and directory access events for security purposes. 

For NFSv4.1, both discretionary and system ACEs are stored in the same ACL, not separate DACLs and SACLs. Exercise caution when adding audit ACEs to an existing ACL to avoid overwriting and losing an existing ACL. The order in which you add audit ACEs to an existing ACL doesn't matter. 

For steps, see [Configure access control lists on NFSv4.1 volumes](configure-access-control-lists.md).

<!-- end -->
---

## Enable file access logs

1. In the **Volumes** menu, select the volume you want to enable file access logs for. 
1. Select **Diagnostic settings** from the left-hand pane.
1. Select **+ Add diagnostic setting**.
:::image type="content" source="../media/azure-netapp-files/logs-diagnostic-settings-add.png" alt-text="Screenshot of Azure Diagnostic settings menu.":::
1. In the **Diagnostic setting** page, provide a diagnostic setting name.
    Under **Logs > Categories**, select **ANFFileAccess** and then set the retention period of the logs. 
:::image type="content" source="../media/azure-netapp-files/logs-diagnostic-settings-enable.png" alt-text="Screenshot of Azure Diagnostic settings menu with file access diagnostic setting.":::
<!-- check these steps -->
1. Select one of the destination options for the logs:
    * Archive to a storage account
    * Stream to an event hub
    * Send to Log Analytics workplace
    * Send to a partner solution
1. Save the settings.

## Disable file access logs

1. In the **Volumes** menu, select the volume on which you want to disable file access logs.
2. Select the **Diagnostic setting** menu from the left-hand pane. 
3. In the **Diagnostic settings** page, deselect **ANFFileAccess**.
4. Save the settings.

>[!NOTE]
>After disabling file access logs, you must wait at least ten minutes before attempting to enable or re-enable file access logs on any volume.
 
## Next Steps

* [Security FAQs](faq-security.md) 
* [Azure resource logs](..\azure-monitor\essentials\resource-logs.md)
