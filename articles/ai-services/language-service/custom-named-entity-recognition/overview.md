---
title: Custom named entity recognition - Azure AI services
titleSuffix: Azure AI services
description: Customize an AI model to label and extract information from documents using Azure AI services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 02/22/2023
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021, event-tier1-build-2022
---

# What is custom named entity recognition?

Custom NER is one of the custom features offered by [Azure AI Language](../overview.md). It is a cloud-based API service that applies machine-learning intelligence to enable you to build custom models for custom named entity recognition tasks.

Custom NER enables users to build custom AI models to extract domain-specific entities from unstructured text, such as contracts or financial documents. By creating a Custom NER project, developers can iteratively label data, train, evaluate, and improve model performance before making it available for consumption. The quality of the labeled data greatly impacts model performance. To simplify building and customizing your model, the service offers a custom web portal that can be accessed through the [Language studio](https://aka.ms/languageStudio). You can easily get started with the service by following the steps in this [quickstart](quickstart.md). 
 
This documentation contains the following article types:

* [Quickstarts](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [Concepts](concepts/evaluation-metrics.md) provide explanations of the service functionality and features.
* [How-to guides](how-to/tag-data.md) contain instructions for using the service in more specific or customized ways.

## Example usage scenarios

Custom named entity recognition can be used in multiple scenarios across a variety of industries:

### Information extraction

Many financial and legal organizations extract and normalize data from thousands of complex, unstructured text sources on a daily basis. Such sources include bank statements, legal agreements, or bank forms. For example, mortgage application data extraction done manually by human reviewers may take several days to extract. Automating these steps by building a custom NER model simplifies the process and saves cost, time, and effort.

### Knowledge mining to enhance/enrich semantic search

Search is foundational to any app that surfaces text content to users. Common scenarios include catalog or document search, retail product search, or knowledge mining for data science. Many enterprises across various industries want to build a rich search experience over private, heterogeneous content, which includes both structured and unstructured documents. As a part of their pipeline, developers can use custom NER for extracting entities from the text that are relevant to their industry. These entities can be used to enrich the indexing of the file for a more customized search experience.

### Audit and compliance

Instead of manually reviewing significantly long text files to audit and apply policies, IT departments in financial or legal enterprises can use custom NER to build automated solutions. These solutions can be helpful to enforce compliance policies, and set up necessary business rules based on knowledge mining pipelines that process structured and unstructured content.

## Project development lifecycle

Using custom NER typically involves several different steps. 

:::image type="content" source="media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="media/development-lifecycle.png":::

1. **Define your schema**: Know your data and identify the [entities](glossary.md#entity) you want extracted. Avoid ambiguity.

2. **Label your data**: Labeling data is a key factor in determining model performance. Label precisely, consistently and completely.
    1. **Label precisely**: Label each entity to its right type always. Only include what you want extracted, avoid unnecessary data in your labels.
    2. **Label consistently**:  The same entity should have the same label across all the files.
    3. **Label completely**: Label all the instances of the entity in all your files.

3. **Train the model**: Your model starts learning from your labeled data.

4. **View the model's performance**: After training is completed, view the model's evaluation details, its performance and guidance on how to improve it. 

6. **Deploy the model**: Deploying a model makes it available for use via the [Analyze API](https://aka.ms/ct-runtime-swagger).

7. **Extract entities**: Use your custom models for entity extraction tasks.

## Reference documentation and code samples

As you use custom NER, see the following reference documentation and samples for Azure AI Language:

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST APIs (Authoring)   | [REST API documentation](https://aka.ms/ct-authoring-swagger)        |         |
|REST APIs (Runtime)    | [REST API documentation](https://aka.ms/ct-runtime-swagger)        |         |
|C# (Runtime)    | [C# documentation](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)        | [C# samples](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample8_RecognizeCustomEntities.md)        |
| Java  (Runtime)   | [Java documentation](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)        | [Java Samples](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/RecognizeCustomEntities.java) |
|JavaScript (Runtime)    | [JavaScript documentation](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)        | [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-text-analytics_6.0.0-beta.1/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js) |
|Python (Runtime) | [Python documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?view=azure-python-preview&preserve-view=true)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_recognize_custom_entities.py) |

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for custom NER](/legal/cognitive-services/language-service/cner-transparency-note?context=/azure/ai-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Next steps

* Use the [quickstart article](quickstart.md) to start using custom named entity recognition.  

* As you go through the project development lifecycle, review the [glossary](glossary.md) to learn more about the terms used throughout the documentation for this feature. 

* Remember to view the [service limits](service-limits.md) for information such as [regional availability](service-limits.md#regional-availability).
