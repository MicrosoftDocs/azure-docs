---
title: Test recognition quality of a Custom Speech model - Speech service
titleSuffix: Azure AI services
description: Custom Speech lets you qualitatively inspect the recognition quality of a model. You can play back uploaded audio and determine if the provided recognition result is correct.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/29/2022
ms.author: eur
zone_pivot_groups: speech-studio-cli-rest
---

# Test recognition quality of a Custom Speech model

You can inspect the recognition quality of a Custom Speech model in the [Speech Studio](https://aka.ms/speechstudio/customspeech). You can play back uploaded audio and determine if the provided recognition result is correct. After a test has been successfully created, you can see how a model transcribed the audio dataset, or compare results from two models side by side.

Side-by-side model testing is useful to validate which speech recognition model is best for an application. For an objective measure of accuracy, which requires transcription datasets input, see [Test model quantitatively](how-to-custom-speech-evaluate-data.md).

[!INCLUDE [service-pricing-advisory](includes/service-pricing-advisory.md)]

## Create a test

::: zone pivot="speech-studio"

Follow these instructions to create a test:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Navigate to **Speech Studio** > **Custom Speech** and select your project name from the list.
1. Select **Test models** > **Create new test**.
1. Select **Inspect quality (Audio-only data)** > **Next**. 
1. Choose an audio dataset that you'd like to use for testing, and then select **Next**. If there aren't any datasets available, cancel the setup, and then go to the **Speech datasets** menu to [upload datasets](how-to-custom-speech-upload-data.md).

    :::image type="content" source="media/custom-speech/custom-speech-choose-test-data.png" alt-text="Screenshot of choosing a dataset dialog":::

1. Choose one or two models to evaluate and compare accuracy.
1. Enter the test name and description, and then select **Next**.
1. Review your settings, and then select **Save and close**.

::: zone-end

::: zone pivot="speech-cli"

To create a test, use the `spx csr evaluation create` command. Construct the request parameters according to the following instructions:

- Set the `project` parameter to the ID of an existing project. This is recommended so that you can also view the test in Speech Studio. You can run the `spx csr project list` command to get available projects.
- Set the required `model1` parameter to the ID of a model that you want to test.
- Set the required `model2` parameter to the ID of another model that you want to test. If you don't want to compare two models, use the same model for both `model1` and `model2`.
- Set the required `dataset` parameter to the ID of a dataset that you want to use for the test.
- Set the `language` parameter, otherwise the Speech CLI will set "en-US" by default. This should be the locale of the dataset contents. The locale can't be changed later. The Speech CLI `language` parameter corresponds to the `locale` property in the JSON request and response.
- Set the required `name` parameter. This is the name that will be displayed in the Speech Studio. The Speech CLI `name` parameter corresponds to the `displayName` property in the JSON request and response.

Here's an example Speech CLI command that creates a test:

```azurecli-interactive
spx csr evaluation create --api-version v3.1 --project 9f8c4cbb-f9a5-4ec1-8bb0-53cfa9221226 --dataset be378d9d-a9d7-4d4a-820a-e0432e8678c7 --model1 ff43e922-e3e6-4bf0-8473-55c08fd68048 --model2 1aae1070-7972-47e9-a977-87e3b05c457d --name "My Inspection" --description "My Inspection Description"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/8bfe6b05-f093-4ab4-be7d-180374b751ca",
  "model1": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/ff43e922-e3e6-4bf0-8473-55c08fd68048"
  },
  "model2": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
  },
  "dataset": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/be378d9d-a9d7-4d4a-820a-e0432e8678c7"
  },
  "transcription2": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/6eaf6a15-6076-466a-83d4-a30dba78ca63"
  },
  "transcription1": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/0c5b1630-fadf-444d-827f-d6da9c0cf0c3"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/9f8c4cbb-f9a5-4ec1-8bb0-53cfa9221226"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/8bfe6b05-f093-4ab4-be7d-180374b751ca/files"
  },
  "properties": {
    "wordErrorRate2": -1.0,
    "wordErrorRate1": -1.0,
    "sentenceErrorRate2": -1.0,
    "sentenceCount2": -1,
    "wordCount2": -1,
    "correctWordCount2": -1,
    "wordSubstitutionCount2": -1,
    "wordDeletionCount2": -1,
    "wordInsertionCount2": -1,
    "sentenceErrorRate1": -1.0,
    "sentenceCount1": -1,
    "wordCount1": -1,
    "correctWordCount1": -1,
    "wordSubstitutionCount1": -1,
    "wordDeletionCount1": -1,
    "wordInsertionCount1": -1
  },
  "lastActionDateTime": "2022-05-20T16:42:43Z",
  "status": "NotStarted",
  "createdDateTime": "2022-05-20T16:42:43Z",
  "locale": "en-US",
  "displayName": "My Inspection",
  "description": "My Inspection Description"
}
```

The top-level `self` property in the response body is the evaluation's URI. Use this URI to get details about the project and test results. You also use this URI to update or delete the evaluation.

For Speech CLI help with evaluations, run the following command:

```azurecli-interactive
spx help csr evaluation
```

::: zone-end

::: zone pivot="rest-api"

To create a test, use the [Evaluations_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Create) operation of the [Speech to text REST API](rest-speech-to-text.md). Construct the request body according to the following instructions:

- Set the `project` property to the URI of an existing project. This is recommended so that you can also view the test in Speech Studio. You can make a [Projects_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_List) request to get available projects.
- Set the required `model1` property to the URI of a model that you want to test.
- Set the required `model2` property to the URI of another model that you want to test. If you don't want to compare two models, use the same model for both `model1` and `model2`.
- Set the required `dataset` property to the URI of a dataset that you want to use for the test.
- Set the required `locale` property. This should be the locale of the dataset contents. The locale can't be changed later.
- Set the required `displayName` property. This is the name that will be displayed in the Speech Studio.

Make an HTTP POST request using the URI as shown in the following example. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "model1": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/ff43e922-e3e6-4bf0-8473-55c08fd68048"
  },
  "model2": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
  },
  "dataset": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/be378d9d-a9d7-4d4a-820a-e0432e8678c7"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/9f8c4cbb-f9a5-4ec1-8bb0-53cfa9221226"
  },
  "displayName": "My Inspection",
  "description": "My Inspection Description",
  "locale": "en-US"
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/8bfe6b05-f093-4ab4-be7d-180374b751ca",
  "model1": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/ff43e922-e3e6-4bf0-8473-55c08fd68048"
  },
  "model2": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
  },
  "dataset": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/be378d9d-a9d7-4d4a-820a-e0432e8678c7"
  },
  "transcription2": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/6eaf6a15-6076-466a-83d4-a30dba78ca63"
  },
  "transcription1": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/0c5b1630-fadf-444d-827f-d6da9c0cf0c3"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/9f8c4cbb-f9a5-4ec1-8bb0-53cfa9221226"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/8bfe6b05-f093-4ab4-be7d-180374b751ca/files"
  },
  "properties": {
    "wordErrorRate2": -1.0,
    "wordErrorRate1": -1.0,
    "sentenceErrorRate2": -1.0,
    "sentenceCount2": -1,
    "wordCount2": -1,
    "correctWordCount2": -1,
    "wordSubstitutionCount2": -1,
    "wordDeletionCount2": -1,
    "wordInsertionCount2": -1,
    "sentenceErrorRate1": -1.0,
    "sentenceCount1": -1,
    "wordCount1": -1,
    "correctWordCount1": -1,
    "wordSubstitutionCount1": -1,
    "wordDeletionCount1": -1,
    "wordInsertionCount1": -1
  },
  "lastActionDateTime": "2022-05-20T16:42:43Z",
  "status": "NotStarted",
  "createdDateTime": "2022-05-20T16:42:43Z",
  "locale": "en-US",
  "displayName": "My Inspection",
  "description": "My Inspection Description"
}
```

The top-level `self` property in the response body is the evaluation's URI. Use this URI to [get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Get) details about the evaluation's project and test results. You also use this URI to [update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Update) or [delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Delete) the evaluation.

::: zone-end


## Get test results

You should get the test results and [inspect](#compare-transcription-with-audio) the audio datasets compared to transcription results for each model.

::: zone pivot="speech-studio"

Follow these steps to get test results:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select **Custom Speech** > Your project name > **Test models**.
1. Select the link by test name.
1. After the test is complete, as indicated by the status set to *Succeeded*, you should see results that include the WER number for each tested model.

This page lists all the utterances in your dataset and the recognition results, alongside the transcription from the submitted dataset. You can toggle various error types, including insertion, deletion, and substitution. By listening to the audio and comparing recognition results in each column, you can decide which model meets your needs and determine where additional training and improvements are required.

::: zone-end

::: zone pivot="speech-cli"

To get test results, use the `spx csr evaluation status` command. Construct the request parameters according to the following instructions:

- Set the required `evaluation` parameter to the ID of the evaluation that you want to get test results.

Here's an example Speech CLI command that gets test results:

```azurecli-interactive
spx csr evaluation status --api-version v3.1 --evaluation 8bfe6b05-f093-4ab4-be7d-180374b751ca
```

The models, audio dataset, transcriptions, and more details are returned in the response body.

You should receive a response body in the following format:

```json
{
	"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/8bfe6b05-f093-4ab4-be7d-180374b751ca",
	"model1": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/ff43e922-e3e6-4bf0-8473-55c08fd68048"
	},
	"model2": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
	},
	"dataset": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/be378d9d-a9d7-4d4a-820a-e0432e8678c7"
	},
	"transcription2": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/6eaf6a15-6076-466a-83d4-a30dba78ca63"
	},
	"transcription1": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/0c5b1630-fadf-444d-827f-d6da9c0cf0c3"
	},
	"project": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/9f8c4cbb-f9a5-4ec1-8bb0-53cfa9221226"
	},
	"links": {
		"files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/8bfe6b05-f093-4ab4-be7d-180374b751ca/files"
	},
	"properties": {
		"wordErrorRate2": 4.62,
		"wordErrorRate1": 4.6,
		"sentenceErrorRate2": 66.7,
		"sentenceCount2": 3,
		"wordCount2": 173,
		"correctWordCount2": 166,
		"wordSubstitutionCount2": 7,
		"wordDeletionCount2": 0,
		"wordInsertionCount2": 1,
		"sentenceErrorRate1": 66.7,
		"sentenceCount1": 3,
		"wordCount1": 174,
		"correctWordCount1": 166,
		"wordSubstitutionCount1": 7,
		"wordDeletionCount1": 1,
		"wordInsertionCount1": 0
	},
	"lastActionDateTime": "2022-05-20T16:42:56Z",
	"status": "Succeeded",
	"createdDateTime": "2022-05-20T16:42:43Z",
	"locale": "en-US",
	"displayName": "My Inspection",
	"description": "My Inspection Description"
}
```

For Speech CLI help with evaluations, run the following command:

```azurecli-interactive
spx help csr evaluation
```

::: zone-end

::: zone pivot="rest-api"

To get test results, start by using the [Evaluations_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Get) operation of the [Speech to text REST API](rest-speech-to-text.md).

Make an HTTP GET request using the URI as shown in the following example. Replace `YourEvaluationId` with your evaluation ID, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X GET "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/YourEvaluationId" -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey"
```

The models, audio dataset, transcriptions, and more details are returned in the response body.

You should receive a response body in the following format:

```json
{
	"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/8bfe6b05-f093-4ab4-be7d-180374b751ca",
	"model1": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/ff43e922-e3e6-4bf0-8473-55c08fd68048"
	},
	"model2": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
	},
	"dataset": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/be378d9d-a9d7-4d4a-820a-e0432e8678c7"
	},
	"transcription2": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/6eaf6a15-6076-466a-83d4-a30dba78ca63"
	},
	"transcription1": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/0c5b1630-fadf-444d-827f-d6da9c0cf0c3"
	},
	"project": {
		"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/9f8c4cbb-f9a5-4ec1-8bb0-53cfa9221226"
	},
	"links": {
		"files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/evaluations/8bfe6b05-f093-4ab4-be7d-180374b751ca/files"
	},
	"properties": {
		"wordErrorRate2": 4.62,
		"wordErrorRate1": 4.6,
		"sentenceErrorRate2": 66.7,
		"sentenceCount2": 3,
		"wordCount2": 173,
		"correctWordCount2": 166,
		"wordSubstitutionCount2": 7,
		"wordDeletionCount2": 0,
		"wordInsertionCount2": 1,
		"sentenceErrorRate1": 66.7,
		"sentenceCount1": 3,
		"wordCount1": 174,
		"correctWordCount1": 166,
		"wordSubstitutionCount1": 7,
		"wordDeletionCount1": 1,
		"wordInsertionCount1": 0
	},
	"lastActionDateTime": "2022-05-20T16:42:56Z",
	"status": "Succeeded",
	"createdDateTime": "2022-05-20T16:42:43Z",
	"locale": "en-US",
	"displayName": "My Inspection",
	"description": "My Inspection Description"
}
```

::: zone-end

## Compare transcription with audio

You can inspect the transcription output by each model tested, against the audio input dataset. If you included two models in the test, you can compare their transcription quality side by side. 

::: zone pivot="speech-studio"

To review the quality of transcriptions:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select **Custom Speech** > Your project name > **Test models**.
1. Select the link by test name.
1. Play an audio file while the reading the corresponding transcription by a model. 

If the test dataset included multiple audio files, you'll see multiple rows in the table. If you included two models in the test,  transcriptions are shown in side-by-side columns. Transcription differences between models are shown in blue text font. 

:::image type="content" source="media/custom-speech/custom-speech-inspect-compare.png" alt-text="Screenshot of comparing transcriptions by two models":::

::: zone-end

::: zone pivot="speech-cli"

The audio test dataset, transcriptions, and models tested are returned in the [test results](#get-test-results). If only one model was tested, the `model1` value will match `model2`, and the `transcription1` value will match `transcription2`. 

To review the quality of transcriptions:
1. Download the audio test dataset, unless you already have a copy.
1. Download the output transcriptions.
1. Play an audio file while the reading the corresponding transcription by a model. 

If you're comparing quality between two models, pay particular attention to differences between each model's transcriptions. 

::: zone-end

::: zone pivot="rest-api"


The audio test dataset, transcriptions, and models tested are returned in the [test results](#get-test-results). If only one model was tested, the `model1` value will match `model2`, and the `transcription1` value will match `transcription2`. 

To review the quality of transcriptions:
1. Download the audio test dataset, unless you already have a copy.
1. Download the output transcriptions.
1. Play an audio file while the reading the corresponding transcription by a model. 

If you're comparing quality between two models, pay particular attention to differences between each model's transcriptions. 

::: zone-end

## Next steps

- [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
- [Deploy your model](./how-to-custom-speech-train-model.md)

