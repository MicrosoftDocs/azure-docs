---
title: Try the Speech service for free
description: Discover how you can try the Speech service at no cost.
titleSuffix: "Azure Cognitive Services"
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 09/24/2018
ms.author: v-jerkin
---

# Try the Speech service for free

Getting started with the Speech service is easy and affordable. A 30-day free trial lets you discover what the service can do and decide whether it's right for your application's needs.

If you need more time, sign up for a Microsoft Azure account—it comes with $200 in service credit that you can apply toward a paid Speech service subscription for up to 30 days.

Finally, the Speech service offers a free, low-volume tier that's suitable for developing applications. You can keep this free subscription even after your service credit expires.

## Free trial

The 30-day free trial gives you access to the S0 standard pricing tier for a limited time. 

To sign up for a 30-day free trial:

1. Go to [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/).

1. Select the **Speech APIs** tab.

   ![Speech Services tab](media/index/try-speech-api-free-trial1.png)
   
1. Under **Speech services**, select the **Get API Key** button.

   ![API key](media/index/try-speech-api-free-trial2.png)

1. Agree to the terms and select your locale from the drop-down menu.

   ![Agree to terms](media/index/try-speech-api-free-trial3.png)

1. Sign in by using your Microsoft, Facebook, LinkedIn, or GitHub account. Or, you can sign up for a free Microsoft account:

    * Go to the [Microsoft account portal](https://account.microsoft.com/account).
    * Select **Sign in with Microsoft**.

    ![Sign in](media/index/try-speech-api-free-trial4.png)

    * When asked to sign in, select **Create one**.

    ![Create new account](media/index/try-speech-api-free-trial5.png)

    * In the steps that follow, enter your e-mail address or phone number, assign a password, and follow the instructions to verify your new Microsoft account.

After you sign in, your free trial begins. The displayed webpage lists all the Azure Cognitive Services services for which you currently have trial subscriptions. Two subscription keys are listed beside **Speech services**. You can use either key in your applications.

> [!NOTE]
> All free trial subscriptions are in the West US region. When you make requests, be sure to use the endpoint that corresponds to your region.

## New Azure account

New Azure accounts receive a $200 service credit that is available for up to 30 days. You can use this credit to further explore the Speech service or to begin application development.

To sign up for a new Azure account:

1. Go to the [Azure sign-up page](https://azure.microsoft.com/free/ai/). 

1. Select **Start free**.

    ![Start free](media/index/try-speech-api-new-azure1.png)

1. Sign in with your Microsoft account. If you don't have one:

    * Go to the [Microsoft account portal](https://account.microsoft.com/account).
    * Select **Sign in with Microsoft**.
    * When asked to sign in, select **Create one.**
    * In the steps that follow, enter your e-mail address or phone number, assign a password, and follow the instructions to verify your new Microsoft account.

1. Enter the rest of the information that's requested to sign up for an account. Specify your country and your name and provide a phone number and e-mail address.

    ![Enter information](media/index/try-speech-api-new-azure2.png)

    Verify your identity by phone and by providing a credit card number. (Your credit card will not be billed.) hen, accept the Azure user agreement. 

    ![Accept agreement](media/index/try-speech-api-new-azure3.png)

Your free Azure account is created. Follow the steps in the next section to start a subscription to the Speech service.

## Create a Speech resource in Azure

To add a Speech service resource to your Azure account:

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) by using your Microsoft account.

1. Select **Create a resource** at the top left of the portal.

    ![Create a resource](media/index/try-speech-api-create-speech1.png)

1. In the **New** window, search for **speech**.

1. In the search results, select **Speech**.

    ![Select Speech](media/index/try-speech-api-create-speech2.png)

1. Under **Speech**, select the **Create** button.

    ![Select the Create button](media/index/try-speech-api-create-speech3.png)

1. Under **Create**, enter:

    * A name for the new resource. The name helps you distinguish among multiple subscriptions to the same service.
    * Choose the Azure subscription that the new resource is associated with to determine how the fees are billed.
    * Choose the region where the resource will be used. Currently, the Speech service is available in East Asia, North Europe, and West US regions.
    * Choose the pricing tier, either F0 (limited free subscription) or S0 (standard subscription). Select **View full pricing details** for complete information about pricing and usage quotas for each tier.
    * Create a new resource group for this Speech subscription or assign the subscription to an existing resource group. Resource groups help you keep your various Azure subscriptions organized.
    * For convenient access to your subscription in the future, select the **Pin to dashboard** check box.
    * Select **Create.**

    ![Select the Create button](media/index/try-speech-api-create-speech4.png)

    It might take a moment to create and deploy your new Speech resource. Select **Quickstart** to see information about your new resource.

    ![Quickstart panel](media/index/try-speech-api-create-speech5.png)

1. Under **Quickstart**, select the **Keys** link under step 1 to display your subscription keys. Each subscription has two keys; you can use either key in your application. Select the button next to each key to copy it to the clipboard for pasting into your code.

> [!NOTE]
> You can create an unlimited number of standard-tier subscriptions in one or multiple regions. However, you can create only one free-tier subscription. Model deployments on the free tier that remain unused for 7 days will be decomissioned automatically.

## Next steps

Complete one of our 10-minute quickstarts or check out our SDK samples:

> [!div class="nextstepaction"]
> [Quickstart: Recognize speech in C#](quickstart-csharp-dotnet-windows.md)
> [Speech SDK samples](speech-sdk.md#get-the-samples)
