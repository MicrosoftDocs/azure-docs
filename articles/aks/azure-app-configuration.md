---
title: Azure App Configuration extension for Azure Kubernetes Service (Preview) 
description: Install and configure Azure App Configuration extension on your Azure Kubernetes Service (AKS).
author: RichardChen820
ms.author: junbchen
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 05/09/2024
ms.subservice: aks-developer
ms.custom: devx-track-azurecli, references_regions
---

# Azure App Configuration extension for Azure Kubernetes Service (Preview) 

[Azure App Configuration](../azure-app-configuration/overview.md) provides a service to centrally manage application settings and feature flags. [Azure App Configuration Kubernetes Provider](https://mcr.microsoft.com/en-us/product/azure-app-configuration/kubernetes-provider/about) is a Kubernetes operator that gets key-values, Key Vault references and feature flags from Azure App Configuration and builds them into Kubernetes ConfigMaps and Secrets. Azure App Configuration extension for Azure Kubernetes Service (AKS) allows you to install and manage Azure App Configuration Kubernetes Provider on your AKS cluster via Azure Resource Manager (ARM).

## Prerequisites 

- An Azure subscription. [Don't have one? Create a free account.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli).
- If you don't have one already, you need to create an [AKS cluster](./tutorial-kubernetes-deploy-cluster.md).
- Make sure you have [an Azure Kubernetes Service RBAC Admin role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-rbac-admin) 

### Set up the Azure CLI extension for cluster extensions

Install the `k8s-extension` Azure CLI extension by running the following commands:

```azurecli
az extension add --name k8s-extension
```

If the `k8s-extension` extension is already installed, you can update it to the latest version using the following command:

```azurecli
az extension update --name k8s-extension
```

### Register the `KubernetesConfiguration` resource provider

If you haven't previously used cluster extensions, you may need to register the resource provider with your subscription. You can check the status of the provider registration using the [az provider list](/cli/azure/provider#az-provider-list) command, as shown in the following example:

```azurecli
az provider list --query "[?namespace=='Microsoft.KubernetesConfiguration']" -o table
```

The *Microsoft.KubernetesConfiguration* provider should report as *Registered*, as shown in the following example output:

```output
Namespace                          RegistrationState    RegistrationPolicy
---------------------------------  -------------------  --------------------
Microsoft.KubernetesConfiguration  Registered           RegistrationRequired
```

If the provider shows as *NotRegistered*, register the provider using the [az provider register](/cli/azure/provider#az-provider-register) as shown in the following example:

```azurecli
az provider register --namespace Microsoft.KubernetesConfiguration
```

## Install the extension on your AKS cluster

Create the Azure App Configuration extension, which installs Azure App Configuration Kubernetes Provider on your AKS.

For example, install the latest version of Azure App Configuration Kubernetes Provider via the Azure App Configuration extension on your AKS cluster:

```azurecli
az k8s-extension create --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name appconfigurationkubernetesprovider \
    --extension-type Microsoft.AppConfiguration \
    --release-train preview
```

### Configure automatic updates

If you create Azure App Configuration extension without specifying a version, `--auto-upgrade-minor-version` *is automatically enabled*, configuring the Azure App Configuration extension to automatically update its minor version on new releases.

You can disable auto update by specifying the `--auto-upgrade-minor-version` parameter and setting the value to `false`. 

```azurecli
--auto-upgrade-minor-version false
```

### Targeting a specific version

The same command-line argument is used for installing a specific version of Azure App Configuration Kubernetes Provider or rolling back to a previous version. Set `--auto-upgrade-minor-version` to `false` and `--version` to the version of Azure App Configuration Kubernetes Provider you wish to install. If the `version` parameter is omitted, the extension installs the latest version.

```azurecli
az k8s-extension create --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name appconfigurationkubernetesprovider \
    --extension-type Microsoft.AppConfiguration \
    --auto-upgrade-minor-version false \
    --release-train preview \
    --version 2.0.0-preview
```

## Extension versions

The Azure App Configuration extension supports the following version of Azure App Configuration Kubernetes Provider:
- `2.0.0-preview`

## Regions

The Azure App Configuration extension is available in the following regions:

> East US 2 EUAP, Canada Central, West Central US, Central India, East US, East US 2, North Europe, UK South, Australia East, Central US, West Europe, West US, West US 2, West US 3


## Troubleshoot extension installation errors

If the extension fails to create or update, try suggestions and solutions in the [Azure App Configuration extension troubleshooting guide](/troubleshoot/azure/azure-kubernetes/extensions/troubleshoot-app-configuration-extension-installation-errors).

## Troubleshoot Azure App Configuration Kubernetes Provider

Troubleshoot Azure App Configuration Kubernetes Provider errors via the [troubleshooting guide](/azure/azure-app-configuration/quickstart-azure-kubernetes-service#troubleshooting).

## Delete the extension

If you need to delete the extension and remove Azure App Configuration Kubernetes Provider from your AKS cluster, you can use the following command: 

```azurecli
az k8s-extension delete --resource-group myResourceGroup --cluster-name myAKSCluster --cluster-type managedClusters --name appconfigurationkubernetesprovider
```

## Next Steps

- Learn more about [extra settings and preferences you can set on the Azure App Configuration extension](./azure-app-configuration-settings.md).
- Once you successfully install Azure App Configuration extension in your AKS cluster, try [quickstart](../azure-app-configuration/quickstart-azure-kubernetes-service.md) to learn how to use it.
- See all the supported features of [Azure App Configuration Kubernetes Provider](../azure-app-configuration/reference-kubernetes-provider.md).
