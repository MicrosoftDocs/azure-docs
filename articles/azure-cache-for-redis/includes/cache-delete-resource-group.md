---
title: "include file"
description: "include file"
author: flang-msft

ms.service: cache
ms.topic: "include"
ms.date: 08/10/2023
ms.author: franlanglois
ms.custom: "include file"
---

## Clean up resources

If you want to continue to use the resources you created in this article, keep the resource group.

Otherwise, if you're finished with the resources, you can delete the Azure resource group that you created to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible. When you delete a resource group, all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources inside an existing resource group that contains resources you want to keep, you can delete each resource individually instead of deleting the resource group.

### To delete a resource group

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **Resource groups**.

1. Select the resource group you want to delete.

   If there are many resource groups, use the **Filter for any field...** box, type the name of your resource group you created for this article. Select the resource group in the results list.

   :::image type="content" source="media/cache-delete-resource-group/cache-delete-resource-group.png" alt-text="Screenshot showing a list of resource groups to delete in the working pane.":::

1. Select **Delete resource group**.

1. You're asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and then select **Delete**.

   :::image type="content" source="media/cache-delete-resource-group/cache-confirm-deletion.png" alt-text="Screenshot showing a form that requires the resource name to confirm deletion.":::

After a few moments, the resource group and all of its resources are deleted.
