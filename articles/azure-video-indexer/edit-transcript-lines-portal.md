---
title: View and update transcriptions in Azure AI Video Indexer website 
description: This article explains how to insert or remove a transcript line in the Azure AI Video Indexer website. It also shows how to view word-level information.
ms.topic: how-to
ms.date: 05/03/2022
ms.author: itnorman
author: IngridAtMicrosoft
---

# View and update transcriptions

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

This article explains how to insert or remove a transcript line in the Azure AI Video Indexer website. It also shows how to view word-level information.

## Insert or remove transcript lines in the Azure AI Video Indexer website 

This section explains how to insert or remove a transcript line in the [Azure AI Video Indexer website](https://www.videoindexer.ai/).

### Add new line to the transcript timeline 

While in the edit mode, hover between two transcription lines. You'll find a gap between **ending time** of the **transcript line** and the beginning of the following transcript line, user should see the following **add new transcription line** option. 

:::image type="content" alt-text="Screenshot of how to add new transcription." source="./media/edit-transcript-lines-portal/add-new-transcription-line.png":::

After clicking the add new transcription line, there will be an option to add the new text and the time stamp for the new line. Enter the text, choose the time stamp for the new line, and select **save**. The default time stamp is the gap between the previous and next transcript line. 

:::image type="content" alt-text="Screenshot of a new transcript time stamp line." source="./media/edit-transcript-lines-portal/transcript-time-stamp.png":::

If there isn’t an option to add a new line, you can adjust the end/start time of the relevant transcript lines to fit a new line in your desired place. 

Choose an existing line in the transcript line, click the **three dots** icon, select edit and change the time stamp accordingly.

> [!NOTE]
> New lines will not appear as part of the **From transcript edits** in the **Content model customization** under languages. 
>
> While using the API, when adding a new line, **Speaker name** can be added using free text. For example, *Speaker 1* can now become *Adam*. 

### Edit existing line 

While in the edit mode, select the three dots icon. The editing options were enhanced, they now contain not just the text but also the time stamp with accuracy of milliseconds. 

### Delete line 

Lines can now be deleted through the same three dots icon. 

### Consolidate two lines as one 

To consolidate two lines, which you believe should appear as one. 

1. Go to line number 2, select edit. 
1. Copy the text 
1. Delete the line 
1. Go to line 1, edit, paste the text and save. 

## Examine word-level transcription information

This section shows how to examine word-level transcription information based on sentences and phrases that Azure AI Video Indexer identified. Each phrase is broken into words and each word has the following information associated with it  

|Name|Description|Example|
|---|---|---|
|Word|A word from a phrase.|"thanks"|
|Confidence|How confident the Azure AI Video Indexer that the word is correct.|0.80127704|
|Offset|The time offset from the beginning of the video to where the word starts.|PT0.86S|
|Duration|The duration of the word.|PT0.28S|

### Get and view the transcript

1. Sign in on the [Azure AI Video Indexer website](https://www.videoindexer.ai).
1. Select a video.
1. In the top-right corner, press arrow down and select **Artifacts (ZIP)**. 
1. Download the artifacts.
1. Unzip the downloaded file > browse to where the unzipped files are located > find and open `transcript.speechservices.json`. 
1. Format and view the json.
1. Find`RecognizedPhrases` > `NBest` > `Words` and find interesting to you information.
   
```json
"RecognizedPhrases": [
{
  "RecognitionStatus": "Success",
  "Channel": 0,
  "Speaker": 1,
  "Offset": "PT0.86S",
  "Duration": "PT11.01S",
  "OffsetInTicks": 8600000,
  "DurationInTicks": 110100000,
  "NBest": [
    {
      "Confidence": 0.82356554,
      "Lexical": "thanks for joining ...",
      "ITN": "thanks for joining ...",
      "MaskedITN": "",
      "Display": "Thanks for joining ...",
      "Words": [
        {
          "Word": "thanks",
          "Confidence": 0.80127704,
          "Offset": "PT0.86S",
          "Duration": "PT0.28S",
          "OffsetInTicks": 8600000,
          "DurationInTicks": 2800000
        },
        {
          "Word": "for",
          "Confidence": 0.93965703,
          "Offset": "PT1.15S",
          "Duration": "PT0.13S",
          "OffsetInTicks": 11500000,
          "DurationInTicks": 1300000
        },
        {
          "Word": "joining",
          "Confidence": 0.97060966,
          "Offset": "PT1.29S",
          "Duration": "PT0.31S",
          "OffsetInTicks": 12900000,
          "DurationInTicks": 3100000
        },
        {

```

## Next steps

For updating transcript lines and text using API visit the [Azure AI Video Indexer API developer portal](https://aka.ms/avam-dev-portal)
