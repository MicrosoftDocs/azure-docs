---
title: Azure API Management soft-delete (preview) | Microsoft Docs
description: Soft-delete allows you to recover a recently deleted API Management instance.
ms.service: api-management
ms.topic: conceptual
author: dlepow
ms.author: danlep
ms.date: 02/07/2022
---

# API Management soft-delete (preview)

With API Management soft-delete, you can recover and restore a recently deleted API Management instance. This feature protects against accidental deletion of your API Management instance.

Currently, depending on how you delete an API Management instance, the instance is either soft-deleted and recoverable during a retention period, or it's permanently deleted:

* When you use the Azure portal or REST API version `2020-06-01-preview` or later to delete an API Management instance, it's **soft-deleted**.
* An API Management instance deleted using a REST API version before `2020-06-01-preview` is **permanently deleted**.
* An API Management instance deleted using API Management commands in Azure PowerShell or Azure CLI is **soft-deleted**.

## Supporting interfaces

Recovery and other operations on a soft-deleted instance are enabled through [REST API](/rest/api/apimanagement/current-ga/api-management-service/restore) version `2020-06-01-preview` or later, or the Azure SDK for .NET, Go, or Python.

> [!TIP]
> Refer to [Azure REST API Reference](/rest/api/azure/) for tips and tools for calling Azure REST APIs and [API Management REST](/rest/api/apimanagement/) for additional information specific to API Management.

| Operation | Description | API Management namespace | Minimum API version |
|--|--|--|--|
| [Create or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) | Creates or updates an API Management service.  | API Management Service | Any |
| [Create or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) with `restore` property set to **true** | Recovers (undeletes) an API Management Service if it was previously soft-deleted. If `restore` is specified and set to `true` all other properties will be ignored.  | API Management Service |  2020-06-01-preview |
| [Delete](/rest/api/apimanagement/current-ga/api-management-service/delete) | Deletes an existing API Management service. | API Management Service | 2020-06-01-preview|
| [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) | Get soft-deleted Api Management Service by name. | Deleted Services | 2020-06-01-preview |
| [List By Subscription](/rest/api/apimanagement/current-ga/deleted-services/list-by-subscription) | Lists all soft-deleted services available for undelete for the given subscription. | Deleted Services | 2020-06-01-preview
| [Purge](/rest/api/apimanagement/current-ga/deleted-services/purge) | Purges API Management Service (permanently deletes it with no option to undelete). | Deleted Services | 2020-06-01-preview

## Soft-delete behavior

You can use any API version to create your API Management instance. When you use the Azure portal, Azure REST API, or another Azure tool using API version `2020-06-01-preview` or later to delete an API Management instance, it's automatically soft-deleted. 

Upon soft-deleting an API Management instance, the service will exist in a deleted state, making it inaccessible to normal API Management operations.

In the soft-deleted state: 

* The API Management instance can only be [listed](#list-deleted-api-management-instances), [recovered](#recover-a-soft-deleted-instance), or [purged](#purge-a-soft-deleted-instance) (permanently deleted).
* Azure will schedule the permanent deletion of the underlying data corresponding to the API Management instance after the predetermined (48 hour) retention period. 
* You can't reuse the name of the API Management instance.

If your API Management instance isn't recovered or purged by you within 48 hours, it's automatically deleted permanently. 

## List deleted API Management instances

You can verify that a soft-deleted API Management instance is available to restore (undelete) using either the Deleted Services [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) or [List By Subscription](/rest/api/apimanagement/current-ga/deleted-services/list-by-subscription) operations.

### Get a soft-deleted instance by name

Use the API Management [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) operation, substituting `{subscriptionId}`, `{location}`, and `{serviceName}` with your Azure subscription, [resource location name](/rest/api/resources/subscriptions/list-locations#location), and API Management instance name:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{serviceName}?api-version=2021-08-01
```

If available for undelete, Azure will return a record of the API Management instance showing its `deletionDate` and `scheduledPurgeDate`, for example:

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
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/deletedservices?api-version=2021-08-01
```

This will return a list all soft-deleted services available for undelete under the given subscription, showing the `deletionDate` and `scheduledPurgeDate` for each.

## Recover a soft deleted instance

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

## Purge a soft-deleted instance

Use the API Management [Purge](/rest/api/apimanagement/current-ga/deleted-services/purge) operation, substituting `{subscriptionId}`, `{location}`, and `{serviceName}` with your Azure subscription, resource location, and API Management name.

> [!NOTE]
> To purge a soft-deleted instance, you must have the following RBAC permissions at the subscription scope in addition to Contributor access to the API Management instance: Microsoft.ApiManagement/locations/deletedservices/delete, Microsoft.ApiManagement/deletedservices/read.

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{serviceName}?api-version=2021-08-01
```

This will permanently delete your API Management instance from Azure.

## Reuse an API Management instance name after deletion

You **can** reuse the name of an API Management instance in a new deployment:

* After the instance has been permanently deleted (purged) from Azure.

* In the same subscription as the original instance.

You **can't** reuse the name of an API Management instance in a new deployment:

* While the instance is soft-deleted.

* In a subscription other than the one used to deploy the original instance, even after the original instance has been permanently deleted (purged) from Azure. This restriction applies whether the new subscription used is in the same or a different Azure Active Directory tenant. The restriction is in effect for several days or longer after deletion, depending on the subscription type. 

    This restriction is because Azure reserves the service host name to a customer's tenant for a reservation period to prevent the threat of subdomain takeover with dangling DNS entries. For more information, see [Prevent dangling DNS entries and avoid subdomain takeover](/azure/security/fundamentals/subdomain-takeover). To see all dangling DNS entries for subscriptions in an Azure AD tenant, see [Identify dangling DNS entries](/azure/security/fundamentals/subdomain-takeover#identify-dangling-dns-entries). 


## Next steps

Learn about long-term API Management backup and recovery options:

- [How to implement disaster recovery using service backup and restore in Azure API Management](api-management-howto-disaster-recovery-backup-restore.md)
