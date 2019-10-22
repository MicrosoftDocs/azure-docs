---
title: "Convert to Dataset: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Convert to Dataset module in Azure Machine Learning service to convert data input to the internal Dataset format used by Microsoft Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---

# Convert to Dataset

This article describes how to use the [Convert to Dataset](convert-to-dataset.md) module in Azure Machine Learning designer (preview) to convert any data for a pipeline to the internal format used by the designer.
  
Conversion is not required in most cases because Azure Machine Learning implicitly converts data to its native dataset format when any operation is performed on the data. 

However, saving data to the dataset format is recommended if you have performed some kind of normalization or cleaning on a set of data, and you want to ensure that the changes are used in further pipelines.  
  
> [!NOTE]
> [Convert to Dataset](convert-to-dataset.md) changes only the format of the data. It does not save a new copy of the data in the workspace. To save the dataset, double-click the output port, select **Save as dataset**, and type a new name.  
  
## How to use Convert to Dataset  

We recommend that you use the [Edit Metadata](edit-metadata.md) module to prepare the dataset before using [Convert to Dataset](convert-to-dataset.md).  You can add or change column names, adjust data types, and so forth.

1.  Add the [Convert to Dataset](convert-to-dataset.md) module to your pipeline. You can find this module in the **Data transformation** category in the designer. 

2. Connect it to any module that outputs a dataset.   

    As long as the data is [tabular](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset?view=azure-ml-py), you can convert it to a dataset. This includes data loaded using [Import Data](import-data.md), data created by using [Enter Data Manually](enter-data-manually.md), or datasets transformed by using [Apply Transformation](apply-transformation.md).

3.  In the **Action** dropdown list, indicate if you want to do any cleanup on the data before saving the dataset:  
  
    - **None**:  Use the data as is.  
  
    - **SetMissingValue**: Set a specific value to missing value in the dataset. The default placeholder is the question mark character (?), but you can use the  **Custom missing value** option to type a different value. For example, if you type "Taxi" for **Custom missing value**, then all "Taxi" in the dataset will be changed to missing value.
  
    - **ReplaceValues**: Use this option to specify a single exact value to be replaced with any other exact value.  You could replace missing values or custom values by setting **Replace** method:
            - **Missing**: Choose this option to replace missing values in the input dataset. For **New Value**, type the value to replace the missing values with.
            - **Custom**: Choose this option to replace custom values in the input dataset. For **Custom value**, type the value you want to find. For example, assuming your data contains the string `obs` used as a placeholder for missing values, you would type `obs`. For **New value**, type the new value to replace the original string with.
  
    Note that the **ReplaceValues** operation applies only to exact matches. For example, these strings would not be affected: `obs.`, `obsolete`.  
 
  
5.  Run the pipeline, or right-click the [Convert to Dataset](convert-to-dataset.md) module and select **Run selected**.  

## Results

+  To save the resulting dataset with a new name, right-click the output of [Convert to Dataset](convert-to-dataset.md) and select **Save as Dataset**.  
  
## Technical notes  

This section contains implementation details, tips, and answers to frequently asked questions.

-   Any module that takes a dataset as input can also take data in the CSV or TSV. Before any module code is executed, preprocessing of the inputs is performed, which is equivalent to running the [Convert to Dataset](convert-to-dataset.md) module on the input.  
  
-   You cannot convert from the SVMLight format to dataset.  
  
-   When specifying a custom replace operation, the search and replace operation applies to complete values; partial matches are not allowed. For example, you can replace a 3 with a -1 or with 33, but you cannot replace a 3 in a two-digit number such as 35.  
  
-   For custom replace operations, the replacement will silently fail if you use as a replacement any character that does not conform to the current data type of the column.  

  
## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 
