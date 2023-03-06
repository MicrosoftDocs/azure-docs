---
author: sdwheeler
description: Learn how to use the Bash command line in your browser with Azure Cloud Shell.
manager: mkluck
ms.author: sewhee
ms.contributor: jahelmic
ms.date: 03/06/2023
ms.service: cloud-shell
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.workload: infrastructure-services
tags: azure-resource-manager
title: Quickstart for Bash in Azure Cloud Shell
---
# Quickstart for Azure Cloud Shell

This document details how to use Bash and PowerShell in Azure Cloud Shell from the
[Azure portal][03].

## Start Cloud Shell

1. Launch **Cloud Shell** from the top navigation of the Azure portal.

   ![Screenshot showing how to start Azure Cloud Shell in the Azure portal.][06]

   The first time you start Cloud Shell you are prompted to create a storage account for the Azure
   file share.

   ![Screenshot showing the create storage prompt.][05]

1. Select a subscription to create a storage account and Azure file share.
1. Select **Create storage**.

### Select your shell environment

Cloud Shell allows you to select either Bash or PowerShell for your command-line experience.

![Screenshot showing the shell selector.][04]

### Registering your subscription with Azure Cloud Shell

Azure Cloud Shell needs access to manage resources. Access is provided through namespaces that must
be registered to your subscription. Use the following commands to register the Microsoft.CloudShell
RP namespace in your subscription:

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az account set --subscription <Subscription Name or Id>
az provider register --namespace Microsoft.CloudShell
```

# [PowerShell](#tab/powershell)

```azurepowershell-interactive
Select-AzSubscription -SubscriptionId <SubscriptionId>
Register-AzResourceProvider -ProviderNamespace Microsoft.CloudShell
```

> [!NOTE]
> You only need to register the namespace once per subscription.

### Set your subscription

1. List subscriptions you have access to.

   # [Azure CLI](#tab/azurecli)

   ```azurecli-interactive
   az account list
   ```

   # [PowerShell](#tab/powershell)

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

1. Set your preferred subscription:

   # [Azure CLI](#tab/azurecli)

   ```azurecli-interactive
   az account set --subscription 'my-subscription-name'
   ```

   # [PowerShell](#tab/powershell)

   ```azurepowershell-interactive
   Set-AzContext -Subscription <SubscriptionId>
   ```

> [!TIP]
> Your subscription is remembered for future sessions using `/home/<user>/.azure/azureProfile.json`.

### Create a resource group

Create a new resource group in CentralUS named `MyRG`.

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az group create --location centralus --name MyRG
```

# [PowerShell](#tab/powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name MyRG -Location centralus
```

### Get a list of Azure commands

# [Azure CLI](#tab/azurecli)

Run the following command to see a list of all Azure CLI commands.

```azurecli-interactive
az
```

Run the following command to get a list of Azure CLI command that apply to WebApps:

```azurecli-interactive
az webapp --help
```

# [PowerShell](#tab/powershell)

Run the following command to see a list of all Azure PowerShell cmdlets.

```azurepowershell-interactive
Get-Command -Module Az.*
```

Under `Azure` drive, the `Get-AzCommand` lists context-specific Azure commands.

Run the following commands to list the Azure PowerShell commands that apply to WebApps.

```azurepowershell-interactive
cd 'Azure:/My Subscription/WebApps'
Get-AzCommand
```

## Next steps

- [Learn about persisting files in Cloud Shell][07]
- [Learn about Azure CLI][02]
- [Learn about Azure Files storage][01]

<!-- link references -->
[01]: ../storage/files/storage-files-introduction.md
[02]: /cli/azure/
[03]: https://portal.azure.com/
[04]: media/quickstart/choose-shell.png
[05]: media/quickstart/create-storage.png
[06]: media/quickstart/shell-icon.png
[07]: persisting-shell-storage.md
