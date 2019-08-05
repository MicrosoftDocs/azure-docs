---
title: Security features to help protect cloud workloads that use Azure Backup
description: Learn how to use security features in Azure Backup to make backups more secure.
author: dcurwin
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 08/04/2019
ms.author: dacurwin
---
# Security features to help protect cloud workloads that use Azure Backup
Concerns about security issues, like malware, ransomware, and intrusion, are increasing. These security issues can be costly, in terms of both money and data. To guard against such attacks, Azure Backup now provides security features to help protect backup data even after deletion. One such feature is Soft Delete. With Soft Delete, even if a malicious actor deletes the backup of a VM, the backup data is retained for 14 additional days, allowing the recovery of that VM with no data loss. These additional 14 days retention of backup data in the "soft delete" state don’t incur any cost to the customer.

## Soft Delete
### Soft Delete for VMs

1. In order to delete a VM, the backup must be stopped. In the recovery vault, right-click on the VM and choose **Stop backup**.

![Screenshot of Azure portal Backup Items](./media/backup-azure-security-feature-cloud/backup-stopped.png)

2. In the following window, you will be given a choice of what to delete. If you choose **Delete backup data** and then **Stop backup**, the VM will not be permanently deleted. Rather, the backup data will be retained for 14 days in the soft deleted state. The deletion is deferred until after that period, when permanent deletion will occur.
    
![Screenshot of Azure portal, Stop Backup screen](./media/backup-azure-security-feature-cloud/delete-backup-data.png)




3. During those 14 days, in the Recovery Services Vault, the soft deleted VM will appear with a red “soft-delete” icon next to it.

![Screenshot of Azure portal, VM in soft delete state](./media/backup-azure-security-feature-cloud/vm-soft-delete.png)


    
> [!NOTE]
>
>If any soft-deleted VMs are present in the vault, the vault cannot be deleted at that time.
Restore operation on a soft deleted item can only be performed after ‘undeleting’ the item.

4.  In order to restore the VM, it must first be undeleted. To undelete, choose the soft-deleted VM, and then click on the option **Undelete**. A window will appear warning that if undelete is chosen, all restore points for the VM will be undeleted and available for performing a restore operation. The VM will be retained in a “stop protection with retain data” state. Click on the button **Undelete**.

![Screenshot of Azure portal, Undelete VM](./media/backup-azure-security-feature-cloud/undelete-vm.png)


    
> [!NOTE]
>
>Garbage collection will run only if the user performs “Resume backup” operation.

5. After the undelete process is completed, the status will return to “Stop backup with retain data” and then you can choose **Resume backup**. At this point, you can also restore the VM by selecting **Restore VM** from the chosen restore point.

![Screenshot of Azure portal, Resume Backup option](./media/backup-azure-security-feature-cloud/resume-backup.png)

## Other security features

### Storage side encryption

Azure Storage automatically encrypts your data when persisting it to the cloud. Encryption protects your data and to help you to meet your organizational security and compliance commitments. Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows. Azure Backup automatically encrypts data before storing it. Azure Storage decrypts data before retrieving it. 

Within Azure, data in transit between Azure storage and the vault is protected by HTTPS. This data remains on the Azure backbone network.

For more information, please see [Azure Storage encryption for data at rest](https://docs.microsoft.com/en-in/azure/storage/common/storage-service-encryption).

### VM encryption

You can back up and restore Windows or Linux Azure virtual machines (VMs) with encrypted disks using the Azure Backup service. For instructions, please see [Back up and restore encrypted virtual machines with Azure Backup](https://docs.microsoft.com/en-us/azure/backup/backup-azure-vms-encryption).

### Protection of Azure Backup recovery points

Storage accounts used by recovery services vaults are isolated and cannot be accessed by users for any malicious purposes. The access is only allowed through Azure Backup management operations, such as restore. These management operations are controlled through Role-Based Access Control (RBAC).

For more information, please see [Use Role-Based Access Control to manage Azure Backup recovery points](https://docs.microsoft.com/en-us/azure/backup/backup-rbac-rs-vault).


## Next steps
* Read about [Security attributes for Azure Backup](https://docs.microsoft.com/en-us/azure/backup/backup-security-attributes).