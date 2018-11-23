---
title: Azure Resource Manager delete resource group
description: Describes how Azure Resource Manager orders the deletion of resources when a deleting a resource group.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/21/2018
ms.author: tomfitz
---
# Azure Resource Manager resource group deletion

This article describes how Azure Resource Manager orders the deletion of resources when you delete a resource group.

## Determine order of deletion

When you delete a resource group, Resource Manager determines the order to delete resources. It uses the following order:

1. All the child (nested) resources are deleted.

2. Resources that manage other resources are deleted next. A resource can have the `managedBy` property set to indicate that a different resource manages it. When this property is set, the resource that manages the other resource is deleted before the other resources.

3. The remaining resources are deleted after the previous two categories.

## Resource deletion

After the order is determined, Resource Manager issues a DELETE operation for each resource. It waits for any dependencies to finish before proceeding.

For synchronous operations, the expected successful response codes are:

* 200
* 204
* 404

For asynchronous operations, the expected successful response is 202. Resource Manager tracks the location header or the azure-async operation header to determine the status of the asynchronous delete operation.
  
### Errors

When a delete operation returns an error, Resource Manager retries the DELETE call. Retries happen for the 5xx, 429 and 408 status codes. By default, the time period for retry is 15 minutes.

## After deletion

Resource Manager issues a GET call on each resource that it tried to delete. The response of this GET call is expected to be 404. When Resource Manager gets a 404, it considers the deletion to have completed successfully. Resource Manager removes the resource from its cache.

However, if the GET call on the resource returns a 200 or 201, Resource Manager recreates the resource.

### Errors

If the GET operation returns an error, Resource Manager retries the GET for the following error code:

* Less than 100
* 408
* 429
* Greater than 500

For other error codes, Resource Manager fails the deletion of the resource.

## Next steps

* To understand Resource Manager concepts, see [Azure Resource Manager overview](resource-group-overview.md).
* To view the operations for a resource provider, see [Azure REST API](/rest/api/).
