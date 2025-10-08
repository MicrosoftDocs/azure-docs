---
title: Prerequisites to Configure WhatsApp as a Channel in Microsoft Copilot Studio
titleSuffix: An Azure Communication Services article
description: Prerequisites to Configure WhatsApp as a Channel in Microsoft Copilot Studio.
author: anniewang
manager: darmour
services: azure-communication-services
ms.author: anniewang
ms.date: 06/18/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: advanced-messaging
---

# Prerequisites to Configure WhatsApp as a Channel in Microsoft Copilot Studio

Azure Communication Services Advanced Messaging SDK enables AI agents in Microsoft Copilot Studio to send and receive WhatsApp messages to users. Each AI agents are linked to a unique WhatsApp Business phone number.

## Overview

This article covers the prerequisites to configuring WhatsApp as a Channel in Microsoft Copilot Studio.

1. Create an Azure Communication Services resource in Azure portal.
2. Get a phone number that can receive SMS.
3. Setup and Deploy Event Grid Viewer
4. Setup Event subscription for SMS received.
5. Connect WhatsApp business account as a channel in Azure Communication Services Resource

The following video demonstrates this process.
> [!VIDEO https://learn-video.azurefd.net/vod/player?id=0a095ceb-4138-4a56-930c-444f7984e676]

## Prerequisites

- [Facebook account](https://www.facebook.com/)
- [Active Meta Business account](https://www.facebook.com/business/tools/meta-business-suite)
- An Azure account with an active subscription where you have the role of an owner. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Create an Azure Communication Services resource in Azure portal

Follow the instructions in [Create an Azure Communication Services resource using Azure portal](../../../quickstarts/create-communication-resource.md) section.

When following those instructions, here are helpful tips:

- Use the following image as an example of how you can fill in your project details and instance details to create your resource.

    :::image type="content" source="./media/create-acs-resource.png" lightbox="./media/create-acs-resource.png" alt-text="Screenshot that shows populated fields to create an Azure Communication Services Resource in the Azure portal.":::

- Assigning tags to your resource is optional.
- Once your resource is deployed, continue with the below instructions.

## Get a phone number

You can [provision a SMS enabled phone number from Azure Communication Services](../../../quickstarts/telephony/get-phone-number.md)
or bring your own phone number.

Make sure the phone number has the following capabilities:
- Able to receive SMS so your phone number can be verified by Meta
- Phone number isn't already associated with a WhatsApp Business Account

If you're using an Azure Communication Services phone number, continue to follow the [subsequential steps](#setup-and-deploy-event-grid-viewer). 

If you're bringing your own phone number, jump to next [section](#connect-whatsapp-business-account-as-a-channel-in-azure-communication-services-resource). 

### Setup and Deploy Event Grid Viewer

The following steps are only needed if you chose to use an Azure Communication Services phone number with SMS enabled. The Event Grid Viewer displays notification information for events it's subscribed to.

1. Click on the following button to launch a custom template for the Azure portal instance that you're logged into to set up the Event Grid Viewer.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmain%2Fazuredeploy.json" target="_blank"><img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true" alt="Button to deploy Event Grid Viewer"/></a>
    
2. Fill in the required fields. Because the site name creates a DNS entry, it needs to be globally unique. We recommend that you include your alias in the name for this step. Here are suggestions for filling out the deployment details:
    - `Subscription` - Select the subscription that contains your Azure Communication Services resource.
    - `Resource Group` - Select the resource group that contains your Azure Communication Services resource.
    - `Region` - Select the resource group that contains your Azure Communication Services resource.
    - `Site Name` - Create a name that is globally unique. This site name is used to create a domain to connect to your Event Grid Viewer.
    - `Hosting Plan Name` - Create any name to identify your hosting plan.
    - `Sku` - Use the SKU F1 for development and testing purposes. If you encounter validation errors creating your Event Grid Viewer that say there's no more capacity for the F1 plan, try selecting a different region. For more information about SKUs, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/).

      :::image type="content" source="./media/custom-deployment.png" lightbox="./media/custom-deployment.png" alt-text="Screenshot that shows Custom deployment of Event Grid Viewer web app and properties you need to provide to successfully deploy.":::

3. Then select **Review + Create**.
4. After the deployment completes, select **Go to resource group**.

   :::image type="content" source="./media/event-grid-viewer-deployment.png" lightbox="./media/event-grid-viewer-deployment.png" alt-text="Screenshot that shows deployment complete of the Event Grid Viewer web app.":::

5. Select on your Event Grid Viewer.

    :::image type="content" source="./media/resource-group.png" lightbox="./media/resource-group.png" alt-text="Screenshot that shows the Event Grid Viewer web app in the resource group.":::

6. On the resource overview page, select on the copy button next to the **Default Domain** property.

    :::image type="content" source="./media/event-grid-viewer-web-app.png" lightbox="./media/event-grid-viewer-web-app.png" alt-text="Screenshot that shows URL of Event Grid Viewer web app.":::

7. Launch that site in your browser and keep it running so you can receive the verification code when you're [connecting your WhatsApp business account to Azure Communication Services resource](#connect-whatsapp-business-account-as-a-channel-in-azure-communication-services-resource). The Event Grid Viewer should look like this.

    :::image type="content" source="./media/event-grid-viewer-site.png" lightbox="./media/event-grid-viewer-site.png" alt-text="Screenshot that shows the Event Grid Viewer web app.":::


### Subscribe to SMS received event

Getting the verification code is required to link your WhatsApp business account to Azure Communication Services resource. Follow these instructions to have the [Azure Event Grid subscribe to the SMS Received event](/azure/communication-services/quickstarts/sms/handle-sms-events#subscribe-to-sms-events-by-using-web-hooks).

When following those instructions, here are helpful tips:

- When filling in the details for the new event subscription.
    - `Name`: Enter a descriptive name for the event subscription. 
    - `System Topic Name`: Enter a unique name, unless this name is already prefilled with a topic from your subscription.
    - `Filter to Event Types`: Select **SMS Received**. No need to select SMS Delivery Report Received
    - `Endpoint Type`: Select **Web Hook**
    - `Endpoint`: Append `/api/updates` to the URL of the Event Grid Viewer (step 6 of [Set up and Deploy Event Grid Viewer](#setup-and-deploy-event-grid-viewer)). It should be something like `https://{{site-name}}.azurewebsites.net/api/updates`

    :::image type="content" source="./media/event-subscription-details.png" lightbox="./media/event-subscription-details.png" alt-text="Screenshot that shows the details to create an event subscription for SMS Received event type.":::

## Connect WhatsApp business account as a channel in Azure Communication Services Resource

1. With your newly created Azure Communication Services resource, on the left navigation bar, select on the **Advance Messaging** and then select **Channels**. To add a new WhatsApp Business Account, select on the **Connect** button.

    :::image type="content" source="./media/channels-blade.png" lightbox="./media/channels-blade.png" alt-text="Screenshot that shows Azure portal viewing the Communication Services Channels on the left panel.":::

2. Select WhatsApp as the channel and select the **Connect** button.

    :::image type="content" source="./media/connect-to-whatsapp-channel.png" lightbox="./media/connect-to-whatsapp-channel.png" alt-text="Screenshot that shows Connect to WhatsApp Channel.":::

3. Acknowledge the *Data Transfer and Independent Terms of Service*.

    :::image type="content" source="./media/whatsapp-prerequisites.png" lightbox="./media/whatsapp-prerequisites.png" alt-text="Screenshot that shows Connect to WhatsApp prerequisites.":::

4. Select the **Next** button to continue
5. Select the SMS enabled phone number you wish to use to connect to your WhatsApp Business Account. This can be either the [Azure Communication Services phone number](#get-a-phone-number) you previously provisioned or bring your own phone number.

    :::image type="content" source="./media/phone-number-selection.png" lightbox="./media/phone-number-selection.png" alt-text="Screenshot that shows Connect to WhatsApp phone number selection.":::

6. Select the **Next** button.
7. Select the **Login with Facebook** button to link your WhatsApp business account.

    :::image type="content" source="./media/whatsapp-login-with-facebook.png" lightbox="./media/whatsapp-login-with-facebook.png" alt-text="Screenshot that shows Connect to WhatsApp sign-in with Facebook.":::

8. A new Facebook Login page pops up as a new window. Provide your login.

    :::image type="content" source="./media/facebook-login.png" lightbox="./media/facebook-login.png" alt-text="Screenshot that shows Facebook Sign-In screen.":::

9. The next screen notifies you that the Azure Communication Services app will receive your name and profile picture. It gives permission to Azure Communication Services APIs to manage your WhatsApp Business Account. Select **Continue**. 

    Note that from here on out, the experience is managed by Facebook and not Azure so the screens are subject to change. 

    :::image type="content" source="./media/facebook-authorization.png" lightbox="./media/facebook-authorization.png" alt-text="Screenshot that shows Facebook authorization page.":::

10. After signing in, the next screen summarizes the permissions, you'll be granting Azure Communication Services to manage your WhatsApp Business Account. Select the **Get Started** button.

    :::image type="content" source="./media/permissions-to-azure.png" lightbox="./media/permissions-to-azure.png" alt-text="Screenshot that shows Azure permissions for your WhatsApp Business account.":::

11. Now that the WhatsApp Business Account is signed into, select or create the existing **Business portfolio**. Then select the **Next** button.

    :::image type="content" source="./media/select-existing-business-portfolio.png" lightbox="./media/select-existing-business-portfolio.png" alt-text="Screenshot that shows selecting existing Meta Business portfolio.":::

12. Select or create a WhatsApp Business Account.

    :::image type="content" source="./media/create-whatsapp-business-account.png" lightbox="./media/create-whatsapp-business-account.png" alt-text="Screenshot that shows Creating or selecting WhatsApp Business account.":::

13. Select or create a WhatsApp Business Profile. Fill out the required information.

    :::image type="content" source="./media/create-whatsapp-business-profile.png" lightbox="./media/create-whatsapp-business-profile.png" alt-text="Screenshot that shows Creating or selecting WhatsApp Business profile.":::

    :::image type="content" source="./media/whatsapp-business-profile-details.png" lightbox="./media/whatsapp-business-profile-details.png" alt-text="Screenshot that shows details need to create a WhatsApp Business profile.":::

14. The phone number you provide will be linked to your WhatsApp Business Account and can't be used by another WhatsApp Business account.

    Use the Azure Communication Services phone number you provisioned previously or bring your own phone number.

    If the phone number you're bringing is:
    - Under a solution provider other than Azure Communication Services, follow these instructions to [migrate your phone number to Azure Communication Services](https://developers.facebook.com/docs/whatsapp/solution-providers/support/migrating-phone-numbers-among-solution-partners-via-embedded-signup/). Create a [support ticket](https://azure.microsoft.com/support/create-ticket/) if help is needed.
    - An existing WhatsApp number and want to migrate it to a WhatsApp business account, follow these [instructions](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/migrate-existing-whatsapp-number-to-a-business-account/). Create a [support ticket](https://azure.microsoft.com/support/create-ticket/) if help is needed.

    :::image type="content" source="./media/add-phone-number-options.png" lightbox="./media/add-phone-number-options.png" alt-text="Screenshot that shows the options to add your phone number for WhatsApp.":::

15. Select **Add a new number**. Choose to either verify your phone number through a text message or phone call.

    :::image type="content" source="./media/verify-phone-number-text-message.png" lightbox="./media/verify-phone-number-text-message.png" alt-text="Screenshot that shows verifying your phone number for WhatsApp by text message option.":::

16. The Event Grid view you deployed will receive the text message of the verification code.
    
    :::image type="content" source="./media/event-grid-viewer-verification-code.png" lightbox="./media/event-grid-viewer-verification-code.png" alt-text="Screenshot that shows the Event Grid Viewer with the verification code.":::

17. Enter the verification code and select **Next**.

    :::image type="content" source="./media/verify-phone-number.png" lightbox="./media/verify-phone-number.png" alt-text="Screenshot that shows verifying your phone number.":::

18. Review the access request and select **Continue**.

19. Select **Finish**.

20. Now in your Azure Communication Services resource, under **Channels**, you'll see a new channel connected with a status of **Display name review pending**.

    The status of your WhatsApp Business account is displayed in the Azure portal. Once approved, you will see an **Active** status.

    :::image type="content" source="./media/active-display-name.png" lightbox="./media/active-display-name.png" alt-text="Screenshot that shows an Active status WhatsApp Business account in the Azure portal.":::

    Only when you see that status can you use the WhatsApp Business account to send and receive messages without limitations of number of messages and recipients per day. It also unlocks the ability to link WhatsApp Business account as a channel in Microsoft Copilot Studio.

    Meta reviews your business's display name. You can learn more about this review process and how to update your business account's display name in the article [About WhatsApp Business display name](https://www.facebook.com/business/help/338047025165344).

    When you no longer want to use the WhatsApp Business account with Azure Communication Services, you can select the account and select the **Disconnect** button. This option disconnects the account from Azure Communication Services but doesn't delete the account and the account can be reconnected later.

### WhatsApp account status

You can see the status of your WhatsApp Business account in the Azure portal. Accounts with different statuses have different restrictions on messaging features. An account can have following types of status.

| Status | Meaning | Suggested Action |
|---------------------|----------------------|-----------------------|
|**Active**| A WhatsApp account is ready to use. |  |
|**Revoked**| A WhatsApp account is unshared or deleted from the WhatsApp side. | If you no longer want to use the WhatsApp Business account, you can disconnect the account. If you still want the WhatsApp Business account connected, you need to redo the registration process by disconnecting then reconnecting the account. |
|**Disconnected**| A WhatsApp account is disconnected from the Azure portal side. | If you no longer want to use the WhatsApp Business account, you need to go to WhatsApp manager portal to unshare the WhatsApp Business Account or delete the phone number or delete the WhatsApp Business Account for a complete disconnection. If you still want the WhatsApp Business account connected, you need to redo the registration process by disconnecting then reconnecting the account. |
|**Phone number deleted**| A WhatsApp Business phone number is deleted from the WhatsApp side. | If you no longer want to use the WhatsApp Business account, you can disconnect the account. If you still want the WhatsApp Business account connected, you need to redo the registration process by disconnecting then reconnecting the account with adding the same phone number. |
|**Business account review rejected**| WhatsApp disabled the business account because it doesn't comply with WhatsApp Business's Commerce Policy. | Check details on WhatsApp manager portal and request a review if you believe that this rejection is incorrect. |
|**Display name review not started**| WhatsApp didn't start a WhatsApp Business display name review for your business phone number. Typically, the review didn't start because your Meta business account has not yet finish Meta Business Verification. [See this link for details about Meta Business Verification.](https://www.facebook.com/business/help/2058515294227817) | WhatsApp Business display name review isn't required to get started. You can immediately start sending messages to customers. You have limited number of messages and recipients per day until WhatsApp Business display name review is approved. |
|**Display name review pending**| The WhatsApp business phone number display name is under review by WhatsApp. | WhatsApp Business display name review isn't required to get started. You can immediately start sending messages to customers. You have limited number of messages and recipients per day until WhatsApp Business display name review is approved. |
|**Display name review rejected**| WhatsApp rejects the WhatsApp business phone number display name. | Check details and submit a new phone number display name on WhatsApp manager portal. WhatsApp Business display name review isn't required to get started. You can immediately start sending messages to customers. You have limited number of messages and recipients per day until WhatsApp Business display name review is approved. |

## Next steps

This article covered the prerequisites for configuring WhatsApp as a channel in Microsoft Copilot Studio. You're now ready to deploy your AI agent to your WhatsApp Business phone number. 

> [!div class="nextstepaction"]
> [Deploy AI agent to WhatsApp](https://go.microsoft.com/fwlink/?linkid=2313226)

## Related articles

-    [WhatsApp Business Account FAQ](../../../quickstarts/advanced-messaging/whatsapp/whatsapp-business-account-faq.md)
-    [WhatsApp Business Help Center](https://www.facebook.com/business/help/524220081677109?id=2129163877102343)
-    [WhatsApp Business Display Name Policy](https://www.facebook.com/business/help/338047025165344)
-    [Business Verification](https://www.facebook.com/business/help/1095661473946872?id=180505742745347) 
-    [Add more Management Accounts](https://www.facebook.com/business/help/2169003770027706)
