---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.custom:
  - build-2024
ms.topic: include
ms.date: 05/07/2024
ms.author: jboback
---

To use summarization, you submit for analysis and handle the API output in your application. Analysis is performed as-is, with no added customization to the model used on your data. There are two ways to use summarization:

# [Text summarization](#tab/text-summarization)

|Development option  |Description  |
|---------|---------|
|Language studio     | Language Studio is a web-based platform that lets you try entity linking with text examples without an Azure account, and your own data when you sign up. For more information, see the [Language Studio website](https://language.cognitive.azure.com/tryout/summarization) or [language studio quickstart](../../language-studio.md).         |
|REST API or Client library (Azure SDK)      | Integrate text summarization into your applications using the REST API, or the client library available in various languages. For more information, see the [summarization quickstart](../quickstart.md).        |


# [Conversation summarization](#tab/conversation-summarization)

|Development option  |Description  | Links |
|---------|---------|---------|
| REST API     | Integrate conversation summarization into your applications using the REST API. | [Quickstart: Use conversation summarization](../quickstart.md?tabs=conversation-summarization&pivots=rest-api) |

Custom Summarization enables users to build custom AI models to summarize unstructured text, such as contracts or novels. By creating a Custom Summarization project, developers can iteratively label data, train, evaluate, and improve model performance before making it available for consumption. The quality of the labeled data greatly impacts model performance. To simplify building and customizing your model, the service offers a custom web portal that can be accessed through the [Language studio](https://aka.ms/languageStudio). You can easily get started with the service by following the steps in this [quickstart](../custom/quickstart.md).

# [Document summarization](#tab/document-summarization)

|Development option  |Description  |
|---------|---------|
|Language studio     | Language Studio is a web-based platform that lets you try entity linking with text examples without an Azure account, and your own data when you sign up. For more information, see the [Language Studio website](https://language.cognitive.azure.com/tryout/summarization) or [language studio quickstart](../../language-studio.md).         |
|REST API or Client library (Azure SDK)      | Integrate text summarization into your applications using the REST API, or the client library available in various languages. For more information, see the [summarization quickstart](../quickstart.md).  

---
