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

## Create a training set

To create a personal voice project, use the `Projects_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `locale` property. This should be the locale of the contained datasets. The locale can't be changed later.
- Set the required `displayName` property. This is the project name that will be displayed in the Speech Studio.

Make an HTTP POST request using the URI as shown in the following `Projects_Create` example. 
- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.
- Optionally, remove or replace `JessicalId` with a project ID of your choice. The case sensitive ID must be unique within your Speech resource. The ID will be used in the project's URI (and the Speech Studio URL) and can't be changed later. 

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "description": "Project for Jessica Voice",
  "kind": "PersonalVoice",
} '  "https://YourServiceRegion.api.cognitive.microsoft.com/customvoice/projects/JessicaId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "JessicaId",
  "description": "Project for Jessica Voice",
  "kind": "PersonalVoice",
  "createdDateTime": "2023-04-01T05:30:00.000Z"
}
```

## Upload training set

To upload a consent file, use the `Projects_UploadConsentFile` operation of the custom voice API. Construct the request body according to the following instructions:



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
} '  "https://YourServiceRegion.api.cognitive.microsoft.com/customvoice/trainingsets/d6916a55-2cbc-4ed4-bd19-739e9a13b0ab:upload?api-version=2023-12-01-preview"
```


## Next steps

- [Upload consent file](./personal-voice-create-consent.md). 
- [Use personal voice in your application](./personal-voice-how-to-use.md).