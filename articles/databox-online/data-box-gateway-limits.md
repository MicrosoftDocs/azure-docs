---
title: Azure Data Box Gateway limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box Gateway.
services: databox
author: alkohli

ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 10/03/2018
ms.author: alkohli
---

# Azure Data Box Gateway limits (Preview)


Consider these limits as you deploy and operate your Microsoft Azure Data Box Gateway solution. 

> [!IMPORTANT] 
> Data Box Gateway is in Preview. Review the [terms of use for the preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution. 


## Data Box Gateway service limits

- In this release, service is available only in certain regions in US, EU, and Asia Pacific. For more information, go to [region availability](#data-box-gateway-overview#region-availability). The storage account should be physically closest to the region where the device deployed (can be different from service geo).
- Moving a Data Box Gateway resource to a different subscription or resource group is not supported. For more details, go to [Move resources to new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources).

## Data Box Gateway device limits

The following table describes the limits for the Data Box Gateway device.

| Description | Value |
|---|---|
|No. of files per device |100 million <br> Limit is ~ 25 million files for every 2 TB of disk space with maximum limit at 100 million |
|No. of shares per device |24 |
|Maximum file size written to a share|For a 2 TB virtual device, maximum file size is 500 GB. <br> The maximum file size increases with the data disk size in the preceding ratio until it reaches a maximum of 5 TB. |

## Azure storage limits

This section describes the limits for Azure Storage service, and the required naming conventions for Azure Files, Azure block blobs, and Azure page blobs, as applicable to the Data Box Gateway/Data Box Edge service. Review the storage limits carefully and follow all the recommendations.

For the latest information on Azure storage service limits and best practices for naming shares, containers, and files, go to:

- [Naming and referencing containers](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata)
- [Naming and referencing shares](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Block blobs and page blob conventions](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

> [!IMPORTANT]
> If there are any files or directories that exceed the Azure Storage service limits, or do not conform to Azure Files/Blob naming conventions, then these files or directories are not ingested into the Azure Storage via the Data Box Gateway/Data Box Edge service.

## Data upload caveats

Following caveats apply to data as it moves into Azure.

- We suggest that more than one device should not write to the same container.
- If you have an existing Azure object (such as a blob or a file) in the cloud with the same name as the object that is being copied, device will overwrite the file in the cloud. 
- An empty directory hierarchy (without any files) created under share folders is not uploaded to the blob containers.


## Azure storage account size and object size limits

Here are the limits on the size of the data that is copied into storage account. Make sure that the data you upload conforms to these limits. For the most up-to-date information on these limits, go to [Azure blob storage scale targets](https://docs.microsoft.com/azure/storage/common/storage-scalability-targets#azure-blob-storage-scale-targets) and [Azure Files scale targets](https://docs.microsoft.com/azure/storage/common/storage-scalability-targets#azure-files-scale-targets).

| Size of data copied into Azure storage account                      | Default Limit          |
|---------------------------------------------------------------------|------------------------|
| Block Blob and page blob                                            | 500 TB per storage account|


## Azure object size limits

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block Blob        | ~ 8 TB                                                 |
| Page Blob         | 1 TB <br> Every file uploaded in Page Blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> The VHD and VHDX are 512 bytes aligned. |


## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
