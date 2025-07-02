---
title: Create workflows from prebuilt templates
description: Learn to use a prebuilt template as a starting point for building workflows that run in Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 07/03/2025
# Customer intent: As a developer, I want to use a template as a faster way to build my workflows that run Azure Logic Apps.
---

# Create workflows from prebuilt templates in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Azure Logic Apps provides prebuilt templates so that you can more quickly build workflows for integration solutions by using the Azure portal. These templates follow commonly used workflow patterns and help you streamline development because they offer a starting point or baseline with predefined business logic and configurations.

For example, the following screenshot shows the workflow templates gallery for creating Standard logic app workflows:

:::image type="content" source="media/create-single-tenant-workflows-templates/templates-gallery.png" alt-text="Screenshot shows Azure portal and workflow templates gallery for Standard workflows." lightbox="media/create-single-tenant-workflows-templates/templates-gallery.png":::

This guide shows how to use a template to kickstart your workflow.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard or Consumption logic app resource with a blank workflow.

  For more information, see the following articles:

  - [Create an example Standard logic app workflow](create-single-tenant-workflows-azure-portal.md)
  - [Create an example Consumption logic app workflow](quickstart-create-example-consumption-workflow.md)

- Access or sign-in credentials for each connection that the template creates for the workflow.

- To authenticate access for connections that support using a managed identity, you need to set up your logic app resource and the managed identity with the necessary permissions.

  A managed identity provides the best option for keeping your data secure because you don't need to provide account or user credentials to sign in. Azure manages this identity and removes the burden on you to rotate credentials, secrets, access tokens, and so on. The managed identity option also reduces security risks because unauthorized users don't have access to your sign-in details.

  Before you can use a managed identity for authentication, you need to set up your logic app resource and the managed identity with the necessary permissions. For more information, see the following documentation:

  - [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)?

  - [Authenticate access to Azure resources with managed identities in Azure Logic Apps](authenticate-with-managed-identity.md?tabs=standard)

## Select a template from the gallery

To find and choose a template for your workflow, follow the corresponding steps for your Consumption or Standard logic app.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the sidebar menu, under **Development Tools**, select **Logic app templates**, which opens the templates gallery.

1. In the gallery, from the **Subscriptions** list, select the Azure subscriptions associated with the templates that you want to view, for example:

   :::image type="content" source="media/create-publish-workflow-templates/subscription-filter.png" alt-text="Screenshot shows Azure portal, templates gallery for Consumption workflow, and Subscriptions list filtered with example Azure subscriptions." lightbox="media/create-publish-workflow-templates/subscription-filter.png":::

   > [!NOTE]
   >
   > You can view only the workflow templates in the Azure subscriptions where you have access.

1. Find and select the template you want by using the search box or other filters.

1. Select your template, which opens the templates overview pane where you can review the workflow's purpose.

   - The **Summary** tab shows more detailed information, such as any connections, prerequisites, and more information about the workflow.

   - The **Workflow** tab shows a preview for the workflow that the template creates.

   The following example shows the **Summary** tab and **Workflow** tab for a template information pane:

   :::image type="content" source="media/create-workflows-from-templates/template-information.png" alt-text="Screenshot shows template information with Summary and Workflow tabs." lightbox="media/create-workflows-from-templates/template-information.png":::

1. Select **Use this template** and continue to the next section.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the sidebar menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add** > **Add from Template**, which opens the **Templates** gallery.

1. In the gallery, from the **Subscriptions** list, select the Azure subscriptions associated with the templates that you want to view, for example:

   :::image type="content" source="media/create-publish-workflow-templates/subscription-filter.png" alt-text="Screenshot shows Azure portal, templates gallery for Standard workflow, and Subscriptions list filtered with example Azure subscriptions." lightbox="media/create-publish-workflow-templates/subscription-filter.png":::

   > [!NOTE]
   >
   > You can view only the workflow templates in the Azure subscriptions where you have access.

1. Find and select the template you want by using the search box or other filters.

1. Select your template, which opens the templates overview pane where you can review the workflow's purpose.

   - The **Summary** tab shows more detailed information, such as any connections, prerequisites, and more information about the workflow.

   - The **Workflow** tab shows a preview for the workflow that the template creates.

   The following example shows the **Summary** tab and **Workflow** tab for a template information pane:

   :::image type="content" source="media/create-workflows-from-templates/template-information.png" alt-text="Screenshot shows template information with Workflow and Summary tabs." lightbox="media/create-workflows-from-templates/template-information.png":::

1. Select **Use this template** and continue to the next section.

---

## Provide information about your workflow

1. In the **Create a new workflow from template** pane appears, on the **Basics** tab, provide the following information about your workflow:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Workflow name** | Yes | Enter the name to use for your workflow. |
   | **State type** | Yes | Select either **Stateful** or **Stateless**, which determines whether to record the run history, inputs, outputs, and other data for the workflow. <br><br>For more information, see [Stateful and stateless workflows](single-tenant-overview-compare.md#stateful-stateless). |

1. Select **Next** and continue to the next steps.

## Create connections for you workflow

The **Connections** tab lists any connections that the workflow needs to create and authenticate.

1. To create each listed connection, in the **Connection** column, select **Connect**.

1. For each connection type, follow the prompts to provide the necessary connection information.

   If a connection type supports using a managed identity to authenticate access, choose this option.

1. Select **Next** or the **Parameters** tab and continue to the next steps.

## Provide values for action parameters

1. On the **Parameters** tab, provide the necessary values for various action parameters in the workflow.

   The parameters on this tab vary, based on the actions that appear in the workflow template.

1. Select **Next** or the **Review + create** tab and continue to the next steps.

## Review details and create workflow

1. On the **Review + create** tab, review all the provided information for your workflow.

1. When you're ready, select **Create**.

1. When Azure finishes creating your workflow, select **Go to my workflow**.

## Review the created workflow in the designer

### [Consumption](#tab/consumption)

1. On the logic app sidebar, under **Development Tools**, select the designer to open the workflow.

1. Continue working on the workflow by adding or removing the operations that you want. 

1. Make sure to provide the information necessary for each operation.

### [Standard](#tab/standard)

1. On the workflow menu, under **Tools**, select the designer to view the workflow.

1. Continue working on the workflow by adding or removing the operations that you want. 

1. Make sure to provide the information necessary for each operation.

---

## Related content

[Create and publish workflow templates for Azure Logic Apps](create-publish-workflow-templates.md)
