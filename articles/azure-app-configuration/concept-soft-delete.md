---
title: Azure App Configuration Soft-Delete Overview
description: Soft-Delete in Azure App Configuration 
author: muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.custom: devx-track-dotnet
ms.topic: conceptual
ms.date: 03/01/2022
---

# Azure App Configuration Soft Delete Overview

App Configuration's soft-delete feature provides a way to recover deleted App Configuration store. With this feature being enabled, App Configuration will maintain the deleted store and its contents in the system for a specified period of time. When creating a new store in Standard tier, it will have Soft delete enabled automatically. Free-tier doesn't have the soft-delete protection, one will need to upgrade to standard tier to automatically enable soft delete feature. Soft delete also has purge protection capability that should be enabled to not let anyone purge the store and its contents during the set retention period.

## Basic concepts

Below are the terms introduced with soft-delete functionality:

* **Soft Delete**: A feature in App Configuration stores to retain the store and its data for a specified time period.
* **Retention period**: A variable to specify the minimum time period in days, for which a soft-deleted store will be retained. The value for retention period could be set between 1-7 days.
* **Purge Protection**: To make sure that a soft-deleted store cannot be deleted permanently in the retention period, one should enable Purge protection. If disabled, the soft deleted store can be purged and deleted permanently before the retention period expires.
* **Recover**: Recover is the operation to get the stores in soft-deleted state back to active state where one can request the store for configuration and feature management.
* **Purge**: Purge is the operation to permanently delete or purge out the stores in soft deleted state provided the store does not have purge-protection enabled.

## Scenarios

The soft-delete feature addresses the recovery of the deleted stores, whether the deletion was accidental or intentional. Soft-delete feature will act as a safeguard in following scenarios:

* **Recovery of a deleted App Configuration store**: A deleted App Configuration store could be recovered in 1-7 days depending upon the retention time period set. One could visit the App Config stores blade, click on Manage deleted stores and recover the stores which are in soft-deleted state. A deleted store will be in soft-deleted state at least for the retention period specified and can be recovered till it is appearing in this list. In the past, the recover operation only worked by calling Microsoft support in the next 7 days from delete operation, now with soft-delete a user could easily do the recovery.

* **Permanent deletion of App Configuration store**: This feature makes the permanent deletion of an App Configuration store a two-step process. To delete an App configuration store permanently one will first have to delete the store which will mark it as "soft-deleted". Then user will have to purge the store to make sure that the item is permanently deleted. Also any deleted store can only be purged if Purge protection is not enabled on that. For the stores that have been deleted with Purge Protection enabled, those can not be purged or permanently deleted till the retention period has passed.Once the store is permanently deleted the same name could be used for another App Configuration store.

Anyone with write/create access for App Configuration stores will be able to delete, recover or purge the store. Hence a contributor role will be able to get you the required permissions.

## Prerequisites for Soft Delete feature

* **Standard Tier**: Soft delete is only enabled for stores in standard tier. Free tier stores will show the soft delete as disabled and the only way to enable it by upgrading to standard tier.

* **Create/Write permission on the App Configuration Store**: A user has to have the write/create permissions to be able to edit the purge protection property, recover or purge the store. the built-in Contributor or Owner role will work perfectly to give one access to the operations related to soft-delete.

## Supporting Interfaces

At present, the soft-delete feature is available through the [REST API](https://docs.microsoft.com/rest/api/appconfiguration/configuration-stores), *.NET/Java Config Providers, App Config SDKs(TODO)* as well as ARM templates.

## Billing implications

As one will not be able to send any requests to App Configuration stores in soft-deleted state, there will not be any charges for these type of stores. Once you recover a soft-deleted store it is back to the active state and usual charges will start applying.

## Next steps

> [!div class="nextstepaction"]
> [How to recover the deleted App Configuration stores?](./howto-recover-deleted-stores-in-Azure-App-Configuration.md)  
