---
title: include file
description: include file
author: eric-urban
ms.author: eur
ms.service: azure-ai-speech
ms.topic: include
ms.date: 5/21/2024
ms.custom: include
---

Speech analytics in [Azure AI Studio](https://ai.azure.com) is a feature that allows you to extract insights from audio files using a customizable prompt flow. You can use speech analytics to generate summaries, detect roles, extract information, and more from the transcripts of your audio files.

In this article, you learn how to customize and redeploy the prompt flow for speech analytics. In the companion [post-call analytics](../../../speech-analytics-post-call.md) article, you learn about how to use the default prompt flow that's provided when you create a speech analytics project in AI Studio. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A speech analytics project in AI Studio. You can create a speech analytics project by following the steps in the companion [post-call analytics](../../../speech-analytics-post-call.md#create-a-speech-analytics-project-in-the-hub) article.
- You must have the necessary permissions to add role assignments for storage accounts in your Azure subscription. Granting permissions (adding role assignment) is only allowed by the **Owner** of the specific Azure resources. You might need to ask your IT admin for help.
- An audio file or transcript of call recordings that you want to analyze. A sample *.wav* file is provided in the [Azure AI Speech SDK repository on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav). 

## Add a role assignment in the Azure portal

You need to add a role assignment in the Azure portal to access the storage account that contains the audio files and transcriptions that you want to analyze. 

To add a role assignment, follow these steps:

1. Go to the hub that you created in the previous section. You can find and select the hub via the **Home** > **All hubs** page.
1. On the **Hub overview** page, select the storage account name to go to the storage account in the Azure portal.
    
    :::image type="content" source="../../../media/ai-studio/speech-analytics/hub-overview-storage-account.png" alt-text="Screenshot of the hub overview page in AI Studio where the storage account name can be selected." lightbox="../../../media/ai-studio/speech-analytics/hub-overview-storage-account.png":::

1. From the left page, select **Access control (IAM)** > **Role assignments** and then select **+ Add**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/storage-iam-add-role.png" alt-text="Screenshot of the dialog to select access control from the left pane in Azure portal." lightbox="../../../media/ai-studio/speech-analytics/storage-iam-add-role.png":::

1. Search for the **Storage Blob Data Contributor** role and then select it. Then select **Next**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/storage-blob-data-contributor.png" alt-text="Screenshot of the dialog to select the storage blob data contributor role." lightbox="../../../media/ai-studio/speech-analytics/storage-blob-data-contributor.png":::

1. Select **User, group, or service principal**. Then select **Select members**.

1. In the **Select members** pane that opens, search for the name of the user that you want to add the role assignment for. Select the user and then select **Select**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/storage-user-identity-select.png" alt-text="Screenshot of the dialog to select the user that you want to add the role assignment for." lightbox="../../../media/ai-studio/speech-analytics/storage-user-identity-select.png":::

1. Continue through the wizard and select **Review + assign** to add the role assignment. 

## Get a sample transcript from an audio file

The transcription is what you analyze with the prompt flow in AI Studio. If you already have a transcript of the audio file that you want to analyze, you can skip ahead to the [Upload the transcript that you want to analyze](#upload-the-transcript-that-you-want-to-analyze) section.

You can upload an audio file in AI Studio and get a transcript of the audio file. Then you can use the transcript to test the speech analytics via prompt flow.

1. Go to the hub that contains your speech analytics project. You can find and select the hub via the **Home** > **All hubs** page.
1. On the **Hub overview** page, select the speech analytics project (not the generative AI project) that you [created previously](../../../speech-analytics-post-call.md#create-a-speech-analytics-project-in-the-hub). 
1. Go to the **Upload and monitor** page and select **Upload data**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/transcript-from-audio-upload.png" alt-text="Screenshot of the button to upload an audio file to generate a transcript." lightbox="../../../media/ai-studio/speech-analytics/transcript-from-audio-upload.png":::

1. In the **Upload file** dialog, select the audio file that you want to analyze. A sample *.wav* file is provided in the [Azure AI Speech SDK repository on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav).

    :::image type="content" source="../../../media/ai-studio/speech-analytics/transcript-audio-sample-select.png" alt-text="Screenshot of the dialog to select an audio file to generate a transcript." lightbox="../../../media/ai-studio/speech-analytics/transcript-audio-sample-select.png":::

1. Select **Upload** to upload the audio file. 
1. When the transcript is ready, select the name of the audio file to access the transcript. 

    :::image type="content" source="../../../media/ai-studio/speech-analytics/transcript-from-audio-download.png" alt-text="Screenshot of the dialog to download the transcription from the audio file." lightbox="../../../media/ai-studio/speech-analytics/transcript-from-audio-download.png":::

1. Under the **Transcription results** label, select **Result** to download the transcription file to your local machine. 

    :::image type="content" source="../../../media/ai-studio/speech-analytics/transcript-from-audio-download-result.png" alt-text="Screenshot of the dialog to download the transcription result file." lightbox="../../../media/ai-studio/speech-analytics/transcript-from-audio-download-result.png":::

    > [!NOTE]
    > You can also access the transcription in your **ProjectName-transcription** container in the Azure portal. The wizard created this storage container during the speech analytics project creation.

1. Rename the downloaded file as **sample_call_transcription.json**. The speech analytics [prompt flow depends on this filename by default](#try-speech-analytics-with-prompt-flow-in-ai-studio). If you choose a different filename, you need to update the prompt flow to use the new filename.

## Upload the transcript that you want to analyze

Now you can upload the transcript that you want to analyze. The wizard created a storage container named **ProjectName-transcription** during the [speech analytics project creation](../../../speech-analytics-post-call.md#create-a-speech-analytics-project-in-the-hub). Upload the transcript file to the **ProjectName-transcription** container. In this example, the wizard created a storage container named **contoso-proj-transcription**.

1. Select **Containers** from the left pane in the speech analytics project. Then select the name of the storage account to go to the storage account in the Azure portal.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/storage-from-project-configuration.png" alt-text="Screenshot of the button to navigate from the project configuration page to the storage account in the Azure portal." lightbox="../../../media/ai-studio/speech-analytics/storage-from-project-configuration.png":::

    > [TIP]
    > You can also navigate to the storage account in the Azure portal following the previous steps [when you added a role assignment](#add-a-role-assignment-in-the-azure-portal). 

1. From the left pane in Azure portal for the storage account, select **Storage browser** > **Blob containers**. Search for the name of your **ProjectName-transcription** container from the left pane and then select the **ProjectName-transcription** container.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/storage-transcription-container-select.png" alt-text="Screenshot of the storage blob containers in Azure portal." lightbox="../../../media/ai-studio/speech-analytics/storage-transcription-container-select.png":::

1. Select **Upload** to upload the transcript file that you want to analyze. 
1. Select the transcript file that you downloaded previously (renamed **sample_call_transcription.json**) and then select **Upload**.

## Try speech analytics with prompt flow in AI Studio

You can use prompt flow to customize the speech analytics results by defining your own logic and rules for processing the transcript. Before you [deploy the flow to a real-time endpoint](#deploy-the-prompt-flow-to-a-real-time-endpoint), try the prompt flow editor in AI Studio to make sure that the analytics results meet your requirements. 

1. Select the generative AI project that the wizard created for you during the speech analytics project creation. The generative AI project is where you customize the prompt flow for speech analytics.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/hub-projects-genai.png" alt-text="Screenshot of the generative AI project in the list of projects in the hub overview page." lightbox="../../../media/ai-studio/speech-analytics/hub-projects-genai.png":::

1. Select **Prompt flow** from the left pane. Then select the name of the prompt flow deployment that the wizard created for you during the speech analytics project creation.
    
    :::image type="content" source="../../../media/ai-studio/speech-analytics/genai-proj-flow-name-select.png" alt-text="Screenshot of the speech analytics prompt flow that can be selected." lightbox="../../../media/ai-studio/speech-analytics/genai-proj-flow-name-select.png":::

1. Select **Start compute session** to start the compute session for the prompt flow deployment. The compute session is used to process the transcripts and generate the analytics results.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/post-call-prompt-flow-start-compute.png" alt-text="Screenshot of the button to start a compute session for the prompt flow deployment." lightbox="../../../media/ai-studio/speech-analytics/post-call-prompt-flow-start-compute.png":::

    Notice the names for the **Inputs** that are used in the prompt flow (such as **transcriptionFileName**). They correspond to the storage containers that the wizard created during the speech analytics project creation. For example, the **transcriptionFileName** input is mapped to the **ProjectName-transcription** container where you uploaded the transcription file.

    > [!IMPORTANT]
    > Before proceeding make sure that you've already [uploaded the transcript file](#upload-the-transcript-that-you-want-to-analyze) to the storage container named **ProjectName-transcription**.

1. When the compute session is running, select **Run** to run the prompt flow on the transcript file that you uploaded. 

1. After the prompt flow runs successfully, you can view the analytics results in the **Outputs** section. The analytics results are generated based on the logic and rules that you defined in the prompt flow.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/post-call-prompt-flow-outputs.png" alt-text="Screenshot of the output file URL and the outputs node in the prompt flow graph." lightbox="../../../media/ai-studio/speech-analytics/post-call-prompt-flow-outputs.png":::

1. Go to the Azure portal and navigate to the **ProjectName-analytics** container to view the analytics results. The wizard created this storage container during the speech analytics project creation.

## Deploy the prompt flow to a real-time endpoint

After you've tested the prompt flow and are satisfied with the analytics results, you can deploy the prompt flow to a real-time endpoint. The real-time endpoint is used to process the transcripts and generate the analytics results in real-time.

1. Go to the prompt flow editor in AI Studio and select **Deploy**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/post-call-prompt-flow-deploy.png" alt-text="Screenshot of the button to deploy the prompt flow to a real-time endpoint." lightbox="../../../media/ai-studio/speech-analytics/post-call-prompt-flow-deploy.png":::

1. In the **Basic settings** page of the prompt flow deployment dialog, select **Existing** for the endpoint and select the prompt flow deployment that was [created with the new project](../../../speech-analytics-post-call.md#create-a-speech-analytics-project-in-the-hub). Then select **Review + Create**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/post-call-prompt-flow-deploy-basic.png" alt-text="Screenshot of the basic settings in the prompt flow deployment dialog." lightbox="../../../media/ai-studio/speech-analytics/post-call-prompt-flow-deploy-basic.png":::

1. Review the deployment settings and then select **Create** to deploy the prompt flow to a real-time endpoint.


1. Select **Containers** from the left pane in the speech analytics project. Then select the name of the storage account to go to the storage account in the Azure portal.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/storage-from-project-configuration.png" alt-text="Screenshot of the button to navigate from the project configuration page to the storage account in the Azure portal." lightbox="../../../media/ai-studio/speech-analytics/storage-from-project-configuration.png":::

1. From the left pane in Azure portal for the storage account, select **Storage browser** > **Blob containers**. Search for the name of your **ProjectName-transcription** container from the left pane and then select the **ProjectName-transcription** container.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/storage-transcription-container-select.png" alt-text="Screenshot of the storage blob containers in Azure portal." lightbox="../../../media/ai-studio/speech-analytics/storage-transcription-container-select.png":::

1. Select **Upload** to upload the audio file that you want to analyze. 
1. Select the transcript file that you downloaded previously (renamed **sample_call_transcription.json**) and then select **Upload**.

## Monitor the analytics results in AI Studio

Now when you add files to the transcription container in Azure portal (or via Azure CLI or other code-first approach), the real-time endpoint processes the transcripts and generates the analytics results. You can monitor the analytics results in the Speech analytics project in AI Studio. 

1. Go to the Azure portal and navigate to the **ProjectName-input** container.
1. Upload the audio file that you want to analyze.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/storage-input-container-upload.png" alt-text="Screenshot of the option to upload an audio file to the project input container in the Azure portal." lightbox="../../../media/ai-studio/speech-analytics/storage-input-container-upload.png":::

1. Go to the hub that you created previously in AI Studio. You can find and select the hub via the **Home** > **All hubs** page.
1. On the **Hub overview** page, select the speech analytics project (not the generative AI project) that you created previously. 
1. Go to the **Upload and monitor** page to see the status of processing the audio file that you uploaded from the Azure portal.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/upload-monitor-process-from-container.png" alt-text="Screenshot of the progress for speech analytics of the file uploaded in the Azure portal." lightbox="../../../media/ai-studio/speech-analytics/upload-monitor-process-from-container.png":::

1. When the transcript is ready, select the name of the audio file to access the transcript. 
1. Under the **Transcription results** label, select **Result** to download the transcription file to your local machine. 

    > [!NOTE]
    > You can also access the transcription in your **ProjectName-transcription** container in the Azure portal. The wizard created this storage container during the speech analytics project creation.

Notice how uploading the audio file to the input container automatically triggers the complete speech analytics flow. It's the automated approach to the previous steps that you took in this guide:
1. You [uploaded the audio file](#get-a-sample-transcript-from-an-audio-file) in AI Studio to get the transcript. 
1. Then you [uploaded the transcript file](#upload-the-transcript-that-you-want-to-analyze) to the **ProjectName-transcription** container. 
1. Then you started a compute session and [ran prompt flow](#try-speech-analytics-with-prompt-flow-in-ai-studio) on the transcription file.

That's it! You successfully created a speech analytics project in AI Studio and used prompt flow to generate analytics results from the transcripts of your audio files.
