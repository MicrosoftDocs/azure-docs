---
title: Manage Azure resources by using the Azure portal | Microsoft Docs
description: Use Azure portal and Azure Resource Manage to manage your resources. 
services: azure-resource-manager,azure-portal
documentationcenter: ''
author: mumian


ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/06/2019
ms.author: jgao

---
# Manage Azure resources by using the Azure portal

Learn how to use the [Azure portal](https://portal.azure.com) with [Azure Resource Manager](resource-group-overview.md) to manage your Azure resources.

[!INCLUDE [Handle personal data](../../includes/gdpr-intro-sentence.md)]

For managing resource groups, see [Manage Azure resource groups by using the Azure portal](./manage-resource-groups-portal.md).

## Deploy resources to a resource group

See [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md).

## List resources

## Delete resources

## Manage resources

When viewing a resource in the portal, you see the options for managing that particular resource.

![manage resources](./media/resource-group-portal/manage-resources.png)

From these options, you can perform operations such as starting and stopping a virtual machine, or reconfiguring the properties of the virtual machine.

## Move resources

If you need to move resources to another resource group or another subscription, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

## Lock resources

You can lock a subscription, resource group, or resource to prevent other users in your organization from accidentally deleting or modifying critical resources. For more information, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

[!INCLUDE [resource-manager-lock-resources](../../includes/resource-manager-lock-resources.md)]

## Tag resources

You can apply tags to resource groups and resources to logically organize your assets. For information, see [Using tags to organize your Azure resources](./resource-group-using-tags.md#portal).

## Monitor resources

When you select a resource, the portal presents default graphs and tables for monitoring that resource type.

1. Select a resource and notice the **Monitoring** section. It includes graphs that are relevant to the resource type. The following image shows the default monitoring data for a storage account.

    ![show monitoring](./media/resource-group-portal/show-monitoring.png)
2. You can pin a section to your dashboard by selecting the ellipsis (...) above the section. You can also customize the size the section or remove it completely. The following image shows how to pin, customize, or remove the CPU and Memory section.

    ![pin section](./media/resource-group-portal/pin-cpu-section.png)
3. After pinning the section to the dashboard, you will see the summary on the dashboard. And, selecting it immediately takes you to more details about the data.

    ![view dashboard](./media/resource-group-portal/view-startboard.png)
4. To completely customize the data you monitor through the portal, navigate to your default dashboard, and select **New dashboard**.

    ![dashboard](./media/resource-group-portal/dashboard.png)
5. Give your new dashboard a name and drag tiles onto the dashboard. The tiles are filtered by different options.

    ![dashboard](./media/resource-group-portal/create-dashboard.png)

     To learn about working with dashboards, see [Creating and sharing dashboards in the Azure portal](../azure-portal/azure-portal-dashboards.md).

## Next steps

* To view activity logs, see [Audit operations with Resource Manager](resource-group-audit.md).
* To view details about a deployment, see [View deployment operations](resource-manager-deployment-operations.md).
* To deploy resources through the portal, see [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md).
* To manage access to resources, see [Use role assignments to manage access to your Azure subscription resources](../role-based-access-control/role-assignments-portal.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](/azure/architecture/cloud-adoption-guide/subscription-governance).