---
title: Azure Quickstart - Deep learning training with Batch AI - Azure CLI | Microsoft Docs
description: Quickly learn to run a deep learning training job on a single GPU with Batch AI using the Azure CLI
services: batch-ai
documentationcenter: na
author: AlexanderYukhanov
manager: Vaman.Bedekar
editor: tysonn

ms.assetid:
ms.custom:
ms.service: batch-ai
ms.workload:
ms.tgt_pltfrm: na
ms.devlang: CLI
ms.topic: quickstart
ms.date: 06/08/2018
ms.author: Alexander.Yukhanov
---

# Quickstart: Run your first deep learning training job using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows how to use the Azure CLI to create the smallest Batch AI cluster, consisting of one GPU node. Then, run an example deep learning training job on the cluster using a model in the TensorFlow framework. The job runs in a Docker container to train a convolutional neural network on the MNIST database of handwritten
digits. After completing this quickstart, you will understand the key concepts of using Batch AI for training a deep learning model, and be ready to try training jobs at larger scale.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location. Be sure to choose a location such as East US in which the Batch AI service is available.

```azurecli-interactive 
az group create \
    --name myResourceGroup \
    --location eastus
```

# Create a single GPU cluster

First, use the [az batchai workspace create](/cli/azure/batchai/workspace#az-batchai-workspace-create) command to create a Batch AI *workspace*. You need a workspace to organize your Batch AI clusters and other resources.

```azurecli-interactive
az batchai workspace create \
    --workspace myworkspace \
    --resource-group myResourceGroup 
```

As a basic example, the following [az batchai cluster create](/cli/azure/batchai/cluster#az-batchai-cluster-create) command creates a single-node GPU cluster named *mycluster* using the NC6 virtual machine size, which contains one NVIDIA Tesla K80 GPU. This cluster runs a default Ubuntu Server image designed to host container-based applications. This example includes the `--use-auto-storage` option to create and configure a storage account, and mount a file share and storage container in that account on each node. This command adds a user account named *azureuser*, and generates SSH keys if they don't already exist in the default key location (*~/.ssh*). 

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --use-auto-storage \
    --vm-size Standard_NC6 \
    --target 1 \
    --user-name myusername \
    --generate-ssh-keys
```

The cluster creation command runs quickly, and returns command output showing the cluster settings. It takes a few minutes to allocate and start the node. To see the status of the cluster, run the [az batchai cluster show](/cli/azure/batchai/cluster#az-batchai-cluster-show) command. 

```azurecli-interactive
az batchai cluster show \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --output table
```

Initially, output is similar to the following:

```bash
Name       Resource Group    Workspace    VM Size       State      Idle    Running    Preparing    Leaving    Unusable
---------  ----------------  -----------  ------------  -------  ------  ---------  -----------  ---------  ----------
mycluster  myResourceGroup   myworkspace  STANDARD_NC6  steady        0          0            1          0           0

```
Continue the following steps to create a training job while the pool state is changing. The cluster is ready to run the job when the state is `steady` and the node is `idle`.

## Configure storage for script and output files

When Batch AI automatically created the storage account, it also created an SMB file share named `batchaishare`. The rest of this quickstart uses this file share to store both the training script and the output of the training job.

To make it easier to mange the auto-storage account using the Azure CLI commands, first set environment variables to contain the storage account credentials. Note that Batch AI creates the storage account automatically in the *batchaiautostorage* resource group, which is used in the second command to export the storage key.

```bash
export AZURE_STORAGE_ACCOUNT=$(az batchai cluster show --name mycluster --workspace myworkspace --resource-group myResourceGroup --query 'nodeSetup.mountVolumes.azureFileShares[0].accountName' | sed s/\"//g)

export AZURE_STORAGE_KEY=$(az storage account keys list --account-name $AZURE_STORAGE_ACCOUNT --resource-group batchaiautostorage --query [0].value)
```

Run the [az storage directory create](/cli/azure/storage/directory#az-storage-directory-create) command to create a folder named `scripts` in the share, and a folder named `logs` for the job output:

```azurecli-interactive
az storage directory create \
    --share-name batchaishare \
    --name scripts

az storage directory create \
    --share-name batchaishare \
    --name logs
```

### Deploy training script to storage

Create a local working directory, and download the TensorFlow [convolutional.py](https://raw.githubusercontent.com/tensorflow/models/master/tutorials/image/mnist/convolutional.py) sample script. For details about the model, see [Convolutional Neural Networks](https://www.tensorflow.org/tutorials/deep_cnn) in the TensorFlow documentation.

```bash
wget https://raw.githubusercontent.com/tensorflow/models/master/tutorials/image/mnist/convolutional.py
```

Upload the script to your storage account using the [az storage file upload](/cli/azure/storage/file#az-storage-file-upload) command.

```azurecli-interactive
az storage file upload \
    --share-name batchaishare \
    --path scripts \
    --source convolutional.py
```

## Submit training job

 First, create a Batch AI *experiment* in your workspace by using the [az batchai experiment create](/cli/azure/batchai/experiment#az-batchai-experiment-create) command. An experiment is a logical container for related Batch AI jobs.

```azurecli-interactive
az batchai experiment create \
    --name myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup
```

In your working directory, create a training job configuration file `job.json` with the following content. You pass this configuration file when you submit the training job. Update with the name of the storage account where indicated (use the value of the $AZURE_STORAGE_ACCOUNT variable).

```json
{
    "$schema": "https://raw.githubusercontent.com/Azure/BatchAI/master/schemas/2018-05-01/job.json",
    "properties": {
        "nodeCount": 1,
        "tensorFlowSettings": {
            "pythonScriptFilePath": "$AZ_BATCHAI_JOB_MOUNT_ROOT/autoafs/scripts/convolutional.py"
        },
        "stdOutErrPathPrefix": "$AZ_BATCHAI_JOB_MOUNT_ROOT/logs",
        "mountVolumes": {
            "azureFileShares": [
                {
                    "azureFileUrl": "https://<YOUR_STORAGE_ACCOUNT>.file.core.windows.net/batchaishare/logs",
                    "relativeMountPath": "autoafs/logs"
                },
                {
                    "azureFileUrl": "https://<YOUR_STORAGE_ACCOUNT>.file.core.windows.net/batchaishaare/scripts",
                    "relativeMountPath": "autoafs/scripts"
                }
            ]
        },
        "containerSettings": {
            "imageSourceRegistry": {
                "image": "tensorflow/tensorflow:1.8.0-gpu"
            }
        }
    }
}
```

This configuration file specifies the Python script file that will run in a TensorFlow container on the GPU node. It also specifies the location of the log files generated by the training job.


Use the [az batchai job create](/cli/azure/batchai/job#az-batchai-job-create) command to submit the job on the cluster:

```azurecli-interactive
az batchai job create \
    --name myjob \
    --cluster mycluster \
    --experiment myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --config-file job.json
```

The command returns quickly with the job properties. The job takes some time to complete. To monitor this job's progress, stream the `stdout-wk-0.txt` file in the standard output directory on the GPU node. This file gets generated after the job starts running. Use the [az batchai job file stream](/cli/azure/batchai/job/file#az-batchai-job-file-stream) command to stream the file:

```azurecli-interactive
az batchai job file stream \
    --job myjob \
    --experiment myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --file-name stdout-wk-0.txt
```

Example output:
```
File found with URL "https://<YOUR_STORAGE_ACCOUNT>.file.core.windows.net/batchaishare/logs/00000000-0000-0000-0000-000000000000/myResourceGroup/workspaces/myworkspace/experiments/myexperiment/jobs/myjob/<JOB_ID>/stdouterr/stdout-wk-0.txt?sv=2016-05-31&sr=f&sig=Kih9baozMao8Ugos%2FVG%2BcsVsSeY1O%2FTocCNvLQhwtx4%3D&se=2018-06-20T22%3A07%3A30Z&sp=rl". Start streaming
Successfully downloaded train-images-idx3-ubyte.gz 9912422 bytes.
Successfully downloaded train-labels-idx1-ubyte.gz 28881 bytes.
Successfully downloaded t10k-images-idx3-ubyte.gz 1648877 bytes.
Successfully downloaded t10k-labels-idx1-ubyte.gz 4542 bytes.
Extracting data/train-images-idx3-ubyte.gz
Extracting data/train-labels-idx1-ubyte.gz
Extracting data/t10k-images-idx3-ubyte.gz
Extracting data/t10k-labels-idx1-ubyte.gz
Initialized!
Step 0 (epoch 0.00), 14.9 ms
Minibatch loss: 8.334, learning rate: 0.010000
Minibatch error: 85.9%
Validation error: 84.6%
Step 100 (epoch 0.12), 9.7 ms
Minibatch loss: 3.240, learning rate: 0.010000
Minibatch error: 6.2%
Validation error: 7.7%
Step 200 (epoch 0.23), 8.3 ms
Minibatch loss: 3.335, learning rate: 0.010000
Minibatch error: 7.8%
Validation error: 4.5%
Step 300 (epoch 0.35), 8.3 ms
Minibatch loss: 3.157, learning rate: 0.010000
Minibatch error: 3.1%
...
Step 8500 (epoch 9.89), 8.3 ms
Minibatch loss: 1.605, learning rate: 0.006302
Minibatch error: 0.0%
Validation error: 0.9%
Test error: 0.8%
```

The streaming stops when the job is completed (succeeds or fails).

## Inspect Generated Model Files

The job stores the generated model files in the output directory with `id` attribute equals to `MODEL`, you can list
model files and get download URLs using the following command:

```azurecli
az batchai job file list -n cntk_python_1 -g batchai.quickstart -d MODEL
```

Example output:
```
[
  {
    "additionalProperties": {},
    "contentLength": 409456,
    "downloadUrl": "https://<YOUR STORAGE ACCOUNT>.file.core.windows.net/...",
    "isDirectory": false,
    "lastModified": "2018-04-11T22:05:51+00:00",
    "name": "ConvNet_MNIST_0.dnn"
  },
  {
    "additionalProperties": {},
    "contentLength": 409456,
    "downloadUrl": "https://<YOUR STORAGE ACCOUNT>.file.core.windows.net/...",
    "isDirectory": false,
    "lastModified": "2018-04-11T22:05:55+00:00",
    "name": "ConvNet_MNIST_1.dnn"
  },
...

```

Alternatively, you can use the Portal or Azure Storage Explorer to inspect the generated files. To distinguish output
from the different jobs, Batch AI creates a unique folder structure for each of them. You can find the path to the
folder containing the output using `jobOutputDirectoryPathSegment` attribute of the submitted job:

```azurecli
az batchai job show -n cntk_python_1 -g batchai.quickstart --query jobOutputDirectoryPathSegment
```

Example output:
```
"00000000-0000-0000-0000-000000000000/batchai.quickstart/jobs/cntk_python_1/<JOB's UUID>"
```

# Delete Resources

Delete the resource group and all allocated resources with the following command:

```azurecli
az group delete -n batchai.quickstart -y
```
