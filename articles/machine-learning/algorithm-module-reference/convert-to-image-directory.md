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
ms.date: 05/26/2020
---
# Convert to Image Directory

This article describes how to use the Convert to Image Directory module to help convert image dataset to 'Image Directory' data type, which is standardized data format in image related tasks like image classification in Azure Machine Learning designer (preview).

## How to use Convert to Image Directory  

1.  Add the **Convert to Image Directory** module to your experiment. You can find this module in the 'Computer Vision/Image Data Transformation' category in the module list. 

2.  Connect an image dataset as input. Please make sure there is image in input dataset.
    Following dataset formats are supported:

    - Compressed file in these extensions: '.zip', '.tar', '.gz', '.bz2'.
    - Folder containing 1 compressed file in above valid extensions. 
    - Folder containing images.

    > [!NOTE]
    > Image category can be recorded in module output if this image dataset is organized in torchvision ImageFolder format, please refer to [torchvision datasets](https://pytorch.org/docs/stable/torchvision/datasets.html#imagefolder) for more information. Otherwise, only images are saved.

3.  Submit the pipeline.

## Results

The output of **Convert to Image Directory** module is in Image Directory format, and can be connected to other image related modules of which the input port format is also Image Directory.
​
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
