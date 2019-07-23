---
title: Azure Backup - Offline backup or initial seeding using the Azure Import/Export service
description: Learn how Azure Backup enables you to send data off the network using the Azure Import/Export service. This article explains the offline seeding of the initial backup data by using the Azure Import Export service.
services: backup
author: saurabhsensharma
manager: shivamg
ms.service: backup
ms.topic: conceptual
ms.date: 05/17/2018
ms.author: saurse
---
# Offline-backup workflow in Azure Backup
Azure Backup has several built-in efficiencies that save network and storage costs during the initial full backups of data to Azure. Initial full backups typically transfer large amounts of data and require more network bandwidth when compared to subsequent backups that transfer only the deltas/incrementals. Through the process of offline seeding, Azure Backup can use disks to upload the offline backup data to Azure.

The Azure Backup offline-seeding process is tightly integrated with the [Azure Import/Export service](../storage/common/storage-import-export-service.md) that enables you to transfer initial backup data to Azure by using disks. If you have terabytes (TBs) of initial backup data that needs to be transferred over a high-latency and low-bandwidth network, you can use the offline-seeding workflow to ship the initial backup copy, on one or more hard drives, to an Azure datacenter. The following image provides an overview of the steps in the workflow.

  ![overview of offline import workflow process](./media/backup-azure-backup-import-export/offlinebackupworkflowoverview.png)

The offline backup process involves the following steps:

1. Instead of sending the backup data over the network, write the backup data to a staging location.
2. Use the AzureOfflineBackupDiskPrep utility to write the data in the staging location to one or more SATA disks.
3. As part of the preparatory work, the AzureOfflineBackupDiskPrep utility creates an Azure Import job. Send the SATA drives to the nearest Azure datacenter, and reference the import job to connect the activities.
4. At the Azure datacenter, the data on the disks is copied to an Azure storage account.
5. Azure Backup copies the backup data from the storage account to the Recovery Services vault, and incremental backups are scheduled.

## Supported configurations 
The following Azure Backup features or workloads support use of Offline Backup.

> [!div class="checklist"]
> * Backup of files and folders with the Microsoft Azure Recovery Services (MARS) agent, also referred to as the Azure Backup agent. 
> * Backup of all workloads and files with System Center Data Protection Manager (SC DPM) 
> * Backup of all workloads and files with Microsoft Azure Backup Server <br/>

   > [!NOTE]
   > Offline Backup is not supported for System State backups done using the Azure Backup agent. 

[!INCLUDE [backup-upgrade-mars-agent.md](../../includes/backup-upgrade-mars-agent.md)]

## Prerequisites

  > [!NOTE]
  > The following prerequisites and workflow apply only to Offline backup of files and folders using the [latest MARS agent](https://aka.ms/azurebackup_agent). To perform Offline backups for workloads using System Center DPM or Azure Backup Server, refer to [this article](backup-azure-backup-server-import-export-.md). 

Before initiating the Offline Backup workflow, complete the following prerequisites: 
* Create a [Recovery Services vault](backup-azure-recovery-services-vault-overview.md). To create a vault, refer to the steps in [this article](tutorial-backup-windows-server-to-azure.md#create-a-recovery-services-vault)
* Make sure that only the [latest version of the Azure Backup agent](https://aka.ms/azurebackup_agent) has been installed on the Windows Server/Windows client, as applicable and the computer is registered with the Recovery Services Vault.
* Azure PowerShell 3.7.0 is required on the computer running Azure Backup agent. It is recommended that you download and [install the 3.7.0 version of Azure PowerShell](https://github.com/Azure/azure-powershell/releases/tag/v3.7.0-March2017).
* On the computer running Azure Backup agent, make sure Microsoft Edge or Internet Explorer 11 is installed, and JavaScript is enabled. 
* Create an Azure Storage account in the same subscription as the Recovery Services vault. 
* Make sure you have the [necessary permissions](../active-directory/develop/howto-create-service-principal-portal.md) to create the Azure Active Directory application. The Offline Backup workflow creates an Azure Active Directory application in the subscription associated with the Azure Storage account. The goal of the application is to provide Azure Backup with secure and scoped access to the Azure Import Service, required for the Offline Backup workflow. 
* Register the Microsoft.ImportExport resource provider with the subscription containing the Azure Storage account. To register the resource provider:
    1. In the main menu, Click **Subscriptions**.
    2. If you are subscribed to multiple subscriptions, select the subscription you're using for the offline backup. If you use only one subscription, then your subscription appears.
    3. In the subscription menu, click **Resource Providers** to view the list of providers.
    4. In the list of providers scroll down to Microsoft.ImportExport. If the Status is NotRegistered, click **Register**.
    ![registering the resource provider](./media/backup-azure-backup-import-export/registerimportexport.png)
* A staging location, which might be a network share or any additional drive on the computer, internal or external, with enough disk space to hold your initial copy, is created. For example, if you are trying to back up a 500-GB file server, ensure that the staging area is at least 500 GB. (A smaller amount is used due to compression.)
* When sending disks to Azure, use only 2.5 inch SSD, or 2.5-inch or 3.5-inch SATA II/III internal hard drives. You can use hard drives up to 10 TB. Check the [Azure Import/Export service documentation](../storage/common/storage-import-export-requirements.md#supported-hardware) for the latest set of drives that the service supports.
* The SATA drives must be connected to a computer (referred to as a *copy computer*) from where the copy of backup data from the *staging location* to the SATA drives is done. Ensure that BitLocker is enabled on the *copy computer*.

## Workflow
This section describes the offline-backup workflow so that your data can be delivered to an Azure datacenter and uploaded to Azure Storage. If you have questions about the Import service or any aspect of the process, see the [Import service overview documentation](../storage/common/storage-import-export-service.md).

## Initiate offline backup
1. When you schedule a backup on the MARS Agent, you see the following screen.

    ![Import screen](./media/backup-azure-backup-import-export/offlinebackup_inputs.png)

   The description of the inputs is as follows:

    * **Staging Location**: The temporary storage location to which the initial backup copy is written. Staging location might be on a network share or a local computer. If the copy computer and source computer are different, we recommended that you specify the full network path of the staging location.
    * **Azure Resource Manager Storage Account**: The name of the Resource Manager type storage account (general purpose v1 or general purpose v2) in any Azure subscription.
    * **Azure Storage Container**: The name of the destination storage blob in the Azure Storage account where the backup data is imported before being copied to the Recovery Services vault.
    * **Azure Subscription ID**: The ID for the Azure subscription where the Azure Storage account is created.
    * **Azure Import Job Name**: The unique name by which Azure Import service and Azure Backup track the transfer of data sent on disks to Azure. 
  
   Provide the inputs on the screen and click **Next**. Save the provided *Staging location* and the *Azure Import Job Name*, as this information is required to prepare the disks.

2. When prompted, sign into your Azure subscription. You must sign in so that Azure Backup can create the Azure Active Directory application, and provide the required permissions to access the Azure Import Service.

    ![Backup now](./media/backup-azure-backup-import-export/azurelogin.png)

3. Complete the workflow, and in the Azure Backup agent console click **Back Up Now**.

    ![Backup now](./media/backup-azure-backup-import-export/backupnow.png)

4. In the Confirmation page of the wizard, click **Back Up**. The initial backup is written to the staging area as part of the setup.

   ![Confirm that you're ready to Backup now](./media/backup-azure-backup-import-export/backupnow-confirmation.png)

    After the operation finishes, the staging location is ready to be used for disk preparation.

   ![Backup now](./media/backup-azure-backup-import-export/opbackupnow.png)

## Prepare SATA drives and ship to Azure
The *AzureOfflineBackupDiskPrep* utility prepares the SATA drives that are sent to the nearest Azure datacenter. This utility is available in the Azure Backup agent installation directory (in the following path):

   *\Microsoft Azure Recovery Services Agent\Utils\\*

1. Go to the directory and copy the **AzureOfflineBackupDiskPrep** directory to another computer where the SATA drives are connected. On the computer with the connected SATA drives, ensure:

   * The copy computer can access the staging location for the offline-seeding workflow by using the same network path that was provided in the **Initiate offline backup** workflow.
   * BitLocker is enabled on the copy computer.
   * Azure PowerShell 3.7.0 is installed.
   * The latest compatible browsers (Microsoft Edge or Internet Explorer 11) are installed and JavaScript is enabled. 
   * The copy computer can access the Azure portal. If necessary, the copy computer can be the same as the source computer.
    
     > [!IMPORTANT] 
     > If the source computer is a virtual machine, then the copy computer must be a different physical server or client machine from the source computer.

2. Open an elevated command prompt on the copy computer with the *AzureOfflineBackupDiskPrep* utility directory as the current directory, and run the following command:

    ```.\AzureOfflineBackupDiskPrep.exe s:<Staging Location Path>```

    | Parameter | Description |
    | --- | --- |
    | s:&lt;*Staging Location Path*&gt; |Mandatory input used to provide the path to the staging location that you entered in the **Initiate offline backup** workflow. |
    | p:&lt;*Path to PublishSettingsFile*&gt; |Optional input that's used to provide the path to the **Azure Publish Settings** file that you entered in the **Initiate offline backup** workflow. |

    When you run the command, the utility requests the selection of the Azure Import job that corresponds to the drives that need to be prepared. If only a single import job is associated with the provided staging location, you see a screen like the one that follows.

    ![Azure Disk Preparation tool input](./media/backup-azure-backup-import-export/diskprepconsole0_1.png) <br/>

3. Enter the drive letter without the trailing colon for the mounted disk that you want to prepare for transfer to Azure. 
4. Provide confirmation for the formatting of the drive when prompted.
5. You are prompted to sign into your Azure subscription. Provide your credentials.

    ![Azure Disk Preparation tool input](./media/backup-azure-backup-import-export/signindiskprep.png) <br/>

    The tool then begins to prepare the disk and copying the backup data. You may need to attach additional disks when prompted by the tool in case the provided disk does not have sufficient space for the backup data. <br/>

    At the end of successful execution of the tool, the command prompt provides three pieces of information:
   1. One or more disks you provided are prepared for shipping to Azure. 
   2. You receive confirmation that your import job has been created. The import job uses the name you provided.
   3. The tool displays the shipping address for the Azure datacenter.

      ![Azure disk preparation complete](./media/backup-azure-backup-import-export/console2.png)<br/>

6. At the end of the command execution, you can update the shipping information.

7. Ship the disks to the address that the tool provided and keep the tracking number for future reference.

   > [!IMPORTANT] 
   > No two Azure Import Jobs can have the same tracking number. Ensure that drives prepared by the utility under a single Azure Import job are shipped together in a single package and that there is a single unique tracking number for the package. Do not combine drives prepared as part of separate Azure Import jobs in a single package.



## Update shipping details on the Azure Import job

The following procedure updates the Azure Import job shipping details. This information includes details about:
* the name of the carrier who delivers the disks to Azure
* return shipping details for your disks

1. Sign in to your Azure subscription.
2. In the main menu, click **All services** and in the All services dialog, type Import. When you see **Import/Export jobs**, click it.
    ![Entering Shipping Information](./media/backup-azure-backup-import-export/search-import-job.png)<br/>

    The list of **Import/export jobs** menu opens, and the list of all Import/export jobs in the selected subscription appears. 

3. If you have multiple subscriptions, be sure to select the subscription used to import the backup data. Then select the newly created Import job to open its details.

    ![Review Shipping Information](./media/backup-azure-backup-import-export/import-job-found.png)<br/>

4. On the Settings menu for the Import job, click **Manage Shipping Info** and enter the return shipping details.

    ![Storing Shipping Information](./media/backup-azure-backup-import-export/shipping-info.png)<br/>

5. When you have the tracking number from your shipping carrier, click the banner in the Azure Import job overview page and enter the following details:

   > [!IMPORTANT] 
   > Ensure that the carrier information and tracking number are updated within two weeks of Azure import job creation. Failure to verify this information within two weeks can result in the job being deleted, and drives not being processed.

   ![Storing Shipping Information](./media/backup-azure-backup-import-export/joboverview.png)<br/>

   ![Storing Shipping Information](./media/backup-azure-backup-import-export/tracking-info.png)

### Time to process the drives 
The amount of time it takes to process an Azure import job varies depending on different factors such as shipping time, job type, type and size of the data being copied, and the size of the disks provided. The Azure Import/Export service does not have an SLA but after the disks are received the service strives to complete the backup data copy to your Azure storage account in 7 to 10 days. 

### Monitoring Azure Import Job status
You can monitor the status of your Import job from the Azure portal by navigating to the **Import/Export jobs** page and selecting your job. For more information on the status of the Import jobs, see the [Storage Import Export service](../storage/common/storage-import-export-service.md) article.

### Complete the workflow
After the import job successfully completes, initial backup data is available in your storage account. At the time of the next scheduled backup, Azure Backup copies the contents of the data from the storage account to the Recovery Services vault as shown below: 

   ![Copying data to Recovery Services Vault](./media/backup-azure-backup-import-export/copyingfromstorageaccounttoazurebackup.png)<br/>

At the time of the next scheduled backup, Azure Backup performs an incremental backup.

### Cleaning up resources
Once the initial backup is complete, you can safely delete the data imported to the Azure Storage Container and the backup data in the Staging Location.

## Next steps
* For any questions on the Azure Import/Export workflow, refer to [Use the Microsoft Azure Import/Export service to transfer data to Blob storage](../storage/common/storage-import-export-service.md).
* Refer to the offline-backup section of the Azure Backup [FAQ](backup-azure-backup-faq.md) for any questions about the workflow.
