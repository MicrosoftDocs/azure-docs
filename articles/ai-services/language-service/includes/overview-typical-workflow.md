---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 01/31/2024
ms.author: jboback
---

## Typical workflow

To use this feature, you submit data for analysis and handle the API output in your application. Analysis is performed as-is, with no added customization to the model used on your data.

1. Create an Azure AI Language resource, which grants you access to the features offered by Azure AI Language. It generates a password (called a key) and an endpoint URL that you use to authenticate API requests.

2. Create a request using either the REST API or the client library for C#, Java, JavaScript, and Python. You can also send asynchronous calls with a batch request to combine API requests for multiple features into a single call.

3. Send the request containing your text data. Your key and endpoint are used for authentication.

4. Stream or store the response locally.
