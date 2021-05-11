---
title: Modify your Azure File Sync topology | Microsoft Docs
description: Guidance on how to modify your Azure File Sync sync topology
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 4/23/2021
ms.author: rogarana
ms.subservice: files
---

# Modify your Azure File Sync topology

This article covers the most common ways customers would like to modify their Azure File Sync topology and our recommendations for how to do so. If you would like to modify your Azure File Sync topology, please refer to the best practices below to avoid errors and/or potential data loss.

## Migrate a server endpoint to a different Azure File Sync Storage Sync Service

Once you ensure that your data is up-to-date on your local server, deprovision your server endpoint. For guidance on how to do this, see [Deprovision your Azure File Sync server endpoint](./file-sync-deprovision-server-endpoint.md#scenario-2-you-intend-to-delete-your-server-endpoint-and-stop-using-this-specific-azure-file-share). Then reprovision in the desired sync group and Storage Sync Service.

If you would like to migrate all server endpoints associated with a server to a different sync group or Storage Sync Service, see [Deprovision all server endpoints associated with a registered server](#deprovision-all-server-endpoints-associated-with-a-registered-server).

## Change the granularity of a server endpoint

After you confirm your data is up-to-date on your local server (see [Deprovision your Azure File Sync server endpoint](./file-sync-deprovision-server-endpoint.md#scenario-2-you-intend-to-delete-your-server-endpoint-and-stop-using-this-specific-azure-file-share)), deprovision your server endpoint. Then reprovision at the desired granularity.

## Deprovision Azure File Sync topology

Azure File Sync resources must be deprovisioned in a specific order: server endpoints, sync group, and then Storage Service. While the entire flow is documented below, you may stop at any level you desire. 

First, navigate to the Storage Sync Service resource in the Azure portal and select a sync group in the Storage Sync Service. Follow the steps in [Deprovision your Azure File Sync server endpoint](./file-sync-deprovision-server-endpoint.md) to ensure data integrity and availability when deleting server endpoints. In order to deprovision your sync group or Storage Sync Service, all server endpoints must be deleted. If you only aim to delete specific server endpoints, you can stop here. 

Once you delete all the server endpoints in the sync group, delete the cloud endpoint. 

Then, delete the sync group. 

Repeat these steps for all the sync groups in the Storage Sync Service you would like to delete. Once all the sync groups in that Storage Sync Service have been deleted, delete the Storage Sync Service resource.

## Rename a server endpoint path or sync group

Currently, this is not supported. 

If you are currently using the D drive and are planning on migrating to the cloud, see [Make the D: drive of a VM a data disk - Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/windows/change-drive-letter).

## Deprovision all server endpoints associated with a registered server

To ensure that your data is safe and fully updated before deprovisioning, see [Deprovision your Azure File Sync server endpoint](./file-sync-deprovision-server-endpoint.md).

Navigate to your Storage Sync Service resource, and go to the Registered Servers tab. Select the server you would like to unregister and select **unregister server**. This will promptly deprovision all server endpoints associated with that server.

## Next steps
* [Deprovision your Azure File Sync server endpoint](./file-sync-deprovision-server-endpoint.md)



