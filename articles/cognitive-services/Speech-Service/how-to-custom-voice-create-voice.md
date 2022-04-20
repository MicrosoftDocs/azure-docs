---
title: Create a custom voice - Speech service
titleSuffix: Azure Cognitive Services
description: When you're ready to upload your data, go to the Custom Voice portal. Create or select a Custom Voice project. The project must share the right language, locale, and gender properties as the data you intend to use for your voice training.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/18/2022
ms.author: eur
ms.custom: references_regions
---

# Train your voice model

In [Prepare training data](how-to-custom-voice-prepare-data.md), you learned about the different data types you can use to train a custom neural voice, and the different format requirements. After you've prepared your data and the voice talent verbal statement, you can start to upload them to [Speech Studio](https://aka.ms/custom-voice-portal). In this article, you learn how to train a custom neural voice through the Speech Studio portal.

> [!NOTE]
> See [Custom Neural Voice project types](custom-neural-voice.md#custom-neural-voice-project-types) for information about capabilities, requirements, and differences between Custom Neural Voice Pro and Custom Neural Voice Lite projects. This article focuses on the creation of a professional Custom Neural Voice using the Pro project.

## Prerequisites

* [Create a custom voice project](how-to-custom-voice.md)
* [Prepare training data](how-to-custom-voice-prepare-data.md)

## Set up voice talent

A *voice talent* is an individual or target speaker whose voices are recorded and used to create neural voice models. Before you create a voice, define your voice persona and select a right voice talent. For details on recording voice samples, see [the tutorial](record-custom-voice-samples.md).

To train a neural voice, you must create a voice talent profile with an audio file recorded by the voice talent, consenting to the usage of their speech data to train a custom voice model. When you prepare your recording script, make sure you include the statement sentence. You can find the statement in multiple languages on [GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice/script/verbal-statement-all-locales.txt). The language of the verbal statement must be the same as your recording.

Upload this audio file to the Speech Studio as shown in the following screenshot. You create a voice talent profile, which is used to verify against your training data when you create a voice model. For more information, see [voice talent verification](/legal/cognitive-services/speech-service/custom-neural-voice/data-privacy-security-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext).

:::image type="content" source="media/custom-voice/upload-verbal-statement.png" alt-text="Screenshot that shows the upload voice talent statement.":::
 
> [!NOTE]
> Custom Neural Voice is available with limited access. Make sure you understand the [responsible AI requirements](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext), and then [apply for access](https://aka.ms/customneural). 

The following steps assume that you've prepared the voice talent verbal consent files. Go to [Speech Studio](https://aka.ms/custom-voice-portal) to select a Custom Neural Voice project, and then follow these steps to create a voice talent profile.

1. Go to **Text-to-Speech** > **Custom Voice** > **select a project**, and select **Set up voice talent**.

1. Select **Add voice talent**.

1. Next, to define voice characteristics, select **Target scenario**. Then describe your **Voice characteristics**.

   >[!NOTE]
   >The scenarios you provide must be consistent with what you've applied for in the application form.

1. Then, go to **Upload voice talent statement**, and follow the instruction to upload the voice talent statement you've prepared beforehand.

   >[!NOTE]
   >Make sure the verbal statement is recorded in the same settings as your training data, including the recording environment and speaking style.

1. Go to **Review and create**, review the settings, and select **Submit**.

## Upload your data

When you're ready to upload your data, go to the **Prepare training data** tab to add your first training set and upload data. A *training set* is a set of audio utterances and their mapping scripts used for training a voice model. You can use a training set to organize your training data. The service checks data readiness per each training set. You can import multiple data to a training set.

You can do the following to create and review your training data:

1. Select **Prepare training data** > **Add training set**.
1. Enter **Name** and **Description**, and then select **Create** to add a new training set.

   When the training set is successfully created, you can start to upload your data. 

1. Select **Upload data** > **Choose data type** > **Upload data**. Then select **Specify the target training set**.
1. Enter the name and description for your data, review the settings, and select **Submit**.

> [!NOTE]
>- Duplicate audio names are removed from the training. Make sure the data you select don't contain the same audio names within the .zip file or across multiple .zip files. If utterance IDs (either in audio or script files) are duplicates, they're rejected.
>- If you've created data files in the previous version of Speech Studio, you must specify a training set for your data in advance to use them. If you haven't, an exclamation mark is appended to the data name, and the data can't be used.

All data you upload must meet the requirements for the data type that you choose. It's important to correctly format your data before it's uploaded, which ensures the data will be accurately processed by the Speech service. Go to [Prepare training data](how-to-custom-voice-prepare-data.md), and confirm that your data is correctly formatted.

> [!NOTE]
> - Standard subscription (S0) users can upload five data files simultaneously. If you reach the limit, wait until at least one of your data files finishes importing. Then try again.
> - The maximum number of data files allowed to be imported per subscription is 500 .zip files for standard subscription (S0) users.

Data files are automatically validated when you select **Submit**. Data validation includes series of checks on the audio files to verify their file format, size, and sampling rate. If there are any errors, fix them and submit again. 

After you upload the data, you can check the details in the training set detail view. On the **Overview** tab, you can further check the pronunciation scores and the noise level for each of your data. The pronunciation score ranges from 0-100. A score below 70 normally indicates a speech error or script mismatch. A heavy accent can reduce your pronunciation score and affect the generated digital voice.

A higher signal-to-noise ratio (SNR) indicates lower noise in your audio. You can typically reach a 35+ SNR by recording at professional studios. Audio with an SNR below 20 can result in obvious noise in your generated voice.

Consider re-recording any utterances with low pronunciation scores or poor signal-to-noise ratios. If you can't re-record, consider excluding those utterances from your data.

### Typical data issues

On **Data details**, you can check the data details of the training set. If there are any typical issues with the data, follow the instructions in the message that appears, to fix them before training.

The issues are divided into three types. Refer to the following tables to check the respective types of errors. 

**Auto-rejected**

Data with these errors will not be used for training. Imported data with errors will be ignored, so you don't need to delete them. You can resubmit the corrected data for training.  

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Script | Invalid separator| You must separate the utterance ID and the script content with a Tab character.|
| Script | Invalid script ID| The script line ID must be numeric.|
| Script | Duplicated script|Each line of the script content must be unique. The line is duplicated with {}.|
| Script | Script too long| The script must be less than 1,000 characters.|
| Script | No matching audio| The ID of each utterance (each line of the script file) must match the audio ID.|
| Script | No valid script| No valid script is found in this dataset. Fix the script lines that appear in the detailed issue list.|
| Audio | No matching script| No audio files match the script ID. The name of the .wav files must match with the IDs in the script file.|
| Audio | Invalid audio format| The audio format of the .wav files is invalid. Check the .wav file format by using an audio tool like [SoX](http://sox.sourceforge.net/).|
| Audio | Low sampling rate| The sampling rate of the .wav files can't be lower than 16 KHz.|
| Audio | Too long audio| Audio duration is longer than 30 seconds. Split the long audio into multiple files. It's a good idea to make utterances shorter than 15 seconds.|
| Audio | No valid audio| No valid audio is found in this dataset. Check your audio data and upload again.|
| Mismatch | Low scored utterance| Sentence-level pronunciation score is lower than 70. Review the script and the audio content to make sure they match.|

**Auto-fixed**

The following errors are fixed automatically, but you should confirm that the fixes have been made.

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Mismatch |Silence auto fixed |The start silence is detected to be shorter than 100 ms, and has been extended to 100 ms automatically. Download the normalized dataset and review it. |
| Mismatch |Silence auto fixed | The end silence is detected to be shorter than 100 ms, and has been extended to 100 ms automatically. Download the normalized dataset and review it.|

**Manual check required**

Unresolved errors listed in the next table affect the quality of training, but data with these errors won't be excluded during training. For higher-quality training, it's a good idea to fix these errors manually. 

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Script | Non-normalized text|This script contains digits. Expand them to normalized words, and match with the audio. For example, normalize *123* to *one hundred and twenty-three*.|
| Script | Non-normalized text|This script contains symbols. Normalize the symbols to match the audio. For example, normalize *50%* to *fifty percent*.|
| Script | Not enough question utterances| At least 10 percent of the total utterances should be question sentences. This helps the voice model properly express a questioning tone.|
| Script | Not enough exclamation utterances| At least 10 percent of the total utterances should be exclamation sentences. This helps the voice model properly express an excited tone.|
| Audio| Low sampling rate for neural voice | It's recommended that the sampling rate of your .wav files should be 24 KHz or higher for creating neural voices. If it's lower, it will be automatically raised to 24 KHz.|
| Volume |Overall volume too low|Volume shouldn't be lower than -18 dB (10 percent of max volume). Control the volume average level within proper range during the sample recording or data preparation.|
| Volume | Volume overflow| Overflowing volume is detected at {}s. Adjust the recording equipment to avoid the volume overflow at its peak value.|
| Volume | Start silence issue | The first 100 ms of silence isn't clean. Reduce the recording noise floor level, and leave the first 100 ms at the start silent.|
| Volume| End silence issue| The last 100 ms of silence isn't clean. Reduce the recording noise floor level, and leave the last 100 ms at the end silent.|
| Mismatch | Low scored words|Review the script and the audio content to make sure they match, and control the noise floor level. Reduce the length of long silence, or split the audio into multiple utterances if it's too long.|
| Mismatch | Start silence issue |Extra audio was heard before the first word. Review the script and the audio content to make sure they match, control the noise floor level, and make the first 100 ms silent.|
| Mismatch | End silence issue| Extra audio was heard after the last word. Review the script and the audio content to make sure they match, control the noise floor level, and make the last 100 ms silent.|
| Mismatch | Low signal-noise ratio | Audio SNR level is lower than 20 dB. At least 35 dB is recommended.|
| Mismatch | No score available |Failed to recognize speech content in this audio. Check the audio and the script content to make sure the audio is valid, and matches the script.|

## Train your Custom Neural Voice model

After you validate your data files, you can use them to build your Custom Neural Voice model.

1. On the **Train model** tab, select **Train model** to create a voice model with the data you've uploaded.

1. Select the neural training method for your model and target language. By default, your voice model is trained in the same language of your training data. You can also select to create a secondary language for your voice model. For more information, see [language support for Custom Neural Voice](language-support.md#custom-neural-voice). Also see information about [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for neural training.

1. Choose the data you want to use for training, and specify a speaker file.

   >[!NOTE]
   >- To create a custom neural voice, select at least 300 utterances.
   >- To train a neural voice, you must specify a voice talent profile. This profile must provide the audio consent file of the voice talent, acknowledging to use his or her speech data to train a custom neural voice model. Custom Neural Voice is available with limited access. Make sure you understand the [responsible AI requirements](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply the access](https://aka.ms/customneural).

1. Choose your test script. Each training generates 100 sample audio files automatically, to help you test the model with a default script. You can also provide your own test script. The test script must exclude the filenames (the ID of each utterance). Otherwise, these IDs are spoken. Here's an example of how the utterances are organized in one .txt file:

   ```
   This is the waistline, and it's falling.
   We have trouble scoring.
   It was Janet Maslin.
   ```

   Each paragraph of the utterance results in a separate audio. If you want to combine all sentences into one audio, make them a single paragraph.

   >[!NOTE]
   >- The test script must be a .txt file, less than 1 MB. Supported encoding formats include ANSI/ASCII, UTF-8, UTF-8-BOM, UTF-16-LE, or UTF-16-BE.  
   >- The generated audios are a combination of the uploaded test script and the default test script.

1. Enter a **Name** and **Description** to help you identify this model. Choose a name carefully. The name you enter here will be the name you use to specify the voice in your request for speech synthesis as part of the SSML input. Only letters, numbers, and a few punctuation characters are allowed. Use different names for different neural voice models.

   A common use of the **Description** field is to record the names of the data that you used to create the model.

1. Review the settings, then select **Submit** to start training the model.

   > [!NOTE]
   > Duplicate audio names will be removed from the training. Make sure the data you select don't contain the same audio names across multiple .zip files.

   The **Train model** table displays a new entry that corresponds to this newly created model. The table also displays the status: processing, succeeded, or failed. The status reflects the process of converting your data to a voice model, as shown in this table:

   | State | Meaning |
   | ----- | ------- |
   | Processing | Your voice model is being created. |
   | Succeeded	| Your voice model has been created and can be deployed. |
   | Failed | Your voice model has failed in training. The cause of the failure might be, for example, unseen data problems or network issues. |

   Training duration varies depending on how much data you're training. It takes about 40 compute hours on average to train a custom neural voice. 

   > [!NOTE]
   > Standard subscription (S0) users can train three voices simultaneously. If you reach the limit, wait until at least one of your voice models finishes training, and then try again. 

1. After you finish training the model successfully, you can review the model details.

After your voice model is successfully built, you can use the generated sample audio files to test it before deploying it for use.

The quality of the voice depends on many factors, such as:

- The size of the training data.
- The quality of the recording.
- The accuracy of the transcript file.
- How well the recorded voice in the training data matches the personality of the designed voice for your intended use case.

For more information, [learn more about the capabilities and limits of this feature, and the best practice to improve your model quality](/legal/cognitive-services/speech-service/custom-neural-voice/characteristics-and-limitations-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext). 

> [!NOTE]
> Custom Neural Voice training is only available in the three regions: East US, Southeast Asia, and UK South. But you can easily copy a neural voice model from the three regions to other regions. For more information, see the [regions for Custom Neural Voice](regions.md#text-to-speech).

## Next steps

- [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md)
- [How to record voice samples](record-custom-voice-samples.md)
- [Text-to-Speech API reference](rest-text-to-speech.md)
- [Long Audio API](long-audio-api.md)

