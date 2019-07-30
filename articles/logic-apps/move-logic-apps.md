---
title: Move logic apps between subscriptions, resource groups, or regions - Azure Logic Apps
description: Learn how to move logic apps to other Azure subscriptions, resource groups, or locations (regions)
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: conceptual
ms.date: 07/31/2019
---

# Move logic apps to another Azure subscription, resource group, or region

To move your logic app to a different Azure subscription, resource group, or region, you have several ways to complete these tasks. Also, only some logic app resource types support move operations between resource groups or subscriptions. Learn more about the [resources that support move operations](../azure-resource-manager/move-support-resources.md#microsoftlogic).

When you move resources, Azure creates new resource IDs, so make sure that you use the new IDs instead and update any scripts or tools associated with the moved resources. After you move logic apps between subscriptions, resource groups, or regions, you must reauthorize any OAuth-based connections.

## Prerequisites

* The same Azure subscription that was used to create the logic apps that you want to move

* [Logic App Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor) permissions to perform move operations on logic apps

<a name="move-subscription"></a>

## Move logic apps between subscriptions

You can move Azure resources such as your logic app to a different Azure subscription by using the Azure portal, Azure PowerShell, Azure CLI, or REST API. This topic covers the Azure portal, but for other steps and general preparation, see [Move resources to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md).

### Move logic apps between subscriptions by using the Azure portal

1. In the [Azure portal](https://portal.azure.com), find and select the logic app that you want to move.

1. On the logic app's **Overview** page, next to **Subscription**, select the **change** link.

1. On the **Move resources** page, select the logic app and any related resources that you want to move.

1. From the **Subscription** list, select the destination subscription.

1. From the **Resource group** list, select the destination resource group. Or, to create a different resource group, select **Create a new group**.

1. To acknowledge your understanding that any scripts or tools associated with the moved resources won't work until you update them with the new resource IDs, select the confirmation box, and then select **OK**.

<a name="move-resource-group"></a>

## Move logic apps between resource groups

You can move Azure resources such as your logic app to a different Azure resource group by using the Azure portal, Azure PowerShell, Azure CLI, or REST API. This topic covers the Azure portal, but for other steps and general preparation, see [Move resources to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md).

Also, you can test moving your logic apps to another resource group before actually moving those resources. For more information, see [Validate your move](../azure-resource-manager/resource-group-move-resources.md#validate-move).

### Move logic apps between resource groups by using the Azure portal

1. In the [Azure portal](https://portal.azure.com), find and select the logic app that you want to move.

1. On the logic app's **Overview** page, next to **Resource group**, select the **change** link.

1. On the **Move resources** page, select the logic app and any related resources that you want to move.

1. From the **Resource group** list, select the destination resource group. Or, to create a different resource group, select **Create a new group**.

1. To acknowledge your understanding that any scripts or tools associated with the moved resources won't work until you update them with the new resource IDs, select the confirmation box, and then select **OK**.

<a name="move-location"></a>

## Move logic apps between regions

When you want to move your logic app to a different region, your options depend on the way that you created your logic app. Based on the option that you choose, you must recreate or reauthenticate the connections in your logic app.

* In the Azure portal, you can create a blank logic app in the new region and copy the underlying workflow definition and connections from the source app to the destination app. To view the "code" behind a logic app, on the Logic App Designer toolbar, select **Code view**.

* When you use [Visual Studio (free Community edition or greater) and the Azure Logic Apps Tools for Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md), you can open and download your logic app from the Azure portal as an [Azure Resource Manager template](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md). This template is mostly ready for deployment and includes the resource definitions for your logic app, including the workflow itself, and connections. The template also declares parameters for the values to use at deployment so that you can more easily change where and how you deploy the logic app based on your needs. To specify the location and other necessary information for deployment, you can use a separate parameters file.

* If you created and deployed your logic app by using a continuous integration (CI) and continuous delivery (CD) pipeline, such as Azure DevOps Pipelines, you can just deploy your app to the new region.

For more information about deployment templates for logic apps, see these topics:

* [Overview: Automate deployment for Azure Logic Apps by using Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md)
* [Find, open, and download your logic app from the Azure portal into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md)
* [Create Azure Resource Manager templates for Azure Logic Apps](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)
* [Deploy Azure Resource Manager templates for Azure Logic Apps](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md)

### Related resources

Some Azure resources, such as on-premises data gateways in Azure, can exist in a region that differs from the logic apps that use those resources. However, other Azure resources, such as integration accounts, must exist in the same region as your logic apps. Make sure that your logic apps can access resources that your apps expect to exist in the same region where you move those logic apps, based on your particular scenario.

For example, to link a logic app to an integration account, both resources must exist in the same region. In some scenarios, such as disaster recovery, you very likely want the same integration account in both source and destination regions. However, in other scenarios, you might use a different integration account in the destination region versus the source region.

Custom connectors in Azure Logic Apps are visible and available to the connectors' authors and to those users who have the same Azure Active Directory tenant and Azure subscription for logic apps in the region where those apps are deployed. For more information, see [Share custom connectors in your organization](https://docs.microsoft.com/connectors/custom-connectors/share).

The template that you get from Visual Studio includes only the resource definitions for your logic app and its connections. If your logic app uses other resources, for example, an integration account and B2B artifacts, such as partners, agreements, schemas, and maps, you have to separately export the template for the integration account by using the Azure portal. This template includes the resource definitions for the integration account and artifacts; however, the template isn't fully parameterized so you have to manually parameterize the values that you want to use for deployment.

### Export templates for integration accounts

1. In the [Azure portal](https://portal.azure.com), find and open your integration account.

1. On your integration account's menu, under **Settings**, select **Export template**.

1. On the toolbar, select **Download**, and save the template.

1. Open and edit the template to parameterize the necessary values for deployment.

## Next steps

[Move Azure resources to new resource groups or subscriptions](../azure-resource-manager/resource-group-move-resources.md)