<properties
   pageTitle="Azure Backup - Offline Backup or Initial Seeding using Azure Import/Export Service | Microsoft Azure"
   description="Learn how Azure Backup enables you to send data off the network using Azure Import/Export service. This article explains the offline seeding of the initial backup data by using the Azure Import Export service"
   services="backup"
   documentationCenter=""
   authors="saurabhsensharma"
   manager="shivamg"
   editor=""/>
<tags
   ms.service="backup"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="storage-backup-recovery"
   ms.date="01/28/2016"
   ms.author="jimpark;saurabhsensharma;nkolli;trinadhk"/>

# Offline Backup workflow in Azure Backup
Azure Backup has several efficiencies built-in to save network and storage costs during the initial ‘full’ backups of data to Azure.  Initial “full” backups typically transfer large amounts of data and hence require more network bandwidth, as compared to subsequent backups that only transfer the deltas/incrementals. Not only does Azure backup compress the initial backups but through the process of Offline-seeding, provides a mechanism to upload the compressed initial backup data offline to Azure through disks.  

The Offline seeding process of Azure Backup is tightly integrated with the [Azure Import/Export service](../storage/storage-import-export-service.md) that enables you to transfer data to Azure quickly using disks. If you have TBs of initial backup data that needs to be transferred over a high latency & low-bandwidth network, you can use the Offline seeding workflow to ship the initial backup copy on one or more hard drives to an Azure data center. This article provides an overview of the steps required to complete this workflow.

## Overview

With Azure Backup’s Offline seeding capability and Azure Import/Export, it is simple and straightforward to upload the data offline to Azure through disks. Instead of transferring the initial full copy over the network, the backup data is written to a *staging location*. Once the initial copy to the *staging location* is completed, using the *Azure Import/Export tool*, this data is written to one or more SATA drives, depending on the size of the initial backup. These drives are eventually shipped to the nearest Azure data center. 

The [August 2016 update of Azure Backup (and above)](http://go.microsoft.com/fwlink/?LinkID=229525&clcid=0x409), ships with an *Azure Disk Preparation tool* named **AzureOfflineBackupDiskPrep** that:

   - Assists you in preparing your drives for Azure Import with ease, using the Azure Import/Export tool
   - Automatically creates an Azure Import Job for the Azure Import/Export service on [Azure Classic Portal](https://manage.windowsazure.com) as opposed to creating the same manually with older versions of Azure Backup

Once the upload of the backup data to Azure is complete, Azure Backup copies the backup data to the backup vault and the incremental backups are scheduled.

  > [AZURE.NOTE] To use the Azure Disk Preparation tool, ensure that you have installed the August 2016 update of Azure Backup (or above), and perform all the steps of the workflow with it. If you are using an older version of Azure Backup, you can prepare the SATA drive using *Azure Import/Export tool* as detailed in later sections of this article.

## Prerequisites

1. It is important to familiarize yourself with the Azure Import export workflow that is listed [here](../storage/storage-import-export-service.md).
2. Before initiating the workflow, ensure that an Azure Backup vault has been created, vault credentials have been downloaded, Azure Backup agent has been installed on either your Windows Server/Windows Client or System Center Data Protection Manager (SCDPM) server and that the machine is registered with the Azure Backup vault.
3. Download the Azure Publish file settings from [here](https://manage.windowsazure.com/publishsettings) on the machine from which you plan to backup our data.
4. Prepare a *staging location* that could be a network share or additional drive on the machine. The staging location is 'transient storage' and is used temporarily during this workflow. Ensure that the staging location has enough disk space to hold your initial copy. For example, if you are trying to backup a 500GB file server, ensure that the staging area is at least 500GB (though a lesser amount is used due to compression). 
5. External SATA drive writer and an external 3.5-Inch SATA drive. Only 3.5 inch SATA II/III hard drives are supported for use with the Import/Export service. Hard drives larger than 8 TB are not supported. You can attach a SATA II/III disk externally to most computers using a SATA II/III USB Adapter. Check the Azure Import/Export documentation for the latest set of drives that are supported by the service.
6. Enable BitLocker on the machine to which the SATA drive writer is connected.
7. Download the Azure Import/Export tool from [here](http://go.microsoft.com/fwlink/?LinkID=301900&clcid=0x409) to the machine to which the SATA drive writer is connected. This step is not required if you have downloaded and installed the August 2016 update of Azure Backup (or above). 

## Workflow
The information provided in this section is for completing the **Offline Backup** workflow so your data can be delivered to an Azure data center and uploaded to Azure storage. If you have questions about the Import service or any aspect of the process, see the [Import service overview](../storage/storage-import-export-service.md) documentation referenced above.

### Initiate Offline Backup

1. As part of scheduling a backup, you encounter the following screen (in Windows Server, Windows client or SCDPM).

    ![ImportScreen](./media/backup-azure-backup-import-export/offlineBackupscreenInputs.png)

    The corresponding screen in SCDPM looks as follows. <br/>
    ![DPM Import screen](./media/backup-azure-backup-import-export/dpmoffline.png)

    The description of the inputs is as follows:

    - **Staging Location** - Refers to the temporary storage location to which the initial backup copy is written. This could be on a network share or on the local machine. If the *copy machine* and *source machine* are different, then it is recommended to specify the full network path of the staging location.
    - **Azure Import Job Name** - Refers to the unique name by which Azure Import service and Azure Backup tracks the transfer of data sent using disks to Azure. 
    - **Azure Publish Settings** - XML file that contains information about your subscription profile. It also contains secure credentials associated to your subscription. The file can be downloaded from [here](https://manage.windowsazure.com/publishsettings). Provide the local path to the publish settings file.
    - **Azure Subscription ID** - The Azure subscription id in which you plan to initiate the Azure Import job. If you have multiple Azure subscriptions, use the ID with which you wish to associate the Import Job.
    - **Azure Storage Account** - The “Classic” type storage account in the provided Azure Subscription, that will be associated with the Azure Import job. 
    - **Azure Storage Container** - The name of the destination storage blob in the Azure Storage Account where this job’s data is imported.
    
    > [AZURE.NOTE] If you have registered your server to a Recovery Services Vault from the [new Azure portal](https://ms.portal.azure.com) for your backups and are not on a Cloud Service Provider (CSP) subscription, you can still create a Classic Storage account from the new Azure portal and use it for the Offline-backup workflow.
    
    Save all this information separately as this information needs to reentered in following steps. Only the *staging location* is required if the *Azure Disk Preparation tool* is used to prepare the disks    
    

2. Complete the workflow and select **Back Up Now** in the Azure Backup management console in order to initiate the offline backup copy. The initial backup is written to the staging area as part of this step.

    ![Backup now](./media/backup-azure-backup-import-export/backupnow.png)
    The corresponding workflow in SCDPM is enabled by right-clicking on the **Protection Group** and choosing the **Create recovery point** option. This step is followed by choosing the **Online Protection** option.

    ![DPM Backup now](./media/backup-azure-backup-import-export/dpmbackupnow.png)

    Once the operation completes, the staging location is ready to be used for disk preparation

    ![Output](./media/backup-azure-backup-import-export/opbackupnow.png)

###Prepare SATA Drive and Create Azure Import Job using *Azure Disk Preparation Tool*
The *Azure Disk Preparation tool* is available within installation directory of the Microsoft Azure Recovery Services agent (August 2016 update & above) in the following path.

   \Microsoft Azure Recovery Services Agent\Utils\

1. Navigate to the directory above and copy the **AzureOfflineBackupDiskPrep** directory to a *copy machine* on which the drives to be prepared are mounted. Ensure the following with regards to the *copy machine*

      - The *Staging Location* provided for the Offline-seeding workflow is accessible from the *copy machine* using the same network-path provided during the **Initiate Offline Backup** workflow
      
      - BitLocker is enabled on the machine. 
      
      - The machine has access to Azure portal
      
      If necessary, the *copy machine* can be the same as the *source machine*.

2. Open an elevated command prompt on the copy machine with the Azure Disk Preparation tool directory as the current directory and run the following command 

      *.\AzureOfflineBackupDiskPrep.exe*   s:<*Staging Location Path*>   [p:<*Path to PublishSettingsFile*>]


| Parameter | Description
|-------------|-------------|
|s:<*Staging Location Path*> | Mandatory input, used to provide the Path to the Staging Location entered during Initiation of Offline Backup |
|p:<*Path to PublishSettingsFile*> | Optional input, used to provide the path to the Publish Settings File entered during Initiation of Offline Backup |

   > [AZURE.NOTE] Publish Settings File is a mandatory input when the copy machine and source machine are different

   On running the command, the tool requests the selection of an Azure Import Job corresponding to which drives need to be prepared. If there is only a single Import Job associated with the provided Staging Location, then a screen such as the one below appears.
      ![Azure Disk Preparation Tool Input](./media/backup-azure-backup-import-export/azureDiskPreparationToolDriveInput.png)

3. Enter the **drive letter** for the mounted disk without the trailing colon, that you wish to prepare for transfer to Azure. Thereafter, provide confirmation for the formatting of the drive when prompted

   The tool then begins preparing the disk with the backup-data. You may need to attach additional disks when prompted by the tool, in case the disk provided does not have sufficient space to accommodate the backup data. 

   At the end of successful execution of the tool, one or more disks you provided are prepared for shipping to Azure and an Import Job by the name you provided during the **Initiate Offline Backup** workflow is created on Azure Classic Portal. Additionally, the tool displays the Shipping Address to the Azure Datacenter where the disks need to be shipped as well as the link to locate the Import Job on Azure Classic Portal. 
   
      ![Azure Disk Preparation Complete](./media/backup-azure-backup-import-export/azureDiskPreparationToolSuccess.png)
      
4. Ship the disks to the address provided by the tool and keep the tracking number for future reference
5. On navigating to the link displayed by the tool, you are taken to the **Azure Storage Account** specified during the Offline-backup workflow. Here you are able to see the newly created import job in the **IMPORT/EXPORT** tab of the Storage Account

      ![Created Import Job](./media/backup-azure-backup-import-export/ImportJobCreated.png)

6. Click **SHIPPING INFO** at the bottom of the page to update your **Contact Details** as shown below. Microsoft uses this info to ship your disks back to you once the Import Job is complete.

      ![Contact Info](./media/backup-azure-backup-import-export/contactInfoAddition.PNG)
      
7. Enter the **Shipping details** on the next screen as shown below. Provide the Delivery Carrier and Tracking Number details corresponding to the disks you shipped to the Azure Datacenter
   
      ![Shipping Info](./media/backup-azure-backup-import-export/shippingInfoAddition.PNG)

### Completing the workflow
Once the Import Job completes, initial backup data is available in your storage account. The Microsoft Azure Recovery Services agent then copies the contents of the data from this account to the Backup Vault or Recovery Services Vault, whichever is applicable. In the next scheduled backup time, the Azure Backup agent performs the incremental backup over the initial backup copy.


> [AZURE.NOTE] Following sections apply to users of earlier versions of Azure Backup who do not have access to the *Azure Disk Preparation tool*

### Prepare SATA drive

1. Download the [Microsoft Azure Import/Export Tool](http://go.microsoft.com/fwlink/?linkid=301900&clcid=0x409) to the *copy machine*. Ensure that the staging location (in the previous step) is accessible from the machine in which you plan to run the next set of commands. If necessary, the copy machine can be the same as the source machine.

2. Unzip the *WAImportExport.zip* file. Run the *WAImportExport* tool that formats the SATA drive, write the backup data to the SATA drive, and encrypt it. Before running the following command, ensure that BitLocker is enabled on the machine. <br/>

    *.\WAImportExport.exe PrepImport /j:<*JournalFile*>.jrn /id: <*SessionId*> /sk:<*StorageAccountKey*> /BlobType:**PageBlob** /t:<*TargetDriveLetter*> /format /encrypt /srcdir:<*staging location*> /dstdir: <*DestinationBlobVirtualDirectory*>/*


| Parameter | Description
|-------------|-------------|
| /j:<*JournalFile*>| The path to the journal file. Each drive must have exactly one journal file. The journal file must not reside on the target drive. The journal file extension is .jrn and is created as part of running this command.|
|/id:<*SessionId*> | The session ID identifies a *copy session*. It is used to ensure accurate recovery of an interrupted copy session. Files that are copied in a copy session are stored in a directory named after the session ID on the target drive.|
| /sk:<*StorageAccountKey*> | The account key for the storage account to which the data is imported. The key needs to be same as it was entered during backup policy/protection group creation.|
| /BlobType | Specify **PageBlob**, this workflow succeeds only if the PageBlob option is specified. This is not the default option and should be mentioned in this command. |
|/t:<*TargetDriveLetter*> | The drive letter of the target hard drive for the current copy session, without the trailing colon.|
|/format | Specify this parameter when the drive needs to be formatted; otherwise, omit it. Before the tool formats the drive, it prompts for a confirmation from console. To suppress the confirmation, specify the /silentmode parameter.|
|/encrypt | Specified this parameter when the drive has not yet been encrypted with BitLocker and needs to be encrypted by the tool. If the drive has already been encrypted with BitLocker, then omit this parameter and specify the /bk parameter, providing the existing BitLocker key. If you specify the /format parameter, then you must also specify the /encrypt parameter. |
|/srcdir:<*SourceDirectory*> | The source directory that contains files to be copied to the target drive. Ensure that directory name specified here is full path (not a relative path).|
|/dstdir:<*DestinationBlobVirtualDirectory*> | The path to the destination virtual directory in your Microsoft Azure storage account. Be sure to use valid container names when specifying destination virtual directories or blobs. Keep in mind that container names must be lowercase.  This container name should be same as the one entered during backup policy/Protection Group creation|

  > [AZURE.NOTE] A journal file is created in the WAImportExport folder that captures the entire information of the workflow. You need this file when creating an import job in the Azure portal.

  ![PowerShell output](./media/backup-azure-backup-import-export/psoutput.png)

### Create Import Job in Azure portal
1. Navigate to your storage account in the [Azure Classic Portal](https://manage.windowsazure.com/), and click **Import/Export** and then **Create Import Job** in the task pane.

    ![Portal](./media/backup-azure-backup-import-export/azureportal.png)

2. In Step 1 of the wizard, indicate that you have prepared your drive and that you have the drive journal file available. In Step 2 of the wizard, provide contact information for the person responsible for this import job.
3. In Step 3, upload the drive journal files that you obtained during the previous section.
4. In Step 4, enter a descriptive name for the import job that was entered during backup policy/Protection Group creation. The name you enter may contain only lowercase letters, numbers, hyphens, and underscores, must start with a letter, and may not contain spaces. The name you choose is used to track your jobs while they are in progress and once they are completed.
5. Next, select your data center region from the list. The data center region will indicate the data center and address to which you must ship your package.

    ![DC](./media/backup-azure-backup-import-export/dc.png)

6. In Step 5, select your return carrier from the list, and enter your carrier account number. Microsoft uses this account to ship your drives back to you once your import job is complete.

7. Ship the disk and enter the tracking number to track the status of the shipment. Once the disk arrives in the datacenter, it is copied to the storage account and the status is updated.

    ![Complete Status](./media/backup-azure-backup-import-export/complete.png)

### Completing the workflow
Once the initial backup data is available in your storage account, the Microsoft Azure Recovery Services agent copies the contents of the data from this account to the Backup Vault or Recovery Services Vault, whichever is applicable. In the next schedule backup time, the Azure Backup agent performs the incremental backup over the initial backup copy.

## Next Steps
- For any questions on the Azure Import/Export workflow, refer to this [article](../storage/storage-import-export-service.md).
- Refer to the Offline Backup section of the Azure Backup [FAQ](backup-azure-backup-faq.md) for any questions about the workflow

