---
title: Plan your CycleCloud Workspace for Slurm Deployment
description: A checklist to help plan for your CycleCloud Workspace for Slurm deployment
author: xpillons
ms.date: 08/22/2024
ms.author: xpillons
---

# Plan your CycleCloud Workspace for Slurm Deployment
You can deploy either a greenfield environment in which all resources needed for Azure CycleCloud Workspace for Slurm will be provisioned for you or a brownfield deployment for which you will provide existing resources.

When doing a deployment, the Azure user account used need to be granted the following roles:
- `Contributor` on the Subscription
- `User Access Administrator` on the Subscription

## Greenfield Deployment

In a greenfield deployment, the following resources and role assignments will be created:
- Resource Group
- The Virtual Network, its subnets `ccw-cyclecloud-subnet`, and `ccw-compute-subnet`
- The Virtual Machine `ccw-cyclecloud-vm`, NIC, OS, Data Disks, and a System Managed Identity
- A uniquely named storage account for CycleCloud projects
- Network Security Group named `nsg-ccw-common`
- `Contributor`, `Storage Account Contributor`, and `Storage Blob Data Contributor` roles at the subscription level for the CycleCloud VM System Managed Identity
- Optionally a Bastion, subnet `AzureBastionSubnet`, and public IP `bastion-pip`
- Optionally a NAT gateway named `ccw-nat-gateway` and public IP `pip-ccw-nat-gateway`
- Optionally an Azure NetApp Files account, pool, and volume with subnet `hpc-anf-subnet`
- Optionally an Azure Managed Lustre Filesystem with subnet `ccw-lustre-subnet`
- Optionally a VNET Peering
- Optionally a Private Endpoint to an existing Azure Database for MySQL flexible server instance

## Brownfield Deployment
You will be able to provide existing resources for:
- The VNET and subnets in which the environment will be deployed
- Filesystem Storage for the users's home directories and/or additional filers, as external NFS mount points or Azure Managed Lustre Filesystem
- an Azure Database for MySQL flexible server instance for Slurm Job Accounting

If you bring your own VNET you have to follow these pre-requisistes:
- a /29 **cyclecloud** subnet for the CycleCloud VM, with `Microsoft.Storage` Service Endpoint assigned,
- a **compute** subnet for the nodes, with `Microsoft.Storage` Service Endpoint assigned. This is where the scheduler, login, and compute nodes will be created
- when using Azure NetApp Files, a dedicated **netapp** subnet with the `Microsoft.NetApp/volumes` delegation as documented here [Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-introduction).
- when using Azure Managed Lustre Filesystem, a dedicated **lustre** subnet with a CIDR based on the storage capacity to provision as documented here [Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview)
- if deploying a Bastion, a dedicated **BastionSubnet** as documented [here](/azure/bastion/configuration-settings#subnet)
- Your NSGs should allow communications between subnets as defined in the [bicep/network-new.bicep](https://github.com/Azure/cyclecloud-slurm-workspace/blob/main/bicep/network-new.bicep) file.

## Quotas
Before deploying, ensure that your subscription has the required quota for the Virtual Machine types desired for CycleCloud nodes.