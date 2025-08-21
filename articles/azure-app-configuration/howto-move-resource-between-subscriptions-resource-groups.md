---
title: Move an App Configuration store to another subscription or resource group
description: Learn how to move an App Configuration store to a different subscription or resource group.
ms.service: azure-app-configuration
author: jimmyca15
ms.author: jimmyca
ms.topic: how-to
ms.date: 08/20/2025

#Customer intent: I want to move my App Configuration store from one subscription or resource group to another. 

---

# Move an App Configuration store to another subscription or resource group

You can [move](https://learn.microsoft.com/azure/azure-resource-manager/management/move-resource-group-and-subscription) an App Configuration store to a different resource group or subscription by using the Azure Portal or Azure CLI.

### [Azure CLI](#tab/azure-portal)

1. Go to the [Azure portal](https://portal.azure.com/).

1. Navigate to the App Configuration store that you want to move. The overview page should be displayed by default.

1. If you are moving to a new resource group, select **Move** next to the resource group details. If you are moving to a new subscription, select **Move** next to the subscription details.

1. If you are moving the resource to another subscription, select the destination **Subscription**.

1. Select the destination **Resource group**, or create a new resource group.

1. Select **Next**.

1. When the validation is completes, select **Next**.

1. Check the box indicating that the considerations of moving resources are understood.

1. Select **Move**.

### [Azure CLI](#tab/azure-cli)

The Azure CLI's `az resource move` [command](https://learn.microsoft.com/cli/azure/resource?view=azure-cli-latest#az-resource-move) can be used to perform the move.

Example:

```
az resource move --destination-group ResourceGroup --destination-subscription-id SubscriptionId --ids "ResourceId1" "ResourceId2" "ResourceId3"
```

## Limitations

* App Configuration stores that have private endpoints attached are unable to be moved across subscriptions and resource groups. To move the store, first delete the private endpoints, complete the move, and then recreate the private endpoints. It is important to consider that by default when removing all private endpoints, public network access for the store will be enabled. This can be avoided by explicitly disabling public network access to the store, however disabling public network access without private endpoints will result in temporary downtime as the store will be inaccessible. It is important to consider whether temporary public exposure of the endpoint, or temporary downtime is acceptable during the move.

## Next steps

> [!div class="nextstepaction"]
> [Enable geo-replication](./howto-geo-replication.md)  
