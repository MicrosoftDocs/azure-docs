---
title: Set up Azure Attestation with Azure CLI
description: How to set up and configure an attestation provider using Azure CLI.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: quickstart
ms.date: 11/20/2020
ms.author: mbaldwin

---
# Quickstart: Set up Azure Attestation with Azure CLI

Get started with Azure Attestation by using Azure CLI to set up attestation.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Get started

1. Use the following command to sign into Azure:

   ```azurecli
   az login
   ```

1. If needed, switch to the subscription for Azure Attestation:

   ```azurecli
   az account set --subscription 00000000-0000-0000-0000-000000000000
   ```

1. Register the Microsoft.Attestation resource provider in the subscription with the [az provider register](/cli/azure/provider#az_provider_register) command:

   ```azurecli
   az provider register --name Microsoft.Attestation
   ```

   For more information about Azure resource providers, and how to configure and manage them, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

   > [!NOTE]
   > You only need to register a resource provider once for a subscription.

1. Create a resource group for the attestation provider. You can put other Azure resources in the same resource group, including a virtual machine with a client application instance. Run the [az group create](/cli/azure/group#az_group_create) command to create a resource group, or use an existing resource group:

   ```azurecli
   az group create --name attestationrg --location uksouth
   ```

## Create and manage an attestation provider

Follow this procedure to create and manage an attestation provider.

1. Run the [az attestation create](/cli/azure/ext/attestation/attestation#ext_attestation_az_attestation_create) command to create an attestation provider:

   ```azurecli
   az attestation create --resource-group attestationrg --name attestationProvider --location uksouth \
      --attestation-policy SgxDisableDebugMode --certs-input-path C:\test\policySignersCertificates.pem
   ```

   The **--certs-input-path** parameter specifies a set of trusted signing keys. If you specify a filename for this parameter, the attestation provider must be configured only with policies in signed JWT format. Otherwise, the policy can be configured in text or an unsigned JWT format. For information about JWT, see [Basic Concepts](basic-concepts.md). For certificate samples, see [Examples of an attestation policy signer certificate](policy-signer-examples.md).

1. Run the [az attestation show](/cli/azure/ext/attestation/attestation#ext_attestation_az_attestation_show) command to retrieve attestation provider properties such as status and AttestURI:

   ```azurecli
   az attestation show --resource-group attestationrg --name attestationProvider
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

You can delete an attestation provider by using the [az attestation delete](/cli/azure/ext/attestation/attestation#ext_attestation_az_attestation_delete) command:

```azurecli
az attestation delete --resource-group attestationrg --name attestationProvider
```

## Policy management

To manage policies, an Azure AD user requires the following permissions for `Actions`:

- `Microsoft.Attestation/attestationProviders/attestation/read`
- `Microsoft.Attestation/attestationProviders/attestation/write`
- `Microsoft.Attestation/attestationProviders/attestation/delete`

These permissions can be assigned to an Azure AD user through a role such as `Owner` (wildcard permissions), `Contributor` (wildcard permissions), or `Attestation Contributor` (specific permissions for Azure Attestation only).  

To read policies, an Azure AD user requires the following permission for `Actions`:

- `Microsoft.Attestation/attestationProviders/attestation/read`

This permission can be assigned to an Azure AD user through a role such as `Reader` (wildcard permissions) or `Attestation Reader` (specific permissions for Azure Attestation only).

Use the commands described here to provide policy management for an attestation provider, one TEE at a time.

The [az attestation policy show](/cli/azure/ext/attestation/attestation/policy#ext_attestation_az_attestation_policy_show) command returns the current policy for the specified TEE:

```azurecli
az attestation policy show --resource-group attestationrg --name attestationProvider --tee SgxEnclave
```

> [!NOTE]
> The command displays the policy in both text and JWT format.

The following are supported TEE types:

- `CyResComponent`
- `OpenEnclave`
- `SgxEnclave`
- `VSMEnclave`

Use the [az attestation policy set](/cli/azure/ext/attestation/attestation/policy#ext_attestation_az_attestation_policy_set) command to set a new policy for the specified TEE.

```azurecli
az attestation policy set --resource-group attestationrg --name attestationProvider --tee SgxEnclave \
   --new-attestation-policy newAttestationPolicyname
```

The attestation policy in JWT format must contain a claim named `AttestationPolicy`. A signed policy must be signed with a key that corresponds to any of the existing policy signer certificates.

For policy samples, see [Examples of an attestation policy](policy-examples.md).

The [az attestation policy reset](/cli/azure/ext/attestation/attestation/policy#ext_attestation_az_attestation_policy_reset) command sets a new policy for the specified TEE.

```azurecli
az attestation policy reset --resource-group attestationrg --name attestationProvider --tee SgxEnclave \
   --policy-jws "eyJhbGciOiJub25lIn0.."
```

## Policy signer certificates management

Use the following commands to manage the policy signer certificates for an attestation provider:

```azurecli
az attestation signer list --resource-group attestationrg --name attestationProvider

az attestation signer add --resource-group attestationrg --name attestationProvider \
   --signer "eyAiYWxnIjoiUlMyNTYiLCAie..."

az attestation signer remove --resource-group attestationrg --name attestationProvider \
   --signer "eyAiYWxnIjoiUlMyNTYiLCAie..."
```

A policy signer certificate is a signed JWT with a claim named `maa-policyCertificate`. The value of the claim is a JWK, which contains the trusted signing key to add. The JWT must be signed with a private key that corresponds to any of the existing policy signer certificates. For information about JWT and JWK, see [Basic Concepts](basic-concepts.md).

All semantic manipulation of the policy signer certificate must be done outside of Azure CLI. As far as Azure CLI is concerned, it's a simple string.

For certificate samples, see [Examples of an attestation policy signer certificate](policy-signer-examples.md).

## Next steps

- [How to author and sign an attestation policy](author-sign-policy.md)
- [Implement attestation with an SGX enclave using code samples](/samples/browse/?expanded=azure&terms=attestation)
