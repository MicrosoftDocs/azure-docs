---
title: What is Language Studio
titleSuffix: Azure Cognitive Services
description: Use this article to learn about Language Studio, and testing features of Azure Cognitive Service for language
author: aahill
ms.author: aahi
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.date: 09/03/2021
ms.topic: conceptual
---

# What is Language Studio?

[Language Studio](https://language.azure.com/) is a set of UI-based tools that lets you explore, build, and integrate features from Azure Cognitive Service for language into your applications.

Language Studio provides you with a platform to try several service features, and see what they return in a visual manner. It also provides you with an easy-to-use experience to create custom projects and models to work on your data. Using the Studio, you can get started without needing to write code, and then use the available client libraries and REST APIs in your application.

## Get started using Language Studio

[!INCLUDE [deploy an Azure resource](../includes/deploy-azure-resource.md)]

## Using Language Studio

The Language Service offers multiple features that use prebuilt, pre-configured models for performing various tasks such as: entity linking, language detection, and key phrase extraction. See the [Azure Cognitive Services for Language overview](../overview.md) to see the list of features offered by the service. 

Each of these features has a demo-like experience inside Language Studio that lets you input text, and presents the response both visually, and in JSON. These demos help you quickly test these prebuilt features without using code. The pages are divided into sections:

* An overview of the feature, with a name and description. You can also find links to its documentation, samples, and client libraries (SDK). The **Platforms** section lets you know if the feature is only available as a cloud-based service, or additionally as a Docker container that can be used on-premises.

* A section for entering text, uploading a file, or choosing a text sample to demonstrate how the feature works. To try the demo, you will need to choose a resource and acknowledge it will incur usage according to your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/). 

:::image type="content" source="../media/language-studio-feature.png" alt-text="A screenshot showing a feature in Language Studio" lightbox="../media/language-studio-feature.png":::

After sending text, you'll be able to see a visualization, along with the JSON response. At the bottom of the page, you'll see next steps and the cURL command for the API request you just sent.

:::image type="content" source="../media/language-studio-feature-result.png" alt-text="A screenshot showing the result of a feature in Language Studio" lightbox="../media/language-studio-feature-result.png":::

## Features with customization

The Language Service also offers multiple features that let you create, train, and publish custom models to better fit your data. For example, custom content classification and custom question answering. See the [overview article](../overview.md) for the list of features offered by the service. For features with customization, Language Studio offers workflows that let developers and subject matter experts build models without needing machine learning expertise. 

## Find keys, resource name, and location/region

To find the keys and location/region of a completed deployment, follow these steps:

1. Sign into Language Studio, and select the **Settings** icon in the top-right corner of the screen. 
1. Select **Resources**. 

Your resource's details such as the key and name associated with it will be listed here. You can use this information when sending API calls using the feature client libraries and REST APIs. You can also find this information on the [using the Azure portal](https://portal.azure.com/) by navigating to your resource group, and selecting your Azure resource.

## Next steps

* Go to the [Language Studio](https://language.azure.com/) to begin using features offered by the service.
* For more information and documentation on the features offered, see the [Azure Cognitive Services for Language overview](../overview.md). 
