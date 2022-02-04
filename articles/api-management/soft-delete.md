---
title: Azure API Management soft-delete (preview) | Microsoft Docs
description: Soft-delete allows you to recover a recently deleted API Management instance.
ms.service: api-management
ms.topic: conceptual
author: dlepow
ms.author: danlep
ms.date: 02/03/2022
---

# API Management soft-delete (preview)

With API Management soft-delete, you can recover and restore a recently deleted API Management instance.

> [!IMPORTANT]
> Currently, when you use the Azure portal, Azure PowerShell, Azure CLI, or another Azure tool using API version `2020-06-01-preview` or later to delete an API Management instance, it is automatically soft-deleted. There isn't an option to hard-delete an instance using those tools.
> Recovering a soft-deleted instance currently requires the REST API (version `2020-06-01-preview` or later) or the Azure SDK for .NET, Go, or Python.
> Unless you recover or purge a soft-deleted instance within 48 hours, it's automatically hard-deleted and becomes unrecoverable.

## Supporting interfaces

The soft-delete feature is enabled through [REST API](/rest/api/apimanagement/current-ga/api-management-service/restore) version `2020-06-01-preview` or later .

> [!TIP]
> Refer to [Azure REST API Reference](/rest/api/azure/) for tips and tools for calling Azure REST APIs.

| Operation | Description | API Management namespace | Minimum API version |
|--|--|--|--|
| [Create or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) | Creates or updates an API Management service.  | API Management Service | Any |
| [Create or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) with `restore` property set to **true** | Recovers (undeletes) an API Management Service if it was previously soft-deleted. If `restore` is specified and set to `true` all other properties will be ignored.  | API Management Service |  2020-06-01-preview |
| [Delete](/rest/api/apimanagement/current-ga/api-management-service/delete) | Deletes an existing API Management service. | API Management Service | 2020-06-01-preview|
| [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) | Get soft-deleted Api Management Service by name. | Deleted Services | 2020-06-01-preview |
| [List By Subscription](/rest/api/apimanagement/current-ga/deleted-services/list-by-subscription) | Lists all soft-deleted services available for undelete for the given subscription. | Deleted Services | 2020-06-01-preview
| [Purge](/rest/api/apimanagement/current-ga/deleted-services/purge) | Purges API Management Service (deletes it with no option to undelete). | Deleted Services | 2020-06-01-preview

## Soft-delete behavior

You can use any API version to create your API Management instance. When you use the Azure portal, Azure PowerShell, Azure CLI, or another Azure tool using API version `2020-06-01-preview` or later to delete an API Management instance, it is automatically soft-deleted. 

Upon soft-deleting an API Management instance, the service will exist in a deleted state, making it inaccessible to any API Management operations. 

* While in this state, the API Management instance can only be listed, recovered, or purged (permanently deleted).
* Azure will schedule the hard-deletion of the underlying data corresponding to the API Management instance after the predetermined (48 hour) retention interval. 
* The DNS record corresponding to the instance is retained for the duration of the retention interval. 
* You can't reuse the name of an API Management instance that has been soft-deleted until the retention period has passed.

If your API Management instance isn't recovered within 48 hours, it is hard deleted (unrecoverable). You can also choose to [purge](#purge-a-soft-deleted-apim-instance) (permanently delete) your API Management instance, forgoing the soft-delete retention period.

## List deleted API Management instances

You can verify that a soft-deleted APIM instance is available to restore (undelete) using either the Deleted Services [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) or [List By Subscription](/rest/api/apimanagement/current-ga/deleted-services/list-by-subscription) operations.

### Get a soft-deleted instance by name

Use the API Management [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) operation, substituting `{subscriptionId}`, `{location}`, and `{serviceName}` with your Azure subscription, resource location, and API Management instance name:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{serviceName}?api-version=2021-08-01-preview
```

If available for undelete, Azure will return a record of the APIM instance showing its `deletionDate` and `scheduledPurgeDate`, for example:

```json
{
    "id": "subscriptions/########-####-####-####-############/providers/Microsoft.ApiManagement/locations/southcentralus/deletedservices/apimtest",
    "name": "apimtest",
    "type": "Microsoft.ApiManagement/deletedservices",
    "location": "South Central US",
    "properties": {
        "serviceId": "/subscriptions/########-####-####-####-############/resourceGroups/apimtestgroup/providers/Microsoft.ApiManagement/service/apimtest",
        "scheduledPurgeDate": "2021-11-26T19:40:26.3596893Z",
        "deletionDate": "2021-11-24T19:40:50.1013572Z"
    }
}
```

### List all soft-deleted instances for a given subscription

Use the API Management [List By Subscription](/rest/api/apimanagement/current-ga/deleted-services/list-by-subscription) operation, substituting `{subscriptionId}` with your subscription ID:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/deletedservices?api-version=2021-08-01-preview
```

This will return a list all soft-deleted services available for undelete under the given subscription, showing the `deletionDate` and `scheduledPurgeDate` for each.

## Recover a deleted APIM instance

Use the API Management [Create Or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) operation, substituting `{subscriptionId}`, `{resourceGroup}`, and `{apimServiceName}` with your Azure subscription, resource group name, and API Management name:

```rest
PUT
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.ApiManagement/service/{apimServiceName}?api-version=2021-08-01
```

. . . and set the `restore` property to `true` in the request body. (When this flag is specified and set to *true*, all other properties will be ignored.) For example:

```json
{
  "properties": {
    "publisherEmail": "help@contoso.com",
    "publisherName": "Contoso",
    "restore": true
  },
  "sku": {
    "name": "Developer",
    "capacity": 1
  },
  "location": "South Central US"
}
```

## Purge a soft-deleted APIM instance

Use the API Management [Purge](/rest/api/apimanagement/current-ga/deleted-services/purge) operation, substituting `{subscriptionId}`, `{location}`, and `{serviceName}` with your Azure subscription, resource location, and API Management name:

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{serviceName}?api-version=2021-08-01-preview
```

This will permanently delete your API Management instance from Azure.

## Next steps

Learn about long-term API Management backup and recovery options:

- [How to implement disaster recovery using service backup and restore in Azure API Management](api-management-howto-disaster-recovery-backup-restore.md)
