---
title: Azure Quickstart - Deep learning training with Batch AI - Azure CLI | Microsoft Docs
description: Quickly learn to run a deep learning training job on a single GPU with Batch AI using the Azure CLI
services: batch-ai
documentationcenter: na
author: dlepow
manager: jeconnoc
editor: 

ms.assetid:
ms.custom:
ms.service: batch-ai
ms.workload:
ms.tgt_pltfrm: na
ms.devlang: CLI
ms.topic: quickstart
ms.date: 06/28/2018
ms.author: danlep
---

# Quickstart: Run your first Batch AI training job using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows how to use the Azure CLI to train a deep learning model with Batch AI. In this example, you set up a single GPU node to train an example [TensorFlow](https://www.tensorflow.org/) model on the MNIST database of handwritten
digits. 

After completing this quickstart, you'll understand key concepts of using Batch AI to train a deep learning model, and be ready to try training jobs at larger scale with different frameworks.

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

## Create a single GPU cluster

First, use the [az batchai workspace create](/cli/azure/batchai/workspace#az-batchai-workspace-create) command to create a Batch AI *workspace*. You need a workspace to organize your Batch AI clusters and other resources.

```azurecli-interactive
az batchai workspace create \
    --workspace myworkspace \
    --resource-group myResourceGroup 
```

As a basic example, the following [az batchai cluster create](/cli/azure/batchai/cluster#az-batchai-cluster-create) command creates a single-node cluster using the NC6 VM size, which contains one NVIDIA Tesla K80 GPU. This cluster runs a default Ubuntu Server image designed to host container-based applications. This example uses a *low-priority* VM, a lower-priced option from surplus VM capacity in Azure. This command adds a user account named *myuser*, and generates SSH keys if they don't already exist in the default key location (*~/.ssh*). 

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --vm-size Standard_NC6 \
    --vm-priority lowpriority \
    --target 1 \
    --user-name myuser \
    --generate-ssh-keys
```

The command returns quickly with the cluster properties. It takes a few minutes to allocate and start the node. To see the status of the cluster, run the [az batchai cluster show](/cli/azure/batchai/cluster#az-batchai-cluster-show) command. 

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
Continue the following steps to configure storage and create a training job while the pool state changes. The cluster is ready to run the job when the state is `steady` and the node is `idle`.

## Configure storage

Use a storage account to store training scripts and output files from your training jobs. Create a storage account in your resource group with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command.

```azurecli-interactive
az storage account create \
    --resource-group myResourceGroup \
    --name mystorageaccount \
    --location eastus \
    --sku Standard_LRS
```

Now use the [az storage share create](/cli/azure/storage/share#az-storage-share-create) command to create Azure file shares in the storage account. The `scripts` share will be for training scripts, and `logs` for training output:

```azurecli-interactive
az storage share create \
    --name scripts \
    --account-name mystorageaccount

az storage share create \
    --name logs
    --account-name mystorageaccount
```

## Deploy training script

Create a local working directory, and download the TensorFlow [convolutional.py](https://raw.githubusercontent.com/tensorflow/models/master/tutorials/image/mnist/convolutional.py) sample script. The script trains an example convolutional neural network on the MNIST training set of 60,000 small (28 x 28 pixel) images of handwritten digits from 0 through 9. Then it tests the model on a set of test examples. For background, see the [TensorFlow documentation](https://www.tensorflow.org/tutorials/layers).

```bash
wget https://raw.githubusercontent.com/tensorflow/models/master/tutorials/image/mnist/convolutional.py
```

In your `scripts` share in the storage account, use the [az storage directory create](/cli/azure/storage/directory#az-storage-directory-create) command to create a folder named `tensorflow`:

```azurecli-interactive
az storage directory create \
    --share-name scripts \
    --name tensorflow \
    --account-name mystorageaccount

```

Upload the script to the `tensorflow` folder in the share using the [az storage file upload](/cli/azure/storage/file#az-storage-file-upload) command.

```azurecli-interactive
az storage file upload \
    --share-name scripts \
    --path tensorflow \
    --source convolutional.py \
    --account-name mystorageaccount
```

## Submit training job

First, create a Batch AI *experiment* in your workspace by using the [az batchai experiment create](/cli/azure/batchai/experiment#az-batchai-experiment-create) command. An experiment is a logical container for related Batch AI jobs.

```azurecli-interactive
az batchai experiment create \
    --name myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup
```

In your working directory, create a training job configuration file `job.json` with the following content. You pass this configuration file when you submit the training job. Update with the name of your storage account where indicated (use the value of the $AZURE_STORAGE_ACCOUNT variable).

```json
{
    "$schema": "https://raw.githubusercontent.com/Azure/BatchAI/master/schemas/2018-05-01/job.json",
    "properties": {
        "nodeCount": 1,
        "tensorFlowSettings": {
            "pythonScriptFilePath": "$AZ_BATCHAI_JOB_MOUNT_ROOT/scripts/tensorflow/convolutional.py"
        },
        "stdOutErrPathPrefix": "$AZ_BATCHAI_JOB_MOUNT_ROOT/logs",
        "mountVolumes": {
            "azureFileShares": [
                {
                    "azureFileUrl": "https://<YOUR_STORAGE_ACCOUNT>.file.core.windows.net/logs",
                    "relativeMountPath": "logs"
                },
                {
                    "azureFileUrl": "https://<YOUR_STORAGE_ACCOUNT>.file.core.windows.net/scripts",
                    "relativeMountPath": "scripts"
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

This configuration file includes TensorFlow settings to locate the Python script file that will run in a TensorFlow container on the GPU node. It also specifies the location of the log files generated by the training job.

Use the [az batchai job create](/cli/azure/batchai/job#az-batchai-job-create) command to submit the job on the cluster, passing the `job.json` configuration file:

```azurecli-interactive
az batchai job create \
    --name myjob \
    --cluster mycluster \
    --experiment myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --storage-account-name mystorageaccount \
    --config-file job.json
```

The command returns quickly with the job properties. The job takes a couple of minutes to complete. To monitor this job's progress, use the [az batchai job file stream](/cli/azure/batchai/job/file#az-batchai-job-file-stream) command to stream the `stdout-wk-0.txt` file in the standard output directory on the node. This file gets generated after the job starts running.  

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
File found with URL "https://mystorageaccount.file.core.windows.net/logs/00000000-0000-0000-0000-000000000000/myResourceGroup/workspaces/myworkspace/experiments/myexperiment/jobs/myjob/<JOB_ID>/stdouterr/stdout-wk-0.txt?sv=2016-05-31&sr=f&sig=Kih9baozMao8Ugos%2FVG%2BcsVsSeY1O%2FTocCNvLQhwtx4%3D&se=2018-06-20T22%3A07%3A30Z&sp=rl". Start streaming
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

The streaming stops when the job completes 10 *epochs*, or cycles through the training data set of images. In this example, after 10 epochs, the trained model performs with a test error of only 0.8%.

Batch AI creates a unique folder structure in the storage account for each job's output. Use this to locate the job output, even if you later delete the cluster. To find the path to the
folder in the `logs` share containing job output, use the [az batchai job show](/cli/azure/batchai/job/show#az-batchai-job-show) command and query the `jobOutputDirectoryPathSegment` attribute:

```azurecli
az batchai job show \
    --name myjob \
    --experiment myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --query jobOutputDirectoryPathSegment
```

Example output:
```
"00000000-0000-0000-0000-000000000000/myResourceGroup/workspaces/myworkspace/experiments/myexperiment/jobs/myjob/<JOB_ID>"
```

For example, list the output files in storage using the [az storage file list](/cli/azure/storage/file#az-storage-file-list) command:

```azurecli-interactive
export JOB_OUTPUT_PATH=$(az batchai job show --name myjob --experiment myexperiment --workspace myworkspace --resource-group myResourceGroup --query jobOutputDirectoryPathSegment | sed s/\"//g)

az storage file list \
    --share-name logs \
    --path $JOB_OUTPUT_PATH/stdouterr \
    --account-name mystorageaccount \
    --output table
```

## Clean up resources
If you want to continue with Batch AI tutorials and samples, use the Batch AI workspace and storage account created in this quickstart. 

You are charged for Batch AI clusters while the nodes are running, even if no jobs are scheduled. When you no longer need a cluster, delete it with the [az batchai cluster delete](/cli/azure/batchai/cluster#az_batchai_cluster_delete) command:

```azurecli-interactive
az batchai cluster delete 
    --name mycluster
    --workspace myworkspace
    --resource-group myResourceGroup
```

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group for the Batch AI and storage resources:

```azurecli-interactive 
az group delete --name myResourceGroup
```
