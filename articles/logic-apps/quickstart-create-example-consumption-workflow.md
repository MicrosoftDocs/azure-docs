---
title: Create example Consumption workflow in Azure portal
description: Learn to build your first example Consumption logic app workflow that runs in multitenant Azure Logic Apps using the Azure portal.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: quickstart
ms.custom: mode-ui
ms.collection: ce-skilling-ai-copilot
ms.date: 08/07/2024
#Customer intent: As a developer, I want to create my first example Consumption logic app workflow that runs in multitenant Azure Logic Apps using the Azure portal.
---

# Quickstart: Create an example Consumption logic app workflow using the Azure portal

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

This quickstart show how to create an example workflow that runs in multitenant Azure Logic Apps and performs tasks with multiple cloud services. The workflow checks an RSS feed for new articles, based on a specific schedule, and sends an email for each new RSS item. Specifically, you create a Consumption logic app resource and workflow that uses the following items: 

- The **RSS** connector, which provides a trigger to check an RSS feed.
- The **Office 365 Outlook** connector, which provides an action to send email.

When you finish, your workflow looks like the following high level example:

:::image type="content" source="media/quickstart-create-example-consumption-workflow/quickstart-workflow-overview.png" alt-text="Screenshot shows Azure portal, and example Consumption workflow with RSS trigger named When a feed item is published plus the Office 365 Outlook action named Send an email." lightbox="media/quickstart-create-example-consumption-workflow/quickstart-workflow-overview.png":::

> [!TIP]
>
> To learn more, you can ask Azure Copilot these questions:
>
> - *What's Azure Logic Apps?*
> - *What's a Consumption logic app workflow?*
> - *What's the RSS connector?*
> - *What's the Office 365 Outlook connector?*
>
> To find Azure Copilot, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

The operations in this example are from two connectors among [1000+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that you can use in a workflow. While this example is cloud-based, Azure Logic Apps supports workflows that connect apps, data, services, and systems across cloud, on-premises, and hybrid environments.

To create and manage a Consumption logic app workflow using other tools, see the following quickstarts:

* [Create and manage logic app workflows in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
* [Create and manage logic apps workflows using the Azure CLI](quickstart-logic-apps-azure-cli.md)

To create a Standard logic app workflow that runs in single-tenant Azure Logic Apps instead, see [Create an example Standard logic app workflow using Azure portal](create-single-tenant-workflows-azure-portal.md).

<a name="prerequisites"></a>

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An email account from a service that works with Azure Logic Apps, such as Office 365 Outlook or Outlook.com. For other supported email providers, see [Connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors).

  This quickstart uses Office 365 Outlook with a work or school account. If you use a different email account, the general steps stay the same, but your UI might slightly differ. If you use Outlook.com, use your personal Microsoft account instead to sign in.

  > [!NOTE]
  >
  > If you want to use the [Gmail connector](/connectors/gmail/), only G Suite accounts can use 
  > this connector without restriction in Azure Logic Apps. If you have a consumer Gmail account, 
  > you can only use this connector with specific Google-approved services, unless you 
  > [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). For more information, see 
  > [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

* If you have a firewall that limits traffic to specific IP addresses, make sure that you set up your firewall to allow access for both the [inbound](logic-apps-limits-and-config.md#inbound) and [outbound](logic-apps-limits-and-config.md#outbound) IP addresses that Azure Logic Apps uses in the Azure region where you create your logic app workflow.

  This example uses the **RSS** and **Office 365 Outlook** connectors, which [are hosted and run in global multitenant Azure and are managed by Microsoft](../connectors/managed.md). These connectors require that you set up your firewall to allow access for all the [managed connector outbound IP addresses](/connectors/common/outbound-ip-addresses) in the Azure region for your logic app resource.

<a name="create-logic-app-resource"></a>

## Create a Consumption logic app resource

1. In the [Azure portal](https://portal.azure.com), sign in with your Azure account.

1. In the Azure portal search box, enter **logic app**, and select **Logic apps**.

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/find-select-logic-apps.png" alt-text="Screenshot shows Azure portal search box with the words, logic app, and shows the selection, Logic apps." lightbox="media/quickstart-create-example-consumption-workflow/find-select-logic-apps.png":::

1. On the **Logic apps** page toolbar, select **Add**.

   The **Create Logic App** page appears and shows the following options:

   [!INCLUDE [logic-apps-host-plans](includes/logic-apps-host-plans.md)]

1. On the **Create Logic App** page, select **Consumption (Multi-tenant)**.

1. On the **Basics** tab, provide the following information about your logic app resource:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. <br><br>This example uses **Pay-As-You-Go**. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your logic app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a resource group named **Consumption-RG**. |
   | **Logic App name** | Yes | <*logic-app-name*> | Your logic app resource name, which must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a logic app resource named **My-Consumption-Logic-App**. |
   | **Region** | Yes | <*Azure-region*> | The Azure datacenter region for your logic app. <br><br>This example uses **West US**. |
   | **Enable log analytics** | Yes | **No** | Change this option only when you want to enable diagnostic logging. For this quickstart, keep the default selection. <br><br>**Note**: This option is available only with Consumption logic apps. |

   > [!NOTE]
   >
   > Availability zones are automatically enabled for new and existing Consumption logic app workflows in 
   > [Azure regions that support availability zones](../reliability/availability-zones-region-support.md). 
   > For more information, see [Reliability in Azure Functions](../reliability/reliability-functions.md#availability-zone-support) and 
   > [Protect logic apps from region failures with zone redundancy and availability zones](set-up-zone-redundancy-availability-zones.md).

   After you finish, your settings look similar to the following example:

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/create-logic-app-settings.png" alt-text="Screenshot shows Azure portal and logic app resource creation page with details for new logic app." lightbox="media/quickstart-create-example-consumption-workflow/create-logic-app-settings.png":::

1. When you're ready, select **Review + create**. On the validation page that appears, confirm all the provided information, and select **Create**.

1. After Azure successfully deploys your logic app resource, select **Go to resource**. Or, find and select your logic app resource by using the Azure search box.

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/go-to-resource.png" alt-text="Screenshot shows the resource deployment page and selected button named Go to resource." lightbox="media/quickstart-create-example-consumption-workflow/go-to-resource.png":::

<a name="add-rss-trigger"></a>

## Add the trigger

A workflow always starts with a single *trigger*, which specifies the condition to meet before running any subsequent actions in the workflow. Each time the trigger fires, Azure Logic Apps creates and runs a workflow instance. If the trigger doesn't fire, no workflow instance is created or run.

This example uses an RSS trigger that checks an RSS feed, based on the specified schedule. If a new item exists in the feed, the trigger fires, and a new workflow instance is created and run. If multiple new items exist between checks, the trigger fires for each item, and a separate new workflow instance runs for each item. By default, workflow instances that are created at the same time also run at the same time, or concurrently.

1. On the workflow designer, [follow these general steps to add the **RSS** trigger named **When a feed item is published**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

1. In the trigger box, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **The RSS feed URL** | Yes | <*RSS-feed-URL*> | The RSS feed URL to monitor. <br><br>This example uses the Wall Street Journal's RSS feed at **https://feeds.a.dj.com/rss/RSSMarketsMain.xml**. However, you can use any RSS feed that doesn't require HTTP authorization. Choose an RSS feed that publishes frequently, so you can easily test your workflow. |
   | **Chosen Property Will Be Used To Determine Which Items are New** | No | **PublishDate** | The property that determines which items are new. |
   | **Interval** | Yes | **30** | The number of intervals to wait between feed checks. <br><br>This example uses **30** as the interval because this value is the [minimum interval for the **RSS** trigger](/connectors/rss/#general-limits). |
   | **Frequency** | Yes | **Minute** | The unit of frequency to use for every interval. <br><br>This example uses **Minute** as the frequency. |
   | **Time Zone** | No | <*time-zone*> | The time zone to use for checking the RSS feed |
   | **Start Time** | No | <*start-time*> | The start time to use for checking the RSS feed | 

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/add-rss-trigger-settings.png" alt-text="Screenshot shows the RSS trigger settings, including RSS URL, frequency, interval, and others." lightbox="media/quickstart-create-example-consumption-workflow/add-rss-trigger-settings.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

   This step instantly publishes your logic app resource and workflow live in the Azure portal. However, the trigger only checks the RSS feed without taking any other actions. So, you need to add an action to specify what you want to happen when the trigger fires.

<a name="add-email-action"></a>

## Add an action

Following a trigger, an *action* is any subsequent step that runs some operation in the workflow. Any action can use the outputs from the previous operations, which include the trigger and any other actions. You can choose from many different actions, include multiple actions up to the [limit per workflow](logic-apps-limits-and-config.md#definition-limits), and even create different action paths.

This example uses an Office 365 Outlook action that sends an email each time that the trigger fires for a new RSS feed item. If multiple new items exist between checks, you receive multiple emails.

1. On the workflow designer, [follow these general steps to add a connector action that you can use to send email](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action), for example:

   - If you have a Microsoft work or school account, add the **Office 365 Outlook** connector action named **Send an email**.
   - If you have a personal Microsoft account, add the **Outlook.com** connector action named **Send an email**.

   This example continues with the **Office 365 Outlook** connector action named **Send an email**.

   If you use a different supported email service in your workflow, the user interface might look slightly different. However, the basic concepts for connecting to another email service remain the same.

1. If your selected email service prompts you to sign in and authenticate your identity, complete that step now.

   Many connectors require that you first create a connection and authenticate your identity before you can continue. This example uses manual authentication for connecting to Office 365 Outlook. However, other services might support or use different authentication types. Based on your scenario, you can handle connection authentication in various ways.

   For more information, see the following documentation:

   * [Template parameters for deployment](logic-apps-azure-resource-manager-templates-overview.md#template-parameters)
   * [Authorize OAuth connections](logic-apps-deploy-azure-resource-manager-templates.md#authorize-oauth-connections)
   * [Authenticate access with managed identities](create-managed-service-identity.md)
   * [Authenticate connections for logic app deployment](logic-apps-azure-resource-manager-templates-overview.md#authenticate-connections)

1. In the **Send an email** action, provide the following information to include in the email.

   1. In the **To** box, enter the recipient's email address. For this example, use your email address.

      When you select inside the **To** box or other edit boxes, the options to open the dynamic content list (lightning icon) or expression editor (formula icon) appear. The dynamic content list shows any outputs from previous operations that you can select and use as inputs for the current action. The expression editor provides a way for you to use functions and outputs to manipulate data manipulation. You can ignore these options for now. The next step uses the dynamic content list.

   1. In the **Subject** box, enter the subject for the email.
   
      For this example, include the output from the trigger to show the RSS item's title by following these steps:

      1. Enter the following text with a trailing blank space: **`New RSS item: `**

      1. With the cursor still in the **Subject** box, select the dynamic content list (lightning icon).

         :::image type="content" source="media/quickstart-create-example-consumption-workflow/send-email-open-dynamic-content.png" alt-text="Screenshot shows the action named Send an email, cursor in box named Subject, and selected option for dynamic content list." lightbox="media/quickstart-create-example-consumption-workflow/send-email-open-dynamic-content.png":::

      1. From the dynamic content list that opens, under **When a feed item is published**, select **Feed title**, which is a trigger output that references the title for the RSS item.

         :::image type="content" source="media/quickstart-create-example-consumption-workflow/send-email-select-dynamic-content.png" alt-text="Screenshot shows the action named Send an email, with the cursor inside the box named Subject." lightbox="media/quickstart-create-example-consumption-workflow/send-email-select-dynamic-content.png":::

         If no outputs appear available under **When a feed item is published**, select **See more**.

         :::image type="content" source="media/quickstart-create-example-consumption-workflow/dynamic-content-see-more.png" alt-text="Screenshot shows open dynamic content list and selected option, See more." lightbox="media/quickstart-create-example-consumption-workflow/dynamic-content-see-more.png":::

         After you finish, the email subject looks like the following example:

         :::image type="content" source="media/quickstart-create-example-consumption-workflow/send-email-feed-title.png" alt-text="Screenshot shows the action named Send an email, with example email subject and included property named Feed title." lightbox="media/quickstart-create-example-consumption-workflow/send-email-feed-title.png":::

         > [!NOTE]
         > 
         > If you select an output that references an array, the designer automatically adds a **For each** 
         > loop around the action that references the output. That way, your workflow processes the array 
         > by performing the same action on each item in the array. 
         >
         > To remove the loop, drag the child action outside the loop, then delete the loop.

   1. In the **Body** box, enter the email content.
   
      For this example, include each line of descriptive text, followed by the corresponding outputs from the RSS trigger. To add blank lines in an edit box, press Shift + Enter.

      | Descriptive text | Property | Description |
      |------------------|----------|-------------|
      | `Title:` | **Feed title** | The item's title |
      | `Date published:` | **Feed published on** | The item's publishing date and time |
      | `Link:` | **Primary feed link** | The URL for the item |

      :::image type="content" source="media/quickstart-create-example-consumption-workflow/send-email-body.png" alt-text="Screenshot shows the action named Send an email, with descriptive text and properties in the box named Body." lightbox="media/quickstart-create-example-consumption-workflow/send-email-body.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

<a name="run-workflow"></a>

## Test your workflow

To check that the workflow runs correctly, you can either wait for the trigger to fire based on your specified schedule, or you can manually run the workflow.

* On the designer toolbar, from the **Run** menu, select **Run**.

If the RSS feed has new items, your workflow sends an email for each new item. Otherwise, your workflow waits until the next interval to check the RSS feed again.

The following screenshot shows a sample email that the example workflow sends. The email includes the details from each trigger output that you selected plus the descriptive text that you included for each item.

:::image type="content" source="media/quickstart-create-example-consumption-workflow/monitor-rss-feed-email.png" alt-text="Screenshot shows Outlook and sample email received for new RSS feed item, along with item title, date published, and link." lightbox="media/quickstart-create-example-consumption-workflow/monitor-rss-feed-email.png":::

## Troubleshoot problems

If you don't receive emails from the workflow as expected:

* Check your email account's junk or spam folder, in case the message was incorrectly filtered.

* Make sure the RSS feed you're using published items since the last scheduled or manual check.

## Clean up resources

When you complete this quickstart, delete the sample logic app resource and any related resources by deleting the resource group that you created for this example.

1. In the Azure search box, enter **resource groups**, and select **Resource groups**.

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/find-resource-groups.png" alt-text="Screenshot shows Azure portal search box with search term, resource groups." lightbox="media/quickstart-create-example-consumption-workflow/find-resource-groups.png":::

1. Find and select your logic app's resource group. On the **Overview** pane, select **Delete resource group**.

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/delete-resource-group.png" alt-text="Screenshot shows Azure portal with selected resource group and button for Delete resource group." lightbox="media/quickstart-create-example-consumption-workflow/delete-resource-group.png":::

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/delete-resource-group-2.png" alt-text="Screenshot shows Azure portal with confirmation pane and entered resource group name to delete." lightbox="media/quickstart-create-example-consumption-workflow/delete-resource-group-2.png":::

## Next steps

In this quickstart, you created a Consumption logic app workflow in the Azure portal to check an RSS feed, and send an email for each new item. To learn more about advanced scheduled workflows, see the following tutorial:

> [!div class="nextstepaction"]
> [Check traffic with a schedule-based logic app workflow](tutorial-build-schedule-recurring-logic-app-workflow.md)
