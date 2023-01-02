---
title: "DenseNet"
titleSuffix: Azure Machine Learning
description: Learn how to use the DenseNet component in Azure Machine Learning designer to create an image classification model using the DenseNet algorithm.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 09/26/2020
---

# DenseNet

This article describes how to use the **DenseNet** component in Azure Machine Learning designer, to create an image classification model using the Densenet algorithm.  

This classification algorithm is a supervised learning method, and requires a labeled image directory. 

> [!NOTE]
> This component does not support labeled dataset generated from *Data Labeling* in the studio, but only support labeled image directory generated from [Convert to Image Directory](convert-to-image-directory.md) component. 

You can train the model by providing the model and the labeled image directory as inputs to [Train Pytorch Model](train-pytorch-model.md). The trained model can then be used to predict values for the new input examples using [Score Image Model](score-image-model.md).

### More about DenseNet

For more information on DenseNet, see the research paper, [Densely Connected Convolutional Networks](https://arxiv.org/abs/1608.06993).

## How to configure DenseNet

1.  Add the **DenseNet** component to your pipeline in the designer.  

2.  For **Model name**, specify name of a certain DenseNet structure and you can select from supported DenseNet: 'densenet121', 'densenet161', 'densenet169', 'densenet201'.

3.  For **Pretrained**, specify whether to use a model pre-trained on ImageNet. If selected, you can fine-tune model based on selected pre-trained model; if deselected, you can train from scratch.

4.  For **Memory efficient**, specify whether to use checkpointing, which is much more memory-efficient but slower. For more information, see the research paper, [Memory-Efficient Implementation of DenseNets](https://arxiv.org/pdf/1707.06990.pdf).

5.  Connect the output of **DenseNet** component, training, and validation image dataset component to the [Train Pytorch Model](train-pytorch-model.md). 

6. Submit the pipeline.


## Results

After pipeline run is completed, to use the model for scoring, connect the [Train Pytorch Model](train-pytorch-model.md) to [Score Image Model](score-image-model.md), to predict values for new input examples.

## Technical notes  

###  component parameters  

| Name             | Range | Type    | Default     | Description                              |
| ---------------- | ----- | ------- | ----------- | ---------------------------------------- |
| Model name       | Any   | Mode    | densenet201 | Name of a certain DenseNet structure     |
| Pretrained       | Any   | Boolean | True        | Whether to use a model pre-trained on ImageNet |
| Memory efficient | Any   | Boolean | False       | Whether to use checkpointing, which is much more memory efficient but slower |

###  Output  

| Name            | Type                    | Description                              |
| --------------- | ----------------------- | ---------------------------------------- |
| Untrained model | UntrainedModelDirectory | An untrained DenseNet model that can be connected to Train Pytorch Model. |

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 
