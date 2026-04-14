---
title: Azure API Management Soft-Delete | Microsoft Docs
description: Soft-delete allows you to recover a recently deleted API Management instance.
ms.service: azure-api-management
ms.topic: how-to
author: dlepow
ms.author: danlep
ms.date: 11/26/2025
---

# API Management soft-delete

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

With API Management soft-delete, you can recover and restore a recently deleted API Management instance. This feature protects against accidental deletion of your API Management instance.

## Supporting interfaces

You can recover and perform other operations on a soft-deleted instance through [REST API](/rest/api/apimanagement/current-ga/api-management-service/restore) version `2020-06-01-preview` or later, [Azure CLI](/cli/azure/apim/deletedservice), or the Azure SDK for .NET, Go, or Python.

> [!TIP]
> * For more information about tips and tools for calling Azure REST APIs, see [Azure REST API Reference](/rest/api/azure/). For information specific to API Management, see [API Management REST](/rest/api/apimanagement/).
> * To use the Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli) if you haven't already installed it.

| Operation | Description | API Management namespace | Minimum API version |
|--|--|--|--|
| [Create or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) | Creates or updates an API Management service. | API Management Service | Any |
| [Create or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) with `restore` property set to **true** | Recovers (undeletes) an API Management Service if it was previously soft-deleted. If `restore` is specified and set to `true`, all other properties are ignored. | API Management Service |  2020-06-01-preview |
| [Delete](/rest/api/apimanagement/current-ga/api-management-service/delete) | Deletes an existing API Management service. | API Management Service | 2020-06-01-preview|
| [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) | Get soft-deleted API Management service by name. | Deleted Services | 2020-06-01-preview |
| [List By Subscription](/rest/api/apimanagement/current-ga/deleted-services/list-by-subscription) | Lists all soft-deleted services available for undelete for the given subscription. | Deleted Services | 2020-06-01-preview
| [Purge](/rest/api/apimanagement/current-ga/deleted-services/purge) | Purges API Management Service (permanently deletes it with no option to undelete). | Deleted Services | 2020-06-01-preview

## Soft-delete behavior

You can use any API version to create your API Management instance. When you use the Azure portal, Azure REST API, or another Azure tool with API version `2020-06-01-preview` or later to delete an API Management instance, the instance is automatically soft-deleted. 

When you soft-delete an API Management instance, the service enters a deleted state and becomes inaccessible to normal API Management operations.

In the soft-deleted state: 

- You can only [list](#list-deleted-api-management-instances), [recover](#recover-a-soft-deleted-instance), or [purge](#purge-a-soft-deleted-instance) (permanently delete) the API Management instance.
- Azure schedules the permanent deletion of the underlying data for the API Management instance after the predetermined 48-hour retention period. 
- You can't reuse the name of the API Management instance.

If you don't recover or purge your API Management instance within 48 hours, the instance is permanently deleted. 

## List deleted API Management instances

You can verify that a soft-deleted API Management instance is available to restore by using either the Deleted Services [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) operations or the [List By Subscription](/rest/api/apimanagement/current-ga/deleted-services/list-by-subscription) operation.

### Get a soft-deleted instance by name

# [REST API](#tab/rest)

Use the API Management [Get By Name](/rest/api/apimanagement/current-ga/deleted-services/get-by-name) operation, substituting `{subscriptionId}`, `{location}`, and `{serviceName}` with your Azure subscription, [resource location name](/rest/api/resources/subscriptions/list-locations#location), and API Management instance name:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{serviceName}?api-version=2024-05-01
```

# [Azure CLI](#tab/cli)

Use the [az apim deletedservice show](/cli/azure/apim/deletedservice#az-apim-deletedservice-show) command, substituting `{location}` and `{serviceName}` with your [resource location name](/rest/api/resources/subscriptions/list-locations#location) and API Management instance name:

```azurecli
az apim deletedservice show --location {location} --service-name {serviceName}
```

---

If the API Management instance is available for undelete, Azure returns a record of the instance that shows its `deletionDate` and `scheduledPurgeDate`. For example, the REST API returns output similar to this:

```json
{
    "id": "subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/providers/Microsoft.ApiManagement/locations/southcentralus/deletedservices/apimtest",
    "name": "apimtest",
    "type": "Microsoft.ApiManagement/deletedservices",
    "location": "South Central US",
    "properties": {
        "serviceId": "/subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/resourceGroups/apimtestgroup/providers/Microsoft.ApiManagement/service/apimtest",
        "scheduledPurgeDate": "2024-11-26T19:40:26.3596893Z",
        "deletionDate": "2024-11-24T19:40:50.1013572Z"
    }
}
```

### List all soft-deleted instances for a given subscription

# [REST API](#tab/rest)

Use the API Management [List By Subscription](/rest/api/apimanagement/current-ga/deleted-services/list-by-subscription) operation, substituting `{subscriptionId}` with your subscription ID:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/deletedservices?api-version=2024-05-01
```

# [Azure CLI](#tab/cli)

Use the [az apim deletedservice list](/cli/azure/apim/deletedservice#az-apim-deletedservice-list) command:

```azurecli
az apim deletedservice list
```

---

This command returns a list of all soft-deleted services that you can undelete under the given subscription. It shows the `deletionDate` and `scheduledPurgeDate` for each service.

## Recover a soft-deleted instance

Use the API Management [Create Or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) operation, substituting `{subscriptionId}`, `{resourceGroup}`, and `{apimServiceName}` with your Azure subscription, resource group name, and API Management name:

```rest
PUT
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.ApiManagement/service/{apimServiceName}?api-version=2024-05-01
```

In the request body, set the `restore` property to `true`. (When this flag is specified and set to *true*, all other properties are ignored.) For example:

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

> [!NOTE]
> To purge a soft-deleted instance, you must have the following role-based access control (RBAC) permissions at the subscription scope in addition to Contributor access to the API Management instance: Microsoft.ApiManagement/locations/deletedservices/delete, Microsoft.ApiManagement/deletedservices/read.

# [REST API](#tab/rest)

Use the API Management [Purge](/rest/api/apimanagement/current-ga/deleted-services/purge) operation, substituting `{subscriptionId}`, `{location}`, and `{serviceName}` with your Azure subscription, resource location, and API Management name.

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{serviceName}?api-version=2024-05-01
```

# [Azure CLI](#tab/cli)

Use the [az apim deletedservice purge](/cli/azure/apim/deletedservice#az-apim-deletedservice-purge) command, substituting `{location}` and `{serviceName}` with your resource location and API Management name.

```azurecli
az apim deletedservice purge --location {location} --service-name {serviceName}
```

---

This command permanently deletes your API Management instance from Azure.

## Reuse an API Management instance name after deletion

You **can** reuse the name of an API Management instance in a new deployment:

- After the instance is permanently deleted (purged) from Azure.

- In the same subscription as the original instance.

You **can't** reuse the name of an API Management instance in a new deployment:

- While the instance is soft-deleted.

- In a subscription other than the one used to deploy the original instance, even after the original instance is permanently deleted (purged) from Azure. This restriction applies whether the new subscription is in the same or a different Microsoft Entra tenant. The restriction is in effect for several days or longer after deletion, depending on the subscription type. 

  This restriction exists because Azure reserves the service host name to a customer's tenant for a reservation period to prevent the threat of subdomain takeover with dangling domain name system (DNS) entries. For more information, see [Prevent dangling DNS entries and avoid subdomain takeover](/azure/security/fundamentals/subdomain-takeover). To see all dangling DNS entries for subscriptions in a Microsoft Entra tenant, see [Identify dangling DNS entries](/azure/security/fundamentals/subdomain-takeover#identify-dangling-dns-entries). 


## Related content

Learn about long-term API Management backup and recovery options:

- [How to implement disaster recovery using service backup and restore in Azure API Management](api-management-howto-disaster-recovery-backup-restore.md)
