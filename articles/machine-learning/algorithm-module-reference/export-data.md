---
title:  "Export Data: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Export Data module in Azure Machine Learning to save results, intermediate data, and working data from your pipelines into cloud storage destinations outside Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/22/2020
---
# Export Data module

This article describes a module in Azure Machine Learning designer (preview).

Use this module to save results, intermediate data, and working data from your pipelines into cloud storage destinations. 

This module supports exporting your data to the following cloud data services:

- Azure Blob Container
- Azure File Share
- Azure Data Lake
- Azure Data Lake Gen2

Before exporting your data, you need to first register a datastore in your Azure Machine Learning workspace. For more information, see [Access data in Azure storage services](../how-to-access-data.md).

## How to configure Export Data

1. Add the **Export Data** module to your pipeline in the designer. You can find this module in the **Input and Output** category.

1. Connect **Export Data** to the module that contains the data you want to export.

1. Select **Export Data** to open the **Properties** pane.

1. For **Datastore**, select an existing datastore from the dropdown list. You can also create a new datastore. Check how by visiting [Access data in Azure storage services](../how-to-access-data.md).

1. The checkbox, **Regenerate output**, decides whether to execute the module to regenerate output at running time. 

    It's by default unselected, which means if the module has been executed with the same parameters previously, the system will reuse the output from last run to reduce run time. 

    If it is selected, the system will execute the module again to regenerate output.

1. Define the path in the datastore where the data is. The path is a relative path. The empty paths or a URL paths are not allowed.


1. For **File format**, select the format in which data should be stored.
 
1. Submit the pipeline.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
