---
title: Create a Classic Linux VM using the Azure classic CLI | Microsoft Docs
description: Learn how to create a Linux virtual machine with the Azure classic CLI using the Classic deployment model
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-service-management
ROBOTS: NOINDEX

ms.assetid: f8071a2e-ed91-4f77-87d9-519a37e5364f
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 02/09/2017
ms.author: cynthn

---
# How to Create a Classic Linux VM with the Azure classic CLI
> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. For the Resource Manager version, see [here](../create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

This topic describes how to create a Linux virtual machine (VM) with the Azure classic CLI using the Classic deployment model. We use a Linux image from the available **IMAGES** on Azure. The Azure classic CLI commands give the following configuration choices, among others:

* Connecting the VM to a virtual network
* Adding the VM to an existing cloud service
* Adding the VM to an existing storage account
* Adding the VM to an availability set or location

> [!IMPORTANT]
> If you want your VM to use a virtual network so you can connect to it directly by hostname or set up cross-premises connections, make sure you specify the virtual network when you create the VM. A VM can be configured to join a virtual network only when you create the VM. For details on virtual networks, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).
> 
> 

## How to create a Linux VM using the Classic deployment model
[!INCLUDE [virtual-machines-create-LinuxVM](../../../../includes/virtual-machines-create-linuxvm.md)]

