---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 04/10/2023
ms.author: pauljewell
ms.custom: include file
---

A lease creates and manages a lock on a blob for write and delete operations. The lock duration can be 15 to 60 seconds, or can be infinite. A lease on a blob provides exclusive write and delete access to the blob. To write to a blob with an active lease, a client must include the active lease ID with the write request.

To learn more about lease states and when you can perform a given action on a lease, see [Lease states and actions](#lease-states-and-actions).

All container operations are permitted on a container that includes blobs with an active lease, including [Delete Container](/rest/api/storageservices/delete-container). Therefore, a container may be deleted even if blobs within it have active leases. Use the [Lease Container](/rest/api/storageservices/lease-container) operation to control rights to delete a container.