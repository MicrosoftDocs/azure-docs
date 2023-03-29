---
title: 'Quickstart: Create and configure Azure DDoS IP Protection using Azure CLI'
description: Learn how to create Azure DDoS IP Protection using Azure CLI
author: AbdullahBell
ms.author: abell
ms.service: ddos-protection
ms.topic: quickstart 
ms.date: 03/09/2023
ms.workload: infrastructure-services
ms.custom: template-quickstart 
# Customer intent As an IT admin, I want to learn how to enable DDoS IP Protection on my public IP address.
---

# Quickstart: Create and configure Azure DDoS IP Protection using Azure CLI

Get started with Azure DDoS IP Protection by using Azure CLI.
In this quickstart, you'll enable DDoS IP protection and link it to a public IP address.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure CLI installed locally or Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.56 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).


## Create a resource group

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

To create a resource group, use [az group create](/cli/azure/group#az-group-create). In this example, we'll name our resource group _MyResourceGroup_ and use the _East US_ location:

```azurecli-interactive
    az group create \
        --name MyResourceGroup \
        --location eastus
```

## Enable DDoS IP Protection on a public IP address

### New public IP address

You can enable DDoS IP Protection when creating a public IP address. In this example, we'll name our public IP address _myStandardPublicIP_: 

```azurecli-interactive
    az network public-ip create \
        --resource-group MyResourceGroup \
        --name myStandardPublicIP \
        --location eastus \
        --allocation-method Static \
        --sku Standard \
        --ddos-protection-mode Enabled
```

### Existing public IP address

You can enable DDoS IP Protection on an existing public IP address.

```azurecli-interactive
    az network public-ip update \
        --resource-group MyResourceGroup \
        --name myStandardPublicIP \
        --ddos-protection-mode Enabled
```

### Disable DDoS IP Protection:

You can disable DDoS IP Protection on an existing public IP address.

```azurecli-interactive
    az network public-ip update \
        --resource-group MyResourceGroup \
        --name myStandardPublicIP \
        --ddos-protection-mode Disabled 
    
```
>[!Note]
>When changing DDoS IP protection from **Enabled** to **Disabled**, telemetry for the public IP resource will not be available.

## Validate and test

Check the details of your DDoS IP Protection:

```azurecli-interactive
    az network public-ip show \
        --resource-group MyResourceGroup \
        --name myStandardPublicIP
```

Under **ddosSettings**, Verify **protectionMode** as **Enabled**.

## Clean up resources

You can keep your resources for the next guide. If no longer needed, delete the _MyResourceGroup_ resource group. When you delete the resource group, you also delete all its related resources.

When deleting the resource group, use [az group delete](/cli/azure/group#az-group-delete):

```azurecli-interactive
    az group delete \
        --name MyResourceGroup 
```

## Next steps

In this quickstart, you created:
* A resource group 
* A public IP address 
* Enabled DDoS IP Protection using Azure CLI.

To learn how to configure telemetry for DDoS Protection, continue to the how-to guides.

> [!div class="nextstepaction"]
> [Configure diagnostic logging alerts](ddos-diagnostic-alert-templates.md)