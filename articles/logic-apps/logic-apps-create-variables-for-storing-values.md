---
title: Save and manage values with variables - Azure Logic Apps | Microsoft Docs
description: How to store and manage values with variables in logic apps
services: logic-apps
documentationcenter: 
author: ecfan
manager: cfowler
editor: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.devlang: 
ms.tgt_pltfrm: 
ms.topic: article
ms.date: 05/15/2018
ms.author: estfan
---

# Save and manage values with variables in Azure Logic Apps

To save values so you can use them in actions throughout your logic app, 
create variables for those values. You can then also perform other 
operations with variables, for example:

* Increase the value in an existing variable.
* Decrease the value in an existing variable.
* Set the value for an existing variable.
* Add the variable to the end of an array.
* Add the variable to the end of a string.

## Prerequisites

* If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app where you want to add a variable. 
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

<a name="add-variable"></a>

## Add a variable

1. In the Azure portal or Visual Studio, 
open your logic app in Logic App Designer. 
This example uses the Azure portal.

2. In Logic App Designer, under the step in your logic app 
where you want to add a variable, add an action:

   * To add an action under the last step in your logic app, 
   choose **New step** > **Add an action**.

   * To add an action between existing steps, 
   move your mouse over the connecting arrow, 
   choose the plus sign (**+**), and then choose **Add an action**.

3. In the search box, enter "variables" as your filter. 
From the list, choose the action **Variables - Initialize variable**. 

4. In the **Initialize variable** action, 
specify the details about your variable. 

   1. Create a name for your variable.

   2. Select your variable's type.

   3. Provide your variable's starting value.

   For example, 


   | Property | Value | Description |
   |----------|-------|-------------|
   | Name ||| 
   | Type ||| 
   | Value ||| 
   |||| 



