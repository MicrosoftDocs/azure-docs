---
title: "Init Image Transformationply Image Transformation"
titleSuffix: Azure Machine Learning
description: Learn how to use the Init Image Transformation module to initialize image transformation.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 05/26/2020
---
# Init Image Transformation

This article describes how to use the **Init Image Transformation** module in Azure Machine Learning designer (preview), to initialize image transformation to specify how you want image to be transformed.

## How to configure Init Image Transformation

1.  Add the **Init Image Transformation** module to your pipeline in the designer. 

2.  For **Resize**, specify whether to resize the input PIL Image to the given size. If you choose 'True', you can specify the desired output image size in **Size**, by default 256. 

3.  For **Center crop**, specify whether to crop the given PIL Image at the center. If you choose 'True', you can specify the desired output image size of the crop in **Crop size**, by default 224.  

4.  For **Pad**, specify whether to pad the given PIL Image on all sides with the pad value 0. If you choose 'True', you can specify padding (how many pixels to add) on each border in **Padding**.

5.  For **Color jitter**, specify whether to randomly change the brightness, contrast and saturation of an image.

6.  For **Grayscale**, specify whether to convert image to grayscale.

7.  For **Random resized crop**, specify whether to crop the given PIL Image to random size and aspect ratio. A crop of random size (range from 0.08 to 1.0) of the original size and a random aspect ratio (range from 3/4 to 4/3) of the original aspect ratio is made. This crop is finally resized to given size.
    This is commonly used in training the Inception networks. If you choose 'True', you can specify the expected output size of each edge in **Random size**, by default 256.

8.  For **Random crop**, specify whether to crop the given PIL Image at a random location. If you choose 'True', you can specify the desired output size of the crop in **Random crop size**, by default 224.

9.  For **Random horizontal flip**, specify whether to horizontally flip the given PIL Image randomly with probability 0.5.

10.  For **Random vertical flip**, specify whether to vertically flip the given PIL Image randomly with probability 0.5.

11.  For **Random rotation**, specify whether to rotate the image by angle. If you choose 'True', you can specify in range of degrees by setting **Random rotation degrees**, which means (-degrees, +degrees), by default 0.

12.  For **Random affine**, specify whether to random affine transformation of the image keeping center invariant. If you choose 'True', you can specify in range of degrees to select from in **Random affine degrees**, which means (-degrees, +degrees), by default 0.

13.  For **Random grayscale**, specify whether to randomly convert image to grayscale with probability 0.1.

14.  For **Random perspective**, specify whether to performs Perspective transformation of the given PIL Image randomly with probability 0.5.


16.  Connect to [Apply Image Transformation](apply-image-transformation.md) module, to apply the transformation specified above to the input image dataset.

17. Submit the pipeline.

## Results

After transformation is completed, you can find transformed images in the output of [Apply Image Transformation](apply-image-transformation.md) module.


## Technical notes  

Refer to [https://pytorch.org/docs/stable/torchvision/transforms.html](https://pytorch.org/docs/stable/torchvision/transforms.html) for more info about image transformation.

###  Module parameters  

| Name                    | Range   | Type    | Default | Description                              |
| ----------------------- | ------- | ------- | ------- | ---------------------------------------- |
| Resize                  | Any     | Boolean | True    | Resize the input PIL Image to the given size |
| Size                    | >=1     | Integer | 256     | Specify the desired output size          |
| Center crop             | Any     | Boolean | True    | Crops the given PIL Image at the center  |
| Crop size               | >=1     | Integer | 224     | Specify the desired output size of the crop |
| Pad                     | Any     | Boolean | False   | Pad the given PIL Image on all sides with the given "pad" value |
| Padding                 | >=0     | Integer | 0       | Padding on each border                   |
| Color jitter            | Any     | Boolean | False   | Randomly change the brightness, contrast and saturation of an image |
| Grayscale               | Any     | Boolean | False   | Convert image to grayscale               |
| Random resized crop     | Any     | Boolean | False   | Crop the given PIL Image to random size and aspect ratio |
| Random size             | >=1     | Integer | 256     | Expected output size of each edge        |
| Random crop             | Any     | Boolean | False   | Crop the given PIL Image at a random location |
| Random crop size        | >=1     | Integer | 224     | Desired output size of the crop          |
| Random horizontal flip  | Any     | Boolean | True    | Horizontally flip the given PIL Image randomly with a given probability |
| Random vertical flip    | Any     | Boolean | False   | Vertically flip the given PIL Image randomly with a given probability |
| Random rotation         | Any     | Boolean | False   | Rotate the image by angle                |
| Random rotation degrees | [0,180] | Integer | 0       | Range of degrees to select from          |
| Random affine           | Any     | Boolean | False   | Random affine transformation of the image keeping center invariant |
| Random affine degrees   | [0,180] | Integer | 0       | Range of degrees to select from          |
| Random grayscale        | Any     | Boolean | False   | Randomly convert image to grayscale with probability 0.1 |
| Random perspective      | Any     | Boolean | False   | Performs Perspective transformation of the given PIL Image randomly with probability 0.5 |
| Random erasing          | Any     | Boolean | False   | Randomly selects a rectangle region in an image and erases its pixels with probability 0.5 |

###  Output  

| Name                        | Type                    | Description                              |
| --------------------------- | ----------------------- | ---------------------------------------- |
| Output image transformation | TransformationDirectory | Output image transformation that can be connected to **Apply Image Transformation** module. |

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 