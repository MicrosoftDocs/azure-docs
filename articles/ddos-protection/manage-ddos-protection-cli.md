---
title: Create and configure an Azure DDoS Protection plan using Azure CLI
description: Learn how to create a DDoS Protection Plan using Azure CLI
services: ddos-protection
documentationcenter: na
author: aletheatoh
ms.service: ddos-protection
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/28/2020
ms.author: yitoh

---
# Quickstart: Create and configure Azure DDoS Protection Standard using Azure CLI

Get started with Azure DDoS Protection Standard by using Azure CLI. 

A DDoS protection plan defines a set of virtual networks that have DDoS protection standard enabled, across subscriptions. You can configure one DDoS protection plan for your organization and link virtual networks from multiple subscriptions to the same plan. 

In this quickstart, you'll create a DDoS protection plan and link it to a virtual network. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure CLI installed locally or Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Create a DDoS Protection plan

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

To create a resource group, use [az group create](/cli/azure/group#az_group_create). In this example, we'll name our resource group _MyResourceGroup_ and use the _East US_ location:

```azurecli-interactive
az group create \
    --name MyResourceGroup \
    --location eastus
```

Now create a DDoS protection plan named _MyDdosProtectionPlan_:

```azurecli-interactive
az network ddos-protection create \
    --resource-group MyResourceGroup \
    --name MyDdosProtectionPlan
```

## Enable DDoS protection for a virtual network

### Enable DDoS protection for a new virtual network

You can enable DDoS protection when creating a virtual network. In this example, we'll name our virtual network _MyVnet_: 

```azurecli-interactive
az network vnet create \
    --resource-group MyResourceGroup \
    --name MyVnet \
    --location eastus \
    --ddos-protection true
    --ddos-protection-plan MyDdosProtectionPlan
```

You cannot move a virtual network to another resource group or subscription when DDoS Standard is enabled for the virtual network. If you need to move a virtual network with DDoS Standard enabled, disable DDoS Standard first, move the virtual network, and then enable DDoS standard. After the move, the auto-tuned policy thresholds for all the protected public IP addresses in the virtual network are reset.

### Enable DDoS protection for an existing virtual network

When [creating a DDoS protection plan](#create-a-ddos-protection-plan), you can associate one or more virtual networks to the plan. To add more than one virtual network, simply list the names or IDs, space-separated. In this example, we'll add _MyVnet_:

```azurecli-interactive
az group create \
    --name MyResourceGroup \
    --location eastus

az network ddos-protection create \
    --resource-group MyResourceGroup \
    --name MyDdosProtectionPlan
    --vnets MyVnet
```

Alternatively, you can enable DDoS protection for a given virtual network:

```azurecli-interactive
az network vnet update \
    --resource-group MyResourceGroup \
    --name MyVnet \
    --ddos-protection true
    --ddos-protection-plan MyDdosProtectionPlan
```

## Validate and test

First, check the details of your DDoS protection plan:

```azurecli-interactive
az network ddos-protection show \
    --resource-group MyResourceGroup \
    --name MyDdosProtectionPlan
```

Verify that the command returns the correct details of your DDoS protection plan.

## Clean up resources

You can keep your resources for the next tutorial. If no longer needed, delete the _MyResourceGroup_ resource group. When you delete the resource group, you also delete the DDoS protection plan and all its related resources. 

To delete the resource group use [az group delete](/cli/azure/group#az_group_delete):

```azurecli-interactive
az group delete \
--name MyResourceGroup 
```

Update a given virtual network to disable DDoS protection:

```azurecli-interactive
az network vnet update \
    --resource-group MyResourceGroup \
    --name MyVnet \
    --ddos-protection false
    --ddos-protection-plan ""
```

If you want to delete a DDoS protection plan, you must first dissociate all virtual networks from it. 

## Next steps

To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)
