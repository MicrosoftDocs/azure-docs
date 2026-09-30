---
title: Soft delete in Azure App Configuration
description: Learn how soft delete helps you recover deleted Azure App Configuration stores.
author: muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.custom:
ms.topic: concept-article
ms.date: 9/1/2026
ai-usage: ai-assisted
---

# Soft delete

Azure App Configuration's soft delete feature allows you to recover data such as key-values, feature flags, and the revision history of a deleted store. It's automatically enabled for all stores in the Standard and Premium tiers. In this article, you learn about the soft delete feature and its functionality.

Learn how to [recover Azure App Configuration stores](./howto-recover-deleted-stores-in-azure-app-configuration.md) using the soft delete feature.

> [!NOTE]
> When an App Configuration store is soft deleted, services that are integrated with the store are deleted. Examples include Azure RBAC role assignments, managed identities, Event Grid subscriptions, and private endpoints. Recovering a soft-deleted App Configuration store doesn't restore these services. You must recreate them.

## Scenarios

The soft delete feature addresses the recovery of the deleted stores, whether the deletion was accidental or intentional. The soft delete feature will act as a safeguard in the following scenarios:

* **Recovery of a deleted App Configuration store**: You can recover a deleted App Configuration store during the retention period.

* **Permanent deletion of an App Configuration store**: You can permanently delete an App Configuration store.

## Recover
Recover returns a store in a soft-deleted state to an active state, where you can use the store for configuration and feature management.

## Retention period
The retention period specifies how long, in days, a soft-deleted store is retained. You can set this value only when you create the store, and you can't change it afterward. When the retention period elapses, the store is permanently deleted automatically.

## Purge
Purge permanently deletes a store in a soft-deleted state, provided the store doesn't have purge protection enabled. To recreate an App Configuration store with the same name as a deleted store, you must purge the deleted store first if its retention period hasn't elapsed.

## Purge protection
When purge protection is enabled, soft-deleted stores can't be purged during the retention period. When purge protection is disabled, a soft-deleted store can be purged before the retention period expires. After you enable purge protection on a store, you can't disable it.

## Permissions to recover a deleted store

- `Microsoft.AppConfiguration/configurationStores/write`

To recover a deleted App Configuration store, you need the `Microsoft.AppConfiguration/configurationStores/write` permission. The built-in [App Configuration Contributor](../role-based-access-control/built-in-roles/integration.md#app-configuration-contributor), [Owner](../role-based-access-control/built-in-roles/privileged.md#owner), and [Contributor](../role-based-access-control/built-in-roles/privileged.md#contributor) roles include this permission by default. Assign the permission at the subscription or resource group scope.

## Permissions to read and purge deleted stores

* Read: `Microsoft.AppConfiguration/locations/deletedConfigurationStores/read`
* Purge: `Microsoft.AppConfiguration/locations/deletedConfigurationStores/purge/action`

To list deleted App Configuration stores or get an individual store by name, you need the `Microsoft.AppConfiguration/locations/deletedConfigurationStores/read` permission. To purge a deleted App Configuration store, you need the `Microsoft.AppConfiguration/locations/deletedConfigurationStores/purge/action` permission. The built-in [App Configuration Contributor](../role-based-access-control/built-in-roles/integration.md#app-configuration-contributor) and [App Configuration Reader](../role-based-access-control/built-in-roles/integration.md#app-configuration-reader) roles contain the permission for reading deleted App Configuration stores but not the permission for purging them. The built-in [Owner](../role-based-access-control/built-in-roles/privileged.md#owner) and [Contributor](../role-based-access-control/built-in-roles/privileged.md#contributor) roles contain both permissions by default. You must assign permissions for reading and purging deleted App Configuration stores at the subscription level because deleted configuration stores exist outside individual resource groups.

## Billing implications

There are no charges for soft-deleted stores. After you recover a soft-deleted store, the usual charges apply. Soft delete isn't available in the Free and Developer tiers.

## Next steps

> [!div class="nextstepaction"]
> [Recover Azure App Configuration stores](./howto-recover-deleted-stores-in-azure-app-configuration.md)  
