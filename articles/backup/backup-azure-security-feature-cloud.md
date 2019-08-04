---
title: Security features to help protect cloud workloads that use Azure Backup
description: Learn how to use security features in Azure Backup to make backups more secure
author: dcurwin
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 08/04/2019
ms.author: dacurwin
---
# Security features to help protect cloud workloads that use Azure Backup
Concerns about security issues, like malware, ransomware, and intrusion, are increasing. These security issues can be costly, in terms of both money and data. To guard against such attacks, Azure Backup now provides security features to help protect backup data even after deletion. One such feature is Soft Delete. With Soft Delete, even if a malicious actor deletes the backup of a VM, the backup data is retained for 14 additional days, allowing the recovery of that VM with no data loss. These additional 14 days retention of backup data in the ‘soft delete’ state don’t incur any cost to the customer.


## How soft delete works

If the backup of a VM is stopped:

![Screenshot of Azure portal Backup Items](./media/backup-azure-security-feature-cloud/backup-stopped.png)

and you choose to delete the backup data:
    
![Screenshot of Azure portal, Stop Backup screen](./media/backup-azure-security-feature-cloud/delete-backup-data.png)


the backup data will be retained for 14 days in the soft deleted state. The deletion is deferred until after that period, when permanent deletion will occur.

During those 14 days, in the Recovery Services Vault, the soft deleted VM will appear with a red “soft-delete” icon next to it:

![Screenshot of Azure portal, VM in soft delete state](./media/backup-azure-security-feature-cloud/vm-soft-delete.png)


    
> [!NOTE]
>
>If any soft-deleted VMs are present in the vault, the vault cannot be deleted at that time.
Restore operation on a soft deleted item can only be performed after ‘undeleting’ the item.

Clicking on the soft deleted VM will provide an option to “undelete” the VM:

![Screenshot of Azure portal, Undelete VM](./media/backup-azure-security-feature-cloud/undelete-vm.png)

If undelete is chosen, all restore points for the VM will be undeleted and available for performing a restore operation. It will be retained in a “stop protection with retain data” state.


    
> [!NOTE]
>
>Garbage collection will run only if the user performs “Resume backup” operation.

The status will return to “Stop backup with retain data” and after the operation is completed, you can choose “Resume backup.”

![Screenshot of Azure portal, Resume Backup option](./media/backup-azure-security-feature-cloud/resume-backup.png)




## Next steps
