---
title: Azure Resource Manager template samples for virtual network | Microsoft Docs
description: Learn about different Azure Resource Manager templates available for you to deploy Azure virtual networks with.
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: twooley
editor: ''
tags:

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 04/22/2019
ms.author: kumud

---
# Azure Resource Manager template samples for virtual network

The following table includes links to Azure Resource Manager template samples. You can deploy templates using the Azure [portal](../azure-resource-manager/resource-group-template-deploy-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json), Azure [CLI](../azure-resource-manager/resource-group-template-deploy-cli.md?toc=%2fazure%2fvirtual-network%2ftoc.json), or Azure [PowerShell](../azure-resource-manager/resource-group-template-deploy.md?toc=%2fazure%2fvirtual-network%2ftoc.json). To learn how to author your own templates, see [Create your first template](../azure-resource-manager/resource-manager-create-first-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Understand the structure and syntax of Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

For the JSON syntax and properties to use in templates, see [Microsoft.Network resource types](/azure/templates/microsoft.network/allversions).


| Task | Description |
|----|----|
|[Create a virtual network with two subnets](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vnet-two-subnets)| Creates a virtual network with two subnets.|
|[Route traffic through a network virtual appliance](https://github.com/Azure/azure-quickstart-templates/tree/master/201-userdefined-routes-appliance)| Creates a virtual network with three subnets. Deploys a virtual machine into each of the subnets. Creates a route table containing routes to direct traffic from one subnet to another through the virtual machine in the third subnet. Associates the route table to one of the subnets.|
|[Create a virtual network service endpoint for Azure Storage](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vnet-2subnets-service-endpoints-storage-integration)|Creates a new virtual network with two subnets, and a network interface in each subnet. Enables a service endpoint to Azure Storage for one of the subnets and secures a new storage account to that subnet.|
|[Connect two virtual networks](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vnet-to-vnet-peering)| Creates two virtual networks and a virtual network peering between them.|
|[Create a virtual machine with multiple IP addresses](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-multiple-ipconfig)| Creates a Windows or Linux VM with multiple IP addresses.|
|[Configure IPv4 + IPv6 dual stack virtual network](https://github.com/Azure/azure-quickstart-templates/tree/master/ipv6-in-vnet)|Deploys dual-stack (IPv4+IPv6) virtual network with two VMs and an Azure Basic Load Balancer with IPv4 and IPv6 public IP addresses. |
