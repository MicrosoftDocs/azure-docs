---
title:  "Add Rows: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Add Rows module in Azure Machine Learning service to concatenate two datasets.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---

# Add Rows module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to concatenate two datasets. In concatenation, the rows of the second dataset are added to the end of the first dataset.  
  
Concatenation of rows is useful in scenarios such as these:  
  
+ You have generated a series of evaluation statistics, and you want to combine them into one table for easier reporting.  
  
+ You have been working with different datasets, and you want to combine the datasets to create a final dataset.  

## How to use Add Rows  

To concatenate rows from two datasets, the rows must have exactly  the same schema. This means, the same number of columns, and the same type of data in the columns.

1.  Drag the **Add Rows** module into your experiment, You can find it under **Data Transformation**,  in the **Manipulate** category.

2. Connect the datasets to the two input ports. The dataset that you want to append should be connected to the second (right) port. 
  
3.  Run the experiment. The number of rows in the output dataset should equal the sum of the rows of both input datasets.

    If you add the same dataset to both inputs of the **Add Rows** module, the dataset is duplicated. 

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 