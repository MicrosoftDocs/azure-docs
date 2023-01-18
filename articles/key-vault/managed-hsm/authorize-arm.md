---
title: Secure access to a managed HSM - Azure Key Vault Managed HSM
description: Learn how to secure access to Managed HSM using Azure RBAC and Managed HSM local RBAC
services: key-vault
author: mbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 11/14/2022
ms.author: mbaldwin
# Customer intent: As a managed HSM administrator, I want to set access control and configure the Managed HSM, so that I can ensure it's secure and auditors can properly monitor all activities for this Managed HSM.
---

# Allow key management operations through Azure Resource Manager (ARM)

For many asynchronous operations in the Portal and Template deployments, Azure Resource Manager must be trusted to act on behalf of users. Azure Key Vault trusts Azure Resource Manager. However, for many higher assurance environments such trust in Portal and Azure Resource Manager may be considered a risk and Managed HSM pools do not allow this trust by default. However, for environments where such risk is an acceptable tradeoff for the ease of use of the Portal and template deployments, Managed HSM offers a way for an Administrator to opt-in to this trust.

For the Azure Portal or Azure Resource Manager to interact with Managed HSM in the same way as Azure Key Vault Standard and Premium, an authorized Managed HSM administrator must allow Azure Resource Manager to act on behalf of the user using the portal or ARM. To change this behavior and allow users to use Azure Portal or Azure Resource Manager to create new keys or list keys, make the following MHSM Pool setting update: 

```azurecli-interactive
az rest --method PATCH --url https://<MHSM URL> /settings/AllowKeyManagementOperationsThroughARM --body "{\"value\":\"true\"}" --headers Content-Type=application/json --resource https://managedhsm.azure.net 
```

To disable this trust and revert to the default behavior of Managed HSM: 

```azurecli-interactive
az rest --method PATCH --url https://<MHSM URL> /settings/AllowKeyManagementOperationsThroughARM --body "{\"value\":\"false\"}" --headers Content-Type=application/json --resource https://managedhsm.azure.net 
```
 
## Next steps

- [Control your data with Managed HSM](mhsm-control-data.md)
- [Azure Managed HSM access control](access-control.md)