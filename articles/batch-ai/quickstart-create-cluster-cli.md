---
title: Azure Quickstart - Create Batch AI cluster - Azure CLI | Microsoft Docs
description: Quickstart - Create a Batch AI cluster for training machine learning and AI models - Azure CLI
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
#Customer intent: As a data scientist or AI researcher, I want to quickly create a GPU cluster in Azure for training my AI or machine learning models.
---

# Quickstart: Create a cluster for Batch AI training jobs using the Azure CLI

This quickstart shows how to use the Azure CLI to create a Batch AI cluster you can use for training AI and machine learning models. Batch AI is a managed service for data scientists and AI researchers to train AI and machine learning models at scale on clusters of Azure virtual machines.

The cluster initially has a single GPU node. After completing this quickstart, you'll have a cluster you can scale up and use to train your models. Submit training jobs to the cluster using Batch AI, [Azure Machine Learning](../machine-learning/service/overview-what-is-azure-ml.md) tools, or the [Visual Studio Tools for AI](https://github.com/Microsoft/vs-tools-for-ai).

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

This quickstart assumes you're running commands in a Bash shell, either in Cloud Shell or on your local computer.

## Create a resource group

Create a resource group with the `az group create` command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus2* location. Be sure to choose a location such as East US 2 in which the Batch AI service is available.

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

To create a Batch AI cluster, use the `az batchai cluster create` command. The following example creates a cluster with the following properties:

* Contains a single node in the NC6 VM size, which has one NVIDIA Tesla K80 GPU. 
* Runs a default Ubuntu Server image designed to host container-based applications, which you can use for most training workloads. 
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

The command output shows the cluster properties. It takes a few minutes to create and start the node. To see the status of the cluster, run the `az batchai cluster show` command. 

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
The cluster is ready to use when the state is `steady` and the single node is `Idle`.

## List cluster nodes 

If you need to connect to the cluster nodes (in this case, a single node) to install applications or perform maintenance, get connection information by running the `az batchai cluster node list` command:


```azurecli-interactive
az batchai cluster node list \
    --cluster mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup 
 ```

JSON output is similar to:

```JSON
[
  {
    "ipAddress": "40.68.254.143",
    "nodeId": "tvm-1816144089_1-20180626t233430z",
    "port": 50000.0
  }
]
```
Use this information to make an SSH connection to the node. For example, substitute the correct IP address of your node in the following command:

```bash
ssh myusername@40.68.254.143 -p 50000
``` 
Exit the SSH session to continue.

## Resize the cluster

When you use your cluster to run a training job, you might need more compute resources. For example, to increase the size to 2 nodes for a distributed training job, run the [batch ai cluster resize](/cli/azure/batchai/cluster#az-batchai-cluster-resize) command:

```azurecli-interactive
az batchai cluster resize \
    --name mycluster \
    --workspace myworkspace \
    --resource-group myResourceGroup \
    --target 2
```

It takes a few minutes for the cluster to resize.

## Clean up resources

If you want to continue with Batch AI tutorials and samples, use the Batch AI workspace created in this quickstart. 

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
    --resource-group myResourceGroup \
```

When no longer needed, you can use the `az group delete` command to remove the resource group for the Batch AI resources. 

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you learned how to create a Batch AI cluster, using the Azure CLI. To learn about how to use a Batch AI cluster to train a model, continue to the quickstart for training a deep learning model.

> [!div class="nextstepaction"]
> [Train a deep learning model](./quickstart-tensorflow-training-cli.md)
