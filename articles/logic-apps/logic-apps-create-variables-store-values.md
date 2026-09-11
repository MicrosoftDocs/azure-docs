---
title: Create Variables to Store and Pass Values
description: Create variables to store and pass values for workflows in Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 09/11/2026
# Customer intent: As an automation and integration developer who works with Azure Logic Apps, I want to know how to create variables so I can store, use, and pass values in my workflows.
---

# Create variables to store and pass values in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To store and pass values in your workflow, create variables. Variables support integer, float, Boolean, string, array, and object values.

For example, variables can help you track the number of times that a loop runs. To iterate over an array or check an array for a specific item, use a variable to reference the index number for each array item.

After you create a variable, choose a task:

- [Create a variable](#create-variable)
- [Get a variable's value](#get-value)
- [Increment a variable](#increment-variable)
- [Decrement a variable](#decrement-variable)
- [Change a variable's value](#assign-value)
- [Append to a string or array variable](#append-value)
- [Example: Count email attachments with a loop](#example-create-loop-counter)

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The logic app workflow where you want to create the variable, including a trigger that starts the workflow.

  Before you can add actions for creating and working with variables, your workflow must [start with a trigger](create-workflow-with-trigger-or-action.md#add-trigger) as the first step in your workflow.

  This guide uses the Azure portal, but you can use Visual Studio Code and the corresponding Azure Logic Apps extension to build logic app workflows:

  - Consumption workflows: [Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
  - Standard workflows: [Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

## Considerations for working with variables

- By default, **For each** loop iterations run in parallel. To make sure variables in a loop produce predictable results, [run the loop sequentially](logic-apps-control-flow-loops.md#sequential-foreach-loop).

- Variables exist and are global only within the workflow that creates them.
- Variables persist across loop iterations only within that workflow.
- Reference a variable by its name, not the name of the action that created the variable, which is the usual way to reference an action's outputs.

<a name="create-variable"></a>

## Initialize variable

To create a variable, add the **Initialize variable** action to your workflow. You can declare variables only at the workflow global level, not in scopes, conditions, and loops.

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. In the designer, add the action named **Initialize variable** by following the general steps based on your workflow type:

   - [Consumption](add-trigger-action-workflow.md?tabs=consumption#add-action)
   - [Standard](add-trigger-action-workflow.md?tabs=standard#add-action)

1. Provide the following information about your variable:

   | Property | Required | Value |  Description |
   |----------|----------|-------|--------------|
   | **Name** | Yes | <*variable-name*> | The name for the variable. |
   | **Type** | Yes | <*variable-type*> | The data type for the variable. |
   | **Value** | No | <*start-value*> | The initial value for your variable. <br><br>**Tip**: Although optional, set the value as a best practice so you always know your variable's start value. |

   To create more than one variable at a time, select **Add a Variable**.

   For example, this **Initialize variable** action contains the variable's name, data type, and initial value:

   :::image type="content" source="./media/logic-apps-create-variables-store-values/initialize-variable.png" alt-text="Screenshot that shows the Azure portal and a logic app workflow with an action named Initialize variable." lightbox="./media/logic-apps-create-variables-store-values/initialize-variable.png":::

1. Continue to add the actions you want for your scenario. When you're done, on the designer toolbar, select **Save**.

If you switch from the designer to code view, the following example shows how the **Initialize variable** action appears in your workflow definition, which is in JavaScript Object Notation (JSON) format:

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [ 
            {
               "name": "Count",
               "type": "Integer",
               "value": 0
            }
         ]
      },
      "runAfter": {}
   }
}
```

The following examples show other variable types:

*Boolean variable*

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [
            {
               "name": "myBooleanVariable",
               "type": "boolean",
               "value": false
            }
         ]
      },
      "runAfter": {}
   }
},
```

*Float variable*

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [
            {
               "name": "myFloatVariable",
               "type": "float",
               "value": 1.99999
            }
         ]
      },
      "runAfter": {}
   }
},
```

*String variable*

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [
            {
               "name": "myStringVariable",
               "type": "string",
               "value": "lorem ipsum"
            }
         ]
      },
      "runAfter": {}
   }
},
```

*Object variable*

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [
            {
               "name": "MyObjectVariable",
               "type": "object",
               "value": {
                  "ProductItem": {
                     "Name": "myProductName",
                     "ProductID": "000000"
                  }
               }
            }
         ]
      },
      "runAfter": {}
   }
},
```

*Array with integers*

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [
            {
               "name": "myArrayVariable",
               "type": "array",
               "value": [1, 2, 3]
            }
         ]
      },
      "runAfter": {}
   }
},
```

*Array with strings*

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [
            {
               "name": "myArrayVariable",
               "type": "array",
               "value": ["red", "orange", "yellow"]
            }
         ]
      },
      "runAfter": {}
   }
},
```

<a name="get-value"></a>

## Get a variable's value

To retrieve or reference a variable's contents, use the [`variables()` function](expression-functions-reference.md#variables) in the workflow designer and the code view editor. When you reference a variable, use the variable's name as the token, not the action's name, which is the usual way to reference an action's outputs.

For example, the following expression gets the items from the array variable [that you create in this guide](#append-value) by using the `variables()` function. The `string()` function returns the variable's contents in string format: `"1, 2, 3, red"`.

```json
@{string(variables('myArrayVariable'))}
```

<a name="increment-value"></a>

## Increment variable

To increase or *increment* a variable by a specific constant value, add the **Increment variable** action to your workflow. This action works only with integer and float variables.

1. In the designer, add the action named **Increment variable** by following the general steps based on your workflow type:

   - [Consumption](add-trigger-action-workflow.md?tabs=consumption#add-action)
   - [Standard](add-trigger-action-workflow.md?tabs=standard#add-action)

1. Provide the following information for this action:

   | Property | Required | Value |  Description |
   |----------|----------|-------|--------------|
   | **Name** | Yes | <*variable-name*> | The name for the variable to increment. |
   | **Value** | No | <*increment-value*> | The value to use for incrementing the variable. The default value is `1`. <br><br>**Tip**: Although optional, set this value as a best practice so that you always know the specific value for incrementing your variable. |

   The following example shows the sample values for this action:

   :::image type="content" source="./media/logic-apps-create-variables-store-values/increment-variable-action.png" alt-text="Screenshot that shows the Azure portal and a logic app workflow with an action named Increment variable." lightbox="./media/logic-apps-create-variables-store-values/increment-variable-action.png":::

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

If you switch from the designer to code view, the following example shows how the **Increment variable** action appears in your workflow definition, which is in JSON format:

```json
"actions": {
   "Increment_variable": {
      "type": "IncrementVariable",
      "inputs": {
         "name": "Count",
         "value": 1
      },
      "runAfter": {}
   }
},
```

<a id="example-create-loop-counter"></a>

## Example: Count email attachments with a loop

In this example, you initialize a counter at zero, increment the counter once for each email attachment, and return the total attachment count.

1. In the Azure portal, create your logic app resource with a blank workflow. Add a trigger that checks for new email and any attachments.

      This example uses the Office 365 Outlook trigger named **When a new email arrives**. Set up this trigger to fire only when the email has attachments. However, you can use any connector that checks for new emails with attachments, such as the Outlook.com connector.

1. In the trigger, select **Yes** for the following properties to check for attachments and pass those attachments into your workflow:

   - **Only With Attachment**
   - **Include Attachments**

   :::image type="content" source="./media/logic-apps-create-variables-store-values/check-include-attachments.png" alt-text="Screenshot that shows the Azure portal and logic app workflow with Office 365 Outlook trigger properties selected for checking and including attachments." lightbox="./media/logic-apps-create-variables-store-values/check-include-attachments.png":::

1. Add the [**Initialize variable** action](#create-variable) to create an integer variable named **Count** that starts at **0**.

1. In the designer, add the action named **For each** by following the general steps based on your workflow type:

   - [Consumption](add-trigger-action-workflow.md?tabs=consumption#add-action)
   - [Standard](add-trigger-action-workflow.md?tabs=standard#add-action)

1. In the loop, follow these steps:

   1. Select inside the box named **Select an Output from Previous Steps** to view the input options.
   1. Select the lightning icon to view the dynamic content list.
   1. From the list, under **When a new email arrives**, select **Attachments**.

   :::image type="content" source="./media/logic-apps-create-variables-store-values/select-attachments.png" alt-text="Screenshot that shows the Azure portal and logic app workflow with a For each loop, opened dynamic content list, and selected Attachments output." lightbox="./media/logic-apps-create-variables-store-values/select-attachments.png":::

   The **Attachments** property passes an array that contains the email attachments from the trigger's output into the loop for your workflow to iterate over.

1. In the **For each** loop, select **Add an action**. 

1. In the designer, add the action named **Increment variable** by following the general steps based on your workflow type:

   - [Consumption](add-trigger-action-workflow.md?tabs=consumption#add-action)
   - [Standard](add-trigger-action-workflow.md?tabs=standard#add-action)

   > [!NOTE]
   >
   > Make sure that the **Increment variable** action appears inside the loop. If the action appears outside the loop, drag the action into the loop.

1. In the **Increment variable** action, from the **Name** list, select the **Count** variable. Set the **Value** property to **1**.

   :::image type="content" source="./media/logic-apps-create-variables-store-values/add-increment-variable-loop.png" alt-text="Screenshot Azure portal and logic app workflow with a selected variable named Count." lightbox="./media/logic-apps-create-variables-store-values/add-increment-variable-loop.png":::

1. Under the loop, add any action that sends you the number of attachments. In your action, include the value from the **Count** variable, for example:

   :::image type="content" source="./media/logic-apps-create-variables-store-values/send-email-results.png" alt-text="Screenshot that shows the Azure portal and logic app workflow with an action that sends the results." lightbox="./media/logic-apps-create-variables-store-values/send-email-results.png":::

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### Test your workflow

1. To manually trigger your workflow, on the designer toolbar, select **Run** > **Run** to manually run your workflow.

1. Send an email with one or more attachments to the email account you used in this example.

   This step fires the workflow trigger, which creates and runs a workflow instance. As a result, the workflow sends you a message or email that shows the number of attachments in the email that you sent.

If you switch from the designer to code view, the following example shows how the **For each** loop appears along with the **Increment variable** action in your workflow definition, which is in JSON format:

```json
"actions": {
   "For_each": {
      "type": "Foreach",
      "actions": {
         "Increment_variable": {
           "type": "IncrementVariable",
            "inputs": {
               "name": "Count",
               "value": 1
            },
            "runAfter": {}
         }
      },
      "foreach": "@triggerBody()?['Attachments']",
      "runAfter": {
         "Initialize_variable": [ "Succeeded" ]
      }
   }
},
```

<a name="decrement-value"></a>

## Decrement variable

To decrease or *decrement* a variable by a specific constant value, follow the steps for [incrementing a variable](#increment-value) except that you add the **Decrement variable** action to your workflow instead. This action works only with integer and float variables.

The following table describes the information for the **Decrement variable** action:

| Property | Required | Value |  Description |
|----------|----------|-------|--------------|
| **Name** | Yes | <*variable-name*> | The name for the variable to decrement | 
| **Value** | No | <*decrement-value*> | The value for decrementing the variable. The default value is one. <br><br>**Tip**: Although optional, set this value as a best practice so you always know the specific value for decrementing your variable. |

If you switch from the designer to code view, the following example shows how the **Decrement variable** action appears in your workflow definition, which is in JSON format:

```json
"actions": {
   "Decrement_variable": {
      "type": "DecrementVariable",
      "inputs": {
         "name": "Count",
         "value": 1
      },
      "runAfter": {}
   }
},
```

<a name="assign-value"></a>

## Set variable

To assign a different value to an existing variable, follow the steps for [incrementing a variable](#increment-value) with the following exceptions:

1. Find and select the **Set variable** action instead.

1. Provide the following information for this action:

   | Property | Required | Value |  Description |
   |----------|----------|-------|--------------|
   | **Name** | Yes | <*variable-name*> | The name for the variable to change. |
   | **Value** | Yes | <*new-value*> | The value you want to assign the variable. Make sure both the variable and the new value have the same data type. The value is required because this action doesn't have a default value. |

   > [!NOTE]
   >
   > Unless you're incrementing or decrementing variables, changing variables inside loops *might* create unexpected results because loops run in parallel, or concurrently, by default. For these cases, try setting your loop to run sequentially. For example, when you want to reference the variable value inside the loop and expect same value at the start and end of that loop instance, follow these steps to change how the loop runs: 
   >
   > 1. Select your loop to view the information pane, and then select **Settings**.
   >
   > 1. In the **General** section, under **Concurrency control**, change the setting from **Off** to **On**.
   >
   > 1. Drag the **Degree of parallelism** slider to **1**.

If you switch from the designer to code view, the following example shows how the **Set variable** action appears in your workflow definition, which is in JSON format, and changes the **`Count`** variable's current value to another value:

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [ {
               "name": "Count",
               "type": "Integer",
               "value": 0
          } ]
      },
      "runAfter": {}
   },
   "Set_variable": {
      "type": "SetVariable",
      "inputs": {
         "name": "Count",
         "value": 100
      },
      "runAfter": {
         "Initialize_variable": [ "Succeeded" ]
      }
   }
},
```

<a name="append-value"></a>

## Append to variable

For variables that store strings or arrays, you can insert or *append* a variable's value as the last item in those strings or arrays. Follow the steps for [incrementing a variable](#increment-value) with the following exceptions:

1. Find and select one of these actions based on whether your variable is a string or an array: 

   - **Append to string variable**
   - **Append to array variable** 

1. Provide the value to append as the last item in the string or array.

   | Property | Required | Value |  Description |
   |----------|----------|-------|--------------|
   | **Name** | Yes | <*variable-name*> | The name for the variable to change. |
   | **Value** | Yes | <*append-value*> | The value you want to append, which can have any type. |

If you switch from the designer to code view, the following example shows how the **Append to array variable** action appears in your workflow definition, which is in JSON format.

The following example creates an array variable, and adds another value as the last item in the array. Your result is an updated variable that contains this array: `[1,2,3,"red"]`.

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [ {
            "name": "myArrayVariable",
            "type": "Array",
            "value": [1, 2, 3]
         } ]
      },
      "runAfter": {}
   },
   "Append_to_array_variable": {
      "type": "AppendToArrayVariable",
      "inputs": {
         "name": "myArrayVariable",
         "value": "red"
      },
      "runAfter": {
        "Initialize_variable": [ "Succeeded" ]
      }
   }
},
```

## Related content

- [Expression functions](expression-functions-reference.md)
- [Create sequential For each loops](logic-apps-control-flow-loops.md#sequential-foreach-loop)
