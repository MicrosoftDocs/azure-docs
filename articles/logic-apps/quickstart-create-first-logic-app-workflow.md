---
title: Create an automated integration workflow
description: Quickstart - Build your first automated workflow by using Azure Logic Apps for system integration and enterprise application integration (EAI) solutions
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: quickstart
ms.custom: mvc
ms.date: 07/23/2020

# Customer intent: As a developer, I want to create my first automated workflow by using Azure Logic Apps
---

# Quickstart: Create your first automated integration workflow by using Azure Logic Apps - Azure portal

This quickstart introduces the basic general concepts behind how to build your first workflow by using [Azure Logic Apps](logic-apps-overview.md), such as creating a blank logic app, adding a trigger and an action, and then testing your logic app. In this quickstart, you build a logic app that regularly checks a website's RSS feed for new items. If new items exist, the logic app sends an email for each item. When you're done, your logic app looks like this workflow at a high level:

![Conceptual art showing high-level example logic app workflow.](./media/quickstart-create-first-logic-app-workflow/quickstart-workflow-overview.png)

For this scenario, you need an Azure subscription or [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F), an email account from a service that's supported by Azure Logic Apps, such as Office 365 Outlook, Outlook.com, or Gmail. For other supported email services, [review the connectors list here](/connectors/). In this example, the logic app uses a work or school account. If you use a different email service, the overall general steps are the same, but your user interface might differ slightly.

> [!IMPORTANT]
> If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic apps. 
> If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can 
> [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). 
> For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

## Create your logic app

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account credentials.

1. In the Azure portal search box, enter `logic apps`, and select **Logic Apps**.

   ![Screenshot showing Azure portal search box with "logic apps" as the search term and "Logic Apps" as the selected search result.](./media/quickstart-create-first-logic-app-workflow/find-select-logic-apps.png)

1. On the **Logic Apps** page, select **Add**.

   ![Screenshot showing logic apps list and selected button, "Add".](./media/quickstart-create-first-logic-app-workflow/add-new-logic-app.png)

1. On the **Logic App** pane, provide details about your logic app as shown below.

   ![Screenshot showing logic app creation pane with details for new logic app.](./media/quickstart-create-first-logic-app-workflow/create-logic-app-settings.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Name** | <*logic-app-name*> | Your logic app's name, which must be unique across regions and can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`). This example uses "My-First-Logic-App". |
   | **Subscription** | <*Azure-subscription-name*> | Your Azure subscription name |
   | **Resource group** | <*Azure-resource-group-name*> | The name for the [Azure resource group](../azure-resource-manager/management/overview.md), which must be unique across regions and is used to organize related resources. This example uses "My-First-LA-RG". |
   | **Location** | <*Azure-region*> | The region where to store your logic app information. This example uses "West US". |
   | **Log Analytics** | Off | Keep the **Off** setting for diagnostic logging. |
   ||||

1. When you're ready, select **Review + Create**. Confirm the details that you provided, and select **Create**.

1. After Azure successfully deploys your app, select **Go to resource**.

   ![Screenshot showing resource deployment page and selected button for "Go to resource".](./media/quickstart-create-first-logic-app-workflow/go-to-new-logic-app-resource.png)

   Or, you can find and select your logic app by typing the name in the search box.

   The Logic Apps Designer opens and shows a page with an introduction video and commonly used triggers. Under **Templates**, select **Blank Logic App**.

   ![Screenshot showing Logic Apps Designer template gallery and selected template, "Blank Logic App".](./media/quickstart-create-first-logic-app-workflow/choose-logic-app-template.png)

Next, add a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) that fires when a new RSS feed item appears. Every logic app must start with a trigger, which fires when a specific event happens or when a specific condition is met. Each time the trigger fires, the Azure Logic Apps engine creates a logic app instance that starts and runs your workflow.

<a name="add-rss-trigger"></a>

## Add the RSS trigger

1. In the **Logic App Designer**, under the search box, select **All**.

1. To find the RSS connector, in the search box, enter `rss`. From the triggers list, select the RSS trigger, **When a feed item is published**.

   ![Screenshot showing Logic Apps Designer with "rss" in the search box and the selected trigger, "When a feed item is published".](./media/quickstart-create-first-logic-app-workflow/add-rss-trigger-new-feed-item.png)

1. Provide the information for your trigger as described in this step:

   ![Screenshot showing Logic Apps Designer with RSS trigger settings, including RSS URL, frequency, and interval.](./media/quickstart-create-first-logic-app-workflow/add-rss-trigger-settings.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **The RSS feed URL** | <*RSS-feed-URL*> | The link for the RSS feed that you want to monitor. This example uses the Wall Street Journal's RSS feed at `https://feeds.a.dj.com/rss/RSSMarketsMain.xml`, but if you want, you can use your own RSS feed URL. |
   | **Interval** | 1 | The number of intervals to wait between checks |
   | **Frequency** | Minute | The unit of time for each interval between checks |
   ||||

   Together, the interval and frequency define the schedule for your logic app's trigger. This logic app checks the feed every minute.

1. To collapse the trigger details for now, click inside the trigger's title bar.

   ![Screenshot showing Logic Apps Designer with collapsed logic app shape.](./media/quickstart-create-first-logic-app-workflow/collapse-trigger-shape.png)

1. Save your logic app. On the designer toolbar, select **Save**.

Your logic app is now live but doesn't do anything other than check the RSS feed. So, add an action that responds when the trigger fires.

## Add the "send email" action

Now add an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) that sends an email when a new item appears in the RSS feed.

1. Under the **When a feed item is published** trigger, select **New step**.

   ![Screenshot showing Logic Apps Designer with "New step".](./media/quickstart-create-first-logic-app-workflow/add-new-step-under-trigger.png)

1. Under **Choose an action** and the search box, select **All**.

1. In the search box, enter `send an email` so that you can find connectors that offer this action. To filter the actions list to a specific app or service, you can select that app or service first.

   For example, if you're using a Microsoft work or school account and want to use Office 365 Outlook, select **Office 365 Outlook**. Or, if you're using a personal Microsoft account, you can select Outlook.com. This example continues with Office 365 Outlook:

   ![Screenshot showing Logic Apps Designer and selected Office 365 Outlook connector.](./media/quickstart-create-first-logic-app-workflow/select-connector.png)

   You can now more easily find and select the action that you want to use, for example, `send an email`:

   ![Screenshot showing Logic Apps Designer and list with filtered actions.](./media/quickstart-create-first-logic-app-workflow/filtered-actions-list.png)

1. If your selected email connector prompts you to authenticate your identity, complete that step now to create a connection between your logic app and your email service.

   > [!NOTE]
   > In this specific example, you manually authenticate your identity. However, connectors that require authentication differ in 
   > the authentication types that they support. You also have options to set up the way that you want to handle authentication. 
   > For example, when you use Azure Resource Manager templates for deployment, you can parameterize and improve security on inputs 
   > that you want to change often or easily, such as connection information. For more information, see these topics:
   >
   > * [Template parameters for deployment](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md#template-parameters)
   > * [Authorize OAuth connections](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md#authorize-oauth-connections)
   > * [Authenticate access with managed identities](../logic-apps/create-managed-service-identity.md)
   > * [Authenticate connections for logic app deployment](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md#authenticate-connections)

1. In the **Send an email** action, specify the information to include in the email.

   1. In the **To** box, enter the recipient's email address. For testing purposes, you can use your email address.

      For now, ignore the **Add dynamic content** list that appears. When you click inside some edit boxes, this list appears and shows any available outputs from the previous step that you can use as inputs for the current action.

   1. In the **Subject** box, enter this text with a trailing blank space: `New RSS item: `

      ![Screenshot showing Logic Apps Designer with "Send an email" action and cursor inside the "Subject" property box.](./media/quickstart-create-first-logic-app-workflow/send-email-subject.png)

   1. From the **Add dynamic content** list, select **Feed title**, which is output from the trigger, "When a feed item is published", that makes the RSS item title available for you to use.

      ![Screenshot showing Logic Apps Designer with "Send an email" action and cursor inside the "Subject" property box with an open dynamic content list and selected output, "Feed title".](./media/quickstart-create-first-logic-app-workflow/send-email-subject-dynamic-content.png)

      > [!TIP]
      > In the dynamic content list, if no outputs appear from the "When a feed item is published" trigger, 
      > next to the action's header, select **See more**.
      > 
      > ![Screenshot showing Logic Apps Designer with opened dynamic content list and "See more" selected for the trigger.](./media/quickstart-create-first-logic-app-workflow/dynamic-content-list-see-more-actions.png)

      When you're done, the email subject looks like this example:

      ![Screenshot showing Logic Apps Designer with "Send an email" action and an example email subject with the included "Feed title" property.](./media/quickstart-create-first-logic-app-workflow/send-email-feed-title.png)

      If a "For each" loop appears on the designer, then you selected a token for an array, for example, the **categories-Item** token. For these kinds of tokens, the designer automatically adds this loop around the action that references that token. That way, your logic app performs the same action on each array item. To remove the loop, select the **ellipses** (**...**) on the loop's title bar, then select **Delete**.

   1. In the **Body** box, enter this text, and select these tokens for the email body. To add blank lines in an edit box, press Shift + Enter.

      ![Screenshot showing Logic Apps Designer with "Send an email" action and selected properties inside the "Body" box.](./media/quickstart-create-first-logic-app-workflow/send-email-body.png)

      | Property | Description |
      |----------|-------------|
      | **Feed title** | The item's title |
      | **Feed published on** | The item's publishing date and time |
      | **Primary feed link** | The URL for the item |
      |||

1. Save your logic app.

Next, test your logic app.

## Run your logic app

To manually start your logic app, on the designer toolbar bar, select **Run**. Or, wait for your logic app to check the RSS feed based on your specified schedule (every minute).

![Screenshot showing Logic Apps Designer with the "Run" button selected on the designer toolbar.](./media/quickstart-create-first-logic-app-workflow/run-logic-app-test.png)

If the RSS feed has new items, your logic app sends an email for each new item. Otherwise, your logic app waits until the next interval before checking again. If you don't get any emails, check your junk email folder.

For example, here is a sample email that this logic app sends.

![Screenshot showing sample email received when new RSS feed item appears.](./media/quickstart-create-first-logic-app-workflow/monitor-rss-feed-email.png)

Technically, when the trigger checks the RSS feed and finds new items, the trigger fires, and the Azure Logic Apps engine creates an instance of your logic app workflow that runs the actions in the workflow. If the trigger doesn't find new items, the trigger doesn't fire and "skips" instantiating the workflow.

Congratulations, you've now successfully built and run your first logic app with the Azure portal.

## Clean up resources

When you no longer need this sample, delete the resource group that contains your logic app and related resources.

1. In the Azure search box, enter `resource groups`, and then select **Resource groups**.

   ![Screenshot showing Azure portal search box with the search term, "resource groups".](./media/quickstart-create-first-logic-app-workflow/find-resource-groups.png)

1. Find and select your logic app's resource group. On the **Overview** pane, select **Delete resource group**.

   ![Screenshot showing Azure portal with selected resource group and button for "Delete resource group".](./media/quickstart-create-first-logic-app-workflow/delete-resource-group.png)

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

   ![Screenshot showing Azure portal with confirmation pane and entered resource group name to delete.](./media/quickstart-create-first-logic-app-workflow/delete-resource-group-2.png)

> [!NOTE]
> When you delete a logic app, no new runs are instantiated. All in-progress and pending runs are canceled. 
> If you have thousands of runs, cancellation might take significant time to complete.

## Next steps

In this quickstart, you created your first logic app that checks for RSS updates based your specified schedule (every minute), and takes action (sends email) when updates exist. To learn more, continue with this tutorial that creates more advanced schedule-based workflows:

> [!div class="nextstepaction"]
> [Check traffic with a scheduled-based logic app](../logic-apps/tutorial-build-schedule-recurring-logic-app-workflow.md)
