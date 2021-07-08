---
title: Quickstart - Create integration workflows with Azure Logic Apps in the Azure portal
description: Create your first automated integration workflow with multi-tenant Azure Logic Apps in the Azure portal.
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: quickstart
ms.custom: contperf-fy21q4
ms.date: 05/25/2021

# Customer intent: As a developer, I want to create my first automated integration workflow by using Azure Logic Apps in the Azure portal
---

# Quickstart: Create an integration workflow with multi-tenant Azure Logic Apps and the Azure portal

This quickstart shows how to create an example automated workflow that integrates two services, an RSS feed for a website and an email account, when you use *multi-tenant* [Azure Logic Apps](logic-apps-overview.md). While this example is cloud-based, Azure Logic Apps supports workflows that connect apps, data, services, and systems across cloud, on premises, and hybrid environments. For more information about multi-tenant versus single-tenant model, review [Single-tenant versus multi-tenant and integration service environment](single-tenant-overview-compare.md).

In this example, you create a workflow that uses the RSS connector and the Office 365 Outlook connector. The RSS connector has a trigger that checks an RSS feed, based on a schedule. The Office 365 Outlook connector has an action that sends an email for each new item. The connectors in this example are only two among the [hundreds of connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that you can use in a workflow.

The following screenshot shows the high-level example workflow:

![Screenshot showing the example workflow with the RSS trigger, "When a feed item is published" and the Outlook action, "Send an email".](./media/quickstart-create-first-logic-app-workflow/quickstart-workflow-overview.png)

As you progress through this quickstart, you'll learn these basic steps:

* Create a logic app resource that runs in the multi-tenant Logic Apps service environment.
* Select the blank logic app template.
* Add a trigger that specifies when to run the workflow.
* Add an action that performs a task after the trigger fires.
* Run your workflow.

To create and manage a logic app using other tools, review these other Logic Apps quickstarts:

* [Create and manage logic apps in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
* [Create and manage logic apps in Visual Studio](quickstart-create-logic-apps-with-visual-studio.md)
* [Create and manage logic apps using the Azure Command-Line Interface (Azure CLI)](quickstart-logic-apps-azure-cli.md)

<a name="prerequisites"></a>

## Prerequisites

* If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An email account from a service that works with Azure Logic Apps, such as Office 365 Outlook or Outlook.com. For other supported email providers, review [Connectors for Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors).

  > [!NOTE]
  > If you want to use the [Gmail connector](/connectors/gmail/), only G Suite accounts can use this connector without restriction in Azure 
  > Logic Apps. If you have a consumer Gmail account, you can only use this connector with specific Google-approved services, unless you 
  > [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). 
  > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

* If you have a firewall that limits traffic to specific IP addresses, set up your firewall to allow access for *both* the [inbound](logic-apps-limits-and-config.md#inbound) and [outbound](logic-apps-limits-and-config.md#outbound) IP addresses used by the Logic Apps service in the Azure region where your logic app exists.

  This example also uses the RSS and Office 365 Outlook connectors, which are [managed by Microsoft](../connectors/managed.md). These connectors require that you set up your firewall to allow access for *all* the [managed connector outbound IP addresses](logic-apps-limits-and-config.md#outbound) in the logic app's Azure region.

<a name="create-logic-app-resource"></a>

## Create a logic app resource

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

1. In the Azure search box, enter `logic apps`, and select **Logic Apps**.

   ![Screenshot that shows Azure portal search box with "logic apps" as the search term and "Logic Apps" as the selected result.](./media/quickstart-create-first-logic-app-workflow/find-select-logic-apps.png)

1. On the **Logic Apps** page, select **Add** > **Consumption**.

   This step creates a logic app resource that runs in the multi-tenant Logic Apps service environment and uses a [consumption pricing model](logic-apps-pricing.md).

   ![Screenshot showing the Azure portal and Logic Apps service page with logic apps list, "Add" menu opened, and "Consumption" selected.](./media/quickstart-create-first-logic-app-workflow/add-new-logic-app.png)

1. On the **Logic App** pane, provide basic details and settings for your logic app. Create a new [resource group](../azure-resource-manager/management/overview.md#terminology) for this example logic app.

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Subscription** | <*Azure-subscription-name*> | The name of your Azure subscription. |
   | **Resource group** | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) name, which must be unique across regions. This example uses "My-First-LA-RG". |
   | **Logic app name** | <*logic-app-name*> | Your logic app's name, which must be unique across regions. This example uses "My-First-Logic-App". <p><p>**Important**: This name can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`).  |
   | **Region** | <*Azure-region*> | The Azure datacenter region where to store your app's information. This example uses "West US". |
   | **Associate with integration service environment** | Off | Select this option only when you want to deploy this logic app to an [integration service environment](connect-virtual-network-vnet-isolated-environment-overview.md). For this example, leave this option unselected. |
   | **Enable log analytics** | Off | Select this option only when you want to enable diagnostic logging. For this example, leave this option unselected. |
   ||||

   ![Screenshot showing the Azure portal and logic app creation page with details for new logic app.](./media/quickstart-create-first-logic-app-workflow/create-logic-app-settings.png)

1. When you're ready, select **Review + Create**. On the validation page, confirm the details that you provided, and select **Create**.

## Select the blank template

1. After Azure successfully deploys your app, select **Go to resource**. Or, find and select your logic app by typing the name in the Azure search box.

   ![Screenshot showing the resource deployment page and selected button, "Go to resource".](./media/quickstart-create-first-logic-app-workflow/go-to-new-logic-app-resource.png)

   The Logic Apps Designer opens and shows a page with an introduction video and commonly used triggers.

1. Under **Templates**, select **Blank Logic App**.

   ![Screenshot showing the Logic Apps Designer template gallery and selected template, "Blank Logic App".](./media/quickstart-create-first-logic-app-workflow/choose-logic-app-template.png)

   After you select the template, the designer now shows an empty workflow surface.

<a name="add-rss-trigger"></a>

## Add the trigger

A workflow always starts with a single [trigger](../logic-apps/logic-apps-overview.md#how-do-logic-apps-work), which specifies the condition to meet before running any actions in the workflow. Each time the trigger fires, the Logic Apps service creates and runs a workflow instance. If the trigger doesn't fire, no instance is created nor run. You can start a workflow by choosing from many different triggers.

This example uses an RSS trigger that checks an RSS feed, based on a schedule. If a new item exists in the feed, the trigger fires, and a new workflow instance starts to run. If multiple new items exist between checks, the trigger fires for each item, and a separate new workflow instance runs for each item.

1. In the **Logic Apps Designer**, under the search box, select **All**.

1. To find the RSS trigger, in the search box, enter `rss`. From the **Triggers** list, select the RSS trigger, **When a feed item is published**.

   ![Screenshot showing the Logic Apps Designer with "rss" in the search box and the selected RSS trigger, "When a feed item is published".](./media/quickstart-create-first-logic-app-workflow/add-rss-trigger-new-feed-item.png)

1. In the trigger details, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **The RSS feed URL** | Yes | <*RSS-feed-URL*> | The RSS feed URL to monitor. <p><p>This example uses the Wall Street Journal's RSS feed at `https://feeds.a.dj.com/rss/RSSMarketsMain.xml`. However, you can use any RSS feed that doesn't require HTTP authorization. Choose an RSS feed that publishes frequently, so you can easily test your workflow. |
   | **Chosen property will be used to determine** | No | PublishDate | The property that determines which items are new. |
   | **Interval** | Yes | 1 | The number of intervals to wait between feed checks. <p><p>This example uses `1` as the interval. |
   | **Frequency** | Yes | Minute | The unit of frequency to use for every interval. <p><p>This example uses `Minute` as the frequency. |
   |||||

   ![Screenshot showing the RSS trigger settings, including RSS URL, frequency, and interval.](./media/quickstart-create-first-logic-app-workflow/add-rss-trigger-settings.png)

1. Collapse the trigger's details for now by clicking inside its title bar.

   ![Screenshot that shows the collapsed trigger shape.](./media/quickstart-create-first-logic-app-workflow/collapse-trigger-shape.png)

1. When you're done, save your logic app, which instantly goes live in the Azure portal. On the designer toolbar, select **Save**.

   The trigger won't do anything other than check the RSS feed. So, you need to add an action that defines what happens when the trigger fires.

<a name="add-email-action"></a>

## Add an action

Following a trigger, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a subsequent step that runs some operation in the workflow. Any action can use the outputs from the previous step, which can be the trigger or another action. You can choose from many different actions, add multiple actions up to the [limit per workflow](logic-apps-limits-and-config.md#definition-limits), and even create different action paths.

This example uses an Office 365 Outlook action that sends an email each time that the trigger fires for a new RSS feed item. If multiple new items exist between checks, you receive multiple emails.

1. Under the **When a feed item is published** trigger, select **New step**.

   ![Screenshot showing the workflow trigger and the selected button, "New step".](./media/quickstart-create-first-logic-app-workflow/add-new-step-under-trigger.png)

1. Under **Choose an operation** and the search box, select **All**.

1. In the search box, enter `send an email` so that you can find connectors that offer this action. To filter the **Actions** list to a specific app or service, select that app or service first.

   For example, if you have a Microsoft work or school account and want to use Office 365 Outlook, select **Office 365 Outlook**. Or, if you have a personal Microsoft account, select **Outlook.com**. This example continues with Office 365 Outlook.

   > [!NOTE]
   > If you use a different supported email service in your workflow, the user interface might look 
   > slightly different. However, the basic concepts for connecting to another email service remain the same.

   ![Screenshot showing the "Choose an operation" list with the selected email service, "Office 365 Outlook".](./media/quickstart-create-first-logic-app-workflow/select-connector.png)

   You can now more easily find and select the action that you want, for example, **Send an email**:

   ![Screenshot showing filtered actions for the email service, "Office 365 Outlook".](./media/quickstart-create-first-logic-app-workflow/filtered-actions-list.png)

1. If your selected email service prompts you to sign in and authenticate your identity, complete that step now.

   Many connectors require that you first create a connection and authenticate your identity before you can continue.

   ![Screenshot that shows sign-in prompt for Office 365 Outlook.](./media/quickstart-create-first-logic-app-workflow/email-service-authentication.png)

   > [!NOTE]
   > This example shows manual authentication for connecting to Office 365 Outlook. However, other services might 
   > support or use different authentication types. Based on your scenario, you can handle connection authentication 
   > in various ways.
   > 
   > For example, if you use use Azure Resource Manager templates for deployment, you can increase security on inputs 
   > that change often by parameterizing values such as connection details. For more information, review these topics:
   >
   > * [Template parameters for deployment](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md#template-parameters)
   > * [Authorize OAuth connections](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md#authorize-oauth-connections)
   > * [Authenticate access with managed identities](../logic-apps/create-managed-service-identity.md)
   > * [Authenticate connections for logic app deployment](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md#authenticate-connections)

1. In the **Send an email** action, specify the information to include in the email.

   1. In the **To** box, enter the receiver's email address. For this example, use your email address.

      > [!NOTE]
      > The **Add dynamic content** list appears when you click inside the **To** box and other boxes 
      > for certain input types. This list shows any outputs from previous steps that are available for 
      > you to select as inputs for the current action. You can ignore this list for now. The next step 
      > uses the dynamic content list.

   1. In the **Subject** box, enter the email subject. For this example, enter the following text with a trailing blank space: `New RSS item: `

      ![Screenshot showing the "Send an email" action and cursor inside the "Subject" property box.](./media/quickstart-create-first-logic-app-workflow/send-email-subject.png)

   1. From the **Add dynamic content** list, under **When a feed item is published**, select **Feed title**.

      The feed title is a trigger output that references the title for the RSS item. Your email uses this output to show the RSS item's title.

      ![Screenshot showing the "Send an email" action and cursor inside the "Subject" property box with the open dynamic content list and selected trigger output, "Feed title".](./media/quickstart-create-first-logic-app-workflow/send-email-subject-dynamic-content.png)

      > [!TIP]
      > In the dynamic content list, if no outputs appear from the **When a feed item is published** trigger, 
      > next to the action's header, select **See more**.
      > 
      > ![Screenshot that shows the opened dynamic content list and "See more" selected for the trigger.](./media/quickstart-create-first-logic-app-workflow/dynamic-content-list-see-more-actions.png)

      When you're done, the email subject looks like this example:

      ![Screenshot showing the "Send an email" action and an example email subject with the included "Feed title" property.](./media/quickstart-create-first-logic-app-workflow/send-email-feed-title.png)

      > [!NOTE]
      > If a **For each** loop appears on the designer, then you selected an output that references an array, such as 
      > the **categories-Item** property. For this output type, the designer automatically adds the **For each** loop 
      > around the action that references the output. That way, your workflow performs the same action on each array item. 
      >
      > To remove the loop, on the loop's title bar, select the ellipses (**...**) button, then select **Delete**.

   1. In the **Body** box, enter email body content.
   
      For this example, the body includes the following properties, preceded by descriptive text for each property. To add blank lines in an edit box, press Shift + Enter.

      | Descriptive text | Property | Description |
      |------------------|----------|-------------|
      | `Title:` | **Feed title** | The item's title |
      | `Date published:` | **Feed published on** | The item's publishing date and time |
      | `Link:` | **Primary feed link** | The URL for the item |
      ||||

      ![Screenshot showing the Logic Apps Designer, the "Send an email" action, and selected properties inside the "Body" box.](./media/quickstart-create-first-logic-app-workflow/send-email-body.png)

1. Save your logic app. On the designer toolbar, select **Save**.

<a name="run-workflow"></a>

## Run your workflow

To check that the workflow runs correctly, you can wait for the trigger to check the RSS feed based on the set schedule. Or, you can manually run the workflow by selecting **Run** on the Logic Apps Designer toolbar, as shown in the following screenshot. 

![Screenshot showing the Logic Apps Designer and the "Run" button selected on the designer toolbar.](./media/quickstart-create-first-logic-app-workflow/run-logic-app-test.png)

If the RSS feed has new items, your workflow sends an email for each new item. Otherwise, your workflow waits until the next interval to check the RSS feed again. 

The following screenshot shows a sample email that's sent by the example workflow. The email includes the details from each trigger output that you selected plus the descriptive text that you included for each item.

![Screenshot showing Outlook and a sample email received for a new RSS feed item, along with item title, date published, and link.](./media/quickstart-create-first-logic-app-workflow/monitor-rss-feed-email.png)

## Troubleshoot problems

If you don't receive emails from the workflow as expected:

* Check your email account's junk or spam folder, in case the message was incorrectly filtered.
* Make sure the RSS feed you're using has published items since the last scheduled or manual check.

## Clean up resources

When you're done with this quickstart, clean up the sample logic app and any related resources by deleting the resource group that you created for this example.

1. In the Azure search box, enter `resource groups`, and then select **Resource groups**.

   ![Screenshot showing the Azure portal search box with the search term, "resource groups".](./media/quickstart-create-first-logic-app-workflow/find-resource-groups.png)

1. Find and select your logic app's resource group. On the **Overview** pane, select **Delete resource group**.

   ![Screenshot showing Azure portal with selected resource group and button for "Delete resource group".](./media/quickstart-create-first-logic-app-workflow/delete-resource-group.png)

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

   ![Screenshot showing Azure portal with confirmation pane and entered resource group name to delete.](./media/quickstart-create-first-logic-app-workflow/delete-resource-group-2.png)

## Next steps

In this quickstart, you created your first logic app workflow in the Azure portal to check an RSS feed, and send an email for each new item. To learn more about advanced scheduled workflows, see the following tutorial:

> [!div class="nextstepaction"]
> [Check traffic with a scheduled-based logic app](../logic-apps/tutorial-build-schedule-recurring-logic-app-workflow.md)
