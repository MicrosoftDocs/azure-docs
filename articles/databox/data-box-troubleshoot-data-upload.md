---
title: Review copy errors in uploads from Azure Data Box, Azure Data Box Heavy devices
description: Describes review and follow-up for errors during uploads from an Azure Data Box or Azure Data Box Heavy device to the Azure cloud.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 06/06/2022
ms.author: shaas
---

# Review copy errors in uploads from Azure Data Box and Azure Data Box Heavy devices

This article describes review and follow-up for errors that occasionally prevent files from uploading to the Azure cloud from an Azure Data Box or Azure Data Box Heavy device.

The error notification and options vary depending on whether you can fix the error in the current upload:

- **Retryable errors** - You can fix many types of copy error and resume the upload. The data is then successfully uploaded in your current order. 
    
    
    An example of a retryable error is when Large File Shares are not enabled for a storage account that requires shares with data more than 5 TiB. To resolve this, you will need to enable this setting and then confirm to resume data copy. This type of error is referred to as a *retryable error* in the discussion that follows.

- **Non-retryable errors** - These are errors that can't be fixed. For those errors, the upload pauses to give you a chance to review the errors. But the order completes without the data that failed to upload, and the data is secure erased from the device. You'll need to create a new order after you resolve the issues in your data. 

    An example of a non-retryable error is if a blob storage container is configured as Write Once, Read Many (WORM). Upload of any blobs that are already stored in the container will fail. This type of error is referred to as a *non-retryable error* in the discussion that follows.

> [!NOTE]
> The information in this article applies to import orders only.


## Upload errors notification

When a file upload fails because of an error, you'll receive a notification in the Azure portal. You can tell whether the error can be fixed by the status and options in the order overview.

**Retryable errors**: If you can fix the error in the current order, the notification looks similar to the following one. The current order status is **Data copy halted**. You can either choose to resolve the error or proceed with data erasure without making any change. If you select **Resolve error**, a **Resolve error** screen will tell you how to resolve each error. For step-by-step instructions, see [Review errors and proceed](#review-errors-and-proceed).

![Screenshot of a Data Box order with retryable upload errors. The Data Copy Halted status and notification are highlighted.](media/data-box-troubleshoot-data-upload/data-box-retryable-errors-01.png)
 
**Non-retryable errors:** If the error can't be fixed in the current order, the notification looks similar to the following one. The current order status is **Data copy completed with errors. Device pending data erasure**. The errors are listed in the data copy log, which you can open using the **Copy Log Path**. For guidance on resolving the errors, see [Summary of upload errors](#summary-of-upload-errors).

![Screenshot of a Data Box order with retryable upload errors. TELL WHAT IS HIGHLIGHTED.](media/data-box-troubleshoot-data-upload/copy-completed-with-errors-notification-01.png)

You can't fix these errors. The upload has completed with errors. The notification lets you know about any configuration issues you need to fix before you try another upload via network transfer or a new import order.

After you review the errors and confirm you're ready to proceed, the data is secure erased from the device. If you don't respond to the notification, the order is completed automatically after 14 days. For step-by-step instructions, see [Review errors and proceed](#review-errors-and-proceed).


## Review errors and proceed

How you proceed with an upload depends on whether the errors can be fixed and the current upload resumed (see **Retryable errors** tab), or the errors can't be fixed in the current order (see the **Non-retryable errors** tab).

# [Retryable errors](#tab/retryable-errors)

When a retryable error occurs during an upload, you receive a notification with instructions for fixing the error. If you can't fix the error, or prefer not to, you can proceed with the order without fixing the errors.

To resolve retryable copy errors during an upload, do these steps:

1. Open your order in the Azure portal.

   If any retryable copy errors prevented files from uploading, you'll see the following notification. The current order status will be **Data copy halted**.

   ![Screenshot of a Data Box order with data upload halted by retryable copy errors. The Data Copy Halted status and notification are highlighted.](media/data-box-troubleshoot-data-upload/data-box-retryable-errors-01.png)

1. Select **Resolve error** to view help for the errors.

   Your screen will look similar to the one below. In the example, the **Enable large file share** error can be resolved by toggling **Not enabled** for each storage account.

   The screen tells how to recover from two other copy errors: a missing storage account and a missing access key.

   For each error, there's a **Learn more** link to get more information.
 
   ![Screenshot of the Resolve Errors pane for multiple retryable errors from a Data Box upload. The Not Enabled buttons, confirmation prompt, and Proceed button are highlighted.](media/data-box-troubleshoot-data-upload/data-box-retryable-errors-02.png)

1. After you resolve the errors, select the check box by **I confirm that the errors have been resolved**. Then select **Proceed**.

   The order status changes to **Data copy error resolved**. The data copy will proceed within 24 hours.

   ![Screenshot of a Data Box order with Data Copy Resolved status. The order status and schedule for proceeding are highlighted.](media/data-box-troubleshoot-data-upload/data-box-retryable-errors-03.png)

   > [!NOTE]
   > If you don't resolve all of the retryable errors, this process will repeat after the data copy proceeds. To proceed without resolving any of the retryable errors, select **Skip and proceed with data erasure** on the **Overview** screen.


# [Non-retryable errors](#tab/non-retryable-errors)

The following errors can't be resolved in the current order. The order will be completed automatically after 14 days. By acting on the notification, you can move things along more quickly.

[!INCLUDE [data-box-review-nonretryable-errors](../../includes/data-box-review-nonretryable-errors.md)]

---

## Summary of upload errors

Review the summary tables on the **Retryable errors** tab or the **Non-retryable errors** tab to find out how to resolve or follow up on data copy errors that occurred during your upload.

# [Retryable errors](#tab/retryable-errors)

When the following errors occur, you can resolve the errors and include the files in the current data upload.


|Error message  |Error description |Error resolution |
|---------------|------------------|-----------------|
|Large file share not enabled on account |Large file shares aren’t enabled on one or more storage accounts. Resolve the error and resume data copy, or skip to data erasure and complete the order. | Large file shares are not enabled on the indicated storage accounts. Select the option highlighted to enable quota up to 100 TiB per share.|
|Storage account deleted or moved |One or more storage accounts were moved or deleted. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Storage accounts deleted or moved**<br>Storage accounts: &lt;*storage accounts list*&gt; were either deleted, or moved to a different subscription or resource group. Recover or re-create the storage accounts with the original set of properties, and then confirm to resume data copy.<br>[Learn more on how to recover a storage account](../storage/common/storage-account-recover.md). |
|Storage account location changed |One or more storage accounts were moved to a different region. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Storage accounts location changed**<br>Storage accounts: &lt;*storage accounts list*&gt; were moved to a different region. Restore the account to the original destination region and then confirm to resume data copy.<br>[Learn more on how to move storage accounts](../storage/common/storage-account-move.md). |
|Virtual network restriction on storage account |One or more storage accounts are behind a virtual network and have restricted access. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Storage accounts behind virtual network**<br>Storage accounts: &lt;*storage accounts list*&gt; were moved behind a virtual network. Add Data Box to the list of trusted services to allow access and then confirm to resume data copy.<br>[Learn more about trusted first party access](../storage/common/storage-network-security.md#exceptions). |
|Storage account owned by a different tenant |One or more storage accounts were moved under a different tenant. Resolve the error and resume data copy, or skip to data erasure and complete the order.|**Storage accounts moved to a different tenant**<br>Storage accounts: &lt;*storage accounts list*&gt; were moved to a different tenant. Restore the account to the original tenant and then confirm to resume data copy.<br>[Learn more on how to move storage accounts](../storage/common/storage-account-move.md). |
|Kek user identity not found |The user identity that has access to the customer-managed key wasn’t found in the active directory. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**User identity not found**<br>Applied a customer-managed key but the user assigned identity that has access to the key was not found in the active directory.<br>This error may occur if a user identity is deleted from Azure.<br>Try adding another user-assigned identity to your key vault to enable access to the customer-managed key. For more information, see how to [Enable the key](data-box-customer-managed-encryption-key-portal.md#enable-key).<br>Confirm to resume data copy after the error is resolved. |
|Cross tenant identity access not allowed |Managed identity couldn’t access the customer-managed key. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Cross tenant identity access not allowed**<br>Managed identity couldn’t access the customer-managed key.<br>This error may occur if a subscription is moved to a different tenant. To resolve this error, manually move the identity to the new tenant.<br>Try adding another user-assigned identity to your key vault to enable access to the customer-managed key. For more information, see how to [Enable the key](data-box-customer-managed-encryption-key-portal.md#enable-key).<br>Confirm to resume data copy after the error is resolved. |
|Key details not found |Couldn’t fetch the passkey as the customer-managed key wasn’t found. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Key details not found**<br>If you deleted the key vault, you can't recover the customer-managed key. If you migrated the key vault to a different tenant, see [Change a key vault tenant ID after a subscription move](../key-vault/general/move-subscription.md). If you deleted the key vault and it is still in the purge-protection duration, use the steps at [Recover a key vault](../key-vault/general/key-vault-recovery.md?tabs=azure-powershell#key-vault-powershell).<br>If the key vault was migrated to a different tenant, use one of the following steps to recover the vault:<ol><li>Revert the key vault back to the old tenant.</li><li>Set `Identity` = `None` and then set the value back to `Identity` = `SystemAssigned`. This deletes and recreates the identity after the new identity is created. Enable `Get`, `WrapKey`, and `UnwrapKey` permissions for the new identity in the key vault's access policy.</li></ol> |
|Key vault details not found |Couldn’t fetch the passkey as the associated key vault for the customer-managed key wasn’t found. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Key vault details not found**<br>If you migrated the key vault to a different tenant, see [Change a key vault tenant ID after a subscription move](../key-vault/general/move-subscription.md). If you deleted the key vault and it is in the purge-protection duration, use the steps in [Recover a key vault](../key-vault/general/key-vault-recovery.md?tabs=azure-powershell#key-vault-powershell).<br>If the key vault was migrated to a different tenant, use one of the following steps to recover the vault: <ol><li>Revert the key vault back to the old tenant.</li><li>Set `Identity` = `None` and then set the value back to `Identity` = `SystemAssigned`. This deletes and recreates the identity once the new identity has been created. Enable `Get`, `WrapKey`, and `UnwrapKey` permissions for the new identity in the key vault's access policy.</li></ol>Confirm to resume data copy after the error is resolved. |
|Key vault bad request exception |Applied a customer-managed key, but either the key access wasn’t granted or was revoked, or the key vault was behind a firewall. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Key vault bad request exception**<br>Add the identity selected for your key vault to enable access to the customer-managed key. If the key vault is behind a firewall, switch to a system-assigned identity and then add a customer-managed key. For more information, see how to [Enable the key](data-box-customer-managed-encryption-key-portal.md#enable-key).<br>Confirm to resume data copy after the error is resolved.<br>[Configure Azure Key Vault firewalls and virtual networks](../key-vault/general/network-security.md) |
|Encryption key expired |Couldn’t fetch the passkey as the customer-managed key has expired. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Encryption key expired**<br>Enable the key version and then confirm to resume data copy. |
|Encryption key disabled |Couldn’t fetch the passkey as the customer-managed key is disabled. Resolve the error and resume data copy, or skip to data erasure and complete the order. |**Encryption key disabled**<br>Enable the key version and then confirm to resume data copy. |
|User assigned identity not valid |Couldn’t fetch the passkey as the user assigned identity used was not valid. Resolve the error and resume data copy, or skip to data erasure and complete the order.|**User assigned identity not valid**<br>Applied a customer-managed key but the user assigned identity that has access to the key is not valid.<br>Try adding a different user-assigned identity to your key vault to enable access to the customer-managed key. For more information, see how to [Enable the key](data-box-customer-managed-encryption-key-portal.md#enable-key).<br>Confirm to resume data copy after the error is resolved. |
|User assigned identity not found |Couldn’t fetch the `passkey`, `WrapKey`, and `UnwrapKey` permissions for the identity in the key vault’s access policy. These permissions must remain for the lifetime of the customer-managed key. XXX Resolve the error and resume data copy, or skip to data erasure and complete the order. |**User assigned identity not found**<br>Applied a customer-managed key but the user assigned identity that has access to the key wasn’t found. To resolve the error, check if:<ol><li>Key vault still has the MSI in the access policy.</li><li>Identity is of type `System assigned`.</li><li>Enable `G the order.</li></ol>Confirm to resume data copy after the error is resolved. |
|Unknown user error |An error has halted the data copy. Contact Support for details on how to resolve the error. Alternatively, you may skip to data erasure and review copy and error logs for the order for the list of files that weren’t copied. |**Error during data copy**<br>Data copy is halted due to an error. [Contact Support](data-box-disk-contact-microsoft-support.md) for details on how to resolve the error. After the error is resolved, confirm to resume data copy. |

For more information about the data copy log's contents, see [Tracking and event logging for your Azure Data Box and Azure Data Box Heavy import order](data-box-logs.md).

Other REST API errors might occur during data uploads. For more information, see [Common REST API error codes](/rest/api/storageservices/common-rest-api-error-codes). <!--Final two paragraphs should be shared, after (or before) tabs?-->


# [Non-retryable errors](#tab/non-retryable-errors)

The following non-retryable errors result in a notification:

|Error category                    |Error code |Error message                                                                             |
|----------------------------------|-----------|------------------------------------------------------------------------------------------|
|UploadErrorCloudHttp              |400        |Bad Request (file name not valid) [Learn more](#bad-request-file-name-not-valid).|
|UploadErrorCloudHttp              |400        |The value for one of the HTTP headers is not in the correct format. [Learn more](#the-value-for-one-of-the-http-headers-is-not-in-the-correct-format).|
|UploadErrorCloudHttp              |409        |This operation is not permitted as the blob is immutable due to a policy. [Learn more](#this-operation-is-not-permitted-as-the-blob-is-immutable-due-to-policy).|
|UploadErrorCloudHttp              |409        |The total provisioned capacity of the shares cannot exceed the account maximum size limit. [Learn more](#the-total-provisioned-capacity-of-the-shares-cannot-exceed-the-account-maximum-size-limit).|
|UploadErrorCloudHttp              |409        |The blob type is invalid for this operation. [Learn more](#the-blob-type-is-invalid-for-this-operation).|
|UploadErrorCloudHttp              |409        |There is currently a lease on the blob and no lease ID was specified in the request. [Learn more](#there-is-currently-a-lease-on-the-blob-and-no-lease-id-was-specified-in-the-request).|
|UploadErrorManagedConversionError |409        |The size of the blob being imported is invalid. The blob size is `<blob-size>` bytes. Supported sizes are between 20,971,520 Bytes and 8,192 GiB. [Learn more](#the-size-of-the-blob-being-imported-is-invalid-the-blob-size-is-blob-size-bytes-supported-sizes-are-between-20971520-bytes-and-8192-gib)|

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


### The size of the blob being imported is invalid. The blob size is `<blob-size>` Bytes. Supported sizes are between 20,971,520 Bytes and 8,192 GiB.

**Error category:** UploadErrorManagedConversionError

**Error code:** 409

**Error description:** The listed page blobs failed to upload because they are not a size that can be converted to a Managed Disk. To be converted to a Managed Disk, a page blob must be from 20 MB (20,971,520 Bytes) to 8192 GiB in size.

**Follow-up:** You can't fix this error in the current upload. The upload has completed with errors. Before you do a network transfer or start a new import order, make sure each listed blob is from 20 MB to 8192 GiB in size.

---

## Next steps

- [Review common REST API errors](/rest/api/storageservices/common-rest-api-error-codes).
- [Verify data upload to Azure](data-box-deploy-picked-up.md#verify-data-has-uploaded-to-azure)