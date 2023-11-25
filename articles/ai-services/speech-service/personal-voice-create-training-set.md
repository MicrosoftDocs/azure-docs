---
title: Upload a personal voice training dataset - Speech service
titleSuffix: Azure AI services
description: Learn about how to upload a training dataset for personal voice. 
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/24/2023
ms.author: eur
---

# Upload a personal voice (preview) training dataset

[!INCLUDE [Personal voice preview](./includes/previews/preview-personal-voice.md)]

Personal voice creates a voice ID based on the speaker verbal statement file and the audio prompt (a clean human voice sample longer than 60 seconds). The user's voice characteristics are encoded in the voice ID that's used to generate synthesized audio with the text input provided. 

First, you create a training set and get it's resource ID. Then, using the resource ID, you can upload a set of audio and script files.

## Create a training set

To create a training set, use the `TrainingSets_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `projectId` property. 
- Set the required `description` property. The description can be changed later.
- Set the required `voiceKind` property to `Male` or `Female`. The kind can't be changed later. 
- Set the required `locale` property. This should be the locale of the consent. The locale can't be changed later. You can find the text to speech locale list [here](/azure/ai-services/speech-service/language-support?tabs=tts).
- Optionally, set the `displayName` property for the training set name. The training set name can be changed later.
- Optionally, remove or replace `JessicaTrainingId` with a training set ID of your choice. The case sensitive ID will be used in the training set's URI and can't be changed later. 

Make an HTTP POST request using the URI as shown in the following `TrainingSets_Create` example. 
- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "description": "300 sentences Jessica data in general style.",
  "displayName": "Training set name",
  "id": "JessicaTrainingId",
  "projectId": "JessicaProjectId",
  "locale": "en-US",
  "voiceKind": "Female"
} '  "https://YourServiceRegion.api.cognitive.microsoft.com/customvoice/trainingsets?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "JessicaTrainingId",
  "description": "300 sentences Jessica data in general style.",
  "projectId": "JessicaProjectId",
  "locale": "en-US",
  "voiceKind": "Female",
  "status": "Succeeded",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

## Upload training set

To upload a training set of audio and scripts, use the `TrainingSets_UploadData` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `kind` property to `AudioAndScript`. The kind determines the type of training set. 
- Set the required `audios` property. Within the `audios` property, set the following properties:
  - Set the required `containerUrl` property to the URL of the Azure Blob Storage container that contains the audio files.
  - Set the required `extensions` property to the extensions of the audio files. 
  - Optionally, set the `prefix` property to set a prefix for the blob name. 
- Set the required `scripts` property. Within the `scripts` property, set the following properties:
  - Set the required `containerUrl` property to the URL of the Azure Blob Storage container that contains the script files.
  - Set the required `extensions` property to the extensions of the script files.
  - Optionally, set the `prefix` property to set a prefix for the blob name.

Make an HTTP POST request using the URI as shown in the following `TrainingSets_UploadData` example. 
- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.
- Replace `JessicaTrainingId` if you used a different training set ID in the previous step.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "kind": "AudioAndScript",
  "audios": {
    "containerUrl": "https://contoso.blob.core.windows.net/voicecontainer?mySasToken",
    "prefix": "jessica300/",
    "extensions": [
      "*.wav"
    ]
  },
  "scripts": {
    "containerUrl": "https://contoso.blob.core.windows.net/voicecontainer?mySasToken",
    "prefix": "jessica300/",
    "extensions": [
      "*.txt"
    ]
  }
} '  "https://YourServiceRegion.api.cognitive.microsoft.com/customvoice/trainingsets/JessicaTrainingId:upload?api-version=2023-12-01-preview"
```

The response header contains the `Operation-Location` property. Use this URI to get details about the `TrainingSets_UploadData` operation. Here's an example of the response header:

```HTTP 201
Operation-Location: https://eastus.api.cognitive.microsoft.com/customvoice/operations/284b7e37-f42d-4054-8fa9-08523c3de345?api-version=2023-12-01-preview
Operation-Id: 284b7e37-f42d-4054-8fa9-08523c3de345
```

## Next steps

- [Create a personal voice](./personal-voice-create-voice.md).
- [Upload consent file](./personal-voice-create-consent.md). 
- [Use personal voice in your application](./personal-voice-how-to-use.md).