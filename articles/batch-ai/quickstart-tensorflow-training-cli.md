---
title: Azure Quickstart - Deep learning training - Azure CLI | Microsoft Docs
description: Quickstart - Quickly learn to train a TensorFlow deep learning neural network on a single GPU with Batch AI using the Azure CLI
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
ms.date: 09/03/2018
ms.author: danlep
#Customer intent: As a data scientist or AI researcher, I want to train a sample AI model to evaluate using a GPU cluster in Azure for training my AI or machine learning models.
---

# Quickstart: Train a deep learning model with Batch AI

This quickstart shows how to train a sample deep learning model on a GPU-enabled virtual machine managed by Batch AI. Batch AI is a managed service for data scientists and AI researchers to train AI and machine learning models at scale on clusters of Azure virtual machines. 

In this example, you use the Azure CLI to set up Batch AI to train an example [TensorFlow](https://www.tensorflow.org/) neural network on the [MNIST database](http://yann.lecun.com/exdb/mnist/) of handwritten digits. After completing this quickstart, you'll understand key concepts of using Batch AI to train an AI or machine learning model, and be ready to try training different models at larger scale.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

This quickstart assumes you're running commands in a Bash shell, either in Cloud Shell or on your local computer. If you already completed the quickstart to [create a Batch AI cluster with the Azure CLI](quickstart-create-cluster-cli.md), skip the first two steps to create a resource group and a Batch AI cluster.

## Create a resource group

Create a resource group with the `az group create` command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus2* location. Be sure to choose the East US 2 location, or another location where the Batch AI service is available. 

```azurecli-interactive 
az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create a Batch AI cluster

First, use the `az batchai workspace create` command to create a Batch AI *workspace*. You need a workspace to organize your Batch AI clusters and other resources.

```azurecli-interactive
az batchai workspace create \
    --workspace myworkspace \
    --resource-group myResourceGroup
```

To create a Batch AI cluster, use the `az batchai cluster create` command. The following example creates a one-node cluster with the following properties:

* Uses the NC6 VM size, which has one NVIDIA Tesla K80 GPU. Azure offers several VM sizes with different NVIDIA GPUs.
* Runs a default Ubuntu Server image designed to host container-based applications. You can run most training workloads on this distribution. 
* Adds a user account named *myusername*, and generates SSH keys if they don't already exist in the default key location (*~/.ssh*) in your local environment.

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --vm-size Standard_NC6 \
    --target 1 \
    --user-name myusername \
    --generate-ssh-keys
```

The command output shows the cluster properties. It takes a few minutes to create and start the node. To see the cluster status, run the `az batchai cluster show` command.

```azurecli-interactive
az batchai cluster show \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --output table
```

Early in cluster creation, output is similar to the following, showing the cluster is `resizing`:

```bash
Name       Resource Group    Workspace    VM Size       State      Idle    Running    Preparing    Leaving    Unusable
---------  ----------------  -----------  ------------  -------  ------  ---------  -----------  ---------  ----------
mycluster  myResourceGroup   myworkspace  STANDARD_NC6  resizing      0          0            0          0           0

```

Continue the following steps to upload the training script and create the training job while the cluster state changes. The cluster is ready to run the training job when the state is `steady` and the single node is `Idle`.

## Upload training script

Use the `az storage account create` command to create a storage account to store your training script and training output.

```azurecli-interactive
az storage account create \
    --resource-group myResourceGroup \
    --name mystorageaccount \
    --location eastus2 \
    --sku Standard_LRS
```

Create an Azure file share called `myshare` in the account, using the `az storage share create` command:

```azurecli-interactive
az storage share create \
    --name myshare \
    --account-name mystorageaccount
```

Use the `az storage directory create` command to create directories in the Azure file share. Create the `scripts` directory for the training script, and `logs` for training output:

```azurecli-interactive
# Create /scripts directory in file share
az storage directory create \
    --name scripts \
    --share-name myshare \
    --account-name mystorageaccount

# Create /logs directory in file share 
az storage directory create \
    --name logs \
    --share-name myshare \
    --account-name mystorageaccount
```

In your Bash shell, create a local working directory, and download the TensorFlow [convolutional.py](https://raw.githubusercontent.com/tensorflow/models/master/tutorials/image/mnist/convolutional.py) sample. The Python script trains a convolutional neural network on the MNIST image set of 60,000 handwritten digits from 0 through 9. Then it tests the model on a set of test examples.

```bash
wget https://raw.githubusercontent.com/tensorflow/models/master/tutorials/image/mnist/convolutional.py
```

Upload the script to the `scripts` directory in the share using the `az storage file upload` command.

```azurecli-interactive
az storage file upload \
    --share-name myshare \
    --path scripts \
    --source convolutional.py \
    --account-name mystorageaccount
```

## Submit training job

First, create a Batch AI *experiment* in your workspace by using the `az batchai experiment create` command. An experiment is a logical container for related Batch AI jobs.

```azurecli-interactive
az batchai experiment create \
    --name myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup
```

In your working directory, create a training job configuration file `job.json` with the following content. You pass this configuration file when you submit the training job.

This `job.json` file includes settings to locate the Python script file and run it in a TensorFlow container on the GPU node. It also specifies where to save the job's output files in Azure storage. `<AZURE_BATCHAI_STORAGE_ACCOUNT>` indicates that the storage account name will be specified during the job submission.

```json
{
    "$schema": "https://raw.githubusercontent.com/Azure/BatchAI/master/schemas/2018-05-01/job.json",
    "properties": {
        "nodeCount": 1,
        "tensorFlowSettings": {
            "pythonScriptFilePath": "$AZ_BATCHAI_JOB_MOUNT_ROOT/myshare/scripts/convolutional.py"
        },
        "stdOutErrPathPrefix": "$AZ_BATCHAI_JOB_MOUNT_ROOT/myshare/logs",
        "mountVolumes": {
            "azureFileShares": [
                {
                    "azureFileUrl": "https://<AZURE_BATCHAI_STORAGE_ACCOUNT>.file.core.windows.net/myshare",
                    "relativeMountPath": "myshare"
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

Use the `az batchai job create` command to submit the job on the node, passing the `job.json` configuration file and the name of your storage account:

```azurecli-interactive
az batchai job create \
    --name myjob \
    --cluster mycluster \
    --experiment myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --config-file job.json \
    --storage-account-name mystorageaccount
```

The command returns with the job properties, and then takes a couple of minutes to complete. To monitor this job's progress, use the `az batchai job file stream` command to stream the `stdout-wk-0.txt` file from the standard output directory on the node. The training script generates this file after the job starts running.  

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

The streaming stops when the job completes. The sample script trains over 10 *epochs*, or passes through the training data set. In this example, after 10 epochs, the trained model performs with a test error of only 0.8%.

## Get job output

Batch AI creates a unique folder structure in the storage account for each job's output. Set the JOB_OUTPUT_PATH environment variable with this path. Then, list the output files in storage using the `az storage file list` command:

```azurecli-interactive
export JOB_OUTPUT_PATH=$(az batchai job show --name myjob --experiment myexperiment --workspace myworkspace --resource-group myResourceGroup --query jobOutputDirectoryPathSegment --output tsv)

az storage file list \
    --share-name myshare/logs \
    --account-name mystorageaccount \
    --path $JOB_OUTPUT_PATH/stdouterr \
    --output table
```

Output is similar to:

```
Name               Content Length  Type    Last Modified
---------------  ----------------  ------  ---------------
execution.log               14866  file
stderr-wk-0.txt              1527  file
stdout-wk-0.txt             11027  file
```

Use the `az storage file download` command to download one or more files to your local working directory. For example:

```azurecli-interactive
az storage file download \
    --share-name myshare/logs \
    --account-name mystorageaccount \
    --path $JOB_OUTPUT_PATH/stdouterr/stdout-wk-0.txt
```

## Clean up resources

If you want to continue with Batch AI tutorials and samples, use the Batch AI workspace, cluster, and storage account created in this quickstart. 

You're charged for the Batch AI cluster while the nodes are running. If you want to keep the cluster configuration when you have no jobs to run, resize the cluster to 0 nodes. 

```azurecli-interactive
az batchai cluster resize \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --target 0
```

Later, resize it to 1 or more nodes to run your jobs. When you no longer need a cluster, delete it with the `az batchai cluster delete` command:

```azurecli-interactive
az batchai cluster delete \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup
```

When no longer needed, you can use the `az group delete` command to remove the resource group for the Batch AI and storage resources. 

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Next steps
In this quickstart, you learned how to use Batch AI to train an example TensorFlow deep learning model on a single GPU VM, using the Azure CLI. To learn about how to distribute model training on a larger GPU cluster, continue to the Batch AI tutorial.

> [!div class="nextstepaction"]
> [Distributed training tutorial](./tutorial-horovod-tensorflow.md)