---
title: Use Switch Statement in Azure Logic Apps | Microsoft Docs
description: Switch statement allows you to easily take different actions based on the value of an expression in Logic Apps
services: logic-apps
documentationcenter: dev-center-name
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
When authoring a workflow, you often need to take different actions based on the value of an object or expression. For example, you may want your Logic App to behave differently based on the status code of an HTTP request, or the selected option of an approval email.

These scenarios can be achieved by using a switch statement: Logic App evaluates a token or expression, and chooses the case with the same value to execute actions within. Only one case should match the switch statement.

 > [!TIP]
 > Like all programming language, switch statement only supports equality operators. Use a condition statement if you need other relational operators (for example, greater than).
 >
 > To ensure deterministic execution behavior, cases must contain a unique and static value instead of dynamic tokens or expression.

## Prerequisites

- Active Azure subscription.
	- If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free/), or try [Logic Apps for free](https://tryappservice.azure.com/).
- [Basic knowledge of Logic Apps](logic-apps-what-are-logic-apps.md).

## Working with switch statement in designer
To demonstrate the usage of switch statement, let's create a Logic App that monitors files uploaded to Dropbox. The Logic App will send out an approval email to determine if it should be transferred to SharePoint. We will use switch statement to take different actions depending on the value approver selected.

1. Start by create a Logic App, and select **Dropbox - When a file is created** trigger.

 ![Use Dropbox - When a file is created trigger](./media/logic-apps-switch-case/dropbox-trigger.jpg)

2. Follow up the trigger with an **Outlook.com - Send approval email** action.

 > [!TIP]
 > Logic Apps also supports approval email scenario from an Office 365 Outlook account.

 - If you don't have an existing connection, you will be prompted to create one.
 - Fill in required fields, we will send email to approvers@contoso.com.
 - Under *User Options*, enter `Approve, Reject`.

 ![Configure connection](./media/logic-apps-switch-case/send-approval-email-action.jpg)

3. Add a switch statement.
 - Select **+ New step**, **... More**, **Add a switch statement**.
 - We want to select what to execute based on `SelectedOptions` output of the *Send approval email* action, you can find it in the **Add dynamic content** selector.
 - Use *Case 1* to handle when user selected `Approve`.
	- If approved, copy the original file to SharePoint Online with **SharePoint Online - Create file** action.
	- Add another action within the case to notify users that a new file is available on SharePoint.
 - Add another case to handle when user selected `Reject`.
	- If rejected, send a notification email informing other approvers that the file is rejected and no further action is required.
 - We know `SelectedOptions` only has two provided options, *default* case can be left empty.

 ![Switch statement](./media/logic-apps-switch-case/switch.jpg)

 > [!NOTE]
 > Switch statement needs at least one case in additional to the default case.

4. After the switch statement, delete the original file uploaded to Dropbox with **Dropbox - Delete file** action.

5. Save your Logic App, and test it by uploading a file to Dropbox. You should receive an approval email shortly after, select an option, and observe the behavior.
 > [!TIP]
 > Check out how to [monitor your Logic Apps](logic-apps-monitor-your-logic-apps.md).

## Understanding code behind
Now you have successfully created a Logic App using switch statement. Let's look at the code behind as follows.

```json
"Switch": {
	"type": "Switch",
	"expression": "@body('Send_approval_email')?['SelectedOption']",
	"cases": {
		"Case 1" : {
			"case" : "Approved",
			"actions" : {}
		},
		"Case 2" : {
			"case" : "Rejected",
			"actions" : {}
		}
	},
	"default": {
		"actions": {}
	},
	"runAfter": {
		"Send_approval_email": [
			"Succeeded"
		]
	}
}
```

`"Switch"` is the name of the switch statement, it can be renamed for readability. `"type": "Switch"` indicates the action is a switch statement. `"expression"`, in this case, user's selected option, is evaluated against each case declared later in the definition. `"cases"` can contain any number of cases, and if none of the cases match the switch expression, actions within `"default"` is executed.

There can be any number of cases inside `"cases"`. For each case, `"Case 1"` is the name of the case, it can be renamed for readability. `"case"` specifies the case label, which the switch expression compares with, that must be a constant and unique value.  

## Next steps
- Try other [Logic Apps features](logic-apps-use-logic-app-features.md).
- Learn about [error and exception handling](logic-apps-exception-handling.md).
- Explore more [workflow language capabilities](logic-apps-author-definitions.md).
- Leave a comment with your questions or feedback, or [tell us how can we improve Logic Apps](https://feedback.azure.com/forums/287593-logic-apps).