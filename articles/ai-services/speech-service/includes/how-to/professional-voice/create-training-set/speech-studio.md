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

When you're ready to create a custom Text to speech voice for your application, the first step is to gather audio recordings and associated scripts to start training the voice model. For details on recording voice samples, see [the tutorial](../../../../record-custom-voice-samples.md). The Speech service uses this data to create a unique voice tuned to match the voice in the recordings. After you've trained the voice, you can start synthesizing speech in your applications.

All data you upload must meet the requirements for the data type that you choose. It's important to correctly format your data before it's uploaded, which ensures the data will be accurately processed by the Speech service. To confirm that your data is correctly formatted, see [Training data types](../../../../how-to-custom-voice-training-data.md).

> [!NOTE]
> - Standard subscription (S0) users can upload five data files simultaneously. If you reach the limit, wait until at least one of your data files finishes importing. Then try again.
> - The maximum number of data files allowed to be imported per subscription is 500 .zip files for standard subscription (S0) users. Please see out [Speech service quotas and limits](../../../../speech-services-quotas-and-limits.md#custom-neural-voice) for more details.

## Upload your data

When you're ready to upload your data, go to the **Prepare training data** tab to add your first training set and upload data. A *training set* is a set of audio utterances and their mapping scripts used for training a voice model. You can use a training set to organize your training data. The service checks data readiness per each training set. You can import multiple data to a training set.

To upload training data, follow these steps:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customvoice).
1. Select **Custom voice** > Your project name > **Prepare training data** > **Upload data**. 
1. In the **Upload data** wizard, choose a [data type](../../../../how-to-custom-voice-training-data.md) and then select **Next**.
1. Select local files from your computer or enter the Azure Blob storage URL to upload data.
1. Under **Specify the target training set**, select an existing training set or create a new one. If you created a new training set, make sure it's selected in the drop-down list before you continue.
1. Select **Next**.
1. Enter a name and description for your data and then select **Next**.
1. Review the upload details, and select **Submit**.

> [!NOTE]
> Duplicate IDs are not accepted. Utterances with the same ID will be removed.
> 
> Duplicate audio names are removed from the training. Make sure the data you select don't contain the same audio names within the .zip file or across multiple .zip files. If utterance IDs (either in audio or script files) are duplicates, they're rejected.

Data files are automatically validated when you select **Submit**. Data validation includes series of checks on the audio files to verify their file format, size, and sampling rate. If there are any errors, fix them and submit again. 

After you upload the data, you can check the details in the training set detail view. On the detail page, you can further check the pronunciation issue and the noise level for each of your data. The pronunciation score at the sentence level ranges from 0-100. A score below 70 normally indicates a speech error or script mismatch. Utterances with an overall score lower than 70 will be rejected. A heavy accent can reduce your pronunciation score and affect the generated digital voice.

## Resolve data issues online

[!INCLUDE [Resolve data issues](./speech-studio-resolve-data-issues.md)]
