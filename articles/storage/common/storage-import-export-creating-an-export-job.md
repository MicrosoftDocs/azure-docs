---
title: Create an export Job for Azure Import/Export | Microsoft Docs
description: Learn how to create an export job for the Microsoft Azure Import/Export service.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.subservice: common
---

# Creating an export job for the Azure Import/Export service
Creating an export job for the Microsoft Azure Import/Export service using the REST API involves the following steps:

- Selecting the blobs to export.

- Obtaining a shipping location.

- Creating the export job.

- Shipping your empty drives to Microsoft via a supported carrier service.

- Updating the export job with the package information.

- Receiving the drives back from Microsoft.

  See [Using the Windows Azure Import/Export service to Transfer Data to Blob Storage](storage-import-export-service.md) for an overview of the Import/Export service and a tutorial that demonstrates how to use the [Azure portal](https://portal.azure.com/) to create and manage import and export jobs.

## Selecting blobs to export
 To create an export job, you will need to provide a list of blobs that you want to export from your storage account. There are a few ways to select blobs to be exported:

- You can use a relative blob path to select a single blob and all of its snapshots.

- You can use a relative blob path to select a single blob excluding its snapshots.

- You can use a relative blob path and a snapshot time to select a single snapshot.

- You can use a blob prefix to select all blobs and snapshots with the given prefix.

- You can export all blobs and snapshots in the storage account.

  For more information about specifying blobs to export, see the [Put Job](/rest/api/storageimportexport/jobs) operation.

## Obtaining your shipping location
Before creating an export job, you need to obtain a shipping location name and address by calling the [Get Location](https://portal.azure.com) or [List Locations](https://docs.microsoft.com/rest/api/storageimportexport/locations/list) operation. `List Locations` will return a list of locations and their mailing addresses. You can select a location from the returned list and ship your hard drives to that address. You can also use the `Get Location` operation to obtain the shipping address for a specific location directly.

Follow the steps below to obtain the shipping location:

-   Identify the name of the location of your storage account. This value can be found under the **Location** field on the storage account's **Dashboard** in the Azure portal or queried for by using the service management API operation [Get Storage Account Properties](/rest/api/storagerp/storageaccounts).

-   Retrieve the location that are available to process this storage account by calling the `Get Location` operation.

-   If the `AlternateLocations` property of the location contains the location itself, then it is okay to use this location. Otherwise, call the `Get Location` operation again with one of the alternate locations. The original location might be temporarily closed for maintenance.

## Creating the export job
 To create the export job, call the [Put Job](/rest/api/storageimportexport/jobs) operation. You will need to provide the following information:

-   A name for the job.

-   The storage account name.

-   The shipping location name, obtained in the previous step.

-   A job type (Export).

-   The return address where the drives should be sent after the export job has completed.

-   The list of blobs (or blob prefixes) to be exported.

## Shipping your drives
 Next, use the Azure Import/Export Tool to determine the number of drives you need to send, based on the blobs you have selected to be exported and the drive size. See the [Azure Import/Export Tool Reference](storage-import-export-tool-how-to-v1.md) for details.

 Package the drives in a single package and ship them to the address obtained in the earlier step. Note the tracking number of your package for the next step.

> [!NOTE]
>  You must ship your drives via a supported carrier service, which will provide a tracking number for your package.

## Updating the export job with your package information
 After you have your tracking number, call the [Update Job Properties](/rest/api/storageimportexport/jobs) operation to updated the carrier name and tracking number for the job. You can optionally specify the number of drives, the return address, and the shipping date as well.

## Receiving the package
 After your export job has been processed, your drives will be returned to you with your encrypted data. You can retrieve the BitLocker key for each of the drives by calling the [Get Job](/rest/api/storageimportexport/jobs) operation. You can then unlock the drive using the key. The drive manifest file on each drive contains the list of files on the drive, as well as the original blob address for each file.

[!INCLUDE [storage-import-export-delete-personal-info.md](../../../includes/storage-import-export-delete-personal-info.md)]

## Next steps

* [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
