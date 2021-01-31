---
title: Use Dataflow to process data for automated machine learning(AutoML) models
description: Learn how to process data for automated machine learning(AutoML) models in Azure Data Factory using mapping data flows.
services: data-factory
author: amberz,ATLArcht

ms.service: data-factory
ms.workload: data-services

ms.topic: conceptual
ms.date: 1/31/2021
ms.author: amberz, ATLArcht
---


# Use Dataflow to process data for automated machine learning(AutoML) models

[Automated machine learning(AutoML)](https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml) is adopted by machine learning projects to train, tune and gain best model automatically using target metric you specify for classification, regression and time-series forecasting. 

One of challenges is raw data from data warehouse or transactional database would be huge dataset during training Azure machine learning model. You would [optimize data processing](https://docs.microsoft.com/en-us/azure/machine-learning/concept-optimize-data-processing) via increasing RAM of VM. Given [Parquet file](https://parquet.apache.org/) formats are recommended for machine learning tasks since it's binary columnar format.This tutorial will go through another option partitioning dataset to parquet files before training models. 

In Automated machine learning(AutoML) project, it would apply below three data processing scenarios:

1. Partition large data to parquet files before training models. 

    [Pandas dataframe](https://pandas.pydata.org/pandas-docs/stable/getting_started/overview.html) is commonly used to process data before training models. Even Pandas dataframe works well for data sizes less than 1GB, but if data is large than 1GB, Pandas dataframe slow down to process data, sometime even will get out of memory error message. 

    Azure Data Factories Mapping data flows are visually designed data transformations with code-free to data engineers. It's powerful to process large data since the pipeline use scaled-out Spark clusters.

1. Split training dataset and test dataset. 
    
    Training dataset will be used for training model, test dataset will be used for evaluate models in machine learning project. Mapping data flows conditional split activity would split training data and test data. 

1. Remove unqualified data.

    You may want to remove unqualified data, such as: parquet file with zero row. In this tutorial, we will use Aggregate activity to get row count row, the row count will be a condition to remove unqualified data. 


## Preparation
Use a table of Azure SQL Database as raw data, then run [Insert data](./media/scenario-dataflow-to-process-data-for-AML-models/MyProducts.sql) get tutorial data. 
```
CREATE TABLE [dbo].[MyProducts](
	[ID] [int] NULL,
	[Col1] [char](124) NULL,
	[Col2] [char](124) NULL,
	[Col3] datetime NULL,
	[Col4] int NULL

) 

```

## Convert data format to parquet

Data flow will convert a table of Azure SQL Database to parquet file format. 

**Source Dataset**: Transaction table of Azure SQL Database

**Sink Dataset**: Blob storage with Parquet format


## Remove unqualified data based on row count

Let's suppose to remove row count less than 2. 

1. Use Aggregate activity to get row count row: **Group by** based on Col2 and **Aggregates** with count(1) for row count. 

    ![Get Row Count](./media/scenario-dataflow-to-process-data-for-AML-models/AggregateActivityAddRowCount.png)

1. Use Sink activity, choose **Sink type** as Cache in **Sink** tab, then choose desired column from **key columns** dropdown list in **Settings** tab. 

    ![Get Row Count](./media/scenario-dataflow-to-process-data-for-AML-models/CacheSinkActivityAddRowCount.png)

1. Use derived column activity to add row count column in  in master source stream. In **Derived column's settings** tab, use CacheSink#lookup expression getting row count from SinkCache.
    ![Add Row Count Column](./media/scenario-dataflow-to-process-data-for-AML-models/DerivedColumnActivityRowCountS1.png)

1. Use Conditional split activity to remove unqualified data. In this example,  row count based on Col2 column, and the condition is to remove row count less than 2, so two rows (ID=2 and ID=7) will be removed. You would save unqualified data to a blob storage for data management. 

    ![Conditional Split based on row count](./media/scenario-dataflow-to-process-data-for-AML-models/ConditionalSplitGreaterOrEquelThan2.png)

    Note: 
    1. Create a new source for getting row count which will be used in original source in later steps. 
    1. Use CacheSink from performance standpoint. 

## Split training data and test data 

1. We want to split training data and test data for each partition. In this example, for the same value of Col2, get top 2 rows as test data and the rest rows as training data. 

    Use Window activity to add one column row number for each partition. In **Over** tab choose column for partition(in this tutorial, will partition for Col2), give order in **Sort** tab(in this tutorial, will based on ID to order), and in **Window columns** tab to add one column as row number for each partition. 
    ![Conditional Split based on row count](./media/scenario-dataflow-to-process-data-for-AML-models/WindowActivityAddRowNumber.png)

1. Use conditional split activity to split each partition top 2 rows to test dataset, and the rest rows to training dataset. In **Conditional split setttings** tab, use expression lesserOrEqual(RowNum,2) as condition. 

    ![SplitTrainingDatasetAndTestDataset](./media/scenario-dataflow-to-process-data-for-AML-models/SplitTrainingDatasetAndTestDataset.png)

## Partition training dataset and test dataset with parquet format

1. Use Sink activity, in **Optimize** tab, using **Unique value per partition** to set a column as a column key for partition. 
    ![SplitTrainingDatasetAndTestDataset](./media/scenario-dataflow-to-process-data-for-AML-models/PartitionTrainingDatasetSink.png)

Looks back the entire pipeline logic: 
    ![EntirePipeline](./media/scenario-dataflow-to-process-data-for-AML-models/EntirePipeline.png)


## Next steps

* Build the rest of your data flow logic by using mapping data flows [transformations](concepts-data-flow-overview.md).
