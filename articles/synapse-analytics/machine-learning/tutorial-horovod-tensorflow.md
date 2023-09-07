---
title: 'Tutorial: Distributed training with Horovod and TensorFlow'
description: Tutorial on how to run distributed training with the Horovod Runner and TensorFlow
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: tutorial
ms.date: 04/19/2022
author: midesa
ms.author: midesa
---

# Tutorial: Distributed Training with Horovod Runner and TensorFlow (Preview)

[Horovod](https://github.com/horovod/horovod) is a distributed training framework for libraries like TensorFlow and PyTorch. With Horovod, users can scale up an existing training script to run on hundreds of GPUs in just a few lines of code. 

Within Azure Synapse Analytics, users can quickly get started with Horovod using the default Apache Spark 3 runtime.For Spark ML pipeline applications using TensorFlow, users can use ```HorovodRunner```. This notebook uses an Apache Spark dataframe to perform distributed training of a distributed neural network (DNN) model on MNIST dataset. This tutorial leverages TensorFlow and the ```HorovodRunner``` to run the training process.

## Prerequisites

- [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Create a GPU-enabled Apache Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a GPU-enabled Apache Spark pool in Azure Synapse](../spark/apache-spark-gpu-concept.md). For this tutorial, we suggest using the GPU-Large cluster size with 3 nodes.

## Configure the Apache Spark session

At the start of the session, we will need to configure a few Apache Spark settings. In most cases, we only needs to set the ```numExecutors``` and ```spark.rapids.memory.gpu.reserve```. For very large models, users may also need to configure the  ```spark.kryoserializer.buffer.max``` setting. For TensorFlow models, users will need to set the ```spark.executorEnv.TF_FORCE_GPU_ALLOW_GROWTH``` to be true.

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
        "spark.rapids.memory.gpu.reserve": "10g",
        "spark.executorEnv.TF_FORCE_GPU_ALLOW_GROWTH": "true"
   }
}
```

> [!NOTE]
> When training with Horovod, users should set the Spark configuration for ```numExecutors``` to be less or equal to the number of nodes.

## Setup primary storage account

We will need the Azure Data Lake Storage (ADLS) account for storing intermediate and model data. If you are using an alternative storage account, be sure to set up the [linked service](../../data-factory/concepts-linked-services.md) to automatically authenticate and read from the account. 

In this example, we will read from the primary Azure Synapse Analytics storage account. To do this, you will need to modify the following properties below: ```remote_url```.

```python
# Specify training parameters
num_proc = 3  # equal to numExecutors
batch_size = 128
epochs = 3
lr_single_node = 0.1  # learning rate for single node code

# configure adls store remote url
remote_url = "<<abfss path to storage account>>
```

## Prepare dataset

Next, we will prepare the dataset for training. In this tutorial, we will use the MNIST dataset from [Azure Open Datasets](../../open-datasets/dataset-mnist.md?tabs=azureml-opendatasets).

```python
def get_dataset(rank=0, size=1):
    # import dependency libs
    from azureml.opendatasets import MNIST
    from sklearn.preprocessing import OneHotEncoder
    import numpy as np

    # Download MNIST dataset from Azure Open Datasets
    mnist = MNIST.get_tabular_dataset()
    mnist_df = mnist.to_pandas_dataframe()

    # Preprocess dataset
    mnist_df['features'] = mnist_df.iloc[:, :784].values.tolist()
    mnist_df.drop(mnist_df.iloc[:, :784], inplace=True, axis=1)

    x = np.array(mnist_df['features'].values.tolist())
    y = np.array(mnist_df['label'].values.tolist()).reshape(-1, 1)

    enc = OneHotEncoder()
    enc.fit(y)
    y = enc.transform(y).toarray()

    (x_train, y_train), (x_test, y_test) = (x[:60000], y[:60000]), (x[60000:],
                                                                    y[60000:])

    # Prepare dataset for distributed training
    x_train = x_train[rank::size]
    y_train = y_train[rank::size]
    x_test = x_test[rank::size]
    y_test = y_test[rank::size]

    # Reshape and Normalize data for model input
    x_train = x_train.reshape(x_train.shape[0], 28, 28, 1)
    x_test = x_test.reshape(x_test.shape[0], 28, 28, 1)
    x_train = x_train.astype('float32')
    x_test = x_test.astype('float32')
    x_train /= 255.0
    x_test /= 255.0

    return (x_train, y_train), (x_test, y_test)

```

## Define DNN model

Once we have finished processing our dataset, we can now define our TensorFlow model. The same code could also be used to train a single-node TensorFlow model.

```python
# Define the TensorFlow model without any Horovod-specific parameters
def get_model():
    from tensorflow.keras import models
    from tensorflow.keras import layers

    model = models.Sequential()
    model.add(
        layers.Conv2D(32,
                      kernel_size=(3, 3),
                      activation='relu',
                      input_shape=(28, 28, 1)))
    model.add(layers.Conv2D(64, (3, 3), activation='relu'))
    model.add(layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(layers.Dropout(0.25))
    model.add(layers.Flatten())
    model.add(layers.Dense(128, activation='relu'))
    model.add(layers.Dropout(0.5))
    model.add(layers.Dense(10, activation='softmax'))
    return model

```

## Define a training function for a single node

First, we will train our TensorFlow model on the driver node of the Apache Spark pool. Once we have finished the training process, we will evaluate the model and print the loss and accuracy scores.

```python

def train(learning_rate=0.1):
    import tensorflow as tf
    from tensorflow import keras

    gpus = tf.config.experimental.list_physical_devices('GPU')
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)

    # Prepare dataset
    (x_train, y_train), (x_test, y_test) = get_dataset()

    # Initialize model
    model = get_model()

    # Specify the optimizer (Adadelta in this example)
    optimizer = keras.optimizers.Adadelta(learning_rate=learning_rate)

    model.compile(optimizer=optimizer,
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    model.fit(x_train,
              y_train,
              batch_size=batch_size,
              epochs=epochs,
              verbose=2,
              validation_data=(x_test, y_test))
    return model

# Run the training process on the driver
model = train(learning_rate=lr_single_node)

# Evaluate the single node, trained model
_, (x_test, y_test) = get_dataset()
loss, accuracy = model.evaluate(x_test, y_test, batch_size=128)
print("loss:", loss)
print("accuracy:", accuracy)

```

## Migrate to HorovodRunner for distributed training

Next, we will take a look at how the same code could be re-run using ```HorovodRunner``` for distributed training.

### Define training function

To do this, we will first define a training function for ```HorovodRunner```.

```python
# Define training function for Horovod runner
def train_hvd(learning_rate=0.1):
    # Import base libs
    import tempfile
    import os
    import shutil
    import atexit

    # Import tensorflow modules to each worker
    import tensorflow as tf
    from tensorflow import keras
    import horovod.tensorflow.keras as hvd

    # Initialize Horovod
    hvd.init()

    # Pin GPU to be used to process local rank (one GPU per process)
    # These steps are skipped on a CPU cluster
    gpus = tf.config.experimental.list_physical_devices('GPU')
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
    if gpus:
        tf.config.experimental.set_visible_devices(gpus[hvd.local_rank()],
                                                   'GPU')

    # Call the get_dataset function you created, this time with the Horovod rank and size
    (x_train, y_train), (x_test, y_test) = get_dataset(hvd.rank(), hvd.size())

    # Initialize model with random weights
    model = get_model()

    # Adjust learning rate based on number of GPUs
    optimizer = keras.optimizers.Adadelta(learning_rate=learning_rate *
                                          hvd.size())

    # Use the Horovod Distributed Optimizer
    optimizer = hvd.DistributedOptimizer(optimizer)

    model.compile(optimizer=optimizer,
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    # Create a callback to broadcast the initial variable states from rank 0 to all other processes.
    # This is required to ensure consistent initialization of all workers when training is started with random weights or restored from a checkpoint.
    callbacks = [
        hvd.callbacks.BroadcastGlobalVariablesCallback(0),
    ]

    # Model checkpoint location.
    ckpt_dir = tempfile.mkdtemp()
    ckpt_file = os.path.join(ckpt_dir, 'checkpoint.h5')
    atexit.register(lambda: shutil.rmtree(ckpt_dir))

    # Save checkpoints only on worker 0 to prevent conflicts between workers
    if hvd.rank() == 0:
        callbacks.append(
            keras.callbacks.ModelCheckpoint(ckpt_file,
                                            monitor='val_loss',
                                            mode='min',
                                            save_best_only=True))

    model.fit(x_train,
              y_train,
              batch_size=batch_size,
              callbacks=callbacks,
              epochs=epochs,
              verbose=2,
              validation_data=(x_test, y_test))

    # Return model bytes only on worker 0
    if hvd.rank() == 0:
        with open(ckpt_file, 'rb') as f:
            return f.read()

```

### Run training

Once we have defined the model, we will run the training process. 

```python
# Run training
import os
import sys
import horovod.spark


best_model_bytes = \
    horovod.spark.run(train_hvd, args=(lr_single_node, ), num_proc=num_proc,
                    env=os.environ.copy(),
                    stdout=sys.stdout, stderr=sys.stderr, verbose=2,
                    prefix_output_with_timestamp=True)[0]
```

### Save checkpoints to ADLS storage

The code below shows how to save the checkpoints to the Azure Data Lake Storage (ADLS) account.

```python
import tempfile
import fsspec
import os

local_ckpt_dir = tempfile.mkdtemp()
local_ckpt_file = os.path.join(local_ckpt_dir, 'mnist-ckpt.h5')
adls_ckpt_file = remote_url + local_ckpt_file

with open(local_ckpt_file, 'wb') as f:
    f.write(best_model_bytes)

## Upload local file to ADLS
fs = fsspec.filesystem('abfss')
fs.upload(local_ckpt_file, adls_ckpt_file)

print(adls_ckpt_file)
```

### Evaluate Horovod trained model

Once we have finished training our model, we can then take a look at the loss and accuracy for the final model. 

```python
import tensorflow as tf

hvd_model = tf.keras.models.load_model(local_ckpt_file)

_, (x_test, y_test) = get_dataset()
loss, accuracy = hvd_model.evaluate(x_test, y_test, batch_size=128)
print("loaded model loss and accuracy:", loss, accuracy)
```

## Clean up resources

To ensure the Spark instance is shut down, end any connected sessions(notebooks). The pool shuts down when the **idle time** specified in the Apache Spark pool is reached. You can also select **stop session** from the status bar at the upper right of the notebook.

![Screenshot showing the Stop session button on the status bar.](./media/tutorial-build-applications-use-mmlspark/stop-session.png)

## Next steps

* [Check out Synapse sample notebooks](https://github.com/Azure-Samples/Synapse/tree/main/MachineLearning)
* [Learn more about GPU-enabled Apache Spark pools](../spark/apache-spark-gpu-concept.md)
