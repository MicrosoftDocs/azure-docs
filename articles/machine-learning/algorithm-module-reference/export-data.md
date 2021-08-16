---
title:  "Export Data: Module Reference"
titleSuffix: Azure Machine Learning
description: Use the Export Data module in Azure Machine Learning designer to save results and intermediate data outside of Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 03/19/2021
---
# Export Data module

This article describes a module in Azure Machine Learning designer.

Use this module to save results, intermediate data, and working data from your pipelines into cloud storage destinations. 

This module supports exporting your data to the following cloud data services:

- Azure Blob Container
- Azure File Share
- Azure Data Lake Storage Gen1
- Azure Data Lake Storage Gen2
- Azure SQL database

Before exporting your data, you need to first register a datastore in your Azure Machine Learning workspace. For more information, see [Access data in Azure storage services](../how-to-access-data.md).

## How to configure Export Data

1. Add the **Export Data** module to your pipeline in the designer. You can find this module in the **Input and Output** category.

1. Connect **Export Data** to the module that contains the data you want to export.

1. Select **Export Data** to open the **Properties** pane.

1. For **Datastore**, select an existing datastore from the dropdown list. You can also create a new datastore. Check how by visiting [Access data in Azure storage services](../how-to-access-data.md).

    > [!NOTE]
    > Exporting data of a certain data type to a SQL database column specified as another data type is not supported. The target table does not need to exist first.

1. The checkbox, **Regenerate output**, decides whether to execute the module to regenerate output at running time. 

    It's by default unselected, which means if the module has been executed with the same parameters previously, the system will reuse the output from last run to reduce run time. 

    If it is selected, the system will execute the module again to regenerate output.

1. Define the path in the datastore where the data is. The path is a relative path.Take `data/testoutput` as an example, which means the input data of **Export Data** will be exported to `data/testoutput` in the datastore you set in the **Output settings** of the module.

    > [!NOTE]
    > The empty paths or **URL paths** are not allowed.


1. For **File format**, select the format in which data should be stored.
 
1. Submit the pipeline.

## Limitations

Due to datstore access limitation, if your inference pipeline contains **Export Data** module, it will be auto-removed when deploy to real-time endpoint.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
