---
title: Prerequisites to Configure WhatsApp as a Channel in Microsoft Copilot Studio
titleSuffix: An Azure Communication Services article
description: Learn about Azure Communication Services Advanced Messaging for WhatsApp.
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

 Azure Communication Services Advanced Messaging SDK enables AI agents in Microsoft Copilot Studio to send and receive WhatsApp messages to users. AI agents are associated to a unique WhatsApp Business account phone number.

## Overview

This article covers the prerequisites to configuring WhatsApp as a Channel in Microsoft Copilot Studio.

1. Create an Azure Communication Services resource in Azure Portal.
2. Get a phone number that can receive SMS.
3. Setup and Deploy Event Grid Viewer
4. Setup Event subscription for SMS received.
5. Link WhatsApp business account as a channel in Azure Communication Services Resource
6. Clean Up

The following video demonstrates this process.

[Insert demo video]

## Prerequisites

- Facebook account
- Active Meta Business account
- An Azure account with an active subscription where you have the role of an owner. [Create an account for free](https://azure.microsoft.com/free/dotnet/).

## Create an Azure Communication Services resource in Azure Portal

Follow the instructions in [Create an Azure Communication Services resource using Azure portal](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp#create-an-azure-communication-services-resource-using-azure-portal) section.

When following those instructions, here are helpful tips:

- Use the following image as an example of how you can fill in your project details and instance details to create your resource.

    [insert image-1]

- Assigning tags to your resource is optional.
- Once your resource is deployed, continue with the below instructions.

## Get a phone number

The phone number is used to link your Azure Communication Services resource to your WhatsApp Business Account and then your AI agent in Microsoft Copilot Studio.

Make sure the phone number has the following capabilities:

1. Able to receive SMS
2. Phone number isn't already associated with a WhatsApp Business Account

You can [provision a Toll-free number with SMS enabled from Azure Communication Services](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/get-phone-number?tabs=windows&pivots=platform-azp-new)
or bring your own phone number.

## Setup and Deploy Event Grid Viewer

The following steps are only needed if you chose to use a Toll-free number from Azure Communication Services phone number with SMS enabled. The Event Grid Viewer display notification information for events it is subscribed to. 

1. Click on the following button to will launch a custom template for the Azure portal instance that you are logged into to set up the Event Grid Viewer.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmain%2Fazuredeploy.json" target="_blank"><img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true"/></a>
    
2. Fill in the required fields. Because the site name creates a DNS entry, it needs to be globally unique. We recommend that you include your alias in the name for this step. Here are suggestions for filling out the deployment details:
    - `Subscription` - Select the subscription that contains your Azure Communication Services resource.
    - `Resource Group` - Select the resource group that contains your Azure Communication Services resource.
    - `Region` - Select the resource group that contains your Azure Communication Services resource.
    - `Site Name` - Create a name that is globally unique. This site name is used to create a domain to connect to your Event Grid Viewer.
    - `Hosting Plan Name` - Create any name to identify your hosting plan.
    - `Sku` - Use the SKU F1 for development and testing purposes. If you encounter validation errors creating your Event Grid Viewer that say there's no more capacity for the F1 plan, try selecting a different region. For more information about SKUs, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/).

    [insert image-2]
3. Then select **Review + Create**.
4. After the deployment completes, select on the resource of type **Microsoft.Web/sites** to open it.

    [insert image-3]
5. On the resource overview page, select on the copy button next to the **Default Domain** property.

    [insert image-4]
6. Launch that site in your browser and keep it running so you can receive the verification code when you're [linking your WhatsApp business account to Azure Communication Services resource](#link-whatsapp-business-account-as-a-channel-in-azure-communication-services-resource). The Event Grid Viewer should look like this.

    [insert image-5]

## Subscribe to SMS received event

To get the verification code when linking your WhatsApp business account to Azure Communication Services resource, follow these instructions to have the [Azure Event Grid subscribe to the SMS Received event](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/sms/handle-sms-events#subscribe-to-sms-events-by-using-web-hooks).

When following those instructions, here are helpful tips:

- When filling in the details for the new event subscription.
    - `Name`: Enter a descriptive name for the event subscription. 
    - `System Topic Name`: Enter a unique name, unless this name is already prefilled with a topic from your subscription.
    - `Filter to Event Types`: Select **SMS Received**. No need to select SMS Delivery Report Received
    - `Endpoint Type`: Select **Web Hook**
    - `Endpoint`: Append `/api/updates` to the URL of the Event Grid Viewer (step 5 of [Set up and Deploy Event Grid Viewer](#setup-and-deploy-event-grid-viewer)). It should be something like `https://{{site-name}}.azurewebsites.net/api/updates`

    [image]
4. Once created successfully, you are directed to the **Events** page. Notice the new event subscription with the SMS received event.

    [image]

## Link WhatsApp business account as a channel in Azure Communication Services Resource

1. With your newly created Azure Communication Services resource, on the left navigation bar, select on the **Advance Messaging** and then select **Channels**. To add a new WhatsApp Business Account, select on the **Connect** button.
2. Select WhatsApp as the channel and select the **Connect** button.
3. Acknowledge the *Data Transfer and Independent Terms of Service*.
4. Select the **Next** button to continue
5. Select the SMS enabled phone number you wish to use to connect to your WhatsApp Business Account. This can be either the [Azure Communication Services Toll-free phone number](#provision-an-azure-communication-services-phone-number) you previously provisioned or bring your own phone number.
6. Select the **Next** button.
7. Select the **Login with Facebook** button to link your WhatsApp business account.
8. A new Facebook Login page pops up as a new window. Provide your login. 
9. The next screen notifies you that the Azure Communication Services app will receive your name and profile picture. It gives permission to Azure Communication Service APIs to manage your WhatsApp Business Account. Select **Continue**.
10. After signing in, the next screen summarizes the permissions, you'll be granting Azure Communication Services to manage your WhatsApp Business Account. Select the **Get Started** button.
11. Now that the WhatsApp Business Account is signed into, select or create the existing **Business portfolio**. Then select the **Next** button.

    [image show select]

12. Select or create a WhatsApp Business Account and WhatsApp Business Profile.

    [image show create business account and select business profile]

13. A phone number is needed, and it is what people see when they chat with you. Another WhatsApp Business account can't use this phone number.

    Use the Azure Communication Service toll-free phone number you provisioned previously or bring your own phone number.

    If the phone number you're bringing is:
    - Under a solution provider other than Azure Communication Services, follow these instructions to [migrate your phone number to Azure Communication Services](https://developers.facebook.com/docs/whatsapp/solution-providers/support/migrating-phone-numbers-among-solution-partners-via-embedded-signup/). Create a [support ticket](https://azure.microsoft.com/support/create-ticket/) if help is needed.
    - An existing WhatsApp number and want to migrate it to a WhatsApp business account, follow these [instructions](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/migrate-existing-whatsapp-number-to-a-business-account/).Create a [support ticket](https://azure.microsoft.com/support/create-ticket/) if help is needed.

14. Select **Add a new number**. Choose to either verify your phone number through a text message or phone call.
15. The Event Grid view you deployed will receive the text message of the verification code.
16. Enter the verification code and select **Next**.
17. Review the access request and select **Continue**.
18. Select **Finish**.
19. Going back to your Azure portal, you should see this screen which summarizes which phone number you used and your WhatsApp business account information that you've successfully linked. Select **Close**.
20. Now in your Azure Communication Service resource, under **Channels**, you will see a new channel connected with a status of **Display name review pending**.

    The status of your WhatsApp Business account is displayed in the Azure portal. Once approved, you will see an **Active** status.

    [insert image]

    Only when you see that status can you then use the WhatsApp Business account to send and receive messages and unlocks the ability to link WhatsApp Business account as a channel in Microsoft Copilot Studio. 

    Meta reviews your business's display name. You can learn more about this review process and how to update your business account's display name in the article [About WhatsApp Business display name](https://www.facebook.com/business/help/338047025165344).
