---
title:  "Clean Missing Data: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Clean Missing Data module in Azure Machine Learning to remove, replace, or infer missing values.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---

# Clean Missing Data module

This article describes a module in Azure Machine Learning designer.

Use this module to remove, replace, or infer missing values. 

Data scientists often check data for missing values and then perform various operations to fix the data or insert new values. The goal of such cleaning operations is to prevent problems caused by missing data that can arise when training a model. 

This module supports multiple type of operations for "cleaning" missing values, including:

+ Replacing missing values with a placeholder, mean, or other value
+ Completely removing rows and columns that have missing values
+ Inferring values based on statistical methods


Using this module does not change your source dataset. Instead, it creates a new dataset in your workspace that you can use in the subsequent workflow. You can also save the new, cleaned dataset for reuse.

This module also outputs a definition of the transformation used to clean the missing values. You can re-use this transformation on other datasets that have the same schema, by using the [Apply Transformation](./apply-transformation.md) module.  

## How to use Clean Missing Data

This module lets you define a cleaning operation. You can also save the cleaning operation so that you can apply it later to new data. See the following links for a description of how to create and save a cleaning process: 
 
+ To replace missing values
  
+ To apply a cleaning transformation to new data
 
> [!IMPORTANT]
> The cleaning method that you use for handling missing values can dramatically affect your results. We recommend that you experiment with different methods. Consider both the justification for use of a particular method, and the quality of the results.

### Replace missing values  

Each time that you apply the  [Clean Missing Data](./clean-missing-data.md) module to a set of data, the same cleaning operation is applied to all columns that you select. Therefore, if you need to clean different columns using different methods, use separate instances of the module.

1.  Add the [Clean Missing Data](./clean-missing-data.md) module to your pipeline, and connect the dataset that has missing values.  
  
2.  For **Columns to be cleaned**, choose the columns that contain the missing values you want to change. You can choose multiple columns, but you must use the same replacement method in all selected columns. Therefore, typically you need to clean string columns and numeric columns separately.

    For example, to check for missing values in all numeric columns:

    1. Open the Column Selector, and select **WITH RULES**.
    2. For **BEGIN WITH**, select **NO COLUMNS**.

        You can also start with ALL COLUMNS and then exclude columns. Initially, rules are not shown if you first click **ALL COLUMNS**, but you can click **NO COLUMNS** and then click **ALL COLUMNS** again to start with all columns and then filter out (exclude) columns based on the name, data type, or columns index.

    3. For **Include**, select **Column type** from the dropdown list, and then select **Numeric**, or a more specific numeric type. 
  
    Any cleaning or replacement method that you choose must be applicable to **all** columns in the selection. If the data in any column is incompatible with the specified operation, the module returns an error and stops the pipeline.
  
3.  For **Minimum missing value ratio**, specify the minimum number of missing values required for the operation to be performed.  
  
    You use this option in combination with **Maximum missing value ratio** to define the conditions under which a cleaning operation is performed on the dataset. If there are too many or too few rows that are missing values, the operation cannot be performed. 
  
    The number you enter represents the **ratio** of missing values to all values in the column. By default, the **Minimum missing value ratio** property is set to 0. This means that missing values are cleaned even if there is only one missing value. 

    > [!WARNING]
    > This condition must be met by each and every column in order for the specified operation to apply. For example, assume you selected three columns and then set the minimum ratio of missing values to .2 (20%), but only one column actually has 20% missing values. In this case, the cleanup operation would apply only to the column with over 20% missing values. Therefore, the other columns would be unchanged.
    > 
    > If you have any doubt about whether missing values were changed, select the option, **Generate missing value indicator column**. A column is appended to the dataset to indicate whether or not each column met the specified criteria for the minimum and maximum ranges.  
  
4. For **Maximum missing value ratio**, specify the maximum number of missing values that can be present for the operation to be performed.   
  
    For example, you might want to perform missing value substitution only if 30% or fewer of the rows contain missing values, but leave the values as-is if more than 30% of rows have missing values.  
  
    You define the number as the ratio of missing values to all values in the column. By default, the **Maximum missing value ratio** is set to 1. This means that missing values are cleaned even if 100% of the values in the column are missing.  
  
   
  
5. For **Cleaning Mode**, select one of the following options for replacing or removing missing values:  
  
  
    + **Custom substitution value**: Use this option to specify a placeholder value (such as a 0 or NA) that applies to all missing values. The value that you specify as a replacement must be compatible with the data type of the column.
  
    + **Replace with mean**: Calculates the column mean and uses the mean as the replacement value for each  missing value in the column.  
  
        Applies only to columns that have Integer, Double, or Boolean data types.  
  
    + **Replace with median**: Calculates the column median value, and uses the median value as the replacement for any missing value in the column.  
  
        Applies only to columns that have Integer or Double data types. 
  
    + **Replace with mode**: Calculates the mode for the column, and uses the mode as the replacement value for every missing value in the column.  
  
        Applies to columns that have Integer, Double, Boolean, or Categorical data types. 
  
    + **Remove entire row**: Completely removes any row in the dataset that has one or more missing values. This is useful if the missing value can be considered randomly missing.  
  
    + **Remove entire column**: Completely removes any column in the dataset that has one or more missing values.  
  
    
  
6. The option **Replacement value** is available if you have selected the option, **Custom substitution value**. Type a new value to use as the replacement value for all missing values in the column.  
  
    Note that you can use this option only in columns that have the Integer, Double, Boolean, or Date data types. For date columns, the replacement value can also be entered as the number of 100-nanosecond ticks since 1/1/0001 12:00 A.M.  
  
7. **Generate missing value indicator column**: Select this option if you want to output some indication of whether the values in the column met the criteria for missing value cleaning. This option is particularly useful when you are setting up a new cleaning operation and want to make sure it works as designed.
  
8. Run the pipeline.

### Results

The module returns two outputs:  

-   **Cleaned dataset**: A dataset comprised of the selected columns, with missing values handled as specified, along with an indicator column, if you selected that option.  

    Columns not selected for cleaning are also "passed through".  
  
-  **Cleaning transformation**: A data transformation used for cleaning, that can be saved in your workspace and applied to new data later.

### Apply a saved cleaning operation to new data  

If you need to repeat cleaning operations often, we recommend that you save your recipe for data cleansing as a *transform*, to reuse with the same dataset. Saving a cleaning transformation is particularly useful if you must frequently re-import and then clean data that has the same schema.  
      
1.  Add the [Apply Transformation](./apply-transformation.md) module to your pipeline.  
  
2.  Add the dataset you want to clean, and connect the dataset to the right-hand input port.  
  
3.  Expand the **Transforms** group in the left-hand pane of the designer. Locate the saved transformation and drag it into the pipeline.  

4.  Connect the saved transformation to the left input port of [Apply Transformation](./apply-transformation.md). 

    When you apply a saved transformation, you cannot select the columns to which the transformation are applied. That is because the transformation has been already defined and applies automatically to the columns specified in the original operation.

    However, suppose you created a transformation on a subset of numeric columns. You can apply this transformation to a dataset of mixed column types without raising an error, because the missing values are changed only in the matching numeric columns.

6.  Run the pipeline.  

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 