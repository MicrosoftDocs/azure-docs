---
title: Enable multi-region replication on Azure Managed HSM
description: Enable Multi-Region Replication on Azure Managed HSM
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 05/23/2023
ms.author: nkondamudi
ms.custom: references_regions
---
# Enable multi-region replication on Azure Managed HSM

Multi-region replication allows you to extend a managed HSM pool from one Azure region (called a primary) to another Azure region (called a secondary). Once configured, both regions are active, able to serve requests and, with automated replication, share the same key material, roles, and permissions. The closest available region to the application receives and fulfills the request, thereby maximizing read throughput and latency. While regional outages are rare, multi-region replication enhances the availability of mission critical cryptographic keys should one region become unavailable.  For more information on SLA, visit [SLA for Azure Key Vault Managed HSM](https://azure.microsoft.com/support/legal/sla/key-vault-managed-hsm/v1_0/).

## Architecture

:::image type="content" source="../media/multi-region-replication.png" alt-text="Architecture diagram of managed HSM Multi-Region Replication." lightbox="../media/multi-region-replication.png":::

When multi-region replication is enabled on a managed HSM, a second managed HSM pool, with three load-balanced HSM partitions, is created in the secondary region. When requests are issued to the Traffic Manager global DNS endpoint `<hsm-name>.managedhsm.azure.net`, the closest available region receives and fulfills the request. While each region individually maintains regional high-availability due to the distribution of HSMs across the region, the traffic manager ensures that even if all partitions of a managed HSM in one region are unavailable due to a catastrophe, requests can still be served by the secondary managed HSM pool.

## Replication latency

Any write operation to the Managed HSM, such as creating or updating a key, creating or updating a role definition, or creating or updating a role assignment, may take up to 6 minutes before both regions are fully replicated. Within this window, it isn't guaranteed that the written material has replicated between the regions. Therefore, it's best to wait six minutes between creating or updating the key and using the key to ensure that the key material has fully replicated between regions. The same applies for role assignments and role definitions.

## Failover behavior

Failover occurs when one of the regions in a multi-region Managed HSM becomes unavailable due to an outage and the other region begins to service all requests. The outage may be limited to your HSM pool only, the entire Managed HSM service, or the entire Azure region. During failover, you may notice a change in behavior depending on the affected region.

| Affected Region | Reads Allowed | Writes Allowed |
|--|--|--|
| Secondary | Yes | Yes |
| Primary | Yes | Maybe |

If the secondary region becomes unavailable, read operations (get key, list keys, all crypto operations, list role assignments) are available if the primary region is alive. Write operations (create and update keys, create and update role assignments, create and update role definitions) are also available.

If the primary region is unavailable, read operations are available, but write operations may not, depending on the scope of the outage.

## Time to failover

Under the hood, DNS resolution handles the redirection of requests to either the primary or secondary region.

If both regions are active, the Traffic Manager resolves incoming requests to the location that has the closest geographical proximity or lowest network latency to the origin of the request. DNS records are configured with a default TTL of 5 seconds.

If a region reports an unhealthy status to the Traffic Manager, future requests resolve to the other region if available. Clients caching DNS lookups may experience extended failover time. But once any client-side caches expire, future requests should route to the available region.

## Azure region support

The following regions are supported as primary regions (Regions where you can replicate a Managed HSM pool from)

- US East
- US East 2
- US North
- Europe West
- US West
- Canada East
- Qatar Central
- Asia East
- Asia SouthEast
- UK South
- US Central
- Japan East
- Switzerland North
- Brazil South
- Australia Central
- India Central
- US West 3
- Canada Central
- Australia East
- India South
- Sweden Central
- South Africa North
- Korea Central
- Europe North
- France Central
- Japan West
- US South
- Poland Central
- Switzerland West

> [!NOTE]
> US Central, US East, West US 2, Switzerland North, West Europe, Central India, Canada Central, Canada East, Japan West, Qatar Central, Poland Central and US West Central cannot be extended as a secondary region at this time.

## Billing

Multi-region replication into secondary region incurs extra billing (x2), as a new HSM pool is consumed in the secondary region. For more information, see  [Azure Managed HSM pricing](https://azure.microsoft.com/pricing/details/key-vault).

## Soft-delete behavior

The [Managed HSM soft-delete feature](soft-delete-overview.md) allows recovery of deleted HSMs and keys however in a multi-region replication enabled scenario, there are subtle differences where the secondary HSM must be deleted before soft-delete can be executed on the primary HSM. Additionally, when a secondary is deleted, it's purged immediately and doesn't go into a soft-delete state that stops all billing for the secondary.  You can always extend to a new region as the secondary from the primary if needed. 

## Private link behavior with Multi-region replication

The [Azure Private Link feature](private-link.md) allows you to access the Managed HSM service over a private endpoint in your virtual network. You would configure private endpoint on the Managed HSM in the primary region just as you would when not using the multi-region replication feature. For the Managed HSM in the secondary region, it is recommended to create another private endpoint once the Managed HSM in the primary region is replicated to the Managed HSM in the secondary region.  This will redirect client requests to the Managed HSM closest to the client location. 

Some scenarios below with examples: Managed HSM in a primary region (UK South) and another Managed HSM in a secondary region (US West Central).

- When both Managed HSMs in the primary and secondary regions are up and running with private endpoint enabled, client requests are redirected to the Managed HSM closest to client location. Client requests go to the closest region's private endpoint and then directed to the same region's Managed HSM by the traffic manager.

  :::image type="content" source="../media/managed-hsm-multiregion-scenario-1.png" alt-text="Diagram illustrating the first managed HSM multi-region scenario." lightbox="../media/managed-hsm-multiregion-scenario-1.png":::

- When one of the Managed HSMs (UK South, as an example) in a multiregion replicated scenario is unavailable with private endpoints enabled, then client requests are redirected to available Managed HSM (US West Central). Client requests from UK south will go to UK south's private endpoint first and then directed to the US west Central Managed HSM by the traffic manager. 

  :::image type="content" source="../media/managed-hsm-multiregion-scenario-2.png" alt-text="Diagram illustrating the second managed HSM multi-region scenario." lightbox="../media/managed-hsm-multiregion-scenario-2.png":::

- Managed HSMs in primary and secondary regions but only one private endpoint configured in either primary or secondary. For a client from a different VNET (VNET1) to connect to a Managed HSM through a private endpoint in a different VNET (VNET2), it requires VNET peering between the two VNETs. You can add VNET link for the private DNS zone which is created during the private endpoint creation.

  :::image type="content" source="../media/managed-hsm-multiregion-scenario-3.png" alt-text="Diagram illustrating the third managed HSM multi-region scenario." lightbox="../media/managed-hsm-multiregion-scenario-3.png":::

In the diagram below, private endpoint is created only in the UK South region, while there are two Managed HSMs up and running one each in the UK South and the other in the US West Central. Requests from both the clients go to the UK South Managed HSM since requests are routed through the private endpoint and the private endpoint location in this case is in the UK south.

  :::image type="content" source="../media/managed-hsm-multiregion-scenario-4.png" alt-text="Diagram illustrating the fourth managed HSM multi-region scenario." lightbox="../media/managed-hsm-multiregion-scenario-4.png":::

In the diagram below, private endpoint is created only in the UK South region, only the Managed HSM in the US West Central is available and the Managed HSM in the UK South is unavailable. In this case, requests will be redirected to the US West Central Managed HSM through the private endpoint in the UK South because traffic manager detects that the UK South Managed HSM is unavailable.

  :::image type="content" source="../media/managed-hsm-multiregion-scenario-5.png" alt-text="Diagram illustrating the fifth managed HSM multi-region scenario." lightbox="../media/managed-hsm-multiregion-scenario-5.png":::

### Azure CLI commands

If creating a new Managed HSM pool and then extending to a secondary, refer to [these instructions](quick-create-cli.md#create-a-managed-hsm) prior to extending.  If extending from an already existing Managed HSM pool, then use the following instructions to create a secondary HSM into  another region.  

> [!NOTE]
> These commands requires Azure CLI version 2.48.1 or higher. To install the latest version, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

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
