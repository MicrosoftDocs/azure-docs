---
title: What is custom extraction in Language Services - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how use custom text extraction with the Language Services API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/15/2021
ms.author: aahi
---

# Custom text extraction

Custom text extraction is a cloud-based API service that is built using transformer-based models from [Microsoft Turing](https://msturing.org/about) to extract information from unstructured documents.

This API is similar to the [Named Entity Recognition API](../named-entity-recognition/overview.md), but lets you extract specific entities that are more relevant to your needs. 

Building custom models can be a complex process that requires AI expertise; Custom Text analytics abstracts you from the need of in house AI expertise, you bring the data and we take care of the rest. Your data can be previously tagged or you can tag it within the [Language Studio](https://language.azure.com).

<!--
This documentation contains the following article types:
* [Quickstarts](../README.md#Quickstarts) are getting-started instructions to guide you through making requests to the service.

* [Concepts](../README.md#Concepts) provide explanations of the service functionality and features.

* How-to guides contain instructions for using the service in more specific or customized ways.
-->

## Development life cycle

Using the custom extraction API typically involves several different steps. 

:::image type="content" source="../custom-classification/media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="media/development-lifecycle.png":::

1. **Define schema**: Know your data and identify the entities you want extracted, avoid ambiguity.

2. **Tag data**: Tagging data is a key factor in determining model performance. Tag precisely, consistently and completely.
  1. **Tag precisely**: Tag each entity to its right type always. Only include what you want extracted, avoid unnecessary data in your tag.
  2. **Tag consistently**:  The same entity should have the same tag across all the files.
  3. **Tag completely**: Tag all the instances of the entity in all your files.

3. **Train model**: This is where the magic happens, your model starts learning from you tagged data.

4. **View model evaluation details**: After training is completed, view model evaluation details and review model performance.

5. **Improve model**: After reviewing model evaluation details, you can go ahead and learn how you can improve the model.

6. **Deploy model**: Deploying a model is to make it available for use via the [Analyze API](../../extras/Microsoft.CustomText.Runtime.v3.1-preview.1.json).

7. **Extract entities**: Use your custom modeled for entity extraction tasks.
