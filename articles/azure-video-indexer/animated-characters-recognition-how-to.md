---
title: Animated character detection with Azure Video Indexer how to
description: This topic demonstrates how to use animated character detection with Azure Video Indexer.
author: Juliako
manager: femila

ms.custom: references_regions
ms.topic: how-to
ms.date: 12/07/2020
ms.author: juliako
---

# Use the animated character detection with portal and API 

Azure Video Indexer supports detection, grouping, and recognition of characters in animated content, this functionality is available through the Azure portal and through API. Review [this overview](animated-characters-recognition.md) article.

This article demonstrates to how to use the animated character detection with the Azure portal and the Azure Video Indexer API.

## Use the animated character detection with portal 

In the trial accounts the Custom Vision integration is managed by Azure Video Indexer, you can start creating and using the animated characters model. If using the trial account, you can skip the following ("Connect your Custom Vision account") section.

### Connect your Custom Vision account (paid accounts only)

If you own an Azure Video Indexer paid account, you need to connect a Custom Vision account first. If you don't have a Custom Vision account already, create one. For more information, see [Custom Vision](../cognitive-services/custom-vision-service/overview.md).

> [!NOTE]
> Both accounts need to be in the same region. The Custom Vision integration is currently not supported in the Japan region.

Paid accounts that have access to their Custom Vision account can see the models and tagged images there. Learn more about [improving your classifier in Custom Vision](../cognitive-services/custom-vision-service/getting-started-improving-your-classifier.md). 

The training of the model should be done only via Azure Video Indexer, and not via the Custom Vision website. 

#### Connect a Custom Vision account with API 

Follow these steps to connect your Custom Vision account to Azure Video Indexer, or to change the Custom Vision account that is currently connected to Azure Video Indexer:

1. Browse to [www.customvision.ai](https://www.customvision.ai) and sign in.
1. Copy the keys for the Training and Prediction resources:

    > [!NOTE]
    > To provide all the keys you need to have two separate resources in Custom Vision, one for training and one for prediction.
1. Provide other information:

    * Endpoint 
    * Prediction resource ID
1. Browse and sign in to the [Azure Video Indexer](https://vi.microsoft.com/).
1. Select the question mark on the top-right corner of the page and choose **API Reference**.
1. Make sure you're subscribed to API Management by clicking **Products** tab. If you have an API connected you can continue to the next step, otherwise, subscribe. 
1. On the developer portal, select the **Complete API Reference** and browse to **Operations**.  
1. Select **Connect Custom Vision Account** and select **Try it**.
1. Fill in the required fields and the access token and select **Send**. 

    For more information about how to get the Video Indexer access token go to the [developer portal](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Account-Access-Token), and see the [relevant documentation](video-indexer-use-apis.md#obtain-access-token-using-the-authorization-api).  
1. Once the call return 200 OK response, your account is connected.
1. To verify your connection by browse to the [Azure Video Indexer](https://vi.microsoft.com/) portal:
1. Select the **Content model customization** button in the top-right corner.
1. Go to the **Animated characters** tab.
1. Once you select Manage models in Custom Vision, you'll be transferred to the Custom Vision account you just connected.

> [!NOTE]
> Currently, only models that were created via Azure Video Indexer are supported. Models that are created through Custom Vision will not be available. In addition, the best practice is to edit models that were created through Azure Video Indexer only through the Azure Video Indexer platform, since changes made through Custom Vision may cause unintended results.

### Create an animated characters model

1. Browse to the [Azure Video Indexer](https://vi.microsoft.com/) website and sign in.
1. To customize a model in your account, select the **Content model customization** button on the left of the page.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/content-model-customization/content-model-customization.png" alt-text="Customize content model in Azure Video Indexer ":::
1. Go to the **Animated characters** tab in the model customization section.
1. Select **Add model**.
1. Name your model and select enter to save the name.

> [!NOTE]
> The best practice is to have one custom vision model for each animated series. 

### Index a video with an animated model

For the initial training, upload at least two videos. Each should be preferably longer than 15 minutes, before expecting good recognition model. If you have shorter episodes, we recommend uploading at least 30 minutes of video content before training. This will allow you to merge groups that belong to the same character from different scenes and backgrounds, and therefore increase the chance it will detect the character in the following episodes you index. To train a model on multiple videos (episodes), you need to index them all with the same animation model. 

1. Select the **Upload** button.
1. Choose a video to upload (from a file or a URL).
1. Select **Advanced options**.
1. Under **People / Animated characters** choose **Animation models**.
1. If you have one model it will be chosen automatically, and if you have multiple models you can choose the relevant one out of the dropdown menu.
1. Select upload.
1. Once the video is indexed, you'll see the detected characters in the **Animated characters** section in the **Insights** pane.

Before tagging and training the model, all animated characters will be named “Unknown #X”. After you train the model, they'll also be recognized.

### Customize the animated characters models

1. Name the characters in Azure Video Indexer.

    1. After the model created character group, it's recommended to review these groups in Custom Vision. 
    1. To tag an animated character in your video, go to the **Insights** tab and select the **Edit** button on the top-right corner of the window. 
    1. In the **Insights** pane, select any of the detected animated characters and change their names from "Unknown #X" to a temporary name (or the name that was previously assigned to the character). 
    1. After typing in the new name, select the check icon next to the new name. This saves the new name in the model in Azure Video Indexer. 
1. Paid accounts only: Review the groups in Custom Vision 

    > [!NOTE]
    > Paid accounts that have access to their Custom Vision account can see the models and tagged images there. Learn more about [improving your classifier in Custom Vision](../cognitive-services/custom-vision-service/getting-started-improving-your-classifier.md). It’s important to note that training of the model should be done only via Azure Video Indexer (as described in this topic), and not via the Custom Vision website. 

    1. Go to the **Custom Models** page in Azure Video Indexer and choose the **Animated characters** tab. 
    1. Select the Edit button for the model you're working on to manage it in Custom Vision. 
    1. Review each character group: 

        * If the group contains unrelated images, it's recommended to delete these in the Custom Vision website. 
        * If there are images that belong to a different character, change the tag on these specific images by selecting the image, adding the right tag and deleting the wrong tag. 
        * If the group isn't correct, meaning it contains mainly non-character images or images from multiple characters, you can delete in Custom Vision website or in Azure Video Indexer insights. 
        * The grouping algorithm will sometimes split your characters to different groups. It's therefore recommended to give all the groups that belong to the same character the same name (in Azure Video Indexer Insights), which will immediately cause all these groups to appear as on in Custom Vision website. 
    1. Once the group is refined, make sure the initial name you tagged it with reflects the character in the group. 
1. Train the model 

    1. After you finished editing all names you want, you need to train the model. 
    1. Once a character is trained into the model, it will be recognized it the next video indexed with that model. 
    1. Open the customization page and select the **Animated characters** tab and then select the **Train** button to train your model. In order to keep the connection between Video 
    
Indexer and the model, don't train the model in the Custom Vision website (paid accounts have access to Custom Vision website), only in Azure Video Indexer. 
Once trained, any video that will be indexed or reindexed with that model will recognize the trained characters. 

## Delete an animated character and the model

1. Delete an animated character.

    1. To delete an animated character in your video insights, go to the **Insights** tab and select the **Edit** button on the top-right corner of the window.
    1. Choose the animated character and then select the **Delete** button under their name.

    > [!NOTE]
    > This will delete the insight from this video but will not affect the model.
1. Delete a model.

    1. Select the **Content model customization** button on the top menu and go to the **Animated characters** tab.
    1. Select the ellipsis icon to the right of the model you wish to delete and then on the delete button.
    
    * Paid account: the model will be disconnected from Azure Video Indexer and you won't be able to reconnect it.
    * Trial account: the model will be deleted from Customs vision as well. 
    
        > [!NOTE]
        > In a trial account, you only have one model you can use. After you delete it, you can’t train other models.

## Use the animated character detection with API 

1. Connect a Custom Vision account.

    If you own an Azure Video Indexer paid account, you need to connect a Custom Vision account first. <br/>
    If you don’t have a Custom Vision account already, create one. For more information, see [Custom Vision](../cognitive-services/custom-vision-service/overview.md).

    [Connect your Custom Vision account using API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Connect-Custom-Vision-Account).
1. Create an animated characters model.

    Use the [create animation model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Animation-Model) API.
1. Index or reindex a video.

    Use the [re-indexing](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video) API. 
1. Customize the animated characters models.

    Use the [train animation model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Train-Animation-Model) API.

### View the output

See the animated characters in the generated JSON file.

```json
"animatedCharacters": [
    {
    "videoId": "e867214582",
    "confidence": 0,
    "thumbnailId": "00000000-0000-0000-0000-000000000000",
    "seenDuration": 201.5,
    "seenDurationRatio": 0.3175,
    "isKnownCharacter": true,
    "id": 4,
    "name": "Bunny",
    "appearances": [
        {
            "startTime": "0:00:52.333",
            "endTime": "0:02:02.6",
            "startSeconds": 52.3,
            "endSeconds": 122.6
        },
        {
            "startTime": "0:02:40.633",
            "endTime": "0:03:16.6",
            "startSeconds": 160.6,
            "endSeconds": 196.6
        },
    ]
    },
]
```

## Limitations

* Currently, the "animation identification" capability isn't supported in East-Asia region.
* Characters that appear to be small or far in the video may not be identified properly if the video's quality is poor.
* The recommendation is to use a model per set of animated characters (for example per an animated series).

## Next steps

[Azure Video Indexer overview](video-indexer-overview.md)
