---
title: Overview of security features
description: Learn about security capabilities in Azure Backup that help you protect your backup data and meet the security needs of your business.
ms.topic: conceptual
ms.date: 03/20/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Overview of security features in Azure Backup

One of the most important steps you can take to protect your data is to have a reliable backup infrastructure. But it's just as important to ensure that your data is backed up in a secure fashion, and that your backups are protected at all times. Azure Backup provides security to your backup environment - both when your data is in transit and at rest. This article lists security capabilities in Azure Backup that help you protect your backup data and meet the security needs of your business.

## Management and control of identity and user access

Storage accounts used by Recovery Services vaults are isolated and can't be accessed by users for any malicious purposes. The access is only allowed through Azure Backup management operations, such as restore. Azure Backup enables you to control the managed operations through fine-grained access using [Azure role-based access control (Azure RBAC)](./backup-rbac-rs-vault.md). Azure RBAC allows you to segregate duties within your team and grant only the amount of access to users necessary to do their jobs.

Azure Backup provides three [built-in roles](../role-based-access-control/built-in-roles.md) to control backup management operations:

* **Backup Contributor**: To create and manage backups, except deleting Recovery Services vault and giving access to others
* **Backup Operator**: Everything a contributor does except removing backup and managing backup policies
* **Backup Reader**: permissions to view all backup management operations

Learn more about [Azure role-based access control to manage Azure Backup](./backup-rbac-rs-vault.md).

Azure Backup has several security controls built into the service to prevent, detect, and respond to security vulnerabilities. Learn more about [security controls for Azure Backup](./security-baseline.md).

## Data isolation with Azure Backup

With Azure Backup, the vaulted backup data is stored in Microsoft-managed Azure subscription and tenant. External users or guests have no direct access to this backup storage or its contents, ensuring the isolation of backup data from the production environment where the data source resides.

In Azure, all communications and data in transit is securely transferred with *HTTPS* and *TLS 1.2+* protocols. This data remains on the Azure backbone network ensuring reliable and efficient data transmission. The backup data at rest is encrypted by default using *Microsoft-managed keys*. You can also bring your own keys for encryption if you require greater control over the data. To enhance protection, you can use [immutability](backup-azure-immutable-vault-concept.md), which prevents data from being altered or deleted before its retention period.  Azure Backup gives you diverse options such as [soft delete](backup-azure-enhanced-soft-delete-about.md), stop backup and delete data or retain data if you need to stop backups at any time. To protect critical operations, you can add [Multi-User Authorization (MUA)](multi-user-authorization-concept.md) that adds additional layer of protection by using an Azure resource called Azure Resource Guard.

This robust approach ensures that even in a compromised environment, existing backups cannot be tampered with or deleted by unauthorized users.

## Internet connectivity not required for Azure VM backup

Backup of Azure VMs requires movement of data from your virtual machine's disk to the Recovery Services vault. However, all the required communication and data transfer happens only on the Azure backbone network without needing to access your virtual network. Therefore, backup of Azure VMs placed inside secured networks doesn't require you to allow access to any IPs or FQDNs.

## Private Endpoints for Azure Backup

You can now use [Private Endpoints](../private-link/private-endpoint-overview.md) to back up your data securely from servers inside a virtual network to your Recovery Services vault. The private endpoint uses an IP from the VNET address space for your vault, so you don't need to expose your virtual networks to any public IPs. Private Endpoints can be used for backing up and restoring your SQL and SAP HANA databases that run inside your Azure VMs. It can also be used for your on-premises servers using the MARS agent.

Read more on private endpoints for Azure Backup [here](./private-endpoints.md).

## Encryption of data

Encryption protects your data and helps you to meet your organizational security and compliance commitments. Data encryption occurs in many stages in Azure Backup:

* Within Azure, data in transit between Azure storage and the vault is [protected by HTTPS](backup-support-matrix.md#network-traffic-to-azure). This data remains on the Azure backbone network.

* Backup data is automatically encrypted using [platform-managed keys](backup-encryption.md), and you don't need to take any explicit action to enable it. You can also encrypt your backed-up data using [customer managed keys](encryption-at-rest-with-cmk.md) stored in the Azure Key Vault. It applies to all workloads being backed up to your Recovery Services vault.

* Azure Backup supports backup and restore of Azure VMs that have their OS/data disks encrypted with [Azure Disk Encryption (ADE)](backup-azure-vms-encryption.md#encryption-support-using-ade) and [VMs with CMK encrypted disks](backup-azure-vms-encryption.md#encryption-using-customer-managed-keys). For more information, [learn more about encrypted Azure VMs and Azure Backup](./backup-azure-vms-encryption.md).

* When data is backed up from on-premises servers with the MARS agent, data is encrypted with a passphrase before upload to Azure Backup and decrypted only after it's downloaded from Azure Backup. Read more about [security features to help protect hybrid backups](#security-features-to-help-protect-hybrid-backups).

## Soft delete

Azure Backup provides security features to help protect the backup data even after deletion. With soft delete, if you delete the backup of a VM, the backup data is retained for *14 additional days*, allowing the recovery of that backup item with no data loss. The additional *14 days retention of backup data in the "soft delete state* doesn't incur any cost. [Learn more about soft delete](backup-azure-security-feature-cloud.md).

Azure Backup has now also enhanced soft delete to further improve chances of recovering data after deletion. [Learn more](#enhanced-soft-delete).

## Immutable vaults

Immutable vault can help you protect your backup data by blocking any operations that could lead to loss of recovery points. Further, you can lock the immutable vault setting to make it irreversible that can prevent any malicious actors from disabling immutability and deleting backups. [Learn more about immutable vaults](backup-azure-immutable-vault-concept.md). 

## Multi-user authorization

Multi-user authorization (MUA) for Azure Backup allows you to add an additional layer of protection to critical operations on your Recovery Services vaults and Backup vaults. For MUA, Azure Backup uses another Azure resource called the Resource Guard to ensure critical operations are performed only with applicable authorization. [Learn more about multi-user authorization for Azure Backup](multi-user-authorization-concept.md).

## Enhanced soft delete

Enhanced soft delete provides you with the ability to recover your data even after it's deleted, accidentally or maliciously. It works by delaying the permanent deletion of data by a specified duration, providing you with an opportunity to retrieve it. You can also make soft delete *always-on* to prevent it from being disabled. [Learn more about enhanced soft delete for Backup](backup-azure-enhanced-soft-delete-about.md).

## Monitoring and alerts of suspicious activity

Azure Backup provides [built-in monitoring and alerting capabilities](./backup-azure-monitoring-built-in-monitor.md) to view and configure actions for events related to Azure Backup. [Backup Reports](./configure-reports.md) serve as a one-stop destination for tracking usage, auditing of backups and restores, and identifying key trends at different levels of granularity. Using Azure Backup's monitoring and reporting tools can alert you to any unauthorized, suspicious, or malicious activity as soon as they occur.

## Security features to help protect hybrid backups

Azure Backup service uses the Microsoft Azure Recovery Services (MARS) agent to back up and restore files, folders, and the volume or system state from an on-premises computer to Azure. MARS now provides security features to help protect hybrid backups. These features include:

* An additional layer of authentication is added whenever a critical operation like changing a passphrase is performed. This validation is to ensure that such operations can be performed only by users who have valid Azure credentials. [Learn more about the features that prevent attacks](./backup-azure-security-feature.md#prevent-attacks).

* Deleted backup data is retained for an additional 14 days from the date of deletion. This ensures recoverability of the data within a given time period, so there's no data loss even if an attack happens. Also, a greater number of minimum recovery points are maintained to guard against corrupt data. [Learn more about recovering deleted backup data](./backup-azure-security-feature.md#recover-deleted-backup-data).

* For data backed up using the Microsoft Azure Recovery Services (MARS) agent, a passphrase is used to ensure data is encrypted before upload to Azure Backup and decrypted only after download from Azure Backup. The passphrase details are only available to the user who created the passphrase and the agent that's configured with it. Nothing is transmitted or shared with the service. This ensures complete security of your data, as any data that's exposed inadvertently (such as a man-in-the-middle attack on the network) is unusable without the passphrase, and the passphrase isn't sent over the network.

## Security posture and security levels

Azure Backup provides security features at the vault level to safeguard backup data stored in it. These security measures encompass the settings associated with the Azure Backup solution for the vaults, and the protected data sources contained in the vaults.

Security levels for Azure Backup vaults are categorized as follows:

- **Excellent (Maximum)**: This level represents the highest security, which ensures comprehensive protection. You can achieve this when all backup data is protected from accidental deletions and defends from ransomware attacks. To achieve this high level of security, the following conditions must be met:

  - [Immutability](backup-azure-immutable-vault-concept.md) or [soft-delete](backup-azure-security-feature-cloud.md) vault setting must be enabled and irreversible (locked/always-on).
  - [Multi-user authorization (MUA)](multi-user-authorization-concept.md) must be enabled on the vault.

- **Good (Adequate)**: This signifies a robust security level, which ensures dependable data protection. It shields existing backups from unintended removal and enhances the potential for data recovery. To attain this level of security, you must enable either immutability with a lock or soft-delete.

- **Fair (Minimum/Average)**: This represents a basic level of security, appropriate for standard protection requirements. Essential backup operations benefit from an extra layer of protection. To attain minimal security, you must enable Multi-user Authorization (MUA) on the vault.

- **Poor (Bad/None)**: This indicates a deficiency in security measures, which is less suitable for data protection. In this level, neither advanced protective features nor solely reversible capabilities are in place. The None level security gives protection primarily from accidental deletions only.

You can [view and manage the security levels across all datasources in their respective vaults through Azure Business Continuity Center](../business-continuity-center/security-levels-concept.md).

## Compliance with standardized security requirements

To help organizations comply with national/regional and industry-specific requirements governing the collection and use of individuals' data, Microsoft Azure & Azure Backup offer a comprehensive set of certifications and attestations. [See the list of compliance certifications](compliance-offerings.md)

## Next steps

* [Security features to help protect cloud workloads that use Azure Backup](backup-azure-security-feature-cloud.md)
* [Security features to help protect hybrid backups that use Azure Backup](backup-azure-security-feature.md)