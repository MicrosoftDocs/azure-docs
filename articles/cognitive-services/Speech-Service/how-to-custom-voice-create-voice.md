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

2. Select **Add voice talent**.

3. Next, to define voice characteristics, select **Target scenario** to be used. Then describe your **Voice characteristics**.

> [!NOTE]
> The scenarios you provide must be consistent with what you've applied for in the application form.

4. Then, go to **Upload voice talent statement**, follow the instruction to upload voice talent statement you've prepared beforehand.

> [!NOTE]
> Make sure the verbal statement is recorded in the same settings as your training data, including the recording environment and speaking style.

5. Finally, go to **Review and create**,  you can review the settings and select **Submit**.

## Upload your data

When you're ready to upload your data, go to the **Prepare training data** tab to add your first training set and upload data.  A training set is a set of audio utterances and their mapping scripts used for training a voice model. You can use a training set to organize your training data. Data readiness checking will be done per each training set. You can import multiple data to a training set.

You can do the following to create and review your training data.

1. On the **Prepare training data** tab, select **Add training set** to enter **Name** and **Description** > **Create** to add a new training set.

   When the training set is successfully created, you can start to upload your data. 

2. To upload data, select **Upload data** > **Choose data type** > **Upload data** and **Specify the target training set**  > Enter **Name** and **Description** for your data > review the settings and select **Submit**.

> [!NOTE]
>- Duplicate audio names will be removed from the training. Make sure the data you select don't contain the same audio names within the .zip file or across multiple .zip files. If utterance IDs (either in audio or script files) are duplicate, they'll be rejected.
>- If you've created data files in the previous version of Speech Studio, you must specify a training set for your data in advance to use them. Or else, an exclamation mark will be appended to the data name, and the data could not be used.

Each data you upload must meet the requirements for the data type that you choose. It's important to correctly format your data before it's uploaded, which ensures the data will be accurately processed by the Custom Neural Voice service. Go to [Prepare training data](how-to-custom-voice-prepare-data.md) and make sure your data has been rightly formatted.

> [!NOTE]
> - Standard subscription (S0) users can upload five data files simultaneously. If you reach the limit, wait until at least one of your data files finishes importing. Then try again.
> - The maximum number of data files allowed to be imported per subscription is 10 .zip files for free subscription (F0) users and 500 for standard subscription (S0) users.

Data files are automatically validated once you hit the **Submit** button. Data validation includes series of checks on the audio files to verify their file format, size, and sampling rate. Fix the errors if any and submit again. 

Once the data is uploaded, you can check the details in the training set detail view. On the **Overview** tab, you can further check the pronunciation scores and the noise level for each of your data. The pronunciation score ranges from 0 to 100. A score below 70 normally indicates a speech error or script mismatch. A heavy accent can reduce your pronunciation score and affect the generated digital voice.

A higher signal-to-noise ratio (SNR) indicates lower noise in your audio. You can typically reach a 50+ SNR by recording at professional studios. Audio with an SNR below 20 can result in obvious noise in your generated voice.

Consider re-recording any utterances with low pronunciation scores or poor signal-to-noise ratios. If you can't re-record, consider excluding those utterances from your data.

On the **Data details**, you can check the data details of the training set. If there are any typical issues with the data, follow the instructions in the message displayed to fix them before training.

The issues are divided into three types. Referring to the following three tables to check the respective types of errors.

The first type of errors listed in the table below must be fixed manually, otherwise the data with these errors will be excluded during training.

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Script | Invalid separator| You must separate the utterance ID and the script content with a TAB character.|
| Script | Invalid script ID| Script line ID must be numeric.|
| Script | Duplicated script|Each line of the script content must be unique. The line is duplicated with {}.|
| Script | Script too long| The script must be less than 1,000 characters.|
| Script | No matching audio| The ID of each utterance (each line of the script file) must match the audio ID.|
| Script | No valid script| No valid script found in this dataset. Fix the script lines that appear in the detailed issue list.|
| Audio | No matching script| No audio files match the script ID. The name of the wav files must match with the IDs in the script file.|
| Audio | Invalid audio format| The audio format of the .wav files is invalid. Check the wav file format using an audio tool like [SoX](http://sox.sourceforge.net/).|
| Audio | Low sampling rate| The sampling rate of the .wav files cannot be lower than 16 KHz.|
| Audio | Too long audio| Audio duration is longer than 30 seconds. Split the long audio into multiple files. We suggest utterances should be shorter than 15 seconds.|
| Audio | No valid audio| No valid audio is found in this dataset. Check your audio data and upload again.|

The second type of errors listed in the table below will be automatically fixed, but double checking the fixed data is recommended.

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Audio | Stereo audio auto fixed | Use mono in your audio sample recordings. Stereo audio channels are automatically merged into a mono channel, which can cause content loss.  Download the normalized dataset and review it.|
| Volume | Volume peak auto fixed |The volume peak should be within the range of -3 dB (70% of max volume) to -6 dB (50%). Control the volume peak during the sample recording or data preparation. This audio is linearly scaled to fit the peak range automatically (-4 dB or 65%). Download the normalized dataset and review it.|
|Mismatch | Silence auto fixed| The start silence is detected to be longer than 200 ms, and has been trimmed to 200 ms automatically. Download the normalized dataset and review it. |
| Mismatch |Silence auto fixed | The end silence is detected to be longer than 200 ms, and has been trimmed to 200 ms automatically. Download the normalized dataset and review it. |
| Mismatch |Silence auto fixed |The start silence is detected to be shorter than 100 ms, and has been extended to 100 ms automatically. Download the normalized dataset and review it. |
| Mismatch |Silence auto fixed | The end silence is detected to be shorter than 100 ms, and has been extended to 100 ms automatically. Download the normalized dataset and review it.|

If the third type of errors listed in the table below aren't fixed, although the data with these errors won't be excluded during training, it will affect the quality of training. For higher-quality training, manually fixing these errors is recommended. 

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Script | Non-normalized text|This script contains digit 0-9. Expand them to normalized words and match with the audio. For example, normalize '123' to 'one hundred and twenty-three'.|
| Script | Non-normalized text|This script contains symbols {}. Normalize the symbols to match the audio. For example, '50%' to 'fifty percent'.|
| Script | Not enough question utterances| At least 10% of the total utterances should be question sentences. This helps the voice model properly express a questioning tone.|
| Script |Not enough exclamation utterances| At least 10% of the total utterances should be exclamation sentences. This helps the voice model properly express an excited tone.|
| Audio| Low sampling rate for neural voice | It's recommended that the sampling rate of your .wav files should be 24 KHz or higher for creating neural voices. It will be automatically upsampled to 24 KHz if it's lower.|
| Volume |Overall volume too low|Volume shouldn't be lower than -18 dB (10% of max volume). Control the volume average level within proper range during the sample recording or data preparation.|
| Volume | Volume overflow| Overflowing volume is detected at {}s. Adjust the recording equipment to avoid the volume overflow at its peak value.|
| Volume | Start silence issue | The first 100 ms silence isn't clean. Reduce the recording noise floor level and leave the first 100 ms at the start silent.|
| Volume| End silence issue| The last 100 ms silence  isn't clean.  Reduce the recording noise floor level and leave the last 100 ms at the end silent.|
| Mismatch | Low scored words|Review the script and the audio content to make sure they match and control the noise floor level. Reduce the length of long silence or split the audio into multiple utterances if it's too long.|
| Mismatch | Start silence issue |Extra audio was heard before the first word. Review the script and the audio content to make sure they match, control the noise floor level, and make the first 100 ms silent.|
| Mismatch | End silence issue| Extra audio was heard after the last word. Review the script and the audio content to make sure they match, control the noise floor level, and make the last 100 ms silent.|
| Mismatch | Low signal-noise ratio | Audio SNR level is lower than 20 dB. At least 35 dB is recommended.|
| Mismatch | No score available |Failed to recognize speech content in this audio. Check the audio and the script content to make sure the audio is valid, and matches the script.|

## Train your custom neural voice model

After your data files have been validated, you can use them to build your custom neural voice model.

1. On the **Train model** tab, select **Train model** to create a voice model with the data you have uploaded.

2. Select the neural training method for your model and target language.

By default, your voice model is trained in the same language of your training data. You can also select to create a secondary language (preview) for your voice model.  Check the languages supported for custom neural voice and cross-lingual feature: [language for customization](language-support.md#customization).

3. Next, choose the data you want to use for training, and specify a speaker file.

>[!NOTE]
>- You need to select at least 300 utterances to create a custom neural voice.
>- To train a neural voice, you must specify a voice talent profile with the audio consent file provided of the voice talent acknowledging to use his/her speech data to train a custom voice model. Custom Neural Voice is available with limited access. Make sure you understand the [responsible AI requirements](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply the access here](https://aka.ms/customneural).
>- On this page you can also select to upload your script for testing. The testing script must be a txt file, less than 1 Mb. Supported encoding format includes ANSI/ASCII, UTF-8, UTF-8-BOM, UTF-16-LE, or UTF-16-BE. Each paragraph of the utterance will result in a separate audio. If you want to combine all sentences into one audio, make them in one paragraph.

4. Then, enter a **Name** and **Description** to help you identify this model.

Choose a name carefully. The name you enter here will be the name you use to specify the voice in your request for speech synthesis as part of the SSML input. Only letters, numbers, and a few punctuation characters such as -, _, and (', ') are allowed. Use different names for different neural voice models.

A common use of the **Description** field is to record the names of the data that were used to create the model.

5. Review the settings, then select **Submit** to start training the model.

> [!NOTE]
> Duplicate audio names will be removed from the training. Make sure the data you select don't contain the same audio names across multiple .zip files.

The **Train model** table displays a new entry that corresponds to this newly created model. The table also displays the status: Processing, Succeeded, Failed.

The status that's shown reflects the process of converting your data to a voice model, as shown here.

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

1. On the **Deploy model** tab, select **Deploy model**. 
2. Next, enter a **Name** and **Description** for your custom endpoint.
3. Then, select a voice model you would like to associate with this endpoint. 
4. Finally, select **Deploy** to create your endpoint.

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
