---
title: Move logic apps between subscriptions, resource groups, or regions - Azure Logic Apps
description: Learn how to move logic apps to another Azure subscription, resource group, location or region
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

You can move your logic app to a different Azure subscription by using the Azure portal, For general preparation and other steps for moving Azure resources to other subscriptions, see [Move resources to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md).

### Move logic apps between subscriptions by using the Azure portal

1. In the [Azure portal](https://portal.azure.com), find and select the logic app that you want to move.

1. On the logic app's **Overview** page, next to **Subscription**, select the **change** link.

1. On the **Move resources** page, select the logic app and any related resources that you want to move.

1. From the **Subscription** list, select the destination subscription.

1. From the **Resource group** list, select the destination resource group. Or, to create a completely new resource group, select **Create a new group**.

1. To acknowledge your understanding that any scripts or tools associated with the moved resources won't work until you update them with the new resource IDs, select the confirmation box, and then select **OK**.

<a name="move-resource-group"></a>

## Move logic apps between resource groups

You can test moving your logic apps to another resource group before actually moving those resources. For more information, see [Validate your move](../azure-resource-manager/resource-group-move-resources.md#validate-move). For general preparation and other steps for moving Azure resources to other resource groups, see [Move resources to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md).

### Move logic apps between resource groups by using the Azure portal

1. In the [Azure portal](https://portal.azure.com), find and select the logic app that you want to move.

1. On the logic app's **Overview** page, next to **Resource group**, select the **change** link.

1. On the **Move resources** page, select the logic app and any related resources that you want to move.

1. From the **Resource group** list, select the destination resource group. Or, to create a completely new resource group, select **Create a new group**.

1. To acknowledge your understanding that any scripts or tools associated with the moved resources won't work until you update them with the new resource IDs, select the confirmation box, and then select **OK**.

<a name="move-location"></a>

## Move logic apps between regions

For the easiest way to redeploy your logic app to a different region or location, use Visual Studio (free Community edition or greater) and the Azure Logic Apps Tools for Visual Studio. These tools let you find and download your logic app from the Azure portal into Visual Studio. When you download your logic app, you get an Azure Resource Manager template that includes the resource definitions for your logic app, connections, and other dependencies. This template also automatically parameterizes, or defines parameters for, the values used for provisioning and deploying your logic app and other resources. You can then use a separate parameters file to specify the new region or location for moving your logic app. That way, you can more easily change these values based on your deployment needs.

After you successfully redeploy your logic app, you can delete the original resources from the previous location.

For more information about these tasks, see these topics:

* [Overview: Automate deployment for Azure Logic Apps by using Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md)

* [Find, open, and download your logic app from the Azure portal into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md)

* [Create Azure Resource Manager templates for Azure Logic Apps](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)

* [Deploy Azure Resource Manager templates for Azure Logic Apps](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md)

## Next steps

[Move Azure resources to new resource groups or subscriptions](../azure-resource-manager/resource-group-move-resources.md)