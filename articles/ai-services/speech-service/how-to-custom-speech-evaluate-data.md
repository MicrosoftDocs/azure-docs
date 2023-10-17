---
title: Test accuracy of a Custom Speech model - Speech service
titleSuffix: Azure AI services
description: In this article, you learn how to quantitatively measure and improve the quality of our speech to text model or your custom model.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/29/2022
ms.author: eur
ms.custom: ignite-fall-2021
zone_pivot_groups: speech-studio-cli-rest
show_latex: true
no-loc: [$$, '\times', '\over']
---

# Test accuracy of a Custom Speech model

In this article, you learn how to quantitatively measure and improve the accuracy of the base speech to text model or your own custom models. [Audio + human-labeled transcript](how-to-custom-speech-test-and-train.md#audio--human-labeled-transcript-data-for-training-or-testing) data is required to test accuracy. You should provide from 30 minutes to 5 hours of representative audio. 

[!INCLUDE [service-pricing-advisory](includes/service-pricing-advisory.md)]

## Create a test

You can test the accuracy of your custom model by creating a test. A test requires a collection of audio files and their corresponding transcriptions. You can compare a custom model's accuracy with a speech to text base model or another custom model. After you [get](#get-test-results) the test results, [evaluate](#evaluate-word-error-rate) the word error rate (WER) compared to speech recognition results.

::: zone pivot="speech-studio"

Follow these steps to create a test:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select **Custom Speech** > Your project name > **Test models**.
1. Select **Create new test**.
1. Select **Evaluate accuracy** > **Next**. 
1. Select one audio + human-labeled transcription dataset, and then select **Next**. If there aren't any datasets available, cancel the setup, and then go to the **Speech datasets** menu to [upload datasets](how-to-custom-speech-upload-data.md).
    
    > [!NOTE]
    > It's important to select an acoustic dataset that's different from the one you used with your model. This approach can provide a more realistic sense of the model's performance.

1. Select up to two models to evaluate, and then select **Next**.
1. Enter the test name and description, and then select **Next**.
1. Review the test details, and then select **Save and close**.

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
spx csr evaluation create --api-version v3.1 --project 9f8c4cbb-f9a5-4ec1-8bb0-53cfa9221226 --dataset be378d9d-a9d7-4d4a-820a-e0432e8678c7 --model1 ff43e922-e3e6-4bf0-8473-55c08fd68048 --model2 1aae1070-7972-47e9-a977-87e3b05c457d --name "My Evaluation" --description "My Evaluation Description"
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
  "displayName": "My Evaluation",
  "description": "My Evaluation Description"
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
- Set the `testingKind` property to `Evaluation` within `customProperties`. If you don't specify `Evaluation`, the test is treated as a quality inspection test. Whether the `testingKind` property is set to `Evaluation` or `Inspection`, or not set, you can access the accuracy scores via the API, but not in the Speech Studio.
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
  "displayName": "My Evaluation",
  "description": "My Evaluation Description",
  "customProperties": {
    "testingKind": "Evaluation"
  },
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
  "displayName": "My Evaluation",
  "description": "My Evaluation Description",
  "customProperties": {
    "testingKind": "Evaluation"
  }
}
```

The top-level `self` property in the response body is the evaluation's URI. Use this URI to [get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Get) details about the evaluation's project and test results. You also use this URI to [update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Update) or [delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Delete) the evaluation.

::: zone-end

## Get test results

You should get the test results and [evaluate](#evaluate-word-error-rate) the word error rate (WER) compared to speech recognition results.

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

The word error rates and more details are returned in the response body.

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
	"displayName": "My Evaluation",
	"description": "My Evaluation Description",
	"customProperties": {
		"testingKind": "Evaluation"
	}
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

The word error rates and more details are returned in the response body.

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
	"displayName": "My Evaluation",
	"description": "My Evaluation Description",
	"customProperties": {
		"testingKind": "Evaluation"
	}
}
```

::: zone-end


## Evaluate word error rate

The industry standard for measuring model accuracy is [word error rate (WER)](https://en.wikipedia.org/wiki/Word_error_rate). WER counts the number of incorrect words identified during recognition, and divides the sum by the total number of words provided in the human-labeled transcript (N). 

Incorrectly identified words fall into three categories:

* Insertion (I): Words that are incorrectly added in the hypothesis transcript
* Deletion (D): Words that are undetected in the hypothesis transcript
* Substitution (S): Words that were substituted between reference and hypothesis

In the Speech Studio, the quotient is multiplied by 100 and shown as a percentage. The Speech CLI and REST API results aren't multiplied by 100.

$$
WER = {{I+D+S}\over N} \times 100
$$

Here's an example that shows incorrectly identified words, when compared to the human-labeled transcript:

![Screenshot showing an example of incorrectly identified words.](./media/custom-speech/custom-speech-dis-words.png)

The speech recognition result erred as follows:
* Insertion (I): Added the word "a" 
* Deletion (D): Deleted the word "are"
* Substitution (S): Substituted the word "Jones" for "John"

The word error rate from the previous example is 60%. 

If you want to replicate WER measurements locally, you can use the sclite tool from the [NIST Scoring Toolkit (SCTK)](https://github.com/usnistgov/SCTK).

## Resolve errors and improve WER

You can use the WER calculation from the machine recognition results to evaluate the quality of the model you're using with your app, tool, or product. A WER of 5-10% is considered to be good quality and is ready to use. A WER of 20% is acceptable, but you might want to consider additional training. A WER of 30% or more signals poor quality and requires customization and training.

How the errors are distributed is important. When many deletion errors are encountered, it's usually because of weak audio signal strength. To resolve this issue, you need to collect audio data closer to the source. Insertion errors mean that the audio was recorded in a noisy environment and crosstalk might be present, causing recognition issues. Substitution errors are often encountered when an insufficient sample of domain-specific terms has been provided as either human-labeled transcriptions or related text.

By analyzing individual files, you can determine what type of errors exist, and which errors are unique to a specific file. Understanding issues at the file level will help you target improvements.

## Example scenario outcomes

Speech recognition scenarios vary by audio quality and language (vocabulary and speaking style). The following table examines four common scenarios:

| Scenario | Audio quality | Vocabulary | Speaking style |
|----------|---------------|------------|----------------|
| Call center | Low, 8&nbsp;kHz, could be two people on one audio channel, could be compressed | Narrow, unique to domain and products | Conversational, loosely structured |
| Voice assistant, such as Cortana, or a drive-through window | High, 16&nbsp;kHz | Entity-heavy (song titles, products, locations) | Clearly stated words and phrases |
| Dictation (instant message, notes, search) | High, 16&nbsp;kHz | Varied | Note-taking |
| Video closed captioning | Varied, including varied microphone use, added music | Varied, from meetings, recited speech, musical lyrics | Read, prepared, or loosely structured |

Different scenarios produce different quality outcomes. The following table examines how content from these four scenarios rates in the [WER](how-to-custom-speech-evaluate-data.md). The table shows which error types are most common in each scenario. The insertion, substitution, and deletion error rates help you determine what kind of data to add to improve the model.

| Scenario | Speech recognition quality | Insertion errors | Deletion errors | Substitution errors |
|--- |--- |--- |--- |--- |
| Call center | Medium<br>(<&nbsp;30%&nbsp;WER) | Low, except when other people talk in the background | Can be high. Call centers can be noisy, and overlapping speakers can confuse the model | Medium. Products and people's names can cause these errors |
| Voice assistant | High<br>(can be <&nbsp;10%&nbsp;WER) | Low | Low | Medium, due to song titles, product names, or locations |
| Dictation | High<br>(can be <&nbsp;10%&nbsp;WER) | Low | Low | High |
| Video closed captioning | Depends on video type (can be <&nbsp;50%&nbsp;WER) | Low | Can be high because of music, noises, microphone quality | Jargon might cause these errors |


## Next steps

* [Train a model](how-to-custom-speech-train-model.md)
* [Deploy a model](how-to-custom-speech-deploy-model.md)
* [Use the online transcription editor](how-to-custom-speech-transcription-editor.md)
