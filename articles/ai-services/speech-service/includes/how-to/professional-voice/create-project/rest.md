---
 title: include file
 description: include file
 author: eur
 ms.author: eric-urban
 ms.service: azure-ai-services
 ms.topic: include
 ms.date: 11/24/2023
 ms.custom: include
---

Professional voice projects contain the voice talent consent statement, training datasets, voice models, and endpoints.

## Create a project

To create a professional voice project, use the `Projects_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `description` property. The description can be changed later.
- Set the required `kind` property to `ProfessionalVoice`. The kind can't be changed later.
- Optionally, set the `displayName` property for the project name. The project name can be changed later.

Make an HTTP POST request using the URI as shown in the following `Projects_Create` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `JessicaProjectId` with a project ID of your choice. The case sensitive ID must be unique within your Speech resource. The ID will be used in the project's URI and can't be changed later. 

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
  "displayName": "Project name for Jessica Voice",
  "description": "Project description for Jessica Voice",
  "kind": "ProfessionalVoice"
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/projects/JessicaProjectId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "JessicaProjectId",
  "displayName": "Project name for Jessica Voice",
  "description": "Project description for Jessica Voice",
  "kind": "ProfessionalVoice",
  "createdDateTime": "2023-04-01T05:30:00.000Z"
}
```

You use the project `id` in subsequent API requests to [add voice talent consent](../../../../professional-voice-create-consent.md) and [create a training set](../../../../professional-voice-create-training-set.md).
