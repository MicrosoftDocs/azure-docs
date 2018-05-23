---
# required metadata
title: Save values as variables - Azure Logic Apps | Microsoft Docs
description: Create variables for saving and changing values in Azure Logic Apps
services: logic-apps
author: ecfan
manager: cfowler
ms.author: estfan
ms.topic: article
ms.date: 05/26/2018
ms.service: logic-apps

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
---

# Save and manage values as variables in Azure Logic Apps

This article shows how you can store and use values 
throughout your logic app by creating variables. 
For example, variables can help you count the number 
of times that a loop runs, or find an array item 
by referencing that item's index value. 
After you create a variable, you can perform 
other tasks with that variable, for example:

* Increase or decrease the value for an integer or float variable.
* Assign another value to a variable, provided they have the same data type.
* Add a value at the end of an array variable or string variable.
* Get the value from a variable.

Variables exist globally only within the logic app 
instance that creates them. They also persist across 
a loop's iterations within the logic app instance. 

If you don't have an Azure subscription yet, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

## Prerequisites

* The logic app where you want to create the variable. 
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* A [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
as the first step in your logic app. Before you can add actions 
that help you create and work with variables, your logic app must 
start with a trigger.

<a name="create-variable"></a>

## Create variable

You can declare a variable along with its data type and 
initial value - all at the same time in your logic app. 

1. In the Azure portal or Visual Studio, 
open your logic app in Logic App Designer. 

   This example uses the Azure portal 
   and a logic app with an existing trigger.

2. In Logic App Designer, under the step in your logic app 
where you want to add a variable, add an action.

   To add an action under the last step, 
   choose **New step** > **Add an action**.

     ![Add action](./media/logic-apps-create-variables-store-values/add-action.png)

   To add an action between existing steps, 
   move your mouse over the connecting arrow 
   so that the plus sign (+) appears. Choose 
   the plus sign, and then choose **Add an action**.

3. In the search box, enter "variables" as your filter. 
From the actions list, select this action: 
**Variables - Initialize variable** 

   ![Select action](./media/logic-apps-create-variables-store-values/select-initialize-variable-action.png)

4. Provide this information for the variable you want to create.

   | Property | Required | Value |  Description |
   |----------|----------|-------|--------------|
   | Name | Yes | <*variable-name*> | The name for the variable to increment | 
   | Type | Yes | <*variable-type*> | The data type for the variable | 
   | Value | No | <*start-value*> | The initial value for your variable <p><p>**Tip**: Although optional, set this value as a best practice so you always know the start value for your variable. | 
   ||||| 

   For example: 

   ![Initialize variable](./media/logic-apps-create-variables-store-values/initialize-variable.png)

5. Now continue adding the actions you want. 
When you're done, on the designer toolbar, choose **Save**.

Here is how the **Initialize variable** action appears 
in the underlying logic app definition 
when you switch from the designer and code view. 
The definition uses JavaScript Object Notation (JSON) format:

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
      }
   },
   "runAfter": {}
},
```

Here are examples for a few other variable types:

*Array with integers*

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
      }
   },
   "runAfter": {}
},
```

*Array with strings*

```json
"actions": {
   "Initialize_variable": {
      "type": "InitializeVariable",
      "inputs": {
         "variables": [ {
               "name": "myArrayVariable",
               "type": "Array",
               "value": ["red", "orange", "yellow"]
          } ]
      }
   },
   "runAfter": {}
},
```

<a name="change-variable-value"></a>

## Change values for variables

After you create a variable, you have several ways 
that you can change the value in that variable.

* [*Increment*](#increment-value) or add a value to the variable. 
This action works only for integer or float variables.

* [*Decrement*](#decrement-value) or subtract a value from the variable.
This action works only for integer or float variables.

* [Assign a new value](#assign-value) to the variable. 
Both the new value and the variable must have the same data type.

* [*Append*](#append-value) or add a value 
at the end of a string or array variable. 
Both the value and variable must have the same data type.

If you don't have an existing variable yet, 
[create that variable now](#create-variable).

<a name="increment-value"></a>

## Increment variable 

To increase a variable by a specific value, add the 
**Variables - Increment variable** action to your logic app. 
This action works only with integer and float variables.

1. In Logic App Designer, under the step where 
you want to increase an existing variable, 
choose **New step** > **Add an action**. 

   For example, this logic app already has a trigger 
   and an action that created a variable. So, you add 
   a new action under these steps:

   ![Add action](./media/logic-apps-create-variables-store-values/add-increment-variable-action.png)

   To add an action between existing steps, 
   move your mouse over the connecting arrow 
   so that the plus sign (+) appears. Choose 
   the plus sign, and then choose **Add an action**.

2. In the search box, enter "increment variable" as your filter. 
In the actions list, select this action: 
**Variables - Increment variable**

   ![Select "Increment variable" action](./media/logic-apps-create-variables-store-values/select-increment-variable-action.png)

3. Provide the information for incrementing your variable. 
Here are the properties for this action:

   | Property | Required | Value |  Description |
   |----------|----------|-------|--------------|
   | Name | Yes | <*variable-name*> | The name for the variable to increment | 
   | Value | No | <*increment-value*> | The value used for incrementing the variable. The default value is one. <p><p>**Tip**: Although optional, set this value as a best practice so you always know the specific value for incrementing your variable. | 
   |||| 

   For example: 
   
   ![Increment value example](./media/logic-apps-create-variables-store-values/increment-variable-action-information.png)

4. When you're done, on the designer toolbar, choose **Save**. 

Here is how the **Increment variable** action appears 
in the underlying logic app definition 
when you switch from the designer and code view. 
The definition uses JavaScript Object Notation (JSON) format:

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

### Example: Count loop cycles

Variables often perform the work for counting how many times a loop runs. 
This example shows how you can use variables for this task. 

1. Create a blank logic app, and add a trigger that checks for new email. 
Set up the trigger to fire only when the email has one or more attachments. 

   This example uses the Office 365 Outlook trigger for **When a new email arrives**. 
   However, you can use any connector that checks for new emails with attachments, 
   such as the Outlook.com connector.

2. Set up the trigger to check for attachments and 
include those attachments as inputs for the workflow. 

   1. In this example, inside the trigger, 
   choose **Show advanced options**. 

   2. Set these properties to **Yes**: 
   
      * **Has Attachment** 
      * **Include Attachments** 

      ![Check for and include attachments](./media/logic-apps-create-variables-store-values/check-include-attachments.png)

3. Add the [**Initialize variable**](#create-variable) 
action so that you can create an integer variable for 
counting and tracking the number of attachments, for example:

   ![Add action for "Initialize variable"](./media/logic-apps-create-variables-store-values/initialize-variable.png)

4. Under the previous action, add a "for each" 
loop that cycles through each attachment. 
(Choose **New step** > **More** > **Add a for each**)

   ![Add a "for each" loop](./media/logic-apps-create-variables-store-values/add-loop.png)

5. In the **For each** loop, click in the **Select an output from previous steps** box. 
When the dynamic content list appears, select **Attachments**. 

   ![Select "Attachments"](./media/logic-apps-create-variables-store-values/select-attachments.png)

   The **Attachments** field passes an array that has the 
   email attachments as output from the trigger.

6. In the "for each" loop, select **Add an action**. 

   ![Select "Add an action"](./media/logic-apps-create-variables-store-values/add-action-2.png)

7. In the search box, enter "increment variable" as your filter. 
From the actions list, select the **Increment variable** action.

   > [!NOTE]
   > Make sure the **Increment variable** action appears inside the loop. 
   > If the action appears outside the loop, drag the action into the loop.

8. In the **Increment variable** action, 
select the **Count** variable from the **Name** list. 

   ![Select "Add an action"](./media/logic-apps-create-variables-store-values/add-increment-variable-example.png)

   The default incremental value is one, 
   so you don't have to specify a value for this example. 

9. Outside the loop, add an action that 
sends you the total number of attachments. 
This example sends an email with the results.

   ![Add an action that sends results](./media/logic-apps-create-variables-store-values/send-email-results.png)

10. Save your logic app. On the designer toolbar, choose **Save**. 

Here is how the **Increment variable** action appears inside 
the "for each" loop in the underlying logic app definition 
when you switch from the designer and code view. 
The definition uses JavaScript Object Notation (JSON) format:

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

### Test your logic app

1. If your logic app isn't running already, on the logic app menu, 
choose **Overview**. On the **Overview** page, choose **Enable**. 

2. Send an email with one or more attachments 
to the email account you used in this example.

3. On the Logic App Designer, choose **Run**. 
This step manually and immediately starts your logic app.

After your logic app finishes running, 
you get an email with the number of attachments 
for the email you sent to yourself. 

<a name="decrement-value"></a>

## Decrement variable

To decrease an existing variable by a specific value, you can follow 
the steps for [increasing a variable](#increment-value) except that you 
find and select the **Variables - Decrement variable** action instead. 
This action works only with integer and float variables.

Here are the properties for the **Decrement variable** action:

| Property | Required | Value |  Description |
|----------|----------|-------|--------------|
| Name | Yes | <*variable-name*> | The name for the variable to decrement | 
| Value | No | <*increment-value*> | The value for decrementing the variable. The default value is one. <p><p>**Tip**: Although optional, set this value as a best practice so you always know the specific value for decrementing your variable. | 
||||| 

Here is how the **Decrement variable** action appears 
in the underlying logic app definition 
when you switch from the designer and code view. 
The definition uses JavaScript Object Notation (JSON) format:

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

## Assign new values

To assign a different value to an existing variable, 
you can follow the steps for [increasing a variable](#increment-value) 
except for these steps: 

* Find and select the **Variables - Set variable** action instead. 

* Provide the value you want to assign the variable. 
This value is required because this action doesn't have a default value. 

Here are the properties for the **Set variable** action:

| Property | Required | Value |  Description | 
|----------|----------|-------|--------------| 
| Name | Yes | <*variable-name*> | The name for the variable to change | 
| Value | Yes | <*new-value*> | The value you want to assign the variable. Both the new value and variable must have the same data type. | 
||||| 

Here is how the **Set variable** action appears 
in the underlying logic app definition 
when you switch from the designer and code view. 
In this example, the variable value is reset to zero 
after a previously defined "for each" loop exits successfully.
The definition uses JavaScript Object Notation (JSON) format:

```json
"actions": {
   "Set_variable": {
      "type": "SetVariable",
      "inputs": {
         "name": "Count",
         "value": 0
      },
      "runAfter": {
         "For_each": [ "Succeeded" ]
      }
   }
},
```

<a name="append-value"></a>

## Append to variable

For variables that store either strings or arrays, you can 
add a value as the last item in those strings or arrays. 
Both the value and variable must have the same data type. 
You can follow the steps for [increasing a variable](#increment-value) 
except for these steps: 

* Select the action based on whether you have a string or array variable: 

  * **Variables - Append to string variable**
  * **Variables - Append to array variable** 

* Provide the value you want to append to the variable. 
This value is required because this action doesn't have a default value. 

Here are the properties for the **Append to...** actions:

| Property | Required | Value |  Description | 
|----------|----------|-------|--------------| 
| Name | Yes | <*variable-name*> | The name for the variable to change | 
| Value | Yes | <*append-value*> | The value you want to append. Both the new value and variable must have the same data type. | 
|||||  

Here is how the **Append to array variable** action appears 
in the underlying logic app definition 
when you switch from the designer and code view. 
This example creates an array variable, and adds the 
specified value as the last array item in the variable:
The definition uses JavaScript Object Notation (JSON) format:

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
         "value": "4"
      },
      "runAfter": {
        "Initialize_variable": [ "Succeeded" ]
      }
   }
},
```

<a name="get-value"></a>

## Get values from variables

To retrieve or reference the value or values in a variable, you can use the 
[variables()](../logic-apps/workflow-definition-language-functions-reference.md#variables) function in the Logic App Designer or in code view.

For example, using the array variable [previously defined in this article](#append-value), 
this expression gets the array items from the variable with the **variables()** function. 
The **string()** function then returns those array items as this string: "1, 2, 3, 4"

```json
@{string(variables('myArrayVariable'))}
```

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about [Logic Apps connectors](../connectors/apis-list.md)
