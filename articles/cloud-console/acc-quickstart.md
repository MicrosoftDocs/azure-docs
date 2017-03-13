---
title: Azure Cloud Console Quickstart | Microsoft Docs
description: Quickstart for the Azure Cloud Console.
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
ms.date: 03/09/2017
ms.author: juluk
---

# Quickstart
This document details how to use the Azure Cloud Console in the [Azure Portal](https://portal.azure.com/).

The requirements are:
- [An Azure account](https://azure.microsoft.com/pricing/free-trial/)
- Access to the [Azure Portal](https://portal.azure.com)

## Sign in
Sign into the Azure portal with your Azure account identity, click **+ New** in the upper left corner:

![screen1](../virtual-machines/media/virtual-machines-linux-quick-create-portal/create_new_resource.png)

## Start console
Click the **Start Azure Cloud Console** button in the top navigation bar of the page.

You are now authenticated and ready to begin use.

### Set your subscription
1. Check subscriptions you have access to: 

    ```azurecli
    az account list
    ```

2. Copy paste the name of your target subscription from the json output: <br>

    ```azurecli
    "name": "my-subscription-name"
    ```

3. Set your account to the chosen subscription: <br>

    ```azurecli
    az account set --subscription my-subscription-name
    ```

### Create a resource group
Create a new resouce group in WestUS named "MyRG":

```azurecli
az group create -l westus -n MyRG
```

### Create a Linux VM
Create an Ubuntu VM in your new resource group. The Azure CLI 2.0 will create ssh keys and setup the VM with them.

```azurecli
az vm create -n my_vm_name -g MyRG --image UbuntuLTS
```

### SSH into the Linux VM
1. Search for your VM name in the Portal search bar
2. Click **Connect** and run the command: `ssh username@ipaddress`

	![](./media/sshcmd-copy.png)

**Note** The public and private keys used to create your VM are placed in `/User/.ssh/id_rsa` and `User/.ssh/id_rsa.pub` of your Cloud Console.

Upon establishing the SSH connection, you should see the Ubuntu welcome prompt. You may now interact with your new VM via Cloud Console!

![](./media/ubuntu-welcome.png)

## Mount a file share to persist files

The Cloud Console allows attaching any Azure Files Storage you have to persist anything in your user $home directory.

The Cloud Console will save your $home directory as an image to the mounted file share. This image will default to 5GB and incur regular Azure Storage charges (~$0.40/month).

[Click here for details on Azure Files pricing](https://azure.microsoft.com/en-us/pricing/details/storage/files/).

1. Create a new Azure file share and mount it to the Cloud Console.

    ```azurecli
	createclouddrive --subscription uniqueSubscriptionGUID --resource-group MyRG --storage-account MyUniqueSA --file-share myfileshare -F
	````
	
2. Restart your console by typing `exit` then hitting the **Enter** key.

3. You will now receive a clouddrive subdirectory to upload/download to/from your local machine and changes in your user $home will persist as an image stored in the file share.

Full details are detailed in the [persisting storage documentation](acc-persisting-storage.md).

## Cleaning up 
Delete your resource group holding your VM and storage account: 

```azurecli
az group delete -n MyRG
```azurecli

Exit the console using the **x** in the top right corner of the console window. Console sessions will be active for 10 minutes after the last output at which point it will timeout. You may reactivate a console at anytime.

## Next Steps
- [Learn more about persisting storage on Cloud Console](acc-persisting-storage.md)
- [Learn more about Azure CLI 2.0] (/cli/azure)
- [Learn more about Azure File Storage] (../storage/storage-introduction.md#file-storage) 
