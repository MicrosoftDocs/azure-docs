---
title: Add Switch Actions to Workflows
description: Learn to add switch actions to workflows so you can control workflow action path execution based on specific values in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 10/06/2025
#Customer intent: As an integration developer working with Azure Logic Apps, I want to set up a switch action in a workflow to run different action paths based on the values of objects, expressions, or tokens.
---

# Set up switch actions to run different action paths based on specific values in workflows for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard.md](../../includes/logic-apps-sku-consumption-standard.md)]

To run different action paths based on the values of objects, expressions, or tokens, add a *switch* action to your workflow. This action evaluates the object, expression, or token, chooses the case that matches the result, and runs the action path that you define for that case. When the switch action runs, only one case should match the result.

For example, suppose you want a workflow that runs different action paths based on an option selected in email. In this example, the workflow uses an RSS trigger to check a website's RSS feed for new content. When a new item appears in the RSS feed, the workflow sends email to an approver. Based on whether the approver selects *Approve* or *Reject*, the workflow runs different actions.

> [!TIP]
>
> Switch actions support only equality operators. If you need other relational operators, such as *greater than*, use a [condition action](../logic-apps/logic-apps-control-flow-conditional-statement.md). To ensure deterministic behavior, cases must contain a unique and static value instead of dynamic tokens or expressions.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- To follow the example in this article, [create the example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md) with an Outlook.com account or a work or school account.

  1. When you add the action to send email, find and select this action instead: **Send approval email**.

  1. Provide the following information:
  
      | Parameter | Required | Value | Description |
      |-----------|----------|-------|-------------|
      | **To** | Yes | <*approver-email-address*> | The email address for the person who makes the approval decision. To test the example, use your own email address for testing. |
      | **Subject** | No | <*email-subject*> | The subject for the email approval request. |
      | **User Options** | No | **Approve, Reject** | Although optional, leave the default values for this example. |

     :::image type="content" source="./media/logic-apps-control-flow-switch-statement/send-approval-email-details.png" alt-text="Screenshot shows the Send approval email action with parameters where you can enter an address and User Options values.":::

## Add a switch action

To change the workflow execution path based on the selected options in the approval email, add a switch action at the end of the sample workflow.

1. On the designer, follow these [general steps](add-trigger-action-workflow.md#add-action) to add the **Control** action named **Switch** to your workflow.

   The **Switch** action appears with an empty default case. A **Switch** action requires at least one case plus the default case. You'll add more cases later.

   :::image type="content" source="./media/logic-apps-control-flow-switch-statement/empty-switch.png" alt-text="Screenshot shows a Switch action with an empty default Case.":::

1. If the **Switch** action isn't selected so that information pane is open, select the **Switch** title bar.

1. On the **Parameters** tab, select inside the **On** box, then select the lightning icon to open the dynamic content list. From that list, under **Send approval email**, select the **SelectedOption** field.

   The **SelectedOption** field stores the value selected by the approver and determines the case with the actions to run. 

   :::image type="content" source="./media/logic-apps-control-flow-switch-statement/select-selected-option.png" alt-text="Screenshot shows the dynamic content list with the SelectedOption value highlighted.":::

1. To handle the cases where the approver selects **Approve** or **Reject**, add a case for each option. Next to the **Default** case, select the plus (**+**) sign, then select **Add a case**.

   :::image type="content" source="./media/logic-apps-control-flow-switch-statement/switch-plus.png" alt-text="Screenshot shows the Switch action with two cases added, along with the default case.":::

1. Add these actions to the corresponding cases:

   | Case # | **SelectedOption** | Action |
   |--------|--------------------|--------|
   | Case | **Approve** | Add the Outlook **Send an email** action for sending details about the RSS item only when the approver selected **Approve**. |
   | Case 2 | **Reject** | Add the Outlook **Send an email** action for notifying other approvers that the RSS item was rejected. |
   | Default | None | No action necessary. In this example, the **Default** case is empty because **SelectedOption** has only two options. |

   :::image type="content" source="./media/logic-apps-control-flow-switch-statement/finished-switch.png" alt-text="Screenshot shows the Switch action with two cases and the default case. Each added case contains a Send an email action to run.":::

1. Save your workflow. 

1. To test this example, on the designer toolbar, select **Run** > **Run** until the trigger detects a new RSS item and sends you an approval email. Select **Approve** to observe the results.

## JSON definition

Now that you created a workflow with the **Switch** action, review the JavaScript Object Notation (JSON) code definition behind this action.

``` json
"Switch": {
   "type": "Switch",
   "expression": "@body('Send_approval_email')?['SelectedOption']",
   "cases": {
      "Case": {
         "actions": {
           "Send_an_email": {}
         },
         "case" : "Approve"
      },
      "Case_2": {
         "actions": {
           "Send_an_email_2": {}
         },
         "case": "Reject"
      }
   },
   "default": {
      "actions": {}
   },
   "runAfter": {
      "Send_approval_email": [
         "Succeeded"
      ]
   }
}
```

| Label | Description |
|-------|-------------|
| `"Switch"`         | The default name for the `Switch` action, which you can rename to better describe the action's purpose. |
| `"type": "Switch"` | Specifies the action type, which is a `Switch` action. |
| `"expression"`     | In this example, specifies the approver's selected option that the `Switch` action evaluates against each case as declared later in the definition. |
| `"cases"` | Defines any number of cases. For each case, `"Case_*"` is the default name for that case, which you can rename to better describe the case's purpose. |
| `"case"` | Specifies the case's value, which must be a constant and unique value that the `Switch` action uses for comparison. If no cases match the switch expression result, the actions in the `"default"` section are run. | 

## Related content

- [Run steps based on a condition (condition action)](../logic-apps/logic-apps-control-flow-conditional-statement.md)
- [Run and repeat steps (loops)](../logic-apps/logic-apps-control-flow-loops.md)
- [Run or merge parallel steps (branches)](../logic-apps/logic-apps-control-flow-branches.md)
- [Run steps based on grouped action status (scopes)](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md)
