---
title: Create a workflow with a trigger or an action
description: How to start building your workflow by adding operations, such as a trigger or an action, in Azure Logic Apps.
services: logic-apps
ms.service: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/01/2023
# As an Azure Logic Apps developer, I want to create a workflow using trigger and action operations in Azure Logic Apps.
---

# Build a workflow with a trigger or an action in Azure Logic Apps

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

## Add a trigger to start your workflow

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app and blank workflow in the designer.

1. On the designer, under the search box, select **All** so that you can search all the connectors and triggers by name.

   The following example shows the designer for a blank Consumption logic app workflow with the **All** group selected. The **Triggers** list shows all available triggers, which appear in a specific order. For more information about the way that the designer organizes operation collections, connectors, and triggers list, see [Connectors, triggers, and actions in the designer](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).
 
   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-all-triggers-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and built-in triggers gallery.":::

   To show more connectors in the gallery, below the connectors row, select the down arrow.

   :::image type="content" source="media/create-workflow-with-trigger-or-action/show-more-connectors-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with workflow designer, and down arrow selected to show more connectors.":::

1. In the search box, enter the name for the connector or trigger that you want to find.

1. From the triggers list, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app and blank workflow in the designer.

1. On the designer, select **Choose an operation**, if not already selected.

1. On the **Add a trigger** pane, under the search box, select either **Built-in** or **Azure**, based on the trigger that you want to find.

   | Group | Description |
   |-------|-------------|
   | **Built-in** | Connectors and triggers that run directly and natively within the Azure Logic Apps runtime. |
   | **Azure** | Connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. <br><br>**Note**: Stateless workflows have only the **Built-in** group, not the **Azure** group. |

   The following example shows the designer for a blank Standard logic app workflow with the **Built-in** group selected. The **Triggers** list shows the available triggers, which appear in a specific order. For more information about the way that the designer organizes operation collections, connectors, and triggers list, see [Connectors, triggers, and actions in the designer](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).
 
   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-built-in-triggers-standard.png" alt-text="Screenshot showing Azure portal, Standard logic app with blank workflow designer, and built-in triggers gallery.":::

   To show more connectors in the gallery, below the connectors row, select the down arrow.

   :::image type="content" source="media/create-workflow-with-trigger-or-action/show-more-connectors-standard.png" alt-text="Screenshot showing Azure portal, Standard logic app with workflow designer, and down arrow selected to show more connectors.":::

   The following example shows the designer for a blank Standard logic app workflow with the **Azure** group selected. The **Triggers** list shows the available triggers, which appear in a specific order.

   :::image type="content" source="media/create-workflow-with-trigger-or-action/azure-triggers-standard.png" alt-text="Screenshot showing Azure portal, Standard logic app with blank workflow designer, and Azure triggers gallery.":::

1. To filter the list, in the search box, enter the name for the connector or trigger. From the triggers list, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard (Preview)](#tab/standard-preview)

1. In the [Azure portal](https://portal.azure.com), open your logic app and blank workflow in the designer.

1. On the designer, select **Add a trigger**, if not already selected.

   The **Browse operations** pane opens and shows all the available connectors.

1. Choose either option:

   - To filter the connectors or triggers list by name, in the search box, enter the name for the connector or trigger that you want.

   - To browse triggers based on the following groups, open the **Filter** list, and select either **In-App** or **Shared**, based on the group that contains the trigger that you want.

     | Group | Description |
     |-------|-------------|
     | **In-App** | Connectors and triggers that run directly and natively within the Azure Logic Apps runtime. In the non-preview designer, this group is the same as the **Built-in** group. |
     | **Shared** | Connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. In the non-preview designer, this group is the same as the **Azure** group. |

   For more information about the way that the designer organizes operation collections, connectors, and triggers list, see [Connectors, triggers, and actions in the designer](create-workflow-with-trigger-or-action.md?tabs=standard-preview#connectors-triggers-actions-designer).

1. From the operation collection or connector list, select the collection or connector that you want. After the triggers list appears, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

## Add an action to run a task

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow in the designer.

1. On the designer, choose one of the following:

   * To add the action under the last step in the workflow, select **New step**.

   * To add the action between existing steps, move your pointer over the connecting arrow. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. Under the **Choose an operation** search box, select **All** so that you can search all the connectors and actions by name.

   The following example shows the designer for a Consumption logic app workflow, and the **Actions** list shows all available actions, sorted alphabetically by collection name:

   :::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-all-actions-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and built-in actions gallery.":::

   The designer uses the following groups to organize connectors and their operations:

   | Group | Description |
   |-------|-------------|
   | **For You** | Any connectors and actions that you recently used. |
   | **All** | All connectors and actions in Azure Logic Apps. |
   | **Built-in** | Connectors and actions that run directly and natively within the Azure Logic Apps runtime. |
   | **Standard** and **Enterprise** | Connectors and actions that are Microsoft-managed, hosted, and run in multi-tenant Azure. |
   | **Custom** | Any connectors and actions that you created and installed. |

   For more information about the way that the designer organizes operation collections, connectors, and actions list, see [Connectors, triggers, and actions in the designer](create-workflow-with-trigger-or-action.md?tabs=consumption#connectors-triggers-actions-designer).

1. In the search box, enter the name for the connector or action that you want to find.

1. From the triggers list, select the action that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow in the designer.

1. On the designer, choose one of the following:

   * To add the action under the last step in the workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the action between existing steps, select the plus sign (**+**) on the connecting arrow, and then select **Add an action**.

1. On the **Add an action** pane, under the search box, select either **Built-in** or **Azure**, based on the trigger that you want to find.

   | Group | Description |
   |-------|-------------|
   | **Built-in** | Connectors and actions that run directly and natively within the Azure Logic Apps runtime. |
   | **Azure** | Connectors and actions that are Microsoft-managed, hosted, and run in multi-tenant Azure. |

   For more information about the way that the designer organizes operation collections, connectors, and actions list, see [Connectors, triggers, and actions in the designer](create-workflow-with-trigger-or-action.md?tabs=standard#connectors-triggers-actions-designer).

1. To filter the list, in the search box, enter the name for the connector or action. From the actions list, select the action that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard (Preview)](#tab/standard-preview)

1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow in the designer.

1. On the designer, choose one of the following:

   * To add the action under the last step in the workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the action between existing steps, select the plus sign (**+**) on the connecting arrow, and then select **Add an action**.

1. On the designer, select **Add an action**, if not already selected.

   The **Browse operations** pane opens and shows all the available connectors.

1. Choose either option:

   - To filter the connectors or actions list by name, in the search box, enter the name for the connector or action that you want.

   - To browse triggers based on the following groups, open the **Filter** list, and select either **In-App** or **Shared**, based on the group that contains the action that you want.

     | Group | Description |
     |-------|-------------|
     | **In-App** | Connectors and actions that run directly and natively within the Azure Logic Apps runtime. In the non-preview designer, this group is the same as the **Built-in** group. |
     | **Shared** | Connectors and actions that are Microsoft-managed, hosted, and run in multi-tenant Azure. In the non-preview designer, this group is the same as the **Azure** group. |

   For more information about the way that the designer organizes operation collections, connectors, and actions list, see [Connectors, triggers, and actions in the designer](create-workflow-with-trigger-or-action.md?tabs=standard-preview#connectors-triggers-actions-designer).

1. From the operation collection or connector list, select the collection or connector that you want. After the actions list appears, select the action that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

<a name="connectors-triggers-actions-designer"></a>

## Connectors, triggers, and actions in the designer

In the workflow designer, you can select from hundreds of triggers and actions, collectively called *operations*. Azure Logic Apps organizes these operations into either collections, such as **Schedule**, **HTTP**, and **Data Operations**, or as connectors, such as **Azure Service Bus**, **SQL Server**, **Azure Blob Storage**, and **Office 365 Outlook**. These collections can include triggers, actions, or both.

### [Consumption](#tab/consumption)

The designer uses the following groups to organize connectors and their operations:

| Group | Description |
|-------|-------------|
| **For You** | Any connectors and operations that you recently used. |
| **All** | All connectors and operations in Azure Logic Apps. |
| **Built-in** | Connectors and operations that run directly and natively within the Azure Logic Apps runtime. |
| **Standard** and **Enterprise** | Connectors and operations that are Microsoft-managed, hosted, and run in multi-tenant Azure. |
| **Custom** | Any connectors and operations that you created and installed. |

Under the search box, a row shows the available operation collections and connectors organized from left to right, based on global popularity and usage. The individual **Triggers** and **Actions** lists are grouped by collection or connector name. These names appear in ascending order, first numerically if any exist, and then alphabetically.

The following example shows the designer for a blank Consumption logic app workflow with the **All** group selected. So, the **Triggers** list shows all available triggers, based on the previously described order:

:::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-all-triggers-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and built-in triggers gallery.":::

The following example shows the designer for a Consumption logic app workflow, and the **Actions** list shows all available actions, sorted alphabetically by collection name:

:::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-all-actions-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and built-in actions gallery.":::

For more information, see the following documentation:

- [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
- [Microsoft-managed (Standard and Enterprise) connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Custom connectors in Azure Logic Apps](custom-connector-overview.md)
- [Billing and pricing for operations in Consumption workflows](logic-apps-pricing.md#consumption-operations)

**Built-in operations**

The following example shows the built-in triggers gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/built-in-triggers-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and the 'Built-in' triggers gallery.":::

The following example shows the built-in actions gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/built-in-actions-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and the 'Built-in' actions gallery.":::

**Standard operations**

The following example shows the Standard triggers gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/standard-triggers-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and the 'Standard' triggers gallery.":::

The following example shows the Standard actions gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/standard-actions-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and the 'Standard' actions gallery.":::

**Enterprise operations**

The following example shows the Enterprise triggers gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/enterprise-triggers-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and the 'Enterprise' triggers gallery.":::

The following example shows the Enterprise actions gallery:

:::image type="content" source="media/create-workflow-with-trigger-or-action/enterprise-actions-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app with blank workflow designer, and the 'Enterprise' actions gallery.":::

### [Standard](#tab/standard)

The designer uses the following groups to organize connectors and their operations:

| Group | Description |
|-------|-------------|
| **Built-in** | Connectors and triggers that run directly and natively within the Azure Logic Apps runtime. |
| **Azure** | Connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. |

In the **Add a trigger** or **Add an action** pane, under the search box, the **Built-in** or **Azure** connectors gallery row shows the available operation collections and connectors organized from left to right in ascending order, first numerically if any exist, and then alphabetically. The individual **Triggers** and **Actions** lists are grouped by collection or connector name and appear in ascending order, first numerically if any exist, and then alphabetically.

For more information, see the following documentation:

- [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
- [Microsoft-managed connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in custom connectors in Azure Logic Apps](custom-connector-overview.md)
- [Billing and pricing for operations in Standard workflows](logic-apps-pricing.md#standard-operations)

The following example shows the designer for a blank workflow in a Standard logic app, and the triggers list is filtered to show **Built-in** operations:

:::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-standard.png" alt-text="Screenshot showing Azure portal, Standard logic app with blank stateful workflow designer, and built-in triggers gallery.":::

### [Standard (Preview)](#tab/standard-preview)

The designer uses the following groups to organize connectors and their operations:

| Group | Description |
|-------|-------------|
| **In-App** | Connectors and triggers that run directly and natively within the Azure Logic Apps runtime. In the non-preview designer, this group is the same as the **Built-in** group. |
| **Shared** | Connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. In the non-preview designer, this group is the same as the **Azure** group. |

In the **Browse operations** pane, the connectors gallery lists the available operation collections and connectors organized from left to right in ascending order, first numerically if any exist, and then alphabetically. The individual **Triggers** and **Actions** lists are grouped by collection or connector name and appear in ascending order, first numerically if any exist, and then alphabetically. After you select a collection or connector, the triggers or actions appear in ascending order alphabetically.

For more information, see the following documentation:

- [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
- [Microsoft-managed connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in custom connectors in Azure Logic Apps](custom-connector-overview.md)
- [Billing and pricing for operations in Standard workflows](logic-apps-pricing.md#standard-operations)

---

## Next steps

[General information about connectors, triggers, and actions]()

