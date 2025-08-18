---
title: Navigate the Standard Workflow Designer
description: Learn how to complete basic tasks in the Standard workflow designer, which helps you visually create workflows using the Azure portal.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 04/21/2025
---

# Navigate around the designer for Standard workflows in single-tenant Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

When you work with Azure Logic Apps in the Azure portal, you can edit your [*workflows*](logic-apps-overview.md#logic-app-concepts) visually or programmatically.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).
- A *Standard* logic app resource [in single-tenant Azure Logic Apps](single-tenant-overview-compare.md). For more information, see [Create an example Standard logic app workflow in single-tenant Azure Logic Apps using the Azure portal](create-single-tenant-workflows-azure-portal.md).
- A workflow for your Standard logic app resource.

## Latest version features

The latest workflow designer offers a new experience with noteworthy features and benefits, for example:

- A new layout engine that supports more complicated workflows.

- You can create and view complicated workflows cleanly and easily, thanks to the new layout engine, a more compact canvas, and updates to the card-based layout.

- Add and edit steps using panels separate from the workflow layout. This change gives you a cleaner and clearer canvas to view your workflow layout. For more information, review [Add steps to workflows](#add-steps-to-workflows).

- Move between steps in your workflow on the designer using keyboard navigation.

  - Move to the next card: **Ctrl** + **Down Arrow (&darr;)**

  - Move to the previous card: **Ctrl** + **Up Arrow (&uarr;)**

## Open the workflow designer

1. In the [Azure portal](https://portal.azure.com), open your [*logic app* resource](logic-apps-overview.md#logic-app-concepts).

1. On the logic app menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page, select the workflow that you want.

1. On the workflow menu, select **Designer**.

   To visually develop, edit, and run your workflow, select the designer view. To edit the workflow in JSON view, select [**Code**](#code-view). You can switch between the designer view and code view at any time.

   :::image type="content" source="./media/designer-overview/choose-developer-view.png" alt-text="Screenshot of a logic app resource page in the Azure portal, showing the sidebar options to view a workflow in Code or Designer view.":::

1. When you select the **Designer** view, your workflow opens in the workflow designer.

   :::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot that shows the workflow designer and a sample enterprise workflow that uses switches and conditions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

## Add steps to workflows

The workflow designer provides a visual way to add, edit, and delete steps in your workflow. As the first step in your workflow, always add a [*trigger*](logic-apps-overview.md#logic-app-concepts). Then, complete your workflow by adding one or more [*actions*](logic-apps-overview.md#logic-app-concepts).

To add a trigger or an action to your Standard workflow, see [Build a workflow with a trigger or action in Azure Logic Apps](create-workflow-with-trigger-or-action.md).

1. Configure your trigger or action as needed.

   1. Mandatory fields have a red asterisk (&ast;) in front of the name.

   1. Some triggers and actions might require you to create a connection to another service. You might need to sign into an account, or enter credentials for a service. For example, if you want to use the Office 365 Outlook connector to send an email, you need to authorize your Outlook email account.

   1. Some triggers and actions use dynamic content, where you can select variables instead of entering information or expressions.

1. Select **Save** in the toolbar to save your changes. This step also verifies that your workflow is valid.

## Code view

The **Code** view allows you to directly edit the workflow definition file in JSON format. Make sure to select **Save** to save any changes you make in this view. 

> [!TIP]
> The **Code** view is also an easy way to find and copy the workflow definition, instead of using the Azure CLI or other methods.

:::image type="content" source="./media/designer-overview/code-view.png" alt-text="Screenshot of a Logic Apps workflow in Code view, showing the JSON workflow definition being edited in the Azure portal.":::

## Next steps

> [!div class="nextstepaction"]
> [Create an integration workflow with single-tenant Azure Logic Apps (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md)
