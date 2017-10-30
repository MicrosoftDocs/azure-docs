---
title: Create a Linux virtual machine by using Azure CLI in Azure Stack | Microsoft Docs
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
ms.topic: quickstart
ms.date: 09/25/2017
ms.author: sngun
ms.custom: mvc
---

# Create a Linux virtual machine by using Azure CLI in Azure Stack

*Applies to: Azure Stack integrated systems*

Azure CLI is used to create and manage Azure Stack resources from the command line. This Quickstart details using Azure CLI to create a Linux virtual machine in Azure Stack.  Once the VM is created, a web server is installed, and port 80 is opened to allow web traffic.

## Prerequisites 

* Make sure that your Azure Stack operator has added the “Ubuntu Server 16.04 LTS” image to the Azure Stack marketplace. 

* Azure Stack requires a specific version of Azure CLI to create and manage the resources. If you don't have Azure CLI configured for Azure Stack, sign in to the [development kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop), or a Windows-based external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn) and follow the steps to [install and configure Azure CLI](azure-stack-connect-cli.md).

* A public SSH key with the name id_rsa.pub should be created in the .ssh directory of your Windows user profile. For detailed information on creating SSH keys, see [Creating SSH keys on Windows](../../virtual-machines/linux/ssh-from-windows.md). 

## Create a resource group

A resource group is a logical container into which Azure Stack resources are deployed and managed. From your development kit or the Azure Stack integrated system, run the [az group create](/cli/azure/group#create) command to create a resource group. We have assigned values for all variables in this document, you can use them as is or assign a different value. 
The following example creates a resource group named myResourceGroup in the local location.

```cli
az group create --name myResourceGroup --location local
```

## Create a virtual machine

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

Once complete, the command will output parameters for your virtual machine.  Make note of the *PublicIPAddress*, since you use this to connect and manage your virtual machine.

## Open port 80 for web traffic

By default only SSH connections are allowed into Linux virtual machines deployed in Azure. If this VM is going to be a webserver, you need to open port 80 from the Internet. Use the [az vm open-port](/cli/azure/vm#open-port) command to open the desired port.

```cli
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```

## SSH into your VM

From a system with SSH installed, used the following command to connect to the virtual machine. If working on Windows, [Putty](http://www.putty.org/) can be used to create the connection. Make sure to replace with the correct public IP address of your virtual machine. In our example above, the IP address was 192.168.102.36.

```bash
ssh <publicIpAddress>
```

## Install NGINX

Use the following bash script to update package sources and install the latest NGINX package. 

```bash 
#!/bin/bash

# update package source
apt-get -y update

# install NGINX
apt-get -y install nginx
```

## View the NGINX welcome page

With NGINX installed and port 80 now open on your VM from the Internet - you can use a web browser of your choice to view the default NGINX welcome page. Be sure to use the *publicIpAddress* you documented above to visit the default page. 

![NGINX default site](./media/azure-stack-quick-create-vm-linux-cli/nginx.png) 

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, VM, and all related resources.

```cli
az group delete --name myResourceGroup
```

## Next steps

In this quick start, you’ve deployed a simple Linux virtual machine. To learn more about Azure Stack virtual machines, continue to [Considerations for Virtual Machines in Azure Stack](azure-stack-vm-considerations.md).

