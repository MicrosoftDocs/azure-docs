---
title: Quickstart - Create an Azure Key Vault with Azure PowerShell
description: Quickstart showing how to create an Azure Key Vault using Azure PowerShell
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: quickstart
ms.date: 01/27/2021
ms.author: mbaldwin

#Customer intent:As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure

---
# Quickstart: Create a key vault using PowerShell

Azure Key Vault is a cloud service that provides a secure store for [keys](../keys/index.yml), [secrets](../secrets/index.yml), and [certificates](../certificates/index.yml). For more information on Key Vault, see [About Azure Key Vault](overview.md); for more information on what can be stored in a key vault, see [About keys, secrets, and certificates](about-keys-secrets-certificates.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

In this quickstart, you create a key vault with [Azure PowerShell](/powershell/azure/). If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell module version 1.0.0 or later. Type `$PSVersionTable.PSVersion` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Login-AzAccount` to create a connection with Azure.

```azurepowershell-interactive
Login-AzAccount
```

## Create a resource group

[!INCLUDE [Create a resource group](../../../includes/key-vault-powershell-rg-creation.md)]

## Create a key vault

[!INCLUDE [Create a key vault](../../../includes/key-vault-powershell-kv-creation.md)]

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/key-vault-powershell-delete-resources.md)]

## Next steps

In this quickstart you created a Key Vault using Azure PowerShell. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](overview.md)
- See the reference for the [Azure PowerShell Key Vault cmdlets](/powershell/module/az.keyvault/)
- Review the [Azure Key Vault security overview](security-features.md)

