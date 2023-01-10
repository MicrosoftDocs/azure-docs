---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 01/10/2023
ms.author: aahi
---

To use language detection, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are two ways to use language detection:


|Development option  |Description  |
|---------|---------|
|Language studio     | Language Studio is a web-based platform that lets you use language detection both with text examples before signing up for an Azure account, and your own data when you sign up. See the [Language Studio website](https://language.cognitive.azure.com/tryout/detectLanguage) or [language studio quickstart](../../language-studio.md) for more information.         |
|REST API or Client library (Azure SDK)      | Integrate language detection into your applications using the REST API, or the client library available in a variety of languages. See the [language detection quickstart](../quickstart.md) for more information.        |
| Docker container | Use the available Docker container to [deploy this feature on-premises](../how-to/use-containers.md). These docker containers enable you to bring the service closer to your data for compliance, security, or other operational reasons. |