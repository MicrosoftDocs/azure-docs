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

2.  [Register an image dataset](https://docs.microsoft.com/azure/machine-learning/how-to-create-register-datasets) and connect it to the module input port. Please make sure there is image in input dataset. 
    Following dataset formats are supported:

    - Compressed file in these extensions: '.zip', '.tar', '.gz', '.bz2'.
    - Folder containing images. **Highly recommend compressing such folder first then use the compressed file as dataset**.

    > [!WARNING]
    > You **cannot** use **Import Data** module to import image dataset, because the output type of **Import Data** module is DataFrame Directory, which only contains file path string.
    

    > [!NOTE]
    > If use image dataset in supervised learning, label is required.
    > For image classification task, label can be generated as image 'category' in module output if this image dataset is organized in torchvision ImageFolder format. Otherwise, only images are saved without label. Here is an example of how you could organize image dataset to get label, use image category as subfolder name. Please refer to [torchvision datasets](https://pytorch.org/docs/stable/torchvision/datasets.html#imagefolder) for more information.
    >
    > ```
    > root/dog/xxx.png
    > root/dog/xxy.png
    > root/dog/xxz.png
    >
    > root/cat/123.png
    > root/cat/nsdf3.png
    > root/cat/asd932_.png
    > ```

3.  Submit the pipeline.

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
