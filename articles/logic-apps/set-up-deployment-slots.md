---
title: Enable deployment slots for zero downtime deployment
description: Set up deployment slots to enable zero downtime deployment for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 12/07/2023
ms.custom: subject-rbac-steps, devx-track-arm-template

#Customer intent: As a logic app developer, I want to set up deployment slots on my logic app resource so that I can deploy with zero downtime.
---

# Set up deployment slots to enable zero downtime deployment in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To deploy mission-critical logic apps that are always available and responsive, even during updates or maintenance, you can enable zero downtime deployment by using deployment slots. Zero downtime means that when you deploy new versions of your app, end users shouldn't experience disruption or downtime. Deployment slots are isolated nonproduction environments that host different versions of your app and provide the following benefits:

- You can swap a deployment slot with your production slot without interruption. That way, you can update an app without affecting availability or performance.

- You can test and validate any changes in a deployment slot before you apply those changes to the production slot.

- You can roll back to a previous version, if anything goes wrong with your deployment.

With deployment slots, you can achieve continuous delivery and improve your applications' quality and reliability. For more information about deployment slots in Azure and because Standard logic app workflows are based on Azure Functions extensibility, see [Azure Functions deployment slots](../azure-functions/functions-deployment-slots.md).

### Known issues and limitations

- Nonproduction slots are created in read-only mode.

- The nonproduction slots dispatcher is turned off, which means that workflows can only run when they're in the production slot.

- Traffic distribution is disabled for deployment slots in Standard logic apps.

- Deployment slots for Standard logic apps don't support the following scenarios:

  - Blue-green deployment
  - Product verification testing before slot swapping
  - A/B testing

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code with the Azure Logic Apps (Standard) extension. To meet these requirements, see the prerequisites for [Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

- A Standard logic app project in Visual Studio Code that you want to publish to Azure.

- [Azure Logic Apps Standard Contributor role permissions](logic-apps-securing-a-logic-app.md?tabs=azure-portal#standard-workflows)

- An existing deployed Standard logic app resource in Azure where you want to create your deployment slot and deploy your changes. You can create an empty Standard logic app resource without any workflows. For more information, see [Create example Standard workflow in single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md).

## Create a deployment slot

The following options are available for you to create a deployment slot:

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open the Standard logic app project that you want to deploy.

1. Open the command palette. (Keyboard: Ctrl + Shift + P)

1. From the command list, select **Azure Logic Apps: Create Slot**, and follow the prompts to provide the required information:

   1. Enter and select the name for your Azure subscription.

   1. Enter and select the name for your existing Standard logic app in Azure.

   1. Enter a unique name for your deployment slot.

### [Azure CLI](#tab/azure-cli)

To create a nonproduction slot, run the following Azure CLI command:

`az functionapp deployment slot create --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name}`

To enable a system-assigned managed identity on a Standard logic app in a deployment slot, run the following Azure CLI command:

`az functionapp identity assign --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name}`

---

## Confirm deployment slot creation

After you create the deployment slot, confirm that the slot is available on your deployed logic app resource.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Deployment**, select **Deployment slots (Preview)**.

1. On the **Deployment slots** page, under **Deployment Slots (Preview)**, find your new deployment slot.

   > [!NOTE]
   >
   > Your deployment slot's name appears as <*logic-app-name-deployment-slot-name*>.

## Deploy logic app changes to a deployment slot

The following options are available for you to deploy logic app changes in a deployment slot:

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open the Standard logic app project that you want to deploy.

1. Open the command palette. (Keyboard: Ctrl + Shift + P)

1. From the command list, select **Azure Logic Apps: Deploy to Slot**, and follow the prompts to provide the required information:

   1. Enter and select the name for your Azure subscription.

   1. Enter and select the name for your existing Standard logic app in Azure.

   1. Select the name for your deployment slot.

1. In the message box that appears, confirm that you want to deploy the current code in your project to the selected slot by selecting **Deploy**. This action overwrites any existing content in the selected slot.

1. After deployment completes, you can update any settings, if necessary, by selecting **Upload settings** in the message box that appears.

### [Azure CLI](#tab/azure-cli)

To deploy logic app changes to a deployment slot, run the following Azure CLI command:

`az logicapp deployment source config-zip --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name} --src {deployment-package-local-path}`

---

## Confirm deployment for your changes

After you deploy your changes, confirm that the changes appear in your deployed logic app resource.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Deployment**, select **Deployment slots (Preview)**.

1. On the **Deployment slots** page, under **Deployment Slots (Preview)**, find and select your deployment slot.

1. On the **Notifications** tab, check whether any deployment issues exist, for example, errors that might happen during app startup or around slot swapping:

   :::image type="content" source="{source}" alt-text="{alt-text}":::

1. To verify the changes in your workflow, under **Workflows**, select **Workflows**, and then select a workflow, which appears in read-only view.

## Swap a deployment slot with the production slot

The following steps show how to swap a Standard logic app deployment slot with the current production slot.

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open your Standard logic app project.

1. Open the command palette. (Keyboard: Ctrl + Shift + P)

1. From the command list, select **Azure Logic Apps: Swap Slot**, and follow the prompts to provide the required information:

   1. Enter and select the name for your Azure subscription.

   1. Enter and select the name for your existing Standard logic app in Azure.

   1. Select the deployment slot that you want to become the active slot.

   1. Select the production slot that you want to swap with the deployment slot.

   1. Wait for the operation to successfully complete.

### [Azure CLI](#tab/azure-cli)

To swap your production slot with a deployment slot, run the following Azure CLI command:

`az functionapp deployment slot swap --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name} --target-slot production`

---

## Confirm success for your slot swap

After you swap slots, verify that the changes from your deployment slot now appear in the production slot.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Workflows**, select **Workflows**, and then select a workflow to review the changes.

## Delete a deployment slot

The following options are available for you to remove a deployment slot from your Standard logic app resource.

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open your Standard logic app project.

1. Open the command palette. (Keyboard: Ctrl + Shift + P)

1. From the command list, select **Azure Logic Apps: Delete Slot**, and follow the prompts to provide the required information:

   1. Enter and select the name for your Azure subscription.

   1. Enter and select the name for your existing Standard logic app in Azure.

   1. Select the deployment slot that you want to delete.

1. In the message box that appears, confirm that you want to delete selected deployment slot by selecting **Delete**.

### [Azure CLI](#tab/azure-cli)

To delete a deployment slot from your deployed Standard logic app resource, run the following Azure CLI command:

`az functionapp deployment slot delete --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name} --target-slot production`

---

## Confirm deployment slot deletion

After you delete a deployment slot, verify that the slot no longer exists on your deployed Standard logic app resource.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Deployment**, select **Deployment slots (Preview)**.

1. On the **Deployment slots** page, under **Deployment Slots (Preview)**, confirm that the deployment slot no longer exists.

## Related content

- [Deployment best practices](../app-service/deploy-best-practices.md)
- [Azure Functions deployment slots](../azure-functions/functions-deployment-slots.md)
