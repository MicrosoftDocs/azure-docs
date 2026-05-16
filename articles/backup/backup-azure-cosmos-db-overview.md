---
title: About Azure Cosmos DB backup
description: An overview on Azure Cosmos DB backup
ms.topic: overview
ms.date: 5/15/2026
ms.service: azure-backup
ms.custom:
  - build-2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to implement a backup solution for Azure Cosmos DB, so that I can ensure long-term data retention and protection against data loss events like accidental deletions or ransomware attacks.
---

# About Azure Cosmos DB vaulted backup (preview)

Azure Backup for Cosmos DB (preview) provides a centralized, secure, and compliant way to protect [Azure Cosmos DB accounts](/azure/cosmos-db/overview) using vaulted, long‑term backups managed by the Azure Backup service. This capability complements Cosmos DB’s [native short‑term retention backups](/azure/cosmos-db/online-backup-and-restore) by enabling off‑platform, immutable backups with retention of up to **10 years**, helping customers meet regulatory, cyber‑resiliency, and enterprise governance requirements. 

Azure Backup for Cosmos DB is designed for the following scenarios: 

- Long‑term retention beyond Cosmos DB native limits
- Isolation of backup data from the source account 
- Centralized governance across multiple workloads 
- Protection against accidental or malicious deletion (ransomware scenarios) 

[Learn about the supported regions, scenarios, and the limitations for Azure Cosmos DB backup (preview).] (backup-azure-cosmos-db-support-matrix.md)

## Why use Azure Backup for Cosmos DB? 

The native capabilities of Azure Cosmos DB supports continuous (PITR) and periodic backups with up to **35 days** of retention, optimized for operational recovery scenarios. For scenarios that require longer retention, vault isolation, immutability guarantees, and stronger security controls, use Azure Backup for Cosmos DB that go beyond native capabilities.

Azure Backup for Cosmos DB provides: 

- Vaulted backups stored outside the source account
- Long‑term retention (LTR) up to 10 years 
- Centralized management across other Azure Backup datasources
- Enhanced security controls such as immutability, encryption, soft delete, Azure role based access control (Azure RBAC), and multi‑user authorization (MUA) 

## How Azure Backup for Cosmos DB works 

Azure Backup for Cosmos DB integrates with Cosmos DB’s transactionally consistent backup streams and transfers backup data into a Backup vault based on a defined backup policy. Backups are taken at the Cosmos DB account level and include all databases and containers in the account. 

To perform the backup and restore operations for Azure Cosmos DB:

- Create a Backup vault. 
- Define a backup policy specifying schedule and retention.
- Azure Backup streams consistent backups from Cosmos DB into the vault. 
- Azure Backup stores the recovery points securely and isolates them from the source account. 
- Azure Backup triggers the restore operation from the vault to a target Cosmos DB account. 

## Backup vaults and storage isolation 

Azure Backup for Cosmos DB uses Backup vaults that isolate and protect backup data. These vaults provide:

- Logical and administrative isolation of backup data
- Microsoft‑managed storage inaccessible from the source account 
- Configurable redundancy options - Locally redundant storage (LRS), Zone-redundant storage (ZRS), Geo-redundant storage (GRS)
- Central monitoring and reporting 
- WORM immutable storage of backup data 

This isolation ensures that even if a Cosmos DB account is compromised or deleted, backup data remains protected and recoverable. 

## Security and compliance 

Cosmos DB backup operations inherit the following enterprise‑grade security model of Azure Backup. These security models help you align with regulatory frameworks, such as financial services, data retention mandates, and cyber resilience standards.

- Soft delete for protection of recovery points from accidental deletion 
- Role‑based access control (RBAC) for backup and restore operations 
- Multi‑user authorization (MUA) for critical actions 
- Encryption at rest and in transit using Microsoft‑managed or customer‑managed keys (where supported) 
- WORM immutability for ensuring backups can’t be modified or deleted by unauthorized users

## Relationship between Azure Backup and native Cosmos DB backup capabilities

Azure Backup for Cosmos DB functions parallelly with the native Cosmos DB backup capabilities and doesn’t replace it. You must enable native continuous backup (PITR) on the Cosmos DB account for Azure Backup integration.

| **Capability** | **Description** |
|-----------|-------------|
| Native backups (continuous / periodic) | Provide short-term operational recovery (up to 35 days) |
| Azure Backup | Provides long-term, vaulted backups for compliance, audit, and ransomware recovery |

## Backup costs

For Cosmos DB vaulted backup (preview), you incur the following costs from, July 1, 2026:

- Protected item cost
- Backup data storage cost
- Restore cost
 
For more information, see the [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) and [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to understand the Azure Cosmos DB backup pricing.

## Next steps

[Back up Azure Cosmos DB using Azure portal](backup-azure-cosmos-db.md)