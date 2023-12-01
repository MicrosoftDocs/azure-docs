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


In this article, you learn how to train a custom neural voice through the custom voice API.

> [!IMPORTANT]
> Custom neural voice training is currently only available in some regions. After your voice model is trained in a supported region, you can copy it to a Speech resource in another region as needed. For more information, see the footnotes in the [Speech service table](../../../../regions.md#speech-service).

Training duration varies depending on how much data you use. It takes about 40 compute hours on average to train a custom neural voice. Standard subscription (S0) users can train four voices simultaneously. If you reach the limit, wait until at least one of your voice models finishes training, and then try again.

> [!NOTE]
> Although the total number of hours required per [training method](#choose-a-training-method) varies, the same unit price applies to each. For more information, see the [custom neural training pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## Choose a training method

After you validate your data files, use them to build your custom neural voice model. When you create a custom neural voice, you can choose to train it with one of the following methods:

- [Neural](?tabs=neural#create-a-voice-model): Create a voice in the same language of your training data.

- [Neural - cross lingual](?tabs=crosslingual#create-a-voice-model): Create a voice that speaks a different language from your training data. For example, with the `fr-FR` training data, you can create a voice that speaks `en-US`.

  The language of the training data and the target language must both be one of the [languages that are supported](../../../../language-support.md?tabs=tts#custom-neural-voice) for cross lingual voice training. You don't need to prepare training data in the target language, but your test script must be in the target language.

- [Neural - multi style](?tabs=multistyle#create-a-voice-model): Create a custom neural voice that speaks in multiple styles and emotions, without adding new training data. Multiple style voices are useful for video game characters, conversational chatbots, audiobooks, content readers, and more.

  To create a multiple style voice, you need to prepare a set of general training data, at least 300 utterances. Select one or more of the preset target speaking styles. You can also create multiple custom styles by providing style samples, of at least 100 utterances per style, as extra training data for the same voice. The supported preset styles vary according to different languages. See [available preset styles across different languages](?tabs=multistyle#available-preset-styles-across-different-languages).

The language of the training data must be one of the [languages that are supported](../../../../language-support.md?tabs=tts) for custom neural voice, cross lingual, or multiple style training.

## Create a voice model

# [Neural](#tab/neural)

To create a neural voice, use the `Models_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `projectId` property. See [create a project](../../../../professional-voice-create-project.md).
- Set the required `consentId` property. See [add voice talent consent](../../../../professional-voice-create-consent.md).
- Set the required `trainingSetId` property. See [create a training set](../../../../professional-voice-create-training-set.md).
- Set the required recipe `kind` property to `Default` for neural voice training. The recipe kind indicates the training method and can't be changed later. To use a different training method, see [Neural - cross lingual](?tabs=crosslingual#create-a-voice-model) or [Neural - multi style](?tabs=multistyle#create-a-voice-model).
- Set the required `voiceName` property. The voice name must end with "Neural" and can't be changed later. Choose a name carefully. The voice name is used in your [speech synthesis request](../../../../professional-voice-deploy-endpoint.md#use-your-custom-voice) by the SDK and SSML input. Only letters, numbers, and a few punctuation characters are allowed. Use different names for different neural voice models.
- Optionally, set the `description` property for the voice description. The voice description can be changed later.

Make an HTTP POST request using the URI as shown in the following `Models_Create` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `JessicaModelId` with a model ID of your choice. The case sensitive ID will be used in the model's URI and can't be changed later. 

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
  "voiceName": "JessicaNeural",
  "description": "Jessica voice",
  "recipe": {
    "kind": "Default"
  },
  "projectId": "ProjectId",
  "consentId": "JessicaConsentId",
  "trainingSetId": "JessicaTrainingSetId"
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/models/JessicaModelId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "Jessica",
  "voiceName": "JessicaNeural",
  "description": "Jessica voice",
  "recipe": {
    "kind": "Default",
    "version": "V7.2023.03"
  },
  "projectId": "ProjectId",
  "consentId": "JessicaConsentId",
  "trainingSetId": "JessicaTrainingSetId",
  "locale": "en-US",
  "engineVersion": "2023.07.04.0",
  "status": "NotStarted",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```



# [Neural - cross lingual](#tab/crosslingual)

To create a cross lingual neural voice, use the `Models_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `projectId` property. See [create a project](../../../../professional-voice-create-project.md).
- Set the required `consentId` property. See [add voice talent consent](../../../../professional-voice-create-consent.md).
- Set the required `trainingSetId` property. See [create a training set](../../../../professional-voice-create-training-set.md).
- Set the required recipe `kind` property to `CrossLingual` for cross lingual voice training. The recipe kind indicates the training method and can't be changed later. To use a different training method, see [Neural](?tabs=neural#create-a-voice-model) or [Neural - multi style](?tabs=multistyle#create-a-voice-model).
- Set the required `voiceName` property. The voice name must end with "Neural" and can't be changed later. Choose a name carefully. The voice name is used in your [speech synthesis request](../../../../professional-voice-deploy-endpoint.md#use-your-custom-voice) by the SDK and SSML input. Only letters, numbers, and a few punctuation characters are allowed. Use different names for different neural voice models.
- Set the required `locale` property for the language that your voice speaks. The voice speaks a different language from your training data. You can specify only one target language for a voice model.
- Optionally, set the `description` property for the voice description. The voice description can be changed later.

Make an HTTP POST request using the URI as shown in the following `Models_Create` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `JessicaModelId` with a model ID of your choice. The case sensitive ID will be used in the model's URI and can't be changed later. 

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
  "voiceName": "JessicaCrossLingualNeural",
  "description": "Jessica cross lingual voice",
  "recipe": {
    "kind": "CrossLingual"
  },
  "projectId": "ProjectId",
  "consentId": "JessicaConsentId",
  "trainingSetId": "Jessica-en-US-TrainingSetId",
  "locale": "fr-FR"
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/models/JessicaModelId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "Jessica",
  "voiceName": "JessicaNeuralCrossLingual",
  "description": "Jessica cross lingual voice",
  "recipe": {
    "kind": "CrossLingual",
    "version": "V5.2023.07"
  },
  "projectId": "ProjectId",
  "consentId": "JessicaConsentId",
  "trainingSetId": "Jessica-en-US-TrainingSetId",
  "locale": "fr-FR",
  "engineVersion": "2023.11.14.0",
  "status": "NotStarted",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

# [Neural - multi style](#tab/multistyle)

To create a multi-style neural voice, use the `Models_Create` operation of the custom voice API. Construct the request body according to the following instructions:

- Set the required `projectId` property. See [create a project](../../../../professional-voice-create-project.md).
- Set the required `consentId` property. See [add voice talent consent](../../../../professional-voice-create-consent.md).
- Set the required `trainingSetId` property. See [create a training set](../../../../professional-voice-create-training-set.md).
- Set the required recipe `kind` property to `MultiStyle` for multiple style voice training. The recipe kind indicates the training method and can't be changed later. To use a different training method, see [Neural](?tabs=neural#create-a-voice-model) or [Neural - cross lingual](?tabs=crosslingual#create-a-voice-model).
- Set the required `voiceName` property. The voice name must end with "Neural" and can't be changed later. Choose a name carefully. The voice name is used in your [speech synthesis request](../../../../professional-voice-deploy-endpoint.md#use-your-custom-voice) by the SDK and SSML input. Only letters, numbers, and a few punctuation characters are allowed. Use different names for different neural voice models.
- Set the required `locale` property for the language for your voice model. 
- Set the required `presetStyles` property to one or more of the [available preset styles](#available-preset-styles-across-different-languages) for the target language. 
- Optionally, set the `styleTrainingSetIds` property to provide training data for your custom speaking styles. The maximum number of custom styles varies by languages: English (United States) allows up to 10 custom styles, Chinese (Mandarin, Simplified) allows up to four custom styles, and Japanese (Japan) allows up to five custom styles. 
    The `styleTrainingSetIds` property is a dictionary of style names and training set IDs. 
    - For each dictionary key, specify a custom style name of your choice. This name is used by your application within the `style` element of [Speech Synthesis Markup Language (SSML)](../../../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles).
    - For each dictionary value, specify the ID of a training set that you [already created](../../../../professional-voice-create-training-set.md#add-a-professional-voice-training-dataset) for the same voice model. The training set must contain at least 100 utterances for each style.
- Optionally, set the `description` property for the voice description. The voice description can be changed later.

Make an HTTP POST request using the URI as shown in the following `Models_Create` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `JessicaModelId` with a model ID of your choice. The case sensitive ID will be used in the model's URI and can't be changed later. 

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourResourceKey" -H "Content-Type: application/json" -d '{
  "voiceName": "JessicaNeuralMultiStyle",
  "description": "Jessica multi-style voice",
  "recipe": {
    "kind": "MultiStyle"
  },
  "projectId": "ProjectId",
  "consentId": "JessicaConsentId",
  "trainingSetId": "JessicaTrainingSetId",
  "locale": "en-US",
  "properties": {
    "presetStyles": [
      "cheerful",
      "sad"
    ],
    "styleTrainingSetIds": {
      "happyJessica": "JessicaHappyTrainingSetId",
      "myStyle2": "JessicaStyle2TrainingSetId"
    }
  }
} '  "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/models/JessicaModelId?api-version=2023-12-01-preview"
```

You should receive a response body in the following format:

```json
{
  "id": "Jessica",
  "voiceName": "JessicaNeuralMultiStyle",
  "description": "Jessica multi-style voice",
  "recipe": {
    "kind": "MultiStyle",
    "version": "V7.2023.03"
  },
  "projectId": "ProjectId",
  "consentId": "JessicaConsentId",
  "trainingSetId": "JessicaTrainingSetId",
  "locale": "en-US",
  "engineVersion": "2023.07.04.0","properties": {
    "presetStyles": [
      "cheerful",
      "sad"
    ],
    "styleTrainingSetIds": {
      "happyJessica": "JessicaHappyTrainingSetId",
      "myStyle2": "JessicaStyle2TrainingSetId"
    },
    "voiceStyles": [
      "cheerful",
      "sad",
      "happyJessica",
      "myStyle2"
    ]
  }
  "status": "NotStarted",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

## Available preset styles across different languages

The following table summarizes the different preset styles according to different languages.

[!INCLUDE [Speaking styles](./voice-styles-by-locale.md)]

---

## Get training status

To get the training status of a voice model, use the `Models_Get` operation of the custom voice API. Construct the request URI according to the following instructions:

Make an HTTP GET request using the URI as shown in the following `Models_Get` example. 
- Replace `YourResourceKey` with your Speech resource key.
- Replace `YourResourceRegion` with your Speech resource region.
- Replace `JessicaModelId` if you specified a different model ID in the previous step.

```azurecli-interactive
curl -v -X GET "https://YourResourceRegion.api.cognitive.microsoft.com/customvoice/models/JessicaModelId?api-version=2023-12-01-preview" -H "Ocp-Apim-Subscription-Key: YourResourceKey"
```

You should receive a response body in the following format. You might need to wait for several minutes before the training is completed. Eventually the status will change to either `Succeeded` or `Failed`.

```json
{
  "id": "Jessica",
  "voiceName": "JessicaNeural",
  "description": "Jessica voice",
  "recipe": {
    "kind": "Default",
    "version": "V7.2023.03"
  },
  "projectId": "ProjectId",
  "consentId": "JessicaConsentId",
  "trainingSetId": "JessicaTrainingSetId",
  "locale": "en-US",
  "engineVersion": "2023.07.04.0",
  "status": "Succeeded",
  "createdDateTime": "2023-04-01T05:30:00.000Z",
  "lastActionDateTime": "2023-04-02T10:15:30.000Z"
}
```

## Next steps

> [!div class="nextstepaction"]
> [Deploy the professional voice endpoint](../../../../professional-voice-deploy-endpoint.md)

