---
title: Cloud Shell in an Azure Virtual Network | Microsoft Docs
description: Deploy Cloud Shell into an Azure virtual network
services: Azure
documentationcenter: ''
author: maertendMSFT
manager: timlt
tags: azure-resource-manager

ms.assetid:
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 07/09/2020
ms.author: damaerte
---

# Deploy Cloud Shell into an Azure virtual network
[Azure Virtual Network](../virtual-network/virtual-networks-overview.md) provides secure, private networking for your Azure and on-premises resources. By deploying Cloud Shell into an Azure virtual network, You can communicate securely with other resources in the virtual network. A regular Cloud Shell session runs in a container in a Microsoft network separate from your resources. This means that you could not access your resources (such as VMs or storage accounts) that can only be accessed from a specific virtual network.  Using Cloud Shell in your virtual network, you can execute commands in a container running in your own Azure Virtual Network.


Before you can use Cloud Shell in your own Azure Virtual Network, you will need to create several resources to support this functionality. This article shows how to set up the required resources to deploy Azure Cloud Shell to a virtual network via an ARM template provided.

## Required network resources

### Virtual network
A virtual network defines the address space in which one or more subnets are created. Cloud Shell can then be deployed into the subnets in your virtual network.

The desired virtual network to be used for Cloud Shell needs to be identified, this will usually be an existing virtual network that contains resources you would like to manage or a network that peers with networks that contain your resources.

### Subnet
A subnet segments the virtual network into separate address spaces usable by the Azure resources placed in them.  There can be multiple subnets in a virtual network.

Within the selected virtual network, a dedicated subnet must be allocated for Cloud Shell, specifically for the Azure Container Instances (ACI) service.  When a user requests a Cloud Shell container in a virtual network, Cloud Shell uses ACI to create a container that is in this delegated subnet.  No other resources can be in this subnet.

> [!NOTE] 
> The subnet that is used for Cloud Shell must be left empty of other resources.

### Network profile
A network profile is a network configuration template for Azure resources that specifies certain network properties for the resource.


## Storage requirements
As required with standard Cloud Shell, a storage account is required while using Cloud Shell in a virtual network. Each administrator needs a file share to store their files.  The storage account needs to be accessible by the virtual network that is used by Cloud Shell. If the location of the file share is not accessible from the browser when Cloud Shell is running, the user will not be able to create the storage account and file share via Cloud Shell.  If this is the case, the user will need to create these resources ahead of time via the Azure portal or some other management tool. 

## Virtual network deployment limitations
* Due to the additional networking resources involved, starting Cloud Shell in a virtual network is typically slower than a standard Cloud Shell session.
* There may be less region support for Cloud Shell in a virtual network compared to standard Cloud Shell. This is currently limited to: WestUS and WestCentralUS.


## Deploy network resources
 

### Create a resource group and virtual network
If you already have a desired VNET that you would like to connect to, skip this section.

In the Azure portal, or using Azure CLI, Azure PowerShell, etc. create a Resource Group and a virtual network in the new resource group.  These must be located in either WestCentralUS or WestUS, and the resource group and virtual network need to be in the same region.



### ARM template
Utilize the [Azure Quickstart Template](https://aka.ms/cloudshell/docs/vnet/template) for Cloud Shell in a virtual network.  Take note of your resource names, primarily your file share name.


### Connecting resources with Cloud Shell
Open Cloud Shell in the Azure portal or on shell.azure.com.  Select "Show advanced settings" and select the "Show VNET isolation settings" box.
Fill in the fields in the pop-up.  Most fields will autofil to the available resources that can associated with Cloud Shell in a virtual network.  The File Share name will have to be filled in by the user.


::image type="content" source="media/private-VNET/VNET-settings.PNG" alt-text="Illustrates the Cloud Shell isolated VNET first experience settings.":::


## Next steps
[Learn about Azure Virtual Networks](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview)
