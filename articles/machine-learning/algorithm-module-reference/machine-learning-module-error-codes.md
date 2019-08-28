---
title: Troubleshoot module errors
titleSuffix: "Azure Machine Learning service"
description: Troubleshoot module exceptions in Azure Machine Learning Studio using error codes
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---
# Exceptions and error codes for Algorithm & Module Reference

Learn about the error messages and exception codes you might encounter using  modules in Azure Machine Learning Studio. 

To resolve the issue, look for the error in this article to read about common causes. There are two ways to get the full text of an error message in Studio:  
 
- Click the link, **View Output Log**, in the right pane and scroll to the bottom. The detailed error message is displayed in the last two lines of the window.  
  
- Select the module that has the error, and click the red X. Only the pertinent error text is displayed.  
  
If the error message text is not helpful, send us information about the context and any desired additions or changes. You can either submit feedback on the error topic, or visit the [Azure Machine Learning STUDIO forum](https://aka.ms/aml-forum-studio) and post a question.  


## Error 0001  
 Exception occurs if one or more specified columns of data set couldn't be found.  
  
 You will receive this error if a column selection is made for a module, but the selected column(s) do not exist in the input data set. This error may occur if you have manually typed in a column name or if the column selector has provided a suggested column that did not exist in your dataset when you ran the experiment.  
  
**Resolution:**
 Revisit the module throwing this exception and validate that the column name or names are correct and that all referenced columns do exist.  
  
|Exception Messages|  
|------------------------|  
|One or more specified columns were not found|  
|Column with name or index "{0}" not found|  
|Column with name or index "{0}" does not exist in "{1}"|  
 

## Error 0002  
 Exception occurs if one or more parameters could not be parsed or converted from specified type into required by target method type.  
  
 This error occurs in Azure Machine Learning when you specify a parameter as input and the value type is different from the type that is expected, and implicit conversion cannot be performed.  
  
**Resolution:**
 Check the module requirements and determine which value type is required (string, integer, double, etc.)  
  
|Exception Messages|  
|------------------------|  
|Failed to parse parameter|  
|Failed to parse "{0}" parameter|  
|Failed to parse (convert) "{0}" parameter to "{1}"|  
|Failed to convert "{0}" parameter from "{1}" to "{2}"|  
|Failed to convert "{0}" parameter value "{1}" from "{2}" to "{3}"|  
|Failed to convert value "{0}" in column "{1}" from "{2}" to "{3}" with usage of the format "{4}" provided|  
  

## Error 0003  
 Exception occurs if one or more of inputs are null or empty.  
  
 You will receive this error in Azure Machine Learning if any inputs or parameters to a module are null or empty.  This error might occur, for example, when you did not type in any value for a parameter. It can also happen if you chose a dataset that has missing values, or an empty dataset.  
  
**Resolution:**
 
+ Open the module that produced the exception and verify that all inputs have been specified. Ensure that all required inputs are specified. 
+ Make sure that data that is loaded from Azure storage is accessible, and that the account name or key has not changed.  
+ Check the input data for missing values, or nulls.
+ If using a query on a data source, verify that data is being returned in the format you expect. 
+ Check for typos or other changes in the specification of data.
  
|Exception Messages|  
|------------------------|  
|One or more of inputs are null or empty|  
|Input "{0}" is null or empty|  
  

## Error 0004  
 Exception occurs if parameter is less than or equal to specific value.  
  
 You will receive this error in Azure Machine Learning if the parameter in the message is below a boundary value required for the module to process the data.  
  
**Resolution:**
 Revisit the module throwing the exception and modify the parameter to be greater than the specified value.  
  
|Exception Messages|  
|------------------------|  
|Parameter should be greater than boundary value.|  
|Parameter "{0}" value should be greater than {1}.|  
|Parameter "{0}" has value "{1}" which should be greater than {2}|  
  


## Error 0005  
 Exception occurs if parameter is less than a specific value.  
  
 You will receive this error in Azure Machine Learning if the parameter in the message is below or equal to a boundary value required for the module to process the data.  
  
**Resolution:**
 Revisit the module throwing the exception and modify the parameter to be greater than or equal to the specified value.  
  
|Exception Messages|  
|------------------------|  
|Parameter should be greater than or equal to boundary value.|  
|Parameter "{0}" value should be greater than or equal to {1}.|  
|Parameter "{0}" has value "{1}" which should be greater than or equal to {2}.|  
  

## Error 0006  
 Exception occurs if parameter is greater than or equal to the specified value.  
  
 You will receive this error in Azure Machine Learning if the parameter in the message is greater than or equal to a boundary value required for the module to process the data.  
  
**Resolution:**
 Revisit the module throwing the exception and modify the parameter to be less than the specified value.  
  
|Exception Messages|  
|------------------------|  
|Parameters mismatch. One of the parameters should be less than another.|  
|Parameter "{0}" value should be less than parameter "{1}" value.|  
|Parameter "{0}" has value "{1}" which should be less than {2}.|  
  

## Error 0007  
 Exception occurs if parameter is greater than a specific value.  
  
 You will receive this error in Azure Machine Learning if, in the properties for the module, you specified a value that is greater than is allowed. For example, you might specify a data that is outside the range of supported dates, or you might indicate that five columns be used when only three columns are available. 
 
 You might also see this error if you are specifying two sets of data that need to match in some way. For example, if you are renaming columns, and specify the columns by index, the number of names you supply must match the number of column indices. Another example might be a math operation that uses two columns, where the columns must have the same number of rows. 
  
**Resolution:**
 
 + Open the module in question and review any numeric property settings.
 + Ensure that any parameter values fall within the supported range of values for that property.
 + If the module takes multiple inputs, ensure that inputs are of the same size.
<!-- + If the module has multiple properties that can be set, ensure that related properties have appropriate values. For example, when using [Group Data into Bins](group-data-into-bins.md), if you use the option to specify custom bin edges, the number of bins must match the number of values you provide as bin boundaries.-->
 + Check whether the dataset or data source has changed. Sometimes a value that worked with a previous version of the data will fail after the number of columns, the column data types, or the size of the data has changed.  
  
|Exception messages|  
|------------------------|  
|Parameters mismatch. One of the parameters should be less than or equal to another.|  
|Parameter "{0}" value should be less than or equal to parameter "{1}" value.|  
|Parameter "{0}" has value "{1}" which should be less than or equal to {2}.|  
  

## Error 0008  
 Exception occurs if parameter is not in range.  
  
 You will receive this error in Azure Machine Learning if the parameter in the message is outside the bounds required for the module to process the data.  
  
 For example, this error is displayed if you try to use [Add Rows](add-rows.md) to combine two datasets that have a different number of columns.  
  
**Resolution:**
 Revisit the module throwing the exception and modify the parameter to be within the specified range.  
  
|Exception Messages|  
|------------------------|  
|Parameter value is not in the specified range.|  
|Parameter "{0}" value is not in range.|  
|Parameter "{0}" value should be in the range of [{1}, {2}].|  
  

## Error 0009  
 Exception occurs when the Azure storage account name or container name is specified incorrectly.  
  
This error occurs in Azure Machine Learning Studio when you specify parameters for an Azure storage account, but the name or password cannot be resolved. Errors on passwords or account names can happen for many reasons:
 
 + The account is the wrong type. Some new account types are not supported for use with Machine Learning Studio. See [Import Data](import-data.md) for details.
 + You entered the incorrect account name
 + The account no longer exists
 + The password for the storage account is wrong or has changed
 + You didn't specify the container name, or the container does not exist
 + You didn't fully specify the file path (path to the blob)
   
**Resolution:**

Such problems often occur when you try to manually enter the account name, password, or container path. We recommend that you use the new wizard for the [Import Data](import-data.md) module, which helps you look up and check names.

Also check whether the account, container, or blob has been deleted. Use another Azure storage utility to verify that the account name and password have been entered correctly, and that the container exists. 

Some newer account types are not supported by Azure Machine Learning. For example, the new "hot" or "cold" storage types cannot be used for machine learning. Both classic storage accounts and storage accounts created as "General purpose" work fine.

If the complete path to a blob was specified, verify that the path is specified as **container/blobname**, and that both the container and the blob exist in the account.  
  
 The path should not contain a leading slash. For example **/container/blob** is incorrect and should be entered as **container/blob**.  

  
|Exception Messages|  
|------------------------|  
|The Azure storage account name or container name is incorrect.|  
|The Azure storage account name "{0}" or container name "{1}" is incorrect; a container name of the format container/blob was expected.|  
  

## Error 0010  
 Exception occurs if input datasets have column names that should match but do not.  
  
 You will receive this error in Azure Machine Learning if the column index in the message has different column names in the two input datasets.  
  
**Resolution:**
 Use [Edit Metadata](edit-metadata.md) or modify the original dataset to have the same column name for the specified column index.  
  
|Exception Messages|  
|------------------------|  
|Columns with corresponding index in input datasets have different names.|  
|Column names are not the same for column {0} (zero-based) of input datasets ({1} and {2} respectively).|  
  

## Error 0011  
 Exception occurs if passed column set argument does not apply to any of dataset columns.  
  
 You will receive this error in Azure Machine Learning if the specified column selection does not match any of the columns in the given dataset.  
  
 You can also get this error if you haven't selected a column and at least one column is required for the module to work.  
  
**Resolution:**
 Modify the column selection in the module so that it will apply to the columns in the dataset.  
  
 If the module requires that you select a specific column, such as a label column, verify that the right column is selected.  
  
 If inappropriate columns are selected, remove them and rerun the experiment.  
  
|Exception Messages|  
|------------------------|  
|Specified column set does not apply to any of dataset columns.|  
|Specified column set "{0}" does not apply to any of dataset columns.|  
  

## Error 0012  
 Exception occurs if instance of class could not be created with passed set of arguments.  
  
**Resolution:**
 This error is not actionable by the user and will be deprecated in a future release.  
  
|Exception Messages|  
|------------------------|  
|Untrained model, train model first.|  
|Untrained model ({0}), use trained model.|  
  

## Error 0013  
 Exception occurs if the learner passed to the module is an invalid type.  
  
 This error occurs whenever a trained model is incompatible with the connected scoring module. <!--For example, connecting the output of [Train Matchbox Recommender](train-matchbox-recommender.md) to [Score Model](score-model.md) (instead of [Score Matchbox Recommender](score-matchbox-recommender.md)) will generate this error when the experiment is run.  -->
  
**Resolution:**

Determine the type of learner that is produced by the training module, and determine the scoring module that is appropriate for the learner. 

If the model was trained using any of the specialized training modules, connect the trained model only to the corresponding specialized scoring module. 


|Model type|Training module| Scoring module|
|----|----|----|
|any classifier|[Train Model](train-model.md) |[Score Model](score-model.md)|
|any regression model|[Train Model](train-model.md) |[Score Model](score-model.md)|

<!--| clustering models| [Train Clustering Model](train-clustering-model.md) or [Sweep Clustering](sweep-clustering.md)| [Assign Data to Clusters](assign-data-to-clusters.md)|
| anomaly detection - One-Class SVM | [Train Anomaly Detection Model](train-anomaly-detection-model.md) |[Score Model](score-model.md)|
| anomaly detection - PCA |[Train Model](train-model.md) |[Score Model](score-model.md) </br> Some additional steps are required to evaluate the model. |
| anomaly detection - time series|  [Time Series Anomaly Detection](time-series-anomaly-detection.md) |Model trains from data and generates scores. The module does not create a trained learner and no additional scoring is required. |
| recommendation model| [Train Matchbox Recommender](train-matchbox-recommender.md) | [Score Matchbox Recommender](score-matchbox-recommender.md) |
| image classification | [Pretrained Cascade Image Classification](pretrained-cascade-image-classification.md) | [Score Model](score-model.md) |
|Vowpal Wabbit models| [Train Vowpal Wabbit Version 7-4 Model](train-vowpal-wabbit-version-7-4-model.md) | [Score Vowpal Wabbit Version 7-4 Model](score-vowpal-wabbit-version-7-4-model.md) |   
|Vowpal Wabbit models| [Train Vowpal Wabbit Version 7-10 Model](train-vowpal-wabbit-version-7-10-model.md) | [Score Vowpal Wabbit Version 7-10 Model](score-vowpal-wabbit-version-7-10-model.md) |
|Vowpal Wabbit models| [Train Vowpal Wabbit Version 8 Model](score-vowpal-wabbit-version-8-model.md) | [Score Vowpal Wabbit Version 8 Model](score-vowpal-wabbit-version-8-model.md) |-->
  
|Exception Messages|  
|------------------------|  
|Learner of invalid type is passed.|  
|Learner "{0}" has invalid type.|  


## Error 0014  
 Exception occurs if the count of column unique values is greater than allowed.  
  
 This error occurs when a column contains too many unique values.  For example, you might see this error if you specify that a column be handled as categorical data, but there are too many unique values in the column to allow processing to complete. You might also see this error if there is a mismatch between the number of unique values in two inputs.   
  
**Resolution:**

Open the module that generated the error, and identify the columns used as inputs. For some modules, you can right-click the dataset input and select **Visualize** to get statistics on individual columns, including the number of unique values and their distribution.

For columns that you intend to use for grouping or categorization, take steps to reduce the number of unique values in columns. You can reduce in different ways, depending on the data type of the column. 
<!--
+ For text data, you might be able to use [Preprocess Text](preprocess-text.md) to collapse similar entries. 
+ For numeric data, you can create a smaller number of bins using [Group Data into Bins](group-data-into-bins.md), remove or truncate values using [Clip Values](clip-values.md), or use machine learning methods such as [Principal Component Analysis](principal-component-analysis.md) or [Learning with Counts](data-transformation-learning-with-counts.md) to reduce the dimensionality of the data.  
-->
> [!TIP]
> Unable to find a resolution that matches your scenario? You can provide feedback on this topic that includes the name of the module that generated the error, and the data type and cardinality of the column. We will use the information to provide more targeted troubleshooting steps for common scenarios.   
  
|Exception Messages|  
|------------------------|  
|Number of column unique values is greater than allowed.|  
|Number of unique values in column: "{0}" exceeds tuple count of {1}.|  
  

## Error 0015  
 Exception occurs if database connection has failed.  
  
 You will receive this error if you enter an incorrect SQL account name, password, database server, or database name, or if a connection with the database cannot be established due to problems with the database or server.  
  
**Resolution:**
 Verify that the account name, password, database server, and database have been entered correctly, and that the specified account has the correct level of permissions. Verify that the database is currently accessible.  
  
|Exception Messages|  
|------------------------|  
|Error making database connection.|  
|Error making database connection: {0}.|  
  


## Error 0016  
 Exception occurs if input datasets passed to the module should have compatible column types but do not.  
  
 You will receive this error in Azure Machine Learning if the types of the columns passed in two or more datasets are not compatible with each other.  
  
**Resolution:**
 Use [Edit Metadata](edit-metadata.md) or modify the original input dataset<!--, or use [Convert to Dataset](convert-to-dataset.md)--> to ensure that the types of the columns are compatible.  
  
|Exception Messages|  
|------------------------|  
|Columns with corresponding index in input datasets do have incompatible types.|  
|Columns {0} and {1} are incompatible.|  
|Column element types are not compatible for column {0} (zero-based) of input datasets ({1} and {2} respectively).|  
  

## Error 0017  
 Exception occurs if a selected column uses a data type that is not supported by the current module.  
  
 For example, you might receive this error in Azure Machine Learning if your column selection includes a column with a data type that cannot be processed by the module, such as a string column for a math operation, or a score column where a categorical feature column is required.  
  
**Resolution:**
 1. Identify the column that is the problem.
 2. Review the requirements of the module.
 3. Modify the column to make it conform to requirements. You might need to use several of the following modules to make changes, depending on the column and the conversion you are attempting:
    + Use [Edit Metadata](edit-metadata.md) to change the data type of columns, or to change the column usage from feature to numeric, categorical to non-categorical, and so forth.
<!--    + Use [Convert to Dataset](convert-to-dataset.md) to ensure that all included columns use data types that are supported by Azure Machine Learning.  If you cannot convert the columns, consider removing them from the input dataset.
    + Use the [Apply SQL Transformation](apply-sql-transformation.md) or [Execute R Script](execute-r-script.md) modules to cast or convert any columns that cannot be modified using [Edit Metadata](edit-metadata.md). These modules provide more flexibility for working with datetime data types.
    + For numeric data types, you can use the [Apply Math Operation](apply-math-operation.md) module to round or truncate values, or use the [Clip Values](clip-values.md) module to remove out of range values.  -->
 4. As a last resort, you might need to modify the original input dataset.

> [!TIP]
> Unable to find a resolution that matches your scenario? You can provide feedback on this topic that includes the name of the module that generated the error, and the data type and cardinality of the column. We will use the information to provide more targeted troubleshooting steps for common scenarios. 
  
|Exception Messages|  
|------------------------|  
|Cannot process column of current type. The type is not supported by the module.|  
|Cannot process column of type {0}. The type is not supported by the module.|  
|Cannot process column "{1}" of type {0}. The type is not supported by the module.|  
|Cannot process column "{1}" of type {0}. The type is not supported by the module. Parameter name: {2}|  
  

## Error 0018  
 Exception occurs if input dataset is not valid.  
  
**Resolution:**
 This error in Azure Machine Learning can appear in many contexts, so there is not a single resolution. In general, the error indicates that the data provided as input to a module has the wrong number of columns, or that the data type does not match requirements of the module. For example:  
  
-   The module requires a label column, but no column is marked as a label, or you have not selected a label column yet.  
  
-   The module requires that data be categorical but your data is numeric.  
  
<!---   The module requires a specific data type. For example, ratings provided to [Train Matchbox Recommender](train-matchbox-recommender.md) can be either numeric or categorical, but cannot be floating point numbers.  -->
  
-   The data is in the wrong format.  
  
-   Imported data contains invalid characters, bad values, or out of range values.  
-   The column is empty or contains too many missing values.  
  
 To determine the requirements and how your data might, review the help topic for the module that will be consuming the dataset as input.  
  
 <!--We also recommend that you use [Summarize Data](summarize-data.md) or [Compute Elementary Statistics](compute-elementary-statistics.md) to profile your data, and use these modules to fix metadata and clean values: [Edit Metadata](edit-metadata.md) and [Clean Missing Data](clean-missing-data.md), [Clip Values](clip-values.md)-->.  
  
|Exception Messages|  
|------------------------|  
|Dataset is not valid.|  
|{0} contains invalid data.|  
|{0} and {1} should be consistent column wise.|  
  

## Error 0019  
 Exception occurs if column is expected to contain sorted values, but it does not.  
  
 You will receive this error in Azure Machine Learning if the specified column values are out of order.  
  
**Resolution:**
 Sort the column values by manually modifying the input dataset and rerun the module.  
  
|Exception Messages|  
|------------------------|  
|Values in column are not sorted.|  
|Values in column "{0}" are not sorted.|  
|Values in column "{0}" of dataset "{1}" are not sorted.|  
  

## Error 0020  
 Exception occurs if number of columns in some of the datasets passed to the module is too small.  
  
 You will receive this error in Azure Machine Learning if not enough columns have been selected for a module.  
  
**Resolution:**
 Revisit the module and ensure that column selector has correct number of columns selected.  
  
|Exception Messages|  
|------------------------|  
|Number of columns in input dataset is less than allowed minimum.|  
|Number of columns in input dataset is less than allowed minimum of {0} column(s).|  
|Number of columns in input dataset "{0}" is less than allowed minimum of {1} column(s).|

## Error 0021  
 Exception occurs if number of rows in some of the datasets passed to the module is too small.  
  
 This error in seen in Azure Machine Learning when there are not enough rows in the dataset to perform the specified operation. For example, you might see this error if the input dataset is empty, or if you are trying to perform an operation that requires some minimum number of rows to be valid. Such operations can include (but are not limited to) grouping or classification based on statistical methods, certain types of binning, and learning with counts.  
  
**Resolution:**
 
 + Open the module that returned the error, and check the input dataset and module properties. 
 + Verify that the input dataset is not empty and that there are enough rows of data to meet the requirements described in module help.  
 + If your data is loaded from an external source, make sure that the data source is available and that there is no error or change in the data definition that would cause the import process to get fewer rows.
 + If you are performing an operation on the data upstream of the module that might affect the type of data or the number of values, such as cleaning, splitting, or join operations, check the outputs of those operations to determine the number of rows returned.  



## Error 0022  
 Exception occurs if number of selected columns in input dataset does not equal to the expected number.  
  
 This error in Azure Machine Learning can occur when the downstream module or operation requires a specific number of columns or inputs, and you have provided too few or too many columns or inputs. For example:  
  
-   You specify a single label column or key column and accidentally selected multiple columns.  
  
-   You are renaming columns, but provided more or fewer names than there are columns.  
  
-   The number of columns in the source or destination has changed or doesn't match the number of columns used by the module.  
  
-   You have provided a comma-separated list of values for inputs, but the number of values does not match, or multiple inputs are not supported.  
  
**Resolution:**
 Revisit the module and check the column selection to ensure that the correct number of columns is selected. Verify the outputs of upstream modules, and the requirements of downstream operations.  
  
 If you used one of the column selection options that can select multiple columns (column indices, all features, all numeric, etc.), validate the exact number of columns returned by the selection.  
  
 <!--If you are trying to specify a comma-separated list of datasets as inputs to [Unpack Zipped Datasets](unpack-zipped-datasets.md), unpack only one dataset at a time. Multiple inputs are not supported.  -->
  
 Verify that the number or type of upstream columns has not changed.  
  
 If you are using a recommendation dataset to train a model, remember that the recommender expects a limited number of columns, corresponding to user-item pairs or user-item-rankings. Remove additional columns before training the model or splitting recommendation datasets. For more information, see [Split Data](split-data.md).  
  
|Exception Messages|  
|------------------------|  
|Number of selected columns in input dataset does not equal to the expected number.|  
|Number of selected columns in input dataset does not equal to {0}.|  
|Column selection pattern "{0}" provides number of selected columns in input dataset not equal to {1}.|  
|Column selection pattern "{0}" is expected to provide {1} column(s) selected in input dataset, but {2} column(s) is/are provided.|  



## Error 0023  
 Exception occurs if target column of input dataset is not valid for the current trainer module.  
  
 This error in Azure Machine Learning  occurs if the target column (as selected in the module parameters) is not of the valid data-type, contained all missing values, or was not categorical as expected.  
  
**Resolution:**
 Revisit the module input to inspect the content of the label/target column. Make sure it does not have all missing values. If the module is expecting target column to be categorical, make sure that there are more than one distinct values in the target column.  
  
|Exception Messages|  
|------------------------|  
|Input dataset has unsupported target column.|  
|Input dataset has unsupported target column "{0}".|  
|Input dataset has unsupported target column "{0}" for learner of type {1}.|  
 

## Error 0024  
Exception occurs if dataset does not contain a label column.  

 This error in Azure Machine Learning occurs when the module requires a label column and the dataset does not have a label column. For example, evaluation of a scored dataset usually requires that a label column is present to compute accuracy metrics.  
 
It can also happen that a label column is present in the dataset, but not detected correctly by Azure Machine Learning.
  
**Resolution:**

+ Open the module that generated the error, and determine if a label column is present. The name or data type of the column doesn't matter, as long as the column contains a single outcome (or dependent variable) that you are trying to predict. If you are not sure which column has the label, look for a generic name such as  *Class* or *Target*. 
+  If the dataset does not include a label column, it is possible that the label column was explicitly or accidentally removed upstream. It could also be that the dataset is not the output of an upstream scoring module.
+ To explicitly mark the column as the label column, add the [Edit Metadata](edit-metadata.md) module and connect the dataset. Select only the label column, and select **Label** from the **Fields** dropdown list. 
+ If the wrong column is chosen as the label, you can select **Clear label** from the **Fields** to fix the metadata on the column. 
  
|Exception Messages|  
|------------------------|  
|There is no label column in dataset.|  
|There is no label column in "{0}".|  
  

## Error 0025  
 Exception occurs if dataset does not contain a score column.  
  
 This error in Azure Machine Learning occurs if the input to the evaluate model does not contain valid score columns. For example, the user attempts to evaluate a dataset before it was scored with a correct trained model, or the score column was explicitly dropped upstream. This exception also occurs if the score columns on the two datasets are incompatible. For example, you might be trying to compare the accuracy of a linear regressor with that of a binary classifier.  
  
**Resolution:**
 Revisit the input to the evaluate model and examine if it contains one or more score columns. If not, the dataset was not scored or the score columns were dropped in an upstream module.  
  
|Exception Messages|  
|------------------------|  
|There is no score column in dataset.|  
|There is no score column in "{0}".|  
|There is no score column in "{0}" that is produced by a "{1}". Score the dataset using the correct type of learner.|  
  

## Error 0026  
 Exception occurs if columns with the same name are not allowed.  
  
 This error in Azure Machine Learning occurs if multiple columns have the same name. One way you may receive this error is if the dataset does not have a header row and column names are automatically assigned: Col0, Col1, etc.  
  
**Resolution:**
 If columns have same name, insert a [Edit Metadata](edit-metadata.md) module between the input dataset and the module. Use the column selector in [Edit Metadata](edit-metadata.md) to select columns to rename, typing the new names into the **New column names** textbox.  
  
|Exception Messages|  
|------------------------|  
|Equal column names are specified in arguments. Equal column names are not allowed by module.|  
|Equal column names in arguments "{0}" and "{1}" are not allowed. Specify different names.|  
  

## Error 0027  
 Exception occurs in case when two objects have to be of the same size but are not.  
  
 This is an common error in Azure Machine Learning and can be caused by many conditions.  
  
**Resolution:**
 There is no specific resolution. However, you can check for conditions such as  the following:  
  
-   If you are renaming columns, make sure that each list (the input columns and the list of new names) has the same number of items.  
  
-   If you are joining or concatenating two datasets, make sure they have the same schema.  
  
-   If you are joining two datasets that have multiple columns, make sure that the key columns have the same data type, and select the option **Allow duplicates and preserve column order in selection**.  
  
|Exception Messages|  
|------------------------|  
|The size of passed objects is inconsistent.|  
|The size of "{0}" is inconsistent with size of "{1}".|  
  

## Error 0028  
 Exception occurs in the case when column set contains duplicated column names and it is not allowed.  
  
 This error in Azure Machine Learning occurs when column names are duplicated; that is, not unique.  
  
**Resolution:**
 If any columns have same name, add an instance of [Edit Metadata](edit-metadata.md) between the input dataset and the module raising the error. Use the Column Selector in [Edit Metadata](edit-metadata.md) to select columns to rename, and type the new columns names into the **New column names** textbox. If you are renaming multiple columns, ensure that the values you type in the **New column names** are unique.  
  
|Exception Messages|  
|------------------------|  
|Column set contains duplicated column name(s).|  
|The name "{0}" is duplicated.|  
|The name "{0}" is duplicated in "{1}".|  
  

## Error 0029  
 Exception occurs in case when invalid URI is passed.  
  
 This error in Azure Machine Learning occurs in case when invalid URI is passed.  You will receive this error if any of the following conditions are true:, or.  
  
-   The Public or SAS URI provided for Azure Blob Storage for read or write contains an error.  
  
-   The time window for the SAS has expired.  
  
-   The Web URL via HTTP source represents a file or a loopback URI.  
  
-   The Web URL via HTTP contains an incorrectly formatted URL.  
  
-   The URL cannot be resolved by the remote source.  
  
**Resolution:**
 Revisit the module and verify the format of the URI. If the data source is a Web URL via HTTP, verify that the intended source is not a file or a loopback URI (localhost).  
  
|Exception Messages|  
|------------------------|  
|Invalid Uri is passed.|  
  

## Error 0030  
 Exception occurs in the case when it is not possible to download a file.  
  
 This exception in Azure Machine Learning occurs when it is not possible to download a file. You will receive this exception when an attempted read from an HTTP source has failed after three (3) retry attempts.  
  
**Resolution:**
 Verify that the URI to the HTTP source is correct and that the site is currently accessible via the Internet.  
  
|Exception Messages|  
|------------------------|  
|Unable to download a file.|  
|Error while downloading the file: {0}.|  
  

## Error 0031  
 Exception occurs if number of columns in column set is less than needed.  
  
 This error in Azure Machine Learning occurs if the number of columns selected is less than needed.  You will receive this error if the minimum required number of columns are not selected.  
  
**Resolution:**
 Add additional columns to the column selection by using the **Column Selector**.  
  
|Exception Messages|  
|------------------------|  
|Number of columns in column set is less than required.|  
|{0} column(s) should be specified. The actual number of specified columns is {1}.|  

## Error 0032  
 Exception occurs if argument is not a number.  
  
 You will receive this error  in Azure Machine Learning if the argument is a double or NaN.  
  
**Resolution:**
 Modify the specified argument to use a valid value.  
  
|Exception Messages|  
|------------------------|  
|Argument is not a number.|  
|"{0}" is not a number.|  
  

## Error 0033  
 Exception occurs if argument is Infinity.  
  
 This error in Azure Machine Learning occurs if the argument is infinite. You will receive this error if the argument is either `double.NegativeInfinity` or `double.PositiveInfinity`.  
  
**Resolution:**
 Modify the specified argument to be a valid value.  
  
|Exception Messages|  
|------------------------|  
|Argument is must be finite.|  
|"{0}" is not finite.|  
  

## Error 0034  
 Exception occurs if more than one rating exists for a given user-item pair.  
  
 This error in Azure Machine Learning occurs in recommendation if a user-item pair has more than one rating value.  
  
**Resolution:**
 Ensure that the user-item pair possesses one rating value only.  
  
|Exception Messages|  
|------------------------|  
|More than one rating exists for the value(s) in dataset.|  
|More than one rating for user {0} and item {1} in rating prediction data table.|  
  

## Error 0035  
 Exception occurs if no features were provided for a given user or item.  
  
 This error in Azure Machine Learning occurs you are trying to use a recommendation model for scoring but a feature vector cannot be found.  
  
**Resolution:**

The Matchbox recommender has certain requirements that must be met when using either item features or user features.  This error indicates that a feature vector is missing for a user or item that you provided as input.  You must ensure that a vector of features is available in the data for each user or item.  
  
 For example, if you trained a recommendation model using features such as the user's age, location, or income, but now want to create scores for new users who were not seen during training, you must provide some equivalent set of features (namely, age, location, and income values) for the new users in order to make appropriate predictions for them. 
 
 If you do not have any features for these users, consider feature engineering to generate appropriate features.  For example, if you do not have individual user age or income values, you might generate approximate values to use for a group of users. 
 
<!--When you are scoring from a recommendation mode, you can use item or user features only if you previously used item or user features during training. For more information, see [Score Matchbox Recommender](score-matchbox-recommender.md).
 
For general information about how the Matchbox recommendation algorithm works, and how to prepare a dataset of item features or user features, see [Train Matchbox Recommender](train-matchbox-recommender.md).  -->
  
 > [!TIP]
 > Resolution not applicable to your case? You are welcome to send feedback on this article and provide information about the scenario, including the module and the number of rows in the column. We will use this information to provide more detailed troubleshooting steps in the future.
   
|Exception Messages|  
|------------------------|  
|No features were provided for a required user or item.|  
|Features for {0} required but not provided.|  
  

## Error 0036  
 Exception occurs if multiple feature vectors were provided for a given user or item.  
  
 This error in Azure Machine Learning occurs if a feature vector is defined more than once.  
  
**Resolution:**
 Ensure that the feature vector is not defined more than once.  
  
|Exception Messages|  
|------------------------|  
|Duplicate feature definition for a user or item.|  
|Duplicate feature definition for {0}.|  
  

## Error 0037  
 Exception occurs if multiple label columns are specified and just one is allowed.  
  
 This error in Azure Machine Learning occurs if more than one column is selected to be the new label column. Most supervised learning algorithms require a single column to be marked as the target or label.  
  
**Resolution:**
 Make sure to select a single column as the new label column.  
  
|Exception Messages|  
|------------------------|  
|Multiple label columns are specified.|  
  

## Error 0038  
 Exception occurs if number of elements expected should be an exact value, but is not.  
  
 This error in Azure Machine Learning occurs if the number of elements expected should be an exact value, but is not.  You will receive this error if the number of elements is not equal to the valid expected value.  
  
**Resolution:**
 Modify the input to have the correct number of elements.  
  
|Exception Messages|  
|------------------------|  
|Number of elements is not valid.|  
|Number of elements in "{0}" is not valid.|  
|Number of elements in "{0}" is not equal to valid number of {1} element(s).|  
  

## Error 0039  
 Exception occurs if an operation has failed.  
  
 This error in Azure Machine Learning occurs when an internal operation cannot be completed.  
  
**Resolution:**
 This error is caused by many conditions and there is no specific remedy.  
 The following table contains generic messages for this error, which are followed by a specific description of the condition. 
 
 If no details are available, [send feedback](https://social.msdn.microsoft.com/forums/azure/home?forum=MachineLearning) and provide information about the modules that generated the error and related conditions.
  
|Exception Messages|  
|------------------------|  
|Operation failed.|  
|Error while completing operation: {0}.|  
  

## Error 0040  
 Exception occurs when calling a deprecated module.  
  
 This error in Azure Machine Learning is produced when calling a deprecated module.  
  
**Resolution:**
 Replace the deprecated module with a supported one. See the module output log for the information about which module to use instead.  
  
|Exception Messages|  
|------------------------|  
|Accessing deprecated module.|  
|Module "{0}" is deprecated. Use module "{1}" instead.|  
 

## Error 0041  
 Exception occurs when calling a deprecated module.  
  
 This error in Azure Machine Learning is produced when calling a deprecated module.  
  
**Resolution:**
 Replace the deprecated module with a set of supported ones. This information should be visible in the module output log.  
  
|Exception Messages|  
|------------------------|  
|Accessing deprecated module.|  
|Module "{0}" is deprecated. Use the modules "{1}" for requested functionality.|  
 

## Error 0042  
 Exception occurs when it is not possible to convert column to another type.  
  
 This error in Azure Machine Learning occurs when it is not possible to convert column to the specified type.  You will receive this error if a module requires a particular data type, such as datetime, text, a floating point number, or integer, but it is not possible to convert an existing column to the required type.  
 
For example, you might select a column and try to convert it to a numeric data type for use in a math operation, and get this error if the column contained invalid data. 

Another reason you might get this error if you try to use a column containing floating point numbers or many unique values as a categorical column. 
  
**Resolution:**

+ Open the help page for the module that generated the error, and verify the data type requirements.
+ Review the data types of the columns in the input dataset.
+ Inspect data originating in so-called schema-less data sources.
+ Check the dataset for missing values or special characters that might block conversion to the desired data type. 
    + Numeric data types should be consistent: for example, check for floating point numbers in a column of integers.
    + Look for text strings or NA values in a number column. 
    + Boolean values can be converted to an appropriate representation depending on the required data type.
    + Examine text columns for non-unicode characters, tab characters, or control characters
    + Datetime data should be consistent to avoid modeling errors, but cleanup can be complex owing to the many formats. Consider using <!--the [Execute R Script](execute-r-script.md) or -->[Execute Python Script](execute-python-script.md) modules to perform cleanup.  
+ If necessary, modify the values in the input dataset so that the column can be converted successfully. Modification might include binning, truncation or rounding operations, elimination of outliers, or imputation of missing values. See the following articles for some common data transformation scenarios in machine learning:
    + [Clean Missing Data](clean-missing-data.md)
    + [Normalize Data](normalize-data.md)
<!--+ [Clip Values](clip-values.md) 
    + [Group Data Into Bins](group-data-into-bins.md)
  -->
 
> [!TIP]
> Resolution unclear, or not applicable to your case? You are welcome to send feedback on this article and provide information about the scenario, including the module and the data type of the column. We will use this information to provide more detailed troubleshooting steps in the future.  
  
|Exception Messages|  
|------------------------|  
|Not allowed conversion.|  
|Could not convert column of type {0} to column of type {1}.|  
|Could not convert column "{2}" of type {0} to column of type {1}.|  
|Could not convert column "{2}" of type {0} to column "{3}" of type {1}.|  
  

## Error 0043  
 Exception occurs when element type does not explicitly implement Equals.  
  
 This error in Azure Machine Learning is unused and will be deprecated.  
  
**Resolution:**
 None.  
  
|Exception Messages|  
|------------------------|  
|No accessible explicit method Equals found.|  
|Cannot compare values for column \\"{0}\\" of type {1}. No accessible explicit method Equals found.|  


## Error 0044  
 Exception occurs when it is not possible to derive element type of column from the existing values.  
  
 This error in Azure Machine Learning occurs when it is not possible to infer the type of a column or columns in a dataset. This typically happens when concatenating two or more datasets with different element types. If Azure Machine Learning is unable to determine a common type that is able to represent all the values in a column or columns without loss of information, it will generate this error.  
  
**Resolution:**
 Ensure that all values in a given column in both datasets being combined are either of the same type (numeric, Boolean, categorical, string, date, etc.) or can be coerced to the same type.  
  
|Exception Messages|  
|------------------------|  
|Cannot derive element type of the column.|  
|Cannot derive element type for column "{0}" -- all the elements are null references.|  
|Cannot derive element type for column "{0}" of dataset "{1}" -- all the elements are null references.|  
  

## Error 0045  
 Exception occurs when it is not possible to create a column because of mixed element types in the source.  
  
 This error in Azure Machine Learning is produced when the element types of two datasets being combined are different.  
  
**Resolution:**
 Ensure that all values in a given column in both datasets being combined are of the same type (numeric, Boolean, categorical, string, date, etc.).  
  
|Exception Messages|  
|------------------------|  
|Cannot create column with mixed element types.|  
|Cannot create column with ID "{0}" of mixed element types:\n\tType of data[{1}, {0}] is {2}\n\tType of data[{3}, {0}] is {4}.|  
  

## Error 0046  
 Exception occurs when it is not possible to create directory on specified path.  
  
 This error in Azure Machine Learning occurs when it is not possible to create a directory on the specified path. You will receive this error if any part of the path to the output directory for a Hive Query is incorrect or inaccessible.  
  
**Resolution:**
 Revisit the module and verify that the directory path is correctly formatted and that it is accessible with the current credentials.  
  
|Exception Messages|  
|------------------------|  
|Specify a valid output directory.|  
|Directory: {0} cannot be created. Specify valid path.|  
  

## Error 0047  
 Exception occurs if number of feature columns in some of the datasets passed to the module is too small.  
  
 This error in Azure Machine Learning occurs if the input dataset to training does not contain the minimum number of columns required by the algorithm. Typically either the dataset is empty or only contains training columns.  
  
**Resolution:**
 Revisit the input dataset to make sure there one or more additional columns apart from the label column.  
  
|Exception Messages|  
|------------------------|  
|Number of feature columns in input dataset is less than allowed minimum.|  
|Number of feature columns in input dataset is less than allowed minimum of {0} column(s).|  
|Number of feature columns in input dataset "{0}" is less than allowed minimum of {1} column(s).|  
  

## Error 0048  
 Exception occurs in the case when it is not possible to open a file.  
  
 This error in Azure Machine Learning occurs when it is not possible to open a file for read or write. You might receive this error for these reasons:  
  
-   The container or the file (blob) does not exist  
  
-   The access level of the file or container does not allow you to access the file  
  
-   The file is too large to read or the wrong format  
  
**Resolution:**
 Revisit the module and the file you are trying to read.  
  
 Verify that the names of the container and file are correct.  
  
 Use the Azure classic portal or an Azure storage tool to verify that you have permission to access the file.  
  
  <!--If you are trying to read an image file, make sure that it meets the requirements for image files in terms of size, number of pixels, and so forth. For more information, see [Import Images](import-images.md).  -->
  
|Exception Messages|  
|------------------------|  
|Unable to open a file.|  
|Error while opening the file: {0}.|  


## Error 0049  
 Exception occurs in the case when it is not possible to parse a file.  
  
 This error in Azure Machine Learning occurs when it is not possible to parse a file. You will receive this error if the file format selected in the [Import Data](import-data.md) module does not match the actual format of the file, or if the file contains an unrecognizable character.  
  
**Resolution:**
 Revisit the module and correct the file format selection if it does not match the format of the file. If possible, inspect the file to confirm that it does not contain any illegal characters.  
  
|Exception Messages|  
|------------------------|  
|Unable to parse a file.|  
|Error while parsing the file: {0}.|  
  

## Error 0050  
 Exception occurs in the case when input and output files are the same.  
  
**Resolution:**
 This error in Azure Machine Learning is unused and will be deprecated.  
  
|Exception Messages|  
|------------------------|  
|Specified files for input and output cannot be the same.|


## Error 0051  
 Exception occurs in the case when several output files are the same.  
  
**Resolution:**
 This error in Azure Machine Learning is unused and will be deprecated.  
  
|Exception Messages|  
|------------------------|  
|Specified files for outputs cannot be the same.|


## Error 0052  
 Exception occurs if Azure storage account key is specified incorrectly.  
  
 This error in Azure Machine Learning occurs if the key used to access the Azure storage account is incorrect. For example, you might see this error if the Azure storage key was truncated when copied and pasted, or if the wrong key was used.  
  
 For more information about how to get the key for an Azure storage account, see [View, copy, and regenerate storage access keys](https://azure.microsoft.com/documentation/articles/storage-create-storage-account-classic-portal/).  
  
**Resolution:**
 Revisit the module and verify that the Azure storage key is correct for the account; copy the key again from the Azure classic portal if necessary.  
  
|Exception Messages|  
|------------------------|  
|The Azure storage account key is incorrect.|  
  

## Error 0053  
 Exception occurs in the case when there are no user features or items for matchbox recommendations.  
  
 This error in Azure Machine Learning is produced when a feature vector cannot be found.  
  
**Resolution:**
 Ensure that a feature vector is present in the input dataset.  
  
|Exception Messages|  
|------------------------|  
|User features or/and items are required but not provided.|  

## Error 0054  
 Exception occurs if there is too few distinct values in the column to complete operation.  
  
**Resolution:**
 This error in Azure Machine Learning is unused and will be deprecated.  
  
|Exception Messages|  
|------------------------|  
|Data has too few distinct values in the specified column to complete operation.|  
|Data has too few distinct values in the specified column to complete operation. The required minimum is {0} elements.|  
|Data has too few distinct values in the column "{1}" to complete operation. The required minimum is {0} elements.|  
  

## Error 0055  
 Exception occurs when calling a deprecated module.  This error in Azure Machine Learning appears if you try to call a module that has been deprecated.
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Accessing deprecated module.|  
|Module "{0}" is deprecated.|  

## Error 0056  
 Exception occurs if the columns you selected for an operation violates requirements.  
  
 This error in Azure Machine Learning occurs when you are choosing columns for an operation that requires the column be of a particular data type. 
 
 This error can also happen if the column is the correct data type, but the module you are using requires that the column also be marked as a feature, label, or categorical column.  
  
  <!--For example, the [Convert to Indicator Values](convert-to-indicator-values.md) module requires that columns be categorical, and will raise this error if you select a feature column or label column.  -->
  
**Resolution:**
  
1.  Review the data type of the columns that are currently selected. 

2. Ascertain whether the selected columns are categorical, label, or feature columns.  
  
3.  Review the help topic for the module in which you made the column selection, to determine if there are specific requirements for data type or column usage.  
  
3.  Use [Edit Metadata](edit-metadata.md) to change the column type for the duration of this operation. Be sure to change the column type back to its original value, using another instance of [Edit Metadata](edit-metadata.md), if you need it for downstream operations.  
  
|Exception Messages|  
|------------------------|  
|One or more selected columns were not in an allowed category.|  
|Column with name "{0}" is not in an allowed category.|  
  

## Error 0057  
 Exception occurs when attempting to create a file or blob that already exists.  
  
 This exception occurs when you are using the [Export Data](export-data.md) module or other module to save  results of an experiment in Azure Machine Learning to Azure blob storage, but you attempt to create a file or blob that already exists.   
  
**Resolution:**
 
 You will receive this error only if you previously set the property **Azure blob storage write mode** to **Error**. By design, this module raises an error if you attempt to write a dataset to a blob that already exists.
 
 - Open the module properties and change the property **Azure blob storage write mode** to **Overwrite**.
 - Alternatively, you can type the name of a different destination blob or file and be sure to specify a blob that does not already exist.  
  
|Exception Messages|  
|------------------------|  
|File or Blob already exists.|  
|File or Blob "{0}" already exists.|  
  

## Error 0058  
 This error in Azure Machine Learning occurs if the dataset does not contain the expected label column.  
  
 This exception can also occur when the label column provided does not match the data or datatype expected by the learner, or has the wrong values. For example, this exception is produced when using a real-valued label column when training a binary classifier.  
  
**Resolution:**
 The resolution depends on the learner or trainer that you are using, and the data types of  the columns in your dataset. First, verify the requirements of the machine learning algorithm or training module.  
  
 Revisit the input dataset. Verify that the column you expect to be treated as the label has the right data type for the model you are creating.  
  
 Check inputs for missing values and eliminate or replace them if necessary.  
  
 If necessary, add the [Edit Metadata](edit-metadata.md) module and ensure that the label column is marked as a label.  
  
|Exception Messages|  
|------------------------|  
|The label column is not as expected|  
|The label column is not as expected in "{0}".|  
|The label column "{0}" is not expected in "{1}".|  
  

## Error 0059  
 Exception occurs if a column index specified in a column picker cannot be parsed.  
  
 This error in Azure Machine Learning occurs if a column index specified when using the Column Selector cannot be parsed.  You will receive this error when the column index is in an invalid format that cannot be parsed.  
  
**Resolution:**
 Modify the column index to use a valid index value.  
  
|Exception Messages|  
|------------------------|  
|One or more specified column indexes or index ranges could not be parsed.|  
|Column index or range "{0}" could not be parsed.|  
  

## Error 0060  
 Exception occurs when an out of range column range is specified in a column picker.  
  
 This error in Azure Machine Learning occurs when an out-of-range column range is specified in the Column Selector. You will receive this error if the column range in the column picker does not correspond to the columns in the dataset.  
  
**Resolution:**
 Modify the column range in the column picker to correspond to the columns in the dataset.  
  
|Exception Messages|  
|------------------------|  
|Invalid or out of range column index range specified.|  
|Column range "{0}" is invalid or out of range.|  
  

## Error 0061  
 Exception occurs when attempting to add a row to a DataTable that has a different number of columns than the table.  
  
 This error in Azure Machine Learning occurs when you attempt to add a row to a dataset that has a different number of columns than the dataset.  You will receive this error if the row that is being added to the dataset has a different number of columns from the input dataset.  The row cannot be appended to the dataset if the number of columns is different.  
  
**Resolution:**
 Modify the input dataset to have the same number of columns as the row added, or modify the row added to have the same number of columns as the dataset.  
  
|Exception Messages|  
|------------------------|  
|All tables must have the same number of columns.|  
  

## Error 0062  
 Exception occurs when attempting to compare two models with different learner types.  
  
 This error in Azure Machine Learning is produced when evaluation metrics for two different scored datasets cannot be compared. In this case, it is not possible to compare the effectiveness of the models used to produce the two scored datasets.  
  
**Resolution:**
 Verify that the scored results are produced by the same kind of machine learning model (binary classification, regression, multi-class classification, recommendation, clustering, anomaly detection, etc.) All models that you compare must have the same learner type.  
  
|Exception Messages|  
|------------------------|  
|All models must have the same learner type.|  
  

 <!--## Error 0063  
 This exception is raised when R script evaluation fails with an error.  
  
 This error occurs when you have provided an R script in one of the [R language modules](r-language-modules.md) in Azure Machine Learning, and the R code contains internal syntax errors. The exception can also occur if you provide the wrong inputs to the R script. 
 
 The error can also occur if the script is too large to execute in the workspace. The maximum script size for the **Execute R Script** module is 1,000 lines or 32 KB of work space, whichever is lesser.
  
**Resolution:**

1. In Azure Machine Learning Studio, right-click the module that has the error, and select **View Log**.
2. Examine the standard error log of the module, which contains the stack trace.
    + Lines beginning with [ModuleOutput] indicate output from R.
    + Messages from R marked as **warnings** typically do not cause the experiment to fail.
3. Resolve script issues.  
    + Check for R syntax errors. Check for variables that are defined but never populated.
    + Review the input data and the script to determine if either the data or variables in the script use characters not supported by Azure Machine Learning.
    + Check whether all package dependencies are installed.
    + Check whether your code loads required libraries that are not loaded by default.
    + Check whether the required packages are the correct version.
    + Make sure that any dataset that you want to output is converted to a data frame.  
4.  Resubmit the experiment.

 <!--
> [!NOTE]
> These topics contains examples of R code that you can use, as well as links to experiments in the [Cortana Intelligence Gallery](https://gallery.cortanaintelligence.com) that use R script.
> + [Execute R Script](execute-r-script.md)
> + [Create R Model](create-r-model.md)
-->  
|Exception Messages|  
|------------------------|  
|Error during evaluation of R script.|  
|The following error occurred during evaluation of R script: ---------- Start of error message from R ---------- {0} ----------- End of error message from R -----------|  
|During the evaluation of R script "{1}" the following error occurred: ---------- Start of error message from R ---------- {0} ----------- End of error message from R -----------|  
  


## Error 0064  
 Exception occurs if Azure storage account name or storage key is specified incorrectly.  
  
 This error in Azure Machine Learning occurs if the Azure storage account name or storage key is specified incorrectly. You will receive this error if you enter an incorrect account name or password for the storage account. This may occur if you manually enter the account name or password. It may also occur if the account has been deleted.  
  
**Resolution:**
 Verify that the account name and password have been entered correctly, and that the account exists.  
  
|Exception Messages|  
|------------------------|  
|The Azure storage account name or storage key is incorrect.|  
|The Azure storage account name "{0}" or storage key for the account name is incorrect.|  
  

## Error 0065  
 Exception occurs if Azure blob name is specified incorrectly.  
  
 This error in Azure Machine Learning occurs if the Azure blob name is specified incorrectly.  You will receive the error if:  
  
-   The blob cannot be found in the specified container.  
  
 <!---   The fully qualified name of the blob specified for output in one of the [Learning with Counts](data-transformation-learning-with-counts.md) modules is greater than 512 characters.  -->
  
-   Only the container was specified as the source in a [Import Data](import-data.md) request when the format was Excel or CSV with encoding; concatenation of the contents of all blobs within a container is not allowed with these formats.  
  
-   A SAS URI does not contain the name of a valid blob.  
  
**Resolution:**
 Revisit the module throwing the exception. Verify that the specified blob does exist in the container in the storage account and that permissions allow you to see the blob. Verify that the input is of the form **containername/filename** if you have Excel or CSV with encoding formats. Verify that a SAS URI contains the name of a valid blob.  
  
|Exception Messages|  
|------------------------|  
|The Azure storage blob is incorrect.|  
|The Azure storage blob name "{0}" is incorrect|  
  

## Error 0066  
 Exception occurs if a resource could not be uploaded to an Azure Blob.  
  
 This error in Azure Machine Learning occurs if a resource could not be uploaded to an Azure Blob.  <!--You will receive this message if [Train Vowpal Wabbit 7-4 Model](train-vowpal-wabbit-version-7-4-model.md) encounters an error attempting to save either the model or the hash created when training the model.--> Both are saved to the same Azure storage account as the account containing the input file.  
  
**Resolution:**
 Revisit the module. Verify that the Azure account name, storage key, and container are correct and that the account has permission to write to the container.  
  
|Exception Messages|  
|------------------------|  
|The resource could not be uploaded to Azure storage.|  
|The file "{0}" could not be uploaded to Azure storage as {1}.|  
  

## Error 0067  
 Exception occurs if a dataset has a different number of columns than expected.  
  
 This error in Azure Machine Learning occurs if a dataset has a different number of columns than expected.  You will receive this error when the number of columns in the dataset are different from the number of columns that the module expects during execution.  
  
**Resolution:**
 Modify the input dataset or the parameters.  
  
|Exception Messages|  
|------------------------|  
|Unexpected number of columns in the datatable.|  
|Expected "{0}" columns but found "{1}" columns instead.|  
  

## Error 0068  
 Exception occurs if the specified Hive script is not correct.  
  
 This error in Azure Machine Learning occurs if there are syntax errors in a Hive QL script, or if the Hive interpreter encounters an error while executing the query or script.  
  
**Resolution:**

The error message from Hive is normally reported back in the Error Log so that you can take action based on the specific error. 

+ Open the module and inspect the query for mistakes.  
+ Verify that the query works correctly outside of Azure Machine Learning by logging in to the Hive console of your Hadoop cluster and running the query.  
+ Try placing comments in your Hive script in a separate line as opposed to mixing executable statements and comments in a single line.  

### Resources

See the following articles for help with Hive queries for machine learning:

+ [Create Hive tables and load data from Azure Blob Storage](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-move-hive-tables)
+ [Explore data in tables with Hive queries](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-explore-data-hive-tables)
+ [Create features for data in an Hadoop cluster using Hive queries](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-create-features-hive)
+ [Hive for SQL Users Cheat Sheet (PDF)](http://hortonworks.com/wp-content/uploads/2013/05/hql_cheat_sheet.pdf)

  
|Exception Messages|  
|------------------------|  
|Hive script is incorrect.|  
|Hive script {0} is not correct.|  
  

## Error 0069  
 Exception occurs if the specified SQL script is not correct.  
  
 This error in Azure Machine Learning occurs if the specified SQL script has syntax problems, or if the columns or table specified in the script is not valid. 
 
 You will receive this error if the SQL engine encounters any error while executing the query or script. The SQL error message is normally reported back in the Error Log so that you can take action based on the specific error.  
  
**Resolution:**
 Revisit the module and inspect the SQL query for mistakes.  
  
 Verify that the query works correctly outside of Azure ML by logging in to the database server directly and running the query.  
  
 If there is a SQL generated message reported by the module exception, take action based on the reported error. For example, the error messages sometimes include specific guidance on the likely error:
+ *No such column or missing database*, indicating that you might have typed a column name wrong. If you are sure the column name is correct, try using brackets or quotation marks to enclose the column identifier.
+ *SQL logic error near \<SQL keyword\>*, indicating that you might have a syntax error before the specified keyword

  
|Exception Messages|  
|------------------------|  
|SQL script is incorrect.|  
|SQL query "{0}" is not correct.|  
|SQL query "{0}" is not correct: {1}|  
  

## Error 0070  
 Exception occurs when attempting to access non-existent Azure table.  
  
 This error in Azure Machine Learning occurs when you attempt to access a non-existent Azure table. You will receive this error if you specify a table in Azure storage, which does not exist when reading from or writing to Azure Table Storage. This can happen if you mistype the name of the desired table, or you have a mismatch between the target name and the storage type. For example, you intended to read from a table but entered the name of a blob instead.  
  
**Resolution:**
 Revisit the module to verify that the name of the table is correct.  
  
|Exception Messages|  
|------------------------|  
|Azure table does not exist.|  
|Azure table "{0}" does not exist.|  
  
## Error 0071  
 Exception occurs if provided credentials are incorrect.  
  
 This error in Azure Machine Learning occurs if the provided credentials are incorrect.  
  
 You might also receive this error if the module cannot connect to an HDInsight cluster.  
  
**Resolution:**
 Review the inputs to the module and verify the account name and password.  
  
 Check for the following issues that can cause an error:  
  
-   The schema of the dataset does not match the schema of the destination datatable.  
  
-   Column names are missing or misspelled  
  
-   You are writing to a table that has column names with illegal characters. Ordinarily you can enclose such column names in square brackets, but if that does not work, edit column names to use only letters and underscores (_)  
  
-   Strings that you are trying to write contain single quotation marks  
  
 If you are trying to connect to an HDInsight cluster, verify that the target cluster is accessible with the supplied credentials.  
  
|Exception Messages|  
|------------------------|  
|Incorrect credentials are passed.|  
|Incorrect username "{0}" or password is passed|  
  

## Error 0072  
 Exception occurs in the case of connection timeout.  
  
 This error in Azure Machine Learning occurs when a connection times out. You will receive this error if there are currently connectivity issues with the data source or destination, such as slow internet connectivity, or if the dataset is large and/or the SQL query to read in the data performs complicated processing.  
  
**Resolution:**
 Determine whether there are currently issues with slow connections to Azure storage or the internet.  
  
|Exception Messages|  
|------------------------|  
|Connection timeout occurred.|  
  

## Error 0073  
 Exception occurs if an error occurs while converting a column to another type.  
  
 This error in Azure Machine Learning occurs when it is not possible to convert column to another type.  You will receive this error if a module requires a particular type and it is not possible to convert the column to the new type.  
  
**Resolution:**
 Modify the input dataset so that the column can be converted based on the inner exception.  
  
|Exception Messages|  
|------------------------|  
|Failed to convert column.|  
|Failed to convert column to {0}.|  
  

## Error 0074  
 Exception occurs when the [Edit Metadata](edit-metadata.md) tries to convert a sparse column to categorical.  
  
 This error in Azure Machine Learning occurs when the [Edit Metadata](edit-metadata.md) tries to convert a sparse column to categorical.  You will receive this error when trying to convert sparse columns to categorical with the **Make categorical** option.  Azure machine Learning does not support sparse categorical arrays, so the module will fail.  
  
 <!--**Resolution:**
 Make the column dense by using [Convert to Dataset](convert-to-dataset.md) first or do not convert the column to categorical.  -->
  
|Exception Messages|  
|------------------------|  
|Sparse columns cannot be converted to Categorical.|  
  

## Error 0075  
Exception occurs when an invalid binning function is used when quantizing a dataset.  
  
This error in Azure Machine Learning occurs when you are trying to bin data using an unsupported method, or when the parameter combinations are invalid.  
  
**Resolution:**

Error handling for this event was introduced in an earlier version of Azure Machine Learning that allowed more customization of binning methods. Currently all binning methods are based on a selection from a dropdown list, so technically it should no longer be possible to get this error.

 <!--If you get this error when using the [Group Data into Bins](group-data-into-bins.md) module, consider reporting the issue in the [Azure Machine Learning forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=MachineLearning), providing the data types, parameter settings, and the exact error message.  -->
  
|Exception Messages|  
|------------------------|  
|Invalid binning function used.|  
  

## Error 0077  
 Exception occurs when unknown blob file writes mode passed.  
  
 This error in Azure Machine Learning occurs if an invalid argument is passed in the specifications for a blob file destination or source.  
  
**Resolution:**
 In almost all modules that import or export data to and from Azure blob storage, parameter values controlling the write mode are assigned by using a dropdown list; therefore, it is not possible to pass an invalid value, and this error should not appear. This error will be deprecated in a later release.  
  
|Exception Messages|  
|------------------------|  
|Unsupported blob writes mode.|  
|Unsupported blob writes mode: {0}.|  
  

## Error 0078  
 Exception occurs when the HTTP option for [Import Data](import-data.md) receives a 3xx status code indicating redirection.  
  
 This error in Azure Machine Learning occurs when the HTTP option for [Import Data](import-data.md) receives a 3xx (301, 302, 304, etc.) status code indicating redirection. You will receive this error if you attempt to connect to an HTTP source that redirects the browser to another page. For security reasons, redirecting websites are not allowed as data sources for Azure Machine Learning.  
  
**Resolution:**
 If the website is a trusted website, enter the redirected URL directly.  
  
|Exception Messages|  
|------------------------|  
|Http redirection not allowed|  
  

## Error 0079  
 Exception occurs if Azure storage container name is specified incorrectly.  
  
 This error in Azure Machine Learning occurs if the Azure storage container name is specified incorrectly. You will receive this error if you have not specified both the container and the blob (file) name using **the Path to blob beginning with container** option when writing to Azure Blob Storage.  
  
**Resolution:**
 Revisit the [Export Data](export-data.md) module and verify that the specified path to the blob contains both the container and the file name, in the format **container/filename**.  
  
|Exception Messages|  
|------------------------|  
|The Azure storage container name is incorrect.|  
|The Azure storage container name "{0}" is incorrect; a container name of the format container/blob was expected.|  
  

## Error 0080  
 Exception occurs when column with all values missing is not allowed by module.  
  
 This error in Azure Machine Learning is produced when one or more of the columns consumed by the module contains all missing values. For example, if a module is computing aggregate statistics for each column, it cannot operate on a column containing no data. In such cases, module execution is halted with this exception.  
  
**Resolution:**
 Revisit the input dataset and remove any columns that contain all missing values.  
  
|Exception Messages|  
|------------------------|  
|Columns with all values missing are not allowed.|  
|Column {0} has all values missing.|  
  

## Error 0081  
 Exception occurs in PCA module if number of dimensions to reduce to is equal to number of feature columns in input dataset, containing at least one sparse feature column.  
  
 This error in Azure Machine Learning is produced if the following conditions are met: (a) the input dataset has at least one sparse column and (b) the final number of dimensions requested is the same as the number of input dimensions.  
  
**Resolution:**
 Consider reducing the number of dimensions in the output to be fewer than the number of dimensions in the input. This is typical in applications of PCA.   <!--For more information, see [Principal Component Analysis](principal-component-analysis.md).  -->
  
|Exception Messages|  
|------------------------|  
|For dataset containing sparse feature columns number of dimensions to reduce should be less than number of feature columns.|  
 

## Error 0082  
 Exception occurs when a model cannot be successfully deserialized.  
  
 This error in Azure Machine Learning occurs when a saved machine learning model or transform cannot be loaded by a newer version of the Azure Machine Learning runtime as a result of a breaking change.  
  
**Resolution:**
 The training experiment that produced the model or transform must be rerun and the model or transform must be resaved.  
  
|Exception Messages|  
|------------------------|  
|Model could not be deserialized because it is likely serialized with an older serialization format. Retrain and resave the model.|  
  

## Error 0083  
 Exception occurs if dataset used for training cannot be used for concrete type of learner.  
  
 This error in Azure Machine Learning is produced when the dataset is incompatible with the learner being trained. For example, the dataset might contain at least one missing value in each row, and as a result, the entire dataset would be skipped during training. In other cases, some machine learning algorithms such as anomaly detection do not expect labels to be present and can throw this exception if labels are present in the dataset.  
  
**Resolution:**
 Consult the documentation of the learner being used to check requirements for the input dataset. Examine the columns to see all required columns are present.  
  
|Exception Messages|  
|------------------------|  
|Dataset used for training is invalid.|  
|{0} contains invalid data for training.|  
|{0} contains invalid data for training. Learner type: {1}.|  
  

## Error 0084  
 Exception occurs when scores produced from an R Script are evaluated. This is currently unsupported.  
  
 This error in Azure Machine Learning occurs if you try to use one of the modules for evaluating a model with output from an R script that contains scores.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Evaluating scores produced by R is currently unsupported.|  
  

## Error 0085  
 Exception occurs when script evaluation fails with an error.  
  
 This error in Azure Machine Learning occurs when you are running custom script that contains syntax errors.  
  
**Resolution:**
 Review your code in an external editor and check for errors.  
  
|Exception Messages|  
|------------------------|  
|Error during evaluation of script.|  
|The following error occurred during script evaluation, view the output log for more information: ---------- Start of error message from {0} interpreter ---------- {1} ---------- End of error message from {0}  interpreter  ----------|  
  

## Error 0086  
 Exception occurs when a counting transform is invalid.  
  
 This error in Azure Machine Learning occurs when you select a transformation based on a count table, but the selected transform is incompatible with the current data, or with the new count table.  
  
**Resolution:**
 The module supports saving the counts and rules that make up the transformation in two different formats. If you are merging count tables, verify that both tables you intend to merge use the same format.  
  
In general, a count-based transform can only be applied to datasets that have the same schema as the dataset on which the transform was originally created.  
  
 <!-- For general information, see [Learning with Counts](data-transformation-learning-with-counts.md). For requirements specific to creating and merging count-based features, see these topics:  
  
-   [Merge Count Transform](merge-count-transform.md)  
  
-   [Import Count Table](import-count-table.md)  
  
-   [Modify Count Table Parameters](modify-count-table-parameters.md)  
  -->
|Exception Messages|  
|------------------------|  
|Invalid counting transform specified.|  
|The counting transform at input port '{0}' is invalid.|  
|The counting transform at input port '{0}' cannot be merged with the counting transform at input port '{1}'. Check to verify the metadata used for counting matches.|  
  

## Error 0087  
 Exception occurs when an invalid count table type is specified for learning with counts modules.  
  
 This error in Azure Machine Learning occurs when you try to import an existing count table, but the table is incompatible with the current data, or with the new count table.  
  
**Resolution:**
 There are different formats for saving the counts and rules that make up the transformation. If you are merging count tables, verify that both use the same format.  
  
 Generally, a count-based transform can only be applied to datasets that have the same schema as the dataset on which the transform was originally created.  
  
  <!--For general information, see [Learning with Counts](data-transformation-learning-with-counts.md). -->
  

## Error 0088  
 Exception occurs when an invalid counting type is specified for learning with counts modules.  
  
 This error in Azure Machine Learning occurs when you try to use a  different counting method than is supported for count-based featurization.  
  
**Resolution:**
 In general, counting methods are chosen from a dropdown list, so you should not see this error.  
  
  <!--For general information, see [Learning with Counts](data-transformation-learning-with-counts.md). For requirements specific to creating and merging count-based features, see these topics:  
  
-   [Merge Count Transform](merge-count-transform.md)  
  
-   [Import Count Table](import-count-table.md)  
  
-   [Modify Count Table Parameters](modify-count-table-parameters.md)  
  -->
|Exception Messages|  
|------------------------|  
|Invalid counting type is specified.|  
|The specified counting type '{0}' is not a valid counting type.|  
  

## Error 0089  
 Exception occurs when the specified number of classes is less than the actual number of classes in a dataset used for counting.  
  
 This error in Azure Machine Learning occurs when you are creating a count table and the label column contains a different number of classes than you specified in the module parameters.  
  
**Resolution:**
 Check your dataset and find out exactly how many distinct values (possible classes) there are in the label column. When you create the count table, you must specify at least this number of classes.  
  
 The count table cannot automatically determine the number of classes available.  
  
 When you create the count table, you cannot specify 0 or any number that is less than the actual number of classes in the label column.  
  
|Exception Messages|  
|------------------------|  
|The number of classes is incorrect. Make sure that the number of classes you specify in the parameter pane is greater than or equal to the number of classes in the label column.|  
|The number of classes specified is '{0}', which is not greater than a label value '{1}' in the data set used to count. Make sure that the number of classes you specify in the parameter pane is greater than or equal to the number of classes in the label column.|  
  

## Error 0090  
 Exception occurs when Hive table creation fails.  
  
 This error in Azure Machine Learning occurs when you are using [Export Data](export-data.md) or another option to save data to an HDInsight cluster and the specified Hive table cannot be created.  
  
**Resolution:**
 Check the Azure storage account name associated with the cluster and verify that you are using the same account in the module properties.  
  
|Exception Messages|  
|------------------------|  
|The Hive table could not be created. For a HDInsight cluster, ensure the Azure storage account name associated with cluster is the same as what is passed in through the module parameter.|  
|The Hive table "{0}" could not be created. For a HDInsight cluster, ensure the Azure storage account name associated with cluster is the same as what is passed in through the module parameter.|  
|The Hive table "{0}" could not be created. For a HDInsight cluster, ensure the Azure storage account name associated with cluster is "{1}".|  
 

## Error 0100  
 Exception occurs when an unsupported language is specified for a custom module.  
  
 This error in Azure Machine Learning occurs when building a custom module and the name property of the **Language** element in a custom module xml definition file has an invalid value. Currently, the only valid value for this property is `R`. For example:  
  
 `<Language name="R" sourceFile="CustomAddRows.R" entryPoint="CustomAddRows" />`  
  
**Resolution:**
 Verify that the name property of the **Language** element in the custom module xml definition file is set to `R`. Save the file, update the custom module zip package, and try to add the custom module again.  
  
|Exception Messages|  
|------------------------|  
|Unsupported custom module language specified|  
  

## Error 0101  
 All port and parameter IDs must be unique.  
  
 This error in Azure Machine Learning occurs when one or more ports or parameters are assigned the same ID value in a custom module XML definition file.  
  
**Resolution:**
 Check that the ID values across all ports and parameters are unique. Save the xml file, update the custom module zip package, and try to add the custom module again.  
  
|Exception Messages|  
|------------------------|  
|All port and parameter IDs for a module must be unique|  
|Module '{0}' has duplicate port/argument IDs. All port/argument IDs must be unique for a module.|  
  

## Error 0102  
 Thrown when a ZIP file cannot be extracted.  
  
 This error in Azure Machine Learning occurs when you are importing a zipped package with the .zip extension, but the package is either not a zip file, or the file does not use a supported zip format.  
  
**Resolution:**
 Make sure the selected file is a valid .zip file, and that it was compressed by using one of the supported compression algorithms.  
  
 If you get this error when importing datasets in compressed format, verify that all contained files use one of the supported file formats, and are in Unicode format.  <!--For more information, see [Unpack Zipped Datasets](unpack-zipped-datasets.md).  -->
  
 Try readding the desired files to a new compressed zipped folder and try to add the custom module again.  
  
|Exception Messages|  
|------------------------|  
|Given ZIP file is not in the correct format|  


## Error 0103  
 Thrown when a ZIP file does not contain any .xml files  
  
 This error in Azure Machine Learning occurs when the custom module zip package does not contain any module definition (.xml) files. These files need to reside in the root of the zip package (for example, not within a subfolder.)  
  
**Resolution:**
 Verify that one or more xml module definition files are in the root folder of the zip package by extracting it to a temporary folder on your disk drive. Any xml files should be directly in the folder you extracted the zip package to. Make sure when you create the zip package that you do not  select a folder that contains xml files to zip as this will create a sub folder within the zip package with the same name as the folder you selected to zip.  
  
|Exception Messages|  
|------------------------|  
|Given ZIP file does not contain any module definition files (.xml files)|  


## Error 0104  
 Thrown when a module definition file references a script that cannot be located  
  
 This error in Azure Machine Learning is thrown when a custom module xml definition file references a script file in the **Language** element that does not exist in the zip package. The script file path is defined in the **sourceFile** property of the **Language** element. The path to the source file is relative to the root of the zip package (same location as the module xml definition files). If the script file is in a sub folder, the relative path to the script file must be specified. For instance, if all scripts were stored in a **myScripts** folder within the zip package, the **Language** element would have to add this path to the **sourceFile** property as below. For example:  
  
 `<Language name="R" sourceFile="myScripts/CustomAddRows.R" entryPoint="CustomAddRows" />`  
  
**Resolution:**
 Make sure that the value of the **sourceFile** property in the **Language** element of the custom module xml definition is correct and that the source file exists in the correct relative path in the zip package.  
  
|Exception Messages|  
|------------------------|  
|Referenced R script file does not exist.|  
|Referenced R script file '{0}' cannot be found. Ensure that the relative path to the file is correct from the definitions location.|  


## Error 0105  
 This error is displayed when a module definition file contains an unsupported parameter type  
  
 This error in Azure Machine Learning is produced when the you create a custom module xml definition and the type of a parameter or argument in the definition does not match a supported type.  
  
**Resolution:**
 Make sure that the type property of any **Arg** element in the custom module xml definition file is a supported type.  
  
|Exception Messages|  
|------------------------|  
|Unsupported parameter type.|  
|Unsupported parameter type '{0}' specified.|  


## Error 0106  
 Thrown when a module definition file defines an unsupported input type  
  
 This error in Azure Machine Learning is produced when the type of an input port in a custom module XML definition does not match a supported type.  
  
**Resolution:**
 Make sure that the type property of an Input element in the custom module XML definition file is a supported type.  
  
|Exception Messages|  
|------------------------|  
|Unsupported input type.|  
|Unsupported input type '{0}' specified.|  


## Error 0107  
 Thrown when a module definition file defines an unsupported output type  
  
 This error in Azure Machine Learning is produced when the type of an output port in a custom module xml definition does not match a supported type.  
  
**Resolution:**
 Make sure that the type property of an Output element in the custom module xml definition file is a supported type.  
  
|Exception Messages|  
|------------------------|  
|Unsupported output type.|  
|Unsupported output type '{0}' specified.|  


## Error 0108  
 Thrown when a module definition file defines more input or output ports than are supported  
  
 This error in Azure Machine Learning is produced when too many input or output ports are defined in a custom module xml definition.  
  
**Resolution:**
 Makes sure the maximum number of input and output ports defined in the custom module xml definition does not exceed the maximum number of supported ports.  
  
|Exception Messages|  
|------------------------|  
|Exceeded supported number of input or output ports.|  
|Exceeded number of supported '{0}' ports. Maximum allowed number of '{0}' ports is '{1}'.| 

## Error 0109  
 Thrown when a module definition file defines a column picker incorrectly  
  
 This error in Azure Machine Learning is produced when the syntax for a column picker argument contains an error in a custom module xml definition.  
  
**Resolution:**
 This error is produced when the syntax for a column picker argument contains an error in a custom module xml definition.  
  
|Exception Messages|  
|------------------------|  
|Unsupported syntax for column picker.|  
  

## Error 0110  
 Thrown when a module definition file defines a column picker that references a non-existent input port ID  
  
 This error in Azure Machine Learning is produced when the *portId* property within the Properties element of an Arg of type ColumnPicker does not match the ID value of an input port.  
  
**Resolution:**
 Make sure the portId property matches the ID value of an input port defined in the custom module xml definition.  
  
|Exception Messages|  
|------------------------|  
|Column picker references a non-existent input port ID.|  
|Column picker references a non-existent input port ID '{0}'.|  
  

## Error 0111  
 Thrown when a module definition file defines an invalid property  
  
 This error in Azure Machine Learning is produced when an invalid property is assigned to an element in the custom module XML definition.  
  
**Resolution:**
 Make sure the property is supported by the custom module element.  
  
|Exception Messages|  
|------------------------|  
|Property definition is invalid.|  
|Property definition '{0}' is invalid.|  
  

## Error 0112  
 Thrown when a module definition file cannot be parsed  
  
 This error in Azure Machine Learning is produced when there is an error in the xml format that prevents the custom module XML definition from being parsed as a valid XML file.  
  
**Resolution:**
 Ensure that each element is opened and closed correctly. Make sure that there are no errors in the XML formatting.  
  
|Exception Messages|  
|------------------------|  
|Unable to parse module definition file.|  
|Unable to parse module definition file '{0}'.|  
  

## Error 0113  
 Thrown when a module definition file contains errors.  
  
 This error in Azure Machine Learning is produced when the custom module XML definition file can be parsed but contains errors, such as definition of elements not supported by custom modules.  
  
**Resolution:**
 Make sure the custom module definition file defines elements and properties that are supported by custom modules.  
  
|Exception Messages|  
|------------------------|  
|Module definition file contains errors.|  
|Module definition file '{0}' contains errors.|  
|Module definition file '{0}' contains errors. {1}|  
  

## Error 0114  
 Thrown when building a custom module fails.  
  
 This error in Azure Machine Learning is produced when a custom module build fails. This occurs when one or more custom module-related errors are encountered while adding the custom module. The additional errors are reported within this error message.  
  
**Resolution:**
 Resolve the errors reported within this exception message.  
  
|Exception Messages|  
|------------------------|  
|Failed to build custom module.|  
|Custom module builds failed with error(s): {0}|  
  

## Error 0115  
 Thrown when a custom module default script has an unsupported extension.  
  
 This error in Azure Machine Learning occurs when you provide a script for a custom module that uses an unknown filename extension.  
  
**Resolution:**
 Verify the file format and filename extension of any script files included in the custom module.  
  
|Exception Messages|  
|------------------------|  
|Unsupported extention for default script.|  
|Unsupported file extention {0} for default script.|  
  

## Error 0121  
 Thrown when SQL writes fails because the table is unwriteable  
  
 This error in Azure Machine Learning is produced when you are using the [Export Data](export-data.md) module to save results to a table in a SQL database, and the table cannot be written to. Typically, you will see this error if the [Export Data](export-data.md) module successfully establishes a connection with the SQL Server instance, but is then unable to write the contents of the Azure ML dataset to the table.  
  
**Resolution:**
 - Open the Properties pane of the [Export Data](export-data.md) module and verify that the database and table names are entered correctly. 
 - Review the schema of the dataset you are exporting, and make sure that the data is compatible with the destination table.
 - Verify that the SQL sign in associated with the user name and password has permissions to write to the table. 
 - If the exception contains additional error information from SQL Server, use that information to make corrections.  
  
|Exception Messages|  
|------------------------|  
|Connected to server, unable to write to table.|  
|Unable to write to Sql table: {0}|  


## Error 0122  
 Exception occurs if multiple weight columns are specified and just one is allowed.  
  
 This error in Azure Machine Learning occurs when too many columns have been selected as weight columns.  
  
**Resolution:**
 Review the input dataset and its metadata. Ensure that only one column contains weights.  
  
|Exception Messages|  
|------------------------|  
|Multiple weight columns are specified.|  


## Error 0123  
 Exception occurs if column of vectors is specified to Label column.  
  
 This error in Azure Machine Learning occurs if you use a vector as the label column.  
  
**Resolution:**
 Change the data format of the column if necessary, or choose a different column.  
  
|Exception Messages|  
|------------------------|  
|Column of vectors is specified as Label column.|  


## Error 0124  
 Exception occurs if non-numeric columns are specified to be the weight column.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Non-numeric column is specified as the weight column.|  
  


## Error 0125  
 Thrown when schema for multiple datasets does not match.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Dataset schema does not match.|  


## Error 0126  
 Exception occurs if the user specifies a SQL domain that is not supported in Azure ML.  
  
 This error is produced when the user specifies a SQL domain that is not supported in Azure Machine Learning. You will receive this error if you are attempting to connect to a database server in a domain that is not whitelisted. Currently, the allowed SQL domains are: ".database.windows.net", ".cloudapp.net", or ".database.secure.windows.net". That is, the server must be an Azure SQL server or a server in a virtual machine on Azure.  
  
**Resolution:**
 Revisit the module. Verify that the SQL database server belongs to one of the accepted domains:  
  
-   .database.windows.net  
  
-   .cloudapp.net  
  
-   .database.secure.windows.net  
  
|Exception Messages|  
|------------------------|  
|Unsupported SQL domain.|  
|The SQL domain {0} is not currently supported in Azure ML|  
  

## Error 0127  
 Image pixel size exceeds allowed limit  
  
 This error occurs if you are reading images from an image dataset for classification and the images are larger than the model can handle.  
  
 <!--**Resolution:**
 For more information about the image size and other requirements, see these topics:  
  
-   [Import Images](import-images.md)  
  
-   [Pretrained Cascade Image Classification](pretrained-cascade-image-classification.md)  -->
  
|Exception Messages|  
|------------------------|  
|Image pixel size exceeds allowed limit.|  
|Image pixel size in the file '{0}' exceeds allowed limit: '{1}'|  


## Error 0128  
 Number of conditional probabilities for categorical columns exceeds limit.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Number of conditional probabilities for categorical columns exceeds limit.|  
|Number of conditional probabilities for categorical columns exceeds limit. Columns '{0}' and '{1}' are the problematic pair.|  


## Error 0129  
 Number of columns in the dataset exceeds allowed limit.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Number of columns in the dataset exceeds allowed limit.|  
|Number of columns in the dataset in '{0}' exceeds allowed.'|  
|Number of columns in the dataset in '{0}' exceeds allowed limit of '{1}'.'|  
|Number of columns in the dataset in '{0}' exceeds allowed '{1}' limit of '{2}'.'|  
## Error 0130  
 Exception occurs when all rows in the training dataset contain missing values.  
  
 This occurs when some column in the training dataset is empty.  
  
**Resolution:**
 Use the [Clean Missing Data](clean-missing-data.md) module to remove columns with all missing values.  
  
|Exception Messages|  
|------------------------|  
|All rows in training dataset contain missing values.  Consider using the Clean Missing Data module to remove missing values.|  
 

## Error 0131  
 Exception occurs if one or more datasets in a zip file fails to be unzipped and registered correctly  
  
 This error is produced when one or more datasets in a zip file fails to be unzipped and read correctly. You will receive this error if the unpacking fails because the zip file itself or one of the files in it is corrupt, or there is a system error while trying to unpack and expand a file.  
  
**Resolution:**
 Use the details provided in the error message to determine how to proceed.  
  
|Exception Messages|  
|------------------------|  
|Upload zipped datasets failed|  
|Zipped dataset {0} failed with the following message: {1}|  
|Zipped dataset {0} failed with a {1} exception with message: {2}|  
  

## Error 0132  
 No file name was specified for unpacking; multiple files were found in zip file.  
  
 This error is produced when no file name was specified for unpacking; multiple files were found in zip file. You will receive this error if the .zip file contains more than one compressed file, but you did not specify a file for extraction in the **Dataset to Unpack** text box, in the **Property** pane of the module. Currently, only one file can be extracted each time the module is run.  
  
**Resolution:**
 The error message provides a list of the files found in the .zip file. Copy the name of the desired file and paste it into the **Dataset to Unpack** text box.  
  
|Exception Messages|  
|------------------------|  
|Zip file contains multiple files; you must specify the file to expand.|  
|The file contains more than one file. Specify the file to expand. The following files were found: {0}|  
  

## Error 0133  
 The specified file was not found in the zip file  
  
 This error is produced when the filename entered in the **Dataset to Unpack** field of the **Property** pane does not match the name of any file found in the .zip file. The most common causes of this error are a typing error or searching the wrong archive file for the file to expand.  
  
**Resolution:**
 Revisit the module. If the name of the file you intended to decompress appears in the list of files found, copy the file name and paste it into the **Dataset to Unpack** property box. If you do not see the desired file name in the list, verify that you have the correct .zip file and the correct name for the desired file.  
  
|Exception Messages|  
|------------------------|  
|The specified file was not found int the zip file.|  
|The specified file was not found. Found the following file(s): {0}|  
  

## Error 0134
Exception occurs when label column is missing or has insufficient number of labeled rows.  
  
This error occurs when the module requires a label column, but you did not include one in the column selection, or the label column is missing too many values.

This error can also occur when a previous operation changes the dataset such that insufficient rows are available to a downstream operation. For example, suppose you use an expression in the **Partition and Sample** module to divide a dataset by values. If no matches are found for your expression, one of the datasets resulting from the partition would be empty.

Resolution: 

 If you include a label column in the column selection but it isn’t recognized, use the [Edit Metadata](edit-metadata.md) module to mark it as a label column.
  
  <!--Use the [Summarize Data](summarize-data.md) module to generate a report that shows how many values are missing in each column. -->Then, you can use the [Clean Missing Data](clean-missing-data.md) module to remove rows with missing values in the label column. 

 Check your input datasets to make sure that they contain valid data, and enough rows to satisfy the requirements of the operation. Many algorithms will generate an error message if they require some minimum number rows of data, but the data contains only a few rows, or only a header.
  
|Exception Messages|
|------------------------|
|Exception occurs when label column is missing or has insufficient number of labeled rows.|  
|Exception occurs when label column is missing or has less than {0} labeled rows|  
  

## Error 0135  
 Only centroid-based cluster is supported.  
  
**Resolution:**
 You might encounter this error message if you have attempted to evaluate a clustering model that is based on a custom clustering algorithm that does not use centroids to initialize the cluster.  
  
  <!--You can use [Evaluate Model](evaluate-model.md) to evaluate clustering models that are based on the  [K-Means Clustering](k-means-clustering.md) module. For custom algorithms, use the [Execute R Script](execute-r-script.md) module to create a custom evaluation script.  -->
  
|Exception Messages|  
|------------------------|  
|Only centroid-based cluster is supported.|  
  

## Error 0136  
 No file name was returned; unable to process the file as a result.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|No file name was returned; unable to process the file as a result.|  
  

## Error 0137  
 Azure Storage SDK encountered an error converting between table properties and dataset columns during read or write.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Conversion error between Azure table storage property and dataset column.|  
|Conversion error between Azure table storage property and dataset column. Additional information: {0}|  

## Error 0138  
 Memory has been exhausted, unable to complete running of module. Downsampling the dataset may help to alleviate the problem.  
  
 This error occurs when the module that is running requires more memory than is available in the Azure container. This can happen if you are working with a large dataset and the current operation cannot fit into memory.  
  
**Resolution:**
 If you are trying to read a large dataset and the operation cannot be completed, downsampling the dataset might help.  
  
  <!--If you use the visualizations on datasets to check the cardinality of columns, only some rows are sampled. To get a full report, use [Summarize Data](summarize-data.md). You can also use the [Apply SQL Transformation](apply-sql-transformation.md) to check for the number of unique values in each column.  
  
 Sometimes transient loads can lead to this error. Machine support also changes over time. 
  
 Try using [Principal Component Analysis](principal-component-analysis.md) or one of the provided feature selection methods to reduce your dataset to a smaller set of more feature-rich columns: [Feature Selection](feature-selection-modules.md)  -->
  
|Exception Messages|  
|------------------------|  
|Memory has been exhausted, unable to complete running of module.|  
  

## Error 0139  
 Exception occurs when it is not possible to convert a column to another type.  
  
 This error in Azure Machine Learning occurs when you try to convert a column to a different data type, but that type is not supported by the current operation or by the module.  
  
 The error might also appear when a module tries to implicitly convert data to meet requirements of the current module, but the conversion is not possible.  
  
**Resolution:**

1. Review your input data and determine the exact data type of the column that you want to use, and the data type of the column that is producing the error. Sometimes you might think the data type is correct, but find that an upstream operation has modified the data type or usage of a column. Use the [Edit Metadata](edit-metadata.md) module to reset column metadata to its original state. 
2. Look at the module help page to verify the requirements for the specified operation. Determine which data types are supported by the current module, and what range of values is supported. 
 <!--3. If values need to be truncated, rounded, or outliers removed, use the [Apply Math Operation](apply-math-operation.md) or [Clip Values](clip-values.md) modules to make corrections.-->
4. Consider whether it is possible to convert or cast the column to a different data type. The following modules all provide considerable flexibility and power for modifying data: 
 <!--
   + [Apply SQL Transformation](apply-sql-transformation.md)
   + [Execute R Script](execute-r-script.md)
-->   
   + [Execute Python Script](execute-python-script.md).  

> [!NOTE]
> Still not working? Consider providing additional feedback on the problem, to help us develop better troubleshooting guidance. Just submit feedback on this page and provide the name of the module that generated the error, and the data type conversion that failed.
  
|Exception Messages|  
|------------------------|  
|Not allowed conversion.|  
|Could not convert: {0}.|  
|Could not convert: {0}, on row {1}.|  
|Could not convert column of type {0} to column of type {1} on row {2}.|  
|Could not convert column "{2}" of type {0} to column of type {1} on row {3}.|  
|Could not convert column "{2}" of type {0} to column "{3}" of type {1} on row {4}.| 

## Error 0140  
 Exception occurs if passed column set argument does not contain other columns except label column.  
  
 This error occurs if you connected a dataset to a module that requires multiple columns, including features, but you have provided only the label column.  
  
**Resolution:**
 Choose at least one feature column to include in the dataset.  
  
|Exception Messages|  
|------------------------|  
|Specified column set does not contain other columns except label column.|  
  

## Error 0141  
 Exception occurs if the number of the selected numerical columns and unique values in the categorical and string columns is too small.  
  
 This error in Azure Machine Learning occurs when there are not enough unique values in the selected column to perform the operation.  
  
**Resolution:**
 Some operations perform statistical operations on feature and categorical columns, and if there are not enough values, the operation might fail or return an invalid result. Check your dataset to see how many values there are in the feature and label columns, and determine whether the operation you are trying to perform is statistically valid.  
  
 If the source dataset is valid, you might also check whether some upstream data manipulation or metadata operation has changed the data and removed some values.  
  
 If upstream operations include splitting, sampling, or resampling, verify that the outputs contain the expected number of rows and values.  
  
|Exception Messages|  
|------------------------|  
|The number of the selected numerical columns and unique values in the categorical and string columns is too small.|  
|The total number of the selected numerical columns and unique values in the categorical and string columns (currently {0}) should be at least {1}|  
  

## Error 0142  
 Exception occurs when the system cannot load certificate to authenticate.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|The certificate cannot be loaded.|  
|The certificate {0} cannot be loaded. Its thumbprint is {1}.|  
  

## Error 0143  
 Can't parse user-provided URL that is supposed to be from GitHub.  
  
 This error in Azure Machine Learning occurs when you specify an invalid URL and the module requires a valid GitHub URL.  
  
**Resolution:**
 Verify that the URL refers to a valid GitHub repository. Other site types are not supported.  
  
|Exception Messages|  
|------------------------|  
|URL is not from github.com.|  
|URL is not from github.com: {0}|  

## Error 0144  
 User-provided GitHub url is missing the expected part.  
  
 This error in Azure Machine Learning occurs when you specify a GitHub file source using an invalid URL format.  
  
**Resolution:**
 Check that the URL of the GitHub repository is valid and ends with \blob\ or \tree\\.  
  
|Exception Messages|  
|------------------------|  
|Cannot parse GitHub URL.|  
|Cannot parse GitHub URL (expecting '\blob\\' or '\tree\\' after the repository name): {0}|  

## Error 0145  
 Cannot create the replication directory for some reason.  
  
 This error in Azure Machine Learning occurs when the module fails to create the specified directory.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Cannot create replication directory.|  
  

## Error 0146  
 When the user files are unzipped into the local directory, the combined path might be too long.  
  
 This error in Azure Machine Learning occurs when you are extracting files but some file names are too long when unzipped.  
  
**Resolution:**
 Edit the file names such that combined path and file name is no longer than 248 characters.  
  
|Exception Messages|  
|------------------------|  
|Replication path is longer than 248 characters, shorten the script name or path.|  

## Error 0147  
 Could not download stuff from GitHub for some reason  
  
 This error in Azure Machine Learning occurs when you cannot read or download the specified files from GitHub.  
  
**Resolution:**
 The issue might be temporary; you might try accessing the files at another time. Or verify that you have the necessary permissions and that the source is valid.  
  
|Exception Messages|  
|------------------------|  
|GitHub access error.|  
|GitHub access error. {0}|  
  

## Error 0148  
 Unauthorized access issues while extracting data or creating directory.  
  
 This error in Azure Machine Learning occurs when you are trying to create a directory or read data from storage but do not have the necessary permissions.  
  
**Resolution:**
  
|Exception Messages|  
|------------------------|  
|Unauthorized access exception while extracting data.|  
  

## Error 0149  
 The user file does not exist inside GitHub bundle.  
  
 This error in Azure Machine Learning occurs when the specified file cannot be found.  
  
Resolution: 
  
|Exception Messages|  
|------------------------|  
|GitHub file is not found.|  
|GitHub file is not found.: {0}|  
  

## Error 0150  
 The scripts that come from the user package could not be unzipped, most likely because of a collision with GitHub files.  
  
 This error in Azure Machine Learning occurs when a script cannot be extracted, typically when there is an existing file of the same name.  
  
Resolution:
  
|Exception Messages|  
|------------------------|  
|Unable to unzip the bundle; possible name collision with GitHub files.|  
  

## Error 0151  
 There was an error writing to cloud storage. Check the URL.  
  
 This error in Azure Machine Learning occurs when the module tries to write data to cloud storage but the URL is unavailable or invalid.  
  
Resolution: Check the URL and verify that it is writable.  
  
|Exception Messages|  
|------------------------|  
|Error writing to cloud storage (possibly a bad url).|  
|Error writing to cloud storage: {0}. Check the url.|  
  
## Error 0152  
 The Azure cloud type was specified incorrectly in the module context.  
  
|Exception messages|  
|------------------------|  
|Bad Azure Cloud Type|  
|Bad Azure Cloud Type: {0}|  
  
## Error 0153  
 The storage end point specified is invalid.  
  
|Exception Messages|  
|------------------------|  
|Bad Azure Cloud Type|  
|Bad Storage End Point: {0}|  

## Error 0154  
 The specified server name could not be resolved  
  
|Exception Messages|  
|------------------------|  
|The specified server name could not be resolved|  
|The specified server {0}.documents.azure.com could not be resolved|

## Error 0155  
 The DocDb Client threw an exception  
  
|Exception Messages|  
|------------------------|  
|The DocDb Client threw an exception|  
|DocDb Client: {0}|

## Error 0156  
 Bad response for HCatalog Server.  
  
|Exception Messages|  
|------------------------|  
|Bad response for HCatalog Server. Check that all services are running.|  
|Bad response for HCatalog Server. Check that all services are running. Error details: {0}|

## Error 0157  
 There was an error reading from Azure Cosmos DB due to inconsistent or different document schemas. Reader requires all documents to have the same schema.  
  
|Exception Messages|  
|------------------------|  
|Detected documents with different schemas. Make sure all documents have the same schema|

## Error 1000  
Internal library exception.  
  
This error is provided to capture otherwise unhandled internal engine errors. Therefore, the cause for this error might be different depending on the module that generated the error.  
  
To get more help, we recommend that you post the detailed message that accompanies the error to the Azure Machine Learning forum, together with a description of the scenario, including the data used as inputs. This feedback will help us to prioritize errors and identify the most important issues for further work.  
  
|Exception Messages|  
|------------------------|  
|Library exception.|  
|Library exception: {0}|  
|{0} library exception: {1}|  
