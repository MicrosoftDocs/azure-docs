---
 title: Description of Azure Storage alternative multi-region deployment reasons
 description: Description of Azure Storage alternative multi-region deployment reasons
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

The cross-region failover capabilities of Storage might be unsuitable because of the following reasons:

- Your storage account is in a nonpaired region.

- Your business uptime goals aren't satisfied by the recovery time or data loss that the built-in failover options provide.

- You need to fail over to a region that isn't your primary region's pair.

- You need an active/active configuration across regions.

Instead, you can design a cross-region failover solution that meets your needs. A complete treatment of deployment topologies for Storage is outside the scope of this article, but you can consider a multi-region deployment model.
