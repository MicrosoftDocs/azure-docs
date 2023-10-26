---
title: include file
description: include file
services: cognitive-services
author: aahill
ms.service: azure-ai-services
ms.topic: include
ms.date: 08/25/2022
ms.author: aahi
ms.manager: nitinme
ms.custom: include
---

Before you can grant access to your key vault, you must authenticate with your Microsoft Entra user name and password. 

# [Azure CLI](#tab/azure-cli)

To authenticate with the [Azure CLI](/cli/azure), run the `az login` command. 

```azurecli-interactive
az login
```

On systems with a default web browser, the Azure CLI will launch the browser to authenticate. For systems without a default web browser, the `az login` command will use the device code authentication flow. You can also force the Azure CLI to use the device code flow rather than launching a browser by specifying the `--use-device-code` argument.

If you have multiple subscriptions, make sure to [select the Azure subscription](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription) that contains your key vault.

# [PowerShell](#tab/powershell)

You can also use [Azure PowerShell](/powershell/azure) to authenticate. Applications using the `DefaultAzureCredential` or the `AzurePowerShellCredential` can then use this account to authenticate calls in their application when running locally.

To authenticate with Azure PowerShell, run the `Connect-AzAccount` command. If you're running on a system with a default web browser and Azure PowerShell `v5.0.0` or later, it will launch the browser to authenticate the user.

For systems without a default web browser, the `Connect-AzAccount` command will use the device code authentication flow. You can also force Azure PowerShell to use the device code flow rather than launching a browser by specifying the `UseDeviceAuthentication` argument.

```powershell
Connect-AzAccount
```

If you have multiple subscriptions, make sure to [select the Azure subscription](/powershell/azure/manage-subscriptions-azureps) that contains your key vault.

---

## Grant access to your key vault

Create an access policy for your key vault that grants secret permissions to your user account.

# [Azure CLI](#tab/azure-cli)

To set the access policy, run the [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) command. Replace `Your-Key-Vault-Name` with the name of your key vault. Replace `user@domain.com` with your Microsoft Entra user name.

```azurecli-interactive
az keyvault set-policy --name Your-Key-Vault-Name --upn user@domain.com --secret-permissions delete get list set purge
```

# [PowerShell](#tab/powershell)

To set the access policy, run the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.accounts/set-azcontext) command. Replace `Your-Key-Vault-Name` with the name of your key vault. Replace `user@domain.com` with your Microsoft Entra user name.

```powershell
Set-AzKeyVaultAccessPolicy -VaultName 'Your-Key-Vault-Name' -UserPrincipalName 'user@domain.com' -PermissionsToSecrets delete,get,list,set,purge -PassThru
```

---
