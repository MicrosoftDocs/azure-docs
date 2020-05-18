---
title:  "Select Columns in Dataset: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Select Columns in Dataset  module in Azure Machine Learning to choose a subset of columns to use in downstream operations.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/22/2019
---
# Select Columns in Dataset module

This article describes a module in Azure Machine Learning designer (preview).

Use this module to choose a subset of columns to use in downstream operations. The module does not physically remove the columns from the source dataset; instead, it creates a subset of columns, much like a database *view* or *projection*.

This module is useful when you need to limit the columns available for a downstream operation, or if you want to reduce the size of the dataset by removing unneeded columns.

The columns in the dataset are output in the same order as in the original data, even if you specify them in a different order.

## How to use

This module has no parameters. You use the column selector to choose the columns to include or exclude.

### Choose columns by name

There are multiple options in the module for choosing columns by name: 

+ Filter and search

    Click the **BY NAME** option.

    If you have connected a dataset that is already populated, a list of available columns should appear. If no columns appear, you might need to run upstream modules to view the column list.

    To filter the list, type in the search box. For example, if you type the letter `w` in the search box, the list is filtered to show the column names that contain the letter `w`.

    Select columns and click the right arrow button to move the selected columns to the list in the right-hand pane.

    + To select a continuous range of column names, press **Shift + Click**.
    + To add individual columns to the selection, press **Ctrl + Click**.

    Click the checkmark button to save and close.

+ Use names in combination with other rules

    Click the **WITH RULES** option.
    
    Choose a rule, such as showing columns of a specific data type.

    Then, click individual columns of that type by name, to add them to the selection list.

+ Type or paste a comma-separated list of column names

    If your dataset is wide, it might be easier to use indexes or generated lists of names, rather than selecting columns individually. Assuming you have prepared the list in advance:

    1. Click the **WITH RULES** option. 
    2. Select **No columns**, select  **Include**, and then click inside the text box with the red exclamation mark. 
    3. Paste in or type a comma-separated list of previously validated column names. You cannot save the module if any column has an invalid name, so be sure to check the names beforehand.
    
    You can also use this method to specify a list of columns using their index values. 

### Choose by type

If you use the **WITH RULES** option, you can apply multiple conditions on the column selections. For example, you might need to get only feature columns of a numeric data type.

The **BEGIN WITH** option determines your starting point and is important for understanding the results. 

+ If you select the **ALL COLUMNS** option, all columns are added to the list. Then, you must use the **Exclude** option to *remove* columns that meet certain conditions. 

    For example, you might start with all columns and then remove columns by name, or by type.

+ If you select the **NO COLUMNS** option, the list of columns starts out empty. You then specify conditions to *add* columns to the list. 

    If you apply multiple rules, each condition is **additive**. For example, say you start with no columns, and then add a rule to get all numeric columns. In the Automobile price dataset, that results in 16 columns. Then, you click the **+** sign to add a new condition, and select **Include all features**. The resulting dataset includes all the numeric columns, plus all the feature columns, including some string feature columns.

### Choose by column index

The column index refers to the order of the column within the original dataset.

+ Columns are numbered sequentially starting at 1.  
+ To get a range of columns, use a hyphen. 
+ Open-ended specifications such as `1-` or `-3` are not allowed.
+ Duplicate index values (or column names) are not allowed, and might result in an error.

For example, assuming your dataset has at least eight columns, you could paste in any of the following examples to return multiple non-contiguous columns: 

+ `8,1-4,6`
+ `1,3-8`
+ `1,3-6,4` 

the final example does not result in an error; however, it returns a single instance of column `4`.



### Change order of columns

The option **Allow duplicates and preserve column order in selection** starts with an empty list, and adds columns that you specify by name or by index. Unlike other options, which always return columns in their "natural order", this option outputs the columns in the order that you name or list them. 

For example, in a dataset with the columns Col1, Col2, Col3, and Col4, you could reverse the order of the columns and leave out column 2, by specifying either of the following lists:

+ `Col4, Col3, Col1`
+ `4,3,1`


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 