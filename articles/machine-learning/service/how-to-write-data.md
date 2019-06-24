---
title: 'Write: data prep Python SDK'
titleSuffix: Azure Machine Learning service
description: Learn about writing data with Azure Machine Learning Data Prep SDK. You can write out data at any point in a data flow, and to files in any of our supported locations (local file system, Azure Blob Storage, and Azure Data Lake Storage).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: jmartens
ms.date: 05/02/2019
ms.custom: seodec18
---
# Write and configure data  with the Azure Machine Learning Data Prep SDK

In this article, you learn different methods to write data using the [Azure Machine Learning Data Prep Python SDK](https://aka.ms/data-prep-sdk) and how to configure that data for experimentation with the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).  Output data can be written at any point in a dataflow. Writes are added as steps to the resulting data flow, and these steps run every time the data flow runs. Data is written to multiple partition files to allow parallel writes.

> [!Important]
> If you are building a new solution, try the [Azure Machine Learning Datasets](how-to-explore-prepare-data.md) (preview) to transform your data, snapshot data, and store versioned dataset definitions. Datasets is the next version of the data prep SDK, offering expanded functionality for managing datasets in AI solutions.
> If you use the `azureml-dataprep` package to create a dataflow with your transformations instead of using the `azureml-datasets` package to create a dataset, you won't be able to use snapshots or versioned datasets later.

Since there are no limitations to how many write steps there are in a pipeline, you can easily add additional write steps to get intermediate results for troubleshooting or for other pipelines.

Each time you run a write step, a full pull of the data in the data flow occurs. For example, a data flow with three write steps will read and process every record in the data set three times.

## Supported data types and location

The following file formats are supported
-	Delimited files (CSV, TSV, etc.)
-	Parquet files

Using the Azure Machine Learning Data Prep Python SDK, you can write data to:
+ a local file system
+ Azure Blob Storage
+ Azure Data Lake Storage

## Spark considerations

When running a data flow in Spark, you must write to an empty folder. Attempting to run a write to an existing folder results in a failure. Make sure your target folder is empty or use a different target location for each run, or the write will fail.

## Monitoring write operations

For your convenience, a sentinel file named SUCCESS is generated once a write is completed. Its presence helps you identify when an intermediate write has completed without having to wait for the whole pipeline to complete.

## Example write code

For this example, start by loading data into a data flow using `auto_read_file()`. You reuse this data with different formats.

```python
import azureml.dataprep as dprep
t = dprep.auto_read_file('./data/fixed_width_file.txt')
t = t.to_number('Column3')
t.head(5)
```

Example output:

| | Column1 | Column2 | Column3 | Column4 | Column5	| Column6 |	Column7	| Column8 |	Column9 |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
|0| 10000.0 | 99999.0 |	None | NO |	NO | ENRS | NaN	| NaN |	NaN |	
|1| 10003.0 | 99999.0 |	None | NO |	NO | ENSO |	NaN | NaN | NaN |	
|2| 10010.0 | 99999.0 |	None | NO |	JN | ENJA |	70933.0 | -8667.0 | 90.0 |
|3| 10013.0 | 99999.0 |	None | NO |	NO |	  |	NaN | NaN |	NaN |
|4| 10014.0 | 99999.0 |	None | NO |	NO | ENSO |	59783.0 | 5350.0 |	500.0|

### Delimited file example

The following code uses the [`write_to_csv()`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.dataflow#write-to-csv-directory-path--datadestination--separator--str--------na--str----na---error--str----error------azureml-dataprep-api-dataflow-dataflow) function to write data to a delimited file.

```python
# Create a new data flow using `write_to_csv` 
write_t = t.write_to_csv(directory_path=dprep.LocalFileOutput('./test_out/'))

# Run the data flow to begin the write operation.
write_t.run_local()

written_files = dprep.read_csv('./test_out/part-*')
written_files.head(5)
```

Example output:

| | Column1 | Column2 | Column3 | Column4 | Column5	| Column6 |	Column7	| Column8 |	Column9 |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
|0| 10000.0 | 99999.0 |	ERROR | NO | NO | ENRS | NaN	| NaN |	NaN |	
|1| 10003.0 | 99999.0 |	ERROR | NO | NO | ENSO |	NaN | NaN | NaN |	
|2| 10010.0 | 99999.0 |	ERROR | NO | JN | ENJA |	70933.0 | -8667.0 | 90.0 |
|3| 10013.0 | 99999.0 |	ERROR | NO | NO |	  |	NaN | NaN |	NaN |
|4| 10014.0 | 99999.0 |	ERROR | NO | NO | ENSO |	59783.0 | 5350.0 |	500.0|

In the preceding output, several errors appear in the numeric columns because of numbers that were not parsed correctly. When written to CSV, null values are replaced with the string "ERROR" by default.

Add parameters as part of your write call and specify a string to use to represent null values.

```python
write_t = t.write_to_csv(directory_path=dprep.LocalFileOutput('./test_out/'), 
                         error='BadData',
                         na='NA')
write_t.run_local()
written_files = dprep.read_csv('./test_out/part-*')
written_files.head(5)
```

The preceding code produces this output:

| | Column1 | Column2 | Column3 | Column4 | Column5	| Column6 |	Column7	| Column8 |	Column9 |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
|0| 10000.0 | 99999.0 |	BadData | NO | NO | ENRS | NaN	| NaN |	NaN |	
|1| 10003.0 | 99999.0 |	BadData | NO | NO | ENSO |	NaN | NaN | NaN |	
|2| 10010.0 | 99999.0 |	BadData | NO | JN | ENJA |	70933.0 | -8667.0 | 90.0 |
|3| 10013.0 | 99999.0 |	BadData | NO | NO |	  |	NaN | NaN |	NaN |
|4| 10014.0 | 99999.0 |	BadData | NO | NO | ENSO |	59783.0 | 5350.0 |	500.0|

### Parquet file example

Similar to `write_to_csv()`, the [`write_to_parquet()`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.dataflow#write-to-parquet-file-path--typing-union--datadestination--nonetype----none--directory-path--typing-union--datadestination--nonetype----none--single-file--bool---false--error--str----error---row-groups--int---0-----azureml-dataprep-api-dataflow-dataflow) function returns a new data flow with a write Parquet step that is executed when the data flow runs.

```python
write_parquet_t = t.write_to_parquet(directory_path=dprep.LocalFileOutput('./test_parquet_out/'),
error='MiscreantData')
```

Run the data flow to start the write operation.

```python
write_parquet_t.run_local()

written_parquet_files = dprep.read_parquet_file('./test_parquet_out/part-*')
written_parquet_files.head(5)
```

The preceding code produces this output:

|   | Column1 | Column2 | Column3 | Column4 | Column5 | Column6 | Column7 | Column8 | Column9 |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |-------- |
|0| 10000.0 | 99999.0 | MiscreantData | NO | NO | ENRS | MiscreantData | MiscreantData | MiscreantData |
|1| 10003.0 | 99999.0 | MiscreantData | NO | NO | ENSO | MiscreantData | MiscreantData | MiscreantData |   
|2| 10010.0 | 99999.0 | MiscreantData | NO| JN| ENJA|   70933.0|    -8667.0 |90.0|
|3| 10013.0 | 99999.0 | MiscreantData | NO| NO| |   MiscreantData|    MiscreantData|    MiscreantData|
|4| 10014.0 | 99999.0 | MiscreantData | NO| NO| ENSO|   59783.0|    5350.0| 500.0|

## Configure data for automated machine learning training

Pass your newly written data file into an [`AutoMLConfig`](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py#automlconfig) object in preparation for automated machine learning training. 

The following code example illustrates how to convert your dataflow to a Pandas dataframe  and subsequently, split it into training and test datasets for automated machine learning training.

```Python
from azureml.train.automl import AutoMLConfig
from sklearn.model_selection import train_test_split

dflow = dprep.auto_read_file(path="")
X_dflow = dflow.keep_columns([feature_1,feature_2, feature_3])
y_dflow = dflow.keep_columns("target")

X_df = X_dflow.to_pandas_dataframe()
y_df = y_dflow.to_pandas_dataframe()

X_train, X_test, y_train, y_test = train_test_split(X_df, y_df, test_size=0.2, random_state=223)

# flatten y_train to 1d array
y_train.values.flatten()

#configure 
automated_ml_config = AutoMLConfig(task = 'regression',
	                           X = X_train.values,  
				   y = y_train.values.flatten(),
				   iterations = 30,
			           Primary_metric = "AUC_weighted",
			           n_cross_validation = 5
			           )

```

If you do not require any intermediate data preparation steps like in the preceding example, you can pass your dataflow directly into `AutoMLConfig`.

```Python
automated_ml_config = AutoMLConfig(task = 'regression', 
				   X = X_dflow,   
				   y = y_dflow, 
				   iterations = 30, 
				   Primary_metric = "AUC_weighted",
				   n_cross_validation = 5
				   )
```

## Next steps
* See the SDK [overview](https://aka.ms/data-prep-sdk) for design patterns and usage examples 
* See the automated machine learning [tutorial](tutorial-auto-train-models.md) for a regression model example
