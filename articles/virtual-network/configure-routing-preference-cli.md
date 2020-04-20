---
title: Configure Routing Preference to Route Internet traffic - tutorial - Azure Portal
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

# Tutorial: Configure Routing Preference for Azure resources using the Azure portal

Azure allows customers in selecting network routing preference at resource level such as Virtual Machine, Load Balancer, VM Scaleset, Storage resources such as Blobs, Files etc. This is done by allowing customers to select routing Preference though public IP (internet facing) creation process. When you create a public IP, default routing preference option is set to "Microsoft Network". In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Create a public IP with a Routing Preference of "Internet" type
> * Associate the Public IP to an Azure Resource (e.g. NIC of VM, load balancer)
> * Verify the traffic to/from the Azure Resource is utilizing the Internet Routing Preference

If you prefer, you can complete this tutorial using the [Azure CLI](tutorial-routing-preference-cli.md) or [PowerShell](tutorial-routing-preference-powershell.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!IMPORTANT]
> Azure Routing Preference is currently in public preview.
> This preview version is provided without a service level agreement. We don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a Public IP with a Routing Preference of "Internet" type

To create a public IP Address in the Azure portal, please follow the steps on the associated tutorial page: [Create, change, or delete a public IP address](virtual-network-public-ip-address.md).  Specify the Routing Preference option is set to "Internet".

### Option 1 - Create a Virtual Machine and assign Public IP address to NIC

1. If you do not yet have a virtual machine associated with your account, follow Steps 1 - 5 on the associated tutorial page to create one: [Create a virtual machine](../virtual-machines/windows/quick-create-portal.md) Ensure the Public IP (under the Networking section) is set to 'none'.  
2. Once the virtual machine is created, follow the steps on the tutorial page: [Associate a public IP address to a virtual machine](associate-public-ip-address-vm.md) to associate the Public IP with Internet Routing Preference to your VM.  (Additionally, ensure that [network traffic can be routed to the VM](associate-public-ip-address-vm.md#allow-network-traffic-to-the-vm) by opening required ports and checking network security groups.)

### Option 2 - Create a Load Balancer and assign Public IP address to NIC

1. If you do not yet have a load balancer associated with your account, follow steps 1-5   on the associated tutorial page to create one: [Create a standard load balancer](../load-balancer/load-balancer-get-started-internet-az-portal.md)
2. Instead of following Step 6 to create a new Public IP address, choose the option to "Use Existing" and select the Public IP with Internet Routing Preference to associate it to your load balancer.

## Verify the traffic to/from the Azure Resource is utilizing the Internet Routing Preference

Microsoft utilizes different Autonomous System Numbers (ASN) to distinguish if network traffic is using the Internet Routing Preference.  An easy way to verify your new Public IP is using Internet Routing Preference is to look at the output of a BGP Looking Glass Route Server. A list of free Looking Glass resources offered by Internet Server Providers is on [BGP.AS](https://bgp4.as/looking-glasses).

An example output from [an ISP](http://lg.as59605.net/lg/), after going to their Looking Glass Page and selecting "BGP" as the Query type, and then a Server (Node) that is close to the Azure region in which the Public IP is located:

![Verification of Internet Routing Preference via Route Server](./media/configure-routing-preference-powershell/verify-routing-preference.png)

If AS 8069 is shown in the path to reach the created Public IP, the traffic is correctly using the Internet Routing Preference as a path to/from the Azure Resource.

## Clean up resources

If no longer needed, delete the Azure resources (and any resource groups) that were created in the previous steps.