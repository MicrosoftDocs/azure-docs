---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Typical workflow

To use this feature, you submit data for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data.

1. Create an Azure AI Language resource, which grants you access to the features offered by Azure AI Language. It will generate a password (called a key) and an endpoint URL that you'll use to authenticate API requests.

2. Create a request using either the REST API or the client library for C#, Java, JavaScript, and Python. You can also send asynchronous calls with a batch request to combine API requests for multiple features into a single call.

3. Send the request containing your data as raw unstructured text. Your key and endpoint will be used for authentication.

4. Stream or store the response locally. 
