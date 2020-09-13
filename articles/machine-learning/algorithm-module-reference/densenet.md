---
title: "DenseNet"
titleSuffix: Azure Machine Learning
description: Learn how to create an image classification model using the densenet algorithm.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 05/26/2020
---

# DenseNet

This article describes how to use the **DenseNet** module in Azure Machine Learning designer (preview), to create an image classification model using the Densenet algorithm.  

This classification algorithm is a supervised learning method, and requires a labeled dataset. Refer to [Convert to Image Directory](convert-to-image-directory.md) module for more instruction about how to get a labeled image directory. You can train the model by providing the model and the labeled image directory as inputs to [Train Pytorch Model](train-pytorch-model.md). The trained model can then be used to predict values for the new input examples using [Score Image Model](score-image-model.md).

### More about DenseNet

Refer to [Densely Connected Convolutional Networks](https://arxiv.org/abs/1608.06993) for more details.

## How to configure DenseNet

1.  Add the **DenseNet** module to your pipeline in the designer.  

2.  For **Model name**, specify name of a certain densenet structure and you can select from supported densenet: 'densenet121', 'densenet161', 'densenet169', 'densenet201'.

3.  For **Pretrained**, specify whether to use a model pre-trained on ImageNet. If selected, you can fine tune model based on selected pre-trained model; if deselected, you can train from scratch.

4.  For **Memory efficient**, specify whether to use checkpointing, which is much more memory-efficient but slower. See https://arxiv.org/pdf/1707.06990.pdf for more information.

5.  Connect the output of **DenseNet** module, training and validation image dataset module to the [Train Pytorch Model](train-pytorch-model.md). 

6. Submit the pipeline.


## Results

After pipeline run is completed, to use the model for scoring, connect the [Train Pytorch Model](train-pytorch-model.md) to [Score Image Model](score-image-model.md), to predict values for new input examples.

## Technical notes  

###  Module parameters  

| Name             | Range | Type    | Default     | Description                              |
| ---------------- | ----- | ------- | ----------- | ---------------------------------------- |
| Model name       | Any   | Mode    | densenet201 | Name of a certain densenet structure     |
| Pretrained       | Any   | Boolean | True        | Whether to use a model pre-trained on ImageNet |
| Memory efficient | Any   | Boolean | False       | Whether to use checkpointing, which is much more memory efficient but slower |

###  Output  

| Name            | Type                    | Description                              |
| --------------- | ----------------------- | ---------------------------------------- |
| Untrained model | UntrainedModelDirectory | An untrained densenet model that can be connected to Train Pytorch Model. |

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
