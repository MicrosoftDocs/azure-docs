---
title: What is entity linking in Azure Cognitive Service for Language?
titleSuffix: Azure Cognitive Services
description: An overview of entity linking in Azure Cognitive Services, which helps you extract entities from text, and provides links to an online knowledge base.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 06/15/2022
ms.author: aahi
ms.custom: language-service-entity-linking, ignite-fall-2021
---

# What is entity linking in Azure Cognitive Service for Language?

Entity linking is one of the features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. Entity linking identifies and disambiguates the identity of entities found in text. For example, in the sentence "*We went to Seattle last week.*", the word "*Seattle*" would be identified, with a link to more information on Wikipedia.

This documentation contains the following types of articles:

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/call-api.md) contain instructions for using the service in more specific ways.

## Get started with entity linking

To use this feature, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are three ways to use entity linking:

:::row:::
    :::column span="":::
        **Development option**
    :::column-end:::
    :::column span="":::
        **Description**
    :::column-end:::
    :::column span="":::
      **Links**
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        Language Studio
    :::column-end:::
    :::column span="":::
        Language Studio is a web-based platform that lets you use entity linking both with text examples before signing up for an Azure account, and your own data when you sign up.
    :::column-end:::
    :::column span="":::
        * [Language Studio website](https://language.cognitive.azure.com/tryout/linkedEntities)
        * [Quickstart: Use Language Studio](../language-studio.md)
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        REST API or Client library (Azure SDK) 
    :::column-end:::
    :::column span="":::
        Integrate entity linking into your applications using the REST API, or the client library available in a variety of languages.
    :::column-end:::
    :::column span="":::
        * [Quickstart: Use entity linking](quickstart.md)
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        Docker container
    :::column-end:::
    :::column span="":::
        Use the available Docker container to deploy this feature on-premises, letting you bring the service closer to your data for compliance, security, or other operational reasons.
    :::column-end:::
    :::column span="":::
        * [How to deploy on-premises](how-to/use-containers.md)
   :::column-end:::
:::row-end:::

<!--
|Development option  |Description  | Links | 
|---------|---------|---------|
| Language Studio    | Language Studio is a web-based platform that lets you use entity linking both with text examples before signing up for an Azure account, and your own data when you sign up.  | * [Language Studio website](https://language.cognitive.azure.com/tryout/linkedEntities) <br> * [Quickstart: Use Language Studio](../language-studio.md) |
| REST API or Client library (Azure SDK)     | Integrate entity linking into your applications using the REST API, or the client library available in a variety of languages. | * [Quickstart: Use entity linking](quickstart.md)  |
| Docker container | Use the available Docker container to deploy this feature on-premises, letting you bring the service closer to your data for compliance, security, or other operational reasons. | * [How to deploy on-premises](how-to/use-containers.md) |


The result will be a collection of recognized entities in your text, with URLs to Wikipedia as an online knowledge base. 

[!INCLUDE [Use Language Studio](./includes/use-language-studio.md)] 
-->
[!INCLUDE [Developer reference](../includes/reference-samples-text-analytics.md)] 

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for entity linking](/legal/cognitive-services/language-service/transparency-note?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Next steps

There are two ways to get started using the entity linking feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Azure Cognitive Service for Language features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  
