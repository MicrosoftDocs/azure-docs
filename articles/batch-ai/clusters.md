---
title: Work with Azure Batch AI clusters | Microsoft Docs
description: How to choose a Batch AI cluster configuration, and create and manage a cluster AI
services: batch-ai
documentationcenter: ''
author: johnwu10
manager: jeconnoc
editor: ''

ms.service: batch-ai
ms.topic: article
ms.date: 08/14/2018
ms.author: danlep
ms.custom: mvc

---
# Work with Batch AI clusters 

This article explains how to work with clusters in Azure Batch AI. It introduces the concept of clusters, the types of configurations that are possible, and examples. Most of the examples to create and manage a cluster in this article use the Azure CLI. However, you can use other tools including the Azure portal and the Azure Batch AI SDKs to work with clusters.

A Batch AI cluster is one of several resources in the service. See the [overview of Batch AI resources](resource-concepts.md) to understand the scope of clusters in the service.

## Introduction to clusters

A cluster in Batch AI contains the compute resources for running machine learning and AI training jobs. All nodes in a cluster have the same VM size and OS image. Batch AI offers many options for creating clusters that are customized to different needs. Typically, you set up a different cluster for each category of processing power needed to complete a project. You can scale the number of nodes in a cluster up and down based on demand and budget. Clusters can be provisioned and shared among a team, or individuals can each provision their own cluster. 

Each cluster exists under a Batch AI resource called a *workspace*. Before provisioning any cluster, you must have a Batch AI workspace set up. For example, if you use the Azure CLI, use the [az batchai workspace create](/cli/azure/batchai/workspace?view=azure-cli-latest#az-batchai-workspace-create) command to set up a workspace. 

After you create a cluster, you can submit jobs one at a time into a queue. Batch AI then handles the resource allocation process for running the jobs on the cluster. 

## Cluster configuration options

When planning a cluster, first determine your compute requirements. Batch AI offers flexible configuration options so you can tailor a cluster to your needs. The following are the majors options to consider when provisioning a cluster:

* **VM size** - Choose any [VM size](../virtual-machines/linux/sizes.md) that is available in a [supported region](https://azure.microsoft.com/global-infrastructure/services/) for the cluster nodes. Each cluster can only contain one size of VM, so if your tasks require multiple types of VMs, you need to provision a separate cluster for each type of compute requirement. To train machine learning or AI models developed with frameworks that take advantage of GPUs, see the [GPU optimized VM sizes](../virtual-machines/linux/sizes-gpu.md) in Azure.
  
* **VM priority** - Batch AI offers either dedicated or low-priority VMs for a cluster. Dedicated VMs are reserved for your use in the cluster. The low-priority option allocates unused Azure VM capacity at significant cost savings in exchange for the possibility of jobs being pre-empted if Azure reclaims the VMs. Jobs that run for longer than 24 hours on a low-priority VM are also automatically pre-empted. If budget is a concern, consider using low-priority VMs for short experimentation jobs. Then, switch to dedicated VMs when it's time to run longer jobs.

* **Number of nodes** - Batch AI offers manual and autoscaling options for the number of nodes in the cluster. With the manual option, you control when to scale a cluster up and down, so you can manage your own compute costs. The autoscaling option ensures that the cluster always downscales when you're not using it, so you minimize your compute costs. 

  If you choose to scale the cluster manually, then you define the initial target during cluster creation. The target is the number of nodes that Batch AI allocates initially. Later, you can manually resize the number of nodes.  

  If you choose the autoscaling option, you define the maximum and minimum number of target nodes during cluster creation. The target can range from 0 to the maximum number of nodes supported by your [Batch AI cores quota](quota-limits.md). A target of 0 allows you to maintain your cluster configuration without being charged for any compute costs. If you request a higher target than your quota limit supports, then the provisioning will fail. 

* **VM image** - Batch AI by default provisions the cluster VMs with a default Ubuntu Server image that supports container workloads. You can choose another preconfigured Linux image from the Azure Marketplace, such as a [Data Science Virtual Machine](../machine-learning/data-science-virtual-machine/overview.md). 

* **Storage** - Batch AI provides an auto-storage option, which you can choose when you create a cluster using the Azure CLI. This option automatically creates an Azure file Share and Blob container under a new storage account. These storage resources are mounted to each of the nodes in the cluster during execution time, allowing the files to be accessed from a local path. The storage account names, file share name, Blob container name, and mount paths all have default values, which can also be customized using additional parameters during cluster creation. 

  If no storage options are defined, then you need to create the storage resources separately and define them when submitting jobs. This option is useful if your cluster is managed at the organization level, but your storage is managed at the user level. For more information on how to upload files to Azure Storage and access them during execution time, see [Store Batch AI job input and output with Azure Storage](use-azure-storage.md).

* **User access** - Batch AI allows you to generate public and private SSH key files when creating a cluster, or supply your own SSH keys so that you can SSH into individual nodes. You can also define a user name (set as the current user by default) and password. These credentials can be used to access the nodes during execution in order to view various metrics or gain further insight to your jobs.

* **Setup task** - Batch AI allows you to define command-line arguments to be executed on each node upon allocation. You can also define the path where the output file should be logged to. Use this option when you have additional provisioning steps beyond the base image.

* **Additional configuration** - There are several less common scenarios, which might require more specialized configurations. In this case, a [cluster configuration file](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#using-cluster-configuration-file) can be attached with the Azure CLI command to create a cluster. 

## Create the cluster

After you have decided on the cluster configuration options, use the Azure CLI, Azure portal, or Batch AI APIs to create the cluster. For example, to create a cluster using the Azure CLI, you can follow the [az batchai cluster create](/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-create) documentation to create the exact command that gives you the configurations that you need. 

At the most basic configuration, the following command provisions a Standard_NC6 cluster with one node and SSH access. By default, this cluster contains dedicated VMs running the latest default Ubuntu Server image.

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

The following example provisions a Standard_NC6 cluster that includes a Data Science Virtual Machine image, custom storage and mounting options, custom SSH credentials, a setup task that installs the *unzip* package, and a cluster configuration file for additional setup. This configuration is an example of a cluster that is more customized to your own needs.

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --vm-size Standard_NC6 \
    --image UbuntuDSVM \ 
    --config-file cluster.json \
    --setup-task 'apt install unzip -y'
    --storage-account-name <STORAGE ACCOUNT NAME> \
    --nfs-name nfsmount \
    --afs-name afsmount \
    --bfs-name bfsmount \
    --user-name adminuser \
    --ssh-key id_rsa.pub \
    --password secretpassword 
```

## Monitor the cluster

The [az batchai cluster list](/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-list), [az batchai cluster show](/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-show), and [az batchai cluster node list](/cli/azure/batchai/cluster/node?view=azure-cli-latest#az-batchai-cluster-node-list) commands can be used to monitor various information for each of the clusters.

### List all clusters

The following command list alls of the clusters in a workspace.

```azurecli-interactive
az batchai cluster list \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> 
```

### Show information about a cluster

The following command shows the full information about a specific cluster in a table format.

```azurecli-interactive
az batchai cluster show \
    --name <CLUSTER NAME> \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --output table
```

If your cluster was provisioned using the auto storage option, you'll want to retrieve the storage account name to use when uploading scripts and training jobs. Use the following command:

```azurecli-interactive
az batchai cluster show \
    --name <CLUSTER NAME> \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --query "nodeSetup.mountVolumes.azureFileShares[0].{storageAccountName:accountName}"
```

The output should be similar to the following.

```JSON
{
  "storageAccountName": "baixxxxxxxxx"
}
```

### List cluster nodes

If you need to connect to the cluster nodes, the following command retrieves the list of nodes and the connection information.  

```azurecli-interactive
az batchai cluster node list \
    --name <CLUSTER NAME> \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> 
 ```

The output for each node will be similar to the following:

```JSON
[
  {
    "ipAddress": "40.68.xxx.xxx",
    "nodeId": "tvm-xxxxxxxxxx-xxxxxxxx",
    "port": 50000.0
  }
]
```
You can use this information to make an SSH connection to a node using a command similar to the following.

```bash
ssh myusername@40.68.xxx.xxx -p 50000
``` 

## Submit jobs to the cluster

After provisioning the cluster, you can then submit jobs to run on the nodes. See the [az batchai job](/cli/azure/batchai/job?view=azure-cli-latest) command for different ways to prepare, submit, and monitor jobs using the Azure CLI. 

## Downscale cluster for later use

Once you are finished running your jobs, you will want to downscale your cluster. It is recommended to always downscale clusters when they are not being used in order to save compute costs. Downscaling a cluster to 0 nodes allows you to stop your billing charges while not needing to reprovision the clusters in the future when you need to upscale again. If autoscaling was selected in cluster creation, the cluster should automatically downscale to the minimum target. If manual scaling was selected, downscale the cluster using the following command.

```azurecli-interactive
az batchai cluster resize \
    --name <CLUSTER NAME> \
    --resource-group <RESOURCE GROUP> \
    --workspace <WORKSPACE> \
    --target 0
```

## Delete a cluster

Once you are finished using a cluster, use the [az batchai cluster delete](/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-delete) command to delete it.

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

For more examples of creating a Batch AI cluster, see the [Portal](quickstart-create-cluster-portal.md) or [Azure CLI](quickstart-create-cluster-cli.md) quickstart, or the [Batch AI recipes](https://github.com/Azure/BatchAI/tree/master/recipes) on GitHub.
