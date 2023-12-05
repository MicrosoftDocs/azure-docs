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

After you've successfully created and [trained](../../../../professional-voice-train-voice.md) your voice model, you deploy it to a custom neural voice endpoint. 

> [!NOTE]
> You can create up to 50 endpoints with a standard (S0) Speech resource, each with its own custom neural voice.

## Add a deployment endpoint

To create an endpoint, use the `Endpoints_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `projectId` property. See [create a project](../../../../professional-voice-create-project.md).
- Set the required `modelId` property. See [train a voice model](../../../../professional-voice-train-voice.md).
- Set the required `description` property. The description can be changed later.

Make an HTTP PUT request using the URI as shown in the following `Endpoints_Create` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `EndpointId` with an endpoint ID of your choice. The ID must be a GUID and must be unique within your Speech resource. The ID will be used in the project's URI and can't be changed later. 

```azurecli-interactive
curl -v -X PUT -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
  "description": "Endpoint for Jessica voice",
  "projectId": "ProjectId",
  "modelId": "JessicaModelId",
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/endpoints/EndpointId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "9f50c644-2121-40e9-9ea7-544e48bfe3cb",
  "description": "Endpoint for Jessica voice",
  "projectId": "ProjectId",
  "modelId": "JessicaModelId",
  "properties": {
    "kind": "HighPerformance"
  },
  "status": "NotStarted",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

The response header contains the `Operation-Location` property. Use this URI to get details about the `Endpoints_Create` operation. Here's an example of the response header:

```HTTP 201
Operation-Location: https://eastus.api.cognitive.microsoft.com/customvoice/operations/284b7e37-f42d-4054-8fa9-08523c3de345?api-version=2023-12-01-preview
Operation-Id: 284b7e37-f42d-4054-8fa9-08523c3de345
```

You use the endpoint `Operation-Location` in subsequent API requests to [suspend and resume an endpoint](#suspend-and-resume-an-endpoint) and [delete an endpoint](#delete-an-endpoint).

## Use your custom voice

To use your custom neural voice, you must specify the voice model name, use the custom URI directly in an HTTP request, and use the same Speech resource to pass through the authentication of the text to speech service.

The custom endpoint is functionally identical to the standard endpoint that's used for text to speech requests. 

One difference is that the `EndpointId` must be specified to use the custom voice via the Speech SDK. You can start with the [text to speech quickstart](../../../../get-started-text-to-speech.md) and then update the code with the `EndpointId` and `SpeechSynthesisVoiceName`. For more information, see [use a custom endpoint](../../../../how-to-speech-synthesis.md#use-a-custom-endpoint).

To use a custom voice via [Speech Synthesis Markup Language (SSML)](../../../../speech-synthesis-markup-voice.md#use-voice-elements), specify the model name as the voice name. This example uses the `YourCustomVoiceName` voice. 

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="YourCustomVoiceName">
        This is the text that is spoken. 
    </voice>
</speak>
```

## Suspend an endpoint

You can suspend or resume an endpoint, to limit spend and conserve resources that aren't in use. You won't be charged while the endpoint is suspended. When you resume an endpoint, you can continue to use the same endpoint URL in your application to synthesize speech. 

To suspend an endpoint, use the `Endpoints_Suspend` operation of the custom voice API. 

Make an HTTP POST request using the URI as shown in the following `Endpoints_Suspend` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `YourEndpointId` with the endpoint ID that you received when you created the endpoint.

```azurecli-interactive
curl -v -X POST "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/endpoints/YourEndpointId:suspend?api-version=2023-12-01-preview" -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "content-type: application/json" -H "content-length: 0"
```

You should receive a response body in the following format:

```json
{
  "id": "9f50c644-2121-40e9-9ea7-544e48bfe3cb",
  "description": "Endpoint for Jessica voice",
  "projectId": "ProjectId",
  "modelId": "JessicaModelId",
  "properties": {
    "kind": "HighPerformance"
  },
  "status": "Disabling",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

## Resume an endpoint

To suspend an endpoint, use the `Endpoints_Resume` operation of the custom voice API. 

Make an HTTP POST request using the URI as shown in the following `Endpoints_Resume` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `YourEndpointId` with the endpoint ID that you received when you created the endpoint.

```azurecli-interactive
curl -v -X POST "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/endpoints/YourEndpointId:resume?api-version=2023-12-01-preview" -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "content-type: application/json" -H "content-length: 0"
```

You should receive a response body in the following format:

```json
{
  "id": "9f50c644-2121-40e9-9ea7-544e48bfe3cb",
  "description": "Endpoint for Jessica voice",
  "projectId": "Jessica",
  "modelId": "Jessica",
  "properties": {
    "kind": "HighPerformance"
  },
  "status": "Running",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

## Delete an endpoint

To delete an endpoint, use the `Endpoints_Delete` operation of the custom voice API. 

Make an HTTP DELETE request using the URI as shown in the following `Endpoints_Delete` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `YourEndpointId` with the endpoint ID that you received when you created the endpoint.

```azurecli-interactive
curl -v -X DELETE "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/endpoints/YourEndpointId?api-version=2023-12-01-preview" -H "Ocp-Apim-Subscription-Key: YourResourceKey"
```

You should receive a response header with status code 204.

## Switch to a new voice model in your product

Once you've updated your voice model to the latest engine version, or if you want to switch to a new voice in your product, you need to redeploy the new voice model to a new endpoint. Redeploying new voice model on your existing endpoint is not supported. After deployment, switch the traffic to the newly created endpoint. We recommend that you transfer the traffic to the new endpoint in a test environment first to ensure that the traffic works well, and then transfer to the new endpoint in the production environment. During the transition, you need to keep the old endpoint. If there are some problems with the new endpoint during transition, you can switch back to your old endpoint. If the traffic has been running well on the new endpoint for about 24 hours (recommended value), you can delete your old endpoint. 

> [!NOTE]
> If your voice name is changed and you are using Speech Synthesis Markup Language (SSML), be sure to use the new voice name in SSML.

## Next steps

- Learn more about custom neural voice in the [overview](../../../../custom-neural-voice.md).
- Learn more about Speech Studio in the [overview](../../../../speech-studio-overview.md).


