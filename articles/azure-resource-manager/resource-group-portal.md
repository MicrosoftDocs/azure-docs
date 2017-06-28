---
title: Use Azure portal to manage Azure resources | Microsoft Docs
description: Use Azure portal and Azure Resource Manage to manage your resources. Shows how to work with dashboards to monitor resources.
services: azure-resource-manager,azure-portal
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 0725bbf2-5913-4c07-af6e-24e11d957fbc
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/19/2016
ms.author: tomfitz

---
# Manage Azure resources through portal
> [!div class="op_single_selector"]
> * [Azure PowerShell](powershell-azure-resource-manager.md)
> * [Azure CLI](xplat-cli-azure-resource-manager.md)
> * [Portal](resource-group-portal.md) 
> * [REST API](resource-manager-rest-api.md)
> 
> 

This topic shows how to use the [Azure portal](https://portal.azure.com) with [Azure Resource Manager](resource-group-overview.md) to manage your Azure resources. To learn about deploying resources through the portal, see [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md).

Currently, not every service supports the portal or Resource Manager. For those services, you need to use the [classic portal](https://manage.windowsazure.com). For the status of each service, see [Azure portal availability chart](https://azure.microsoft.com/features/azure-portal/availability/).

## Manage resource groups

A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for your organization. Generally, add resources that share the same lifecycle to the same resource group so you can easily deploy, update, and delete them as a group. 

The resource group stores metadata about the resources. Therefore, when you specify a location for the resource group, you are specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region.

1. To see all the resource groups in your subscription, select **Resource groups**.
   
    ![browse resource groups](./media/resource-group-portal/browse-groups.png)
2. To create an empty resource group, select **Add**.
   
    ![add resource group](./media/resource-group-portal/add-resource-group.png)
3. Provide a name and location for the new resource group. Select **Create**.
   
    ![create resource group](./media/resource-group-portal/create-empty-group.png)
4. You may need to select **Refresh** to see the recently created resource group.
   
    ![refresh resource group](./media/resource-group-portal/refresh-resource-groups.png)
5. To customize the information displayed for your resource groups, select **Columns**.
   
    ![customize columns](./media/resource-group-portal/select-columns.png)
6. Select the columns to add, and then select **Update**.
   
    ![add columns](./media/resource-group-portal/add-columns.png)
7. To learn about deploying resources to your new resource group, see [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md).
8. For quick access to a resource group, you can pin the blade to your dashboard.
   
    ![pin resource group](./media/resource-group-portal/pin-group.png)
9. The dashboard displays the resource group and its resources. You can select either the resource groups or any of its resources to navigate to the item.
   
    ![pin resource group](./media/resource-group-portal/show-resource-group-dashboard.png)

## Tag resources
You can apply tags to resource groups and resources to logically organize your assets. For information about working with tags, see [Using tags to organize your Azure resources](resource-group-using-tags.md).

[!INCLUDE [resource-manager-tag-resource](../../includes/resource-manager-tag-resources.md)]

## Monitor resources
When you select a resource, the resource blade presents default graphs and tables for monitoring that resource type.

1. Select a resource and notice the **Monitoring** section. It includes graphs that are relevant to the resource type. The following image shows the default monitoring data for a storage account.
   
    ![show monitoring](./media/resource-group-portal/show-monitoring.png)
2. You can pin a section of the blade to your dashboard by selecting the ellipsis (...) above the section. You can also customize the size the section in the blade or remove it completely. The following image shows how to pin, customize, or remove the CPU and Memory section.
   
    ![pin section](./media/resource-group-portal/pin-cpu-section.png)
3. After pinning the section to the dashboard, you will see the summary on the dashboard. And, selecting it immediately takes you to more details about the data.
   
    ![view dashboard](./media/resource-group-portal/view-startboard.png)
4. To completely customize the data you monitor through the portal, navigate to your default dashboard, and select **New dashboard**.
   
    ![dashboard](./media/resource-group-portal/dashboard.png)
5. Give your new dashboard a name and drag tiles onto the dashboard. The tiles are filtered by different options.
   
    ![dashboard](./media/resource-group-portal/create-dashboard.png)
   
     To learn about working with dashboards, see [Creating and sharing dashboards in the Azure portal](../azure-portal/azure-portal-dashboards.md).

## Manage resources
In the blade for a resource, you see the options for managing the resource. The portal presents management options for that particular resource type. You see the management commands across the top of the resource blade and on the left side.

![manage resources](./media/resource-group-portal/manage-resources.png)

From these options, you can perform operations such as starting and stopping a virtual machine, or reconfiguring the properties of the virtual machine.

## Move resources
If you need to move resources to another resource group or another subscription, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

## Lock resources
You can lock a subscription, resource group, or resource to prevent other users in your organization from accidentally deleting or modifying critical resources. For more information, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

[!INCLUDE [resource-manager-lock-resources](../../includes/resource-manager-lock-resources.md)]

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

For step-by-step guidance, see [Export Azure Resource Manager template from existing resources](resource-manager-export-template.md).

## Delete resource group or resources
Deleting a resource group deletes all the resources contained within it. You can also delete individual resources within a resource group. You want to exercise caution when you delete a resource group because there might be resources in other resource groups that are linked to it. Resource Manager does not delete linked resources, but they may not operate correctly without the expected resources.

![delete group](./media/resource-group-portal/delete-group.png)

## Next Steps
* To view activity logs, see [Audit operations with Resource Manager](resource-group-audit.md).
* To view details about a deployment, see [View deployment operations](resource-manager-deployment-operations.md).
* To deploy resources through the portal, see [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md).
* To manage access to resources, see [Use role assignments to manage access to your Azure subscription resources](../active-directory/role-based-access-control-configure.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

