---
title: What is Custom Named Entity Recognition (NER) in Language Services - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how use Custom Named Entity Recognition (NER) with the Language Services API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 09/20/2021
ms.author: aahi
---

# What is Custom Named Entity Recognition (NER)?

Custom NER is a cloud-based API service that is built using transformer-based models from [Microsoft Turing](https://msturing.org/about) to extract information from unstructured documents.

[Azure Cognitive Service for Language](../overview.md) offers a pre-configured [Named Entity Recognition API](../named-entity-recognition/overview.md) for common named entity types, but custom NER lets you extract specific entities that are more relevant to your data. 

Building custom models can be a complex process that requires AI expertise. Custom NER simplifies many of the details required, letting you focus on building a model around your data. Your data can be previously tagged or you can tag it within the [Language Studio](https://language.azure.com).

This documentation contains the following article types:

* [Quickstarts](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [Concepts](concepts/recommended-practices.md) provide explanations of the service functionality and features.
* [How-to guides](how-to/tag-data.md) contain instructions for using the service in more specific or customized ways.

## Example: Use Custom NER for information extraction

With an abundance of electronic documents in an enterprise, the process of extracting information from them can be difficult and time consuming. With Custom NER, you can save a significant amount of time and effort by building custom models to ease the process of information extraction from unstructured documents like contracts or financial documents.

## Example: Use Custom NER for to enrich semantic search

Search can be foundational to apps that deliver text content to users, with common scenarios including: catalog or document search, retail product search, or knowledge mining for data science. Custom NER enables you to build your own custom models to extract specific entities from your unstructured text. You can also integrate the service with [Cognitive Search](/azure/search/search-what-is-azure-search) to enrich your index with the extracted entities from files.

## Development life cycle

Using Custom NER typically involves several different steps. 

:::image type="content" source="../custom-classification/media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="../custom-classification/media/development-lifecycle.png":::

1. **Define your schema**: Know your data and identify the entities you want extracted. Avoid ambiguity.

2. **Tag your data**: Tagging data is a key factor in determining model performance. Tag precisely, consistently and completely.
    1. **Tag precisely**: Tag each entity to its right type always. Only include what you want extracted, avoid unnecessary data in your tag.
    2. **Tag consistently**:  The same entity should have the same tag across all the files.
    3. **Tag completely**: Tag all the instances of the entity in all your files.

3. **Train model**: This is where the magic happens, your model starts learning from you tagged data.

4. **View the model evaluation details**: After training is completed, view the model's evaluation details and its performance.

5. **Improve the model**: After reviewing model evaluation details, you can go ahead and learn how you can improve the model.

6. **Deploy the model**: Deploying a model is to make it available for use.

7. **Extract entities**: Use your custom modeled for entity extraction tasks.

## Next steps

[Quickstart: Use Language Studio for Custom NER](quickstart.md)
