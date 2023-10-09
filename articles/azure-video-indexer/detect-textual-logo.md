---
title: Detect textual logo with Azure AI Video Indexer
description: This article gives an overview of Azure AI Video Indexer textual logo detection.
ms.topic: how-to
ms.date: 01/22/2023
ms.author: inhenkel
author: IngridAtMicrosoft 
---

# How to detect textual logo

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

> [!NOTE]
> Textual logo detection (preview) creation process is currently available through API. The result can be viewed through the Azure AI Video Indexer [website](https://www.videoindexer.ai/). 

**Textual logo detection** insights are based on the OCR textual detection, which matches a specific predefined text.

For example, if a user would create a textual logo: “Microsoft”, different appearances of the word ‘Microsoft’ will be detected as the ‘Microsoft’ logo. A logo can have different variations, these variations can be associated with the main logo name. For example, user might have under the ‘Microsoft’ logo the following variations: ‘MS’, ‘MSFT’ etc.

```json
{
    "name": "Microsoft",
    "wikipediaSearchTerm": "Microsoft",
    "textVariations": [{
    "text": "Microsoft",
    "caseSensitive": false
    }, {
    "text": "MSFT",
    "caseSensitive": true
    }]
}
```

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/textual-logo-detection/microsoft-example.png" alt-text="Diagram of logo detection.":::

## Prerequisite

The Azure Video Index account must have (at the very least) the `contributor` role assigned to the resource.

## How to use

In order to use textual logo detection, follow these steps, described in this article: 

1. Create a logo instance using with the [Create logo](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo) API (with variations).  

    * Save the logo ID. 
1. Create a logo group using the [Create Logo Group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo-Group) API. 

    * Associate the logo instance with the group when creating the new group (by pasting the ID in the logos array). 
1. Upload a video using: **Advanced video** or **Advance video + audio** preset, use the `logoGroupId` parameter to specify the logo group you would like to index the video with. 

## Create a logo instance

Use the [Create logo](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo) API to create your logo. You can use the **try it** button.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/textual-logo-detection/logo-api.png" alt-text="Diagram of logo API.":::
 
In this tutorial we use the example supplied as default: 

Insert the following:

* `Location`: The location of the Azure AI Video Indexer account.
* `Account ID`: The ID of the Azure AI Video Indexer account.
* `Access token`: The token, at least at a contributor level permission. 

The default body is: 
  
```json
{
    "name": "Microsoft",
    "wikipediaSearchTerm": "Microsoft",
    "textVariations": [{
    "text": "Microsoft",
    "caseSensitive": false
    }, {
    "text": "MSFT",
    "caseSensitive": true
    }]
}
```

|Key|Value|
|---|---|
|Name|Name of the logo, would be used in the Azure AI Video Indexer website.|
|wikipediaSearchTerm|Used to create a description in the Video Indexer website.|
|text|The text the model will compare too, make sure to add the obvious name as part of the variations. (e.g Microsoft)|
|caseSensitive| true/false according to the variation.|

The response should return **201 Created**.

```
HTTP/1.1 201 Created

content-type: application/json; charset=utf-8

{
    "id": "id"
    "creationTime": "2023-01-15T13:08:14.9518235Z",
    "lastUpdateTime": "2023-01-15T13:08:14.9518235Z",
    "lastUpdatedBy": "Jhon Doe",
    "createdBy": "Jhon Doe",
    "name": "Microsoft",
    "wikipediaSearchTerm": "Microsoft",
    "textVariations": [{
        "text": "Microsoft",
        "caseSensitive": false,
        "creationTime": "2023-01-15T13:08:14.9518235Z",
        "createdBy": "Jhon Doe"
    }, {
        "text": "MSFT",
        "caseSensitive": true,
        "creationTime": "2023-01-15T13:08:14.9518235Z",
        "createdBy": "Jhon Doe"
    }]
}
```
## Create a new textual logo group 
 
Use the [Create Logo Group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo-Group) API to create a logo group. Use the **try it** button. 
 
Insert the following: 

* `Location`: The location of the Azure AI Video Indexer account.
* `Account ID`: The ID of the Azure AI Video Indexer account.
* `Access token`: The token, at least at a contributor level permission. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/textual-logo-detection/logo-group-api.png" alt-text="Diagram of logo group API.":::

In the **Body** paste the logo ID from the previous step.

```json
{
    "logos": [{
        "logoId": "id"
    }],
    "name": "Technology",
    "description": "A group of logos of technology companies."
}
```

* The default example has two logo IDs, we have created the first group with only one logo ID.

    The response should return **201 Created**. 

    ```
    HTTP/1.1 201 Created
    
    content-type: application/json; charset=utf-8
    
    {
        "id": "id",
        "creationTime": "2023-01-15T14:41:11.4860104Z",
        "lastUpdateTime": "2023-01-15T14:41:11.4860104Z",
        "lastUpdatedBy": "Jhon Doe",
        "createdBy": "Jhon Doe",
        "logos": [{
            "logoId": " e9d609b4-d6a6-4943-86ff-557e724bd7c6"
        }],
        "name": "Technology",
        "description": "A group of logos of technology companies."
    }    
    ```

## Upload from URL 
 
Use the upload API call: 

Specify the following:

* `Location`: The location of the Azure AI Video Indexer account.
* `Account`: The ID of the Azure AI Video Indexer account. 
* `Name`: The name of the media file you're indexing. 
* `Language`: `en-US`. For more information, see [Language support](language-support.md)
* `IndexingPreset`: Select **Advanced Video/Audio+video**.  
* `Videourl`: The url.
* `LogoGroupID`: GUID representing the logo group (you got it in the response when creating it).
* `Access token`: The token, at least at a contributor level permission. 
 
## Inspect the output 

Assuming the textual logo model has found a match, you'll be able to view the result in the [Azure AI Video Indexer website](https://www.videoindexer.ai/).
 
### Insights  

A new section would appear in the insights panel showing the number of custom logos that were detected. One representative thumbnail will be displayed representing the new logo. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/textual-logo-detection/logo-insight.png" alt-text="Diagram of logo insight.":::

### Timeline 

When switching to the Timeline view, under the **View**, mark the **Logos** checkbox. All detected thumbnails will be displayed according to their time stamp.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/textual-logo-detection/logo-timeline.png" alt-text="Diagram of logo timeline.":::

All logo instances that were recognized with a certainty above 80% present will be displayed, the extended list of detection including low certainty detection are available in the [Artifacts](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Artifact-Download-Url) file.

## Next steps

### Adding a logo to an existing logo group

In the first part of this article, we had one instance of a logo and we have associated it to the right logo group upon the creation of the logo group. If all logo instances are created before the logo group is created, they can be associated with logo group on the creation phase. However, if the group was already created, the new instance should be associated to the group following these steps:

1. Create the logo.

    1. Copy the logo ID.
1. [Get logo groups](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Logo-Groups). 

    1. Copy the logo group ID of the right group. 
1. [Get logo group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Logo-Group).

    1. Copy the response the list of logos IDs:

    Logo list sample:

    ```json
    "logos": [{
        "logoId": "id"
    }],
    ```
1. [Update logo group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Logo-Group).

    1. Logo group ID is the output received at step 2.
    1. At the ‘Body’ of the request, paste the existing list of logos from step 3.
    1. Then add to the list the logo ID from step 1.
1. Validate the response of the [Update logo group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Logo-Groups) making sure the list contains the previous IDs and the new.

### Additional information and limitations 
 
* A logo group can contain up to 50 logos.
* One logo can be linked to more than one group.
* Use the [Update logo group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Logo-Groups) to add the new logo to an existing group.
