---
title: Enable multi-region replication on Azure Managed HSM (Preview)
description: Enable Multi-Region Replication on Azure Managed HSM (Preview)
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 11/25/2022
ms.author: mbaldwin
ms.custom: references_regions
---
# Enable multi-region replication on Azure Managed HSM (Preview)

Multi-region replication allows you to extend a managed HSM pool from one Azure region (called a primary) to another Azure region (called a secondary). Once configured, both regions are active, able to serve requests, and with automated replication will share the same key material, roles, and permissions. The closest available region to the application will receive and fulfill the request thereby maximizing read throughput and latency. While regional outages are rare, multi-region replication will enhance the availability of mission critical cryptographic keys should one region become unavailable.  For more information on SLA, visit [SLA for Azure Key Vault Managed HSM](https://azure.microsoft.com/support/legal/sla/key-vault-managed-hsm/v1_0/).

## Architecture

:::image type="content" source="../media/multi-region-replication.png" alt-text="Architecture diagram of managed HSM Multi-Region Replication." lightbox="../media/multi-region-replication.png":::
When multi-region replication is enabled on a managed HSM, a second managed HSM pool, with three load-balanced HSM partitions will be created in the secondary region. When requests are issued to the Traffic Manager global DNS endpoint `<hsm-name>.managedhsm.azure.net`, the closest available region will receive and fulfill the request. While each region individually maintains regional high-availability due to the distribution of HSMs across the region, the traffic manager ensures that even if all partitions of a managed HSM in one region are unavailable due to a catastrophe, requests can still be served by the secondary managed HSM pool.

## Replication latency

Any write operation to the Managed HSM, such as creating or updating a key, creating or updating a role definition, or creating or updating a role assignment, may take up to 6 minutes before both regions are fully replicated. Within this window, it isn't guaranteed that the written material has replicated between the regions. Therefore, it's best to wait six minutes between creating or updating the key and using the key to ensure that the key material has fully replicated between regions. The same applies for role assignments and role definitions.

## Failover behavior

Failover occurs when one of the regions in a multi-region Managed HSM becomes unavailable due to an outage and the other region begins to service all requests. The outage may be limited to your HSM pool only, the entire Managed HSM service, or the entire Azure region. During failover, you may notice a change in behavior depending on the affected region.

| Affected Region | Reads Allowed | Writes Allowed |
|--|--|--|
| Secondary | Yes | Yes |
| Primary | Yes | Maybe |

If the secondary region becomes unavailable, read operations (get key, list keys, all crypto operations, list role assignments) will be available if the primary region is alive. Write operations (create and update keys, create and update role assignments, create and update role definitions) will also be available.

If the primary region is unavailable, read operations will be available, but write operations may not, depending on the scope of the outage.

## Time to failover

Under the hood, DNS resolution handles the redirection of requests to either the primary or secondary region.

If both regions are active, the Traffic Manager will resolve an incoming request to the location that has the closest geographical proximity or lowest network latency to the origin of the request. DNS records are configured with a default TTL of 5 seconds.

If a region reports an unhealthy status to the Traffic Manager, future requests will resolve to the other region if available. Clients caching DNS lookups may experience extended failover time. But once any client-side caches expire, future requests should route to the available region.

## Azure region support

The following regions are supported for the preview.

- UK South
- US West
- US Central *
- US West Central
- US East
- US East 2 *
- Europe North
- Europe West *
- Switzerland West
- Switzerland North
- Asia SouthEast
- India Central
- Australia East

> [!NOTE]
> US Central, US East 2, and Europe West cannot be extended as a secondary region at this time.

## Billing

Multi-region replication into secondary region incurs extra billing (x2) as a new HSM pool will be consumed in the secondary region. For more information, see  [Azure Managed HSM pricing](https://azure.microsoft.com/pricing/details/key-vault).

## Soft-delete behavior

The [Managed HSM soft-delete feature](soft-delete-overview.md) allows recovery of deleted HSMs and keys however in a multi-region replication enabled scenario, there are subtle differences where the secondary HSM must be deleted before soft-delete can be executed on the primary HSM. Additionally, when a secondary is deleted, it's purged immediately and doesn't go into a soft-delete state that stops all billing for the secondary.  You can always extend to a new region as the secondary from the primary if needed. 

### Azure CLI commands

If creating a new Managed HSM pool and then extending to a secondary, refer to [these instructions](quick-create-cli.md#create-a-managed-hsm) prior to extending.  If extending from an already existing Managed HSM pool, then use the following instructions to create a secondary HSM into  another region.  

### Install the multi-region managed HSM replication extension

```azurecli-interactive
az extension add -n keyvault-preview
```

### Add a secondary HSM in another region

To extend a managed HSM pool to another region, run the following command that will automatically create a second HSM.

```azurecli-interactive
az keyvault region add --hsm-name "ContosoMHSM" --region "australiaeast"
```

> [!NOTE]
> "ContosoMHSM" in this example is the primary HSM pool name; "australiaeast" is the secondary region into which you are extending it.

### Remove a secondary HSM in another region

Once you remove a secondary HSM, the HSM partitions in the other region will be purged. All secondaries must be deleted before a primary managed HSM can be soft-deleted or purged. Only secondaries can be deleted using this command. The primary can only be deleted using the [soft-delete](soft-delete-overview.md#soft-delete-behavior) and [purge](soft-delete-overview.md#purge-protection) commands

```azurecli-interactive
az keyvault region remove --hsm-name ContosoMHSM --region australiaeast
```

### List all regions

```azurecli-interactive
az keyvault region list --hsm-name ContosoMHSM
```

## Next steps

- [Managed HSM role management](role-management.md)
- [Azure Data Encryption At Rest](../../security/fundamentals/encryption-atrest.md)
- [Azure Storage Encryption](../../storage/common/storage-service-encryption.md)
