---
title: Navigate the Standard Workflow Designer
description: Learn to open and navigate the designer in the Azure portal so you can create and run Standard workflows in single-tenant Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 11/18/2025
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer working with Azure Logic Apps, I want to learn how to navigate the designer and complete basic tasks for creating and managing for Standard workflows.
---

# Navigate the Standard workflow designer in single-tenant Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

This guide summarizes common tasks for using the designer to create, edit, and run Standard workflows in the Azure portal. You can also find highlights and key changes between the classic designer and preview designer.

For example, the preview designer has the following key changes:

- The designer now shows and saves your workflow as a *draft* version, not the production version. 

- The designer toolbar options are now consolidated. The workflow sidebar no longer exists.

  Instead, commonly used options now appear at the designer top and bottom. Other options appear in the vertical ellipsis menu (**⋮**), next to the **Publish** button.

For more detailed changes, see [Differences in the preview designer](#differences-in-the-preview-designer).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Standard logic app resource in single-tenant Azure Logic Apps. This logic app can have either no workflows or existing workflows.

  For more information, see [Create a Standard logic app workflow with the Azure portal](create-single-tenant-workflows-azure-portal.md).

## Differences in the preview designer

To help you quickly learn the preview designer layout, this section summarizes the key differences from classic designer.

- By default, the designer now shows and saves your workflow as a *draft* version, not the production version.

- Your production workflow stays unchanged until you publish your draft workflow.

- When you run the workflow from the designer, the draft workflow runs, not the production workflow.

- To view the production workflow, in the designer upper-right corner, open the vertical ellipsis menu (**⋮**), and select **Switch to published version**.

  The production workflow opens in read-only view.

- The preview designer moves many familiar actions to new locations:

  - To open different views for your workflow, at the designer top, on the [view selector](#switch-between-designer-code-and-run-history-views), select **Workflow**, **Code**, or **Run history**.

  - To run your draft workflow, use the **Run** and **Run with payload** options at the designer bottom.

  - In the designer upper-right corner, the new vertical ellipsis menu (**⋮**) appears next to the new **Publish** button. This menu contains other actions that appeared on the workflow sidebar and workflow toolbar.

- The workflow assistant is available only in the classic designer.

## Open the workflow designer

Follow these steps to open the workflow designer.

### [Classic designer](#tab/classic)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app sidebar, under **Workflows**, select **Workflows**.

   From here, you can [create a new workflow](#create-a-new-workflow) or [open an existing workflow in the designer](#open-an-existing-workflow-in-the-designer).

### [Preview designer](#tab/preview)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app sidebar, under **Workflows**, select **Workflows**.

    From here, you can [create a new workflow](#create-a-new-workflow) or [open an existing workflow in the designer](#open-an-existing-workflow-in-the-designer).

1. To open the preview designer, in the banner, select **Enable preview**.
   
   :::image type="content" source="media/designer-overview/enable-preview.png" alt-text="A screenshot of the Workflows options in the working pane of the Azure portal with the Enable preview button emphasized. ":::

---

## Create a new workflow

### [Classic designer](#tab/classic)

Follow these steps to create a new workflow in your logic app.

1. On the **Workflows** page toolbar, select **+ Create**.

   The **Create workflow** pane appears and shows the available workflow types.

1. For **Workflow name**, enter a name for your workflow.

1. Select from the following workflow types:

   | Workflow type | Description |
   |---------------|-------------|
   | **Autonomous agents** | Stateful workflows that use AI agents to complete tasks. They can start with any trigger, such as an event, schedule, or API call. |
   | **Conversational agents** | Stateful workflows that use AI agents to complete tasks through chat interactions. |
   | **Stateful** | Workflows that include run history. You can add agents to build intelligent automation integrations. |
   | **Stateless** | Workflows that don't include run history. Optimized for speed and ideal for request-response and processing IoT events. |

1. When you're done, select **Create**.

   The designer opens and shows an empty workflow or a partial workflow, based on your selection. In most cases, the workflow includes a prompt to add a trigger.

### [Preview designer](#tab/preview)

Follow these steps to create a new workflow in your logic app.

1. On the **Workflows** page toolbar, select **+ Create**.

   The **Create workflow** pane appears and shows the available workflow types.

   :::image type="content" source="media/designer-overview/create-workflow.png" alt-text="Screenshot shows workflow types available in preview experience." lightbox="media/designer-overview/create-workflow.png":::   

1. For **Workflow name**, enter a name for your workflow.

1. Select from the following workflow types:

   | Workflow type | Description |
   |---------------|-------------|
   | **Stateful** | Workflows that include run history. You can also create autonomous or conversational agent workflows to build intelligent automation integrations. |
   | **Stateless** | Workflows that don't include run history. Optimized for speed and ideal for request-response and processing IoT events. |
   | **Start from template** | Select a prebuilt workflow template that supports a common automation pattern or scenario. |

   > [!IMPORTANT]
   >
   > To create agent workflows, make sure that you select **Stateful**.

1. When you're done, select **Create**.

   The designer opens and shows an empty workflow or a partial workflow, based on your selection. In most cases, the workflow includes a prompt to add a trigger.

---

## Open an existing workflow in the designer

Follow these steps to open an existing workflow in your logic app.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app sidebar, under **Workflows**, select **Workflows**.

1. On the **Workflows** page, select your workflow.

   The designer opens and shows the selected workflow so that you can edit the steps, run the draft workflow, view the workflow run history, view the JSON workflow definition in code view, or other tasks.

## Add a trigger or action to a workflow

The designer provides a visual way to add, edit, and delete steps in your workflow. As the first step, always start by adding a [*trigger*](logic-apps-overview.md#logic-app-concepts) to start your workflow. You can then continue building the workflow by adding one or multiple [*actions*](logic-apps-overview.md#logic-app-concepts) that run after the trigger fires.

To add a trigger or an action to your Standard workflow, see [Build a workflow with a trigger or action in Azure Logic Apps](create-workflow-with-trigger-or-action.md). Then, configure your trigger or action as needed.

- Required parameters show a red asterisk (&ast;) next to the parameter name.

- Some triggers and actions might require you to create a connection for a service or product. You might need to sign in to an account, or enter user credentials. For example, to use the Office 365 Outlook connector action for sending an email, you need to authorize your Outlook email account.

- Some trigger or action parameters let you provide expressions or dynamic content, which are outputs from previous steps, rather than hardcoded or static values.

## Save your changes

### [Classic designer](#tab/classic)

You must manually save your changes. On the designer toolbar, select **Save**.

### [Preview designer](#tab/preview)

No separate **Save** option exists. As you edit the workflow, your changes are automatically saved as a draft.

---

If validation errors happen when save operations, the designer shows validation messages.

## Switch between designer, code, and run history views

### [Classic designer](#tab/classic)

On the workflow sidebar, under **Tools**, you can choose from the following views: **Workflow**, **Code**, and **Run history**.

- To build, edit, and run your workflow, select **Workflow**.

- To edit the workflow definition in JSON, select **Code**.

  > [!TIP]
  >
  > **Code** view is an easy way to find and copy the workflow definition, rather than use Azure CLI or other methods.

- To view your workflow run history, chronological execution, operation status, inputs, and outputs, select **Run history**.

### [Preview designer](#tab/preview)

At the designer top, you can choose from the following views: **Workflow**, **Code**, and **Run history**.

:::image type="content" source="media/designer-overview/view-selector.png" alt-text="Screenshot shows the preview designer and the view selector at the top." lightbox="media/designer-overview/view-selector.png":::

- To build, edit, and run your workflow, select **Workflow**.

- To edit the workflow definition in JSON, select **Code**.

   You can switch between designer view and code view anytime. The preview experience automatically saves your workflow.

    > [!TIP]
    >
    > **Code** view is an easy way to find and copy the workflow definition, rather than use Azure CLI or other methods.

- To view your workflow run history, chronological execution, operation status, inputs, and outputs, select **Run history**.

---

## Run workflow

### [Classic designer](#tab/classic)

To run your workflow, on the designer toolbar, select **Run** or **Run with payload**.

### [Preview designer](#tab/preview)

To run your workflow, at the designer bottom, select **Run** or **Run with payload**.

> [!NOTE]
>
> If you run the production workflow in read-only view, the Azure portal returns you to the classic designer.

---

## Validate changes and deploy to production

### [Classic designer](#tab/classic)

When you save your workflow, the Azure portal automatically validates and publishes your changes to production.

### [Preview designer](#tab/preview)

In the designer upper-right corner, select **Publish**.

---

## Return to classic designer

To go back to using the classic designer, in the preview designer upper-right corner, from the vertical ellipsis menu (**⋮**), select **Revert to previous experience**.

## Other tasks

You can perform other tasks on your workflow. You'll find the options for these tasks in different locations, based on the classic designer or preview designer.

### [Classic designer](#tab/classic)

You can find other actions either on the workflow toolbar or workflow sidebar.

The workflow toolbar includes these additional options:

| Options | Description |
|---------|-------------|
| **Discard** | Discard changes since the last manual save. |
| **Parameters** | Create workflow parameters across environments. See [Create cross-environment parameters for workflow inputs](create-parameters-workflows.md). |
| **Connections** | View connections in your workflow. |
| **Errors** | View workflow validation errors. |
| **AI** > **Assistant** | Open the workflow assistant. See [Get AI-powered help about Standard workflows in Azure Logic Apps](workflow-assistant-standard.md). |
| **AI** > **Download workflow summary** | Generate a Markdown file that summaries the workflow's purpose and tasks. |
| **Info** > **File a bug** | Create a bug in the GitHub issues for Azure Logic Apps. |

The workflow sidebar includes these options under **Configuration**:

| Options | Description |
|---------|-------------|
| **Access keys** | View or regenerate workflow access keys. |
| **Settings** | View workflow state or change the state between **Enabled** and **Disabled**. |
| **Properties** | View workflow health, version, and other information. |

### [Preview designer](#tab/preview)

The preview designer moves many other options into the vertical ellipsis menu (**⋮**), which you can find next to the **Publish** button in the designer's upper-right corner.

:::image type="content" source="media/designer-overview/ellipsis.png" alt-text="Screenshot shows the preview designer and toolbar with vertical ellipsis menu next to the Publish button." lightbox="media/designer-overview/ellipsis.png":::

 The vertical ellipsis menu (**:**) includes these options:

| Options | Description |
|---------|-------------|
| **Discard changes** | Discard any changes since the last automatic save. |
| **Switch to published version** | View the production workflow, which opens in read-only view. |
| **Parameters** | Create workflow parameters across environments. See [Create cross-environment parameters for workflow inputs](create-parameters-workflows.md). |
| **Connections** | View connections in your workflow. |
| **Errors** | View workflow validation errors. |
| **Disable workflow** or **Enable workflow** | Change the workflow state between enabled and disabled. |
| **Info** | View workflow health, version, and other information. |
| **Settings** | View or regenerate workflow access keys. |
| **Send feedback** | Provide feedback using the Microsoft survey pane. |

---

## Related content

- [Create Standard workflows in single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md)
