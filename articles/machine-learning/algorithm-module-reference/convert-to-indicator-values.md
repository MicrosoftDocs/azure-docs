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
ms.date: 02/11/2020
---

# Convert to Indicator Values
This article describes a module of Azure Machine Learning designer.

Use the **Convert to Indicator Values** module in Azure Machine Learning designer to convert columns that contain categorical values into a series of binary indicator columns.  

This module also outputs a definition of the transformation used to convert to indicator values. You can reuse this transformation on other datasets that have the same schema, by using the [Apply Transformation](apply-transformation.md) module.

## How to configure Convert to Indicator Values

1.  Find the **Convert to Indicator Values** and drag it to your pipeline draft. You can find this module under **Data Transformation** category.
    > [!NOTE]
    > You can use the [Edit Metadata](edit-metadata.md) module before the **Convert to Indiciator Values** module to mark the target column(s) as categorical.

1. Connect the **Convert to Indicator Values** module to the dataset containing the columns you want to convert. 

1. Select **Edit column** to choose one or more categorical columns.

1. Select the **Overwrite categorical columns** option if you want to output **only** the new Boolean columns. By default, this option is off.
    

    > [!TIP]
    >  If you choose the option to overwrite, the source column is not actually deleted or modified. Instead, the new columns are generated and presented in the output dataset, and the source column remains available in the workspace. 
    > If you need to see the original data, you can use the [Add Columns](add-columns.md) module at any time to add the source column back in.

1. Submit the pipeline.

## Results

Suppose you have a column with scores that indicate whether a server has a high, medium, or low probability of failure.  

| Server ID | Failure score |
| --------- | ------------- |
| 10301     | Low           |
| 10302     | Medium        |
| 10303     | High          |

When you apply **Convert to Indicator Values**, the designer converts a single column of labels into multiple columns containing Boolean values:  

| Server ID | Failure score - Low | Failure score - Medium | Failure score - High |
| --------- | ------------------- | ---------------------- | -------------------- |
| 10301     | 1                   | 0                      | 0                    |
| 10302     | 0                   | 1                      | 0                    |
| 10303     | 0                   | 0                      | 1                    |

Here's how the conversion works:  

-   In the **Failure score** column that describes risk, there are only three possible values (High, Medium, and Low), and no missing values. So, exactly three new columns are created.  

-   The new indicator columns are named based on the column headings and values of the source column, using this pattern: *\<source column>- \<data value>*.  

-   There should be a 1 in exactly one indicator column, and 0 in all other indicator columns since each server can have only one risk rating.  

You can now use the three indicator columns as features in a machine learning model.

The module returns two outputs:

- **Results dataset**: A dataset with converted indicator values columns. Columns not selected for cleaning are also "passed through".
- **Indicator values transformation**: A data transformation used for converting to indicator values, that can be saved in your workspace and applied to new data later.

## Apply a saved indicator values operation to new data

If you need to repeat indicator values operations often, you can save your data manipulation steps as a *transform* to reuse it with the same dataset. This is useful if you must frequently reimport and then clean data that have the same schema.

1. Add the [Apply Transformation](apply-transformation.md) module to your pipeline.

1. Add the dataset you want to clean, and connect the dataset to the right-hand input port.

1. Expand the **Data Transformation** group in the left-hand pane of designer. Locate the saved transformation and drag it into the pipeline.

1. Connect the saved transformation to the left input port of [Apply Transformation](apply-transformation.md).

   When you apply a saved transformation, you cannot select which columns to transform. This is because the transformation has been defined and applies automatically to the data types specified in the original operation.

1. Submit the pipeline.
 
## Technical notes  

This section contains implementation details, tips, and answers to frequently asked questions.

### Usage tips

-   Only columns that are marked as categorical can be converted to indicator columns. If you see the following error, it is likely that one of the columns you selected is not categorical:  

     Error 0056: Column with name  \<column name> is not in an allowed category.  

     By default, most string columns are handled as string features, so you must explicitly mark them as categorical using [Edit Metadata](edit-metadata.md).  

-   There is no limit on the number of columns that you can convert to indicator columns. However, because each column of values can yield multiple indicator columns, you may want to convert and review just a few columns at a time.  

-   If the column contains missing values, a separate indicator column is created for the missing category, with this name: *\<source column>- Missing*  

-   If the column that you convert to indicator values contains numbers, they must be marked as categorical like any other feature column. After you have done so, the numbers are treated as discrete values. For example, if you have a numeric column with MPG values ranging from 25 to 30, a new indicator column would be created for each discrete value:  

    | Make       | Highway mpg -25 | Highway mpg -26 | Highway mpg -27 | Highway mpg -28 | Highway mpg -29 | Highway mpg -30 |
    | ---------- | --------------- | --------------- | --------------- | --------------- | --------------- | --------------- |
    | Contoso Cars | 0               | 0               | 0               | 0               | 0               | 1               |

- To avoid adding too many dimensions to your dataset. We recommend that you first check the number of values in the column, and bin or quantize the data appropriately.  


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
