---
title: Create a workflow with a trigger or action
description: Start building your workflow by adding a trigger or an action in Azure Logic Apps.
services: logic-apps
ms.service: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 05/23/2023
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

The following steps use the Azure portal, but you can also use the following tools to create a logic app and workflow:

  - Consumption workflows: [Visual Studio](quickstart-create-logic-apps-with-visual-studio.md) or [Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)

  - Standard workflows: [Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

<a name="add-trigger"></a>

## Add a trigger to start your workflow

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and blank workflow in the designer.

1. On the designer, under the search box, select **All** so that you can search all the connectors and triggers by name.

   The following example shows the designer for a blank Consumption logic app workflow with the **All** group selected. The **Triggers** list shows the available triggers, which appear in a specific order. For more information about the way that the designer organizes operation collections, connectors, and the triggers list, see [Connectors, triggers, and actions in the designer](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).
 
   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-all-triggers-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption logic app with blank workflow, and built-in triggers gallery.":::

   To show more connectors with triggers in the gallery, below the connectors row, select the down arrow.

   :::image type="content" source="media/create-workflow-with-trigger-or-action/show-more-connectors-triggers-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption workflow, and down arrow selected to show more connectors with triggers.":::

   The designer uses the following groups to organize connectors and their operations:

   | Group | Description |
   |-------|-------------|
   | **For You** | Any connectors and triggers that you recently used. |
   | **All** | All connectors and triggers in Azure Logic Apps. |
   | **Built-in** | Connectors and triggers that run directly and natively within the Azure Logic Apps runtime. |
   | **Standard** and **Enterprise** | Connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. |
   | **Custom** | Any connectors and actions that you created and installed. |

1. In the search box, enter the name for the connector or trigger that you want to find.

1. From the triggers list, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app and blank workflow in the preview designer.

1. On the designer, select **Add a trigger**, if not already selected.

   The **Add a trigger** pane opens and shows the available connectors with triggers.

   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-triggers-standard.png" alt-text="Screenshot showing Azure portal, the designer for Standard logic app with blank workflow, and connectors with triggers gallery.":::

1. Choose either option:

   - To filter the connectors or triggers list by name, in the search box, enter the name for the connector or trigger that you want.

   - To filter the connectors based on the following groups, open the **Runtime** list, and select either **In-App** or **Shared**, based on the group that contains the trigger that you want.

     | Runtime | Description |
     |-------|-------------|
     | **In-App** | Connectors and triggers that run directly and natively within the Azure Logic Apps runtime. In the previous designer version, this group is the same as the **Built-in** group. |
     | **Shared** | For stateful workflows only, connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. In the previous designer version, this group is the same as the **Azure** group. |

     The following example shows the designer for a Standard logic app with a blank workflow and shows the **In-App** group selected. The list shows the available operation collections and connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-triggers-standard.png" alt-text="Screenshot showing Azure portal, the designer for Standard logic app with blank workflow, and 'In-App' connectors with triggers gallery.":::

     The following example shows the designer for a Standard logic app with a blank workflow and shows the **Shared** group selected. The list shows the available operation collections and connectors, which appear in a [specific order](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

     :::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-triggers-standard.png" alt-text="Screenshot showing Azure portal, the designer for Standard logic app with blank workflow, and 'Shared' connectors with triggers gallery.":::

1. From the operation collection or connector list, select the collection or connector that you want. After the triggers list appears, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

<a name="add-action"></a>

## Add an action to run a task

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and workflow in the designer.

1. On the designer, choose one of the following:

   * To add the action under the last step in the workflow, select **New step**.

   * To add the action between existing steps, move your pointer over the connecting arrow. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. Under the **Choose an operation** search box, select **All** so that you can search all the connectors and actions by name.

   The following example shows the designer for a Consumption logic app workflow with an existing trigger and shows the **All** group selected. The **Actions** list shows the available actions, which appear in a specific order. For more information about the way that the designer organizes operation collections, connectors, and the actions list, see [Connectors, triggers, and actions in the designer](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-all-actions-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption logic app workflow with existing trigger, and built-in actions gallery.":::

   To show more connectors with actions in the gallery, below the connectors row, select the down arrow.

   :::image type="content" source="media/create-workflow-with-trigger-or-action/show-more-connectors-actions-consumption.png" alt-text="Screenshot showing Azure portal, Consumption workflow designer, and down arrow selected to show more connectors with actions.":::

   The designer uses the following groups to organize connectors and their operations:

   | Group | Description |
   |-------|-------------|
   | **For You** | Any connectors and actions that you recently used. |
   | **All** | All connectors and actions in Azure Logic Apps. |
   | **Built-in** | Connectors and actions that run directly and natively within the Azure Logic Apps runtime. |
   | **Standard** and **Enterprise** | Connectors and actions that are Microsoft-managed, hosted, and run in multi-tenant Azure. |
   | **Custom** | Any connectors and actions that you created and installed. |

1. In the search box, enter the name for the connector or action that you want to find.

1. From the actions list, select the action that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app and workflow in the designer.

1. On the designer, choose one of the following:

   * To add the action under the last step in the workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the action between existing steps, select the plus sign (**+**) on the connecting arrow, and then select **Add an action**.

1. On the designer, select **Add an action**, if not already selected.

   The **Add an action** pane opens and shows the available connectors.

   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-actions-standard.png" alt-text="Screenshot showing Azure portal, the designer for Standard logic app with a workflow, and connectors with actions gallery.":::

1. Choose either option:

   - To filter the connectors or actions list by name, in the search box, enter the name for the connector or action that you want.

   - To browse triggers based on the following groups, open the **Filter** list, and select either **In-App** or **Shared**, based on the group that contains the action that you want.

     | Group | Description |
     |-------|-------------|
     | **In-App** | Connectors and actions that run directly and natively within the Azure Logic Apps runtime. In the previous designer, this group is the same as the **Built-in** group. |
     | **Shared** | Connectors and actions that are Microsoft-managed, hosted, and run in multi-tenant Azure. In the previous designer, this group is the same as the **Azure** group. |

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

### [Consumption](#tab/consumption)

Under the search box, a row shows the available operation collections and connectors organized from left to right, based on global popularity and usage. The individual **Triggers** and **Actions** lists are grouped by collection or connector name. These names appear in ascending order, first numerically if any exist, and then alphabetically.

#### Built-in operations

The following example shows the **Built-in** triggers gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/built-in-triggers-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption logic app with blank workflow, and the Built-in triggers gallery.":::

The following example shows the **Built-in** actions gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/built-in-actions-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption logic app workflow with Recurrence trigger, and the Built-in actions gallery.":::

#### Standard operations

The following example shows the **Standard** triggers gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/standard-triggers-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption logic app with blank workflow, and the Standard triggers gallery.":::

The following example shows the **Standard** actions gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/standard-actions-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption logic app workflow with Recurrence trigger, and the Standard actions gallery.":::

#### Enterprise operations

The following example shows the **Enterprise** triggers gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/enterprise-triggers-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption logic app with blank workflow, and the Enterprise triggers gallery.":::

The following example shows the **Enterprise** actions gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/enterprise-actions-consumption.png" alt-text="Screenshot showing Azure portal, designer for Consumption logic app workflow with Recurrence trigger, and the Enterprise actions gallery.":::

For more information, see the following documentation:

- [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
- [Microsoft-managed (Standard and Enterprise) connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Custom connectors in Azure Logic Apps](custom-connector-overview.md)
- [Billing and pricing for operations in Consumption workflows](logic-apps-pricing.md#consumption-operations)

### [Standard](#tab/standard)

In the **Browse operations** pane, the connectors gallery lists the available operation collections and connectors organized from left to right in ascending order, first numerically if any exist, and then alphabetically. After you select a collection or connector, the triggers or actions appear in ascending order alphabetically.

#### In-App (built-in) operations

The following example shows the **In-App** collections and connectors gallery when you add a trigger:

:::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-triggers-standard.png" alt-text="Screenshot showing Azure portal, designer for Standard logic app with blank stateful workflow, and In-App connectors gallery.":::

After you select a collection or connector, the individual triggers are grouped by collection or connector name and appear in ascending order, first numerically if any exist, and then alphabetically. 

The following example selected the **Schedule** operations collection and shows the trigger named **Recurrence**:

:::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-selected-connector-triggers-standard.png" alt-text="Screenshot showing Azure portal, designer for Standard logic app with blank stateful workflow, and 'Schedule' operations collection with the Recurrence trigger.":::

The following example shows the **In-App** collections and connectors gallery when you add an action:

:::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-connectors-actions-standard.png" alt-text="Screenshot showing Azure portal, designer for Standard logic app stateful workflow with Recurrence trigger, and In-App connectors gallery.":::

The following example selected the **Azure Queue Storage** connector and shows the available triggers:

:::image type="content" source="media/create-workflow-with-trigger-or-action/in-app-selected-connector-actions-standard.png" alt-text="Screenshot showing Azure portal, designer for Standard logic app stateful workflow with Azure Queue Storage connector and actions.":::

#### Shared (Azure) operations

The following example shows the **Shared** connectors gallery when you add a trigger:

:::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-triggers-standard.png" alt-text="Screenshot showing Azure portal,  designer for Standard logic app with blank stateful workflow, and Shared connectors for triggers gallery.":::

After you select a collection or connector, the individual triggers are grouped by collection or connector name and appear in ascending order, first numerically if any exist, and then alphabetically. 

The following example selected the **365 Training** connector and shows the available triggers:

:::image type="content" source="media/create-workflow-with-trigger-or-action/shared-selected-connector-triggers-standard.png" alt-text="Screenshot showing Azure portal, designer for Standard logic app with blank stateful workflow with 365 Training connector and triggers.":::

The following example shows the **Shared** connectors gallery when you add an action:

:::image type="content" source="media/create-workflow-with-trigger-or-action/shared-connectors-actions-standard.png" alt-text="Screenshot showing Azure portal, designer for Standard logic app stateful workflow, and Shared connectors for actions gallery.":::

The following example selected the **365 Training** connector and shows the available actions:

:::image type="content" source="media/create-workflow-with-trigger-or-action/shared-selected-connector-actions-standard.png" alt-text="Screenshot showing Azure portal, designer for Standard logic app stateful workflow with 365 Training connector and actions.":::

For more information, see the following documentation:

- [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
- [Microsoft-managed connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in custom connectors in Azure Logic Apps](custom-connector-overview.md)
- [Billing and pricing for operations in Standard workflows](logic-apps-pricing.md#standard-operations)

---

## Next steps

[General information about connectors, triggers, and actions](/connectors/connectors)
