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

App Configuration's soft delete feature allows recovery of your data such as key-values, feature flags and history of a deleted store. It's automatically enabled for all stores in the standard tier. In this article, learn more about the soft delete feature and its functionality.

To learn how to recover deleted stores using the soft delete feature, access this [doc](./howto-recover-deleted-stores-in-Azure-App-Configuration.md)

> [!NOTE]
> When an App Configuration store is soft-deleted, services that are integrated with the App Configuration will be deleted. For example Azure RBAC roles assignments, managed identity, Event Grid subscriptions, and private endpoints. Recovering a soft-deleted App Configuration store will not restore these services. They will need to be recreated.

## Scenarios

The soft delete feature addresses the recovery of the deleted stores, whether the deletion was accidental or intentional. The soft delete feature will act as a safeguard in the following scenarios:

* **Recovery of a deleted App Configuration store**: A deleted app configuration store could be recovered in the retention time period.

* **Permanent deletion of App Configuration store**: This feature helps you to permanently delete an app configuration store.

## Recover
Recover is the operation to get the stores in a soft deleted state back to an active state where one can request the store for configuration and feature management.

## Retention period
A variable to specify the time period, in days, for which a soft deleted store will be retained. Once set, this value can't be changed. Once the retention period elapses, the store will be permanently deleted automatically.

## Purge
Purge is the operation to permanently delete the stores in a soft deleted state, provided the store doesn't have purge-protection enabled. To recreate the App Configuration store with the same name as a deleted store, you will have to purge the store first if it's not already past the retention period.

## Purge protection
With Purge protection enabled, soft deleted stores can't be purged in the retention period. If disabled, the soft deleted store can be purged before the retention period expires. Once purge protection is enabled on a store, it cannot be disabled.

## Permissions to recover or purge store

A user has to have below permissions to recover or purge a soft-deleted app configuration store. The built-in Contributor and Owner roles already have the required permissions to recover and purge.

- Permission to recover - `Microsoft.AppConfiguration/configurationStores/write`

- Permission to purge - `Microsoft.AppConfiguration/configurationStores/action`

## Billing implications

There won't be any charges for the soft deleted stores. Once you recover a soft deleted store, the usual charges will start applying. Soft delete is not available with free tier.

## Next steps

> [!div class="nextstepaction"]
> [How to recover the deleted App Configuration stores?](./howto-recover-deleted-stores-in-Azure-App-Configuration.md)  
