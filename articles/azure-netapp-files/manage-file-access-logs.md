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
ms.date: 05/12/2022
ms.author: anfdocs
---
# Manage file access logs in Azure NetApp Files

File access logs provide file access logging for individual volumes, capturing file system operations on selected volumes. Standard file system operations will be captured in the logs. File access logs are provided on top of the platform logging captured in the [Azure Activity Log](../azure-monitor/essentials/activity-log.md). This article describes how to manage file access logs using Azure NetApp Files. 

**File access logs supports SMB3, NFSv4.1, and dual protocols.**

## Considerations

* Once file access logs are enabled on a volume, they can take a maximum of five minutes to become visible. 
* File access logs occasionally create duplicate logs that must be manually filtered. 
* Deleting any diagnostic settings configured for ANFFileAccess causes any file access logs for any volumes with that setting to be disabled. 
* Before enabling file access logs on a volume, either ACLs or Audit ACEs need to be set on a file or directory. ACLs or Audit ACEs must be set after mounting a volume.  
* File access logs provide no explicit or implicit expectations or guarantees around logging for auditing and compliance purposes. 

## Recognized events

File access logs captures different file and directory events depending on the protocol used. 

### NFS events
* Close
* Create
* Get attributes
* Link
* Nverify
* Open
* Open attribute
* Read
* Remove
* Rename
* Set attribute 
* Verify 
* Write

### SMB events
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
1. Register the feature:<br>`Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFFileAccessLogs`
2. Check the status:<br>`Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFFileAccessLogs`

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.

## Enable file access logs

1. Select the volume you want to enable file access logs for. 
2. Select **Diagnostic settings** from the left-hand pane.
:::image type="content" source="../media/azure-netapp-files/logs-diagnostic-settings-add.png" alt-text="Azure Diagnostic settings menu showing how to add ANF file access logs.":::
3. In the **Diagnostic settings** page, provide a diagnostic setting name, select *ANFFileAccess* and then set the retention period of the logs. 
:::image type="content" source="../media/azure-netapp-files/logs-diagnostic-settings-enable.png" alt-text="Azure Diagnostic settings menu showing how to enable ANF file access logs":::
4. Select one of the destination options for the logs:
    * Archive to a storage account
    * Stream to an event hub
    > [!IMPORTANT]
    > Two additional options are presented in the UI: **Send to Log Analytics workspace** and **Send to a partner solution**. These options are not supported. No error message will display if you select these destination options, and you will not be able to access your logs. 
5. Save the settings

## Disable file access logs

1. Select the volume on which you want to disable file access logs.
2. Select the **Diagnostic setting** menu from the left-hand pane. 
3. In the **Diagnostic settings** page, deselect **ANFFileAccess**.
4. Save the settings.
 
## Next Steps

* [Security FAQs](faq-security.md) 
* [Azure resource logs](..\azure-monitor\essentials\resource-logs.md)