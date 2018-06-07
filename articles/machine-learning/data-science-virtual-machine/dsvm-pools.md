---
title: Data Science Virtual Machine Pools - Azure | Microsoft Docs
description: Deploying pools of Data Science VM as a shared resource for the team
keywords: deep learning, AI, data science tools, data science virtual machine, geospatial analytics, team data science process
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun


ms.assetid: 
ms.service: machine-learning
ms.component: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2018
ms.author: gokuma

---

# Creating a shared pool of Data Science Virtual Machines

This article discusses how a shared pool of Data Science Virtual Machines (DSVM) can be created for use by the team. The benefit of using a shared pool is better resource utilization, facilitating sharing and collaboration and allowing IT to manage the DSVM resources more effectively. 

There are many ways and different technologies that can be used to create a pool of DSVM.  The following are main scenarios:

* Pool for Batch Processing
* Pool for interactive VMs

## Batch processing Pool
If you want to set up a pool of DSVM mainly to run jobs in a batch offline, then you can use [Azure Batch AI](https://docs.microsoft.com/azure/batch-ai/) service or [Azure Batch](https://docs.microsoft.com/azure/batch/). 

### Azure Batch AI
The Ubuntu edition of the DSVM is supported as one of the images in Azure Batch AI. In the Azure CLI or the Python SDK where you create the Azure Batch AI cluster, you can specify the ```image``` parameter and set it to ```UbuntuDSVM```. You can choose what kind of processing nodes you want - GPU-based instances vs CPU only instances, number of CPUs, memory from a [wide choice of VM instances](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) available on Azure. When you use the Ubuntu DSVM image in Batch AI with GPU-based nodes, all the necessary GPU drivers and deep learning frameworks are preinstalled saving you considerable time in preparing the batch nodes. In fact, if you are developing on an Ubuntu DSVM interactively, you will notice that the Batch AI nodes are exactly the same setup and configuration of the environment. Typically when a Batch AI cluster is created you also create a file share that is mounted by all the nodes and is used for input and output of data as well as storing the batch job code / scripts. 

Once your Batch AI cluster is created, you can use the same CLI or Python SDK to submit jobs to be run. You only pay for the time that is used to run the batch jobs. 

#### More information
* Step-by-step walkthrough of using [Azure CLI](https://docs.microsoft.com/azure/batch-ai/quickstart-cli) for managing Batch AI
* Step-by-step walkthrough of using  [Python](https://docs.microsoft.com/azure/batch-ai/quickstart-python) for managing Batch AI
* [Batch AI recipes](https://github.com/Azure/BatchAI) are available demonstrating how to use various AI/deep learning frameworks with Batch AI.

## Interactive VM pool

A pool of interactive DSVMs that are shared by the whole AI / data science team allows users to log in to an available instance of the DSVM instead of having a dedicated instance for each set of users. This helps with better availability and more effective utilization of resources. 

The technology used to create an interactive VM pool is the [Azure Virtual Machine Scale Sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/) (VMSS), which  lets you create and manage a group of identical, load balanced, and autoscaling VMs. The user logs into the main pool's IP or DNS address. The Scale set automatically routes the session to an available DSVM in the Scale Set. Since user would like similar environment irrespective of the VM they are logging into, all instances of the VM in the Scale Set mounts a shared network drive like an Azure Files or an NFS share. The user's shared workspace is  normally kept on the shared file store that is mounted on each of the instances. 

A sample Azure Resource Manager template that creates a VM Scale Set with Ubuntu DSVMs instances can be found on the [github](https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/dsvm-vmss-cluster.json). A sample of the Azure Resource Manager template [parameter file](https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/dsvm-vmss-cluster.parameters.json) is also provided in the same location. 

You can create the VM scale set from the Azure Resource Manager template by specifying suitable values for the parameter file using Azure CLI. 

```
az group create --name [[NAME OF RESOURCE GROUP]] --location [[ Data center. For eg: "West US 2"]
az group deployment create --resource-group  [[NAME OF RESOURCE GROUP ABOVE]]  --template-uri https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/dsvm-vmss-cluster.json --parameters @[[PARAMETER JSON FILE]]
```
The commands above assume you have a copy of the parameter file with the values specified for your instance of the VM scale set, number of VM instances, pointers to your Azure Files along with credentials for the storage account that will be mounted on each VM. The parameter file is referenced locally in the command above. You can pass also parameters inline or prompt for them in your script.  

The template above enables the SSH and the Jupyterhub port from the frontend VM Scale set to the backend pool of Ubuntu DSVMs.  As a user you just log in to VM on SSH or on JupyterHub in the normal manner. Since the VM instances can be scaled up or down dynamically, any state needs to be saved in the mounted Azure Files share. The same approach can be used to create a pool of Windows DSVMs. 

The [script that mounts the Azure Files](https://raw.githubusercontent.com/Azure/DataScienceVM/master/Extensions/General/mountazurefiles.sh) is also available on the Azure DataScienceVM Github. In addition to mounting the Azure Files at the specified mount point in the parameter file, it also creates additional soft links to the mounted drive in the initial user's home directory and a user-specific notebook directory within the shared Azure Files is soft linked to ```$HOME/notebooks/remote``` directory enabling user to access, run, and save their Jupyter notebooks.  The same convention can be used when you create additional users on the VM to point to each user's Jupyter workspace to the shared Azure Files. 

Azure VM Scale sets support autoscaling where you can set rules on when to create additional instances and under what circumstances to scale down instances including bringing it down to zero instances to save on cloud hardware usage costs when the VMs are not used at all. The documentation pages of VM scale sets provide detailed steps for [auto scaling](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview).

## Next steps

* [Set up Common Identity](dsvm-common-identity.md)
* [Securely store credentials to access cloud resources](dsvm-secure-access-keys.md)















