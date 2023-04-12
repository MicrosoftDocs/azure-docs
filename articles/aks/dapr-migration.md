---
title: Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS) 
description: Learn how to migrate your managed clusters from Dapr OSS to the Dapr extension for AKS
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nigreenf
ms.topic: article
ms.date: 11/21/2022
ms.custom: devx-track-azurecli
---

# Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS)

You've installed and configured Dapr OSS (using Dapr CLI or Helm) on your Kubernetes cluster, and want to start using the Dapr extension on AKS. In this guide, you'll learn how the Dapr extension for AKS can use the Kubernetes resources created by Dapr OSS and start managing them, by either:

- Checking for an existing Dapr installation via Azure CLI prompts (default method), or
- Using the release name and namespace from `--configuration-settings` to explicitly point to an existing Dapr installation.

## Check for an existing Dapr installation

The Dapr extension, by default, checks for existing Dapr installations when you run the `az k8s-extension create` command. To list the details of your current Dapr installation, run the following command and save the Dapr release name and namespace:

```bash
helm list -A
```

When [installing the extension][dapr-create], you'll receive a prompt asking if Dapr is already installed:

```bash
Is Dapr already installed in the cluster? (y/N): y
```

If Dapr is already installed, please enter the Helm release name and namespace (from `helm list -A`) when prompted the following:

```bash
Enter the Helm release name for Dapr, or press Enter to use the default name [dapr]:
Enter the namespace where Dapr is installed, or press Enter to use the default namespace [dapr-system]:
```

## Configuring the existing Dapr installation using `--configuration-settings`

Alternatively, when creating the Dapr extension, you can configure the above settings via `--configuration-settings`. This method is useful when you are automating the installation via bash scripts, CI pipelines, etc.

If you don't have an existing Dapr installation on your cluster, set `skipExistingDaprCheck` to `true`:

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKScluster \
--resource-group myResourceGroup \
--name dapr \
--extension-type Microsoft.Dapr \
--configuration-settings "skipExistingDaprCheck=true"
```

If Dapr exists on your cluster, set the Helm release name and namespace (from `helm list -A`) via `--configuration-settings`:

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKScluster \
--resource-group myResourceGroup \
--name dapr \
--extension-type Microsoft.Dapr \
--configuration-settings "existingDaprReleaseName=dapr" \
--configuration-settings "existingDaprReleaseNamespace=dapr-system"
```

## Update HA mode or placement service settings

When you install the Dapr extension on top of an existing Dapr installation, you'll see the following prompt:

> ```The extension will be installed on your existing Dapr installation. Note, if you have updated the default values for global.ha.* or dapr_placement.* in your existing Dapr installation, you must provide them in the configuration settings. Failing to do so will result in an error, since Helm upgrade will try to modify the StatefulSet. See <link> for more information.```

Kubernetes only allows for limited fields in StatefulSets to be patched, subsequently failing upgrade of the placement service if any of the mentioned settings are configured. You can follow the steps below to update those settings:

1. Delete the stateful set.

   ```azurecli-interactive
   kubectl delete statefulset.apps/dapr-placement-server -n dapr-system
   ```

1. Update the HA mode:
   
   ```azurecli-interactive
   az k8s-extension update --cluster-type managedClusters \
   --cluster-name myAKSCluster \
   --resource-group myResourceGroup \
   --name dapr \
   --extension-type Microsoft.Dapr \
   --auto-upgrade-minor-version true \  
   --configuration-settings "global.ha.enabled=true" \    
   ```

For more information, see [Dapr Production Guidelines][dapr-prod-guidelines].


## Next steps

Learn more about [Dapr][dapr-overview] and [how to use it][dapr-howto].


<!-- LINKS INTERNAL -->
[dapr-overview]: ./dapr-overview.md
[dapr-howto]: ./dapr.md
[dapr-create]: ./dapr.md#create-the-extension-and-install-dapr-on-your-aks-or-arc-enabled-kubernetes-cluster

<!-- LINKS EXTERNAL -->
[dapr-prod-guidelines]: https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-production/#enabling-high-availability-in-an-existing-dapr-deployment
