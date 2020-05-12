---
title: Recover deleted Azure file shares
description: Enable soft delete on Azure file shares to enable data recovery and prevent accidental deletion.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/12/2020
ms.author: rogarana
ms.subservice: files
services: storage
---

# How to prevent accidental deletion of Azure file shares

Azure Storage now offers soft delete for file shares so that you can more easily recover your data when it is mistakenly deleted by an application or other storage account user.

## How soft delete works

When enabled, soft delete enables you to save and recover your file shares when they are deleted.

When data is deleted, it transitions to a soft deleted state instead of being permanently erased. You can configure the amount of time soft deleted data is recoverable before it is permanently expired.

Soft delete is backwards compatible, so you don't have to make any changes to your applications to take advantage of the protections this feature affords. 

You can enable soft delete on your existing file shares.

## Configuration settings

Soft delete for file shares is enabled at the storage account level, the soft delete settings apply to all file shares within a storage account. When you create a new storage account, soft delete is off by default. Soft delete is also off by default for existing storage accounts. You can toggle the feature on and off at any time during the life of a storage account.

If you enable soft delete for file shares, delete some file shares, and then disable soft delete, you will still be able to access and recover those file shares, if those shares were saved when soft delete was enabled. When you turn on soft delete, you also need to configure the retention period.

The retention period indicates the amount of time that soft deleted file shares are stored and available for recovery. For file shares that are explicitly deleted, the retention period clock starts when the data is deleted. Currently you can retain soft deleted shares for between 1 and 365 days.

You can change the soft delete retention period at any time. An updated retention period will only apply to shares deleted after the retention period has been updated. Shares deleted prior to the retention period update will expire based on the retention period that was configured when that data was deleted.

To permanently delete a file share that is in a soft delete state prior to its expiry time, you must undelete the share, disable soft delete, and then delete the share again. Then you should reenable soft delete, since any other file shares in that storage account will be vulnerable to accidental deletion while soft delete is off.

## Pricing and billing

Both standard and premium file shares are billed on the used capacity when soft deleted, rather than provisioned capacity. Additionally, premium file shares are billed at the snapshot rate while in the soft delete state. Standard file shares are billed at the regular rate while in the soft delete state. You will not be charged for data that is permanently deleted after the configured retention period. 

For more details on prices for Azure File Storage in general, check out the [Azure File Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/files/).

When you initially turn on soft delete, we recommend using a small retention period to better understand how the feature affects your bill.

## Next steps

To learn how to enable and use soft delete, proceed to [Enable soft delete](storage-files-enable-soft-delete.md)