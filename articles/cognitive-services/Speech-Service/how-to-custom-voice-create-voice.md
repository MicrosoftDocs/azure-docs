---
title: "Create a Custom Voice - Speech service"
titleSuffix: Azure Cognitive Services
description: "When you're ready to upload your data, go to the Custom Voice portal. Create or select a Custom Voice project. The project must share the right language/locale and the gender properties as the data you intend to use for your voice training."
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: erhopf
---

# Create and use your voice model

In [Prepare training data](how-to-custom-voice-prepare-data.md), you learned about the different data types you can use to train a custom neural voice and the different format requirements. Once you've prepared your data and the voice talent verbal statement, you can start to upload them to the [Speech Studio](https://aka.ms/custom-voice-portal). In this article, you learn how to train a Custom Neural Voice through the Speech Studio portal. See the [supported languages](language-support.md#customization) for custom neural voice.

## Prerequisites

* Complete [get started with Custom Neural Voice](how-to-custom-voice.md)
* [Prepare training data](how-to-custom-voice-prepare-data.md)

## Set up voice talent

A voice talent is an individual or target speaker whose voices are recorded and used to create neural voice models. Before you create a voice, define your voice persona and select a right voice talent. For details on recording voice samples, see [the tutorial](record-custom-voice-samples.md).

To train a neural voice, you must create a voice talent profile with an audio file recorded by the voice talent consenting to the usage of their speech data to train a custom voice model. When preparing your recording script, make sure you include the following sentence:

**“I [state your first and last name] am aware that recordings of my voice will be used by [state 
the name of the company] to create and use a synthetic version of my voice.”**
This sentence is used to verify if the training data matches the audio in the consent statement. > Read more about the [voice talent verification](/legal/cognitive-services/speech-service/custom-neural-voice/data-privacy-security-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) here.

> [!NOTE]
> Custom Neural Voice is available with limited access. Make sure you understand the [responsible AI requirements](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext), and then [apply for access](https://aka.ms/customneural). 

The following steps assume you've prepared the voice talent verbal consent files.  Go to [Speech Studio](https://aka.ms/custom-voice-portal) to select a custom neural voice project, then follow the following steps to create a voice talent profile.

1. Navigate to **Text-to-Speech** > **Custom Voice** > **select a project** > **Set up voice talent**.

2. Click **Add voice talent**.

3. Next, to define voice characteristics, click **Target scenario** to be used. Then describe your **Voice characteristics**.

> [!NOTE]
> The scenarios you provide must be consistent with what you've applied for in the application form.

4. Then, go to **Upload voice talent statement**, follow the instruction to upload voice talent statement you've prepared beforehand.

> [!NOTE]
> Make sure the verbal statement is recorded in the same settings as your training data, including the recording environment and speaking style.

5. Finally, go to **Review and submit**,  you can review the settings and click **Submit**.

## Upload your datasets

When you're ready to upload your data, go to the **Prepare training data** tab to add your first training set and upload data.  A training set is a set of audio utterances and their mapping scripts used for training a voice model. You can use a training set to organize your training data. Data readiness checking will be done per each training set. You can import multiple datasets to a training set.

You can do the following to create and review your training data.

1. On the **Prepare training data** tab, click **Add training set** to enter **Name** and **Description** > **Create** to add a new training set.

   When the training set is successfully created, you can start to upload your data. 

2. To upload data, click **Upload data** > **Choose data type** > **Upload data** and **Specify the target training set**  > Enter **Name** and **Description** for your dataset > review the settings and click **Upload**.

> [!NOTE]
>- Duplicate audio names will be removed from the training. Make sure the datasets you select don't contain the same audio names within the .zip file or across multiple .zip files. If utterance IDs (either in audio or script files) are duplicate, they'll be rejected.
>- If you've created datasets in the previous version of Speech Studio, you must specify a training set for your datasets in advance to use them. Or else, an exclamation mark will be appended to the dataset name, and the dataset could not be used.

Each dataset you upload must meet the requirements for the data type that you choose. It's important to correctly format your data before it's uploaded, which ensures the data will be accurately processed by the Custom Neural Voice service. Go to [Prepare training data](how-to-custom-voice-prepare-data.md) and make sure your data has been rightly formatted.

> [!NOTE]
> - Standard subscription (S0) users can upload five datasets simultaneously. If you reach the limit, wait until at least one of your datasets finishes importing. Then try again.
> - The maximum number of datasets allowed to be imported per subscription is 10 .zip files for free subscription (F0) users and 500 for standard subscription (S0) users.

Datasets are automatically validated once you hit the **Upload** button. Data validation includes series of checks on the audio files to verify their file format, size, and sampling rate. Fix the errors if any and submit again. 

Once the data is uploaded, you can check the details in the training set detail view. On the **Overview** tab, you can further check the pronunciation scores and the noise level for each of your datasets. The pronunciation score ranges from 0 to 100. A score below 70 normally indicates a speech error or script mismatch. A heavy accent can reduce your pronunciation score and impact the generated digital voice.

A higher signal-to-noise ratio (SNR) indicates lower noise in your audio. You can typically reach a 50+ SNR by recording at professional studios. Audio with an SNR below 20 can result in obvious noise in your generated voice.

Consider re-recording any utterances with low pronunciation scores or poor signal-to-noise ratios. If you can't re-record, consider excluding those utterances from your dataset.

On the **Data details**, you can check the data details of the training set. In case of some typical issues with the data, follow the instructions in the message displayed to fix them before training.

The issues are divided into three types. Referring to the following three tables to check the respective types of errors.

The first type of errors listed in the table below must be fixed manually, otherwise the data with these errors will be excluded during training. 

| Category | Name | Description | Suggestion |
| --------- | ----------- | ----------- | --------------------------- |
| Script | Invalid separator| These script lines don't have valid separator TAB:{}.| Use TAB to separate ID and content.|
| Script | Invalid script ID| Script ID format is invalid.| Script line ID should be numeric.|
| Script | Script content duplicated| Line {} script content is duplicated with line {}.| Script line content should be unique.|
| Script | Script content too long| Script line content is longer than maximum 1000.| Script line content length should be less than 1000 characters.|
| Script | Script has no matching audio| Script line ID doesn't have matching audio.| Script line ID should match audio ID.|
| Script | No valid script| No valid script found in this dataset.| Fix the problematic script lines according to detailed issue list.|
| Audio | Audio has no matching script| Audio file doesn't match script ID.| Wav file name should match ID in script file.|
| Audio | Invalid audio format| Wav file has an invalid format and cannot be read.| Check wav file format by audio tool like sox.|
| Audio | Low sampling rate| Audio sampling rate is lower than 16 KHz. | Wav file sampling rate should be equal to or higher than 16 KHz. |
| Audio | Audio duration too long| Audio duration is longer than 30 seconds.| Split long duration audio to multiple files to make sure each is less than 15 seconds.|
| Audio | No valid audio| No valid audio found in this dataset.| Fix the problematic audio according to detailed issue list.|

The second type of errors listed in the table below will be automatically fixed, but double checking the fixed data is recommended. 

| Category | Name | Description | Suggestion |
| --------- | ----------- | ----------- | --------------------------- |
| Audio | Stereo audio | Only one channel in stereo audio will be used for TTS model training.| 	Use mono in TTS recording or data preparation. This audio is converted into mono. Download normalized dataset and review.|
| Volume | Volume peak out of range |Volume peak is not within range -3 dB (70% of max volume) to -6 dB (50%). It's auto adjusted to -4 dB (65%) now.|	Control volume peak to proper range during recording or data preparation. This audio is linear scaled to fit the peak range. Download normalized dataset and review.|
|Mismatch | Long silence detected before first word	| Long silence detected before first word.| The start silence is trimmed to 200 ms. Download normalized dataset and review. |
| Mismatch | Long silence detected after last word | Long silence detected after last word. | The end silence is trimmed to 200 ms. Download normalized dataset and review. |
| Mismatch |Start silence too short | Start silence is shorter than 100 ms. | The start silence is extended to 100 ms. Download normalized dataset and review. |
| Mismatch | End silence too short | End silence is shorter than 100 ms. | The end silence is extended to 100 ms. Download normalized dataset and review. |

If the third type of errors listed in the table below aren't fixed, although the data with these errors won't be excluded during training, it will affect the quality of training. For higher-quality training, manually fixing these errors is recommended. 

| Category | Name | Description | Suggestion |
| --------- | ----------- | ----------- | --------------------------- |
| Script | Contain digit 0-9| These script lines contain digit 0-9.| The script lines contain digit 0-9. Expand them to normalized words and match with audio. For example, '123' to 'one hundred and twenty three'.|
| Script | Pronunciation confused word '{}'	| Script contains pronunciation confused word: '{}'.| Expand word to its actual pronunciation. For example, {}.|
| Script | Question utterances too few| Question script lines are less than 1/6 of total script lines.| Question script lines should be at least 1/6 of total lines for voice font properly expressing question tone.|
| Script | Exclamation utterances too few| Exclamation script lines are less than 1/6 of total script lines.| Exclamation script lines should be at least 1/6 of total lines for voice font properly expressing Exclamation tone.|
| Audio| Low sampling rate for neural voice | Audio sampling rate is lower than 24 KHz.| 	Wav file sampling rate should be equal or higher than 24 KHz for high-quality neural voice.|
| Volume | Overall volume too low | Volume of {} samples is lower than -18 dB (10% of max volume).| 	Control volume average level to proper range during recording or data preparation.|
| Volume | Volume truncation| Volume truncation is detected at {}s.| Adjust recording equipment to avoid volume truncation at its peak value.|
| Volume | Start silence not clean | First 100 ms silence isn't clean. Detect volume larger than -40 dB (1% of max volume).| 	Reduce recording noise floor level and leave the starting 100 ms as silence.|
| Volume| End silence not clean| Last 100 ms silence isn't clean. Detect volume larger than -40 dB (1% of max volume).| 	Reduce recording noise level and leave the end 100 ms as silence.|
| Mismatch | Script audio mismatch detected| There's a mismatch between script and audio content. | 	Review script and audio content to make sure they match and control the noise floor level. Reduce the long silence length or split into multiple utterances.|
| Mismatch | Extra audio energy detected before first word | 	Extra audio energy detected before first word. It may also be because of too short start silence before first word.| 	Review script and audio content to make sure they match and control the noise floor level. Also leave 100 ms silence before first word.|
| Mismatch | Extra audio energy detected after last word| Extra audio energy detected after last word. It may also be because of too short silence after last word.| 	Review script and audio content to make sure they match and control the noise floor level. Also leave 100 ms silence after last word.|
| Mismatch | Low signal-noise ratio | Audio SNR level is lower than {} dB.| Reduce audio noise level during recording or data preparation.|
| Mismatch | Recognize speech content fail | Fail to do speech recognition on this audio.| 	Check audio and script content to make sure the audio is valid speech, and match with script.|

## Train your custom neural voice model

After your dataset has been validated, you can use it to build your custom neural voice model.

1. On the **Train model** tab, click **Train model** to create a voice model with the data you have uploaded.

2. Select the neural training method for your model and target language.

By default, your voice model is trained in the same language of your training data. You can also select to create a secondary language (preview) for your voice model.  Check the languages supported for custom neural voice: [language for customization](language-support.md#customization).

3. Next, choose the dataset you want to use for training, and specify a speaker file.

>[!NOTE]
>- You need to select at least 300 utterances to create a custom neural voice.
>- To train a neural voice, you must specify a voice talent profile with the audio consent file provided of the voice talent acknowledging to use his/her speech data to train a custom voice model. Custom Neural Voice is available with limited access. Make sure you understand the [responsible AI requirements](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply the access here](https://aka.ms/customneural).
>- On this page you can also select to upload your script for testing. The testing script must be a txt file, less than 1Mb. Supported encoding format includes ANSI/ASCII, UTF-8, UTF-8-BOM, UTF-16-LE, or UTF-16-BE. Each paragraph of the utterance will result in a separate audio. If you want to combine all sentences into one audio, make them in one paragraph.

4. Then, enter a **Name** and **Description** to help you identify this model.

Choose a name carefully. The name you enter here will be the name you use to specify the voice in your request for speech synthesis as part of the SSML input. Only letters, numbers, and a few punctuation characters such as -, \_, and (', ') are allowed. Use different names for different neural voice models.

A common use of the **Description** field is to record the names of the datasets that were used to create the model.

5. Review the settings, then click **Submit** to start training the model.

> [!NOTE]
> Duplicate audio names will be removed from the training. Make sure the datasets you select don't contain the same audio names across multiple .zip files.

The **Train model** table displays a new entry that corresponds to this newly created model. The table also displays the status: Processing, Succeeded, Failed.

The status that's shown reflects the process of converting your dataset to a voice model, as shown here.

| State | Meaning |
| ----- | ------- |
| Processing | Your voice model is being created. |
| Succeeded	| Your voice model has been created and can be deployed. |
| Failed | Your voice model has been failed in training due to many reasons, for example, unseen data problems or network issues. |

Training duration varies depending on how much data you're training. It takes about 40 compute hours on average to train a custom neural voice. 

> [!NOTE]
> Training of custom neural voices isn't free. Check the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) here. Standard subscription (S0) users can train three voices simultaneously. If you reach the limit, wait until at least one of your voice fonts finishes training, and then try again. 

6. After you finish training the model successfully, you can review the model details.

Each training will generate 100 sample audio files automatically to help you test the model. After your voice model is successfully built, you can test it before deploying it for use.

The quality of the voice depends on many factors, including the size of the training data, the quality of the recording, the accuracy of the transcript file, how well the recorded voice in the training data matches the personality of the designed voice for your intended use case, and more. [Check here to learn more about the capabilities and limits of our technology and the best practice to improve your model quality](/legal/cognitive-services/speech-service/custom-neural-voice/characteristics-and-limitations-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext). 

## Create and use a custom neural voice endpoint

After you've successfully created and tested your voice model, you deploy it in a custom Text-to-Speech endpoint. You then use this endpoint in place of the usual endpoint when making Text-to-Speech requests through the REST API. Your custom endpoint can be called only by the subscription that you've used to deploy the font.

You can do the following to create a custom neural voice endpoint.

1. On the **Deploy model** tab, click **Deploy models**. 
2. Next, enter a **Name** and **Description** for your custom endpoint.
3. Then, select a voice model you would like to associate with this endpoint. 
4. Finally, click **Deploy** to create your endpoint.

After you've clicked the **Deploy** button, in the endpoint table, you'll see an entry for your new endpoint. It may take a few minutes to instantiate a new endpoint. When the status of the deployment is **Succeeded**, the endpoint is ready for use.

You can **Suspend** and **Resume** your endpoint if you don't use it all the time. When an endpoint is reactivated after suspension, the endpoint URL will be kept the same so you don't need to change your code in your apps. 

You can also update the endpoint to a new model. To change the model, make sure the new model is named the same as the one you want to update. 

> [!NOTE]
>- Standard subscription (S0) users can create up to 50 endpoints, each with its own custom neural voice.
>- To use your custom neural voice, you must specify the voice model name, use the custom URI directly in an HTTP request, and use the same subscription to pass through the authentication of TTS service.

After your endpoint is deployed, the endpoint name appears as a link. Click the link to display information specific to your endpoint, such as the endpoint key, endpoint URL, and sample code.

The custom endpoint is functionally identical to the standard endpoint that's used for text-to-speech requests.  For more information, see [Speech SDK](./get-started-text-to-speech.md) or [REST API](rest-text-to-speech.md).

We also provide an online tool, [Audio Content Creation](https://speech.microsoft.com/audiocontentcreation), that allows you to fine-tune their audio output using a friendly UI.

## Next steps

- [How to record voice samples](record-custom-voice-samples.md)
- [Text-to-Speech API reference](rest-text-to-speech.md)
- [Long Audio API](long-audio-api.md)