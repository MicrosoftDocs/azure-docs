---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 01/10/2023
ms.author: aahi
---

To use key phrase extraction, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are two ways to use key phrase extraction:


|Development option  |Description  |
|---------|---------|
|Language studio     | Language Studio is a web-based platform that lets you try entity linking with text examples without an Azure account, and your own data when you sign up. For more information, see the [Language Studio website](https://language.cognitive.azure.com/tryout/keyPhrases) or [language studio quickstart](../../language-studio.md).         |
|REST API or Client library (Azure SDK)      | Integrate key phrase extraction into your applications using the REST API, or the client library available in a variety of languages. For more information, see the [key phrase extraction quickstart](../quickstart.md).        |
| Docker container | Use the available Docker container to [deploy this feature on-premises](../how-to/use-containers.md). These docker containers enable you to bring the service closer to your data for compliance, security, or other operational reasons. |
