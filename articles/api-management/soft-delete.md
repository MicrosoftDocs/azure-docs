---
title: Azure API Management soft-delete (preview) | Microsoft Docs
description: Soft-delete allows you to recover deleted API Management instances.
ms.service: api-management
ms.topic: conceptual
author: vladvino
ms.author: apimpm
ms.date: 11/27/2020
---

# API Management soft-delete (preview)

With API Management soft-delete (preview), you can recover and restore recently deleted API Management (APIM) instances.

> [!IMPORTANT]
> Only API Management instances deleted using `2020-06-01-preview` and later API versions will be soft-deleted and recoverable using the steps described in this article. APIM instances deleted using previous API versions will continue to be hard-deleted. Azure PowerShell and Azure CLI currently do not use the `2020-06-01-preview` version and will also result in hard-delete behavior.

## Supporting interfaces

The soft-delete feature is available through [REST API](/rest/api/apimanagement/2020-06-01-preview/apimanagementservice/restore).

> [!TIP]
> Refer to [Azure REST API Reference](/rest/api/azure/) for tips and tools for calling Azure REST APIs.

| Operation | Description | API Management namespace | Minimum API version |
|--|--|--|--|
| [Create or Update](/rest/api/apimanagement/2020-06-01-preview/apimanagementservice/createorupdate) | Creates or updates an API Management service.  | API Management Service | Any |
| [Create or Update](/rest/api/apimanagement/2020-06-01-preview/apimanagementservice/createorupdate) with `restore` property set to **true** | Undeletes API Management Service if it was previously soft-deleted. If `restore` is specified and set to `true` all other properties will be ignored.  | API Management Service |  2020-06-01-preview |
| [Delete](/rest/api/apimanagement/2020-06-01-preview/apimanagementservice/delete) | Deletes an existing API Management service. | API Management Service | 2020-06-01-preview|
| [Get By Name](/rest/api/apimanagement/2020-06-01-preview/deletedservices/getbyname) | Get soft-deleted Api Management Service by name. | Deleted Services | 2020-06-01-preview |
| [List By Subscription](/rest/api/apimanagement/2020-06-01-preview/deletedservices/listbysubscription) | Lists all soft-deleted services available for undelete for the given subscription. | Deleted Services | 2020-06-01-preview
| [Purge](/rest/api/apimanagement/2020-06-01-preview/deletedservices/purge) | Purges API Management Service (deletes it with no option to undelete). | Deleted Services | 2020-06-01-preview

## Soft-delete behavior

You can use any API version to create your API Management instance, however you'll need to use `2020-06-01-preview` or later versions to soft-delete your APIM instance (and have the option to recover it).

Upon deleting an API Management instance, the service will exist in a deleted state, making it inaccessible to any APIM  operations. While in this state, the APIM instance can only be listed, recovered, or purged (permanently deleted).

At the same time, Azure will schedule the deletion of the underlying data corresponding to APIM instance for execution after the predetermined (48 hour) retention interval. The DNS record corresponding to the instance is also retained for the duration of the retention interval. You cannot reuse the name of an API Management instance that has been soft-deleted until the retention period has passed.

If your APIM instance is not recovered within 48 hours, it will be hard deleted (unrecoverable). You can also choose to [purge](#purge-a-soft-deleted-apim-instance) (permanently delete) your APIM instance, forgoing soft-delete retention period.

## List deleted APIM instances

You can verify that a soft-deleted APIM instance is available to restore (undelete) using either the Deleted Services [Get By Name](/rest/api/apimanagement/2020-06-01-preview/deletedservices/getbyname) or [List By Subscription](/rest/api/apimanagement/2020-06-01-preview/deletedservices/listbysubscription) operations.

### Get a soft-deleted instance by name

Use the API Management [Get By Name](/rest/api/apimanagement/2020-06-01-preview/deletedservices/getbyname) operation, substituting `{subscriptionId}`, `{location}`, and `{serviceName}` with your Azure subscription, resource location, and API Management instance name:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{serviceName}?api-version=2020-06-01-preview
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
        "scheduledPurgeDate": "2020-11-26T19:40:26.3596893Z",
        "deletionDate": "2020-11-24T19:40:50.1013572Z"
    }
}
```

### List all soft-deleted instances for a given subscription

Use the API Management [List By Subscription](/rest/api/apimanagement/2020-06-01-preview/deletedservices/listbysubscription) operation, substituting `{subscriptionId}` with your subscription ID:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/deletedservices?api-version=2020-06-01-preview
```

This will return a list all soft-deleted services available for undelete under the given subscription, showing the `deletionDate` and `scheduledPurgeDate` for each.

## Recover a deleted APIM instance

Use the API Management [Create Or Update](/rest/api/apimanagement/2020-06-01-preview/apimanagementservice/createorupdate) operation, substituting `{subscriptionId}`, `{resourceGroup}`, and `{apimServiceName}` with your Azure subscription, resource group name, and API Management name:

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.ApiManagement/service/{apimServiceName}?api-version=2020-06-01-preview
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

Use the API Management [Purge](/rest/api/apimanagement/2020-06-01-preview/deletedservices/purge) operation, substituting `{subscriptionId}`, `{location}`, and `{serviceName}` with your Azure subscription, resource location, and API Management name:

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{serviceName}?api-version=2020-06-01-preview
```

This will permanently delete your API Management instance from Azure.

## Next steps

Learn about long-term API Management backup and recovery options:

- [How to implement disaster recovery using service backup and restore in Azure API Management](api-management-howto-disaster-recovery-backup-restore.md)