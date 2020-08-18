---
title: Metrics Monitor REST API quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 07/30/2020
ms.author: aahi
---
    
> [!TIP] Looking for example code that uses the REST API? The following samples are available on GitHub: 
> * [C#](https://github.com/Azure-Samples/cognitive-services-rest-api-samples/)
> * [Java](https://github.com/Azure-Samples/cognitive-services-rest-api-samples/)
> * [JavaScript](https://github.com/Azure-Samples/cognitive-services-rest-api-samples/)
> * [Python](https://github.com/Azure-Samples/cognitive-services-rest-api-samples/)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a [Product Name] resource"  target="_blank">create a [Product Name] resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to [Product Name]. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
   
## Setting up