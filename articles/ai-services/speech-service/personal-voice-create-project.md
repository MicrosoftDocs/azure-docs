---
title: Create a project for personal voice - Speech service
titleSuffix: Azure AI services
description: Learn about how to create a project for personal voice. 
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/24/2023
ms.author: eur
---

# Create a project for personal voice (preview)

[!INCLUDE [Personal voice preview](./includes/previews/preview-personal-voice.md)]

Personal voice projects contain the user consent statement, training datasets, and the personal voice ID that's used for text to speech. You can only create a personal voice project using the custom voice API. You can't create a personal voice project in the Speech Studio.

## Create a project

To create a personal voice project, use the `Projects_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `description` property. The description can be changed later.
- Set the required `kind` property to `PersonalVoice`. The kind can't be changed later.
- Optionally, remove or replace `JessicaProjectId` with a project ID of your choice. The case sensitive ID must be unique within your Speech resource. The ID will be used in the project's URI and can't be changed later. 
- Optionally, set the `displayName` property for the project name. The project name can be changed later.

Make an HTTP POST request using the URI as shown in the following `Projects_Create` example. 
- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "id": "JessicaProjectId",
  "displayName": "Project name for Jessica Voice",
  "description": "Project description for Jessica Voice",
  "kind": "PersonalVoice"
} '  "https://YourServiceRegion.api.cognitive.microsoft.com/customvoice/projects?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "JessicaProjectId",
  "displayName": "Project name for Jessica Voice",
  "description": "Project description for Jessica Voice",
  "kind": "PersonalVoice",
  "createdDateTime": "2023-04-01T05:30:00.000Z"
}
```

You use the project `id` in subsequent API requests to [add user consent](./personal-voice-create-consent.md), [create a training set](./personal-voice-create-training-set.md), and [get a speaker profile ID](./personal-voice-create-voice.md).

## Next steps

- [Upload consent file](./personal-voice-create-consent.md). 
- [Upload an audio recording of the voice talent as a training set](./personal-voice-create-training-set.md).
- [Use personal voice in your application](./personal-voice-how-to-use.md).