---
title: Back up and restore encrypted Azure VMs
description: Describes how to back up and restore encrypted Azure VMs with the Azure Backup service.
ms.topic: conceptual
ms.date: 04/03/2019
---
# Back up and restore encrypted Azure VM

This article describes how to back up and restore Windows or Linux Azure virtual machines (VMs) with encrypted disks using the [Azure Backup](backup-overview.md) service.

If you want to learn more about how Azure Backup interacts with Azure VMs before you begin, review these resources:

- [Review](backup-architecture.md#architecture-built-in-azure-vm-backup) the Azure VM backup architecture.
- [Learn about](backup-azure-vms-introduction.md) Azure VM backup, and the Azure Backup extension.

## Encryption support

Azure Backup supports backup of Azure VMs that have their OS/data disks encrypted with Azure Disk Encryption (ADE). ADE uses BitLocker for encryption of Windows VMs, and the dm-crypt feature for Linux VMs. ADE integrates with Azure Key Vault to manage disk-encryption keys and secrets. Key Vault Key Encryption Keys (KEKs) can be used to add an additional layer of security, encrypting encryption secrets before writing them to Key Vault.

Azure Backup can back up and restore Azure VMs using ADE with and without the Azure AD app, as summarized in the following table.

**VM disk type** | **ADE (BEK/dm-crypt)** | **ADE and KEK**
--- | --- | ---
**Unmanaged** | Yes | Yes
**Managed**  | Yes | Yes

- Learn more about [ADE](../security/azure-security-disk-encryption-overview.md), [Key Vault](../key-vault/key-vault-overview.md), and [KEKs](https://blogs.msdn.microsoft.com/cclayton/2017/01/03/creating-a-key-encrypting-key-kek/).
- Read the [FAQ](../security/azure-security-disk-encryption-faq.md) for Azure VM disk encryption.

### Limitations

- You can back up and restore encrypted VMs within the same subscription and region.
- Azure Backup supports VMs encrypted using standalone keys. Any key that is a part of a certificate used to encrypt a VM isn't currently supported.
- You can back up and restore encrypted VMs within the same subscription and region as the Recovery Services Backup vault.
- Encrypted VMs can’t be recovered at the file/folder level. You need to recover the entire VM to restore files and folders.
- When restoring a VM, you can't use the [replace existing VM](backup-azure-arm-restore-vms.md#restore-options) option for encrypted VMs. This option is only supported for unencrypted managed disks.

## Before you start

Before you start, do the following:

1. Make sure you have one or more [Windows](../security/azure-security-disk-encryption-windows.md) or [Linux](../virtual-machines/linux/disk-encryption-overview.md) VMs with ADE enabled.
2. [Review the support matrix](backup-support-matrix-iaas.md) for Azure VM backup
3. [Create](backup-azure-arm-vms-prepare.md#create-a-vault) a Recovery Services Backup vault if you don't have one.
4. If you enable encryption for VMs that are already enabled for backup, you simply need to provide Backup with permissions to access the Key Vault so that backups can continue without disruption. [Learn more](#provide-permissions) about assigning these permissions.

In addition, there are a couple of things that you might need to do in some circumstances:

- **Install the VM agent on the VM**: Azure Backup backs up Azure VMs by installing an extension to the Azure VM agent running on the machine. If your VM was created from an Azure marketplace image, the agent is installed and running. If you create a custom VM, or you migrate an on-premises machine, you might need to [install the agent manually](backup-azure-arm-vms-prepare.md#install-the-vm-agent).

## Configure a backup policy

1. If you haven't yet created a Recovery Services backup vault, follow [these instructions](backup-azure-arm-vms-prepare.md#create-a-vault)
2. Open the vault in the portal, and select **Backup** in the **Getting Started** section.

    ![Backup blade](./media/backup-azure-vms-encryption/select-backup.png)

3. In **Backup goal** > **Where is your workload running?** select **Azure**.
4. In **What do you want to back up?** select **Virtual machine** > **OK**.

      ![Scenario blade](./media/backup-azure-vms-encryption/select-backup-goal-one.png)

5. In **Backup policy** > **Choose backup policy**, select the policy that you want to associate with the vault. Then click **OK**.
    - A backup policy specifies when backups are taken, and how long they are stored.
    - The details of the default policy are listed under the drop-down menu.

    ![Open Scenario blade](./media/backup-azure-vms-encryption/select-backup-goal-two.png)

6. If you don't want to use the default policy, select **Create New**, and [create a custom policy](backup-azure-arm-vms-prepare.md#create-a-custom-policy).

7. Choose the encrypted VMs you want to back up using the select policy, and select **OK**.

      ![Select encrypted VMs](./media/backup-azure-vms-encryption/selected-encrypted-vms.png)

8. If you're using Azure Key Vault, on the vault page, you see a message that Azure Backup needs read-only access to the keys and secrets in the Key Vault.

    - If you receive this message, no action is required.

        ![Access OK](./media/backup-azure-vms-encryption/access-ok.png)

    - If you receive this message, you need to set permissions as described in the [procedure below](#provide-permissions).

        ![Access warning](./media/backup-azure-vms-encryption/access-warning.png)

9. Click **Enable Backup** to deploy the backup policy in the vault, and enable backup for the selected VMs.

## Trigger a backup job

The initial backup will run in accordance with the schedule, but you can run it immediately as follows:

1. In the vault menu, click **Backup items**.
2. In **Backup Items**, click **Azure Virtual Machine**.
3. In the **Backup Items** list, click the ellipses (...).
4. Click **Backup now**.
5. In **Backup Now**, use the calendar control to select the last day that the recovery point should be retained. Then click **OK**.
6. Monitor the portal notifications. You can monitor the job progress in the vault dashboard > **Backup Jobs** > **In progress**. Depending on the size of your VM, creating the initial backup may take a while.

## Provide permissions

Azure VM needs read-only access to back up the keys and secrets, along with the associated VMs.

- Your Key Vault is associated with the Azure AD tenant of the Azure subscription. If you're a **Member user**, Azure Backup acquires access to the Key Vault without further action.
- If you're a **Guest user**, you must provide permissions for Azure Backup to access the key vault.

To set permissions:

1. In the Azure portal, select **All services**, and search for **Key vaults**.
2. Select the key vault associated with the encrypted VM you're backing up.
3. Select **Access policies** > **Add new**.
4. Select **Select principal**, and then type **Backup Management**.
5. Select **Backup Management Service** > **Select**.

    ![Backup service selection](./media/backup-azure-vms-encryption/select-backup-service.png)

6. In **Add access policy** > **Configure from template (optional)**, select **Azure Backup**.
    - The required permissions are prefilled for **Key permissions** and **Secret permissions**.
    - If your VM is encrypted using **BEK only**, remove the selection for **Key permissions** since you only need permissions for secrets.

    ![Azure backup selection](./media/backup-azure-vms-encryption/select-backup-template.png)

7. Click **OK**. **Backup Management Service** is added to **Access policies**.

    ![Access policies](./media/backup-azure-vms-encryption/backup-service-access-policy.png)

8. Click **Save** to provide Azure Backup with the permissions.

## Restore an encrypted VM

You restore encrypted VMs as follows:

1. [Restore the VM disk](backup-azure-arm-restore-vms.md#restore-disks).
2. Recreate the virtual machine instance by doing one of the following:
    1. Use the template that's generated during the restore operation to customize VM settings, and trigger VM deployment. [Learn more](backup-azure-arm-restore-vms.md#use-templates-to-customize-a-restored-vm).
    2. Create a new VM from the restored disks using PowerShell. [Learn more](backup-azure-vms-automation.md#create-a-vm-from-restored-disks).
3. For Linux VMs, reinstall the ADE extension so the data disks are open and mounted.

## Next steps

If you run into any issues, review these articles:

- [Common errors](backup-azure-vms-troubleshoot.md) when backing up and restoring encrypted Azure VMs.
- [Azure VM agent/backup extension](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md) issues.
