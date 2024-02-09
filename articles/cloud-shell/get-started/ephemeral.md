---
description: Learn how to start using Azure Cloud Shell without a storage account.
ms.contributor: jahelmic
ms.date: 01/22/2024
ms.topic: article
tags: azure-resource-manager
title: Get started with Azure Cloud Shell ephemeral sessions
---
# Get started with Azure Cloud Shell ephemeral sessions

Using Cloud Shell ephemeral sessions is the fastest way to start using Cloud Shell. Ephemeral
sessions don't require a storage account. When you close the Cloud Shell window, all files you saved
are deleted and don't persist across sessions.

## Start Cloud Shell

1. Sign into the [Azure portal][04].
1. Launch **Cloud Shell** from the top navigation of the Azure portal.

   ![Screenshot showing how to start Azure Cloud Shell in the Azure portal.][07]

1. The first time you start Cloud Shell you're prompted to which shell to use. Select **Bash** or
   **PowerShell**.

   ![Screenshot showing the prompt to select the shell.][05]

1. In the **Getting started** pane, select **No storage account required** for an ephemeral session.
   Using the dropdown menu, select the subscription you want to use for Cloud Shell, then select
   the **Apply** button.

   ![Screenshot showing the select subscription and optional storage prompt.][06]

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
- [Learn about persisting files in Cloud Shell][08]
- [Learn about Azure Files storage][01]

<!-- link references -->
[01]: /azure/storage/files/storage-files-introduction
[02]: /cli/azure/
[03]: /powershell/azure/
[04]: https://portal.azure.com/
[05]: media/ephemeral/choose-shell.png
[06]: media/ephemeral/getting-started.png
[07]: media/ephemeral/shell-icon.png
[08]: ../persisting-shell-storage.md
