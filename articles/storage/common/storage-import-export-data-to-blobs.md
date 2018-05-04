---
title: Using Azure Import/Export to transfer data to Azure Blobs | Microsoft Docs
description: Learn how to create import and export jobs in Azure portal to transfer data to and from Azure Blobs.
author: alkohli
manager: jeconnoc
services: storage

ms.service: storage
ms.topic: article
ms.date: 05/04/2018
ms.author: alkohli

---
# Use the Microsoft Azure Import/Export service to import data to Azure Blob storage
In this article, we provide step-by-step instructions on using Azure Import/Export service to securely transfer large amounts of data to Azure Blob storage. 

To import data into Azure Blobs, the service requires you to ship disk drives containing your data to an Azure data center. To export data from Azure Blobs, the service requires you to ship empty drives to which data is tranferred from Azure and the disks are then returned to you. 

## Prerequisites

Before you create an import job to transfer data into Azure Files, carefully review and complete the following list of prerequisites for this service. 

- You must have an active Azure subscription that can be used for the Import/Expert service.
- You need one or more Azure Storage accounts. See the list of [Supported storage accounts and storage types for Import/Export service](storage-import-export-requirements.md). For information on creating a new storage account, see [How to Create a Storage Account](storage-create-storage-account.md#create-a-storage-account).
- You must have adquate number of HDDs/SSDs required for your data.
    - The disks must belong to the list of [Supported disk types](). 
    - These disks must be prepared using the procedure described in [Prepare the disks with WAImportExport tool V2](). 
- You need access to a Windows system where you will install WAImportExport tool V2. 
    - The server where you install WAImportExport tool V2 must have a [Supported OS](storage-import-export-requirements.md#supported-operating-systems). 
    - [Download the WAImportExport tool V2]() on this server.
- Identify the data to be imported into Azure Storage. Import the directories and standalone files on a local server or a network share. 
- 

## Step 1: Prepare the drives

Prepare the disk drives using the WAImportExport tool and generate a journal file. The journal files store basic information about your job and drive such as drive serial number and storage account name. This file is used during import job creation. 

Perform the following steps to prepare the drives.

1.	Attach the hard drives directly using SATA or with external USB adaptors to a windows machine.
2.  Create a single NTFS volume on each hard drive and assign a drive letter to the volume. No mountpoints.
3.  To enable encryption on the windows machine, enable bit locker encryption on the NTFS volume. Use the instructions on https://technet.microsoft.com/library/cc731549(v=ws.10).aspx.
3.  Completely copy data to these encrypted single NTFS volumes on disks using copy & paste or  drag & drop or Robocopy or any such tool.
7.	Download WAImportExport V1 from https://www.microsoft.com/en-us/download/details.aspx?id=42659
8.	Unzip to the default folder waimportexportv1. For example, C:\WaImportExportV1  
9.	Run as Administrator and open a PowerShell or Command line and change directory to the unzipped folder. For example, cd C:\WaImportExportV1
10.	Copy the following command line to a text editor and edit it to create a command line:

    ```
    ./WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#1 /sk:***== /t:D /bk:*** /srcdir:D:\ /dstdir:ContainerName/ /skipwrite 
    ```
    
    These command line options are described in the following table:

    |Option  |Description  |
    |---------|---------|
    |/j:     |The name of the journal file, with the .jrn extension. A journal file is generated per drive. Using the disk serial number as the journal file name is recommended.         |
    |/sk:     |The Azure Storage account key.         |
    |/t:     |The drive letter of the disk to be shipped. For example, drive `D`.         |
    |/bk:     |The BitLocker key for the drive. Its numerical password from output of ` manage-bde -protectors -get D: `      |
    |/srcdir:     |The drive letter of the disk to be shipped followed by `:\`. For example, `D:\`.         |
    |/dstdir:     |The name of the destination container in Azure Storage         |
    |/skipwrite:     |The option that specifies that there is no new data required to be copied and existing data on the disk is to be prepared         |
1. Repeat step 10 for each of disk that needs to be shipped.
2. A journal file with name provided with /j: parameter is created for every run of the command line.

## Step 2: Create an import job

1. Log on to https://portal.azure.com/ and under More services -> STORAGE -> "Import/export jobs" Click **Create Import/export Job**.

2. In Basics section, select "Import into Azure", enter a string for job name, select a subscription, enter or select a resource group. Enter a descriptive name for the import job. Note that the name you enter may contain only lowercase letters, numbers, hyphens, and underscores, must start with a letter, and may not contain spaces. You use the name you choose to track your jobs while they are in progress and once they are completed.

3. In Job details section, upload the drive journal files that you obtained during the drive preparation step. If waimportexport.exe version1 was used, you need to upload one file for each drive that you have prepared. Select the storage account that the data will be imported into in the "Import destination" Storage account section. The Drop-Off location is automatically populated based on the region of the storage account selected.
   
   ![Create import job - Step 3](./media/storage-import-export-service/import-job-03.png)
4. In Return shipping info section, select the carrier from the drop-down list and enter a valid carrier account number that you have created with that carrier. Microsoft uses this account to ship the drives back to you once your import job is complete. Provide a complete and valid contact name, phone, email, street address, city, zip, state/proviince and country/region.
   
5. In the Summary section, Azure DataCenter shipping address is provided to be used for shipping disks to Azure DC. Ensure that the job name and the full address are mentioned on the shipping label. 

6. Click OK on the Summary Page to complete Import job creation.

## Step 3: Ship the drives to the Azure datacenter 

FedEx, UPS, or DHL can be used to ship the package to Azure datacenter. You must provide a valid FedEx, UPS, or DHL carrier account number to be used by Microsoft for shipping the drives back. 
- A FedEx, UPS, or DHL account number is required for shipping drives back from the US and Europe locations. 
- A DHL account number is required for shipping drives back from Asia and Australia locations. If you do not have one, you can create a [FedEx](http://www.fedex.com/us/oadr/) (for US and Europe) or [DHL](http://www.dhl.com/) (Asia and Australia) carrier account. 

In shipping your packages, you must follow the terms at [Microsoft Azure Service Terms](https://azure.microsoft.com/support/legal/services-terms/).

## Step 4: Update the job with tracking information

After shipping the disks, return to the **Import/Export** page on the Azure portal to update the tracking numbe. Do the following steps.
 
1. Click the import job
2. Click **Update job status and tracking info once drives are shipped**. 
3. Select the check box **Mark as shipped**.
4. Provide the **Carrier** and **Tracking number**.

If the tracking number is not updated within 2 weeks of creating the job, the job will expire. The job progress can be tracked on the portal dashboard. See what each job state in the previous section means by [Viewing your job status](#viewing-your-job-status).


## Create an export job

You create an export job to notify the Import/Export service that you'll be shipping one or more empty drives to the Azure datacenter. The service exports data from your storage account to the drives. The drives are then shipped to you.

## Prerequisites

## Step 1: Prepare your drives
Following pre-checks are recommended for preparing your drives for an export job:

1. Check the number of disks required using the WAImportExport tool's PreviewExport command. For more information, see [Previewing Drive Usage for an Export Job](https://msdn.microsoft.com/library/azure/dn722414.aspx). It helps you preview drive usage for the blobs you selected, based on the size of the drives you are going to use.
2. Check that you can read/write to the hard drive that will be shipped for the export job.

## Step 2: Create an export job

Perform the following steps to create an import job in the Azure portal.
1. Log on to https://portal.azure.com/.
2. Go to **More services > Storage > Import/export jobs**. Click **Create Import/export Job**.
3. In **Basics**, do the following:
    
    - Select **Export from Azure**. 
    - Enter a string for job name.
    - Select a subscription.
    - Enter or select a resource group. 
    - Enter a descriptive name for the import job. Use the name you choose to track the progress of your jobs. 
        - The name may contain only lowercase letters, numbers, hyphens, and underscores.
        - The name must start with a letter, and may not contain spaces. 
    - Provide the contact information for the person responsible for this export job.

3. In **Job details**, do the following:

    - Select the storage account where the data to be exported resides. 
    - The drop-off location is automatically populated based on the region of the storage account selected. 
    - Specify the blob data you wish to export from your storage account to your blank drive or drives. You can choose to export all blob data in the storage account, or you can specify which blobs or sets of blobs to export.
        - **To specify a blob to export**: Use the **Equal To** selector. Specify the relative path to the blob, beginning with the container name. Use *$root* to specify the root container.
        - **To specify all blobs starting with a prefix**: Use the **Starts With** selector. Specify the prefix, beginning with a forward slash '/'. The prefix may be the prefix of the container name, the complete container name, or the complete container name followed by the prefix of the blob name.
    
        You must provide the blob paths in valid formats to avoid errors during processing, as shown in this screenshot. See [Examples of valid blob paths](#examples-of-valid-blob-paths).
   
   ![Create export job - Step 3](./media/storage-import-export-service/export-job-03.png)

4. In **Return shipping info**, do the following:

    - Select the carrier from the drop-down list.
    - Enter a valid carrier account number that you have created with that carrier. Microsoft uses this account to ship the drives back to you once your import job is complete. 
    - Provide a complete and valid contact name, phone, email, street address, city, zip, state/province and country/region.
   
5. In the **Summary**, do the following:

    - Rrovide the Azure datacenter shipping address for shipping disks back to Azure. Ensure that the job name and the full address are mentioned on the shipping label.
    - Click **OK** to complete Export job creation.

## Step 3: Ship the drives

FedEx, UPS, or DHL can be used to ship the package to Azure datacenter. You must provide a valid FedEx, UPS, or DHL carrier account number to be used by Microsoft for shipping the drives back. 
- A FedEx, UPS, or DHL account number is required for shipping drives back from the US and Europe locations. 
- A DHL account number is required for shipping drives back from Asia and Australia locations. If you do not have one, you can create a [FedEx](http://www.fedex.com/us/oadr/) (for US and Europe) or [DHL](http://www.dhl.com/) (Asia and Australia) carrier account. 

In shipping your packages, you must follow the terms at [Microsoft Azure Service Terms](https://azure.microsoft.com/support/legal/services-terms/).

## Step 4: Update the job with tracking information

After shipping the disks, return to the **Import/Export** page on the Azure portal to update the tracking number. Do the following steps. 

1. Click the import job.
2. Click **Update job status and tracking info once drives are shipped**. 
3. Select the check box **Mark as shipped**.
4. Provide the **Carrier** and **Tracking number**. If the tracking number is not updated within 2 weeks of creating the job, the job expires. 
5. Monitor the job progress on the portal dashboard. See what each job state in the previous section means by [Viewing your job status](#viewing-your-job-status).

   > [!NOTE]
   > If the blob to be exported is in use at the time of copying to hard drive, Azure Import/Export service will take a snapshot of the blob and copy the snapshot.
 
6. After you receive the drives with your exported data, you can view and copy the BitLocker keys generated by the service for your drive. Go to the export job in the Azure portal. Click Import/Export tab. 
7. Select your export job from the list, and click **BitLocker keys**. The BitLocker keys appear as shown below:
   
   ![View BitLocker keys for export job](./media/storage-import-export-service/export-job-bitlocker-keys.png)

## Examples of valid blob paths

The following table shows examples of valid blob paths:
   
   | Selector | Blob Path | Description |
   | --- | --- | --- |
   | Starts With |/ |Exports all blobs in the storage account |
   | Starts With |/$root/ |Exports all blobs in the root container |
   | Starts With |/book |Exports all blobs in any container that begins with prefix **book** |
   | Starts With |/music/ |Exports all blobs in container **music** |
   | Starts With |/music/love |Exports all blobs in container **music** that begin with prefix **love** |
   | Equal To |$root/logo.bmp |Exports blob **logo.bmp** in the root container |
   | Equal To |videos/story.mp4 |Exports blob **story.mp4** in container **videos** |

## Next steps

* [Setting up the WAImportExport tool](storage-import-export-tool-how-to.md)
* [Transfer data with the AzCopy command-line utility](storage-use-azcopy.md)
* [Azure Import Export REST API sample](https://azure.microsoft.com/documentation/samples/storage-dotnet-import-export-job-management/)

