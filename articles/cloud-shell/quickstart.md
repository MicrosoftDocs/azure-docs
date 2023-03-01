---
author: sdwheeler
description: Learn how to use the Bash command line in your browser with Azure Cloud Shell.
manager: mkluck
ms.author: sewhee
ms.contributor: jahelmic
ms.date: 11/14/2022
ms.service: cloud-shell
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.workload: infrastructure-services
tags: azure-resource-manager
title: Quickstart for Bash in Azure Cloud Shell
---
# Quickstart for Bash in Azure Cloud Shell

This document details how to use Bash in Azure Cloud Shell in the [Azure portal][03].

> [!NOTE]
> A [PowerShell in Azure Cloud Shell][09] Quickstart is also available.

## Start Cloud Shell

1. Launch **Cloud Shell** from the top navigation of the Azure portal.

   ![Screenshot showing how to start Azure Cloud Shell in the Azure portal.][05]

1. Select a subscription to create a storage account and Microsoft Azure Files share.
1. Select "Create storage"

> [!TIP]
> You are automatically authenticated for Azure CLI in every session.

### Registering your subscription with Azure Cloud Shell

Azure Cloud Shell needs access to manage resources. Access is provided through namespaces that must
be registered to your subscription. Use the following commands to register the Microsoft.CloudShell
RP namespace in your subscription:

```azurecli-interactive  
az account set --subscription <Subscription Name or Id>
az provider register --namespace Microsoft.CloudShell
```

> [!NOTE]
> You only need to register the namespace once per subscription. You will not be able to manage
> resources using Azure Cloud Shell without registering the namespace.

### Set your subscription

1. List subscriptions you have access to.

   ```azurecli-interactive
   az account list
   ```

1. Set your preferred subscription:

   ```azurecli-interactive
   az account set --subscription 'my-subscription-name'
   ```

> [!TIP]
> Your subscription is remembered for future sessions using `/home/<user>/.azure/azureProfile.json`.

### Create a resource group

Create a new resource group in WestUS named "MyRG".

```azurecli-interactive
az group create --location westus --name MyRG
```

### Create a Linux VM

Create an Ubuntu VM in your new resource group. The Azure CLI will create SSH keys and set up the VM
with them.

```azurecli-interactive
az vm create -n myVM -g MyRG --image UbuntuLTS --generate-ssh-keys
```

> [!NOTE]
> Using `--generate-ssh-keys` instructs Azure CLI to create and set up public and private keys in
> your VM and `$Home` directory. By default keys are placed in Cloud Shell at
> `/home/<user>/.ssh/id_rsa` and `/home/<user>/.ssh/id_rsa.pub`. Your `.ssh` folder is persisted in
> your attached file share's 5-GB image used to persist `$Home`.

Your username on this VM will be your username used in Cloud Shell ($User@Azure:).

### SSH into your Linux VM

1. Search for your VM name in the Azure portal search bar.
1. Select **Connect** to get your VM name and public IP address.

   ![Screenshot showing how to connect to a Linux VM using SSH.][06]

1. SSH into your VM with the `ssh` cmd.

   ```bash
   ssh username@ipaddress
   ```

Upon establishing the SSH connection, you should see the Ubuntu welcome prompt.

![Screenshot showing the Ubuntu initialization and welcome prompt after you establish an SSH connection.][07]

## Cleaning up

1. Exit your ssh session.

   ```
   exit
   ```

1. Delete your resource group and any resources within it.

   ```azurecli-interactive
   az group delete -n MyRG
   ```

## Next steps

- [Learn about persisting files for Bash in Cloud Shell][08]
- [Learn about Azure CLI][02]
- [Learn about Azure Files storage][01]

<!-- link references -->
[01]: ../storage/files/storage-files-introduction.md
[02]: /cli/azure/
[03]: https://portal.azure.com/
[04]: media/quickstart/env-selector.png
[05]: media/quickstart/shell-icon.png
[06]: media/quickstart/sshcmd-copy.png
[07]: media/quickstart/ubuntu-welcome.png
[08]: persisting-shell-storage.md
[09]: quickstart-powershell.md
