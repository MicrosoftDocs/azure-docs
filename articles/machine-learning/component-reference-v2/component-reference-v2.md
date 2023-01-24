---
title:  "Algorithm & component reference (v2)"
description: Learn about the Azure Machine Learning designer components that you can use to create your own machine learning projects. (v2)
titleSuffix: Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: shoja
author: shouryaj
ms.reviewer: ssalgadodev
ms.date: 01/17/2023
---
# Algorithm & component reference for Azure Machine Learning designer (v2)

Azure Machine Learning designer components (Designer) allows users to create machine learning projects using a drag and drop interface. Follow this link to reach the Designer studio. Follow this link to [learn more about Designer.] (..//concept-designer)


This reference content provides the technical background on each of the custom components (v2) available in Azure Machine Learning designer.

The below image shows how you would navigate to Custom components in AzureML Studio

:::image type="content" source="media/designer-new-pipeline.png" alt-text="Diagram showing the Designer UI for selecting a custom component.":::


Each component represents a set of code that can run independently and perform a machine learning task, given the required inputs. A component might contain a particular algorithm, or perform a task that is important in machine learning, such as missing value replacement, or statistical analysis.

For help with choosing algorithms, see 
* [How to select algorithms](..//how-to-select-algorithms.md)

> [!TIP]
> In any pipeline in the designer, you can get information about a specific component. Select the **Learn more** link in the component card when hovering on the component in the component list, or in the right pane of the component.


## AutoML Algorithms

| Functionality | Description | component |
| --- |--- | --- |
| Classification | Component that executes an AutoML Classification task model training in a pipeline. |  [AutoML Classification](classification.md) |
| Regression | Predict a value | [AutoML Regression](regression.md) |
| Forecasting | Predict a value | [AutoML Forecasting](forecasting.md) |
| Computer Vision | Image data preprocessing and Image recognition related components. |  [Image Object Detection](image-object-detection.md) <br/> [Image Classification](image-classification.md) <br/> [Image Classification Multilabel](image-classification-multilabel.md) <br/> [Image Instance Segmentation](image-instance-segmentation.md) |
| Multilabel Text Classification | Component that executes an AutoML Multilabel Text Classification task model training in a pipeline. | [AutoML Multilabel Text Classification](text-classification-multilabel.md)|
| Text Classification | Component that executes an AutoML Text Classification Model | [AutoML Text Classification](text-classification.md)|
| Text Ner | Component that executes an AutoML Text NER (Named Entity Recognition) | [AutoML Text Ner](text-ner.md)|

## Next steps

* [Tutorial: Build a model in designer to predict auto prices](../tutorial-designer-automobile-price-train-score.md)
