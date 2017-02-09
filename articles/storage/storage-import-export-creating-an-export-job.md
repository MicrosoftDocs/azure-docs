---
title: Creating an Export Job | Microsoft Docs
description: Learn how to create an export job for the Microsoft Azure Import-Export Service
author: renashahmsft
manager: aungoo
editor: tysonn
services: storage
documentationcenter: ''

ms.assetid: 613d480b-a8ef-4b28-8f54-54174d59b3f4
ms.service: storage
ms.workload: storage 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2015
ms.author: renash

---

# Creating an Export Job
Creating an export job for the Microsoft Azure Import/Export service using the REST API involves the following steps:  
  
-   Selecting the blobs to export.  
  
-   Obtaining a shipping location.  
  
-   Creating the export job.  
  
-   Shipping your empty drives to Microsoft via a supported carrier service.  
  
-   Updating the export job with the package information.  
  
-   Receiving the drives back from Microsoft.  
  
 See [Using the Windows Azure Import/Export Service to Transfer Data to Blob Storage](storage-import-export-service.md) for an overview of the Import/Export service and a tutorial that demonstrates how to use the [Microsoft Azure classic portal](http://manage.windowsazure.com/) to create and manage import and export jobs.  
  
## Selecting Blobs to Export  
 To create an export job, you will need to provide a list of blobs that you want to export from your storage account. There are a few ways to select blobs to be exported:  
  
-   You can use a relative blob path to select a single blob and all of its snapshots.  
  
-   You can use a relative blob path to select a single blob excluding its snapshots.  
  
-   You can use a relative blob path and a snapshot time to select a single snapshot.  
  
-   You can use a blob prefix to select all blobs and snapshots with the given prefix.  
  
-   You can export all blobs and snapshots in the storage account.  
  
 For more information about specifying blobs to export, see the [Put Job](/rest/api/storageservices/importexport/Put-Job) operation.  
  
## Obtaining Your Shipping Location  
 Before creating an export job, you need to obtain a shipping location name and address by calling the [List Locations](/rest/api/storageservices/importexport/List-Locations2) operation. `List Locations` will return a list of locations and their mailing addresses based on the location of your storage account. You can select a location from the returned list and ship your hard drives to that address. Note that `List Locations` may return only one possible shipping location.  
  
 Follow the steps below to obtain the shipping location:  
  
-   Identify the name of the location of your storage account. This value can be found under the **Location** field on the storage account’s **Dashboard** in the classic portal or queried for by using the service management API operation [Get Storage Account Properties](/rest/api/storagerp/storageaccounts#StorageAccounts_GetProperties).  
  
-   Retrieve a list of locations that are available to process this storage account by calling the `List Locations` operation with the query parameter `originlocation=<location-name>`. The list returned will contain one or more locations to which you can ship your drives.  
  
-   Select a location from the returned list and note its name and mailing address.  
  
> [!NOTE]
>  For the preview release, `List Locations` will return one location, or none. If no locations are returned, the service is not yet available for your storage account.  
  
## Creating the Export Job  
 To create the export job, call the [Put Job](/rest/api/storageservices/importexport/Put-Job) operation. You will need to provide the following information:  
  
-   A name for the job.  
  
-   The storage account name.  
  
-   The storage account key.  
  
-   The shipping location name, obtained in the previous step.  
  
-   A job type (Export).  
  
-   The return address where the drives should be sent after the export job has completed.  
  
-   The list of blobs (or blob prefixes) to be exported.  
  
## Shipping Your Drives  
 Next, use the Azure Import/Export tool to determine the number of drives you need to send, based on the blobs you have selected to be exported and the drive size. See the [Azure Import-Export Tool Reference](storage-import-export-tool-how-to-v1.md) for details.  
  
 Package the drives in a single package and ship them to the address obtained in the earlier step. Note the tracking number of your package for the next step.  
  
> [!NOTE]
>  You must ship your drives via a supported carrier service, which will provide a tracking number for your package.  
  
## Updating the Export Job with Your Package Information  
 After you have your tracking number, call the [Update Job Properties](/rest/api/storageservices/importexport/Update-Job-Properties) operation to updated the carrier name and tracking number for the job. You can optionally specify the number of drives, the return address, and the shipping date as well.  
  
## Receiving the Package  
 After your export job has been processed, your drives will be returned to you with your encrypted data. You can retrieve the BitLocker key for each of the drives by calling the [Get Job](/rest/api/storageservices/importexport/Get-Job3) operation. You can then unlock the drive using the key. The drive manifest file on each drive contains the list of files on the drive, as well as the original blob address for each file.  
  
## See Also  
 [Using the Import/Export Service REST API](storage-import-export-using-the-rest-api.md)