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

  - Consumption workflows: Visual Studio or Visual Studio Code

  - Standard workflows: Visual Studio Code

## Add a trigger to start your workflow

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app and blank workflow in the designer.

1. On the designer, under the search box, select **All** so that you can search all the connectors and triggers by name.

   | Group | Description |
   |-------|-------------|
   | **For You** | Any connectors and triggers that you recently used. |
   | **All** | All available connectors and triggers in Azure Logic Apps. |
   | **Built-in** | Connectors and triggers that run directly and natively within the Azure Logic Apps runtime. |
   | **Standard** and **Enterprise** | Connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. |
   | **Custom** | Any connectors and triggers that you created and installed. |

   For more information, see the following documentation:

   - [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
   - [Microsoft-managed (Standard and Enterprise) connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
   - [Custom connectors in Azure Logic Apps](custom-connector-overview.md)
   - [Billing and pricing for operations in Consumption workflows](logic-apps-pricing.md#consumption-operations)

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
   | **Azure** | Connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. |

   For more information, see the following documentation:

   - [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
   - [Microsoft-managed connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
   - [Built-in custom connectors in Azure Logic Apps](custom-connector-overview.md)
   - [Billing and pricing for operations in Standard workflows](logic-apps-pricing.md#standard-operations)

1. To filter the list, in the search box, enter the name for the connector or trigger. From the triggers list, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard (Preview)](#tab/standard-preview)

1. In the [Azure portal](https://portal.azure.com), open your logic app and blank workflow in the designer.

1. On the designer, select **Add a trigger**, if not already selected.

1. On the **Browse operations** pane, choose either path:

   - To filter the connectors or triggers list, in the search box, enter the name for the connector or trigger that you want.

   - To browse triggers grouped by connector, open the **Filter** list, and select either **In-App** or **Shared**, based on the trigger that you want.

     | Group | Description |
     |-------|-------------|
     | **In-App** | Connectors and triggers that run directly and natively within the Azure Logic Apps runtime. In the non-preview designer, this group is the same as the **Built-in** group. |
     | **Shared** | Connectors and triggers that are Microsoft-managed, hosted, and run in multi-tenant Azure. In the non-preview designer, this group is the same as the **Azure** group. |

   For more information, see the following documentation:

   - [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
   - [Microsoft-managed connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
   - [Built-in custom connectors in Azure Logic Apps](custom-connector-overview.md)
   - [Billing and pricing for operations in Standard workflows](logic-apps-pricing.md#standard-operations)

1. From the triggers list, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

## Add an action to run a task

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow in the designer.

1. On the designer, under the search box, select **All** so that you can search all the connectors and actions by name.

   | Group | Description |
   |-------|-------------|
   | **For You** | Any actions and connectors that you recently used. |
   | **All** | All available actions and connectors in Azure Logic Apps. |
   | **Built-in** | Actions and connectors that run directly and natively within the Azure Logic Apps runtime. |
   | **Standard** and **Enterprise** | Actions and connectors that are Microsoft-managed, hosted, and run in multi-tenant Azure. |
   | **Custom** | Any actions and connectors that you created and installed. |

   For more information, see the following documentation:

   - [Built-in operations and connectors in Azure Logic Apps](../connectors/built-in.md)
   - [Microsoft-managed (Standard and Enterprise) connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
   - [Custom connectors in Azure Logic Apps](custom-connector-overview.md)
   - [Billing and pricing for operations in Consumption workflows](logic-apps-pricing.md#consumption-operations)

1. In the search box, enter the name for the connector or action that you want to find.

1. From the triggers list, select the action that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

### [Standard (Preview)](#tab/standard-preview)

---

## Triggers and actions in the designer

In the workflow designer, you can select from hundreds of triggers and actions, collectively called *operations*. Azure Logic Apps organizes these operations into either collections, such as **Schedule**, **HTTP**, and **Data Operations**, or as connectors, such as **Azure Service Bus**, **SQL Server**, **Azure Blob Storage**, and **Office 365 Outlook**. These collections can include triggers, actions, or both.

### [Consumption](#tab/consumption)

In the designer, the top row that shows the available collections and connectors is organized from left to right, based on global popularity and usage. The individual **Triggers** and **Actions** lists are grouped by collection or connector name. These names appear in ascending order, first numerically if any exist, and then alphabetically.

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

The following example shows the designer for a blank workflow in a Standard logic app, and the triggers list is filtered to show **Built-in** operations:

:::image type="content" source="media/create-workflow-with-trigger-or-action/designer-overview-standard.png" alt-text="Screenshot showing Azure portal, Standard logic app with blank stateful workflow designer, and built-in triggers gallery.":::

### [Standard (Preview)](#tab/standard-preview)

---

## Next steps

[General information about connectors, triggers, and actions]()

