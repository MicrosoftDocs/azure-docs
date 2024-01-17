---
title: Deploy a Custom Speech model - Speech service
titleSuffix: Azure AI services
description: Learn how to deploy Custom Speech models. 
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/29/2022
ms.author: eur
zone_pivot_groups: speech-studio-cli-rest
---

# Deploy a Custom Speech model

In this article, you'll learn how to deploy an endpoint for a Custom Speech model. With the exception of [batch transcription](batch-transcription.md), you must deploy a custom endpoint to use a Custom Speech model.

> [!TIP]
> A hosted deployment endpoint isn't required to use Custom Speech with the [Batch transcription API](batch-transcription.md). You can conserve resources if the [custom speech model](how-to-custom-speech-train-model.md) is only used for batch transcription. For more information, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

You can deploy an endpoint for a base or custom model, and then [update](#change-model-and-redeploy-endpoint) the endpoint later to use a better trained model.

> [!NOTE]
> Endpoints used by `F0` Speech resources are deleted after seven days. 

## Add a deployment endpoint

::: zone pivot="speech-studio"

To create a custom endpoint, follow these steps:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select **Custom Speech** > Your project name > **Deploy models**.

   If this is your first endpoint, you'll notice that there are no endpoints listed in the table. After you create an endpoint, you use this page to track each deployed endpoint.

1. Select **Deploy model** to start the new endpoint wizard.

1. On the **New endpoint** page, enter a name and description for your custom endpoint. 

1. Select the custom model that you want to associate with the endpoint. 

1. Optionally, you can check the box to enable audio and diagnostic [logging](#view-logging-data) of the endpoint's traffic.

    :::image type="content" source="./media/custom-speech/custom-speech-deploy-model.png" alt-text="Screenshot of the New endpoint page that shows the checkbox to enable logging.":::

1. Select **Add** to save and deploy the endpoint. 

On the main **Deploy models** page, details about the new endpoint are displayed in a table, such as name, description, status, and expiration date. It can take up to 30 minutes to instantiate a new endpoint that uses your custom models. When the status of the deployment changes to **Succeeded**, the endpoint is ready to use.

> [!IMPORTANT]
> Take note of the model expiration date. This is the last date that you can use your custom model for speech recognition. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

Select the endpoint link to view information specific to it, such as the endpoint key, endpoint URL, and sample code. 

::: zone-end

::: zone pivot="speech-cli"

To create an endpoint and deploy a model, use the `spx csr endpoint create` command. Construct the request parameters according to the following instructions:

- Set the `project` parameter to the ID of an existing project. This is recommended so that you can also view and manage the endpoint in Speech Studio. You can run the `spx csr project list` command to get available projects.
- Set the required `model` parameter to the ID of the model that you want deployed to the endpoint. 
- Set the required `language` parameter. The endpoint locale must match the locale of the model. The locale can't be changed later. The Speech CLI `language` parameter corresponds to the `locale` property in the JSON request and response.
- Set the required `name` parameter. This is the name that will be displayed in the Speech Studio. The Speech CLI `name` parameter corresponds to the `displayName` property in the JSON request and response.
- Optionally, you can set the `logging` parameter. Set this to `enabled` to enable audio and diagnostic [logging](#view-logging-data) of the endpoint's traffic. The default is `false`. 

Here's an example Speech CLI command to create an endpoint and deploy a model:

```azurecli-interactive
spx csr endpoint create --api-version v3.1 --project YourProjectId --model YourModelId --name "My Endpoint" --description "My Endpoint Description" --language "en-US"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/ae8d1643-53e4-4554-be4c-221dcfb471c5"
  },
  "links": {
    "logs": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790/files/logs",
    "restInteractive": "https://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restConversation": "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restDictation": "https://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketInteractive": "wss://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketConversation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketDictation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/d40f2eb8-1abf-4f72-9008-a5ae8add82a4"
  },
  "properties": {
    "loggingEnabled": true
  },
  "lastActionDateTime": "2022-05-19T15:27:51Z",
  "status": "NotStarted",
  "createdDateTime": "2022-05-19T15:27:51Z",
  "locale": "en-US",
  "displayName": "My Endpoint",
  "description": "My Endpoint Description"
}
```

The top-level `self` property in the response body is the endpoint's URI. Use this URI to get details about the endpoint's project, model, and logs. You also use this URI to update the endpoint.

For Speech CLI help with endpoints, run the following command:

```azurecli-interactive
spx help csr endpoint
```

::: zone-end

::: zone pivot="rest-api"

To create an endpoint and deploy a model, use the [Endpoints_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Create) operation of the [Speech to text REST API](rest-speech-to-text.md). Construct the request body according to the following instructions:

- Set the `project` property to the URI of an existing project. This is recommended so that you can also view and manage the endpoint in Speech Studio. You can make a [Projects_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_List) request to get available projects.
- Set the required `model` property to the URI of the model that you want deployed to the endpoint. 
- Set the required `locale` property. The endpoint locale must match the locale of the model. The locale can't be changed later.
- Set the required `displayName` property. This is the name that will be displayed in the Speech Studio.
- Optionally, you can set the `loggingEnabled` property within `properties`. Set this to `true` to enable audio and diagnostic [logging](#view-logging-data) of the endpoint's traffic. The default is `false`. 

Make an HTTP POST request using the URI as shown in the following [Endpoints_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Create) example. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/d40f2eb8-1abf-4f72-9008-a5ae8add82a4"
  },
  "properties": {
    "loggingEnabled": true
  },
  "displayName": "My Endpoint",
  "description": "My Endpoint Description",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/ae8d1643-53e4-4554-be4c-221dcfb471c5"
  },
  "locale": "en-US",
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/ae8d1643-53e4-4554-be4c-221dcfb471c5"
  },
  "links": {
    "logs": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790/files/logs",
    "restInteractive": "https://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restConversation": "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restDictation": "https://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketInteractive": "wss://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketConversation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketDictation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/d40f2eb8-1abf-4f72-9008-a5ae8add82a4"
  },
  "properties": {
    "loggingEnabled": true
  },
  "lastActionDateTime": "2022-05-19T15:27:51Z",
  "status": "NotStarted",
  "createdDateTime": "2022-05-19T15:27:51Z",
  "locale": "en-US",
  "displayName": "My Endpoint",
  "description": "My Endpoint Description"
}
```

The top-level `self` property in the response body is the endpoint's URI. Use this URI to [get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Get) details about the endpoint's project, model, and logs. You also use this URI to [update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Update) or [delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Delete) the endpoint.

::: zone-end

## Change model and redeploy endpoint

An endpoint can be updated to use another model that was created by the same Speech resource. As previously mentioned, you must update the endpoint's model before the [model expires](./how-to-custom-speech-model-and-endpoint-lifecycle.md). 

::: zone pivot="speech-studio"

To use a new model and redeploy the custom endpoint:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select **Custom Speech** > Your project name > **Deploy models**.
1. Select the link to an endpoint by name, and then select **Change model**.
1. Select the new model that you want the endpoint to use.
1. Select **Done** to save and redeploy the endpoint.

::: zone-end

::: zone pivot="speech-cli"

To redeploy the custom endpoint with a new model, use the `spx csr model update` command. Construct the request parameters according to the following instructions:

- Set the required `endpoint` parameter to the ID of the endpoint that you want deployed.
- Set the required `model` parameter to the ID of the model that you want deployed to the endpoint.

Here's an example Speech CLI command that redeploys the custom endpoint with a new model:

```azurecli-interactive
spx csr endpoint update --api-version v3.1 --endpoint YourEndpointId --model YourModelId
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/1e47c19d-12ca-4ba5-b177-9e04bd72cf98"
  },
  "links": {
    "logs": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790/files/logs",
    "restInteractive": "https://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restConversation": "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restDictation": "https://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketInteractive": "wss://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketConversation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketDictation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/639d5280-8995-40cc-9329-051fd0fddd46"
  },
  "properties": {
    "loggingEnabled": true
  },
  "lastActionDateTime": "2022-05-19T23:01:34Z",
  "status": "NotStarted",
  "createdDateTime": "2022-05-19T15:41:27Z",
  "locale": "en-US",
  "displayName": "My Endpoint",
  "description": "My Updated Endpoint Description"
}
```

For Speech CLI help with endpoints, run the following command:

```azurecli-interactive
spx help csr endpoint
```

::: zone-end

::: zone pivot="rest-api"

To redeploy the custom endpoint with a new model, use the [Endpoints_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Update) operation of the [Speech to text REST API](rest-speech-to-text.md). Construct the request body according to the following instructions:

- Set the `model` property to the URI of the model that you want deployed to the endpoint.

Make an HTTP PATCH request using the URI as shown in the following example. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, replace `YourEndpointId` with your endpoint ID, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X PATCH -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/1e47c19d-12ca-4ba5-b177-9e04bd72cf98"
  }
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/YourEndpointId"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/1e47c19d-12ca-4ba5-b177-9e04bd72cf98"
  },
  "links": {
    "logs": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790/files/logs",
    "restInteractive": "https://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restConversation": "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restDictation": "https://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketInteractive": "wss://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketConversation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketDictation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/639d5280-8995-40cc-9329-051fd0fddd46"
  },
  "properties": {
    "loggingEnabled": true
  },
  "lastActionDateTime": "2022-05-19T23:01:34Z",
  "status": "NotStarted",
  "createdDateTime": "2022-05-19T15:41:27Z",
  "locale": "en-US",
  "displayName": "My Endpoint",
  "description": "My Updated Endpoint Description"
}
```

::: zone-end

The redeployment takes several minutes to complete. In the meantime, your endpoint will use the previous model without interruption of service. 

## View logging data

Logging data is available for export if you configured it while creating the endpoint. 

::: zone pivot="speech-studio"

To download the endpoint logs:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select **Custom Speech** > Your project name > **Deploy models**.
1. Select the link by endpoint name.
1. Under **Content logging**, select **Download log**.

::: zone-end

::: zone pivot="speech-cli"

To get logs for an endpoint, use the `spx csr endpoint list` command. Construct the request parameters according to the following instructions:

- Set the required `endpoint` parameter to the ID of the endpoint that you want to get logs.

Here's an example Speech CLI command that gets logs for an endpoint:

```azurecli-interactive
spx csr endpoint list --api-version v3.1 --endpoint YourEndpointId
```

The location of each log file with more details are returned in the response body.

::: zone-end

::: zone pivot="rest-api"

To get logs for an endpoint, start by using the [Endpoints_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Get) operation of the [Speech to text REST API](rest-speech-to-text.md).

Make an HTTP GET request using the URI as shown in the following example. Replace `YourEndpointId` with your endpoint ID, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X GET "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/YourEndpointId" -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/1e47c19d-12ca-4ba5-b177-9e04bd72cf98"
  },
  "links": {
    "logs": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/98375aaa-40c2-42c4-b65c-f76734fc7790/files/logs",
    "restInteractive": "https://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restConversation": "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "restDictation": "https://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketInteractive": "wss://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketConversation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790",
    "webSocketDictation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=98375aaa-40c2-42c4-b65c-f76734fc7790"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/2f78cdb7-58ac-4bd9-9bc6-170e31483b26"
  },
  "properties": {
    "loggingEnabled": true
  },
  "lastActionDateTime": "2022-05-19T23:41:05Z",
  "status": "Succeeded",
  "createdDateTime": "2022-05-19T23:41:05Z",
  "locale": "en-US",
  "displayName": "My Endpoint",
  "description": "My Updated Endpoint Description"
}
```

Make an HTTP GET request using the "logs" URI from the previous response body. Replace `YourEndpointId` with your endpoint ID, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.


```curl
curl -v -X GET "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/YourEndpointId/files/logs" -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey"
```

The location of each log file with more details are returned in the response body.

::: zone-end

Logging data is available on Microsoft-owned storage for 30 days, after which it will be removed. If your own storage account is linked to the Azure AI services subscription, the logging data won't be automatically deleted.

## Next steps

- [CI/CD for Custom Speech](how-to-custom-speech-continuous-integration-continuous-deployment.md)
- [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md)
