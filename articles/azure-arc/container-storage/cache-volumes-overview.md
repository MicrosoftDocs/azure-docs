---
title: Cache Volumes overview
description: Learn about the Cache Volumes offering from Azure Container Storage enabled by Azure Arc.
author: sethmanheim
ms.author: sethm
ms.topic: overview
ms.date: 08/26/2024

---

# Overview of Cache Volumes

This article describes the Cache Volumes offering from Azure Container Storage enabled by Azure Arc.

## How does Cache Volumes work?

:::image type="content" source="media/edge-storage-accelerator-overview.png" alt-text="Diagram of Azure Container Storage enabled by Azure Arc architecture." lightbox="media/edge-storage-accelerator-overview.png":::

Cache Volumes works by performing the following operations:

- **Write** - Your file is processed locally and saved in the cache. If the file doesn't change within 3 seconds, Cache Volumes automatically uploads it to your chosen blob destination.
- **Read** - If the file is already in the cache, the file is served from the cache memory. If it isn't available in the cache, the file is pulled from your chosen blob storage target.

## Next steps

- [Prepare Linux](prepare-linux.md)
- [How to install Azure Container Storage enabled by Azure Arc](install-edge-volumes.md)
- [Create a persistent volume](create-persistent-volume.md)
- [Monitor your deployment](azure-monitor-kubernetes.md)
