---
title:  "Edit Metadata: Component reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Edit Metadata component in the Azure Machine Learning to change metadata that's associated with columns in a dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 06/10/2020
---
# Edit Metadata component

This article describes a component included in Azure Machine Learning designer.

Use the Edit Metadata component to change metadata that's associated with columns in a dataset. The value and data type of the dataset will  change after use of the Edit Metadata component.

Typical metadata changes might include:
  
+ Treating Boolean or numeric columns as categorical values.
  
+ Indicating which column contains the **class** label or contains the values you want to categorize or predict.
  
+ Marking columns as features.
  
+ Changing date/time values to numeric values or vice versa.
  
+ Renaming columns.
  
 Use Edit Metadata anytime you need to modify the definition of a column, typically to meet requirements for a downstream component. For example, some components work only with specific data types or require flags on the columns, such as `IsFeature` or `IsCategorical`.  
  
 After you perform the required operation, you can reset the metadata to its original state.
  
## Configure Edit Metadata
  
1. In Azure Machine Learning designer, add the Edit Metadata component to your pipeline and connect the dataset you want to update. You can find the component in the **Data Transformation** category.
  
1. Click **Edit column** in the right panel of the component and choose the column or set of columns to work with. You can choose columns individually by name or index, or you can choose a group of columns by type.  
  
1. Select the **Data type** option if you need to assign a different data type to the selected columns. You might need to change the data type for certain operations. For example, if your source dataset has numbers handled as text, you must change them to a numeric data type before using math operations.

    + The supported data types are **String**, **Integer**, **Double**, **Boolean**, and **DateTime**.

    + If you select multiple columns, you must apply the metadata changes to *all* selected columns. For example, let's say you choose two or three numeric columns. You can change them all to a string data type and rename them in one operation. However, you can't change one column to a string data type and another column from a float to an integer.
  
    + If you don't specify a new data type, the column metadata is unchanged.

    + The column type and values will change after you perform the Edit Metadata operation. You can recover the original data type at any time by using Edit Metadata to reset the column data type.  

    > [!NOTE]
    > The **DateTime Format** follows [Python built-in datetime format](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior).  
    > If you change any type of number to the **DateTime** type, leave the **DateTime Format** field blank. Currently it isn't possible to specify the target data format.

1. Select the **Categorical** option to specify that the values in the selected columns should be treated as categories.

    For example, you might have a column that contains the numbers 0, 1, and 2, but know that the numbers actually mean "Smoker," "Non-smoker," and "Unknown." In that case, by flagging the column as categorical you ensure that the values are used only to group data and not in numeric calculations.
  
1. Use the **Fields** option if you want to change the way that Azure Machine Learning uses the data in a model.

    + **Feature**: Use this option to flag a column as a feature in components that operate only on feature columns. By default, all columns are initially treated as features.  
  
    + **Label**: Use this option to mark the label, which is also known as the predictable attribute or target variable. Many components require that exactly one label column is present in the dataset.

        In many cases, Azure Machine Learning can infer that a column contains a class label. By setting this metadata, you can ensure that the column is identified correctly. Setting this option does not change data values. It changes only the way that some machine-learning algorithms handle the data.
  
    > [!TIP]
    > Do you have data that doesn't fit into these categories? For example, your dataset might contain values such as unique identifiers that aren't useful as variables. Sometimes such IDs can cause problems when used in a model.
    >
    > Fortunately, Azure Machine Learning keeps all of your data, so that you don't have to delete such columns from the dataset. When you need to perform operations on some special set of columns, just remove all other columns temporarily by using the [Select Columns in Dataset](select-columns-in-dataset.md) component. Later you can merge the columns back into the dataset by using the [Add Columns](add-columns.md) component.  
  
1. Use the following options to clear previous selections and restore metadata to the default values.  
  
    + **Clear feature**: Use this option to remove the feature flag.  
  
         All columns are initially treated as features. For components that perform mathematical operations, you might need to use this option in order to prevent numeric columns from being treated as variables.
  
    + **Clear label**: Use this option to remove the **label** metadata from the specified column.  
  
    + **Clear score**: Use this option to remove the **score** metadata from the specified column.  
  
         You currently can't explicitly mark a column as a score in Azure Machine Learning. However, some operations result in a column being flagged as a score internally. Also, a custom R component might output score values.

1. For **New column names**, enter the new name of the selected column or columns.  
  
    + Column names can use only characters that are supported by UTF-8 encoding. Empty strings, nulls, or names that consist entirely of spaces aren't allowed.  
  
    + To rename multiple columns, enter the names as a comma-separated list in order of the column indexes.  
  
    + All selected columns must be renamed. You can't omit or skip columns.  
  
1. Submit the pipeline.  

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning.
