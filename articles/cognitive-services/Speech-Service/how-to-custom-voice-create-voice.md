---
title: Train your custom voice model - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to train a custom neural voice through the Speech Studio portal.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 10/14/2022
ms.author: eur
ms.custom: references_regions
---

# Train your voice model

In this article, you learn how to train a custom neural voice through the Speech Studio portal.

> [!IMPORTANT]
> Custom Neural Voice training is currently only available in some regions. After your voice model is trained in a supported region, you can [copy](#copy-your-voice-model-to-another-project) it to a Speech resource in another region as needed. See footnotes in the [regions](regions.md#speech-service) table for more information.

## Train your Custom Neural Voice model

After you validate your data files, you can use them to build your Custom Neural Voice model.

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customvoice).
1. On the **Train model** tab, select **Train a new model** to create a voice model with the data you've uploaded.

1. Select the training method for your model.

    If you want to create a voice in the same language of your training data, select **Neural** method. For the **Neural** method, you can select different versions of the training recipe for your model. The versions vary according to the features supported and model training time. Normally new versions are enhanced ones with bugs fixed and new features supported. The latest version is selected by default.

    You can also select **Neural - cross lingual** and **Target language** to create a secondary language for your voice model. Only one target language can be selected for a voice model. You don't need to prepare additional data in the target language for training, but your test script needs to be in the target language. For the languages supported by cross lingual feature, see [supported languages](language-support.md?tabs=stt-tts).

    The same unit price applies to both **Neural** and **Neural - cross lingual**. Check [the pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for training.

1. Choose the data you want to use for training, and specify a speaker file.

   >[!NOTE]
   >- To create a custom neural voice, select at least 300 utterances.
   >- To train a neural voice, you must specify a voice talent profile. This profile must provide the audio consent file of the voice talent, acknowledging to use their speech data to train a custom neural voice model.

1. Choose your test script. Each training generates 100 sample audio files automatically, to help you test the model with a default script. You can also provide your own test script, including up to 100 utterances. The test script must exclude the filenames (the ID of each utterance). Otherwise, these IDs are spoken. Here's an example of how the utterances are organized in one .txt file:

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

   Duplicate audio names will be removed from the training. Make sure the data you select don't contain the same audio names across multiple .zip files.

   The **Train model** table displays a new entry that corresponds to this newly created model. 

   When the model is training, you can select **Cancel training** to cancel your voice model. You're not charged for this canceled training.

   :::image type="content" source="media/custom-voice/cnv-cancel-training.png" alt-text="Screenshot that shows how to cancel training for a model.":::

   The table displays the status: processing, succeeded, failed, and canceled. The status reflects the process of converting your data to a voice model, as shown in this table:

   | State | Meaning |
   | ----- | ------- |
   | Processing | Your voice model is being created. |
   | Succeeded	| Your voice model has been created and can be deployed. |
   | Failed | Your voice model has failed in training. The cause of the failure might be, for example, unseen data problems or network issues. |
   | Canceled | The training for your voice model was canceled. |

   Training duration varies depending on how much data you're training. It takes about 40 compute hours on average to train a custom neural voice. 

   > [!NOTE]
   > Standard subscription (S0) users can train four voices simultaneously. If you reach the limit, wait until at least one of your voice models finishes training, and then try again. 

1. After you finish training the model successfully, you can review the model details.

After your voice model is successfully built, you can use the generated sample audio files to test it before deploying it for use.

The quality of the voice depends on many factors, such as:

- The size of the training data.
- The quality of the recording.
- The accuracy of the transcript file.
- How well the recorded voice in the training data matches the personality of the designed voice for your intended use case.

### Rename your model

If you want to rename the model you built, you can select **Clone model** to create a clone of the model with a new name in the current project.

:::image type="content" source="media/custom-voice/cnv-clone-model.png" alt-text="Screenshot of selecting the Clone model button.":::

Enter the new name on the **Clone voice model** window, then click **Submit**. The text 'Neural' will be automatically added as a suffix to your new model name.

:::image type="content" source="media/custom-voice/cnv-clone-model-rename.png" alt-text="Screenshot of cloning a model with a new name.":::

### Test your voice model

After you've trained your voice model, you can test the model on the model details page. Select **DefaultTests** under **Testing** to listen to the sample audios. The default test samples include 100 sample audios generated automatically during training to help you test the model. In addition to these 100 audios provided by default, your own test script (at most 100 utterances) provided during training are also added to **DefaultTests** set. You're not charged for the testing with **DefaultTests**.

:::image type="content" source="media/custom-voice/cnv-model-default-test.png" alt-text="Screenshot of selecting DefaultTests under Testing.":::

If you want to upload your own test scripts to further test your model, select **Add test scripts** to upload your own test script.

:::image type="content" source="media/custom-voice/cnv-model-add-testscripts.png" alt-text="Screenshot of adding model test scripts.":::

Before uploading test script, check the [test script requirements](#train-your-custom-neural-voice-model). You'll be charged for the additional testing with the batch synthesis based on the number of billable characters. See [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

On **Add test scripts** window, click **Browse for a file** to select your own script, then select **Add** to upload it.

:::image type="content" source="media/custom-voice/cnv-model-upload-testscripts.png" alt-text="Screenshot of uploading model test scripts.":::

### Update engine version for your voice model

Azure Text-to-Speech engines are updated from time to time to capture the latest language model that defines the pronunciation of the language. After you've trained your voice, you can apply your voice to the new language model by updating to the latest engine version.

When a new engine is available, you're prompted to update your neural voice model.

:::image type="content" source="media/custom-voice/cnv-engine-update-prompt.png" alt-text="Screenshot of displaying engine update message." lightbox="media/custom-voice/cnv-engine-update-prompt.png":::

Go to the model details page, click **Update** at the top to display **Update** window.

:::image type="content" source="media/custom-voice/cnv-engine-update.png" alt-text="Screenshot of selecting Update menu at the top of page." lightbox="media/custom-voice/cnv-engine-update.png":::

Then click **Update** to update your model to the latest engine version.

:::image type="content" source="media/custom-voice/cnv-engine-update-done.png" alt-text="Screenshot of selecting Update button to update engine.":::

You're not charged for engine update. The previous versions are still kept. You can check all engine versions for this model from **Engine version** drop-down list, or remove one if you don't need it anymore. 

:::image type="content" source="media/custom-voice/cnv-engine-version.png" alt-text="Screenshot of displaying Engine version drop-down list.":::

The updated version is automatically set as default. But you can change the default version by selecting a version from the drop-down list and clicking **Set as default**.

:::image type="content" source="media/custom-voice/cnv-engine-set-default.png" alt-text="Screenshot that shows how to set a version as default.":::

If you want to test each engine version of your voice model, you can select a version from the drop-down list, then select **DefaultTests** under **Testing** to listen to the sample audios. If you want to upload your own test scripts to further test your current engine version, first make sure the version is set as default, then follow the [testing steps above](#test-your-voice-model).

After you've updated the engine version for your voice model, you need to [redeploy this new version](how-to-deploy-and-use-endpoint.md#switch-to-a-new-voice-model-in-your-product). You can only deploy the default version. 

For more information, [learn more about the capabilities and limits of this feature, and the best practice to improve your model quality](/legal/cognitive-services/speech-service/custom-neural-voice/characteristics-and-limitations-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext).

## Copy your voice model to another project

You can copy your voice model to another project for the same region or another region. For example, you can copy a neural voice model that was trained in one region, to a project for another region.

> [!NOTE]
> Custom Neural Voice training is currently only available in some regions. But you can easily copy a neural voice model from those regions to other regions. For more information, see the [regions for Custom Neural Voice](regions.md#speech-service).

To copy your custom neural voice model to another project:

1. On the **Train model** tab, select a voice model that you want to copy, and then select **Copy to project**.

   :::image type="content" source="media/custom-voice/cnv-model-copy.png" alt-text="Copy to project":::

1. Select the **Region**, **Speech resource**, and **Project** where you want to copy the model. You must have a speech resource and project in the target region, otherwise you need to create them first. 

    :::image type="content" source="media/custom-voice/cnv-model-copy-dialog.png" alt-text="Copy voice model":::

1. Select **Submit** to copy the model.
1. Select **View model** under the notification message for copy success. 

Navigate to the project where you copied the model to [deploy the model copy](how-to-deploy-and-use-endpoint.md).

## Next steps

- [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md)
- [How to record voice samples](record-custom-voice-samples.md)
- [Text-to-Speech API reference](rest-text-to-speech.md)
- [Long Audio API](long-audio-api.md)
