---
title: Write data with the Azure Data Prep SDK
description: Learn about writing data with Azure Data Prep SDK
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: how-to
ms.author: cforbe
author: cforbe
ms.date: 08/30/2018
---

# Writing data with the data preparation SDK
It is possible to write out the data at any point in a Dataflow. These writes are added as steps to the resulting Dataflow and will be executed every time the Dataflow is executed. Since there are no limitations to how many write steps there are in a pipeline, this makes it easy to write out intermediate results for troubleshooting or to be picked up by other pipelines. It is important to note that the run of each write results in a full pull of the data in the Dataflow. A Dataflow with three write steps will, for example, read and process every record in the dataset three times.

## Writing to files
Data can be written to files in any of our supported locations (Local File System, Azure Blob Storage, and Azure Data Lake Storage). In order to parallelize the write, the data is written to multiple partition files. A sentinel file named SUCCESS is also output once the write has completed. This makes it possible to identify when an intermediate write has completed without having to wait for the whole pipeline to complete.

When running a Dataflow in Spark, attempting to run a write to an existing folder will fail. It is important to ensure the folder is empty or use a different target location for each run.

The following file formats are currently supported:
-	Delimited Files (CSV, TSV, etc.)
-	Parquet Files

We'll start by loading data into a Dataflow. We will re-use this with different formats.

```

import azureml.dataprep as dprep
t = dprep.smart_read_file('./data/fixed_width_file.txt')
t = t.to_number('Column3')
t.head(10)
```   

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

## Delimited files
The line below creates a new Dataflow with a write step, but the actual write has not been
run yet. When the Dataflow is run, the write will take place.

```
write_t = t.write_to_csv(directory_path=dprep.LocalFileOutput('./test_out/'))
```
We now run the Dataflow, which runs the write operation.
```
write_t.run_local()

written_files = dprep.read_csv('./test_out/part-*')
written_files.head(10)
```
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

The data we wrote out contains several errors in the numeric columns due to numbers that we were unable to parse. When written out to CSV, these are replaced with the string "ERROR" by default. We can parameterize this as part of our write call. In the same vein, it is also possible to set what string to use to represent null values.

```
write_t = t.write_to_csv(directory_path=dprep.LocalFileOutput('./test_out/'), 
                         error='BadData',
                         na='NA')
write_t.run_local()
written_files = dprep.read_csv('./test_out/part-*')
written_files.head(10)
```
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
## Parquet files

 Similarly to `write_to_csv` above, `write_to_parquet` returns a new Dataflow with a write Parquet step which hasn't been executed yet.

```
write_parquet_t = t.write_to_parquet(directory_path=dprep.LocalFileOutput('./test_parquet_out/'),
error='MiscreantData')
```
 We now execute the Dataflow, which executes the write operation.

```
write_parquet_t.run_local()

written_parquet_files = dprep.read_parquet_file('./test_parquet_out/part-*')
written_parquet_files.head(10)
```
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
