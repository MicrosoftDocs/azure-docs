---
title: Review copy errors in uploads from Azure Data Box, Azure Data Box Heavy devices
description: Describes review and follow-up for non-retryable errors that prevent files from uploading from an Azure Data Box or Azure Data Box Heavy device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 05/10/2021
ms.author: alkohli
---

# Review copy errors in uploads from Azure Data Box and Azure Data Box Heavy devices

This article describes review and follow-up for non-retryable errors that occasionally prevent files from uploading to the cloud from an Azure Data Box or Azure Data Box Heavy device.

> [!NOTE]
> The information in this article applies to import orders only.

## Upload errors notification

When data is uploaded to Azure from your device, some file uploads might occasionally fail because of configuration errors that can't be resolved through a retry. In that case, you receive a notification to give you a chance to review and fix the errors for a later upload.

You'll see the following notification in the Azure portal. The errors are listed in the data copy log, which you can open using the **DATA COPY PATH**. For guidance on resolving the errors, see [Summary of non-retryable upload errors](#summary-of-non-retryable-upload-errors).

![Notification of errors during upload](media/data-box-troubleshoot-data-upload/copy-completed-with-errors-notification-01.png)

You can't fix these errors. The upload has completed with errors. The notification lets you know about any configuration issues you need to fix before you try another upload via network transfer or a new import order.

After you review the errors and confirm that you're ready to proceed, the data will be secure erased from the device. If you don't respond to the notification, the order is completed automatically after 14 days. For step-by-step instructions, see [Review errors and proceed](#review-errors-and-proceed).


## Review errors and proceed

The order will be completed automatically after 14 days. By acting on the notification, you can move things along more quickly.

[!INCLUDE [data-box-review-nonretryable-errors](../../includes/data-box-review-nonretryable-errors.md)]


## Summary of non-retryable upload errors

The following non-retryable errors result in a notification:

|Error category                    |Error code |Error message                                                                             |
|----------------------------------|-----------|------------------------------------------------------------------------------------------|
|UploadErrorCloudHttp              |400        |Bad Request (file name not valid) [Learn more](#bad-request-file-name-not-valid).|
|UploadErrorCloudHttp              |400        |The value for one of the HTTP headers is not in the correct format. [Learn more](#the-value-for-one-of-the-http-headers-is-not-in-the-correct-format).|
|UploadErrorCloudHttp              |409        |This operation is not permitted as the blob is immutable due to a policy. [Learn more](#this-operation-is-not-permitted-as-the-blob-is-immutable-due-to-policy).|
|UploadErrorCloudHttp              |409        |The total provisioned capacity of the shares cannot exceed the account maximum size limit. [Learn more](#the-total-provisioned-capacity-of-the-shares-cannot-exceed-the-account-maximum-size-limit).|
|UploadErrorCloudHttp              |409        |The blob type is invalid for this operation. [Learn more](#the-blob-type-is-invalid-for-this-operation).|
|UploadErrorCloudHttp              |409        |There is currently a lease on the blob and no lease ID was specified in the request. [Learn more](#there-is-currently-a-lease-on-the-blob-and-no-lease-id-was-specified-in-the-request).|
|UploadErrorManagedConversionError |409        |The size of the blob being imported is invalid. The blob size is `<blob-size>` bytes. Supported sizes are between 20971520 Bytes and 8192 GiB. [Learn more](#the-size-of-the-blob-being-imported-is-invalid-the-blob-size-is-blob-size-bytes-supported-sizes-are-between-20971520-bytes-and-8192-gib)|
<!--Temporarily removed from table: Bad Request (file property failure for Azure Files)-->

For more information about the data copy log's contents, see [Tracking and event logging for your Azure Data Box and Azure Data Box Heavy import order](data-box-logs.md).

Other REST API errors might occur during data uploads. For more information, see [Common REST API error codes](/rest/api/storageservices/common-rest-api-error-codes).

> [!NOTE]
> The **Follow-up** sections in the error descriptions describe how to update your data configuration before you place a new import order or perform a network transfer. You can't fix these errors in the current upload.


### Bad Request (file name not valid)

**Error category:** UploadErrorCloudHttp 

**Error code:** 400

**Error description:** Most file naming issues are caught during the **Prepare to ship** phase or fixed automatically during the upload (resulting in a **Copy with warnings** status). When an invalid file name is not caught, the file fails to upload to Azure.

**Follow-up:** You can't fix this error in the current upload. The upload has completed with errors. Before you do a network transfer or start a new order, rename the listed files to meet naming requirements for Azure Files. For naming requirements, see [Directory and File Names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names).


<!--TEMPORARILY REMOVED. Product team may restore later. ### Bad Request (File property failure for Azure Files)

**Error category:** UploadErrorCloudHttp 

**Error code:** 400

**Error description:** Data import will fail if the upload of file properties fails for Azure Files.  

**Follow-up:** You can't fix this error in the current upload. The upload will complete with errors. Before you do a network transfer or start a new import order, *GET TROUBLESHOOTING*.-->


### The value for one of the HTTP headers is not in the correct format

**Error category:** UploadErrorCloudHttp 

**Error code:** 400

**Error description:** The listed blobs couldn't be uploaded because they don't meet format or size requirements for blobs in Azure storage.

**Follow-up:** You can't fix this error in the current upload. The upload has completed with errors. Before you do a network transfer or start a new import order, ensure that:

- The listed page blobs align to the 512-byte page boundaries.

- The listed block blobs do not exceed the 4.75-TiB maximum size.


### This operation is not permitted as the blob is immutable due to policy

**Error category:** UploadErrorCloudHttp 

**Error code:** 409

**Error description:** If a blob storage container is configured as Write Once, Read Many (WORM), upload of any blobs that are already stored in the container will fail.

**Follow-up:** You can't fix this error in the current upload. The upload has completed with errors. Before you do a network transfer or start a new import order, make sure the listed blobs are not part of an immutable storage container. For more information, see [Store business-critical blob data with immutable storage](../storage/blobs/immutable-storage-overview.md).


### The total provisioned capacity of the shares cannot exceed the account maximum size limit

**Error category:** UploadErrorCloudHttp 

**Error code:** 409

**Error description:** The upload failed because the total size of the data exceeds the storage account size limit. For example, the maximum capacity of a FileStorage account is 100 TiB. If total data size exceeds 100 TiB, the upload will fail.  

**Follow-up:** You can't fix this error in the current upload. The upload has completed with errors. Before you do a network transfer or start a new import order, make sure the total capacity of all shares in the storage account will not exceed the size limit of the storage account. For more information, see [Azure storage account size limits](data-box-limits.md#azure-storage-account-size-limits).


### The blob type is invalid for this operation

**Error category:** UploadErrorCloudHttp 

**Error code:** 409

**Error description:** Data import to a blob in the cloud will fail if the destination blob's data or properties are being modified.

**Follow-up:** You can't fix this error in the current upload. The upload has completed with errors. Before you do a network transfer or start a new import order, make sure there is no concurrent modification of the listed blobs or their properties during the upload.

### There is currently a lease on the blob and no lease ID was specified in the request

**Error category:** UploadErrorCloudHttp 

**Error code:** 409

**Error description:** Data import to a blob in the cloud will fail if the destination blob has an active lease.

**Follow-up:** You can't fix this error in the current upload. The upload has completed with errors. Before you do a network transfer or start a new import order, ensure that the listed blobs do not have an active lease. For more information, see [Pessimistic concurrency for blobs](../storage/blobs/concurrency-manage.md?tabs=dotnet#pessimistic-concurrency-for-blobs).


### The size of the blob being imported is invalid. The blob size is `<blob-size>` Bytes. Supported sizes are between 20971520 Bytes and 8192 GiB.

**Error category:** UploadErrorManagedConversionError

**Error code:** 409

**Error description:** The listed page blobs failed to upload because they are not a size that can be converted to a Managed Disk. To be converted to a Managed Disk, a page blob must be from 20 MB (20,971,520 Bytes) to 8192 GiB in size.

**Follow-up:** You can't fix this error in the current upload. The upload has completed with errors. Before you do a network transfer or start a new import order, make sure each listed blob is from 20 MB to 8192 GiB in size.


## Next steps

- [Review common REST API errors](/rest/api/storageservices/common-rest-api-error-codes).
- [Verify a data upload to Azure](data-box-deploy-picked-up.md?tabs=in-us-canada-europe#verify-data-upload-to-azure-8)