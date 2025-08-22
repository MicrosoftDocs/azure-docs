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

You can [move](../azure-resource-manager/management/move-resource-group-and-subscription.md) an App Configuration store to a different resource group or subscription by using the Azure Portal or Azure CLI.

### [Azure Portal](#tab/azure-portal)

1. Go to the [Azure portal](https://portal.azure.com/).

1. Navigate to the App Configuration store that you want to move. The overview page should be displayed by default.

1. Select the appropriate **Move** option:
   - **Move to different resource group**: Select **Move** next to the resource group details
   - **Move to different subscription**: Select **Move** next to the subscription details

1. If you are moving the resource to a different subscription, select the destination **Subscription**.

1. Select the destination **Resource group**, or create a new resource group.

1. Select **Next**.

1. When the validation completes, select **Next**.

1. Check the box indicating that the considerations of moving resources are understood.

1. Select **Move**.

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI's [az resource move](/cli/azure/resource#az-resource-move) command to move one or more App Configuration stores to another resource group or subscription. Replace the following placeholders with your own values.

Example:

```azurecli 
az resource move --destination-group <resource-group> --destination-subscription-id <subscription-ID> --ids <"store-resource-ID-1>" <"store-resource-ID-2"> <"store-resource-ID-3">
```

---

## Limitations

App Configuration stores that have private endpoints attached cannot be moved across subscriptions or resource groups.

To move the store, first delete the private endpoints, complete the move, and then recreate the private endpoints. It is important to consider that the [default public network access model](../azure-app-configuration/howto-disable-public-access.md?tabs=azure-portal#disable-public-access-to-a-store) of App Configuration means public network access will be enabled when all private endpoints are removed. This can be avoided by explicitly disabling public network access to the store, however disabling public network access without private endpoints will result in temporary downtime as the store will be inaccessible. It is important to consider whether temporary public exposure of the endpoint, or temporary downtime is acceptable during the move.

## Next steps

> [!div class="nextstepaction"]
> [Enable geo-replication](./howto-geo-replication.md)  
