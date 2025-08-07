---
title: Add a Trigger or Action to a Workflow
description: Learn how to add a trigger or an action to create a workflow in Azure Logic Apps.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 05/19/2025
# As an integration solution developer, I want to build an integration workflow by adding a trigger or an action operation in Azure Logic Apps.
ms.custom:
  - build-2025
---

# Add a trigger or action to build a workflow in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To start any workflow in Azure Logic Apps, always add a *trigger* as the first step. You then continue the workflow by adding an *action*. The trigger specifies either the schedule to use or a condition to meet for your workflow to run.

Following the trigger, you have to add one or more subsequent actions so that your workflow performs the tasks that you want. The trigger and actions work together to define your workflow's logic and structure.

This guide shows how to add a trigger and action for Consumption and Standard logic app workflows.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A logic app resource and workflow, based on whether you want to add a trigger or an action:

  | Add a | Prerequisite |
  |-------|--------------|
  | Trigger | You have to start with a logic app resource and a blank workflow. |
  | Action | You have to start with a logic app resource and a workflow with the trigger at least. You can use any trigger that fits your specific scenario. |

  For more information, see the following documentation:

  - [Create an example Consumption logic app workflow in the Azure portal](quickstart-create-example-consumption-workflow.md)

  - [Create an example Standard logic app workflow in the Azure portal](create-single-tenant-workflows-azure-portal.md)

  Although this guide's examples use the Azure portal, you can also use Visual Studio Code to build a logic app workflow. For more information, see the following documentation:

  - [Create Consumption logic app workflows in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)

  - [Create Standard logic app workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

<a name="add-trigger"></a>

## Add a trigger to start your workflow

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource and blank workflow in the designer.

1. On the designer, select **Add a trigger**, if not already selected.

   The **Add a trigger** pane opens and shows the available operation collections and connectors that provide triggers, for example:

   :::image type="content" source="media/add-trigger-action-workflow/designer-overview-triggers-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow designer, and pane named Add a trigger." lightbox="media/add-trigger-action-workflow/designer-overview-triggers-consumption.png":::

1. Choose either option:

   | Filter by | Steps and description |
   |-----------|-----------------------|
   | By name | In the search box, enter the name for the connector, operation collection, or trigger that you want, for example: <br><br>- **Outlook.com**: A connector that includes various triggers for working with your Outlook account. <br><br>- **Schedule**: An operation collection that includes triggers such as **Recurrence** and **Sliding Window**. <br><br>- **When a new email arrives**: A trigger that starts the workflow when a new message arrives in the specified email account. |
   | By runtime location | Under **By Connector**, select one of the following options: <br><br>- **Built-in**: Operation collections with triggers that run directly and natively with the Azure Logic Apps runtime. <br><br>- **Shared**: Connectors with triggers that are Microsoft-managed, hosted, and run in multitenant Azure. This group combines the legacy **Standard** and **Enterprise** groups in earlier designer versions. <br><br>- **Custom**: Any connectors with triggers that you created and installed. |

   The following example shows the blank workflow designer with the opened **Add a trigger** pane and the selected **Built-in** option. The list shows the available operation collections, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

   :::image type="content" source="media/add-trigger-action-workflow/built-in-triggers-consumption.png" alt-text="Screenshot shows Consumption blank workflow designer and pane named Add a trigger. In the By Connector section, the Built-in option is selected." lightbox="media/add-trigger-action-workflow/built-in-triggers-consumption.png":::

   The following example shows the blank workflow designer with the opened **Add a trigger** pane open and the selected **Shared** option. The list shows the available connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

   :::image type="content" source="media/add-trigger-action-workflow/shared-triggers-consumption.png" alt-text="Screenshot shows Consumption blank workflow designer and pane named Add a trigger. In the By Connector section, the Shared option is selected." lightbox="media/add-trigger-action-workflow/shared-triggers-consumption.png":::

1. From the triggers list, select the trigger that you want. If more triggers exist than are shown, select **See more**.

1. If the **Create connection** pane appears, provide the required connection information, which differs based on the connector. When you're done, select **Sign in** or **Create new** to complete the connection.

1. After the trigger information box appears, provide the information for the selected trigger.

1. Save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and blank workflow in the designer.

1. On the designer, select **Add a trigger**, if not already selected.

   The **Add a trigger** pane opens and shows the available connectors that provide triggers, for example:

   :::image type="content" source="media/add-trigger-action-workflow/designer-overview-triggers-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and pane named Add a trigger." lightbox="media/add-trigger-action-workflow/designer-overview-triggers-standard.png":::

1. Choose either option:

   | Filter by | Steps and description |
   |-----------|-----------------------|
   | By name | In the search box, enter the name for the connector, operation collection, or trigger that you want, for example: <br><br>- **Outlook.com**: A connector that includes various triggers for working with your Outlook account. <br><br>- **Schedule**: An operation collection that includes triggers such as **Recurrence** and **Sliding Window**. <br><br>- **When a new email arrives**: A trigger that starts the workflow when a new message arrives in the specified email account. |
   | By runtime location | Under **By Connector**, select one of the following options: <br><br>- **Built-in**: Operation collections with triggers that run directly and natively with the Azure Logic Apps runtime. <br><br>- **Shared**: Connectors with triggers that are Microsoft-managed, hosted, and run in multitenant Azure. This group combines the legacy **Standard** and **Enterprise** groups in earlier designer versions. <br><br>- **Custom**: Any connectors with triggers that you created and installed. |

   The following example shows the blank workflow designer with the **Add a trigger** pane open the **Built-in** option selected. The list shows the available operation collections, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

   :::image type="content" source="media/add-trigger-action-workflow/built-in-triggers-standard.png" alt-text="Screenshot shows Standard blank workflow designer and pane named Add a trigger. In the By Connector section, the Built-in option is selected." lightbox="media/add-trigger-action-workflow/built-in-triggers-standard.png":::

   The following example shows the blank workflow designer with the **Add a trigger** pane open and the **Shared** option selected. The list shows the available connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

   :::image type="content" source="media/add-trigger-action-workflow/shared-triggers-standard.png" alt-text="Screenshot shows Standard blank workflow designer and pane named Add a trigger. In the By Connector section, the Shared option is selected." lightbox="media/add-trigger-action-workflow/shared-triggers-standard.png":::

1. From the triggers list, select the trigger that you want. If more triggers exist than are shown, select **See more**.

1. If the **Create connection** pane appears, provide the required connection information, which differs based on the connector. When you're done, select **Sign in** or **Create new** to complete the connection.

1. After the trigger information box appears, provide the information for the selected trigger.

1. Save your workflow. On the designer toolbar, select **Save**.

---

<a name="add-action"></a>

## Add an action to run a task

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource and workflow in the designer.

1. On the designer, choose either option:

   * To add the action under the last step in the workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the action between existing steps, select the plus sign (**+**) on the connecting arrow, and then select **Add an action**.

   The **Add an action** pane opens and shows the available connectors that provide actions, for example:

   :::image type="content" source="media/add-trigger-action-workflow/designer-overview-actions-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow designer, and pane named Add an action." lightbox="media/add-trigger-action-workflow/designer-overview-actions-consumption.png":::

1. Choose either option:

   | Filter by | Steps and description |
   |-----------|-----------------------|
   | By name | In the search box, enter the name for the connector, operation collection, or action that you want, for example: <br><br>- **Outlook.com**: A connector that includes various actions for working with your Outlook account. <br><br>- **Control**: An operation collection that includes actions such as **Condition** and **For each**. <br><br>- **Send an email (V3)**: An action that sends a message to the specified email account. |
   | By runtime location | Under **By Connector**, select one of the following options: <br><br>- **Built-in**: Operation collections with actions that run directly and natively with the Azure Logic Apps runtime. <br><br>- **Shared**: Connectors with actions that are Microsoft-managed, hosted, and run in multitenant Azure. This group combines the legacy **Standard** and **Enterprise** groups in earlier designer versions. <br><br>- **Custom**: Any connectors with actions that you created and installed. |

   The following example shows the workflow designer with the opened **Add an action** pane and the selected **Built-in** option. The list shows the available operation collections, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

   :::image type="content" source="media/add-trigger-action-workflow/built-in-actions-consumption.png" alt-text="Screenshot shows Consumption workflow designer and pane named Add an action. In the By Connector section, the Built-in option is selected." lightbox="media/add-trigger-action-workflow/built-in-actions-consumption.png":::

   The following example shows the workflow designer with the opened **Add an action** pane and the selected **Shared** option. The list shows the available connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

   :::image type="content" source="media/add-trigger-action-workflow/shared-actions-consumption.png" alt-text="Screenshot shows Consumption workflow designer and pane named Add an action. In the By Connector section, the Shared option is selected." lightbox="media/add-trigger-action-workflow/shared-actions-consumption.png":::

1. From the actions list, select the action that you want. If more actions exist than are shown, select **See more**.

1. If the **Create connection** pane appears, provide the required connection information, which differs based on the connector. When you're done, select **Sign in** or **Create new** to complete the connection.

1. After the action information box appears, provide the information for the selected action.

1. Save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. On the designer, choose either option:

   * To add the action under the last step in the workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the action between existing steps, select the plus sign (**+**) on the connecting arrow, and then select **Add an action**.

   The **Add an action** pane opens and shows the available connectors that provide actions, for example:

   :::image type="content" source="media/add-trigger-action-workflow/designer-overview-actions-standard.png" alt-text="Screenshot shows Standard workflow designer and pane named Add an action." lightbox="media/add-trigger-action-workflow/designer-overview-actions-standard.png":::

1. Choose either option:

   | Filter by | Steps and description |
   |-----------|-----------------------|
   | By name | In the search box, enter the name for the connector, operation collection, or action that you want, for example: <br><br>- **Outlook.com**: A connector that includes various actions for working with your Outlook account. <br><br>- **Control**: An operation collection that includes actions such as **Condition** and **For each**. <br><br>- **Send an email (V3)**: An action that sends a message to the specified email account. |
   | By runtime location | Under **By Connector**, select one of the following options: <br><br>- **Built-in**: Operation collections with actions that run directly and natively with the Azure Logic Apps runtime. <br><br>- **Shared**: Connectors with actions that are Microsoft-managed, hosted, and run in multitenant Azure. This group combines the legacy **Standard** and **Enterprise** groups in earlier designer versions. <br><br>- **Custom**: Any connectors with actions that you created and installed. |

   The following example shows the workflow designer with the opened **Add an action** pane and the selected **Built-in** option. The list shows the available operation collections, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

   :::image type="content" source="media/add-trigger-action-workflow/built-in-actions-standard.png" alt-text="Screenshot shows Standard workflow designer and pane named Add an action. In the By Connector section, the Built-in option is selected." lightbox="media/add-trigger-action-workflow/built-in-actions-standard.png":::

   The following example shows the workflow designer with the opened **Add an action** pane and the selected **Shared** option. The list shows the available operation collections, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

   :::image type="content" source="media/add-trigger-action-workflow/shared-actions-standard.png" alt-text="Screenshot shows Standard workflow designer and pane named Add an action. In the By Connector section, the Shared option is selected." lightbox="media/add-trigger-action-workflow/shared-actions-standard.png":::

1. From the actions list, select the action that you want. If more actions exist than are shown, select **See more**.

1. If the **Create connection** pane appears, provide the required connection information, which differs based on the connector. When you're done, select **Sign in** or **Create new** to complete the connection.

1. After the action information box appears, provide the information for the selected action.

1. Save your workflow. On the designer toolbar, select **Save**.

---

<a name="connectors-triggers-actions-designer"></a>

## Connectors, triggers, and actions in the designer

In the workflow designer, you can select from [1,400+ connector triggers and actions](/connectors/connector-reference/connector-reference-logicapps-connectors), collectively called *operations*. Azure Logic Apps organizes operations into either collections such as **Schedule** and **Data Operations**, or as connectors such as **Azure Blob Storage** and **SQL Server**. Collections and connectors can include triggers, actions, or both.

When the **Add a trigger** or **Add an action** pane opens, the gallery lists the available collections and connectors from left to right, based on popularity. After you select a collection or connector, the available triggers or actions appear in alphabetically in ascending order.

#### Built-in operations

The following Standard workflow example shows the **Built-in** operation collections and connectors when you add a trigger:

:::image type="content" source="media/add-trigger-action-workflow/built-in-triggers-standard.png" alt-text="Screenshot shows Standard workflow designer and Built-in operation collections and connectors." lightbox="media/add-trigger-action-workflow/built-in-triggers-standard.png":::

After you select a collection or connector, triggers appear based on the collection or connector name.

The following example shows the selected **Schedule** collection and its triggers:

:::image type="content" source="media/add-trigger-action-workflow/built-in-selected-triggers.png" alt-text="Screenshot shows Standard workflow designer and Schedule operation collection with Recurrence trigger and Sliding Window trigger." lightbox="media/add-trigger-action-workflow/built-in-selected-triggers.png":::

The following example shows the **Built-in** collections and connectors when you add an action:

:::image type="content" source="media/add-trigger-action-workflow/built-in-actions-standard.png" alt-text="Screenshot shows Standard workflow designer, pane named Add an action, and selected Built-in option." lightbox="media/add-trigger-action-workflow/built-in-actions-standard.png":::

The following example shows the selected **Azure Queue Storage** connector and its actions:

:::image type="content" source="media/add-trigger-action-workflow/built-in-selected-actions.png" alt-text="Screenshot shows Standard workflow designer, pane named Add an action, and Azure Queue Storage connector with actions." lightbox="media/add-trigger-action-workflow/built-in-selected-actions.png":::

### Shared (Azure) operations

The following Standard workflow example shows the **Shared** connectors gallery when you add a trigger:

:::image type="content" source="media/add-trigger-action-workflow/shared-triggers-standard.png" alt-text="Screenshot shows Standard workflow designer and Shared connectors with triggers." lightbox="media/add-trigger-action-workflow/shared-triggers-standard.png":::

After you select a collection or connector, triggers appear based on the collection or connector name.

The following example shows the selected **365 Training** connector and its triggers:

:::image type="content" source="media/add-trigger-action-workflow/shared-selected-triggers.png" alt-text="Screenshot shows Standard workflow designer, and 365 Training connector with triggers." lightbox="media/add-trigger-action-workflow/shared-selected-triggers.png":::

The following example shows the **Shared** connectors gallery when you add an action:

:::image type="content" source="media/add-trigger-action-workflow/shared-actions-standard.png" alt-text="Screenshot shows Standard workflow designer and Shared connectors with actions." lightbox="media/add-trigger-action-workflow/shared-actions-standard.png":::

The following example shows the selected **365 Training** connector and its actions:

:::image type="content" source="media/add-trigger-action-workflow/shared-selected-actions.png" alt-text="Screenshot shows Standard workflow designer and 365 Training connector with actions." lightbox="media/add-trigger-action-workflow/shared-selected-actions.png":::

For more information, see the following documentation:

- [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
- [Microsoft-managed connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Custom connectors in Azure Logic Apps](custom-connector-overview.md)
- [Billing and pricing for operations in Consumption workflows](logic-apps-pricing.md#consumption-operations)
- [Billing and pricing for operations in Standard workflows](logic-apps-pricing.md#standard-operations)

## Related content

[General information about connectors, triggers, and actions](/connectors/connectors)
