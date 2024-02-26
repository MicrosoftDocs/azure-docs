---
title: 'Tutorial: Configure routing preference for an Azure Kubernetes Service - Azure CLI'
titlesuffix: Azure virtual network
description: Use this tutorial to learn how to configure routing preference for an Azure Kubernetes Service.
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: tutorial
ms.custom: template-tutorial, devx-track-azurecli
ms.devlang: azurecli
---

# Tutorial: Configure routing preference for an Azure Kubernetes Service using the Azure CLI

This article shows you how to configure routing preference via ISP network (**Internet** option) for a Kubernetes cluster using Azure CLI. Routing preference is set by creating a public IP address of routing preference type **Internet** and then using it while creating the AKS cluster.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a public IP address with the **Internet** routing preference.
> * Create Azure Kubernetes cluster with **Internet** routing preference public IP.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- This article requires version 2.0.49 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group in the **East US** Azure region:

```azurecli-interactive
  az group create \
    --name TutorAKSRP-rg \
    --location eastus

```

## Create public IP with Internet routing preference

Create a public IP address with routing preference of **Internet** type using command [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

The following command creates a new public IP with **Internet** routing preference in the **East US** Azure region.

```azurecli-interactive
  az network public-ip create \
    --resource-group TutorAKSRP-rg \
    --name myPublicIP-IR \
    --version IPv4 \
    --ip-tags 'RoutingPreference=Internet' \
    --sku Standard \
    --zone 1 2 3
```
> [!NOTE]
>  Currently, routing preference only supports IPV4 public IP addresses.

## Create Kubernetes cluster with public IP

Place the ID of the public IP created previously into a variable for later use. Use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to retrieve the public IP ID.

The following command retrieves the public IP ID and places it in a variable to use in the next command.

```azurecli-interactive
  export resourceid=$(az network public-ip show \
    --resource-group TutorAKSRP-rg \
    --name myPublicIP-IR \
    --query id \
    --output tsv)
```

Use [az aks create](/cli/azure/aks#az-aks-create) to create the Kubernetes cluster.

The following command creates the Kubernetes cluster and uses the variable for the public IP created in the previous step.

```azurecli-interactive
  az aks create \
    --resource-group TutorAKSRP-rg \
    --name MyAKSCluster \
    --load-balancer-outbound-ips $resourceid \
    --generate-ssh-key
```

>[!NOTE]
>It takes a few minutes to deploy the AKS cluster.

To validate, search for the public IP created in the earlier step in Azure portal. The public IP is associated with the load balancer. The load balancer is associated with the Kubernetes cluster as shown below:

  :::image type="content" source="./media/routing-preference-azure-kubernetes-service-cli/verify-aks-ip.png" alt-text="Screenshot of AKS cluster public IP address.":::

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, public IP, AKS cluster, and all related resources.

```azurecli-interactive
  az group delete \
    --name TutorAKSRP-rg
```

## Next steps

Advance to the next article to learn how to create a virtual machine with mixed routing preference:
> [!div class="nextstepaction"]
> [Configure both routing preference options for a virtual machine](routing-preference-mixed-network-adapter-portal.md)
