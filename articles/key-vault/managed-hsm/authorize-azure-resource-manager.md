---
title: Allow key management operations through Azure Resource Manager
description: Learn how to allow key management operations through ARM
services: key-vault
author: mbaldwin
tags: azure-resource-manager
ms.custom: devx-track-arm-template

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 05/25/2023
ms.author: mbaldwin
# Customer intent: As a managed HSM administrator, I want to authorize Azure Resource Manager to perform key management operations via Azure Managed HSM
---

# Allow key management operations through Azure Resource Manager

For many asynchronous operations in the Portal and Template deployments, Azure Resource Manager must be trusted to act on behalf of users. Azure Key Vault trusts Azure Resource Manager but, for many higher assurance environments, such trust in the Azure portal and Azure Resource Manager may be considered a risk.

Azure Managed HSM doesn't trust Azure Resource Manager by default. However, for environments where such risk is an acceptable tradeoff for the ease of use of the Azure portal and template deployments, Managed HSM offers a way for an administrator to opt in to this trust.

For the Azure portal or Azure Resource Manager to interact with Azure Managed HSM in the same way as Azure Key Vault Standard and Premium, an authorized Managed HSM administrator must allow Azure Resource Manager to act on behalf of the user. To change this behavior and allow users to use Azure portal or Azure Resource Manager to create new keys or list keys, make the following Azure Managed HSM setting update:

```azurecli-interactive
az keyvault setting update --hsm-name <managed-hsm name> --name AllowKeyManagementOperationsThroughARM --value true 
```

To disable this trust and revert to the default behavior of Managed HSM:

```azurecli-interactive
az keyvault setting update --hsm-name <managed-hsm name> --name AllowKeyManagementOperationsThroughARM --value false 
```

## Next steps

- [Control your data with Managed HSM](mhsm-control-data.md)
- [Azure Managed HSM access control](access-control.md)
