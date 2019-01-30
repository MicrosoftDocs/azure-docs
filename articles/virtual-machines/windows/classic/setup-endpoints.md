---
title: Set up endpoints on a classic Windows VM | Microsoft Docs
description: Learn to set up endpoints for a classic Windows VM in the Azure portal to allow communication with a Windows virtual machine in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-service-management

ms.assetid: 8afc21c2-d3fb-43a3-acce-aa06be448bb6
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 10/23/2018
ms.author: cynthn

---
# Set up endpoints on a Windows virtual machine by using the classic deployment model
Windows virtual machines (VMs) that you create in Azure by using the classic deployment model can automatically communicate over a private network channel with other VMs in the same cloud service or virtual network. However, computers on the internet or other virtual networks require endpoints to direct the inbound network traffic to a VM. 

You can also set up endpoints on [Linux virtual machines](../../linux/classic/setup-endpoints.md).

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../../../resource-manager-deployment-model.md). This article covers the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model.  
> [!INCLUDE [virtual-machines-common-classic-createportal](../../../../includes/virtual-machines-classic-portal.md)]

In the **Resource Manager** deployment model, endpoints are configured by using **Network Security Groups (NSGs)**. For more information, see [Allow external access to your VM by using the Azure portal](../nsg-quickstart-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

When you create a Windows VM in the Azure portal, common endpoints, such as endpoints for Remote Desktop and Windows PowerShell Remoting, are typically created for you automatically. You can configure additional endpoints later as needed.

[!INCLUDE [virtual-machines-common-classic-setup-endpoints](../../../../includes/virtual-machines-common-classic-setup-endpoints.md)]

## Next steps
* To use an Azure PowerShell cmdlet to set up a VM endpoint, see [Add-AzureEndpoint](https://msdn.microsoft.com/library/azure/dn495300.aspx).
* To use an Azure PowerShell cmdlet to manage an ACL on an endpoint, see [Managing access control lists (ACLs) for endpoints by using PowerShell](../../../virtual-network/virtual-networks-acl-powershell.md).
* If you created a virtual machine in the Resource Manager deployment model, you can use Azure PowerShell to [create network security groups](../../../virtual-network/tutorial-filter-network-traffic.md) to control traffic to the VM.
