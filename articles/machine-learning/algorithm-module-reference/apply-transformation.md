---
title:  "Apply Transformation: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Apply Transformation module in Azure Machine Learning to modify an input dataset based on a previously computed transformation. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 06/05/2020
---

# Apply Transformation module

This article describes a module in Azure Machine Learning designer (preview).

Use this module to modify an input dataset based on a previously computed transformation.

For example, if you used z-scores to normalize your training data by using the **Normalize Data** module, you would want to use the z-score value that was computed for training during the scoring phase as well. In Azure Machine Learning, you can save the normalization method as a transform, and then using **Apply Transformation** to apply the z-score to the input data before scoring.

## How to save transformations

The designer lets you save data transformations as **datasets** so that you can use them in other pipelines.

1. Select a data transformation module that has successfully run.

1. Select the **Outputs + logs** tab.

1. Find the transformation output, and select the **Register dataset** to save it as a module under **Datasets** category in the module palette.

## How to use Apply Transformation  
  
1. Add the **Apply Transformation** module to your pipeline. You can find this module in the **Model Scoring & Evaluation** section of the module palette. 
  
1. Find the saved transformation you want to use under **Datasets** in the module palette.

1. Connect the output of the saved transformation to the left input port of the **Apply Transformation** module.

    The dataset should have exactly the same schema (number of columns, column names, data types) as the dataset for which the transformation was first designed.  
  
1. Connect the dataset output of the desired module to the right input port of the **Apply Transformation** module.
  
1. To apply a transformation to the new dataset, run the pipeline.  

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 