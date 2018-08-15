---
title: Work with Azure Batch AI clusters | Microsoft Docs
description: How-to choose a Batch AI cluster configuration, and create and manage a cluster AI
services: batch-ai
documentationcenter: ''
author: johnwu10
manager: jeconnoc
editor: ''

ms.service: batch-ai
ms.topic: article
ms.date: 08/14/2018
ms.author: danlepo
ms.custom: mvc

---
# Work with Batch AI clusters 

This article explains how to work with clusters in Azure Batch AI. It introduces the concept of clusters, the types of configurations that are possible, and examples of different use cases. Most of the examples to create a cluster use the Azure CLI, but you can use other tools including the Azure portal and the Azure Batch AI SDKs to create cluster.

A Batch AI cluster is one of several resources in the service. See the [overview of Batch AI resources](resource-concepts.md) of Azure Batch AI in order to understand the scope of clusters within the service.

## Introduction to clusters

A cluster in Batch AI contains the compute resources for running jobs. All nodes in a cluster have the same VM size and OS image. Batch AI offers many options for creating clusters that are customized to different needs. Typically, a different cluster is set up for each category of processing power needed to complete a project. The number of nodes in a cluster can also be scaled up and down based on demand and budget. Clusters can be provisioned and shared among a team, or individuals can each provision their own cluster. 

Each cluster exists under a Batch AI resource called a *workspace*. Before provisioning any cluster, you must have a Batch AI workspace set up. For example, if you use the Azure CLI, use the [az batchai workspace create](https://docs.microsoft.com/cli/azure/batchai/workspace?view=azure-cli-latest#az-batchai-workspace-create) command to set up a workspace. 

Upon creation of a cluster, jobs can be submitted one at a time into a queue. Batch AI then handles the resource allocation process for running the jobs on the cluster. 

## Cluster configuration options

When planning to provision a cluster, first determine your compute requirements. Batch AI offers lots of flexible configuration options so you can tailor a cluster toward your needs. The following list goes over the majors options to consider when provisioning a cluster:

* **VM size** - Batch AI allows you to choose any [VM size](../virtual-machines/linux/sizes.md) that is available in a [supported region](https://azure.microsoft.com/global-infrastructure/services/) for the cluster nodes. Each cluster can only contain one size of VM, so if your tasks require multiple types of VMs, you need to provision a separate cluster for each type of compute requirement. To train machine learning or AI models that use frameworks that take advantage of GPUs, see the [GPU optimized VM sizes](../virtual-machines/windows/sizes-gpu.md) in Azure.
  
* **VM priority** - Batch AI offers either dedicated or low-priority VMs for a cluster. The low-priority option allocates unused Azure capacity of other VMs at significant cost savings in exchange for the possibility of jobs being pre-empted if Azure reclaims the VMs. Jobs that run for longer than 24 hours on a low-priority VM are also automatically pre-empted. If budget is a concern, consider using low-priority VMs for short experimentation jobs and switch to dedicated VMs when it is time to run longer jobs.

* **Number of nodes** - Batch AI offers manual and autoscaling options for the number of nodes in the cluster. The manual option let you control when to scale a cluster up and down, so you can manage your own compute costs. The autoscaling option ensures that the cluster always downscales when not being utilized in order to minimize your compute costs. If the manual option is selected, then you define the initial target during cluster creation. The target is the number of nodes that are allocated immediately after creation. If the autoscaling option is selected, the maximum and minimum number of target nodes must also defined during cluster creation. The target can range from 0 to the maximum number of nodes supported by your [Batch AI cores quota](quota-limits.md). A target of 0 will allow you maintain your cluster configuration without being charged for any compute costs. If you request a higher target than your quota limit, then the provisioning will fail. To view more information about quota limits, see the following [article](quota-limits.md).

* **VM image** - Batch AI by default provisions the VMs in the cluster with a default Ubuntu Server image that supports container workloads. Or choose a preconfigured Linux image from the Azure Marketplace, such as a [Data Science Virtual Machine](../machine-learning/data-science-virtual-machine/overview.md). 

* **Storage** - Batch AI provides an auto-storage option, which you can choose when you create a cluster using the Azure CLI. This option automatically creates an Azure file Share and Blob container under a new storage account. These storage resources are mounted to each of the nodes in the cluster during execution time, allowing the files to be accessed from a local path. The storage account names, file share name, blob container name, and mount paths all have default values, which can also be customized using additional parameters during cluster creation. If no storage options are defined, then you need to create the storage resourcess separately and define them when submitting jobs. This option is useful if your cluster is managed at the organization level, but your storage is managed at the user level. For more information on how to upload files to the storage and access them during execution time, see [Store Batch AI job input and output with Azure Storage](use-azure-storage.md).

* **User access** - Batch AI allows you to generate public and private SSH key files when creating a cluster, or supply your own SSH keys to SSH into individual nodes. You can also define a user name and password, which is set to the same credentials as the current user by default. These credentials can be used to access the nodes during execution in order to view various metrics or gain further insight to your jobs.

* **Setup task** - Batch AI allows you to define command-line arguments to be executed on each node upon allocation. You can also define the path where the output file should be logged to. Use this option when you have additional provisioning steps beyond the base image.

* **Additional configuration** - There are several less common scenarios, which might require more unique configurations. In this case, a [cluster configuration file](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#using-cluster-configuration-file) can be attached with the Azure CLI command to create a cluster. 

## Create the cluster

After you have decided on the options to use on the cluster, use the Azure portal, Azure CLI, or Batch AI APIs to create the cluster. For example, to create a cluster using the Azure CLI, you can follow the [az batchai cluster create](https://docs.microsoft.com/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-create) documentation to create the exact command that gives you the configurations that you need. 

At the most basic configuration, the following command provisions a Standard_NC6 cluster with one node and SSH access. By default, this cluster contains dedicated VMs running the latest default Ubuntu Server 16.04-LTS image.

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --vm-size Standard_NC6 \
    --target 1 \
    --generate-ssh-keys
```

The following example provisions a Standard_NC6 cluster that scales automatically from 0 to 4 nodes and uses low-priority nodes and an auto-storage account. This setup is a good configuration if you need a cluster that is low cost and easy to manage. 

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --vm-size Standard_NC6 \
    --vm-priority lowpriority \
    --max 4 \
    --min 0 \
    --use-auto-storage 
```

The following example provisions a Standard_NC6 cluster that includes a DSVM image, custom storage and mounting options, custom SSH credentials a task, which installs the *unzip* package, and a cluster configuration file for additional setup. This configuration is an example of a cluster that is more customized to your own needs.

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --vm-size Standard_NC6 \
    --image UbuntuDSVM \ 
    --config-file cluster.json \
    --storage-account-name <STORAGE ACCOUNT NAME> \
    --nfs-name nfsmount \
    --afs-name afsmount \
    --bfs-name bfsmount \
    --user-name adminuser \
    --ssh-key id_rsa.pub \
    --password secretpassword 
```

## Monitor the cluster

The [az batchai cluster show](https://docs.microsoft.com/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-show), [az batchai cluster list](https://docs.microsoft.com/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-list), [az batchai cluster node list](https://docs.microsoft.com/cli/azure/batchai/cluster/node?view=azure-cli-latest#az-batchai-cluster-node-list) commands can be used to monitor various information for each of the clusters.

The following command can be used to list all of the existing clusters in a workspace.

```azurecli-interactive
az batchai cluster list \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> 
```

The following command can be used to show the full information about a specific cluster in a table format.

```azurecli-interactive
az batchai cluster show \
    --name <CUSTER> \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --output table
```

If your cluster was provisioned using the auto storage option, you'll want to retrieve your storage account name in order to use when uploading scripts and training jobs. You can use the following command in order to so.

```azurecli-interactive
az batchai cluster show \
    --name <CUSTER> \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --query "nodeSetup.mountVolumes.azureFileShares[0].{storageAccountName:accountName}"
```

The output should be similar to the following. The name of the storage account will be referred to as `<STORAGE ACCOUNT NAME>` in future commands. 

```
{
  "storageAccountName": "baixxxxxxxxx"
}
```

If you need to connect to the cluster nodes, the following command can be used to retrieve the connection information.  

```azurecli-interactive
az batchai cluster node list \
    --name <CUSTER> \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> 
 ```

The output will be similar to following example.

```JSON
[
  {
    "ipAddress": "40.68.xxx.xxx",
    "nodeId": "tvm-xxxxxxxxxx-xxxxxxxx",
    "port": 50000.0
  }
]
```
You can use this information to make an SSH connection to the node using the following command.

```bash
ssh myusername@40.68.xxx.xxx -p 50000
``` 

### 5. Submitting jobs to the cluster

After provisioning the cluster, jobs can then be submitted to run on the nodes. See the [az batchai job](https://docs.microsoft.com/cli/azure/batchai/job?view=azure-cli-latest) command for different ways to prepare, submit, and monitor jobs using the Azure CLI. 

### 6. Downscaling cluster for later use

Once you are finished running your jobs, you will want to downscale your cluster. It is recommended to always down scale clusters when they are not being used in order to save compute costs. Downscaling a cluster to zero allows you to stop your billing charges while not needing to pre-provision the clusters in the future when you need to upscale again. If auto scale was selected in cluster creation, it should automatically downscale to the minimum target. If manual scaling was selected, you will need to down scale it using the following command.

```azurecli-interactive
az batchai cluster resize \
    --name <CLUSTER NAME> \
    --resource-group <RESOURCE GROUP> \
    --workspace <WORKSPACE>
```

## Delete a cluster

Once you are finished using a cluster, use the [az batchai cluster delete](https://docs.microsoft.com/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-delete) command to delete it.

```azurecli-interactive
az batchai cluster delete \
    --name <CLUSTER NAME> \
    --resource-group <RESOURCE GROUP> \
    --workspace <WORKSPACE>
```

Deleting your resource group also automatically deletes all clusters that were provisioned under that resource group.

```azurecli-interactive
az group delete --name <RESOURCE GROUP>
```

## Next steps

For examples of creating a Batch AI cluster, see the [Portal](quickstart-create-cluster.md) or [Azure CLI](quickstart-create-cluster-cli.md) quickstart or the [Batch AI recipes](https://github.com/Azure/BatchAI/tree/master/recipes) on GitHub.
