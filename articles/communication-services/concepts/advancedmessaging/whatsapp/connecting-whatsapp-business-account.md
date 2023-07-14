---
title: Register WhatsApp Business Account
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Service WhatsApp Business Accounts concepts.
author: darmour
manager: sundraman
services: azure-communication-services
ms.author: darmour
ms.date: 06/26/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: advancedmessaging
---

# Quickstart: Register WhatsApp Business Account

Getting started with the Azure Communication Services Advanced Message SDK which extends messaging to users on WhatsApp. This allows your organization to send and receive messages with WhatsApp users using a WhatsApp Business Account.The Message SDK extends your communications to interact with the large global WhatsApp community for common scenarios:

-   Receiving inquiries from your customers for product feedback or support, price quotes, and rescheduling appointments.
-   Sending your customers notifications like appointment reminders, product discounts, transaction receipts, and one-time passcodes.

## Prerequisites

1.  [Facebook login account](https://www.facebook.com/index.php)
2.  [Get Azure Communication Service Phonenumber](https://learn.microsoft.com/azure/communication-services/quickstarts/telephony/get-phone-number?tabs=windows&pivots=platform-azp)
        -   With the ability to send and receive SMS messages
        -   With an active Event subscription (SMS received and SMS delivery reports). [Learn how to handle SMS events.](https://learn.microsoft.com/azure/communication-services/quickstarts/telephony/get-phone-number?tabs=windows&pivots=platform-azp)
        -   With an Event Grid viewer. [Learn how to deploy an Event Grid viewer](https://learn.microsoft.com/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/).
        -   That is not associated with a WhatsApp Business Account
3.  Or [Bring Your Own Phoneumber]
        -   With the ability to receive SMS and calls
        -   That is not associated with a WhatsApp Business Account
4.  Your company details to be used in your WhatsApp Business Account including:
    -  Company Name: How you want your company identified to your WhatsApp users
    -  Website: A web page that verifies your business
    -  Business email: You can use the email associated with your Facebook login.
    -  Business phone number: The phone number that customers can use to contact you. You can use the phone number described in the step above.
5.  [Active WhatsApp Business Account](https://www.facebook.com/business/tools/meta-business-suite)

## Signup Overview

To get started, you will connect a new or existing WhatsApp Business Account with your Azure Communication Services resource in the Azure portal. The process is initiated in the Azure portal. This will open a new browser window for you to complete a signup process using Facebook’s signup wizard. After signing into the wizard with your Meta Business Suite credentials, you will have the option to create a new WhatsApp Business Account or connect to an existing account.

Once you have created the new account or linked an existing account, you will need to supply and verify a phone number for the account.

### WhatsApp Business account sign-up.

1. On the left navigation bar, click on the **WhatsApp** channel under the **Channels** header. To add a new WhatsApp Business Account, click on the **Connect** button.

:::image type="content" source="../media/channelsblade.png" alt-text="Screenshot that shows Azure Portal viewing the Communication Services Channels Blade.":::

2. Select WhatsApp as the channel and click the **Connect** button.

:::image type="content" source="../media/connect-to-whatsapp-channel.png" alt-text="Screenshot that shows Connect to WhatsApp Channel.":::

3. Before you connect to WhatsApp you will need to prepare the [prerequisites](#prerequisites) and acknowledge the *Data Transfer and Independent Terms of Service* by checking the box at the bottom of the page.

:::image type="content" source="../media/whatsApp-prerequisites.png" alt-text="Screenshot that shows Connect to WhatsApp prerequisites.":::

3. Click the **Next** button to continue.

4. You will select the phone number which you plan to use on the next screen. You can use an Azure Communication Services phone number which is enabled to receive SMS text messages, or you can bring your own phone number.

:::image type="content" source="../media/phonenumber-selection.png" alt-text="Screenshot that shows Connect to WhatsApp phone number selection.":::

5. Click the **Next** button to continue.

6. This screen you will either see the Azure Communication Services phone number or you will enter the phone number which you will verify as part of the WhatsApp Business account signup.

:::image type="content" source="../media/whatsapp-login-with-facebook.png" alt-text="Screenshot that shows Connect to WhatsApp login with Facebook.":::

7. Clicking on the **Login with Faceboook** button will open a new window and ask you to sign into Facebook.

:::image type="content" source="../media/facebook-login.png" alt-text="Screenshot that shows Facebook login screen.":::

8. The next screen notifies you that the Azure Communication Services app will receive your name and profile picture. This gives permission to Azure Communication Service APIs to manage your WhatsApp Business Account.

:::image type="content" source="../media/facebook-authorization.png" alt-text="Screenshot that shows Facebook authorization page.":::

9. After signing in you will see the Getting Started screen.

:::image type="content" source="../media/registering-whatsapp-account.png" alt-text="Screenshot that shows Getting started with registering WhatsApp Business account with Azure.":::

10. Click the **Get Started** button. The next screen summarizes the permissions you will be granting Azure Communication Services to manage your WhatsApp Business Account.

:::image type="content" source="../media/permissions-to-azure.png" alt-text="Screenshot that shows Azure permissions for your WhatsApp Business account.":::

11. Click the **Continue** button to proceed.

## Creating a new Meta Business Account

In Step 1 of WhatsApp Business Account signup, select **Create a Business Account** or you can optionally select an existing account. Then click on the **Continue** button.

*Select Existing*

:::image type="content" source="../media/select-existing-whatsapp-account.png" alt-text="Screenshot that shows Creating new of selecting existing Meta Business Account.":::

*Or Create a Business Account*

:::image type="content" source="../media/creating-new-business-account.png" alt-text="Screenshot that shows Filling out the details of your Meta Business account.":::

On the next screen provide the information required for your business account then click the **Next** button.

Next you are asked to create a WhatsApp Business Account or select an existing one.

:::image type="content" source="../media/creating-new-business-account.png" alt-text="Screenshot that shows Creating or selecting WhatsApp Business account.":::

Likewise, you need to create a new WhatsApp Business profile or select an existing one.

:::image type="content" source="../media/whatsapp-business-profile.png" alt-text="Screenshot that shows Creating or selecting WhatsApp Business profile.":::

Click the **Next** button to continue.

## Creating a WhatsApp Business Profile

Now that you have created a Meta Business Account, you will need to create a WhatsApp Business profile. Fill out the required information.

:::image type="content" source="../media/whatsapp-business-account-details.png" alt-text="Screenshot that shows Providing WhatsApp Business account details.":::

Once you have completed the form, click **Next** to continue.

## Verify Your WhatsApp Business Number

On the next steps, you will need to add a phone umber to your WhatsApp for Business account. You can use a phone number that you purchased from Azure Communication Services or a number you have purchased elsewhere. This phone number cannot be used by another WhatsApp account. If you will be using an Azure Communication Services phone number, make sure that you have completed the [prerequisites](#prerequisites) listed above and use the **Text message** option to verify the number.

:::image type="content" source="../media/adding-phonenumber-for-whatsapp.png" alt-text="Screenshot that shows Adding a phone number to your WhatsApp Business account.":::

Click the **Next** button to continue.

When you receive the verification code on your phone number, enter it into the setup page.

:::image type="content" source="../media/verify-phonenumber.png" alt-text="Screenshot that shows Verifying your phone number.":::

After providing the verification code, click on the **Next** button. This will complete the process.

## Viewing your WhatsApp Account in the Azure Communication Services Portal

You will see the account and status listed in the Azure portal along with the other WhatsApp Business accounts that you have connected to Azure Communication Services. Once approved, you can use the WhatsApp Business account to send and receive messages. The status of your WhatsApp Business account is displayed in the Azure portal. Your business’s display name will be reviewed by Meta. You can learn more about this review process and how to update your business account’s display name in the article this article: [About WhatsApp Business display name](https://www.facebook.com/business/help/338047025165344).

When you no longer want to use the WhatsApp Business account with Azure Communication Services, you can select the account and click the **Disconnect** button. This will disconnect the account from Azure Communication Services but will not delete the account and the account can be re-connected later.

:::image type="content" source="../media/list-whatsapp-accounts.png" alt-text="Screenshot that shows Listing your WhatsApp accounts in the Azure portal.":::

## Next Steps

In this quickstart, you have learned how is registered with Azure Communication Services your WhatsApp Business Account, you are ready to send and receive messages.

> [!div class="nextstepaction"]
> [Get Started With AdvancedMessages](../../../quickstarts//advancedmessaging/whatsapp/get-started.md)

You might also want to see the following articles: 

-    [WhatsApp Business Help Center](https://www.facebook.com/business/help/524220081677109?id=2129163877102343)

-    [WhatsApp Business Display Name Policy](https://www.facebook.com/business/help/338047025165344)

-    [Business Verification](https://www.facebook.com/business/help/1095661473946872?id=180505742745347) 

-    [Add Additional Management Accounts](https://www.facebook.com/business/help/2169003770027706)
