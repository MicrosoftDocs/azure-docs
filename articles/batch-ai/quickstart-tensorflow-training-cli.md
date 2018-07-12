---
title: Azure Quickstart - Deep learning training - Azure CLI | Microsoft Docs
description: Quickly learn to run a TensorFlow deep learning training job on a single GPU with Batch AI using the Azure CLI
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
ms.date: 07/12/2018
ms.author: danlep
---

# Quickstart: Run your first Batch AI training job using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows how to use the Azure CLI to train a deep learning model with Batch AI. In this example, you set up a single GPU node to train an example [TensorFlow](https://www.tensorflow.org/) model on the MNIST database of handwritten digits.

After completing this quickstart, you'll understand key concepts of using Batch AI to train a deep learning model, and be ready to try training jobs at larger scale with different frameworks.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

If you already followed the quickstart to [create a Batch AI cluster with the Azure CLI](quickstart-create-cluster-cli), skip the first two steps to create a resource group and a Batch AI cluster.

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus2* location. Be sure to choose a location such as East US 2 in which the Batch AI service is available.

```azurecli-interactive 
az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create a Batch AI cluster

First, use the [az batchai workspace create](/cli/azure/batchai/workspace#az-batchai-workspace-create) command to create a Batch AI *workspace*. You need a workspace to organize your Batch AI clusters and other resources.

```azurecli-interactive
az batchai workspace create \
    --workspace myworkspace \
    --resource-group myResourceGroup
```

To create a Batch AI cluster, use the [az batchai cluster create](/cli/azure/batchai/cluster#az-batchai-cluster-create) command. The following example creates a cluster with the following properties:

* Contains a single node in the NC6 VM size, which has one NVIDIA Tesla K80 GPU. 
* Runs a default Ubuntu Server image designed to host container-based applications, which you can use for most training workloads. 
* Adds a user account named *my username*, and generates SSH keys if they don't already exist in the default key location (*~/.ssh*) in your local environment. 
* Automatically creates (through the `--use-auto-storage` option) an associated storage account, to store files for training jobs. Batch AI mounts a file share and storage container in that account on each cluster node.  

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --vm-size Standard_NC6 \
    --use-auto-storage \
    --target 1 \
    --user-name myusername \
    --generate-ssh-keys
```

The command output shows the cluster properties. It takes a few minutes to create and start the node. To see the status of the cluster, run the [az batchai cluster show](/cli/azure/batchai/cluster#az-batchai-cluster-show) command.

```azurecli-interactive
az batchai cluster show \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --output table
```

Early in cluster creation, output is similar to the following, showing the cluster is in the `resizing` state:

```bash
Name       Resource Group    Workspace    VM Size       State      Idle    Running    Preparing    Leaving    Unusable
---------  ----------------  -----------  ------------  -------  ------  ---------  -----------  ---------  ----------
mycluster  myResourceGroup   myworkspace  STANDARD_NC6  resizing      0          0            0          0           0

```

Continue the following steps to upload the training script and create the training job while the cluster state is changing. The cluster is ready to run the training job when the state is `steady` and the single node is `Idle`.

## Upload training script

Use the storage account associated with the cluster to store your training script and training output. To simplify the CLI commands to work with the storage account, first set the following environment variables in your shell:

```bash
export AZURE_STORAGE_ACCOUNT=$(az batchai cluster show --name mycluster --workspace myworkspace --resource-group myResourceGroup --query 'nodeSetup.mountVolumes.azureFileShares[0].accountName' | sed s/\"//g)

export AZURE_STORAGE_KEY=$(az storage account keys list --account-name $AZURE_STORAGE_ACCOUNT --resource-group batchaiautostorage --query [0].value)
```

Create Azure file shares in the storage account with the [az storage share create](/cli/azure/storage/share#az-storage-share-create) command. The `scripts` share is for the training script, and `logs` for training output:

```azurecli-interactive
az storage share create \
    --name scripts

az storage share create \
    --name logs
```

In your `scripts` share, use the [az storage directory create](/cli/azure/storage/directory#az-storage-directory-create) command to create a folder named `tensorflow`:

```azurecli-interactive
az storage directory create \
    --share-name scripts \
    --name tensorflow
```

Create a local working directory, and download the TensorFlow [convolutional.py](https://raw.githubusercontent.com/tensorflow/models/master/tutorials/image/mnist/convolutional.py) sample. The script trains a convolutional neural network on the MNIST image set of 60,000 handwritten digits from 0 through 9. Then it tests the model on a set of test examples. For background, see the [TensorFlow documentation](https://www.tensorflow.org/tutorials/layers).

```bash
wget https://raw.githubusercontent.com/tensorflow/models/master/tutorials/image/mnist/convolutional.py
```

Upload the script to the `tensorflow` folder in the share using the [az storage file upload](/cli/azure/storage/file#az-storage-file-upload) command.

```azurecli-interactive
az storage file upload \
    --share-name scripts \
    --path tensorflow \
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

In your working directory, create a training job configuration file `job.json` with the following content. You pass this configuration file when you submit the training job. Update with the name of your storage account in the two places indicated (use the value of the $AZURE_STORAGE_ACCOUNT variable, similar to *baixxxxxxxxxxxxxxxxx*).

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

This `job.json` file includes TensorFlow settings to locate the Python script file that will run in a TensorFlow container on the GPU node. It also specifies the location of the job's log files that are saved to Azure storage.

Use the [az batchai job create](/cli/azure/batchai/job#az-batchai-job-create) command to submit the job on the node, passing the `job.json` configuration file:

```azurecli-interactive
az batchai job create \
    --name myjob \
    --cluster mycluster \
    --experiment myexperiment \
    --workspace myworkspace \
    --resource-group myResourceGroup \
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

## Get job output

Batch AI creates a unique folder structure in the storage account for each job's output. Set the JOB_OUTPUT_PATH environment variable with this path. Then, list the output files in storage using the [az storage file list](/cli/azure/storage/file#az-storage-file-list) command:

```azurecli-interactive
export JOB_OUTPUT_PATH=$(az batchai job show --name myjob --experiment myexperiment --workspace myworkspace --resource-group myResourceGroup --query jobOutputDirectoryPathSegment | sed s/\"//g)

az storage file list \
    --share-name logs \
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

Use the [az storage file download](/cli/azure/storage/file#az-storage-file-download) command to download one or more files locally. For example:

```azurecli-interactive
az storage file download \
    --share-name logs \
    --path $JOB_OUTPUT_PATH/stdouterr/stdout-wk-0.txt
```

## Clean up resources
If you want to continue with Batch AI tutorials and samples, use the Batch AI workspace, cluster, and storage account created in this quickstart. 

You're charged for the Batch AI cluster while the nodes are running. If you want to maintain the cluster configuration when you have no jobs to run, resize the cluster to 0 nodes. Later, resize it to 1 or more nodes to run your jobs. When you no longer need a cluster, delete it with the [az batchai cluster delete](/cli/azure/batchai/cluster#az_batchai_cluster_delete) command:

```azurecli-interactive
az batchai cluster delete 
    --name mycluster
    --workspace myworkspace
    --resource-group myResourceGroup
```

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource groups for the Batch AI and storage resources. Delete the Batch AI resources as follows:

```azurecli-interactive 
az group delete --name myResourceGroup
```

Delete the automatically generated storage resources as follows:

```azurecli-interactive
az group delete --name batchaiautostorage
```

## Next steps
In this quickstart, you learned how to run an example TensorFlow training job on a Batch AI cluster, using the Azure CLI. To learn more about using Batch AI with different training frameworks, see the [training recipes](https://github.com/Azure/BatchAI).
