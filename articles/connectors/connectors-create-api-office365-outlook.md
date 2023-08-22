---
title: Connect to Office 365 Outlook
description: Connect to Office 365 Outlook from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/23/2023
tags: connectors
---

# Connect to Office 365 Outlook from Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To automate tasks for your Office 365 Outlook account in workflows using Azure Logic Apps, you can add operations from the [Office 365 Outlook connector](/connectors/office365connector/) to your workflow. For example, your workflow can perform the following tasks:

* Get, send, and reply to email.
* Schedule meetings on your calendar.
* Add and edit contacts.

This guide shows how to add an Office 365 Outlook trigger or action to your workflow in Azure Logic Apps.

> [!NOTE]
>
> The Office 365 Outlook connector works only with a [work or school account](https://support.microsoft.com/office/what-account-to-use-with-office-and-you-need-one-914e6610-2763-47ac-ab36-602a81068235#bkmk_msavsworkschool), for example, @fabrikam.onmicrosoft.com.  
> If you have an @outlook.com or @hotmail.com account, use the [Outlook.com connector](../connectors/connectors-create-api-outlook.md). 
> To connect to Outlook with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts).

## Connector technical reference

For information about this connector's operations and any limits, based on the connector's Swagger file, see the [connector's reference page](/connectors/office365/).

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your Microsoft Office 365 account for Outlook where you sign in with a [work or school account](https://support.microsoft.com/office/what-account-to-use-with-office-and-you-need-one-914e6610-2763-47ac-ab36-602a81068235#bkmk_msavsworkschool).

  > [!NOTE]
  >
  > If you're using [Microsoft Azure operated by 21Vianet](https://portal.azure.cn), 
  > Azure Active Directory (Azure AD) authentication works only with an account for 
  > Microsoft Office 365 operated by 21Vianet (.cn), not .com accounts.

* The logic app workflow from where you want to access your Outlook account. To add an Office 365 Outlook trigger, you have to start with a blank workflow. To add an Office 365 Outlook action, your workflow can start with any trigger.

## Add an Office 365 Outlook trigger

Based on whether you have a Consumption or Standard logic app workflow, follow the corresponding steps:

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your blank logic app workflow in the designer.

1. [Follow these general steps to add the Office 365 Outlook trigger](logic-apps/create-workflow-with-trigger-or-action?tabs=consumption#add-trigger) that you want to your workflow.

   This example continues with the trigger named **When an upcoming event is starting soon**. This *polling* trigger regularly checks for any updated calendar event in your email account, based on the specified schedule.

1. If prompted, sign in to your Office 365 Outlook account, which creates a connection. To connect with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts).

   > [!NOTE]
   >
   > Your connection doesn't expire until revoked, even if you change your sign-in credentials. 
   > For more information, see [Configurable token lifetimes in Azure Active Directory](../active-directory/develop/configurable-token-lifetimes.md).

1. In the trigger information box, provide the required information, for example:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Calendar Id** | Yes | **Calendar** | The calendar to check |
   | **Interval** | Yes | **15** | The number of intervals |
   | **Frequency** | Yes | **Minute** | The unit of time |

   To add other available parameters, such as **Time zone**, open the **Add new parameter** list, and select the parameters that you want.

   ![Screenshot shows Azure portal, Consumption workflow, and trigger parameters.](./media/connectors-create-api-office365-outlook/calendar-settings-consumption.png)

1. Save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your blank logic app workflow in the designer.

1. [Follow these general steps to add the Office 365 Outlook trigger](logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-trigger) that you want to your workflow.

   This example continues with the trigger named **When an upcoming event is starting soon**. This *polling* trigger regularly checks for any updated calendar event in your email account, based on the specified schedule.

1. If prompted, sign in to your Office 365 Outlook account, which creates a connection. To connect with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts).

   > [!NOTE]
   >
   > Your connection doesn't expire until revoked, even if you change your sign-in credentials. 
   > For more information, see [Configurable token lifetimes in Azure Active Directory](../active-directory/develop/configurable-token-lifetimes.md).

1. In the trigger information box, provide the required information, for example:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Calendar Id** | Yes | **Calendar** | The calendar to check |
   | **Interval** | Yes | **15** | The number of intervals |
   | **Frequency** | Yes | **Minute** | The unit of time |

   To add other available parameters, such as **Time zone**, open the **Add new parameter** list, and select the parameters that you want.

   ![Screenshot shows Azure portal, Standard workflow, and trigger parameters.](./media/connectors-create-api-office365-outlook/calendar-settings-standard.png)

1. Save your workflow. On the designer toolbar, select **Save**.

---

Now add an action that runs after the trigger fires. For example, you can add the Twilio **Send message** action, which sends a text when a calendar event starts in 15 minutes.

## Add an action

An [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is an operation that's run by the workflow in your logic app. This example logic app creates a new contact in Office 365 Outlook. You can use the output from another trigger or action to create the contact. For example, suppose your logic app uses the Salesforce trigger, **When a record is created**. You can add the Office 365 Outlook **Create contact** action and use the outputs from the trigger to create the new contact.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app in the visual designer.

1. To add an action as the last step in your workflow, select **New step**.

   To add an action between steps, move your pointer over the arrow between those steps. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. In the search box, enter `office 365 outlook` as your filter. This example selects **Create contact**.

   ![Select the action to run in your logic app](./media/connectors-create-api-office365-outlook/office365-actions.png) 

1. If you don't have an active connection to your Outlook account, you're prompted to sign in and create that connection. To connect to Outlook with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts). Otherwise, provide the information for the action's properties.

   > [!NOTE]
   > Your connection doesn't expire until revoked, even if you change your sign-in credentials. 
   > For more information, see [Configurable token lifetimes in Azure Active Directory](../active-directory/develop/configurable-token-lifetimes.md).

   This example selects the contacts folder where the action creates the new contact, for example:

   ![Configure the action's properties](./media/connectors-create-api-office365-outlook/select-contacts-folder.png)

   To add other available action properties, select those properties from the **Add new parameter** list.

1. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

---

<a name="connect-using-other-accounts"></a>

## Connect using other accounts

If you try connecting to Outlook by using a different account than the one currently signed in to Azure, you might get [single sign-on (SSO)](../active-directory/manage-apps/what-is-single-sign-on.md) errors. This problem happens when you sign in to the Azure portal with one account, but use a different account to create the connection. The designer expects that you use the account that's signed in to the Azure portal. To resolve this problem, you have these options:

* Set up the other account with the **Contributor** role in your logic app's resource group.

  1. On your logic app's resource group menu, select **Access control (IAM)**. Set up the other account with the **Contributor** role. 
  
     For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

  1. After you set up this role, sign in to the Azure portal with the account that now has Contributor permissions. You can now use this account to create the connection to Outlook.

* Set up the other account so that your work or school account has "send as" permissions.

   If you have admin permissions, on the service account's mailbox, set up your work or school account with either **Send as** or **Send on behalf of** permissions. For more information, see [Give mailbox permissions to another user - Admin Help](/microsoft-365/admin/add-users/give-mailbox-permissions-to-another-user). You can then create the connection by using your work or school account. Now, in triggers or actions where you can specify the sender, you can use the service account's email address.

   For example, the **Send an email** action has an optional parameter, **From (Send as)**, which you can add to the action and use your service account's email address as the sender. To add this parameter, follow these steps:

   1. In the **Send an email** action, open the **Add a parameter** list, and select the **From (Send as)** parameter.

   1. After the parameter appears on the action, enter the service account's email address.

## Next steps

* [Managed connectors for Azure Logic Apps](managed.md)
* [Built-in connectors for Azure Logic Apps](built-in.md)