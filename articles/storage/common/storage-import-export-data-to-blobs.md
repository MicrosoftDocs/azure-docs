---
title: Using Azure Import/Export to transfer data to Azure Blobs | Microsoft Docs
description: Learn how to create import and export jobs in Azure portal to transfer data to and from Azure Blobs.
author: alkohli
services: storage
ms.service: storage
ms.topic: article
ms.date: 10/15/2018
ms.author: alkohli
ms.component: common
---
# Use the Azure Import/Export service to import data to Azure Blob Storage

This article provides step-by-step instructions on how to use the Azure Import/Export service to securely import large amounts of data to Azure Blob storage. To import data into Azure Blobs, the service requires you to ship encrypted disk drives containing your data to an Azure datacenter.  

## Prerequisites

Before you create an import job to transfer data into Azure Blob Storage, carefully review and complete the following list of prerequisites for this service. 
You must:

- Have an active Azure subscription that can be used for the Import/Export service.
- Have at least one Azure Storage account with a storage container. See the list of [Supported storage accounts and storage types for Import/Export service](storage-import-export-requirements.md). 
    - For information on creating a new storage account, see [How to Create a Storage Account](storage-quickstart-create-account.md). 
    - For information on storage container, go to [Create a storage container](../blobs/storage-quickstart-blobs-portal.md#create-a-container).
- Have adequate number of disks of [Supported types](storage-import-export-requirements.md#supported-disks). 
- Have a Windows system running a [Supported OS version](storage-import-export-requirements.md#supported-operating-systems). 
- Enable BitLocker on the Windows system. See [How to enable BitLocker](http://thesolving.com/storage/how-to-enable-bitlocker-on-windows-server-2012-r2/).
- [Download the WAImportExport version 1](https://www.microsoft.com/en-us/download/details.aspx?id=42659) on the Windows system. Unzip to the default folder `waimportexportv1`. For example, `C:\WaImportExportV1`.
- Have a FedEx/DHL account.  
    - The account must be valid, should have balance, and must have return shipping capabilities.
    - Generate a tracking number for the export job.
    - Every job should have a separate tracking number. Multiple jobs with the same tracking number are not supported.
    - If you do not have a carrier account, go to:
        - [Create a FedEX account](https://www.fedex.com/en-us/create-account.html), or 
        - [Create a DHL account](http://www.dhl-usa.com/en/express/shipping/open_account.html).

## Step 1: Prepare the drives

This step generates a journal file. The journal file stores basic information such as drive serial number, encryption key, and storage account details. 

Perform the following steps to prepare the drives.

1.	Connect your disk drives to the Windows system via SATA connectors.
1.  Create a single NTFS volume on each drive. Assign a drive letter to the volume. Do not use mountpoints.
2.  Enable BitLocker encryption on the NTFS volume. If using a Windows Server system, use the instructions in [How to enable BitLocker on Windows Server 2012 R2](http://thesolving.com/storage/how-to-enable-bitlocker-on-windows-server-2012-r2/).
3.  Copy data to encrypted volume. Use drag and drop or Robocopy or any such copy tool.
4.	Open a PowerShell or command line window with administrative privileges. To change directory to the unzipped folder, run the following command:
    
    `cd C:\WaImportExportV1`
5.  To get the BitLocker key of the drive, run the following command:
    
    ` manage-bde -protectors -get <DriveLetter>: `
6.	To prepare the disk, run the following command. **Depending on the data size, this may take several hours to days.** 

    ```
    ./WAImportExport.exe PrepImport /j:<journal file name> /id:session#<session number> /sk:<Storage account key> /t:<Drive letter> /bk:<BitLocker key> /srcdir:<Drive letter>:\ /dstdir:<Container name>/ /skipwrite 
    ```
    A journal file is created in the same folder where you ran the tool. Two other files are also created - an *.xml* file (folder where you run the tool) and a *drive-manifest.xml* file (folder where data resides).
    
    The parameters used are described in the following table:

    |Option  |Description  |
    |---------|---------|
    |/j:     |The name of the journal file, with the .jrn extension. A journal file is generated per drive. We recommend that you use the disk serial number as the journal file name.         |
    |/id:     |The session ID. Use a unique session number for each instance of the command.      |
    |/sk:     |The Azure Storage account key.         |
    |/t:     |The drive letter of the disk to be shipped. For example, drive `D`.         |
    |/bk:     |The BitLocker key for the drive. Its numerical password from output of ` manage-bde -protectors -get D: `      |
    |/srcdir:     |The drive letter of the disk to be shipped followed by `:\`. For example, `D:\`.         |
    |/dstdir:     |The name of the destination container in Azure Storage.         |
    |/skipwrite:     |The option that specifies that there is no new data required to be copied and existing data on the disk is to be prepared.          |
7. Repeat the previous step for each disk that needs to be shipped. A journal file with the provided name is created for every run of the command line.
    
    > [!IMPORTANT]
    > - Together with the journal file, a `<Journal file name>_DriveInfo_<Drive serial ID>.xml` file is also created in the same folder where the tool resides. The .xml file is used in place of journal file when creating a job if the journal file is too big. 

## Step 2: Create an import job

Perform the following steps to create an import job in the Azure portal.

1. Log on to https://portal.azure.com/.
2. Go to **All services > Storage > Import/export jobs**. 
    
    ![Go to Import/export jobs](./media/storage-import-export-data-to-blobs/import-to-blob1.png)

3. Click **Create Import/export Job**.

    ![Click Create Import/export job](./media/storage-import-export-data-to-blobs/import-to-blob2.png)

4. In **Basics**:

    - Select **Import into Azure**.
    - Enter a descriptive name for the import job. Use the name to track the progress of your jobs.
        - The name may contain only lowercase letters, numbers, and hyphens.
        - The name must start with a letter, and may not contain spaces.
    - Select a subscription.
    - Enter or select a resource group.  

    ![Create import job - Step 1](./media/storage-import-export-data-to-blobs/import-to-blob3.png)

3. In **Job details**:

    - Upload the drive journal files that you obtained during the drive preparation step. If `waimportexport.exe version1` was used, upload one file for each drive that you prepared. If the journal file size exceeds 2 MB, then you can use the `<Journal file name>_DriveInfo_<Drive serial ID>.xml` also created with the journal file. 
    - Select the destination storage account where data will reside. 
    - The dropoff location is automatically populated based on the region of the storage account selected.
   
   ![Create import job - Step 2](./media/storage-import-export-data-to-blobs/import-to-blob4.png)

4. In **Return shipping info**:

    - Select the carrier from the dropdown list.
    - Enter a valid carrier account number that you have created with that carrier. Microsoft uses this account to ship the drives back to you once your import job is complete. If you do not have an account number, create a [FedEx](http://www.fedex.com/us/oadr/) or [DHL](http://www.dhl.com/) carrier account.
    - Provide a complete and valid contact name, phone, email, street address, city, zip, state/province and country/region. 
        
        > [!TIP] 
        > Instead of specifying an email address for a single user, provide a group email. This ensures that you recieve notifications even if an admin leaves.

    ![Create import job - Step 3](./media/storage-import-export-data-to-blobs/import-to-blob5.png)
   
5. In the **Summary**:

    - Review the job information provided in the summary. Make a note of the job name and the Azure datacenter shipping address to ship disks back to Azure. This information is used later on the shipping label.
    - Click **OK** to create the import job.

    ![Create import job - Step 4](./media/storage-import-export-data-to-blobs/import-to-blob6.png)

## Step 3: Ship the drives 

[!INCLUDE [storage-import-export-ship-drives](../../../includes/storage-import-export-ship-drives.md)]


## Step 4: Update the job with tracking information

[!INCLUDE [storage-import-export-update-job-tracking](../../../includes/storage-import-export-update-job-tracking.md)]

## Step 5: Verify data upload to Azure

Track the job to completion. Once the job is complete, verify that your data has uploaded to Azure. Delete the on-premises data only after you have verified that upload was successful.

## Next steps

* [View the job and drive status](storage-import-export-view-drive-status.md)
* [Review Import/Export requirements](storage-import-export-requirements.md)


