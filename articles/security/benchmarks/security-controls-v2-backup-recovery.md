---
title: Azure Security Benchmark V2 - Backup and Recovery
description: Azure Security Benchmark V2 Backup and Recovery
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/20/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Backup and Recovery

Backup and Recovery covers controls to ensure that data and configuration backups at the different service tiers are performed, validated, and protected.

## BR-1: Ensure regular automated backups

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| BR-1 | 10.1 | CP-2, CP4, CP-6, CP-9 |

Ensure you are backing up systems and data to maintain business continuity after an unexpected event. This should be defined by any objectives for Recovery Point Objective (RPO) and Recovery Time Objective (RTO).

Enable Azure Backup and configure the backup source (e.g. Azure VMs, SQL Server, HANA databases, or File Shares), as well as the desired frequency and retention period.  

For a higher level of protection, you can enable geo-redundant storage option to replicate backup data to a secondary region and recover using cross region restore.

- [Enterprise-scale business continuity and disaster recovery](/azure/cloud-adoption-framework/ready/enterprise-scale/business-continuity-and-disaster-recovery)

- [How to enable Azure Backup](/azure/backup/)

- [How to enable cross region restore](/azure/backup/backup-azure-arm-restore-vms#cross-region-restore)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Policy and standards](/azure/cloud-adoption-framework/organize/cloud-security-policy-standards)

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Incident preparation](/azure/cloud-adoption-framework/organize/cloud-security-incident-preparation)

## BR-2: Encrypt backup data

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| BR-2 | 10.2 | CP-9 |

Ensure your backups are protected against attacks. This should include encryption of the backups to protect against loss of confidentiality.   

For on-premises backups using Azure Backup, encryption-at-rest is provided using the passphrase you provide. For regular Azure service backups, backup data is automatically encrypted using Azure platform-managed keys. You can choose to encrypt the backups using customer managed key. In this case, ensure this customer-managed key in the key vault is also in the backup scope. 

Use role-based access control in Azure Backup, Azure Key Vault, or other resources to protect backups and customer managed keys. Additionally, you can enable advanced security features to require MFA before backups can be altered or deleted.

- [Overview of security features in Azure Backup](/azure/backup/security-overview)

- [Encryption of backup data using customer-managed keys](/azure/backup/encryption-at-rest-with-cmk) 

- [How to backup Key Vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)

- [Security features to help protect hybrid backups from attacks](/azure/backup/backup-azure-security-feature#prevent-attacks)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Incident preparation](/azure/cloud-adoption-framework/organize/cloud-security-incident-preparation)

## BR-3: Validate all backups including customer-managed keys

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| BR-3 | 10.3 | CP-4, CP-9 |

Periodically perform data restoration of your backup. Ensure that you can restore backed-up customer-managed keys.

- [How to recover files from Azure Virtual Machine backup](/azure/backup/backup-azure-restore-files-from-vm)

- [How to restore Key Vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Incident preparation](/azure/cloud-adoption-framework/organize/cloud-security-incident-preparation)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## BR-4: Mitigate risk of lost keys

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| BR-4 | 10.4 | CP-9 |

Ensure you have measures in place to prevent and recover from loss of keys. Enable soft delete and purge protection in Azure Key Vault to protect keys against accidental or malicious deletion.  

- [How to enable soft delete and purge protection in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Incident preparation](/azure/cloud-adoption-framework/organize/cloud-security-incident-preparation)

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)

