---
title: Bash in Azure Cloud Shell (Preview) quickstart | Microsoft Docs
description: Quickstart for Bash in Cloud Shell
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: juluk
---

# Quickstart for Bash in Azure Cloud Shell

This document details how to use Bash in Azure Cloud Shell in the [Azure portal](https://ms.portal.azure.com/).

> [!NOTE]
> A [PowerShell in Azure Cloud Shell](quickstart-powershell.md) quickstart is also available.

## Start Cloud Shell
1. Launch **Cloud Shell** from the top navigation of the Azure portal <br>
![](media/quickstart/shell-icon.png)
2. Select a subscription to create a storage account and Azure file share
3. Select "Create storage"

> [!TIP]
> You are automatically authenticated for Azure CLI 2.0 in every sesssion.

### Select the Bash environment
1. Select the environment drop down from the the left hand side of shell window <br>
![](media/quickstart/env-selector.png)
2. Select Bash

### Set your subscription
1. List subscriptions you have access to: <br>
`az account list`
2. Set your preferred subscription: <br>
`az account set --subscription my-subscription-name`

> [!TIP]
> Your subscription will be remembered for future sessions using `/home/<user>/.azure/azureProfile.json`.

### Create a resource group
Create a new resource group in WestUS named "MyRG": <br>
`az group create -l westus -n MyRG` <br>

### Create a Linux VM
Create an Ubuntu VM in your new resource group. The Azure CLI 2.0 will create SSH keys and setup the VM with them. <br>
`az vm create -n my_vm_name -g MyRG --image UbuntuLTS --generate-ssh-keys`

> [!NOTE]
> The public and private keys used to authenticate your VM are placed in `/User/.ssh/id_rsa` and `/User/.ssh/id_rsa.pub` by Azure CLI 2.0 by default. Your .ssh folder is persisted in your attached Azure file share's 5-GB image.

Your username on this VM will be your username used in Cloud Shell ($User@Azure:).

### SSH into your Linux VM
1. Search for your VM name in the Azure portal search bar
2. Click "Connect" and run: `ssh username@ipaddress`

![](media/quickstart/sshcmd-copy.png)

Upon establishing the SSH connection, you should see the Ubuntu welcome prompt. <br>
![](media/quickstart/ubuntu-welcome.png)

## Cleaning up 
Delete your resource group and any resources within it: <br>
Run `az group delete -n MyRG`

## Next steps
[Learn about persisting files for Bash in Cloud Shell](persisting-shell-storage.md) <br>
[Learn about Azure CLI 2.0](https://docs.microsoft.com/cli/azure/) <br>
[Learn about Azure File storage](../storage/files/storage-files-introduction.md) <br>