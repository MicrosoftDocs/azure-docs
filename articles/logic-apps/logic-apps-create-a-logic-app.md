---
title: Create your first automated workflow between systems & cloud services - Azure Logic Apps | Microsoft Docs
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

# Create your first logic app for automating workflows and processes through the Azure portal

Without writing code, you can integrate systems and services 
by building and running automated workflows with 
[Azure Logic Apps](../logic-apps/logic-apps-what-are-logic-apps.md). 
To show how easily you can automate tasks with a workflow, 
this tutorial creates your first logic app, which checks an RSS feed 
for new content on a website and sends an email for each new item 
in the feed.

For example, here is an email that the finished logic app sends:

![Email sent for new RSS feed item](./media/logic-apps-create-a-logic-app/rss-feed-email.png)

And here is the logic app workflow that sends the email:

![Overview - first logic app example](./media/logic-apps-create-a-logic-app/logic-app-overview.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a blank logic app.
> * Add a trigger for starting your logic app when an RSS feed item is published.
> * Add an action for sending email with details about the RSS feed item.
> * Run and test your logic app.

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
[RSS feed for top stories from the CNN.com website](http://rss.cnn.com/rss/cnn_topstories.rss): 
`http://rss.cnn.com/rss/cnn_topstories.rss`

## Create a blank logic app 

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal").

2. From the main Azure menu, choose 
**New** > **Enterprise Integration** > **Logic App**.

   ![Azure portal, New, Enterprise Integration, Logic App](./media/logic-apps-create-a-logic-app/azure-portal-create-logic-app.png)

3. Create your logic app with the settings specified in the table.

   ![Provide logic app details](./media/logic-apps-create-a-logic-app/logic-app-settings.png)

   | Setting | Suggested value | Description | 
   | ------- | --------------- | ----------- | 
   | **Name** | *your-logic-app-name* | Provide a unique logic app name. | 
   | **Subscription** | *your-Azure-subscription-name* | Select the Azure subscription that you want to use. | 
   | **Resource group** | *your-Azure-resource-group-name* | Create or select an [Azure resource group](../azure-resource-manager/resource-group-overview.md) for organizing related Azure resources. | 
   | **Location** | *your-Azure-datacenter-region* | Select the datacenter region for deploying your logic app, for example, West US. | 
   | **Log Analytics** | Off | Turns on diagnostic logging for your logic app, but keep this setting at **Off**. | 
   |||| 

4. When you're ready, select **Pin to dashboard**, 
then choose **Create**.

   You've now created an Azure resource for your logic app. 
   After Azure deploys your logic app, the Logic Apps Designer 
   shows you templates for common patterns so you can get started faster.

   > [!NOTE] 
   > If you select **Pin to dashboard**, 
   > your logic app appears on the Azure dashboard after deployment 
   > and automatically opens in Logic Apps Designer. 
   > If you don't want to pin the logic app, 
   > you can manually find and open your logic app.

5. For now, under **Templates**, choose **Blank Logic App** 
so that you can build your logic app from scratch.

   ![Choose logic app template](./media/logic-apps-create-a-logic-app/choose-logic-app-template.png)

   The Logic Apps Designer now shows you available [*connectors*](../connectors/apis-list.md) and their [*triggers*](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts), 
   which you use for starting your logic app workflow.

   ![Logic app triggers](./media/logic-apps-create-a-logic-app/logic-app-triggers.png)

## Add a trigger for starting the workflow

Every logic app must start with a [*trigger*](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts). 
The trigger fires when a specific event happens or when new data 
meets the condition that you've set. The Logic Apps engine then 
creates a logic app instance for running your workflow. 
Each time that the trigger fires, the engine creates another 
separate instance that runs your logic app workflow.

1. In the search box, type "rss" as your filter. 
Select this trigger: **RSS - When a feed item is published** 

   ![Select trigger: "RSS - When a feed item is published"](./media/logic-apps-create-a-logic-app/rss-trigger.png)

2. Provide the link for the website's RSS feed that you want to track, for example, `http://rss.cnn.com/rss/cnn_topstories.rss`. 
Set the interval and frequency for the recurrence. 
In this example, set these properties to check the feed every day. 

   ![Set up trigger with RSS feed, frequency, and interval](./media/logic-apps-create-a-logic-app/rss-trigger-setup.png)

3. Save your work for now. On the designer toolbar, choose **Save**.

   ![Save your logic app](./media/logic-apps-create-a-logic-app/save-logic-app.png)

   Your logic app is now live but doesn't do anything 
   other than check for new items in the RSS feed 
   until you add actions to the workflow.

   > [!TIP]
   > To simplify your view in the designer, 
   > you can collapse and hide each shape's details - 
   > just select the shape's title bar.

## Add an action that responds to the trigger

Now add an [*action*](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts), 
which is a task that your logic app workflow performs. In this example, 
add an action that sends email when a new item appears in the RSS feed.

1. In the Logic Apps Designer, under the trigger, 
choose **+ New step** > **Add an action**.

   ![Add an action](./media/logic-apps-create-a-logic-app/add-new-action.png)

   The designer shows connectors and actions available for yor logic app 
   so that you can select an action to perform when your trigger fires.

   ![Select from action list](./media/logic-apps-create-a-logic-app/logic-app-actions.png)

2. In the search box, enter "send email" as your filter. 
Based on your email provider, find and select the matching connector. 
Then select the "send email" action for your connector. 
For example: 

   * For an Azure work or school account, 
   select the Office 365 Outlook connector. 
   * For personal Microsoft accounts, 
   select the Outlook.com connector. 
   * For Gmail accounts, select the Gmail connector. 

   This tutorial uses the Office 365 Outlook connector. 
   If you use a different provider, the steps remain the same, 
   but your UI might appear different. 

   ![Select this action: "Office 365 Outlook - Send an email"](./media/logic-apps-create-a-logic-app/actions.png)

3. When you're prompted for credentials, 
sign in with the username and password for your email account. 

4. Provide the details specified in the table and 
select the fields that you want included in the mail. 

   > [!TIP]
   > To select fields available for your workflow, 
   > click inside an edit box or choose **Add dynamic content** under each edit box. 
   > The **Dynamic content** list opens so that you can select the fields.
   > To view any other available fields, in the **Dynamic content** list, 
   > choose **See more** for each section.

   ![Select data to include in email](./media/logic-apps-create-a-logic-app/rss-action-setup.png)

   | Setting | Suggested value | Description | 
   | ------- | --------------- | ----------- | 
   | **To** | *recipient-email-address* | Enter the recipient's email address. For testing purposes, you can use your own email address. | 
   | **Subject** | New CNN post: **Feed title** | Enter the content for the email's subject. <p>For this tutorial, enter the suggested text and select the trigger's **Feed title** field, which shows the feed item's title. | 
   | **Body** | Title: **Feed title** <p>Date published: **Feed primary link** <p>Link: **Primary feed link** | Enter the content for the email's body. <p>For this tutorial, enter the suggested text, then select these trigger fields: <p>- **Feed title**, which shows the feed item's title again </br>- **Feed published on**, which shows the item's published date and time </br>- **Primary feed link**, which shows the URL for the feed item | 
   |||| 

   > [!NOTE] 
   > If you select a field that stores an array, 
   > the designer automatically adds a "For each" loop 
   > around the action that references the array. 
   > That way, your logic app performs that action on each array item.

   | To | Steps | 
   | -- | ----- | 
   | Add blank lines in an edit box. | Press Shift + Enter. | 
   | Close the **Dynamic content** list. | Choose **Add dynamic content** again. | 
   ||| 

5. When you're done, save your changes. On the designer toolbar, choose **Save**.

   ![Completed logic app](./media/logic-apps-create-a-logic-app/save-complete-logic-app.png)

   To test your logic app now, continue to the next section.

## Run and test your workflow

1. To manually run your logic app for testing, 
on the designer toolbar bar, choose **Run**. 
Or, you can let your logic app check the specified 
RSS feed based on the schedule that you set up.

   ![Run logic app](./media/logic-apps-create-a-logic-app/run-complete-logic-app.png)

   If your logic app finds new items, 
   the logic app sends email that 
   includes your selected data, for example:

   ![Email sent for new RSS feed item](./media/logic-apps-create-a-logic-app/rss-feed-email.png)

   If your logic app doesn't find any new items, 
   the logic app skips the action that sends email 
   and waits for the next interval before checking again. 

2. To review your logic app's runs and trigger history, 
on your logic app menu, choose **Overview**.
To view more details about a run, choose the row for that run.

   ![Monitor and view logic app run and trigger history](./media/logic-apps-create-a-logic-app/logic-app-run-trigger-history.png)

   > [!TIP]
   > If you don't find the data that you expect, 
   > on the toolbar, try choosing **Refresh**.

   Whether the run passed or failed, the Run Details view 
   shows the steps that passed or failed. 

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
This example shows how easily you can create workflows that automate 
processes for integrating systems and services - all without code.

> [!NOTE]
> Your logic app continues running and possibly incurring 
> charges until you turn off or delete your app. 

## Clean up resources

This tutorial uses resources and performs actions 
that might incur charges on your Azure subscription. 
When you're done with the tutorial and testing, 
make sure that you disable or delete any resources 
where you don't want to incur charges.

* To temporarily stop your logic app, 
you can disable your app. 

  On your logic app menu, choose **Overview**. 
  On the toolbar, choose **Disable**.

  ![Turn off your logic app](./media/logic-apps-create-a-logic-app/turn-off-disable-logic-app.png)

  > [!NOTE]
  > If you don't see the logic app menu, 
  > you might have to return to the Azure dashboard, 
  > and then find your logic app again.

* Or you can permanently delete your logic app, 

  1. On the logic app menu, choose **Overview**. 
  On the toolbar, choose **Delete**. 

     ![Delete your logic app](./media/logic-apps-create-a-logic-app/turn-off-disable-logic-app.png)

     > [!NOTE]
     > If you don't see the logic app menu, 
     > you might have to return to the Azure dashboard, 
     > and then find your logic app again.

  2. Enter your logic app's name, and choose **Delete**.

For other logic app management tasks, 
review these commands in the logic app menu:

| Task | Steps | 
| ---- | ----- | 
| View your app's status, runs and trigger history, and general information | Choose **Overview**. | 
| Edit your app | Choose **Logic App Designer**. | 
| View your app's workflow definition in [JavaScript Object Notation (JSON)](http://www.json.org/) | Choose **Logic App Code View**. | 
| View operations performed on your logic app | Choose **Activity log**. | 
| View past versions for your logic app | Choose **Versions**. | 
| Turn off your app temporarily | Choose **Overview**, then on the toolbar, choose **Disable**. | 
| Delete your app | Choose **Overview**, then on the toolbar, choose **Delete**. Enter your logic app's name, and choose **Delete**. | 
||| 

## Next steps

In this next article, learn how to run steps only after a specified condition is met.

> [!div class="nextstepaction"]
> [Conditional statements: Run steps based on a condition](../logic-apps/logic-apps-control-flow-conditional-statement.md)