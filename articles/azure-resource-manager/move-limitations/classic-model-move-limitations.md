---
title: Move Azure Classic deployment resources to new subscription or resource group
description: Use Azure Resource Manager to move Classic deployment resources to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: tomfitz
---

# Move guidance for Classic deployment model resources

The steps to move resources deployed through the classic model differ based on whether you're moving the resources within a subscription or to a new subscription.

## Move in the same subscription

When moving resources from one resource group to another resource group within the same subscription, the following restrictions apply:

* Virtual networks (classic) can't be moved.
* Virtual machines (classic) must be moved with the cloud service.
* Cloud service can only be moved when the move includes all its virtual machines.
* Only one cloud service can be moved at a time.
* Only one storage account (classic) can be moved at a time.
* Storage account (classic) can't be moved in the same operation with a virtual machine or a cloud service.

To move classic resources to a new resource group within the same subscription, use the [standard move operations](../resource-group-move-resources.md) through the portal, Azure PowerShell, Azure CLI, or REST API. You use the same operations as you use for moving Resource Manager resources.

## Move across subscriptions

When moving resources to a new subscription, the following restrictions apply:

* All classic resources in the subscription must be moved in the same operation.
* The target subscription must not have any other classic resources.
* The move can only be requested through a separate REST API for classic moves. The standard Resource Manager move commands don't work when moving classic resources to a new subscription.

To move classic resources to a new subscription, use the REST operations that are specific to classic resources. To use REST, do the following steps:

1. Check if the source subscription can participate in a cross-subscription move. Use the following operation:

   ```HTTP
   POST https://management.azure.com/subscriptions/{sourceSubscriptionId}/providers/Microsoft.ClassicCompute/validateSubscriptionMoveAvailability?api-version=2016-04-01
   ```

     In the request body, include:

   ```json
   {
    "role": "source"
   }
   ```

     The response for the validation operation is in the following format:

   ```json
   {
    "status": "{status}",
    "reasons": [
      "reason1",
      "reason2"
    ]
   }
   ```

1. Check if the destination subscription can participate in a cross-subscription move. Use the following operation:

   ```HTTP
   POST https://management.azure.com/subscriptions/{destinationSubscriptionId}/providers/Microsoft.ClassicCompute/validateSubscriptionMoveAvailability?api-version=2016-04-01
   ```

     In the request body, include:

   ```json
   {
    "role": "target"
   }
   ```

     The response is in the same format as the source subscription validation.
1. If both subscriptions pass validation, move all classic resources from one subscription to another subscription with the following operation:

   ```HTTP
   POST https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.ClassicCompute/moveSubscriptionResources?api-version=2016-04-01
   ```

    In the request body, include:

   ```json
   {
    "target": "/subscriptions/{target-subscription-id}"
   }
   ```

The operation may run for several minutes.

## Next steps

If you have trouble moving classic resources, contact [Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

For commands to move resources, see [Move resources to new resource group or subscription](../resource-group-move-resources.md).
