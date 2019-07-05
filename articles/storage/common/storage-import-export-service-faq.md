---
title: FAQ for Azure Import/Export service | Microsoft Docs
description: Read answers to frequently asked questions about Azure Import Export service.
author: alkohli
services: storage
ms.service: storage
ms.topic: article
ms.date: 12/13/2018
ms.author: alkohli
ms.subservice: common
---
# Azure Import/Export service: frequently asked questions 
The following are questions and answers that you may have when you use your Azure Import/Export service to transfer data into Azure storage. Questions and answers are arranged in the following categories:

- About Import/Export service
- Preparing the disks for import/export
- Import/Export jobs
- Shipping disks
- Miscellaneous 

## About Import/Export service

### Can I copy Azure File storage using the Azure Import/Export service?

Yes. The Azure Import/Export service supports import into Azure File Storage. It does not support export of Azure Files at this time.

### Is the Azure Import/Export service available for CSP subscriptions?

Yes. Azure Import/Export service supports Cloud Solution Providers (CSP) subscriptions.

### Can I use the Azure Import/Export service to copy PST mailboxes and SharePoint data to O365?

Yes. For more information, go to [Import PST files or SharePoint data to Office 365](https://technet.microsoft.com/library/ms.o365.cc.ingestionhelp.aspx).

### Can I use the Azure Import/Export service to copy my backups offline to the Azure Backup Service?

Yes. For more information, go to [Offline Backup workflow in Azure Backup](../../backup/backup-azure-backup-import-export.md).

### Can I purchase drives for import/export jobs from Microsoft?

No. You need to ship your own drives for import and export jobs.


## Preparing disks for import/export

### Can I skip the drive preparation step for an import job? Can I prepare a drive without copying?

No. Any drive used to import data must be prepared using the Azure WAImportExport tool. Use the tool to also copy data to the drive.

### Do I need to perform any disk preparation when creating an export job?

No. Some prechecks are recommended. To check the number of disks required, use the WAImportExport tool's PreviewExport command. For more information, see [Previewing Drive Usage for an Export Job](https://msdn.microsoft.com/library/azure/dn722414.aspx). The command helps you preview drive usage for the selected blobs, based on the size of the drives you are going to use. Also check that you can read from and write to the hard drive that is shipped for the export job.

## Import/Export jobs

### Can I cancel my job?
Yes. You can cancel a job when its status is **Creating** or **Shipping**. Beyond these stages, job cannot be canceled and it continues until the final stage.

### How long can I view the status of completed jobs in the Azure portal?
You can view the status for completed jobs for up to 90 days. Completed jobs are deleted after 90 days.

### If I want to import or export more than 10 drives, what should I do?
One import or export job can reference only 10 drives in a single job. To ship more than 10 drives, you should create multiple jobs. Drives associated with the same job must be shipped together in the same package. 
For more information and guidance when data capacity spans multiple disk import jobs, contact Microsoft at bulkimport@microsoft.com. 

### The uploaded blob shows status as "Lease expired". What should I do?
You can ignore the “Lease Expired” field. Import/Export takes lease on the blob during upload to make sure that no other process can update the blob in parallel. Lease Expired implies that Import/export is no longer uploading to it and the blob is available for your use. 

## Shipping disks

### What is the maximum number of HDD for in one shipment?
There is no limit to the number of HDDs in one shipment. If the disks belong to multiple jobs, we recommend that you: 
- label the disks with corresponding job names.
- update the jobs with a tracking number suffixed with -1, -2 etc.

### Should I include anything other than the HDD in my package?
Ship only your hard drives in the shipping package. Do not include items like power supply cables or USB cables.

### Do I have to ship my drives using FedEx or DHL?
You can ship drives to the Azure datacenter using any known carrier like FedEx, DHL, UPS, or US Postal Service. However, for return shipment of drives to you from the datacenter, you must provide:

- A FedEx account number in the US and EU, or
- A DHL account number in the Asia and Australia regions.

> [!NOTE]
> The datacenters in India require a declaration letter on your letterhead (delivery challan) to return the drives. To arrange the required entry pass, you must also book the pick up with your selected carrier and share the details with the datacenter.

### Are there any restrictions with shipping my drive internationally?
Please note that the physical media that you are shipping may need to cross international borders. You are responsible for ensuring that your physical media and data are imported and/or exported in accordance with the applicable laws. Before shipping the physical media, check with your advisors to verify that your media and data can legally be shipped to the identified data center. This will help to ensure that it reaches Microsoft in a timely manner.

### Are there any special requirements for delivering my disks to a datacenter?

The requirements depend on the specific Azure datacenter restrictions.
- There are a few sites, that require a Microsoft datacenter Inbound ID number to be written on the parcel for security reasons. Before you ship your drives or disks to the datacenter, contact Azure DataBox Operations (adbops@microsoft.com) to get this number. Without this number, the package will be rejected.
- The datacenters in India require the personal details of the driver, such as the Government ID Card or Proof No. (for example, PAN, AADHAR, DL), name, contact, and the car plate number to get a gate entry pass. To avoid delivery delays, inform your carrier about these requirements.


### When creating a job, the shipping address is a location that is different from my storage account location. What should I do?

Some storage account locations are mapped to alternate shipping locations. Previously available shipping locations can also be temporarily mapped to alternate locations. Always check the shipping address provided during job creation before shipping your drives.

### When shipping my drive, the carrier asks for the data center contact address and phone number. What should I provide?

The phone number and DC address is provided as part of job creation.


## Miscellaneous

### What happens if I accidentally send an HDD that does not conform to the supported requirements?

The Azure data center will return the drive that does not conform to the supported requirements to you. If only some of the drives in the package meet the support requirements, those drives will be processed, and the drives that do not meet the requirements will be returned to you.

### Does the service format the drives before returning them?

No. All drives are encrypted with BitLocker.

### How can I access data that is imported by this service?

Use the Azure Portal or [Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer) to access the data under your Azure storage account.  

### After the import is complete, what does my data look like in the storage account? Is my directory hierarchy preserved?

When preparing a hard drive for an import job, the destination is specified by the DstBlobPathOrPrefix field in the dataset CSV. This is the destination container in the storage account to which data from the hard drive is copied. Within this destination container, virtual directories are created for folders from the hard drive and blobs are created for files. 

### If a drive has files that already exist in my storage account, does the service overwrite existing blobs or files?

Depends. When preparing the drive, you can specify whether the destination files should be overwritten or ignored using the field in dataset CSV file called Disposition:<rename|no-overwrite|overwrite>. By default, the service renames the new files rather than overwrite existing blobs or files.

### Is the WAImportExport tool compatible with 32-bit operating systems?
No. The WAImportExport tool is only compatible with 64-bit Windows operating systems. For a complete list of Supported OS, go to [Supported Operating Systems](https://docs.microsoft.com/azure/storage/common/storage-import-export-requirements). 


### What is the maximum Block Blob and Page Blob Size supported by Azure Import/Export?

Max Block Blob size is approximately 4.768TB  or 5,000,000 MB.
Max Page Blob size is 8TB.


### Does Azure Import/Export support AES-256 encryption?
Azure Import/Export service uses AES-128 bitlocker encryption by default. You can change this to AES-256 by manually encrypting with bitlocker before the data is copied. 

- If using [WAImportExport V1](https://download.microsoft.com/download/0/C/D/0CD6ABA7-024F-4202-91A0-CE2656DCE413/WaImportExportV1.zip), below is a sample command
    ```
    WAImportExport PrepImport /sk:<StorageAccountKey> /csas:<ContainerSas> /t: <TargetDriveLetter> [/format] [/silentmode] [/encrypt] [/bk:<BitLockerKey>] [/logdir:<LogDirectory>] /j:<JournalFile> /id:<SessionId> /srcdir:<SourceDirectory> /dstdir:<DestinationBlobVirtualDirectory> [/Disposition:<Disposition>] [/BlobType:<BlockBlob|PageBlob>] [/PropertyFile:<PropertyFile>] [/MetadataFile:<MetadataFile>] 
    ```
- If using [WAImportExport V2](https://www.microsoft.com/download/details.aspx?id=55280) specify "AlreadyEncrypted" and supply the key in the driveset CSV.
    ```
    DriveLetter,FormatOption,SilentOrPromptOnFormat,Encryption,ExistingBitLockerKey
    G,AlreadyFormatted,SilentMode,AlreadyEncrypted,060456-014509-132033-080300-252615-584177-672089-411631 |
    ```

## Next steps

* [What is Azure Import/Export?](storage-import-export-service.md)


