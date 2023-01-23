---
title: Detect textual logo with Azure Video Indexer
description: This article gives an overview of Azure Video Indexer textual logo detection.
ms.topic: how-to
ms.date: 01/22/2023
ms.author: juliako
---

# How to detect textual logo (preview)

> [!NOTE]
> Textual logo detection (preview) creation process is currently available through API. The result can be viewed through the Azure Video Indexer [website](https://www.videoindexer.ai/). 

The **textual logo detection** insight is an OCR-based textual detection, which matches a specific predefined text. For example, if a user created a textual logo: "Microsoft", different appearances of the word *Microsoft* will be detected as the "Microsoft" logo. A logo can have different variations, these variations can be associated with the main logo name. For example, user might have under the "Microsoft" logo the following variations: "MS" or "MSFT". 

When using the OCR, a text in a video can be detected. For example, in the following screen "Microsoft" is detected.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/textual-logo-detection/microsoft-example.png" alt-text="Diagram of logo detection.":::

## Prerequisite

The Azure Video Index account must have (at the very least) the `contributor` role assigned to the resource.

## Textual logo detection steps

In order to use textual logo detection, follow these steps, described in this article: 

1. Create a logo instance using with the [Create logo](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo) API (with variations).  

    * Save the logo ID. 
1. Create a logo group using the [Create Logo Group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo-Group) API. 

    * Associate the logo instance with the group when creating the new group (by pasting the ID in the logos array). 
1. Upload a video using: **Advanced video** or **Advance video + audio** preset, use the `logoGroupId` parameter to specify the logo group you would like to index the video with. 

## Create a logo instance

Use the [Create logo](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo) API to create your logo. You can use the **try it** button.
 
In this tutorial we use the example supplied as default: 

Insert the following:

* `Location`: The location of the Azure Video Indexer account.
* `Account ID`: The ID of the Azure Video Indexer account.
* `Access token`: The token, at least at a contributor level permission. 
 
The default body is: 
  
|Key|Value|
|---|---|
|Name|Name of the logo, would be used in the Azure Video Indexer website.|
|wikipediaSearchTerm|Used to create a description in the Video Indexer website.|
|text|The text the model will compare too, make sure to add the obvious name as part of the variations. (e.g Microsoft)|
|caseSensitive| true/false according to the variation.|
 
## Create a new textual logo group 
 
Use the [Create Logo Group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo-Group) API to create a logo group. Use the **try it** button. 
 
Insert the following: 

* `Location`: The location of the Azure Video Indexer account.
* `Account ID`: The ID of the Azure Video Indexer account.
* `Access token`: The token, at least at a contributor level permission. 
  
> [!TIP]
> The default example has two logo IDs, we have created out first group with only one logo IDSS. 

## Upload from URL 
 
Use the upload API call: 

Specify the following:

* `Location`: The location of the Azure Video Indexer account.
* `Account`: The ID of the Azure Video Indexer account. 
* `Name`: The name of the media file you're indexing. 
* `Language`: `en-US`. 
* `IndexingPreset`: Select **Advanced Video/Audio+video**.  
* `Videourl`: The url.
* `LogoGroupID`: GUID representing the logo group (you got it in the response when creating it).
* `Access token`: The token, at least at a contributor level permission. 
 
## Inspect the output 

Assuming the textual logo model has found a match, you'll be able to view the result in the [Azure Video Indexer website](https://www.videoindexer.ai/).
 
### Insights  

A new section would appear in the insights panel showing the number of custom logos that were detected. One representative thumbnail will be displayed representing the new logo. 

### Timeline 
 
In the **Timeline** view, make sure to mark the **Logos** checkbox (under the **View**). 

All detected thumbnails will be displayed according to their time stamp. All logo instances that were recognized with a certainty above 80% present will be displayed, the extended list of detection including low certainty detection are available in the **Artifacts** file. 

## Considerations and limitations  

* A logo group can contain up to 50 logos. 
* One logo can be linked to more than one group. 
* Use the [Update logo group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Logo-Groups) to add the new logo to an existing group. 

## Next steps

Adding a logo to an existing logo group.
 
In the first part of this article, we had one instance of a logo and we've associated it to the right logo group upon the creation of the logo group. If all logo instances are created before the logo group is created, they can be associated with logo group on the creation phase. However, if the group was already created, the new instance should be associated to the group following the creation steps: 

1. Create the logo.
1. Get logo groups and copy the logo group ID of the right group.
1. Get logo group and copy the response the list of logos Ids: 

    ```    
    "logos": [{ 
        "logoId": "<ID>" 
    }],
    ``` 
    1. Update logo group. Add a Logo group ID is the output received at step 2. 
    1. At the 'Body' of the request, paste the existing list of logos from step 3. 
    1. Then add to the list the logo ID from step 1. 
1. Validate the response of the [Update logo group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Logo-Groups) making sure the list contains the previous and the new IDs. 
