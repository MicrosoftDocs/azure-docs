---
title: View service principal of a managed identity - Azure CLI
description: Step-by-step instructions for viewing the service principal of a managed identity using Azure CLI.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''

ms.service: active-directory
ms.subservice: msi
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/11/2022
ms.author: barclayn
ms.collection: M365-identity-device-management 
ms.custom: devx-track-azurecli
---

# View the service principal of a managed identity using Azure CLI

Managed identities for Azure resources provide Azure services with an automatically managed identity in Microsoft Entra ID. You can use this identity to authenticate to any service that supports Microsoft Entra authentication without having credentials in your code. 

In this article, you learn how to view the service principal of a managed identity using Azure CLI.

If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, see [What are managed identities for Azure resources?](overview.md).

- Enable [system assigned identity on a virtual machine](./qs-configure-portal-windows-vm.md#system-assigned-managed-identity) or [application](/azure/app-service/overview-managed-identity#add-a-system-assigned-identity).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## View the service principal

This following command demonstrates how to view the service principal of a VM or application with managed identity enabled. Replace `<Azure resource name>` with your own values.

```azurecli-interactive
az ad sp list --display-name <Azure resource name>
```

## Next steps

For more information on managing Microsoft Entra service principals, see [Azure CLI ad sp](/cli/azure/ad/sp).
