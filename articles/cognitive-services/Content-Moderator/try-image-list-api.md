---
title: Moderate images by using custom lists in Azure Content Moderator | Microsoft Docs
description: Test-drive custom image lists in the Content Moderator API console.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/05/2017
ms.author: sajagtap
---

# Moderate images by using custom lists in the API console

You can use the [List Management API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672) in Azure Content Moderator to create custom lists of images. You use the custom lists of images with the Image Moderation API. The image moderation operation evaluates your image. If you create custom lists, the operation also compares it to the images in your custom lists. You can use custom lists to block or allow the image.

You can also create custom lists of images to be used with the Image Moderation API. 

This article focuses on lists of images.

You can use the List Management API to do these tasks:

- Create a list.
- Add images to a list.
- Screen images against the images in a list.
- Delete images from a list.
- Delete a list.
- Edit list information.
- Refresh the index so that changes to the list are included in a new scan.

## Use the API console
Before you can test-drive the API in the online console, you need your subscription key. This is found on the **Settings** tab, in the **Ocp-Apim-Subscription-Key** box. For more information, see [Overview](overview.md).

## Create an image list
1.	Go to the [Image List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672).

  The **Image Lists - Create** page opens. 

3.	For **Open API testing console**, select the region that most closely describes your location.

  The **Image Lists - Create** API console opens.

  ![Image Lists - Create page region selection](images/test-drive-region.png)
 
4.	In the **Ocp-Apim-Subscription-Key** box, enter your subscription key.

5.	In the **Request Body**, enter values for **Name** (for example, MyList) and **Description**.
  ![Image Lists - Create console Request body name and description](images/try-terms-list-create-1.png)

6.	Use key-value pair placeholders to assign more descriptive metadata to your list. For example, enter something like this:

        {
           "Name": "MyExclusionList",
           "Description": "MyListDescription",
           "Metadata": 
           {
             "Category": "Competitors",
             "Type": "Exclude"
           }
        }

  Note that we are adding list metadata as key-value pairs, and not the actual images.
 
7.	Select **Send**. Your list is created. Take note of the **Id** value that is associated with the new list. You will need this for other image list management functions.

  ![Image Lists - Create console Response content box shows the list ID](images/try-terms-list-create-2.png)
 
8.	Next, add images to MyList. In the left menu, select **Image**, and then select **Add Image**.

  The **Image - Add Image** page opens. 

9. For **Open API testing console**, select the region that most closely describes your location.

  ![Image - Add Image page region selection](images/test-drive-region.png)

  The **Image - Add Image** API console opens.
 
10.	In the **listId** box, enter the ID that you generated earlier, and then enter the URL of the image you want to add. Enter your subscription key, and then select **Send**.

11.	To verify that the image has been added, in the left menu, select **Image**, and then select **Get All Image Ids**.

  The **Image - Get All Image Ids** API console opens.
  
12. In the **listId** box, enter the list ID, and then enter your subscription key. Select **Send**.

  ![Image - Get All Image Ids console Response content box lists the images that you entered](images/try-image-list-create-11.png)
 
10.	Add a few more images. Now that you have created a custom list of images, try [evaluating images](try-image-api.md) by using the custom image list. 

## Delete images and lists

Deleting an image or a list is straightforward. You can use the API to do the following tasks:

- Delete an image. **(Image - Delete)**
- Delete all the images in a list without deleting the list. **(Image - Delete All Images)**
- Delete a list and all of its contents. **(Image Lists - Delete)**

This example deletes a single image:

1. In the [Image List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672), in the left menu, select **Image**, and then select **Delete**. 

  The **Image - Delete** page opens.

2. For **Open API testing console**, select the region that most closely describes your location. 

  ![Image - Delete page region selection](images/test-drive-region.png)
 
  The **Image - Delete** API console opens.
 
3.	In the **listId** box, enter the ID of the list that you want to delete an image from.  This is the number (in our example, the list ID is **58953**, the value for **ContentSource**) that was returned in the **Image - Get all Image Ids** console for MyList earlier in the article. Enter the **ImageId** of the image you want to delete (in our example, the image ID is **59021**, the value for **ContentIds**).

4.	Enter your subscription key, and then select **Send**.

5.	To verify that the image has been deleted, use the **Image - Get all Image Ids** console.
 
## Change list information

You can edit a list’s name and description, and add metadata items.

1.	In the [Image List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672), in the left menu, select **Image Lists**, and then select **Update Details**. 

  The **Image Lists - Update Details** page opens.

2. For **Open API testing console**, select the region that most closely describes your location.  

  The **Image Lists - Update Details** API console opens.

  ![Image Lists - Update Details page region selection](images/test-drive-region.png)
 
3.	In the **listId** box, enter the list ID, and then enter your subscription key.

4.	In the **Request Body** box, make your edits, and then select **Send**.

  ![Image Lists - Update Details console Request body edits](images/try-terms-list-change-1.png)
 
## Refresh Search Index

After you make changes to an image list, you must refresh its index for changes to be included in future scans. This is similar to how a search engine on your desktop (if enabled) or a web search engine continually refreshes its index to include new files or pages.

1.	In the [Image List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672), in the left menu, select **Image Lists**, and then select **Refresh Search Index**.

  The **Image Lists - Refresh Search Index** page opens.

2. For **Open API testing console**, select the region that most closely describes your location. 
 
  The **Image Lists - Refresh Search Index** API console opens.

  ![Image Lists - Refresh Search Index page region selection](images/test-drive-region.png)

3.	In the **listId** box, enter the list ID. Enter your subscription key, and then select **Send**.

  ![Image Lists - Refresh Search Index console Response content box](images/try-image-list-refresh-1.png)

## Next steps

* Learn how to use the [List Management API for term lists](try-terms-list-api.md).
