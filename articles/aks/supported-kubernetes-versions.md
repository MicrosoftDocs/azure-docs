---
title: Supported Kubernetes versions in Azure Kubernetes Service
description: Understand the Kubernetes version support policy and lifecycle of clusters in Azure Kubernetes Service (AKS)
services: container-service
author: sauryadas

ms.service: container-service
ms.topic: article
ms.date: 05/20/2019
ms.author: saudas
---

# Supported Kubernetes versions in Azure Kubernetes Service (AKS)

The Kubernetes community releases minor versions roughly every three months. These releases include new features and
improvements. Patch releases are more frequent (sometimes weekly) and are only intended for critical bug fixes in a
minor version. These patch releases include fixes for security vulnerabilities or major bugs impacting a large number
of customers and products running in production based on Kubernetes.

AKS aims to certify and release new Kubernetes versions within 30 days of an upstream release, subject to the stability
of the release.

## Kubernetes versions

Kubernetes uses the standard [Semantic Versioning](https://semver.org/) versioning scheme. This means that each version
of Kubernetes follows this numbering scheme:

```
[major].[minor].[patch]

Example:
  1.12.14
  1.12.15
  1.13.7
```

Each number in the version indicates general compatibility with the previous version:

* Major versions change when incompatible API changes or backwards compatibility may be broken.
* Minor versions change when functionality changes are made that are backwards compatible to the other minor releases.
* Patch versions change when backwards-compatible bug fixes are made.

In general, users should endeavor to run the latest patch release of the minor version they are running, for example if
your production cluster is on *1.13.6* and *1.13.7* is the latest available patch version available for the *1.13*
series, you should upgrade to *1.13.7* as soon as you are able to ensure your cluster is fully patched and supported.

## Kubernetes version support policy

AKS supports four minor versions of Kubernetes:

* The current minor version that is released in AKS (N)
* Three previous minor versions. Each supported minor version also supports two stable patches.

This is known as "N-3" - (N (Latest release) - 3 (minor versions)).

For example, if AKS introduces *1.13.x* today, support is provided for the following versions:

New minor version    |    Supported Version List
-----------------    |    ----------------------
1.13.x               |    1.12.a, 1.12.b, 1.11.a, 1.11.b, 1.10.a, 1.10.b

Where "x" and ".a" and ".b" are representative patch versions.

For details on communications regarding version changes and expectations, see "Communications" below.

When a new minor version is introduced, the oldest minor version and patch releases supported are deprecated and
removed. For example if the current supported version list is:

Supported Version List
----------------------
1.12.a, 1.12.b, 1.11.a, 1.11.b, 1.10.a, 1.10.b, 1.9.a, 1.9.b

And AKS releases 1.13.x, this means that the 1.9.x versions (all 1.9 versions) will be removed and out of support.

> [!NOTE]
> Please note, that if customers are running an unsupported Kubernetes version, they will be asked to upgrade when
> requesting support for the cluster. Clusters running unsupported Kubernetes releases are not covered by the
> [AKS support policies](https://docs.microsoft.com/azure/aks/support-policies).


In addition to the above on minor versions, AKS supports the two latest *patch** releases of a given minor version. For
example, given the following supported versions:

Supported Version List
----------------------
1.12.1, 1.12.2, 1.11.4, 1.11.5

If upstream Kubernetes released 1.12.3 and 1.11.6 and AKS releases those patch versions, the oldest patch versions
are deprecated and removed, and the supported version list becomes:

Supported Version List
----------------------
1.12.*2*, 1.12.*3*, 1.11.*5*, 1.11.*6*

> [!NOTE]
> Customers should not pin cluster creation, CI or other automated jobs to specific patch releases. 

### Communications

* For new **minor** versions of Kubernetes
  * All users are notified publicly of the new version and what version will be removed.
  * When a new patch version is released, the oldest patch release is removed at the same time.
  * Customers have **60 days** from the public notification date to upgrade to a supported minor version release.
* For new **patch** versions of Kubernetes
  * All users are notified of the new patch version being released and to upgrade to the latest patch release.
  * Users have **30 days** to upgrade to a newer, supported patch release. Users have **30 days** to upgrade to
    a supported patch release before the oldest is removed.

AKS defines "released" as general availability, enabled in all SLO / Quality of Service measurements and
available in all regions.

> [!NOTE]
> Customers are notified of Kubernetes version releases and deprecations, when a minor version is
> deprecated/removed users are given 60 days to upgrade to a supported release. In the case of patch releases,
> customers are given 30 days to upgrade to a supported release.

Notifications are sent via:

* [AKS Release notes](https://aka.ms/aks/releasenotes)
* Azure portal Notifications
* [Azure update channel][azure-update-channel]

### Policy Exceptions

AKS reserves the right to add or remove new/existing versions that have been identified to have one or more critical
production impacting bugs or security issues without advance notice.

Specific patch releases may be skipped, or rollout accelerated depending on the severity of the bug or security issue.

### Azure portal and CLI default versions

When you deploy an AKS cluster in the portal or with the Azure CLI, the cluster is always set to the N-1 minor version
and latest patch. For example, if AKS supports *1.13.x*, *1.12.a* + *1.12.b*, *1.11.a* + *1.11.b*, *1.10.a* + *1.10b*,
the default version for new clusters is *1.12.b*.

AKS defaults to N-1 (minor.latestPatch, eg 1.12.b) to provide customers a known, stable and patched version by default.

## List currently supported versions

To find out what versions are currently available for your subscription and region, use the
[az aks get-versions][az-aks-get-versions] command. The following example lists the available Kubernetes versions for
the *EastUS* region:

```azurecli-interactive
az aks get-versions --location eastus --output table
```

The output is similar to the following example, which shows that Kubernetes version *1.13.5* is the most recent version
available:

```
KubernetesVersion    Upgrades
-------------------  ------------------------
1.13.5               None available
1.12.7               1.13.5
1.12.6               1.12.7, 1.13.5
1.11.9               1.12.6, 1.12.7
1.11.8               1.11.9, 1.12.6, 1.12.7
1.10.13              1.11.8, 1.11.9
1.10.12              1.10.13, 1.11.8, 1.11.9
```

## FAQ

**What happens when a customer upgrades a Kubernetes cluster with a minor version that is not supported?**

If you are on the *n-4* version, you are outside of support and will be asked to upgrade. If your upgrade from version
n-4 to n-3 succeeds, you are now within our support policies. For example:

- If the supported AKS versions are *1.13.x*, *1.12.a* + *1.12.b*, *1.11.c* + *1.11d*, and *1.10.e* + *1.10f* and you
  are on *1.9.g* or *1.9.h*, you are outside of support.
- If the upgrade from *1.9.g* or *1.9.h* to *1.10.e* or *1.10.f* succeeds, you are back in the within our support policies.

Upgrades to versions older than *n-4* are not supported. In such cases, we recommend customers create new AKS clusters
and redeploy their workloads.

**What does 'Out of Support' mean**

'Outside of Support' means that the version you are running is outside of the supported versions list, and you will be
asked to upgrade the cluster to a supported version when requesting support. Additionally, AKS does not make any
runtime or other guarantees for clusters outside of the supported versions list.

**What happens when a customer scales a Kubernetes cluster with a minor version that is not supported?**

For minor versions not supported by AKS, scaling in or out continues to work without any issues.

**Can a customer stay on a Kubernetes version forever?**

Yes. However, if the cluster is not on one of the versions supported by AKS, the cluster is out of the AKS support
policies. Azure does not automatically upgrade your cluster or delete it.

**What version does the master support if the agent cluster is not in one of the supported AKS versions?**

The master is automatically updated to the latest supported version.

## Next steps

For information on how to upgrade your cluster, see [Upgrade an Azure Kubernetes Service (AKS) cluster][aks-upgrade].

<!-- LINKS - External -->
[aks-engine]: https://github.com/Azure/aks-engine
[azure-update-channel]: https://azure.microsoft.com/updates/?product=kubernetes-service

<!-- LINKS - Internal -->
[aks-upgrade]: upgrade-cluster.md
[az-aks-get-versions]: /cli/azure/aks#az-aks-get-versions
