---
title: Language Studio Overview
titleSuffix: Azure Cognitive Services
description: Language Studio Overview
author: skandil
ms.author: sarakandil
manager: nitinme
ms.service: cognitive-services
ms.subservice: < let the content writers fill this in >
ms.date: 01/08/2021
ms.topic: article
---

## What is Language Studio?

[Language Studio](https://language.azure.com/) is a set of UI-based tools that allows users to explore, build and integrate features from Azure Language service in your applications.
The Studio provides you with a platform to try out the service's prebuilt offerings and see what each returns in code and visual format. It also provides you with a simple experience to create custom projects for all custom capabilities that are offered by the service. It allows you this using a no-code approach, and then reference the assets you create in your applications using the [Language SDK](ww), [Language CLI](ww), or various [REST APIs](ww).

## Set up your Azure account

You need to have an Azure account and a Language service resource before you can use Language Studio. If you don't have an account or resource, try the [Language service for free](SimilarToWhatSpeechHas<https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#try-the-speech-service-for-free>).

After you create an Azure account and a Language service resource:
1. Sign in to the [Language Studio](https://language.azure.com/) with your Azure account.
2. Select the Language service resource you need to get started. You can also create a new Language se (You can change the resources anytime in "Settings" in the top menu.)

> [!NOTE]
> You can create a new Language resource from the Studio after you sign in. [Learn more](LinkToCreateNewResourceFromStudio)

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
