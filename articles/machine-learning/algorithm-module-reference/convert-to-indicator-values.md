---
title:  "Convert to Indicator Values"
titleSuffix: Azure Machine Learning
description: Learn how to use the Convert to Indicator Values module in Azure Machine Learning to convert columns that contain categorical values into a series of binary indicator columns.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 01/22/2020
---

# Convert to Indicator Values
This article describes a module of Azure Machine Learning designer.

Use the [Convert to Indicator Values](convert-to-indicator-values.md) module in Azure Machine Learning designer to convert columns that contain categorical values into a series of binary indicator columns that can more easily be used as features in a machine learning model.  

This module also outputs a definition of the transformation used to convert to indicator values. You can re-use this transformation on other datasets that have the same schema, by using the [Apply Transformation](apply-transformation.md) module.

## How to configure Convert to Indicator Values

1.  Add the [Convert to Indicator Values](convert-to-indicator-values.md) module to your Azure Machine Learning pipeline, and connect it to the dataset containing the columns you want to convert. You can find this module under **Data Transformation** category.

2. Use the **Edit column** to choose one or more categorical columns.  

     To ensure that the columns you select are categorical, use [Edit Metadata](edit-metadata.md) before [Convert to Indicator Values](convert-to-indicator-values.md) in your pipeline, to mark the target column as categorical.  

3.  Select the **Overwrite categorical columns** option if you want to output **only** the new Boolean columns.  

     By default, this option is off, which lets you see the categorical column that is the source, together with the related indicator columns.  

    > [!TIP]
    >  If you choose the option to overwrite, the source column is not actually deleted or modified. Instead, the new columns are generated and presented in the output dataset, and the source column remains available in the workspace. 
    > If you need to see the original data, you can use the [Add Columns](add-columns.md) module at any time to add the source column back in.

4. Run the pipeline.

## Results

For example, suppose you have a column with scores that indicate whether a server has a high, medium or low probability of failure.  

| Server ID | Failure score |
| --------- | ------------- |
| 10301     | Low           |
| 10302     | Medium        |
| 10303     | High          |

When you apply [Convert to Indicator Values](convert-to-indicator-values.md), the single column of labels is converted into multiple columns containing Boolean values:  

| Server ID | Failure score - Low | Failure score - Medium | Failure score - High |
| --------- | ------------------- | ---------------------- | -------------------- |
| 10301     | 1                   | 0                      | 0                    |
| 10302     | 0                   | 1                      | 0                    |
| 10303     | 0                   | 0                      | 1                    |

Here is how the conversion works:  

-   In the **Failure score** column that describes risk, there are only three possible values (High, Medium, and Low), and no missing values. Therefore exactly three new columns are created.  

-   The new indicator columns are named based on the column headings and values of the source column, using this pattern: *\<source column>- \<data value>*.  

-   There should be a 1 in exactly one indicator column, and 0 in all other indicator columns. That is because each server can have only one risk rating.  

You can now use the three indicator columns as features and analyze their correlation with other properties that are associated with different risk level.

The module returns two outputs:

- **Results dataset**: A dataset with converted indicator values columns. Columns not selected for cleaning are also "passed through".
- **Indicator values transformation**: A data transformation used for converting to indicator values, that can be saved in your workspace and applied to new data later.

### Apply a saved indicator values operation to new data

If you need to repeat indicator values operations often, we recommend that you save your recipe for data cleansing as a *transform*, to reuse with the same dataset. Saving a indicator values transformation is particularly useful if you must frequently re-import and then clean data that has the same schema.

1. Add the [Apply Transformation](apply-transformation.md) module to your pipeline.

2. Add the dataset you want to clean, and connect the dataset to the right-hand input port.

3. Expand the **Data Transformation** group in the left-hand pane of designer. Locate the saved transformation and drag it into the pipeline.

4. Connect the saved transformation to the left input port of [Apply Transformation](apply-transformation.md).

   When you apply a saved transformation, you cannot select the columns to which the transformation are applied. That is because the transformation has been already defined and applies automatically to the data types specified in the original operation.

5. Run the pipeline.
 

## Technical notes  

This section contains implementation details, tips, and answers to frequently asked questions.

### Usage tips

-   Only columns that are marked as categorical can be converted to indicator columns. If you see this error, it is likely that one of the columns you selected is not categorical:  

     Error 0056: Column with name  \<column name> is not in an allowed category.  

     By default most string columns are handled as string features, so you must explicitly mark them as categorical using [Edit Metadata](edit-metadata.md).  

-   There is no limit on the number of columns that you can convert to indicator columns. However, because each column of values can yield multiple indicator columns, you might want to convert and review just a few columns at a time.  

-   If the column contains missing values, a separate indicator column is created for the missing category, with this name: *\<source column>- Missing*  

-   If the column that you convert to indicator values contains numbers, they must be marked as categorical like any other feature column. After you have done so, the numbers are treated as discrete values. For example, if you have a numeric column with MPG values ranging from 25 to 30, a new indicator column would be created for each discrete value:  

    | Make       | Highway mpg -25 | Highway mpg -26 | Highway mpg -27 | Highway mpg -28 | Highway mpg -29 | Highway mpg -30 |
    | ---------- | --------------- | --------------- | --------------- | --------------- | --------------- | --------------- |
    | Alfa R | 0               | 0               | 0               | 0               | 0               | 1               |

     To avoid getting a huge number of indicator columns, we recommend that you first check the number of values in the column, and bin or quantize the data appropriately.  
|

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
