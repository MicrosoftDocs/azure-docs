---
title: Using Azure Import/Export to transfer data to Azure Files | Microsoft Docs
description: Learn how to create import jobs in the Azure portal to transfer data to Azure Files.
author: muralikk
manager: syadav
services: storage

ms.service: storage
ms.topic: article
ms.date: 05/03/2018
ms.author: muralikk

---
# Use Azure Import/Export service to transfer data to Azure Files

In this article, we provide step-by-step instructions on how to use Azure Import/Export service to securely transfer large amounts of data into Azure Files. This service requires you to ship supported disk drives to an Azure data center.  

The Import/Export service supports only the import of Azure Files into Azure Storage. Exporting Azure Files is currently not supported.

## Prerequisites

Before you create an import job to transfer data into Azure Files, carefully review and complete the following list of prerequisites for this service. 

- You must have an active Azure subscription that can be used for the Import/Expert service.
- You need one or more Azure Storage accounts. See the list of [Supported storage accounts and storage types for Import/Export service](_). For information on creating a new storage account, see [How to Create a Storage Account](storage-create-storage-account.md#create-a-storage-account).
- You must have adquate number of HDDs/SSDs required for your data.
    - The disks must belong to the list of [Supported disk types](). 
    - These disks must be prepared using the procedure described in [Prepare the disks with WAImportExport tool V2](). 
- You need access to a Windows system where you will install WAImportExport tool V2. 
    - The server where you install WAImportExport tool V2 must have a [Supported OS](). 
    - [Download the WAImportExport tool V2]() on this server.
- Identify the data to be imported into Azure Storage. You can import directories and standalone files on a local server or a network share.


## Step 1: Prepare the drives

Prepare the disk drives using the WAImportExport tool and generate a journal file. The journal files store basic information about your job and drive such as drive serial number and storage account name. This file is used during import job creation. 

Perform the following steps to prepare the drives.

1.	Attach the hard drives directly using SATA or with external USB adaptors to a Windows machine.
2.  Create a single NTFS volume on each hard drive and assign a drive letter to the volume. No mountpoints.
3. Create the CSV files for dataset and driveset. The following sample is an example for importing data as Azure Files.        
    ```
        BasePath,DstItemPathOrPrefix,ItemType,Disposition,MetadataFile,PropertiesFile
        "F:\50M_original\100M_1.csv.txt","fileshare/100M_1.csv.txt",file,rename,"None",None
        "F:\50M_original\","fileshare/",file,rename,"None",None 
        
    ```
    In the above example, 100M_1.csv.txt  will be copied to the root of the "fileshare". If the "Fileshare" does not exist, one will be created. All files and folders under 50M_original will be recursively copied to fileshare. Folder structure will be maintained.

    Learn more about [preparing the dataset CSV file](storage-import-export-tool-preparing-hard-drives-import.md#prepare-the-dataset-csv-file).
    


    **Driveset CSV File**

    The value of the driveset flag is a CSV file which contains the list of disks to which the drive letters are mapped in order for the tool to correctly pick the list of disks to be prepared. 

    Below is the example of driveset CSV file:
    
    ```
    DriveLetter,FormatOption,SilentOrPromptOnFormat,Encryption,ExistingBitLockerKey
    G,AlreadyFormatted,SilentMode,AlreadyEncrypted,060456-014509-132033-080300-252615-584177-672089-411631 |
    H,Format,SilentMode,Encrypt,
    ```

    In the above example, it is assumed that two disks are attached and basic NTFS volumes with volume-letter G:\ and H:\ have been created. The tool will format and encrypt the disk which hosts H:\ and will not format or encrypt the disk hosting volume G:\.

    Learn more about [preparing the driveset CSV file](storage-import-export-tool-preparing-hard-drives-import.md#prepare-initialdriveset-or-additionaldriveset-csv-file).

6.	Use the [WAImportExport Tool](http://download.microsoft.com/download/3/6/B/36BFF22A-91C3-4DFC-8717-7567D37D64C5/WAImportExport.zip) to copy your data to one or more hard drives.
7.	You can specify "Encrypt" on Encryption field in drivset CSV to enable BitLocker encryption on the hard disk drive. Alternatively, you could also enable BitLocker encryption manually on the hard disk drive and specify "AlreadyEncrypted" and supply the key in the driveset CSV while running the tool.

8. Do not modify the data on the hard disk drives or the journal file after completing disk preparation.

    > [!IMPORTANT]
    > Each hard disk drive you prepare results in a journal file. When you are creating the import job using the Azure portal, you must upload all the journal files of the drives which are part of that import job. Drives without journal files will not be processed.


    Below are the commands and examples for preparing the hard disk drive using WAImportExport tool.

    WAImportExport tool PrepImport command for the first copy session to copy directories and/or files with a new copy session:

    ```
    WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> [/logdir:<LogDirectory>] [/sk:<StorageAccountKey>] [/silentmode] [/InitialDriveSet:<driveset.csv>] DataSet:<dataset.csv>
    ```

    **Import example 1**

    ```
    WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#1  /sk:************* /InitialDriveSet:driveset-1.csv /DataSet:dataset-1.csv /logdir:F:\logs
    ```

4. A journal file with name provided with /j: parameter is created for every run of the command line.

## Step 2: Create an import job 

Perform the following steps to create an import job in the Azure portal.
1. Log on to https://portal.azure.com/ and under
2. Go to More services > Storage > Import/export jobs. Click **Create Import/export Job**.

3. In Basics section, select "Import into Azure", enter a string for job name, select a subscription, enter or select a resource group. Enter a descriptive name for the import job. Note that the name you enter may contain only lowercase letters, numbers, hyphens, and underscores, must start with a letter, and may not contain spaces. You use the name you choose to track your jobs while they are in progress and once they are completed.

3. In Job details section, upload the drive journal files that you obtained during the drive preparation step. If waimportexport.exe version1 was used, you need to upload one file for each drive that you have prepared. Select the storage account that the data will be imported into in the "Import destination" Storage account section. The Drop-Off location is automatically populated based on the region of the storage account selected.
   
   ![Create import job - Step 3](./media/storage-import-export-service/import-job-03.png)
4. In Return shipping info section, select the carrier from the drop-down list and enter a valid carrier account number that you have created with that carrier. Microsoft uses this account to ship the drives back to you once your import job is complete. Provide a complete and valid contact name, phone, email, street address, city, zip, state/proviince and country/region.
   
5. In the Summary section, Azure DataCenter shipping address is provided to be used for shipping disks to Azure DC. Ensure that the job name and the full address are mentioned on the shipping label. 

6. Click OK on the Summary Page to complete Import job creation.

### Step 3: Ship the drives to the Azure datacenter 

FedEx, UPS, or DHL can be used to ship the package to Azure datacenter. You must provide a valid FedEx, UPS, or DHL carrier account number to be used by Microsoft for shipping the drives back. 
- A FedEx, UPS, or DHL account number is required for shipping drives back from the US and Europe locations. 
- A DHL account number is required for shipping drives back from Asia and Australia locations. If you do not have one, you can create a [FedEx](http://www.fedex.com/us/oadr/) (for US and Europe) or [DHL](http://www.dhl.com/) (Asia and Australia) carrier account. 

In shipping your packages, you must follow the terms at [Microsoft Azure Service Terms](https://azure.microsoft.com/support/legal/services-terms/).

### Step 4: Update the job with tracking information

After shipping the disks, return to the **Import/Export** page on the Azure portal to update the tracking number. Do the following steps. 

1. Click the import job.
2. Click **Update job status and tracking info once drives are shipped**. 
3. Select the check box **Mark as shipped**.
4. Provide the **Carrier** and **Tracking number**.

If the tracking number is not updated within 2 weeks of creating the job, the job expires. You can monitor the job progress on the portal dashboard. See what each job state in the previous section means by [Viewing your job status](#viewing-your-job-status).

### Samples for journal files

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

See more details about using the WAImportExport tool in [Preparing hard drives for import](storage-import-export-tool-preparing-hard-### Job
To begin the process of importing to or exporting from storage, you first create a job. A job can be an import job or an export job:

* Create an import job when you want to transfer data you have on-premises to your Azure storage account.
* Create an export job when you want to transfer data currently stored in your storage account to hard drives that are shipped to Microsoft. When you create a job, you notify the Import/Export service that you will be shipping one or more hard drives to an Azure data center.

* For an import job, you will be shipping hard drives containing your data.
* For an export job, you will be shipping empty hard drives.
* You can ship up to 10 hard disk drives per job.

You can create an import or export job using the Azure portal or the [Azure Storage Import/Export REST API](/rest/api/storageimportexport).

> [!Note]
> The RDFE APIs will not be supported February 28, 2018 onwards. To continue using the service, migrate to the [ARM Import/Export REST APIs](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/storageimportexport/resource-manager/Microsoft.ImportExport/stable/2016-11-01/storageimportexport.json). 


### WAImportExport tool
The first step in creating an **import** job is to prepare your drives that will be shipped for import. To prepare your drives, you must connect it to a local server and run the WAImportExport Tool on the local server. This WAImportExport tool facilitates copying your data to the drive, encrypting the data on the drive with BitLocker, and generating the drive journal files.

The journal files store basic information about your job and drive such as drive serial number and storage account name. This journal file is not stored on the drive. It is used during import job creation. Step-by-step details about job creation are provided later in this article.

The WAImportExport tool is only compatible with 64-bit Windows operating system. See the [Operating System](#operating-system) section for specific OS versions supported.

Download the latest version of the [WAImportExport tool](http://download.microsoft.com/download/3/6/B/36BFF22A-91C3-4DFC-8717-7567D37D64C5/WAImportExportV2.zip). For more details about using the WAImportExport Tool, see the [Using the WAImportExport Tool](storage-import-export-tool-how-to.md).

>[!NOTE]
>**Previous Version:** You can [download WAImportExpot V1](http://download.microsoft.com/download/0/C/D/0CD6ABA7-024F-4202-91A0-CE2656DCE413/WaImportExportV1.zip) version of the tool and refer to [WAImportExpot V1 usage guide](storage-import-export-tool-how-to-v1.md). WAImportExpot V1 version of the tool does provide support for **preparing disks when data is already pre-written to the disk**. If the only key available is SAS-Key, you need to use WAImportExpot V1 tool .

>

### Hard disk drives
Only 2.5 inch SSD or 2.5" or 3.5" SATA II or III internal HDD are supported for use with the Import/Export service. A single import/export job can have a maximum of 10 HDD/SSDs and each individual HDD/SSD can be of any size. Large number of drives can be spread across multiple jobs and there is no limits on the number of jobs that can be created. 

For import jobs, only the first data volume on the drive is processed. The data volume must be formatted with NTFS.


### Encryption
The data on the drive must be encrypted using BitLocker Drive Encryption. This encryption protects your data while it is in transit.

For import jobs, there are two ways to perform the encryption. The first way is to specify the option when using dataset CSV file while running the WAImportExport tool during drive preparation. The second way is to enable BitLocker encryption manually on the drive and specify the encryption key in the driveset CSV when running WAImportExport tool command line during drive preparation.

For export jobs, after your data is copied to the drives, the service will encrypt the drive using BitLocker before shipping it back to you. The encryption key is provided to you via the Azure portal.  drives-import.md).

Also, refer to the [Sample workflow to prepare hard drives for an import job](storage-import-export-tool-sample-preparing-hard-drives-import-job-workflow.md) for more detailed step-by-step instructions.  




## Next steps

* Learn to [Set up the WAImportExport tool V2](storage-import-export-tool-how-to.md)
* [Transfer data with the AzCopy command-line utility](storage-use-azcopy.md)
* [Azure Import Export REST API sample](https://azure.microsoft.com/documentation/samples/storage-dotnet-import-export-job-management/)

