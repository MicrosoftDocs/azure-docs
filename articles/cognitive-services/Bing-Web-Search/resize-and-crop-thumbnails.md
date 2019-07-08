---
title: Resize and crop image thumbnails - Bing Web Search API
titleSuffix: Azure Cognitive Services
description: Learn how to resize and crop thumbnails provided by the Bing Search APIs.
services: cognitive-services
author: aahill
manager: nitinme
ms.assetid: 05A08B01-89FF-4781-AFE7-08DA92F25047
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: article
ms.date: 06/27/2019
ms.author: aahi
---

# Resize and crop thumbnail images

Some responses from the Bing Search APIs will include URLs to thumbnail images served by Bing, which you can resize and crop. If you display a subset of these thumbnails, provide an option to view the remaining images.

> [!NOTE]
> Be sure that cropping and resizing thumbnail images will provide a search scenario that respects third party rights, as required by the Bing Search API [use and display requirements](use-display-requirements.md).

## Resize a thumbnail 

To resize a thumbnail, Bing recommends that you specify only one the `w` (width) or `h` (height) query parameters in the thumbnail's URL. Specifying only the height or width lets Bing maintain the image's original aspect. Specify the width and height in pixels. 

For example, if the original thumbnail is 480x620:

`https://<host>/th?id=JN.5l3yzwy%2f%2fHj59U6XhssIQ&pid=Api&w=480&h=620`

And you want to decrease its size, set the `w` parameter to a new value (for example `336`), and remove the `h`  parameter:

`https://<host>/th?id=JN.5l3yzwy%2f%2fHj59U6XhssIQ&pid=Api&w=336`

If you specify both parameters without maintaining the aspect ratio, Bing will add white padding to the image’s border

If you specify only the height or width of a thumbnail, the image's original aspect ratio will be maintained. If you specify both parameters, and the aspect ratio isn't maintained, Bing will add white padding to the border of the image.

For example, if you resize a 480x359 image to 200x200 without cropping, the full width will contain the image but the height will contain 25 pixels of white padding at the top and bottom of the image. The same is if the image was 359x480 except the left and right borders would contain white padding. If you crop the image, white padding is not added.  

The following picture shows the original size of a thumbnail image (480x300).  
  
![Original landscape image](./media/resize-crop/bing-resize-crop-landscape.png)  
  
The following picture shows the image resized to 200x200. The aspect ratio is maintained and the top and bottom borders are padded with white (the black border here is included to show the padding).  
  
![Resized landscape image](./media/resize-crop/bing-resize-crop-landscape-resized.png)  

If you specify dimensions that are greater than the image’s original width and height, Bing will add white padding to the left and top borders.  

## Crop a thumbnail 

To crop an image, include the `c` (crop) query parameter. You can use the following values:
  
- `4` &mdash; Blind Ratio  
- `7` &mdash; Smart Ratio  

### Smart Ratio cropping

If you request Smart Ratio cropping (by setting the `c` parameter to `7`), Bing will crop an image from the center of its region of interest outward, while maintaining the image’s aspect ratio. The region of interest is the area of the image that Bing determines contains the most import parts. The following shows an example region of interest.  
  
![Region of interest](./media/resize-crop/bing-resize-crop-regionofinterest.png)

If you resize an image and request Smart Ratio cropping, Bing reduces the image to the requested size while maintaining the aspect ratio. Bing then crops the image based on the resized dimensions. For example, if the resized width is less than or equal to the height, Bing will crop the image to the left and right of the center of the region of interest. Otherwise, Bing will crop it to the top and bottom of the center of the region of interest.  
  
 
The following shows the image reduced to 200x200 using Smart Ratio cropping. Because Bing measures the image from the top left corner, the bottom part of the image is cropped. 
  
![Landscape image cropped to 200x200](./media/resize-crop/bing-resize-crop-landscape200x200c7.png) 
  
The following shows the image reduced to 200x100 using Smart Ratio cropping. Because Bing measures the image from the top left corner, the bottom part of the image is cropped. 
   
![Landscape image cropped to 200x100](./media/resize-crop/bing-resize-crop-landscape200x100c7.png)
  
The following shows the image reduced to 100x200 using Smart Ratio cropping. Because Bing measures the image from the center, the left and right parts of the image are cropped.
  
![Landscape image cropped to 100x200](./media/resize-crop/bing-resize-crop-landscape100x200c7.png) 

If Bing cannot determine the image’s region of interest, the service will use Blind Ratio cropping.  

### Blind Ratio cropping

If you request Blind Ratio cropping (by setting the `c` parameter to `4`), Bing uses the following rules to crop the image.  
  
- If `(Original Image Width / Original Image Height) < (Requested Image Width / Requested Image Height)`, the image is measured from top left corner and cropped at the bottom.  
- If `(Original Image Width / Original Image Height) > (Requested Image Width / Requested Image Height)`, the image is measured from the center and cropped to the left and right.  

The following shows a portrait image that’s 225x300.  
  
![Original sunflower image](./media/resize-crop/bing-resize-crop-sunflower.png)
  
The following shows the image reduced to 200x200 using Blind Ratio cropping. The image is measured from the top left corner resulting in the bottom part of the image being cropped.  
  
![Sunflower image cropped to 200x200](./media/resize-crop/bing-resize-crop-sunflower200x200c4.png)
  
The following shows the image reduced to 200x100 using Blind Ratio cropping. The image is measured from the top left corner resulting in the bottom part of the image being cropped.  
  
![Sunflower image cropped to 200x100](./media/resize-crop/bing-resize-crop-sunflower200x100c4.png)
  
The following shows the image reduced to 100x200 using Blind Ratio cropping. The image is measured from the center resulting in the left and right parts of the image being cropped.  
  
![Sunflower image cropped to 100x200](./media/resize-crop/bing-resize-crop-sunflower100x200c4.png)

## Next steps

* [What are the Bing Search APIs?](bing-api-comparison.md)
* [Bing Search API use and display requirements](use-display-requirements.md)
