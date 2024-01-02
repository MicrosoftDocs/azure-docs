---
title: About Standard logic app workflow designer
description: Learn how the designer in single-tenant Azure Logic Apps helps you visually create workflows through the Azure portal. Discover the benefits and features in this latest version.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/23/2023
---

# About the Standard logic app workflow designer in single-tenant Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

When you work with Azure Logic Apps in the Azure portal, you can edit your [*workflows*](logic-apps-overview.md#logic-app-concepts) visually or programmatically. After you open a [*logic app* resource](logic-apps-overview.md#logic-app-concepts) in the portal, on the resource menu under **Developer**, you can select between [**Code** view](#code-view) and **Designer** view. When you want to visually develop, edit, and run your workflow, select the designer view. You can switch between the designer view and code view at any time.

> [!IMPORTANT]
> Currently, the latest version of the designer is available only for *Standard* logic app resources, which run in the 
> *single-tenant* Azure Logic Apps environment. For more information about different resource types and runtime 
> environments in Logic Apps, review [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md).

:::image type="content" source="./media/designer-overview/choose-developer-view.png" alt-text="Screenshot of a logic app resource page in the Azure portal, showing the sidebar options to view a workflow in Code or Designer view.":::

When you select the **Designer** view, your workflow opens in the workflow designer.

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot that shows the workflow designer and a sample enterprise workflow that uses switches and conditions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

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
