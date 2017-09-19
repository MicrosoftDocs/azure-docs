---
title: In depth guide on how to use Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides the overview and details on solving data problems with Azure ML data prep
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: 
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article
ms.date: 09/07/2017
---
# Data preparation user guide 
The Data Prep experience provides a lot of rich functionality, the following documents the deepest parts of the experience.

### Step execution, history, and caching 
Data Prep step history maintains a series of caches for perf reasons. If you click on a step, and it hits a cache it does not re-execute. If you have a write block at the end of the step history and you flip back and forth on the steps but make no changes, then the write will not be triggered after the first time. If you 
- Make changes to the write block or
- Add a new transform block and move it above the write block generating a cache invalidation or
- If you change the properties of a block above the write block generating a cache invalidation or
- Select refresh on a sample(thus invalidating all the cache’s)

Then a new write occurs and overwrites the previous one.

### Error values

Data transformations may fail for an input value because that value cannot be handled appropriately. For example, in the cause of type coercion operations, the coercion fails if the input string value cannot be cast to the specified target type. A type coercion operation might be converting a column of string type to a numeric or boolean type. Likewise, attempting to duplicate a column that doesn't exist (the result of moving the Delete Column X operation before the Duplicate Column X operation).

In these cases, Data Prep produces an **Error Value** as the output. Error values indicate that a previous operation failed for the given value. Internally, they are treated as a first-class value type, but their presence does not alter the underlying type of a column - even if a column consists entirely of Error Values.

Error Values are easy to identify. They are highlighted in red and read "Error." To determine the reason for the ever, hover over an Error Value to get a text description for the failure.

Error Values propagate. Once an error value occurs, it propagates in most cases as an error through most operations. There are three ways currently, however, to remove or replace them:

1) Replace
    -  Right-click on a column and select *Replace Error Values*. You can then choose a replacement value for each error value found in the column.

2) Remove
    - Data Prep includes interactive filters to preserve or remove Error Values.
    - Right-click on a column and select *Filter Column*. To preserve or remove error values, create a conditional with the condition *"is error"* or *"is not error."*

3) Use a Python expression to conditionally operate on Error Values. For more information, visit the [section on Python extensions](data-prep-python-extensibility-overview.md).

### Sampling
A Data Source file takes in raw data from one or more sources, either from the local file system or a remote location. The Sample block allows you to specify whether to work with a subset of the data by generating samples. Operating on a sample of the data rather than a large dataset often leads to better performance when carrying out operations in later steps.

For each Data Source file, multiple samples can be generated and stored. However only one sample can be set as the active sample. You can create, edit, or delete samples in the Data Source wizard or by editing the Sample block. Any Data Prep files that reference a Data Source inherently uses the sample specified in the Data Source file.

There are a number of sampling strategies available, each with different configurable parameters.

#### Top
This strategy can be applied to either local or remote files. It takes the first N rows (specified by Count) into the Data Source.

#### Random N 
This strategy can only be applied to local files. It takes random N rows (specified by Count) into the Data Source. You can provide a specific seed to ensure the same sample is generated, provided that Count is also the same.

#### Random % 
This strategy can be applied to either local or remote files. In both cases, a probability and seed must be provided, similar to the Random N strategy.

For samples of remote files, additional parameters need to be provided.

- Sample Generator 
  - Select a Spark cluster or remote Docker compute target to be used for the sample generation. The compute target must be created for the project beforehand for it to appear in this list. Follow the steps in [How to use GPU in Azure Machine Learning](how-to-use-gpu.md) "Create a new Compute Target" to create compute targets.
- Sample Storage 
  - Provide an intermediate storage location to store the remote sample. This path must be a different directory from the input file location.

#### Full file 
This strategy can only be applied to local files, taking the full file into the Data Source. If the file is too large, this option may slow down future operations in the app, and you may find it more appropriate to use a different sampling strategy.


### Forking, merging, and appending

When applying a filter over a dataset, the operation splits the data into two result sets, where one set represents records that succeed in the filter and another set for the records that fail. In either case, the user can choose which result set to display. The user can discard the other dataset or place it in a new dataflow. The latter option is referred to as *forking*.

In order to fork, select a column, right-click, and select Filter Column.
- Under "I Want To", select *Keep Rows* to display the result set that passes the filter, or *Remove Rows* to display the failed set.
- Following "Conditions", select *Create Dataflow Containing the Filtered Out Rows* to fork the non-display result set into a new dataflow.


This practice is often to separate out a set of data that requires additional preparation. After wrangling the forked data set, it's common to merge the data with the result set in the original dataflow. To perform a "merge" (the reverse of a "fork" operation), use one of the following actions:
- *Append Rows*. Merge two or more dataflows vertically (row-wise). 
- *Append Columns*. Merge two or more dataflows horizontally (column-wise).

>[!NOTE]
>AppendColumns fails if a column collision occurs.

After a merge operation, one or more dataflows will be referenced by a source dataflow. DataPrep notifies you with a notification in the bottom right corner of the app, beneath the list of steps.


Any operation on the referenced dataflow requires the parent dataflow to refresh the sample used from the referenced dataflow. In that event, a confirmation dialog replaces the dataflow reference notification in the bottom right corner. That dialog confirms that you need to refresh the dataflow to synchronize with changes to any dependency dataflows.

### List of Appendices 
[Appendix 2 - Supported Data Sources](data-prep-appendix2-supported-data-sources.md)  
[Appendix 3 - Supported Transforms](data-prep-appendix3-supported-transforms.md)  
[Appendix 4 - Supported Inspectors](data-prep-appendix4-supported-inspectors.md)  
[Appendix 5 - Supported Destinations](data-prep-appendix5-supported-destinations.md)  
[Appendix 6 - Sample Filter Expressions in Python](data-prep-appendix6-sample-filter-expressions-python.md)  
[Appendix 7 - Sample Transform Dataflow Expressions in Python](data-prep-appendix7-sample-transform-data-flow-python.md)  
[Appendix 8 - Sample Data Sources in Python](data-prep-appendix8-sample-source-connections-python.md)  
[Appendix 9 - Sample Destination Connections in Python](data-prep-appendix9-sample-destination-connections-python.md)  
[Appendix 10 - Sample Column Transforms in Python](data-prep-appendix10-sample-custom-column-transforms-python.md)  