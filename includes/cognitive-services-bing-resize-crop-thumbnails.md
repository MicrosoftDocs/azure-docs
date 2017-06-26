Some Bing responses include URLs to thumbnail images served by Bing. You may resize and crop the thumbnail images. To resize an image, include the w (width) and h (height) query parameters in the thumbnail’s URL. Specify the width and height in pixels. For example:  
  
`https://<host>/th?id=JN.5l3yzwy%2f%2fHj59U6XhssIQ&pid=Api&w=200&h=200`  
  
If you resize the image, its aspect ratio is maintained. To maintain the aspect ratio, white padding may be added to the boarder of the image. For example, if you resize a 480x359 image to 200x200 without cropping, the full width contains the image but the height contains 25 pixels of white padding at the top and bottom of the image. The same would be true if the image was 359x480 except the left and right boarders would contain white padding. If you crop the image, white padding is not added.  
  
The following picture shows the original size of a thumbnail image (480x300).  
  
![Original landscape image](./media/cognitive-services-bing-resize-crop/bing-resize-crop-landscape.PNG)  
  
The following picture shows the image resized to 200x200. The aspect ratio is maintained and the top and bottom boarders are padded with white (the black boarder is included to show the padding).  
  
![Resized landscape image](./media/cognitive-services-bing-resize-crop/bing-resize-crop-landscape-resized.PNG)  
  
If you specify dimensions that are greater than the image’s original width and height, the image is padded with white on the left and top boarders.  
  
To crop an image, include the c (crop) query parameter. The following are the possible values that you may specify.  
  
- 4&mdash;Blind Ratio  
- 7&mdash;Smart Ratio  
  
If you request Smart Ratio cropping (c=7), the image is cropped from the center of the image’s region of interest outward while maintaining the image’s aspect ratio. The region of interest is the area of the image that Bing determines contains the most import parts. The following shows an example region of interest.  
  
![Region of interest](./media/cognitive-services-bing-resize-crop/bing-resize-crop-regionofinterest.PNG)

If you resize an image and request Smart Ratio cropping, the image is reduced to the requested size while maintaining the aspect ratio. The image is then cropped based on the resized dimensions. For example, if the resized width is less than or equal to the height, the image is cropped to the left and right of the center of the region of interest. Otherwise, the image is cropped to the top and bottom of the center of the region of interest.  
  
The following shows the image reduced to 200x200 using Smart Ratio cropping.  
  
![Landscape image cropped to 200x200](./media/cognitive-services-bing-resize-crop/bing-resize-crop-landscape200x200c7.PNG)
  
The following shows the image reduced to 200x100 using Smart Ratio cropping.  
   
![Landscape image cropped to 200x100](./media/cognitive-services-bing-resize-crop/bing-resize-crop-landscape200x100c7.PNG)
  
The following shows the image reduced to 100x200 using Smart Ratio cropping.  
  
![Landscape image cropped to 100x200](./media/cognitive-services-bing-resize-crop/bing-resize-crop-landscape100x200c7.PNG)
  
If Bing cannot determine the image’s region of interest, Bing uses Blind Ratio cropping.  
  
If you request Blind Ratio cropping (c=4), Bing uses the following rules to crop the image.  
  
- If (Original Image Width / Original Image Height) < (Requested Image Width / Requested Image Height), the image is measured from top left corner and cropped at the bottom.  
- If (Original Image Width / Original Image Height) > (Requested Image Width / Requested Image Height), the image is measured from the center and cropped to the left and right.  
  
The following shows a portrait image that’s 225x300.  
  
![Original sunflower image](./media/cognitive-services-bing-resize-crop/bing-resize-crop-sunflower.PNG)
  
The following shows the image reduced to 200x200 using Blind Ratio cropping. The image is measured from the top left corner resulting in the bottom part of the image being cropped.  
  
![Sunflower image cropped to 200x200](./media/cognitive-services-bing-resize-crop/bing-resize-crop-sunflower200x200c4.PNG)
  
The following shows the image reduced to 200x100 using Blind Ratio cropping. The image is measured from the top left corner resulting in the bottom part of the image being cropped.  
  
![Sunflower image cropped to 200x100](./media/cognitive-services-bing-resize-crop/bing-resize-crop-sunflower200x100c4.PNG)
  
The following shows the image reduced to 100x200 using Blind Ratio cropping. The image is measured from the center resulting in the left and right parts of the image being cropped.  
  
![Sunflower image cropped to 100x200](./media/cognitive-services-bing-resize-crop/bing-resize-crop-sunflower100x200c4.PNG)
