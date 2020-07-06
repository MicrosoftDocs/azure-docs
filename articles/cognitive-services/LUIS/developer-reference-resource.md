---
title: Developer resources - Language Understanding
description: SDKs, REST APIs, CLI, help you develop Language Understanding (LUIS) apps in your programming language. Manage your Azure resources and LUIS predictions.
ms.topic: reference
ms.date: 05/19/2020
---

# SDK, REST, and CLI developer resources for Language Understanding (LUIS)

SDKs, REST APIs, CLI, help you develop Language Understanding (LUIS) apps in your programming language. Manage your Azure resources and LUIS predictions.

## Azure resource management

Use the Azure Cognitive Services Management layer to create, edit, list, and delete the Language Understanding or Cognitive Service resource.

Find reference documentation based on the tool:

* [Azure CLI](https://docs.microsoft.com/cli/azure/cognitiveservices#az-cognitiveservices-list)

* [Azure RM PowerShell](https://docs.microsoft.com/powershell/module/azurerm.cognitiveservices/?view=azurermps-4.4.1#cognitive_services)


## Language Understanding authoring and prediction requests

The Language Understanding service is accessed from an Azure resource you need to create. There are two resources:

* Use the **authoring** resource for training to create, edit, train, and publish.
* Use the **prediction** for runtime to send user's text and receive a prediction.

Learn about the [V3 prediction endpoint](luis-migration-api-v3.md).

Use [Cognitive Services sample code](https://github.com/Azure-Samples/cognitive-services-quickstart-code) to learn and use the most common tasks.

### REST specifications

The [LUIS REST specifications](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/cognitiveservices/data-plane/LUIS), along with all [Azure REST specifications](https://github.com/Azure/azure-rest-api-specs), are publicly available on GitHub.

### REST APIs

Both authoring and prediction endpoint APIS are available from REST APIs:

|Type|Version|
|--|--|
|Authoring|[V2](https://go.microsoft.com/fwlink/?linkid=2092087)<br>[preview V3](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview)|
|Prediction|[V2](https://go.microsoft.com/fwlink/?linkid=2092356)<br>[V3](https://westcentralus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0/)|

### REST Endpoints

LUIS currently has 2 types of endpoints:

* **authoring** on the training endpoint
* query **prediction** on the runtime endpoint.

|Purpose|URL|
|--|--|
|V2 Authoring on training endpoint|`https://{your-resource-name}.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appID}/`|
|V3 Authoring on training endpoint|`https://{your-resource-name}.api.cognitive.microsoft.com/luis/authoring/v3.0-preview/apps/{appID}/`|
|V2 Prediction - all predictions on runtime endpoint|`https://{your-resource-name}.api.cognitive.microsoft.com/luis/v2.0/apps/{appId}?q={q}[&timezoneOffset][&verbose][&spellCheck][&staging][&bing-spell-check-subscription-key][&log]`|
|V3 Prediction - versions prediction on runtime endpoint|`https://{your-resource-name}.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/{appId}/versions/{versionId}/predict?query={query}[&verbose][&log][&show-all-intents]`|
|V3 Prediction - slot prediction on runtime endpoint|`https://{your-resource-name}.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/{appId}/slots/{slotName}/predict?query={query}[&verbose][&log][&show-all-intents]`|

The following table explains the parameters, denoted with curly braces `{}`, in the previous table.

|Parameter|Purpose|
|--|--|
|`your-resource-name`|Azure resource name|
|`q` or `query`|utterance text sent from client application such as chat bot|
|`version`|10 character version name|
|`slot`| `production` or `staging`|

### REST query string parameters

[!INCLUDE [V3 query params](./includes/v3-prediction-query-params.md)]

## App schema

The [app schema](app-schema-definition.md) is imported and exported in a `.json` or `.lu` format.

### Language-based SDKs

|Language |Reference documentation|Package|Samples|Quickstarts|
|--|--|--|--|--|
|C#|[Authoring](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring?view=azure-dotnet)</br>[Prediction](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime?view=azure-dotnet)|[NuGet authoring](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Authoring/)<br>[NuGet prediction](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/)|[.NET SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/LUIS)|[Create and manage app](sdk-authoring.md?pivots=programming-language-csharp)<br>[Query prediction endpoint](sdk-query-prediction-endpoint.md)|
|Go|[Authoring and prediction](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.0/luis)|[SDK](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.0/luis)|[Authoring](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/quickstarts/change-model/go)<br>[Prediction](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/quickstarts/analyze-text/go)|[Authoring and Prediction using REST](luis-get-started-get-intent-from-rest.md)|
|Java|[Authoring and prediction](https://docs.microsoft.com/java/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-java-stable)|[Maven authoring](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-luis-authoring)<br>[Maven prediction](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-luis-runtime)|[Authoring](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/quickstarts/change-model/java)<br>[Prediction](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/quickstarts/analyze-text/java)|[Authoring and Prediction](luis-get-started-get-intent-from-rest.md)
|Node.js|[Authoring](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-authoring/?view=azure-node-latest)<br>[Prediction](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-runtime/?view=azure-node-latest)|[NPM authoring](https://www.npmjs.com/package/@azure/cognitiveservices-luis-authoring)<br>[NPM prediction](https://www.npmjs.com/package/@azure/cognitiveservices-luis-runtime)|[Authoring](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/quickstarts/change-model/node)<br>[Prediction](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/quickstarts/analyze-text/node)|[Authoring and Prediction using REST](luis-get-started-get-intent-from-rest.md)|
|Python|[Authoring and prediction](sdk-authoring.md?pivots=programming-language-python)|[Pip](https://pypi.org/project/azure-cognitiveservices-language-luis/)|[Authoring](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/LUIS/application_quickstart.py)|[Authoring](sdk-authoring.md?pivots=programming-language-python)<br>[Prediction using REST](luis-get-started-get-intent-from-rest.md)


### Containers

Language Understanding (LUIS) provides a [container](luis-container-howto.md) to provide on-premises and contained versions of your app.

### Export and import formats

Language Understanding provides the ability to manage your app and its models in a JSON format, the `.LU` ([LUDown](https://github.com/microsoft/botbuilder-tools/blob/master/packages/Ludown)) format, and a compressed package for the Language Understanding container.

Importing and exporting these formats is available from the APIs and from the LUIS portal. The portal provides import and export as part of the Apps list and Versions list.

## Workshops

* GitHub: (Workshop) [Conversational-AI : NLU using LUIS](https://github.com/GlobalAICommunity/Workshop-Conversational-AI)

## Continuous integration tools

* GitHub: (Preview) [Developing a LUIS app using DevOps practices](https://github.com/Azure-Samples/LUIS-DevOps-Template)
* GitHub: [NLU.DevOps](https://github.com/microsoft/NLU.DevOps) - Tools supporting continuous integration and deployment for NLU services.

## Bot Framework tools

The bot framework is available as [an SDK](https://github.com/Microsoft/botframework) in a variety of languages and as a service using [Azure Bot Service](https://dev.botframework.com/).

Bot framework provides [several tools](https://github.com/microsoft/botbuilder-tools) to help with Language Understanding, including:

* [LUDown](https://github.com/microsoft/botbuilder-tools/blob/master/packages/Ludown) - Build LUIS language understanding models using markdown files
* [LUIS CLI](https://github.com/microsoft/botbuilder-tools/blob/master/packages/LUIS) - Create and manage your LUIS.ai applications
* [Dispatch](https://github.com/microsoft/botbuilder-tools/blob/master/packages/Dispatch)- manage parent and child apps
* [LUISGen](https://github.com/microsoft/botbuilder-tools/blob/master/packages/LUISGen) - Auto generate backing C#/Typescript classes for your LUIS intents and entities.
* [Bot Framework emulator](https://github.com/Microsoft/BotFramework-Emulator/releases) - a desktop application that allows bot developers to test and debug bots built using the Bot Framework SDK
* [Bot Framework Composer](https://github.com/microsoft/BotFramework-Composer/blob/stable/README.md) - an integrated development tool for developers and multi-disciplinary teams to build bots and conversational experiences with the Microsoft Bot Framework
* [Bot Framework Samples](https://github.com/microsoft/botbuilder-samples) - in #C, JavaScript, TypeScript, and Python
## Next steps

* Learn about the common [HTTP error codes](luis-reference-response-codes.md)
* [Reference documentation](https://docs.microsoft.com/azure/index) for all APIs and SDKs
* [Bot framework](https://github.com/Microsoft/botbuilder-dotnet) and [Azure Bot Service](https://dev.botframework.com/)
* [LUDown](https://github.com/microsoft/botbuilder-tools/blob/master/packages/Ludown)
* [Cognitive Containers](../cognitive-services-container-support.md)
