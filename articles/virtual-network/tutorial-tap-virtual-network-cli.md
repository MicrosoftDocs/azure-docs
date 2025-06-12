---
title: Create, change, or delete a virtual network TAP - Azure CLI
description: Learn how to create, change, or delete a virtual network TAP using the Azure CLI.
services: virtual-network
author: asudbring
manager: ganesr
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 04/21/2025
ms.author: allensu
ms.custom: devx-track-azurecli
---

# Work with a virtual network TAP using the Azure CLI

Azure virtual network TAP (Terminal Access Point) allows you to continuously stream your virtual machine network traffic to a network packet collector or analytics tool. The collector or analytics tool is provided by a [network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/) partner. For a list of partner solutions that are validated to work with virtual network TAP, see [partner solutions](virtual-network-tap-overview.md#virtual-network-tap-partner-solutions).

> [!IMPORTANT]
> Virtual network TAP is now in Public Preview. For more information, see the [Overview](virtual-network-tap-overview.md) article.

## Create a virtual network TAP resource

Read [prerequisites](virtual-network-tap-overview.md#prerequisites) before you create a virtual network TAP resource. You can run the commands that follow in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the Azure CLI from your computer. The Azure Cloud Shell is a free interactive shell that doesn't require installing the Azure CLI on your computer. You must sign in to Azure with an account that has the appropriate [permissions](virtual-network-tap-overview.md#permissions). This article requires the Azure CLI version 2.0.46 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). Virtual network TAP is currently available as an extension. To install the extension, you need to run `az extension add -n virtual-network-tap`. If you're running the Azure CLI locally, you also need to run `az login` to create a connection with Azure.

1. Retrieve the ID of your subscription into a variable that is used in a later step:

   ```azurecli-interactive
   subscriptionId=$(az account show \
   --query id \
   --out tsv)
   ```

2. Set the subscription ID that you'll use to create a virtual network TAP resource.

   ```azurecli-interactive
   az account set --subscription $subscriptionId
   ```

3. Re-register the subscription ID that you use to create a virtual network TAP resource. If you get a registration error when you create a TAP resource, run the following command:

   ```azurecli-interactive
   az provider register --namespace Microsoft.Network --subscription $subscriptionId
   ```

4. If the destination for the virtual network TAP is the network interface on the network virtual appliance for collector or analytics tool:

   - Retrieve the IP configuration of the network virtual appliance's network interface into a variable that is used in a later step. The ID is the end point that aggregates the TAP traffic. The following example retrieves the ID of the *ipconfig1* IP configuration for a network interface named *myNetworkInterface*, in a resource group named *myResourceGroup*:

      ```azurecli-interactive
       IpConfigId=$(az network nic ip-config show \
       --name ipconfig1 \
       --nic-name myNetworkInterface \
       --resource-group myResourceGroup \
       --query id \
       --out tsv)
      ```

   - Create the virtual network TAP in the *westcentralus* Azure region using the ID of the IP configuration as the destination. The traffic mirror destination must allow traffic to port 4789:

      ```azurecli-interactive
       az network vnet tap create \
       --resource-group myResourceGroup \
       --name myTap \
       --destination $IpConfigId \
       --location westcentralus
      ```

5. If the destination for the virtual network TAP is an Azure internal load balancer:
  
   - Retrieve the front end IP configuration of the Azure internal load balancer into a variable that is used in a later step. The ID is the end point that aggregates the TAP traffic. The following example retrieves the ID of the *frontendipconfig1* front end IP configuration for a load balancer named *myInternalLoadBalancer*, in a resource group named *myResourceGroup*:

      ```azurecli-interactive
      FrontendIpConfigId=$(az network lb frontend-ip show \
      --name frontendipconfig1 \
      --lb-name myInternalLoadBalancer \
      --resource-group myResourceGroup \
      --query id \
      --out tsv)
      ```

   - Create the virtual network TAP using the ID of the frontend IP configuration as the destination and an optional port property. The port specifies the destination port on front end IP configuration where the TAP traffic will be received:  

      ```azurecli-interactive
      az network vnet tap create \
      --resource-group myResourceGroup \
      --name myTap \
      --destination $FrontendIpConfigId \
      --port 4789 \
     --location westcentralus
     ```

6. Confirm creation of the virtual network TAP:

   ```azurecli-interactive
   az network vnet tap show \
   --resource-group myResourceGroup
   --name myTap
   ```

## Add a TAP configuration to a network interface

1. Retrieve the ID of an existing virtual network TAP resource. The following example retrieves a virtual network TAP named *myTap* in a resource group named *myResourceGroup*:

   ```azurecli-interactive
   tapId=$(az network vnet tap show \
   --name myTap \
   --resource-group myResourceGroup \
   --query id \
   --out tsv)
   ```

2. Create a TAP configuration on the network interface of the monitored virtual machine. The following example creates a TAP configuration for a network interface named *myNetworkInterface*:

   ```azurecli-interactive
   az network nic vtap-config create \
   --resource-group myResourceGroup \
   --nic myNetworkInterface \
   --vnet-tap $tapId \
   --name mytapconfig \
   --subscription subscriptionId
   ```

3. Confirm creation of the TAP configuration:

   ```azurecli-interactive
   az network nic vtap-config show \
   --resource-group myResourceGroup \
   --nic-name myNetworkInterface \
   --name mytapconfig \
   --subscription subscriptionId
   ```

## Delete the TAP configuration on a network interface

   ```azurecli-interactive
   az network nic vtap-config delete \
   --resource-group myResourceGroup \
   --nic myNetworkInterface \
   --name myTapConfig \
   --subscription subscriptionId
   ```

## List virtual network TAPs in a subscription

   ```azurecli-interactive
   az network vnet tap list
   ```

## Delete a virtual network TAP in a resource group

   ```azurecli-interactive
   az network vnet tap delete \
   --resource-group myResourceGroup \
   --name myTap
   ```

## Next steps

Learn how to [create a virtual network TAP](tutorial-virtual-network-tap-portal.md) using the Azure portal.
