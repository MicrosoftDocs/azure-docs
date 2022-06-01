---
title: Model lifecycle of Custom Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Custom Speech provides base models for training and lets you create custom models from your data. This article describes the timelines for models and for endpoints that use these models.
services: cognitive-services
author: heikora
manager: dongli
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/08/2022
ms.author: heikora
---

# Custom Speech model lifecycle

Speech recognition models that are provided by Microsoft are referred to as base models. When you make a speech recognition request, the current base model for each [supported language](language-support.md) is used by default. Base models are updated periodically to improve accuracy and quality. 

You can use a custom model for some time after it's trained and deployed. You must periodically recreate and train your custom model from the latest base model to take advantage of the improved accuracy and quality.

Some key terms related to the model lifecycle include:

* **Training**: Taking a base model and customizing it to your domain/scenario by using text data and/or audio data. In some contexts such as the REST API properties, training is also referred to as **adaptation**.
* **Transcription**: Using a model and performing speech recognition (decoding audio into text).
* **Endpoint**: A specific deployment of either a base model or a custom model that only you can access. 

## Expiration timeline

When new models are made available, the older models are retired. Here are timelines for model adaptation and transcription expiration:

- Training is available for one year after the quarter when the base model was created by Microsoft.
- Transcription with a base model is available for two years after the quarter when the base model was created by Microsoft.
- Transcription with a custom model is available for two years after the quarter when you created the custom model.

In this context, quarters end on January 15th, April 15th, July 15th, and October 15th. 

## What happens when models expire and how to update them

When a custom model or base model expires, typically speech recognition requests will fall back to the most recent base model for the same language. In this case, your implementation won't break, but recognition might not accurately transcribe your domain data. 

You can change the model that is used by your custom speech endpoint without downtime:
 - In the Speech Studio, go to your Custom Speech project and select **Deploy models**. Select the endpoint name to see its details, and then select **Change model**. Choose a new model and select **Done**.
 - Update the endpoint's model property via the [`UpdateEndpoint`](https://westus2.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateEndpoint) REST API. 

[Batch transcription](batch-transcription.md) requests for retired models will fail with a 4xx error. In the [`CreateTranscription`](https://westus2.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateTranscription) REST API request body, update the `model` parameter to use a base model or custom model that hasn't yet retired. Otherwise you can remove the `model` entry from the JSON to always use the latest base model.

## Find out when a model expires
You can get the adaptation and transcription expiration dates for a model via the Speech Studio and REST API.

### Model expiration dates via Speech Studio
Here's an example adaptation expiration date shown on the train new model dialog:

:::image type="content" source="media/custom-speech/custom-speech-adaptation-end-date.png" alt-text="Screenshot of the train new model dialog that shows the adaptation expiration date.":::

Here's an example transcription expiration date shown on the deployment detail page:

:::image type="content" source="media/custom-speech/custom-speech-deploy-details.png" alt-text="Screenshot of the train new model dialog that shows the transcription expiration date.":::

### Model expiration dates via REST API
You can also check the expiration dates via the [`GetBaseModel`](https://westus2.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModel) and [`GetModel`](https://westus2.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModel) REST API. The `deprecationDates` property in the JSON response includes the adaptation and transcription expiration dates for each model

Here's an example base model retrieved via [`GetBaseModel`](https://westus2.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModel): 

```json
{
  "self": "https://westus2.api.cognitive.microsoft.com/speechtotext/v3.0/models/base/e065c68b-21d3-4b28-ae61-eb4c7e797789",
  "datasets": [],
  "links": {
    "manifest": "https://westus2.api.cognitive.microsoft.com/speechtotext/v3.0/models/base/e065c68b-21d3-4b28-ae61-eb4c7e797789/manifest"
  },
  "properties": {
    "deprecationDates": {
      "adaptationDateTime": "2023-01-15T00:00:00Z",
      "transcriptionDateTime": "2024-01-15T00:00:00Z"
    }
  },
  "lastActionDateTime": "2021-10-29T07:19:01Z",
  "status": "Succeeded",
  "createdDateTime": "2021-10-29T06:58:14Z",
  "locale": "en-US",
  "displayName": "20211012 (CLM public preview)",
  "description": "en-US base model"
}
```

Here's an example custom model retrieved via [`GetModel`](https://westus2.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModel). The custom model was trained from the previously mentioned base model (`e065c68b-21d3-4b28-ae61-eb4c7e797789`):

```json
{
  "self": "https://westus2.api.cognitive.microsoft.com/speechtotext/v3.0/models/{custom-model-id}",
  "baseModel": {
    "self": "https://westus2.api.cognitive.microsoft.com/speechtotext/v3.0/models/base/e065c68b-21d3-4b28-ae61-eb4c7e797789"
  },
  "datasets": [
    {
      "self": "https://westus2.api.cognitive.microsoft.com/speechtotext/v3.0/datasets/f1a72db2-1e89-496d-859f-f1af7a363bb5"
    }
  ],
  "links": {
    "manifest": "https://westus2.api.cognitive.microsoft.com/speechtotext/v3.0/models/{custom-model-id}/manifest",
    "copyTo": "https://westus2.api.cognitive.microsoft.com/speechtotext/v3.0/models/{custom-model-id}/copyto"
  },
  "project": {
    "self": "https://westus2.api.cognitive.microsoft.com/speechtotext/v3.0/projects/ee3b1c83-c194-490c-bdb1-b6b1a6be6f59"
  },
  "properties": {
    "deprecationDates": {
      "adaptationDateTime": "2023-01-15T00:00:00Z",
      "transcriptionDateTime": "2024-04-15T00:00:00Z"
    }
  },
  "lastActionDateTime": "2022-02-27T13:03:54Z",
  "status": "Succeeded",
  "createdDateTime": "2022-02-27T13:03:46Z",
  "locale": "en-US",
  "displayName": "Custom model A",
  "description": "My first custom model",
  "customProperties": {
    "PortalAPIVersion": "3"
  }
}
```

## Next steps

- [Train a model](how-to-custom-speech-train-model.md)
- [CI/CD for Custom Speech](how-to-custom-speech-continuous-integration-continuous-deployment.md)
