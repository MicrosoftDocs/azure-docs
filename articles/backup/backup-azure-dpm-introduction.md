<properties
	pageTitle="Introduction to Azure DPM backup | Microsoft Azure"
	description="An introduction to backing up DPM servers using the Azure Backup service"
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/12/2015"
	ms.author="jimpark"/>

# Introduction to Azure DPM Backup

This article provides an introduction to using Microsoft Azure Backup to protect your System Center Data Protection Manager (DPM) servers and workloads. By reading it you’ll understand:

- How Azure DPM server backup works
- The prerequisites to achieve a smooth backup experience
- The typical errors encountered and how to deal with them
- Supported scenarios

System Center DPM backs up file and application data. Data backed up to DPM can be stored on tape, on disk, or backed up to Azure with Microsoft Azure Backup. DPM interacts with Azure Backup as follows:

- **DPM deployed as a physical server or on-premises virtual machine** — If DPM is deployed as a physical server or as an on-premises Hyper-V virtual machine you can back up data to an Azure Backup vault in addition to disk and tape backup.
- **DPM deployed as an Azure virtual machine** — From System Center 2012 R2 with Update 3, DPM can be deployed as an Azure virtual machine. If DPM is deployed as an Azure virtual machine you can back up data to Azure disks attached to the DPM Azure virtual machine, or you can offload the data storage by backing it up to an Azure Backup vault.

## Why backup your DPM servers?

The business benefits of using Azure Backup for backing up DPM servers include:

- For on-premises DPM deployment, you can use Azure backup as an alternative to long-term deployment to tape.
- For DPM deployments in Azure, Azure Backup allows you to offload storage from the Azure disk, allowing you to scale up by storing older data in Azure Backup and new data on disk.

## How does DPM server backup work?
To back up a virtual machine, first a point-in-time snapshot of the data is needed. The Azure Backup service initiates the backup job at the scheduled time, and triggers the backup extension to take a snapshot. The backup extension coordinates with the in-guest VSS service to achieve consistency, and invokes the blob snapshot API of the Azure Storage service once consistency has been reached. This is done to get a consistent snapshot of the disks of the virtual machine, without having to shut it down.

After the snapshot has been taken, the data is transferred by the Azure Backup service to the backup vault. The service takes care of identifying and transferring only the blocks that have changed from the last backup making the backups storage and network efficient. When the data transfer is completed, the snapshot is removed and a recovery point is created. This recovery point can be seen in the Azure management portal.

>[AZURE.NOTE] For Linux virtual machines, only file-consistent backup is possible.

## Prerequisites
Prepare Azure Backup to back up DPM data as follows:

1. **Create a Backup vault** — Create a vault in the Azure Backup console.
2. **Download vault credentials** — In Azure Backup, upload the management certificate you created to the vault.
3. **Install the Azure Backup Agent and register the server** — From Azure Backup, install the agent on each DPM server and register the DPM server in the backup vault.

### Create a backup vault
To start backing up your Azure virtual machines, you need to first create a backup vault. The vault is an entity that stores all the backups and recovery points that have been created over time. The vault also contains the backup policies that will be applied to the virtual machines being backed up.

1. Sign in to the [Management Portal](http://manage.windowsazure.com/).
2. Click **New** > **Data Services** > **Recovery Services** > **Backup Vault** > **Quick Create**. If you have multiple subscriptions associated with your organizational account, choose the correct subscription to associate with the backup vault. In each Azure subscription you can have multiple backup vaults to organize the data being protected.
3. In **Name**, enter a friendly name to identify the vault. This needs to be unique for each subscription.
4. In **Region**, select the geographic region for the vault. Note that the vault must be in the same region as the virtual machines you want to protect. If you have virtual machines in different regions create a vault in each one. There is no need to specify storage accounts to store the backup data – the backup vault and the Azure Backup service will handle this automatically.
    > [AZURE.NOTE] Virtual machine backup using the Azure Backup service is only supported in select regions. Check list of [supported regions](http://azure.microsoft.com/regions/#services). If the region you are looking for is unsupported today, it will not appear in the dropdown list during vault creation.

5. In **Subscription**, enter the Azure subscription that you want to use the backup vault with.
6. Click on **Create Vault**.
    ![Create backup vault](./media/backup-azure-dpm-introduction/backup_vaultcreate.png)

    It can take a while for the backup vault to be created. Monitor the status notifications at the bottom of the portal.
![Create vault toast notification](./media/backup-azure-dpm-introduction/creating-vault.png)

    A message confirms that the vault has been successfully created and it will be listed in the Recovery Services page as **Active**.

    ![List of backup vaults](./media/backup-azure-dpm-introduction/backup_vaultslist.png)

7. Click on the backup vault to go to the **Quick Start** page, where the instructions for backup of DPM servers are shown.
    ![Virtual machine backup instructions in the Dashboard page](./media/backup-azure-dpm-introduction/vmbackup-instructions.png)

    > [AZURE.NOTE] Ensure that the appropriate storage redundancy option is chosen right after the vault has been created. Read more about [setting the storage redundancy option in the backup vault](http://azure.microsoft.com/documentation/articles/backup-azure-backup-create-vault/#azure-backup---storage-redundancy-options).

### Download vault credentials
1. Click **Recovery Services** and click the backup vault. On the **Quick Start** page, click **Download vault credentials** to download the credentials file and save to a safe location. You can’t edit the credentials so you don’t need to open the location. For security reasons, the key in the file expires after 48 hours.

2. Copy the file to a safe location that’s easily accessed by the DPM servers you want to register in the Azure Backup vault. You’ll need to select the file when you install the Azure Backup Agent.

### Install the Azure Backup Agent and register the server
You’ll download the Agent installation file and run it on each DPM server that contains data you want to back up. Agents are stored on the **Azure Download Center**, and they have their own setup process. When you run setup the Agent is installed and the DPM server is registered with the vault. Note that:

- You’ll need administrative permissions on the DPM server to install the Agent.
- To install on multiple DPM servers you can place the installer file on a shared network resource, or use Group Policy or management products such as System Center Configuration Manager to install the agent.
- You don’t need to restart the DPM server after the installation.

#### To install the backup agent and register the server

1. On the **Quick Start** page of the Azure Backup vault in **Download Azure Backup Agent** select **For Windows Server or System Center Data Protection Manager or Windows Client**. Download the application to the DPM server on which you want to run it.
2. Run the setup file **MARSAgentInstaller.exe**. Accept the service terms and select to install any missing prerequisite software.
3. On the **Installation Settings** page select the **Installation Folder** and **Cache Location**.

    The default cache location folder is <system drive>:\Program Files\Azure Backup Agent. In the cache location, the installation process creates a folder named **Scratch** in the **Azure Backup Agent** folder. The cache location must have at least 2.5 gigabytes (GB) (or 10% of the size of data that will be backed up to Azure) of free space. Only local system administrators and members of the Administrators group have access to the cache directory to prevent denial-of-service attacks.

4. On the **Proxy Configuration** page set custom proxy settings for the Agent to connect to Azure. If you don’t configure any settings the default Internet access settings on the DPM server will be used. Note that if you are using a proxy server that requires authentication you should input the details on this page.
5. On the **Microsoft Updates Opt-In** page we recommend that you enable updates. If the server is already enabled for automatic updates this step is skipped. Note that the Microsoft Update settings are for all Microsoft product updates, and aren’t exclusive to the Azure Backup Agent.
6. The **Installation** page is displayed. Installation checks that the required software is installed and completes setup. When it’s done you’ll receive a message that the Azure Backup Agent was installed successfully. At this point, you can choose to check for updates. We recommend that you allow the updates check to occur.
7. Click **Proceed to registration** to register the server in the vault.
8. In the **Vault Identification** page select the vault registration file you generated in the Azure Backup vault.
9. In the **Encryption Setting** page specify passphrase details or automatically generate a passphrase.
10. Click on Generate Passphrase followed by Copy to clipboard. You will receive a message that your passphrase has been copied to the clipboard. It is now a very good idea to open notepad and paste the passphrase from the clipboard and save the file, also print the file and lock it away. Click on Register to register your DPM server with your Backup Vault.

    > [AZURE.TIP] In the Encryption Setting step remember to copy the passphrase to the clipboard.
11. Click **Register**.

    After registration is complete, the DPM console shows the availability of Azure Backup.

    Azure Backup will always encrypt data at the source with the passphrase (alpha-numeric string) you specify or generate automatically.
    >[AZURE.NOTE] Azure Backup never maintains the passphrase and if you lose it the data can’t be restored or recovered. We strongly recommend that the save the key to an external location.

When you specify a passphrase and click **Finish** it takes a few seconds for the agent to register the production server to the backup vault. As soon as the registration with the vault finishes a summary **Server Registration** page appears.

## Requirements (and limitations)

- DPM can be running as a physical server or a Hyper-V virtual machine installed on System Center 2012 SP1 or System Center 2012 R2. It can also be running as an Azure virtual machine running on System Center 2012 R2 with at least DPM 2012 R2 Update Rollup 3 or a Windows virtual machine in VMWare running on System Center 2012 R2 with at least Update Rollup 5.
- If you’re running DPM with System Center 2012 SP1 you should install Update Roll up 2 for System Center Data Protection Manager SP1. This is required before you can install the Azure Backup Agent.
- The DPM server should have Windows PowerShell and .Net Framework 4.5 installed.
- DPM can back up most workloads to Azure Backup. For a full list of what’s supported see the Azure Backup support items below.
- Data stored in Azure Backup can’t be recovered with the “copy to tape” option.
- You’ll need an Azure account with the Azure Backup feature enabled. If you don't have an account, you can create a free trial account in just a couple of minutes. Read about [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).
- Using Azure Backup requires the Azure Backup Agent to be installed on the servers you want to back up. Each server must have at least 2.5 GB of local free storage space for cache location, although 15 GB of free local storage space to be used for the cache location is recommended.
- Data will be stored in the Azure vault storage. There’s no limit to the amount of data you can back up to an Azure Backup vault but the size of a data source (for example a virtual machine or database) shouldn’t exceed 1.65 TB.

These file types are supported for back up to Azure:

- Encrypted (Full backups only)
- Compressed (Incremental backups supported)
- Sparse (Incremental backups supported)
- Compressed and sparse (Treated as Sparse)

And these are unsupported:

- Servers on case-sensitive file systems aren’t supported.
- Hard links (Skipped)
- Reparse points (Skipped)
- Encrypted and compressed (Skipped)
- Encrypted and sparse (Skipped)
- Compressed stream
- Sparse stream

>[AZURE.NOTE] From in System Center 2012 DPM with SP1 onwards you can backup up workloads protected by DPM to Azure using Microsoft Azure Backup.
