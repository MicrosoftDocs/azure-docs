---
title: Add and run code snippets - Azure Logic Apps
description: Add and run code snippets with inline code in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: derek1ee, LADocs
ms.topic: article
ms.date: 05/06/2019
---

# Add and run code snippets by using inline code in Azure Logic Apps

When you want to run a piece of code inside your logic app, 
you can add the built-in **Inline Code** action as a step in 
your logic app's workflow. This action works best when you want 
to run code that fits this scenario:

* Runs in JavaScript. More languages coming soon.
* Finishes running in five seconds or fewer.
* Handles data up to 50 MB in size.
* Uses Node.js version 8.11.1. For more information, see 
[Standard built-in objects](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects).

This action runs the code snippet and returns the output from 
that snippet as a token named **Result**, which you can use in 
subsequent actions in your logic app. For other scenarios 
where you want to create a function for your code, try 
[creating and calling an Azure function](../logic-apps/logic-apps-azure-functions.md) 
in your logic app.

In this article, the example logic app triggers when 
a new email arrives in an Office 365 Outlook account. 
The code snippet extracts and returns any email addresses 
that appear in the email body.

![Example overview](./media/logic-apps-add-run-inline-code/inline-code-example-overview.png)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app where you want to add your code snippet, 
including a trigger. If you don't have a logic app, see 
[Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

   The example logic app in this topic uses this Office 365 
   Outlook trigger: **When a new email arrives**

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
that's linked to your logic app

## Add inline code

1. If you haven't already, in the [Azure portal](https://portal.azure.com), 
open your logic app in the Logic App Designer.

1. In the designer, add the **Inline Code** action at the 
location that you want in your logic app's workflow.

   * To add the action at the end of your workflow, choose **New step**.

   * To add the action between existing steps, move your mouse pointer over 
   the arrow that connects those steps. Choose the plus sign (**+**), 
   and select **Add an action**.

   This example adds the **Inline Code** action 
   under the Office 365 Outlook trigger.

   ![Add new step](./media/logic-apps-add-run-inline-code/add-new-step.png)

1. Under **Choose an action**, in the search box, 
enter "inline code" as your filter. From the actions list, 
select this action: **Execute JavaScript Code**

   ![Select "Execute JavaScript Code"](./media/logic-apps-add-run-inline-code/select-inline-code-action.png)

   The action appears in the designer and contains 
   some default example code, including a return statement.

   ![Inline Code action with default sample code](./media/logic-apps-add-run-inline-code/inline-code-action-default.png)

1. In the **Code** box, delete the sample code, and enter the 
code that you want to run. Write code that you'd put inside 
a method, but without defining the method signature. 

   When you type a recognized keyword, the autocomplete list appears 
   so that you can select from available keywords, for example:

   ![Keyword autocomplete list](./media/logic-apps-add-run-inline-code/auto-complete.png)

   In this example, the code snippet first creates a variable 
   that stores a *regular expression*, which specifies a pattern 
   to match in input text. The code then creates a variable that 
   stores the email body data from the trigger.

   ![Create variables](./media/logic-apps-add-run-inline-code/save-email-body-variable.png)

   To make the results from the trigger and previous actions 
   easier to reference, the dynamic content list appears 
   while your cursor is inside the **Code** box. In this 
   example, the list shows available results from the trigger, 
   including the **Body** token, which you can now select. 
   In the inline code action, the **Body** token resolves 
   to a `workflowContext` object that references the email's 
   `Body` property value:

   ![Select result](./media/logic-apps-add-run-inline-code/inline-code-example-select-outputs.png)

   The read-only `workflowContext` object is available to use 
   as input for your code in the **Inline Code** action and 
   provides access to these subproperties that you can use 
   to access trigger and action property values: 

   | Property | Description |
   |----------|-------------|
   | `actions` | A collection of result objects from previous actions in the current workflow instance run. Each object's key is the action's name, and the value is equivalent to calling the [actions() function](../logic-apps/workflow-definition-language-functions-reference.md#actions) with `@actions('<action-name>')`. Provides access to property values from previous actions, which use the same names as the actions that appear in the Logic App Designer. |
   | `trigger` | The trigger result object, which is equivlent to calling the [trigger() function](../logic-apps/workflow-definition-language-functions-reference.md#trigger). Provides access to trigger property values from the current workflow instance run. |
   | `workflow` | The workflow object, which is equivalent to calling the [workflow() function](../logic-apps/workflow-definition-language-functions-reference.md#workflow). Provides access to workflow property values, such as the workflow name, run ID, and so on. |
   |||

   Here's the structure for the `workflowContext` object:

   ```json
   {
      "workflowContextObject": {
         "actions": {
            "<action-name-1>": @actions('<action-name-1>'),
            "<action-name-2>": @actions('<action-name-2>')
         },
         "trigger": {
            @trigger()
         },
         "workflow": {
            @workflow()
         }
      }
   }
   ```

   > [!NOTE]
   > 
   > If your code needs to reference action names that use the dot (.) operator, 
   > you must [add those action names to the **Actions** parameter](#add-parameters), 
   > and your code references to those action names must use square brackets ([]) 
   > and enclose the names in quotes, for example:
   > 
   > `// Correct`</br> 
   > `workflowContext.actions["my.action.name"].body`</br>
   > 
   > `// Incorrect`</br>
   > `workflowContext.actions.my.action.name.body`

   The inline code action doesn't require a `return` statement, 
   but the results from a `return` statement are available for 
   reference in later actions through the **Result** token. 
   For example, the code snippet returns the result by calling 
   the `match()` function, which finds matches in the email body 
   against the regular expression. The **Compose** action uses 
   the **Result** token to reference the results from the inline 
   code action and creates a single result.

   ![Finished logic app](./media/logic-apps-add-run-inline-code/inline-code-complete-example.png)

1. When you're done, save your logic app.

<a name="add-parameters"></a>

## Add parameters

In some cases, you might have to explicitly require that the 
**Inline Code** action includes results from the trigger or 
specific actions that your code references as dependencies by 
adding the **Trigger** or **Actions** parameters. This option 
is useful for scenarios where the referenced results aren't 
found at run time.

> [!TIP]
> If you plan to reuse your code, add references to 
> properties by using the **Code** box so that your code 
> includes the resolved token references, rather than 
> adding the trigger or actions as explicit dependencies.

For example, suppose you have code that references the **SelectedOption** 
result from the **Send approval email** action for the Office 365 Outlook 
connector. At create time, the Logic Apps engine analyzes your code to 
determine whether you've referenced any trigger or action results and 
includes those results automatically. At run time, should you get an 
error that the referenced trigger or action result isn't available in 
the specified `workflowContext` object, you can add that trigger or 
action as an explicit dependency. In this example, you add the 
**Actions** parameter and specify that the **Inline Code** action 
explicitly include the result from the **Send approval email** action.

To add these parameters, open the **Add new parameter** list, 
and select the parameters you want:

   ![Add parameters](./media/logic-apps-add-run-inline-code/inline-code-action-add-parameters.png)

   | Parameter | Description |
   |-----------|-------------|
   | **Actions** | Include an array with results from previous actions. See [Include action results](#action-results). |
   | **Trigger** | Include results from the trigger. See [Include trigger results](#trigger-results). |
   |||

<a name="trigger-results"></a>

### Include trigger results

If you select **Triggers**, you're prompted whether to include trigger results.

* From the **Trigger** list, select **Yes**.

<a name="action-results"></a>

### Include action results

If you select **Actions**, you're prompted for the actions that you want to add. 
However, before you start adding actions, you need the version of the action name 
that appears in the logic app's underlying workflow definition.

* This capability doesn't support variables, loops, and iteration indexes.

* Names in your logic app's workflow definition use an underscore (_), not a space.

* For action names that use the dot operator (.), include those operators, for example: 

  `My.Action.Name`

1. On the designer toolbar, choose **Code view**, 
and search inside the `actions` attribute for the action name. 

   For example, `Send_approval_email_` is the JSON 
   name for the **Send approval email** action.

   ![Find action name in JSON](./media/logic-apps-add-run-inline-code/find-action-name-json.png)

1. To return to designer view, on the code view toolbar, 
choose **Designer**.

1. To add the first action, in the **Actions Item - 1** box, 
enter the action's JSON name. 

   ![Enter first action](./media/logic-apps-add-run-inline-code/add-action-parameter.png)

1. To add another action, choose **Add new item**.

## Reference

For more information about the **Execute JavaScript Code** action's structure and syntax in your logic app's underlying workflow 
definition using the Workflow Definition Language, see this action's 
[reference section](../logic-apps/logic-apps-workflow-actions-triggers.md#run-javascript-code).

## Next steps

Learn more about [Connectors for Azure Logic Apps](../connectors/apis-list.md)
