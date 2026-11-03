---
title: Overview of security and cyber recovery in Azure Backup
description: Learn how Azure Backup protects vaulted backup data and supports cyber recovery through security and recovery capabilities.
ms.topic: overview
ms.date: 11/02/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a security manager, I want to understand how Azure Backup protects vaulted data and supports recovery, so that I can strengthen backup security and prepare for cyber incidents.
---

# Overview of security and cyber recovery in Azure Backup

Azure Backup helps protect vaulted backup data and supports recovery when production environments are compromised. **Logically air-gapped vault** describes an outcome that combines isolation with controls against destructive operations. **Cyber recovery essentials** brings together capabilities that help you assess backup threats and prepare recovery operations. Support varies by vault, workload, and region.

## Logically air-gapped vault

Azure Backup stores vaulted backup data in a Microsoft-managed Azure subscription and tenant, separate from the production environment where the protected data resides. This logical separation helps keep backup data out of reach of a compromised workload. It isn't a physical or offline air gap, and it doesn't replace controls over identities that can manage the vault.

### Data isolation with Azure Backup

External users and guest workloads don't have direct access to the contents of vaulted backup storage. Azure Backup manages backup operations, including restore, through the vault and its configured access controls.

The foundational Logically air-gapped vault outcome requires multi-user authorization (MUA); soft delete and encryption are on by default, and immutability is optional. Protect vaulted data from destructive deletion by using either always-on soft delete or locked immutability, where supported. These controls have different behaviors and support boundaries.

### Management and control of identity and user access

Azure role-based access control (Azure RBAC) lets you assign only the permissions users need to manage backup operations. Azure Backup provides three [built-in roles](../role-based-access-control/built-in-roles.md) to help you separate duties:

- **Backup Contributor**: Create and manage backups, except for deleting the Recovery Services vault or granting access to others.
- **Backup Operator**: Perform backup operations except for removing backups and managing backup policies.
- **Backup Reader**: View backup management operations.

Learn more about [Azure RBAC for Azure Backup](backup-rbac-rs-vault.md).

### Protect backup data from premature deletion

Soft delete delays permanent deletion and keeps deleted backup data recoverable during its configured retention period. The default retention period is 14 days and can be extended up to 180 days. The first 14 days of soft-delete retention don't incur an additional charge; longer retention can incur charges. Soft delete doesn't provide indefinite retention. Locked immutability blocks operations that could cause loss of recovery points for the configured retention or immutability duration, and the locked setting can't be reversed. Immutability applies to vaulted data in the vault; it doesn't apply to operational backups for resources such as blobs, files, and disks.

The enforcement and availability of always-on soft delete vary by vault type, workload, and region. Review [secure-by-default soft delete](secure-by-default.md) and [immutable vault support](backup-azure-immutable-vault-concept.md) before choosing a protection route.

### Multi-user authorization

MUA adds an extra authorization layer to critical operations on Recovery Services vaults and Backup vaults. It uses Resource Guard so that a separate authorized user can approve protected operations. MUA helps protect vault settings and backup data from unauthorized changes. It doesn't replace soft delete or immutability. Learn about [MUA using Resource Guard](multi-user-authorization-concept.md).

### Encryption of data

Azure Backup encrypts backup data at rest by default with Microsoft-managed keys. For supported Recovery Services vault workloads, you can use customer-managed keys stored in Azure Key Vault. Azure Backup protects data in transit with HTTPS and TLS 1.2 or later. Azure Backup also supports backup and restore of Azure VMs with encrypted disks. For details, see [encryption of backup data](backup-encryption.md), [customer-managed keys](encryption-at-rest-with-cmk.md), and [backup and restore of encrypted Azure VMs](backup-azure-vms-encryption.md).

## Cyber recovery essentials

Cyber recovery essentials focuses on preparing to identify suspicious backup recovery points and restore data to a supported recovery destination. Its capability set includes Safe Restore at scale, threat detection, cross-subscription restore, and cross-tenant restore. Each capability has its own support scope. Threat detection and cross-tenant restore are in preview.

### Threat detection in Azure Backup

Azure Backup threat detection uses security signals from Microsoft Defender for Servers to assess the health of Azure VM backup recovery points. It identifies potentially malicious or ransomware-infected recovery points. It doesn't scan backup data directly. The capability is in preview. Learn about [threat detection for Azure VM backups](threat-detection-overview.md).

### Restore across subscriptions and tenants

Cross-subscription restore can help you recover supported Azure VM backups to another subscription in the same tenant. For details and limitations, see [cross-subscription restore](azure-backup-data-protection-best-practices.md#cross-subscription-restore-for-backup-data-recovery).

Cross-tenant restore lets you restore eligible vaulted recovery points to a different tenant after mapping source and target vaults. Scenarios include tenant lockout, ransomware attacks, and tenant consolidation. A Resource Guard in the target tenant protects the mapping operation through MUA. Cross-tenant restore is in preview and supports only documented workloads and regions. Learn about [cross-tenant restore](cross-tenant-restore-overview.md).

## Other security controls

Azure Backup also has built-in security controls to prevent, detect, and respond to security vulnerabilities. Learn about the [Azure security baseline for Backup](/security/benchmark/azure/baselines/backup-security-baseline).

### Internet connectivity not required for Azure VM backup

Azure VM backup traffic uses the Azure backbone network and doesn't require access to your virtual network. You don't need to allow IP addresses or fully qualified domain names for backup of Azure VMs in secured networks.

### Private endpoints for Azure Backup

Private endpoints provide private connectivity for supported Recovery Services vault workloads, including SQL Server and SAP HANA in Azure VMs, MARS agent backups, DPM, and supported file recovery. For supported scenarios, see [private endpoints for Azure Backup](backup-azure-private-endpoints-concept.md).

### Security features to help protect hybrid backups

Azure Backup provides security features for hybrid backups, including extra authentication for critical operations, email notifications for critical operations, and MARS backup data encryption with a passphrase before upload. Data is decrypted only after download, and the passphrase isn't transmitted to Azure Backup. For supported hybrid backup configurations that use these security features, deleted backup data is retained for an extra 14 days, and a minimum number of recovery points is maintained to help recover from corruption. Protect the passphrase so you can restore data when needed. Learn about [security features for hybrid backups](backup-azure-security-feature.md).

### Monitoring and alerts of suspicious activity

Azure Backup provides built-in monitoring and alerts for backup operations. Use [Backup reports](configure-reports.md) to track backup and restore activity and identify trends. For more monitoring options, see [monitoring and reporting for Azure Backup](monitoring-and-alerts-overview.md).

## Security posture and security levels

Azure Backup security levels summarize security settings applied to protected items. Use them to identify configuration gaps across your backup environment.

| Security level | Description | Requirements |
|---|---|---|
| Excellent | Backups are protected against accidental deletion and ransomware attacks. | Immutability or soft delete is enabled and irreversible (locked or always-on), and MUA is enabled on the vault. |
| Good | Existing backups are protected against accidental deletion and have better recovery options. | Immutability is locked or soft delete is enabled. |
| Fair | Critical backup operations have an extra layer of protection. | MUA is enabled on the vault. |
| Poor | Basic protection against accidental deletion only. | Advanced protection capabilities aren't enabled, or only reversible capabilities are enabled. |

Learn how to [review security levels across protected items](../resiliency/security-levels-concept.md).

### Compliance with standardized security requirements

Azure Backup provides service controls, certifications, and attestations that can help you assess applicable national, regional, and industry-specific requirements. Review [Azure compliance offerings](compliance-offerings.md) for details.

## Next steps

* [Secure by default with soft delete for Azure Backup](secure-by-default.md)
* [Security features to help protect hybrid backups that use Azure Backup](backup-azure-security-feature.md)
* [Azure Policy regulatory compliance controls for Azure Backup](security-controls-policy.md)