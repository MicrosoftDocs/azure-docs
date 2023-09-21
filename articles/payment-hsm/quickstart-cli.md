---
title: Quickstart - Create an Azure Payment HSM with the Azure CLI
description: Create, show, list, update, and delete Azure Payment HSMs by using the Azure CLI.
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.devlang: azurecli
ms.custom: devx-track-azurecli
ms.date: 03/25/2023
---

# Quickstart: Create an Azure Payment HSM with the Azure CLI

[!INCLUDE [Payment HSM intro](./includes/about-payment-hsm.md)]

This quickstart describes how to create, update, and delete an Azure Payment HSM by using the [az dedicated-hsm](/cli/azure/dedicated-hsm) Azure CLI command.

## Prerequisites

[!INCLUDE [Specialized service](../../includes/payment-hsm/specialized-service.md)]

- You must register the "Microsoft.HardwareSecurityModules" and "Microsoft.Network" resource providers, as well as the Azure Payment HSM features. Steps for doing so are at [Register the Azure Payment HSM resource provider and resource provider features](register-payment-hsm-resource-providers.md).

  > [!WARNING]
  > You must apply the "FastPathEnabled" feature flag to **every** subscription ID, and add the "fastpathenabled" tag to **every** virtual network. For more information, see [Fastpathenabled](fastpathenabled.md).

  To quickly ascertain if the resource providers and features are already registered, use the Azure CLI [az provider show](/cli/azure/provider#az-provider-show) command. (The output of this command is more readable if you display it in table-format.)

  ```azurecli-interactive
  az provider show --namespace "Microsoft.HardwareSecurityModules" -o table
  
  az provider show --namespace "Microsoft.Network" -o table
  
  az feature registration show -n "FastPathEnabled"  --provider-namespace "Microsoft.Network" -o table
  
  az feature registration show -n "AzureDedicatedHsm"  --provider-namespace "Microsoft.HardwareSecurityModules" -o table
  ```

  You can continue with this quick start if all four of these commands return "Registered".

- You must have an Azure subscription. You can [create a free account](https://azure.microsoft.com/free/) if you don't have one.
  
  If you have more than one Azure subscription, set the subscription to use for billing with the Azure CLI [az account set](/cli/azure/account#az-account-set) command.
  
  ```azurecli-interactive
  az account set --subscription <subscription-id>
  ```

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]  

## Create a resource group

[!INCLUDE [Create a resource group with the Azure CLI](../../includes/cli-rg-create.md)]

## Create a virtual network and subnet

Before creating a payment HSM, you must first create a virtual network and a subnet. To do so, use the Azure CLI [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) command:

```azurecli-interactive
az network vnet create -g "myResourceGroup" -n "myVNet" --address-prefixes "10.0.0.0/16" --tags "fastpathenabled=True" --subnet-name "myPHSMSubnet" --subnet-prefix "10.0.0.0/24"
```

Afterward, use the Azure CLI [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) command to update the subnet and give it a delegation of "Microsoft.HardwareSecurityModules/dedicatedHSMs":

```azurecli-interactive
az network vnet subnet update -g "myResourceGroup" --vnet-name "myVNet" -n "myPHSMSubnet" --delegations "Microsoft.HardwareSecurityModules/dedicatedHSMs"
```

To verify that the VNet and subnet were created correctly, use the Azure CLI [az network vnet show](/cli/azure/network/vnet) command:

```azurecli-interactive
az network vnet show -n "myVNet" -g "myResourceGroup"
```

Make note of the value returned as `id`, as it is used in the next step.  The `id` is in the format:

```json
"id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/myPHSMSubnet",
```

## Create a payment HSM

To create a payment HSM, use the [az dedicated-hsm create](/cli/azure/dedicated-hsm#az-dedicated-hsm-create) command. The following example creates a payment HSM named `myPaymentHSM` in the `eastus` region, `myResourceGroup` resource group, and specified subscription, virtual network, and subnet:

```azurecli-interactive
az dedicated-hsm create \
   --resource-group "myResourceGroup" \
   --name "myPaymentHSM" \
   --location "EastUS" \
   --subnet id="<subnet-id>" \
   --stamp-id "stamp1" \
   --sku "payShield10K_LMK1_CPS60" 
```

## Get a payment HSM

To see your payment HSM and its properties, use the Azure CLI [az dedicated-hsm show](/cli/azure/dedicated-hsm#az-dedicated-hsm-show) command.

```azurecli-interactive
az dedicated-hsm show --resource-group "myResourceGroup" --name "myPaymentHSM"
```

To list all of your payment HSMs, use the [az dedicated-hsm list](/cli/azure/dedicated-hsm#az-dedicated-hsm-list) command. (The output of this command is more readable if you display it in table-format.)

```azurecli-interactive
az dedicated-hsm list --resource-group "myResourceGroup" -o table
```

## Remove a payment HSM

To remove your payment HSM, use the [az dedicated-hsm delete](/cli/azure/dedicated-hsm#az-dedicated-hsm-delete) command. The following example deletes the `myPaymentHSM` payment HSM from the `myResourceGroup` resource group:

```azurecli-interactive
az dedicated-hsm delete --name "myPaymentHSM" -g "myResourceGroup"
```

## Delete the resource group

[!INCLUDE [Delete a resource group with the Azure CLI](../../includes/cli-rg-delete.md)]

## Next steps

In this quickstart, you created a payment HSM, viewed and updated its properties, and deleted it. To learn more about Payment HSM and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
