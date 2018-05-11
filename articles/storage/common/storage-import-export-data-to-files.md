---
title: Using Azure Import/Export to transfer data to Azure Files | Microsoft Docs
description: Learn how to create import jobs in the Azure portal to transfer data to Azure Files.
author: alkohli
manager: jeconnoc
services: storage

ms.service: storage
ms.topic: article
ms.date: 05/11/2018
ms.author: alkohli

---
# Use Azure Import/Export service to import data to Azure Files

This article provides step-by-step instructions on how to use the Azure Import/Export service to securely import large amounts of data into Azure Files. To import data, the service requires you to ship supported disk drives containing your data to an Azure data center.  

The Import/Export service supports only the import of Azure Files into Azure Storage. Exporting Azure Files is currently not supported.

## Prerequisites

Before you create an import job to transfer data into Azure Files, carefully review and complete the following list of prerequisites for this service. You must:

- Have an active Azure subscription that can be used for the Import/Export service.
- Have at least one Azure Storage account. See the list of [Supported storage accounts and storage types for Import/Export service](storage-import-export-requirements.md). For information on creating a new storage account, see [How to Create a Storage Account](storage-create-storage-account.md#create-a-storage-account).
- Have adequate number of disks of [Supported types](storage-import-export-requirements.md#supported-disks). 
- Have a Windows system running a [Supported OS version](storage-import-export-requirements.md#supported-operating-systems).
- [Download the WAImportExport version 2]() on the Windows system. Unzip to the default folder `waimportexportv2`. For example, `C:\WaImportExportV2`.
- Identify the data to be imported into Azure Storage. Import the directories and standalone files on a local server or a network share. 


## Step 1: Prepare the drives

This step generates a journal file. The journal file stores basic information such as drive serial number, encryption key, and storage account details.

Perform the following steps to prepare the drives.

1.	Connect our disk drives to the Windows system via SATA connectors.
2.  Create a single NTFS volume on each drive. Assign a drive letter to the volume. Do not use mountpoints.
3. Create the CSV files for dataset and driveset. The following sample is an example for importing data as Azure Files.    

    ```
        BasePath,DstItemPathOrPrefix,ItemType,Disposition,MetadataFile,PropertiesFile
        "F:\50M_original\100M_1.csv.txt","fileshare/100M_1.csv.txt",file,rename,"None",None
        "F:\50M_original\","fileshare/",file,rename,"None",None 
        
    ```
    
    In the above example, 100M_1.csv.txt  will be copied to the root of the "fileshare". If the "Fileshare" does not exist, one will be created. All files and folders under 50M_original will be recursively copied to fileshare. Folder structure will be maintained.<br></br>

    Learn more about [preparing the dataset CSV file](storage-import-export-tool-preparing-hard-drives-import.md#prepare-the-dataset-csv-file).
    

    **Driveset CSV File**

    The value of the driveset flag is a CSV file which contains the list of disks to which the drive letters are mapped in order for the tool to correctly pick the list of disks to be prepared. <br></br>

    Below is the example of driveset CSV file:
    
    ```
    DriveLetter,FormatOption,SilentOrPromptOnFormat,Encryption,ExistingBitLockerKey
    G,AlreadyFormatted,SilentMode,AlreadyEncrypted,060456-014509-132033-080300-252615-584177-672089-411631 |
    H,Format,SilentMode,Encrypt,
    ```

    In the above example, it is assumed that two disks are attached and basic NTFS volumes with volume-letter G:\ and H:\ have been created. The tool will format and encrypt the disk which hosts H:\ and will not format or encrypt the disk hosting volume G:\.

    Learn more about [preparing the driveset CSV file](storage-import-export-tool-preparing-hard-drives-import.md#prepare-initialdriveset-or-additionaldriveset-csv-file).

6.	Use the [WAImportExport Tool](http://download.microsoft.com/download/3/6/B/36BFF22A-91C3-4DFC-8717-7567D37D64C5/WAImportExport.zip) to copy your data to one or more hard drives.

    - You can specify "Encrypt" on Encryption field in drivset CSV to enable BitLocker encryption on the hard disk drive. 
    - Alternatively, you could also enable BitLocker encryption manually on the hard disk drive and specify "AlreadyEncrypted" and supply the key in the driveset CSV while running the tool.
    - Do not modify the data on the hard disk drives or the journal file after completing disk preparation. 
    - Use the following commands to prepare the hard disk drive using WAImportExport tool.

        WAImportExport tool PrepImport command for the first copy session to copy directories and/or files with a new copy session:

        ```
        WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> [/logdir:<LogDirectory>] [/sk:<StorageAccountKey>] [/silentmode] [/InitialDriveSet:<driveset.csv>] DataSet:<dataset.csv>
        ```

        **Import example 1**

        ```
        WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#1  /sk:************* /InitialDriveSet:driveset-1.csv /DataSet:dataset-1.csv /logdir:F:\logs
        ```

4. A journal file with name provided with /j: parameter is created for every run of the command line. Each HDD you prepare has a journal file that must be uploaded when you create the import job. Drives without journal files are not processed.

For additional samples, go to [Samples for journal files](#samples-for-journal-files).

## Step 2: Create an import job 

Perform the following steps to create an import job in the Azure portal.
1. Log on to https://portal.azure.com/.
2. Go to **More services > Storage > Import/export jobs**. Click **Create Import/export Job**.
3. In **Basics**:

    - Select **Import into Azure**.
    - Enter a string for job name.
    - Select a subscription.
    - Select a resource group. 
    - Enter a descriptive name for the import job. Use this name to track your jobs while they are in progress and once they are completed.
        -  This name may contain only lowercase letters, numbers, hyphens, and underscores.
        -  The name must start with a letter, and may not contain spaces. 

3. In **Job details**:
    
    - Upload the journal files that you created during the preceding drive preparation step. If waimportexport.exe version1 was used, you need to upload one file for each drive that you have prepared. 
    - Select the storage account that the data will be imported into. 
    - The drop-off location is automatically populated based on the region of the storage account selected.
   
   ![Create import job - Step 3](./media/storage-import-export-service/import-job-03.png)
4. In **Return shipping info**:

    - Select the carrier from the drop-down list.
    - Enter a valid carrier account number that you have created with that carrier. Microsoft uses this account to ship the drives back to you once your import job is complete. 
    - Provide a complete and valid contact name, phone, email, street address, city, zip, state/province and country/region.
   
5. In the **Summary**:

    - Provide the Azure datacenter shipping address for shipping disks back to Azure. Ensure that the job name and the full address are mentioned on the shipping label.
    - Click **OK** to complete import job creation.

## Step 3: Ship the drives to the Azure datacenter 

[!INCLUDE [storage-import-export-ship-drives](../../../includes/storage-import-export-ship-drives.md)]

## Step 4: Update the job with tracking information

A[!INCLUDE [storage-import-export-update-job-tracking](../../../includes/storage-import-export-update-job-tracking.md)]

## Samples for journal files

In order to **add more drives**, one can create a new driveset file and run the command as below. For subsequent copy sessions to the different disk drives than specified in InitialDriveset .csv file, specify a new driveset CSV file and provide it as a value to the parameter "AdditionalDriveSet". Use the **same journal file** name and provide a **new session ID**. The format of AdditionalDriveset CSV file is same as InitialDriveSet format.

```
WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> /AdditionalDriveSet:<driveset.csv>
```

**Import example 2**
```
WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#3  /AdditionalDriveSet:driveset-2.csv
```

In order to add additional data to the same driveset, WAImportExport tool PrepImport command can be called for subsequent copy sessions to copy additional files/directory:
For subsequent copy sessions to the same hard disk drives specified in InitialDriveset .csv file, specify the **same journal file** name and provide a **new session ID**; there is no need to provide the storage account key.

```
WAImportExport PrepImport /j:<JournalFile> /id:<SessionId> /j:<JournalFile> /id:<SessionId> [/logdir:<LogDirectory>] DataSet:<dataset.csv>
```

**Import example 3**

```
WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#2  /DataSet:dataset-2.csv
```

## Next steps

* Learn to [Set up the WAImportExport tool V2](storage-import-export-tool-how-to.md)
* [Transfer data with the AzCopy command-line utility](storage-use-azcopy.md)
* [Azure Import Export REST API sample](https://azure.microsoft.com/documentation/samples/storage-dotnet-import-export-job-management/)

