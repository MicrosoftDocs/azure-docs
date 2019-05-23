---
title: Working with VMs and NSGs in Azure Bastion | Microsoft Docs
description: This article describes how to incorporate NSG access with Azure Bastion
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: cherylmc
---
# Working with NSG access and Azure Bastion

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

![Architecture](./media/bastion-nsg/nsg_architecture.png)

Bastion Host is deployed in Customer’s Virtual Network
•	User connects to the Azure Portal using any HTML5 browser
•	Navigates to the Azure virtual machine to RDP/SSH
•	Connect Integration - Single-click RDP/SSH session inside the browser
•	No Public IP required on the Azure VM

## Network security groups (NSG)

•	Azure Bastion Subnet – Azure Bastion is deployed in the specific AzureBastionSubnet.  
o	Ingress Traffic from public internet – The Azure Bastion will create a public IP that needs port 443 enabled on the public IP for ingress traffic.  Port 3389/22 are NOT required to be opened on the AzureBastionSubnet.
o	Egress Traffic to Target VMs – Azure Bastion will reach the target VMs over private IP.  The NSGs need to allow egress traffic to other target VM subnets.
•	Target VM Subnet – This is the subnet which contains the target virtual machine that you wish to RDP/SSH to.
o	Ingress Traffic from Azure Bastion – Azure Bastion will reach to the target VM over private IP.  RDP/SSH ports (ports 3389/22 respectively) need to be opened on the target VM side over private IP.

## Applying NSGs to AzureBastionSubnet

Please note that if you apply NSGs to AzureBastionSubnet, please also allow the following two service tags for Azure Control plane & Infrastructure:

1.	GatewayManager (Resource Manager only): This tag denotes the address prefixes of the Azure Gateway Manager service. If you specify GatewayManager for the value, traffic is allowed or denied to GatewayManager.

2.	AzureCloud (Resource Manager only): This tag denotes the IP address space for Azure including all datacenter public IP addresses. If you specify AzureCloud for the value, traffic is allowed or denied to Azure public IP addresses. If you only want to allow access to AzureCloud in a specific region, you can specify the region. For example, if you want to allow access only to Azure AzureCloud in the East US region, you could specify AzureCloud.EastUS as a service tag.

