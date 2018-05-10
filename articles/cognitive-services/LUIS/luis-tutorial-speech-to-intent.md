---
title: Use Speech C# SDK with LUIS - Azure | Microsoft Docs 
titleSuffix: Azure
description: Use the Speech C# SDK sample to speak into microphone and get LUIS intent and entities predictions returned.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/10/2018
ms.author: v-geberr;
#Customer intent: Use speech service and get LUIS prediction information -- without calling LUIS directly.
---

# Integrate Speech service
The [Speech service](https://docs.microsoft.com/azure/cognitive-services/Speech-Service/) allows you to use a single request to receive audio and return LUIS prediction JSON objects.

In this article, you will download and use a C# project in Visual Studio to speak an utterance into a microphone and receive LUIS prediction information. 

For this article, you need a free [LUIS][LUIS] account in order to author your LUIS application.

## Import Human Resources LUIS app
The intents, and utterances for this article are from the Human Resources LUIS app available from the [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples) Github repository. Download the [HumanResources.json](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/HumanResources.json) file and [import](create-new-app.md#import-new-app) it into LUIS. 

This app has intents, entities, and utterances related to the Human Resources domain. Example utterances include:

```
Who is John Smith's manager?
Who does John Smith manage?
Where is Form 123456?
Do I have any paid time off?
```

Train and publish the app. Collect the app ID, publish region, and subscription ID. These are all included in the endpoint URL on the Publish page. 

https://**REGION**.api.cognitive.microsoft.com/luis/v2.0/apps/**APPID**?subscription-key=**LUISKEY**&q=

## Download LUIS Sample project
 Clone or download the [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples) repository. Open the [Speech to intent project](https://github.com/Microsoft/LUIS-Samples/tree/master/documentation-samples/tutorial-speech-intent-recognition) with Visual Studio and restore the NuGet packages. The VS solution file is .\LUIS-Samples-master\documentation-samples\tutorial-speech-intent-recognition\csharp\csharp_samples.sln.

The Speech SDK is already included as a reference. 

[![](./media/luis-tutorial-speech-to-intent/nuget-package.png "Screenshot of Visual Studio 2017 displaying Microsoft.CognitiveServices.Speech NuGet package")](./media/luis-tutorial-speech-to-intent/nuget-package.png#lightbox)

## Modify the C# code
Open the **LUIS_samples.cs** file and change the following variables:

|Variable name|Purpose|
|--|--|
|luisSubscriptionKey|Corresponds to endpoint URL's subscription-key value from Publish page|
|luisRegion|Corresponds to endpoint URL's first subdomain|
|luisAppId|Corresponds to endpoint URL's route following **apps/**|

[![](./media/luis-tutorial-speech-to-intent/change-variables.png "Screenshot of Visual Studio 2017 displaying LUIS_samples.cs variables")](./media/luis-tutorial-speech-to-intent/change-variables.png#lightbox)

The file already has the Human Resources intents mapped.

[![](./media/luis-tutorial-speech-to-intent/intents.png "Screenshot of Visual Studio 2017 displaying LUIS_samples.cs intents")](./media/luis-tutorial-speech-to-intent/intents.png#lightbox)

This LUIS code is called when a user select 8 from the command line and speaks an utterance into the system microphone.

!["Screenshot of command line app with menu"](./media/luis-tutorial-speech-to-intent/cmdline-1.png )

cmdline-1

## Test code with utterance
## Review prediction results
## Clean up resources

## Next steps

> [!div class="nextstepaction"]
> [Integrate LUIS with a BOT](luis-csharp-tutorial-build-bot-framework-sample.md)

[LUIS]: luis-reference-regions.md