---
title: Creating an Import Job | Microsoft Docs
description: Learn how to create an import for the Microsoft Azure Import-Export Service
author: renashahmsft
manager: aungoo
editor: tysonn
services: storage
documentationcenter: ''

ms.assetid: 8b886e83-6148-4149-9d0f-5d48ec822475
ms.service: storage
ms.workload: storage 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2015
ms.author: renash

---
# Creating an Import Job
Creating an import job for the Microsoft Azure Import/Export service using the REST API involves the following steps:  
  
-   Preparing drives with the Azure Import/Export tool.  
  
-   Obtaining the location to which to ship the drive.  
  
-   Creating the import job.  
  
-   Shipping the drives to Microsoft via a supported carrier service.  
  
-   Updating the import job with the shipping details.  
  
 See [Using the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage](http://go.microsoft.com/fwlink/?LinkID=329852&clcid=0x409) for an overview of the Import/Export service and a tutorial that demonstrates how to use the [Microsoft Azure classic portal](http://www.windowsazure.com/) to create and manage import and export jobs.  
  
## Preparing Drives with the Azure Import/Export Tool  
 The steps to prepare drives for an import job are the same whether you create the job via the portal or via the REST API.  
  
 Below is a brief overview of drive preparation. Refer to the [Azure Import-Export Tool Reference](storage-import-export-tool-how-to-v1.md) for complete instructions. You can download the Azure Import/Export tool [here](http://go.microsoft.com/fwlink/?LinkID=301900).  
  
 Preparing your drive involves:  
  
-   Identifying the data to be imported.  
  
-   Identifying the destination blobs in Windows Azure Storage.  
  
-   Using the Azure Import/Export tool to copy your data to one or more hard drives.  
  
 The Azure Import/Export tool will also generate a manifest file for each of the drives as it is prepared. A manifest file contains:  
  
-   An enumeration of all the files intended for upload and the mappings from these files to blobs.  
  
-   Checksums of the segments of each file.  
  
-   Information about the metadata and properties to associate with each blob.  
  
-   A listing of the action to take if a blob that is being uploaded has the same name as an existing blob in the container. Possible options are: a) overwrite the blob with the file b) keep the existing blob and skip uploading the file, c) append a suffix to the name so that it does not conflict with other files.  
  
## Obtaining Your Shipping Location  
 Before creating an import job, you need to obtain a shipping location name and address by calling the [List Locations](/rest/api/storageservices/importexport/List-Locations2) operation. `List Locations` will return a list of locations and their mailing addresses based on the location of your storage account. You can select a location from the returned list and ship your hard drives to that address. Note that `List Locations` returns only one possible shipping location.  
  
 Follow the steps below to obtain the shipping location:  
  
-   Identify the name of the location of your storage account. This value can be found under the **Location** field on the storage account’s **Dashboard** in the classic portal or queried for by using the service management API operation [Get Storage Account Properties](/rest/api/storagerp/storageaccounts#StorageAccounts_GetProperties).  
  
-   Retrieve a list of locations that are available to process this storage account by calling the `List Locations` operation with the query parameter `originlocation=<location-name>`. The list returned will contain one or more locations to which you can ship your drives.  
  
-   Select a location from the returned list and note its name and mailing address.  
  
> [!NOTE]
>  `List Locations` either returns one possible location, or none. If no locations are returned, the service is not yet available for your storage account.  
  
## Creating the Import Job  
 To create the import job, call the [Put Job](/rest/api/storageservices/importexport/Put-Job) operation. You will need to provide the following information:  
  
-   A name for the job.  
  
-   The storage account name.  
  
-   The storage account key.  
  
-   The shipping location name, obtained from the previous step.  
  
-   A job type (Import).  
  
-   The return address where the drives should be sent after the import job has completed.  
  
-   The list of drives in the job. For each drive, you must include the following information that was obtained during the drive preparation step:  
  
    -   The drive Id  
  
    -   The BitLocker key  
  
    -   The manifest file relative path on the hard drive  
  
    -   The Base16 encoded manifest file MD5 hash  
  
## Shipping Your Drives  
 You must ship your drives to the address that you obtained from the previous step,and you must provide the Import/Export service with the tracking number of the package.  
  
> [!NOTE]
>  You must ship your drives via a supported carrier service, which will provide a tracking number for your package.  
  
## Updating the Import Job with Your Shipping Information  
 After you have your tracking number, call the [Update Job Properties](/rest/api/storageservices/importexport/Update-Job-Properties) operation to update the shipping carrier name, the tracking number for the job, and the carrier account number for return shipping. You can optionally specify the number of drives and the shipping date as well.  
  
## See Also  
 [Using the Import/Export Service REST API](storage-import-export-using-the-rest-api.md)