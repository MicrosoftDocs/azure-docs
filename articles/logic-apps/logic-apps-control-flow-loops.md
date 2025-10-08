---
title: Repeat Actions with Loops in Workflows
description: Learn how to repeat actions by using loops in workflows for Azure Logic Apps. You can repeat actions on array items or until a condition is met.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/20/2025
#Customer intent: As an integration solution developer, I want to repeat an action on arrays and collections or until a condition is met by using a loop with my workflow in Azure Logic Apps.
---

# Add loops to repeat actions in workflows for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To repeat actions in a logic app workflow, you can add the **For each** loop or **Until** loop to your workflow, based on the needs for your scenario.

> [!NOTE]
>
> Looking for Power Automate documentation about loops? See [Use loops](/power-automate/desktop-flows/use-loops).

Based on your use case, you can choose from the following types of loop actions:

- To repeat one or more actions on items in an array or collection, add the [**For each** action](#foreach-loop) to your workflow.

  Alternatively, if you have a trigger that can handle arrays and want to run a workflow instance for each array item, you can *debatch* the array by setting the [**Split on** trigger property](logic-apps-workflow-actions-triggers.md#split-on-debatch).

- To repeat one or more actions until a condition is met or a specific state changes, add the [**Until** action](#until-loop) to your workflow.

  Your workflow first runs all the actions inside the loop, and then checks the condition or state. If the condition is met, the loop stops. Otherwise, the loop repeats. For the default and maximum limits on the number of **Until** loops that a workflow can have, see [Concurrency, looping, and debatching limits](logic-apps-limits-and-config.md#looping-debatching-limits).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn). 

- A logic app resource where you can create and edit a workflow. See [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md).

- The logic app resource and workflow where you want to repeat an action in a loop and a trigger that starts the workflow.

  Before you can add a loop action, your workflow must start with a trigger as the first step. For more information, see [Add a trigger or action to build a workflow](create-workflow-with-trigger-or-action.md).

The following steps use the Azure portal, but with the appropriate Azure Logic Apps extension, you can also use the following tools to build logic app workflows:

- Consumption workflows: [Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
- Standard workflows: [Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

Some steps differ slightly based on whether you have a Consumption or Standard workflow.

<a name="foreach-loop"></a>

## For each

The **For each** action works only on arrays. This loop repeats one or more actions on each item in an array. Review the following considerations for the **For each** action:

- The **For each** action can process a limited number of array items. For this limit, see [Concurrency, looping, and debatching limits](logic-apps-limits-and-config.md#looping-debatching-limits).

- By default, the cycles or iterations in a **For each** action run at the same time in parallel.

  This behavior differs from [Power Automate's **Apply to each** loop](/power-automate/apply-to-each) where iterations run one at a time, or sequentially. If your use case requires sequential processing, you can [set up **For each** iterations to run one at a time](#sequential-foreach-loop). For example, if you want to pause the next iteration in a **For each** action by using the [Delay action](../connectors/connectors-native-delay.md), you need to set up each iteration to run sequentially.

  As an exception to the default behavior, a nested **For each** action's iterations always run sequentially, not in parallel. To run actions concurrently on array items in a nested **For each** action, [create and call a child workflow](logic-apps-http-endpoint.md).

- To get predictable results from operations on variables during each iteration, run the iterations sequentially. For example, when a concurrently running iteration ends, the **Increment variable**, **Decrement variable**, and **Append to variable** operations return predictable results. However, during each iteration in the concurrently running loop, these operations might return unpredictable results.

- Actions in a **For each** loop use the [`item()` function](expression-functions-reference.md#item) to reference and process each item in the array. If you specify data that's not in an array, the workflow fails.

The following example workflow sends a daily summary for a website RSS feed. The workflow uses a **For each** action that sends an email for each new item.

1. In the [Azure portal](https://portal.azure.com), create a logic app workflow with the following steps in the specified order:

   - The **RSS** trigger named **When a feed item is published**

     Follow these general steps to add a trigger to a [Consumption](create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger) or [Standard](create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger) logic app workflow.

   - The **Outlook.com** or **Office 365 Outlook** action named **Send an email**

     Follow these general steps to add an action to a [Consumption](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action) or [Standard](create-workflow-with-trigger-or-action.md?tabs=standard#add-action) logic app workflow.

1. Follow the same general steps to add the **For each** action between the RSS trigger and **Send an email** action in your workflow.

1. Now build the loop:

   1. In the **For each** item, select inside the **Select An Output From Previous Steps** box, and then select the lightning icon.

   1. From the dynamic content list that opens, under **When a feed item is published**, select **Feed links**, which is an array output from the RSS trigger.

      > [!NOTE]
      >
      > If the **Feed links** output doesn't appear, next to the trigger section label, select **See more**. From the dynamic content list, you can select *only* outputs from previous steps.

      :::image type="content" source="media/logic-apps-control-flow-loops/for-each-select-feed-link.png" alt-text="Screenshot shows the Azure portal and workflow designer with an action named For each and the open dynamic content list." lightbox="media/logic-apps-control-flow-loops/for-each-select-feed-link.png":::

      When you're done, the selected array output appears as in the following example:

      :::image type="content" source="media/logic-apps-control-flow-loops/for-each-selected-array.png" alt-text="Screenshot shows the workflow designer and the action named For each with selected array output.":::

   1. To run an existing action on each array item, drag the **Send an email** action into the **For each** loop.

      Now, your workflow looks like the following example:

      :::image type="content" source="media/logic-apps-control-flow-loops/for-each-with-last-action.png" alt-text="Screenshot shows the workflow designer, action named For each, and action named Send an email, now inside the For each action.":::

1. When you're done, save your workflow.

1. To manually test your workflow, on the designer toolbar, select **Run** **>** **Run**.

<a name="for-each-json"></a>

## For each action definition (JSON)

If you're working in code view, you can define the `For_each` action in your workflow's JSON definition, for example:

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

## For each: Run sequentially

By default, the iterations in a **For each** action run at the same time in parallel. However, if you have nested loops or have variables inside loops where you expect predictable results, you must run those loops one at a time sequentially.

1. On the designer, select the **For each** action to open the information pane, and then select **Settings**.

1. Under **Concurrency control**, change the setting from **Off** to **On**.

1. Move the **Degree of parallelism** slider to **1**.

   :::image type="content" source="media/logic-apps-control-flow-loops/for-each-sequential.png" alt-text="Screenshot shows the For each action, Settings tab, and the Concurrency control setting turned on with the degree of parallelism slider set to 1.":::

## For each action definition (JSON): Run sequentially

If you're working in code view with the `For_each` action in your workflow's JSON definition, add the `operationOptions` parameter and set the parameter value to `Sequential`:

``` json
"actions": {
   "For_each": {
      "actions": {
         "Send_an_email_(V2)": { }
      },
      "foreach": "@triggerBody()?['links']",
      "runAfter": {},
      "type": "Foreach",
      "operationOptions": "Sequential"
   }
}
```

<a name="until-loop"></a>

## Until

The **Until** action runs and repeats one or more actions until the required specified condition is met. If the condition is met, the loop stops. Otherwise, the loop repeats. For the default and maximum limits on the number of **Until** actions or iterations, see [Concurrency, looping, and debatching limits](logic-apps-limits-and-config.md#looping-debatching-limits).

The following list contains some common scenarios where you can use an **Until** action:

- Call an endpoint until you get the response you want.

- Create a record in a database. Wait until a specific field in that record gets approved. Continue processing.

By default, the **Until** action succeeds or fails in the following ways:

- The **Until** loop succeeds if all the actions inside the loop succeed, and if the loop limit is reached, based on the run after behavior.

- If all actions in last iteration of the **Until** loop succeed, the entire **Until** loop is marked as **Succeeded**.

- If any action fails in the last iteration of the **Until** loop, the entire **Until** loop is marked as **Failed**.

- If any action fails in an iteration other than the last iteration, the next iteration continues to run, and the entire **Until** action isn't marked as **Failed**.

  To make the action fail instead, change the default behavior in the loop's JSON definition by adding the parameter named `operationOptions`, and setting the value to `FailWhenLimitsReached`, for example:

  ```json
  "Until": {
     "actions": {
       "Execute_stored_procedure": {
         <...>
         }
       },
       "expression": "@equals(variables('myUntilStop'), true)",
       "limit": {
         "count": 5,
         "timeout": "PT1H"
       },
       "operationOptions": "FailWhenLimitsReached",
       "runAfter": {
       "Initialize_variable_8": [
         "Succeeded"
       ]
     },
  "type": "Until"
  }
  ```

In the following example workflow, starting at 8:00 AM each day, the **Until** action increments a variable until the variable's value equals 10. The workflow then sends an email that confirms the current value. The example uses Office 365 Outlook, but you can use [any email provider that Azure Logic Apps supports](/connectors/). If you use another email account, the general steps stay the same, but look slightly different.

1. In the [Azure portal](https://portal.azure.com), create a logic app resource with a blank workflow. Refer to the earlier procedure.

1. In the designer, follow the general steps to add the **Schedule** built-in trigger named **Recurrence** to your [Consumption](create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger) or [Standard](create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger) workflow.

1. In the **Recurrence** trigger, specify the interval, frequency, and time for the trigger to fire.

   | Parameter | Value |
   |-----------|-------|
   | **Interval** | **1** |
   | **Frequency** | **Day** |
   | **At these hours** | **8** |
   | **At these minutes** | **00** |

   **At these hours** and **At these minutes** appear after you set **Frequency** to **Day**.

   When you're done, the **Recurrence** trigger looks like the following example:

   :::image type="content" source="./media/logic-apps-control-flow-loops/do-until-trigger-complete.png" alt-text="Screenshot shows the Azure portal and workflow designer with Recurrence trigger parameters set up.":::

1. Under the trigger, follow these general steps to add the **Variables** built-in action named **Initialize variables** to your [Consumption](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action) or [Standard](create-workflow-with-trigger-or-action.md?tabs=standard#add-action) logic app workflow.

1. In the **Initialize variables** action, provide the following values:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Name** | **Limit** | Your variable's name |
   | **Type** | **Integer** | Your variable's data type |
   | **Value** | **0** | Your variable's starting value |

   :::image type="content" source="./media/logic-apps-control-flow-loops/do-until-loop-variable-property.png" alt-text="Screenshot shows the Azure portal, workflow designer, and built-in action named Initialize variable with parameters." lightbox="./media/logic-apps-control-flow-loops/do-until-loop-variable-property.png":::

1. Under the **Initialize variables** action, follow these general steps to add the **Control** built-in action named **Until** to your [Consumption](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action) or [Standard](create-workflow-with-trigger-or-action.md?tabs=standard#add-action) logic app workflow.

1. In the **Until** action, provide the following values to set up the stop condition for the loop.

   1. Select inside the **Loop Until** box, and select the lightning icon to open the dynamic content list.

   1. From the list, under **Variables**, select the variable named **Limit**.

   1. Under **Count**, enter **10** as the comparison value.

   :::image type="content" source="./media/logic-apps-control-flow-loops/do-until-loop-setting.png" alt-text="Screenshot shows a workflow and built-in action named Until with the values described." lightbox="./media/logic-apps-control-flow-loops/do-until-loop-setting.png":::

1. Inside the **Until** action, select **+** > **Add an action**.

1. Follow these general steps to add the **Variables** built-in action named **Increment variable** to the **Until** action in your [Consumption](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action) or [Standard](create-workflow-with-trigger-or-action.md?tabs=standard#add-action) logic app workflow.

1. In the **Increment variable** action, provide the following values to increment the **Limit** variable's value by 1:

   | Parameter | Value |
   |-----------|-------|
   | **Limit** | Select the **Limit** variable. |
   | **Value** | **1** |

   :::image type="content" source="./media/logic-apps-control-flow-loops/do-until-loop-increment-variable.png" alt-text="Screenshot shows a workflow and built-in action named Until with Limit set to Limit variable and Value set to 1." lightbox="./media/logic-apps-control-flow-loops/do-until-loop-increment-variable.png":::

1. Outside and under the **Until** action, follow these general steps to add an action that sends email in your [Consumption](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action) or [Standard](create-workflow-with-trigger-or-action.md?tabs=standard#add-action) logic app workflow.

   This example continues with the **Office 365 Outlook** action named **Send an email**.

1. In the email action, provide the following values:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **To** | <*email-address\@domain*> | The recipient's email address. For testing, use your own email address. | 
   | **Subject** | **Current value for "Limit" variable is:** **Limit** | The email subject. For this example, make sure that you include the **Limit** variable to confirm that the current value meets your specified condition: <br><br>1. Select inside the **Subject** box, and then select the lightning icon. <br><br>2. From the dynamic content list that opens, next to the **Variables** section header, select **See more**. <br><br>3. Select **Limit**. |
   | **Body** | <*email-content*> | The email message content that you want to send. For this example, enter whatever text you want. |

   When you're done, your email action looks similar to the following example:

   :::image type="content" source="./media/logic-apps-control-flow-loops/do-until-loop-send-email.png" alt-text="Screenshot shows a workflow and action named Send an email with property values." lightbox="./media/logic-apps-control-flow-loops/do-until-loop-send-email.png":::

1. Save your workflow.

### Test your workflow

To manually test your logic app workflow:

- On the designer toolbar, from the **Run** option, select **Run**.

After your workflow starts running, you get an email with the content that you specified:

:::image type="content" source="./media/logic-apps-control-flow-loops/do-until-loop-sent-email.png" alt-text="Screenshot shows sample email received from example workflow.":::

<a name="prevent-endless-loops"></a>

### Prevent endless loops

The **Until** action stops execution based on the optional **Count** and **Timeout** parameters. Make sure that you set these parameter values accordingly:

| Parameter | Description |
|-----------|-------------|
| **Count** | The maximum number of iterations that run before the loop exits. <br><br>For the default and maximum limits on the number of **Until** actions that a workflow can have, see [Concurrency, looping, and debatching limits](logic-apps-limits-and-config.md#looping-debatching-limits). |
| **Timeout** | The maximum amount of time that the **Until** action, including all iterations, runs before the loop exits. This value is specified in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) and is evaluated for each iteration. <br><br>If any action in the loop takes longer than the timeout limit, the current iteration doesn't stop. However, the next iteration doesn't start because the timeout limit condition is met. <br><br>For the default and maximum limits on the **Timeout** value, see [Concurrency, looping, and debatching limits](logic-apps-limits-and-config.md#looping-debatching-limits). |

<a name="until-json"></a>

## "Until" definition (JSON)

If you're working in code view, you can define an `Until` action in your workflow's JSON definition, for example:

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

This example **Until** loop calls an HTTP endpoint, which creates a resource. The loop stops when the HTTP response body returns with `Completed` status. To prevent endless loops, the loop also stops if any of the following conditions happen:

- The loop ran 10 times as specified by the `count` attribute. The default is 60 times.

- The loop ran for two hours as specified by the `timeout` attribute in ISO 8601 format. The default is one hour.

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
               "url": "https://domain.com/provisionResource/create-resource"
            },
            "runAfter": {},
            "type": "ApiConnection"
         }
      },
      "expression": "@equals(body('Create_new_resource'), 'Completed')",
      "limit": {
         "count": 10,
         "timeout": "PT2H"
      },
      "runAfter": {}
   }
}
```

## Related content

- [Run steps based on a condition (condition action)](logic-apps-control-flow-conditional-statement.md)
- [Run steps based on different values (switch action)](logic-apps-control-flow-switch-statement.md)
- [Run or merge parallel steps (branches)](logic-apps-control-flow-branches.md)
- [Run steps based on grouped action status (scopes)](logic-apps-control-flow-run-steps-group-scopes.md)
