---
title: API Management soft-delete (preview) | Microsoft Docs
description: Soft-delete allows you to recover deleted API Management instances.
ms.service: api-management
ms.topic: conceptual
author: vladvino
ms.author: apimpm
ms.date: 11/11/2020
---

# API Management soft-delete (preview)

With API Management soft-delete (preview), you can recover and restore recently deleted API Management (APIM) instances.

> [!IMPORTANT]
> Only API Management instances deleted using `2020-01-01-preview` and later API versions will be soft-deleted and recoverable using the steps described in this article. APIM instances deleted using older API versions will continue to be hard deleted.

## Supporting interfaces

The soft-delete feature is available through [REST API](/rest/api/apimanagement/2020-06-01/apimanagementservice/restore) and [ARM template](/azure/templates/microsoft.apimanagement/2020-06-01-preview/service).

## Soft-delete behavior

Upon deleting an API Management instance, the service will exist in a deleted state, making it inaccessible to any APIM  operations. While in this state, the APIM instance can only be listed and/or recovered.

At the same time, Azure will schedule the deletion of the underlying data corresponding to APIM instance for execution after the predetermined (48 hour) retention interval. The DNS record corresponding to the instance is also retained for the duration of the retention interval.

You cannot reuse the name of an API Management instance that has been soft-deleted until the retention period has passed.

## API Management instance recovery

You can use any API version to create your API Management instance, however you'll need to use `2020-01-01-preview` or later versions to soft-delete your APIM instance (and have the option to recover it).

Once an API Management instance is deleted, it will remain recoverable for a 48-hour period. During the retention period, you can list and restore the deleted instance, essentially undoing the delete operation.

If your APIM instance is not recovered within 48 hours, it will be hard deleted (unrecoverable).

### List deleted APIM instances

Use the API Management [List](/rest/api/apimanagement/2020-06-01/apimanagementservice/list) operation, substituting `{subscriptionId}` with your Azure subscription ID to view all the API Management instances within your current Azure subscription:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ApiManagement/service?api-version=2020-06-01-preview
```

The `provisioningState` of any newly deleted (within the past 48-hour) APIM instances will report as *Deleted*.

### Recover a deleted APIM instance

Use the API Management [Create Or Update](/rest/api/apimanagement/2020-06-01/apimanagementservice/createorupdate) operation, substituting `{subscriptionId}`, `{resourceGroup}`, and `{apimServiceName}` with your Azure subscription, resource group name, and API Management name:

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.ApiManagement/service/{apimServiceName}?api-version=2020-06-01-preview
```

. . . and set the `restore` property to `true` in the request body. (When this flag is specified and set to *true*, all other properties will be ignored.) For example:

```json
{
  "properties": {
    "publisherEmail": "foo@contoso.com",
    "publisherName": "foo",
    "restore": true
  },
  "sku": {
    "name": "Developer",
    "capacity": 1
  },
  "location": "South Central US"
}
```

## Next steps

Learn about long-term API Management backup and recovery options:

- [How to implement disaster recovery using service backup and restore in Azure API Management](api-management-howto-disaster-recovery-backup-restore.md)