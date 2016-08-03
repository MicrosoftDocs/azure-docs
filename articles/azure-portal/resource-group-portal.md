<properties 
	pageTitle="Use Azure portal to manage Azure resources | Microsoft Azure" 
	description="Use Azure portal and Azure Resource Manage to manage your resources. Shows how to work with dashboards and tiles to monitor resources." 
	services="azure-resource-manager,azure-portal" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="azure-resource-manager" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/02/2016" 
	ms.author="tomfitz"/>


# Manage Azure resources through portal

> [AZURE.SELECTOR]
- [Portal](azure-portal/resource-group-portal.md) 
- [Azure CLI](xplat-cli-azure-resource-manager.md)
- [Azure PowerShell](powershell-azure-resource-manager.md)
- [.NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-resources-and-groups/)
- [Java](https://azure.microsoft.com/documentation/samples/resources-java-manage-resource-group/)
- [Node](https://azure.microsoft.com/documentation/samples/resource-manager-node-resources-and-groups/)
- [Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-resources-and-groups/)
- [Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-resources-and-groups/)

This topic shows how to use the [Azure portal](https://portal.azure.com) with [Azure Resource Manager](../resource-group-overview.md) to manage your Azure resources. 
Currently, not every service supports the portal or Resource Manager. For those services, you need to use the [classic portal](https://manage.windowsazure.com). For the status of each service, see [Azure portal availability chart](https://azure.microsoft.com/features/azure-portal/availability/).

## Manage resource groups

1. To see all the resource groups in your subscription, select **Resource groups**.

    ![browse resource groups](./media/resource-group-portal/browse-groups.png)

1. To create an empty resource group, select **Add**.

    ![add resource group](./media/resource-group-portal/add-resource-group.png)

1. Provide a name and location for the new resource group. Select **Create**.

    ![create resource group](./media/resource-group-portal/create-empty-group.png)

1. You may need to select **Refresh** to see the recently created resource group.

    ![refresh resource group](./media/resource-group-portal/refresh-resource-groups.png)

1. To customize the information displayed for your resource groups, select **Columns**.

    ![customize columns](./media/resource-group-portal/select-columns.png)

1. Select the columns to add, and then select **Update**.

    ![add columns](./media/resource-group-portal/add-columns.png)

1. To learn about deploying resources to your new resource group, see [Deploy resources with Resource Manager templates and Azure portal](../resource-group-template-deploy-portal.md).

1. For quick access to a resource group, you can pin the blade to your dashboard.

    ![pin resource group](./media/resource-group-portal/pin-group.png)

1. The dashboard displays the resource group and its resources. You can select either the resource groups or any of its resources to navigate to the item.

    ![pin resource group](./media/resource-group-portal/show-resource-group-dashboard.png)

## Tag resources

You can apply tags to resource groups and resources to logically organize your assets. For information about working with tags, see [Using tags to organize your Azure resources](../resource-group-using-tags.md).

[AZURE.INCLUDE [resource-manager-tag-resource](../../includes/resource-manager-tag-resources.md)]

## Monitor resources

The blade presents default graphs and tables for monitoring each resource type. You can customize how you monitor the resource by changing the displayed graphs and tables.

1. Within the blade for a resource, add more graphs and tables by selecting **Add a section** below the summary.

    ![add section](./media/resource-group-portal/add-section.png)

1. From the tile gallery, select the information you would like to present in the blade. The editor filters the tiles by the resource type. Selecting a different resource changes the available tiles.

    ![add section](./media/resource-group-portal/tile-gallery.png)

1. Drag the tile you need into the available spaces.

    ![drag tile](./media/resource-group-portal/drag-tile.png)

1. After selecting **Done** at the top of the portal, your new view is part of the blade.

    ![show tile](./media/resource-group-portal/show-lens.png)

1. You can pin a section of the blade to your dashboard by selecting the ellipsis (...) above the section. You can also customize the size the section in the blade or remove it completely. The following image shows how to pin, customize, or remove the CPU and Memory section.

    ![pin section](./media/resource-group-portal/pin-cpu-section.png)

1. After pinning the section to the dashboard, you will see the summary on the dashboard. And, selecting it immediately takes you to more details about the data.

    ![view dashboard](./media/resource-group-portal/view-startboard.png)

1. You can also create multiple dashboards for monitoring and managing your resources, and share those dashboards with other in your organization. Select **New dashboard**.

    ![dashboard](./media/resource-group-portal/dashboard.png)

     To learn about working with dashboards, view the [Build Custom Dashboards in the Microsoft Azure Portal](https://channel9.msdn.com/Blogs/trevor-cloud/azure-portal-dashboards) video. To learn about sharing access to a published dashboard, see [Share Azure dashboards](azure-portal-dashboard-share-access.md).

## Move resources

If you need to move resources to another resource group or another subscription, see [Move resources to new resource group or subscription](../resource-group-move-resources.md).

## Lock resources

You can lock a subscription, resource group, or resource to prevent other users in your organization from accidentally deleting or modifying critical resources. For more information, see [Lock resources with Azure Resource Manager](../resource-group-lock-resources.md).

[AZURE.INCLUDE [resource-manager-lock-resources](../../includes/resource-manager-lock-resources.md)]

## View your subscription and costs

You can view information about your subscription and the rolled-up costs for all your resources. Select **Subscriptions** and the subscription you want to see. You might only have one subscription to select.

![subscription](./media/resource-group-portal/select-subscription.png)

Within the subscription blade, you see a burn rate.

![burn rate](./media/resource-group-portal/burn-rate.png)

And, a breakdown of costs by resource type.

![resource cost](./media/resource-group-portal/cost-by-resource.png)

## Export template

After setting up your resource group, you may want to view the Resource Manager template for the resource group. Exporting the template offers two benefits:

1. You can easily automate future deployments of the solution because the template contains all the complete infrastructure.

2. You can become familiar with template syntax by looking at the JavaScript Object Notation (JSON) that represents your solution.

For step-by-step guidance, see [Export Azure Resource Manager template from existing resources](../resource-manager-export-template.md).

## Delete resource group or resources

Deleting a resource group deletes all the resources contained within it. You can also delete individual resources within a resource group. You want to exercise caution when you delete a resource group because there might be resources in other resource groups that are linked to it. You are not deleting the linked resources, but they may not operate correctly without the expected resources.

![delete group](./media/resource-group-portal/delete-group.png)

## Next Steps

- To view audit logs, see [Audit operations with Resource Manager](../resource-group-audit.md).
- To troubleshoot deployment errors, see [Troubleshooting resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md).
- To deploy resources through the portal, see [Deploy resources with Resource Manager templates and Azure portal](../resource-group-template-deploy-portal.md).
- To manage access to resources, see [Use role assignments to manage access to your Azure subscription resources](../active-directory/role-based-access-control-configure.md).






