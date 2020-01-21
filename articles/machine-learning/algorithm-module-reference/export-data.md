---
title:  "Export Data: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Export Data module in Azure Machine Learning to save results, intermediate data, and working data from your pipelines into cloud storage destinations outside Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Export Data module

This article describes a module in Azure Machine Learning designer.

Use this module to save results, intermediate data, and working data from your pipelines into cloud storage destinations outside Azure Machine Learning. 

This module supports exporting your data to the following cloud data services:

- Azure Blob Container
- Azure File Share
- Azure Data Lake
- Azure Data Lake Gen2

Before exporting your data, you need to first register a datastore in your Azure Machine Learning workspace first. For more information, see [How to Access Data](../how-to-access-data.md).

## How to configure Export Data

1. Add the **Export Data** module to your pipeline in the designer. You can find this module in the **Input and Output** category.

1. Connect **Export Data** to the module that contains the data you want to export.

1. Select **Export Data** to open the **Properties** pane.

1. For **Datastore**, select an existing datastore from the dropdown list. You can also create a new datastore. Check how by visiting [how-to-access-data](../how-to-access-data.md)

1. Define the path in the datastore to write the data to. 


1. For **File format**, select the format in which data should be stored.
 
1. Run the pipeline.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 