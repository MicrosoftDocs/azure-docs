---
title: Moderate images with custom lists and the API console - Content Moderator
titleSuffix: Azure AI Content Moderator
description: You use the List Management API in Azure AI Content Moderator to create custom lists of images.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: how-to
ms.date: 01/10/2019
ms.author: pafarley

---

# Moderate with custom image lists in the API console

You use the [List Management API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672) in Azure AI Content Moderator to create custom lists of images. Use the custom lists of images with the Image Moderation API. The image moderation operation evaluates your image. If you create custom lists, the operation also compares it to the images in your custom lists. You can use custom lists to block or allow the image.

> [!NOTE]
> There is a maximum limit of **5 image lists** with each list to **not exceed 10,000 images**.
>

You use the List Management API to do the following tasks:

- Create a list.
- Add images to a list.
- Screen images against the images in a list.
- Delete images from a list.
- Delete a list.
- Edit list information.
- Refresh the index so that changes to the list are included in a new scan.

## Use the API console
Before you can test-drive the API in the online console, you need your subscription key. This is located on the **Settings** tab, in the **Ocp-Apim-Subscription-Key** box. For more information, see [Overview](overview.md).

## Refresh search index

After you make changes to an image list, you must refresh its index for changes to be included in future scans. This step is similar to how a search engine on your desktop (if enabled) or a web search engine continually refreshes its index to include new files or pages.

1. In the [Image List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672), in the left menu, select **Image Lists**, and then select **Refresh Search Index**.

   The **Image Lists - Refresh Search Index** page opens.

2. For **Open API testing console**, select the region that most closely describes your location. 
 
    ![Image Lists - Refresh Search Index page region selection](images/test-drive-region.png)

    The **Image Lists - Refresh Search Index** API console opens.

3. In the **listId** box, enter the list ID. Enter your subscription key, and then select **Send**.

   ![Image Lists - Refresh Search Index console Response content box](images/try-image-list-refresh-1.png)


## Create an image list

1. Go to the [Image List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672).

   The **Image Lists - Create** page opens. 

3. For **Open API testing console**, select the region that most closely describes your location.

   ![Image Lists - Create page region selection](images/test-drive-region.png)

   The **Image Lists - Create** API console opens.
 
4. In the **Ocp-Apim-Subscription-Key** box, enter your subscription key.

5. In the **Request body** box, enter values for **Name** (for example, MyList) and **Description**.

   ![Image Lists - Create console Request body name and description](images/try-terms-list-create-1.png)

6. Use key-value pair placeholders to assign more descriptive metadata to your list.

    ```json
    {
        "Name": "MyExclusionList",
        "Description": "MyListDescription",
        "Metadata": 
        {
            "Category": "Competitors",
            "Type": "Exclude"
        }
    }
    ```

   Add list metadata as key-value pairs, and not the actual images.
 
7. Select **Send**. Your list is created. Note the **ID** value that is associated with the new list. You need this ID for other image list management functions.

   ![Image Lists - Create console Response content box shows the list ID](images/try-terms-list-create-2.png)
 
8. Next, add images to MyList. In the left menu, select **Image**, and then select **Add Image**.

   The **Image - Add Image** page opens. 

9. For **Open API testing console**, select the region that most closely describes your location.

   ![Image - Add Image page region selection](images/test-drive-region.png)

   The **Image - Add Image** API console opens.
 
10.	In the **listId** box, enter the list ID that you generated, and then enter the URL of the image that you want to add. Enter your subscription key, and then select **Send**.

11.	To verify that the image has been added to the list, in the left menu, select **Image**, and then select **Get All Image Ids**.

    The **Image - Get All Image Ids** API console opens.
  
12. In the **listId** box, enter the list ID, and then enter your subscription key. Select **Send**.

    ![Image - Get All Image Ids console Response content box lists the images that you entered](images/try-image-list-create-11.png)
 
10.	Add a few more images. Now that you have created a custom list of images, try [evaluating images](try-image-api.md) by using the custom image list. 

## Delete images and lists

Deleting an image or a list is straightforward. You can use the API to do the following tasks:

- Delete an image. (**Image - Delete**)
- Delete all the images in a list without deleting the list. (**Image - Delete All Images**)
- Delete a list and all of its contents. (**Image Lists - Delete**)

This example deletes a single image:

1. In the [Image List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672), in the left menu, select **Image**, and then select **Delete**. 

   The **Image - Delete** page opens.

2. For **Open API testing console**, select the region that most closely describes your location. 

   ![Image - Delete page region selection](images/test-drive-region.png)
 
   The **Image - Delete** API console opens.
 
3. In the **listId** box, enter the ID of the list to delete an image from.  This is the number returned in the **Image - Get All Image Ids** console for MyList. Then, enter the **ImageId** of the image to delete. 

In our example, the list ID is **58953**, the value for **ContentSource**. The image ID is **59021**, the value for **ContentIds**.

1. Enter your subscription key, and then select **Send**.

1. To verify that the image has been deleted, use the **Image - Get All Image Ids** console.
 
## Change list information

You can edit a list’s name and description, and add metadata items.

1. In the [Image List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f672), in the left menu, select **Image Lists**, and then select **Update Details**. 

   The **Image Lists - Update Details** page opens.

2. For **Open API testing console**, select the region that most closely describes your location.  

    ![Image Lists - Update Details page region selection](images/test-drive-region.png)

    The **Image Lists - Update Details** API console opens.
 
3. In the **listId** box, enter the list ID, and then enter your subscription key.

4. In the **Request body** box, make your edits, and then select the **Send** button on the page.

   ![Image Lists - Update Details console Request body edits](images/try-terms-list-change-1.png)
 

## Next steps

Use the REST API in your code or start with the [Image lists .NET quickstart](image-lists-quickstart-dotnet.md) to integrate with your application.
