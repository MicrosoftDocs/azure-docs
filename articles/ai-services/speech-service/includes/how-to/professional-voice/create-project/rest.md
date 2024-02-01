---
 title: include file
 description: include file
 author: eur
 ms.author: eric-urban
 ms.service: azure-ai-services
 ms.topic: include
 ms.date: 12/1/2023
 ms.custom: include
---

Professional voice projects contain the voice talent consent statement, training datasets, voice models, and endpoints.

Each project is specific to a country/region and language, and the gender of the voice you want to create. For example, you might create a project for a female voice for your call center's chat bots that use English in the United States.

## Create a project

To create a professional voice project, use the `Projects_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `kind` property to `ProfessionalVoice`. The kind can't be changed later.
- Optionally, set the `description` property for the project description. The project description can be changed later.

Make an HTTP PUT request using the URI as shown in the following `Projects_Create` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `ProjectId` with a project ID of your choice. The case sensitive ID must be unique within your Speech resource. The ID will be used in the project's URI and can't be changed later. 

```azurecli-interactive
curl -v -X PUT -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
  "description": "Project description",
  "kind": "ProfessionalVoice"
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/projects/ProjectId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "ProjectId",
  "description": "Project description",
  "kind": "ProfessionalVoice",
  "createdDateTime": "2023-04-01T05:30:00.000Z"
}
```

You use the project `id` in subsequent API requests to [add voice talent consent](../../../../professional-voice-create-consent.md) and [create a training set](../../../../professional-voice-create-training-set.md).

## Next steps

> [!div class="nextstepaction"]
> [Add voice talent consent to the professional voice project.](../../../../professional-voice-create-consent.md)

