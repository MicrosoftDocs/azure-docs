---
title: Migrate to the Dapr extension in Azure Kubernetes Service (AKS) 
description: Learn how to migrate from Dapr OSS to the Dapr extension in AKS
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nigreenf
ms.service: container-service
ms.topic: article
ms.date: 07/20/2022
ms.custom: devx-track-azurecli, ignite-fall-2021, event-tier1-build-2022
---

# Migrate to the Dapr extension in Azure Kubernetes Service (AKS)

You've installed and configured Dapr OSS on your Kubernetes cluster and want to migrate to the Dapr extension on AKS. Before you can successfully migrate to the Dapr extension, you need to fully remove Dapr OSS from your machine. In this guide, you will migrate from Dapr OSS to the Dapr extension for AKS by:

> [!div class="checklist"]
> - Uninstalling Dapr, including CRDs and namespace.
> - Installing Dapr via the Dapr extension for AKS.
> - Applying your components.
> - Restarting your Dapr workloads. 

> [!NOTE]
> Expect downtime of approximately 10 minutes while migrating to Dapr extension in AKS (2 minutes uninstall/5 minutes install). Downtime may take longer depending on varying factors. During this downtime, no Dapr functionality should be expected to run, including actors, service-to-service invocation, secrets, RBAC roles, etc.

## Uninstall Dapr 

#### [CLI](#tab/cli)

1. Run the following command to uninstall Dapr and all CRDs:

```cli
dapr uninstall -k –-all
```

1. Uninstall the Dapr namespace:

```cli
kubectl delete namespace dapr-system
```

> [!NOTE]
> `dapr-system` is the default namespace installed with `dapr init -k`. If you created a custom namespace, replace `dapr-system` with your namespace.

#### [Helm](#tab/helm)

1. Run the following command to uninstall Dapr:

```cli
dapr uninstall -k –-all
```

1. Uninstall CRDs: 

```cli
kubectl delete crd components.dapr.io
kubectl delete crd configurations.dapr.io
kubectl delete crd subscriptions.dapr.io
kubectl delete crd resiliencies.dapr.io
```

1. Uninstall the Dapr namespace:

```cli
kubectl delete namespace dapr-system
```

> [!NOTE]
> `dapr-system` is the default namespace installed with `dapr init -k`. If you created a custom namespace, replace `dapr-system` with your namespace.

---

## Install Dapr via the AKS extension

Once you've uninstalled Dapr from your system, install the [Dapr extension for AKS and Arc-enabled Kubernetes](./dapr.md#create-the-extension-and-install-dapr-on-your-aks-or-arc-enabled-kubernetes-cluster).

```cli
az k8s-extension create --cluster-type managedClusters \                                               
--cluster-name <dapr-cluster-name> \
--resource-group <dapr-resource-group> \
--name <dapr-ext> \
--extension-type Microsoft.Dapr
```

## Apply your components

```cli
kubectl apply -f <component.yaml>
```

## Restart your Dapr workloads

```cli
kubectl rollout restart <deployment-name>
```

## Next steps
