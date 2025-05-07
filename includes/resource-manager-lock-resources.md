---
author: mumian
ms.service: azure-resource-manager
ms.topic: include
ms.date: 10/25/2024
ms.author: jgao
---

1. In the Settings blade for the resource, resource group, or subscription that you wish to lock, select **Locks**.

    :::image type="content" source="media/resource-manager-lock-resources/select-lock.png" alt-text="Select lock.":::
   > [!NOTE]  
   > You can't add a lock to management groups.
1. To add a lock, select **Add**. If you want to create a lock at a parent level, select the parent. The currently selected resource inherits the lock from the parent. For example, you could lock the resource group to apply a lock to all its resources.

    :::image type="content" source="media/resource-manager-lock-resources/add-lock.png" alt-text="Add lock.":::

1. Give the lock a name and lock level. Optionally, you can add notes that describe the lock.

    :::image type="content" source="media/resource-manager-lock-resources/set-lock.png" alt-text="Set lock.":::

1. To delete the lock, select the **Delete** button.

    :::image type="content" source="media/resource-manager-lock-resources/delete-lock.png" alt-text="Delete lock.":::
