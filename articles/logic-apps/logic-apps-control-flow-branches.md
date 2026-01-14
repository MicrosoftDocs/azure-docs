---
title: Create or Join Parallel Branches in Workflows
description: Learn how to create and join parallel branches of workflow actions and how parallel branches behave in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/16/2025
#Customer intent: As an integration developer using Azure Logic Apps, I want to use parallel branches to implement different paths for actions in my workflows.
---

# Create or join parallel branches of workflow actions in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

By default, actions in a logic app workflow run sequentially. To organize actions into separate branches and run those branches at the same time, create *parallel branches*. You can join those branches later in your workflow.

This guide shows how to create parallel branches in a workflow and rejoin those branches, as shown in this example workflow:

:::image type="content" source="media/logic-apps-control-flow-branches/branch-join-overview.png" alt-text="Screenshot shows an example workflow with parallel branches that later merge together.":::

> [!TIP]
>
> In scenarios where you have a workflow trigger that receives and returns arrays, and you want a separate workflow instance to run for each array item, you can *debatch* the array as an alternative to branching. On triggers that support this capability, in the designer, you can turn on the **Split on** setting, which maps to a `splitOn` property in the trigger definition. Only triggers that can accept and return arrays support this capability. For more information, see [Trigger multiple runs on an array](logic-apps-workflow-actions-triggers.md#split-on-debatch).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A logic app workflow that starts with a trigger and the actions that you want. Make sure that your workflow includes the actions between where you want to add a parallel branch.

  If you don't have this resource, see the following articles:

  - [Create an example Consumption logic app workflow in Azure Logic Apps](../logic-apps/quickstart-create-example-consumption-workflow.md)
  - [Create an example Standard logic app workflow in Azure Logic Apps](../logic-apps/create-single-tenant-workflows-azure-portal.md)

## Considerations for working with parallel branches

- A parallel branch runs only when its `runAfter` property value matches the parent action's completed status. For example, both the branches **branchAction1** and **branchAction2** run only when **parentAction** completes with **Succeeded** status.

- Your workflow waits for all parallel branches at the same level to complete before the workflow runs the action that joins these branches.

<a name="parallel-branches"></a>

## Add a parallel branch action

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. Based on whether you have a Consumption or Standard logic app, follow the corresponding step:

    - Consumption
    
      - On the resource sidebar, under **Development Tools**, select the designer to open the workflow.
    
    - Standard

      1. On the resource sidebar, under **Workflows**, select **Workflows**.

      1. On the **Workflows** page, select a workflow.

      1. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. Between the actions where you want to add a parallel branch, hover over the connecting arrow.

1. Select the **plus** sign (**+**) that appears, and then select **Add a parallel branch**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-parallel-branch.png" alt-text="Screenshot shows a workflow with selected plus sign and selected option, Add a parallel branch." lightbox="media/logic-apps-control-flow-branches/add-parallel-branch.png":::

1. Add the action that you want to run in the parallel branch. In the **Add an action** pane and search box, find and select the action that you want.

   :::image type="content" source="media/logic-apps-control-flow-branches/select-action.png" alt-text="Screenshot shows a workflow with search box named Choose an operation." lightbox="media/logic-apps-control-flow-branches/select-action.png":::

   The selected action now appears in the parallel branch:

   :::image type="content" source="media/logic-apps-control-flow-branches/added-parallel-branch.png" alt-text="Screenshot shows a workflow, parallel branch, and previously selected action." lightbox="media/logic-apps-control-flow-branches/added-parallel-branch.png":::

1. To add another action to the parallel branch, under the action where you want to add a new action, select the **plus** (**+**) sign, and then select **Add an action**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-sequential-action.png" alt-text="Screenshot shows a workflow and how to add another action to the same parallel branch." lightbox="media/logic-apps-control-flow-branches/add-sequential-action.png":::

1. In the **Add an action** pane and search box, find and select the action that you want.

   Your selected action now appears within the current branch:

   :::image type="content" source="media/logic-apps-control-flow-branches/added-sequential-action.png" alt-text="Screenshot shows a workflow with added sequential action." lightbox="media/logic-apps-control-flow-branches/added-sequential-action.png":::

To merge branches back together, join your parallel branches, as in a following section.

<a name="parallel-json"></a>

## Parallel branch definition (JSON)

In code view, you can define the parallel structure in your logic app workflow's JSON definition instead.

```json
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

To merge parallel branches under all the branches, add another action. This action runs only after all the preceding parallel branches finish running.

1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow as described in the previous procedure.

1. Under any of the parallel branches that you want to join, select the **plus sign** (**+**), and then select **Add an action**.

   :::image type="content" source="media/logic-apps-control-flow-branches/add-join-action.png" alt-text="Screenshot shows a workflow with selected plus sign." lightbox="media/logic-apps-control-flow-branches/add-join-action.png":::

1. In the **Add an action** pane and search box, find and select the action you want to use for joining the branches.

   :::image type="content" source="media/logic-apps-control-flow-branches/join-branches.png" alt-text="Screenshot shows a workflow, search box named Choose an operation, and available actions for joining parallel branches." lightbox="media/logic-apps-control-flow-branches/join-branches.png":::

1. On the designer, select the previously added action. After the action's information pane opens, select **Settings**.

1. On the **Settings** tab, under **Run after**, open the **Select actions** list. Select the last action in each branch that must finish before the join action runs.

   The join action runs only after all the selected actions finish running.

   :::image type="content" source="media/logic-apps-control-flow-branches/run-after-actions.png" alt-text="Screenshot shows a workflow, the action that joins preceding parallel branches, and selected actions to first finish running." lightbox="media/logic-apps-control-flow-branches/run-after-actions.png":::

   When you finish, the selected action appears under the parallel branches that you want to join:

   :::image type="content" source="media/logic-apps-control-flow-branches/joined-branches.png" alt-text="Screenshot shows a workflow with the action that joins the preceding parallel branches." lightbox="media/logic-apps-control-flow-branches/joined-branches.png":::

<a name="join-json"></a>

## Join definition (JSON)

In code view, you can define the join action in your logic app workflow's JSON definition instead.

```json
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

## Related content

- [Run steps based on a condition (condition action)](../logic-apps/logic-apps-control-flow-conditional-statement.md)
- [Run steps based on different values (switch action)](../logic-apps/logic-apps-control-flow-switch-statement.md)
- [Run and repeat steps (loops)](../logic-apps/logic-apps-control-flow-loops.md)
- [Run steps based on grouped action status (scopes)](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md)
