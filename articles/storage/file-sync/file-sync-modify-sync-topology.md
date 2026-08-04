---
title: Modify Azure File Sync Topology
description: Guidance on how to modify your Azure File Sync topology and avoid errors or data loss.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 08/04/2026
ms.author: kendownie
# Customer intent: "As an IT administrator managing Azure File Sync, I want to modify the sync topology of my server endpoints, so that I can ensure data integrity and minimize the risk of errors or data loss during the changes."
---

# How to modify your Azure File Sync topology

This article covers the most common ways customers want to modify their Azure File Sync topology and provides recommendations for how to do so. Each section describes an independent scenario, so go to the section that matches your situation. To avoid errors or potential data loss, follow the best practices in this article when modifying your Azure File Sync topology.

## Migrate a server endpoint to a different Storage Sync Service

Migrating a server endpoint moves the sync configuration to a new sync group or Storage Sync Service. This change doesn't affect the data in the Azure file share. After you ensure that your data is up to date on your local server, [deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md#scenario-2-i-want-to-delete-server-endpoint-and-i-need-the-azure-file-sync-server-to-have-the-entire-dataset). Then, reprovision the server endpoint in the desired sync group and Storage Sync Service.

If you want to migrate all server endpoints associated with a server to a different sync group or Storage Sync Service, see [Deprovision all server endpoints associated with a registered server](#deprovision-all-server-endpoints-associated-with-a-registered-server).

## Change the path scope of a server endpoint

You define a server endpoint by a path on your server, such as a specific subfolder like `D:\Data\Sales`. Changing the path scope means syncing at a broader or narrower level. For example, you might move to the parent folder `D:\Data` or to a full volume `D:\`.

To change the path scope, confirm your data is up to date on your local server. Then, [deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md#scenario-2-i-want-to-delete-server-endpoint-and-i-need-the-azure-file-sync-server-to-have-the-entire-dataset) and reprovision the server endpoint with the new path.

## Deprovision Azure File Sync topology

Use this procedure to completely remove Azure File Sync from your environment, including sync groups, cloud endpoints, server endpoints, and the Storage Sync Service resource. To preserve data integrity, deprovision Azure File Sync resources in a specific order.

To deprovision, go to the Storage Sync Service resource in the Azure portal and select a sync group in the Storage Sync Service. Follow the steps in [Deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md) to ensure data integrity and availability when deleting server endpoints. To deprovision your sync group or Storage Sync Service, you must delete all server endpoints. If you only want to delete specific server endpoints, you can stop here.

Deprovision Azure File Sync resources in this order:

1. Delete server endpoints.
1. After you delete all the server endpoints in the sync group, delete the cloud endpoint.
1. Then delete the sync group.

Repeat these steps for all the sync groups in the Storage Sync Service that you want to delete. After you've deleted all the sync groups in that Storage Sync Service, delete the Storage Sync Service resource.

> [!NOTE]
> When you enable managed identities, you might need to wait longer to delete the Storage Sync Service. See [Unable to delete a Storage Sync Service](/troubleshoot/azure/azure-storage/files/file-sync/file-sync-troubleshoot-managed-identities#unable-to-delete-a-storage-sync-service).

After you complete the steps, you can delete your storage resources such as file shares and storage accounts.

## Change a server endpoint path

A server endpoint path is an immutable property. Choosing a different location on the server has consequences for the data in the old location, the Azure file share, and the new location. Most of these behaviors are undefined if you were to simply change the path. You can only remove a server endpoint and then create a new server endpoint with the new path. Carefully consider the sync state of your server to find the right time to perform this large change.

Deleting a server endpoint isn't trivial and can lead to data loss if done in the wrong way. The [delete server endpoint article](file-sync-server-endpoint-delete.md) guides you through the process.

If you're currently using the D drive and plan on migrating to the cloud, see [Make the D: drive of a VM a data disk - Azure Virtual Machines](/azure/virtual-machines/windows/change-drive-letter).

## Rename a sync group

You can't rename a sync group. The sync group name is part of the URL that stores and manages the child resources for the cloud endpoint and server endpoints. Choose the name carefully when you create the resource. To effectively rename a sync group, deprovision it and create a new one with the desired name.

## Deprovision all server endpoints associated with a registered server

Use this procedure if you're decommissioning a server and want to remove all of its server endpoints at once. For example, if you're retiring hardware or removing a server from your Azure File Sync deployment, this approach lets you unregister the server in one step rather than deleting each endpoint individually.

To ensure that your data is safe and fully updated before deprovisioning, see [Deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md).

Removing all server endpoints in bulk shouldn't be done except in the case of a test deployment with disposable data on the server and in the cloud. Unregistering the server from the Azure File Sync *Storage Sync Service* causes a bulk removal of all server endpoints. If you use this method, you'll likely lose data.

To unregister a server regardless of the negative implications, navigate to your Storage Sync Service resource and go to the **Registered servers** tab. Select the server you'd like to unregister and select **Unregister server**. All server endpoints associated with that server will be removed.

## Next step

- [Deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md)


