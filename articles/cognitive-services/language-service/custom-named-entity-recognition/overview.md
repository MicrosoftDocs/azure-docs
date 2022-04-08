---
title: What is Custom Named Entity Recognition (NER) in Azure Cognitive Service for Language (preview)
titleSuffix: Azure Cognitive Services
description: Learn how use Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---

# What is custom named entity recognition (NER) (preview)?

Custom NER is one of the features offered by [Azure Cognitive Service for Language](../overview.md). It is a cloud-based API service that applies machine-learning intelligence to enable you to build custom models for text custom NER tasks.

Custom NER is offered as part of the custom features within [Azure Cognitive Service for Language](../overview.md). This feature enables its users to build custom AI models to extract domain-specific entities from unstructured text, such as contracts or financial documents. By creating a Custom NER project, developers can iteratively tag data, train, evaluate, and improve model performance before making it available for consumption. The quality of the tagged data greatly impacts model performance. To simplify building and customizing your model, the service offers a custom web portal that can be accessed through the [Language studio](https://aka.ms/languageStudio). You can easily get started with the service by following the steps in this [quickstart](quickstart.md). 
 
This documentation contains the following article types:

* [Quickstarts](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [Concepts](concepts/evaluation-metrics.md) provide explanations of the service functionality and features.
* [How-to guides](how-to/tag-data.md) contain instructions for using the service in more specific or customized ways.

## Example usage scenarios

### Information extraction

Many financial and legal organizations extract and normalize data from thousands of complex unstructured text, such as bank statements, legal agreements, or bank forms on a daily basis. Instead of manually processing these forms, custom NER can help automate this process and save cost, time, and effort..

### Knowledge mining to enhance/enrich semantic search

Search is foundational to any app that surfaces text content to users, with common scenarios including catalog or document search, retail product search, or knowledge mining for data science. Many enterprises across various industries are looking into building a rich search experience over private, heterogeneous content, which includes both structured and unstructured documents. As a part of their pipeline, developers can use Custom NER for extracting entities from the text that are relevant to their industry. These entities could be used to enrich the indexing of the file for a more customized search experience. 

### Audit and compliance

Instead of manually reviewing significantly long text files to audit and apply policies, IT departments in financial or legal enterprises can use custom NER to build automated solutions. These solutions help enforce compliance policies, and set up necessary business rules based on knowledge mining pipelines that process structured and unstructured contents.

## Application development lifecycle

Using Custom NER typically involves several different steps. 

:::image type="content" source="../custom-classification/media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="../custom-classification/media/development-lifecycle.png":::

1. **Define your schema**: Know your data and identify the entities you want extracted. Avoid ambiguity.

2. **Tag your data**: Tagging data is a key factor in determining model performance. Tag precisely, consistently and completely.
    1. **Tag precisely**: Tag each entity to its right type always. Only include what you want extracted, avoid unnecessary data in your tag.
    2. **Tag consistently**:  The same entity should have the same tag across all the files.
    3. **Tag completely**: Tag all the instances of the entity in all your files.

3. **Train model**: Your model starts learning from you tagged data.

4. **View the model evaluation details**: After training is completed, view the model's evaluation details and its performance.

5. **Improve the model**: After reviewing model evaluation details, you can go ahead and learn how you can improve the model.

6. **Deploy the model**: Deploying a model is to make it available for use.

7. **Extract entities**: Use your custom models for entity extraction tasks.

## Next steps

* Use the [quickstart article](quickstart.md) to start using custom named entity recognition.  

* As you go through the application development lifecycle, review the [glossary](glossary.md) to learn more about the terms used throughout the documentation for this feature. 

* Remember to view the [service limits](service-limits.md) for information such as [regional availability](service-limits.md#regional-availability).
