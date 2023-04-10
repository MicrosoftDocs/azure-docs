---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: storage
ms.topic: include
ms.date: 04/10/2023
ms.author: pauljewell
ms.custom: include file
---

A lease establishes and manages a lock on a container for delete operations. The lock duration can be 15 to 60 seconds, or can be infinite. A lease on a container provides exclusive delete access to the container. A container lease only controls the ability to delete the container using the [Delete Container](/rest/api/storageservices/delete-container) REST API operation. To delete a container with an active lease, a client must include the active lease ID with the delete request. All other container operations will succeed on a leased container without the lease ID. If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

Lease operations are handled by the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class, which provides a client containing all lease operations for blobs and blob containers. To learn more about lease states and when you might perform an action on a lease, see [Lease states and actions](#lease-states-and-actions).