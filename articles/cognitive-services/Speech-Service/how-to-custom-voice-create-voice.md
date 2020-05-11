---
title: "Create a Custom Voice - Speech service"
titleSuffix: Azure Cognitive Services
description: "When you're ready to upload your data, go to the Custom Voice portal. Create or select a Custom Voice project. The project must share the right language/locale and the gender properties as the data you intent to use for your voice training."
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: erhopf
---

# Create a Custom Voice

In [Prepare data for Custom Voice](how-to-custom-voice-prepare-data.md), we described the different data types you can use to train a custom voice and the different format requirements. Once you have prepared your data, you can start to upload them to the [Custom Voice portal](https://aka.ms/custom-voice-portal), or through the Custom Voice training API. Here we describe the steps of training a custom voice through the portal.

> [!NOTE]
> This page assumes you have read [Get started with Custom Voice](how-to-custom-voice.md) and [Prepare data for Custom Voice](how-to-custom-voice-prepare-data.md), and have created a Custom Voice project.

Check the languages supported for custom voice: [language for customization](language-support.md#customization).

## Upload your datasets

When you're ready to upload your data, go to the [Custom Voice portal](https://aka.ms/custom-voice-portal). Create or select a Custom Voice project. The project must share the right language/locale and the gender properties as the data you intent to use for your voice training. For example, select `en-GB` if the audio recordings you have is done in English with a UK accent.

Go to the **Data** tab and click **Upload data**. In the wizard, select the correct data type that matches what you have prepared.

Each dataset you upload must meet the requirements for the data type that you choose. It is important to correctly format your data before it's uploaded. This ensures the data will be accurately processed by the Custom Voice service. Go to [Prepare data for Custom Voice](how-to-custom-voice-prepare-data.md) and make sure your data has been rightly formatted.

> [!NOTE]
> Free subscription (F0) users can upload two datasets simultaneously. Standard subscription (S0) users can upload five datasets simultaneously. If you reach the limit, wait until at least one of your datasets finishes importing. Then try again.

> [!NOTE]
> The maximum number of datasets allowed to be imported per subscription is 10 .zip files for free subscription (F0) users and 500 for standard subscription (S0) users.

Datasets are automatically validated once you hit the upload button. Data validation includes series of checks on the audio files to verify their file format, size, and sampling rate. Fix the errors if any and submit again. When the data-importing request is successfully initiated, you should see an entry in the data table that corresponds to the dataset you’ve just uploaded.

The following table shows the processing states for imported datasets:

| State | Meaning |
| ----- | ------- |
| Processing | Your dataset has been received and is being processed. |
| Succeeded	| Your dataset has been validated and may now be used to build a voice model. |
| Failed | Your dataset has been failed during processing due to many reasons, for example file errors, data problems or network issues. |

After validation is complete, you can see the total number of matched utterances for each of your datasets in the **Utterances** column. If the data type you have selected requires long-audio segmentation, this column only reflects the utterances we have segmented for you either based on your transcripts or through the speech transcription service. You can further download the dataset validated to view the detail results of the utterances successfully imported and their mapping transcripts. Hint: long-audio segmentation can take more than an hour to complete data processing.

For en-US and zh-CN datasets, you can further download a report to check the pronunciation scores and the noise level for each of your recordings. The pronunciation score ranges from 0 to 100. A score below 70 normally indicates a speech error or script mismatch. A heavy accent can reduce your pronunciation score and impact the generated digital voice.

A higher signal-to-noise ratio (SNR) indicates lower noise in your audio. You can typically reach a 50+ SNR by recording at professional studios. Audio with an SNR below 20 can result in obvious noise in your generated voice.

Consider re-recording any utterances with low pronunciation scores or poor signal-to-noise ratios. If you can't re-record, you might exclude those utterances from your dataset.

## Build your custom voice model

After your dataset has been validated, you can use it to build your custom voice model.

1.	Navigate to **Text-to-Speech > Custom Voice > Training**.

2.	Click **Train model**.

3.	Next, enter a **Name** and **Description** to help you identify this model.

    Choose a name carefully. The name you enter here will be the name you use to specify the voice in your request for speech synthesis as part of the SSML input. Only letters, numbers, and a few punctuation characters such as -, \_, and (', ') are allowed. Use different names for different voice models.

    A common use of the **Description** field is to record the names of the datasets that were used to create the model.

4.	From the **Select training data** page, choose one or multiple datasets that you would like to use for training. Check the number of utterances before you submit them. You can start with any number of utterances for en-US and zh-CN voice models. For other locales, you must select more than 2,000 utterances to be able to train a voice.

    > [!NOTE]
    > Duplicate audio names will be removed from the training. Make sure the datasets you select do not contain the same audio names across multiple .zip files.

    > [!TIP]
    > Using the datasets from the same speaker is required for quality results. When the datasets you have submitted for training contain a total number of less than 6,000 distinct utterances, you will train your voice model through the Statistical Parametric Synthesis technique. In the case where your training data exceeds a total number of 6,000 distinct utterances, you will kick off a training process with the Concatenation Synthesis technique. Normally the concatenation technology can result in more natural, and higher-fidelity voice results. [Contact the Custom Voice team](https://go.microsoft.com/fwlink/?linkid=2108737) if you want to train a model with the latest Neural TTS technology that can produce a digital voice equivalent to the publicly available [neural voices](language-support.md#neural-voices).

5.	Click **Train** to begin creating your voice model.

The Training table displays a new entry that corresponds to this newly created model. The table also displays the status: Processing, Succeeded, Failed.

The status that's shown reflects the process of converting your dataset to a voice model, as shown here.

| State | Meaning |
| ----- | ------- |
| Processing | Your voice model is being created. |
| Succeeded	| Your voice model has been created and can be deployed. |
| Failed | Your voice model has been failed in training due to many reasons, for example unseen data problems or network issues. |

Training time varies depending on the volume of audio data processed. Typical times range from about 30 minutes for hundreds of utterances to 40 hours for 20,000 utterances. Once your model training is succeeded, you can start to test it.

> [!NOTE]
> Free subscription (F0) users can train one voice font simultaneously. Standard subscription (S0) users can train three voices simultaneously. If you reach the limit, wait until at least one of your voice fonts finishes training, and then try again.

> [!NOTE]
> The maximum number of voice models allowed to be trained per subscription is 10 models for free subscription (F0) users and 100 for standard subscription (S0) users.

If you are using the neural voice training capability, you can select to train a model optimized for real-time streaming scenarios, or a HD neural model optimized for asynchronous [long-audio synthesis](long-audio-api.md).  

## Test your voice model

After your voice font is successfully built, you can test it before deploying it for use.

1.	Navigate to **Text-to-Speech > Custom Voice > Testing**.

2.	Click **Add test**.

3.	Select one or multiple models that you would like to test.

4.	Provide the text you want the voice(s) to speak. If you have selected to test multiple models at one time, the same text will be used for the testing for different models.

    > [!NOTE]
    > The language of your text must be the same as the language of your voice font. Only successfully trained models can be tested. Only plain text is supported in this step.

5.	Click **Create**.

Once you have submitted your test request, you will return to the test page. The table now includes an entry that corresponds to your new request and the status column. It can take a few minutes to synthesize speech. When the status column says **Succeeded**, you can play the audio, or download the text input (a .txt file) and audio output (a .wav file), and further audition the latter for quality.

You can also find the test results in the detail page of each models you have selected for testing. Go to the **Training** tab, and click the model name to enter the model detail page.

## Create and use a custom voice endpoint

After you've successfully created and tested your voice model, you deploy it in a custom Text-to-Speech endpoint. You then use this endpoint in place of the usual endpoint when making Text-to-Speech requests through the REST API. Your custom endpoint can be called only by the subscription that you have used to deploy the font.

To create a new custom voice endpoint, go to **Text-to-Speech > Custom Voice > Deployment**. Select **Add endpoint** and enter a **Name** and **Description** for your custom endpoint. Then select the custom voice model you would like to associate with this endpoint.

After you have clicked the **Add** button, in the endpoint table, you will see an entry for your new endpoint. It may take a few minutes to instantiate a new endpoint. When the status of the deployment is **Succeeded**, the endpoint is ready for use.

> [!NOTE]
> Free subscription (F0) users can have only one model deployed. Standard subscription (S0) users can create up to 50 endpoints, each with its own custom voice.

> [!NOTE]
> To use your custom voice, you must specify the voice model name, use the custom URI directly in an HTTP request, and use the same subscription to pass through the authentication of TTS service.

After your endpoint is deployed, the endpoint name appears as a link. Click the link to display information specific to your endpoint, such as the endpoint key, endpoint URL, and sample code.

Online testing of the endpoint is also available via the custom voice portal. To test your endpoint, choose **Check endpoint** from the **Endpoint detail** page. The endpoint testing page appears. Enter the text to be spoken (in either plain text or [SSML format](speech-synthesis-markup.md) in the text box. To hear the text spoken in your custom voice font, select **Play**. This testing feature will be charged against your custom speech synthesis usage.

The custom endpoint is functionally identical to the standard endpoint that's used for text-to-speech requests. See [REST API](rest-text-to-speech.md) for more information.

## Next steps

* [Guide: Record your voice samples](record-custom-voice-samples.md)
* [Text-to-Speech API reference](rest-text-to-speech.md)
* [Long Audio API](long-audio-api.md)
