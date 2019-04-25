---
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: include
ms.date: 11/25/2018
ms.author: tomfitz
---
1. In the Settings blade for the resource, resource group, or subscription that you wish to lock, select **Locks**.
   
      ![select lock](./media/resource-manager-lock-resources/select-lock.png)
2. To add a lock, select **Add**. If you want to create a lock at a parent level, select the parent. The currently selected resource inherits the lock from the parent. For example, you could lock the resource group to apply a lock to all its resources.
   
      ![add lock](./media/resource-manager-lock-resources/add-lock.png) 
3. Give the lock a name and lock level. Optionally, you can add notes that describe the lock.
   
      ![set lock](./media/resource-manager-lock-resources/set-lock.png) 
4. To delete the lock, select the ellipsis and **Delete** from the available options.
   
      ![delete lock](./media/resource-manager-lock-resources/delete-lock.png) 

