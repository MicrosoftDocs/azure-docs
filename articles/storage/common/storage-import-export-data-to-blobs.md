---
title: Using Azure Import/Export to transfer data to Azure Blobs | Microsoft Docs
description: Learn how to create import and export jobs in Azure portal to transfer data to and from Azure Blobs.
author: alkohli
manager: jeconnoc
services: storage

ms.service: storage
ms.topic: article
ms.date: 05/08/2018
ms.author: alkohli

---
# Use the Microsoft Azure Import/Export service to import data to Azure Blob storage
This article provides step-by-step instructions on how to use the Azure Import/Export service to securely transfer large amounts of data to Azure Blob storage. To import data into Azure Blobs, the service requires you to ship encrypted disk drives containing your data to an Azure datacenter.  

## Prerequisites

Before you create an import job to transfer data into Azure Blob Storage, carefully review and complete the following list of prerequisites for this service. 

- You must have an active Azure subscription that can be used for the Import/Expert service.
- You need one or more Azure Storage accounts. See the list of [Supported storage accounts and storage types for Import/Export service](storage-import-export-requirements.md). For information on creating a new storage account, see [How to Create a Storage Account](storage-create-storage-account.md#create-a-storage-account).
- You must have adequate number of HDDs/SSDs required for your data.
    - The disks must belong to the list of [Supported disk types](storage-import-export-requirements.md#supported-disks). 
    - The disks must be prepared using the procedure described in [Prepare the disks with WAImportExport tool V1](storage-import-export-tool-preparing-hard-drives-import-v1). 
- You need access to a Windows system where you will install WAImportExport tool. This tool is available in two versions. We recommend that for this import job you use the V1 tool. 
    - The server where you install WAImportExport tool V1 must have a [Supported OS](storage-import-export-requirements.md#supported-operating-systems). 
    - [Download the WAImportExport tool V1](https://www.microsoft.com/en-us/download/details.aspx?id=42659) on this server. Unzip to the default folder `waimportexportv1`. For example, `C:\WaImportExportV1`.
- Identify the data to be imported into Azure Storage. Import the directories and standalone files on a local server or a network share. 


## Step 1: Prepare the drives

Prepare the disk drives using the WAImportExport tool and generate a journal file. The journal files store basic information about your job and drive such as drive serial number and storage account name. This file is used during import job creation. 

Perform the following steps to prepare the drives.

1.	Attach the hard drives directly using SATA or external USB adaptors to a Windows system.
1.  Create a single NTFS volume on each hard drive and assign a drive letter to the volume. Do not use mountpoints.
2.  Enable BitLocker encryption on the NTFS volume. Use the instructions on https://technet.microsoft.com/library/cc731549(v=ws.10).aspx.
3.  Copy data to encrypted single NTFS volumes on disks. Use drag and drop or Robocopy or any such copy tool.
5.	Open a PowerShell or command line window with administrative privileges. Change directory to the unzipped folder. Type:
    
    `cd C:\WaImportExportV1`
6.	Create a journal file for the disk. Type:

    ```
    ./WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#1 /sk:***== /t:D /bk:*** /srcdir:D:\ /dstdir:ContainerName/ /skipwrite 
    ```
    
    The options used are described in the following table:

    |Option  |Description  |
    |---------|---------|
    |/j:     |The name of the journal file, with the .jrn extension. A journal file is generated per drive. We recommend that you use the disk serial number as the journal file name.         |
    |/sk:     |The Azure Storage account key.         |
    |/t:     |The drive letter of the disk to be shipped. For example, drive `D`.         |
    |/bk:     |The BitLocker key for the drive. Its numerical password from output of ` manage-bde -protectors -get D: `      |
    |/srcdir:     |The drive letter of the disk to be shipped followed by `:\`. For example, `D:\`.         |
    |/dstdir:     |The name of the destination container in Azure Storage.         |
    |/skipwrite:     |The option that specifies that there is no new data required to be copied and existing data on the disk is to be prepared.         |
7. Repeat the previous step for each disk that needs to be shipped. A journal file with name provided with /j: parameter is created for every run of the command line.

## Step 2: Create an import job

Perform the following steps to create an import job in the Azure portal.
1. Log on to https://portal.azure.com/.
2. Go to **More services > Storage > Import/export jobs**. Click **Create Import/export Job**.
2. In **Basics**, do the following steps:

    - Select **Import into Azure**.
    - Enter a string for job name.
    - Select a subscription.
    - Enter or select a resource group. 
    - Enter a descriptive name for the import job. Use the name to track the progress of your jobs.
        - The name may contain only lowercase letters, numbers, hyphens, and underscores.
        - The name must start with a letter, and may not contain spaces. 

3. In **Job details**, do the following steps:

    - Upload the drive journal files that you obtained during the drive preparation step. If `waimportexport.exe version1` was used, upload one file for each drive that you prepared. 
    - Select the destination storage account where data will reside. 
    - The drop-off location is automatically populated based on the region of the storage account selected.
   
   ![Create import job - Step 3](./media/storage-import-export-service/import-job-03.png)
4. In **Return shipping info**, do the following steps:

    - Select the carrier from the dropdown list.
    - Enter a valid carrier account number that you have created with that carrier. Microsoft uses this account to ship the drives back to you once your import job is complete. 
    - Provide a complete and valid contact name, phone, email, street address, city, zip, state/province and country/region.
   
5. In the **Summary**, do the following steps:

    - Provide the Azure datacenter shipping address to ship disks back to Azure. Ensure that the job name and the full address are mentioned on the shipping label.
    - Click **OK** to complete Import job creation.

## Step 3: Ship the drives 

FedEx, UPS, or DHL can be used to ship the package to Azure datacenter. Provide a valid FedEx, UPS, or DHL carrier account number that Microsoft will use to ship the drives back. 
- A FedEx, UPS, or DHL account number is required for shipping drives back from the US and Europe locations. 
- A DHL account number is required for shipping drives back from Asia and Australia locations. If you do not have one, create a [FedEx](http://www.fedex.com/us/oadr/) (for US and Europe) or [DHL](http://www.dhl.com/) (Asia and Australia) carrier account.
- When shipping your packages, you must follow the terms at [Microsoft Azure Service Terms](https://azure.microsoft.com/support/legal/services-terms/).

## Step 4: Update the job with tracking information

After shipping the disks, return to the **Import/Export** page on the Azure portal to update the tracking number. Do the following steps.
 
1. Select and click the job.
2. Click **Update job status and tracking info once drives are shipped**. 
3. Select the checkbox against **Mark as shipped**.
4. Provide the **Carrier** and **Tracking number**.

If the tracking number is not updated within 2 weeks of creating the job, the job expires. You can track the job progress on the portal dashboard. For a description of each job state, go to [Viewing your job status](#viewing-your-job-status).


## Next steps

* [Setting up the WAImportExport tool](storage-import-export-tool-how-to.md)
* [Transfer data with the AzCopy command-line utility](storage-use-azcopy.md)
* [Azure Import Export REST API sample](https://azure.microsoft.com/documentation/samples/storage-dotnet-import-export-job-management/)

