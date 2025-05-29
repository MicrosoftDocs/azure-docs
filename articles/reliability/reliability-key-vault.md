---
title: Reliability in Azure Key Vault
description: Find out about reliability in Azure Key Vault, including availability zones and multi-region deployments.
author: msmbaldwin
ms.author: mbaldwin
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-key-vault
ms.date: 05/07/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Key Vault works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Key Vault

This article describes reliability support in Azure Key Vault, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

Azure Key Vault is a cloud service that provides a secure store for secrets, such as keys, passwords, certificates, and other sensitive information. Key Vault offers a range of built-in reliability features to help ensure that your secrets remain available, including automatic region replication, data redundancy, and the ability to back up and restore your secrets.

## Production deployment recommendations

For production deployments of Azure Key Vault, we recommend:

- Using Standard or Premium tier key vaults
- Enabling soft delete and purge protection to prevent accidental or malicious deletion
- For critical workloads, consider implementing multi-region strategies as described in this guide

## Reliability architecture overview

Azure Key Vault achieves redundancy by replicating your key vault and its contents within the region to ensure high durability and availability of your keys, secrets, and certificates.

By default, the contents of your key vault are replicated both within the region and to a paired region located at least 150 miles away but within the same geography. This approach ensures high durability of your keys and secrets, protecting against hardware failures, network outages, or localized disasters.

Key Vault provides multiple layers of redundancy to maintain availability during:
- Hardware failures
- Network outages
- Localized disasters
- Maintenance activities

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Key Vault is designed to handle most transient errors automatically. However, client applications should implement retry logic when interacting with Key Vault to handle any transient failures that might occur. Some best practices include:

- Implement exponential backoff retry policies in your client applications
- Use the Azure SDK libraries which typically include built-in retry mechanisms
- Monitor for throttling errors, as exceeding Key Vault service limits will cause throttling

If you're using Key Vault in high-throughput scenarios, consider distributing your operations across multiple key vaults to avoid throttling limits.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Key Vault automatically leverages availability zones in regions where they're available, providing high availability within a region without requiring any specific configuration from customers.

The service is designed to be resilient to zone failures without any specific configuration required by customers. Key Vault automatically manages the redundancy across availability zones in regions where zones are available. For more information, see [Failover within a region](/azure/key-vault/general/disaster-recovery-guidance#failover-within-a-region) in the Key Vault availability and redundancy documentation.

### Region support

Azure Key Vault is available in all Azure regions that support availability zones. Key Vault's zone-resilient architecture is automatically applied in these regions.

### Requirements

All Key Vault SKUs (Standard and Premium) support the same level of availability and resiliency. There are no specific tier requirements to achieve zone resilience with Azure Key Vault.

### Considerations

While Azure Key Vault is resilient to zone failures, certain aspects should be considered:

- During a zone failure, some write operations might be temporarily unavailable
- Read operations typically remain available during zone failures
- You should monitor your key vault's availability using Azure Monitor metrics and alerts

### Cost

There are no additional costs associated with Key Vault's zone resilience. The pricing is based on the SKU (Standard or Premium) and the number of operations performed.

### Normal operations

- **Traffic routing between zones:** Azure Key Vault automatically manages traffic routing between availability zones. During normal operations, requests are distributed across zones transparently.

- **Data replication between zones:** Key Vault data is synchronously replicated across availability zones in regions that support zones. This ensures that your keys, secrets, and certificates remain consistent and available even if a zone becomes unavailable.

### Zone-down experience

- **Detection and response:** The Key Vault service is responsible for detecting zone failures and automatically responding to them. You don't need to take any action during a zone failure.

- **Notification:** You can monitor the status of your key vault through Azure Resource Health and Azure Service Health. These services provide notifications about any service degradation.

- **Active requests:** During a zone failure, any in-flight requests to the affected zone might fail and need to be retried by client applications.

- **Expected data loss:** No data loss is expected during a zone failure due to the synchronous replication between zones.

- **Expected downtime:** For read operations, there should be minimal to no downtime during a zone failure. Write operations might experience temporary unavailability while the service adjusts to the zone failure.

- **Traffic rerouting:** Key Vault automatically reroutes traffic away from the affected zone to healthy zones without requiring any customer intervention.

### Failback

When the affected availability zone recovers, Azure Key Vault automatically restores operations to that zone. This process is fully managed by the Azure platform and doesn't require any customer intervention.

## Multi-region support

Azure Key Vault provides built-in support for replicating your key vault and its contents to a secondary region. This feature is useful for disaster recovery and ensuring high availability of your secrets.

### Data replication

For most Azure regions that are paired with another region, the contents of your key vault are replicated both within the region and to the paired region. The paired region is typically at least 150 miles away, but within the same geography. This approach ensures high durability of your keys and secrets.

Exceptions to cross-region replication include:
- Brazil South region
- Brazil Southeast region
- West US 3 region

When you create key vaults in these regions, they aren't replicated across regions.

For detailed information about how Key Vault replicates data across regions, see [Data replication](/azure/key-vault/general/disaster-recovery-guidance#data-replication) in the Key Vault availability and redundancy guide.

### Region support

Key Vault's multi-region capabilities depend on Azure region pairs. The replication is only supported between designated paired regions. For more information about Azure region pairs, see [Azure paired regions](/azure/reliability/cross-region-replication-azure).

### Requirements

There are no additional requirements to enable multi-region replication for Key Vault. It's a built-in feature of the service for supported regions.

### Considerations

- Key vaults in Brazil South, Brazil Southeast, and West US 3 don't have cross-region replication
- During failover, your key vault is in read-only mode with limited operations supported
- You can't change key vault properties during failover
- Access policy and firewall configurations can't be modified during failover

### Cost

There are no additional costs for the built-in multi-region replication capabilities of Azure Key Vault.

### Normal operations

- **Traffic routing between regions:** During normal operations, all requests are routed to the primary region where your key vault is deployed.

- **Data replication between regions:** Key Vault replicates data asynchronously to the paired region. When you make changes to your key vault contents, those changes are first committed to the primary region and then replicated to the secondary region.

### Region-down experience

- **Detection and response:** The Key Vault service is responsible for detecting a region failure and automatically failing over to the secondary region.

- **Notification:** You can monitor the status of your key vault through Azure Resource Health and Azure Service Health notifications.

- **Active requests:** During a region failover, active requests might fail and need to be retried by client applications.

- **Expected data loss:** There might be some data loss if changes haven't been replicated to the secondary region before the primary region fails.

- **Expected downtime:** Your key vault might be unavailable for a few minutes during the failover process.

- **Traffic rerouting:** In the event of a region failover, requests are automatically routed to the paired region without requiring any customer intervention.

For a complete description of the failover process and behavior, see [Failover across regions](/azure/key-vault/general/disaster-recovery-guidance#failover-across-regions) in the Key Vault availability and redundancy guide.

### Failback

When the primary region becomes available again, Azure Key Vault automatically fails back operations to that region. This process is fully managed by the Azure platform and doesn't require any customer intervention.

During failback, all request types (including read and write requests) become available again once the process is complete.

### Alternative multi-region approaches

If you need a multi-region strategy for regions that don't support cross-region replication (Brazil South, Brazil Southeast, West US 3) or need more control over your multi-region deployment, consider:

1. Creating separate key vaults in different regions
2. Using the backup and restore functionality to maintain consistent secrets across regions
3. Implementing application-level logic to failover between key vaults

For example approaches to multi-region architectures, see [Highly available multi-region web application](/azure/architecture/web-apps/app-service/architectures/multi-region).

## Backups

Azure Key Vault provides the ability to back up and restore individual secrets, keys, and certificates. Backups are intended to provide you with an offline copy of your secrets in the unlikely event that you lose access to your key vault.

Key points about the backup functionality:

- Backups create encrypted blobs that can't be decrypted outside of Azure
- Backups can only be restored to a key vault within the same Azure subscription and Azure geography
- There's a limitation of backing up no more than 500 past versions of a key, secret, or certificate object
- Backups are point-in-time snapshots and don't automatically update when secrets change

> For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't, such as accidental deletion of specific secrets.

For detailed instructions on how to back up and restore Key Vault objects, see [Azure Key Vault backup](/azure/key-vault/general/backup). For guidance on when to use backups, see [When to use backups](/azure/key-vault/general/backup#when-to-use-backups), and for important limitations, refer to [Backup limitations](/azure/key-vault/general/backup#limitations).

## Recovery features

Azure Key Vault provides two key recovery features to prevent accidental or malicious deletion:

1. **Soft delete:** When enabled, soft delete allows you to recover deleted vaults and objects during a configurable retention period (default 90 days). Think of soft delete like a recycle bin for your key vault resources.

2. **Purge protection:** When enabled, purge protection prevents permanent deletion of your key vault and its objects until the retention period elapses. This prevents malicious actors from permanently destroying your secrets.

Both features are strongly recommended for production environments. For a detailed explanation of these features, see [What are soft-delete and purge protection](/azure/key-vault/general/key-vault-recovery#what-are-soft-delete-and-purge-protection) in the Key Vault recovery management documentation.

## Service-level agreement

The service-level agreement (SLA) for Azure Key Vault describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [SLA for Azure Key Vault](https://azure.microsoft.com/support/legal/sla/key-vault/).

## Related content
- [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance)
- [Azure Key Vault backup](/azure/key-vault/general/backup)
- [Azure Key Vault recovery management](/azure/key-vault/general/key-vault-recovery)
- [Reliability in Azure](/azure/reliability/overview)