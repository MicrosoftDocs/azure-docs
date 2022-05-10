---
title: What is custom text classification (preview) in Azure Cognitive Services for Language?
titleSuffix: Azure Cognitive Services
description: Learn how use custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# What is custom text classification (preview)?

Custom text classification is one of the features offered by [Azure Cognitive Service for Language](../overview.md). It is a cloud-based API service that applies machine-learning intelligence to enable you to build custom models for text classification tasks. 

Custom text classification is offered as part of the custom features within Azure Cognitive for Language. This feature enables its users to build custom AI models to classify text into custom categories pre-defined by the user. By creating a custom text classification project, developers can iteratively tag data, train, evaluate, and improve model performance before making it available for consumption. The quality of the tagged data greatly impacts model performance. To simplify building and customizing your model, the service offers a custom web portal that can be accessed through the [Language studio](https://aka.ms/languageStudio). You can easily get started with the service by following the steps in this [quickstart](quickstart.md). 

Custom text classification supports two types of projects: 

* **Single label classification** - you can assign a single class for each file of your dataset. For example, a movie script could only be classified as "Action" or "Thriller". 
* **Multiple label classification** - You can assign multiple classes for each file of your dataset. For example, a movie script could be classified as "Action" or "Action and Thriller".

This documentation contains the following article types:

* [Quickstarts](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [Concepts](concepts/evaluation.md) provide explanations of the service functionality and features.
* [How-to guides](how-to/tag-data.md) contain instructions for using the service in more specific or customized ways.

## Example usage scenarios

### Automatic emails/ticket triage

Support centers of all types receive thousands to hundreds of thousands of emails/tickets containing unstructured, free-form text, and attachments. Timely review, acknowledgment, and routing to subject matter experts within internal teams is critical. However, email triage at this scale involving people to review and route to the right departments takes time and precious resources. Custom text classification can be used to analyze incoming text triage and categorize the content to be automatically routed to the relevant department to take necessary actions.

### Knowledge mining to enhance/enrich semantic search

Search is foundational to apps that display text content to users, with common scenarios including: catalog or document search, retail product search, or knowledge mining for data science. Many enterprises across various industries are looking into building a rich search experience over private, heterogeneous content, which includes both structured and unstructured documents. As a part of their pipeline, developers can use custom text classification to categorize text into classes that are relevant to their industry. The predicted classes could be used to enrich the indexing of the file for a more customized search experience. 

## Project development lifecycle

Creating a custom text classification project typically involves several different steps. 

:::image type="content" source="media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="media/development-lifecycle.png":::

Follow these steps to get the most out of your model:

1. **Define schema**: Know your data and identify the classes you want differentiate between, avoid ambiguity.

2. **Tag data**: The quality of data tagging is a key factor in determining model performance. Tag all the files you want to include in training. Files that belong to the same class should always have the same class, if you have a file that can fall into two classes use  **Multiple class classification** projects. Avoid class ambiguity, make sure that your classes are clearly separable from each other, especially with Single class classification projects.

3. **Train model**: Your model starts learning from your tagged data.

4. **View model evaluation details**: View the evaluation details for your model to determine how well it performs when introduced to new data.

5. **Improve model**: Work on improving your model performance by examining the incorrect model predictions and examining data distribution.

6. **Deploy model**: Deploying a model makes it available for use via the [Analyze API](https://aka.ms/ct-runtime-swagger).

7. **Classify text**: Use your custom modeled for text classification tasks.

## Next steps

* Use the [quickstart article](quickstart.md) to start using custom text classification.  

* As you go through the project development lifecycle, review the [glossary](glossary.md) to learn more about the terms used throughout the documentation for this feature. 

* Remember to view the [service limits](service-limits.md) for information such as [regional availability](service-limits.md#regional-availability).
