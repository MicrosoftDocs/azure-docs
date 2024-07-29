---
title: Configure the Azure App Configuration extension for your Azure Kubernetes Service (Preview)
description: Learn how to configure the Azure App Configuration extension specifically for your Azure Kubernetes Service (AKS).
author: RichardChen820
ms.author: junbchen
ms.topic: article
ms.custom: devx-track-azurecli
ms.subservice: aks-developer
ms.date: 05/09/2024
---

# Configure the Azure App Configuration extension for your Azure Kubernetes Service (Preview)

Once you [created the Azure App Configuration extension](./azure-app-configuration.md), you can configure the extension to work best for you and your project using various configuration options, like:

- Configuring the replica count.
- Configuring the log verbosity.
- Configuring the installation namespace.

The extension enables you to configure Azure App Configuration extension settings by using the `--configuration-settings` parameter in the Azure CLI. 

> [!TIP]
> For a list of available options, see [Azure App Configuration Kubernetes Provider helm values](https://raw.githubusercontent.com/Azure/AppConfiguration-KubernetesProvider/main/deploy/parameter/helm-values.yaml).

## Configure the replica count

The default replica count is `1`. Create Azure App Configuration extension with customized replica count:

```azurecli
az k8s-extension create --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name appconfigurationkubernetesprovider \
    --extension-type Microsoft.AppConfiguration \
    --auto-upgrade-minor-version true \
    --configuration-settings "replicaCount=3"
```

> [!NOTE]
> If configuration settings are sensitive and need to be protected (for example, cert-related information), pass the `--configuration-protected-settings` parameter and the value will be protected from being read.

## Configure the log verbosity

The default log verbosity is `1`. Create Azure App Configuration extension with customized log verbosity:

```azurecli
az k8s-extension create --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name appconfigurationkubernetesprovider \
    --extension-type Microsoft.AppConfiguration \
    --auto-upgrade-minor-version true \
    --configuration-settings "logVerbosity=3"
```

Log verbosity levels follow the [klog](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md#what-method-to-use) convention:

- `0`: Warning and error only.
- `1`: Informational, this level is default.
- `2`: Detailed steady state information.
- `3`: Extended information about changes.
- `4`: Debug level verbosity.
- `5`: Trace level verbosity.

## Configure the Azure App Configuration extension namespace

The Azure App Configuration extension gets installed in the `azappconfig-system` namespace by default. To override it, use `--release-namespace`. Include the cluster `--scope` to redefine the namespace.

```azurecli
az k8s-extension create --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name appconfigurationkubernetesprovider \
    --extension-type Microsoft.AppConfiguration \
    --auto-upgrade-minor-version true \
    --scope cluster \
    --release-namespace custom-namespace
```

## Show current configuration settings

Use the `az k8s-extension show` command to show the current Azure App Configuration extension settings:  

```azurecli
az k8s-extension show --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name appconfigurationkubernetesprovider
```

## Update configuration settings

To update your Azure App Configuration extension settings, recreate the extension with the desired state. For example, assume we installed the extension using the following configuration:

```azurecli
az k8s-extension create --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name appconfigurationkubernetesprovider \
    --extension-type Microsoft.AppConfiguration \
    --auto-upgrade-minor-version true \  
    --configuration-settings "replicaCount=2" 
```

To update the `replicaCount` from two to three, use the following command:

```azurecli
az k8s-extension create --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name appconfigurationkubernetesprovider \
    --extension-type Microsoft.AppConfiguration \
    --auto-upgrade-minor-version true \
    --configuration-settings "replicaCount=3"
```

## Next Steps

Once you successfully install Azure App Configuration extension in your AKS cluster, try [quickstart](../azure-app-configuration/quickstart-azure-kubernetes-service.md) to learn how to use it.

