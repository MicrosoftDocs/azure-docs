---
title:  "Apply Transformation: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Apply Transformation module in Azure Machine Learning service to modify an input dataset based on a previously computed transformation. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---

# Apply Transformation module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to modify an input dataset based on a previously computed transformation.  
  
For example, if you used z-scores to normalize your training data by using the **Normalize Data** module, you would want to use the z-score value that was computed for training during the scoring phase as well. In Azure Machine Learning, you can save the normalization method as a transform, and then using **Apply Transformation** to apply the z-score to the input data before scoring.
  
Azure Machine Learning provides support for creating and then applying many different kinds of custom transformations. For example, you might want to save and then reuse transformations to:  
  
- Remove or replace missing values, using **Clean Missing Data**
- Normalize data, using **Normalize Data**
  

## How to use Apply Transformation  
  
1. Add the **Apply Transformation** module to your experiment. You can find this module under **Machine Learning**, in the **Score** category. 
  
2. Locate an existing transformation to use as an input.  Previously saved transformations can be found in the **Transforms** group in the left navigation pane.  
  
   
  
3. Connect the dataset that you want to transform. The dataset should have exactly the same schema (number of columns, column names, data types) as the dataset for which the transformation was first designed.  
  
4. No other parameters need to be set since all customization is done when defining the transformation.  
  
5. To apply a transformation to the new dataset, run the experiment.  

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 