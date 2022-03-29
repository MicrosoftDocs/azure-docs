---
title: Quickstart – Microsoft Azure confidential ledger with Azure PowerShell
description: Learn to use the Microsoft Azure confidential ledger through the Azure PowerShell
author: msmbaldwin
ms.author: mbaldwin
ms.date: 03/25/2022
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: devx-track-python, devx-track-azurepowershell, mode-ui
---

# Quickstart: Create a confidential ledger using Azure PowerShell

Azure confidential ledger is a cloud service that provides a high integrity store for sensitive data logs and records that require data to be kept intact. In this quickstart you will use [Azure PowerShell](/cli/azure/?view=azure-cli-latest) to create a confidential ledger, view and update its properties, and delete it.

For more information on Azure confidential ledger, and for examples of what can be stored in a confidential ledger, see [About Microsoft Azure confidential ledger](overview.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-powershell-requirements-no-header.md)]

## Create a resource group

[!INCLUDE [Create resource group](../../../includes/powershell-rg-create.md)]

## Get your principal ID

To create a confidential ledger, you will need your Azure Active Directory principal ID. To obtain your principal ID, use the Azure PowerShell [Get-AzADUser](/powershell/module/az.resources/get-azaduser) cmdlet, passing your email address to the "UserPrincipalName" parameter:

```azurepowershell-interactive
Get-AzADUser -UserPrincipalName "<your@email.address>"
```

Your principal ID will be in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

## Create a confidential ledger

Use the Azure CLI [az confidentialledger create](/cli/azure/confidentialledger?view=azure-cli-latest#az-confidentialledger-create) command to create a confidential ledger in your new resource group.

```azurecli
az confidentialledger create --name "myLedger" --resource-group "myResourceGroup" --location "EastUS" --ledger-type "Public" --aad-based-security-principals ledger-role-name="Administrator" principal-id="<your-principal-id>"
```

A successful operation will return the properties of the newly created ledger. Take note of the **ledgerUri**. In the example above, this URI is "https://myledger.confidential-ledger.azure.com".

You will need this URI to transact with the confidential ledger from the data plane.

## Clean up resources

[!INCLUDE [Clean up resources](../../../includes/powershell-rg-delete.md)]

## Next steps

In this quickstart, you created a confidential ledger by using the Azure portal. To learn more about Azure confidential ledger and how to integrate it with your applications, continue on to the articles below.

- [Overview of Microsoft Azure confidential ledger](overview.md)
