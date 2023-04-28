---
title: "Split Image Directory"
titleSuffix: Azure Machine Learning
description: Learn how to use the Split Image Directory component in the designer to divide the images of an image directory into two distinct sets.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 09/26/2020
---
# Split Image Directory

This topic describes how to use the Split Image Directory component in Azure Machine Learning designer, to divide the images of an image directory into two distinct sets.

This component is particularly useful when you need to separate image data into training and testing sets. 

## How to configure Split Image Directory

1. Add the **Split Image Directory** component to your pipeline. You can find this component under 'Computer Vision/Image Data Transformation' category.

2. Connect it to component of which the output is image directory.

3. Input **Fraction of images in the first output** to specify the percentage of data to put in the left split, by default 0.9. If the fraction result is not integer, the component uses the smaller near integer.


## Technical notes

### Expected inputs

| Name                  | Type           | Description              |
| --------------------- | -------------- | ------------------------ |
| Input image directory | ImageDirectory | Image directory to split |

### Component parameters

| Name                                   | Type  | Range | Optional | Description                            | Default |
| -------------------------------------- | ----- | ----- | -------- | -------------------------------------- | ------- |
| Fraction of images in the first output | Float | 0-1   | Required | Fraction of images in the first output | 0.9     |

### Outputs

| Name                    | Type           | Description                              |
| ----------------------- | -------------- | ---------------------------------------- |
| Output image directory1 | ImageDirectory | Image directory that contains selected images |
| Output image directory2 | ImageDirectory | Image directory that contains all other images |

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 
