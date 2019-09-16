---
title: Developer resources - Language Understanding
titleSuffix: Azure Cognitive Services
description: Developers have both REST APIs and SDKs for Language Understanding. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 09/16/2019
ms.author: diberry
---

# Developer resources for Language Understanding

Developers can use both REST APIs and SDKs for Language Understanding. 

## Azure resource management

Use the Azure Cognitive Services Management layer to create, edit, list, and delete the Language Understanding or Cognitive Service resource:

* [Azure CLI](https://docs.microsoft.com/cli/azure/cognitiveservices?view=azure-cli-latest#az_cognitiveservices_list)
* [Azure RM PowerShell](https://docs.microsoft.com/powershell/module/azurerm.cognitiveservices/?view=azurermps-4.4.1#cognitive_services)

## Language Understanding authoring and prediction requests

The Language Understanding service is accessed from an Azure resource you need to create. There are two resources: authoring and prediction endpoint resources. Both of these resources allow you to control your LUIS resources. 

|Language |Reference documentation| Package|Samples|Quickstarts|
|--|--|--|--|--|
|C#|[Authoring](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring?view=azure-dotnet)</br>[Prediction](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime?view=azure-dotnet)|[NuGet authoring](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Authoring/)<br>[NuGet prediction](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/)|[.Net SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/LUIS)|[Create and manage app](sdk-csharp-quickstart-authoring-app.md)<br>[Query prediction endpoint](sdk-csharp-quickstart-query-prediction-endpoint.md)|
|Go||||
|Java||||
|Node.js||||
|Powershell||||
|Python||||
|REST||||

## Bot framework integration with Language Understanding

Working 