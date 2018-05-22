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
For example, variables can help you count 
how often a loop runs, or find an array item 
by referencing that item's index value. 
Variables exist globally and only within the 
logic app instance where you create them. 
They are also shared across loops in the same instance. 

You can perform other tasks with variables, 
for example:

* Increase the value in a variable.
* Decrease the value in a variable.
* Change the value in a variable.
* Add the value in a variable to the end of an array.
* Add the value in a variable to the end of a string.

If you don't have an Azure subscription yet, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

## Prerequisites

* The logic app where you want to create the variable. 
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* A [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
as the first step in your logic app. Before you can add actions 
for creating and working with variables, 
your logic app must start with a trigger.

<a name="create-variable"></a>

## Create a variable

You can declare a variable and its data type 
plus a starting value - all at the same time 
in your logic app. 

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
   | Value | No | <*start-value*> | The initial value for your variable | 
   |||| 

   For example: 

   ![Initialize variable](./media/logic-apps-create-variables-store-values/initialize-variable.png)

5. Now continue adding the actions you want. 
When you're done, on the designer toolbar, choose **Save**.

<a name="change-variable-value"></a>

## Change values in variables

In Logic App Designer, you have a few ways that you 
can change the value in an existing variable. 

* [Add a value or "increment" the variable](#increment-value).
* [Subtract a value or "decrement" the variable](#decrement-value).
* [Assign a specific value to the variable](#set-value).

If you don't have an existing variable yet, 
[create that variable now](#create-variable).

<a name="increment-value"></a>

### Increment variable 

To increase a variable by a specific value, add the 
**Variables - Increment variable** action to your logic app. 

1. In Logic App Designer, under the step where you want 
to increase an existing variable, choose 
**New step** > **Add an action**. 
For example:

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

   | Property | Required | Value |  Description |
   |----------|----------|-------|--------------|
   | Name | Yes | <*variable-name*> | The name for the variable to increment | 
   | Value | No | <*increment-value*> | The value used for incrementing the variable. The default value is one. | 
   |||| 

   For example: 
   
   ![Increment value example](./media/logic-apps-create-variables-store-values/increment-variable-action-information.png)

4. When you're done, on the designer toolbar, choose **Save**.

*Example: Count loop cycles*

Variables often perform the work for 
counting how many times a loop runs. 
This example shows how you can use variables 
for this task by following these steps: 

1. Create a blank logic app, and add a trigger 
that checks for new email and fires only when the 
email has one or more attachments. 

   This example uses the Office 365 Outlook trigger 
   for **When a new email arrives**. However, 
   you can use any connector that checks 
   for email with attachments, such as the 
   Outlook.com trigger.

2. Set up the trigger to check for attachments 
and include those attachments as inputs 
in the workflow. For this example, 
choose **Show advanced options** in the trigger. 
Set the **Has Attachment** and **Include Attachments** 
properties to **Yes**.

   ![Check for and include attachments](./media/logic-apps-create-variables-store-values/check-include-attachments.png)

2. Create an integer variable for tracking the number of attachments, for example:

   ![Add action for "Initialize variable"](./media/logic-apps-create-variables-store-values/initialize-variable.png)

3. Add a "for each" loop that cycles through the attachments. 
(Choose **New step** > **More** > **Add a for each**)

   ![Add "for each" loop](./media/logic-apps-create-variables-store-values/add-loop.png)

4. In the **For each** loop, 
click inside the **Select an output from previous steps** box. 
When the dynamic content list appears, 
select **Attachments**, which is an output from the trigger.

   ![Select "Attachments"](./media/logic-apps-create-variables-store-values/select-attachments.png)

5. In the "for each" loop, select **Add an action**. 

   ![Select "Add an action"](./media/logic-apps-create-variables-store-values/add-action-2.png)

6. In the search box, enter "increment variable" as your filter. 
From the actions list, select the **Variables - Increment variable** action.

   > Check that the **Increment variable** 
   > action appears inside the loop. 
   > If the action appears outside the loop,
   > drag the action into the loop.

7. In the **Increment variable** action, 
select the **Count** variable from the **Name** list.






