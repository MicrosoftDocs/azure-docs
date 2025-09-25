---
title: Connect to Office 365 Outlook from Workflows
description: Learn how to automate tasks in Office 365 Outlook by using workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 06/19/2025
---

# Connect to Office 365 Outlook from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This guide shows how to add an Office 365 Outlook trigger or action to your workflow in Azure Logic Apps. You can automate tasks for your Office 365 Outlook account by adding operations from the [Office 365 Outlook connector](/connectors/office365connector/).

For example, your workflow can perform the following tasks:

* Get, send, and reply to email.
* Schedule meetings on your calendar.
* Add and edit contacts.

> [!NOTE]
>
> The Office 365 Outlook connector works only with a [work or school account](https://support.microsoft.com/office/what-account-to-use-with-office-and-you-need-one-914e6610-2763-47ac-ab36-602a81068235#bkmk_msavsworkschool), for example, @fabrikam.onmicrosoft.com.
> If you have an @outlook.com or @hotmail.com account, use the [Outlook.com connector](../connectors/connectors-create-api-outlook.md). 
> To connect to Outlook with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts).

## Connector technical reference

For information about this connector's operations and any limits, see the [connector's reference page](/connectors/office365/).

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your Microsoft Office 365 account for Outlook where you sign in with a [work or school account](https://support.microsoft.com/office/what-account-to-use-with-office-and-you-need-one-914e6610-2763-47ac-ab36-602a81068235#bkmk_msavsworkschool).

  > [!NOTE]
  >
  > If you're using [Microsoft Azure operated by 21Vianet](https://portal.azure.cn), 
  > Microsoft Entra authentication works only with an account for 
  > Microsoft Office 365 operated by 21Vianet (.cn), not .com accounts.

* The logic app resource with the workflow from where you want to access your Outlook account.

  To start your workflow with an **Office 365 Outlook** trigger, you need to have a blank workflow.

  To use an **Office 365 Outlook** action, your workflow can start with any trigger that best fits your scenario.

  If you don't have a logic app resource and workflow, see the following articles:
  
  * [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)
  * [Create an example Standard logic app workflow](../logic-apps/create-single-tenant-workflows-azure-portal.md)

## Add an Office 365 Outlook trigger

Based on whether you have a Consumption or Standard logic app workflow, follow the corresponding steps:

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the sidebar menu, under **Development Tools**, select the designer to open your blank workflow.

1. Add the **Office 365 Outlook** trigger that suits your scenario by following the [general steps to add a trigger to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

   This example continues with the trigger named **When an upcoming event is starting soon**. This *polling* trigger regularly checks for any updated calendar event in your email account, based on the specified schedule.

1. If prompted, sign in to your Office 365 Outlook account, which creates a connection. To connect with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts).

   > [!NOTE]
   >
   > Your connection doesn't expire until revoked, even if you change your sign-in credentials. 
   > For more information, see [Configurable token lifetimes in Microsoft Entra ID](../active-directory/develop/configurable-token-lifetimes.md).

1. In the trigger information box, provide the required information, for example:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Calendar Id** | Yes | **Calendar** | The calendar to check |
   | **Interval** | Yes | **15** | The number of intervals |
   | **Frequency** | Yes | **Minute** | The unit of time |

   You can add any other available parameters, such as **Time zone**, from the **Advanced parameters** list.

   :::image type="content" source="media/connectors-create-api-office365-outlook/calendar-settings-consumption.png" alt-text="Screenshot showing the Consumption workflow trigger parameters." lightbox="media/connectors-create-api-office365-outlook/calendar-settings-consumption.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar menu, under **Workflows**, select **Workflows**, and then select your blank workflow.

1. On the workflow sidebar menu, under **Tools**, select the designer to open the workflow.


1. Add the **Office 365 Outlook** trigger that best suits your scenario by following the [general steps to add a trigger](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   This example continues with the trigger named **When an upcoming event is starting soon**. This *polling* trigger regularly checks for any updated calendar event in your email account, based on the specified schedule.

1. If prompted, sign in to your Office 365 Outlook account, which creates a connection. To connect with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts).

   > [!NOTE]
   >
   > Your connection doesn't expire until revoked, even if you change your sign-in credentials. 
   > For more information, see [Configurable token lifetimes in Microsoft Entra ID](../active-directory/develop/configurable-token-lifetimes.md).

1. In the trigger information box, provide the required information, for example:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Calendar Id** | Yes | **Calendar** | The calendar to check |
   | **Interval** | Yes | **15** | The number of intervals |
   | **Frequency** | Yes | **Minute** | The unit of time |

   You can add any other available parameters, such as **Time zone**, from the **Advanced parameters** list.

   :::image type="content" source="media/connectors-create-api-office365-outlook/calendar-settings-standard.png" alt-text="Screenshot showing the Standard workflow trigger parameters." lightbox="media/connectors-create-api-office365-outlook/calendar-settings-standard.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

---

You can now add any other actions that your workflow requires. For example, you can add the Twilio **Send message** action, which sends a text when a calendar event starts in 15 minutes.

## Add an Office 365 Outlook action

Based on whether you have a Consumption or Standard logic app workflow, follow the corresponding steps:

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow in the designer.

   This example continues with the Office 365 Outlook trigger named **When a new email arrives**.

1. Add the **Office 365 Outlook** action that best suits your scenario by following the [general steps to add an action to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

   This example continues with the **Office 365 Outlook** action named **Create contact**.

   This operation creates a new contact in Office 365 Outlook. You can use the output from a previous operation in the workflow to create the contact.

1. If prompted, sign in to your Office 365 Outlook account, which creates a connection. To connect with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts).

   > [!NOTE]
   >
   > Your connection doesn't expire until revoked, even if you change your sign-in credentials. 
   > For more information, see [Configurable token lifetimes in Microsoft Entra ID](../active-directory/develop/configurable-token-lifetimes.md).

1. In the trigger information box, provide the required information, for example:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Folder Id** | Yes | **Contacts** | The folder where the action creates the new contact |
   | **Given name** | Yes | <*contact-name*> | The name to give the contact |
   | **Home phones** | Yes | <*home-phone-number*> | The home phone number for the contact |

   This example selects the **Contacts** folder where the action creates the new contact and uses trigger outputs for the remaining parameter values:

   :::image type="content" source="media/connectors-create-api-office365-outlook/create-contact-consumption.png" alt-text="Screenshot showing the Consumption workflow action parameters." lightbox="media/connectors-create-api-office365-outlook/create-contact-consumption.png":::

   You can add any other available parameters from the **Advanced parameters** list.

1. Save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow in the designer.

   This example continues with the Office 365 Outlook trigger named **When a new email arrives**.

1. Add an **Office 365 Outlook** action to your workflow by following the [general steps to add an action](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

   This example continues with the **Office 365 Outlook** action named **Create contact**. This operation creates a new contact in Office 365 Outlook. You can use the output from a previous operation in the workflow to create the contact.

1. If prompted, sign in to your Office 365 Outlook account, which creates a connection. To connect with a different user account, such as a service account, see [Connect using other accounts](#connect-using-other-accounts).

   > [!NOTE]
   >
   > Your connection doesn't expire until revoked, even if you change your sign-in credentials. 
   > For more information, see [Configurable token lifetimes in Microsoft Entra ID](../active-directory/develop/configurable-token-lifetimes.md).

1. In the trigger information box, provide the required information, for example:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Folder Id** | Yes | **Contacts** | The folder where the action creates the new contact |
   | **Given name** | Yes | <*contact-name*> | The name to give the contact |
   | **Home phones** | Yes | <*home-phone-number*> | The home phone number for the contact |

   This example selects the **Contacts** folder where the action creates the new contact and uses trigger outputs for the remaining parameter values:

   :::image type="content" source="media/connectors-create-api-office365-outlook/create-contact-standard.png" alt-text="Screenshot showing the Standard workflow action parameters." lightbox="media/connectors-create-api-office365-outlook/create-contact-standard.png":::

   You can add any other available parameters from the **Advanced parameters** list.

1. Save your workflow. On the designer toolbar, select **Save**.

---

<a name="connect-using-other-accounts"></a>

## Connect using other accounts

If you try connecting to Outlook by using a different account than the one currently signed in to Azure, you might get [single sign-on (SSO)](../active-directory/manage-apps/what-is-single-sign-on.md) errors. This problem happens when you sign in to the Azure portal with one account, but use a different account to create the connection. The designer expects that you use the account that's signed in to the Azure portal. To resolve this problem, you have these options:

* Set up the other account with the **Contributor** role in your logic app's resource group.

  1. In the Azure portal, open your logic app's resource group.

  1. On the resource group menu, select **Access control (IAM)**.

  1. Assign the **Contributor** role to the other account.
  
     For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

  1. After you set up this role, sign in to the Azure portal with the account that now has Contributor permissions. You can now use this account to create the connection to Outlook.

* Set up the other account so that your work or school account has **send as** permissions.

   If you have admin permissions, on the service account's mailbox, set up your work or school account with either **Send as** or **Send on behalf of** permissions. For more information, see [Give mailbox permissions to another user - Admin Help](/microsoft-365/admin/add-users/give-mailbox-permissions-to-another-user). You can then create the connection by using your work or school account. Now, in triggers or actions where you can specify the sender, you can use the service account's email address.

   For example, the **Send an email** action has an optional parameter, **From (Send as)**, which you can add to the action and use your service account's email address as the sender. To add this parameter, follow these steps:

   1. In the **Send an email** action, from the **Advanced parameters** list, select the **From (Send as)** parameter.

   1. Enter the service account's email address.

## Related content

* [Managed connectors for Azure Logic Apps](managed.md)
* [Built-in connectors for Azure Logic Apps](built-in.md)
