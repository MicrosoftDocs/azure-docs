---
title: Reliability in Azure Key Vault
description: Find out about reliability in Azure Key Vault, including availability zones and multi-region deployments.
author: msmbaldwin
ms.author: mbaldwin
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-key-vault
ms.date: 06/20/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Key Vault works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Key Vault

This article describes reliability support in Azure Key Vault, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

Key Vault is a cloud service that provides a secure store for secrets, such as keys, passwords, certificates, and other sensitive information. Key Vault provides a range of built-in reliability features to help ensure that your secrets remain available. These features include automatic region replication, data redundancy, and the ability to back up and restore your secrets.

## Production deployment recommendations

For production deployments of Key Vault, we recommend that you do the following steps:

- Use Standard or Premium tier key vaults

- Enable soft delete and purge protection to prevent accidental or malicious deletion

- For critical workloads, consider implementing multi-region strategies as described in this guide

## Reliability architecture overview

To ensure high durability and availability of your keys, secrets, and certificates if a hardware failure or network outage occurs, Key Vault provides multiple layers of redundancy to maintain availability:

- Hardware failures
- Network outages
- Localized disasters
- Maintenance activities

By default, Key Vault achieves redundancy by replicating your key vault and its contents within the region.

If the region has a [paired region](./regions-list.md) and that paired region is in the same geography as the primary region, the contents are also replicated to the paired region. This approach ensures high durability of your keys and secrets, protecting against hardware failures, network outages, or localized disasters.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To handle any transient failures that might occur, your client applications should implement retry logic when interacting with Key Vault. Consider the following best practices:

- Use the [Azure SDKs](https://azure.microsoft.com/downloads/), which typically include built-in retry mechanisms.

- Implement exponential backoff retry policies if your clients connect directly to Key Vault.

- Cache secrets in memory when possible to reduce direct requests to Key Vault.

- Monitor for throttling errors because exceeding Key Vault service limits causes throttling.

If you use Key Vault in high-throughput scenarios, consider distributing your operations across multiple key vaults to avoid throttling limits. Consider the Key Vault-specific guidance for the following scenarios:

- A high-throughput scenario is one that approaches or exceeds the [service limits](/azure/key-vault/general/service-limits) for Key Vault operations, such as 200 operations per second for software-protected keys.

- For high-throughput workloads, divide your Key Vault traffic among multiple vaults and different regions.

- A subscription-wide limit for all transaction types is five times the individual key vault limit.

- Use a separate vault for each security or availability domain. For example, if you have five apps in two regions, consider using 10 vaults.

- For public-key operations such as encryption, wrapping, and verification, perform these operations locally by caching the public key material.

For more information, see [Key Vault throttling guidance](/azure/key-vault/general/overview-throttling).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Key Vault automatically provides zone redundancy in [regions that support availability zones](./regions-list.md). This redundancy provides high availability within a region without requiring any specific configuration. 

When an availability zone becomes unavailable, Key Vault automatically redirects your requests to other healthy availability zones to ensure high availability. 

### Region support

Key Vault enables zone redundancy by default in [all Azure regions that support availability zones](./regions-list.md).

### Requirements

All Key Vault SKUs, Standard and Premium, support the same level of availability and resiliency. There aren't any tier-specific requirements to achieve zone resilience.

### Cost

There are no extra costs associated with Key Vault's zone redundancy. The pricing is based on the SKU, either Standard or Premium, and the number of operations performed.

### Normal operations

The following section describes what to expect when key vaults are in a region with availability zones and all availability zones are operational:

- **Traffic routing between zones:** Key Vault automatically manages traffic routing between availability zones. During normal operations, requests are distributed across zones transparently.

- **Data replication between zones:** Key Vault data is synchronously replicated across availability zones in regions that support zones. This replication ensures that your keys, secrets, and certificates remain consistent and available even if a zone becomes unavailable.

### Zone-down experience

The following section describes what to expect when key vaults are in a region that has availability zones and one or more availability zones are unavailable:

- **Detection and response:** The Key Vault service is responsible for detecting zone failures and automatically responding to them. You don't need to take any action during a zone failure.

- **Notification:** You can monitor the status of your key vault through Azure Resource Health and Azure Service Health. These services provide notifications about any service degradation.

- **Active requests:** During a zone failure, the affected zone might fail to handle in-flight requests, which requires client applications to retry them. Client applications should follow [transient fault handling practices](#transient-faults) to ensure that they can retry requests if a zone failure occurs.

- **Expected data loss:** No data loss is expected during a zone failure because of the synchronous replication between zones.

- **Expected downtime:** For read operations, there should be minimal to no downtime during a zone failure. Write operations might experience temporary unavailability while the service adjusts to the zone failure. Read operations are expected to remain available during zone failures.

- **Traffic rerouting:** Key Vault automatically reroutes traffic away from the affected zone to healthy zones without requiring any customer intervention. 

For more information, see [Failover within a region](/azure/key-vault/general/disaster-recovery-guidance#failover-within-a-region) in the Key Vault availability and redundancy documentation.

### Failback

When the affected availability zone recovers, Key Vault automatically restores operations to that zone. The Azure platform fully manages this process and doesn't require any customer intervention.

## Multi-region support

Key Vault resources are deployed into a single Azure region. If the region becomes unavailable, your key vault is also unavailable. However, there are approaches that you can use to help ensure resilience to region outages. These approaches depend on whether the key vault is in a paired or nonpaired region and on your specific requirements and configuration.

### Microsoft-managed failover to a paired region

Key Vault supports Microsoft-managed replication and failover for key vaults in most paired regions. The contents of your key vault are automatically replicated both within the region and, asynchronously, to the paired region. This approach ensures high durability of your keys and secrets. In the unlikely event of a prolonged region failure, Microsoft might initiate a regional failover of your key vault.

The following regions don't support Microsoft-managed replication or failover across regions:

- Brazil South
- Brazil Southeast
- West US 3
- Any region that doesn't have a paired region

> [!IMPORTANT]
> Microsoft triggers Microsoft-managed failover. It's likely to occur after a significant delay and is done on a best-effort basis. There are also some exceptions to this process. The failover of key vaults might occur at a time that's different from the failover time of other Azure services.
>
> If you need to be resilient to region outages, consider using one of the [alternative multi-region approaches](#alternative-multi-region-approaches).

For more information about how Key Vault replicates data across regions, see [Data replication](/azure/key-vault/general/disaster-recovery-guidance#data-replication) in the Key Vault availability and redundancy guide.

#### Considerations

While the failover is in progress, your key vault might be unavailable for a few minutes. After failover, the key vault becomes read-only and only supports limited actions. You can't change key vault properties while operating in the secondary region, and access policy and firewall configurations can't be modified while operating in the secondary region.

#### Cost

There are no extra costs for the built-in multi-region replication capabilities of Key Vault. 

#### Normal operations

The following section describes what to expect when a key vault is located in a region that supports Microsoft-managed replication and failover, and the primary region is operational:

- **Traffic routing between regions:** During normal operations, all requests are routed to the primary region where your key vault is deployed.

- **Data replication between regions:** Key Vault replicates data asynchronously to the paired region. When you make changes to your key vault contents, those changes are first committed to the primary region and then replicated to the secondary region.

#### Region-down experience

The following section describes what to expect when a key vault is located in a region that supports Microsoft-managed replication and failover, and there's an outage in the primary region:

- **Detection and response:** Microsoft can decide to perform a failover if the primary region is lost. This process can take several hours after the loss of the primary region, or longer in some scenarios. Failover of key vaults might not occur at the same time as other Azure services.

- **Notification:** You can monitor the status of your key vault through Azure Resource Health and Azure Service Health notifications.

- **Active requests:** During a region failover, active requests might fail and client applications to retry them after failover completes.

- **Expected data loss:** There might be some data loss if changes aren't replicated to the secondary region before the primary region fails.

- **Expected downtime:** During a major outage of the primary region, your key vault might be unavailable for several hours or until Microsoft initiates failover to the secondary region.

- **Traffic rerouting:** After a region failover is completed, requests are automatically routed to the paired region without requiring any customer intervention.

For more information about the failover process and behavior, see [Failover across regions](/azure/key-vault/general/disaster-recovery-guidance#failover-across-regions) in the Key Vault availability and redundancy guide.

### Alternative multi-region approaches

There are scenarios where the Microsoft-managed cross-region failover capabilities of Key Vault aren't suitable:

- Your key vault is in a nonpaired region.

- Your key vault is in a paired region that doesn't support Microsoft-managed cross-region replication and failover in Brazil South, Brazil Southeast, and West US 3.

- Your business uptime goals aren't satisfied by the recovery time or data loss that Microsoft-managed cross-region failover provides.

- You need to fail over to a region that isn't your primary region's pair.

You can design a custom cross-region failover solution by doing the following steps:

1. Create separate key vaults in different regions.

1. Use the backup and restore functionality to maintain consistent secrets across regions.

1. Implement application-level logic to fail over between key vaults.

## Backups

Key Vault can back up and restore individual secrets, keys, and certificates. Backups are intended to provide you with an offline copy of your secrets in the unlikely event that you lose access to your key vault.

Consider the following key factors regarding backup functionality:

- Backups create encrypted blobs that can't be decrypted outside of Azure.

- Backups can only be restored to a key vault within the same Azure subscription and Azure geography.

- There's a limitation of backing up no more than 500 past versions of a key, secret, or certificate object.

- Backups are point-in-time snapshots and don't automatically update when secrets change.

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Key Vault backup](/azure/key-vault/general/backup).

## Recovery features

Key Vault provides two key recovery features to prevent accidental or malicious deletion:

- **Soft delete:** When enabled, soft delete allows you to recover deleted vaults and objects during a configurable retention period. This period is a default of 90 days. Think of soft delete like a recycle bin for your key vault resources.

- **Purge protection:** When enabled, purge protection prevents permanent deletion of your key vault and its objects until the retention period elapses. This safeguard prevents malicious actors from permanently destroying your secrets.

We strongly recommend both features for production environments. For more information, see [Soft-delete and purge protection](/azure/key-vault/general/key-vault-recovery#what-are-soft-delete-and-purge-protection) in the Key Vault recovery management documentation.

## Service-level agreement

The service-level agreement (SLA) for Key Vault describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see the [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance)
- [Key Vault backup](/azure/key-vault/general/backup)
- [Key Vault recovery management](/azure/key-vault/general/key-vault-recovery)
- [Reliability in Azure](/azure/reliability/overview)
