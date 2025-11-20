---
title: Create Consumption Workflows with Azure Logic Apps in Portal
description: Learn to build your first Consumption logic app workflow that runs in multitenant Azure Logic Apps using the Azure portal.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, LogicApps
ms.topic: quickstart
ms.collection: ce-skilling-ai-copilot
ms.date: 11/18/2025
ms.update-cycle: 180-days
ms.custom:
  - mode-ui
  - sfi-image-nochange
#Customer intent: As an integration developer new to Azure Logic Apps, I want to create my first Consumption logic app workflow in multitenant Azure Logic Apps using the Azure portal.
---

# Quickstart: Create an example Consumption logic app workflow in the Azure portal

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

This quickstart shows how to create an automated workflow that monitors an RSS feed and sends email notifications. You'll build a Consumption logic app workflow using the following connector operations:

- The **RSS** connector, which provides a trigger to check an RSS feed.
- The **Office 365 Outlook** connector, which provides an action to send email.

Consumption workflows run in multitenant Azure Logic Apps. After you complete this quickstart, your workflow looks like the following example:

:::image type="content" source="media/quickstart-create-example-consumption-workflow/quickstart-workflow-overview.png" alt-text="Screenshot shows completed workflow with RSS trigger and Office 365 Outlook action." lightbox="media/quickstart-create-example-consumption-workflow/quickstart-workflow-overview.png":::

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

This example uses operations from two connectors among the [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that you can use in a workflow. While this example is cloud-based, Azure Logic Apps supports workflows that connect apps, data, services, and systems across cloud, on-premises, and hybrid environments.

To create and manage a Consumption logic app workflow using other tools, see the following quickstarts:

* [Create and manage logic app workflows in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
* [Create and manage logic apps workflows using the Azure CLI](quickstart-logic-apps-azure-cli.md)

To create a Standard logic app workflow that runs in single-tenant Azure Logic Apps instead, see [Create an example Standard logic app workflow using Azure portal](create-single-tenant-workflows-azure-portal.md).

<a name="prerequisites"></a>

## Prerequisites

- Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Email account such as Office 365 Outlook or Outlook.com.

  > [!NOTE]
  >
  > This quickstart uses Office 365 Outlook, which requires a work or school account. Outlook.com requires a personal Microsoft account. For other email providers, see [Connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors).

- Network access to Azure resources.

  If you're behind a corporate firewall, see [IP address requirements](logic-apps-limits-and-config.md#firewall-configuration-ip-addresses-and-service-tags) for Azure Logic Apps. For connectors, see [Managed connector outbound IP addresses](/connectors/common/outbound-ip-addresses).

<a name="create-logic-app-resource"></a>

## Create a Consumption logic app resource

1. In the [Azure portal](https://portal.azure.com), sign in with your Azure account.

1. In the Azure portal search box, enter **logic app**, and select **Logic apps**.

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/find-select-logic-apps.png" alt-text="Screenshot shows Azure portal search box with the words, logic app, and shows the selection, Logic apps." lightbox="media/quickstart-create-example-consumption-workflow/find-select-logic-apps.png":::

1. On the **Logic apps** page toolbar, select **Add**.

   The **Create Logic App** page appears and shows the following options:

   [!INCLUDE [logic-apps-host-plans](includes/logic-apps-host-plans.md)]

1. On the **Create Logic App** page, select **Consumption (Multi-tenant)** > **Select**.

1. On the **Basics** tab, provide the following information for your logic app resource:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. <br><br>This example uses **Pay-As-You-Go**. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your logic app and related resources. Provide a name that's unique across regions and contains only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), or periods (**.**). <br><br>This example creates a resource group named **Consumption-RG**. |
   | **Logic App name** | Yes | <*logic-app-name*> | Provide a name that's unique across regions and contains only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), or periods (**.**). <br><br>This example creates a logic app resource named **My-Consumption-Logic-App**. |
   | **Region** | Yes | <*Azure-region*> | The Azure datacenter region for your logic app. <br><br>This example uses **West US**. |
   | **Enable log analytics** | Yes | **No** | Change this option only when you want to enable diagnostic logging. For this quickstart, keep the default selection. |
   | **Workflow type** | Yes | **Stateful** | The type of workflow to create. All Consumption workflows are stateful, which means the workflow automatically saves and stores run history information, such as status, inputs, and outputs. <br><br>**Note**: This quickstart focuses on creating a non-agentic workflow. Unless **Stateful** isn't selected, you don't have to change anything in this section. In regions that don't support agentic workflows, the **Workflow type** options are unavailable. <br><br>For information about agentic workflows, see: <br>- [Create autonomous AI agent workflows in Azure Logic Apps](create-autonomous-agent-workflows.md?tabs=consumption) <br>- [Create conversational AI agent workflows in Azure Logic Apps](create-conversational-agent-workflows.md?tabs=consumption) |

   > [!NOTE]
   >
   > Availability zones are automatically enabled for new and existing Consumption logic app workflows in 
   > [Azure regions that support availability zones](../reliability/availability-zones-region-support.md). 
   > For more information, see [Reliability in Azure Functions](../reliability/reliability-functions.md#availability-zone-support) and 
   > [Protect logic apps from region failures with zone redundancy and availability zones](set-up-zone-redundancy-availability-zones.md).

   When you're done, your settings look similar to the following example:

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/create-logic-app-settings.png" alt-text="Screenshot shows Azure portal and Consumption logic app resource creation page." lightbox="media/quickstart-create-example-consumption-workflow/create-logic-app-settings.png":::

1. When you're ready, select **Review + create**. On the validation page that appears, confirm all the provided information, and select **Create**.

1. After Azure successfully deploys your logic app resource, select **Go to resource**. Or, find and select your logic app resource by using the Azure search box.

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/go-to-resource.png" alt-text="Screenshot shows the resource deployment page and selected button named Go to resource." lightbox="media/quickstart-create-example-consumption-workflow/go-to-resource.png":::

<a name="add-rss-trigger"></a>

## Add the trigger

A workflow always starts with a single *trigger*, which specifies the condition to meet before running any subsequent actions in the workflow. Each time the trigger fires, Azure Logic Apps creates and runs a workflow instance. If the trigger doesn't fire, no workflow instance is created or run.

This example uses an RSS trigger that checks an RSS feed, based on the specified schedule. If a new item exists in the feed, the trigger fires, and a new workflow instance is created and run. If multiple new items exist between checks, the trigger fires for each item, and a separate new workflow instance runs for each item. By default, workflow instances that are created at the same time also run at the same time, or concurrently.

1. On the logic app resource sidebar, under **Development Tools**, select the designer to open the workflow.

1. Follow the [general steps](create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger) to add the **RSS** trigger named **When a feed item is published**.

1. On the trigger pane, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **The RSS feed URL** | Yes | <*RSS-feed-URL*> | The RSS feed URL to monitor. <br><br>This example uses the Wall Street Journal's RSS feed at **https://feeds.content.dowjones.io/public/rss/RSSMarketsMain**. However, you can use any RSS feed that doesn't require HTTP authorization. Choose an RSS feed that publishes frequently, so you can easily test your workflow. |
   | **Chosen property will be used to determine which items are new** | No | **PublishDate** | The property that determines which items are new. |
   | **Interval** | Yes | **30** | The number of intervals to wait between feed checks. <br><br>This example uses **30** as the interval because this value is the [minimum interval for the **RSS** trigger](/connectors/rss/#general-limits). |
   | **Frequency** | Yes | **Minute** | The unit of frequency to use for every interval. <br><br>This example uses **Minute** as the frequency. |
   | **Time zone** | No | <*time-zone*> | The time zone to use for checking the RSS feed. |
   | **Start time** | No | <*start-time*> | The start time to use for checking the RSS feed. | 

   :::image type="content" source="media/quickstart-create-example-consumption-workflow/add-rss-trigger-settings.png" alt-text="Screenshot shows the RSS trigger settings, including RSS URL, frequency, interval, and others." lightbox="media/quickstart-create-example-consumption-workflow/add-rss-trigger-settings.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

   This step automatically publishes your logic app resource and workflow live in the Azure portal. However, the workflow doesn't do anything yet other than fire the trigger to check the RSS feed, based on the specified schedule. In a later section, you add an action to specify what you want to happen when the trigger fires.

1. Due to this **RSS** trigger's default double-encoding behavior, you must edit the trigger definition to remove the behavior:

   1. On the *designer* toolbar, select **Code view**.

      > [!IMPORTANT]
      >
      > Don't select the **Code view** tab in the trigger information pane. This tab opens code view in read-only mode.

   1. In the code editor, find the line **`"feedUrl": "@{encodeURIComponent(encodeURIComponent('https://feeds.content.dowjones.io/public/rss/RSSMarketsMain'))}"`**.

   1. Remove the extra function named **`encodeURIComponent()`** so that you have only one instance, for example: 
   
      `"feedUrl": "@{encodeURIComponent('https://feeds.content.dowjones.io/public/rss/RSSMarketsMain')}"`

1. Save your changes. On the code view toolbar, select **Save**.

   Every time that you save changes to your workflow in the designer or code view, Azure instantly publishes those changes live in the Azure portal.

1. Return to the designer. On the code view toolbar, select **Designer**.

In the next section, you add the action to run when the trigger condition is met, which causes the trigger to fire.

<a name="add-email-action"></a>

## Add an action

Following the trigger, an *action* is any subsequent step that runs some operation in the workflow. Any action can use the outputs from any preceding operation, including the trigger. You can add as many actions as needed for your scenario up to the [workflow limit](logic-apps-limits-and-config.md#definition-limits) and create different action paths or branches.

This example uses an Office 365 Outlook action that sends an email each time the trigger fires for a new RSS feed item. If multiple new items exist between trigger checks, you get multiple emails.

1. On the designer, follow the [general steps](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action) to add a connector action that sends email for example:

   - If you have a Microsoft work or school account, add the **Office 365 Outlook** connector action named **Send an email**.

   - If you have a personal Microsoft account, add the **Outlook.com** connector action named **Send an email**.

   This example continues with the **Office 365 Outlook** connector action named **Send an email**.

   If you use a different supported email service in your workflow, the user interface might look slightly different. However, the basic concepts for connecting to another email service remain the same.

1. If your selected email service prompts you to sign in and authenticate your identity, complete that step now.

   Many connectors require that you first create a connection and authenticate your identity before you can continue. This example uses manual authentication for connecting to Office 365 Outlook. However, other services might support or use different authentication types. Based on your scenario, you can handle connection authentication in various ways.

   For more information, see:

   * [Template parameters for deployment](logic-apps-azure-resource-manager-templates-overview.md#template-parameters)
   * [Authorize OAuth connections](logic-apps-deploy-azure-resource-manager-templates.md#authorize-oauth-connections)
   * [Authenticate access with managed identities](create-managed-service-identity.md)
   * [Authenticate connections for logic app deployment](logic-apps-azure-resource-manager-templates-overview.md#authenticate-connections)

1. In the action information pane, provide the following information to include in the email:

   1. In the **To** box, enter the recipient's email address. For testing, use your email address.

      When you select inside the **To** box or other edit boxes, options appear for opening the dynamic content list (lightning icon) or expression editor (formula icon). The dynamic content list shows any outputs from previous operations that you can select as inputs for the current action. The expression editor lets you use functions and operation outputs to work with data. You can ignore these options for now. The next step uses the dynamic content list.

   1. In the **Subject** box, enter the subject for the email.
   
      For this example, include output from the trigger to show the RSS item's title by following these steps:

      1. Enter the following text with a trailing blank space: **`New RSS item: `**

      1. With the cursor still in the **Subject** box, select the dynamic content list (lightning icon).

         :::image type="content" source="media/quickstart-create-example-consumption-workflow/send-email-open-dynamic-content.png" alt-text="Screenshot shows the action named Send an email, cursor in box named Subject, and selected option for dynamic content list." lightbox="media/quickstart-create-example-consumption-workflow/send-email-open-dynamic-content.png":::

      1. From the dynamic content list that opens, under **When a feed item is published**, select **Feed title**, which is a trigger output that references the title for the RSS item.

         :::image type="content" source="media/quickstart-create-example-consumption-workflow/send-email-select-dynamic-content.png" alt-text="Screenshot shows the action named Send an email, with the cursor inside the box named Subject." lightbox="media/quickstart-create-example-consumption-workflow/send-email-select-dynamic-content.png":::

         If no outputs appear available under **When a feed item is published**, select **See more**.

         :::image type="content" source="media/quickstart-create-example-consumption-workflow/dynamic-content-see-more.png" alt-text="Screenshot shows open dynamic content list and selected option, See more." lightbox="media/quickstart-create-example-consumption-workflow/dynamic-content-see-more.png":::

         When you're done, the email subject looks like the following example:

         :::image type="content" source="media/quickstart-create-example-consumption-workflow/send-email-feed-title.png" alt-text="Screenshot shows the action named Send an email, with example email subject and included property named Feed title." lightbox="media/quickstart-create-example-consumption-workflow/send-email-feed-title.png":::

         > [!NOTE]
         > 
         > If you select an output that references an array, the designer automatically adds a **For each**  loop around the action that references the output. That way, your workflow processes the array by performing the same action on each item in the array.
         >
         > To remove the loop, drag the child action outside the loop, then delete the loop.

   1. In the **Body** box, enter the email content.
   
      For this example, include each line of descriptive text, followed by the corresponding outputs from the RSS trigger. To add blank lines in an edit box, press Shift + Enter.

      | Descriptive text | Property | Description |
      |------------------|----------|-------------|
      | `Title:` | **Feed title** | The item's title. |
      | `Date published:` | **Feed published on** | The item's publishing date and time. |
      | `Link:` | **Primary feed link** | The URL for the item. |

      :::image type="content" source="media/quickstart-create-example-consumption-workflow/send-email-body.png" alt-text="Screenshot shows the action named Send an email, with descriptive text and properties in the box named Body." lightbox="media/quickstart-create-example-consumption-workflow/send-email-body.png":::

1. Save your workflow.

<a name="run-workflow"></a>

## Test your workflow

To confirm the workflow runs correctly, either wait for the trigger to fire or manually run the workflow.

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
