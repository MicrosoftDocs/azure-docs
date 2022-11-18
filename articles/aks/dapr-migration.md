---
title: Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS) 
description: Learn how to migrate your managed clusters from Dapr OSS to the Dapr extension for AKS
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nigreenf
ms.service: container-service
ms.topic: article
ms.date: 11/16/2022
ms.custom: devx-track-azurecli
---

# Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS)

You've installed and configured Dapr OSS on your Kubernetes cluster and want to migrate to the Dapr extension on AKS. In this guide, you'll learn how Dapr moves your managed clusters from using Dapr OSS to the Dapr extension by either:

- **Interactive flow**: A built-in check for an existing Dapr installation via CLI prompts, or
- **Non-interactive flow**: Installing the Dapr extension with configuration settings using the Helm release name and namespace of the existing installation. 

This check allows the Dapr extension to reuse the already existing Kubernetes resources from your previous installation and start managing them. 

#### [Interactive flow](#tab/interactive)

## Use the built-in check for an existing Dapr installation

The Dapr extension, by default, checks for existing Dapr installations when you run the `az k8s-extension create` command. To list the details of your current Dapr installation, run the following command and save the Dapr release name and namespace:

```bash
helm list -A
```

When [installing the extension][dapr-create], you'll receive a prompt asking if Dapr is already installed:

```bash
Is Dapr already installed in the cluster? (y/N): y
```

For the following prompts:

- If you kept the default Dapr name and namespace created with `dapr init -k`, press **Enter**. 
- If you created your own unique name and namespace, type the unique release name and namespace and press **Enter**.

```bash
Enter the Helm release name for Dapr, or press Enter to use the default name [dapr]:
Enter the namespace where Dapr is installed, or press Enter to use the default namespace [dapr-system]:
```

#### [Non-interactive flow](#tab/non-interactive)

## Configure the Dapr check using `--configuration-settings` 

When creating the Dapr extension, you can configure the Dapr migration via the `--configuration-settings`. This method is useful when installing via automation, etc.

If Dapr doesn't already exist on your machine and you'd like to bypass checking for an existing Dapr installation, set `skipExistingDaprCheck` to `true`:

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKScluster \
--resource-group myResourceGroup \
--name dapr \
--extension-type Microsoft.Dapr \
--configuration-settings skipExistingDaprCheck=true
```

To tell the Azure CLI that Dapr exists on your machine, add the following `configuration-settings` with the Dapr release name and namespace:

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKScluster \
--resource-group myResourceGroup \
--name dapr \
--extension-type Microsoft.Dapr \
--configuration-settings existingDaprReleaseName=dapr \
--configuration-settings existingDaprReleaseNamespace=dapr-system
```

--- 

## Update HA mode or placement service settings

Once you install the Dapr extension, you'll see the following message while the CLI creates the extension:

```bash
The extension will be installed on your existing Dapr installation. Note, if you have updated the default values for global.ha.* or dapr_placement.* in your existing Dapr installation, you must provide them in the configuration settings. Failing to do so will result in an error, since Helm upgrade will try to modify the StatefulSet. See <link> for more information.
```

You can update HA mode or placement service settings via the following commands:

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
For more information, read the [Dapr Production Guidelines][dapr-prod-guidelines].


## Next steps

Learn more about [the cluster extension][dapr-overview.md] and [how to use it][dapr-howto].


<!-- LINKS INTERNAL -->
[dapr-overview]: ./dapr-overview.md
[dapr-howto]: ./dapr.md
[dapr-create]: ./dapr.md#create-the-extension-and-install-dapr-on-your-aks-or-arc-enabled-kubernetes-cluster

<!-- LINKS EXTERNAL -->
[dapr-prod-guidelines]: https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-production/#enabling-high-availability-in-an-existing-dapr-deployment
