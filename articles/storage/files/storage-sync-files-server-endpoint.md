---
title: Add/remove an Azure File Sync (preview) Server Endpoint | Microsoft Docs
description: Learn what to consider when planning for an Azure Files deployment.
services: storage
documentationcenter: ''
author: wmgries
manager: klaasl
editor: jgerend

ms.assetid: 297f3a14-6b3a-48b0-9da4-db5907827fb5
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: wgries
---

# Add/remove an Azure File Sync (preview) Server Endpoint
With Azure File Sync (preview), shares can be replicated on-premises or in Azure and accessed through SMB or NFS shares on Windows Server. Azure File Sync is useful for scenarios in which data needs to be accessed and modified far away from an Azure datacenter, such as in a branch office scenario. Data may be replicated between multiple Windows Server endpoints, such as between multiple branch offices.

A *Server Endpoint* represents a specific location on a *Registered Server*, such as a folder on a server volume or the root of the volume. Multiple Server Endpoints can exist on the same volume if their namespaces are not overlapping (for example, F:\sync1 and F:\sync2). You can configure cloud tiering policies individually for each Server Endpoint. If you add a server location with an existing set of files as a Server Endpoint to a Sync Group, those files will be merged with any other files already on other endpoints in the Sync Group.

See [How to deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md) for information on how to deploy Azure File Sync end-to-end.

## Prerequisites
To create a Server Endpoint, you must first ensure that the following criteria are met: 
- The server has the Azure File Sync agent installed and has been registered. Instructions for installing the Azure File Sync Agent can be found in the [Register/unregister a server with Azure File Sync (preview)](azure-file-sync-server-registration.md) article. 
- Ensure that a Storage Sync Service has been deployed. See [How to deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md) for details on how to deploy a Storage Sync Service. 
- Ensure that a Sync Group has been deployed. Learn how to [Create a Sync Group](storage-sync-files-deployment-guide.md#create-a-sync-group).
- Ensure that the server is connected to the internet and that Azure is accessible.

## Add a Server Endpoint
To add a Server Endpoint, navigate to the desired Sync Group, and click "Add server endpoint".

![Add a new Server Endpoint in the Sync Group pane](media/storage-sync-files-server-endpoint/add-server-endpoint-1.png)

The resulting "Add server endpoint" pane requires the following information to create a Server Endpoint:

- **Registered Server**: The name of the server or cluster to create the Server Endpoint on.
- **Path**: The Path on the Windows Server to be synchronized as part of the Sync Group.
- **Cloud Tiering**: A switch to enable or disable cloud tiering, which enables infrequently used or access files to be tiered to Azure Files.
- **Volume Free Space**: the amount of free space to reserve on the volume which the Server Endpoint resides. For example, if the Volume Free Space is set to 50% on a volume with a single Server Endpoint, roughly half the amount of data will be tiered to Azure Files. Regardless of whether cloud tiering is enabled, your Azure File share always has a complete copy of the data in the Sync Group.

Click "Create" to add the Server Endpoint. The files within a namespace of a Sync Group will now be kept in sync. 

## Remove a Server Endpoint
### (Optional) Recall all tiered data
When enabled for a Server Endpoint, cloud tiering will *tier* files to your Azure File shares. This enables on-premises file shares to act as a cache, rather than a complete copy of the dataset, to make efficient use of the space on the file server. However, if a Server Endpoint is removed with tiered files still locally on the server, those files will become unaccessible. Therefore, if continued file access is desired, you must recall all tiered files from Azure Files before continuing with deregistration. 

This can be done with the simple PowerShell cmdlet as shown below:

```PowerShell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Invoke-StorageSyncFileRecall -Path <path-to-to-your-server-endpoint>
```

> [!Warning]  
> If the local volume hosting the server does not have enough free space to recall all the tiered data, the `Invoke-StorageSyncFileRecall` cmdlet will fail.  

### Remove the Server Endpoint from all Sync Groups
Before unregistering the server on the Storage Sync Service, all Server Endpoints for that server must be removed. This can be done via the Portal:

1. Navigate to the Storage Sync Service where your server is registered.
2. Navigate to the desired Sync Group.
3. Remove the Server Endpoint you desire in the Sync Group in the Storage Sync Service. This can be accomplished by right-clicking the relevant Server Endpoint in the Sync Group pane.

    ![Removing a Server Endpoint from a Sync Group](media/storage-sync-files-server-endpoint/remove-server-endpoint-1.png)

## Next steps
- [Register/unregister a server with Azure File Sync (preview)](azure-file-sync-server-registration.md)
- [Azure File Sync network throttling](azure-file-sync-network-throttling.md)
- [Planning for an Azure File Sync deployment](planning-azure-file-sync-deployment.md)