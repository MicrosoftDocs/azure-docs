---
title: Edit speakers in the Azure Video Indexer website
description: The article demonstrates how to edit speakers with the Azure Video Indexer website.
ms.topic: how-to
ms.date: 11/01/2022
ms.author: juliako
---

# Edit speakers with the Azure Video Indexer website

Azure Video Indexer identifies speakers in your video but in some cases you may want to edit these names. You can perform the following editing actions, while in the edit mode. The following editing actions only apply to the currently selected video.

- Add new speaker.
- Rename existing speaker. 
    
    The update applies to all speakers identified by this name.
- Assign a speaker for a transcript line. 

    The update only applies to the currently selected speaker.

The article demonstrates how to edit speakers with the [Azure Video Indexer website](https://www.videoindexer.ai/). The same editing operations are possible with an API.

## Prerequisites

1. Sign in to the [Azure Video Indexer website](https://www.videoindexer.ai/).
1. Select the **Timeline** tab.
1. Choose to view speakers.

:::image type="content" alt-text="Screenshot of how to view speakers." source="./media/edit-speakers-website/view-speakers.png":::

## Add a new speaker

This action allows adding new speakers that were not identified by Azure Video Indexer. To add a new speaker from the website for the selected video, do the following: 

1. Select the edit mode.

    :::image type="content" alt-text="Screenshot of how to edit speakers." source="./media/edit-speakers-website/edit.png":::
1. Go to the transcript line you want to assign a new speaker to.
1. Select **Assign a new speaker**.

    :::image type="content" alt-text="Screenshot of how to add a new speaker." source="./media/edit-speakers-website/assign-new.png":::
1. Add the name of the speaker you would like to use.
1. Press a checkmark to save.
 
## Rename an existing speaker

This action allows renaming an existing speaker that was identified by Azure Video Indexer. To add a new speaker from the website for the selected video, do the following: 

1. Select the edit mode.
1. Go to the transcript line where the speaker you wish to rename appears.
1. Select **Rename selected speaker**. 

    :::image type="content" alt-text="Screenshot of how to rename a speaker." source="./media/edit-speakers-website/rename.png":::

   This action will update speakers by this name.
1. Press a checkmark to save.

## Assign a speaker to a transcript line

This action allows assigning a speaker to a specific transcript line with a wrong assignment. To assign a speaker to a transcript line from the website, do the following: 

1. Go to the transcript line you want to assign a different speaker to. 
1. Select a speaker you wish to assign from the list.
 
    The update only applies to the currently selected speaker.

If the speaker you wish to assign doesn't appear on the list you can either **Assign a new speaker** or **Rename an existing speaker** as described above.

## Limitations

When when adding a new speaker, the new name should be unique.

## Next steps 

[Insert or remove transcript lines in the Azure Video Indexer website](edit-transcript-lines-portal.md)