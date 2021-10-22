---
title: Deploy container image from Azure Container Registry using a managed identity
description: Learn how to deploy containers in Azure Container Instances by pulling container images from an Azure container registry using a managed identity.
services: container-instances
ms.topic: article
ms.date: 07/02/2020
ms.custom: mvc, devx-track-azurecli
---

# Deploy to Azure Container Instances from Azure Container Registry using a managed identity

[Azure Container Registry](../container-registry/container-registry-intro.md) is an Azure-based, managed container registry service used to store private Docker container images. This article describes how to pull container images stored in an Azure container registry when deploying to Azure Container Instances. One way to configure registry access is to create an Azure Active Directory managed identity.

## Prerequisites

**Azure container registry**: You need an Azure container registry--and at least one container image in the registry--to complete the steps in this article. If you need a registry, see [Create a container registry using the Azure CLI](../container-registry/container-registry-get-started-azure-cli.md).

**Azure CLI**: The command-line examples in this article use the [Azure CLI](/cli/azure/) and are formatted for the Bash shell. You can [install the Azure CLI](/cli/azure/install-azure-cli) locally, or use the [Azure Cloud Shell][cloud-shell-bash].

## Limitations

* You can't pull images from [Azure Container Registry](../container-registry/container-registry-vnet.md) deployed into an Azure Virtual Network at this time.

## Configure registry authentication

### Create an identity

Create an identity in your subscription using the [az identity create](/cli/azure/identity#az_identity_create) command. You can use the same resource group you used previously to create the container registry, or a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myACRId
```

To configure the identity in the following steps, use the [az identity show][az_identity_show] command to store the identity's resource ID and service principal ID in variables.

```azurecli
# Get resource ID of the user-assigned identity
userID=$(az identity show --resource-group myResourceGroup --name myACRId --query id --output tsv)

# Get service principal ID of the user-assigned identity
spID=$(az identity show --resource-group myResourceGroup --name myACRId --query principalId --output tsv)
```

Because you need the identity's ID in a later step when you sign in to the CLI from your virtual machine, show the value:

```bash
echo $userID
```

The ID is of the form:

```bash
/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRId
```

### Configure the VM with the identity
