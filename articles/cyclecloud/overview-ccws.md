---
title: Overview of Azure CycleCloud Workspace for Slurm
description: In this overview, learn about Azure CycleCloud Workspace for Slurm, a solution to quickly create a ready to use Slurm based AI/HPC cluster.
author: xpillons
ms.date: 08/22/2024
ms.author: xpillons
---

# What is Azure CycleCloud Workspace for Slurm?

Slurm is one of the most popular and widely used open-source workload manager for AI/HPC and cloud computing. Slurm enables users to run large-scale parallel and distributed applications across a set of compute nodes and provides features such as job scheduling, resource management, fault tolerance, and power management. Slurm is used by many of the world's top supercomputers, research institutes, universities, and enterprises.

However, setting up and managing Slurm clusters on the cloud can be challenging and time-consuming, especially for users who are not familiar with the cloud environment or the Slurm configuration. Users must deal with tasks such as provisioning and scaling compute nodes, installing and updating Slurm software, configuring network and storage, monitoring cluster health and performance, and troubleshooting issues. These tasks can distract users from their core research or business objectives and reduce the productivity and efficiency of their AI/HPC workloads.

Azure CycleCloud Workspace for Slurm is an Azure Marketplace solution template that allows users to easily create, configure, and deploy pre-defined Slurm clusters with CycleCloud on Azure, without requiring any prior knowledge of Azure or Slurm. Slurm clusters will be pre-configured with PMix v4, Pyxis, and enroot to support containerized AI/HPC Slurm jobs. Users can access the provisioned login node using SSH or Visual Studio Code to perform common tasks like submitting and managing Slurm jobs.

While Azure CycleCloud already allows you to do some of these, it doesn’t deploy the AI/HPC infrastructure for you. Users must deal with tasks such as installing and configuring CycleCloud, configuring network and storage, and creating and configuring the Slurm cluster. Azure CycleCloud Workspace for Slurm executes these tasks for you in a Marketplace Solution Template that can be deployed directly from the Azure Portal or via the Azure CLI. You will be ready in minutes and not days or weeks.

 
## What are the benefits of Azure CycleCloud Workspace for Slurm?
Azure CycleCloud is a great solution when you want to build an AI/HPC environment in Azure, either to lift and shift some of your on-premises AI/HPC workload or to build a new one. However, building a full end-to-end AI/HPC environment is not an easy task and you will have to decide how you would need to design your network, which storage component to use as a shared filesystem, which VM type for running your workload, and many small things that can make your project complex to deliver.

Azure CycleCloud Workspace for Slurm offers several benefits for users who want to run Slurm workloads on Azure, such as:

- **Easy and fast cluster creation**: Users can create Slurm clusters on Azure in minutes, by following a few simple steps in the GUI. This must be compared to days or weeks of work in the past without Azure CycleCloud Workspace for Slurm. Users can choose from a variety of Azure virtual machine (VM) sizes and types and customize the cluster settings such as the number of nodes, the network configuration, the storage options from Azure NetApp Files to Azure Managed Lustre Filesystem, and the Slurm parameters.

- **Flexible and dynamic cluster management**: Slurm clusters will be scaled up or down by Azure CycleCloud. Users can also monitor the cluster status, performance, and utilization as well as view the cluster logs and metrics in the GUI. Users can also delete their Slurm clusters when they are no longer needed and only pay for the resources they use.

## How Do I Create an Azure CycleCloud Workspace for Slurm?
Azure CycleCloud Workspace for Slurm can be deployed either from the Azure Marketplace or using the Azure CLI. To deploy from the Marketplace, first search for Slurm, then click on the Create button. To deploy using the Azure CLI, you will have to create an input parameter file first, and then deploy using the `az deployment sub create` command. Detailed instructions can be found here [How to deploy a CycleCloud Slurm Workspace environment using the CLI](how-to/ccws/deploy-with-cli.md)

## What Azure CycleCloud Workspace for Slurm is Not?
Azure CycleCloud Workspace for Slurm is not a PaaS service: the whole infrastructure will be deployed in your tenant, thereby allowing you to deploy everything (greenfield deployment) or specify existing resources to be reused (brownfield deployment), such as the target Resource Group, Virtual Network, Azure NetApp Files, and more.

## What an Azure CycleCloud Workspace for Slurm Deployed Environment Looks Like
![Overview Architecture](./images/ccws/architecture.png)

Here is the typical architecture of what will be deployed by Azure CycleCloud Workspace for Slurm. There will be mandatory resources like a Virtual Machine for running CycleCloud, a Shared filesystem for users‘s home directories, a storage account for CycleCloud projects storage.

The Virtual Network can either be deployed by Azure CycleCloud Workspace for Slurm or an existing one in which resources will be created. Optionally an Azure Managed Lustre Filesystem will be created in its own subnet. 

If your company security rules doen’t allow public IP (and many does), then you will be able to create a vnet peering to an existing Virtual Network in a usual hub and spoke pattern. The hub will then contain all the connectivity services, such as a Virtual Network Gateway or an Azure Bastion.

Finally, in a no-public IP, no VPN environment, a Bastion will be required and will provide all the secured connectivity to connect to the CycleCloud web portal and SSH in the login nodes.


## Next Steps

* [Try Azure CycleCloud Workspace for Slurm](qs-deploy-ccws.md)
