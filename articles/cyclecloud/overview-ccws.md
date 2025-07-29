---
title: Overview of Azure CycleCloud Workspace for Slurm
description: In this overview, learn about Azure CycleCloud Workspace for Slurm, a solution to quickly create a ready to use Slurm based AI/HPC cluster.
author: xpillons
ms.date: 07/01/2025
ms.author: padmalathas
---

# What is Azure CycleCloud Workspace for Slurm?

Slurm is one of the most popular and widely used open-source workload managers for AI, HPC, and cloud computing. With Slurm, you can run large-scale parallel and distributed applications across a set of compute nodes. It provides features such as job scheduling, resource management, fault tolerance, and power management. Many of the world's top supercomputers, research institutes, universities, and enterprises use Slurm.

However, setting up and managing Slurm clusters on the cloud can be challenging and time-consuming, especially if you're not familiar with the cloud environment or the Slurm configuration. You need to handle tasks such as provisioning and scaling compute nodes, installing and updating Slurm software, configuring network and storage, monitoring cluster health and performance, and troubleshooting issues. These tasks can distract you from your core research or business objectives and reduce the productivity and efficiency of your AI and HPC workloads.

Azure CycleCloud Workspace for Slurm is an Azure Marketplace solution template that you can use to create, configure, and deploy predefined Slurm clusters with CycleCloud on Azure. You don't need any prior knowledge of Azure or Slurm. The solution preconfigures Slurm clusters with PMix v4, Pyxis, and enroot to support containerized AI/HPC Slurm jobs. You can access the provisioned sign-in node using SSH or Visual Studio Code to perform common tasks like submitting and managing Slurm jobs.

While Azure CycleCloud already allows you to do some of these tasks, it doesn't deploy the AI/HPC infrastructure for you. You must deal with tasks such as installing and configuring CycleCloud, configuring network and storage, and creating and configuring the Slurm cluster. Azure CycleCloud Workspace for Slurm executes these tasks for you in a Marketplace solution template that you can deploy directly from the Azure portal or via the Azure CLI. You're ready in minutes and not days or weeks.


## Benefits of Azure CycleCloud Workspace for Slurm
Azure CycleCloud is a great solution when you want to build an AI/HPC environment in Azure, either to lift and shift some of your on-premises AI/HPC workload or to build a new one. However, building a full end-to-end AI/HPC environment isn't an easy task. You have to decide how to design your network, which storage component to use as a shared filesystem, which VM type to use for running your workload, and many small things that can make your project complex to deliver.

Azure CycleCloud Workspace for Slurm offers several benefits for users who want to run Slurm workloads on Azure, such as:

- **Easy and fast cluster creation**: You can create Slurm clusters on Azure in minutes by following a few simple steps in the GUI. This process is faster than days or weeks of work in the past without Azure CycleCloud Workspace for Slurm. You can choose from various Azure virtual machine (VM) sizes and types. You can customize the cluster settings such as the number of nodes, the network configuration, the storage options from Azure NetApp Files to Azure Managed Lustre Filesystem, and the Slurm parameters.

- **Flexible and dynamic cluster management**: Azure CycleCloud scales up or down Slurm clusters. You can monitor the cluster status, performance, and utilization. You can view the cluster logs and metrics in the GUI. You can also delete your Slurm clusters when they're no longer needed and only pay for the resources you use.

## How do I create an Azure CycleCloud Workspace for Slurm?
You can deploy an Azure CycleCloud Workspace for Slurm from Azure Marketplace or by using the Azure CLI. To deploy from the Marketplace, search for Slurm, then select **Create**. To deploy using the Azure CLI, you need to create an input parameter file first, and then deploy using the `az deployment sub create` command. For detailed instructions, see [How to deploy a CycleCloud Slurm Workspace environment using the CLI](how-to/ccws/deploy-with-cli.md).

## What Azure CycleCloud Workspace for Slurm is Not?
Azure CycleCloud Workspace for Slurm isn't a PaaS service. The whole infrastructure is deployed in your tenant, which allows you to deploy everything (greenfield deployment) or specify existing resources to reuse (brownfield deployment), such as the target resource group, virtual network, Azure NetApp Files, and more.

## What an Azure CycleCloud Workspace for Slurm Deployed Environment Looks Like
:::image type="content" source="./images/ccws/architecture.png" alt-text="Overview Architecture":::

Here's the typical architecture of what Azure CycleCloud Workspace for Slurm deploys. The architecture includes mandatory resources like a virtual machine for running CycleCloud, a shared filesystem for user home directories, and a storage account for CycleCloud projects storage.

Azure CycleCloud Workspace for Slurm can deploy the virtual network, or you can use an existing virtual network for resource creation. Optionally, you can create an Azure Managed Lustre Filesystem in its own subnet.

If your company security rules don't allow public IP addresses (and many don't), you can create a virtual network peering to an existing virtual network in a hub and spoke pattern. The hub contains all the connectivity services, such as a virtual network gateway or an Azure Bastion.

Finally, in an environment with no public IP and no VPN, you need a Bastion. The Bastion gives you secure access to the CycleCloud web portal and lets you use SSH to connect to the authentication nodes.

## Next steps

* [Try Azure CycleCloud Workspace for Slurm](qs-deploy-ccws.md)
