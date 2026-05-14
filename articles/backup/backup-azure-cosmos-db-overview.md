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

# About Azure Backup for Cosmos DB (preview)

Azure Backup for Cosmos DB (preview) provides a centralized, secure, and compliant way to protect [Azure Cosmos DB accounts](/azure/cosmos-db/overview) using vaulted, long‑term backups managed by the Azure Backup service. This capability complements Cosmos DB’s [native short‑term retention backups](/azure/cosmos-db/online-backup-and-restore) by enabling off‑platform, immutable backups with retention of up to 10 years, helping customers meet regulatory, cyber‑resiliency, and enterprise governance requirements. 

Azure Backup for Cosmos DB is designed for customers who need: 

- Long‑term retention beyond Cosmos DB native limits
- Isolation of backup data from the source account 
- Centralized governance across multiple workloads 
- Protection against accidental or malicious deletion (ransomware scenarios) 

## Why use Azure Backup for Cosmos DB? 

Azure Cosmos DB natively supports continuous (PITR) and periodic backups with a maximum retention of 35 days, optimized for operational recovery scenarios. However, many enterprises—especially in regulated industries—require longer retention, vault isolation, and immutability guarantees that go beyond native capabilities. 

Azure Backup for Cosmos DB addresses these gaps by providing: 

- Vaulted, off‑account backups stored in Backup vaults 
- Long‑term retention (LTR) up to 10 years 
- Centralized management alongside other Azure Backup workloads
- Enhanced security controls such as immutability, encryption, soft delete, RBAC, and multi‑user authorization (MUA) 

## How Azure Backup for Cosmos DB works 

Azure Backup for Cosmos DB integrates with Cosmos DB’s transactionally consistent backup streams and transfers backup data into a Backup vault based on a defined backup policy. Backups are taken at the Cosmos DB account level and include all databases and containers in the account. 

High‑level flow: 

- You create a Backup vault. 
- You define a backup policy specifying schedule and retention.
- Azure Backup streams consistent backups from Cosmos DB into the vault. 
- Recovery points are stored securely and isolated from the source account. 
- Restores are performed from the vault to a target Cosmos DB account. 

## Backup vaults and storage isolation 

Azure Backup for Cosmos DB uses Backup vaults which provide: 

- Logical and administrative isolation of backup data
- Microsoft‑managed storage inaccessible from the source account 
- Configurable redundancy options (LRS, ZRS, GRS) 
- Central monitoring and reporting 
- WORM immutable storage of backup data 

This isolation ensures that even if a Cosmos DB account is compromised or deleted, backup data remains protected and recoverable. 

## Security and compliance 

Azure Backup for Cosmos DB inherits Azure Backup’s enterprise‑grade security model: 

- Soft delete to protect recovery points from accidental deletion 
- Role‑based access control (RBAC) for backup and restore operations 
- Multi‑user authorization (MUA) for critical actions 
- Encryption at rest and in transit using Microsoft‑managed or customer‑managed keys (where supported) 
- WORM immutability ensuring that once backups are written, they cannot be modified or deleted by unauthorized users. 

These controls help customers align with regulatory frameworks such as financial services, data retention mandates, and cyber‑resilience standards. 

## Relationship with native Cosmos DB backups 

Azure Backup for Cosmos DB does not replace native Cosmos DB backups. Instead, the two work together: 

- Native backups (continuous / periodic) handle short‑term, operational recovery (up to 35 days). 
- Azure Backup provides longer term, vaulted backups for compliance, audit, and ransomware recovery. 

Native continuous backup (PITR) must be enabled on the Cosmos DB account to support Azure Backup integration. 

## Next steps

[Back up Azure Cosmos DB using Azure portal](backup-azure-cosmos-db.md).
