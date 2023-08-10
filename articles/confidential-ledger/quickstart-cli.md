---
title: Quickstart – Microsoft Azure confidential ledger with the Azure CLI
description: Learn to use the Microsoft Azure confidential ledger through the Azure CLI
author: msmbaldwin
ms.author: mbaldwin
ms.date: 03/22/2022
ms.service: confidential-ledger
ms.custom: devx-track-azurecli
ms.topic: quickstart
---

# Quickstart: Create a confidential ledger using the Azure CLI

Azure confidential ledger is a cloud service that provides a high integrity store for sensitive data logs and records that must be kept intact. In this quickstart you will use the [Azure CLI](/cli/azure/) to create a confidential ledger, view and update its properties, and delete it.

For more information on Azure confidential ledger, and for examples of what can be stored in a confidential ledger, see [About Microsoft Azure confidential ledger](overview.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a resource group

[!INCLUDE [Create resource group](../../includes/cli-rg-create.md)]

## Get your principal ID

To create a confidential ledger, you'll need your Azure Active Directory principal ID (also called your object ID).  To obtain your principal ID, use the Azure CLI [az ad signed-in-user](/cli/azure/ad/signed-in-user) command, and filter the results by `objectId`:

```azurecli
az ad signed-in-user show --query objectId
```

Your result will be in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

## Create a confidential ledger

Use the Azure CLI [az confidentialledger create](/cli/azure/confidentialledger#az-confidentialledger-create) command to create a confidential ledger in your new resource group.

```azurecli
az confidentialledger create --name "myLedger" --resource-group "myResourceGroup" --location "EastUS" --ledger-type "Public" --aad-based-security-principals ledger-role-name="Administrator" principal-id="<your-principal-id>"
```

A successful operation will return the properties of the newly created ledger. Take note of the **ledgerUri**. In the example above, this URI is "https://myledger.confidential-ledger.azure.com".

You'll need this URI to transact with the confidential ledger from the data plane.

## View and update your confidential ledger properties

You can view the properties associated with your newly created confidential ledger using the Azure CLI [az confidentialledger show](/cli/azure/confidentialledger#az-confidentialledger-show) command.

```azurecli
az confidentialledger show --name "myLedger" --resource-group "myResourceGroup"
```

The returned JSON object displays the ledger's properties, including your role:

```json
"ledgerRoleName": "Administrator",
```

To update the properties of a confidential ledger, use do so, use the Azure CLI [az confidentialledger update](/cli/azure/confidentialledger#az-confidentialledger-update) command. For instance, to update your ledger to change your role to "Reader", run:

```azurecli
az confidentialledger update --name "myLedger" --resource-group "myResourceGroup" --ledger-type "Public" --aad-based-security-principals ledger-role-name="Reader" principal-id="<your-principal-id>" 
```

If you again run [az confidentialledger show](/cli/azure/confidentialledger#az-confidentialledger-show), you'll see that the role has been updated.

```json
"ledgerRoleName": "Reader",
```

## Clean up resources

[!INCLUDE [Clean up resources](../../includes/cli-rg-delete.md)]

## Next steps

In this quickstart, you created a confidential ledger by using the Azure CLI. To learn more about Azure confidential ledger and how to integrate it with your applications, continue on to the articles below.

- [Overview of Microsoft Azure confidential ledger](overview.md)
