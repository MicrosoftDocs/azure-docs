---
title: Set up Azure Attestation with Azure CLI
description: How to set up and configure an attestation provider using Azure CLI.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: quickstart
ms.date: 11/14/2022
ms.author: mbaldwin
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---
# Quickstart: Set up Azure Attestation with Azure CLI

Get started with [Azure Attestation by using Azure CLI](/cli/azure/attestation).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Get started

1. Install this extension using the below CLI command

   ```azurecli
   az extension add --name attestation
   ```
   
1. Check the version

   ```azurecli
   az extension show --name attestation --query version
   ```

1. Use the following command to sign into Azure:

   ```azurecli
   az login
   ```

1. If needed, switch to the subscription for Azure Attestation:

   ```azurecli
   az account set --subscription 00000000-0000-0000-0000-000000000000
   ```

1. Register the Microsoft.Attestation resource provider in the subscription with the [az provider register](/cli/azure/provider#az-provider-register) command:

   ```azurecli
   az provider register --name Microsoft.Attestation
   ```

   For more information about Azure resource providers, and how to configure and manage them, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

   > [!NOTE]
   > You only need to register a resource provider once for a subscription.

1. Create a resource group for the attestation provider. You can put other Azure resources in the same resource group, including a virtual machine with a client application instance. Run the [az group create](/cli/azure/group#az-group-create) command to create a resource group, or use an existing resource group:

   ```azurecli
   az group create --name attestationrg --location uksouth
   ```

## Create and manage an attestation provider

Here are commands you can use to create and manage the attestation provider:

1. Run the [az attestation create](/cli/azure/attestation#az-attestation-create) command to create an attestation provider without policy signing requirement:

   ```azurecli
   az attestation create --name "myattestationprovider" --resource-group "MyResourceGroup" --location westus
   ```
   
1. Run the [az attestation show](/cli/azure/attestation#az-attestation-show) command to retrieve attestation provider properties such as status and AttestURI:

   ```azurecli
   az attestation show --name "myattestationprovider" --resource-group "MyResourceGroup"
   ```

   This command displays values like the following output:

   ```output
   Id:/subscriptions/MySubscriptionID/resourceGroups/MyResourceGroup/providers/Microsoft.Attestation/attestationProviders/MyAttestationProvider
   Location: MyLocation
   ResourceGroupName: MyResourceGroup
   Name: MyAttestationProvider
   Status: Ready
   TrustModel: AAD
   AttestUri: https://MyAttestationProvider.us.attest.azure.net
   Tags:
   TagsTable:
   ```

You can delete an attestation provider by using the [az attestation delete](/cli/azure/attestation#az-attestation-delete) command:

```azurecli
az attestation delete --name "myattestationprovider" --resource-group "sample-resource-group"
```

## Policy management

Use the commands described here to provide policy management for an attestation provider, one attestation type at a time.

The [az attestation policy show](/cli/azure/attestation/policy#az-attestation-policy-show) command returns the current policy for the specified TEE:

```azurecli
az attestation policy show --name "myattestationprovider" --resource-group "MyResourceGroup" --attestation-type SGX-IntelSDK
```

> [!NOTE]
> The command displays the policy in both text and JWT format.

The following are supported TEE types:

- `SGX-IntelSDK`
- `SGX-OpenEnclaveSDK`
- `TPM`

Use the [az attestation policy set](/cli/azure/attestation/policy#az-attestation-policy-set) command to set a new policy for the specified attestation type.

To set policy in text format for a given kind of attestation type using file path:

```azurecli
az attestation policy set --name testatt1 --resource-group testrg --attestation-type SGX-IntelSDK --new-attestation-policy-file "{file_path}"
```

To set policy in JWT format for a given kind of attestation type using file path:

```azurecli
az attestation policy set --name "myattestationprovider" --resource-group "MyResourceGroup" \
--attestation-type SGX-IntelSDK -f "{file_path}" --policy-format JWT
```

## Next steps

- [How to author and sign an attestation policy](author-sign-policy.md)
- [Implement attestation with an SGX enclave using code samples](/samples/browse/?expanded=azure&terms=attestation)
