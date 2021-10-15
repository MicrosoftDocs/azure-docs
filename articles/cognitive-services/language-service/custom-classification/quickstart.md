---
title: "Quickstart: Custom text classification"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to start using the custom text classification feature.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 11/02/2021
ms.author: aahi
zone_pivot_groups: usage-custom-language-features     
---

# Quickstart: Custom text classification (preview)

Use this article to get started with using Custom text classification. Follow these steps to create an AI model that classifies technical support tickets. This quickstart will explain the required steps to successfully use custom text classification:



1. **Create a Text Analytics resource** and an **Azure blob storage account**

    Before you can use custom text classification, you will need to create a Text Analytics resource, which will give you the subscription and credentials you will need to create a project and start training a model. You will also need an Azure blob storage account, which is the required online data storage to hold text for analysis. 

    > [!IMPORTANT]
    > To get started quickly, we recommend creating a new Azure Text Analytics resource using the steps provided below, which will let you create the resource, and configure a storage account at the same time, which is easier than doing it later. 
    >
    > If you have a pre-existing resource you'd like to use, you will need to configure it and a storage account separately. See the [**Project requirements**](../../how-to/use-azure-resources.md#optional-using-a-pre-existing-azure-resource)  for information.

2. **Create a custom text classification project**

    A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have contributor access to the Azure resource being used.

3. **Download the example data**
    
    Later in this quickstart, we will provide some data for you to upload to this storage account. This data consists of tagged text files that will be used to train your model.

4. **Train a model**

    A model is the machine learning object that will be trained to classify text from tagged data. Your model will learn from the example data, and be able to classify technical support tickets afterwards.

5. **Deploy a model** and use it to **classify text**

    When you deploy a model, you make it available for use. At this stage, you can start classifying text and send API requests to it. 


::: zone pivot="language-studio"

[!INCLUDE [Language Studio quickstart](includes/quickstarts/language-studio.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API quickstart](includes/quickstarts/rest-api.md)]

::: zone-end

## Next steps

After you've created a text classification model, you can:
* [Send text classification requests to your model](how-to/run-inference.md)
* [Improve your model's performance](how-to/improve-model.md).

As you create Text Classification projects:
* [View the recommended practices](concepts/recommended-practices.md)
* [Learn how to improve your model by using evaluation metrics](how-to/view-model-evaluation.md).