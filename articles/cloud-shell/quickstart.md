---
title: Azure Cloud Shell (Preview) Quickstart | Microsoft Docs
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
ms.date: 05/10/2017
ms.author: juluk
---

# Quickstart
This document details how to use the Azure Cloud Shell in the [Azure portal](https://ms.portal.azure.com/).

## Start Cloud Shell
Select the **Cloud Shell** icon in the top navigation bar of the Azure portal.
![](media/shell-icon.png)

1. Select a subscription to create a storage account and Azure file share
2. Select "Create"

You are automatically authenticated for Azure CLI 2.0.

### Set your subscription
1. Check subscriptions you have access to: <br>
`az account list`
2. Enter the name or id of your target subscription from the json output: <br>
`"name": "my-subscription-name"`
3. Set your account to the chosen subscription: <br>
`az account set --subscription my-subscription-name`

**Tip:** Your set subscription is stored as default in `azureProfile.json` held in your $Home directory.

### Create a resource group
Create a new resouce group in WestUS named "MyRG": <br>
`az group create -l westus -n MyRG` <br>

### Create a Linux VM
Create an Ubuntu VM in your new resource group. The Azure CLI 2.0 will create ssh keys and setup the VM with them. <br>
`az vm create -n my_vm_name -g MyRG --image UbuntuLTS`

**Note** The public and private keys used to authenticate your VM are placed in `/User/.ssh/id_rsa` and `/User/.ssh/id_rsa.pub` of Cloud Shell. This is persisted in your attached Azure file share's 5-GB image.

### SSH into your Linux VM
1. Search for your VM name in the Azure portal search bar
2. Click "Connect" and run: `ssh username@ipaddress`

![](media/sshcmd-copy.png)

Upon establishing the SSH connection, you should see the Ubuntu welcome prompt.
![](media/ubuntu-welcome.png)

## Cleaning up 
Delete your resource group and any resources within it: <br>
1. Run `az group delete -n MyRG`

## Next Steps
[Learn more about persisting storage on Cloud Shell](persisting-shell-storage.md) <br>
[Learn more about Azure CLI 2.0] (https://docs.microsoft.com/en-us/cli/azure/) <br>
[Learn more about Azure File Storage] (https://docs.microsoft.com/en-us/azure/storage/storage-introduction#file-storage) <br>
