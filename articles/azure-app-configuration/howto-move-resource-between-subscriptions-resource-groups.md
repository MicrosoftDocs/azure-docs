---
title: Move an Azure App Configuration store to another subscription or resource group
description: Learn how to move an App Configuration store to a different subscription or resource group.
ms.service: azure-app-configuration
author: jimmyca15
ms.author: jimmyca
ms.topic: how-to
ms.date: 08/20/2025

#Customer intent: I want to move my App Configuration store from one subscription or resource group to another. 

---

# Move an App Configuration store to another subscription or resource group

You can [move](../azure-resource-manager/management/move-resource-group-and-subscription.md) an App Configuration store to a different resource group or subscription by using the Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your App Configuration store. The overview page should be displayed by default.

1. Select the appropriate **Move** option:
   - **Move to different resource group**: Select **Move** next to the resource group details
   - **Move to different subscription**: Select **Move** next to the subscription details

1. If moving to a new subscription, select the target **subscription**.

1. Choose the target **resource group** or create a new one.

1. Select **Next**.

1. After validation completes, select **Next** again.

1. Confirm that you understand the implications of moving resources.

1. Select **Move** to complete the process.

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI's [az resource move](/cli/azure/resource#az-resource-move) command to move one or more App Configuration stores to another resource group or subscription. Replace the following placeholders with your own values.

Example:

```azurecli 
az resource move --destination-group <resource-group> --destination-subscription-id <subscription-ID> --ids <"store-resource-ID-1>" <"store-resource-ID-2"> <"store-resource-ID-3">
```

---

## Limitations

App Configuration stores with private endpoints can't be moved across subscriptions or resource groups. To proceed:

1. Delete the private endpoints.

1. Move the store.

1. Recreate the private endpoints.

> [!NOTE]
> When you remove all private endpoints from an App Configuration store, by default, public network access is [enabled](../azure-app-configuration/howto-disable-public-access.md?tabs=azure-portal#disable-public-access-to-a-store). This behavior can be avoided by explicitly disabling public network access to the store. Disabling public network access without private endpoints will result in temporary downtime as the store will be inaccessible. It's important to consider whether temporary public exposure of the endpoint, or temporary downtime is acceptable during the move.

## Next steps

> [!div class="nextstepaction"]
> [Enable geo-replication](./howto-geo-replication.md)  
