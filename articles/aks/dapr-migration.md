---
title: Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS) 
description: Learn how to migrate from Dapr OSS to the Dapr extension for AKS
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nigreenf
ms.service: container-service
ms.topic: article
ms.date: 11/07/2022
ms.custom: devx-track-azurecli
---

# Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS)

You've installed and configured Dapr OSS on your Kubernetes cluster and want to migrate to the Dapr extension on AKS. In this guide, you will learn how to move your managed clusters from Dapr OSS to the Dapr extension using either the:

- Non-interactive flow
- Interactive flow

When creating the Dapr extension for AKS, specify the `configuration-settings` to enable or disable a check for an existing Dapr installation. 

## Before you begin

If you updated the default values for `global.ha.*` or `dapr_placement.*` in your existing Dapr installation, you must provide them in the `configuration-settings` when creating the Dapr extension. Failing to do so will result in an error, since the Helm upgrade will try to modify the `StatefulSet`. 

You can update HA or placement via one of the following two ways:

1. Delete and recreate HA or placement values, or
1. For advanced users, run the following commands:

   ```azurecli-interactive
   kubectl delete statefulset.apps/dapr-placement-server -n dapr-system
   az k8s-extension create
   ```

   For more information, read the [Dapr Production Guidelines][dapr-prod-guidelines].

## Non-interactive flow 

To bypass the existing Dapr check, set `skipExistingDaprCheck` to `true`:

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKScluster \
--resource-group myResourceGroup \
--name dapr \
--extension-type Microsoft.Dapr \
--configuration-settings skipExistingDaprCheck=true
```

## Interactive flow

To receive prompts and messages notifying you of an existing Dapr OSS install, add the following `configuration-settings` to the create command:

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKScluster \
--resource-group myResourceGroup \
--name dapr \
--extension-type Microsoft.Dapr \
--configuration-settings existingDaprReleaseName=dapr \
--configuration-settings existingDaprReleaseNamespace=dapr-system
```

> [!NOTE]
> `dapr-system` is the default namespace installed with `dapr init -k`. If you created a custom namespace, replace `dapr-system` with your namespace.


## Next steps

Learn more about [the cluster extension][dapr-overview.md] and [how to use it][dapr-howto].


<!-- LINKS INTERNAL -->
[dapr-overview]: ./dapr-overview.md
[dapr-howto]: ./dapr.md

<!-- LINKS EXTERNAL -->
[dapr-prod-guidelines]: https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-production/#enabling-high-availability-in-an-existing-dapr-deployment
