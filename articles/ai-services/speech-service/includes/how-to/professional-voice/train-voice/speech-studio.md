---
 title: include file
 description: include file
 author: eur
 ms.author: eric-urban
 ms.service: azure-ai-services
 ms.topic: include
 ms.date: 11/24/2023
 ms.custom: include
---

In this article, you learn how to train a custom neural voice through the Speech Studio portal.

> [!IMPORTANT]
> Custom neural voice training is currently only available in some regions. After your voice model is trained in a supported region, you can [copy](#copy-your-voice-model-to-another-project) it to a Speech resource in another region as needed. For more information, see the footnotes in the [Speech service table](../../../../regions.md#speech-service).

Training duration varies depending on how much data you use. It takes about 40 compute hours on average to train a custom neural voice. Standard subscription (S0) users can train four voices simultaneously. If you reach the limit, wait until at least one of your voice models finishes training, and then try again.

> [!NOTE]
> Although the total number of hours required per [training method](#choose-a-training-method) varies, the same unit price applies to each. For more information, see the [Custom Neural training pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## Choose a training method

After you validate your data files, use them to build your custom neural voice model. When you create a custom neural voice, you can choose to train it with one of the following methods:

- [Neural](?tabs=neural#train-your-custom-neural-voice-model): Create a voice in the same language of your training data.

- [Neural - cross lingual](?tabs=crosslingual#train-your-custom-neural-voice-model): Create a secondary language for your voice model to speak a different language from your training data. For example, with the `zh-CN` training data, you can create a voice that speaks `en-US`.

  The language of the training data and the target language must both be one of the [languages that are supported](../../../../language-support.md?tabs=tts#custom-neural-voice) for cross lingual voice training. You don't need to prepare training data in the target language, but your test script must be in the target language.

- [Neural - multi style](?tabs=multistyle#train-your-custom-neural-voice-model): Create a custom neural voice that speaks in multiple styles and emotions, without adding new training data. Multiple style voices are useful for video game characters, conversational chatbots, audiobooks, content readers, and more.

  To create a multiple style voice, you need to prepare a set of general training data, at least 300 utterances. Select one or more of the preset target speaking styles. You can also create multiple custom styles by providing style samples, of at least 100 utterances per style, as extra training data for the same voice. The supported preset styles vary according to different languages. See [Available preset styles across different languages](?tabs=multistyle#available-preset-styles-across-different-languages).

The language of the training data must be one of the [languages that are supported](../../../../language-support.md?tabs=tts) for custom neural voice, cross-lingual, or multiple style training.

## Train your custom neural voice model

To create a custom neural voice in Speech Studio, follow these steps for one of the following methods:

# [Neural](#tab/neural)

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customvoice).
1. Select **Custom voice** > *\<Your project name>* > **Train model** > **Train a new model**.
1. Select **Neural** as the [training method](#choose-a-training-method) for your model and then select **Next**. To use a different training method, see [Neural - cross lingual](?tabs=crosslingual#train-your-custom-neural-voice-model) or [Neural - multi style](?tabs=multistyle#train-your-custom-neural-voice-model).

   :::image type="content" source="../../../../media/custom-voice/cnv-train-neural.png" alt-text="Screenshot that shows how to select neural training.":::

1. Select a version of the training recipe for your model. The latest version is selected by default. The supported features and training time can vary by version. Normally, we recommend the latest version. In some cases, you can choose an earlier version to reduce training time.
1. Select the data that you want to use for training. Duplicate audio names are removed from the training. Make sure that the data you select doesn't contain the same audio names across multiple *.zip* files.

   You can select only successfully processed datasets for training. If you don't see your training set in the list, check your data processing status.

1. Select a speaker file with the voice talent statement that corresponds to the speaker in your training data.
1. Select **Next**.
1. Each training generates 100 sample audio files automatically to help you test the model with a default script.

   Optionally, you can also select **Add my own test script** and provide your own test script with up to 100 utterances to test the model at no extra cost. The generated audio files are a combination of the automatic test scripts and custom test scripts. For more information, see [test script requirements](#test-script-requirements).

1. Enter a **Name** to help you identify the model. Choose a name carefully. The model name is used as the voice name in your [speech synthesis request](../../../../how-to-deploy-and-use-endpoint.md#use-your-custom-voice) by the SDK and SSML input. Only letters, numbers, and a few punctuation characters are allowed. Use different names for different neural voice models.
1. Optionally, enter the **Description** to help you identify the model. A common use of the description is to record the names of the data that you used to create the model.
1. Select **Next**.
1. Review the settings and select the box to accept the terms of use.
1. Select **Submit** to start training the model.

# [Neural - cross lingual](#tab/crosslingual)

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customvoice).
1. Select **Custom voice** > *\<Your project name>* > **Train model** > **Train a new model**.
1. Select **Neural - cross lingual** as the [training method](#choose-a-training-method) for your model. To use a different training method, see [Neural](?tabs=neural#train-your-custom-neural-voice-model) or [Neural - multi style](?tabs=multistyle#train-your-custom-neural-voice-model).

   :::image type="content" source="../../../../media/custom-voice/cnv-train-neural-cross-lingual.png" alt-text="Screenshot that shows how to select neural cross lingual training.":::

1. Select the **Target language** that is the secondary language for your voice model. You can select only one target language for a voice model.
1. Select the data that you want to use for training. Duplicate audio names are removed from the training. Make sure that the data you select doesn't contain the same audio names across multiple *.zip* files.

   You can select only successfully processed datasets for training. Check your data processing status if you don't see your training set in the list.

1. Select a speaker file with the voice talent statement that corresponds to the speaker in your training data.
1. Select **Next**.
1. Each training generates 100 sample audio files automatically to help you test the model with a default script.

   Optionally, you can also select **Add my own test script** and provide your own test script with up to 100 utterances to test the model at no extra cost. The generated audio files are a combination of the automatic test scripts and custom test scripts. For more information, see [Test script requirements](#test-script-requirements).

1. Enter a **Name** to help you identify the model. Choose a name carefully. The model name is used as the voice name in your [speech synthesis request](../../../../how-to-deploy-and-use-endpoint.md#use-your-custom-voice) by the SDK and SSML input. Only letters, numbers, and a few punctuation characters are allowed. Use different names for different neural voice models.
1. Optionally, enter the **Description** to help you identify the model. A common use of the description is to record the names of the data that you used to create the model.
1. Select **Next**.
1. Review the settings and select the box to accept the terms of use.
1. Select **Submit** to start training the model.

# [Neural - multi style](#tab/multistyle)

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customvoice).
1. Select **Custom voice** > *\<Your project name>* > **Train model** > **Train a new model**.
1. Select **Neural - multi style** as the [training method](#choose-a-training-method) for your model. To use a different training method, see [Neural](?tabs=neural#train-your-custom-neural-voice-model) or [Neural - cross lingual](?tabs=crosslingual#train-your-custom-neural-voice-model).

   :::image type="content" source="../../../../media/custom-voice/cnv-train-neural-multi-style.png" alt-text="Screenshot that shows how to select neural multi style training.":::

1. Select one or more preset speaking styles to train.
1. Select the data that you want to use for training. Duplicate audio names are removed from the training. Make sure that the data you select doesn't contain the same audio names across multiple *.zip* files.

   You can select only successfully processed datasets for training. Check your data processing status if you don't see your training set in the list.

1. Select **Next**.

1. Optionally, you can add other custom speaking styles. The maximum number of custom styles varies by languages: `English (United States)` allows up to 10 custom styles, `Chinese (Mandarin, Simplified)` allows up to four custom styles, and `Japanese (Japan)` allows up to five custom styles.

   1. Select **Add a custom style** and enter a custom style name of your choice. This name is used by your application within the `style` element of [Speech Synthesis Markup Language (SSML)](../../../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles). You can also use the custom style name as SSML by using the [Audio Content Creation](../../../../how-to-audio-content-creation.md) tool in [Speech Studio](https://speech.microsoft.com/portal/audiocontentcreation).
   1. Select style samples as training data. Ensure that the training data for custom speaking styles comes from the same speaker as the data used to create the default style.

1. Select **Next**.
1. Select a speaker file with the voice talent statement that corresponds to the speaker in your training data.
1. Select **Next**.
1. Each training automatically generates 100 sample audio files for the default style and 20 for each preset style to help you test the model with a default script.

Optionally, you can also select **Add my own test script** and provide your own test script with up to 100 utterances to test the default style at no extra cost. The generated audio files are a combination of the automatic test scripts and custom test scripts. For more information, see [test script requirements](#test-script-requirements).

1. Enter a **Name** to help you identify the model. Choose a name carefully. The model name is used as the voice name in your [speech synthesis request](../../../../how-to-deploy-and-use-endpoint.md#use-your-custom-voice) by the SDK and SSML input. Only letters, numbers, and a few punctuation characters are allowed. Use different names for different neural voice models.
1. Optionally, enter the **Description** to help you identify the model. A common use of the description is to record the names of the data that you used to create the model.
1. Select **Next**.
1. Review the settings and select the box to accept the terms of use.
1. Select **Submit** to start training the model.

## Available preset styles across different languages

The following table summarizes the different preset styles according to different languages.

| Speaking style | Language |
|:-------------- |:-------- |
| angry       | English (United States)<br> Chinese (Mandarin, Simplified)(preview)<br> Japanese (Japan)(preview) |
| calm        | Chinese (Mandarin, Simplified)(preview)|
| chat        | Chinese (Mandarin, Simplified)(preview) |
| cheerful    | English (United States) <br> Chinese (Mandarin, Simplified)(preview) <br>Japanese (Japan)(preview) |
| disgruntled | Chinese (Mandarin, Simplified)(preview) |
| excited     | English (United States) |
| fearful     | Chinese (Mandarin, Simplified)(preview) |
| friendly    | English (United States) |
| hopeful     | English (United States) |
| sad         | English (United States)<br>Chinese (Mandarin, Simplified)(preview)<br>Japanese (Japan)(preview) |
| shouting    | English (United States) |
| terrified   | English (United States) |
| unfriendly  | English (United States)|
| whispering  | English (United States) |
| serious     | Chinese (Mandarin, Simplified)(preview) |

---

The **Train model** table displays a new entry that corresponds to this newly created model. The status reflects the process of converting your data to a voice model, as described in this table:

| State | Meaning |
|:----- |:------- |
| Processing | Your voice model is being created. |
| Succeeded  | Your voice model has been created and can be deployed. |
| Failed     | Your voice model has failed in training. The cause of the failure might be, for example, unseen data problems or network issues. |
| Canceled   | The training for your voice model was canceled. |

While the model status is **Processing**, you can select **Cancel training** to cancel your voice model. You're not charged for this canceled training.

:::image type="content" source="../../../../media/custom-voice/cnv-cancel-training.png" alt-text="Screenshot that shows how to cancel training for a model.":::

After you finish training the model successfully, you can review the model details and [Test your voice model](#test-your-voice-model).

You can use the [Audio Content Creation](../../../../how-to-audio-content-creation.md) tool in Speech Studio to create audio and fine-tune your deployed voice. If applicable for your voice, you can select one of multiple styles.

### Rename your model

1. If you want to rename the model you built, select **Clone model** to create a clone of the model with a new name in the current project.

   :::image type="content" source="../../../../media/custom-voice/cnv-clone-model.png" alt-text="Screenshot of selecting the Clone model button.":::

1. Enter the new name on the **Clone voice model** window, then select **Submit**. The text *Neural* is automatically added as a suffix to your new model name.

   :::image type="content" source="../../../../media/custom-voice/cnv-clone-model-rename.png" alt-text="Screenshot of cloning a model with a new name.":::

### Test your voice model

After your voice model is successfully built, you can use the generated sample audio files to test it before you deploy it.

The quality of the voice depends on many factors, such as:

- The size of the training data.
- The quality of the recording.
- The accuracy of the transcript file.
- How well the recorded voice in the training data matches the personality of the designed voice for your intended use case.

Select **DefaultTests** under **Testing** to listen to the sample audio files. The default test samples include 100 sample audio files generated automatically during training to help you test the model. In addition to these 100 audio files provided by default, your own test script utterances are also added to **DefaultTests** set. This addition is at most 100 utterances. You're not charged for the testing with **DefaultTests**.

:::image type="content" source="../../../../media/custom-voice/cnv-model-default-test.png" alt-text="Screenshot of selecting DefaultTests under Testing.":::

If you want to upload your own test scripts to further test your model, select **Add test scripts** to upload your own test script.

:::image type="content" source="../../../../media/custom-voice/cnv-model-add-testscripts.png" alt-text="Screenshot of adding model test scripts.":::

Before you upload test script, check the [Test script requirements](#test-script-requirements). You're charged for the extra testing with the batch synthesis based on the number of billable characters. See [Azure AI Speech pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Under **Add test scripts**, select **Browse for a file** to select your own script, then select **Add** to upload it.

:::image type="content" source="../../../../media/custom-voice/cnv-model-upload-testscripts.png" alt-text="Screenshot of uploading model test scripts.":::

### Test script requirements

The test script must be a *.txt* file that is less than 1 MB. Supported encoding formats include ANSI/ASCII, UTF-8, UTF-8-BOM, UTF-16-LE, or UTF-16-BE.

Unlike the [training transcription files](../../../../how-to-custom-voice-training-data.md#transcription-data-for-individual-utterances--matching-transcript), the test script should exclude the utterance ID, which is the filename of each utterance. Otherwise, these IDs are spoken.

Here's an example set of utterances in one *.txt* file:

```text
This is the waistline, and it's falling.
We have trouble scoring.
It was Janet Maslin.
```

Each paragraph of the utterance results in a separate audio. If you want to combine all sentences into one audio, make them a single paragraph.

>[!NOTE]
> The generated audio files are a combination of the automatic test scripts and custom test scripts.

### Update engine version for your voice model

Azure text to speech engines are updated from time to time to capture the latest language model that defines the pronunciation of the language. After you train your voice, you can apply your voice to the new language model by updating to the latest engine version.

1. When a new engine is available, you're prompted to update your neural voice model.

   :::image type="content" source="../../../../media/custom-voice/cnv-engine-update-prompt.png" alt-text="Screenshot of displaying engine update message." lightbox="media/custom-voice/cnv-engine-update-prompt.png":::

1. Go to the model details page and follow the on-screen instructions to install the latest engine.

   :::image type="content" source="../../../../media/custom-voice/cnv-new-engine-install.png" alt-text="Screenshot of following on-screen instructions to install the new engine.":::

   Alternatively, select **Install the latest engine** later to update your model to the latest engine version.

   :::image type="content" source="../../../../media/custom-voice/cnv-install-latest-engine.png" alt-text="Screenshot of selecting Install the latest engine button to update engine.":::

   You're not charged for engine update. The previous versions are still kept.

1. You can check all engine versions for the model from the **Engine version** list, or remove one if you don't need it anymore.

   :::image type="content" source="../../../../media/custom-voice/cnv-engine-version.png" alt-text="Screenshot of displaying Engine version drop-down list.":::

   The updated version is automatically set as default. But you can change the default version by selecting a version from the drop-down list and selecting **Set as default**.

   :::image type="content" source="../../../../media/custom-voice/cnv-engine-set-default.png" alt-text="Screenshot that shows how to set a version as default.":::

If you want to test each engine version of your voice model, you can select a version from the list, then select **DefaultTests** under **Testing** to listen to the sample audio files. If you want to upload your own test scripts to further test your current engine version, first make sure the version is set as default, then follow the steps in [Test your voice model](#test-your-voice-model).

Updating the engine creates a new version of the model at no extra cost. After you update the engine version for your voice model, you need to deploy the new version to [create a new endpoint](../../../../how-to-deploy-and-use-endpoint.md#add-a-deployment-endpoint). You can only deploy the default version.

:::image type="content" source="../../../../media/custom-voice/cnv-engine-redeploy.png" alt-text="Screenshot that shows how to redeploy a new version of your voice model.":::

After you create a new endpoint, you need to [transfer the traffic to the new endpoint in your product](../../../../how-to-deploy-and-use-endpoint.md#switch-to-a-new-voice-model-in-your-product).

To learn more about the capabilities and limits of this feature, and the best practice to improve your model quality, see [Characteristics and limitations for using custom neural voice](/legal/cognitive-services/speech-service/custom-neural-voice/characteristics-and-limitations-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext).

## Copy your voice model to another project

You can copy your voice model to another project for the same region or another region. For example, you can copy a neural voice model that was trained in one region, to a project for another region.

> [!NOTE]
> Custom neural voice training is currently only available in some regions. You can copy a neural voice model from those regions to other regions. For more information, see the [regions for custom neural voice](../../../../regions.md#speech-service).

To copy your custom neural voice model to another project:

1. On the **Train model** tab, select a voice model that you want to copy, and then select **Copy to project**.

   :::image type="content" source="../../../../media/custom-voice/cnv-model-copy.png" alt-text="Screenshot of the copy to project option.":::

1. Select the **Region**, **Speech resource**, and **Project** where you want to copy the model. You must have a speech resource and project in the target region, otherwise you need to create them first.

    :::image type="content" source="../../../../media/custom-voice/cnv-model-copy-dialog.png" alt-text="Screenshot of the copy voice model dialog.":::

1. Select **Submit** to copy the model.
1. Select **View model** under the notification message for the successful copying.

Navigate to the project where you copied the model to [deploy the model copy](../../../../how-to-deploy-and-use-endpoint.md).
