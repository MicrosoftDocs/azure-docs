---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: azure-resource-manager
 ms.topic: include
 ms.date: 03/19/2020
 ms.author: tomfitz
 ms.custom: include file
---

If a user doesn't have the required access for applying tags, you can assign the **Tag Contributor** role to the user. For more information, see [Tutorial: Grant a user access to Azure resources using RBAC and the Azure portal](../articles/role-based-access-control/quickstart-assign-role-user-portal.md).

1. To view the tags for a resource or a resource group, look for existing tags in the overview. If you have not previously applied tags, the list is empty.

   ![View tags for resource or resource group](./media/resource-manager-tag-resources/view-tags.png)

1. To add a tag, select **Click here to add tags**.

1. Provide a name and value.

   ![Add tag](./media/resource-manager-tag-resources/add-tag.png)

1. Continue adding tags as needed. When done, select **Save**.

   ![Save tags](./media/resource-manager-tag-resources/save-tags.png)

1. The tags are now displayed in the overview.

   ![Show tags](./media/resource-manager-tag-resources/view-new-tags.png)

1. To add or delete a tag, select **change**.

1. To delete a tag, select the trash icon. Then, select **Save**.

   ![Delete tag](./media/resource-manager-tag-resources/delete-tag.png)

To bulk assign tags to multiple resources:

1. From any list of resources, select the checkbox for the resources you want to assign the tag. Then, select **Assign tags**.

   ![Select multiple resources](./media/resource-manager-tag-resources/select-multiple-resources.png)

1. Add names and values. When done, select **Save**.

   ![Select assign](./media/resource-manager-tag-resources/select-assign.png)

To view all resources with a tag:

1. On the Azure portal menu, search for **tags**. Select it from the available options.

   ![Find by tag](./media/resource-manager-tag-resources/find-tags-general.png)

1. Select the tag for viewing resources.

   ![Select tag](./media/resource-manager-tag-resources/select-tag.png)

1. All resources with that tag are displayed.

   ![View resources by tag](./media/resource-manager-tag-resources/view-resources-by-tag.png)
