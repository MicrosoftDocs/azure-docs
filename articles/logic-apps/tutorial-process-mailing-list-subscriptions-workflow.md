---
title: Create approval-based automated workflows
description: Learn to build an automated approval-based workflow that processes mailing list subscriptions using Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: tutorial
ms.collection: ce-skilling-ai-copilot
ms.custom: mvc
ms.date: 08/09/2024
---

# Tutorial: Create approval-based workflows using Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

This tutorial shows how to build an example workflow that automates an approval-based task by using Azure Logic Apps. This example specifically creates a Consumption logic app workflow that processes subscription requests for a mailing list that's managed by [MailChimp](https://mailchimp.com/).

The workflow starts with monitoring an email account for requests, sends received requests for approval, checks whether or not the request gets approval, adds approved members to the mailing list, and confirms whether or not new members get added to the list.

When you finish, your workflow looks like the following high level example:

:::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/overview.png" alt-text="Screenshot shows example Consumption high-level workflow." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/overview.png":::

> [!TIP]
>
> To learn more, you can ask Azure Copilot these questions:
>
> - *What's Azure Logic Apps?*
> - *What's a Consumption logic app workflow?*
>
> To find Azure Copilot, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

You can create a similar workflow with a Standard logic app resource where some connector operations, such as Azure Blob Storage, are also available as built-in, service provider-based operations. However, the user experience and tutorial steps vary slightly from the Consumption version.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A MailChimp account where you previously created a list named "test-members-ML" where your logic app can add email addresses for approved members. If you don't have an account, [sign up for a free account](https://login.mailchimp.com/signup/), and then learn [how to create a MailChimp list](https://us17.admin.mailchimp.com/lists/#).

* An email account in Office 365 Outlook or Outlook.com, which supports approval workflows. For other email providers, see [Connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors).

  This tutorial uses Office 365 Outlook with a work or school account. If you use a different email account, the general steps stay the same, but the user experience might slightly differ. If you use Outlook.com, use your personal Microsoft account instead to sign in.

  > [!IMPORTANT]
  >
  > If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic app workflows. 
  > If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can 
  > [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). 
  > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

* If your logic app workflow needs to communicate through a firewall that limits traffic to specific IP addresses, that firewall needs to allow access for *both* the [inbound](logic-apps-limits-and-config.md#inbound) and [outbound](logic-apps-limits-and-config.md#outbound) IP addresses used by Azure Logic Apps in the Azure region where your logic app resource exists. If your logic app also uses [managed connectors](../connectors/managed.md), such as the Office 365 Outlook connector or SQL connector, or uses [custom connectors](/connectors/custom-connectors/), the firewall also needs to allow access for *all* the [managed connector outbound IP addresses](logic-apps-limits-and-config.md#outbound) in your logic app's Azure region.

## Create a Consumption logic app resource

1. In the [Azure portal](https://portal.azure.com), sign in with your Azure account.

1. In the Azure portal search box, enter **logic app**, and select **Logic apps**.

   :::image type="content" source="media/tutorial-build-scheduled-recurring-logic-app-workflow/find-select-logic-apps.png" alt-text="Screenshot shows Azure portal search box with logic app entered and selected option for Logic apps." lightbox="media/tutorial-build-scheduled-recurring-logic-app-workflow/find-select-logic-apps.png":::

1. On the **Logic apps** page toolbar, select **Add**.

   The **Create Logic App** page appears and shows the following options:

   [!INCLUDE [logic-apps-host-plans](../../includes/logic-apps-host-plans.md)]

1. On the **Create Logic App** page, select **Consumption (Multi-tenant)**.

1. On the **Basics** tab, provide the following information about your logic app resource:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. <br><br>This example uses **Pay-As-You-Go**. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your logic app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a resource group named **LA-MailingList-RG**. |
   | **Logic App name** | Yes | <*logic-app-resource-name*> | Your logic app resource name, which must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a logic app resource named **LA-MailingList**. |
   | **Region** | Yes | <*Azure-region*> | The Azure datacenter region for your app. <br><br>This example uses **West US**. |
   | **Enable log analytics** | Yes | **No** | Change this option only when you want to enable diagnostic logging. For this tutorial, keep the default selection. <br><br>**Note**: This option is available only with Consumption logic apps. |

   > [!NOTE]
   >
   > Availability zones are automatically enabled for new and existing Consumption logic app workflows in 
   > [Azure regions that support availability zones](../reliability/availability-zones-service-support.md#azure-regions-with-availability-zone-support). 
   > For more information, see [Reliability in Azure Functions](../reliability/reliability-functions.md#availability-zone-support) and 
   > [Protect logic apps from region failures with zone redundancy and availability zones](set-up-zone-redundancy-availability-zones.md).

   After you finish, your settings look similar to the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/create-logic-app-settings.png" alt-text="Screenshot shows Azure portal and creation page for multitenant Consumption logic app and details." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/create-logic-app-settings.png":::

1. When you finish, select **Review + create**. After Azure validates the information about your logic app resource, select **Create**.

1. After Azure deploys your logic app resource, select **Go to resource**. Or, find and select your logic app resource by using the Azure search box.

## Add a trigger to check emails

The following steps add a trigger that waits for incoming emails that have subscription requests.

1. On the logic app menu, under **Development Tools**, select **Logic app designer**.

1. On the workflow designer, [follow these general steps to add the **Office 365 Outlook** trigger named **When a new email arrives**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

   The Office 365 Outlook connector requires that you sign in with a Microsoft work or school account. If you're using a personal Microsoft account, use the Outlook.com connector.

1. Sign in to your email account, which creates a connection between your workflow and your email account.

1. In the trigger information box, from the **Advanced parameters** list, add the following parameters, if they don't appear, and provide the following information:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Importance** | **Any** | Specifies the importance level of the email that you want. |
   | **Folder** | **Inbox** | The email folder to check. |
   | **Subject Filter** | **subscribe-test-members-ML** | Specifies the text to find in the email subject and filters emails based on the subject line. |

   > [!NOTE]
   >
   > When you select inside some edit boxes, the options for the dynamic content list (lightning icon) 
   > and expression editor (function icon) appear, which you can ignore for now.

   For more information about this trigger's properties, see the [Office 365 Outlook connector reference](/connectors/office365/) or the [Outlook.com connector reference](/connectors/outlook/).

   When you finish, the trigger looks similar to the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/trigger-information.png" alt-text="Screenshot shows Consumption workflow with trigger named When a new email arrives." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/trigger-information.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

Your workflow is now live but doesn't do anything other check your emails. Next, add an action that responds when the trigger fires.

## Add an action to send approval email

The following steps add an action that sends an email to approve or reject the request.

1. On the designer, under the trigger named **When a new email arrives**, [follow these general steps to add the **Office 365 Outlook** action named **Send approval email**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. For the **Send approval email** action, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **To** | Yes | <*approver-email-address*> | The approver's email address. For testing, use your own address. |
   | **Subject** | No | <*email-subject*> | A descriptive email subject. <br><br>This example uses **Approve member request for test-members-ML**. |

   For more information about these properties, see the [Office 365 Outlook connector reference](/connectors/office365/) or the [Outlook.com connector reference](/connectors/outlook/).

   When you finish, the **Send approval email** action looks like the following example: 

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/add-action-approval-email-settings.png" alt-text="Screenshot shows information for action named Send approval email." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/add-action-approval-email-settings.png":::

1. Save your workflow.

Next, add a condition that checks the approver's selected response.

## Add an action to check approval response

1. On the designer, under the **Send approval email** action, [follow these general steps to add the **Control** action named **Condition**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. On the **Condition** action pane, rename the action with **If request approved**.

1. Build a condition that checks whether the approver selected **Approve**.

   1. On the **Parameters** tab, in the first row under the **AND** list, select inside the left box, and then select the dynamic content list (lightning icon). From this list, in the **Send approval email** section, select the **SelectedOption** output.

      :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-selected-option.png" alt-text="Screenshot shows condition action, second row with cursor in leftmost box, open dynamic content list, and SelectedOption selected." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-selected-option.png":::

   1. In the middle box, keep the operator named **is equal to**.

   1. In the right box, enter **Approve**.

   When you finish, the condition looks like the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-done.png" alt-text="Screenshot shows the finished condition for example approval workflow." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-done.png":::

1. Save your workflow.

## Add an action to include member in MailChimp list

The following steps add an action that includes the approved member on your mailing list.

1. In the condition's **True** block, [follow these general steps to add the **MailChimp** action named **Add member to list**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. Sign in and authorize access to your MailChimp account, which creates a connection between your workflow and your MailChimp account.

1. In the **Add member to list** action, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **List Id** | Yes | <*mailing-list-name*> | The name for your MailChimp mailing list. <br><br>This example uses **test-members-ML**. |
   | **Status** | Yes | <*member-subscription-status*> | The new member's subscription status. <br><br>This example selects **subscribed**. |
   | **Email Address** | Yes | <*member-email-address*> | The new member's email address. <br><br>1. Select inside the **Email Address** box, and then select the dynamic content list (lightning icon). <br><br>From the dynamic content list, in the **When a new email arrives** section, select **From**, which is a trigger output. |

   For more information about the **Add member to list** action properties, see the [MailChimp connector reference](/connectors/mailchimp/).

   When you finish, the **Add member to list** action looks like the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/add-action-mailchimp-settings.png" alt-text="Screenshot shows information for the MailChimp action named Add member to list." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/add-action-mailchimp-settings.png":::

1. Save your workflow.

## Add an action to check success or failure

The following steps add a condition to check whether the new member successfully joined your mailing list. Your workflow can then notify you whether this operation succeeded or failed.

1. In the **True** block, under the **Add member to list** action, [follow these general steps to add the **Control** action named **Condition**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. Rename the condition with **If add member succeeded**.

1. Build a condition that checks whether the approved member succeeds or fails in joining your mailing list.

   1. On the **Parameters** tab, in the first row under the **AND** list, select inside the left box, and then select the dynamic content list (lightning icon). From this list, in the **Add member to list** section, select the **Status** output.

   1. In the middle box, keep the operator named **is equal to**.

   1. In the right box, enter **subscribed**.

   When you finish, the condition looks like the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-check-member-done.png" alt-text="Screenshot shows finished condition to check added member." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-check-member-done.png":::

## Add an action to send success email

The following steps add an action to send success email when the workflow succeeds in adding the member to your mailing list.

1. In the **True** block for the **If add member succeeded** condition, [follow these general steps to add the **Office 365 Outlook** action named **Send an email**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. Rename the **Send an email** action with **Send email on success**.

1. In the **Send email on success** action, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **To** | Yes | <*recipient-email-address*> | The email recipient's email address. For testing purposes, use your own email address. |
   | **Subject** | Yes | <*success-email-subject*> | The subject for the success email. For this example, follow these steps: <br><br>1. Enter the following text with a trailing space: **Success! Member added to test-members-ML:** <br><br>2. Select inside the **Subject** box, and select the dynamic content list option (lightning icon). <br><br>3. From the **Add member to list** section, select **Email Address**. <br><br>**Note**: If this output doesn't appear, next to the **Add member to list** section name, select **See more**. |
   | **Body** | Yes | <*success-email-body*> | The body content for the success email. For this example, follow these steps: <br><br>1. Enter the following text with a trailing space: **Member opt-in status:** <br><br>2. Select inside the **Body** box, and select the dynamic content list option (lightning icon). <br><br>3. From the **Add member to list** section, select **Status**. |

   When you finish, the action looks like the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-success.png" alt-text="Screenshot shows information for action named Send email on success." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-success.png":::

1. Save your workflow.

## Add an action to send failure email

The following steps add an action to send failure email when the workflow fails in adding the member to your mailing list.

1. In the **False** block for the **If add member succeeded** condition, [follow these general steps to add the **Office 365 Outlook** action named **Send an email**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. Rename the **Send an email** action with **Send email on failure**.

1. In the **Send email on failure** action, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **To** | Yes | <*recipient-email-address*> | The email recipient's email address. For testing purposes, use your own email address. |
   | **Subject** | Yes | <*failure-email-subject*> | The subject for the failure email. For this example, follow these steps: <br><br>1. Enter the following text with a trailing space: **Failed, member not added to test-members-ML:** <br><br>2. Select inside the **Subject** box, and select the dynamic content list option (lightning icon). <br><br>3. From the **Add member to list** section, select **Email Address**. <br><br>**Note**: If this output doesn't appear, next to the **Add member to list** section name, select **See more**. |
   | **Body** | Yes | <*failure-email-body*> | The body content for the failure email. <br><br>For this example, enter the following text: **Member might already exist. Check your MailChimp account.** |

   When you finish, the action looks like the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-failed.png" alt-text="Screenshot shows information for action named Send email on failure." lighbox="media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-failed.png":::

1. Save your workflow.

Your finished workflow looks similar to the following example:

:::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/workflow-done.png" alt-text="Screenshot shows example finished workflow." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/workflow-done.png":::

## Test your workflow

1. Send yourself an email request to join your mailing list. Wait for the request to appear in your inbox.

1. To manually start your workflow, on the designer toolbar, select **Run** > **Run**.

   If your email has a subject that matches the trigger's subject filter, your workflow sends you email to approve the subscription request.

1. In the approval email that you receive, select **Approve**.

1. If the subscriber's email address doesn't exist on your mailing list, your workflow adds that person's email address and sends you an email like the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/add-member-success.png" alt-text="Screenshot shows example email for successful subscription." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/add-member-success.png":::

1. If your workflow can't add the subscriber, you get an email like the following example:

   :::image type="content" source="media/tutorial-process-mailing-list-subscriptions-workflow/add-member-failure.png" alt-text="Screenshot shows example email for failed subscription." lightbox="media/tutorial-process-mailing-list-subscriptions-workflow/add-member-failure.png":::

  > [!TIP]
  >
  > If you don't get any emails, check your email's junk folder. Otherwise, 
  > if you're unsure that your logic app ran correctly, see 
  > [Troubleshoot your logic app](../logic-apps/logic-apps-diagnosing-failures.md).

Congratulations, you created and ran a logic app workflow that integrates information across Azure, Microsoft services, and other SaaS apps!

## Clean up resources

Your workflow continues running until you disable or delete the logic app resource. When you no longer need this sample, delete the resource group that contains your logic app and related resources.

Your workflow continues running until you disable or delete the logic app resource. When you no longer need this sample, delete the resource group that contains your logic app and related resources.

1. In the Azure portal search box, enter **resource groups**, and select **Resource groups**.

1. From the **Resource groups** list, select the resource group for this tutorial.

1. On the resource group menu, select **Overview**.

1. On the **Overview** page toolbar, select **Delete resource group**.

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

## Next steps

In this tutorial, you created a logic app workflow that handles approvals for mailing list requests. Now, learn how to build a logic app workflow that processes and stores email attachments by integrating Azure services, such as Azure Storage and Azure Functions.

> [!div class="nextstepaction"]
> [Process email attachments](../logic-apps/tutorial-process-email-attachments-workflow.md)
