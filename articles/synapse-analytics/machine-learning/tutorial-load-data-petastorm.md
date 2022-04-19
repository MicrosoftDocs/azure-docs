---
title: 'Load data with Petastorm'
description: This article provides a conceptual overview of how to load data with Petastorm.
author: midesa
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: machine-learning
ms.date: 04/19/2022
ms.author: midesa
---

# Load data with Petastorm

Petastorm is an open source data access library which enables single-node or distributed training of deep learning models. This library enables training directly from datasets in Apache Parquet format and datasets that have already been loaded as an Apache Spark DataFrame. Petastorm supports popular training frameworks such as Tensorflow and PyTorch.

For more information about Petastorm, you can visit the [Petastorm GitHub page](https://github.com/uber/petastorm) or the [Petastorm API documentation](https://petastorm.readthedocs.io/latest).

## Prerequisites

- [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Create a GPU-enabled Apache Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a GPU-enabled Apache Spark pool in Azure Synapse](../spark/apache-spark-gpu-concept.md). For this tutorial, we suggest using the GPU-Large cluster size with 3 nodes.

## Configure the Apache Spark session

At the start of the session, we will need to configure a few Apache Spark settings. In most cases, we only needs to set the ```numExecutors``` and ```spark.rapids.memory.gpu.reserve```. In the example below, you can see how the Spark configurations can be passed with the ```%%configure``` command. The detailed meaning of each parameter is explained in the [Apache Spark configuration documentation](https://spark.apache.org/docs/latest/configuration.html).

```python
%%configure -f
{
    "numExecutors": 3,
    "conf":{
        "spark.rapids.memory.gpu.reserve": "10g"
   }
}
```

## Petastorm write APIs
A dataset created using Petastorm is stored in Apache Parquet format. On top of a Parquet schema, petastorm also stores higher-level schema information that makes multidimensional arrays into a native part of a petastorm dataset.

Generating a dataset is done using PySpark. PySpark natively supports Parquet format, making it easy to run on a single machine or on a Spark compute cluster.

This notebook shows an example of creating a dataset in adls and writing to it with some random data.

```python
import numpy as np
from pyspark.sql import SparkSession
from pyspark.sql.types import IntegerType

from petastorm.codecs import ScalarCodec, CompressedImageCodec, NdarrayCodec
from petastorm.etl.dataset_metadata import materialize_dataset
from petastorm.unischema import dict_to_spark_row, Unischema, UnischemaField

# The schema defines how the dataset schema looks like
HelloWorldSchema = Unischema('HelloWorldSchema', [
    UnischemaField('id', np.int32, (), ScalarCodec(IntegerType()), False),
    UnischemaField('image1', np.uint8, (128, 256, 3), CompressedImageCodec('png'), False),
    UnischemaField('array_4d', np.uint8, (None, 128, 30, None), NdarrayCodec(), False),
])


def row_generator(x):
    """Returns a single entry in the generated dataset. Return a bunch of random values as an example."""
    return {'id': x,
            'image1': np.random.randint(0, 255, dtype=np.uint8, size=(128, 256, 3)),
            'array_4d': np.random.randint(0, 255, dtype=np.uint8, size=(4, 128, 30, 3))}


def generate_petastorm_dataset(output_url):
    rowgroup_size_mb = 256

    spark = SparkSession.builder.config('spark.driver.memory', '2g').master('local[2]').getOrCreate()
    sc = spark.sparkContext

    # Wrap dataset materialization portion. Will take care of setting up spark environment variables as
    # well as save petastorm specific metadata
    rows_count = 10
    with materialize_dataset(spark, output_url, HelloWorldSchema, rowgroup_size_mb):

        rows_rdd = sc.parallelize(range(rows_count))\
            .map(row_generator)\
            .map(lambda x: dict_to_spark_row(HelloWorldSchema, x))

        spark.createDataFrame(rows_rdd, HelloWorldSchema.as_spark_schema()) \
            .coalesce(10) \
            .write \
            .mode('overwrite') \
            .parquet(output_url)


if __name__ == '__main__':
    output_url = 'abfs://container_name@storage_account_url/data_dir' #use your own adls account info
    generate_petastorm_dataset(output_url)
```

## Petastorm read APIs

### Read dataset in primary ADLS

```python
from petastorm import make_reader

#on primary storage associated with the workspace, url can be abbreviated with container path for data directory
with make_reader('abfs://<container_name>/<data directory path>/') as reader:
    for row in reader:
        print(row)
```

### Read dataset in non-primary adls

We will need the Azure Data Lake Storage (ADLS) account for storing intermediate and model data. If you are using an alternative storage account, be sure to set up the [linked service](https://docs.microsoft.com/azure/data-factory/concepts-linked-services?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=data-factory) to automatically authenticate and read from the account. In addition, you will need to modify the following properties below: ```remote_url```, ```account_name```, and ```linked_service_name```.

```python
from petastorm import make_reader

# create sas token for storage account access, use your own adls account info
remote_url = "abfs://default@adls4synapsemlgpu.dfs.core.windows.net"
account_name = "adls4synapsemlgpu"
linked_service_name = 'adls4synapsemlgpu'
TokenLibrary = spark._jvm.com.microsoft.azure.synapse.tokenlibrary.TokenLibrary
sas_token = TokenLibrary.getConnectionString(linked_service_name)

with make_reader('{}/data_directory'.format(remote_url), storage_options = {'sas_token' : sas_token}) as reader:
    for row in reader:
        print(row)
```

### Read dataset in batches with schema on primary storage

```python
from petastorm import make_batch_reader

with make_batch_reader('abfs://<container_name>/<data directory path>/', schema_fields=["value1", "value2"]) as reader:
    for schema_view in reader:
        print("Batched read:\nvalue1: {0} value2: {1}".format(schema_view.value1, schema_view.value2))
```

## Petastorm DataLoader

Load Parquet files directly using Petastorm. Reading a petastorm dataset from pytorch can be done via the adapter class petastorm.pytorch.DataLoader, which allows custom pytorch collating function and transforms to be supplied.

This notebook is an example of how Petastorm DataLoader can be used to load a Petastorm dataset with the help of make_reader API.

```python

```

## Next steps

* [Check out Synapse sample notebooks](https://github.com/Azure-Samples/Synapse/tree/main/MachineLearning)
* [Learn more about GPU-enabled Apache Spark pools](../spark/apache-spark-gpu-concept.md)