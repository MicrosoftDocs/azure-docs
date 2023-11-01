---
description: Learn how to start using Azure Cloud Shell.
ms.contributor: jahelmic
ms.date: 10/30/2023
ms.topic: article
tags: azure-resource-manager
title: Get started with Azure Cloud Shell
---
# Get started with Azure Cloud Shell

This document details how to get started using Azure Cloud Shell.

## Prerequisites

Before you can use Azure Cloud Shell, you must register the **Microsoft.CloudShell** resource
provider. Access to resources is enabled through provider namespaces that must be registered in your
subscription. You only need to register the namespace once per subscription.

To see all resource providers, and the registration status for your subscription:

1. Sign in to the [Azure portal][04].
1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.
1. Select the subscription you want to view.
1. On the left menu, under **Settings**, select **Resource providers**.
1. In the search box, enter `cloudshell` to search for the resource provider.
1. Select the **Microsoft.CloudShell** resource provider register from the provider list.
1. Select **Register** to change the status from **unregistered** to **Registered**.

   ![Screenshot of selecting resource providers in the Azure portal.][07]

## Start Cloud Shell

1. Launch **Cloud Shell** from the top navigation of the Azure portal.

   ![Screenshot showing how to start Azure Cloud Shell in the Azure portal.][08]

   The first time you start Cloud Shell you're prompted to create an Azure Storage account for the
   Azure file share.

   ![Screenshot showing the create storage prompt.][06]

1. Select the **Subscription** used to create the storage account and file share.
1. Select **Create storage**.

   > [!NOTE]
   > By following these steps, Cloud Shell creates a standard storage account and allocates 5 GB of
   > storage for the file share. You can also create a storage account manually and specify the
   > storage account and file share to use. If you use a Premium storage account, Cloud Shell
   > allocates 100 GB of storage for the file share.

### Select your shell environment

Cloud Shell allows you to select either **Bash** or **PowerShell** for your command-line experience.

![Screenshot showing the shell selector.][05]

### Set your subscription

1. List subscriptions you have access to.

   <!-- markdownlint-disable MD023 MD024 MD051-->
   #### [Azure CLI](#tab/azurecli)

   ```azurecli-interactive
   az account list
   ```

   #### [Azure PowerShell](#tab/powershell)

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

1. Set your preferred subscription:

   #### [Azure CLI](#tab/azurecli)

   ```azurecli-interactive
   az account set --subscription 'my-subscription-name'
   ```

   #### [Azure PowerShell](#tab/powershell)

   ```azurepowershell-interactive
   Set-AzContext -Subscription <SubscriptionId>
   ```
   <!-- markdownlint-enable MD023 MD024 MD051-->
   ---

> [!TIP]
> Your subscription is remembered for future sessions using `/home/<user>/.azure/azureProfile.json`.

### Get a list of Azure commands

<!-- markdownlint-disable MD023 MD024 MD051-->
#### [Azure CLI](#tab/azurecli)

Run the following command to see a list of all Azure CLI commands.

```azurecli-interactive
az
```

Run the following command to get a list of Azure CLI commands that apply to WebApps:

```azurecli-interactive
az webapp --help
```

#### [Azure PowerShell](#tab/powershell)

Run the following command to see a list of all Azure PowerShell cmdlets.

```azurepowershell-interactive
Get-Command -Module Az.*
```

Under `Azure` drive, the `Get-AzCommand` lists context-specific Azure commands.

Run the following commands to get a list the Azure PowerShell commands that apply to WebApps.

```azurepowershell-interactive
cd 'Azure:/My Subscription/WebApps'
Get-AzCommand
```
<!-- markdownlint-enable MD023 MD024 MD051-->

---

## Next steps

- [Learn about Azure PowerShell][03]
- [Learn about Azure CLI][02]
- [Learn about persisting files in Cloud Shell][09]
- [Learn about Azure Files storage][01]

<!-- link references -->
[01]: ../storage/files/storage-files-introduction.md
[02]: /cli/azure/
[03]: /powershell/azure/
[04]: https://portal.azure.com/
[05]: media/get-started/choose-shell.png
[06]: media/get-started/create-storage.png
[07]: media/get-started/resource-provider.png
[08]: media/get-started/shell-icon.png
[09]: persisting-shell-storage.md
