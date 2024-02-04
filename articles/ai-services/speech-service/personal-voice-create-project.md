---
title: Create a project for personal voice - Speech service
titleSuffix: Azure AI services
description: Learn about how to create a project for personal voice. 
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 1/10/2024
ms.author: eur
---

# Create a project for personal voice (preview)

[!INCLUDE [Personal voice preview](./includes/previews/preview-personal-voice.md)]

Personal voice projects contain the user consent statement and the personal voice ID. You can only create a personal voice project using the custom voice API. You can't create a personal voice project in the Speech Studio.

## Create a project

To create a personal voice project, use the `Projects_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `kind` property to `PersonalVoice`. The kind can't be changed later.
- Optionally, set the `description` property for the project description. The project description can be changed later.

Make an HTTP PUT request using the URI as shown in the following `Projects_Create` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `ProjectId` with a project ID of your choice. The case sensitive ID must be unique within your Speech resource. The ID will be used in the project's URI and can't be changed later. 

```azurecli-interactive
curl -v -X PUT -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
  "description": "Project description",
  "kind": "PersonalVoice"
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/projects/ProjectId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "ProjectId",
  "description": "Project description",
  "kind": "PersonalVoice",
  "createdDateTime": "2023-04-01T05:30:00.000Z"
}
```

You use the project `id` in subsequent API requests to [add user consent](./personal-voice-create-consent.md) and [get a speaker profile ID](./personal-voice-create-voice.md).

## Next steps

> [!div class="nextstepaction"]
> [Add user consent to the personal voice project.](./personal-voice-create-consent.md)
