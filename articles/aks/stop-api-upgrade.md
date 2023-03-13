---
title: Stop cluster upgrades on API breaking changes in Azure Kubernetes Service (AKS)
description: Learn how to stop minor version change Azure Kubernetes Service (AKS) cluster upgrades on API breaking changes.
ms.topic: article
ms.author: schaffererin
author: schaffererin
ms.date: 03/13/2023
---

# Stop cluster upgrades on API breaking changes in Azure Kubernetes Service (AKS)

To stay within a supported Kubernetes version, you usually have to upgrade your version at least once per year and prepare for all possible disruptions, including major disruptions caused by all API breaking changes and deprecations, including ones in dependencies such as Helm and CSI. It can be difficult to anticipate these disruptions and migrate critical workloads without experiencing any downtime.

Azure Kubernetes Service (AKS) now supports fail fast on minor version change cluster upgrades. This feature alerts you with an error message if it detects usage on deprecated APIs in the goal version.

## Before you begin

__

## Fail fast on control plane minor version manual and auto upgrades in AKS

AKS will fail fast on minor version change cluster auto and manual upgrades if it detects usage on deprecated APIs in the goal version. This will only happen if the following criteria are true:

- It's a minor version change for the cluster control plane.
- Your Kubernetes goal version is >= 1.26.0.
- The PUT MC request uses a preview api version of >= 2023-01-02-preview.
- The usage is performed within the last 1-12 hours. We record usage hourly, so usage within the last hour isn't guaranteed to appear in the detection.

If the previous criteria are true and you attempt an upgrade, you'll receive an error message similar to the following example error message:

```azurecli
Bad Request({
    "code": "ValidationError".
    "message": "1 error occurred: \n\t* usage has been detected on API flowcontrol.apiserver.k8s.io.prioritylevelconfigurations.v1beta1, and was recently seen at: 2023-03-09 23:38:28 +0000 UTC, which will be removed in 1.26\n\n*.
    "subcode": ""
})
```

After receiving the error message, you can either:

- Remove usage on your end and wait 12 hours for the current record to expire, or
- Bypass the validation to ignore API changes.

## Fail fast on minor version manual upgrades in AKS

When manually updating a minor Kubernetes version, checks will be run to detect API breaking changes. If you attempt an upgrade and the checks detect usage on a deprecated API in the goal version, you can either remove usage on your end by __ or bypass the validation to ignore API changes.

### Remove usage on API breaking changes - Manual upgrade

To remove usage on API brekaing changes, __.

### Bypass validation to ignore API changes - Manual upgrade

To override fail fast on control plane minor version manual upgrades in AKS, use the [`az aks upgrade`][az-aks-upgrade] command with the `--ignore-api-changes` parameter.

```azurecli
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes_version KUBERNETES_VERSION --ignore-api-changes
```

To override *after* fail fast, use the [`az aks upgrade`][az-aks-upgrade] command.

```azurecli
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes_version KUBERNETES_VERSION
```

You'll receive a message prompting you to choose whether you want to proceed with the API breaking changes. This message will look similar to the following example message:

```azurecli
We detected the following API breaking changes in your service, do you wish to proceed Y/N?
```

## Fail fast on minor version auto upgrades in AKS

If you opted in to automatic upgrades for your AKS clusters, checks will be run before upgrading to detect  API breaking changes. If the checks detect usage on a deprecated API in the goal version, it will be flagged in the activity log of the Azure portal. From there, you can either remove usage on your end by __ or bypass the validation to override fail fast.

### Remove usage on API breaking changes - Auto upgrade

__

### Bypass validation to ignore API changes - Auto upgrade

__

## Next steps

In this article, you learned how to stop cluster upgrades on API breaking changes in AKS. To learn more about AKS cluster upgrades, see:

- [Automatically upgrade an AKS cluster][auto-upgrade-cluster]
- [Use Planned Maintenance to schedule and control upgrades for your AKS clusters (preview)][planned-maintenance-aks]

<!-- INTERNAL LINKS -->
[auto-upgrade-cluster]: auto-upgrade-cluster.md
[planned-maintenance-aks]: planned-maintenance.md
[az-aks-upgrade]: /cli/azure/aks#az_aks_upgrade
