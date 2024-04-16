---
title: Quickstart – Create an Azure Managed Confidential Consortium Framework resource with the Azure CLI
description: Learn to create an Azure Managed Confidential Consortium Framework resource with the Azure CLI
author: msftsettiy
ms.author: settiy
ms.date: 09/09/2023
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Create an Azure Managed CCF resource using Azure CLI

Azure Managed CCF (Managed CCF) is a new and highly secure service for deploying confidential applications. For more information on Azure Managed CCF, see [About Azure Managed Confidential Consortium Framework](overview.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

Azure CLI is used to create and manage Azure resources using commands or scripts.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.51.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
- [OpenSSL](https://www.openssl.org/) on a computer running Windows or Linux is also required.

## Create a resource group

[!INCLUDE [Create a resource group](./includes/cli-resource-group-create.md)]

## Create a member

[!INCLUDE [Create a member](./includes/create-member.md)]

## Create a Managed CCF resource

Use the Azure CLI [az confidentialledger managedccfs create](/cli/azure/confidentialledger/managedccfs#az-confidentialledger-managedccfs-create) command to create a Managed CCF resource in the resource group from the previous step. You must provide some information:

- Managed CCF name: A string of 3 to 32 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-)

  > [!Important]
  > Each Managed CCF resource must have a unique name. Replace \<your-unique-managed-ccf-name\> with the name of your resource in the following examples.

- Resource group name: **myResourceGroup**.
- Location: southcentralus or westeurope. Default value is southcentralus.
- Members: A collection of initial members to be added to the resource. A minimum of one member is required.
- Node count: Then number of nodes in the resource. Default value is 3.

```azurecli
az confidentialledger managedccfs create --name "<your-unique-managed-ccf-name>" --resource-group "myResourceGroup" --location "southcentralus" --members "[{certificate:'c:/certs/member0_cert.pem',identifier:'it-admin',group:'IT'},{certificate:'c:/certs/member1_cert.pem',identifier:'finance-admin',group:'Finance'}]"
```

To view the previously created resource:

```azurecli
az confidentialledger managedccfs show --name "<your-unique-managed-ccf-name>" --resource-group "myResourceGroup"
```

To list the Managed CCF resources in the **myResourceGroup**:

```azurecli
az confidentialledger managedccfs list --resource-group "myResourceGroup"
```

To list the Managed CCF resources in a subscription:

```azurecli
az confidentialledger managedccfs list --subscription <subscription id or subscription name>
```

## Next steps

In this quickstart, you created a Managed CCF resource by using the Azure portal. To learn more about Azure confidential ledger and how to integrate it with your applications, continue on to these articles:

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Azure portal](quickstart-portal.md)
- [How to: Activate members](how-to-activate-members.md)
