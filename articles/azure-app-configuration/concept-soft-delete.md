---
title: Soft Delete
description: Soft-Delete in Azure App Configuration 
author: muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.custom: devx-track-dotnet
ms.topic: conceptual
ms.date: 03/01/2022
---

# Soft Delete

App Configuration's soft delete feature provides a way to soft-delete, recover, purge, and purge-protect your App Configuration store(s). This feature is automatically enabled for all stores in the standard tier. In this article, learn more about the soft delete feature and its functionality.

To learn how to recover deleted stores using the soft delete feature, access this [doc] (./howto-recover-deleted-stores-in-Azure-App-Configuration.md)

## Basic concepts

Below are the terms introduced with the soft delete functionality:

* **Soft delete**: A feature in App Configuration service to retain a deleted store and its contents, for a specified time period.
* **Retention period**: A variable to specify the minimum time period, in days, for which a soft deleted store will be retained. Once set, this value can't be changed.
* **Purge protection**: With Purge protection enabled, soft deleted stores can't be deleted permanently in the retention period. If disabled, the soft deleted store can be purged and deleted permanently before the retention period expires.
* **Recover**: Recover is the operation to get the stores in a soft deleted state back to an active state where one can request the store for configuration and feature management.
* **Purge**: Purge is the operation to permanently delete or purge out the stores in a soft deleted state, provided the store doesn't have purge-protection enabled.

## Understanding Soft delete and Purge protection

Soft delete and Purge protection are two recovery features in Azure App Configuration service.

**Soft delete** is designed to prevent accidental deletion of your App Configuration Store and its contents. Soft delete is similar to a recycle bin on Computer. When you delete an app configuration store, it will remain recoverable for a user configurable retention period. Stores in the soft deleted state can also be **purged** that is, permanently deleted. This allows you to recreate the App Configuration store with the same name. **Soft delete is automatically enabled for the App Configuration store created in the standard tier**. One can select the value for the days to retain. Soft Delete isn't available for free tier stores, and the only way to get it, is to upgrade to the standard tier.

**Purge protection** when enabled is designed to prevent the permanent deletion of your App Configuration store during the retention period. It's same as a recycle bin with a time based policy. You can recover items at any point during the configurable retention period. **With purge protection enabled, you'll not be able to permanently delete or purge an App Configuration store until the retention period expires.** Once the retention period elapses, the store will be purged automatically.

> [!NOTE]
> Purge protection is designed so that no administrator role or permission can override, disable, or circumvent Purge protection. **Once purge protection is enabled, it cannot be disabled or overridden by anyone, including Microsoft.** This means you'll be able to recover a deleted app configuration store or wait for the retention period to expire.

## Scenarios

The soft delete feature addresses the recovery of the deleted stores, whether the deletion was accidental or intentional. The soft delete feature will act as a safeguard in the following scenarios:

* **Recovery of a deleted App Configuration store**: A deleted app configuration store could be recovered in the retention time period. In the App Config stores list, click on Manage deleted stores to recover the stores that are in a soft deleted state. A deleted store will be recoverable for the configured retention period. For detailed instructions, access this [doc] (./howto-recover-deleted-stores-in-Azure-App-Configuration.md)

* **Permanent deletion of App Configuration store**:This feature makes the permanent deletion of an app configuration store a two-step process. To permanently delete an app configuration store, one will first have to delete the store, which will mark it as "soft deleted." Then you will have to purge the store to make sure that the item is permanently deleted. Also, any deleted store can only be purged if purge protection isn't enabled on that store. The stores that have been deleted with purge protection enabled, cannot be purged or permanently deleted until the retention period has passed. Once the store is permanently deleted, the same name could be used for another app configuration store.

Anyone with write/create access to App Configuration stores will be able to delete, recover, or purge the store. Hence, a contributor role will be able to get you the required permissions.

## Prerequisites for soft delete

* **Standard Tier**: Soft delete is only enabled for stores in the standard tier. Free tier stores will show the soft delete as disabled, and the only way to enable it is by upgrading to the standard tier.

* **Create/Write permission on the App Configuration Store**: A user has to have the write/create permissions to be able to edit the purge protection property, recover or purge the store. The built-in Contributor or Owner role will work perfectly to give one access to the operations related to soft delete.

## Billing implications

There won't be any charges for the soft deleted stores. Once you recover a soft deleted store, it's back to the active state and the usual charges will start applying.

## Next steps

> [!div class="nextstepaction"]
> [How to recover the deleted App Configuration stores?](./howto-recover-deleted-stores-in-Azure-App-Configuration.md)  
