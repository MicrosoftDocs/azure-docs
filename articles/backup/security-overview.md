---
title: Overview of security features
description: Learn about security capabilities in Azure Backup that help you protect your backup data and meet the security needs of your business.
ms.topic: conceptual
ms.date: 03/12/2020
---

# Overview of security features in Azure Backup

One of the most important steps you can take to protect your data is to have a reliable backup infrastructure. But it's just as important to ensure that your data is backed up in a secure fashion, and that your backups are protected at all times. Azure Backup provides security to your backup environment - both when your data is in transit and at rest. This article lists security capabilities in Azure Backup that help you protect your backup data and meet the security needs of your business.

## Management and control of identity and user access

Storage accounts used by recovery services vaults are isolated and cannot be accessed by users for any malicious purposes. The access is only allowed through Azure Backup management operations, such as restore. Azure Backup enables you to control the managed operations through fine-grained access using [Azure Role-Based Access Control (RBAC)](https://docs.microsoft.com/azure/backup/backup-rbac-rs-vault). RBAC allows you to segregate duties within your team and grant only the amount of access to users necessary to do their jobs.

Azure Backup provides three [built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles) to control backup management operations:

* Backup Contributor - to create and manage backups, except deleting Recovery Services vault and giving access to others
* Backup Operator - everything a contributor does except removing backup and managing backup policies
* Backup Reader - permissions to view all backup management operations

Learn more about [Role-Based Access control to manage Azure Backup](https://docs.microsoft.com/azure/backup/backup-rbac-rs-vault).

Azure Backup has several security controls built into the service to prevent, detect, and respond to security vulnerabilities. Learn more about [security controls for Azure Backup](https://docs.microsoft.com/azure/backup/backup-security-controls).

## Separation between guest and Azure storage

With Azure Backup, which includes virtual machine backup and SQL and SAP HANA in VM backup, the backup data is stored in Azure storage and the guest has no direct access to backup storage or its contents.  With virtual machine backup, the backup snapshot creation and storage is done by Azure fabric where the guest has no involvement other than quiescing the workload for application consistent backups.  With SQL and SAP HANA, the backup extension gets temporary access to write to specific blobs.  In this way, even in a compromised environment, existing backups can't be tampered with or deleted by the guest.

## Internet connectivity not required for Azure VM backup

Backup of Azure VMs requires movement of data from your virtual machine's disk to the Recovery Services vault. However, all the required communication and data transfer happens only on the Azure backbone network without needing to access your virtual network. Therefore, backup of Azure VMs placed inside secured networks doesn't require you to allow access to any IPs or FQDNs.

## Private Endpoints for Azure backup

You can now use [Private Endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-overview) to back up your data securely from servers inside a virtual network to your Recovery Services vault. The private endpoint uses an IP from the VNET address space for your vault, so you do not need to expose your virtual networks to any public IPs. Private Endpoints can be used for backing up and restoring your SQL and SAP HANA databases that run inside your Azure VMs. It can also be used for your on-premises servers using the MARS agent.

Read more on private endpoints for Azure Backup [here](https://docs.microsoft.com/azure/backup/private-endpoints).

## Encryption of data in transit and at rest

Encryption protects your data and helps you to meet your organizational security and compliance commitments. Within Azure, data in transit between Azure storage and the vault is protected by HTTPS. This data remains on the Azure backbone network.

* Backup data is automatically encrypted using Microsoft-managed keys. You can also encrypt your backed up managed disk VMs in the Recovery Services Vault using [customer managed keys](backup-encryption.md#encryption-of-backup-data-using-customer-managed-keys) stored in the Azure Key Vault. You don't need to take any explicit action to enable this encryption. It applies to all workloads being backed up to your Recovery Services vault.

* Azure Backup supports backup and restore of Azure VMs that have their OS/data disks encrypted with Azure Disk Encryption (ADE). [Learn more about encrypted Azure VMs and Azure Backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-encryption).

## Protection of backup data from unintentional deletes

Azure Backup provides security features to help protect backup data even after deletion. With soft delete, if user deletes the backup of a VM, the backup data is retained for 14 additional days, allowing the recovery of that backup item with no data loss. The additional 14 days retention of backup data in the "soft delete" state doesn't incur any cost to the customer. [Learn more about soft delete](backup-azure-security-feature-cloud.md).

## Monitoring and alerts of suspicious activity

Azure Backup provides [built-in monitoring and alerting capabilities](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-built-in-monitor) to view and configure actions for events related to Azure Backup. [Backup Reports](https://docs.microsoft.com/azure/backup/configure-reports) serve as a one-stop destination for tracking usage, auditing of backups and restores, and identifying key trends at different levels of granularity. Using Azure Backup's monitoring and reporting tools can alert you to any unauthorized, suspicious, or malicious activity as soon as they occur.

## Security features to help protect hybrid backups

Azure Backup service uses the Microsoft Azure Recovery Services (MARS) agent to back up and restore files, folders, and the volume or system state from an on-premises computer to Azure. MARS now provides security features to help protect hybrid backups. These features include:

* An additional layer of authentication is added whenever a critical operation like changing a passphrase is performed. This validation is to ensure that such operations can be performed only by users who have valid Azure credentials. [Learn more about the features that prevent attacks](https://docs.microsoft.com/azure/backup/backup-azure-security-feature#prevent-attacks).

* Deleted backup data is retained for an additional 14 days from the date of deletion. This ensures recoverability of the data within a given time period, so there's no data loss even if an attack happens. Also, a greater number of minimum recovery points are maintained to guard against corrupt data. [Learn more about recovering deleted backup data](https://docs.microsoft.com/azure/backup/backup-azure-security-feature#recover-deleted-backup-data).

* For data backed up using the Microsoft Azure Recovery Services (MARS) agent, a passphrase is used to ensure data is encrypted before upload to Azure Backup and decrypted only after download from Azure Backup. The passphrase details are only available to the user who created the passphrase and the agent that is configured with it. Nothing is transmitted or shared with the service. This ensures complete security of your data as any data that is exposed inadvertently (such as a man-in-the-middle attack on the network) is unusable without the passphrase, and the passphrase isn't sent on the network.

## Compliance with standardized security requirements

To help organizations comply with national, regional, and industry-specific requirements governing the collection and use of individuals' data, Microsoft Azure & Azure Backup offer a comprehensive set of certifications and attestations. [See the list of compliance certifications](compliance-offerings.md)

## Next steps

* [Security features to help protect cloud workloads that use Azure Backup](backup-azure-security-feature-cloud.md)
* [Security features to help protect hybrid backups that use Azure Backup](backup-azure-security-feature.md)
