---
title:  "Algorithm & component reference (v2)"
description: Learn about the Azure Machine Learning designer components that you can use to create your own machine learning projects. (v2)
titleSuffix: Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: rasavage
author: rsavage2
ms.reviewer: ssalgadodev
ms.date: 01/17/2023
---
# Algorithm & component reference for Azure Machine Learning designer (v2)

[!INCLUDE [sdk v2](../includes/machine-learning-sdk-v2.md)]

> [!div class="op_single_selector" title1="Select the version of the Azure Machine Learning SDK you are using:"]
> * [v1](../component-reference/component-reference.md)
> * [v2 (current version)](./component-reference-v2.md)

Azure Machine Learning designer components (Designer) allow users to create machine learning projects using a drag and drop interface. Follow this link to reach the Designer studio. Follow this link to [learn more about Designer](../concept-designer.md).


This reference content provides background on each of the custom components (v2) available in Azure Machine Learning designer.

You can navigate to Custom components in Azure Machine Learning Studio as shown in the following image.

:::image type="content" source="media/designer-new-pipeline.png" alt-text="Diagram showing the Designer UI for selecting a custom component.":::


Each component represents a set of code that can run independently and perform a machine learning task, given the required inputs. A component might contain a particular algorithm, or perform a task that is important in machine learning, such as missing value replacement, or statistical analysis.

For help with choosing algorithms, see 
* [How to select algorithms](../v1/how-to-select-algorithms.md)

> [!TIP]
> In any pipeline in the designer, you can get information about a specific component. Select the **Learn more** link in the component card when hovering on the component in the component list, or in the right pane of the component.


## AutoML Algorithms

| Functionality | Description | component |
| --- |--- | --- |
| Classification | Component that kicks off an AutoML job to train a classification model within an Azure Machine Learning pipeline |  [AutoML Classification](classification.md) |
| Regression | Component that kicks off an AutoML job to train a regression model within an Azure Machine Learning pipeline. | [AutoML Regression](regression.md) |
| Forecasting | Component that kicks off an AutoML job to train a forecasting model within an Azure Machine Learning pipeline. | [AutoML Forecasting](forecasting.md) |
| Image Classification |Component that kicks off an AutoML job to train an image classification model within an Azure Machine Learning pipeline |[Image Classification](image-classification.md)|
| Multilabel Image Classification |Component that kicks off an AutoML job to train a multilabel image classification model within an Azure Machine Learning pipeline |[Image Classification Multilabel](image-classification-multilabel.md) | 
| Image Object Detection | Component that kicks off an AutoML job to train an image object detection model within an Azure Machine Learning pipeline | [Image Object Detection](image-object-detection.md) | 
| Image Instance Segmentation | Component that kicks off an AutoML job to train an image instance segmentation model within an Azure Machine Learning pipeline | [Image Instance Segmentation](image-instance-segmentation.md)|
| Multilabel Text Classification | Component that kicks off an AutoML job to train a multilabel NLP text classification model within an Azure Machine Learning pipeline. | [AutoML Multilabel Text Classification](text-classification-multilabel.md)|
| Text Classification | Component that kicks off an AutoML job to train an NLP text classification model within an Azure Machine Learning pipeline. | [AutoML Text Classification](text-classification.md)|
| Text Ner | Component that kicks off an AutoML job to train an NLP NE (Named Entity Recognition) model within an Azure Machine Learning pipeline. | [AutoML Text Ner](text-ner.md)|

## Next steps

* [Tutorial: Build a model in designer to predict auto prices](../v1/tutorial-designer-automobile-price-train-score.md)
