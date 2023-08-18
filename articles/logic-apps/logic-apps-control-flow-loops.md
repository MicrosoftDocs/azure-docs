---
title: Add loops to repeat actions
description: Create loops to repeat actions or process arrays in workflows using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/18/2023
---

# Create loops that repeat actions or process arrays in workflows with Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Azure Logic Apps includes the following loop actions that you can use in your workflow:

* To repeat one or more actions on an array, add the [**For each** action](#foreach-loop) to your workflow.

  If you have a trigger that receives an array and want to run an iteration for each array item, you can *debatch* that array with the [**SplitOn** trigger property](../logic-apps/logic-apps-workflow-actions-triggers.md#split-on-debatch).

* To repeat one or more actions until a condition gets met or a state changes, add the [Until action](#until-loop) to your workflow.

  Your workflow first runs all the actions inside the loop, and then checks the condition or state. If the condition is met, the loop stops. Otherwise, the loop repeats. For the default and maximum limits on the number of **Until** loops that a workflow can have, see [Concurrency, looping, and debatching limits](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 

* Basic knowledge about [logic app workflows](../logic-apps/logic-apps-overview.md)

<a name="foreach-loop"></a>

## For each

The **For each** action repeats one or more actions on each array item and works only on arrays.

Here are some considerations to remember when you use a **For each** action:

* The **For each** action can process a limited number of array items. For this limit, see [Concurrency, looping, and debatching limits](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits).

* By default, iterations in a **For each** action run at the same time in parallel.

  This behavior differs from [Power Automate's **Apply to each** loop](/power-automate/apply-to-each) where iterations run one at a time, or sequentially. However, you can [set up sequential **For each** iterations](#sequential-foreach-loop). For example, if you want to pause the next iteration in a **For each** action by using the [Delay action](../connectors/connectors-native-delay.md), you need to set up each iteration to run sequentially.

  The exception to the default behavior are nested **For each** actions where iterations always run sequentially, not in parallel. To run operations in parallel for items in a nested loop, create and [call a child logic app workflow](../logic-apps/logic-apps-http-endpoint.md).

* To get predictable results from operations on variables during each iteration, run the iterations sequentially. For example, when a concurrently running iteration ends, the **Increment variable**, **Decrement variable**, and **Append to variable** operations return predictable results. However, during each iteration in the concurrently running loop, these operations might return unpredictable results.

* Actions in a **For each** loop use the [`item()` function](../logic-apps/workflow-definition-language-functions-reference.md#item) to reference and process each item in the array. If you specify data that's not in an array, the workflow fails.

The following example workflow sends a daily summary for a website RSS feed. The workflow uses a **For each** action that sends an email for each new item.

Follow the steps based on whether you create a Consumption or Standard logic app workflow.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), create an example Consumption logic app workflow with the following steps in the specfied order:

* The **RSS** trigger named **When a feed item is published** 

  For more information, [follow these general steps to add a trigger](create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

* The **Outlook.com** or **Office 365 Outlook** action named **Send an email**

  For more information, [follow these general steps to add an action](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. [Follow the same general steps](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action) to add the **For each** action between the RSS trigger and **Send an email** action in your workflow.

1. Now build the loop:

   1. Select inside the **Select an output from previous steps** box so that the dynamic content list opens.

   1. In the **Add dynamic content** list, from the **When a feed item is published** section, select **Feed links**, which is an array output from the RSS trigger.

      > [!NOTE]
      >
      > If the **Feed links** output doesn't appear, next to the trigger section label, select **See more**. 
      > From the dynamic content list, you can select *only* outputs from previous steps.

      ![Screenshot shows Azure portal, Consumption workflow designer, action named For each, and opened dynamic content list.](media/logic-apps-control-flow-loops/for-each-select-feed-links-consumption.png)

      When you're done, the selected array output appears as in the following example:

      ![Screenshot shows Consumption workflow, action named For each, and selected array output.](media/logic-apps-control-flow-loops/for-each-selected-array-consumption.png)

   1. To run an existing action on each array item, drag the **Send an email** action into the **For each** loop.

      Now, your workflow looks like the following example:

      ![Screenshot shows Consumption workflow, action named For each, and action named Send an email, now inside For each loop.](media/logic-apps-control-flow-loops/for-each-with-last-action-consumption.png)

1. When you're done, save your workflow.

1. To manually test your workflow, on the designer toolbar, select **Run Trigger** > **Run**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), create an example Standard logic app workflow with the following steps in the specfied order:

* The **RSS** trigger named **When a feed item is published** 

  For more information, [follow these general steps to add a trigger](create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

* The **Outlook.com** or **Office 365 Outlook** action named **Send an email**

  For more information, [follow these general steps to add an action](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. [Follow the same general steps](create-workflow-with-trigger-or-action.md?tabs=standard#add-action) to add the **For each** action between the RSS trigger and **Send an email** action in your workflow.

1. Now build the loop:

   1. On the designer, make sure that the **For each** action is selected.

   1. On the action information pane, select inside the **Select an output from previous steps** box so that the options for the dynamic content list (lightning icon) and expression editor (formula icon) appear. Select the dynamic content list option.

      ![Screenshot shows Azure portal, Standard workflow designer, action named For each, and selected lightning icon.](media/logic-apps-control-flow-loops/for-each-open-dynamic-content.png)

   1. In the **Add dynamic content** list, from the **When a feed item is published** section, select **Feed links**, which is an array output from the RSS trigger.

      > [!NOTE]
      >
      > If the **Feed links** output doesn't appear, next to the trigger section label, select **See more**. 
      > From the dynamic content list, you can select *only* outputs from previous steps.

      ![Screenshot shows Azure portal, Standard workflow designer, action named For each, and opened dynamic content list.](media/logic-apps-control-flow-loops/for-each-select-feed-links-standard.png)

      When you're done, the selected array output appears as in the following example:

      ![Screenshot shows Standard workflow, action named For each, and selected array output.](media/logic-apps-control-flow-loops/for-each-selected-array-standard.png)

   1. To run an existing action on each array item, drag the **Send an email** action into the **For each** loop.

      Now, your workflow looks like the following example:

      ![Screenshot shows Standard workflow, action named For each, and action named Send an email, now inside For each loop.](media/logic-apps-control-flow-loops/for-each-with-last-action-standard.png)

1. When you're done, save your workflow.

1. To manually test your workflow, on the workflow menu, select **Overview**. On the **Overview** toolbar, select **Run** > **Run**.

---

<a name="for-each-json"></a>

## For each action definition (JSON)

If you're working in your workflow's code view, you can define the `Foreach` loop in your workflow's JSON definition instead, for example:

``` json
"actions": {
   "For_each": {
      "actions": {
         "Send_an_email_(V2)": {
            "type": "ApiConnection",
            "inputs": {
               "body": {
                  "Body": "@{item()}",
                  "Subject": "New CNN post @{triggerBody()?['publishDate']}",
                  "To": "me@contoso.com"
               },
               "host": {
                  "connection": {
                     "name": "@parameters('$connections')['office365']['connectionId']"
                  }
               },
               "method": "post",
               "path": "/v2/Mail"
            },
            "runAfter": {}
         }
      },
      "foreach": "@triggerBody()?['links']",
      "runAfter": {},
      "type": "Foreach"
   }
},
```

<a name="sequential-foreach-loop"></a>

## "Foreach" loop: Sequential

By default, cycles in a "Foreach" loop run in parallel. 
To run each cycle sequentially, set the loop's **Sequential** option. 
"Foreach" loops must run sequentially when you have nested 
loops or variables inside loops where you expect predictable results. 

1. In the loop's upper right corner, choose **ellipses** (**...**) > **Settings**.

   ![On "Foreach" loop, choose "..." > "Settings"](media/logic-apps-control-flow-loops/for-each-loop-settings.png)

1. Under **Concurrency Control**, turn the 
**Concurrency Control** setting to **On**. 
Move the **Degree of Parallelism** slider to **1**, 
and choose **Done**.

   ![Turn on concurrency control](media/logic-apps-control-flow-loops/for-each-sequential-consumption.png)

If you're working with your logic app's JSON definition, 
you can use the `Sequential` option by adding the 
`operationOptions` parameter, for example:

``` json
"actions": {
   "myForEachLoopName": {
      "type": "Foreach",
      "actions": {
         "Send_an_email": { }
      },
      "foreach": "@triggerBody()?['links']",
      "runAfter": {},
      "operationOptions": "Sequential"
   }
}
```

<a name="until-loop"></a>

## "Until" loop
  
To run and repeat actions until a condition gets met or a state changes, put those actions in an "Until" loop. Your logic app first runs any and all actions inside the loop, and then checks the condition or state. If the condition is met, the loop stops. Otherwise, the loop repeats. For the default and maximum limits on the number of "Until" loops that a logic app run can have, see [Concurrency, looping, and debatching limits](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits).

Here are some common scenarios where you can use an "Until" loop:

* Call an endpoint until you get the response you want.

* Create a record in a database. Wait until a specific field in that record gets approved. Continue processing. 

Starting at 8:00 AM each day, this example logic app increments a variable until the variable's value equals 10. The logic app then sends an email that confirms the current value. 

> [!NOTE]
> These steps use Office 365 Outlook, but you can 
> use any email provider that Logic Apps supports. 
> [Check the connectors list here](/connectors/). 
> If you use another email account, the general steps stay the same, 
> but your UI might look slightly different. 

1. Create a blank logic app. In Logic App Designer, 
   under the search box, choose **All**. Search for "recurrence". 
   From the triggers list, select this trigger: **Recurrence - Schedule**

   ![Add "Recurrence - Schedule" trigger](./media/logic-apps-control-flow-loops/do-until-loop-add-trigger.png)

1. Specify when the trigger fires by setting the interval, frequency, 
   and hour of the day. To set the hour, choose **Show advanced options**.

   ![Set up recurrence schedule](./media/logic-apps-control-flow-loops/do-until-loop-set-trigger-properties.png)

   | Property | Value |
   | -------- | ----- |
   | **Interval** | 1 | 
   | **Frequency** | Day |
   | **At these hours** | 8 |
   ||| 

1. Under the trigger, choose **New step**. 
   Search for "variables", and select this action: 
   **Initialize variable - Variables**

   ![Add "Initialize variable - Variables" action](./media/logic-apps-control-flow-loops/do-until-loop-add-variable.png)

1. Set up your variable with these values:

   ![Set variable properties](./media/logic-apps-control-flow-loops/do-until-loop-set-variable-properties.png)

   | Property | Value | Description |
   | -------- | ----- | ----------- |
   | **Name** | Limit | Your variable's name | 
   | **Type** | Integer | Your variable's data type | 
   | **Value** | 0 | Your variable's starting value | 
   |||| 

1. Under the **Initialize variable** action, choose **New step**. 

1. Under the search box, choose **All**. Search for "until", 
   and select this action: **Until - Control**

   ![Add "Until" loop](./media/logic-apps-control-flow-loops/do-until-loop-add-until-loop.png)

1. Build the loop's exit condition by selecting 
   the **Limit** variable and the **is equal** operator. 
   Enter **10** as the comparison value.

   ![Build exit condition for stopping loop](./media/logic-apps-control-flow-loops/do-until-loop-settings.png)

1. Inside the loop, choose **Add an action**. 

1. Under the search box, choose **All**. Search for "variables", 
   and select this action: **Increment variable - Variables**

   ![Add action for incrementing variable](./media/logic-apps-control-flow-loops/do-until-loop-increment-variable.png)

1. For **Name**, select the **Limit** variable. For **Value**, 
     enter "1". 

     ![Increment "Limit" by 1](./media/logic-apps-control-flow-loops/do-until-loop-increment-variable-settings.png)

1. Outside and under the loop, choose **New step**. 

1. Under the search box, choose **All**. 
     Find and add an action that sends email, 
     for example: 

     ![Add action that sends email](media/logic-apps-control-flow-loops/do-until-loop-send-email.png)

1. If prompted, sign in to your email account.

1. Set the email action's properties. Add the **Limit** 
     variable to the subject. That way, you can confirm the 
     variable's current value meets your specified condition, 
     for example:

      ![Set up email properties](./media/logic-apps-control-flow-loops/do-until-loop-send-email-settings.png)

      | Property | Value | Description |
      | -------- | ----- | ----------- | 
      | **To** | *\<email-address\@domain>* | The recipient's email address. For testing, use your own email address. | 
      | **Subject** | Current value for "Limit" is **Limit** | Specify the email subject. For this example, make sure that you include the **Limit** variable. | 
      | **Body** | <*email-content*> | Specify the email message content you want to send. For this example, enter whatever text you like. | 
      |||| 

1. Save your logic app. To manually test your logic app, 
     on the designer toolbar, choose **Run**.

      After your logic starts running, you get an email with the content that you specified:

      ![Received email](./media/logic-apps-control-flow-loops/do-until-loop-sent-email.png)

<a name="prevent-endless-loops"></a>

## Prevent endless loops

The "Until" loop stops execution based on these properties, so make sure that you set their values accordingly:

* **Count**: This value is the highest number of loops that run before the loop exits. For the default and maximum limits on the number of "Until" loops that a logic app run can have, see [Concurrency, looping, and debatching limits](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits).

* **Timeout**: This value is the most amount of time that the "Until" action, including all the loops, runs before exiting and is specified in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). For the default and maximum limits on the **Timeout** value, see [Concurrency, looping, and debatching limits](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits).

  The timeout value is evaluated for each loop cycle. If any action in the loop takes longer than the timeout limit, the current cycle doesn't stop. However, the next cycle doesn't start because the limit condition isn't met.

To change these limits, in the loop action, select **Change limits**.

<a name="until-json"></a>

## "Until" definition (JSON)

If you're working in code view for your logic app, 
you can define an `Until` loop in your logic app's 
JSON definition instead, for example:

``` json
"actions": {
   "Initialize_variable": {
      // Definition for initialize variable action
   },
   "Send_an_email": {
      // Definition for send email action
   },
   "Until": {
      "type": "Until",
      "actions": {
         "Increment_variable": {
            "type": "IncrementVariable",
            "inputs": {
               "name": "Limit",
               "value": 1
            },
            "runAfter": {}
         }
      },
      "expression": "@equals(variables('Limit'), 10)",
      // To prevent endless loops, an "Until" loop 
      // includes these default limits that stop the loop. 
      "limit": { 
         "count": 60,
         "timeout": "PT1H"
      },
      "runAfter": {
         "Initialize_variable": [
            "Succeeded"
         ]
      }
   }
}
```

This example "Until" loop calls an HTTP endpoint, 
which creates a resource. The loop stops when the 
HTTP response body returns with `Completed` status. 
To prevent endless loops, the loop also stops 
if any of these conditions happen:

* The loop ran 10 times as specified by the `count` attribute. 
The default is 60 times. 

* The loop ran for two hours as specified by the `timeout` attribute in ISO 8601 format. 
The default is one hour.
  
``` json
"actions": {
   "myUntilLoopName": {
      "type": "Until",
      "actions": {
         "Create_new_resource": {
            "type": "Http",
            "inputs": {
               "body": {
                  "resourceId": "@triggerBody()"
               },
               "url": "https://domain.com/provisionResource/create-resource",
               "body": {
                  "resourceId": "@triggerBody()"
               }
            },
            "runAfter": {},
            "type": "ApiConnection"
         }
      },
      "expression": "@equals(triggerBody(), 'Completed')",
      "limit": {
         "count": 10,
         "timeout": "PT2H"
      },
      "runAfter": {}
   }
}
```

## Get support

* For questions, visit the 
[Microsoft Q&A question page for Azure Logic Apps](/answers/topics/azure-logic-apps.html).
* To submit or vote on features and suggestions, 
[Azure Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* [Run steps based on a condition (condition action)](../logic-apps/logic-apps-control-flow-conditional-statement.md)
* [Run steps based on different values (switch action)](../logic-apps/logic-apps-control-flow-switch-statement.md)
* [Run or merge parallel steps (branches)](../logic-apps/logic-apps-control-flow-branches.md)
* [Run steps based on grouped action status (scopes)](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md)
