---
# required metadata
title: Create and store variable values - Azure Logic Apps | Microsoft Docs
description: How to store and manage values with variables in Azure Logic Apps
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

# Create and manage variable values in Azure Logic Apps

To store values that you can use throughout your logic app, 
create variables for those values. You can then also 
perform other operations with those values:

* Increase the value in an existing variable.
* Decrease the value in an existing variable.
* Change the value for an existing variable.
* Add the variable to the end of an array.
* Add the variable to the end of a string.

Variable values exist within a single logic instance, 
but they are global and shared across any loop iterations in that instance. 
This capability lets you, for example, maintain a count for a loop, 
or find an array item by referencing that item's index value. 

## Prerequisites

* If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app where you want to add a variable. 
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

<a name="add-variable"></a>

## Create variable

1. In the Azure portal or Visual Studio, 
open your logic app in Logic App Designer. 

   This example uses the Azure portal 
   and a logic app with an existing trigger.

2. In Logic App Designer, under the step in your logic app 
where you want to add a variable, add an action. 

   * To add an action under the last step, 
   choose **New step** > **Add an action**.

   * To add an action between existing steps, 
   move your mouse over the connecting arrow 
   so that the plus sign (+) appears. Choose 
   the plus sign, and then choose **Add an action**.

   For example:

   

3. In the search box, enter "variables" as your filter. 
From the actions list, select this action: 
**Variables - Initialize variable** 

4. Provide information about your variable. 

   | Property | Value | Required | Description |
   |----------|-------|----------|-------------|
   | Name | <*variable-name*> | Yes | The name to create for your variable | 
   | Type | <*variable-type*> | Yes | Select the data type for your variable. | 
   | Value | <*start-value*> | No | The starting value to set for your variable | 
   |||| 

   For example: 


## Change variable value

## Increase variable value


## Decrease variable value





