---
title: include file
description: include file
author: eric-urban
ms.author: eur
ms.service: azure-ai-speech
ms.topic: include
ms.date: 12/1/2023
ms.custom: include
---

Speech analytics in [Azure AI Studio](https://ai.azure.com) is a feature that allows you to extract insights from audio files using a customizable prompt flow. You can use speech analytics to generate summaries, detect roles, extract information, and more from the transcripts of your audio files.

In this article, you learn how to create a speech analytics project that uses prompt flow for speech analytics. You create the following resources:
- An AI Studio hub.
- An Azure OpenAI chat model deployment in the hub. 
- A speech analytics project in the hub. 
- A generative AI project and prompt flow deployment. During the speech analytics project creation, the wizard guides you through the process of creating a generative AI project for prompt flow.

In the companion [customize speech analytics in prompt flow](../../../speech-analytics-post-call-customize.md) article, you learn how to customize and redeploy the prompt flow for speech analytics.

> [!TIP]
> Speech analytics supports post-call analytics, conversation summarization, and automatic batch transcription scenarios. This article focuses on post-call analytics. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- An audio file of call recordings that you want to analyze. A sample *.wav* file is provided in the [Azure AI Speech SDK repository on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav). 

## Create an AI Studio hub

You deploy and manage your AI Studio projects in hubs.  

To create a new hub, follow these steps:
1. Go to the **Home** page in [Azure AI studio](https://ai.azure.com) and sign in with your Azure account.
1. Select **All hubs** from the left pane and then select **+ New hub**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/hub-new.png" alt-text="Screenshot of the button to create a new hub." lightbox="../../../media/ai-studio/speech-analytics/hub-new.png":::

1. In the **Create a new hub** dialog, enter a name for your hub (such as *contoso-hub*) and select **Next**. Leave the default **Connect Azure AI Services** option selected. A new AI services connection is created for the hub.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/hub-new-connect-services.png" alt-text="Screenshot of the dialog to connect services while creating a new hub." lightbox="../../../media/ai-studio/speech-analytics/hub-new-connect-services.png":::

1. Review the information and select **Create**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/hub-new-review-create.png" alt-text="Screenshot of the dialog to review the settings for the new hub." lightbox="../../../media/ai-studio/speech-analytics/hub-new-review-create.png":::

1. You can view the progress of the hub creation in the wizard. 

    :::image type="content" source="../../../media/ai-studio/speech-analytics/hub-new-create-resources.png" alt-text="Screenshot of the dialog to review the progress of hub resources creation." lightbox="../../../media/ai-studio/speech-analytics/hub-new-create-resources.png":::

## Deploy a GPT chat model in the hub

You need an Azure OpenAI chat model deployment in the hub to use the prompt flow for speech analytics. In this example we use GPT-4. The model deployment is used to create a real-time endpoint that can run the prompt flow logic on the transcript files and generate the analytics results. The prompt flow needs the model deployment for speech analytics, because it's the way the ingestion service communicates with the prompt flow and triggers the analytics processing.

To deploy a GPT-4 model in the hub, follow these steps:

1. Go to the hub that you created in the previous section. The create hub wizard will automatically open the hub after it's created. Otherwise, you can select the hub via the **Home** > **All hubs** page.
1. From the left pane, select **Deployments** and then select **+ Create deployment**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/gpt-deploy-create.png" alt-text="Screenshot of the button to create a new deployment." lightbox="../../../media/ai-studio/speech-analytics/gpt-deploy-create.png":::

1. In the **Select a model** dialog, select **gpt-4** from the list of available models and select **Confirm**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/gpt-deploy-select-model.png" alt-text="Screenshot of the button to select a model to deploy." lightbox="../../../media/ai-studio/speech-analytics/gpt-deploy-select-model.png":::

1. The deployed model is now available in the hub and can be used with any projects in the same hub.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/gpt-deployed.png" alt-text="Screenshot of the deployed model in the list of deployments." lightbox="../../../media/ai-studio/speech-analytics/gpt-deployed.png":::

## Create a speech analytics project in the hub

> [!IMPORTANT]
> You must [deploy the GPT-4 model](#deploy-a-gpt-chat-model-in-the-hub) in the hub before you create the speech analytics project.

A speech analytics project is a specialized project in AI Studio that primarily has resources and tools for speech analytics. You see it listed among your other projects in AI Studio. When you create a speech analytics project, you also create a generative AI project. The generative AI project is where you customize the prompt flow deployment.

To create a speech analytics project in the hub, follow these steps:

1. Go to the **Home** page and select **AI Services** from the left pane. Then select **Speech analytics** from the list of features.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/navigate-ai-services-speech-analytics.png" alt-text="Screenshot of the button to navigate to speech analytics in AI Services." lightbox="../../../media/ai-studio/speech-analytics/navigate-ai-services-speech-analytics.png":::

1. On the **Speech analytics** page, select **Create speech analytics project**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-project-new.png" alt-text="Screenshot of the button to create a new speech analytics project." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-project-new.png":::

1. In the **Create a new speech analytics project** dialog, enter a name for your project and select the hub where you want to create the project. Select the hub that you [created previously](#create-an-ai-studio-hub) and then select **Next**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-project-details.png" alt-text="Screenshot of the dialog to select a hub and enter the speech analytics project name." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-project-details.png":::

1. Select **Post-call analytics** from the scenario dialog and then select **Next**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-select-scenario.png" alt-text="Screenshot of the dialog to select the scenario for the speech analytics project." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-select-scenario.png":::

1. In the **Data settings** dialog, leave the default settings selected for the data location and processing method. Optionally, you can select **Show advanced settings** to view the names of the storage containers that you use later in prompt flow. Select **Next**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-data-settings.png" alt-text="Screenshot of the dialog to select the data location and processing method for speech analytics." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-data-settings.png":::

1. In the **Speech settings** dialog:
    1. Leave the default setting selected for the Azure AI services connection. This setting is used to connect to the GPT-4 model deployment that you created earlier. 
    1. Select the spoken language in the audio file corresponding to the transcription that you want to analyze. Select **English (United States)** if you're using the [sample audio file on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav).

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-settings-connection.png" alt-text="Screenshot of the dialog to select the AI services connection and audio language." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-settings-connection.png":::

    > [!IMPORTANT]
    > Make sure that "20231129 Batch Transcription" is selected in the **Speech to text model** dropdown. 
    
1. In the same **Speech settings** dialog, select **Show advanced settings** to view the Azure AI Speech features that you can enable for the speech analytics project. You can enable features such as language identification, profanity filter mode, and more. Speech analytics supports a subset of the [batch transcription API request options](../../../batch-transcription-create.md#request-configuration-options). Then select **Next**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-settings-advanced.png" alt-text="Screenshot of the dialog to select advanced Speech settings such as language identification." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-settings-advanced.png":::

1. In the **Analytics settings** dialog, select the Azure OpenAI model deployment that you created earlier. Leave the default settings selected for the generative AI project, prompt flow, and custom connection. Select **Next**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-settings-options.png" alt-text="Screenshot of the dialog to select the GPT model deployment and generative AI project." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-settings-options.png":::

1. In the **Review** dialog, review the settings for the speech analytics project and then select **Create project**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-project-review-create.png" alt-text="Screenshot of the dialog to review the settings for the speech analytics project." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-project-review-create.png":::

1. You can view the progress of the speech analytics project creation in the wizard. The prompt flow deployment might take several minutes to complete.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/speech-analytics-project-new-create-resources.png" alt-text="Screenshot of the dialog to review the progress of speech analytics project resources creation." lightbox="../../../media/ai-studio/speech-analytics/speech-analytics-project-new-create-resources.png":::

## Analyze the transcript of an audio file

The transcription is what you analyze with the prompt flow in AI Studio. You can upload an audio file in AI Studio and get a transcript of the audio file. Then speech analytics processes the transcript and generates analytics results based on the prompt flow that the wizard created and deployed for you.

1. Go to the hub that you created previously. You can find and select the hub via the **Home** > **All hubs** page.
1. On the **Hub overview** page, select the speech analytics project (not the generative AI project) that you created previously. 
1. Go to the **Upload and monitor** page and select **Upload data**.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/transcript-from-audio-upload.png" alt-text="Screenshot of the button to upload an audio file to generate a transcript." lightbox="../../../media/ai-studio/speech-analytics/transcript-from-audio-upload.png":::

1. In the **Upload file** dialog, select the audio file that you want to analyze. A sample *.wav* file is provided in the [Azure AI Speech SDK repository on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav).

    :::image type="content" source="../../../media/ai-studio/speech-analytics/transcript-audio-sample-select.png" alt-text="Screenshot of the dialog to select an audio file to generate a transcript." lightbox="../../../media/ai-studio/speech-analytics/transcript-audio-sample-select.png":::

1. Select **Upload** to upload the audio file. 

## Monitor the analytics results in AI Studio

You can monitor the analytics results in the Speech analytics project in AI Studio. 

1. Go to the **Upload and monitor** page to see the status of processing the audio file that you uploaded.

    :::image type="content" source="../../../media/ai-studio/speech-analytics/upload-monitor-process-from-container.png" alt-text="Screenshot of the progress for speech analytics of the audio file uploaded." lightbox="../../../media/ai-studio/speech-analytics/upload-monitor-process-from-container.png":::

1. When the transcript is ready, select the name of the audio file to access the transcript. 
1. Under the **Transcription results** label, select **Result** to download the transcription file to your local machine. 

    > [!NOTE]
    > You can also access the transcription in your **ProjectName-transcription** container in the Azure portal. The wizard created this storage container during the speech analytics project creation.


That's it! You successfully created a speech analytics project in AI Studio and used prompt flow to generate analytics results from the transcripts of your audio files. In the companion [customize speech analytics in prompt flow](../../../speech-analytics-post-call-customize.md) article, you learn how to customize and redeploy the prompt flow for speech analytics.
