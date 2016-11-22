---
title: Use Switch Statement in Logic Apps | Microsoft Docs
description: Switch statement allows you to easily take different actions based on the value of an expression in Logic Apps
services: logic-apps
documentationcenter: dev-center-name
author: derek1ee
manager: erikre


ms.service: logic-apps
ms.devlang: wdl
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/18/2016
ms.author: deli

---
# Use switch statement in Logic Apps
When creating a workflow, you will often need to take different actions based on the value of an object or expression, this can be done by using the switch statement.

With switch statement, Logic App will evluate a token or expression, and choose the case with the same value to execute actions winthin. Cases must be a static and unique value.

## Prerequisites

- Active Azure subscriptions
	- If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/en-us/free/), or try [Logic Apps for free](https://tryappservice.azure.com/).
- [Basic knowledge of Logic Apps](./app-service-logic-what-are-logic-apps?toc=%2fazure%2flogic-apps%2ftoc.json).

## Working with switch statement in designer
To demonstrate the usage of switch statement, we will create a Logic App that monitors file uploaded to Dropbox and send out an approval email to have it transferred to SharePoint. We will use switch statement to take different actions depending on the value approver selected.

1. Let’s start by create a new Logic App, and select **Dropbox - When a file is created** trigger.

 ![Use Dropbox - When a file is created trigger](./media/app-service-logic-switch-case/dropbox-trigger.jpg)

2. Follow up the trigger with an **Outlook.com - Send approval email** action.

 > [!TIP]
 > Logic Apps also supports approval email scenario from an Office 365 Outlook accout.

 - If you don't have an existing connection, you will be prompted to create one.
 - Fill in required fields, we will send email to approvers@contoso.com.
 - Under *User Options*, enter *Approve, Reject*.
 - Feel free to explore other available inputs under *Advanced options*.

 ![Configure connection](./media/app-service-logic-switch-case/send-approval-email-action.jpg)

3. Add a switch statement.
 - Select **+ New step**, **... More**, **Add a switch statement**.
 - We want to make a decision on what to execute based on `SelectedOptions` output of the *Send approval email* action, you can find it in the **Add dynamic content** selector.
 - Use *Case 1* to handle when user selected `Approve`.
  - If approved, copy the orginal file to SharePoint Online with **SharePoint Online - Create file** action.
  - also send an email notify 
 - Add another case to handle when user selected `Rejected`.
  - When rejected, we will 
 - If you added any additional options in previous steps, feel free to add additional cases to handle them.

 > [!NOTE]
 > Switch statement should have at least one case in additional to the default case.

4. After the switch statement, delete the original file uploaded to Dropbox with **Dropbox - Delete file** action.

5. Save your Logic App, and test it by uploading a file to Dropbox. You should receive an approval email shortly after, select an option and observe the behavior.
 > [!TIP]
 > Check out how to [monitor your Logic Apps](app-service-logic-monitor-your-logic-apps.md).

## Understand code behind
Now you have successfully created a Logic App using switch statement, let's take a look at the code behind as follows.

```json
"Switch": {
	"type": "Switch",
	"expression": "",
	"cases": {
		"Case 1" : {
			"case" : "",
			"actions" : {}
		}
	},
	"default": {
		"actions": {}
	},
	"runAfter": {}
}
```

`"Switch"` is the name of the switch statement, it can be renamed for readability. `"type": "Switch"` indicates the action is a switch statement. `"expression"` is evluated against each case label declared later in the definition. `"cases"` can contain any number of cases, and actions within `"default"` will be executed if none of the cases match the switch expression.

There can be any number of cases inside `"cases"`. For each case, `"Case 1"` is the name of the case, it can be renamed for readbility. `"case"` specify the case label, which the switch expression compares with, it must be a constant and unique value.  

## Next steps
- Try other [Logic Apps features](app-service-logic-use-logic-app-features.md).
- Learn about [error and exception handling](app-service-logic-exception-handling.md).
- Explore more [workflow language capabilities](app-service-logic-author-definitions.md).