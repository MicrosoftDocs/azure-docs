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

You need a training dataset to create a professional voice. A training dataset includes audio and script files. The audio files are recordings of the voice talent reading the script files. The script files are the text of the audio files. 

In this article, you [create a training set](#create-a-training-set) and get it's resource ID. Then, using the resource ID, you can [upload a set of audio and script files](#upload-training-set-data).

## Create a training set

To create a training set, use the `TrainingSets_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `projectId` property. See [create a project](../../../../professional-voice-create-project.md).
- Set the required `voiceKind` property to `Male` or `Female`. The kind can't be changed later. 
- Set the required `locale` property. This should be the locale of the training set data. The locale of the training set should be the same as the locale of the [consent statement](../../../../professional-voice-create-consent.md). The locale can't be changed later. You can find the text to speech locale list [here](/azure/ai-services/speech-service/language-support?tabs=tts).
- Optionally, set the `description` property for the training set description. The training set description can be changed later.

Make an HTTP POST request using the URI as shown in the following `TrainingSets_Create` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `JessicaTrainingSetId` with a training set ID of your choice. The case sensitive ID will be used in the training set's URI and can't be changed later. 

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
  "description": "300 sentences Jessica data in general style.",
  "projectId": "JessicaProjectId",
  "locale": "en-US",
  "voiceKind": "Female"
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/trainingsets/JessicaTrainingSetId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "JessicaTrainingSetId",
  "description": "300 sentences Jessica data in general style.",
  "projectId": "JessicaProjectId",
  "locale": "en-US",
  "voiceKind": "Female",
  "status": "Succeeded",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

## Upload training set data

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
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `JessicaTrainingSetId` if you specified a different training set ID in the previous step.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
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
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/trainingsets/JessicaTrainingSetId:upload?api-version=2023-12-01-preview"
```

The response header contains the `Operation-Location` property. Use this URI to get details about the `TrainingSets_UploadData` operation. Here's an example of the response header:

```HTTP 201
Operation-Location: https://eastus.api.cognitive.microsoft.com/customvoice/operations/284b7e37-f42d-4054-8fa9-08523c3de345?api-version=2023-12-01-preview
Operation-Id: 284b7e37-f42d-4054-8fa9-08523c3de345
```

## Next steps

> [!div class="nextstepaction"]
> [Train the professional voice](../../../../professional-voice-train-voice.md)

