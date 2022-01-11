---
title: "Convert to Dataset: Component reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Convert to Dataset component in Azure Machine Learning designer to convert data input to the internal dataset format.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---

# Convert to Dataset

This article describes how to use the Convert to Dataset component in Azure Machine Learning designer to convert any data for a pipeline to the designer's internal format.
  
Conversion is not required in most cases. Azure Machine Learning implicitly converts data to its native dataset format when any operation is performed on the data. 

We recommend saving data to the dataset format if you've performed some kind of normalization or cleaning on a set of data, and you want to ensure that the changes are used in other pipelines.  
  
> [!NOTE]
> Convert to Dataset changes only the format of the data. It does not save a new copy of the data in the workspace. To save the dataset, double-click the output port, select **Save as dataset**, and enter a new name.  
  
## How to use Convert to Dataset  

We recommend that you use the [Edit Metadata](edit-metadata.md) component to prepare the dataset before you use Convert to Dataset. You can add or change column names, adjust data types, and make other changes as needed.

1.  Add the Convert to Dataset component to your pipeline. You can find this component in the **Data transformation** category in the designer. 

2. Connect it to any component that outputs a dataset.   

    As long as the data is [tabular](/python/api/azureml-core/azureml.data.tabulardataset), you can convert it to a dataset. This includes data loaded through [Import Data](import-data.md), data created through [Enter Data Manually](enter-data-manually.md), or datasets transformed through [Apply Transformation](apply-transformation.md).

3.  In the **Action** drop-down list, indicate if you want to do any cleanup on the data before you save the dataset:  
  
    - **None**:  Use the data as is.  
  
    - **SetMissingValue**: Set a specific value to a missing value in the dataset. The default placeholder is the question mark character (?), but you can use the  **Custom missing value** option to enter a different value. For example, if you enter **Taxi** for **Custom missing value**, then all instances of **Taxi** in the dataset will be changed to the missing value.
  
    - **ReplaceValues**: Use this option to specify a single exact value to be replaced with any other exact value. You can replace missing values or custom values by setting the **Replace** method:

      - **Missing**: Choose this option to replace missing values in the input dataset. For **New Value**, enter the value to replace the missing values with.
      - **Custom**: Choose this option to replace custom values in the input dataset. For **Custom value**, enter the value that you want to find. For example, if your data contains the string `obs` used as a placeholder for missing values, you enter `obs`. For **New value**, enter the new value to replace the original string with.
  
    Note that the **ReplaceValues** operation applies only to exact matches. For example, these strings would not be affected: `obs.`, `obsolete`.  
 
  
5.  Submit the pipeline.  

## Results

+  To save the resulting dataset with a new name, select on the icon **Register dataset** under the **Outputs** tab in the right panel of the component.  
  
## Technical notes  

-   Any component that takes a dataset as input can also take data in the CSV file or the TSV file. Before any component code is run, the inputs are preprocessed. Preprocessing is equivalent to running the Convert to Dataset component on the input.  
  
-   You can't convert from the SVMLight format to a dataset.  
  
-   When you're specifying a custom replace operation, the search-and-replace operation applies to complete values. Partial matches are not allowed. For example, you can replace a 3 with a -1 or with 33, but you can't replace a 3 in a two-digit number such as 35.  
  
-   For custom replace operations, the replacement will silently fail if you use as a replacement any character that does not conform to the current data type of the column.  

  
## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning.