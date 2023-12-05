---
title: Prevent accidental deletion - Azure file shares
description: Learn about soft delete for Azure file shares and how you can use it to for data recovery and preventing accidental deletion.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 03/29/2021
ms.author: kendownie
services: storage
---

# Prevent accidental deletion of Azure file shares
Azure Files offers soft delete for SMB file shares. Soft delete allows you to recover your file share when it is mistakenly deleted by an application or other storage account user.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## How soft delete works
When soft delete for Azure file shares is enabled on a storage account, if a file share is deleted, it transitions to a soft deleted state instead of being permanently erased. You can configure the amount of time soft deleted data is recoverable before it's permanently deleted, and undelete the share anytime during this retention period. After being undeleted, the share and all of contents, including snapshots, will be restored to the state it was in prior to deletion. Soft delete only works on a file share level - individual files that are deleted will still be permanently erased.

Soft delete can be enabled on either new or existing file shares. Soft delete is also backwards compatible, so you don't have to make any changes to your applications to take advantage of the protections of soft delete. Soft delete doesn't work for NFS shares, even if it's enabled for the storage account.

To permanently delete a file share in a soft delete state before its expiry time, you must undelete the share, disable soft delete, and then delete the share again. Then you should re-enable soft delete, since any other file shares in that storage account will be vulnerable to accidental deletion while soft delete is off.

For soft-deleted premium file shares, the file share quota (the provisioned size of a file share) is used in the total storage account quota calculation until the soft-deleted share expiry date, when the share is fully deleted.

## Configuration settings

### Enabling or disabling soft delete

Soft delete for file shares is enabled at the storage account level, because of this, the soft delete settings apply to all file shares within a storage account. Soft delete is enabled by default for new storage accounts and can be disabled or enabled at any time. Soft delete is not automatically enabled for existing storage accounts unless [Azure file share backup](../../backup/azure-file-share-backup-overview.md) was configured for a Azure file share in that storage account. If Azure file share backup was configured, then soft delete for Azure file shares are automatically enabled on that share's storage account.

If you enable soft delete for file shares, delete some file shares, and then disable soft delete, if the shares were saved in that period you can still access and recover those file shares. When you enable soft delete, you also need to configure the retention period.

### Retention period

The retention period is the amount of time that soft deleted file shares are stored and available for recovery. For file shares that are explicitly deleted, the retention period clock starts when the data is deleted. Currently you can specify a retention period between 1 and 365 days. You can change the soft delete retention period at any time. An updated retention period will only apply to shares deleted after the retention period has been updated. Shares deleted before the retention period update will expire based on the retention period that was configured when that data was deleted.

## Pricing and billing

Both standard and premium file shares are billed on the used capacity when soft deleted, rather than provisioned capacity. Additionally, premium file shares are billed at the snapshot rate while in the soft delete state. Standard file shares are billed at the regular rate while in the soft delete state. You won't be charged for data that is permanently deleted after the configured retention period.

For more information on prices for Azure Files in general, see the [Azure Files Pricing Page](https://azure.microsoft.com/pricing/details/storage/files/).

When you initially enable soft delete, we recommend using a small retention period to better understand how the feature affects your bill.

## Next steps

To learn how to enable and use soft delete, continue to [Enable soft delete](storage-files-enable-soft-delete.md).

To learn how to prevent a storage account from being deleted or modified, see [Apply an Azure Resource Manager lock to a storage account](../common/lock-account-resource.md).

To learn how to apply locks to resources and resource groups, see [Lock resources to prevent unexpected changes](../../azure-resource-manager/management/lock-resources.md).