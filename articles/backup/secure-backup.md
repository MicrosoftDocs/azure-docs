---
title: Secure your Azure Backup deployment
description: Learn how to secure Azure Backup, with best practices for protecting your backup data against ransomware, accidental loss, and unauthorized access.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-backup
ms.topic: best-practice
ms.custom: horz-security
ms.date: 09/28/2026
ai-usage: ai-generated
---

# Secure your Azure Backup deployment

Azure Backup provides centralized, cloud-based data protection for Azure virtual machines, databases, file shares, and on-premises workloads. It stores recovery data in Recovery Services vaults and Backup vaults. Because backups are often the last line of defense against ransomware, accidental deletion, and destructive attacks, you must harden the backup service so that recovery data stays confidential, tamper-resistant, and recoverable.

This article provides security recommendations to help protect your Azure Backup deployment.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Service-specific security

Azure Backup stores vaulted backup data in a Microsoft-managed subscription and tenant, isolated from the production environment where the source data resides. This isolation creates a logical air gap that keeps backups out of reach of a compromised production environment. Layer the following Azure Backup-specific controls to make backup data resistant to tampering and malicious deletion.

- **Enable multiuser authorization (MUA) with Resource Guard**: Require separate Resource Guard authorization before critical operations such as disabling soft delete, stopping backups with data deletion, or reducing retention can proceed. For more information, see [Multiuser authorization using Resource Guard](multi-user-authorization-concept.md).
    - **Create the Resource Guard in a separate subscription or tenant**: Ensure that no single backup administrator has both vault permissions and the Resource Guard permissions needed to authorize destructive operations. For more information, see [Multiuser authorization using Resource Guard](multi-user-authorization-concept.md).
- **Enable and lock immutable vaults**: Prevent backup data from being modified or deleted during its policy-based retention period, or during a specific immutability duration for Recovery Services vaults, then lock immutability to make the setting irreversible. For more information, see [Immutable vault for Azure Backup](backup-azure-immutable-vault-concept.md).
- **Extend soft-delete retention for higher-risk vaults**: Retain deleted backup data for 14 to 180 days so that you can recover it after accidental or malicious deletion. Don't disable soft delete in Backup vault regions where the portal still allows it. For more information, see [Secure by default with soft delete for Azure Backup](secure-by-default.md).

## Network security

Restrict how backup data transfer and management operations reach your vaults so that traffic stays off the public internet.

- **Use private endpoints for supported Recovery Services vault workloads**: Route backup and restore traffic for SQL Server and SAP HANA in Azure VMs, MARS agent backups, DPM, and supported file recovery through private endpoints, and deny public network access on the vault when private endpoint DNS is configured. For more information, see [Private endpoints for Azure Backup](backup-azure-private-endpoints-concept.md).
- **Secure hybrid backups from the MARS agent, MABS, and DPM**: Harden on-premises backups by keeping the agent current, using security PIN validation for critical operations, and protecting the MARS encryption passphrase. For more information, see [Security features to protect hybrid backups](backup-azure-security-feature.md).
- **Enforce TLS 1.2 or later for backup communication**: Configure Windows Server and the MARS agent to use TLS 1.2 or later so that backup data in transit uses strong encryption. For more information, see [Transport Layer Security in Azure Backup](transport-layer-security.md).

## Identity and access management

Grant each backup operator only the permissions their role requires, and protect the credentials needed to restore backups.

- **Assign least-privilege built-in backup roles**: Use the Backup Contributor, Backup Operator, and Backup Reader roles to separate duties across backup administrators, operators, and monitors instead of granting broad Contributor or Owner access on vaults. For more information, see [Use Azure role-based access control to manage Azure Backup recovery points](backup-rbac-rs-vault.md).
- **Store the MARS agent passphrase in Azure Key Vault**: Protect the encryption passphrase that's required to restore on-premises MARS backups by storing it in Key Vault instead of on the local machine. For more information, see [Save and manage the MARS agent passphrase in Azure Key Vault](save-backup-passphrase-securely-in-azure-key-vault.md).

## Data protection

Control the encryption of backup data at rest so that it meets your key-management and defense-in-depth requirements.

- **Configure customer-managed keys before protecting items in new Recovery Services vaults**: Use your own keys in Azure Key Vault for supported Recovery Services vault workloads when you need control over the encryption key lifecycle beyond the default Microsoft-managed keys. For more information, see [Encrypt backup data by using customer-managed keys](encryption-at-rest-with-cmk.md).
    - **Encrypt Backup vault data with customer-managed keys**: For workloads protected in a Backup vault, configure customer-managed key encryption at the Backup vault level. For more information, see [Encryption of backup data in Backup vaults by using customer-managed keys](encryption-at-rest-with-cmk-for-backup-vault.md).
- **Enable infrastructure encryption for a second layer of encryption at rest**: Add infrastructure encryption at vault creation when you configure customer-managed keys so that backup data is double-encrypted at the storage infrastructure level. For more information, see [Encryption of data in Azure Backup](backup-encryption.md).

## Logging and monitoring

Monitor the health of your protection estate and detect suspicious backup activity early.

- **Monitor backup health with Azure Monitor and Backup reports**: Send vault diagnostics to a Log Analytics workspace and use Backup reports to track jobs, retention, and policy compliance across vaults. For more information, see [Monitoring and reporting solutions for Azure Backup](monitoring-and-alerts-overview.md).
- **Configure notifications for security-sensitive alerts**: Use Azure Monitor alert processing rules and action groups to notify your security team when built-in Azure Backup alerts fire for operations such as disabling soft delete or deleting backup data. For more information, see [Azure Monitor alerts for Azure Backup](backup-azure-monitoring-alerts.md).
- **Enable threat detection with Microsoft Defender for Cloud**: Identify potentially malicious or ransomware-infected Azure VM restore points by using Defender for Servers security signals. This capability is in preview. For more information, see [Threat detection in Azure Backup with Microsoft Defender for Cloud integration](threat-detection-overview.md).
- **Route Microsoft Defender ransomware alerts to protect recovery points**: Use Defender for Cloud ransomware alerts to trigger automated protection of backup recovery points. For more information, see [Integrate Microsoft Defender's ransomware alerts to protect Azure Backup recovery points](backup-azure-integrate-microsoft-defender-using-logic-apps.md).

## Compliance and governance

Enforce and audit a consistent backup security configuration across your subscriptions.

- **Enforce backup security controls with Azure Policy**: Apply the built-in Azure Policy definitions for Azure Backup to audit or require configurations such as soft delete, private endpoints, MUA, and vault immutability across your estate. For more information, see [Azure Policy built-in definitions for Azure Backup](policy-reference.md).
- **Apply resource locks to Recovery Services vaults and Backup vaults**: Add a delete lock to vaults and their resource groups so that no one can accidentally or maliciously remove vaults that protect critical workloads. For more information, see [Lock your resources to protect your infrastructure](/azure/azure-resource-manager/management/lock-resources).

## Backup and recovery

Ensure that the backups themselves survive regional outages and remain recoverable when you need them.

- **Configure geo-redundant storage for vaults**: Set vault storage redundancy to geo-redundant storage (GRS) so that backup data is replicated to the Azure paired region and survives a regional outage. For more information, see [Set storage redundancy](backup-create-recovery-services-vault.md#set-storage-redundancy).
- **Enable Cross Region Restore**: Turn on Cross Region Restore (CRR) so that you can restore backup data from the secondary region on demand for drills, audits, or outages, without waiting for Microsoft to declare a disaster. For more information, see [Set Cross Region Restore](backup-create-recovery-services-vault.md#set-cross-region-restore).

## Related content

- [Overview of security features in Azure Backup](security-overview.md)
- [Design a ransomware-resilient backup architecture by using Azure Backup](/azure/architecture/security/ransomware-resilient-backup-architecture)
- [Zero Trust guidance center](/security/zero-trust/zero-trust-overview)
