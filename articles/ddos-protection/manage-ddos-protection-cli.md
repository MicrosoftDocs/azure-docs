---
title: 'QuickStart: Create and configure an Azure DDoS Network Protection plan - Azure CLI'
description: Learn how to create a DDoS Protection Plan using Azure CLI
services: ddos-protection
author: AbdullahBell
ms.service: azure-ddos-protection
ms.topic: quickstart
ms.custom: devx-track-azurecli
ms.date: 03/17/2025
ms.author: abell
# Customer intent: As a network administrator, I want to create and configure a DDoS protection plan using Azure CLI, so that I can enhance the security of my virtual networks against DDoS attacks.
---
# QuickStart: Create and configure Azure DDoS Network Protection using Azure CLI

Get started with Azure DDoS Network Protection by using Azure CLI.

A DDoS protection plan defines a set of virtual networks that have DDoS Network Protection enabled, across subscriptions. You can configure one DDoS protection plan for your organization and link virtual networks from multiple subscriptions to the same plan.

In this QuickStart, you'll create a DDoS protection plan and link it to a virtual network.

:::image type="content" source="./media/manage-ddos-protection/ddos-network-protection-diagram-simple.png" alt-text="Diagram of DDoS Network Protection." lightbox="./media/manage-ddos-protection/ddos-network-protection-diagram-simple.png":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure CLI installed locally or Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.56 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Create a DDoS Protection plan

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

To create a resource group, use [az group create](/cli/azure/group#az-group-create). In this example, we'll name our resource group _MyResourceGroup_ and use the _East US_ location:

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
    --ddos-protection-plan MyDdosProtectionPlan \
    --ddos-protection true
```

[!INCLUDE [DDoS-Protection-virtual-network-relocate-note.md](../../includes/DDoS-Protection-virtual-network-relocate-note.md)]

### Enable DDoS protection for an existing virtual network

When [creating a DDoS protection plan](#create-a-ddos-protection-plan), you can associate one or more virtual networks to the plan. To add more than one virtual network, list the names or IDs, space-separated. In this example, we'll add _MyVnet_:

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
    --ddos-protection-plan MyDdosProtectionPlan \
    --ddos-protection true
```

### Disable DDoS protection for a virtual network

Update a given virtual network to disable DDoS protection:

```azurecli-interactive
az network vnet update \
    --resource-group MyResourceGroup \
    --name MyVnet \
    --ddos-protection-plan MyDdosProtectionPlan \
    --ddos-protection false
    
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

To delete the resource group, use [az group delete](/cli/azure/group#az-group-delete):

```azurecli-interactive
az group delete \
--name MyResourceGroup 
```

> [!NOTE]
> To delete a DDoS protection plan, first dissociate all virtual networks from it.

## Next steps

To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)
