---
title:  "Add Rows: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Add Rows component in Azure Machine Learning designer to concatenate two datasets.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/22/2020
---

# Add Rows component

This article describes a component in Azure Machine Learning designer.

Use this component to concatenate two datasets. In concatenation, the rows of the second dataset are added to the end of the first dataset.  
  
Concatenation of rows is useful in scenarios such as these:  
  
+ You have generated a series of evaluation statistics, and you want to combine them into one table for easier reporting.  
  
+ You have been working with different datasets, and you want to combine the datasets to create a final dataset.  

## How to use Add Rows  

To concatenate rows from two datasets, the rows must have exactly  the same schema. This means, the same number of columns, and the same type of data in the columns.

1.  Drag the **Add Rows** component into your pipeline, You can find it under **Data Transformation**.

2. Connect the datasets to the two input ports. The dataset that you want to append should be connected to the second (right) port. 
  
3.  Submit the pipeline. The number of rows in the output dataset should equal the sum of the rows of both input datasets.

    If you add the same dataset to both inputs of the **Add Rows** component, the dataset is duplicated. 

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 