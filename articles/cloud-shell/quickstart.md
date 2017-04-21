---
title: Azure Cloud Shell Quickstart | Microsoft Docs
description: Quickstart for the Azure Cloud Shell
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: 
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 04/12/2017
ms.author: juluk
---

# Quickstart (preview)
This document details how to use the Azure Cloud Shell in the [Azure Portal](https://ms.portal.azure.com/).

## Sign in
Sign into the Azure portal with your Azure account identity, click **+ New** in the upper left corner:

![](media/shell-icon.png)

## Start Cloud Shell
Click the **Start Azure Cloud Shell** button in the top navigation bar of the page.

You are now authenticated and ready to begin use.

### Set your subscription
1. Check subscriptions you have access to: <br>
`az account list`
2. Enter the name of your target subscription from the json output: <br>
`"name": "my-subscription-name"`
3. Set your account to the chosen subscription: <br>
`az account set --subscription my-subscription-name`

### Onboard a file share
Cloud Shell requires external storage to persist your $Home directory files.
1. Select your subscription to create a storage account and Azure file share within
2. Click "Attach"

You now have a 5-gb image of your $Home directory that automatically updates. This is subject to [regular Azure Files pricing](https://azure.microsoft.com/en-us/pricing/details/storage/files/).

Learn more about [persisting files in Cloud Shell](persisting-shell-storage.md).

### Create a resource group
Create a new resouce group in WestUS named "MyRG": <br>
`az group create -l westus -n MyRG` <br>

### Create a Linux VM
Create an Ubuntu VM in your new resource group. The Azure CLI 2.0 will create ssh keys and setup the VM with them. <br>
`az vm create -n my_vm_name -g MyRG --image UbuntuLTS`

### SSH into the Linux VM
1. Search for your VM name in the Portal search bar
2. Click "Connect" and run the command: `ssh username@ipaddress`

![](media/sshcmd-copy.png)

**Note** The public and private keys used to create your VM are placed in `/User/.ssh/id_rsa` and `/User/.ssh/id_rsa.pub` of your Cloud Shell.

Upon establishing the SSH connection, you should see the Ubuntu welcome prompt. You may now interact with your new VM via Cloud Shell!
![](media/ubuntu-welcome.png)

## Cleaning up 
Delete your resource group holding your VM and storage account: <br>
`az group delete -n MyRG`

## Next Steps
[Learn more about persisting storage on Cloud Shell](persisting-shell-storage.md) <br>
[Learn more about Azure CLI 2.0] (https://docs.microsoft.com/en-us/cli/azure/) <br>
[Learn more about Azure File Storage] (https://docs.microsoft.com/en-us/azure/storage/storage-introduction#file-storage) <br>
