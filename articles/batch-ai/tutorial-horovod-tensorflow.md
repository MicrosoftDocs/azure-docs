---
title: Tutorial - Distributed training with Azure Batch AI and Horovod | Microsoft Docs
description: Tutorial - How to train a distributed model with Horovod using the Azure Batch AI service and Azure CLI.
services: batch-ai
author: johnwu10
manager: jeconnoc

ms.service: batch-ai
ms.topic: tutorial
ms.date: 09/03/2018
ms.author: danlep
ms.custom: mvc
#Customer intent: As a data scientist or AI researcher with a compute-intensive deep learning model and large amounts of training data, I want to distribute training across multiple GPUs in the cloud so that I train my model faster.
---

# Tutorial: Train a distributed model with Horovod

In this tutorial, you train a distributed deep learning model by running it in parallel across multiple nodes in a Batch AI cluster. Batch AI is a managed service for training machine learning and AI models at scale on clusters of Azure GPUs. 

This tutorial introduces a common Batch AI workflow along with how to interact with Batch AI resources through the Azure CLI. Topics covered include:

> [!div class="checklist"]
> * Set up a Batch AI workspace, experiment, and cluster
> * Set up an Azure file share for input and output
> * Parallelize a deep learning model using Horovod
> * Submit a training job
> * Monitor the job
> * Retrieve the training results

For this tutorial, an object detection model is modified to run in parallel with [Horovod](https://github.com/uber/horovod). The model trains on the [CIFAR-10 dataset](https://www.cs.toronto.edu/~kriz/cifar.html) of images. The training job runs on a cluster containing 24 vCPUs and 4 GPUs, and takes approximately 60 minutes to complete.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Why use Horovod?

Horovod is a distributed training framework for Tensorflow, Keras, and PyTorch, and is used for this tutorial. With Horovod, you can convert a training script designed to run on a single GPU to one that runs efficiently on a distributed system using just a few lines of code.

In addition to Horovod, Batch AI supports distributed training with several other popular open-source frameworks. Be sure to review the license terms of any framework that you use to train models in production.

## Prepare the Batch AI environment

### Create a resource group

Use the `az group create` command to create a resource group named `batchai.horovod` in the `eastus` region. You use the resource group to deploy Batch AI resources.

```azurecli-interactive
az group create --name batchai.horovod --location eastus
```

### Create a workspace

Create a Batch AI workspace using the `az batchai workspace create` command. A workspace is a top-level collection of other Batch AI resources. The following command creates a workspace called `batchaidev` under your resource group.

```azurecli-interactive
az batchai workspace create --resource-group batchai.horovod --workspace batchaidev 
```

### Create an experiment

A Batch AI experiment groups one or more jobs that you query and manage together. The following `az batchai experiment create` command creates an experiment called `cifar` under the workspace and resource group.

```azurecli-interactive
az batchai experiment create --resource-group batchai.horovod --workspace batchaidev --name cifar 
```

## Set up a GPU cluster

Next, set up a GPU cluster to run the experiment. Batch AI provides a flexible range of options for customizing clusters for specific needs.

The following `az batchai cluster create` command creates a 4-node cluster called `nc6cluster` under your workspace and resource group. By default, the VMs in the cluster run an Ubuntu Server image designed to host container-based applications. The cluster nodes in this example use the `Standard_NC6` size, which contains one NVIDIA Tesla K80 GPU.

```azurecli-interactive
az batchai cluster create --resource-group batchai.horovod --workspace batchaidev --name nc6cluster --vm-priority dedicated  --vm-size Standard_NC6 --target 4 --generate-ssh-keys
```

Run the `az batchai cluster show` command to view the cluster status. It usually takes a few minutes to fully provision the cluster.

```azurecli-interactive
az batchai cluster show --name nc6cluster --workspace batchaidev --resource-group batchai.horovod --output table
```

Early in cluster creation, the cluster is in the `resizing` state. Continue the following steps while the cluster state changes. The cluster is ready to run the training job when the state is `steady`and the nodes are `idle`. For example:

```
Name        Resource Group    Workspace    VM Size       State      Idle    Running    Preparing    Leaving    Unusable
----------  ----------------  -----------  ------------  -------  ------  ---------  -----------  ---------  ----------
nc6cluster  batchai.horovod  batchaidev   STANDARD_NC6  steady        4          0            0          0           0
```

## Set up storage

Use the `az storage account create` command to create a storage account to store your training script and training output.

```azurecli-interactive
az storage account create --resource-group batchai.horovod --name mystorageaccount --location eastus --sku Standard_LRS
```

Create an Azure file share called `myshare` in the account, using the `az storage share create` command:

```azurecli-interactive
az storage share create --name myshare --account-name mystorageaccount
```

In practice, this same storage can be used across multiple jobs and experiments. To keep things organized, create a directory within the file share to store files related to this specific experiment. The following `az storage directory create` command creates a directory called `cifar`.

```azurecli-interactive
az storage directory create --name cifar --share-name myshare --account-name mystorageaccount
```

The next step is to prepare the actual training script, which you then upload to the newly created directory.

## Create the training script

For this experiment, you run a Python script that is updated with a few  changes in order to run an object detection model in parallel using Horovod. The [original model](https://raw.githubusercontent.com/keras-team/keras/master/examples/cifar10_cnn.py) uses Keras with a TensorFlow backend. 

In a working directory in your shell, use your favorite text editor to create a file named `cifar_cnn_distributed.py` with the following content. Changes to the original source code are commented with a `HOROVOD` prefix.

```python
from __future__ import print_function
import keras
from keras.datasets import cifar10
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Conv2D, MaxPooling2D
import tensorflow as tf
import horovod.keras as hvd
import os
from keras import backend as K
import math
import argparse 

# HOROVOD: initialize Horovod.
hvd.init()

# HOROVOD: pin GPU to be used to process local rank (one GPU per process)
config = tf.ConfigProto()
config.gpu_options.allow_growth = True
config.gpu_options.visible_device_list = str(hvd.local_rank())
K.set_session(tf.Session(config=config))

batch_size = 32
num_classes = 10
# HOROVOD: adjust number of epochs based on number of GPUs.
epochs = int(math.ceil(100.0 / hvd.size()))

data_augmentation = True
num_predictions = 20
# BATCH AI: change save directory to mounted storage path
parser = argparse.ArgumentParser()
parser.add_argument("-d", "--dir", help="directory to save model to")
args = parser.parse_args()
save_dir = os.path.join(args.dir, 'saved_models')
model_name = 'keras_cifar10_trained_model.h5'

# The data, split between train and test sets:
(x_train, y_train), (x_test, y_test) = cifar10.load_data()
print('x_train shape:', x_train.shape)
print(x_train.shape[0], 'train samples')
print(x_test.shape[0], 'test samples')

# Convert class vectors to binary class matrices.
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)

model = Sequential()
model.add(Conv2D(32, (3, 3), padding='same',
                 input_shape=x_train.shape[1:]))
model.add(Activation('relu'))
model.add(Conv2D(32, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Conv2D(64, (3, 3), padding='same'))
model.add(Activation('relu'))
model.add(Conv2D(64, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Flatten())
model.add(Dense(512))
model.add(Activation('relu'))
model.add(Dropout(0.5))
model.add(Dense(num_classes))
model.add(Activation('softmax'))

# HOROVOD: adjust learning rate based on number of GPUs.
opt = keras.optimizers.rmsprop(lr=0.0001 * hvd.size(), decay=1e-6)

# HOROVOD: add Horovod Distributed Optimizer.
opt = hvd.DistributedOptimizer(opt)

# Let's train the model using RMSprop
model.compile(loss='categorical_crossentropy',
              optimizer=opt,
              metrics=['accuracy'])

callbacks = [
    # HOROVOD: broadcast initial variable states from rank 0 to all other processes.
    # This is necessary to ensure consistent initialization of all workers when
    # training is started with random weights or restored from a checkpoint.
    hvd.callbacks.BroadcastGlobalVariablesCallback(0),
]

# HOROVOD: save checkpoints only on worker 0 to prevent other workers from corrupting them.
if hvd.rank() == 0:
    callbacks.append(keras.callbacks.ModelCheckpoint('./checkpoint-{epoch}.h5'))

x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255

if not data_augmentation:
    print('Not using data augmentation.')
    model.fit(x_train, y_train,
              batch_size=batch_size,
              epochs=epochs,
              validation_data=(x_test, y_test),
              shuffle=True)
else:
    print('Using real-time data augmentation.')
    # This will do preprocessing and realtime data augmentation:
    datagen = ImageDataGenerator(
        featurewise_center=False,  # set input mean to 0 over the dataset
        samplewise_center=False,  # set each sample mean to 0
        featurewise_std_normalization=False,  # divide inputs by std of the dataset
        samplewise_std_normalization=False,  # divide each input by its std
        zca_whitening=False,  # apply ZCA whitening
        zca_epsilon=1e-06,  # epsilon for ZCA whitening
        rotation_range=0,  # randomly rotate images in the range (degrees, 0 to 180)
        width_shift_range=0.1,  # randomly shift images horizontally (fraction of total width)
        height_shift_range=0.1,  # randomly shift images vertically (fraction of total height)
        shear_range=0.,  # set range for random shear
        zoom_range=0.,  # set range for random zoom
        channel_shift_range=0.,  # set range for random channel shifts
        fill_mode='nearest',  # set mode for filling points outside the input boundaries
        cval=0.,  # value used for fill_mode = "constant"
        horizontal_flip=True,  # randomly flip images
        vertical_flip=False,  # randomly flip images
        rescale=None,  # set rescaling factor (applied before any other transformation)
        preprocessing_function=None,  # set function that will be applied on each input
        data_format=None,  # image data format, either "channels_first" or "channels_last"
        validation_split=0.0)  # fraction of images reserved for validation (strictly between 0 and 1)

    # Compute quantities required for feature-wise normalization
    # (std, mean, and principal components if ZCA whitening is applied).
    datagen.fit(x_train)

    # Fit the model on the batches generated by datagen.flow().
    model.fit_generator(datagen.flow(x_train, y_train,
                                     batch_size=batch_size),
                        epochs=epochs,
                        validation_data=(x_test, y_test),
                        workers=4)

# Save model and weights
if not os.path.isdir(save_dir):
    os.makedirs(save_dir)
model_path = os.path.join(save_dir, model_name)
model.save(model_path)
print('Saved trained model at %s ' % model_path)

# Score trained model.
scores = model.evaluate(x_test, y_test, verbose=1)
print('Test loss:', scores[0])
print('Test accuracy:', scores[1])
```

As shown in this example, only a few updates to the model are needed to enable distributed training using the Horovod framework. 

Keep in mind that this script uses a relatively small model and dataset for demo purposes, so this distributed model will not necessarily show a substantial performance improvement. To truly see the power of distributed training, use a much larger model and dataset.

## Upload the training script

Once the script is ready, the next step is to upload it to the file share directory that you created earlier. The following `az storage file upload` command uploads it from the local working directory to the proper location.

```azurecli-interactive
az storage file upload --path cifar --share-name myshare --source cifar_cnn_distributed.py --account-name mystorageaccount
```

## Submit the training job

After completing the previous steps, create a training job. In Batch AI, you use a `job.json` file to define the parameters for how to run a job. Using your favorite text editor, create a job configuration file called `job.json` with the following content.

```json
{
    "$schema": "https://raw.githubusercontent.com/Azure/BatchAI/master/schemas/2018-05-01/job.json",
    "properties": {
        "nodeCount": 4,
        "horovodSettings": {
            "pythonScriptFilePath": "$AZ_BATCHAI_JOB_MOUNT_ROOT/myshare/cifar/cifar_cnn_distributed.py",
            "commandLineArgs": "--dir=$AZ_BATCHAI_JOB_MOUNT_ROOT/myshare/cifar"
        },
        "stdOutErrPathPrefix": "$AZ_BATCHAI_JOB_MOUNT_ROOT/myshare/cifar",
        "mountVolumes": {
            "azureFileShares": [
                {
                    "azureFileUrl": "https://<AZURE_BATCHAI_STORAGE_ACCOUNT>.file.core.windows.net/myshare",
                    "relativeMountPath": "myshare"
                }
            ]
        },
        "jobPreparation": {
            "commandLine": "apt update; apt install mpi-default-dev mpi-default-bin -y; pip install keras horovod"
        },
        "containerSettings": {
            "imageSourceRegistry": {
                "image": "tensorflow/tensorflow:1.8.0-gpu"
            }
        }
    }
}
```

Explanation of properties:

| Property | Description |
| --------- | --------- |
| `nodeCount` | The number of nodes to dedicate for the job. Here, the job will run in parallel on `4` nodes. |
| `horovodSettings` | The `pythonScriptFilePath` field defines the path to the Horovod script, located in the `cifar` directory created previously. The `commandLineArgs` field is the command-line arguments for running the script. For this experiment, the directory of where to save the model is the only required argument. `$AZ_BATCHAI_JOB_MOUNT_ROOT/myshare` is the path where the file share was mounted. | 
| `stdOutErrPathPrefix` | The path to store the job outputs and logs, which for this example is the same `cifar` directory. |
| `jobPreparation` | Any special instructions for preparing the environment for running the job. This script requires installation of the indicated MPI and Horovod packages. |
| `containerSettings` | Settings for the container that the job runs on. This job uses a Docker container built with `tensorflow`.

Using the configuration, create the job using the `az batchai job create` command. The following command queues a new job called `cifar_distributed` using all the resources that have been set up to this point. 

```azurecli-interactive
az batchai job create --cluster nc6cluster --name cifar_distributed --resource-group batchai.horovod --workspace batchaidev --experiment cifar --config-file job.json --storage-account-name mystorageaccount
```

If the nodes are currently busy, the job may take a while before to start running. Use the `az batchai job show` command to view the execution state of the job.

```azurecli-interactive
az batchai job show --experiment cifar --name cifar_distributed --resource-group batchai.horovod --workspace batchaidev --query "executionState"
```

### Visualize the distributed training

Once the job starts running, use the `az batchai cluster show` command again to query the status of the cluster nodes. 

```azurecli-interactive
az batchai cluster show --name nc6cluster --workspace batchaidev --resource-group batchai.horovod --query "nodeStateCounts"
```

The output should be similar to the following, which shows all four in a running state. This result shows that all four nodes are currently being utilized in the distributed training.

```
{
  "idleNodeCount": 0,
  "leavingNodeCount": 0,
  "preparingNodeCount": 0,
  "runningNodeCount": 4,
  "unusableNodeCount": 0
}
```

## Monitor the job

### List output files

While the job is running, use the `az batchai job file list` command to list the output files that the job generates.

```azurecli-interactive
az batchai job file list --experiment cifar --job cifar_distributed --resource-group batchai.horovod --workspace batchaidev --output table
```

For this specific experiment, the output should be similar to the following. The overall output for the job is logged to `stdout.txt` while `stderr.txt` outputs any errors that occur in the main execution. The other files are output, error, and job preparation logs corresponding to each individual node.

```
Name                                                    Type       Size  Modified
------------------------------------------------------  ------  -------  -------------------------
execution-tvm-676767296_1-20180718t174802z-p.log        file       8801  2018-07-18T22:41:28+00:00
execution-tvm-676767296_2-20180718t174802z-p.log        file      15094  2018-07-18T22:41:55+00:00
execution-tvm-676767296_3-20180718t174802z-p.log        file       8801  2018-07-18T22:41:28+00:00
execution-tvm-676767296_4-20180718t174802z-p.log        file       8801  2018-07-18T22:41:28+00:00
stderr-job_prep-tvm-676767296_1-20180718t174802z-p.txt  file        238  2018-07-18T22:41:50+00:00
stderr-job_prep-tvm-676767296_2-20180718t174802z-p.txt  file        238  2018-07-18T22:41:50+00:00
stderr-job_prep-tvm-676767296_3-20180718t174802z-p.txt  file        238  2018-07-18T22:41:50+00:00
stderr-job_prep-tvm-676767296_4-20180718t174802z-p.txt  file        238  2018-07-18T22:41:50+00:00
stderr.txt                                              file       7653  2018-07-18T22:46:32+00:00
stdout-job_prep-tvm-676767296_1-20180718t174802z-p.txt  file      13651  2018-07-18T22:41:55+00:00
stdout-job_prep-tvm-676767296_2-20180718t174802z-p.txt  file      13651  2018-07-18T22:41:54+00:00
stdout-job_prep-tvm-676767296_3-20180718t174802z-p.txt  file      13651  2018-07-18T22:41:54+00:00
stdout-job_prep-tvm-676767296_4-20180718t174802z-p.txt  file      13651  2018-07-18T22:41:55+00:00
stdout.txt                                              file    2316480  2018-07-18T22:46:32+00:00
```

### Stream an output file

Use the `az batchai job file stream` command to stream the contents of a file. The following example streams the main output log.

```azurecli-interactive
az batchai job file stream --experiment cifar --file-name stdout.txt --job cifar_distributed --resource-group batchai.horovod --workspace batchaidev
```

While the job runs, the command streams the standard output of the training job, showing output similar to the following.

```
...
50000 train samples
10000 test samples
Using real-time data augmentation.
Epoch 1/25


   1/1563 [..............................] - ETA: 2:42:25 - loss: 2.3334 - acc: 0.0312   1/1563 [..............................] - ETA: 2:30:42 - loss: 2.2973 - acc: 0.0938
   1/1563 [..............................] - ETA: 30:36 - loss: 2.3175 - acc: 0.1250
   1/1563 [..............................] - ETA: 2:32:58 - loss: 2.3489 - acc: 0.0625
   2/1563 [..............................] - ETA: 1:21:59 - loss: 2.3230 - acc: 0.0625

   2/1563 [..............................]   2/1563 [..............................] - ETA: 1:16:09 - loss: 2.2913 - acc: 0.0938 - ETA: 1:17:15 - loss: 2.3147 - acc: 0.0781
   2/1563 [..............................] - ETA: 16:07 - loss: 2.3678 - acc: 0.0938
   3/1563 [..............................] - ETA: 55:05 - loss: 2.3232 - acc: 0.0938  
   3/1563 [..............................] - ETA: 51:57 - loss: 2.3185 - acc: 0.1146  
   3/1563 [..............................] - ETA: 51:12 - loss: 2.3179 - acc: 0.1042  
   3/1563 [..............................] - ETA: 11:13 - loss: 2.3504 - acc: 0.0833
   4/1563 [..............................] - ETA: 39:43 - loss: 2.3224 - acc: 0.1094
   4/1563 [..............................] - ETA: 42:09 - loss: 2.3049 - acc: 0.1250
   4/1563 [..............................] - ETA: 39:15 - loss: 2.3089 - acc: 0.1094
   4/1563 [..............................] - ETA: 9:16 - loss: 2.3316 - acc: 0.1016 
   5/1563 [..............................] - ETA: 39:51 - loss: 2.3153 - acc: 0.1125
   5/1563 [..............................] - ETA: 37:58 - loss: 2.3197 - acc: 0.1125
   5/1563 [..............................] - ETA: 37:35 - loss: 2.3148 - acc: 0.1062
   5/1563 [..............................] - ETA: 13:38 - loss: 2.3263 - acc: 0.1062
   6/1563 [..............................] - ETA: 35:48 - loss: 2.3168 - acc: 0.1198

   6/1563 [..............................]   6/1563 [..............................] - ETA: 34:13 - loss: 2.3142 - acc: 0.1198 - ETA: 33:51 - loss: 2.3162 - acc: 0.1042
   6/1563 [..............................] - ETA: 13:54 - loss: 2.3225 - acc: 0.1094
   7/1563 [..............................] - ETA: 30:53 - loss: 2.3181 - acc: 0.1071

   7/1563 [..............................]   7/1563 [..............................] - ETA: 29:32 - loss: 2.3149 - acc: 0.1161 - ETA: 29:13 - loss: 2.3140 - acc: 0.0938
   7/1563 [..............................] - ETA: 12:09 - loss: 2.3174 - acc: 0.1205
   8/1563 [..............................] - ETA: 26:04 - loss: 2.3113 - acc: 0.1133
   8/1563 [..............................] - ETA: 27:15 - loss: 2.3169 - acc: 0.1133
   8/1563 [..............................] - ETA: 10:51 - loss: 2.3152 - acc: 0.1172
...
```

The script trains over 25 epochs, or passes through the training dataset. This process takes approximately 60 minutes. 

## Retrieve the results

When the script completes, if everything went well, the validation accuracy should be about 70-75% and the trained model is saved to the file share at `cifar/saved_models/keras_cifar10_trained_model.h5`. 

Model training is usually a part of a larger workflow. For example, you might expose the trained model in another application. To download the trained model locally, use the `az storage file download` command. 

```azurecli-interactive
az storage file download --path cifar/saved_models/keras_cifar10_trained_model.h5 --share-name myshare --account-name mystorageaccount
```
## Clean up resources

Once jobs are finished running, a best practice for saving compute costs is to downscale all clusters to `0 nodes` so that you don't get charged for idle time. Use the following `az batchai cluster resize` command. 

```azurecli-interactive
az batchai cluster resize --name nc6cluster --resource-group batchai.horovod --target 0 --workspace batchaidev
```

Later, resize it to 1 or more nodes to run your jobs. 

If you don't plan to use the workspace and storage account in the future, delete the resource group using the `az group delete` command. Deleting a resource group deletes all resources that are part of that group.

```azurecli-interactive
az group delete --name batchai.horovod
```

## Next steps

In this tutorial, you learned about how to:

> [!div class="checklist"]
> * Set up a Batch AI workspace, experiment, and cluster
> * Set up an Azure file share for input and output
> * Parallelize a model using Horovod
> * Submit a training job
> * Monitor the job
> * Retrieve the training results

For examples of using Batch AI with different frameworks, see the recipes on GitHub.

> [!div class="nextstepaction"]
> [Batch AI recipes](https://github.com/Azure/BatchAI/tree/master/recipes)
