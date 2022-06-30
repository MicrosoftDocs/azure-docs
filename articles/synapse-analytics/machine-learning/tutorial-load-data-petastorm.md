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

# Load data with Petastorm (Preview)

Petastorm is an open source data access library which enables single-node or distributed training of deep learning models. This library enables training directly from datasets in Apache Parquet format and datasets that have already been loaded as an Apache Spark DataFrame. Petastorm supports popular training frameworks such as Tensorflow and PyTorch.

For more information about Petastorm, you can visit the [Petastorm GitHub page](https://github.com/uber/petastorm) or the [Petastorm API documentation](https://petastorm.readthedocs.io/en/latest).

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

A dataset created using Petastorm is stored in an Apache Parquet format. On top of a Parquet schema, Petastorm also stores higher-level schema information that makes multidimensional arrays into a native part of a Petastorm dataset.

In the sample below, we create a dataset using PySpark. We write the dataset to an Azure Data Lake Storage Gen2 account.

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


output_url = 'abfs://container_name@storage_account_url/data_dir' #use your own adls account info
generate_petastorm_dataset(output_url)
```

## Petastorm read APIs

### Read dataset from a primary storage account

The ```petastorm.reader.Reader``` class is the main entry point for user code that accesses the data from an ML framework such as Tensorflow or Pytorch. You can read a dataset using the ```petastorm.reader.Reader``` class and the ```petastorm.make_reader``` factory method.

In the example below, you can see how you can pass an ```abfs``` URL protocol.

```python
from petastorm import make_reader

#on primary storage associated with the workspace, url can be abbreviated with container path for data directory
with make_reader('abfs://<container_name>/<data directory path>/') as reader:
    for row in reader:
        print(row)
```

### Read dataset from secondary storage account

If you are using an alternative storage account, be sure to set up the [linked service](../../data-factory/concepts-linked-services.md) to automatically authenticate and read from the account. In addition, you will need to modify the following properties below: ```remote_url```, ```account_name```, and ```linked_service_name```.

```python
from petastorm import make_reader

# create sas token for storage account access, use your own adls account info
remote_url = "abfs://container_name@storage_account_url"
account_name = "<<adls account name>>"
linked_service_name = '<<linked service name>>'
TokenLibrary = spark._jvm.com.microsoft.azure.synapse.tokenlibrary.TokenLibrary
sas_token = TokenLibrary.getConnectionString(linked_service_name)

with make_reader('{}/data_directory'.format(remote_url), storage_options = {'sas_token' : sas_token}) as reader:
    for row in reader:
        print(row)
```

### Read dataset in batches

In the example below, you can see how you can pass an ```abfs``` URL protocol to read data in batches. This example uses the ```make_batch_reader``` class. 

```python
from petastorm import make_batch_reader

with make_batch_reader('abfs://<container_name>/<data directory path>/', schema_fields=["value1", "value2"]) as reader:
    for schema_view in reader:
        print("Batched read:\nvalue1: {0} value2: {1}".format(schema_view.value1, schema_view.value2))
```

## PyTorch API

To read a Petastorm dataset from PyTorch, you can use the adapter ```petastorm.pytorch.DataLoader``` class. This allows for custom PyTorch collating functions and transforms to be supplied.

In this example, we will show how Petastorm DataLoader can be used to load a Petastorm dataset with the help of make_reader API. This first section creates the definition of a ```Net``` class and ```train``` and ```test``` function.

```python
from __future__ import division, print_function

import argparse
import pyarrow
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import transforms

from petastorm import make_reader, TransformSpec
from petastorm.pytorch import DataLoader
from pyspark.sql.functions import col

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = F.dropout(x, training=self.training)
        x = self.fc2(x)
        return F.log_softmax(x, dim=1)

def train(model, device, train_loader, log_interval, optimizer, epoch):
    model.train()
    for batch_idx, row in enumerate(train_loader):
        data, target = row['image'].to(device), row['digit'].to(device)
        optimizer.zero_grad()
        output = model(data)
        loss = F.nll_loss(output, target)
        loss.backward()
        optimizer.step()
        if batch_idx % log_interval == 0:
            print('Train Epoch: {} [{}]\tLoss: {:.6f}'.format(
                epoch, batch_idx * len(data), loss.item()))

def test(model, device, test_loader):
    model.eval()
    test_loss = 0
    correct = 0
    count = 0
    with torch.no_grad():
        for row in test_loader:
            data, target = row['image'].to(device), row['digit'].to(device)
            output = model(data)
            test_loss += F.nll_loss(output, target, reduction='sum').item()  # sum up batch loss
            pred = output.max(1, keepdim=True)[1]  # get the index of the max log-probability
            correct += pred.eq(target.view_as(pred)).sum().item()
            count += data.shape[0]
    test_loss /= count
    print('\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
        test_loss, correct, count, 100. * correct / count))

def _transform_row(mnist_row):
    # For this example, the images are stored as simpler ndarray (28,28), but the
    # training network expects 3-dim images, hence the additional lambda transform.
    transform = transforms.Compose([
        transforms.Lambda(lambda nd: nd.reshape(28, 28, 1)),
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))
    ])
    # In addition, the petastorm pytorch DataLoader does not distinguish the notion of
    # data or target transform, but that actually gives the user more flexibility
    # to make the desired partial transform, as shown here.
    result_row = {
        'image': transform(mnist_row['image']),
        'digit': mnist_row['digit']
    }

    return result_row
```

In this example, an Azure Data Lake Storage account is used to store intermediate data. To store this data, you must set up a Linked Service to the storage account and retrieve the following pieces of information: ```remote_url```, ```account_name```, and ```linked_service_name```.

```python
from petastorm import make_reader

# create sas token for storage account access, use your own adls account info
remote_url = "abfs://container_name@storage_account_url"
account_name = "<account name>"
linked_service_name = '<linked service name>'
TokenLibrary = spark._jvm.com.microsoft.azure.synapse.tokenlibrary.TokenLibrary
sas_token = TokenLibrary.getConnectionString(linked_service_name)

# Read Petastorm dataset and apply custom PyTorch transformation functions 

device = torch.device('cpu') #For GPU, it will be torch.device('cuda'). More details: https://pytorch.org/docs/stable/tensor_attributes.html#torch-device

model = Net().to(device)
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.5)

loop_epochs = 1
reader_epochs = 1

transform = TransformSpec(_transform_row, removed_fields=['idx'])

for epoch in range(1, loop_epochs + 1):
    with DataLoader(make_reader('{}/train'.format(remote_url), num_epochs=reader_epochs, transform_spec=transform),batch_size=5) as train_loader:
        train(model, device, train_loader, 10, optimizer, epoch)
    with DataLoader(make_reader('{}/test'.format(remote_url), num_epochs=reader_epochs, transform_spec=transform), batch_size=5) as test_loader:
        test(model, device, test_loader)
```

## Next steps

* [Check out Synapse sample notebooks](https://github.com/Azure-Samples/Synapse/tree/main/MachineLearning)
* [Learn more about GPU-enabled Apache Spark pools](../spark/apache-spark-gpu-concept.md)