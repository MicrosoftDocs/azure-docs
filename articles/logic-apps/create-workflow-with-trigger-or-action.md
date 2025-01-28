---
title: Create a workflow with a trigger or action
description: Start building your workflow by adding a trigger or an action in Azure Logic Apps.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/27/2025
# As an Azure Logic Apps developer, I want to create a workflow using trigger and action operations in Azure Logic Apps.
---

# Build a workflow with a trigger or action in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This how-to guide shows how to start your workflow by adding a *trigger* and then continue your workflow by adding an *action*. The trigger is always the first step in any workflow and specifies the condition to meet before your workflow can start to run. Following the trigger, you have to add one or more subsequent actions for your workflow to perform the tasks that you want. The trigger and actions work together to define your workflow's logic and structure.

This guide shows the steps for Consumption and Standard logic app workflows.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To add a trigger, you have to start with a logic app resource and a blank workflow.

- To add an action, you have to start with a logic app resource and a workflow that minimally has a trigger.

The following steps use the Azure portal, but you can also use the following tools to build a logic app workflow:

  - Consumption workflows: [Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
  - Standard workflows: [Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

<a name="add-trigger"></a>

## Add a trigger to start your workflow

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and blank workflow in the designer.

1. On the designer, select **Add a trigger**, if not already selected.

   The **Add a trigger** pane opens and shows the available connectors that provide triggers, for example:

   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-triggers-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow designer, and pane named Add a trigger." lightbox="media/create-workflow-with-trigger-or-action/designer-overview-triggers-consumption.png":::

1. Choose either option:

   - To filter the connectors by name, in the search box, enter the name for the connector or trigger that you want.

   - To filter the connectors based on the following groups, from the **Runtime** list, select either **In-App**, **Shared**, or **Custom**, based on the group that contains the trigger that you want.

     | Runtime | Description |
     |---------|-------------|
     | **In-App** | Operation collections with triggers that run directly and natively within the Azure Logic Apps runtime. In the legacy designer, this group is the same as the legacy **Built-in** group. |
     | **Shared** | Connectors with triggers that are Microsoft-managed, hosted, and run in multitenant Azure. In the legacy designer, this group combines the legacy **Standard** and **Enterprise** groups. |
     | **Custom** | Any connectors with triggers that you created and installed. |

     The following example shows the designer for a Consumption logic app with a blank workflow and shows the **In-App** runtime selected. The list shows the available operation collections, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-triggers-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow designer, pane named Add a trigger, and Runtime set to In-App." lightbox="media/create-workflow-with-trigger-or-action/in-app-connectors-triggers-consumption.png":::

     The following example shows the designer for a Consumption logic app with a blank workflow and shows the **Shared** runtime selected. The list shows the available connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-triggers-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow designer, pane named Add a trigger, and Runtime set to Shared." lightbox="media/create-workflow-with-trigger-or-action/shared-connectors-triggers-consumption.png":::

1. In the search box, enter the name for the connector or trigger that you want to find.

1. From the results list, select the trigger that you want. If a connector has more triggers that aren't shown, select **See more**.

1. If the **Create Connection** pane appears, provide any necessary connection information, which differs based on the connector. When you're done, select **Sign in** or **Create New** to complete the connection.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app and blank workflow in the preview designer.

1. On the designer, select **Add a trigger**, if not already selected.

   The **Add a trigger** pane opens and shows the available connectors that provide triggers, for example:

   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-triggers-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and pane named Add a trigger." lightbox="media/create-workflow-with-trigger-or-action/designer-overview-triggers-standard.png":::

1. Choose either option:

   - To filter the connectors or triggers list by name, in the search box, enter the name for the connector or trigger that you want.

   - To filter the connectors based on the following groups, from the **Runtime** list, select either **In-App**, **Shared**, or **Custom**, based on the group that contains the trigger that you want.

     | Runtime | Description |
     |---------|-------------|
     | **In-App** | Operation collections with triggers that run directly and natively within the Azure Logic Apps runtime. In the legacy designer, this group is the same as the legacy **Built-in** group. |
     | **Shared** | For stateful workflows only, connectors with triggers that are Microsoft-managed, hosted, and run in multitenant Azure. In the legacy designer, this group is the same as the **Azure** group. |
     | **Custom** | Any connectors with triggers that you created and installed. |

     The following example shows the designer for a Standard logic app with a blank workflow and shows the **In-App** runtime selected. The list shows the available operation collections, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-triggers-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, pane named Add a trigger, and Runtime set to In-App." lightbox="media/create-workflow-with-trigger-or-action/in-app-connectors-triggers-standard.png":::

     The following example shows the designer for a Standard logic app with a blank workflow and shows the **Shared** runtime selected. The list shows the available connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-triggers-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, pane named Add a trigger, and Runtime set to Shared." lightbox="media/create-workflow-with-trigger-or-action/shared-connectors-triggers-standard.png":::

1. From the results list, select the trigger that you want. If a connector has more triggers that aren't shown, select **See more**.

1. If the **Create Connection** pane appears, provide any necessary connection information, which differs based on the connector. When you're done, select **Sign in** or **Create New** to complete the connection.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

<a name="add-action"></a>

## Add an action to run a task

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and workflow in the designer.

1. On the designer, choose either option:

   * To add the action under the last step in the workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the action between existing steps, select the plus sign (**+**) on the connecting arrow, and then select **Add an action**.

   The **Add an action** pane opens and shows the available connectors that provide actions, for example:

   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-actions-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow designer, and pane named Add an action." lightbox="media/create-workflow-with-trigger-or-action/designer-overview-actions-consumption.png":::

1. Choose either option:

   - To filter the connectors by name, in the search box, enter the name for the connector or action that you want.

   - To filter the connectors based on the following groups, from the **Runtime** list, select either **In-App**, **Shared**, or **Custom**, based on the group that contains the action that you want.

     | Runtime | Description |
     |---------|-------------|
     | **In-App** | Operation collections with actions that run directly and natively within the Azure Logic Apps runtime. In the legacy designer, this group is the same as the legacy **Built-in** group. |
     | **Shared** | Connectors with actions that are Microsoft-managed, hosted, and run in multitenant Azure. In the legacy designer, this group combines the legacy **Standard** and **Enterprise** groups. |
     | **Custom** | Any connectors with actions that you created and installed. |

     The following example shows the designer for a Consumption logic app workflow with an existing trigger and shows the **In-App** runtime selected. The list shows the available operation collections, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-actions-consumption.png" alt-text="Screenshot shows Azure portal, designer for Consumption workflow with existing trigger, pane named Add an action, and Runtime set to In-App." lightbox="media/create-workflow-with-trigger-or-action/in-app-connectors-actions-consumption.png":::

     The following example shows the designer for a Consumption logic app workflow with an existing trigger and shows the **Shared** runtime selected. The list shows the available connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-actions-consumption.png" alt-text="Screenshot shows Azure portal, designer for Consumption workflow with existing trigger, pane named Add a trigger, and Runtime set to Shared." lightbox="media/create-workflow-with-trigger-or-action/shared-connectors-actions-consumption.png":::

1. In the search box, enter the name for the connector or action that you want to find.

1. From the results list, select the action that you want. If a connector has more actions that aren't shown, select **See more**.

1. If the **Create Connection** pane appears, provide any necessary connection information, which differs based on the connector. When you're done, select **Sign in** or **Create New** to complete the connection.

1. After the action information box appears, provide the necessary details for your selected action.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app and workflow in the designer.

1. On the designer, choose either option:

   * To add the action under the last step in the workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the action between existing steps, select the plus sign (**+**) on the connecting arrow, and then select **Add an action**.

   The **Add an action** pane opens and shows the available connectors that provide actions, for example:

   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-actions-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard logic app workflow with existing trigger, and pane named Add an action." lightbox="media/create-workflow-with-trigger-or-action/designer-overview-actions-standard.png":::

1. Choose either option:

   - To filter the connectors by name, in the search box, enter the name for the connector or action that you want.

   - To filter the connectors based on the following groups, from the **Runtime** list, select either **In-App**, **Shared**, or **Custom**, based on the group that contains the action that you want.

     | Runtime | Description |
     |---------|-------------|
     | **In-App** | Operation collections with actions that run directly and natively within the Azure Logic Apps runtime. In the legacy designer, this group is the same as the legacy **Built-in** group. |
     | **Shared** | For stateful workflows only, connectors with actions that are Microsoft-managed, hosted, and run in multitenant Azure. In the legacy designer, this group is the same as the **Azure** group. |
     | **Custom** | Any connectors with actions that you created and installed. |

     The following example shows the designer for a Standard workflow with an existing trigger and shows the **In-App** group selected. The list shows the available operation collections and connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-actions-standard.png" alt-text="Screenshot showing Azure portal, the designer for Standard logic app workflow with a trigger, and In-App connectors with actions gallery.":::

     The following example shows the designer for a Standard workflow with an existing trigger and shows the **Shared** group selected. The list shows the available operation collections and connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-actions-standard.png" alt-text="Screenshot showing Azure portal, the designer for Standard logic app workflow with a trigger, and Shared connectors with actions gallery.":::

1. From the operation collection or connector list, select the collection or connector that you want. After the actions list appears, select the action that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

<a name="connectors-triggers-actions-designer"></a>

## Connectors, triggers, and actions in the designer

In the workflow designer, you can select from hundreds of triggers and actions, collectively called *operations*. Azure Logic Apps organizes these operations into either collections, such as **Schedule**, **HTTP**, and **Data Operations**, or as connectors, such as **Azure Service Bus**, **SQL Server**, **Azure Blob Storage**, and **Office 365 Outlook**. These collections can include triggers, actions, or both.

In the **Add a trigger** or **Add an action** pane, the gallery lists the available operation collections and connectors organized from left to right in ascending order, first numerically if any exist, and then alphabetically. After you select a collection or connector, the triggers or actions appear in ascending order alphabetically.

### In-App (built-in) operations

The following example shows the **In-App** operations collections and connectors when you add a trigger:

:::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-triggers-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard logic app with blank stateful workflow, and In-App operations collections and connectors." lightbox="media/create-workflow-with-trigger-or-action/in-app-connectors-triggers-standard.png":::

After you select a collection or connector, the individual triggers are grouped by collection or connector name and appear in ascending order, first numerically if any exist, and then alphabetically. 

The following example selected the **Schedule** operations collection and shows the trigger named **Recurrence**:

:::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-selected-connector-triggers.png" alt-text="Screenshot shows Azure portal, designer for Standard logic app with blank stateful workflow, and Schedule operations collection with Recurrence trigger." lightbox="media/create-workflow-with-trigger-or-action/in-app-selected-connector-triggers.png":::

The following example shows the **In-App** collections and connectors when you add an action:

:::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-actions-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard logic app stateful workflow with Recurrence trigger, pane named Add an action, and Runtime set to In-App." lightbox="media/create-workflow-with-trigger-or-action/in-app-connectors-actions-standard.png":::

The following example selected the **Azure Queue Storage** connector and shows the available actions:

:::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-selected-connector-actions.png" alt-text="Screenshot shows Azure portal, designer for Standard logic app stateful workflow with Azure Queue Storage connector with actions." lightbox="media/create-workflow-with-trigger-or-action/in-app-selected-connector-actions.png":::

### Shared (Azure) operations

The following example shows the **Shared** connectors gallery when you add a trigger:

:::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-triggers-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard logic app with blank stateful workflow, and Shared connectors with triggers." lightbox="media/create-workflow-with-trigger-or-action/shared-connectors-triggers-standard.png":::

After you select a collection or connector, the individual triggers are grouped by collection or connector name and appear in ascending order, first numerically if any exist, and then alphabetically. 

The following example selected the **365 Training** connector and shows the available triggers:

:::image type="content" source="media/create-workflow-with-trigger-or-action/shared-selected-connector-triggers.png" alt-text="Screenshot shows Azure portal, workflow designer, and 365 Training connector with triggers." lightbox="media/create-workflow-with-trigger-or-action/shared-selected-connector-triggers.png":::

The following example shows the **Shared** connectors gallery when you add an action:

:::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-actions-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard logic app stateful workflow, and Shared connectors with actions." lightbox="media/create-workflow-with-trigger-or-action/shared-connectors-actions-standard.png":::

The following example selected the **365 Training** connector and shows the available actions:

:::image type="content" source="media/create-workflow-with-trigger-or-action/shared-selected-connector-actions.png" alt-text="Screenshot shows Azure portal, workflow designer, and 365 Training connector with actions." lightbox="media/create-workflow-with-trigger-or-action/shared-selected-connector-actions.png":::

For more information, see the following documentation:

- [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
- [Microsoft-managed connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Custom connectors in Azure Logic Apps](custom-connector-overview.md)
- [Billing and pricing for operations in Consumption workflows](logic-apps-pricing.md#consumption-operations)
- [Billing and pricing for operations in Standard workflows](logic-apps-pricing.md#standard-operations)

## Next steps

[General information about connectors, triggers, and actions](/connectors/connectors)
