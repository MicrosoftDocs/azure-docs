---
title: Enable Multi-Region Replication on Managed HSM (Preview)
description: Enable Multi-Region Replication on Managed HSM (Preview)
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 11/04/2022
ms.author: mbaldwin
---
# Enable multi-region replication on Managed HSM (Preview)

Multi-region replication allows you to extend a Managed HSM instance from one region, called a primary, to a second region, called a secondary. Once configured, both regions are active, able to serve requests, and will share the same key material, roles, and permissions. Should one region become unavailable due to a regional outage, the other region can still handle requests.

## Architecture

:::image type="content" source="../../media/multi-region-replication.png" alt-text="Architecture diagram of Managed HSM Multi-Region Replication":::

When you enable multi-region replication on Managed HSM, a second Managed HSM instance with three load-balanced HSM partitions will be created in the secondary region. Similar to the primary region, these partitions will be spread across two availability zones where possible. When requests are issues to the global DNS endpoint `<hsm-name>.managedhsm.azure.net` the closest available region will receive and fulfill the request. While each region individually maintains regional high-availability due to the distribution of HSMs across availability zones, the global traffic manager ensures that even if all partitions of a Managed HSM in one region are unavailable due to a catastrophe, requests can still be served by the secondary instance.

## Replication latency

Any write operation to Managed HSM, such as creating or updating a key, creating or updating a role definition, or creating or updating a role assignment, will be made available in both regions after no more than 6 minutes. Within this window, it is not guaranteed that the written material has replicated between the regions. Therefore, it is safest to wait at least 6 minutes between creating or updating the key and using the key to ensure that the key material has fully replicated between regions. The same applies for role assignments and role definitions.

## Behavior during failover

Failover occurs when one of the regions in a multi-region Managed HSM becomes unavailable due to an outage and the other region begins to service all requests. The outage may be limited to your instance only, the entire Managed HSM service, or the entire Azure region. During failover, you may notice a change in behavior depending on the affected region.

| Affected Region | Reads Allowed | Writes Allowed |
|--|--|--|
| Secondary | Yes | Yes |
| Primary | Yes | Maybe |

If the secondary region becomes unavailable, read operations (get key, list keys, all crypto operations, list role assignments) will be available if the primary region is alive. Write operations (create and update keys, create and update role assignments, create and update role definitions) will also be available.

If the primary region is unavailable, read operations will be available, but write operations may not depending on the scope of the outage.

## Time to failover

Under the hood, DNS resolution handles the redirection of requests to either the primary or secondary region.

If both regions are active, the Traffic Manager will resolve an incoming request to the location that has the closest geographical proximity or lowest network latency to the origin of the request. DNS records are configured with a default TTL of 5 seconds.

If a region reports an unhealthy status to the Traffic Manager, future requests will resolve to the other region if available. Clients caching DNS lookups may result in extended failover time. But once any client-side caches expire, future requests should route to the available region.

## Global versus regional endpoints

The underlying regional Managed HSM instances can be addressed via their respective region-specific DNS endpoints: `<primary-region>.<hsm-name>.managedhsm.azure.net` and `<secondary-region>.<hsm-name>.managedhsm.azure.net`. For most applications, though, it is sufficient to allow the traffic manager to automatically resolve the right regional endpoint by simply querying the global endpoint `<hsm-name>.managedhsm.azure.net`.

## Billing

During private preview, you are not charged for Managed HSM primaries or secondaries.

### Azure CLI commands

### Install the multi-region Managed HSM replication extension

```azurecli-interactive
az extension add --source https://yssa.blob.core.windows.net/ext/keyvault_preview-1.0.0-py3-none-any.whl
```

### Add a secondary region

In order to extend a Managed HSM instance, it must be activated. Activate the Managed HSM by downloading its security domain.

> [!NOTE]
> During private preview, only East US 2 EUAP can be used as a primary region, and only Central US EUAP can be used as a secondary

```azurecli-interactive
az keyvault region add --hsm-name ContosoMHSM --region centraluseuap
```

### Remove a secondary region

Once you remove a secondary region, the instance underpinning that region will be purged. All secondaries must be deleted before a Managed HSM can be soft-deleted or purged. Only secondaries can be deleted using this command. The primary can only be deleted using the soft-delete and purge commands

```azurecli-interactive
az keyvault region remove --hsm-name ContosoMHSM --region centraluseuap
```

### List all regions

```azurecli-interactive
az keyvault region list --hsm-name ContosoMHSM
```

## Resources

- [Managed HSM role management](role-management.md)
- [Azure Data Encryption At Rest](../../security/fundamentals/encryption-atrest.md)
- [Azure Storage Encryption](../../storage/common/storage-service-encryption.md)
