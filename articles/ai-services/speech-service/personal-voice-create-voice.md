---
title: Create a speaker profile ID for the personal voice - Speech service
titleSuffix: Azure AI services
description: Learn about how to create a speaker profile ID for the personal voice. 
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/24/2023
ms.author: eur
---

# Create a speaker profile ID for the personal voice (preview) 

[!INCLUDE [Personal voice preview](./includes/previews/preview-personal-voice.md)]

Personal voice creates a voice ID based on the speaker verbal statement file and the audio prompt (a clean human voice sample longer than 60 seconds). The user's voice characteristics are encoded in the voice ID that's used to generate synthesized audio with the text input provided. 

First, you create a training set and get it's resource ID. Then, using the resource ID, you can upload a set of audio and script files.

## Create personal voice

To create a training set, use the `PersonalVoices_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `projectId` property. 
- Set the required `consentId` property. 
- Set the required `audios` property. Within the `audios` property, set the following properties:
  - Set the required `containerUrl` property to the URL of the Azure Blob Storage container that contains the audio files.
  - Set the required `extensions` property to the extensions of the audio files. 
  - Optionally, set the `prefix` property to set a prefix for the blob name. 
- Optionally, remove or replace `JessicaPersonalVoiceId` with a personal voice ID of your choice. The case sensitive ID will be used in the personal voice's URI (and speaker profile ID) and can't be changed later. 

Make an HTTP POST request using the URI as shown in the following `PersonalVoices_Create` example. 
- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "projectId": "JessicaProjectId",
  "consentId": "JessicaConsentId",
  "id": "JessicaPersonalVoiceId",
  "audios": {
    "containerUrl": "https://contoso.blob.core.windows.net/voicecontainer?mySasToken",
    "prefix": "jessica/",
    "extensions": [
      "*.wav"
    ]
  }
} '  "https://YourServiceRegion.api.cognitive.microsoft.com/customvoice/personalvoices?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "JessicaPersonalVoiceId",
  "speakerProfileId": "3059912f-a3dc-49e3-bdd0-02e449df1fe3",
  "projectId": "JessicaProjectId",
  "consentId": "JessicaConsentId",
  "status": "NotStarted",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

The response header contains the `Operation-Location` property. Use this URI to get details about the `PersonalVoices_Create` operation. Here's an example of the response header:

```HTTP 201
Operation-Location: https://eastus.api.cognitive.microsoft.com/customvoice/operations/1321a2c0-9be4-471d-83bb-bc3be4f96a6f?api-version=2023-12-01-preview
Operation-Id: 1321a2c0-9be4-471d-83bb-bc3be4f96a6f
```

## Next steps

- [Use personal voice in your application](./personal-voice-how-to-use.md).
- Learn more about custom neural voice in the [overview](custom-neural-voice.md).
- Learn more about Speech Studio in the [overview](speech-studio-overview.md).