---
title: Manage file access logs in Azure NetApp Files
description: File access logs provide file access logging for individual volumes, capturing file system operations on selected volume
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 04/01/2025
ms.author: anfdocs
ms.custom: references_regions
---

# Manage file access logs in Azure NetApp Files (preview)

File access logs provide file access logging for individual volumes, capturing file system operations on selected volumes. The logs capture [standard file operation](#recognized-events). File access logs provide insights beyond the platform logging captured in the [Azure Activity Log](/azure/azure-monitor/essentials/activity-log).

## Considerations

>[!IMPORTANT]
>The file access logs feature is only supported with SMB3, NFSv4.1, and dual-protocol volumes. It's not supported on NFSv3 volumes. 

* Once file access logs are enabled on a volume, they can take up to 75 minutes to become visible. 
* Each log entry consumes approximately 1 KB of space.
* File access logs occasionally create duplicate log entries that must be filtered manually. 
* Deleting any diagnostic settings configured for `ANFFileAccess` causes any file access logs for any volume with that setting to become disabled. See the [diagnostic setting configuration](#diagnostic) for more information. 
* Before enabling file access logs on a volume, either [access control lists (ACLs)](configure-access-control-lists.md) or Audit access control entries (ACEs) need to be set on a file or directory. You must set ACLs or Audit ACEs after mounting a volume.  
* File access logs provide no explicit or implicit expectations or guarantees around logging for auditing and compliance purposes. 

### Performance considerations 

* All file access log file access events have a performance impact.
    * Events such as file/folder creation or deletion are key events to log. 
    * System access control list (SACL) settings for logging should be used sparingly. Frequent operations (for example, READ or GET) can have significant performance impact, but have limited logging value. It's recommended that SACL setting not log these frequent operations to conserve performance. 
    * SACL policy additions aren't currently supported with file access logs. 
* When clubbing events such as READ/WRITE, only a handful of operation per file read or write are captured to reduce event logging rate.  
* File access logs support a [log generation rate metric](azure-netapp-files-metrics.md). The log generation rate shouldn't exceed 64 MiB/minute.

    If the rate of file access event generation exceeds 64 MiB/minute, the [Activity log](monitor-azure-netapp-files.md) sends a message stating that the rate of file access log generation is exceeding the limit. If log generation exceeds the limit, logging events can be delayed or dropped. If you're approaching this limit, disable noncritical auditing ACLs to reduce the event generation rate. As a precaution, you can [create an alert](/azure/azure-monitor/alerts/alerts-create-activity-log-alert-rule) for this event.
 
* During migration or robocopy operations, disable file access logs to reduce log generation. 
* It's recommended you avoid enabling file access logs on files with more than 450 ACEs to avoid performance issues. 

## Recognized events

The events capture in file access logs depend on the protocol of your volume.

### Logged NFS events
* Close
* Create
* Get attributes
* Link
* `Nverify`
* Open
* Open attribute
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

    ```azurepowershell-interactive
      Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFFileAccessLogs
    ```

1. Check the status of the registration: 

    > [!NOTE]
    > The **RegistrationState** can be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFFileAccessLogs`
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.

## Supported regions

Availability for file access log is limited to the following regions: 

- Australia Central
- Australia East
- Australia Southeast
- Brazil South
- Canada Central
- Canada East
- Central India
- Central US
- East US
- East US 2
- Japan West
- North Europe
- South Central US
- Switzerland North
- Switzerland West
- UK South
- US Gov Virginia
- West Europe
- West US
- West US 2

## Set SACLs or Audit ACEs on files and directories  

You must set SACLs for SMB shares or Audit ACEs for NFSv4.1 exports for auditing. 

### [Set SACLs for SMB shares](#tab/sacls-smb)

If you're logging access events on all files and directories within a volume, set SACLs by applying Storage-Level Access Guard security. 

>[!NOTE]
> Select only the events you need to log. Selecting too many log options can impact system performance. 

To enable logging access on individual files and directories, complete the following steps on the  Windows administration host. 

#### Steps 

To enable logging access on individual files and directories, complete the following steps on the  Windows administration host. 

1. Select the file or directory for which to enable logging access. 
1. Right-click the file or directory, then select **Properties**. 
1. Select the **Security** tab then **Advanced**.
1. Select the **Auditing** tab. Add, edit, or remove the auditing options you want. 


### [Set Audit ACEs for NFSv4.1 shares](#tab/sacls-nfs)

For NFSv4.1, both discretionary and system ACEs are stored in the same ACL, not separate discretionary ACLs and SACLs. Exercise caution when adding audit ACEs to an existing ACL to avoid overwriting and losing an existing ACL. The order in which you add audit ACEs to an existing ACL doesn't matter. 

**For steps**, see [Configure access control lists on NFSv4.1 volumes](configure-access-control-lists.md).

---

## Enable file access logs

1. In the **Volumes** menu, select the volume you want to enable file access logs for. 
1. Select **Diagnostic settings** from the left-hand pane.
1. Select **+ Add diagnostic setting**.
:::image type="content" source="./media/manage-file-access-logs/logs-diagnostic-settings-add.png" alt-text="Screenshot of Azure Diagnostic settings menu.":::
1. <a name="diagnostic"></a> In the **Diagnostic setting** page, provide a diagnostic setting name.
    Under **Logs > Categories**, select **ANFFileAccess** then set the retention period of the logs. 
:::image type="content" source="./media/manage-file-access-logs/logs-diagnostic-settings-enable.png" alt-text="Screenshot of Azure Diagnostic settings menu with file access diagnostic setting.":::
1. Select one of the destination options for the logs:
    * Archive to a storage account
    * Stream to an event hub
    * Send to Log Analytics workplace
    * Send to a partner solution
1. Save the settings.

## Disable file access logs

1. In the **Volumes** menu, select the volume on which you want to disable file access logs.
2. Select the **Diagnostic setting** menu from the left-hand pane. 
3. In the **Diagnostic settings** page, deselect **Audit**. This automatically deselects **ANFFileAccess**.
4. Select **Save**. 

>[!NOTE]
>After disabling file access logs, you must wait at least ten minutes before attempting to enable or re-enable file access logs on any volume.
 
## Next Steps

* [Security FAQs](faq-security.md) 
* [Azure resource logs](/azure/azure-monitor/essentials/resource-logs)
* [Understand NFSv4.x access control lists in Azure NetApp Files](nfs-access-control-lists.md)
* [Understand SMB file permissions in Azure NetApp Files](network-attached-file-permissions-smb.md)