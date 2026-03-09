---
title: Plan your CycleCloud Workspace for Slurm Deployment
description: A checklist to help plan for your CycleCloud Workspace for Slurm deployment
author: abatallas
ms.date: 01/13/2025
ms.author: padmalathas
---

# Plan your CycleCloud Workspace for Slurm deployment

You have two deployment options for Azure CycleCloud Workspace for Slurm:
- Greenfield environment: The deployment provisions all the needed resources.
- Brownfield deployment: You provide the existing resources.

When you deploy, grant the Azure user account the following roles:
- `Contributor` on the Subscription
- `User Access Administrator` on the Subscription
- Optional: permission to register a Microsoft Entra application

> [!NOTE]
> We recommend that you predeploy a [Hub virtual network](/azure/architecture/networking/architecture/hub-spoke) to connect to your enterprise network if you don't already have one. This hub can accommodate a [VPN Gateway](/azure/vpn-gateway/tutorial-create-gateway-portal) and an Azure Bastion. The CycleCloud Workspace for Slurm environment is a spoke that's peered during deployment.
> Contact Azure HPC Support if VPN or Azure Bastion don't meet your requirements or if your organization blocks them.

## Microsoft Entra ID authentication

Microsoft Entra ID is recommended for all Azure CycleCloud Workspace for Slurm deployments and is required if using Open OnDemand. Both greenfield and brownfield deployments require:
- A registered Microsoft Entra ID application for authentication with CycleCloud and, optionally, Open OnDemand.
- (If using Open OnDemand) A user-assigned managed identity used by the registered Microsoft Entra ID application for the federated credentials.

Visit [these instructions](../create-app-registration.md) to create your own Microsoft Entra ID application registration compatible with Azure CycleCloud Workspace for Slurm and Open OnDemand.

### Post-deployment utility

Once you create Microsoft Entra ID application registration, you can update its redirect URIs automatically with the below helper script. 

> [!IMPORTANT]
> Run the following command from a Linux shell with the Azure CLI installed and authenticated with the Azure account designated for deployment. Azure Cloud Shell may not be supported for this scenario.
> [!NOTE]
> Make sure the command-line tool `jq` for JSON processing is installed on your system.

```
LATEST_RELEASE=$(curl -sSL -H 'Accept: application/vnd.github+json' "https://api.github.com/repos/Azure/cyclecloud-slurm-workspace/releases/latest" | sed -n 's/.*"tag_name":[[:space:]]*"\([^"]*\)".*/\1/p')

bash <(curl -sL "https://raw.githubusercontent.com/Azure/cyclecloud-slurm-workspace/refs/tags/${LATEST_RELEASE}/util/entra_postdeploy.sh") -rg CCW_RESOURCE_GROUP_NAME
```

Ensure that you substitute `CCW_RESOURCE_GROUP_NAME` in the above with the name of the resource group with resources created by Azure CycleCloud Workspace for Slurm. 

## Greenfield deployment

A greenfield deployment creates the following resources and role assignments:
- A resource group.
- The virtual network and its `ccw-cyclecloud-subnet` and `ccw-compute-subnet` subnets.
- The `ccw-cyclecloud-vm` virtual machine (VM), NIC, OS, data disks, and a system assigned managed identity.
- A user-assigned managed identity to access the CycleCloud storage account.
- A uniquely named storage account for CycleCloud projects and a private endpoint in the `ccw-cyclecloud-subnet`.
- The `nsg-ccw-common` network security group (NSG).
- `Contributor`, `Storage Account Contributor`, and `Storage Blob Data Contributor` roles at the subscription level for the CycleCloud VM system assigned managed identity.
- Optionally, a bastion, the `AzureBastionSubnet` subnet, and the `bastion-pip` public IP.
- Optionally, a NAT gateway named `ccw-nat-gateway` and public IP `pip-ccw-nat-gateway`.
- Optionally, an Azure NetApp Files account, pool, and volume with subnet `hpc-anf-subnet`.
- Optionally, an Azure Managed Lustre Filesystem with subnet `ccw-lustre-subnet`.
- Optionally, a virtual network Peering.
- Optionally, a Private Endpoint to an existing Azure Database for MySQL flexible server instance.

## Brownfield deployment

In a brownfield deployment, you provide existing resources for:
- The virtual network and subnets in which you deploy the environment.
- Filesystem Storage for the user's home directories and other filers, such as external NFS mount points or Azure Managed Lustre Filesystem (AMLS).
- An Azure Database for MySQL flexible server instance for Slurm Job Accounting.

If you bring your own virtual network, follow these prerequisites:
- A /29 **cyclecloud** subnet for the CycleCloud VM.
- A **compute** subnet for the nodes, where you create the scheduler, authentication, and compute nodes.
- When using Azure NetApp Files, use a dedicated **netapp** subnet with the `Microsoft.NetApp/volumes` delegation as documented in [Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-introduction).
- When using Azure Managed Lustre Filesystem, use a dedicated **lustre** subnet with a CIDR based on the storage capacity to provision as documented in [Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview).
- If deploying a Bastion, use a dedicated **BastionSubnet** as documented [here](/azure/bastion/configuration-settings#subnet).
- Your NSGs should allow communications between subnets as defined in the [bicep/network-new.bicep](https://github.com/Azure/cyclecloud-slurm-workspace/blob/main/bicep/network-new.bicep) file.

## Open OnDemand

The Azure Bastion tunneling scenario doesn't work for Open OnDemand. To connect securely to the CycleCloud Workspace for Slurm network and access Open OnDemand, use a VPN Gateway with Point-to-Site (P2S) VPN connections or configure Azure ExpressRoute.

You need to register a Microsoft Entra application to support the OpenID Connect authentication mechanism. Make sure the user or subscription administrator has the proper roles to complete the registration.

## Quotas

Before deploying, make sure your subscription has the required quota for the VM types you want for the CycleCloud nodes.

## Resources

* [How to create and manage a VPN gateway using the Azure portal](/azure/vpn-gateway/tutorial-create-gateway-portal)
* [Configure P2S VPN Gateway for Microsoft Entra ID authentication – Microsoft-registered app](/azure/vpn-gateway/point-to-site-entra-gateway)
