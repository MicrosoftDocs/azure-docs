---
title: 'Tutorial: Distributed training with Horovod and PyTorch'
description: Tutorial on how to run distributed training with the Horovod Estimator and PyTorch
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: tutorial
ms.date: 04/19/2022
author: midesa
ms.author: midesa
---

# Tutorial: Distributed Training with Horovod Estimator and PyTorch (Preview)

[Horovod](https://github.com/horovod/horovod) is a distributed training framework for libraries like TensorFlow and PyTorch. With Horovod, users can scale up an existing training script to run on hundreds of GPUs in just a few lines of code.

Within Azure Synapse Analytics, users can quickly get started with Horovod using the default Apache Spark 3 runtime.For Spark ML pipeline applications using PyTorch, users can use the horovod.spark estimator API. This notebook uses an Apache Spark dataframe to perform distributed training of a distributed neural network (DNN) model on MNIST dataset. This tutorial leverages PyTorch and the Horovod Estimator to run the training process.

## Prerequisites

- [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Create a GPU-enabled Apache Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a GPU-enabled Apache Spark pool in Azure Synapse](../spark/apache-spark-gpu-concept.md). For this tutorial, we suggest using the GPU-Large cluster size with 3 nodes.

## Configure the Apache Spark session

At the start of the session, we will need to configure a few Apache Spark settings. In most cases, we only needs to set the numExecutors and spark.rapids.memory.gpu.reserve. For very large models, users may also need to configure the  ```spark.kryoserializer.buffer.max``` setting. For Tensorflow models, users will need to set the ```spark.executorEnv.TF_FORCE_GPU_ALLOW_GROWTH``` to be true.

In the example below, you can see how the Spark configurations can be passed with the ```%%configure``` command. The detailed meaning of each parameter is explained in the [Apache Spark configuration documentation](https://spark.apache.org/docs/latest/configuration.html). The values provided below are the suggested, best practice values for Azure Synapse GPU-large pools.  

```spark

%%configure -f
{
    "driverMemory": "30g",
    "driverCores": 4,
    "executorMemory": "60g",
    "executorCores": 12,
    "numExecutors": 3,
    "conf":{
        "spark.rapids.memory.gpu.reserve": "10g",
        "spark.executorEnv.TF_FORCE_GPU_ALLOW_GROWTH": "true",
        "spark.kryoserializer.buffer.max": "2000m"
   }
}
```

For this tutorial, we will use the following configurations:

```python

%%configure -f
{
    "numExecutors": 3,
    "conf":{
        "spark.rapids.memory.gpu.reserve": "10g"
   }
}
```

> [!NOTE]
> When training with Horovod, users should set the Spark configuration for ```numExecutors``` to be less or equal to the number of nodes.

## Import dependencies

In this tutorial, we will leverage PySpark to read and process the dataset. We will then use PyTorch and Horovod to build the distributed neural network (DNN) model and run the training process. To get started, we will need to import the following dependencies:

```python
# base libs
import sys
import uuid

# numpy
import numpy as np

# pyspark related
import pyspark
import pyspark.sql.types as T
from pyspark.ml.evaluation import MulticlassClassificationEvaluator
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf

# pytorch related
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

# horovod related
import horovod.spark.torch as hvd
from horovod.spark.common.backend import SparkBackend
from horovod.spark.common.store import Store

# azure related
from azure.synapse.ml.horovodutils import AdlsStore
```

## Connect to alternative storage account

We will need the Azure Data Lake Storage (ADLS) account for storing intermediate and model data. If you are using an alternative storage account, be sure to set up the [linked service](../../data-factory/concepts-linked-services.md) to automatically authenticate and read from the account. In addition, you will need to modify the following properties below: ```remote_url```, ```account_name```, and ```linked_service_name```.

```python
num_proc = 3  # equal to numExecutors
batch_size = 128
epochs = 3
lr_single_node = 0.01  # learning rate for single node code

uuid_str = str(uuid.uuid4())  # with uuid, each run will use a new directory
work_dir = '/tmp/' + uuid_str

# create adls store for model training, use your own adls account info
remote_url = "<<ABFS path to storage account>>"
account_name = "<<name of storage account>>"
linked_service_name = "<<name of linked service>>"
sas_token = TokenLibrary.getConnectionString(linked_service_name)
adls_store_path = remote_url + work_dir

store = AdlsStore.create(adls_store_path,
                         storage_options={
                             'account_name': account_name,
                             'sas_token': sas_token
                         },
                         save_runs=True)

print(adls_store_path)
```

## Prepare dataset

Next, we will prepare the dataset for training. In this tutorial, we will use the MNIST dataset from [Azure Open Datasets](../../open-datasets/dataset-mnist.md?tabs=azureml-opendatasets).

```python
# Initialize SparkSession
spark = SparkSession.builder.getOrCreate()

# Download MNIST dataset from Azure Open Datasets
from azureml.opendatasets import MNIST

mnist = MNIST.get_tabular_dataset()
mnist_df = mnist.to_pandas_dataframe()
mnist_df.info()

# Preprocess dataset
mnist_df['features'] = mnist_df.iloc[:, :784].values.tolist()
mnist_df.drop(mnist_df.iloc[:, :784], inplace=True, axis=1)
mnist_df.head()
```

## Process data with Apache Spark

Now, we will create an Apache Spark dataframe. This dataframe will be used with the ```HorovodEstimator``` for training.

```python
# Create Spark DataFrame for training
df = spark.createDataFrame(mnist_df)

# repartition DataFrame for training
train_df = df.repartition(num_proc)

# Train/test split
train_df, test_df = train_df.randomSplit([0.9, 0.1])

# show the dataset
train_df.show()
train_df.count()
```

## Define DNN model

Once we have finished processing our dataset, we can now define our PyTorch model. The same code could also be used to train a single-node PyTorch model.

```python
# Define the PyTorch model without any Horovod-specific parameters
class Net(nn.Module):

    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = x.float()
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = F.dropout(x, training=self.training)
        x = self.fc2(x)
        return F.log_softmax(x)


model = Net()
optimizer = optim.SGD(model.parameters(),
                      lr=lr_single_node * num_proc,
                      momentum=0.5)  # notice the lr is scaled up
loss = nn.NLLLoss()

```

## Train model

Now, we can train a Horovod Spark estimator on top of our Apache Spark dataframe.  
```python
# Train a Horovod Spark Estimator on the DataFrame
backend = SparkBackend(num_proc=num_proc,
                       stdout=sys.stdout,
                       stderr=sys.stderr,
                       prefix_output_with_timestamp=True)

torch_estimator = hvd.TorchEstimator(
    backend=backend,
    store=store,
    partitions_per_process=1,  # important for GPU training
    model=model,
    optimizer=optimizer,
    loss=lambda input, target: loss(input, target.long()),
    input_shapes=[[-1, 1, 28, 28]],
    feature_cols=['features'],
    label_cols=['label'],
    batch_size=batch_size,
    epochs=epochs,
    validation=0.1,
    verbose=2)

torch_model = torch_estimator.fit(train_df).setOutputCols(['label_prob'])
```

## Evaluate trained model

Once the training process has finished, we can then evaluate the model on the test dataset. 

```python
# Evaluate the model on the held-out test DataFrame
pred_df = torch_model.transform(test_df)

argmax = udf(lambda v: float(np.argmax(v)), returnType=T.DoubleType())
pred_df = pred_df.withColumn('label_pred', argmax(pred_df.label_prob))
evaluator = MulticlassClassificationEvaluator(predictionCol='label_pred',
                                              labelCol='label',
                                              metricName='accuracy')

print('Test accuracy:', evaluator.evaluate(pred_df))
```

## Clean up resources

To ensure the Spark instance is shut down, end any connected sessions(notebooks). The pool shuts down when the **idle time** specified in the Apache Spark pool is reached. You can also select **stop session** from the status bar at the upper right of the notebook.

![Screenshot showing the Stop session button on the status bar.](./media/tutorial-build-applications-use-mmlspark/stop-session.png)

## Next steps

* [Check out Synapse sample notebooks](https://github.com/Azure-Samples/Synapse/tree/main/MachineLearning)
* [Learn more about GPU-enabled Apache Spark pools](../spark/apache-spark-gpu-concept.md)
