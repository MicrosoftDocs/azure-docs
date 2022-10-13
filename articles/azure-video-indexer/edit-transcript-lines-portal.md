---
title: Insert or remove transcript lines in Azure Video Indexer portal 
description: This article explains how to insert or remove a transcript line in Azure Video Indexer portal.
ms.author: itnorman
ms.topic: how-to
ms.date: 05/03/2022
---

# Insert or remove transcript lines in Video Indexer portal 

This article explains how to insert or remove a transcript line in Azure Video Indexer portal.

## Add new line to the transcript timeline 

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

## Edit existing line 

While in the edit mode, select the three dots icon. The editing options were enhanced, they now contain not just the text but also the time stamp with accuracy of milliseconds. 

## Delete line 

Lines can now be deleted through the same three dots icon. 

## Example how and when to use this feature 

To consolidate two lines, which you believe should appear as one. 

1. Go to line number 2, select edit. 
1. Copy the text 
1. Delete the line 
1. Go to line 1, edit, paste the text and save. 
 
## Next steps

For updating transcript lines and text using API visit [Azure Video Indexer Developer portal](https://aka.ms/avam-dev-portal)
