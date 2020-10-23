---
title: View service principal of a managed identity - Azure CLI - Azure AD
description: Step-by-step instructions for viewing the service principal of a managed identity using Azure CLI.
services: active-directory
documentationcenter: ''
author: barclayn
manager: daveba
editor: ''

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/30/2020
ms.author: barclayn
ms.collection: M365-identity-device-management 
ms.custom: devx-track-azurecli
---

# View the service principal of a managed identity using Azure CLI

Managed identities for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication without having credentials in your code. 

In this article, you learn how to view the service principal of a managed identity using Azure CLI.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/).
- Enable [system assigned identity on a virtual machine](./qs-configure-portal-windows-vm.md#system-assigned-managed-identity) or [application](../../app-service/overview-managed-identity.md#add-a-system-assigned-identity).
- To run the example scripts, you have two options:
    - Use the [Azure Cloud Shell](../../cloud-shell/overview.md), which you can open using the **Try It** button on the top right corner of code blocks.
    - Run scripts locally by installing the latest version of the [Azure CLI](/cli/azure/install-azure-cli), then sign in to Azure using [az login](/cli/azure/reference-index#az-login). Use an account associated with the Azure subscription in which you'd like to create resources.   

## View the service principal

This following command demonstrates how to view the service principal of a VM or application with managed identity enabled. Replace `<Azure resource name>` with your own values.

```azurecli-interactive
az ad sp list --display-name <Azure resource name>
```

## Next steps

For more information on managing Azure AD service principals using Azure CLI, see [az ad sp](/cli/azure/ad/sp).
