---
title: Use the Azure portal and Azure Resource Manager to manage resource groups
description: Learn how to use the Azure portal and Azure Resource Manager to manage your resource groups. Understand how to create, list, and delete resource groups.
ms.topic: conceptual
ms.date: 01/24/2025
ms.custom: devx-track-arm-template
---

# Use the Azure portal and Azure Resource Manager to manage resource groups

Learn how to use the [Azure portal](https://portal.azure.com) with [Azure Resource Manager](overview.md) to manage Azure resource groups. See [Manage Azure resources by using the Azure portal](manage-resources-portal.md) to learn more about managing Azure resources.

[!INCLUDE [Handle personal data](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

## What is a resource group

A resource group is a container that holds related resources for an Azure solution. The resource group can include all resources for the solution or only the resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for your organization. Generally, add resources that share the same lifecycle to the same resource group so that you can easily deploy, update, and delete them as a group.

The resource group scope is also used throughout the Azure portal to create views that span across multiple resources. For example:

- The **Metrics** blade provides metrics information to users (e.g., for the CPU, resources, and others).
- The **Deployments** blade shows the history of Resource Manager template or Bicep deployments targeted to that resource group, including Azure portal deployments.
- The **Policy** blade provides information related to the policies enforced on the resource group.
- The **Diagnostics settings** blade can help to diagnose errors or review warnings.

The resource group stores metadata about the resources. Therefore, when you specify a location for the resource group, you're specifying where that metadata is stored. For compliance reasons, you might need to ensure that your data is stored in a particular region. Note that resources inside a resource group can be from different regions.

## Create resource groups

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups**.
1. Select **Create**.

    :::image type="content" source="./media/manage-resource-groups-portal/manage-resource-groups-add-group.png" alt-text="Screenshot of the Azure portal with 'Resource groups' and 'Add' highlighted." lightbox="./media/manage-resource-groups-portal/manage-resource-groups-add-group.png":::

1. Enter the following values:

   - **Subscription**: Select your Azure subscription.
   - **Resource group**: Enter a new resource group name.
   - **Region**: Select an Azure location such as **Central US**.

     :::image type="content" source="./media/manage-resource-groups-portal/manage-resource-groups-create-group.png" alt-text="Screenshot of the Create Resource Group form in the Azure portal with fields for Subscription, Resource group, and Region." lightbox="./media/manage-resource-groups-portal/manage-resource-groups-create-group.png":::

1. Select **Review + Create**
1. Select **Create**. It takes a few seconds to create a resource group.
1. Select **Refresh** from the top menu to refresh the resource group list, and then select the newly created resource group to open it. Or, select **Notification** (the bell icon) from the top, and then select **Go to resource group** to open the newly created resource group.

    :::image type="content" source="./media/manage-resource-groups-portal/manage-resource-groups-add-group-go-to-resource-group.png" alt-text="Screenshot of the Azure portal with the 'Go to resource group' button in the Notifications panel." lightbox="./media/manage-resource-groups-portal/manage-resource-groups-add-group-go-to-resource-group.png":::

## List resource groups

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups** to view a list of resource groups.
1. To customize the information displayed for the resource groups, configure the filters. The following screenshot shows the additional columns that you can add to the display:

    :::image type="content" source="./media/manage-resource-groups-portal/manage-resource-groups-list-groups.png" alt-text="Screenshot of the Azure portal displaying a list of resource groups." lightbox="./media/manage-resource-groups-portal/manage-resource-groups-list-groups.png":::

## Open resource groups

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups**.
1. Select the resource group you want to open.

## Delete resource groups

1. Open the resource group that you want to delete.  See [Open resource groups](#open-resource-groups) for reference.
1. Select **Delete resource group**.

    :::image type="content" source="./media/manage-resource-groups-portal/delete-group.png" alt-text="Screenshot of the Azure portal with the 'Delete resource group' button highlighted in a specific resource group." lightbox="./media/manage-resource-groups-portal/delete-group.png":::

For more information about how Resource Manager arranges how resources are deleted, see [Azure Resource Manager resource group and resource deletion](delete-resource-group.md).

## Deploy resources to a resource group

After creating a Resource Manager template, you can use the Azure portal to deploy your Azure resources. See [Quickstart: Create and deploy ARM templates by using the Azure portal](../templates/quickstart-create-templates-use-the-portal.md) for guidance about how to create a template. For guidance about how to deploy a template, see [Deploy resources with ARM templates and Azure portal](../templates/deploy-portal.md).

## Move to another resource group or subscription

You can move resources from one resource group to another. See [Move Azure resources to a new resource group or subscription](move-resource-group-and-subscription.md) for more information and guidance.

## Lock resource groups

Locking prevents other users in your organization from accidentally deleting or modifying critical resources like an Azure subscription, resource group, or resource.

1. Open the resource group that you want to lock. See [Open resource groups](#open-resource-groups) for reference.
1. In the left pane, select **Locks**.
1. To add a lock to the resource group, select **Add**.
1. Enter **Lock name**, **Lock type**, and **Notes**. The lock types include **Read-only** and **Delete**.

    :::image type="content" source="./media/manage-resource-groups-portal/manage-resource-groups-add-lock.png" alt-text="Screenshot of the Add Lock form in the Azure portal with fields for Lock name, Lock type, and Notes."  lightbox="./media/manage-resource-groups-portal/manage-resource-groups-add-lock.png":::

See [Lock your resources to protect your infrastructure](lock-resources.md) to learn more.

## Tag resource groups

You can apply tags to resource groups and resources to logically organize your assets. See [Apply tags with Azure portal](tag-resources-portal.md) to learn more.

## Export resource groups to templates

For information about exporting templates, see [Use Azure portal to export a template](../templates/export-template-portal.md).

## Manage access to resource groups

[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) can help you to manage access to resources in Azure. See [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml) to learn more.

## Next steps

- To learn more about Resource Manager, see the [What is Azure Resource Manager?](overview.md) overview.
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](../templates/syntax.md).
- To learn how to develop templates, see the step-by-step [Azure Resource Manager documentation tutorials](../index.yml) from Learn.
- To view Azure Resource Manager template schemas, see [Define resources with Bicep, ARM templates, and Terraform AzAPI provider](/azure/templates/).
