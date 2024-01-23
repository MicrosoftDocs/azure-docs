---
title: Create or join parallel branches in workflows
description: Create or merge parallel branches for workflow actions in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/21/2024
---

# Create or join parallel branches with workflow actions in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

By default, your actions in a logic app workflow run sequentially. To organize actions into separate branches and run those branches at the same time, you can create [parallel branches](#parallel-branches), and then [join those branches](#join-branches) later in your workflow.

This guide shows how to create parallel branches in a workflow and rejoin those branches, as shown in this high-level diagram:

:::image type="content" source="media/logic-apps-control-flow-branches/branch-join-overview.png" alt-text="Screenshot shows high-level conceptual diagram with parallel branches that later join in workflow." lightbox="media/logic-apps-control-flow-branches/branch-join-overview.png":::

> [!TIP]
>
> If your workflow trigger receives an array, and you want to run a workflow instance 
> instance for each item in the array, rather than create parallel branches, you can 
> [*debatch* that array instead by using the **SplitOn** trigger property](logic-apps-workflow-actions-triggers.md#split-on-debatch).

## Prerequisites

* An Azure subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A logic app workflow that starts with a trigger and the actions that you want. Make sure that your workflow includes the actions between where you want to add a parallel branch.

## Considerations for working with parallel branches

- A parallel branch runs only when its **runAfter** property value matches the parent action's completed status. For example, both the branches starting with **branchAction1** and **branchAction2** run only when **parentAction** completes with **Succeeded** status.

- Your workflow waits for all parallel branches at the same level to complete before running the action that joins these branches.

<a name="parallel-branches"></a>

## Add a parallel branch action

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app and workflow in the designer.

1. Between the actions where you want to add a parallel branch, move your pointer over the connecting arrow.

1. Select the **plus** sign (**+**) that appears, and then select **Add a parallel branch**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-parallel-branch-standard.png" alt-text="Screenshot shows Standard workflow with selected plus sign and selected option, Add a parallel branch." lightbox="media/logic-apps-control-flow-branches/add-parallel-branch-standard.png":::

1. Now, add the action that you want to run in the parallel branch. In the **Add an action** pane and search box, find and select the action that you want.

   :::image type="content" source="media/logic-apps-control-flow-branches/select-action-standard.png" alt-text="Screenshot shows Standard workflow with search box named Choose an operation." lightbox="media/logic-apps-control-flow-branches/select-action-standard.png":::

   The selected action now appears in the parallel branch, for example:

   :::image type="content" source="media/logic-apps-control-flow-branches/added-parallel-branch-standard.png" alt-text="Screenshot shows Standard workflow, parallel branch, and previously selected action." lightbox="media/logic-apps-control-flow-branches/added-parallel-branch-standard.png":::

1. To add another action to the parallel branch, under the action where you want to add a new action, select the **plus** (**+**) sign, and then select **Add an action**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-sequential-action-standard.png" alt-text="Screenshot shows Standard workflow and how to add another action to the same parallel branch." lightbox="media/logic-apps-control-flow-branches/add-sequential-action-standard.png":::

1. In the **Choose an operation** search box, find and select the action that you want.

   Your selected action now appears within the current branch, for example:

   :::image type="content" source="media/logic-apps-control-flow-branches/added-sequential-action-standard.png" alt-text="Screenshot shows Standard workflow with added sequential action." lightbox="media/logic-apps-control-flow-branches/added-sequential-action-standard.png":::

To merge branches back together, [join your parallel branches](#join-branches).

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and workflow in the designer.

1. Between the actions where you want to add a parallel branch, move your pointer over the connecting arrow.

1. Select the **plus** sign (**+**) that appears, and then select **Add a parallel branch**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-parallel-branch-consumption.png" alt-text="Screenshot shows Consumption workflow with selected plus sign and selected option, Add a parallel branch." lightbox="media/logic-apps-control-flow-branches/add-parallel-branch-consumption.png":::

1. Now, add the action that you want to run in the parallel branch. In the **Choose an operation** search box, find and select the action that you want.

   :::image type="content" source="media/logic-apps-control-flow-branches/select-action-consumption.png" alt-text="Screenshot shows Consumption workflow with search box named Choose an operation." lightbox="media/logic-apps-control-flow-branches/select-action-consumption.png":::

   The selected action now appears in the parallel branch, for example:

   :::image type="content" source="media/logic-apps-control-flow-branches/added-parallel-branch-consumption.png" alt-text="Screenshot shows Consumption workflow, parallel branch, and previously selected action." lightbox="media/logic-apps-control-flow-branches/added-parallel-branch-consumption.png":::

1. To add another action to the parallel branch, under the action where you want to add a new action, move your pointer around, select the **plus** (**+**) sign that appears, and then select **Add an action**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-sequential-action-consumption.png" alt-text="Screenshot shows Consumption workflow and how to add another action to the same parallel branch." lightbox="media/logic-apps-control-flow-branches/add-sequential-action-consumption.png":::

1. In the **Choose an operation** search box, find and select the action that you want.

   Your selected action now appears within the current branch, for example:

   :::image type="content" source="media/logic-apps-control-flow-branches/added-sequential-action-consumption.png" alt-text="Screenshot shows Consumption workflow with added sequential action." lightbox="media/logic-apps-control-flow-branches/added-sequential-action-consumption.png":::

To merge branches back together, [join your parallel branches](#join-branches).

---

<a name="parallel-json"></a>

## Parallel branch definition (JSON)

If you're working in code view, you can define the parallel structure in your logic app workflow's JSON definition instead, for example:

``` json
{
  "triggers": {
    "myTrigger": {}
  },
  "actions": {
    "parentAction": {
      "type": "<action-type>",
      "inputs": {},
      "runAfter": {}
    },
    "branchAction1": {
      "type": "<action-type>",
      "inputs": {},
      "runAfter": {
        "parentAction": [
          "Succeeded"
        ]
      }
    },
    "branchAction2": {
      "type": "<action-type>",
      "inputs": {},
      "runAfter": {
        "parentAction": [
          "Succeeded"
        ]
      }
    }
  },
  "outputs": {}
}
```

<a name="join-branches"></a>

## Join parallel branches

To merge parallel branches together, under all the branches, just add another action. This action runs only after all the preceding parallel branches finish running.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app and workflow with the parallel branches that you want to join in the designer.

1. Under any of the parallel branches that you want to join, select the **plus sign** (**+**), and then select **Add an action**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-join-action-standard.png" alt-text="Screenshot shows Standard workflow with selected plus sign." lightbox="media/logic-apps-control-flow-branches/add-join-action-standard.png":::

1. In the **Add an action** pane and search box, find and select the action you want to use for joining the branches.

   :::image type="content" source="media/logic-apps-control-flow-branches/join-branches-standard.png" alt-text="Screenshot shows Standard workflow, search box named Choose an operation, and available actions for joining parallel branches." lightbox="media/logic-apps-control-flow-branches/join-branches-standard.png":::

1. On the designer, select the previously added action. After the action's information pane opens, select **Settings**.

1. On the **Settings** pane, under **Run After**, open the **Select Actions** list, and select the last action in each branch that must finish before the join action runs.

   You're effectively specifying that the join action runs only after all the selected actions finish running.

   :::image type="content" source="media/logic-apps-control-flow-branches/run-after-actions-standard.png" alt-text="Screenshot shows Standard workflow, the action that joins preceding parallel branches, and selected actions to first finish running." lightbox="media/logic-apps-control-flow-branches/run-after-actions-standard.png":::

   When you finish, the selected action now appears under the parallel branches that you want to join, for example:

   :::image type="content" source="media/logic-apps-control-flow-branches/joined-branches-standard.png" alt-text="Screenshot shows Standard workflow with the action that joins the preceding parallel branches." lightbox="media/logic-apps-control-flow-branches/joined-branches-standard.png":::

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and workflow with the parallel branches that you want to join in the designer.

1. Under the parallel branches that you want to join, select **New step**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-join-action-consumption.png" alt-text="Screenshot shows Consumption workflow with selected New step." lightbox="media/logic-apps-control-flow-branches/add-join-action-consumption.png":::

1. In the **Choose an operation** search box, find and select the action you want to join the branches.

   :::image type="content" source="media/logic-apps-control-flow-branches/join-branches-consumption.png" alt-text="Screenshot shows Consumption workflow, search box named Choose an operation, and available actions for joining parallel branches." lightbox="media/logic-apps-control-flow-branches/join-branches-consumption.png":::

   The selected action now appears under the parallel branches that you want to join, for example:

   :::image type="content" source="media/logic-apps-control-flow-branches/joined-branches-consumption.png" alt-text="Screenshot shows Consumption workflow with the action that joins the preceding parallel branches." lightbox="media/logic-apps-control-flow-branches/joined-branches-consumption.png":::

---

<a name="join-json"></a>

## Join definition (JSON)

If you're working in code view, you can define the join action in your logic app workflow's JSON definition instead, for example:

``` json
{
  "triggers": {
    "myTrigger": { }
  },
  "actions": {
    "parentAction": {
      "type": "<action-type>",
      "inputs": { },
      "runAfter": {}
    },
    "branchAction1": {
      "type": "<action-type>",
      "inputs": { },
      "runAfter": {
        "parentAction": [
          "Succeeded"
        ]
      }
    },
    "branchAction2": {
      "type": "<action-type>",
      "inputs": { },
      "runAfter": {
        "parentAction": [
          "Succeeded"
        ]
      }
    },
    "joinAction": {
      "type": "<action-type>",
      "inputs": { },
      "runAfter": {
        "branchAction1": [
          "Succeeded"
        ],
        "branchAction2": [
          "Succeeded"
        ]
      }
    }
  },
  "outputs": {}
}
```

## Next steps

* [Run steps based on a condition (condition action)](../logic-apps/logic-apps-control-flow-conditional-statement.md)
* [Run steps based on different values (switch action)](../logic-apps/logic-apps-control-flow-switch-statement.md)
* [Run and repeat steps (loops)](../logic-apps/logic-apps-control-flow-loops.md)
* [Run steps based on grouped action status (scopes)](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md)
