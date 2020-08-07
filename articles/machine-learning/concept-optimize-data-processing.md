---
title: Optimize data processing
titleSuffix: Azure Machine Learning
description: Learn best practices for optimizing data processing speeds and what integrations Azure Machine Learning supports for data processing at scale.
services: machine-learning
ms.service: machine-learning
author: sgilley
ms.author: sgilley
ms.subservice: core
ms.reviewer: nibaccam
ms.topic: conceptual
ms.date: 06/26/2020

# Customer intent: As a data scientist I want to optimize data processing speeds at scale
---

# Optimize data processing with Azure Machine Learning

In this article, you learn about best practices to help you optimize data processing speeds locally and at scale.

Azure Machine Learning is integrated with open-source packages and frameworks for data processing. By using these integrations and applying the best practice recommendations in this article, you can improve your data processing speeds both locally and at scale.

## Parquet and CSV file formats

Comma-separated values (csv) files are common file formats for data processing. However, parquet file formats are recommended for machine learning tasks.

[Parquet files](https://parquet.apache.org/) store data in a binary columnar format. This format is useful if splitting up the data into multiple files is needed. Also, this format allows you to target the relevant fields for your machine learning experiments. Instead of having to read in a 20-GB data file, you can decrease that data load, by selecting the necessary columns to train your ML model. Parquet files can also be compressed to minimize processing power and take up less space.

CSV files are commonly used to import and export data, since they're easy to edit and read in Excel. The data in CSVs are stored as strings in a row-based format, and the files can be compressed to lessen data transfer loads. Uncompressed CSVs can expand by a factor of about 2-10 and compressed CSVs can increase even further. So that 5-GB CSV in memory expands to well over the 8 GB of RAM you have on your machine. This compression behavior may increase data transfer latency, which isn't ideal if you have large amounts of data to process. 

## Pandas dataframe

[Pandas dataframes](https://pandas.pydata.org/pandas-docs/stable/getting_started/overview.html) are commonly used for data manipulation and analysis. `Pandas` works well for data sizes less than 1 GB, but processing times for `pandas` dataframes slow down when file sizes reach about 1 GB. This slowdown is because the size of your data in storage isn't the same as the size of data in a dataframe. For instance, data in CSV files can expand up to 10 times in a dataframe, so a 1-GB CSV file can become 10 GB in a dataframe.

`Pandas` is single threaded, meaning operations are done one at a time on a single CPU. You can easily parallelize workloads to multiple virtual CPUs on a single Azure Machine Learning compute instance with packages like [Modin](https://modin.readthedocs.io/en/latest/) that wrap `Pandas` using a distributed backend.

To parallelize your tasks with `Modin` and [Dask](https://dask.org), just change this line of code `import pandas as pd` to `import modin.pandas as pd`.

## Dataframe: out of memory error 

Typically an *out of memory* error occurs when your dataframe expands above the available RAM on your machine. This concept also applies to a distributed framework like `Modin` or `Dask`.  That is, your operation attempts to load the dataframe in memory on each node in your cluster, but not enough RAM is available to do so.

One solution is to increase your RAM to fit the dataframe in memory. We recommend your compute size and processing power contain two times the size of RAM. So if your dataframe is 10 GB, use a compute target with at least 20 GB of RAM to ensure that the dataframe can comfortably fit in memory and be processed. 

For multiple virtual CPUs, vCPU, keep in mind that you want one partition to comfortably fit into the RAM each vCPU can have on the machine. That is, if you have 16-GB RAM 4 vCPUs, you want  about 2-GB dataframes per each vCPU.

### Minimize CPU workloads

If you can't add more RAM to your machine, you can apply the following techniques to help minimize CPU workloads and optimize processing times. These recommendations pertain to both single and distributed systems.

Technique | Description
----|----
Compression | Use a different representation for your data, in a way that uses less memory and  doesn't significantly impact the results of your calculation.<br><br>*Example:* Instead of storing entries as a string with about 10 bytes or more per entry, store them as a boolean, True or False, which you could store in 1 byte.
Chunking | Load data into memory in subsets (chunks), processing the data one subset at time, or multiple subsets in parallel. This method works best if you need to process all the data, but don't need to load all the data into memory at once. <br><br>*Example:* Instead of processing a full year's worth of data at once, load and process the data one month at a time.
Indexing | Apply and use an index, a summary that tells you where to find the data you care about. Indexing is useful when you only need to use a subset of the data, instead of the full set<br><br>*Example:* If you have a full year's worth of sales data sorted by month, an index helps you quickly search for the desired month that you wish to process.

## Scale data processing

If the previous recommendations aren't enough, and you can't get a virtual machine that fits your data, you can, 

* Use a framework like `Spark` or `Dask` to process the data 'out of memory'. In this option, the dataframe is loaded into RAM partition by partition and processed, with the final result being gathered at the end.  

* Scale out to a cluster using a distributed framework. In this option, data processing loads are split up and processed on multiple CPUs that work in parallel, with the final result gathered at the end.


### Recommended distributed frameworks

The following table recommends distributed frameworks that are integrated with Azure Machine Learning based on your code preference or data size.

Experience or data size | Recommendation
------|------
If you're familiar with `Pandas`| `Modin` or `Dask` dataframe
If you prefer `Spark` | `PySpark`
For data less than 1 GB | `Pandas` locally **or** a remote Azure Machine Learning compute instance
For data larger than 10 GB| Move to a cluster using `Ray`, `Dask`, or `Spark`

You can create `Dask` clusters on Azure ML compute cluster with the [dask-cloudprovider](https://cloudprovider.dask.org/en/latest/#azure) package. Or you can run `Dask` locally on a compute instance.

## Next steps

* [Data ingestion options with Azure Machine Learning](concept-data-ingestion.md).
* [Data ingestion with Azure Data Factory](how-to-data-ingest-adf.md).
