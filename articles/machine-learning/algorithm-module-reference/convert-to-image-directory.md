---
title: "Convert to Image Directory"
titleSuffix: Azure Machine Learning
description: Learn how to use the Convert to Image Directory module to Convert dataset to image directory format.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 09/28/2020
---
# Convert to Image Directory

This article describes how to use the Convert to Image Directory module to help convert image dataset to 'Image Directory' data type, which is standardized data format in image related tasks like image classification in Azure Machine Learning designer.

## How to use Convert to Image Directory  

1.  Add the **Convert to Image Directory** module to the canvas. You can find this module in the 'Computer Vision/Image Data Transformation' category in the module list. 

2.  The input of **Convert to Image Directory** module must be a file dataset. [Register an image dataset](https://docs.microsoft.com/azure/machine-learning/how-to-create-register-datasets) and connect it to the module input port. Please make sure there is image in input dataset. Currently Designer does not support visualize image dataset.
 
    Following dataset formats are supported:

    - Compressed file in these extensions: '.zip', '.tar', '.gz', '.bz2'.
    - Folder containing images. **Highly recommend compressing such folder first then use the compressed file as dataset**.

    > [!WARNING]
    > You **cannot** use **Import Data** module to import image dataset, because the output type of **Import Data** module is DataFrame Directory, which only contains file path string.
    

    > [!NOTE]
    > - If use image dataset in supervised learning, you need to specify the label of training dataset.
    > - For image classification task, label can be generated as image 'category' in module output if this image dataset is organized in torchvision ImageFolder format. Otherwise, only images are saved without label. Following is an example of how you could organize image dataset to get label, use image category as subfolder name. 
    > - You don't need to upload the same count of images in each category folder.
    > - Images with these extensions (in lowercase) are supported: '.jpg', '.jpeg', '.png', '.ppm', '.bmp', '.pgm', '.tif', '.tiff', '.webp'. You can also have multiple types of images in one folder.    
    > - Please refer to [torchvision datasets](https://pytorch.org/docs/stable/torchvision/datasets.html#imagefolder) for more information.
    >
    > ```
    > Your_image_folder_name/Category_1/xxx.png
    > Your_image_folder_name/Category_1/xxy.jpg
    > Your_image_folder_name/Category_1/xxz.jpeg
    >
    > Your_image_folder_name/Category_2/123.png
    > Your_image_folder_name/Category_2/nsdf3.png
    > Your_image_folder_name/Category_2/asd932_.png
    > ```
    > - If use image dataset for scoring, the input file dataset of this module should contain un-classified images.
    
3.  Submit the pipeline. This module could be run on either GPU or CPU.

## Results

The output of **Convert to Image Directory** module is in Image Directory format, and can be connected to other image related modules of which the input port format is also Image Directory.

## Technical notes 

###  Expected inputs  

| Name          | Type                  | Description   |
| ------------- | --------------------- | ------------- |
| Input dataset | AnyDirectory, ZipFile | Input dataset |

###  Output  

| Name                   | Type           | Description            |
| ---------------------- | -------------- | ---------------------- |
| Output image directory | ImageDirectory | Output image directory |

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
