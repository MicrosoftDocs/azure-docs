---
title: Azure Key Vault availability and redundancy - Azure Key Vault | Microsoft Docs
description: Learn about Azure Key Vault availability and redundancy.
services: key-vault
author: msmbaldwin

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 11/15/2023
ms.author: mbaldwin
ms.custom: references_regions 

---
# Azure Key Vault availability and redundancy

Azure Key Vault features multiple layers of redundancy to make sure that your keys and secrets remain available to your application even if individual components of the service fail, or if Azure regions or availability zones are unavailable.

> [!NOTE]
> This guide applies to vaults. Managed HSM pools use a different high availability and disaster recovery model; for more information, see [Managed HSM Disaster Recovery Guide](../managed-hsm/disaster-recovery-guide.md).

## Data replication

The way that Key Vault replicates your data depends on the specific region that your vault is in.

**For most Azure regions that are paired with another region**, the contents of your key vault are replicated both within the region and to the paired region. The paired region is usually at least 150 miles away, but within the same geography. This approach ensures high durability of your keys and secrets. For more information about Azure region pairs, see [Azure paired regions](../../reliability/cross-region-replication-azure.md). Two exceptions are the Brazil South region, which is paired to a region in another geography, and the West US 3 region. When you create key vaults in Brazil South or West US 3, they aren't replicated across regions.

**For [Azure regions that don't have a pair](../../reliability/cross-region-replication-azure.md#regions-with-availability-zones-and-no-region-pair), as well as the Brazil South and West US 3 regions**, Azure Key Vault uses zone redundant storage (ZRS) to replicate your data three times within the region, across independent availability zones. For Azure Key Vault Premium, two of the three zones are used to replicate the hardware security module (HSM) keys. You can also use the [backup and restore](backup.md) feature to replicate the contents of your vault to another region of your choice.

## Failover within a region

If individual components within the key vault service fail, alternate components within the region step in to serve your request to make sure that there's no degradation of functionality. You don't need to take any action—the process happens automatically and will be transparent to you.

Similarly, in a region where your vault is replicated across availability zones, if an availability zone is unavailable then Azure Key Vault automatically redirects your requests to another availability zone to ensure high availability.

## Failover across regions

If you're in a [region that automatically replicates your key vault to a secondary region](#data-replication), then in the rare event that an entire Azure region is unavailable, the requests that you make of Azure Key Vault in that region are automatically routed (*failed over*) to a secondary region. When the primary region is available again, requests are routed back (*failed back*) to the primary region. Again, you don't need to take any action because this happens automatically.

> [!IMPORTANT]
> Cross-region failover is not supported in the following regions:
>
> - [Any region that doesn't have a paired region](../../reliability/cross-region-replication-azure.md#regions-with-availability-zones-and-no-region-pair)
> - Brazil South
> - Brazil Southeast
> - West US 3
>
> All other regions use read-access geo-redundant storage (RA-GRS) to replicate data between paired regions. For more information, see [Azure Storage redundancy: Redundancy in a secondary region](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).

In the regions that don't support automatic replication to a secondary region, you must plan for the recovery of your Azure key vaults in a region failure scenario. To back up and restore your Azure key vault to a region of your choice, complete the steps that are detailed in [Azure Key Vault backup](backup.md).

Through this high availability design, Azure Key Vault requires no downtime for maintenance activities.

There are a few caveats to be aware of:

* In the event of a region failover, it may take a few minutes for the service to fail over. Requests made during this time before failover may fail.
* If you're using private link to connect to your key vault, it may take up to 20 minutes for the connection to be re-established in the event of a region failover.
* During failover, your key vault is in read-only mode. The following operations are supported in read-only mode:

  * List certificates
  * Get certificates
  * List secrets
  * Get secrets
  * List keys
  * Get (properties of) keys
  * Encrypt
  * Decrypt
  * Wrap
  * Unwrap
  * Verify
  * Sign
  * Backup

During failover, you won't be able to make changes to key vault properties. You won't be able to change access policy or firewall configurations and settings.

After a failover is failed back, all request types (including read *and* write requests) are available.

## Next steps

- [Azure Key Vault backup](backup.md)
- [Azure Storage redundancy](../managed-hsm/disaster-recovery-guide.md)
- [Azure paired regions](../../availability-zones/cross-region-replication-azure.md)
