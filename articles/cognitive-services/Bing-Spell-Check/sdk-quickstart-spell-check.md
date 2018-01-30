---
title: Web Spell Check SDK quickstart | Microsoft Docs
description: Setup for Spell Check SDK console application.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-spell-check
ms.topic: article
ms.date: 01/30/2018
ms.author: v-gedod
---

#Spell Check SDK quickstart
The Bing Spell Check SDK contains the functionality of the REST API for spell check. 

##Application dependencies

To set up a console application using the Bing Spell Check SDK, browse to the `Manage NuGet Packages` option from the Solution Explorer in Visual Studio.  Add the `Microsoft.Azure.CognitiveServices.SpellCheck` package.

[SpellCheck SDK package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.SpellCheck/1.1.0-preview)

##Web Search client
To create an instance of the `SpellCheckAPI` client, add using directive:
```
using Microsoft.Azure.CognitiveServices.SpellCheck;

```
Then, instantiate the client:
```
var client = new SpellCheckAPI(new ApiKeyServiceClientCredentials("YOUR-ACCESS-KEY"));


```


##Next steps

[Cognitive services .NET SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)
