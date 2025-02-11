---
title: Quickstart - Create a network security perimeter - Azure CLI
description: Learn how to create a network security perimeter for an Azure resource using Azure CLI. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 11/06/2024
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource using Azure CLI, so that I can control the network traffic to and from the resource.
---

# Quickstart: Create a network security perimeter - Azure CLI

Get started with network security perimeter by creating a network security perimeter for an Azure key vault using Azure CLI. A [network security perimeter](network-security-perimeter-concepts.md) allows [Azure PaaS (PaaS)](./network-security-perimeter-concepts.md#onboarded-private-link-resources)resources to communicate within an explicit trusted boundary. Next, You create and update a PaaS resources association in a network security perimeter profile. Then you create and update network security perimeter access rules. When you're finished, you delete all resources created in this quickstart.

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
  
[!INCLUDE [network-security-perimeter-add-preview](../../includes/network-security-perimeter-add-preview.md)]

- The [latest Azure CLI](/cli/azure/install-azure-cli), or you can use Azure Cloud Shell in the portal.
  - This article **requires version 2.38.0 or later** of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
- After upgrading to the latest version of Azure CLI, import the network security perimeter commands using `az extension add --name nsp`.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]




## Connect to your Azure account and select your subscription

To get started, connect to [Azure Cloud Shell](https://shell.azure.com) or use your local CLI environment.

1. If using Azure Cloud Shell, sign in and select your subscription.
1. If you installed CLI locally, sign in with the following command: 

    ```azurecli-interactive
    # Sign in to your Azure account
    az login 
    ```

1. Once in your shell, select your active subscription locally with the following command: 

    ```azurecli-interactive
    # List all subscriptions
    az account set --subscription <Azure Subscription>

    # Re-register the Microsoft.Network resource provider
    az provider register --namespace Microsoft.Network    
    ```
   
## Create a resource group and key vault

Before you can create a network security perimeter, you have to create a resource group and a key vault resource with [az group create](/cli/azure/group) and [az keyvault create](/cli/azure/keyvault).  
This example creates a resource group named **resource-group** in the WestCentralUS location and a key vault named **key-vault-YYYYDDMM** in the resource group with the following commands:

```azurecli-interactive
az group create \
    --name resource-group \
    --location westcentralus

# Create a key vault using a datetime value to ensure a unique name

key_vault_name="key-vault-$(date +%s)"
az keyvault create \
    --name $key_vault_name \
    --resource-group resource-group \
    --location westcentralus \
    --query 'id' \
    --output tsv
```
 
## Create a network security perimeter

In this step, create a network security perimeter with the [az network perimeter create](/cli/azure/network/perimeter#az-network-perimeter-create) command.

> [!NOTE]
> Please don't put any personal identifiable or sensitive data in the network security perimeter rules or other network security perimeter configuration.

```azurecli-interactive
az network perimeter create\
    --name network-security-perimeter \
    --resource-group resource-group \
    -l westcentralus
```

## Create and update PaaS resources’ association with a new profile

In this step, you create a new profile and associate the PaaS resource, the Azure Key Vault with the profile using the [az network perimeter profile create](/cli/azure/network/perimeter#az-network-perimeter-profile) and [az network perimeter association create](/cli/azure/network/perimeter#az-network-perimeter-association) commands.

> [!NOTE]
> For the `--private-link-resource` and `--profile` parameter values, replace `<PaaSArmId>` and `<networkSecurityPerimeterProfileId>` with the values for the key vault and the profile ID, respectively.

1. Create a new profile for your network security perimeter with the following command:

    ```azurecli-interactive
    # Create a new profile
    az network perimeter profile create \
        --name network-perimeter-profile \
        --resource-group resource-group \
        --perimeter-name network-security-perimeter

    ```
2. Associate the Azure Key Vault (PaaS resource) with the network security perimeter profile with the following commands. 

    ```azurecli-interactive
    
    # Get key vault id
    az keyvault show \
        --name $key_vault_name \
        --resource-group resource-group \
        --query 'id'
        
    # Get the profile id
    az network perimeter profile show \
        --name network-perimeter-profile \
        --resource-group resource-group \
        --perimeter-name network-security-perimeter
    
    # Associate the Azure Key Vault with the network security perimeter profile
    # Replace <PaaSArmId> and <networkSecurityPerimeterProfileId> with the ID values for your key vault and profile
    az network perimeter association create \
        --name network-perimeter-association \
        --perimeter-name network-security-perimeter \
        --resource-group resource-group \
        --access-mode Learning  \
        --private-link-resource "{id:<PaaSArmId>}" \
        --profile "{id:<networkSecurityPerimeterProfileId>}"
        
    ```
 
1. Update association by changing the access mode to **enforced** with the [az network perimeter association create](/cli/azure/network/perimeter#az-network-perimeter-association-create) command as follows:

    ```azurecli-interactive
    az network perimeter association create \
        --name network-perimeter-association \
        --perimeter-name network-security-perimeter \
        --resource-group resource-group \
        --access-mode Enforced  \
        --private-link-resource "{id:<PaaSArmId>}" \
        --profile "{id:<networkSecurityPerimeterProfileId>}"
    ```
    
## Manage network security perimeter access rules

In this step, you create, update, and delete a network security perimeter access rules with public IP address prefixes using the [az network perimeter profile access-rule create](/cli/azure/network/perimeter#az-network-perimeter-profile-access-rule-create) command.

1. Create an inbound access rule with a public IP address prefix for the profile created with the following command:

    ```azurecli-interactive

    # Create an inbound access rule
    az network perimeter profile access-rule create \
        --name access-rule \
        --profile-name network-perimeter-profile \
        --perimeter-name network-security-perimeter \
        --resource-group resource-group \
        --address-prefixes "[192.0.2.0/24]"

    ```

1. Update your inbound access rule with another public IP address prefix with the following command:

    ```azurecli-interactive
    
    # Update the inbound access rule
    az network perimeter profile access-rule create\
        --name access-rule \
        --profile-name network-perimeter-profile \
        --perimeter-name network-security-perimeter \
        --resource-group resource-group \
        --address-prefixes "['198.51.100.0/24', '192.0.2.0/24']"

    ```

1. If you need to delete an access rule, use the [az network perimeter profile access-rule delete](/cli/azure/network/perimeter#az-network-perimeter-profile-access-rule-delete) command:

    ```azurepowershell-interactive
    # Delete the access rule
    az network perimeter profile access-rule delete \
        --Name network-perimeter-association \
        --profile-name network-perimeter-profile \
        --perimeter-name network-security-perimeter \
        --resource-group resource-group

[!INCLUDE [network-security-perimeter-note-managed-id](../../includes/network-security-perimeter-note-managed-id.md)]

## Delete all resources

To delete a network security perimeter and other resources in this quickstart, use the following [az network perimeter](/cli/azure/network/perimeter) commands:

```azurecli-interactive

    # Delete the network security perimeter association
    az network perimeter association delete \
        --name network-perimeter-association \
        --resource-group resource-group \
        --perimeter-name network-security-perimeter

    # Delete the network security perimeter
    az network perimeter delete \
        --resource-group resource-group \
        --name network-security-perimeter --yes
    
    # Delete the key vault
    az keyvault delete \
        --name $key_vault_name \
        --resource-group resource-group
    
    # Delete the resource group
    az group delete \
        --name resource-group \
        --yes \
        --no-wait

```

[!INCLUDE [network-security-perimeter-delete-resources](../../includes/network-security-perimeter-delete-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Diagnostic logging for Azure Network Security Perimeter](./network-security-perimeter-diagnostic-logs.md)
