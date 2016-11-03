---
title: Create a Linux VM | Microsoft Docs
description: Learn how to create a custom virtual machine with the classic deployment model running the Linux operating system.
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-service-management

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 08/23/2016
ms.author: iainfou

---
# How to Create a Custom Linux VM
[!INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

For the Resource Manager version, see [here](virtual-machines-linux-create-cli-complete.md).

This topic describes how to create a custom virtual machine (VM) with the Azure CLI using the classic deployment model. We use a Linux image from the available **IMAGES** on Azure. The Azure CLI commands give the following configuration choices, among others:

* Connecting the VM to a virtual network
* Adding the VM to an existing cloud service
* Adding the VM to an existing storage account
* Adding the VM to an availability set or location

> [!IMPORTANT]
> If you want your virtual machine to use a virtual network so you can connect to it directly by hostname or set up cross-premises connections, make sure you specify the virtual network when you create the virtual machine. A virtual machine can be configured to join a virtual network only when you create the virtual machine. For details on virtual networks, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).
> 
> 

## How to create a Linux virtual machine using the classic deployment model
[!INCLUDE [virtual-machines-create-LinuxVM](../../includes/virtual-machines-create-linuxvm.md)]

