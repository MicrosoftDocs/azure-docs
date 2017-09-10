---
title: Create a Linux virtual machine by using CLI in Azure Stack | Microsoft Docs
description: Create a Linux virtual machine with CLI in Azure Stack.
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/27/2017
ms.author: sngun
---

# Create a Linux virtual machine by using CLI in Azure Stack

Azure CLI is used to create and manage Azure Stack resources from the command line. This guide details using Azure CLI to create a Linux virtual machine in Azure Stack. You can run the steps described in this article either from the [Azure Stack Development Kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop), or from a Windows-based external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn)

> [!NOTE]
> Cloud Shell is not yet supported in Azure Stack.

## Prerequisites

1. The Azure Stack marketplace doesn't contain a Linux image by default. So, before you can create a Linux virtual machine, make sure that the Azure Stack operator download the “Ubuntu Server 16.04 LTS” image.    

2. Azure Stack requires the 2.0 version of Azure CLI to create and manage the resources. Use the steps described in [Install and configure CLI](azure-stack-connect-cli.md) topic to install the required version.  

3. Make sure that your Azure Stack cloud administrator has [set up a public endpoint that contains the virtual machine image aliases](azure-stack-connect-cli.md#set-up-the-virtual-machine-aliases-endpoint).

## Create a resource group

A resource group is a logical container into which Azure Stack resources are deployed and managed. Use the [az group create](/cli/azure/group#create) command to create a resource group. We have assigned values for all variables in this document, you can use them as is or assign a different value. 
The following example creates a resource group named myResourceGroup in the local location.

```cli
az group create --name myResourceGroup --location local
```

## Create virtual machine

Create a VM by using the [az vm create](/cli/azure/vm#create) command. The following example creates a VM named myVM. This example uses Demouser for an administrative user name and Demouser@123 as the password. Update these values to something appropriate to your environment. These values are needed when connecting to the virtual machine.

```cli
az vm create \
  --resource-group "myResourceGroup" \
  --name "myVM" \
  --image "UbuntuLTS" \
  --admin-username "Demouser" \
  --admin-password "Demouser@123" \
  --use-unmanaged-disk \
  --location local
```

## Open port 80 for web traffic

By default only SSH connections are allowed into Linux virtual machines deployed in Azure. If this VM is going to be a webserver, you need to open port 80 from the Internet. Use the [az vm open-port](/cli/azure/vm#open-port) command to open the desired port.

```cli
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```

## SSH into your VM

From a system with SSH installed, used the following command to connect to the virtual machine. If working on Windows, [Putty](http://www.putty.org/) can be used to create the connection. Make sure to replace with the correct public IP address of your virtual machine. In our example above our IP address was 192.168.102.36.

```bash
ssh <publicIpAddress>
```

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, VM, and all related resources.

```cli
az group delete --name myResourceGroup
```

## Next steps

[Create a virtual machine by using password stored in key vault](azure-stack-kv-deploy-vm-with-secret.md)

[To learn about Storage in Azure Stack](azure-stack-storage-overview.md)

