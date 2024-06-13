---
title: Enable deployment slots for zero downtime deployment
description: Set up deployment slots to enable zero downtime deployment for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, wsilveira, azla
ms.topic: how-to
ms.date: 04/26/2024

#Customer intent: As a logic app developer, I want to set up deployment slots on my logic app resource so that I can deploy with zero downtime.
---

# Set up deployment slots to enable zero downtime deployment in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To deploy mission-critical logic apps that are always available and responsive, even during updates or maintenance, you can enable zero downtime deployment by creating and using deployment slots. Zero downtime means that when you deploy new versions of your app, end users shouldn't experience disruption or downtime. Deployment slots are isolated nonproduction environments that host different versions of your app and provide the following benefits:

- Swap a deployment slot with your production slot without interruption. That way, you can update your logic app and workflows without affecting availability or performance.

- Test and validate any changes in a deployment slot before you apply those changes to the production slot.

- Roll back to a previous version, if anything goes wrong with your deployment.

- Reduce the risk of negative performance when you must exceed the [recommended number of workflows per logic app](create-single-tenant-workflows-azure-portal.md#best-practices-and-recommendations).

With deployment slots, you can achieve continuous delivery and improve your applications' quality and reliability. For more information about deployment slots in Azure and because Standard logic app workflows are based on Azure Functions extensibility, see [Azure Functions deployment slots](../azure-functions/functions-deployment-slots.md).

:::image type="content" source="media/set-up-deployment-slots/overview.png" alt-text="Screenshot shows Azure portal, Standard logic app resource, and deployment slots page." lightbox="media/set-up-deployment-slots/overview.png":::

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

- To work in Visual Studio Code with the Azure Logic Apps (Standard) extension, you'll need to meet the prerequisites described in [Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#prerequisites). You'll also need a Standard logic app project that you want to publish to Azure.

- [Azure Logic Apps Standard Contributor role permissions](logic-apps-securing-a-logic-app.md?tabs=azure-portal#standard-workflows)

- An existing Standard logic app resource in Azure where you want to create your deployment slot and deploy your changes. You can create an empty Standard logic app resource without any workflows. For more information, see [Create example Standard workflow in single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md).

## Create a deployment slot

The following options are available for you to create a deployment slot:

### [Portal](#tab/portal)

1. In [Azure portal](https://portal.azure.com), open your Standard logic app resource where you want to create a deployment slot.

1. On the resource menu, under **Deployment**, select **Deployment slots (Preview)**.

1. On the toolbar, select **Add**.

1. In the **Add Slot** pane, provide a name, which must be unique and uses only lowercase alphanumeric characters or hyphens (**-**), for your deployment slot.

   > [!NOTE]
   >
   > After creation, your deployment slot name uses the following format: <*logic-app-name-deployment-slot-name*>.

1. When you're done, select **Add**.

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open the Standard logic app project that you want to deploy.

1. Open the command palette. (Keyboard: Ctrl + Shift + P)

1. From the command list, select **Azure Logic Apps: Create Slot**, and follow the prompts to provide the required information:

   1. Enter and select the name for your Azure subscription.

   1. Enter and select the name for your existing Standard logic app in Azure.

   1. Enter a name, which must be unique and uses only lowercase alphanumeric characters or hyphens (**-**), for your deployment slot.

### [Azure CLI](#tab/azure-cli)

Run the following Azure CLI command:

`az functionapp deployment slot create --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name}`

To enable a system-assigned managed identity on your Standard logic app deployment slot, run the following Azure CLI command:

`az functionapp identity assign --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name}`

---

## Confirm deployment slot creation

After you create the deployment slot, confirm that the slot exists on your deployed logic app resource.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Deployment**, select **Deployment slots (Preview)**.

1. On the **Deployment slots** page, under **Deployment Slots (Preview)**, find and select your new deployment slot.

   > [!NOTE]
   >
   > After creation, your deployment slot name uses the following format: <*logic-app-name-deployment-slot-name*>.

## Deploy logic app changes to a deployment slot

The following options are available for you to deploy logic app changes in a deployment slot:

### [Portal](#tab/portal)

Unavailable at this time. Please follow the steps for Visual Studio Code or Azure CLI to deploy your changes.

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

Run the following Azure CLI command:

`az logicapp deployment source config-zip --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name} --src {deployment-package-local-path}`

---

## Confirm deployment for your changes

After you deploy your changes, confirm that the changes appear in your deployed logic app resource.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Deployment**, select **Deployment slots (Preview)**.

1. On the **Deployment slots** page, under **Deployment Slots (Preview)**, find and select your deployment slot.

1. On the resource menu, select **Overview**. On the **Notifications** tab, check whether any deployment issues exist, for example, errors that might happen during app startup or around slot swapping:

   :::image type="content" source="media/set-up-deployment-slots/deployment-slot-notifications.png" alt-text="Screenshot shows Azure portal, logic app deployment slot resource with Overview page, and selected Notifications tab." lightbox="media/set-up-deployment-slots/deployment-slot-notifications.png":::

1. To verify the changes in your workflow, under **Workflows**, select **Workflows**, and then select a workflow, which appears in read-only view.

## Swap a deployment slot with the production slot

The following options are available for you to swap a deployment slot with the current production slot:

### [Portal](#tab/portal)

1. In [Azure portal](https://portal.azure.com), open your Standard logic app resource where you want to swap slots.

1. On the resource menu, under **Deployment**, select **Deployment slots (Preview)**.

1. On the toolbar, select **Swap**.

1. On the **Swap** pane, under **Source**, select the deployment slot that you want to activate.

1. Under **Target**, select the production slot that you want to replace with the deployment slot.

   > [!NOTE]
   >
   > **Perform swap with preview** works only with logic apps that enabled deployment slot settings.

1. Under **Config Changes**, review the configuration changes for the source and target slots.

1. When you're ready, select **Start Swap**.

1. Wait for the operation to successfully complete.

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open your Standard logic app project.

1. Open the command palette. (Keyboard: Ctrl + Shift + P)

1. From the command list, select **Azure Logic Apps: Swap Slot**, and follow the prompts to provide the required information:

   1. Enter and select the name for your Azure subscription.

   1. Enter and select the name for your existing Standard logic app in Azure.

   1. Select the deployment slot that you want to make as the active slot.

   1. Select the production slot that you want to swap with the deployment slot.

   1. Wait for the operation to successfully complete.

### [Azure CLI](#tab/azure-cli)

Run the following Azure CLI command:

`az functionapp deployment slot swap --name {logic-app-name} --resource-group {resource-group-name} --slot {slot-name} --target-slot production`

---

## Confirm success for your slot swap

After you swap slots, verify that the changes from your deployment slot now appear in the production slot.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Workflows**, select **Workflows**, and then select a workflow to review the changes.

## Delete a deployment slot

The following options are available for you to delete a deployment slot from your Standard logic app resource.

### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Deployment**, select **Deployment slots (Preview)**.

1. On the **Deployment slots** page, under **Deployment Slots (Preview)**, select the deployment slot that you want to delete.

1. On the deployment slot resource menu, select **Overview**.

1. On the **Overview** toolbar, select **Delete**.

1. Confirm deletion by entering the deployment slot name, and then select **Delete**.

   :::image type="content" source="media/set-up-deployment-slots/delete-deployment-slot.png" alt-text="Screenshot shows Azure portal, deployment slot resource with Overview page opened, and delete confirmation pane with deployment slot name to delete." lightbox="media/set-up-deployment-slots/delete-deployment-slot.png":::

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open your Standard logic app project.

1. Open the command palette. (Keyboard: Ctrl + Shift + P)

1. From the command list, select **Azure Logic Apps: Delete Slot**, and follow the prompts to provide the required information:

   1. Enter and select the name for your Azure subscription.

   1. Enter and select the name for your existing Standard logic app in Azure.

   1. Select the deployment slot that you want to delete.

1. In the message box that appears, confirm that you want to delete selected deployment slot by selecting **Delete**.

### [Azure CLI](#tab/azure-cli)

Run the following Azure CLI command:

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
