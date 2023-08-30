---
title: Edit speakers in the Azure AI Video Indexer website
description: The article demonstrates how to edit speakers with the Azure AI Video Indexer website.
ms.topic: how-to
ms.date: 11/01/2022
ms.author: juliako
---

# Edit speakers with the Azure AI Video Indexer website

Azure AI Video Indexer identifies each speaker in a video and attributes each transcribed line to a speaker. The speakers are given a unique identity such as `Speaker #1` and `Speaker #2`. To provide clarity and enrich the transcript quality, you may want to replace the assigned identity with each speaker's actual name. To edit speakers' names, use the edit actions as described in the article. 

The article demonstrates how to edit speakers with the [Azure AI Video Indexer website](https://www.videoindexer.ai/). The same editing operations are possible with an API. To use API, call [update video index](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Index).

> [!NOTE]
> The addition or editing of a speaker name is applied throughout the transcript of the video but is not applied to other videos in your Azure AI Video Indexer account.

## Start editing

1. Sign in to the [Azure AI Video Indexer website](https://www.videoindexer.ai/).
2. Select a video.
3. Select the **Timeline** tab.
4. Choose to view speakers.

:::image type="content" alt-text="Screenshot of how to view speakers." source="./media/edit-speakers-website/view-speakers.png":::

## Add a new speaker

This action allows adding new speakers that were not identified by Azure AI Video Indexer. To add a new speaker from the website for the selected video, do the following: 

1. Select the edit mode.

    :::image type="content" alt-text="Screenshot of how to edit speakers." source="./media/edit-speakers-website/edit.png":::
1. Go to the speakers drop down menu above the transcript line you wish to assign a new speaker to.
1. Select **Assign a new speaker**.

    :::image type="content" alt-text="Screenshot of how to add a new speaker." source="./media/edit-speakers-website/assign-new.png":::
1. Add the name of the speaker you would like to assign.
1. Press a checkmark to save.

> [!NOTE]
> Speaker names should be unique across the speakers in the current video.
 
## Rename an existing speaker

This action allows renaming an existing speaker that was identified by Azure AI Video Indexer. The update applies to all speakers identified by this name.
 
To rename a speaker from the website for the selected video, do the following: 

1. Select the edit mode.
1. Go to the transcript line where the speaker you wish to rename appears.
1. Select **Rename selected speaker**. 

    :::image type="content" alt-text="Screenshot of how to rename a speaker." source="./media/edit-speakers-website/rename.png":::

   This action will update speakers by this name.
1. Press a checkmark to save.

## Assign a speaker to a transcript line

This action allows assigning a speaker to a specific transcript line with a wrong assignment. To assign a speaker to a transcript line from the website, do the following: 

1. Go to the transcript line you want to assign a different speaker to. 
1. Select a speaker from the speakers drop down menu above that you wish to assign.
 
    The update only applies to the currently selected transcript line.

If the speaker you wish to assign doesn't appear on the list you can either **Assign a new speaker** or **Rename an existing speaker** as described above.

## Limitations

When adding a new speaker or renaming a speaker, the new name should be unique.

## Next steps 

[Insert or remove transcript lines in the Azure AI Video Indexer website](edit-transcript-lines-portal.md)
