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

In this article, you download and use a C# project in Visual Studio to speak an utterance into a microphone and receive LUIS prediction information. The project uses the Speech [NuGet](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech/) package, already included as a reference. 

For this article, you need a free [LUIS][LUIS] website account in order to import the application.

## Import Human Resources LUIS app
The intents, and utterances for this article are from the Human Resources LUIS app available from the [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples) Github repository. Download the [HumanResources.json](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/HumanResources.json) file, save it with the *.json extension, and [import](create-new-app.md#import-new-app) it into LUIS. 

This app has intents, entities, and utterances related to the Human Resources domain. Example utterances include:

```
Who is John Smith's manager?
Who does John Smith manage?
Where is Form 123456?
Do I have any paid time off?
```

## Add KeyPhrase prebuilt entity
After importing the app, select **Entities**, then **Manage prebuilt entities**. Add the **KeyPhrase** entity. The KeyPhrase entity extracts key subject matter from the utterance.

## Train and publish the app
Train and publish the app. On the **Publish** page, collect the app ID, publish region, and subscription ID. You need to modify the code to use these values later in this article. 

These values are all included in the endpoint URL at the bottom of the **Publish** page. 

https://**REGION**.api.cognitive.microsoft.com/luis/v2.0/apps/**APPID**?subscription-key=**LUISKEY**&q=

## Download the LUIS Sample project
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

Build and run the app. 

![Screenshot of command line running program](./media/luis-tutorial-speech-to-intent/cmdline-1.png)

## Test code with utterance
Select **8** and speak into the microphone "Who is the manager of John Smith".

```cmd
1. Speech recognition with microphone input.
2. Speech recognition in the specified language.
3. Speech recognition with file input.
4. Speech recognition using customized model.
5. Speech continuous recognition using events.
6. Translation with microphone input.
7. Translation with file input.
8. Speech recognition of LUIS intent.
0. Stop.
Your choice: 8
LUIS...
Say something...
ResultId:cc83cebc9d6040d5956880bcdc5f5a98 Status:Recognized IntentId:<GetEmployeeOrgChart> Recognized text:<Who is the manager of John Smith?> Recognized Json:{"DisplayText":"Who is the manager of John Smith?","Duration":25700000,"Offset":9200000,"RecognitionStatus":"Success"}. LanguageUnderstandingJson:{
  "query": "Who is the manager of John Smith?",
  "topScoringIntent": {
    "intent": "GetEmployeeOrgChart",
    "score": 0.617331
  },
  "entities": [
    {
      "entity": "manager of john smith",
      "type": "builtin.keyPhrase",
      "startIndex": 11,
      "endIndex": 31
    }
  ]
}

Recognition done. Your Choice:

```

The correct intent, **GetEmployeeOrgChart**, was found with a 61% confidence. The keyphrase entity was returned. 

The Speech SDK returns the entire LUIS response. 

## Clean up resources
When no longer needed, delete the LUIS HumanResources app. To do so, select the three dot menu (...) to the right of the app name in the app list, select **Delete**. On the pop-up dialog **Delete app?**, select **Ok**.

Remember to delete the LUIS-Samples directory when you are done using the sample code.

## Next steps

> [!div class="nextstepaction"]
> [Integrate LUIS with a BOT](luis-csharp-tutorial-build-bot-framework-sample.md)

[LUIS]: luis-reference-regions.md#luis-website