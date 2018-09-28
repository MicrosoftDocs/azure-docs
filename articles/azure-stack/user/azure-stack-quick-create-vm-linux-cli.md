---
title: Create a Linux virtual machine by using Azure CLI in Azure Stack | Microsoft Docs
description: Create a Linux virtual machine with CLI in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: mabrigg
ms.custom: mvc
---

# Quickstart: create a Linux server virtual machine by using Azure CLI in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can create a Ubuntu Server 16.04 LTS virtual machine by using the Azure CLI. Follow the steps in this article to create and use a virtual machine. This article also gives you the steps to:

* Connect to the virtual machine with a remote client.
* Install the NGINX web server and view the default home page.
* Clean up unused resources.

## Prerequisites

* **A Linux image in the Azure Stack marketplace**

   The Azure Stack marketplace doesn't contain a Linux image by default. Get the Azure Stack operator to provide the **Ubuntu Server 16.04 LTS** image you need. The operator can use the steps described in the [Download marketplace items from Azure to Azure Stack](../azure-stack-download-azure-marketplace-item.md) article.

* Azure Stack requires a specific version of the Azure CLI to create and manage the resources. If you don't have the Azure CLI configured for Azure Stack, sign in to the [development kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop), or a Windows-based external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn) and follow the steps to [install and configure Azure CLI](azure-stack-version-profiles-azurecli2.md).

* A public SSH key with the name id_rsa.pub saved in the .ssh directory of your Windows user profile. For detailed information about creating SSH keys, see [Creating SSH keys on Windows](../../virtual-machines/linux/ssh-from-windows.md).

## Create a resource group

A resource group is a logical container where you can deploy and manage Azure Stack resources. From your development kit or the Azure Stack integrated system, run the [az group create](/cli/azure/group#az-group-create) command to create a resource group.

>[!NOTE]
 Values are assigned for all the variables in the code examples. However, you can assign new values if you want to.

The following example creates a resource group named myResourceGroup in the local location.

```cli
az group create --name myResourceGroup --location local
```

## Create a virtual machine

Create a virtual machine by using the [az vm create](/cli/azure/vm#az-vm-create) command. The following example creates a VM named myVM. This example uses Demouser for an administrative user name and Demouser@123 as the user password. Change these values to something that is appropriate for your environment.

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

The public IP address is returned in the **PublicIpAddress** parameter. Write down this address because you need it to access the virtual machine.

## Open port 80 for web traffic

Because this virtual machine is going to run the IIS web server, you need to open port 80 to Internet traffic. Use the [az vm open-port](/cli/azure/vm#open-port) command to open the desired port.

```cli
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```

## Use SSH to connect to the virtual machine

From a client computer with SSH installed, connect to the virtual machine. If you're working on a Windows client, use [Putty](http://www.putty.org/) to create the connection. To connect to the virtual machine, use the following command:

```bash
ssh <publicIpAddress>
```

## Install the NGINX web server

To update package resources and install the latest NGINX package, run the following script:

```bash
#!/bin/bash

# update package source
apt-get -y update

# install NGINX
apt-get -y install nginx
```

## View the NGINX welcome page

With NGINX installed, and port 80 open on your virtual machine, you can access the web server using the virtual machine's public IP address. Open a web browser, and browse to ```http://<public IP address>```.

![NGINX web server Welcome page](./media/azure-stack-quick-create-vm-linux-cli/nginx.png)

## Clean up resources

Clean up the resources that you don't need any longer. You can use the [az group delete](/cli/azure/group#az-group-delete) command to remove these resources. To delete the resource group and all its resources, run the following command:

```cli
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you deployed a basic Linux server virtual machine with a web server. To learn more about Azure Stack virtual machines, continue to [Considerations for Virtual Machines in Azure Stack](azure-stack-vm-considerations.md).
