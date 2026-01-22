---
title: Back Up and Restore Encrypted Azure VMs
description: This article describes how to back up and restore encrypted Azure VMs with Azure Backup.
ms.topic: how-to
ms.date: 01/22/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to back up and restore encrypted Azure virtual machines so that I can ensure data protection and recovery for my organization's critical workloads.
---
# Back up and restore encrypted Azure virtual machines

This article describes how to back up and restore Windows or Linux Azure virtual machines (VMs) with encrypted disks by using [Azure Backup](backup-overview.md). For more information, see [Encryption of Azure VM backups](backup-azure-vms-introduction.md#encryption-of-azure-vm-backups).

## Supported scenarios for backup and restore of encrypted Azure VMs

This section describes the supported scenarios for backup and restore of encrypted Azure VMs.

### Encryption by using platform-managed keys

By default, all the disks in your VMs are automatically encrypted at rest by using platform-managed keys (PMKs) that use [Storage Service Encryption (SSE)](../storage/common/storage-service-encryption.md). You can back up these VMs by using Azure Backup without any specific actions required to support encryption on your end. For more information about encryption with platform-managed keys, see [Back up and restore encrypted Azure VMs](/azure/virtual-machines/disk-encryption#platform-managed-keys).

![Screenshot that shows encrypted disks.](./media/backup-encryption/encrypted-disks.png)

### Encryption by using customer-managed keys

When you encrypt disks with customer-managed keys (CMKs), the key used for encrypting the disks is stored in Azure Key Vault, which you manage. SSE by using CMKs differs from Azure Disk Encryption (ADE). ADE uses the encryption tools of the OS. SSE encrypts data in the storage service, which enables you to use any OS or images for your VMs.

You don't need to perform any explicit actions for backup or restore of VMs that use CMKs for encrypting their disks. The backup data for these VMs stored in the vault is encrypted with the same methods as the [encryption used on the vault](encryption-at-rest-with-cmk.md).

For more information about encryption of managed disks with CMKs, see [Server-side encryption of Azure disk storage](/azure/virtual-machines/disk-encryption#customer-managed-keys).

### Encryption support by using ADE

Azure Backup supports backup of Azure VMs that have their OS/data disks encrypted with ADE. ADE uses Azure BitLocker for encryption of Windows VMs, and the dm-crypt feature for Linux VMs. ADE integrates with Azure Key Vault to manage disk-encryption keys and secrets. You can also use Key Vault key encryption keys (KEKs) to add an extra layer of security. KEKs encrypt secrets before writing them to Key Vault.

Azure Backup can back up and restore Azure VMs by using ADE with and without the Microsoft Entra app, as summarized in the following table.

VM disk type | ADE (BEK/dm-crypt) | ADE and KEK
--- | --- | ---
Unmanaged | Yes | Yes
Managed  | Yes | Yes

- Learn more about [ADE](/azure/virtual-machines/disk-encryption-overview), [Key Vault](/azure/key-vault/general/overview), and [KEKs](/azure/virtual-machine-scale-sets/disk-encryption-key-vault#set-up-a-key-encryption-key-kek).
- Read the [FAQ](/azure/virtual-machines/disk-encryption-overview) for Azure VM disk encryption.

### Limitations

Before you back up or restore encrypted Azure VMs, review the following limitations:

- You can back up and restore ADE-encrypted VMs within the same subscription.
- You can encrypt VMs only by using standalone keys. Any key that's a part of a certificate used to encrypt a VM isn't currently supported.
- You can restore data to a secondary region. Azure Backup supports cross-region restore of encrypted Azure VMs to the Azure paired regions. For more information, see [Support matrix](./backup-support-matrix.md#cross-region-restore).
- You can recover ADE-encrypted VMs at the file or folder level. You need to recover the entire VM to restore files and folders.
- You can't use the [replace existing VM](backup-azure-arm-restore-vms.md#restore-options) option for ADE-encrypted VMs when you restore a VM. This option is supported only for unencrypted managed disks.

## Before you start

Before you start, follow these steps:

1. Make sure that you have one or more [Windows](/azure/virtual-machines/linux/disk-encryption-overview) or [Linux](/azure/virtual-machines/linux/disk-encryption-overview) VMs with ADE enabled.
1. [Review the support matrix](backup-support-matrix-iaas.md) for Azure VM backup.
1. [Create](backup-create-rs-vault.md) a Recovery Services vault if you don't have one.
1. If you enable encryption for VMs that are already enabled for backup, provide Azure Backup with permissions to access the key vault so that backups can continue without disruption. [Learn more](#provide-permissions) about assigning these permissions.

In some circumstances, you might also need to install the VM agent on the VM.

Azure Backup backs up Azure VMs by installing an extension to the Azure VM agent that runs on the machine. If your VM was created from an Azure Marketplace image, the agent is installed and running. If you create a custom VM or you migrate an on-premises machine, you might need to [install the agent manually](backup-azure-arm-vms-prepare.md#install-the-vm-agent).

## Configure a backup policy

To configure a backup policy, follow these steps:

1. If you don't have a Recovery Services backup vault, follow [these instructions](backup-create-rs-vault.md) to create one.
1. Go to **Resiliency**, and then select **+ Configure protection**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/configure-protection.png" alt-text="Screenshot that shows the Configure protection option." lightbox="./media/backup-azure-arm-vms-prepare/configure-protection.png":::

1. On the **Configure protection** pane, fill in the following fields:

   - **Resources managed by**: Select **Azure**.
   - **Datasource type**: Select **Azure Virtual machines**.
   - **Solution**: Select **Azure Backup**.

   Then select **Continue**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/configure-system-protection.png" alt-text="Screenshot that shows the Configure protection pane." lightbox="./media/backup-azure-arm-vms-prepare/configure-system-protection.png":::

1. On the **Start: Configure Backup** pane, for **Datasource type**, select **Azure Virtual machines**, and select the vault that you created. Then select **Continue**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/select-backup-goal-1.png" alt-text="Screenshot that shows the Start: Configure Backup pane.":::

1. On the **Configure backup** pane, assign a backup policy.

   - The default policy backs up the VM once a day. The daily backups are retained for 30 days. Instant recovery snapshots are retained for two days.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/default-policy.png" alt-text="Screenshot that shows choosing the backup policy." lightbox="./media/backup-azure-arm-vms-prepare/default-policy.png":::

   - If you don't want to use the default policy, select **Create New**, and [create a custom policy](backup-azure-arm-vms-prepare.md#create-a-custom-policy).

1. Under **Virtual Machines**, select **Add**.

    ![Screenshot that shows adding virtual machines.](./media/backup-azure-vms-encryption/add-virtual-machines.png)

1. Choose the encrypted VMs that you want to back up by using the select policy, and select **OK**.

      ![Screenshot that shows selecting encrypted VMs.](./media/backup-azure-vms-encryption/selected-encrypted-vms.png)

1. If you're using Key Vault, on the vault page, you see a message that Azure Backup needs read-only access to the keys and secrets in the key vault:

    - If you receive this message, no action is required:

        ![Screenshot that shows the access is OK.](./media/backup-azure-vms-encryption/access-ok.png)

    - If you receive this message, set permissions as described in the [following procedure](#provide-permissions):

        ![Screenshot that shows the access warning.](./media/backup-azure-vms-encryption/access-warning.png)

1. Select **Enable Backup** to deploy the backup policy in the vault and enable backup for the selected VMs.

### Back up ADE-encrypted VMs with RBAC-enabled key vaults

To enable backups for ADE-encrypted VMs by using key vaults that are enabled by Azure role-based access control (RBAC), assign the Key Vault Administrator role to the Backup Management Service Microsoft Entra app by adding a role assignment on **Access control** for the key vault.

VM backup operations use the Backup Management Service app instead of the Recovery Services vault's managed identity to access the key vault. You must grant the necessary key vault permissions to this app for backups to function properly.

:::image type="content" source="./media/backup-azure-vms-encryption/enable-key-vault-encryption-inline.png" alt-text="Screenshot that shows the checkbox to enable an ADE-encrypted key vault." lightbox="./media/backup-azure-vms-encryption/enable-key-vault-encryption-expanded.png":::

Learn about the [available roles](/azure/key-vault/general/rbac-guide?tabs=azure-cli#azure-built-in-roles-for-key-vault-data-plane-operations). The Key Vault Administrator role allows permission to *get*, *list*, and *back up* both the secret and the key.

For Azure RBAC-enabled key vaults, you can create a custom role with the following set of permissions. Learn how to [create a custom role](../active-directory/roles/custom-create.md).

>[!Note]
>When you use Azure Government, ensure that the Key Vault Administrator role is assigned to the Backup Fairfax Microsoft Entra application to enable proper access and functionality.

| Action | Description |
| --- | --- |
| `Microsoft.KeyVault/vaults/keys/backup/action` | Creates the backup file of a key.  |
|` Microsoft.KeyVault/vaults/secrets/backup/action` | Creates the backup file of a secret.  |
| `Microsoft.KeyVault/vaults/secrets/getSecret/action` | Gets the value of a secret.  |
| `Microsoft.KeyVault/vaults/keys/read` | Lists keys in the specified vault or reads properties and public materials.  |
| `Microsoft.KeyVault/vaults/secrets/readMetadata/action` | Lists or views the properties of a secret, but not its values.    |

```json
"permissions": [
            {
                "actions": [],
                "notActions": [],
                "dataActions": [
                    "Microsoft.KeyVault/vaults/keys/backup/action",
                    "Microsoft.KeyVault/vaults/secrets/backup/action",
                    "Microsoft.KeyVault/vaults/secrets/getSecret/action",
                    "Microsoft.KeyVault/vaults/keys/read",
                    "Microsoft.KeyVault/vaults/secrets/readMetadata/action"
                ],
                "notDataActions": []
            }
        ]
```

:::image type="content"  source="./media/backup-azure-vms-encryption/key-vault-add-permissions.png" alt-text="Screenshot shows how to add permissions to a key vault.":::

## Trigger a backup job

The initial backup runs according to the schedule, but you can also run it immediately:

1. Go to **Resiliency** > **Protected items**.
1. On the **Protected items** pane, for **Datasource type**, select **Azure Virtual machines**. Then search for the VM that you configured for backup.
1. Right-click the relevant row or select **More** (**…**), and then select **Backup Now**.
1. On **Backup Now**, use the calendar control to select the last day that the recovery point should be retained. Then select **OK**.
1. Monitor the portal notifications.

   To monitor the job progress, go to **Resiliency** > **Jobs** and filter the list for jobs that are in progress. Depending on the size of your VM, creating the initial backup might take a while.

## Provide permissions

Azure Backup needs read-only access to back up the keys and secrets, along with the associated VMs.

- Your key vault is associated with the Microsoft Entra tenant of the Azure subscription. If you're a member user, Azure Backup acquires access to the key vault without further action.
- If you're a guest user, you must provide permissions for Azure Backup to access the key vault. You need to have access to key vaults to configure Azure Backup for encrypted VMs.

To provide Azure RBAC permissions on a key vault, see [Enable RBAC permissions on a key vault](/azure/key-vault/general/rbac-guide?tabs=azure-cli#enable-azure-rbac-permissions-on-key-vault).

To set permissions:

1. In the Azure portal, select **All services**, and search for **Key vaults**.
1. Select the key vault associated with the encrypted VM that you're backing up.

    > [!TIP]
    > To identify a VM's associated key vault, use the following PowerShell command. Substitute your resource group name and VM name:
    >
    >`Get-AzVm -ResourceGroupName "MyResourceGroup001" -VMName "VM001" -Status`
    >
    > Look for the key vault name in this line:
    >
    >`SecretUrl            : https://<keyVaultName>.vault.azure.net`
    >

1. Select **Access policies** > **Add Access Policy**.

    ![Screenshot that shows adding the access policy.](./media/backup-azure-vms-encryption/add-access-policy.png)

1. For **Add access policy** > **Configure from template (optional)**, select **Azure Backup**.

    - The required permissions are prefilled for **Key permissions** and **Secret permissions**.
    - If your VM is encrypted by using **BEK only**, remove the selection for **Key permissions** because you need permissions only for secrets.

    ![Screenshot that shows the Azure Backup selection.](./media/backup-azure-vms-encryption/select-backup-template.png)

1. Select **Add** to add **Backup Management Service** under **Current Access Policies**.

    ![Screenshot that shows access policies.](./media/backup-azure-vms-encryption/backup-service-access-policy.png)

1. Select **Save** to provide Azure Backup with the permissions.

You can also set the access policy by using [PowerShell](./backup-azure-vms-automation.md#enable-protection) or the [Azure CLI](./quick-backup-vm-cli.md#prerequisites-to-backup-encrypted-vms).

## Related content

- [Restore encrypted Azure virtual machines](restore-azure-encrypted-virtual-machines.md)

If you run into any issues, review these articles:

- [Common errors](backup-azure-vms-troubleshoot.md) when backing up and restoring encrypted Azure VMs.
- [Azure VM agent/backup extension](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md) issues.
- [Restore Key Vault key and secret for encrypted VMs by using Azure Backup](backup-azure-restore-key-secret.md).
