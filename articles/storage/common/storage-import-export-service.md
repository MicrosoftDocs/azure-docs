---
title: Using Azure Import/Export to transfer data to and from Azure Storage | Microsoft Docs
description: Learn how to create import and export jobs in the Azure portal for transferring data to and from Azure Storage.
author: alkohli
services: storage
ms.service: storage
ms.topic: article
ms.date: 05/06/2020
ms.author: alkohli
ms.subservice: common
---
# What is Azure Import/Export service?

Azure Import/Export service is used to securely import large amounts of data to Azure Blob storage and Azure Files by shipping disk drives to an Azure datacenter. This service can also be used to transfer data from Azure Blob storage to disk drives and ship to your on-premises sites. Data from one or more disk drives can be imported either to Azure Blob storage or Azure Files.

Supply your own disk drives and transfer data with the Azure Import/Export service. You can also use disk drives supplied by Microsoft.

If you want to transfer data using disk drives supplied by Microsoft, you can use [Azure Data Box Disk](../../databox/data-box-disk-overview.md) to import data into Azure. Microsoft ships up to 5 encrypted solid-state disk drives (SSDs) with a 40 TB total capacity per order, to your datacenter through a regional carrier. You can quickly configure disk drives, copy data to disk drives over a USB 3.0 connection, and ship the disk drives back to Azure. For more information, go to [Azure Data Box Disk overview](../../databox/data-box-disk-overview.md).

## Azure Import/Export use cases

Consider using Azure Import/Export service when uploading or downloading data over the network is too slow, or getting additional network bandwidth is cost-prohibitive. Use this service in the following scenarios:

* **Data migration to the cloud**: Move large amounts of data to Azure quickly and cost effectively.
* **Content distribution**: Quickly send data to your customer sites.
* **Backup**: Take backups of your on-premises data to store in Azure Storage.
* **Data recovery**: Recover large amount of data stored in storage and have it delivered to your on-premises location.

## Import/Export components

Import/Export service uses the following components:

* **Import/Export service**: This service available in Azure portal helps the user create and track data import (upload) and export (download) jobs.  

* **WAImportExport tool**: This is a command-line tool that does the following:
  * Prepares your disk drives that are shipped for import.
  * Facilitates copying your data to the drive.
  * Encrypts the data on the drive with AES 256-bit BitLocker. You can use an external key protector to protect your BitLocker key.
  * Generates the drive journal files used during import creation.
  * Helps identify numbers of drives needed for export jobs.

> [!NOTE]
> The WAImportExport tool is available in two versions, version 1 and 2. We recommend that you use:
>
> * Version 1 for import/export into Azure Blob storage.
> * Version 2 for importing data into Azure files.
>
> The WAImportExport tool is only compatible with 64-bit Windows operating system. For specific OS versions supported, go to [Azure Import/Export requirements](storage-import-export-requirements.md#supported-operating-systems).

* **Disk Drives**: You can ship Solid-state drives (SSDs) or Hard disk drives (HDDs) to the Azure datacenter. When creating an import job, you ship disk drives containing your data. When creating an export job, you ship empty drives to the Azure datacenter. For specific disk types, go to [Supported disk types](storage-import-export-requirements.md#supported-hardware).

## How does Import/Export work?

Azure Import/Export service allows data transfer into Azure Blobs and Azure Files by creating jobs. Use Azure portal or Azure Resource Manager REST API to create jobs. Each job is associated with a single storage account.

The jobs can be import or export jobs. An import job allows you to import data into Azure Blobs or Azure files whereas the export job allows data to be exported from Azure Blobs. For an import job, you ship drives containing your data. When you create an export job, you ship empty drives to an Azure datacenter. In each case, you can ship up to 10 disk drives per job.

### Inside an import job

At a high level, an import job involves the following steps:

1. Determine data to be imported, number of drives you need, destination blob location for your data in Azure storage.
2. Use the WAImportExport tool to copy data to disk drives. Encrypt the disk drives with BitLocker.
3. Create an import job in your target storage account in Azure portal. Upload the drive journal files.
4. Provide the return address and carrier account number for shipping the drives back to you.
5. Ship the disk drives to the shipping address provided during job creation.
6. Update the delivery tracking number in the import job details and submit the import job.
7. The drives are received and processed at the Azure data center.
8. The drives are shipped using your carrier account to the return address provided in the import job.

> [!NOTE]
> For local (within data center country/region) shipments, please share a domestic carrier account.
>
> For abroad (outside data center country/region) shipments, please share an international carrier account.

 ![Figure 1:Import job flow](./media/storage-import-export-service/importjob.png)

For step-by-step instructions on data import, go to:

* [Import data into Azure Blobs](storage-import-export-data-to-blobs.md)
* [Import data into Azure Files](storage-import-export-data-to-files.md)

### Inside an export job

> [!IMPORTANT]
> The service only supports export of Azure Blobs. Export of Azure files is not supported.

At a high level, an export job involves the following steps:

1. Determine the data to be exported, number of drives you need, source blobs or container paths of your data in Blob storage.
2. Create an export job in your source storage account in Azure portal.
3. Specify source blobs or container paths for the data to be exported.
4. Provide the return address and carrier account number for shipping the drives back to you.
5. Ship the disk drives to the shipping address provided during job creation.
6. Update the delivery tracking number in the export job details and submit the export job.
7. The drives are received and processed at the Azure data center.
8. The drives are encrypted with BitLocker and the keys are available via the Azure portal.  
9. The drives are shipped using your carrier account to the return address provided in the import job.

> [!NOTE]
> For local (within data center country/region) shipments, please share a domestic carrier account.
>
> For abroad (outside data center country/region) shipments, please share an international carrier account.
  
 ![Figure 2:Export job flow](./media/storage-import-export-service/exportjob.png)

For step-by-step instructions on data export, go to [Export data from Azure Blobs](storage-import-export-data-from-blobs.md).

## Region availability

The Azure Import/Export service supports copying data to and from all Azure storage accounts. You can ship disk drives to one of the listed locations. If your storage account is in an Azure location that is not specified here, an alternate shipping location is provided when you create the job.

### Supported shipping locations

|Country/Region  |Country/Region  |Country/Region  |Country/Region  |
|---------|---------|---------|---------|
|East US    | North Europe        | Central India        |US Gov Iowa         |
|West US     |West Europe         | South India        | US DoD East        |
|East US 2    | East Asia        |  West India        | US DoD Central        |
|West US 2     | Southeast Asia        | Canada Central        | China East         |
|Central US     | Australia East        | Canada East        | China North        |
|North Central US     |  Australia Southeast       | Brazil South        | UK South        |
|South Central US     | Japan West        |Korea Central         | Germany Central        |
|West Central US     |  Japan East       | US Gov Virginia        | Germany Northeast        |

## Security considerations

The data on the drive is encrypted using AES 256-bit BitLocker Drive Encryption. This encryption protects your data while it is in transit.

For import jobs, drives are encrypted in two ways.  

* Specify the option when using *dataset.csv* file while running the WAImportExport tool during drive preparation.

* Enable BitLocker encryption manually on the drive. Specify the encryption key in the *driveset.csv* when running WAImportExport tool command line during drive preparation. The BitLocker encryption key can be further protected by using an external key protector (also known as the Microsoft managed key) or a customer managed key. For more information, see how to [Use a customer managed key to protect your BitLocker key](storage-import-export-encryption-key-portal.md).

For export jobs, after your data is copied to the drives, the service encrypts the drive using BitLocker before shipping it back to you. The encryption key is provided to you via the Azure portal. The drive needs to be unlocked using the WAImporExport tool using the key.

[!INCLUDE [storage-import-export-delete-personal-info.md](../../../includes/storage-import-export-delete-personal-info.md)]

### Pricing

**Drive handling fee**

There is a drive handling fee for each drive processed as part of your import or export job. See the details on the [Azure Import/Export Pricing](https://azure.microsoft.com/pricing/details/storage-import-export/).

**Shipping costs**

When you ship drives to Azure, you pay the shipping cost to the shipping carrier. When Microsoft returns the drives to you, the shipping cost is charged to the carrier account which you provided at the time of job creation.

**Transaction costs**

[Standard storage transaction charge](https://azure.microsoft.com/pricing/details/storage/) apply during import as well as export of data. Standard egress charges are also applicable along with storage transaction charges when data is exported from Azure Storage. For more information on egress costs, see [Data transfer pricing.](https://azure.microsoft.com/pricing/details/data-transfers/).

## Next steps

Learn how to use the Import/Export service to:

* [Import data to Azure Blobs](storage-import-export-data-to-blobs.md)
* [Export data from Azure Blobs](storage-import-export-data-from-blobs.md)
* [Import data to Azure Files](storage-import-export-data-to-files.md)
