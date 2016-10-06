<properties
   pageTitle="Backup and restore of encrypted VMs using Azure Backup"
   description="This article talks about the backup and restore experience for VMs encrypted using Azure Disk Encryption."
   services="backup"
   documentationCenter=""
   authors="JPallavi"
   manager="vijayts"
   editor=""/>
<tags
   ms.service="backup"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="storage-backup-recovery"
   ms.date="06/10/2016"
   ms.author="markgal; jimpark; trinadhk"/>

# Backup and restore of encrypted VMs using Azure Backup

This article talks about steps to backup and restore virtual machines using Azure Backup. It also provides details about supported scenarios, pre-requisites and troubleshooting steps for error cases.

## Supported Scenarios

1.	Backup and restore of encrypted VMs is supported only for Resource Manager deployed virtual machines. It is not supported for Classic virtual machines.
2.	It is supported only for virtual machines encrypted using BitLocker Encryption Key and Key Encryption Key both. It is not supported for virtual machines encrypted using BitLocker Encryption Key only.

## Pre-requisites

1.	Virtual machine has been encrypted using [Azure Disk Encryption](../security/azure-security-disk-encryption.md). It should be encrypted using BitLocker Encryption Key and Key Encryption Key both.
2.	Recovery services vault has been created and storage replication set using steps mentioned in the article [Prepare your environment for backup](backup-azure-arm-vms-prepare.md).

## Backup encrypted virtual machine
Use the following steps to set backup goal, define policy and configure items to be backed up.

### Configure backup

1. If you already have a Recovery Services vault open, proceed to next step. If you do not have a Recovery Services vault open, but are in the Azure portal, on the Hub menu, click **Browse**.

  - In the list of resources, type **Recovery Services**.
  - As you begin typing, the list will filter based on your input. When you see **Recovery Services vaults**, click it.
  
      ![Create Recovery Services Vault step 1](./media/backup-azure-vms-first-look-arm/browse-to-rs-vaults.png) <br/>

    The list of Recovery Services vaults appears.
  - From the list of Recovery Services vaults, select a vault.

    The selected vault dashboard opens.

    ![Open vault blade](./media/backup-azure-vms-first-look-arm/vault-settings.png)

2. From the vault dashboard menu click **Backup** to open the Backup blade.

    ![Open Backup blade](./media/backup-azure-vms-first-look-arm/backup-button.png)
    
3. On the Backup blade, click **Backup goal** to open the Backup Goal blade.

    ![Open Scenario blade](./media/backup-azure-vms-first-look-arm/select-backup-goal-one.png)
    
4.	 On the Backup Goal blade, set **Where is your workload running** to Azure and  **What do you want to backup** to Virtual machine, then click **OK**.

    The Backup Goal blade closes and the Backup policy blade opens.

    ![Open Scenario blade](./media/backup-azure-vms-first-look-arm/select-backup-goal-two.png)

5. On the Backup policy blade, select the backup policy you want to apply to the vault and click **OK**.

    ![Select backup policy](./media/backup-azure-vms-first-look-arm/setting-rs-backup-policy-new.png)

    The details of the default policy are listed in the details. If you want to create a new policy, select **Create New** from the drop-down menu. Once you click **OK**, the backup policy is associated with the vault.

    Next choose the VMs to associate with the vault.
    
6. Choose the encrypted virtual machines to associate with the specified policy and click **OK**.

7. This page shows a message about key vault associated to the encrypted VMs selected. Backup service requires read only access to the keys and secrets in the key vault. It uses these permissions to backup key and secret, along with the associated VMs. 

   Now that you have defined all settings for the vault, in the Backup blade click Enable Backup at the bottom of the page. This deploys    the policy to the vault and the VMs.

8. The next phase in preparation is installing the VM Agent or making sure the VM Agent is installed. This can be done using steps mentioned in the article [Prepare your environment for backup](backup-azure-arm-vms-prepare.md). 

### Triggering backup job
Use the steps mentioned in the article [Backup Azure VMs to recovery services vault](backup-azure-arm-vms.md) to trigger backup job and troubleshoot errors if any.

## Restore encrypted virtual machines
Restore experience for encrypted and non-encrypted virtual machines is the same. Use the steps mentioned in [restore virtual machines in Azure portal](backup-azure-arm-restore-vms.md) to restore the encrypted VM. 

## Troubleshooting errors

| Operation | Error details | Resolution |
| -------- | -------- | -------|
| Backup | Validation failed as virtual machine is encrypted with BEK along. Backups can be enabled only for virtual machines encrypted with both BEK and KEK. | Virtual machine should be encrypted using BEK and KEK. After that, backup should be enabled. |
| Restore | You cannot restore this encrypted VM since key vault associated with this VM does not exist. | Manage key vault using [Get Started with Azure Key Vault](../key-vault/key-vault-get-started.md). Refer the article [Restore key vault key and secret using Azure Backup](backup-azure-arm-restore-key-secret.md) to restore key and secret if they are not present. |
| Restore | You cannot restore this encrypted VM since key and secret associated with this VM do not exist. | Refer the article [Restore key vault key and secret using Azure Backup](backup-azure-arm-restore-key-secret.md) to restore key and secret if they are not present. |
