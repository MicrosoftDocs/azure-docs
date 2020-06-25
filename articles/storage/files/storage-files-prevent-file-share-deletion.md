---
title: Prevent accidental deletion - Azure file shares
description: Learn about soft delete for Azure file shares and how you can use it to for data recovery and preventing accidental deletion.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/28/2020
ms.author: rogarana
ms.subservice: files
services: storage
---

# Prevent accidental deletion of Azure file shares

Azure Storage now offers soft delete for file shares (preview). Soft delete allows you to recover your data when it is mistakenly deleted by an application or other storage account user.

## How soft delete (preview) works

When soft delete for Azure file shares is enabled, if a file share is deleted, it transitions to a soft deleted state instead of being permanently erased. You can configure the amount of time soft deleted data is recoverable before it's permanently deleted.

Soft delete can be enabled on either new or existing file shares. Soft delete is also backwards compatible, so you don't have to make any changes to your applications to take advantage of the protections of soft delete. 

To permanently delete a file share in a soft delete state before its expiry time, you must undelete the share, disable soft delete, and then delete the share again. Then you should re-enable soft delete, since any other file shares in that storage account will be vulnerable to accidental deletion while soft delete is off.

For soft-deleted premium file shares, the file share quota (the provisioned size of a file share) is used in the total storage account quota calculation until the soft-deleted share expiry date, when the share is fully deleted.

## Availability

Soft delete for Azure file shares (preview) is available on all storage tiers, all storage account types, and in every region that Azure Files is available in.

## Configuration settings

### Enabling or disabling soft delete

Soft delete for file shares is enabled at the storage account level, because of this, the soft delete settings apply to all file shares within a storage account. You can enable or disable soft delete at any time. When you create a new storage account, soft delete for file shares is disabled by default. Soft delete is also disabled by default for existing storage accounts. If you have configured [Azure file share backup](../../backup/azure-file-share-backup-overview.md) for a Azure file share, then soft delete for Azure file shares will be automatically enabled on that share's storage account.

If you enable soft delete for file shares, delete some file shares, and then disable soft delete, if the shares were saved in that period you can still access and recover those file shares. When you enable soft delete, you also need to configure the retention period.

### Retention period

The retention period is the amount of time that soft deleted file shares are stored and available for recovery. For file shares that are explicitly deleted, the retention period clock starts when the data is deleted. Currently you can specify a retention period between 1 and 365 days. You can change the soft delete retention period at any time. An updated retention period will only apply to shares deleted after the retention period has been updated. Shares deleted before the retention period update will expire based on the retention period that was configured when that data was deleted.

## Pricing and billing

Both standard and premium file shares are billed on the used capacity when soft deleted, rather than provisioned capacity. Additionally, premium file shares are billed at the snapshot rate while in the soft delete state. Standard file shares are billed at the regular rate while in the soft delete state. You won't be charged for data that is permanently deleted after the configured retention period.

For more information on prices for Azure File Storage in general, see the [Azure File Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/files/).

When you initially enable soft delete, we recommend using a small retention period to better understand how the feature affects your bill.

## Next steps

To learn how to enable and use soft delete, continue to [Enable soft delete](storage-files-enable-soft-delete.md).
