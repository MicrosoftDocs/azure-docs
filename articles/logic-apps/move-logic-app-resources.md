---
title: Move logic apps across subscriptions, resource groups, or regions
description: Migrate logic apps or integration accounts to other Azure subscriptions, resource groups, or locations (regions).
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/20/2022
---

# Move logic app resources to other Azure resource groups, regions, or subscriptions

To migrate your logic app or related resources to another Azure resource group, region, or subscription, you have various ways to complete these tasks, such as the Azure portal, Azure PowerShell, Azure CLI, and REST API. Before you move resources, review these considerations: 

* You can move only [specific logic app resource types](../azure-resource-manager/management/move-support-resources.md#microsoftlogic) between Azure resource groups or subscriptions.

* Check the [limits](../logic-apps/logic-apps-limits-and-config.md) on the number of logic app resources that you can have in your Azure subscription and in each Azure region. These limits affect whether you can move specific resource types when the region stays the same across subscriptions or resource groups. For example, you can have only one Free tier integration account for each Azure region in each Azure subscription.

* When you move resources, Azure creates new resource IDs. So, make sure that you use the new IDs instead and update any scripts or tools that are associated with the moved resources.

* After you migrate logic apps between subscriptions, resource groups, or regions, you must recreate or reauthorize any connections that require Open Authentication (OAuth).

* You can move an [integration service environment (ISE)](connect-virtual-network-vnet-isolated-environment-overview.md) only to another resource group that exists in the same Azure region or Azure subscription. You can't move an ISE to a resource group that exists in a different Azure region or Azure subscription. Also, after such a move, you must update all references to the ISE in your logic app workflows, integration accounts, connections, and so on.

## Prerequisites

* The same Azure subscription that was used to create the logic app or integration account that you want to move

* Resource owner permissions to move and set up the resources that you want. Learn more about [Azure role-based access control (Azure RBAC)](../role-based-access-control/built-in-roles.md#owner).

<a name="move-subscription"></a>

## Move resources between subscriptions

To move a resource, such as a logic app or integration account, to another Azure subscription, you can use the Azure portal, Azure PowerShell, Azure CLI, or REST API. These steps cover the Azure portal, which you can use when the resource's region stays the same. For other steps and general preparation, see [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).

1. In the [Azure portal](https://portal.azure.com), find and select the logic app resource that you want to move.

1. On the resource navigation menu, select **Overview**. Next to the **Subscription** label, select **move**.

    You can also go to the resource's **Properties** page, and under **Subscription Name**, select **Change subscription**.

1. On the **Move resources** page, select the logic app resource and any related resources that you want to move.

1. From the **Subscription** list, select the destination subscription.

1. From the **Resource group** list, select the destination resource group. Or, to create a different resource group, select **Create a new group**.

1. To confirm your understanding that any scripts or tools that are associated with the moved resources won't work until you update them with the new resource IDs, select the confirmation box, and then select **OK**.

<a name="move-resource-group"></a>

## Move resources between resource groups

To move a resource, such as a logic app, integration account, or [integration service environment (ISE)](connect-virtual-network-vnet-isolated-environment-overview.md), to another Azure resource group, you can use the Azure portal, Azure PowerShell, Azure CLI, or REST API. These steps cover the Azure portal, which you can use when the resource's region stays the same. For other steps and general preparation, see [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).

Before actually moving resources between groups, you can test whether you can successfully move your resource to another group. For more information, see [Validate your move](../azure-resource-manager/management/move-resource-group-and-subscription.md#use-rest-api).

1. In the [Azure portal](https://portal.azure.com), find and select the logic app resource that you want to move.

1. On the resource's **Overview** page, next to **Resource group**, select the **change** link.

1. On the **Move resources** page, select the logic app resource and any related resources that you want to move.

1. From the **Resource group** list, select the destination resource group. Or, to create a different resource group, select **Create a new group**.

1. To confirm your understanding that any scripts or tools that are associated with the moved resources won't work until you update them with the new resource IDs, select the confirmation box, and then select **OK**.

<a name="move-location"></a>

## Move resources between regions

When you want to move a logic app to a different region, your options depend on the way that you created your logic app. Based on the option that you choose, you must recreate or reauthorize the connections in your logic app.

* In the Azure portal, recreate the logic app in the new region and reconfigure the workflow settings. To save time, you can copy the underlying workflow definition and connections from the source app to the destination app. To view the "code" behind a logic app, on the Logic App Designer toolbar, select **Code view**.

* By using Visual Studio and the Azure Logic Apps Tools for Visual Studio, you can [open and download your logic app](../logic-apps/manage-logic-apps-with-visual-studio.md) from the Azure portal as an [Azure Resource Manager template](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md). This template is mostly ready for deployment and includes the resource definitions for your logic app, including the workflow itself, and connections. The template also declares parameters for the values to use at deployment. That way, you can more easily change where and how you deploy the logic app, based on your needs. To specify the location and other necessary information for deployment, you can use a separate parameters file.

* If you created and deployed your logic app by using continuous integration (CI) and continuous delivery (CD) tools, such as Azure Pipelines in Azure DevOps, you can deploy your app to another region by using those tools.

For more information about deployment templates for logic apps, see these topics:

* [Overview: Automate deployment for Azure Logic Apps by using Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md)
* [Find, open, and download your logic app from the Azure portal into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md)
* [Create Azure Resource Manager templates for Azure Logic Apps](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)
* [Deploy Azure Resource Manager templates for Azure Logic Apps](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md)

### Related resources

Some Azure resources, such as on-premises data gateway resources in Azure, can exist in a region that differs from the logic apps that use those resources. However, other Azure resources, such as linked integration accounts, must exist in the same region as your logic apps. Based on your scenario, make sure that your logic apps can access the resources that your apps expect to exist in the same region.

For example, to link a logic app to an integration account, both resources must exist in the same region. In scenarios such as disaster recovery, you usually want integration accounts that have the same configuration and artifacts. In other scenarios, you might need integration accounts with different configurations and artifacts.

Custom connectors in Azure Logic Apps are visible to the connectors' authors and users who have the same Azure subscription and the same Microsoft Entra tenant. These connectors are available in the same region where logic apps are deployed. For more information, see [Share custom connectors in your organization](/connectors/custom-connectors/share).

The template that you get from Visual Studio includes only the resource definitions for your logic app and its connections. So, if your logic app uses other resources, for example, an integration account and B2B artifacts, such as partners, agreements, and schemas, you must export that integration account's template by using the Azure portal. This template includes the resource definitions for both the integration account and artifacts. However, the template isn't fully parameterized. So, you must manually parameterize the values that you want to use for deployment.

### Export templates for integration accounts

1. In the [Azure portal](https://portal.azure.com), find and open your integration account.

1. On your integration account's menu, under **Settings**, select **Export template**.

1. On the toolbar, select **Download**, and save the template.

1. Open and edit the template to parameterize the necessary values for deployment.

## Next steps

[Move Azure resources to new resource groups or subscriptions](../azure-resource-manager/management/move-resource-group-and-subscription.md)
