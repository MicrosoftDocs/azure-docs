---
title: Bash in Azure Cloud Shell Quickstart | Microsoft Docs
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
ms.date: 03/12/2018
ms.author: juluk
---

# Quickstart for Bash in Azure Cloud Shell

This document details how to use Bash in Azure Cloud Shell in the [Azure portal](https://ms.portal.azure.com/).

> [!NOTE]
> A [PowerShell in Azure Cloud Shell](quickstart-powershell.md) Quickstart is also available.

## Start Cloud Shell
1. Launch **Cloud Shell** from the top navigation of the Azure portal. <br>
![](media/quickstart/shell-icon.png)

2. Select a subscription to create a storage account and Microsoft Azure Files share.
3. Select "Create storage"

> [!TIP]
> You are automatically authenticated for Azure CLI in every session.

### Select the Bash environment
Check that the environment drop-down from the left-hand side of shell window says `Bash`. <br>
![](media/quickstart/env-selector.png)

### Set your subscription
1. List subscriptions you have access to.
```azurecli-interactive
az account list
```

2. Set your preferred subscription: <br>
```azurecli-interactive
az account set --subscription my-subscription-name`
```

> [!TIP]
> Your subscription will be remembered for future sessions using `/home/<user>/.azure/azureProfile.json`.

### Create a resource group
Create a new resource group in WestUS named "MyRG".
```azurecli-interactive
az group create --location westus --name MyRG
```

### Create a Linux VM
Create an Ubuntu VM in your new resource group. The Azure CLI will create SSH keys and set up the VM with them. <br>

```azurecli-interactive
az vm create -n myVM -g MyRG --image UbuntuLTS --generate-ssh-keys
```

> [!NOTE]
> Using `--generate-ssh-keys` instructs Azure CLI to create and set up public and private keys in your VM and `$Home` directory. By default keys are placed in Cloud Shell at `/home/<user>/.ssh/id_rsa` and `/home/<user>/.ssh/id_rsa.pub`. Your `.ssh` folder is persisted in your attached file share's 5-GB image used to persist `$Home`.

Your username on this VM will be your username used in Cloud Shell ($User@Azure:).

### SSH into your Linux VM
1. Search for your VM name in the Azure portal search bar.
2. Click "Connect" to get your VM name and public IP address. <br>
![](media/quickstart/sshcmd-copy.png)

3. SSH into your VM with the `ssh` cmd.
```
ssh username@ipaddress
```

Upon establishing the SSH connection, you should see the Ubuntu welcome prompt. <br>
![](media/quickstart/ubuntu-welcome.png)

## Cleaning up 
1. Exit your ssh session.
```azurecli-interactive
exit
```

2. Delete your resource group and any resources within it.
```azurecli-interactive
az group delete -n MyRG
```

## Next steps
[Learn about persisting files for Bash in Cloud Shell](persisting-shell-storage.md) <br>
[Learn about Azure CLI](https://docs.microsoft.com/cli/azure/) <br>
[Learn about Azure Files storage](../storage/files/storage-files-introduction.md) <br>
