---
title: Azure Key Vault availability and redundancy - Azure Key Vault | Microsoft Docs
description: Learn about Azure Key Vault availability and redundancy.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 08/28/2020
ms.author: sudbalas

---
# Azure Key Vault availability and redundancy

Azure Key Vault features multiple layers of redundancy to make sure that your keys and secrets remain available to your application even if individual components of the service fail.

> [!NOTE]
> This guide applies to vaults. Managed HSM pools use a different high availability and disaster recovery model. See [Managed HSM Disaster Recovery Guide](../managed-hsm/disaster-recovery-guide.md) for more information.

The contents of your key vault are replicated within the region and to a secondary region at least 150 miles away but within the same geography to maintain high durability of your keys and secrets. See the [Azure paired regions](../../best-practices-availability-paired-regions.md) document for details on specific region pairs.

If individual components within the key vault service fail, alternate components within the region step in to serve your request to make sure that there is no degradation of functionality. You don't need to take any action to start this process, it happens automatically and will be transparent to you.

In the rare event that an entire Azure region is unavailable, the requests that you make of Azure Key Vault in that region are automatically routed (*failed over*) to a secondary region. When the primary region is available again, requests are routed back (*failed back*) to the primary region. Again, you don't need to take any action because this happens automatically.

Through this high availability design, Azure Key Vault requires no downtime for maintenance activities.

There are a few caveats to be aware of:

* In the event of a region failover, it may take a few minutes for the service to fail over. Requests that are made during this time before failover may fail.
* If you are using private link to connect to your key vault, it may take up to 20 minutes for the connection to be re-established in the event of a failover. 
* During failover, your key vault is in read-only mode. Requests that are supported in this mode are:
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

* During failover, you will not be able to make changes to key vault properties. You will not be able to change access policy or firewall configurations and settings.

* After a failover is failed back, all request types (including read *and* write requests) are available.
