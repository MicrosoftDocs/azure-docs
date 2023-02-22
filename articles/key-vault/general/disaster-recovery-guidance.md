---
title: Azure Key Vault availability and redundancy - Azure Key Vault | Microsoft Docs
description: Learn about Azure Key Vault availability and redundancy.
services: key-vault
author: msmbaldwin

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 01/17/2023
ms.author: mbaldwin
ms.custom: references_regions 

---
# Azure Key Vault availability and redundancy

Azure Key Vault features multiple layers of redundancy to make sure that your keys and secrets remain available to your application even if individual components of the service fail.

> [!NOTE]
> This guide applies to vaults. Managed HSM pools use a different high availability and disaster recovery model; for more information, see [Managed HSM Disaster Recovery Guide](../managed-hsm/disaster-recovery-guide.md) for more information.

The contents of your key vault are replicated within the region and to a secondary region at least 150 miles away, but within the same geography to maintain high durability of your keys and secrets. For details about specific region pairs, see [Azure paired regions](../../availability-zones/cross-region-replication-azure.md). The exception to the paired regions model is single region geo, for example Brazil South, Qatar Central. Such regions allow only the option to keep data resident within the same region. Both Brazil South and Qatar Central use zone redundant storage (ZRS) to replicate your data three times within the single location/region. For AKV Premium, only two of the three regions are used to replicate data from the HSMs.

If individual components within the key vault service fail, alternate components within the region step in to serve your request to make sure that there's no degradation of functionality. You don't need to take any action—the process happens automatically and will be transparent to you.

## Failover

In the rare event that an entire Azure region is unavailable, the requests that you make of Azure Key Vault in that region are automatically routed (*failed over*) to a secondary region (except as noted). When the primary region is available again, requests are routed back (*failed back*) to the primary region. Again, you don't need to take any action because this happens automatically.

> [!IMPORTANT]
> Failover is not supported in:
>
> - Brazil South
> - Brazil Southeast
> - Qatar Central (no paired region)
> - Poland Central (no paired region)
> - West US 3
>
> All other regions use read-access geo-redundant storage (RA-GRS). For more information, see [Azure Storage redundancy: Redundancy in a secondary region](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).

In the Brazil South and Qatar Central region, you must plan for the recovery of your Azure key vaults in a region failure scenario. To back up and restore your Azure key vault to a region of your choice, complete the steps that are detailed in [Azure Key Vault backup](backup.md).

Through this high availability design, Azure Key Vault requires no downtime for maintenance activities.

There are a few caveats to be aware of:

* In the event of a region failover, it may take a few minutes for the service to fail over. Requests made during this time before failover may fail.
* If you're using private link to connect to your key vault, it may take up to 20 minutes for the connection to be re-established in the event of a failover.
* During failover, your key vault is in read-only mode. Requests supported in this mode:

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