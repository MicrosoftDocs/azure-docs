---
title: How to use video translation in the studio
titleSuffix: Azure AI services
description: With Azure AI Speech video translation, you can seamlessly translate and generate videos in multiple languages automatically. 
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: sally-baolian
ms.author: eur
author: eric-urban
ms.custom: references_regions
---

# Video translation in the studio

[!INCLUDE [Feature preview](../includes/preview-feature.md)]

In this article, you learn how to use Azure AI Speech video translation in the studio.

All it takes to get started is an original video. See if video translation supports your [language](language-support.md?tabs=speech-translation#video-translation) and [region](video-translation-overview.md#supported-regions-and-languages).

## Create a video translation project

To create a video translation project, follow these steps:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio).
   
1. Select the subscription and Speech resource to work with. 

1. Select **Video translation**.

1. On the **Create and Manage Projects** page, select **Create a project**.

1. On the **New project** page, select **Voice type**.

   :::image type="content" source="media/video-translation/select-voice-type.png" alt-text="Screenshot of selecting voice type on the new project page.":::
   
   You can select **Prebuilt neural voice** or **Personal voice** for **Voice type**. For prebuilt neural voice, the system automatically 
   selects the most suitable prebuilt voice by matching the speaker's voice in the video with prebuilt voices. For personal voice, the 
   system provides the model with superior voice cloning similarity. To use personal voice, you need to apply for [access](https://aka.ms/customneural). 
    
1. Upload your video file by dragging and dropping the video file or selecting the file manually.

   :::image type="content" source="media/video-translation/upload-video-file.png" alt-text="Screenshot of uploading your video file on the new project page.":::

   Ensure the video is in .mp4 format, less than 500 MB, and shorter than 60 minutes.
   
1. Provide **Project name**, and select **Number of speakers**,  **Language of the video**, **Translate to** language.

    :::image type="content" source="media/video-translation/provide-video-information.png" alt-text="Screenshot of providing video information on the new project page.":::
   
   If you want to use your own subtitle files, select **Add subtitle file**. You can choose to upload either the source subtitle file or the target subtitle file. The subtitle file can be in WebVTT or JSON format. You can download a sample VTT file for your reference by selecting **Download sample VTT file**.
   
   :::image type="content" source="media/video-translation/add-subtitle-file.png" alt-text="Screenshot of adding subtitle file on the new project page.":::

1. After reviewing the pricing information and code of conduct, then proceed to create the project.

   Once the upload is complete, you can check the processing status on the project tab.

   After the project is created, you can select the project to review detailed settings and make adjustments according to your preferences.

## Check and adjust voice settings

On the project details page, the project offers two tabs **Translated** and **Original** under **Video**, allowing you to compare them side by side.    

On the right side of the video, you can view both the original script and the translated script. Hovering over each part of the original script triggers the video to automatically jump to the corresponding segment of the original video, while hovering over each part of the translated script triggers the video to jump to the corresponding translated segment.

You can also add or remove segments as needed. When you want to add a segment, ensure that the new segment timestamp doesn't overlap with the previous and next segment, and the segment end time should be larger than the start time. The correct format of timestamp should be `hh:mm:ss.ms`. Otherwise, you can't apply the changes.

You can adjust the time frame of the scripts directly using the audio waveform below the video. After selecting **Apply changes**, the adjustments will be applied.

If you encounter segments with an "unidentified" voice name, it might be because the system couldn't accurately detect the voice, especially in situations where speaker voices overlap. In such cases, it's advisable to manually change the voice name.  

:::image type="content" source="media/video-translation/voice-unidentified.png" alt-text="Screenshot of one segment with unidentified voice name.":::

If you want to adjust the voice, select **Voice settings** to make some changes. On the **Voice settings** page, you can adjust the voice type, gender, and the voice. Select the voice sample on the right of **Voice** to determine your voice selection. If you find there is missing voice, you can add the new voice name by selecting **Add speaker**. After changing the settings, select **Update**. 

 :::image type="content" source="media/video-translation/voice-settings.png" alt-text="Screenshot of adjusting voice settings on the voice settings page.":::

If you make changes multiple times but haven't finished, you only need to save the changes you've made by selecting **Save**. After making all changes, select **Apply changes** to apply them to the video. You'll be charged only after you select **Apply changes**. 

 :::image type="content" source="media/video-translation/apply-changes.png" alt-text="Screenshot of selecting apply changes button after making all changes.":::

You can translate the original video into a new language by selecting **New language**. On the **Translate** page, you can choose a new translated language and voice type. Once the video file has been translated, a new project is automatically created. 

## Related content

- [Video translation overview](video-translation-overview.md)
