---
title: Model lifecycle of Custom Speech - Speech service
titleSuffix: Azure AI services
description: Custom Speech provides base models for training and lets you create custom models from your data. This article describes the timelines for models and for endpoints that use these models.
services: cognitive-services
author: heikora
manager: dongli
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/29/2022
ms.author: heikora
zone_pivot_groups: speech-studio-cli-rest
---

# Custom Speech model lifecycle

You can use a Custom Speech model for some time after it's deployed to your custom endpoint. But when new base models are made available, the older models are expired. You must periodically recreate and train your custom model from the latest base model to take advantage of the improved accuracy and quality.

Here are some key terms related to the model lifecycle:

* **Training**: Taking a base model and customizing it to your domain/scenario by using text data and/or audio data. In some contexts such as the REST API properties, training is also referred to as **adaptation**.
* **Transcription**: Using a model and performing speech recognition (decoding audio into text).
* **Endpoint**: A specific deployment of either a base model or a custom model that only you can access. 

> [!NOTE]
> Endpoints used by `F0` Speech resources are deleted after seven days.

## Expiration timeline

Here are timelines for model adaptation and transcription expiration:

- Training is available for one year after the quarter when the base model was created by Microsoft.
- Transcription with a base model is available for two years after the quarter when the base model was created by Microsoft.
- Transcription with a custom model is available for two years after the quarter when you created the custom model.

In this context, quarters end on January 15th, April 15th, July 15th, and October 15th. 

## What to do when a model expires

When a custom model or base model expires, it is no longer available for transcription. You can change the model that is used by your custom speech endpoint without downtime.

|Transcription route  |Expired model result  |Recommendation  |
|---------|---------|---------|
|Custom endpoint|Speech recognition requests will fall back to the most recent base model for the same [locale](language-support.md?tabs=stt). You will get results, but recognition might not accurately transcribe your domain data.  |Update the endpoint's model as described in the [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md) guide. |
|Batch transcription |[Batch transcription](batch-transcription.md) requests for expired models will fail with a 4xx error. |In each [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) REST API request body, set the `model` property to a base model or custom model that hasn't yet expired. Otherwise don't include the `model` property to always use the latest base model. |


## Get base model expiration dates

::: zone pivot="speech-studio"

The last date that you could use the base model for training was shown when you created the custom model. For more information, see [Train a Custom Speech model](how-to-custom-speech-train-model.md).

Follow these instructions to get the transcription expiration date for a base model:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech). 
1. Select **Custom Speech** > Your project name > **Deploy models**.
1. The expiration date for the model is shown in the **Expiration** column. This is the last date that you can use the model for transcription.

    :::image type="content" source="media/custom-speech/custom-speech-model-expiration.png" alt-text="Screenshot of the deploy models page that shows the transcription expiration date.":::


::: zone-end

::: zone pivot="speech-cli"

To get the training and transcription expiration dates for a base model, use the `spx csr model status` command. Construct the request parameters according to the following instructions:

- Set the `url` parameter to the URI of the base model that you want to get. You can run the `spx csr list --base` command to get available base models for all locales.

Here's an example Speech CLI command to get the training and transcription expiration dates for a base model:

```azurecli-interactive
spx csr model status --api-version v3.1 --model https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/b0bbc1e0-78d5-468b-9b7c-a5a43b2bb83f
```

In the response, take note of the date in the `adaptationDateTime` property. This is the last date that you can use the base model for training. Also take note of the date in the `transcriptionDateTime` property. This is the last date that you can use the base model for transcription.

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d",
  "datasets": [],
  "links": {
    "manifest": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d/manifest"
  },
  "properties": {
    "deprecationDates": {
      "adaptationDateTime": "2023-01-15T00:00:00Z",
      "transcriptionDateTime": "2024-01-15T00:00:00Z"
    }
  },
  "lastActionDateTime": "2022-05-06T10:52:02Z",
  "status": "Succeeded",
  "createdDateTime": "2021-10-13T00:00:00Z",
  "locale": "en-US",
  "displayName": "20210831 + Audio file adaptation",
  "description": "en-US base model"
}
```

For Speech CLI help with models, run the following command:

```azurecli-interactive
spx help csr model
```

::: zone-end

::: zone pivot="rest-api"

To get the training and transcription expiration dates for a base model, use the [Models_GetBaseModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetBaseModel) operation of the [Speech to text REST API](rest-speech-to-text.md). You can make a [Models_ListBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModels) request to get available base models for all locales.

Make an HTTP GET request using the model URI as shown in the following example. Replace `BaseModelId` with your model ID, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X GET "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/BaseModelId" -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey"
```

In the response, take note of the date in the `adaptationDateTime` property. This is the last date that you can use the base model for training. Also take note of the date in the `transcriptionDateTime` property. This is the last date that you can use the base model for transcription.

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d",
  "datasets": [],
  "links": {
    "manifest": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d/manifest"
  },
  "properties": {
    "deprecationDates": {
      "adaptationDateTime": "2023-01-15T00:00:00Z",
      "transcriptionDateTime": "2024-01-15T00:00:00Z"
    }
  },
  "lastActionDateTime": "2022-05-06T10:52:02Z",
  "status": "Succeeded",
  "createdDateTime": "2021-10-13T00:00:00Z",
  "locale": "en-US",
  "displayName": "20210831 + Audio file adaptation",
  "description": "en-US base model"
}
```

::: zone-end


## Get custom model expiration dates

::: zone pivot="speech-studio"

Follow these instructions to get the transcription expiration date for a custom model:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech). 
1. Select **Custom Speech** > Your project name > **Train custom models**.
1. The expiration date the custom model is shown in the **Expiration** column. This is the last date that you can use the custom model for transcription. Base models are not shown on the **Train custom models** page. 

    :::image type="content" source="media/custom-speech/custom-speech-custom-model-expiration.png" alt-text="Screenshot of the train custom models page that shows the transcription expiration date.":::

You can also follow these instructions to get the transcription expiration date for a custom model:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech). 
1. Select **Custom Speech** > Your project name > **Deploy models**.
1. The expiration date for the model is shown in the **Expiration** column. This is the last date that you can use the model for transcription.

    :::image type="content" source="media/custom-speech/custom-speech-model-expiration.png" alt-text="Screenshot of the deploy models page that shows the transcription expiration date.":::


::: zone-end

::: zone pivot="speech-cli"

To get the transcription expiration date for your custom model, use the `spx csr model status` command. Construct the request parameters according to the following instructions:

- Set the `url` parameter to the URI of the model that you want to get. Replace `YourModelId` with your model ID and replace `YourServiceRegion` with your Speech resource region.

Here's an example Speech CLI command to get the transcription expiration date for your custom model:

```azurecli-interactive
spx csr model status --api-version v3.1 --model https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/models/YourModelId
```

In the response, take note of the date in the `transcriptionDateTime` property. This is the last date that you can use your custom model for transcription. The `adaptationDateTime` property is not applicable, since custom models are not used to train other custom models.

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/86c4ebd7-d70d-4f67-9ccc-84609504ffc7",
  "baseModel": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
  },
  "datasets": [
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/69e46263-ab10-4ab4-abbe-62e370104d95"
    }
  ],
  "links": {
    "manifest": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/86c4ebd7-d70d-4f67-9ccc-84609504ffc7/manifest",
    "copyTo": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/86c4ebd7-d70d-4f67-9ccc-84609504ffc7:copyto"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/5d25e60a-7f4a-4816-afd9-783bb8daccfc"
  },
  "properties": {
    "deprecationDates": {
      "adaptationDateTime": "2023-01-15T00:00:00Z",
      "transcriptionDateTime": "2024-07-15T00:00:00Z"
    }
  },
  "lastActionDateTime": "2022-05-21T13:21:01Z",
  "status": "Succeeded",
  "createdDateTime": "2022-05-22T16:37:01Z",
  "locale": "en-US",
  "displayName": "My Model",
  "description": "My Model Description"
}
```

For Speech CLI help with models, run the following command:

```azurecli-interactive
spx help csr model
```

::: zone-end

::: zone pivot="rest-api"

To get the transcription expiration date for your custom model, use the [Models_GetCustomModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModel) operation of the [Speech to text REST API](rest-speech-to-text.md). 

Make an HTTP GET request using the model URI as shown in the following example. Replace `YourModelId` with your model ID, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X GET "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/models/YourModelId" -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey"
```

In the response, take note of the date in the `transcriptionDateTime` property. This is the last date that you can use your custom model for transcription. The `adaptationDateTime` property is not applicable, since custom models are not used to train other custom models.

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/86c4ebd7-d70d-4f67-9ccc-84609504ffc7",
  "baseModel": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
  },
  "datasets": [
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/69e46263-ab10-4ab4-abbe-62e370104d95"
    }
  ],
  "links": {
    "manifest": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/86c4ebd7-d70d-4f67-9ccc-84609504ffc7/manifest",
    "copyTo": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/86c4ebd7-d70d-4f67-9ccc-84609504ffc7:copyto"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/5d25e60a-7f4a-4816-afd9-783bb8daccfc"
  },
  "properties": {
    "deprecationDates": {
      "adaptationDateTime": "2023-01-15T00:00:00Z",
      "transcriptionDateTime": "2024-07-15T00:00:00Z"
    }
  },
  "lastActionDateTime": "2022-05-21T13:21:01Z",
  "status": "Succeeded",
  "createdDateTime": "2022-05-22T16:37:01Z",
  "locale": "en-US",
  "displayName": "My Model",
  "description": "My Model Description"
}
```

::: zone-end

## Next steps

- [Train a model](how-to-custom-speech-train-model.md)
- [CI/CD for Custom Speech](how-to-custom-speech-continuous-integration-continuous-deployment.md)
