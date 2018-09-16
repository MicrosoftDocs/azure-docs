---
title: Create an Import Job for Azure Import/Export | Microsoft Docs
description: Learn how to create an import for the Microsoft Azure Import/Export service.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.component: common
---
# Creating an import job for the Azure Import/Export service

Creating an import job for the Microsoft Azure Import/Export service using the REST API involves the following steps:

-   Preparing drives with the Azure Import/Export Tool.

-   Obtaining the location to which to ship the drive.

-   Creating the import job.

-   Shipping the drives to Microsoft via a supported carrier service.

-   Updating the import job with the shipping details.

 See [Using the Microsoft Azure Import/Export service to Transfer Data to Blob Storage](storage-import-export-service.md) for an overview of the Import/Export service and a tutorial that demonstrates how to use the [Azure  portal](https://portal.azure.com/) to create and manage import and export jobs.

## Preparing drives with the Azure Import/Export Tool

The steps to prepare drives for an import job are the same whether you create the jobvia the portal or via the REST API.

Below is a brief overview of drive preparation. Refer to the [Azure Import-ExportTool Reference](storage-import-export-tool-how-to-v1.md) for complete instructions. You can download the Azure Import/Export Tool [here](http://go.microsoft.com/fwlink/?LinkID=301900).

Preparing your drive involves:

-   Identifying the data to be imported.

-   Identifying the destination blobs in Windows Azure Storage.

-   Using the Azure Import/Export Tool to copy your data to one or more hard drives.

 The Azure Import/Export Tool will also generate a manifest file for each of the drives as it is prepared. A manifest file contains:

-   An enumeration of all the files intended for upload and the mappings from these files to blobs.

-   Checksums of the segments of each file.

-   Information about the metadata and properties to associate with each blob.

-   A listing of the action to take if a blob that is being uploaded has the same name as an existing blob in the container. Possible options are: a) overwrite the blob with the file, b) keep the existing blob and skip uploading the file, c) append a suffix to the name so that it does not conflict with other files.

## Obtaining your shipping location

Before creating an import job, you need to obtain a shipping location name and address by calling the [List Locations](https://docs.microsoft.com/rest/api/storageimportexport/locations/list) operation. `List Locations` will return a list of locations and their mailing addresses. You can select a location from the returned list and ship your hard drives to that address. You can also use the `Get Location` operation to obtain the shipping address for a specific location directly.

 Follow the steps below to obtain the shipping location:

-   Identify the name of the location of your storage account. This value can be found under the **Location** field on the storage account's **Dashboard** in the Azure portal or queried for by using the service management API operation [Get Storage Account Properties](/rest/api/storagerp/storageaccounts#StorageAccounts_GetProperties).

-   Retrieve the location that is available to process this storage account by calling the `Get Location` operation.

-   If the `AlternateLocations` property of the location contains the location itself, then it is okay to use this location. Otherwise, call the `Get Location` operation again with one of the alternate locations. The original location might be temporarily closed for maintenance.

## Creating the import job
To create the import job, call the [Put Job](/rest/api/storageimportexport/jobs#Jobs_CreateOrUpdate) operation. You will need to provide the following information:

-   A name for the job.

-   The storage account name.

-   The shipping location name, obtained from the previous step.

-   A job type (Import).

-   The return address where the drives should be sent after the import job has completed.

-   The list of drives in the job. For each drive, you must include the following information that was obtained during the drive preparation step:

    -   The drive Id

    -   The BitLocker key

    -   The manifest file relative path on the hard drive

    -   The Base16 encoded manifest file MD5 hash

## Shipping your drives
You must ship your drives to the address that you obtained from the previous step, and you must provide the Import/Export service with the tracking number of the package.

> [!NOTE]
>  You must ship your drives via a supported carrier service, which will provide a tracking number for your package.

## Updating the import job with your shipping information
After you have your tracking number, call the [Update Job Properties](https://docs.microsoft.com/rest/api/storageimportexport/Jobs/Update) operation to update the shipping carrier name, the tracking number for the job, and the carrier account number for return shipping. You can optionally specify the number of drives and the shipping date as well.

[!INCLUDE [storage-import-export-delete-personal-info.md](../../../includes/storage-import-export-delete-personal-info.md)]

## Next steps

* [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
