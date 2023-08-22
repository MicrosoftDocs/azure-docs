---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 02/16/2023
ms.author: pauljewell
ms.custom: include file
---

## Lease states and actions

The following diagram shows the five states of a lease, and the commands or events that cause lease state changes.

:::image type="content" source="../../articles/storage/blobs/media/blob-dev-guide/storage-dev-guide-blob-lease.png" alt-text="A diagram showing blob lease states and state change triggers." lightbox="../../articles/storage/blobs/media/blob-dev-guide/storage-dev-guide-blob-lease.png"::: 

The following table lists the five lease states, gives a brief description of each, and lists the lease actions allowed in a given state. These lease actions cause state transitions, as shown in the diagram.
  
| Lease state | Description | Lease actions allowed |  
| --- | --- | --- |
| **Available** | The lease is unlocked and can be acquired. | `acquire` |
| **Leased** | The lease is locked. | `acquire` (same lease ID only), `renew`, `change`, `release`, and `break` |
| **Expired** | The lease duration has expired. | `acquire`, `renew`, `release`, and `break` |
| **Breaking** | The lease has been broken, but the lease will continue to be locked until the break period has expired. | `release` and `break` |
| **Broken** | The lease has been broken, and the break period has expired. | `acquire`, `release`, and `break` |

When a lease expires, the lease ID is maintained by the Blob service until the blob is modified or leased again. A client may attempt to renew or release the lease using the expired lease ID. If this operation is successful, the client knows that the blob hasn't been changed since the lease ID was last valid. If the request fails, the client knows that the blob was modified, or the blob was leased again since the lease was last active. The client must then acquire a new lease on the blob.

If a lease expires rather than being explicitly released, a client may need to wait up to one minute before a new lease can be acquired for the blob. However, the client can renew the lease with their lease ID immediately if the blob hasn't been modified.

A lease can't be granted for a blob snapshot, since snapshots are read-only. Requesting a lease against a snapshot results in status code `400 (Bad Request)`.