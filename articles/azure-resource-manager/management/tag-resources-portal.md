---
title: Tag resources, resource groups, and subscriptions with Azure portal
description: Shows how to use Azure portal to apply tags to Azure resources.
ms.topic: conceptual
ms.date: 04/19/2023
---

# Apply tags with Azure portal

This article describes how to use the Azure portal to tag resources. For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).

## Add tags

If a user doesn't have the required access for adding tags, you can assign the **Tag Contributor** role to the user. For more information, see [Tutorial: Grant a user access to Azure resources using RBAC and the Azure portal](../../role-based-access-control/quickstart-assign-role-user-portal.md).

1. To view the tags for a resource or a resource group, look for existing tags in the overview. If you have not previously applied tags, the list is empty.

   ![View tags for resource or resource group](./media/tag-resources-portal/view-tags.png)

1. To add a tag, select **Click here to add tags**.

1. Provide a name and value.

   ![Add tag](./media/tag-resources-portal/add-tag.png)

1. Continue adding tags as needed. When done, select **Save**.

   ![Save tags](./media/tag-resources-portal/save-tags.png)

1. The tags are now displayed in the overview.

   ![Show tags](./media/tag-resources-portal/view-new-tags.png)

## Edit tags

1. To add or delete a tag, select **change**.

1. To delete a tag, select the trash icon. Then, select **Save**.

   ![Delete tag](./media/tag-resources-portal/delete-tag.png)

## Add tags to multiple resources

To bulk assign tags to multiple resources:

1. From any list of resources, select the checkbox for the resources you want to assign the tag. Then, select **Assign tags**.

   ![Select multiple resources](./media/tag-resources-portal/select-multiple-resources.png)

1. Add names and values. When done, select **Save**.

   ![Select assign](./media/tag-resources-portal/select-assign.png)

## View resources by tag

To view all resources with a tag:

1. On the Azure portal menu, search for **tags**. Select it from the available options.

   ![Find by tag](./media/tag-resources-portal/find-tags-general.png)

1. Select the tag for viewing resources.

   ![Select tag](./media/tag-resources-portal/select-tag.png)

1. All resources with that tag are displayed.

   ![View resources by tag](./media/tag-resources-portal/view-resources-by-tag.png)

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
* For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
