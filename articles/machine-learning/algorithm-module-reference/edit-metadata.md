---
title:  "Edit Metadata: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Edit Metadata module in Azure Machine Learning service to change metadata that is associated with columns in a dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---
# Edit Metadata module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to change metadata that is associated with columns in a dataset. The value and data type of the dataset will be changed after using the **Edit Metadata** module. 
 
Typical metadata changes might include:
  
+ Treating Boolean or numeric columns as categorical values  
  
+ Indicating which column contains the *class* label, or the values you want to categorize or predict  
  
+ Marking columns as features
  
+ Changing date/time values to a numeric value, or vice versa  
  
+ Renaming columns
  
 Use [Edit Metadata anytime you need to modify the definition of a column, typically to meet requirements for a downstream module. For example, some modules can work only with specific data types, or require flags on the columns, such as `IsFeature` or `IsCategorical`.  
  
 After performing the required operation, you can reset the metadata to its original state. 
  
## Configure Edit Metadata
  
1.  In Azure Machine Learning, add [Edit Metadata](./edit-metadata.md) module to your experiment and connect the dataset you want to update. You can find it under **Data Transformation**, in the **Manipulate** category.
  
2.  Click **Launch the column selector** and choose the column or set of columns to work with. You can choose columns individually, by name or index, or you can choose a group of columns, by type.  
  
3.  Select the **Data type** option if you need to assign a different data type to the selected columns. Changing the data type might be needed for certain operations: for example, if your source dataset has numbers handled as text, you must change them to a numeric data type before using math operations. 

    + The data types supported are `String`, `Integer`, `Double`, `Boolean`, `DateTime`. 

    + If multiple columns are selected, you must apply the metadata changes to **all** selected columns. For example, let's say you choose 2-3 numeric columns. You could change them all to a string data type, and rename them in one operation. However, you can't change one column to a string data type and another column from a float to an integer.
  
    + If you do not specify a new data type, the column metadata is unchanged. 
    
    + The column type and values will be changed after perform the [Edit Metadata](./edit-metadata.md) operation. You can recover the original data type at any time by using [Edit Metadata](./edit-metadata.md) to reset the column data type.  

    > [!NOTE]
    > If you change any type of number to the **DateTime** type, leave the **DateTime Format** field blank. Currently, it is not possible to specify the target data format.  

      
4.  Select the **Categorical** option to specify that the values in the selected columns should be treated as categories. 

    For example, you might have a column that contains the numbers 0,1 and 2, but know that the numbers actually mean "Smoker", "Non-smoker" and "Unknown". In that case, by flagging the column as categorical you can ensure that the values are not used in numeric calculations, only to group data. 
  
5.  Use the **Fields** option if you want to change the way that Azure Machine Learning uses the data in a model.

    + **Feature**: Use this option to flag a column as a feature, for use with modules that operate only on feature columns. By default, all columns are initially treated as features.  
  
    + **Label**: Use this option to mark the label (also known as the predictable attribute, or target variable). Many modules require that at least one (and only one) label column be present in the dataset. 
    
        In many cases, Azure Machine Learning can infer that a column contains a class label, but by setting this metadata you can ensure that the column is identified correctly. Setting this option does not change data values, only the way that some machine learning algorithms handle the data.
  

  
    > [!TIP]
    >  Have data that doesn't fit into these categories?  For example, your dataset might contain values such as unique identifiers that are not useful as variables. Sometimes IDs can cause problems when used in a model. 
    >   
    >  Fortunately "under the covers" Azure Machine Learning keeps all your data, so you don't have to delete such columns from the dataset. When you need to perform operations on some special set of columns, just remove all other columns temporarily by using the [Select Columns in Dataset](./select-columns-in-dataset.md) module. Later you can merge the columns back into the dataset by using the [Add Columns](./add-columns.md) module.  
  
6. Use the following options to clear previous selections and restore metadata to the default values.  
  
    + **Clear feature**: Use this option to remove the feature flag.  
  
         Because all columns are initially treated as features, for modules that perform mathematical operations, you might need to use this option to prevent numeric columns from being treated as variables.
  
    + **Clear label**: Use this option to remove the **label** metadata from the specified column.  
  
    + **Clear score**: Use this option to remove the **score** metadata from the specified column.  
  
         Currently the ability to explicitly mark a column as a score is not available in Azure Machine Learning. However, some operations result in a column being flagged as a score internally. Also, a custom R module might output score values.
  
  
7.  For **New column names**, type the new name of the selected column or columns.  
  
    + Column names can use only characters that are supported by the UTF-8 encoding. Empty strings, nulls, or names consisting entirely of spaces are not allowed.  
  
    + To rename multiple columns, type the names as a comma-separated list in order of the column indices.  
  
    + All selected columns must be renamed. You cannot omit or skip columns.  
  
  
8.  Run the experiment.  

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 