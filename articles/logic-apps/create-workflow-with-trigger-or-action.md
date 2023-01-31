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

This how-to guide shows how to start your workflow by adding a *trigger* and then continue your workflow by adding an *action*. The trigger is always the first step in any workflow and specifies the condition to meet before your workflow can start to run. Following the trigger, you have to add one or more subsequent actions for your workflow to perform the tasks that you want.

The trigger and actions work together to define your workflow's logic and structure. Azure Logic Apps provides hundreds of connectors that offer triggers, actions, or both, collectively called *operations*. 

This guide shows the steps for Consumption and Standard logic app workflows.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To add a trigger, you have to start with a logic app and blank workflow.

- To add an action, you have to start with a logic app and a workflow that has a trigger at minimum.

- The following steps use the Azure portal, but you can also use the following tools to create a logic app and workflow:

  - Consumption workflows: Visual Studio or Visual Studio Code

  - Standard workflows: Visual Studio Code

## Add a trigger to start your workflow

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app and blank workflow in the designer.

1. On the designer, under the search box, select the group that has the trigger that you want to add:

   - **Built-in**
   - **Standard**
   - **Enterprise**
   - **Custom connector**: If you have any: 

1. To filter and browse the connectors or trigger list, in the search box, enter the name for the connector or trigger.

1. From the triggers list, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app and blank workflow in the designer.

1. On the designer, select **Choose an operation**, if not already selected.

1. Under the search box, select the group that has the trigger that you want to add:

   - **Built-in**
   - **Azure-hosted**

1. To filter and browse the connectors or trigger list, in the search box, enter the name for the connector or trigger.

1. From the triggers list, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard (Preview)](#tab/standard-preview)

1. In the [Azure portal](https://portal.azure.com), open your logic app and blank workflow in the designer.

1. On the designer, select **Choose an operation**, if not already selected.

1. Under the search box, select the group that has the trigger that you want to add:

   - **Built-in**
   - **Azure-hosted**

1. To filter and browse the connectors or trigger list, in the search box, enter the name for the connector or trigger.

1. From the triggers list, select the trigger that you want.

1. If prompted, provide any necessary connection information, which differs based on the connector. When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

## Add an action to run a task

### [Consumption](#tab/consumption)

### [Standard](#tab/standard)

### [Standard (Preview)](#tab/standard-preview)

---

## Next steps

[General information about connectors, triggers, and actions]()

