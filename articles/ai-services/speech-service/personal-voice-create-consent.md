---
title: Add user consent to the personal voice project - Speech service
titleSuffix: Azure AI services
description: Learn about how to add user consent to the personal voice project. 
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/24/2023
ms.author: eur
---

# Add user consent to the personal voice (preview) project

[!INCLUDE [Personal voice preview](./includes/previews/preview-personal-voice.md)]

With the personal voice feature, it's required that every voice be created with explicit consent from the user. A recorded statement from the user is required acknowledging that the customer (Azure AI Speech resource owner) will create and use their voice.

To add user consent to the personal voice project, you get the prerecorded consent audio file from a publicly accessible URL (`Consents_Create`) or upload the audio file (`Consents_Post`). In this article, you add consent from a URL. 

## Add consent from a URL

To add consent to a personal voice project from the URL of an audio file, use the `Consents_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `projectId` property. See [create a project](./personal-voice-create-project.md).
- Set the required `voiceTalentName` property. The voice talent name can't be changed later.
- Set the required `companyName` property. The company name can't be changed later.
- Set the required `audioUrl` property. The public accessible URL of the consent audio file.
- Set the required `locale` property. This should be the locale of the consent. The locale can't be changed later. You can find the text to speech locale list [here](/azure/ai-services/speech-service/language-support?tabs=tts).
- Optionally, remove or replace `JessicaConsentId` with a consent ID of your choice. The case sensitive ID will be used in the consent's URI and can't be changed later. 

Make an HTTP POST request using the URI as shown in the following `Consents_Create` example. 
- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "description": "Consent for Jessica voice",
  "id": "JessicaConsentId",
  "projectId": "JessicaProjectId",
  "voiceTalentName": "Jessica Smith",
  "companyName": "Contoso",
  "audioUrl": "https://contoso.blob.core.windows.net/public/jessica-consent.wav",
  "locale": "en-US"
} '  "https://YourServiceRegion.api.cognitive.microsoft.com/customvoice/consents?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "JessicaConsentId",
  "description": "Consent for Jessica voice",
  "projectId": "JessicaProjectId",
  "voiceTalentName": "Jessica Smith",
  "companyName": "Contoso",
  "locale": "en-US",
  "status": "NotStarted",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

The response header contains the `Operation-Location` property. Use this URI to get details about the `Consents_Create` operation. Here's an example of the response header:

```HTTP 201
Operation-Location: https://eastus.api.cognitive.microsoft.com/customvoice/operations/070f7986-ef17-41d0-ba2b-907f0f28e314?api-version=2023-12-01-preview
Operation-Id: 070f7986-ef17-41d0-ba2b-907f0f28e314
```

## Next steps

- [Upload an audio recording of the voice talent as a training set](./personal-voice-create-training-set.md).
- [Use personal voice in your application](./personal-voice-how-to-use.md).