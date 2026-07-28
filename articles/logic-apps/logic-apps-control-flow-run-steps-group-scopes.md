---
title: Group Related Actions into Scopes
description: Learn how to group related actions into scopes and run follow-up actions based on scope status in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/26/2026
ms.custom: ai-assisted
#Customer intent: As a integration developer who works with Azure Logic Apps, I want to group actions by using scopes and run subsequent actions based on scope results to support complex scenarios.
---

# Group related actions into scopes and run follow-up actions based on scope status in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Sometimes your workflow has actions that you want to run only after a group of related actions succeeds or fails. For this scenario, add a **Scope** action as a logical container for these actions. After all the scope actions finish running, the scope gets its own status, such as:

- **Succeeded**
- **Failed**
- **Skipped**
- **TimedOut**
- **Cancelled**
- **Aborted**

Your workflow can evaluate the scope's status and choose the subsequent actions to run based on this status. To check a scope's status, you can use the same ways to check an action's run status. By default, when all the scope's actions succeed, the scope's status is marked as **Succeeded**. When any scope action fails, the scope's status is marked as **Failed**.

Scopes are commonly used for [exception and error handling](logic-apps-exception-handling.md#scopes), cleanup logic, and post-processing after a set of actions finishes running. Scopes are suitable for when you have the following use cases:

- Treat multiple actions as a single group.
- Run follow-up actions only if all scope actions succeed.
- Handle errors in one place, rather than after each action.
- Separate primary logic from error handling or cleanup logic.

The following high-level example shows a scope and a condition that check the scope's status. If any scope actions fail or end unexpectedly, the scope is marked as **Failed** or **Aborted** respectively. The workflow sends a *Scope failed* message. If all the scoped actions succeed, the workflow sends a *Scope succeeded* message.

:::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/example-overview.png" alt-text="Screenshot shows a workflow with a scope that has examples of Scope failed and Scope succeeded.":::

This guide shows how to add a scope to your workflow and how scopes work using a service-agnostic example.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Consumption or Standard logic app resource and workflow

  If your workflow is blank, first [add a trigger](add-trigger-action-workflow.md#add-trigger) to run the workflow.

  This guide's examples use the [**Recurrence** trigger](../connectors/connectors-native-recurrence.md). To add this trigger, follow these steps:

  1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow in the designer.

  1. Follow the [general steps](add-trigger-action-workflow.md#add-trigger) to add the **Schedule** trigger named **Recurrence** trigger to your workflow.

  1. On the designer, select the trigger. After the trigger information pane opens, on the **Parameters** tab, set the trigger parameters to the following values:

     | Parameter | Values |
     |-----------|--------|
     | **Interval** | `30` |
     | **Frequency** | **Minute** |

     For example:

     :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/recurrence.png" alt-text="Screenshot shows the Schedule trigger named Recurrence.":::

## Add a Scope action

1. On the designer, under the trigger, follow the [general steps](add-trigger-action-workflow.md#add-action) to add the **Control** action named **Scope**.

1. Change the **Scope** action name to `Process order`, for example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/rename-scope.png" alt-text="Screenshot shows the scope action renamed as Process order.":::

1. Save the workflow.

## Add actions to the scope

For this example, the following steps simulate an order processing scenario as the actions to run in the scope.

1. On the designer, on the `Process order` title bar, select the down arrow to expand the scope action, for example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/expand-scope.png" alt-text="Screenshot shows the selected down arrow to expand the scope action.":::

1. Follow the [general steps](add-trigger-action-workflow.md#add-action) to add the following actions to the scope:

   1. Add the **Data Operations** action named **Compose**:

      1. Change the action name to `Validate order`.

      1. In the **Inputs** box, enter `Order validated`.

   1. Add the **Schedule** action named **Delay**:

      1. Change the name to `Fulfill order`.

      1. Set **Count** to `5`. Set **Unit** to **Second**.

   1. Add the **Data Operations** action named **Compose**:

      1. Change the action name to `Complete order`.

      1. In the **Inputs** box, enter `Order fulfilled`.

   When you're done, the scope action looks like the following example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/scope-actions.png" alt-text="Screenshot shows the added Compose and Delay actions in the scope action.":::

   Currently, all the actions in this scope succeed when the workflow runs.

1. Save the workflow.

## Add a condition to check scope status

1. Below the scope action, follow the [general steps](add-trigger-action-workflow.md#add-action) to add the **Control** action named **Condition**.

1. Change the action name to `Did order processing fail`

1. On the **Parameters** tab, set up the following condition with an expression that checks the scope status:

   1. Select inside the leftmost **Choose a value** box. When the input options appear, select the expression editor (function icon).

   1. In the expression editor box, enter the following expression:

      `actions('Process_order')?['status']`

      For example:

      :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/check-scope-status-expression.png" alt-text="Screenshot shows the expression that checks the scope status.":::

      The question mark (?) operator prevents the workflow from failing with a runtime error if the `status` property value is missing or the parent object is null.

   1. When you're done, select **Add**.

   1. In the middle operator box, make sure the value is set to `=`.

   1. In the rightmost **Choose a value** box, enter the value `Failed`.

   When you're done, the condition looks like the following example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/check-scope-condition.png" alt-text="Screenshot shows the condition that checks the scope status.":::

1. To make sure that the condition checks the scope status no matter how the scope ends, follow these steps to configure the run-after settings:

   1. On the condition action's **Settings** tab, under **Run after**, expand the **Process order** section.

   1. Select all the scope statuses:

      - **Is successful**
      - **Has timed out**
      - **Is skipped**
      - **Has failed**

1. Save the workflow.

## Add actions to run based on the scope result

1. On the designer, inside the condition, expand the **True** branch, if not expanded.

1. In the **True** branch, add a **Compose** action, and then follow these steps:

   1. Change the action name to `Handle failure`.

   1. In the **Inputs** box, enter `Order processing failed. Take appropriate action.`

   For example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/order-failure.png" alt-text="Screenshot shows the True branch with the Compose action that indicates order failure.":::

1. In the **False** branch, add a **Compose** action, and then follow these steps:

   1. Change the action name to `Order succeeded`.

   1. In the **Inputs** box, enter `Successfully processed order.`

   For example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/order-success.png" alt-text="Screenshot shows the False branch with the Compose action that indicates order success.":::

1. Save the workflow.

## Test your workflow

1. On the designer toolbar, from the **Run** menu, select **Run**.

1. On the sidebar, select **Run history**.

1. On the **Run history** page, select the latest run, which shows **Succeeded** as the workflow status.

   The run details page shows that the scope action successfully ran, for example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/scope-success.png" alt-text="Screenshot shows the successful scope action.":::

1. Expand the scope action to review each action inside the scope.

   Each action in the scope successfully ran, for example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/actions-scope-success.png" alt-text="Screenshot shows the successful actions inside the scope.":::

1. Expand the condition action along with the **True** and **False** branches.

   Only the **False** branch ran based on the scope action status, for example:

   :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/false-branch-execution.png" alt-text="Screenshot shows that only the False branch ran.":::

1. To test the failure path and force the **True** branch to run, follow these steps:

   1. On the sidebar, select the designer.

   1. In the scope action, add a **Compose** action that fails.

      For example, in the **Compose** action, enter an expression that throws a failure at runtime, for example:

      `int(triggerBody()?['forceFailure'])`

   1. Save the workflow. Rerun the workflow. View the run history.

      This time, the workflow status is **Succeeded**, but the scope action is **Failed**, and the failure branch runs, for example:

      :::image type="content" source="./media/logic-apps-control-flow-run-steps-group-scopes/true-branch-execution.png" alt-text="Screenshot shows that updated workflow with forced error and only the True ran.":::

## Related content

- [Run steps based on a condition (condition action)](../logic-apps/logic-apps-control-flow-conditional-statement.md)
- [Run steps based on different values (switch action)](../logic-apps/logic-apps-control-flow-switch-statement.md)
- [Run and repeat steps (loops)](../logic-apps/logic-apps-control-flow-loops.md)
- [Run or merge parallel steps (branches)](../logic-apps/logic-apps-control-flow-branches.md)
