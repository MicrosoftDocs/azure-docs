---
title: In-depth guide on how to use Azure Machine Learning Data Preparations | Microsoft Docs
description: This document provides an overview and details about how to solve data problems with Azure Machine Learning Data Preparations
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article
ms.date: 02/01/2018

ROBOTS: NOINDEX
---
# Data Preparations user guide 

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


The Azure Machine Learning Data Preparations experience provides a lot of rich functionality. This article documents the deepest parts of the experience.

### Step execution, history, and caching 
Data Preparations step history maintains a series of caches for performance reasons. If you select a step and it hits a cache, it doesn't re-execute. If you have a write block at the end of the step history and you flip back and forth on the steps but make no changes, the write isn't triggered after the first time. A new write occurs and overwrites the previous one, if you:

- Make changes to the write block.
- Add a new transform block and move it above the write block, which generates a cache invalidation.
- Change the properties of a block above the write block, which generates a cache invalidation.
- Select refresh on a sample (thus invalidating all the caches).

### Error values

Data transformations might fail for an input value because that value can't be handled appropriately. For example, in the case of type coercion operations, the coercion fails if the input string value can't be cast to the specified target type. A type coercion operation might be converting a column of string type to a numeric or Boolean type or attempting to duplicate a column that doesn't exist. (This failure occurs as the result of moving the *delete column X* operation before the *duplicate column X* operation.)

In these cases, Data Preparations produces an error value as the output. Error values indicate that a previous operation failed for the given value. Internally, they're treated as a first-class value type, but their presence doesn't alter the underlying type of a column, even if a column consists entirely of error values.

Error values are easy to identify. They're highlighted in red and read "Error." To determine the reason for the error, hover over an error value to see a text description for the failure.

Error values propagate. After an error value occurs, it propagates in most cases as an error through most operations. There are three ways to replace or remove them:

* Replace
    -  Right-click a column, and select **Replace Error Values**. You can then choose a replacement value for each error value found in the column.

* Remove
    - Data Preparations includes interactive filters to preserve or remove error values.
    - Right-click a column, and select **Filter Column**. To preserve or remove error values, create a conditional with the condition *"is error"* or *"is not error."*

* Use a Python expression to conditionally operate on error values. For more information, see the [section on Python extensions](data-prep-python-extensibility-overview.md).

### Sampling
A Data Sources file takes in raw data from one or more sources, either from the local file system or a remote location. The Sample block allows you to specify whether to work with a subset of the data by generating samples. Operating on a sample of the data rather than a large dataset often leads to better performance when you carry out operations in later steps.

For each Data Sources file, multiple samples can be generated and stored. However, only one sample can be set as the active sample. You can create, edit, or delete samples in the Data Source wizard or by editing the Sample block. Any Data Preparations files that reference a data source inherently use the sample specified in the Data Sources file.

There are a number of sampling strategies available, each with different configurable parameters.

#### Top
This strategy can be applied to either local or remote files. It takes the first N rows (specified by Count) into the data source.

#### Random N 
This strategy can be applied only to local files. It takes random N rows (specified by Count) into the data source. You can provide a specific seed to ensure that the same sample is generated, provided that Count is also the same.

#### Random % 
This strategy can be applied to either local or remote files. In both cases, a probability and a seed must be provided, similar to the Random N strategy.

For samples of remote files, additional parameters need to be provided:

- Sample generator 
  - Select a Spark cluster or remote Docker compute target to be used for the sample generation. The compute target must be created for the project beforehand for it to appear in this list. Follow the steps in the section "Create a new compute target" in [How to use GPU in Azure Machine Learning](how-to-use-gpu.md) to create compute targets.
- Sample storage 
  - Provide an intermediate storage location to store the remote sample. This path must be a different directory from the input file location.

#### Full file 
This strategy can be applied only to local files, taking the full file into the data source. If the file is too large, this option might slow down future operations in the app. You might find it more appropriate to use a different sampling strategy.


### Fork, merge, and append

When you apply a filter over a dataset, the operation splits the data into two result sets: one set represents records that succeed in the filter, and another set is for the records that fail. In either case, the user can choose which result set to display. The user can discard the other dataset or place it in a new data flow. The latter option is referred to as forking.

To fork: 
1. Select a column, right-click, and select the **Filter** column.

2. Under **I Want To**, select **Keep Rows** to display the result set that passes the filter.

3. Select **Remove Rows** to display the failed set.

4. After **Conditions**, select **Create Dataflow Containing the Filtered Out Rows** to fork the non-display result set into a new data flow.


This practice is often used to separate out a set of data that requires additional preparation. After you prepared the forked dataset, it's common to merge the data with the result set in the original data flow. To perform a merge (the reverse of a fork operation), use one of the following actions:

- **Append Rows**. Merge two or more data flows vertically (row-wise). 
- **Append Columns**. Merge two or more data flows horizontally (column-wise).


>[!NOTE]
>Append Columns fails if a column collision occurs.


After a merge operation, one or more data flows are referenced by a source data flow. Data Preparations notifies you with a notification in the lower-right corner of the app, beneath the list of steps.


Any operation on the referenced data flow requires the parent data flow to refresh the sample used from the referenced data flow. In that event, a confirmation dialog box replaces the data flow reference notification in the lower-right corner. That dialog box confirms that you need to refresh the data flow to synchronize with changes to any dependency data flows.

### List of appendices 
* [Supported data sources](data-prep-appendix2-supported-data-sources.md)  
* [Supported transforms](data-prep-appendix3-supported-transforms.md)  
* [Supported inspectors](data-prep-appendix4-supported-inspectors.md)  
* [Supported destinations](data-prep-appendix5-supported-destinations.md)  
* [Sample filter expressions in Python](data-prep-appendix6-sample-filter-expressions-python.md)  
* [Sample transform data flow expressions in Python](data-prep-appendix7-sample-transform-data-flow-python.md)  
* [Sample data sources in Python](data-prep-appendix8-sample-source-connections-python.md)  
* [Sample destination connections in Python](data-prep-appendix9-sample-destination-connections-python.md)  
* [Sample column transforms in Python](data-prep-appendix10-sample-custom-column-transforms-python.md)  
