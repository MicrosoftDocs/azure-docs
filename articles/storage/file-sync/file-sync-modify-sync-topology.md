---
title: Modify your Azure File Sync topology
description: Guidance on how to modify your Azure File Sync sync topology
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 4/23/2021
ms.author: kendownie
---

# Modify your Azure File Sync topology

This article covers the most common ways customers would like to modify their Azure File Sync topology and our recommendations for how to do so. If you would like to modify your Azure File Sync topology, refer to the best practices below to avoid errors and/or potential data loss.

## Migrate a server endpoint to a different Azure File Sync Storage Sync Service

Once you ensure that your data is up to date on your local server, deprovision your server endpoint. For detailed guidance, see [Deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md#scenario-2-you-intend-to-delete-your-server-endpoint-and-stop-using-this-specific-azure-file-share). Then reprovision in the desired sync group and Storage Sync Service.

If you would like to migrate all server endpoints associated with a server to a different sync group or Storage Sync Service, see [Deprovision all server endpoints associated with a registered server](#deprovision-all-server-endpoints-associated-with-a-registered-server).

## Change the granularity of a server endpoint

After you confirm your data is up to date on your local server (see [Deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md#scenario-2-you-intend-to-delete-your-server-endpoint-and-stop-using-this-specific-azure-file-share)), deprovision your server endpoint. Then reprovision at the desired granularity.

## Deprovision Azure File Sync topology

Azure File Sync resources must be deprovisioned in a specific order: server endpoints, sync group, and then Storage Service. While the entire flow is documented below, you may stop at any level you desire. 

First, navigate to the Storage Sync Service resource in the Azure portal and select a sync group in the Storage Sync Service. Follow the steps in [Deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md) to ensure data integrity and availability when deleting server endpoints. In order to deprovision your sync group or Storage Sync Service, all server endpoints must be deleted. If you only aim to delete specific server endpoints, you can stop here. 

Once you delete all the server endpoints in the sync group, delete the cloud endpoint. 

Then, delete the sync group. 

Repeat these steps for all the sync groups in the Storage Sync Service you would like to delete. Once all the sync groups in that Storage Sync Service have been deleted, delete the Storage Sync Service resource.

## Change a server endpoint path

A server endpoint path is an immutable property. Choosing a different location on the server has consequences for the data in the old location, the Azure file share, and the new location. Most of these behaviors are undefined if you were to simply change the path. You can only remove a server endpoint and then create a new server endpoint with the new path. Carefully consider the sync state of your server to find the right time to perform this large change.

Deleting a server endpoint is not trivial and can lead to data loss if done in the wrong way. The [delete server endpoint article](file-sync-server-endpoint-delete.md) guides you through the process.

If you are currently using the D drive and are planning on migrating to the cloud, see [Make the D: drive of a VM a data disk - Azure Virtual Machines](../../virtual-machines/windows/change-drive-letter.md).

## Rename a sync group

A sync group cannot be renamed. Its name is part of the URL with which the child resources cloud endpoint and server endpoints are stored and managed. Choose the name carefully when you create the resource.

## Deprovision all server endpoints associated with a registered server

To ensure that your data is safe and fully updated before deprovisioning, see [Deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md).

Removing all server endpoints in bulk should not be done, unless this is a test deployment with disposable data on the server and in the cloud. Unregistering the server from the Azure File Sync *Storage Sync Service* causes a bulk removal of all server endpoints. Data loss is a likely consequence of using this method. 

To unregister a server regardless of the negative implications, navigate to your Storage Sync Service resource, and go to the **Registered servers** tab. Select the server you would like to unregister and select **Unregister server**. All server endpoints associated with that server will be removed.

## Next steps
* [Deprovision your Azure File Sync server endpoint](./file-sync-server-endpoint-delete.md)


