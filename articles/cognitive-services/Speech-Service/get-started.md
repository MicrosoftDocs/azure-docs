---
title: Try the Speech service for free
description: Discover how you can try the Speech service at no cost.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/17/2018
ms.author: v-jerkin
---

# Try the Speech service for free

Getting started with the Speech service is easy and affordable. A 30-day free trial lets you discover what the service can do and decide whether it's right for your application's needs.

If you need more time, sign up for a Microsoft Azure account—it comes with $200 in service credit that you can apply toward a paid Speech service subscription for up to 30 days.

Finally, the Speech service offers a free, low-volume tier suitable for developing applications. You can keep this free subscription even after your service credit expires.

## Free trial

The 30-day free trial gives you access to the S0 standard pricing tier for a limited time. To sign up for a 30-day free trial, follow these steps.

1. Go to the [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/) page.

1. Switch to the Speech tab and click the **Get API key** button next to "Speech services".

   ![Speech Services tab](media/index/try-speech-api-free-trial1.png)<br>
   ![API key](media/index/try-speech-api-free-trial2.png)

3. Agree to the terms and select your locale from the drop-down menu.

   ![Agree to terms](media/index/try-speech-api-free-trial3.png)

4. Sign in using your Microsoft, Facebook, LinkedIn, or GitHub account. Or you may sign up for a free Microsoft account:

    * Go to the [Microsoft account portal](https://account.microsoft.com/account).
    * Click **Sign in with Microsoft**.

    ![Sign in](media/index/try-speech-api-free-trial4.png)

    * When asked to sign in, click "Create one."

    ![Create new account](media/index/try-speech-api-free-trial5.png)

    * In the steps that follow, enter your e-mail address or phone number, assign a password, and follow the instructions to verify your new Microsoft account.

After you sign in, your free trial begins. The displayed Web page lists all of the Cognitive Services for which you currently have trial subscriptions. Two subscription keys are listed beside "Speech services." You may use either key in your applications.

> [!NOTE]
> All free trial subscriptions are in the West US region. Be sure to use the endpoint corresponding to your region when making requests.

## New Azure account

New Azure accounts receive a $200 service credit that lasts up to 30 days. This credit can be used to further explore the Speech service or begin application development.

To sign up for a new Azure account, follow these steps.

1. Go to the [Azure sign up page](https://azure.microsoft.com/free/ai/). 

1. Click **Start free**.

    ![Start free](media/index/try-speech-api-new-azure1.png)

3. Sign in with your Microsoft account. If you don't have one:

    * Go to the [Microsoft account portal](https://account.microsoft.com/account).
    * Click **Sign in with Microsoft**.
    * When asked to sign in, click "Create one."
    * In the steps that follow, enter your e-mail address or phone number, assign a password, and follow the instructions to verify your new Microsoft account.

1. Enter the rest of the information requested to sign up for an account. Specify your country and your name and provide a phone number and e-mail address.

    ![Enter information](media/index/try-speech-api-new-azure2.png)

    Verify your identity by phone and by providing a credit card number, then accept the Azure user agreement. (Your credit card will not be billed.)

    ![Accept agreement](media/index/try-speech-api-new-azure3.png)

Your free Azure account is created. Follow the steps in the next section to start a subscription to the Speech service.

## Create a Speech resource in Azure

To add a Speech service resource to your Azure account, follow these steps.

1. Log in to the [Azure portal](https://ms.portal.azure.com/) using your Microsoft account.

1. Click **Create a resource** (the green **+** icon) at the top left of the portal.

    ![Create resource](media/index/try-speech-api-create-speech1.png)

1. In the New window, search for Speech.

    ![Click Speech](media/index/try-speech-api-create-speech2.png)

1. In the search results, click "Speech (preview)."

1. Click the **Create** button at the bottom of the Speech service panel.

    ![Click create](media/index/try-speech-api-create-speech3.png)

1. In the Create panel, enter:

    * A name for the new resource. The name helps you distinguish among multiple subscriptions to the same service.
    * Choose the Azure subscription that the new resource is associated with to determine how the fees are billed.
    * Choose the region where the resource will be used. Currently, the Speech service is available in East Asia, North Europe, and West US regions.
    * Choose the pricing tier, either F0 (limited free subscription) or S0 (standard subscription). Click **View full pricing details** for complete information on pricing and usage quotas for each tier.
    * Create a new resource group for this Speech subscription or assign it to an existing one. Resource groups help you keep your various Azure subscriptions organized.
    * For convenient access to your subscription in the future, mark the **Pin to dashboard** checkbox.
    * Click **Create.**

    ![Click create in panel](media/index/try-speech-api-create-speech4.png)

    It may take a moment to create and deploy your new Speech resource. The Quickstart panel appears with information about your new resource.

    ![Quickstart panel](media/index/try-speech-api-create-speech5.png)

1. Click the **Keys** link under Step 1 in the Quickstart panel to display your subscription keys. Each subscription has two keys; you may use either in your application. Click the button next to each key to copy it to the clipboard for pasting into your code.

> [!NOTE]
> You may create any number of standard-tier subscriptions in one or multiple regions. However, you may create only one free-tier subscription.

## Next steps

Download an SDK and some sample code to experience the Speech service.

> [!div class="nextstepaction"]
> [Speech SDKs](speech-sdk.md)

> [!div class="nextstepaction"]
> [Sample code](samples.md)
