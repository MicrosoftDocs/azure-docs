---
title: Plan your CycleCloud Workspace for Slurm Deployment
description: A checklist to help plan for your CycleCloud Workspace for Slurm deployment
author: xpillons
ms.date: 03/05/2025
ms.author: padmalathas
---

# Plan your CycleCloud Workspace for Slurm Deployment

You have two deployment options for Azure CycleCloud Workspace for Slurm:
- Greenfield environment: In this option, all the resources needed are provisioned for you.
- Brownfield deployment: In this option, you provide the existing resources.

When doing a deployment, the Azure user account used need to be granted the following roles:
- `Contributor` on the Subscription
- `User Access Administrator` on the Subscription

> Note: It is recommended to pre-deploy a [Hub VNet](/azure/architecture/networking/architecture/hub-spoke) to connect to your enterprise network if one is not already established. This hub can accommodate a [VPN Gateway](/azure/vpn-gateway/tutorial-create-gateway-portal) and an Azure Bastion. The CycleCloud Workspace for Slurm environment will be a spoke and peered during deployment.

## Greenfield Deployment

In a greenfield deployment, the following resources and role assignments are created:
- A Resource Group.
- The Virtual Network, its subnets `ccw-cyclecloud-subnet`, and `ccw-compute-subnet`.
- The Virtual Machine (VM) `ccw-cyclecloud-vm`, NIC, OS, Data Disks, and a System Managed Identity.
- A User-Assigned Managed Identity used to access the CycleCloud storage account.
- A uniquely named storage account for CycleCloud projects and a Private Endpoint in the `ccw-cyclecloud-subnet`.
- Network Security Group (NSG) named `nsg-ccw-common`.
- `Contributor`, `Storage Account Contributor`, and `Storage Blob Data Contributor` roles at the subscription level for the CycleCloud VM System Managed Identity.
- Optionally a Bastion, subnet `AzureBastionSubnet`, and public IP `bastion-pip`.
- Optionally a NAT gateway named `ccw-nat-gateway` and public IP `pip-ccw-nat-gateway`.
- Optionally an Azure NetApp Files account, pool, and volume with subnet `hpc-anf-subnet`.
- Optionally an Azure Managed Lustre Filesystem with subnet `ccw-lustre-subnet`.
- Optionally a VNET Peering.
- Optionally a Private Endpoint to an existing Azure Database for MySQL flexible server instance.

## Brownfield Deployment

In a brownfield deployment, you can provide existing resources for:
- The VNET and subnets in which the environment is deployed.
- Filesystem Storage for the user's home directories and/or other filers, as external NFS mount points or Azure Managed Lustre Filesystem (AMLS).
- An Azure Database for MySQL flexible server instance for Slurm Job Accounting.

If you're bringing your own VNET, follow these prerequisites:
- A /29 **cyclecloud** subnet for the CycleCloud VM.
- A **compute** subnet for the nodes, where the scheduler, login, and compute nodes are created.
- When using Azure NetApp Files, a dedicated **netapp** subnet with the `Microsoft.NetApp/volumes` delegation as documented here [Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-introduction).
- When using Azure Managed Lustre Filesystem, a dedicated **lustre** subnet with a CIDR based on the storage capacity to provision as documented here [Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview).
- If deploying a Bastion, a dedicated **BastionSubnet** as documented [here](/azure/bastion/configuration-settings#subnet).
- Your NSGs should allow communications between subnets as defined in the [bicep/network-new.bicep](https://github.com/Azure/cyclecloud-slurm-workspace/blob/main/bicep/network-new.bicep) file.

## Quotas

Before deploying, ensure that your subscription has the required quota for the VM types desired for the CycleCloud nodes.

## Resources

* [How to create and manage a VPN gateway using the Azure portal](/azure/vpn-gateway/tutorial-create-gateway-portal)
* [Configure P2S VPN Gateway for Microsoft Entra ID authentication – Microsoft-registered app](/azure/vpn-gateway/point-to-site-entra-gateway)
