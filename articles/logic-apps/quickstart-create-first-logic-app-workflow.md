---
title: Create your first automated workflow - Azure Logic Apps
description: Quickstart - Build your first automated task by using Azure Logic Apps for system integration and enterprise application integration (EAI) solutions
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.manager: carmonm
ms.reviewer: klam, LADocs
ms.topic: quickstart
ms.custom: mvc
ms.date: 10/20/2019
---

# Quickstart: Create your first automated workflow with Azure Logic Apps - Azure portal

This quickstart introduces how to build your first automated workflow with [Azure Logic Apps](../logic-apps/logic-apps-overview.md). In this article, you create a Logic App that regularly checks a website's RSS feed for new items. If new items exist, the Logic App sends an email for each item. When you're done, your Logic App looks like this workflow at a high level:

![High-level example Logic App workflow](./media/quickstart-create-first-logic-app-workflow/quickstart-workflow-overview.png)

To follow this quickstart, you need an email account from a provider that's supported by Logic Apps, such as Office 365 Outlook, Outlook.com, or Gmail. For other providers, [review the connectors list here](https://docs.microsoft.com/connectors/). This Logic App uses an Office 365 Outlook account. If you use another email account, the overall steps are the same, but your user interface might slightly differ.

Also, if you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account credentials.

## Create your Logic App

1. From the Azure home page, in the search box, find and select **Logic Apps**.

   ![Find and select "Logic Apps"](./media/quickstart-create-first-logic-app-workflow/find-select-logic-apps.png)

1. On the **Logic Apps** page, select **Add**.

   ![Add new Logic App](./media/quickstart-create-first-logic-app-workflow/add-new-logic-app.png)

1. Under **Create Logic App**, provide details about your Logic App as shown below. After you are done, select **Create**.

   ![Provide details for new Logic App](./media/quickstart-create-first-logic-app-workflow/create-logic-app-settings.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Name** | <*logic-app-name*> | Your Logic App name, which can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`). This example uses "My-First-Logic-App". |
   | **Subscription** | <*Azure-subscription-name*> | Your Azure subscription name |
   | **Resource group** | <*Azure-resource-group-name*> | The name for the [Azure resource group](../azure-resource-manager/resource-group-overview.md) used to organize related resources. This example uses "My-First-LA-RG". |
   | **Location** | <*Azure-region*> | The region where to store your Logic App information. This example uses "West US". |
   | **Log Analytics** | Off | Keep the **Off** setting for diagnostic logging. |
   ||||

1. After Azure deploys your app, on the Azure toolbar, select **Notifications** > **Go to resource** for your deployed Logic App.

   ![Go to newly created Logic App resource](./media/quickstart-create-first-logic-app-workflow/go-to-new-logic-app-resource.png)

   Alternatively, you can find and select your Logic App by typing the name in the search box.

   The Logic Apps Designer opens and shows a page with an introduction video and commonly used triggers. Under **Templates**, select **Blank Logic App**.

   ![Select blank template for Logic App](./media/quickstart-create-first-logic-app-workflow/choose-logic-app-template.png)

Next, add a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) that fires when a new RSS feed item appears. Every Logic App must start with a trigger, which fires when a specific event happens or when a specific condition is met. Each time the trigger fires, the Logic Apps engine creates a Logic App instance that starts and runs your workflow.

<a name="add-rss-trigger"></a>

## Check RSS feed with a trigger

1. In Logic App Designer, under the search box, select **All**.

1. In the search box, enter `rss`. From the triggers list, select this trigger: **When a feed item is published**

   ![Select "When a feed item is published" trigger](./media/quickstart-create-first-logic-app-workflow/add-rss-trigger-new-feed-item.png)

1. Provide this information for your trigger as shown and described here:

   ![Set up trigger with RSS feed, frequency, and interval](./media/quickstart-create-first-logic-app-workflow/add-rss-trigger-settings.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **The RSS feed URL** | `http://feeds.reuters.com/reuters/topNews` | The link for the RSS feed that you want to monitor |
   | **Interval** | 1 | The number of intervals to wait between checks |
   | **Frequency** | Minute | The unit of time for each interval between checks  |
   ||||

   Together, the interval and frequency define the schedule for your Logic App's trigger. This Logic App checks the feed every minute.

1. To hide the trigger details, for now, click inside the trigger's title bar.

   ![Collapse Logic App shape to hide details](./media/quickstart-create-first-logic-app-workflow/collapse-trigger-shape.png)

1. Save your Logic App. On the designer toolbar, select **Save**.

Your Logic App is now live but doesn't do anything other than check the RSS feed. So, add an action that responds when the trigger fires.

## Send email with an action

Now add an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) that sends an email when a new item appears in the RSS feed.

1. Under the **When a feed item is published** trigger, select **New step**.

   ![Under trigger, select "New step"](./media/quickstart-create-first-logic-app-workflow/add-new-step-under-trigger.png)

1. Under **Choose an action** and the search box, select **All**.

1. In the search box, enter `send an email`. From the actions list, select the "send an email" action for the email provider that you would like.

   ![Select the "Send an email" action for Office 365 Outlook](./media/quickstart-create-first-logic-app-workflow/add-action-send-email.png)

   To filter the actions list to a specific app or service, you can select that app or service first:

   * For Azure work or school accounts, select Office 365 Outlook.
   * For personal Microsoft accounts, select Outlook.com.

1. If asked for credentials, sign in to your email account so that Logic Apps creates a connection to your email account.

1. In the **Send an email** action, specify the data that you want the email to include.

   1. In the **To** box, enter the recipient's email address. For testing purposes, you can use your email address.

      For now, ignore the **Add dynamic content** list that appears. When you click inside some edit boxes, this list appears and shows any available parameters from the previous step that you can include as inputs in your workflow.

   1. In the **Subject** box, enter this text with a trailing blank space: `New RSS item: `

      ![In the "Subject" property, enter your email subject](./media/quickstart-create-first-logic-app-workflow/add-action-send-email-subject.png)

   1. From the **Add dynamic content** list, select **Feed title** to include the RSS item title.

      ![From dynamic content list, select "Feed title" property](./media/quickstart-create-first-logic-app-workflow/add-action-send-email-subject-dynamic-content.png)

      When you're done, the email subject looks like this example:

      ![Finished email subject example for added feed title](./media/quickstart-create-first-logic-app-workflow/add-action-send-email-feed-title.png)

      If a "For each" loop appears on the designer, then you selected a token for an array, for example, the **categories-Item** token. For these kinds of tokens, the designer automatically adds this loop around the action that references that token. That way, your Logic App performs the same action on each array item. To remove the loop, select the **ellipses** (**...**) on the loop's title bar, then select **Delete**.

   1. In the **Body** box, enter this text, and select these tokens for the email body. To add blank lines in an edit box, press Shift + Enter.

      ![Select properties for email body content](./media/quickstart-create-first-logic-app-workflow/add-action-send-email-body.png)

      | Property | Description |
      |----------|-------------|
      | **Feed title** | The item's title |
      | **Feed published on** | The item's publishing date and time |
      | **Primary feed link** | The URL for the item |
      |||

1. Save your Logic App.

Next, test your Logic App.

## Run your Logic App

To manually start your Logic App, on the designer toolbar bar, select **Run**. Or, wait for your Logic App to check the RSS feed based on your specified schedule (every minute). If the RSS feed has new items, your Logic App sends an email for each new item. Otherwise, your Logic App waits until the next interval before checking again. If you don't get any emails, check your junk email folder.

For example, here is a sample email that this Logic App sends.

![Sample email sent when new RSS feed item appears](./media/quickstart-create-first-logic-app-workflow/monitor-rss-feed-email.png)

Technically, when the trigger checks the RSS feed and finds new items, the trigger fires, and the Logic Apps engine creates an instance of your Logic App workflow that runs the actions in the workflow. If the trigger doesn't find new items, the trigger doesn't fire and "skips" instantiating the workflow.

Congratulations, you've now successfully built and run your first Logic App with the Azure portal.

## Clean up resources

When you no longer need this sample, delete the resource group that contains your Logic App and related resources.

1. On the main Azure menu, select **Resource groups**, and then select your Logic App's resource group. On the **Overview** pane, select **Delete resource group**.

   ![Find, select, and delete resource group](./media/quickstart-create-first-logic-app-workflow/delete-resource-group.png)

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

   ![To confirm deletion, select "Delete"](./media/quickstart-create-first-logic-app-workflow/delete-resource-group-2.png)

> [!NOTE]
> When you delete a Logic App, no new runs are instantiated. 
> All in-progress and pending runs are canceled. 
> If you have thousands of runs, cancellation might 
> take significant time to complete.

## Next steps

In this quickstart, you created your first Logic App that checks for RSS updates based your specified schedule (every minute), and takes action (sends email) when updates exist. To learn more, continue with this tutorial that creates more advanced schedule-based workflows:

> [!div class="nextstepaction"]
> [Check traffic with a scheduled-based Logic App](../logic-apps/tutorial-build-schedule-recurring-logic-app-workflow.md)
