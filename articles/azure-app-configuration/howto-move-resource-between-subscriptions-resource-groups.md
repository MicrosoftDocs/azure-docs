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

# Move across resource groups or subscriptions

You can move an App Configuration stores to a different resource group or subscription by using the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com/).

1. Navigate to the resource that you want to move.

1. On the subscription or resource group overview page, select **Move**.

1. If you're moving the resource to another subscription, select the destination **Subscription**.

1. If you're moving the resource to another resource group, select the destination **Resource group**, or create a new resource group.

1. Select **Next**.

1. When the validation is completes, select **Next**.

1. Check the box indicating that the considerations of moving resources are understood.

1. Select **Move**.

## Limitations

* App Configuration stores that have private endpoints attached are unable to be moved accross subscriptions and resource groups.

## Next steps

> [!div class="nextstepaction"]
> [Enable geo-replication](./howto-geo-replication.md)  
