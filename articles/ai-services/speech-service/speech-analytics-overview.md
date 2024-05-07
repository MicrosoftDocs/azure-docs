---
title: Speech analytics overview
titleSuffix: Azure AI services
description: Transcribe audio and video recordings and generate enhanced outputs like summaries or extract valuable information such as key topics, sentiment, and more.
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: jagoerge
ms.author: eur
author: eric-urban
# Customer intent: As a developer, I want to transcribe audio and video recordings and generate enhanced outputs like summaries or extract valuable information such as key topics, sentiment, and more.
---

# Speech analytics overview

[!INCLUDE [Feature preview include](../../ai-studio/includes/generic-preview.md)]

With Speech analytics in [AI Studio](https://ai.azure.com), you transcribe audio and video recordings and generate enhanced outputs like summaries, special industry record formats, captioning data, or extract valuable information such as key topics, sentiment, and more. The service also allows you to redact recordings to remove personal information or to remove disfluencies. To get started, use one of the provided out-of-box scenario templates and start retrieving results. Leverage the flexibility to customize to your business as needed, if necessary.

Here are some of the common use cases for speech analytics:
- Transcribe call recordings for storage.
- Format and customize formatting of conversation transcripts.
- Analyze calls to find most desired topics.
- Get customer insights through summarization and sentiment.
- Post-call analytics.

## Speech analytics in AI Studio

AI studio is a way to test speech analytics by allowing you to customize and deploy a prompt flow that analyzes your audio recordings and generates insights such as summaries, action items, notes, decisions, and agenda. A typical use case is to automatically process uploaded files in a storage account and write the analytics results to another storage account. 

- Get insights from your audio recordings of meetings, calls, or conversations, such as summaries, action items, notes, decisions, and agenda.
- Customize the analytics results according to your specific needs and scenarios, by using prompt flow to modify the logic and the output of the speech analytics flow.
- Test and deploy customized flows easily and quickly, without having to write any code or use any external tools.
- Access and manage your speech analytics projects and resources in one place, along with other AI Studio projects and services that you use in AI Studio.

You can use the AI Studio UI or the Azure AI SDKs and APIs to manage speech analytics projects and resources.
- You might prefer to use AI studio for speech analytics because it offers a user-friendly interface and a customizable prompt flow logic that can generate insights from the transcripts. You don't need to have coding skills or use SDKs and APIs to integrate speech analytics with other services. You can upload your audio files to a storage account and monitor the analytics results in the AI studio. You can also test and deploy different versions of the prompt flow logic using the prompt flow in AI studio.
- Developers might use SDKs and APIs for speech analytics if you want more control over the speech processing and integration with other services. 

However, both options require the same speech analytics project registration and real-time endpoint deployment.

## Architecture

The following diagram provides a high-level overview of the Speech analytics architecture. 

:::image type="content" source="media/ai-studio/speech-analytics/high-level-architecture.png" alt-text="Screenshot of overall speech analytics architecture.":::

The speech analytics architecture consists of the following components:
1. You upload audio, video, or transcription files to the storage account.
1. Depending on the processing mode ([pull or push](#pull-and-push-modes)), the Speech analytics ingestion service either periodically scans the storage account for new files or listens for events from Azure Event Grid.
1. Speech analytics ingestion service uses the Azure AI Speech batch transcription API to transcribe the audio files to text.
1. The Speech analytics ingestion service starts prompt flow processing on the transcript.
1. Process the transcripts with the prompt flow logic that is deployed to the real-time endpoint in the generative AI project.
1. Prompt flow writes the analytics results to the storage account. The results can be viewed in the upload and monitor page of the speech analytics project in AI Studio.

## Projects

A speech analytics project is a specialized project in AI Studio that only has resources and tools needed for speech analytics. You see it listed among your other projects in AI Studio. When you create a speech analytics project, you also create a generative AI project. The generative AI project is where you customize the prompt flow deployment for speech analytics. Prompt flow defines the logic and rules for processing the transcripts and generating analytics results. 

> [!NOTE]
> A generative AI project is the standard project type for working in AI Studio. Normally when you create a project in AI Studio, you are creating a generative AI project. The term "generative AI project" is used in some contexts to distinguish it from the speech analytics project type. 

Use the speech analytics project configuration to specify how the audio files are transcribed to text. 

## Speech analytics project connections

When you create a speech analytics project, you specify the generative AI project that you want to use for the prompt flow deployment. The wizard creates the connection between the speech analytics project and the generative AI project.

This connection allows the speech analytics ingestion service to call the prompt flow deployment that is associated with the generative AI project and pass the transcription file name as an input. The ingestion service picks up the audio files from the storage account, sends them to the batch transcription API, writes the transcripts to the storage, and then calls the real-time endpoint to process the transcripts with the prompt flow. The prompt flow deployment is the real-time endpoint that runs the prompt flow logic on the transcript and generates the analytics result. The prompt flow deployment is created when the prompt flow is deployed to an existing real-time endpoint in the generative AI project.

## Role of the prompt flow

Prompt flow is a tool that allows you to customize the speech analytics results by defining your own logic and rules for processing the transcript. You can use prompt flow to extract insights, generate summaries, detect roles, and more. Prompt flow gives you more control and flexibility over the speech analytics output. 

Let's say that your goal is to create a prompt flow that generates the desired analytics results from the transcripts of your audio files. You can customize the prompt flow logic by adding nodes, prompts, and conditions to define the processing steps and rules. 
- You can test the prompt flow manually by uploading a transcript file to the transcriptions folder of the storage account and running the flow. 
- You can also deploy the prompt flow to the real-time endpoint in the generative AI project. The ingestion service picks up the audio files from the storage account, sends them to the Azure AI Speech batch transcription API, writes the transcripts to the storage, and then calls the prompt flow real-time endpoint to process the transcripts.

You don't consume the endpoint in your applications directly. The endpoint is consumed by the speech analytics ingestion service.

## New deployment vs overwrite

Updating the prompt flow deployment name doesn't affect the speech analytics project registration settings. The registration settings are based on the real-time endpoint name and the generative AI project name, which don't change when you update the deployment name. The deployment name is only used to identify different versions of the prompt flow logic that are deployed to the same endpoint. You can switch between different deployments using the update traffic feature in the prompt flow studio.

Consider whether you want to overwrite an existing prompt flow deployment versus create a new deployment.

- You might want to overwrite an existing prompt flow deployment to update the analytics logic or output for the same speech analytics project. For example, if you change the prompts or add new nodes to the flow, you need to redeploy the flow to the existing endpoint and deployment name. This way, you can keep the same configuration and connection settings for the speech analytics project.
- You might want to create a new deployment to have different versions of the prompt flow for the same speech analytics project. For example, if you want to test different scenarios or compare different results, you need to create a new deployment name for each version of the flow and deploy it to the existing endpoint. This way, you can use the update traffic feature to switch between different deployments and see the analytics results for each one.

## Pull and push modes

Speech analytics ingestion service supports the pull or push processing modes:

- In Pull mode, the service periodically scans the user storage input container, typically at 10-minute intervals, to identify and process newly added files. This mode doesn't require Azure Event Grid resources.

- Push mode uses Azure Event Grid for event delivery. When a new file is added to the storage container, an event is generated and sent to the service to trigger processing. This method offers faster and more reliable event delivery, however Azure Event Grid resources are required.

You choose the processing mode when you [create the speech analytics project](./speech-analytics-post-call.md#create-a-speech-analytics-project-in-the-hub). 

## Related content

- [Use speech analytics with post-call transcriptions](./speech-analytics-post-call.md)
- [Connect to AI services in AI Studio](../../ai-studio/ai-services/connect-ai-services.md)