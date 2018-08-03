---
title: Working with Azure Batch AI clusters | Microsoft Docs
description: How-to guide for working with clusters on Azure Batch AI
services: batch-ai
documentationcenter: ''
author: johnwu10
manager: Alex Sutton
editor: ''

ms.service: batch-ai
ms.topic: article
ms.date: 07/24/2018
ms.author: t-jowu
ms.custom: mvc

---
# Working with clusters on Azure Batch AI

The following article explains the process of working with clusters in Azure Batch AI. It will introduce the concept of clusters, the types of configurations that are possible, and examples of different use cases. Before moving forward with reading this article, be sure to familiarize yourself with the [overview](overview.md) of Azure Batch AI in order to understand the scope of clusters within the service.

## Introduction to clusters

A cluster in Batch AI contains the compute resources for running jobs. All nodes in a cluster have the same VM size and OS image. Batch AI offers many options for creating clusters that are customized to different needs, which will be explained in the next section. Typically, a different cluster is set up for each category of processing power needed to complete a project. Clusters can also be scaled up and down based on demand and budget. Upon creation of a cluster, jobs can be submitted one at a time into a queue and Batch AI will handle the resource allocation process for running the jobs on the cluster. Clusters can be provisioned and shared amongst a team or individuals can each provision their own cluster.

## Cluster workflow

### 1. Prerequisites

Clusters exist under a Batch AI resource called workspaces. Before provisioning any cluster, you must have a Batch AI workspace set up. You can use the [az batchai workspace create](https://docs.microsoft.com/en-us/cli/azure/batchai/workspace?view=azure-cli-latest#az-batchai-workspace-create) command to set up a workspace. For more information about workspaces and other Batch AI concepts, see the following [article](resource-concepts.md).

### 2. Determining the cluster configurations

When planning to provision a cluster, you must first determine the exact compute requirements. Batch AI offers lots of flexible configuration options in order to allow you to create a cluster tailored towards your needs. The following list goes over the majors options, which should be considered when provisioning a cluster:

* **VM Size** - Batch AI allows you to choose any VM size that is available in your region for the nodes on the cluster. Each cluster can only contain one type of VM, so if your tasks require multiple types of VMs, you will need to provision a new cluster for each type of compute requirement. The following [article](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-gpu) shows the different type of GPU-Enabled VM options that are available in Azure.
  
* **Priority** - Batch AI offers dedicated and low-priority VM options for a cluster. The low-priority option allocates unutilized capacity of other VMs at significant cost savings in exchange for the possibility of jobs being pre-empted by higher priority tasks. Jobs that run for longer than 24 hours on a low-priority VM will also be automatically pre-empted. If budget is a concern, consider using low-priority for short experimentation jobs and switch to a dedicated priority when it is time to run longer jobs.

* **Target** - Batch AI offers both a manual and auto scaling option for the number of nodes in the cluster. The manual option gives users more control of when to scale a cluster up and down, giving you full control of managing your own compute costs. The auto scaling option ensures that the cluster always downscales when not being utilized in order to minimize your compute costs. If the manual option is selected, the initial target must be defined during cluster creation. The target is the number of nodes that will be allocated immediately after creation. If the auto scaling option is selected, the maximum and minimum number of target nodes must be defined during cluster creation. The target can range from 0 to the maximum quota that you have in your subscription. A target of 0 will allow you keep your VM provisioning without being charged for any compute costs. If you request a higher target than your quota limit, then the provisioning will fail. To view more information about quota limits, see the following [article](quota-limits.md).

* **VM Image** - Batch AI allows the VMs in the cluster to be provisioned with the default OS or with a preconfigured Azure Image, such as a [Data Science Virtual Machine](https://azure.microsoft.com/en-us/services/virtual-machines/data-science-virtual-machines/). See the following [article](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/cli-ps-findimage) for more information on finding the right image for your needs.

* **Storage** - Batch AI provides an auto storage feature as an option, which can be enabled when creating a cluster. This option will automatically create a File Share and Blob Container under a new storage account. These storages will be mounted to each of the nodes in the cluster during execution time allowing the files to be accessed from a local path. The storage account names, file share name, blob container name, and mount paths all have default values, which can also be customized using additional parameters during cluster creation. If no storage options are defined, then you will need to create the storages separately and define them when submitting jobs. This option is useful if your cluster is managed at the organization level, but your storage is managed at the user level. For more information on how to upload files to the storage and access them during execution time, see the following [article](use-azure-storage.md).

* **User Access** - Batch AI allows you to generate public and private SSH key files when creating a cluster, which allows you to SSH into individual nodes. You can also define a user name and password, which is set to the same credentials as the current user by default. These credentials can be used to access the nodes during execution in order to view various metrics or gain further insight to your jobs.

* **Task Setup** - Batch AI allows you to define command-line arguments to be executed on each node upon allocation. You can also define the path where the output file should be logged to. Use this option when you have additional provisioning steps beyond the base image.

* **Additional Configurations** - There are several less common scenarios, which might require more unique configurations. In this case, a cluster configuration file can be attached with the request. See this [article](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#using-cluster-configuration-file) for more information on the schema and types of settings available.

### 3. Provisioning the cluster

Once you have decided on the options to use on the cluster, then you can follow the [az batchai cluster create](https://docs.microsoft.com/en-us/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-create) documentation to create the exact command, which will give you the configurations that you need. 

At the most basic configuration, the following command will provision a Standard_NC6 cluster with one node and SSH access. By default, this cluster will contain dedicated priority VMs running the latest default Ubuntu 16.04-LTS image.

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --vm-size Standard_NC6 \
    --target 1 \
    --generate-ssh-keys
```

The following example provisions a Standard_NC6 cluster that scales automatically from 0 to 4 nodes and uses low-priority nodes. This setup is a good configuration if you need something that is low cost and easy to manage. 

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

The following example provisions a Standard_NC6 cluster that includes a DSVM image, custom storage and mounting options, custom SSH credentials a task, which installs the *unzip* package, and a cluster configuration file for additional setup. This configuration is an example of a cluster that is more customized towards your own needs.

```azurecli-interactive
az batchai cluster create \
    --name mycluster \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE GROUP> \
    --vm-size Standard_NC6 \
    --image UbunutuDSVM \ 
    --config-file cluster.json \
    --storage-account-name <STORAGE ACCOUNT NAME> \
    --nfs-name nfsmount \
    --afs-name afsmount \
    --bfs-name bfsmount \
    --user-name adminuser \
    --ssh-key id_rsa.pub \
    --password secretpassword 
```
### 4. Monitoring the cluster

The [az batchai cluster show](https://docs.microsoft.com/en-us/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-show), [az batchai cluster list](https://docs.microsoft.com/en-us/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-list), [az batchai cluster node list](https://docs.microsoft.com/en-us/cli/azure/batchai/cluster/node?view=azure-cli-latest#az-batchai-cluster-node-list) commands can be used to monitor various information for each of the clusters.

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

After provisioning the cluster, jobs can then be submitted to run on the nodes. See the [az batchai job](https://docs.microsoft.com/en-us/cli/azure/batchai/job?view=azure-cli-latest) command for different ways to prepare, submit, and monitor jobs using the Azure CLI. 

### 6. Downscaling cluster for later use

Once you are finished running your jobs, you will want to downscale your cluster. It is recommended to always down scale clusters when they are not being used in order to save compute costs. Downscaling a cluster to zero allows you to stop your billing charges while not needing to pre-provision the clusters in the future when you need to upscale again. If auto scale was selected in cluster creation, it should automatically downscale to the minimum target. If manual scaling was selected, you will need to down scale it using the following command.

```azurecli-interactive
az batchai cluster resize \
    --name <CLUSTER NAME> \
    --resource-group <RESOURCE GROUP> \
    --workspace <WORKSPACE>
```

### 7. Deleting the cluster

Once you are finished using the cluster, you can use the [az batchai cluster delete](https://docs.microsoft.com/en-us/cli/azure/batchai/cluster?view=azure-cli-latest#az-batchai-cluster-delete) command in order to do so.

```azurecli-interactive
az batchai cluster delete \
    --name <CLUSTER NAME> \
    --resource-group <RESOURCE GROUP> \
    --workspace <WORKSPACE>
```
Deleting your resource group will also automatically delete all clusters that were provisioned under that resource group.

```azurecli-interactive
az group delete --name <RESOUCE GROUP>
```

## Next steps
For examples of using Batch AI, check the quickstart tutorial or the recipes on GitHub.

> [!div class="nextstepaction"]
> [Batch AI quickstart](quickstart-tensorflow-training-cli.md)
> [Batch AI recipes](https://github.com/Azure/BatchAI/tree/master/recipes)
