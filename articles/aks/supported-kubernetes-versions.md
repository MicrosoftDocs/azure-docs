---
title: Supported Kubernetes versions in Azure Kubernetes Service
description: Understand the Kubernetes version support policy and lifecycle of clusters in Azure Kubernetes Service (AKS)
services: container-service
author: sauryadas
ms.topic: article
ms.date: 12/09/2019
ms.author: saudas
---

# Supported Kubernetes versions in Azure Kubernetes Service (AKS)

The Kubernetes community releases minor versions roughly every three months. These releases include new features and
improvements. Patch releases are more frequent (sometimes weekly) and are only intended for critical bug fixes in a
minor version. These patch releases include fixes for security vulnerabilities or major bugs impacting a large number
of customers and products running in production based on Kubernetes.

AKS aims to certify and release new Kubernetes versions within 30 days of an upstream release, subject to the stability of the release.

## Kubernetes versions

Kubernetes uses the standard [Semantic Versioning](https://semver.org/) versioning scheme. This means that each version
of Kubernetes follows this numbering scheme:

```
[major].[minor].[patch]

Example:
  1.12.14
  1.12.15
```

Each number in the version indicates general compatibility with the previous version:

* Major versions change when incompatible API changes or backwards compatibility may be broken.
* Minor versions change when functionality changes are made that are backwards compatible to the other minor releases.
* Patch versions change when backwards-compatible bug fixes are made.

Users should aim to run the latest patch release of the minor version they are running, for example if
your production cluster is on *1.12.14* and *1.12.15* is the latest available patch version available for the *1.12* series, you should upgrade to *1.12.15* as soon as you are able to ensure your cluster is fully patched and supported.

## Kubernetes version support policy

AKS supports three minor versions of Kubernetes:

* The current minor version that is released in AKS (N)
* Two previous minor versions. Each supported minor version also supports two stable patches.

This is known as "N-2": (N (Latest release) - 2 (minor versions)).

For example, if AKS introduces *1.15.a* today, support is provided for the following versions:

New minor version    |    Supported Version List
-----------------    |    ----------------------
1.15.a               |    1.15.a, 1.15.b, 1.14.c, 1.14.d, 1.13.e, 1.13.f

Where ".letter" is representative of patch versions.

For details on communications regarding version changes and expectations, see "Communications" below.

When a new minor version is introduced, the oldest minor version and patch releases supported are deprecated and removed. For example, if the current supported version list is:

```
1.15.a
1.15.b
1.14.c
1.14.d
1.13.e
1.13.f
```

And AKS releases 1.16.*, this means that the 1.13.* versions (all 1.13 versions) will be removed and are out of support.

> [!NOTE]
> Please note, that if customers are running an unsupported Kubernetes version, they will be asked to upgrade when
> requesting support for the cluster. Clusters running unsupported Kubernetes releases are not covered by the
> [AKS support policies](https://docs.microsoft.com/azure/aks/support-policies).

In addition to the above on minor versions, AKS supports the two latest **patch** releases of a given minor version. For example, given the following supported versions:

```
Current Supported Version List
------------------------------
1.15.2, 1.15.1, 1.14.5, 1.14.4
```

If upstream Kubernetes released 1.15.3 and 1.14.6 and AKS releases those patch versions, the oldest patch versions are deprecated and removed, and the supported version list becomes:

```
New Supported Version List
----------------------
1.15.*3*, 1.15.*2*, 1.14.*6*, 1.14.*5*
```

### Communications

* For new **minor** versions of Kubernetes
  * All users are notified publicly of the new version and what version will be removed.
  * When a new patch version is released, the oldest patch release is removed at the same time.
  * Azure support provides customers **30 days** from the public notification date to upgrade to a supported minor version release. Once 30 days have passed, you are required to update your minor version to continue receiving support.
* For new **patch** versions of Kubernetes
  * All users are notified of the new patch version being released and to upgrade to the latest patch release.
  * Azure support provides customers **30 days** to upgrade to a supported patch release, after removal of an older patch version. Once 30 days have passed, you are required to update your patch version to continue receiving support.

AKS defines a "released version" as the generally available versions, enabled in all SLO / Quality of Service measurements and available in all regions. AKS may also support preview versions which are explicitly labeled and subject to Preview terms and conditions.

#### Notification channels for AKS changes

AKS publishes regular service updates which summarize new Kubernetes versions, service changes, and component updates that have been released on the service on [GitHub](https://github.com/Azure/AKS/releases).

These changes are rolled to all customers as part of regular maintenance that is offered as part of the managed service, some require explicit upgrades while others require no action.

Notifications are also sent via:

* [AKS Release notes](https://aka.ms/aks/releasenotes)
* Azure portal notifications
* [Azure update channel][azure-update-channel]

### Supported Versions Policy Exceptions

AKS reserves the right to add or remove new/existing versions that have been identified to have one or more critical production impacting bugs or security issues without advance notice.

Specific patch releases may be skipped, or rollout accelerated depending on the severity of the bug or security issue.

### Azure portal and CLI default versions

When you deploy an AKS cluster in the portal or with the Azure CLI, the cluster is defaulted to the N-1 minor version and latest patch. For example, if AKS supports *1.15.a*, *1.15.b*, *1.14.c*, *1.14.d*,  *1.13.e*, and *1.13.f*, the default version selected is *1.14.c*.

AKS chooses the default of N-1 to provide customers a known, stable, and patched version by default.

## List currently supported versions

To find out what versions are currently available for your subscription and region, use the
[az aks get-versions][az-aks-get-versions] command. The following example lists the available Kubernetes versions for the *EastUS* region:

```azurecli-interactive
az aks get-versions --location eastus --output table
```

## FAQ

**What happens when a customer upgrades a Kubernetes cluster with a minor version that is not supported?**

If you are on the *n-3* version, you are outside of support and will be asked to upgrade. If your upgrade from version n-3 to n-2 succeeds, you are now within our support policies. For example:

- If the oldest supported AKS version is are *1.13.a* and you are on *1.12.b* or older, you are outside of support.
- If the upgrade from *1.12.b* to *1.13.a* or higher succeeds, you are back within our support policies.

Upgrades to versions older than the supported window of *N-2* are not supported. In such cases, we recommend customers create new AKS clusters and redeploy their workloads with versions in the supported window.

**What does 'Outside of Support' mean**

'Outside of Support' means that the version you are running is outside of the supported versions list, and you will be
asked to upgrade the cluster to a supported version when requesting support. Additionally, AKS does not make any
runtime or other guarantees for clusters outside of the supported versions list.

**What happens when a customer scales a Kubernetes cluster with a minor version that is not supported?**

For minor versions not supported by AKS, scaling in or out should continue to work but it is highly recommended to upgrade to bring your cluster back into support.

**Can a customer stay on a Kubernetes version forever?**

If a cluster has been out of support for more than 3 minor versions and has been found to carry security risks, Azure contacts you to proactively upgrade your cluster. If you do not take further action, Azure reserves the right to force upgrade your cluster on your behalf.

**What version does the control plane support if the node pool is not in one of the supported AKS versions?**

The control plane must be within a window of versions from all node pools. For details on upgrading the control plane or node pools, visit documentation on [upgrading node pools](use-multiple-node-pools.md#upgrade-a-cluster-control-plane-with-multiple-node-pools).

## Next steps

For information on how to upgrade your cluster, see [Upgrade an Azure Kubernetes Service (AKS) cluster][aks-upgrade].

<!-- LINKS - External -->
[aks-engine]: https://github.com/Azure/aks-engine
[azure-update-channel]: https://azure.microsoft.com/updates/?product=kubernetes-service

<!-- LINKS - Internal -->
[aks-upgrade]: upgrade-cluster.md
[az-aks-get-versions]: /cli/azure/aks#az-aks-get-versions
