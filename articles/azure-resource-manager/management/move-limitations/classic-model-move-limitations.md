---
title: Move Azure classic deployment resources
description: Use Azure Resource Manager to move classic deployment resources to a new resource group or subscription.
ms.topic: conceptual
ms.date: 02/11/2025
ms.custom: devx-track-arm-template
---

# Move guidance for classic deployment model resources

The steps to move resources deployed through the classic model differ based on whether you're moving the resources within a subscription or to a new subscription.

## Move in the same subscription

When you move resources from one resource group to another resource group within the same subscription, the following restrictions apply:

- You can't move virtual networks (classic).
- You must move virtual machines (classic) with the cloud service.
- You can only move the cloud service when the move includes all its virtual machines.
- You can only move one cloud service at a time.
- You can only move one storage account (classic) at a time.
- You can't move storage account (classic) in the same operation with a virtual machine or a cloud service.

To move classic resources to a new resource group within the same subscription, use the [standard move operations](../move-resource-group-and-subscription.md) through the portal, Azure PowerShell, Azure CLI, or REST API. Use the same operations as you use for moving Resource Manager resources.

## Move across subscriptions

When you move classic cloud services to a new subscription, the following restrictions apply:

- The source and target subscriptions need to be under the same Microsoft Entra tenant.
- Cloud Service Provider (CSP) subscriptions don't support migrating classic cloud services.
- All classic resources in the subscription must be moved in the same operation.
- The target subscription must not have any other classic resources.
- You can only request the move through a separate REST API for classic moves. The standard Resource Manager move commands don't work when moving classic resources to a new subscription.

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
1. Move all classic resources that pass validation from one subscription to another subscription. Use the following operation:

   ```HTTP
   POST https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.ClassicCompute/moveSubscriptionResources?api-version=2016-04-01
   ```

    In the request body, include:

   ```json
   {
    "target": "/subscriptions/{target-subscription-id}"
   }
   ```

The operation might run for several minutes.

## Possible error messages in the source subscription validation stage

### "Subscription migration for SubscriptionId {subscription ID} cannot continue as IaaS classic to ARM migration is in progress for the following deployment resource: _xx in HostedService {classic-cloud-service-name}_"

This message means there's a classic cloud service that's ongoing migrating to the cloud service (extended support). You should abort this ARM migration operation and then retry validation.

### "Source subscription _{subscription ID}_ is empty"

The source subscription can't be empty, disabled, deleted, or currently undergoing migration. During the migration period, write operations aren't allowed on resources within the subscription.

### "Source subscription contains application(s) which doesn't support migration: _{application name}_"

### "Source subscription contains following cloud service(s) which doesn't support migration: _{cloud service name}_"

You can't migrate the resources mentioned in the error message, so delete these resources before triggering the migration.

### More information

The domain name and the public IP are still the same as before migration. Under normal circumstances, there's no downtime for the cloud service during the migration.

## Next steps

If you have trouble moving classic resources, contact [Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

For commands to move resources, see [Move resources to new resource group or subscription](../move-resource-group-and-subscription.md).
