---
title: Language Studio
titleSuffix: Azure Cognitive Services
description: Language Studio Overview
author: skandil
ms.author: sarakandil
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.date: 09/03/2021
ms.topic: conceptual
---

## What is Language Studio?

[Language Studio](https://language.azure.com/) is a set of UI-based tools that lets you to explore, build and integrate features from Azure Cognitive Service for language into your applications.

Language Studio provides you with a platform to try several service features, and see what they returns in a visual manner. It also provides you with an easy-to-use experience to create custom projects and models to work on your data. Using the Studio, you can get started without needing to write code, and then use the available client libraries and REST APIs in your application.

## Set up your Azure account

Before you can use Language Studio, you need to have an Azure account. You can [create one for free](https://azure.microsoft.com/free/ai/). Once you have an Azure account: 

1. [Log into Language Studio](https://language.azure.com/).
1. 

> [!TIP]
> * Azure Cognitive Service for language has [two pricing tiers](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/): free (F0) and paid (S), which have different limitations. 
> * If you use the free pricing tier, you can keep using the Language service even after your free trial or service credit expires. 

<!--
After you create an Azure account and a Language service resource:
1. Sign in to the [Language Studio](https://language.azure.com/) with your Azure account.
2. Select the Language service resource you need to get started. You can also create a new Language se (You can change the resources anytime in "Settings" in the top menu.)

> [!NOTE]
> You can create a new Language resource from the Studio after you sign in. [Learn more](LinkToCreateNewResourceFromStudio)
-->

## Try the Speech service for free

For the following steps, you need both a Microsoft account and an Azure account. If you do not have a Microsoft account, you can sign up for one free of charge at the [Microsoft account portal](https://account.microsoft.com/account). Select **Sign in with Microsoft** and then, when asked to sign in, select **Create a Microsoft account**. Follow the steps to create and verify your new Microsoft account.

Once you have a Microsoft account, go to the [Azure sign-up page](https://azure.microsoft.com/free/ai/), select **Start free**, and create a new Azure account using a Microsoft account. Here is a video of [how to sign up for Azure free account](https://www.youtube.com/watch?v=GWT2R1C_uUU).

> [!NOTE]
> When you sign up for a free Azure account, it comes with $200 in service credit that you can apply toward a paid Speech service subscription, valid for up to 30 days. Your Azure services are disabled when your credit runs out or expires at the end of the 30 days. To continue using Azure services, you must upgrade your account. For more information, see [How to upgrade your Azure free account](../../cost-management-billing/manage/upgrade-azure-subscription.md). 
>
> The Speech service has two service tiers: free(f0) and subscription(s0), which have different limitations and benefits. If you use the free, low-volume Speech service tier you can keep this free subscription even after your free trial or service credit expires. For more information, see [Cognitive Services pricing - Speech service](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

### Create the Azure resource

To add a Speech service resource (free or paid tier) to your Azure account:

1. Sign in to the [Azure portal](https://portal.azure.com/) using your Microsoft account.

1. Select **Create a resource** at the top left of the portal. If you do not see **Create a resource**, you can always find it by selecting the collapsed menu in the upper left corner of the screen.

1. In the **New** window, type "speech" in the search box and press ENTER.

1. In the search results, select **Speech**.
   
   :::image type="content" source="media/index/speech-search.png" alt-text="Create Speech resource in Azure portal.":::

1. Select **Create**,  then:

   - Give a unique name for your new resource. The name helps you distinguish among multiple subscriptions tied to the same service.
   - Choose the Azure subscription that the new resource is associated with to determine how the fees are billed. Here is the introduction for [how to create an Azure subscription](../../cost-management-billing/manage/create-subscription.md#create-a-subscription-in-the-azure-portal) in the Azure portal.
   - Choose the [region](regions.md) where the resource will be used. Azure is a global cloud platform that is generally available in many regions worldwide. To get the best performance, select a region that’s closest to you or where your application runs. The Speech service availabilities vary from different regions. Make sure that you create your resource in a supported region. See [region support for Speech services](./regions.md#speech-to-text-text-to-speech-and-translation).
   - Choose either a free (F0) or paid (S0) pricing tier. For complete information about pricing and usage quotas for each tier, select **View full pricing details** or see [speech services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). For limits on resources, see [Azure Cognitive Services Limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-cognitive-services-limits).
   - Create a new resource group for this Speech subscription or assign the subscription to an existing resource group. Resource groups help you keep your various Azure subscriptions organized.
   - Select **Create**. This will take you to the deployment overview and display deployment progress messages.  
<!--
> [!NOTE]
> You can create an unlimited number of standard-tier subscriptions in one or multiple regions. However, you can create only one free-tier subscription. Model deployments on the free tier that remain unused for 7 days will be decommissioned automatically.
-->
It takes a few moments to deploy your new Speech resource. 

### Find keys and location/region

To find the keys and location/region of a completed deployment, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) using your Microsoft account.

2. Select **All resources**, and select the name of your Cognitive Services resource.

3. On the left pane, under **RESOURCE MANAGEMENT**, select **Keys and Endpoint**.

Each subscription has two keys; you can use either key in your application. To copy/paste a key to your code editor or other location, select the copy button next to each key, switch windows to paste the clipboard contents to the desired location.

Additionally, copy the `LOCATION` value, which is your region ID (ex. `westus`, `westeurope`) for SDK calls.

> [!IMPORTANT]
> These subscription keys are used to access your Cognitive Service API. Do not share your keys. Store them securely– for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.


























## Language Studio capabilities

The following capabilities are offered by the Language Service and are available as in the Language Studio.

* **Extract Key Phrases:**
* **Find Linked Entities:**
* **Extract Named Entities:**
* **Extract PII:**
* **Custom Text Extraction:**
* **Analyze Sentiment and Mine Opinions:**
* **Detect Language:**
* **Custom Text Classification:**
* **Custom Conversational Language Understanding:**
* **Label Medical Information:**
* **Answer Questions:**
* **Custom Question Answering:**
* **Translate Text:**
* **Translate Documents:**
* **Custom Translation:**

### Prebuilts - Try it Out experience

The Language Service offers multiple prebuilt capabilities which include Extract Key Phrases, Find Linked Entities, Extract Named Entities, Extract PII, Analyze Sentiment, Detect Language, Label Medical Information, Answer Questions, Translate Text, Translate Documents. Each capability has a demo-like experience inside the Studio that processes any text being inputted and presents the response visually and in JSON format. This helps you quickly test all prebuilt offerings without using any code and understand what the capability exactly processes.

The pages are divided to 3 sections:
1. Overview of the capability: This section contains the name and description of the capability as well as the API version available for you to try out within this experience. In the command bar, you can find links for the documentation, samples and SDK related to the capability you have open. On the far right of the page, you get to see the platforms available the open capability, whether it is hosted only on cloud or is available as a docker container and can be hosted in-house.

2. Try it out UX: You have the choice to enter text, upload a file or quickly choose a sample text that we offer to demonstrate how the capability works. You may choose a language for the provided text or have it set to autodetect. You will also need to choose a Language resource to run the demo with. It is by default selected to the resource that you have been using since your sign-on, but you have the option to change the resource. By running the demo, you acknowledge that it would incur cost to the resource according to our [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).After running the demo, you will be presented with a visualization of the response to help you understand what is being returned by the capability. You also have the choice to view the response in JSON format.

3. Next steps: At the bottom of the page, you are presented with the CURL code to integrate the capability with your client application if you find it fitting to your scenario.

> [!div class="mx-imgBorder"]
> ![Data processing diagram](./Media/studio-try-ux-first.png)  

> [!div class="mx-imgBorder"]
> ![Data processing diagram](./Media/studio-try-ux-second.png)  


### Custom capabilities

The Language Service offers the following custom capabilities: Custom Text Extraction, Custom Text Classification, Conversational Language Understanding, Custom Question Answering and Custom Translation. Customers use these capabilities to create, train and publish custom models for enterprise use. For this, the Studio offers a unique, simple and easy to use experience for each custom capability that would help not only developers, but subject matter experts to easily build their models. Get started with the below quickstarts for each capability:

* [Quickstart: Create a Custom Text Extraction project]
* [Quickstart: Create a Custom Text Classification project]
* [Quickstart: Create a Conversational Language Understanding project]
* [Quickstart: Create a Custom Question Answering project]
* [Quickstart: Create a Custom Translation project]

## Next steps
