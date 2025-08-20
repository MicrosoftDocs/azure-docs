---
ms.date: 05/18/2025
ms.topic: include
ms.custom:
  - build-2025
---

## Clean up resources

If you plan to continue with the next tutorial, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually instead of deleting the resource group.

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

1. In the **Filter by name** textbox, type the name of your resource group. The instructions for this article used a resource group named `TestResources`. On your resource group in the result list, select **Test Resources** then **Delete resource group**.

   :::image type="content" source="../media/java-redisson-get-started/redis-cache-delete-resource-group.png" alt-text="Screenshot of the Azure portal that shows the Resource group page with the Delete resource group button highlighted." lightbox="../media/java-redisson-get-started/redis-cache-delete-resource-group.png":::

1. Type the name of your resource group to confirm deletion and then select **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.
