---
title: About single-tenant workflow designer
description: Learn how the designer in single-tenant Azure Logic Apps helps you visually create workflows through the Azure portal. Discover the benefits and features in this latest version.
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: conceptual
ms.date: 06/29/2021
---

# About the workflow designer in single-tenant Azure Logic Apps

When you work with Azure Logic Apps in the Azure portal, you can edit your [*workflows*](logic-apps-overview.md#workflow) visually or programmatically. After you open a [*logic app* resource](logic-apps-overview.md#logic-app) in the portal, on the resource menu under **Developer**, you can select between [**Code** view](#code-view) and **Designer** view. When you want to visually develop, edit, and run your workflow, select the designer view. You can switch between the designer view and code view at any time.

> [!IMPORTANT]
> Currently, the latest version of the designer is available only for *Standard* logic app resources, which run in the 
> *single-tenant* Azure Logic Apps environment. For more information about different resource types and runtime 
> environments in Logic Apps, review [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md).

:::image type="content" source="./media/designer-overview/choose-developer-view.png" alt-text="Screenshot of a logic app resource page in the Azure portal, showing the sidebar options to view a workflow in Code or Designer view.":::

When you select the **Designer** view, your workflow opens in the workflow designer.

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot that shows the workflow designer and a sample enterprise workflow that uses switches and conditions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).
- A *Standard* logic app resource [in a single-tenant environment](single-tenant-overview-compare.md). For more information, see [Create an integration workflow with single-tenant Azure Logic Apps (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md).
- A workflow for your single-tenant logic app.

## Latest version features

The latest workflow designer offers a new experience with noteworthy features and benefits, for example:

- A new layout engine that supports more complicated workflows. 
- You can create and view complicated workflows cleanly and easily, thanks to the new layout engine, a more compact canvas, and updates to the card-based layout.
- Panels for [adding and editing steps in your workflow](#add-steps-to-workflows). This change separates your overall layout from your step configuration for clarity.
- Keyboard navigation of your workflows to move between cards in the designer.
    - Use **Ctrl** + **Down Arrow (&darr;)** to move to the next card.
    - Use **Ctrl** + **Up Arrow (&uarr;)** to move to the previous card.

## Add steps to workflows

The Logic Apps designer provides a graphical user interface to add, edit, and delete steps in your workflow. First, add a  [*trigger*](logic-apps-overview.md#trigger) as the initial step in your workflow. Then, add one or more [*actions*](logic-apps-overview.md#action) to complete your workflow. 

To add either type of step to your workflow:

1. Open your workflow in the Logic Apps designer.
1. Select **Choose an operation**. A new pane opens, called either **Add a trigger** or **Add an action**. 
1. In the pane that opens, filter the list of available operations to find the one you want. You can:
    1. Enter a service, connector, or category in the search bar to show related operations. For example, `Azure Cosmos DB` or `Data Operations`. 
    1. If you know the specific operation you want to use, enter the name in the search bar. For example, `Call an Azure function` or `When an HTTP request is received`.
    1. Select the **Built-in** tab to only show categories of [*built-in operations*](logic-apps-overview.md#built-in-operations). Or, select the **Azure** tab to show other categories of operations available through Azure.
    1. Select the **Triggers** tab to only show triggers. Or, select the **Actions** tab to only show actions. Some services and connectors don't offer both triggers and actions. 
    :::image type="content" source="./media/designer-overview/designer-add-operation.png" alt-text="Screenshot of the Logic Apps designer in the Azure portal, showing a workflow being edited to add a new operation." lightbox="./media/designer-overview/designer-add-operation.png":::
1. Select the operation you want to use. 
    :::image type="content" source="./media/designer-overview/designer-filter-operations.png" alt-text="Screenshot of the Logic Apps designer, showing a pane of possible operations that can be filtered by service or name." lightbox="./media/designer-overview/designer-filter-operations.png":::
1. Configure your trigger or action as needed.
    1. Mandatory fields have a red asterisk (&ast;) in front of the name.
    1. Some triggers and actions might require you to create a connection to another service. You might need to sign into an account, or enter credentials for a service. For example, if you want to use the Office 365 Outlook connector to send an email, you need to authorize your Outlook email account.
    1. Some triggers and actions use dynamic content, where you can select variables instead of entering information or expressions.
1. Select **Save** in the toolbar to save your changes. This step also verifies that your workflow is valid. 

## Code view

The **Code** view allows you to directly edit the workflow definition file in JSON format. Make sure to select **Save** to save any changes you make in this view. 

> [!TIP]
> The **Code** view is also an easy way to find and copy the workflow definition, instead of using the Azure Command Line Interface (Azure CLI) or other methods.

:::image type="content" source="./media/designer-overview/code-view.png" alt-text="Screenshot of a Logic Apps workflow in Code view, showing the JSON workflow definition being edited in the Azure portal.":::


## Next steps

> [!div class="nextstepaction"]
> [Create an integration workflow with single-tenant Azure Logic Apps (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md)
