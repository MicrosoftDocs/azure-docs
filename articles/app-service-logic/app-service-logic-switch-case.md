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

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis elementum nunc eget interdum. Aliquam bibendum at nulla ut pulvinar. Proin in tincidunt neque, ac aliquam magna. 

## Prerequisites

- Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
- Aliquam mollis elementum nunc eget interdum. 
- Aliquam bibendum at nulla ut pulvinar. 
- Proin in tincidunt neque, ac aliquam magna. 

## Working with switch statement in designer
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis elementum nunc eget interdum. Aliquam bibendum at nulla ut pulvinar. Proin in tincidunt neque, ac aliquam magna. 

1. Let’s start by create a new Logic App, and select **Dropbox - When a file is created** trigger.

 ![Use Dropbox - When a file is created trigger](./media/app-service-logic-switch-case/dropbox-trigger.jpg)

2. Follow up the trigger with an **Outlook.com - Send approval email** action.

 > [!TIP]
 > Logic Apps also supports approval email scenario from an Office 365 Outlook accout.

 - If you don't have an existing connection, you will be prompted to create one.
 - We want to send an email to 
 - Under *User Options*, enter *Approve, Reject*
 - Feel free to explore other available inputs under *Advanced options*.

 ![Configure connection](./media/app-service-logic-switch-case/send-approval-email-action.jpg)

3. Add a switch statement.
 - Select **+ New step**, **... More**, **Add a switch statement**.
 - We want to branch based on `SelectedOptions` output of the *Send approval email* action, you can find it in the **Add dynamic content** selector.
 - Use *Case 1* to handle when user selected `Approve`.
  - If approved, copy the orginal file to SharePoint Online with **SharePoint Online - Create file** action.
  - Send an email notify 
 - Add another case to handle when user selected `Rejected`.
  - When rejected, we will 
 - If you added any additional options in previous steps, feel free to add additional cases to handle them.

 > [!NOTE]
 > Switch statement requires a default case and at least one additional case, and each case label (`on ""`) must specifies a constant value.

4. After the switch statement, delete the original file uploaded to Dropbox with **Dropbox - Delete file** action.

5. Save your Logic App, and test it by uploading a file to Dropbox. You should receive an approval email shortly after, select an option and observe the behavior.
 > [!TIP]
 > Check out how to [monitor your Logic Apps](app-service-logic-monitor-your-logic-apps.md).

## Understand Code Behind
Now you have successfully created a Logic App using switch statement, let's take a look at the code behind as follows.

```
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
- Lorem ipsum dolor sit amet, [consectetur adipiscing elit](app-service-logic-enterprise-integration-overview.md).
- Aliquam mollis elementum nunc [eget interdum](app-service-logic-enterprise-integration-overview.md).
- [Aliquam bibendum at nulla ut pulvina](app-service-logic-enterprise-integration-overview.md).
- Proin in tincidunt neque, [ac aliquam magna](app-service-logic-enterprise-integration-overview.md).