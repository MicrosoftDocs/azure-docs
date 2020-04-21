---
title: Configure routing preference for Azure resources - Azure PowerShell
titlesuffix: Azure Virtual Network
description: Learn how Azure routes traffic to the internet and how it can be customized to fit your requirements
services: virtual-network
documentationcenter: na
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/18/2020
ms.author: mnayak
ms.reviewer: 
---

# Configure routing preference for Azure resources using Azure PowerShell

Azure enables you to select network routing preferences at a resource level such as virtual machine, load balancer, virtual machine scale set, and storage resources (for example, blobs and files). You can accomplish this by selecting the routing preference through the public IP (internet facing) creation process. When you create a public IP, default routing preference option is set to **Microsoft Network**. 

In this article, you will learn how to:
> [!div class="checklist"]
> * Create a public IP with an **Internet** routing preference
> * Associate the Public IP to an Azure resource
> * Verify the traffic to/from the Azure resource is utilizing the Internet routing preference

If you prefer, you can complete this tutorial using the [Azure portal](configure-routing-preference-portal.md) or [CLI](configure-routing-preference-cli.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use PowerShell locally instead, this quickstart requires you to use Azure PowerShell module version 1.0.0 or later. To find the installed version, run `Get-Module -ListAvailable Az`. For installation and upgrade information, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

Finally, if you're running PowerShell locally, you'll also need to run `Connect-AzAccount`. That command creates a connection with Azure.

Use the Azure PowerShell module to register and manage Peering Service. You can register or manage Peering Service from the PowerShell command line or in scripts.

> [!IMPORTANT]
> Azure Routing Preference is currently in public preview.
> This preview version is provided without a service level agreement. We don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a Public IP with a Routing Preference of "Internet" type

To create a public IP Address with Routing Preference of "Internet" using Azure PowerShell, we will use the IPTagType parameter in the PowerShell Cmdlet [New-AzureRmPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress?view=azps-3.2.0), with the format as shown below.

The following commands create a new IPTag object of type "Routing Preference" named "Internet".

```azurepowershell-interactive
$iptagtype="RoutingPreference"
$tagName = "Internet"
$ipTag = New-AzPublicIpTag -IpTagType $iptagtype -Tag $tagName 
```
The next command takes the IPTag object and uses it as a parameter for the creation of a new Public IP address.

```azurepowershell-interactive
$publicIp = New-AzRmPublicIpAddress
-Name $publicIpName
-ResourceGroupName $rgName
-AllocationMethod Static
-DomainNameLabel $dnsPrefix
-Location $location
-IpTag $ipTag
-Sku Standard
```

## Create a Virtual Machine and assign Public IP address to NIC

Once the Public IP is created, use the PowerShell section on the tutorial page: [Associate a public IP address to a virtual machine](../virtual-network/associate-public-ip-address-vm.md#powershell) to associate the Public IP with Internet Routing Preference to your VM.  (Additionally, ensure that [network traffic can be routed to the VM](../virtual-network/associate-public-ip-address-vm.md#allow-network-traffic-to-the-vm) by opening required ports and checking network security groups.)

## Verify the traffic to/from the Azure Resource is utilizing the Internet Routing Preference

Microsoft utilizes different Autonomous System Numbers (ASN) to distinguish if network traffic is using the Internet Routing Preference.  An easy way to verify your new Public IP is using Internet Routing Preference is to look at the output of a BGP Looking Glass Route Server. A list of free Looking Glass resources offered by Internet Server Providers is on [BGP.AS](https://bgp4.as/looking-glasses).

An example output from [an ISP](http://lg.as59605.net/lg/), after going to their Looking Glass Page and selecting "BGP" as the Query type, and then a Server (Node) that is close to the Azure region in which the Public IP is located:

![Verification of Internet Routing Preference via Route Server](./media/configure-routing-preference-powershell/verify-routing-preference.png)

If AS 8069 is shown in the path to reach the created Public IP, the traffic is correctly using the Internet Routing Preference as a path to/from the Azure Resource.

## Clean up resources

If no longer needed, delete the Azure resources (and any resource groups) that were created in the previous steps.