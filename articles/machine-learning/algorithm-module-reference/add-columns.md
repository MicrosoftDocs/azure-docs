---
title:  "Add Columns: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Add Columns module in Azure Machine Learning service to concatenate two datasets.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---

# Add Columns module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to concatenate two datasets. You combine all columns from the two datasets that you specify as inputs to create a single dataset. If you need to concatenate more than two datasets, use several instances of **Add Columns**.



## How to configure Add Columns
1. Add the **Add Columns** module to your experiment.

2. Connect the two datasets that you want to concatenate. If you want to combine more than two datasets, you can chain together several combinations of **Add Columns**.

    - It is possible to combine two columns that have a different number of rows. The output dataset is padded with missing values for each row in the smaller source column.

    - You cannot choose individual columns to add. All the columns from each dataset are concatenated when you use **Add Columns**. Therefore, if you want to add only a subset of the columns, use Select Columns in Dataset to create a dataset with the columns you want.

3. Run the experiment.

### Results
After the experiment has run:

- To see the first rows of the new dataset, right-click the output of **Add Columns** and select Visualize.

The number of columns in the new dataset equals the sum of the columns of both input datasets.

If there are two columns with the same name in the input datasets, a numeric suffix is added to the name of the column. For example, if there are two instances of a column named TargetOutcome, the left column would be renamed TargetOutcome_1 and the right column would be renamed TargetOutcome_2.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 