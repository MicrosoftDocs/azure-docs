---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-storage
ms.topic: include
ms.date: 04/10/2023
ms.author: pauljewell
ms.custom: include file
---

A lease establishes and manages a lock on a container for delete operations. The lock duration can be 15 to 60 seconds, or can be infinite. A lease on a container provides exclusive delete access to the container. A container lease only controls the ability to delete the container using the [Delete Container](/rest/api/storageservices/delete-container) REST API operation. To delete a container with an active lease, a client must include the active lease ID with the delete request. All other container operations succeed on a leased container without the lease ID. If you've enabled [container soft delete](../../articles/storage/blobs/soft-delete-container-overview.md), you can restore deleted containers.

To learn more about lease states and when you can perform a given action on a lease, see [Lease states and actions](#lease-states-and-actions).