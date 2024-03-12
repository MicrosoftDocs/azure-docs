---
title: Quickstart - Create a network security perimeter - Azure CLI
description: Learn how to create a network security perimeter for an Azure resource using Azure CLI. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: private-link
ms.topic: quickstart
ms.date: 03/07/2024
#CustomerIntent: As a cloud architect, I want to create a network security perimeter for an Azure resource using Azure CLI, so that I can control the network traffic to and from the resource.
---

# Quickstart: Create a network security perimeter - Azure CLI

Get started with network security perimeter by creating a network security perimeter for an Azure key vault using Azure CLI. A [network security perimeter](network-security-perimeter-overview.md) allows Azure PaaS resources to communicate within an explicit trusted boundary.

In this quickstart, you create a network security perimeter for an Azure key vault, one of many [Azure Platform as a Service (PaaS) accounts supported by network security perimeter](./network-security-perimeter-overview.md#supported-paas-services), using the Azure CLI. Next, You learn to create and update a PaaS resources association in a network security perimeter profile, as well as how to create and update network security perimeter access rules. To finish, you delete all resources created in this quickstart.

[!INCLUDE [network-security-perimeter-preview](../../includes/network-security-perimeter-preview.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- This article requires version 2.38.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
  
- After upgrading to the latest version, you can import the network security perimeter commands using `az extension add --name nsp`
- The [latest Azure CLI](/cli/azure/install-azure-cli), or you can use Azure Cloud Shell in the portal.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Sign in to the Azure portal

1. Sign in and select your subscription.
2. If you installed CLI locally, sign in. 

```azurecli-interactive
az login 
```

1. Select your active subscription. 

```azurecli-interactive
az account set --subscription "Azure Subscription"
```

## Create a resource group and key vault

Before you can create a network security perimeter, you have to create a resource group and a key vault resource.  
This example creates a resource group named `test-rg` in the WestCentralUS location and a key vault named `key-vault-<DateTimeValue>` in the resource group with the following commands:

```azurecli-interactive
az group create --name test-rg --location westcentralus

# Create a key vault using a datetime value to ensure a unique name

key_vault_id=$(az keyvault create --name key-vault-$(date +%s) --resource-group test-rg --location westcentralus --query 'id' --output tsv)

```
 
## Create a network security perimeter
In this step, create a network security perimeter with the `az network perimeter create` command.

> [!NOTE]
> Please do not put any personal identifiable or sensitive data in the network security perimeter rules or other network security perimeter configuration.

```azurecli-interactive
az network perimeter create -n network-security-perimeter -g test-rg -l westcentralus
```

## Create and update PaaS resources’ association with a new profile

In this step, you create a new profile and associate the PaaS resource, the Azure Key Vault with the profile using the `az network perimeter profile create` and `az network perimeter association create` commands.

1. Create a new profile for your network security perimeter with the following command:

    ```azurecli-interactive
    
    demo_profile_id=$(az network perimeter profile create --name demo-profile --resource-group test-rg --perimeter-name network-security-perimeter --location westcentralus --query 'id' --output tsv)
    
    
    ```
2. Associate the Azure Key Vault (PaaS resource) with the network security perimeter profile with the following command:

    ```azurecli-interactive
    
    az network perimeter association create -n MyAssociation --perimeter-name network-security-perimeter -g test-rg --access-mode Learning  --private-link-resource $key_vault_id  --profile $demo_profile_id
    
    ```
 
3. Update association by changing the access mode to `enforced` with the `az network perimeter association create` command as follows:

    ```azurecli-interactive
    az network perimeter association create -n MyAssociation --perimeter-name network-security-perimeter -g test-rg --access-mode Enforced  --private-link-resource $key_vault_id  --profile $demo_profile_id
    ```

## Create and update network security perimeter access rules

In this step, you create and update network security perimeter access rules with the `az network perimeter profile access-rule create` command.

1. Create an inbound access rule for the profile created with the following command:

    ```azurecli-interactive
    az network perimeter profile access-rule create -n MyAccessRule --profile-name demo-profile --perimeter-name network-security-perimeter -g test-rg --address-prefixes "[20.10.0.0/16]" 
    ```

1. Update your inbound access rule with an another IP address range with the following command:

    ```azurecli-interactive
    
    az network perimeter profile access-rule create -n MyAccessRule --profile-name demo-profile --perimeter-name network-security-perimeter -g test-rg --address-prefixes "['20.11.0.0/16', '20.10.0.0/16']"
    
    ```

## Delete a network security perimeter 

To delete a network security perimeter, use the `az network perimeter delete` command as follows:

```azurecli-interactive
az network perimeter delete -g test-rg -n network-security-perimeter
```

## Next steps

> [!div class="nextstepaction"]
> Learn to monitor with [diagnostic logs in network security perimeter](./network-security-perimeter-diagnostic-logs.md)