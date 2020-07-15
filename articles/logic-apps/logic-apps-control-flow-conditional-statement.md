---
title: Add conditional statements to workflows
description: How to create conditions that control actions in workflows in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 10/09/2018
---

# Create conditional statements that control workflow actions in Azure Logic Apps

To run specific actions in your logic app only after passing a specified condition, 
add a *conditional statement*. This control structure compares the data in your 
workflow against specific values or fields. You can then specify different actions 
that run based on whether or not the data meets the condition. 
You can nest conditions inside each other.

For example, suppose you have a logic app that sends too 
many emails when new items appear on a website's RSS feed. 
You can add a conditional statement to send email only 
when the new item includes a specific string. 

> [!TIP]
> To run different steps based on different specific values, 
> use a [*switch statement*](../logic-apps/logic-apps-control-flow-switch-statement.md) instead.

## Prerequisites

* An Azure subscription. If you don't have a subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/).

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* To follow the example in this article, 
[create this sample logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md) 
with an Outlook.com or Office 365 Outlook account.

## Add condition

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, 
open your logic app in Logic App Designer.

1. Add a condition at the location that you want. 

   To add a condition between steps, move the pointer over the arrow where 
   you want to add the condition. Choose the **plus sign** (**+**) that appears, 
   then choose **Add an action**. For example:

   ![Add action between steps](./media/logic-apps-control-flow-conditional-statement/add-action.png)

   When you want to add a condition at the end of your workflow, 
   at the bottom of your logic app, 
   choose  **New step** > **Add an action**.

1. In the search box, enter "condition" as your filter. 
Select this action: **Condition - Control**

   ![Add condition](./media/logic-apps-control-flow-conditional-statement/add-condition.png)

1. In the **Condition** box, build your condition. 

   1. In the left box, specify the data or field that you want to compare.

      When you click inside the left box, the dynamic content list appears 
      so you can select outputs from previous steps in your logic app. 
      For this example, select the RSS feed summary.

      ![Build your condition](./media/logic-apps-control-flow-conditional-statement/edit-condition.png)

   1. In the middle box, select the operation to perform. 
   For this example, select "**contains**". 

   1. In the right box, specify a value or field as your criteria. 
   For this example, specify this string: **Microsoft**

   Here's the complete condition:

   ![Complete condition](./media/logic-apps-control-flow-conditional-statement/edit-condition-2.png)

   To add another row to your condition, choose **Add** > **Add row**. 
   To add a group with subconditions, choose **Add** > **Add group**. 
   To group existing rows, select the checkboxes for those rows, 
   choose the ellipses (...) button for any row, and then choose **Make group**.

1. Under **If true** and **If false**, add the steps to perform 
based on whether the condition is met. For example:

   ![Condition with "If true" and "If false" paths](./media/logic-apps-control-flow-conditional-statement/condition-yes-no-path.png)

   > [!TIP]
   > You can drag existing actions into the **If true** and **If false** paths.

1. Save your logic app.

This logic app now sends mail only when the new items in the RSS feed meet your condition.

## JSON definition

Here's the high-level code definition behind a conditional statement:

``` json
"actions": {
  "Condition": {
    "type": "If",
    "actions": {
      "Send_an_email": {
        "inputs": {},
        "runAfter": {}
    },
    "expression": {
      "and": [ 
        { 
          "contains": [ 
            "@triggerBody()?['summary']", 
            "Microsoft"
          ]
        } 
      ]
    },
    "runAfter": {}
  }
},
```

## Get support

* For questions, visit the [Microsoft Q&A question page for Azure Logic Apps](https://docs.microsoft.com/answers/topics/azure-logic-apps.html).
* To submit or vote on features and suggestions, visit the 
[Azure Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* [Run steps based on different values (switch statements)](../logic-apps/logic-apps-control-flow-switch-statement.md)
* [Run and repeat steps (loops)](../logic-apps/logic-apps-control-flow-loops.md)
* [Run or merge parallel steps (branches)](../logic-apps/logic-apps-control-flow-branches.md)
* [Run steps based on grouped action status (scopes)](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md)
