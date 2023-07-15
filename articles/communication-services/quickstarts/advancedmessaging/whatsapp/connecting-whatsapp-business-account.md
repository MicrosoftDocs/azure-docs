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
zone_pivot_groups: acs-js-csharp-java-python
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

::: zone pivot="whatsapp-signup"
[!INCLUDE [Whatsapp Signup](./includes/register-whatsapp-account/whatsapp-signup.md)]
::: zone-end

::: zone pivot="create-new-metabusiness-account"
[!INCLUDE [Add Whatsapp Business Account](./includes/register-whatsapp-account/create-new-metabusiness-account.md)]
::: zone-end

## Creating a WhatsApp Business Profile

1. Now that you have created a Meta Business Account, you will need to create a WhatsApp Business profile. Fill out the required information.

:::image type="content" source="./media/register-whatsapp-account/whatsapp-business-account-details.png" alt-text="Screenshot that shows Providing WhatsApp Business account details.":::

1. Once you have completed the form, click **Next** to continue.

::: zone pivot="verify-phonenumber"
[!INCLUDE [Verify Whatsapp Business Phonenumber](./includes/register-whatsapp-account/verify-phonenumber.md)]
::: zone-end

## Viewing your WhatsApp Account in the Azure Communication Services Portal

You will see the account and status listed in the Azure portal along with the other WhatsApp Business accounts that you have connected to Azure Communication Services. Once approved, you can use the WhatsApp Business account to send and receive messages. The status of your WhatsApp Business account is displayed in the Azure portal. Your business’s display name will be reviewed by Meta. You can learn more about this review process and how to update your business account’s display name in the article this article: [About WhatsApp Business display name](https://www.facebook.com/business/help/338047025165344).

When you no longer want to use the WhatsApp Business account with Azure Communication Services, you can select the account and click the **Disconnect** button. This will disconnect the account from Azure Communication Services but will not delete the account and the account can be re-connected later.

:::image type="content" source="./media/register-whatsapp-account/list-whatsapp-accounts.png" alt-text="Screenshot that shows Listing your WhatsApp accounts in the Azure portal.":::

## Next Steps

In this quickstart, you have learned how is registered with Azure Communication Services your WhatsApp Business Account, you are ready to send and receive messages.

> [!div class="nextstepaction"]
> [Get Started With AdvancedMessages](../../../quickstarts//advancedmessaging/whatsapp/get-started.md)

You might also want to see the following articles: 

-    [WhatsApp Business Help Center](https://www.facebook.com/business/help/524220081677109?id=2129163877102343)

-    [WhatsApp Business Display Name Policy](https://www.facebook.com/business/help/338047025165344)

-    [Business Verification](https://www.facebook.com/business/help/1095661473946872?id=180505742745347) 

-    [Add Additional Management Accounts](https://www.facebook.com/business/help/2169003770027706)
