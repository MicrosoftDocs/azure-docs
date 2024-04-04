---
title: 'Tutorial: Configure routing preference for a VM - Azure CLI'
description: In this tutorial, learn how to configure routing preference for a VM using a public IP address with the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: tutorial
ms.date: 08/24/2023
ms.custom: template-tutorial, devx-track-azurecli 
ms.devlang: azurecli
---

# Tutorial: Configure routing preference for a VM using the Azure CLI
This tutorial shows you how to configure routing preference for a virtual machine. Internet bound traffic from the VM will be routed via the ISP network when you choose **Internet** as your routing preference option. The default routing is via the Microsoft global network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a public IP address configured for **Internet** routing preference.
> * Create a virtual machine.
> * Verify the public IP address is set to **Internet** routing preference.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **TutorVMRoutePref-rg** in the **westus2** location.

```azurecli-interactive
  az group create \
    --name TutorVMRoutePref-rg \
    --location westus2
```

## Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a standard zone-redundant public IPv4 address named **myPublicIP** in **TutorVMRoutePref-rg**. The **Tag** of **Internet** is applied to the public IP address as a parameter in the CLI command enabling the **Internet** routing preference.

```azurecli-interactive
az network public-ip create \
    --resource-group TutorVMRoutePref-rg \
    --name myPublicIP \
    --version IPv4 \
    --ip-tags 'RoutingPreference=Internet' \
    --sku Standard \
    --zone 1 2 3
```

## Create virtual machine

Use [az vm create](/cli/azure/vm#az-vm-create) to create a virtual machine. The public IP address created in the previous section is added as part of the CLI command and is attached to the VM during creation.

```azurecli-interactive
az vm create \
--name myVM \
--resource-group TutorVMRoutePref-rg \
--public-ip-address myPublicIP \
--size Standard_A2 \
--image MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest \
--admin-username azureuser
```

## Verify internet routing preference

Use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to verify that **Internet** routing preference is configured for the public IP address.

```azurecli-interactive
az network public-ip show \
    --resource-group TutorVMRoutePref-rg \
    --name myPublicIP \
    --query ipTags \
    --output tsv
```

## Clean up resources

When you're done with the virtual machine and public IP address, delete the resource group and all of the resources it contains with [az group delete](/cli/azure/group#az-group-delete).

```azurecli-interactive
  az group delete \
    --name TutorVMRoutePref-rg
```

## Next steps

Advance to the next article to learn how to create a virtual machine with mixed routing preference:
> [!div class="nextstepaction"]
> [Configure both routing preference options for a virtual machine](routing-preference-mixed-network-adapter-portal.md)

