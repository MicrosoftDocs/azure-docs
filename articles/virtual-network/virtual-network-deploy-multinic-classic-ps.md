<properties 
   pageTitle="Deploy multi NIC VMs using PowerShell in the classic deployment model | Microsoft Azure"
   description="Learn how to deploy multi NIC VMs using PowerShell in the classic deployment model"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="11/03/2015"
   ms.author="telmos" />

#Deploy multi NIC VMs (classic) using PowerShell

[AZURE.INCLUDE [virtual-network-deploy-multinic-classic-selectors-include.md](../../includes/virtual-network-deploy-multinic-classic-selectors-include.md)]

[AZURE.INCLUDE [virtual-network-deploy-multinic-intro-include.md](../../includes/virtual-network-deploy-multinic-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](virtual-network-deploy-multinic-arm-ps.md).

[AZURE.INCLUDE [virtual-network-deploy-multinic-scenario-include.md](../../includes/virtual-network-deploy-multinic-scenario-include.md)]

The sample Azure PowerShell commands below can be used to create the backend subnet and multi NIC VMs used as database servers.

[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Deploy the back end VMs

Since VMs with single NICs and multiple NICs cannot coexist in the same cloud service deployment, you need to create a different cloud service for the backend VMs. You also need the following resources in place to create the multiNIC VMs:

- **Backend subnet**. The database servers will be part of a separate subnet, to segregate traffic. The script below expects this subnet to exist in a vnet named *WTestVnet*.
- **Storage account for data disks**. For better performance, the data disks on the database servers will use SSD, which requires a premium storage account. Make sure the Azure location you deploy to support premium storage.
- **Availability set**. All database servers will be added to a single availability set, to ensure at least one of the VMs is up and running during maintenance. 

### Step 1 - Start you script

You can download the full PowerShell script used [here](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/documentation-samples/multinic/classic/multinic.ps1). Follow the steps below to change the script to work in your environment.

1. Change the values of the variables below based on your existing resource group deployed above in [Prerequisites](#Prerequisites).

		$location              = "West US"
		$vnetName              = "WTestVNet"
		$backendSubnetName     = "BackEnd"

