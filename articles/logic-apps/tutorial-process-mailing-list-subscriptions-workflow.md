---
title: Build approval-based automated workflows
description: Tutorial - Create an approval-based automated workflow that processes mailing list subscriptions by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: tutorial
ms.custom: mvc
ms.date: 09/30/2020
---

# Tutorial: Create automated approval-based workflows by using Azure Logic Apps

This tutorial shows how to build an example [logic app](../logic-apps/logic-apps-overview.md) that automates an approval-based workflow. Specifically, this example logic app processes subscription requests for a mailing list that's managed by the [MailChimp](https://mailchimp.com/) service. This logic app includes various steps, which start by monitoring an email account for requests, sends these requests for approval, checks whether or not the request gets approval, adds approved members to the mailing list, and confirms whether or not new members get added to the list.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a blank logic app.
> * Add a trigger that monitors emails for subscription requests.
> * Add an action that sends emails for approving or rejecting these requests.
> * Add a condition that checks the approval response.
> * Add an action that adds approved members to the mailing list.
> * Add a condition that checks whether these members successfully joined the list.
> * Add an action that sends emails confirming whether these members successfully joined the list.

When you're done, your logic app looks like this workflow at a high level:

![High-level finished logic app overview](./media/tutorial-process-mailing-list-subscriptions-workflow/tutorial-high-level-overview.png)

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A MailChimp account where you previously created a list named "test-members-ML" where your logic app can add email addresses for approved members. If you don't have an account, [sign up for a free account](https://login.mailchimp.com/signup/), and then learn [how to create a MailChimp list](https://us17.admin.mailchimp.com/lists/#).

* An email account from an email provider that's supported by Logic Apps, such as Office 365 Outlook, Outlook.com, or Gmail. For other providers, [review the connectors list here](/connectors/). This quickstart uses Office 365 Outlook with a work or school account. If you use a different email account, the general steps stay the same, but your UI might slightly differ.

* An email account in Office 365 Outlook or Outlook.com, which supports approval workflows. This tutorial uses Office 365 Outlook. If you use a different email account, the general steps stay the same, but your UI might appear slightly different.

## Create your logic app

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account credentials. On the Azure home page, select **Create a resource**.

1. On the Azure Marketplace menu, select **Integration** > **Logic App**.

   ![Screenshot that shows Azure Marketplace menu with "Integration" and "Logic App" selected.](./media/tutorial-process-mailing-list-subscriptions-workflow/create-new-logic-app-resource.png)

1. On the **Logic App** pane, provide the information described here about the logic app that you want to create.

   ![Screenshot that shows the Logic App creation pane and the info to provide for the new logic app.](./media/tutorial-process-mailing-list-subscriptions-workflow/create-logic-app-settings.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Subscription** | <*Azure-subscription-name*> | Your Azure subscription name. This example uses `Pay-As-You-Go`. |
   | **Resource group** | LA-MailingList-RG | The name for the [Azure resource group](../azure-resource-manager/management/overview.md), which is used to organize related resources. This example creates a new resource group named `LA-MailingList-RG`. |
   | **Name** | LA-MailingList | Your logic app's name, which can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`). This example uses `LA-MailingList`. |
   | **Location** | West US | TThe region where to store your logic app information. This example uses `West US`. |
   | **Log Analytics** | Off | Keep the **Off** setting for diagnostic logging. |
   ||||

1. When you're done, select **Review + create**. After Azure validates the information about your logic app, select **Create**.

1. After Azure deploys your app, select **Go to resource**.

   Azure opens the Logic Apps template selection pane, which shows an introduction video, commonly used triggers, and logic app template patterns.

1. Scroll down past the video and common triggers sections to the **Templates** section, and select **Blank Logic App**.

   ![Screenshot that shows the Logic Apps template selection pane with "Blank Logic App" selected.](./media/tutorial-process-mailing-list-subscriptions-workflow/select-logic-app-template.png)

Next, add an Outlook [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) that listens for incoming emails with subscription requests. Each logic app must start with a trigger, which fires when a specific event happens or when new data meets a specific condition. For more information, see [Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Add trigger to monitor emails

1. In the Logic Apps Designer search box, enter `when email arrives`, and select the trigger named **When a new email arrives**.

   * For Azure work or school accounts, select **Office 365 Outlook**.
   * For personal Microsoft accounts, select **Outlook.com**.

   This example continues by selecting Office 365 Outlook.

   ![Screenshot that shows the Logic Apps Designer search box that contains the "when email arrives" search term, and the "When a new email arrives" trigger appears selected.](./media/tutorial-process-mailing-list-subscriptions-workflow/add-trigger-new-email.png)

1. If you don't already have a connection, sign in and authenticate access to your email account when prompted.

   Azure Logic Apps creates a connection to your email account.

1. In the trigger, provide the criteria for checking new email.

   1. Specify the folder for checking emails, and keep the other properties set to their default values.

      ![Screenshot that shows the designer with the "When a new email arrives" action and "Folder" set to "Inbox".](./media/tutorial-process-mailing-list-subscriptions-workflow/add-trigger-set-up-email.png)

   1. Add the trigger's **Subject Filter** property so that you can filter emails based on the subject line. Open the **Add new parameter** list, and select **Subject Filter**.

      ![Screenshot that shows the opened "Add new parameter" list with "Subject Filter" selected.](./media/tutorial-process-mailing-list-subscriptions-workflow/add-trigger-add-properties.png)

      For more information about this trigger's properties, see the [Office 365 Outlook connector reference](/connectors/office365/) or the [Outlook.com connector reference](/connectors/outlook/).

   1. After the property appears in the trigger, enter this text: `subscribe-test-members-ML`

      ![Screenshot that shows the "Subject Filter" property with the text "subscribe-test-members-ML" entered.](./media/tutorial-process-mailing-list-subscriptions-workflow/add-trigger-subject-filter-property.png)

1. To hide the trigger's details for now, collapse the shape by clicking inside the shape's title bar.

   ![Screenshot that shows the collapsed trigger shape.](./media/tutorial-process-mailing-list-subscriptions-workflow/collapse-trigger-shape.png)

1. Save your logic app. On the designer toolbar, select **Save**.

Your logic app is now live but doesn't do anything other than check your incoming email. So, add an action that responds when the trigger fires.

## Send approval email

Now that you have a trigger, add an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) that sends an email to approve or reject the request.

1. In the Logic Apps Designer, under the **When a new email arrives** trigger, select **New step**.

1. Under **Choose an operation**, in the search box, enter `send approval`, and select the action named **Send approval email**.

   ![Screenshot that shows the "Choose an operation" list filtered by "approval" actions, and the "Send approval email" action selected.](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-send-approval-email.png)

1. Now enter the values for the specified properties shown and described here. leaving all the others at their default values. For more information about these properties, see the [Office 365 Outlook connector reference](/connectors/office365/) or the [Outlook.com connector reference](/connectors/outlook/).

   ![Screenshot that shows the "Send approval email" properties](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-approval-email-settings.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **To** | <*approval-email-address*> | The approver's email address. For testing purposes, you can use your own address. This example uses the fictional `sophiaowen@fabrikam.com` email address. |
   | **Subject** | `Approve member request for test-members-ML` | A descriptive email subject |
   | **User Options** | `Approve, Reject` | Make sure this property specifies the response options that the approver can select, which are **Approve** or **Reject** by default. |
   ||||

   > [!NOTE]
   > When you click inside some edit boxes, the dynamic content list appears, which you can ignore for now. 
   > This list shows the outputs from previous actions that are available for you to select as inputs to 
   > subsequent actions in your workflow.
 
1. Save your logic app.

Next, add a condition that checks the approver's selected response.

## Check approval response

1. Under the **Send approval email** action, select **New step**.

1. Under **Choose an operation**, select **Built-in**. In the search box, enter `condition`, and select the action named **Condition**.

   ![Screenshot that shows the "Choose an operation" search box with "Built-in" selected and "condition" as the search term, while the "Condition" action appears selected.](./media/tutorial-process-mailing-list-subscriptions-workflow/select-condition-action.png)

1. In the **Condition** title bar, select the **ellipses** (**...**) button, and then select **Rename**. Rename the condition with this description: `If request approved`

   ![Screenshot that shows the ellipses button selected with the "Settings" list opened and the "Rename" command selected.](./media/tutorial-process-mailing-list-subscriptions-workflow/rename-condition-description.png)

1. Build a condition that checks whether the approver selected **Approve**.

   1. On the condition's left side, click inside the **Choose a value** box.

   1. From the dynamic content list that appears, under **Send approval email**, select the **SelectedOption** property.

      ![Screenshot that shows the dynamic content list where in the "Send approval email" section, the "SelectedOption" output appears selected.](./media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-check-approval-response.png)

   1. In the middle comparison box, select the **is equal to** operator.

   1. On the condition's right side, in the **Choose a value** box, enter the text, `Approve`.

      When you're done, the condition looks like this example:

      ![Screenshot that shows the finished condition for the approved request example](./media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-check-approval-response-2.png)

1. Save your logic app.

Next, specify the action that your logic app performs when the reviewer approves the request. 

## Add member to MailChimp list

Now add an action that adds the approved member to your mailing list.

1. In the condition's **True** branch, select **Add an action**.

1. Under the **Choose an operation** search box, select **All**. In the search box, enter `mailchimp`, and select the action named **Add member to list**.

   ![Screenshot that shows the Select "Add member to list" action](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-mailchimp-add-member.png)

1. If you're prompted for access to your MailChimp account, sign in with your MailChimp credentials.

1. Provide information about this action as shown and described here:

   ![Provide information for "Add member to list"](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-mailchimp-add-member-settings.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **List Id** | Yes | `test-members-ML` | The name for your MailChimp mailing list. This example uses "test-members-ML". |
   | **Status** | Yes | `subscribed` | Select the subscription status for the new member. This example uses "subscribed". <p>For more information, see [Manage subscribers with the MailChimp API](https://developer.mailchimp.com/documentation/mailchimp/guides/manage-subscribers-with-the-mailchimp-api/). |
   | **Email Address** | Yes | <*new-member-email-address*> | From the dynamic content list, select **From** under **When a new mail arrives**, which passes in the email address for the new member. |
   ||||

   For more information about this action's properties, see the [MailChimp connector reference](/connectors/mailchimp/).

1. Save your logic app.

Next, add a condition so that you can check whether the new member successfully joined your mailing list. That way, your logic app notifies you whether this operation succeeds or fails.

## Check for success or failure

1. In the **True** branch, under the **Add member to list** action, select **Add an action**.

1. Under **Choose an operation**, select **Built-in**. In the search box, enter `condition` as your filter. From the actions list, select **Condition**.

1. Rename the condition with this description: `If add member succeeded`

1. Build a condition that checks whether the approved member succeeds or fails in joining your mailing list:

   1. In the condition, click inside the **Choose a value** box, which is on the condition's left side. From the dynamic content list, under **Add member to list**, select the **Status** property.

      For example, your condition looks like this example:

      ![Under "Add member to list", select "Status"](./media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-check-added-member.png)

   1. In the middle comparison box, select the **is equal to** operator.

   1. In the **Choose a value** box on the condition's right side, enter this text: `subscribed`

      When you're done, the condition looks like this example:

      ![Finished condition for Subscribed example](./media/tutorial-process-mailing-list-subscriptions-workflow/build-condition-check-added-member-2.png)

Next, set up the emails to send when the approved member succeeds or fails in joining your mailing list.

## Send email if member added

1. Under the **If add member succeeded** condition, in the **True** branch, select **Add an action**.

   ![In "True" branch, select "Add an action"](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-success.png)

1. Under **Choose an operation**, in the search box, enter `outlook send email` as your filter, and select the **Send an email** action.

   ![Add "Send an email" action](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-success-2.png)

1. Rename the action with this description: `Send email on success`

1. Provide information for this action as shown and described:

   ![Provide information for success email](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-success-settings.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **To** | Yes | <*your-email-address*> | The email address for where to send the success email. For testing purposes, you can use your own email address. |
   | **Subject** | Yes | <*subject-for-success-email*> | The subject for the success email. For this tutorial, enter this text: <p>`Success! Member added to "test-members-ML": ` <p>From the dynamic content list, under **Add member to list**, select the **Email Address** property. |
   | **Body** | Yes | <*body-for-success-email*> | The body content for the success email. For this tutorial, enter this text: <p>`New member has joined "test-members-ML":` <p>From the dynamic content list, select the **Email Address** property. <p>On the next row, enter this text: `Member opt-in status: ` <p> From the dynamic content list, under **Add member to list**, select the **Status** property. |
   |||||

1. Save your logic app.

## Send email if member not added

1. Under the **If add member succeeded** condition, in the **False** branch, select **Add an action**.

   ![In the "False" branch, select "Add an action"](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-failed.png)

1. Under **Choose an operation**, in the search box, enter `outlook send email` as your filter, and select the **Send an email** action.

   ![Add action for "Send an email"](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-failed-2.png)

1. Rename the action with this description: `Send email on failure`

1. Provide information about this action as shown and described here:

   ![Provide information for failed email](./media/tutorial-process-mailing-list-subscriptions-workflow/add-action-email-failed-settings.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **To** | Yes | <*your-email-address*> | The email address for where to send the failure email. For testing purposes, you can use your own email address. |
   | **Subject** | Yes | <*subject-for-failure-email*> | The subject for the failure email. For this tutorial, enter this text: <p>`Failed, member not added to "test-members-ML": ` <p>From the dynamic content list, under **Add member to list**, select the **Email Address** property. |
   | **Body** | Yes | <*body-for-failure-email*> | The body content for the failure email. For this tutorial, enter this text: <p>`Member might already exist. Check your MailChimp account.` |
   |||||

1. Save your logic app. 

Next, test your logic app, which now looks similar to this example:

![Example finished logic app workflow](./media/tutorial-process-mailing-list-subscriptions-workflow/tutorial-high-level-completed.png)

## Run your logic app

1. Send yourself an email request to join your mailing list. Wait for the request to appear in your inbox.

1. To manually start your logic app, on the designer toolbar bar, select **Run**. 

   If your email has a subject that matches the trigger's subject filter, your logic app sends you email to approve the subscription request.

1. In the approval email, select **Approve**.

1. If the subscriber's email address doesn't exist on your mailing list, your logic app adds that person's email address and sends you an email like this example:

   ![Example email - successful subscription](./media/tutorial-process-mailing-list-subscriptions-workflow/add-member-mailing-list-success.png)

   If your logic app can't add the subscriber, you get an email like this example:

   ![Example email - failed subscription](./media/tutorial-process-mailing-list-subscriptions-workflow/add-member-mailing-list-failed.png)

   If you don't get any emails, check your email's junk folder. Your email junk filter might redirect these kinds of mails. Otherwise, if you're unsure that your logic app ran correctly, 
   see [Troubleshoot your logic app](../logic-apps/logic-apps-diagnosing-failures.md).

Congratulations, you've now created and run a logic app that integrates information across Azure, Microsoft services, and other SaaS apps.

## Clean up resources

When you no longer need the sample logic app, delete the resource group that contains your logic app and related resources. 

1. On the main Azure menu, go to **Resource groups**, and select the resource group for your logic app.

1. On the resource group menu, select **Overview** > **Delete resource group**. 

   !["Overview" > "Delete resource group"](./media/tutorial-process-mailing-list-subscriptions-workflow/delete-resource-group.png)

1. Enter the resource group name as confirmation, and select **Delete**.

## Next steps

In this tutorial, you created a logic app that manages approvals for mailing list requests. Now, learn how to build a logic app that processes and stores email attachments by integrating Azure services, such as Azure Storage and Azure Functions.

> [!div class="nextstepaction"]
> [Process email attachments](../logic-apps/tutorial-process-email-attachments-workflow.md)
