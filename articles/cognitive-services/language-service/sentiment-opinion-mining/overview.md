---
title: What is sentiment analysis and opinion mining in Azure Cognitive Service for Language?
titleSuffix: Azure Cognitive Services
description: An overview of the sentiment analysis feature in Azure Cognitive Services, which helps you find out what people think of a topic by mining text for clues.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 01/12/2023
ms.author: aahi
ms.custom: language-service-sentiment-opinion-mining, ignite-fall-2021
---

# What is sentiment analysis and opinion mining in Azure Cognitive Service for Language?

Sentiment analysis and opinion mining are features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. These features help you find out what people think of your brand or topic by mining text for clues about positive or negative sentiment, and can associate them with specific aspects of the text. 

Both sentiment analysis and opinion mining work with a variety of [written languages](./language-support.md).

#### [prebuilt model](#tab/prebuilt)

## Sentiment analysis 

The sentiment analysis feature provides sentiment labels (such as "negative", "neutral" and "positive") based on the highest confidence score found by the service at a sentence and document-level. This feature also returns confidence scores between 0 and 1 for each document & sentences within it for positive, neutral and negative sentiment. 

## Opinion mining

Opinion mining is a feature of sentiment analysis. Also known as aspect-based sentiment analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to words (such as the attributes of products or services) in text.

[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]

## Get started with sentiment analysis

[!INCLUDE [development options](./includes/development-options.md)]

#### [Custom model](#tab/custom)

Custom sentiment analysis enables users to build custom AI models to classify text into custom classes pre-defined by the user. By creating a Custom sentiment analysis project, developers can iteratively label data, train, evaluate, and improve model performance before making it available for consumption. The quality of the labeled data greatly impacts model performance. To simplify building and customizing your model, the service offers a custom web portal that can be accessed through the [Language studio](https://aka.ms/languageStudio). You can easily get started with the service by following the steps in this [quickstart](quickstart.md). 


## Project development lifecycle

Creating a Custom sentiment analysis project typically involves several different steps. 

:::image type="content" source="media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="media/development-lifecycle.png":::

Follow these steps to get the most out of your model:

1. **Define your schema**: Know your data and identify the [classes](glossary.md#class) you want differentiate between, to avoid ambiguity.

2. **Label your data**: The quality of data labeling is a key factor in determining model performance. Documents that belong to the same class should always have the same class, if you have a document that can fall into two classes use  **Multi label classification** projects. Avoid class ambiguity, make sure that your classes are clearly separable from each other, especially with single label classification projects.

3. **Train the model**: Your model starts learning from your labeled data.

4. **View the model's performance**: View the evaluation details for your model to determine how well it performs when introduced to new data.

5. **Deploy the model**: Deploying a model makes it available for use via the [Analyze API](https://aka.ms/ct-runtime-swagger).

6. **Classify text**: Use your custom model for Custom sentiment analysis tasks.

## Reference documentation and code samples

As you use Custom sentiment analysis, see the following reference documentation and samples for Azure Cognitive Service for Language:

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST APIs (Authoring)   | [REST API documentation](https://aka.ms/ct-authoring-swagger)        |         |
|REST APIs (Runtime)    | [REST API documentation](https://aka.ms/ct-runtime-swagger)        |         |
|C#  (Runtime)   | [C# documentation](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)        | [C# samples - Single label classification](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample9_SingleLabelClassify.md) [C# samples - Multi label classification](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample10_MultiLabelClassify.md)       |
| Java   (Runtime)  | [Java documentation](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)        | [Java Samples - Single label classification](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/SingleLabelClassifyDocument.java) [Java Samples - Multi label classification](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/MultiLabelClassifyDocument.java) |
|JavaScript (Runtime)     | [JavaScript documentation](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)        | [JavaScript samples - Single label classification](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-text-analytics_6.0.0-beta.1/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js) [JavaScript samples - Multi label classification](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-text-analytics_6.0.0-beta.1/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js) |
|Python (Runtime)| [Python documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?view=azure-python-preview&preserve-view=true)        | [Python samples - Single label classification](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_single_label_classify.py) [Python samples - Multi label classification](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_multi_label_classify.py) |


--- 


## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for sentiment analysis](/legal/cognitive-services/language-service/transparency-note-sentiment-analysis?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Developer reference](../includes/reference-samples-text-analytics.md)] 

## Next steps

There are two ways to get started using the entity linking feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Language service features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  
