---
title: "Convert to Image Directory"
titleSuffix: Azure Machine Learning
description: Learn how to use the Convert to Image Directory component to Convert dataset to image directory format.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: event-tier1-build-2022
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 11/12/2020
---
# Convert to Image Directory

This article describes how to use the Convert to Image Directory component to help convert image dataset to *Image Directory* data type, which is standardized data format in image-related tasks like image classification in Azure Machine Learning designer.

## How to use Convert to Image Directory  

1. Prepare your image dataset first. 

    For supervised learning, you need to specify the label of training dataset. The image dataset file should be in following structure:
    
    ```
    Your_image_folder_name/Category_1/xxx.png
    Your_image_folder_name/Category_1/xxy.jpg
    Your_image_folder_name/Category_1/xxz.jpeg
    
    Your_image_folder_name/Category_2/123.png
    Your_image_folder_name/Category_2/nsdf3.png
    Your_image_folder_name/Category_2/asd932_.png
    ```
    
    In the image dataset folder, there are multiple subfolders. Each subfolder contains images of one category respectively. The names of subfolders are considered as the labels for tasks like image classification. Refer to [torchvision datasets](https://pytorch.org/vision/stable/datasets.html#imagefolder) for more information.

    > [!WARNING]
    > Currently labeled datasets exported from Data Labeling are not supported in the designer.

    Images with these extensions (in lowercase) are supported: '.jpg', '.jpeg', '.png', '.ppm', '.bmp', '.pgm', '.tif', '.tiff', '.webp'. You can also have multiple types of images in one folder. It is not necessary to contain the same count of images in each category folder.

    You can either use the folder or compressed file with extension '.zip', '.tar', '.gz', and '.bz2'. **Compressed files are recommended for better performance.** 
    
    ![Image sample dataset](./media/module/image-sample-dataset.png)

    > [!NOTE]
    > For inference, the image dataset folder only needs to contain unclassified images.

1. [Register the image dataset as a file dataset](../v1/how-to-create-register-datasets.md) in your workspace, since the input of Convert to Image Directory component must be a **File dataset**.

1. Add the registered image dataset to the canvas. You can find your registered dataset in the **Datasets** category in the component list in the left of canvas. Currently Designer does not support visualize image dataset.

    > [!WARNING]
    > You **cannot** use **Import Data** component to import image dataset, because the output type of **Import Data** component is DataFrame Directory, which only contains file path string.

1. Add the **Convert to Image Directory** component to the canvas. You can find this component in the 'Computer Vision/Image Data Transformation' category in the component list. Connect it to the image dataset.
    
3.  Submit the pipeline. This component could be run on either GPU or CPU.

## Results

The output of **Convert to Image Directory** component is in **Image Directory** format, and can be connected to other image-related components of which the input port format is also Image Directory.

![Convert to Image Directory output](./media/module/convert-to-image-directory-output.png)

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

See the [set of components available](component-reference.md) to Azure Machine Learning.
