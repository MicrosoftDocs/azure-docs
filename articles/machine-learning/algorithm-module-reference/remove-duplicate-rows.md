---
title:  "Remove Duplicate Rows: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Remove Duplicate Rows module in Azure Machine Learning to remove potential duplicates from a dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Remove Duplicate Rows module

This article describes a module in Azure Machine Learning designer.

Use this module to remove potential duplicates from a dataset.

For example, assume your data looks like the following, and represents multiple records for patients. 

| PatientID | Initials| Gender|Age|Admitted|
|----|----|----|----|----|
|1|F.M.| M| 53| Jan|
|2| F.A.M.| M| 53| Jan|
|3| F.A.M.| M| 24| Jan|
|3| F.M.| M| 24| Feb|
|4| F.M.| M| 23| Feb|
| | F.M.| M| 23| |
|5| F.A.M.| M| 53| |
|6| F.A.M.| M| NaN| |
|7| F.A.M.| M| NaN| |

Clearly, this example has multiple columns with potentially duplicate data. Whether they are actually duplicates depends on your knowledge of the data. 

+ For example, you might know that many patients have the same name. You wouldn't eliminate duplicates using any name columns, only the **ID** column. That way, only the rows with duplicate ID values are filtered out, regardless of whether the patients have the same name or not.

+ Alternatively, you might decide to allow duplicates in the ID field, and use some other combination of files to find unique records, such as first name, last name, age, and gender.  

To set the criteria for whether a row is duplicate or not, you specify a single column or a set of columns to use as **keys**. Two rows are considered duplicates only when the values in **all** key columns are equal. If any row has missing value for **keys**, they will not be considered duplicate rows. For example, if Gender and Age are set as Keys in above table,  row 6 and 7 are not duplicate rows given they have missing value in Age.

When you run the module, it creates a candidate dataset, and returns a set of rows that have no duplicates across the set of columns you specified.

> [!IMPORTANT]
> The source dataset is not altered; this module creates a new dataset that is filtered to exclude duplicates, based on the criteria you specify.

## How to use Remove Duplicate Rows

1. Add the module to your pipeline. You can find the **Remove Duplicate Rows** module under **Data Transformation**, **Manipulation**.  

2. Connect the dataset that you want to check for duplicate rows.

3. In the **Properties** pane, under **Key column selection filter expression**, click **Launch column selector**, to choose columns to use in identifying duplicates.

    In this context, **Key** does not mean a unique identifier. All columns that you select using the Column Selector are designated as **key columns**. All unselected columns are considered non-key columns. The combination of columns that you select as keys determines the uniqueness of the records. (Think of it as a SQL statement that uses multiple equalities joins.)

    Examples:

    + "I want to ensure that IDs are unique": Choose only the ID column.
    + "I want to ensure that the combination of first name, last name, and ID is unique": Select all three columns.

4. Use the **Retain first duplicate row** checkbox to indicate which row to return when duplicates are found:

    + If selected, the first row is returned and others discarded. 
    + If you uncheck this option, the last duplicate row is kept in the results, and others are discarded. 

5. Run the pipeline.

6. To review the results, right-click the module, and select **Visualize**. 

> [!TIP]
> If the results are difficult to understand, or if you want to exclude some columns from consideration, you can remove columns by using the [Select Columns in Dataset](./select-columns-in-dataset.md) module.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 