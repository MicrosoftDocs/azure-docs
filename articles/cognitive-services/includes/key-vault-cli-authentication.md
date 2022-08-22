---
title: include file
description: include file
services: cognitive-services
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 03/11/2020
ms.author: aahi
ms.manager: nitinme
ms.custom: include
---

To successfully run your application, you must authenticate it by logging in to your Azure Active Directory with the user name and password for your Azure subscription.

### Azure CLI

To authenticate with the Azure CLI, run the `az login` command. For users running on a system with a default web browser, the Azure CLI will launch the browser to authenticate.

For systems without a default web browser, the `az login` command will use the device code authentication flow. You can also force the Azure CLI to use the device code flow rather than launching a browser by specifying the `--use-device-code` argument.

### Azure PowerShell

You can also use [Azure PowerShell](/powershell/azure) to authenticate. Applications using the `DefaultAzureCredential` or the `AzurePowerShellCredential` can then use this account to authenticate calls in their application when running locally.

To authenticate with Azure PowerShell, run the `Connect-AzAccount` command. If you're running on a system with a default web browser and Azure PowerShell `v5.0.0` or later, it will launch the browser to authenticate the user.

For systems without a default web browser, the `Connect-AzAccount` command will use the device code authentication flow. You can also force Azure PowerShell to use the device code flow rather than launching a browser by specifying the `UseDeviceAuthentication` argument.


## Grant access to your key vault

Create an access policy for your key vault that grants secret permissions to your user account with the [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) command.

```azurecli
az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --secret-permissions delete get list set purge
```