---
title: Create automated workflows between systems & cloud services - Azure Logic Apps | Microsoft Docs
description: Automate business processes and workflows for system integration and enterprise application integration (EAI) scenarios by creating and running logic apps
author: ecfan
manager: anneta
editor: ''
services: logic-apps
keywords: workflow, cloud apps, cloud services, business processes, system integration, enterprise application integration, EAI
documentationcenter: ''

ms.assetid: ce3582b5-9c58-4637-9379-75ff99878dcd
ms.service: logic-apps
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/13/2017
ms.author: LADocs; estfan
---

# Create an automated workflow through the Azure portal

You can integrate systems and services quickly by 
building and running automated workflows with [Azure Logic Apps](../logic-apps/logic-apps-what-are-logic-apps.md). 
This quickstart shows how easily you can automate tasks and processes with workflows by walking you through creating your first logic app. 
This example automates tasks that check a website's RSS feed for new content and sends an email for each new item in the feed.

Here is an example email that this logic app sends:

![Email sent for new RSS feed item](./media/logic-apps-create-a-logic-app/rss-feed-email.png)

And here is the logic app workflow that checks the feed 
and sends the email:

![Overview - first logic app example](./media/logic-apps-create-a-logic-app/logic-app-overview.png)

In this quickstart, you learn how to:

> [!div class="checklist"]
> * Create a blank logic app.
> * Add a trigger to start the workflow when a new item appears in the RSS feed.
> * Add an action to send email with details about the RSS feed item.
> * Test your logic app.

If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* An email account from any email provider that's supported by Azure Logic Apps for sending notifications. 
For example, you can use Office 365 Outlook, Outlook.com, Gmail, or other supported email provider. 
To find a supported email connector, [review the connectors list](https://docs.microsoft.com/connectors/). 
This tutorial uses Office 365 Outlook.

  > [!TIP]
  > If you have a personal 
  > [Microsoft account](https://account.microsoft.com/account), 
  > you have an Outlook.com account. 
  > Otherwise, if you have an Azure work or school account, 
  > you have an Office 365 Outlook account.

* A link to a website's RSS feed. This example uses the 
[RSS feed for top stories from the Reuters website](http://feeds.reuters.com/reuters/topNews): 
`http://feeds.reuters.com/reuters/topNews`

## Create a blank logic app 

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal"). 

2. From the main Azure menu, choose 
**New** > **Enterprise Integration** > **Logic App**.

   ![Azure portal, New, Enterprise Integration, Logic App](./media/logic-apps-create-a-logic-app/azure-portal-create-logic-app.png)

3. Create your logic app with the settings in the table under this image:

   ![Provide logic app details](./media/logic-apps-create-a-logic-app/logic-app-settings.png)

   | Setting | Suggested value | Description | 
   | ------- | --------------- | ----------- | 
   | **Name** | *your-logic-app-name* | Provide a unique logic app name. | 
   | **Subscription** | *your-Azure-subscription-name* | Select the Azure subscription that you want to use. | 
   | **Resource group** | *your-Azure-resource-group-name* | Create or select an [Azure resource group](../azure-resource-manager/resource-group-overview.md) for organizing related Azure resources. | 
   | **Location** | *your-Azure-datacenter-region* | Select the datacenter region for deploying your logic app, for example, West US. | 
   | **Log Analytics** | Off | Turns on diagnostic logging for your logic app, but for this quickstart, keep the **Off** setting. | 
   |||| 

4. When you're ready, select **Pin to dashboard**. 
This way, your logic app automatically appears on 
your Azure dashboard and opens after deployment. 
Choose **Create**.

   > [!NOTE]
   > If you don't want to pin your logic app, 
   > you must manually find and open your logic app 
   > after deployment so you can continue.

   After Azure deploys your logic app, the Logic Apps Designer 
   opens and shows a page with an introduction video. 
   Under the video, you can find templates for common logic app patterns. 
   This quickstart builds your logic app from scratch. 

5. Scroll past the introduction video to **Templates**, 
then choose **Blank Logic App**.

   ![Choose blank logic app template](./media/logic-apps-create-a-logic-app/choose-logic-app-template.png)

   The Logic Apps Designer shows you available connectors and their triggers, 
   which are used to start logic app workflows.

   ![Logic app triggers](./media/logic-apps-create-a-logic-app/logic-app-triggers.png)

## Add a trigger to start workflow

Every logic app must start with a [trigger](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts). 
The trigger fires when a specific event happens or when new data 
meets the condition that you've set. The Logic Apps engine then 
creates a logic app instance that runs your workflow. 
Each time the trigger fires, the engine creates another 
logic app instance that runs the workflow.

1. In the search box, type "rss" as your filter. 
Select this trigger: **RSS - When a feed item is published** 

   ![Select trigger: "RSS - When a feed item is published"](./media/logic-apps-create-a-logic-app/rss-trigger.png)

2. Provide the link for the website's RSS feed that you want to track, 
for example, `http://feeds.reuters.com/reuters/topNews`. 
Set the interval and frequency for the recurrence. 
This example sets these properties to check the feed every five minutes.

   ![Set up trigger with RSS feed, frequency, and interval](./media/logic-apps-create-a-logic-app/rss-trigger-setup.png)

   > [!TIP]
   > To simplify your view in the designer, 
   > you can collapse and hide a shape's details - 
   > just click inside the shape's title bar.

3. Save your work. On the designer toolbar, choose **Save**.

   ![Save your logic app](./media/logic-apps-create-a-logic-app/save-logic-app.png)

   Your logic app is now live but doesn't do anything other than 
   check the RSS feed. So, let's add actions to the workflow.

## Add an action to send email

Now add an [action](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts), 
which your workflow performs after the trigger fires. In this example, 
add an action that sends email when a new item appears in the RSS feed.

1. In the Logic Apps Designer, under the trigger, 
choose **+ New step** > **Add an action**.

   ![Add an action](./media/logic-apps-create-a-logic-app/add-new-action.png)

   The designer shows connectors and actions that you can select 
   for your logic app to perform when the trigger fires.

   ![Select from actions list](./media/logic-apps-create-a-logic-app/logic-app-actions.png)

2. In the search box, enter "send email" as your filter. 
Find and select the email connector that you want to use. 
Then select the "send email" action for your connector. 
For example: 

   * For an Azure work or school account, 
   select the Office 365 Outlook connector. 
   * For personal Microsoft accounts, 
   select the Outlook.com connector. 
   * For Gmail accounts, select the Gmail connector. 

   This tutorial uses the Office 365 Outlook connector. 
   If you use a different email provider, the steps stay the same, 
   but your UI might appear different. 

   ![Select this action: "Office 365 Outlook - Send an email"](./media/logic-apps-create-a-logic-app/actions.png)

3. When you're prompted for credentials, 
sign in with the username and password for your email account. 

4. Now specify the data that you want to include in the email. 

   1. In the **To** box, enter the recipient's email address. 
   For testing purposes, you can use your own email address.

   2. In the **Subject** box, enter the email subject. 
   For this example, enter "New RSS item: " as shown:

      ![Enter the email subject](./media/logic-apps-create-a-logic-app/logic-app-add-subject.png)

      When you click inside the edit box, 
      the **Add dynamic content list** opens 
      so that you can select from available fields. 
      If the dynamic content list doesn't open, 
      under the respective edit box, 
      choose **Add dynamic content**.

   3. From the **Add dynamic content** list, 
   select the **Feed title** field, 
   which includes the feed item's title in the email.

      ![Enter the email subject](./media/logic-apps-create-a-logic-app/logic-app-select-field.png)

      > [!NOTE] 
      > For some triggers and actions, the dynamic content list 
      > doesn't show the full list of fields. 
      > In these cases, the dynamic content list shows 
      > the **See more** link so you can view the hiddent fields. 
      > 
      > If you select a field that contains an array, 
      > such as **categories-item**, the designer automatically 
      > adds a "For each" loop around the action that references that field. 
      > That way, your logic app can perform that action on each array item.

   4. In the **Body** box, enter the content for the email body. 
   For this example, enter this text and select these fields:

      ![Add contents for email body](./media/logic-apps-create-a-logic-app/logic-app-complete.png)

      | Field | Description | 
      | ----- | ----------- | 
      | **Feed title** | Show the feed item's title. | 
      | **Feed published on** | Show the item's published date and time. | 
      | **Primary feed link** | Show the URL for the feed item. | 
      ||| 

      > [!TIP]
      > To add blank lines in an edit box, press Shift + Enter. 
      > To close the **Dynamic content** list, 
      > choose **Add dynamic content**, 
      > which appears under the respective edit box that's in focus.

5. Save your work. On the designer toolbar, choose **Save**.

   ![Completed logic app](./media/logic-apps-create-a-logic-app/save-complete-logic-app.png)

## Test your logic app

1. To manually start your logic app, 
on the designer toolbar bar, choose **Run**. 
Otherwise, you can wait for your logic app 
to run on the schedule that you set up.

   ![Run logic app](./media/logic-apps-create-a-logic-app/run-complete-logic-app.png)

   If your logic app finds new items, 
   the logic app sends email that 
   includes your selected data, for example:

   ![Email sent for new RSS feed item](./media/logic-apps-create-a-logic-app/rss-feed-email.png)

   Otherwise, if your logic app doesn't find any new items, 
   the logic app skips the action that sends email 
   and waits for the next interval before checking again.

2. To check that your logic app is running, 
you can view your logic app's runs and trigger history. 
On your logic app menu, choose **Overview**.
To view more details about a run, choose the row for that run.

   ![Monitor and view logic app run and trigger history](./media/logic-apps-create-a-logic-app/logic-app-run-trigger-history.png)

   > [!TIP]
   > If you don't find the data that you expect, 
   > select **Refresh** on the toolbar.

   Whether the run passed or failed, 
   the Run Details view shows the steps that passed or failed. 

   ![View details for a logic app run](./media/logic-apps-create-a-logic-app/logic-app-run-details.png)

3. To view the inputs and outputs for each step, 
expand the step that you want to review. 
This information can help you diagnose and debug 
problems in your logic app. For example:

   ![View step details](./media/logic-apps-create-a-logic-app/logic-app-run-details-expanded.png)

   For more information, see 
   [Monitor your logic app](../logic-apps/logic-apps-monitor-your-logic-apps.md). 
   To learn more about your logic app's status, runs history, 
   and trigger history, or to diagnose your logic app, see 
   [Troubleshoot your logic app](../logic-apps/logic-apps-diagnosing-failures.md).

Congratulations, you've now created and run your first logic app. 
This quickstart shows how easily and quickly you can create 
automated workflows for integrating systems and services.

You can perform other tasks, such as update your app, 
view or edit your logic app's definition, or view past versions. 

| Task | Steps | 
| ---- | ----- | 
| View your app's status, runs and trigger history, and general information | Choose **Overview**. | 
| Edit your app | Choose **Logic App Designer**. | 
| View your app's workflow definition in [JavaScript Object Notation (JSON)](http://www.json.org/) | Choose **Logic App Code View**. | 
| View past versions for your logic app | Choose **Versions**. | 
||| 

## Clean up resources

Your logic app continues running and possibly incurring charges 
on your Azure subsription until you turn off or delete your app. 
When you're done, make sure that you disable 
or delete any resources where you don't want to incur charges.

* To stop running your logic app without deleting your work, 
disable your app. On your logic app menu, choose **Overview**. 
On the toolbar, choose **Disable**.

  ![Turn off your logic app](./media/logic-apps-create-a-logic-app/turn-off-disable-logic-app.png)

  > [!NOTE]
  > If you don't see the logic app menu, 
  > you might have to return to the Azure dashboard, 
  > and then open your logic app again.

* To permanently delete your logic app, on the logic app menu, 
choose **Overview**. On the toolbar, choose **Delete**. 
Confirm that you want to delete your logic app, then choose **Delete**.

  ![Delete your logic app](./media/logic-apps-create-a-logic-app/delete-logic-app.png)

  > [!NOTE]
  > If you don't see the logic app menu, 
  > you might have to return to the Azure dashboard, 
  > and then find your logic app again.

## Next steps

Learn how to run steps only after a specified condition is met.

> [!div class="nextstepaction"]
> [Run steps based on a condition](../logic-apps/logic-apps-control-flow-conditional-statement.md)