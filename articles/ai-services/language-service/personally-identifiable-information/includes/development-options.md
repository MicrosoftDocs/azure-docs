---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 01/10/2023
ms.author: aahi
---

To use PII detection, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no customization to the model used on your data. There are two ways to use PII detection:


|Development option  |Description  |
|---------|---------|
|Language studio     | Language Studio is a web-based platform that lets you try entity linking with text examples without an Azure account, and your own data when you sign up. For more information, see the [Language Studio website](https://language.cognitive.azure.com/tryout/pii) or [language studio quickstart](../../language-studio.md).         |
|REST API or Client library (Azure SDK)      | Integrate PII detection into your applications using the REST API, or the client library available in various languages. For more information, see the [PII detection quickstart](../quickstart.md).        |
