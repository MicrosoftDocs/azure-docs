---
title: Shared pools
titleSuffix: Azure Data Science Virtual Machine 
description: Learn how to create & deploy a shared pool of Data Science Virtual Machines (DSVMs) as a shared resource for a team.
keywords: deep learning, AI, data science tools, data science virtual machine, geospatial analytics, team data science process
services: machine-learning
ms.service: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: conceptual
ms.reviewer: franksolomon
ms.date: 04/11/2024
---

# Create a shared pool of Data Science Virtual Machines

In this article, you'll learn how to create a shared pool of Data Science Virtual Machines (DSVMs) for a team. Use of a shared pool offers important advantages:

- Better resource utilization
- Easier sharing and collaboration
- More effective management of DSVM resources

You can use many methods and technologies to create a pool of DSVMs. This article focuses on pools for interactive virtual machines (VMs). An alternative managed compute infrastructure involves Azure Machine Learning Compute. For more information, visit [Create compute cluster](../how-to-create-attach-compute-cluster.md).

## Interactive VM pool

A pool of interactive VM, shared by an entire AI/data science team, offers users a way to sign in to an available DSVM instance, instead of having a dedicated instance for each set of users. This approach provides better availability and more effective resource utilization.

Use [Azure virtual machine scale sets](../../virtual-machine-scale-sets/index.yml) technology to create an interactive VM pool. Use scale sets to create and manage a group of identical, load-balanced, and autoscaling VMs.

The user logs in to the IP or DNS address of the main pool. The scale set automatically routes the session to an available DSVM in the scale set. Because users want a consistent and familiar environment, regardless of the VM they sign in to, all instances of the VM in the scale set mount a shared network drive. This is similar to an Azure Files share or a Network File System (NFS) share. The user's shared workspace is normally kept on the shared file store mounted on each of the instances.

You can find a sample Azure Resource Manager template that creates a scale set with Ubuntu DSVM instances on [GitHub](https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/dsvm-vmss-cluster.json). The same location hosts a sample of the [parameter file](https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/dsvm-vmss-cluster.parameters.json) for the Azure Resource Manager template.

Specify values for the parameter file in the Azure CLI, to create the scale set from the Azure Resource Manager template:

```azurecli-interactive
az group create --name [[NAME OF RESOURCE GROUP]] --location [[ Data center. For eg: "West US 2"]
az deployment group create --resource-group  [[NAME OF RESOURCE GROUP ABOVE]]  --template-uri https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/dsvm-vmss-cluster.json --parameters @[[PARAMETER JSON FILE]]
```

Those commands assume you have:

* A copy of the parameter file with the values specified for your instance of the scale set
* The number of VM instances
* Pointers to the Azure Files share
* Credentials for the storage account that will be mounted on each VM

The commands locally reference the parameter file. You can also pass parameters inline, or prompt for them in your script.  

The preceding template enables the SSH and the JupyterHub port from the front-end scale set to the back-end pool of Ubuntu DSVMs. As a user, you would sign in to the VM on a Secure Shell (SSH) or on JupyterHub in the normal way. Because the VM instances can be scaled up or down dynamically, any state must be saved in the mounted Azure Files share. You can use the same approach to create a pool of Windows DSVMs.

The [script that mounts the Azure Files share](https://raw.githubusercontent.com/Azure/DataScienceVM/master/Extensions/General/mountazurefiles.sh) is also available in the Azure DataScienceVM repository in GitHub. The script mounts the Azure Files share at the specified mount point in the parameter file. The script also creates soft links to the mounted drive in the initial user's home directory. A user-specific notebook directory in the Azure Files share is soft-linked to the `$HOME/notebooks/remote` directory, so that users can access, run, and save their Jupyter notebooks. You can use the same convention when you create more users on the VM, to point each user's Jupyter workspace to the Azure Files share.

Virtual machine scale sets support autoscaling. You can set rules about when to create more instances and when to scale down instances. For example, you can scale down to zero instances to save on cloud hardware usage costs when the VMs aren't used at all. The virtual machine scale sets documentation pages provide detailed steps for [autoscaling](../../virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md).

## Next steps

* [Set up a common Identity](dsvm-common-identity.md)
* [Securely store credentials to access cloud resources](dsvm-secure-access-keys.md)