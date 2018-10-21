---
title: Write data with the Azure Machine Learning Data Prep SDK - Python
description: Learn about writing data with Azure Machine Learning Data Prep SDK. You can write out data at any point in a data flow, and to files in any of our supported locations (local file system, Azure Blob Storage, and Azure Data Lake Storage).
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: cforbe
author: cforbe
manager: cgronlun
ms.reviewer: jmartens
ms.date: 09/24/2018
---
# Write data using the Azure Machine Learning Data Prep SDK
You can write out data at any point in a data flow. These writes are added as steps to the resulting data flow and are run every time the data flow is. Data is written to multiple partition files to allow parallel writes.

Since there are no limitations to how many write steps there are in a pipeline, you can easily add additional write steps to get intermediate results for troubleshooting or for other pipelines. 

Each time you run a write step, a full pull of the data in the data flow occurs. For example, a data flow with three write steps will read and process every record in the dataset three times.

## Supported data types and location

The following file formats are supported
-	Delimited files (CSV, TSV, etc.)
-	Parquet files

Using the [Azure Machine Learning Data Prep python SDK](https://aka.ms/data-prep-sdk), you can write data to:
+ a local file system
+ Azure Blob Storage
+ Azure Data Lake Storage

## Spark considerations
When running a data flow in Spark, you must write to an empty folder. Attempting to run a write to an existing folder results in a failure. Make sure your target folder is empty or use a different target location for each run, or the write will fail.

## Monitoring write operations
For your convenience, a sentinel file named SUCCESS is generated once a write is completed. Its presence helps you identify when an intermediate write has completed without having to wait for the whole pipeline to complete.

## Example write code

For this example, start by loading data into a data flow. We will reuse this data with different formats.

```python
import azureml.dataprep as dprep
t = dprep.smart_read_file('./data/fixed_width_file.txt')
t = t.to_number('Column3')
t.head(10)
```   

Example output:
|   |  Column1 |	Column2	| Column3 |	Column4	 |Column5	| Column6 |	Column7	| Column8 |	Column9 |
| -------- |  -------- | -------- | -------- |  -------- |  -------- |  -------- |  -------- |  -------- |  -------- |
| 0 |	10000.0	|	99999.0	|	None|		NO|		NO	|	ENRS	|NaN	|	NaN	|	NaN|	
|	1|		10003.0	|	99999.0	|	None|		NO|		NO	|	ENSO|		NaN|		NaN	|NaN|	
|	2|	10010.0|	99999.0|	None|	NO|	JN|	ENJA|	70933.0|	-8667.0	|90.0|
|3|	10013.0|	99999.0|	None|	NO|	NO|	|	NaN|	NaN|	NaN|
|4|	10014.0|	99999.0|	None|	NO|	NO|	ENSO|	59783.0|	5350.0|	500.0|
|5|	10015.0|	99999.0|	None|	NO|	NO|	ENBL|	61383.0|	5867.0|	3270.0|
|6|	10016.0	|99999.0|	None|	NO|	NO|		|64850.0|	11233.0|	140.0|
|7|	10017.0|	99999.0|	None|	NO|	NO|	ENFR|	59933.0|	2417.0|	480.0|
|8|	10020.0|	99999.0|	None|	NO|	SV|		|80050.0|	16250.0|	80.0|
|9|	10030.0|	99999.0|	None|	NO|	SV|		|77000.0|	15500.0|	120.0|

### Delimited file example

In this section, you can see an example using the `write_to_csv` function to write with a delimited file.

```python
# Create a new data flow using `write_to_csv` 
write_t = t.write_to_csv(directory_path=dprep.LocalFileOutput('./test_out/'))

# Run the data flow to begin the write operation.
write_t.run_local()

written_files = dprep.read_csv('./test_out/part-*')
written_files.head(10)
```

Example output:
|   |  Column1 |    Column2 | Column3 | Column4  |Column5   | Column6 | Column7 | Column8 | Column9 |
| -------- |  -------- | -------- | -------- |  -------- |  -------- |  -------- |  -------- |  -------- |  -------- |
| 0 |   10000.0 |   99999.0 |   ERROR |       NO|     NO  |   ENRS    |ERROR    |   ERROR |   ERROR|    
|   1|      10003.0 |   99999.0 |   ERROR |       NO|     NO  |   ENSO|       ERROR|        ERROR |ERROR|   
|   2|  10010.0|    99999.0|    ERROR |   NO| JN| ENJA|   70933.0|    -8667.0 |90.0|
|3| 10013.0|    99999.0|    ERROR |   NO| NO| |   ERROR|    ERROR|    ERROR|
|4| 10014.0|    99999.0|    ERROR |   NO| NO| ENSO|   59783.0|    5350.0| 500.0|
|5| 10015.0|    99999.0|    ERROR |   NO| NO| ENBL|   61383.0|    5867.0| 3270.0|
|6| 10016.0 |99999.0|   ERROR |   NO| NO|     |64850.0|   11233.0|    140.0|
|7| 10017.0|    99999.0|    ERROR |   NO| NO| ENFR|   59933.0|    2417.0| 480.0|
|8| 10020.0|    99999.0|    ERROR |   NO| SV|     |80050.0|   16250.0|    80.0|
|9| 10030.0|    99999.0|    ERROR |   NO| SV|     |77000.0|   15500.0|    120.0|

You can see in the preceding output, that several errors appear in the numeric columns because of numbers that were not parsed correctly. When written to CSV, these null values are replaced with the string "ERROR" by default. 

You can add parameters as part of your write call and specify a string to use to represent null values. For example:

```python
write_t = t.write_to_csv(directory_path=dprep.LocalFileOutput('./test_out/'), 
                         error='BadData',
                         na='NA')
write_t.run_local()
written_files = dprep.read_csv('./test_out/part-*')
written_files.head(10)
```

The preceding code produces this output:
|   |  Column1 |    Column2 | Column3 | Column4  |Column5   | Column6 | Column7 | Column8 | Column9 |
| -------- |  -------- | -------- | -------- |  -------- |  -------- |  -------- |  -------- |  -------- |  -------- |
| 0 |   10000.0 |   99999.0 |   BadData |       NO|     NO  |   ENRS    |BadData    |   BadData |   BadData|    
|   1|      10003.0 |   99999.0 |   BadData |       NO|     NO  |   ENSO|       BadData|        BadData |BadData|   
|   2|  10010.0|    99999.0|    BadData |   NO| JN| ENJA|   70933.0|    -8667.0 |90.0|
|3| 10013.0|    99999.0|    BadData |   NO| NO| |   BadData|    BadData|    BadData|
|4| 10014.0|    99999.0|    BadData |   NO| NO| ENSO|   59783.0|    5350.0| 500.0|
|5| 10015.0|    99999.0|    BadData |   NO| NO| ENBL|   61383.0|    5867.0| 3270.0|
|6| 10016.0 |99999.0|   BadData |   NO| NO|     |64850.0|   11233.0|    140.0|
|7| 10017.0|    99999.0|    BadData |   NO| NO| ENFR|   59933.0|    2417.0| 480.0|
|8| 10020.0|    99999.0|    BadData |   NO| SV|     |80050.0|   16250.0|    80.0|
|9| 10030.0|    99999.0|    BadData |   NO| SV|     |77000.0|   15500.0|    120.0|


### Parquet file example

Similar to `write_to_csv`, the `write_to_parquet` function returns a new data flow with a write Parquet step that is executed when the data flow runs.

```python
write_parquet_t = t.write_to_parquet(directory_path=dprep.LocalFileOutput('./test_parquet_out/'),
error='MiscreantData')
```

Next, you can run the data flow to start the write operation.

```
write_parquet_t.run_local()

written_parquet_files = dprep.read_parquet_file('./test_parquet_out/part-*')
written_parquet_files.head(10)
```

The preceding code produces this output:
|   |  Column1 |    Column2 | Column3 | Column4  |Column5   | Column6 | Column7 | Column8 | Column9 |
| -------- |  -------- | -------- | -------- |  -------- |  -------- |  -------- |  -------- |  -------- |  -------- |
| 0 |   10000.0 |   99999.0 |   MiscreantData |       NO|     NO  |   ENRS    |MiscreantData    |   MiscreantData |   MiscreantData|    
|   1|      10003.0 |   99999.0 |   MiscreantData |       NO|     NO  |   ENSO|       MiscreantData|        MiscreantData |MiscreantData|   
|   2|  10010.0|    99999.0|    MiscreantData |   NO| JN| ENJA|   70933.0|    -8667.0 |90.0|
|3| 10013.0|    99999.0|    MiscreantData |   NO| NO| |   MiscreantData|    MiscreantData|    MiscreantData|
|4| 10014.0|    99999.0|    MiscreantData |   NO| NO| ENSO|   59783.0|    5350.0| 500.0|
|5| 10015.0|    99999.0|    MiscreantData |   NO| NO| ENBL|   61383.0|    5867.0| 3270.0|
|6| 10016.0 |99999.0|   MiscreantData |   NO| NO|     |64850.0|   11233.0|    140.0|
|7| 10017.0|    99999.0|    MiscreantData |   NO| NO| ENFR|   59933.0|    2417.0| 480.0|
|8| 10020.0|    99999.0|    MiscreantData |   NO| SV|     |80050.0|   16250.0|    80.0|
|9| 10030.0|    99999.0|    MiscreantData |   NO| SV|     |77000.0|   15500.0|    120.0|
