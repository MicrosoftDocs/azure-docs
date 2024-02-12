---
title: Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS) 
description: Learn how to migrate your managed clusters from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS).
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nigreenf
ms.topic: article
ms.date: 09/26/2023
ms.custom: devx-track-azurecli
---

# Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS)

This article shows you how to migrate from Dapr OSS to the Dapr extension for AKS.

You can configure the Dapr extension to use and manage the Kubernetes resources created by Dapr OSS by [checking for an existing Dapr installation using the Azure CLI](#check-for-an-existing-dapr-installation) (*default method*) or [configuring the existing Dapr installation using `--configuration-settings`](#configure-the-existing-dapr-installation-using---configuration-settings).

For more information, see [Dapr extension for AKS][dapr-extension-aks].

## Check for an existing Dapr installation

When you [create the Dapr extension](./dapr.md), the extension checks for an existing Dapr installation on your cluster. If Dapr exists, the extension uses and manages the Kubernetes resources created by Dapr OSS.

1. List the details of your current Dapr installation using the `helm list -A` command and save the Dapr release name and namespace from the output.

    ```azurecli-interactive
    helm list -A
    ```

2. Enter the Helm release name and namespace (from `helm list -A`) when prompted with the following questions:

    ```azurecli-interactive
    Enter the Helm release name for Dapr, or press Enter to use the default name [dapr]:
    Enter the namespace where Dapr is installed, or press Enter to use the default namespace [dapr-system]:
    ```

## Configure the existing Dapr installation using `--configuration-settings`

When you [create the Dapr extension](./dapr.md), you can configure the extension to use and manage the Kubernetes resources created by Dapr OSS using the `--configuration-settings` flag.

1. List the details of your current Dapr installation using the `helm list -A` command and save the Dapr release name and namespace from the output.

    ```azurecli-interactive
    helm list -A
    ```

2. Create the Dapr extension using the [`az k8s-extension create`][az-k8s-extension-create] and use the `--configuration-settings` flags to set the Dapr release name and namespace.

    ```azurecli-interactive
    az k8s-extension create --cluster-type managedClusters \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name dapr \
    --extension-type Microsoft.Dapr \
    --configuration-settings "existingDaprReleaseName=dapr" \
    --configuration-settings "existingDaprReleaseNamespace=dapr-system"
    ```

## Update HA mode or placement service settings

When installing the Dapr extension on top of an existing Dapr installation, you receive the following message:

```output
The extension will be installed on your existing Dapr installation. Note, if you have updated the default values for global.ha.* or dapr_placement.* in your existing Dapr installation, you must provide them in the configuration settings. Failing to do so will result in an error, since Helm upgrade will try to modify the StatefulSet. See <link> for more information.
```

Kubernetes only allows patching for limited fields in StatefulSets. If any of the HA mode or placement service settings are configured, the upgrade fails. To update the HA mode or placement service settings, you must delete the stateful set and then update the HA mode.

1. Delete the stateful set using the `kubectl delete` command.

   ```azurecli-interactive
   kubectl delete statefulset.apps/dapr-placement-server -n dapr-system
   ```

2. Update the HA mode using the [`az k8s-extension update`][az-k8s-extension-update] command.

   ```azurecli-interactive
   az k8s-extension update --cluster-type managedClusters \
   --cluster-name myAKSCluster \
   --resource-group myResourceGroup \
   --name dapr \
   --extension-type Microsoft.Dapr \
   --auto-upgrade-minor-version true \  
   --configuration-settings "global.ha.enabled=true" \    
   ```

For more information, see the [Dapr production guidelines][dapr-prod-guidelines].

## Next steps

Learn more about [Dapr][dapr-overview] and [how to use it][dapr-howto].

<!-- LINKS INTERNAL -->
[dapr-overview]: ./dapr-overview.md
[dapr-howto]: ./dapr.md
[dapr-extension-aks]: ./dapr-overview.md
[az-k8s-extension-create]: /cli/azure/k8s-extension#az-k8s-extension-create
[az-k8s-extension-update]: /cli/azure/k8s-extension#az-k8s-extension-update

<!-- LINKS EXTERNAL -->
[dapr-prod-guidelines]: https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-production/#enabling-high-availability-in-an-existing-dapr-deployment
