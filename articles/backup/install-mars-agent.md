---
title: Install the Microsoft Azure Recovery Services (MARS) agent
description: Learn how to install the Microsoft Azure Recovery Services (MARS) agent to back up Windows machines.
ms.topic: how-to
ms.date: 11/07/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick

---

# Install the Azure Backup MARS agent

This article explains how to install the Microsoft Azure Recovery Services (MARS) agent. MARS is also known as the Azure Backup agent.

## About the MARS agent

Azure Backup uses the MARS agent to back up files, folders, and system state from on-premises machines and Azure VMs. Those backups are stored in a Recovery Services vault in Azure. You can run the agent:

* Directly on on-premises Windows machines. These machines can back up directly to a Recovery Services vault in Azure.
* On Azure VMs that run Windows side by side with the Azure VM backup extension. The agent backs up specific files and folders on the VM.
* On a Microsoft Azure Backup Server (MABS) instance or a System Center Data Protection Manager (DPM) server. In this scenario, machines and workloads back up to MABS or Data Protection Manager. Then MABS or Data Protection Manager uses the MARS agent to back up to a vault in Azure.

The data that's available for backup depends on where the agent is installed.

> [!NOTE]
> Generally, you back up an Azure VM by using an Azure Backup extension on the VM. This method backs up the entire VM. If you want to back up specific files and folders on the VM, install and use the MARS agent alongside the extension. For more information, see [Architecture of a built-in Azure VM backup](backup-architecture.md#architecture-built-in-azure-vm-backup).

![Backup process steps](./media/backup-configure-vault/initial-backup-process.png)

## Before you start

* Learn how [Azure Backup uses the MARS agent to back up Windows machines](backup-architecture.md#architecture-direct-backup-of-on-premises-windows-server-machines-or-azure-vm-files-or-folders).
* Learn about the [backup architecture](backup-architecture.md#architecture-back-up-to-dpmmabs) that runs the MARS agent on a secondary MABS or Data Protection Manager server.
* Review [what's supported and what you can back up](backup-support-matrix-mars-agent.md) by the MARS agent.
* Make sure that you have an Azure account if you need to back up a server or client to Azure. If you don't have an account, you can create a [free one](https://azure.microsoft.com/free/) in just a few minutes.
* Verify internet access on the machines that you want to back up.
* Ensure the user installing and configuring the MARS agent has local administrator privileges on the server to be protected.
* [Ensure your server is running on TLS 1.2](transport-layer-security.md).
* To prevent errors during vault registration, ensure that the latest MARS agent version is used. If not, we recommend you to download it [from here](https://aka.ms/azurebackup_agent) or [from the Azure portal as mentioned in this section](#download-the-mars-agent).

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Modify storage replication

By default, vaults use [geo-redundant storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage).

* If the vault is your primary backup mechanism, we recommend that you use GRS.
* You can use [locally redundant storage (LRS)](../storage/common/storage-redundancy.md#locally-redundant-storage) to reduce Azure storage costs.

To modify the storage replication type:

1. In the new vault, select **Properties** under the **Settings** section.

1. On the **Properties** page, under **Backup Configuration**, select **Update**.

1. Select the storage replication type, and select **Save**.

    ![Update Backup Configuration](./media/backup-afs/backup-configuration.png)

> [!NOTE]
> You can't modify the storage replication type after the vault is set up and contains backup items. If you want to do this, you need to re-create the vault.
>

## Configure Recovery Services vault to save passphrase to Recovery Services vault

Azure Backup using the Recovery Services agent (MARS) allows you to back up file or folder and system state data to Azure Recovery Services vault. This data is encrypted using a passphrase provided during the installation and registration of the MARS agent. This passphrase is required to retrieve and restore the backup data and needs to be saved in a secure external location, such as Azure Key Vault.

We recommend you to create a Key Vault and provide permissions to your Recovery Services vault to save the passphrase to the Key Vault. [Learn more](save-backup-passphrase-securely-in-azure-key-vault.md).

### Verify internet access

[!INCLUDE [Configuring network connectivity](../../includes/backup-network-connectivity.md)]

## Download the MARS agent

Download the MARS agent so that you can install it on the machines that you want to back up.

If you've already installed the agent on any machines, ensure you're running the latest agent version. Find the latest version in the portal, or [download from here](https://aka.ms/azurebackup_agent).

1. In the vault, under **Getting Started**, select **Backup**.

    ![Open the backup goal](./media/backup-try-azure-backup-in-10-mins/open-backup-settings.png)

1. Under **Where is your workload running?**, select **On-premises**. Select this option even if you want to install the MARS agent on an Azure VM.
1. Under **What do you want to back up?**, select **Files and folders**. You can also select **System State**. Many other options are available, but these options are supported only if you're running a secondary backup server. Select **Prepare Infrastructure**.

    ![Configure files and folders](./media/backup-try-azure-backup-in-10-mins/set-file-folder.png)

1. For **Prepare infrastructure**, under **Install Recovery Services agent**, download the MARS agent.

    ![Prepare the infrastructure](./media/backup-try-azure-backup-in-10-mins/choose-agent-for-server-client.png)

1. In the download menu, select **Save**. By default, the *MARSagentinstaller.exe* file is saved to your Downloads folder.

1. Select **Already download or using the latest Recovery Services Agent**, and then download the vault credentials.

    ![Download vault credentials](./media/backup-try-azure-backup-in-10-mins/download-vault-credentials.png)

1. Select **Save**. The file is downloaded to your Downloads folder. You can't open the vault credentials file.

## Install and register the agent

1. Run the *MARSagentinstaller.exe* file on the machines that you want to back up.
1. In the MARS Agent Setup Wizard, select **Installation Settings**. There, choose where to install the agent, and choose a location for the cache. Then select **Next**.
   * Azure Backup uses the cache to store data snapshots before sending them to Azure.
   * The cache location should have free space equal to at least 5 percent of the size of the data you'll back up.

    ![Choose installation settings in the MARS Agent Setup Wizard](./media/backup-configure-vault/mars1.png)

1. For **Proxy Configuration**, specify how the agent that runs on the Windows machine will connect to the internet. Then select **Next**.

   * If you use a custom proxy, specify any necessary proxy settings and credentials.
   * Remember that the agent needs access to [specific URLs](#before-you-start).

    ![Set up internet access in the MARS wizard](./media/backup-configure-vault/mars2.png)

1. For **Installation**, review the prerequisites, and select **Install**.
1. After the agent is installed, select **Proceed to Registration**.
1. In **Register Server Wizard** > **Vault Identification**, browse to and select the credentials file that you downloaded. Then select **Next**.

    ![Add vault credentials by using the Register Server Wizard](./media/backup-configure-vault/register1.png)

1. On the **Encryption Setting** page, specify a passphrase that will be used to encrypt and decrypt backups for the machine. [Learn more](backup-azure-file-folder-backup-faq.yml#what-characters-are-allowed-for-the-passphrase-) about the allowed passphrase characters.

    * Save the passphrase in a secure location. You need it to restore a backup.
    * If you lose or forget the passphrase, Microsoft can't help you recover the backup data.

   The MARS agent can automatically save the passphrase securely to Azure Key Vault. So, we recommend you create a Key Vault and grant permissions to your Recovery Services vault to save the passphrase to the Key Vault before registering your first MARS agent to the vault. [Learn more](save-backup-passphrase-securely-in-azure-key-vault.md).

   After granting the required permissions, you can save the passphrase to the Key Vault by copying the *Key Vault URI* from the Azure portal and to the Register Server Wizard.

   :::image type="content" source="./media/backup-configure-vault/encryption-settings-passphrase-to-encrypt-decrypt-backups.png" alt-text="Screenshot showing to specify a passphrase to be used to encrypt and decrypt backups for machines.":::

1. Select **Finish**. The agent is now installed, and your machine is registered to the vault. You're ready to configure and schedule your backup.

   If you are running into issues during vault registration, see the [troubleshooting guide](backup-azure-mars-troubleshoot.md#invalid-vault-credentials-provided).

   >[!Note]
   >We recommend to save your passphrase in an alternate secure location, such as the Azure key vault. Microsoft can't recover the data without the passphrase. [Learn](save-backup-passphrase-securely-in-azure-key-vault.md) how to store a secret in a Key Vault.

## Next steps

Learn how to [Back up Windows machines by using the Azure Backup MARS agent](backup-windows-with-mars-agent.md)