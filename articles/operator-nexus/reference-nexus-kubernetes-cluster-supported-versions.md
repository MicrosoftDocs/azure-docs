---
title: Supported Kubernetes versions in Azure Operator Nexus Kubernetes service
description: Learn the Kubernetes version support policy and lifecycle of clusters in Azure Operator Nexus Kubernetes service
ms.topic: article
ms.date: 10/04/2023
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
---

# Supported Kubernetes versions in Azure Operator Nexus Kubernetes service

This document provides an overview of the versioning schema used for the Operator Nexus Kubernetes service, including the supported Kubernetes versions. It explains the differences between major, minor, and patch versions, and provides guidance on upgrading Kubernetes versions, and what the upgrade experience is like. The document also covers the version support lifecycle and end of life (EOL) for each minor version of Kubernetes.

The Kubernetes community releases minor versions roughly every three months. Starting with version 1.19, the Kubernetes community has [increased the support window for each version from nine months to one year](https://kubernetes.io/blog/2020/08/31/kubernetes-1-19-feature-one-year-support/).

Minor version releases include new features and improvements. Patch releases are more frequent (sometimes weekly) and are intended for critical bug fixes within a minor version. Patch releases include fixes for security vulnerabilities or major bugs.

## Kubernetes versions

Kubernetes uses the standard [Semantic Versioning](https://semver.org/) versioning scheme for each version:

```bash
[major].[minor].[patch]

Examples:
  1.24.7
  1.25.4
```

Each number in the version indicates general compatibility with the previous version:

* **Major version numbers** change when breaking changes to the API may be introduced
* **Minor version numbers** change when functionality updates are made that are backwards compatible to the other minor releases.
* **Patch version numbers** change when backwards-compatible bug fixes are made.

We strongly recommend staying up to date with the latest available patches. For example, if your production cluster is on **`1.25.4`**, and **`1.25.6`** is the latest available patch version available for the *1.25* series. You should upgrade to **`1.25.6`** as soon as possible to ensure your cluster is fully patched and supported. Further details on upgrading your cluster can be found in the [Upgrading Kubernetes versions](./howto-upgrade-nexus-kubernetes-cluster.md) documentation.

## Nexus Kubernetes release calendar

View the upcoming version releases on the Nexus Kubernetes release calendar.

> [!NOTE]
> Read more about [our support policy for Kubernetes versioning](#kubernetes-version-support-policy).

For the past release history, see [Kubernetes history](https://github.com/kubernetes/kubernetes/releases).

|  K8s version | Nexus GA  | End of life                    | Extended Availability |
|--------------|-----------|--------------------------------|-----------------------|
| 1.25         | Jun 2023  | Dec 2023                       | Until 1.31 GA         |
| 1.26         | Sep 2023  | Mar 2024                       | Until 1.32 GA         |
| 1.27*        | Sep 2023  | Jul 2024, LTS until Jul 2025   | Until 1.33 GA         |
| 1.28         | Nov 2023  | Oct 2024                       | Until 1.34 GA         |


*\* Indicates the version is designated for Long Term Support*

## Nexus Kubernetes service version components

An Operator Nexus Kubernetes service version is made of two discrete components that are combined into a single representation:

* The Kubernetes version. For example, 1.25.4, is the version of Kubernetes that you deploy in Operator Nexus. These packages are supplied by Azure AKS, including all patch versions that Operator Nexus supports. For more information on Azure AKS versions, see [AKS Supported Kubernetes Versions](../aks/supported-kubernetes-versions.md)
* The [Version Bundle](#version-bundles), which encapsulates the features (add-ons) and the operating system image used by nodes in the Operator Nexus Kubernetes cluster, as a single number. For example, 2.
The combination of these values is represented in the API as the single kubernetesVersion. For example, `1.25.4-2` or the alternatively supported “v” notation: `v1.25.4-2`.

### Version bundles

By extending the version of Kubernetes to include a secondary value for the patch version, the version bundle, Operator Nexus Kubernetes service can account for cases where the deployment is modified to include extra Operating System related updates. Such updates may include but aren't limited to: updated operating system images, patch releases for features (add-ons) and so on. Version bundles are always backward compatible with prior version bundles within the same patch version, for example, 1.25.4-2 is backwards compatible with 1.25.4-1.

Changes to the configuration of a deployed Operator Nexus Kubernetes cluster should only be applied within a Kubernetes minor version upgrade, not during a patch version upgrade. Examples of configuration changes that could be applied during the minor version upgrade include:

* Changing the configuration of the kube-proxy from using the iptables to ipvs
* Changing the CNI from one product to another

When we follow these principles, it becomes easier to predict and manage the process of moving between different versions of Kubernetes clusters offered by the Operator Nexus Kubernetes service.

We can easily upgrade from any small update in one Kubernetes version to any small update in the next version, giving you flexibility. For example, an upgrade from 1.24.1-x to 1.25.4-x would be allowed, regardless of the presence of an intermediate 1.24.2-x version.

### Components version and breaking changes

Note the following important changes to make before you upgrade to any of the available minor versions:

| Kubernetes Version | Version Bundle | Components      | OS components | Breaking Changes | Notes           |
|--------------------|----------------|-----------------|---------------|------------------|-----------------|
| 1.25.4             | 1              | Calico v3.24.0<br>metrics-server v0.6.3<br>Multus v3.8.0<br>CoreDNS v1.8.4<br>etcd v3.5.6-5   | Mariner 2.0 (2023-06-18) with cgroupv1 |                                           |                 |
| 1.25.4             | 2              | Calico v3.24.0<br>metrics-server v0.6.3<br>Multus v3.8.0<br>CoreDNS v1.8.4<br>etcd v3.5.6-5   | Mariner 2.0 (2023-06-18) with cgroupv1 |                                           |                 |
| 1.25.4             | 3              | Calico v3.24.0<br>metrics-server v0.6.3<br>Multus v3.8.0<br>CoreDNS v1.8.4<br>etcd v3.5.6-5   | Mariner 2.0 (2023-06-18) with cgroupv1 |                                           |                 |
| 1.25.4             | 4              | Calico v3.24.0<br>metrics-server v0.6.3<br>Multus v3.8.0<br>CoreDNS v1.8.4<br>etcd v3.5.6-5   | Mariner 2.0 (2023-06-18) with cgroupv1 |                                           |                 |
| 1.25.6             | 1              | Calico v3.24.0<br>metrics-server v0.6.3<br>Multus v3.8.0<br>CoreDNS v1.8.6<br>etcd v3.5.6-5   | Mariner 2.0 (2023-06-18) with cgroupv1 |                                           |                 |
| 1.26.3             | 1              | Calico v3.26.1<br>metrics-server v0.6.3<br>Multus v3.8.0<br>CoreDNS v1.8.6<br>etcd v3.5.6-5   | Mariner 2.0 (2023-06-18) with cgroupv1 |                                           |                 |
| 1.27.1             | 1              | Calico v3.26.1<br>metrics-server v0.6.3<br>Multus v3.8.0<br>CoreDNS v1.9.3<br>etcd v3.5.6-5   | Mariner 2.0 (2023-09-21) with *cgroupv2* |              cgroupv2                             |                 |

## Upgrading Kubernetes versions

For more information on upgrading your cluster, see [Upgrade an Azure Operator Nexus Kubernetes Service cluster](./howto-upgrade-nexus-kubernetes-cluster.md).

## Kubernetes version support policy

Operator Nexus supports three minor versions of Kubernetes:

* The latest GA minor version released in Operator Nexus (which we refer to as *N*).
* Two previous minor versions.
  * Each supported minor version also supports a maximum of two latest stable patches while the previous patches are under [extended availability policy](#extended-availability-policy) for the lifetime of the minor version.

Operator Nexus Kubernetes service provides a standardized duration of support for each minor version of Kubernetes that is released. Versions adhere to two different timelines, reflecting:

* Duration of support – How long is a version actively maintained. At the end of the supported period, the version is “End of life.”
* Extended availability – How long can a version be selected for deployment after "End of life."

The supported window of Kubernetes versions on Operator Nexus is known as "N-2": (N (Latest release) - 2 (minor versions)), and ".letter" is representative of patch versions.

For example, if Operator Nexus introduces *1.17.a* today, support is provided for the following versions:

New minor version    |    Supported Version List
-----------------    |    ----------------------
1.17.a               |    1.17.a, 1.17.b, 1.16.c, 1.16.d, 1.15.e, 1.15.f

When a new minor version is introduced, the oldest supported minor version and patch releases are out of support. For example, the current supported version list is:

```
1.17.a
1.17.b
1.16.c
1.16.d
1.15.e
1.15.f
```

When Operator Nexus releases 1.18.\*, all the 1.15.\* versions go out of support.

### Support timeline

Operator Nexus Kubernetes service provides support for 12 months from the initial AKS GA release of a minor version typically. This timeline follows the timing of Azure AKS, which includes a declared Long-Term Support version 1.27.

Supported versions:

* Can be deployed as new Operator Nexus Kubernetes clusters.
* Can be the target of upgrades from prior versions. Limited by normal upgrade paths.
* May have extra patches or Version Bundles within the minor version.

> [!NOTE]
> In exceptional circumstances, Nexus Kubernetes service support may be terminated early or immediately if a vulnerability or security concern is identified. Microsoft will proactively notified customers if this were to occur and work to mitigate any potential issues.

### End of life (EOL)

End of life (EOL) means no more patch or version bundles are produced. It's possible the cluster you've set up can't be upgraded anymore because the latest supported versions are no longer available. In this event, the only way to upgrade is to completely recreate the Nexus Kubernetes cluster using the newer version that is supported. Unsupported upgrades through `Extended availability` may be utilized to return to a supported version.

## Extended availability policy

During the extended availability period for unsupported Kubernetes versions (that is, EOL Kubernetes versions), users don't receive security patches or bug fixes. For detailed information on support categories, please refer to the following table.

| Support category                         | N-2 to N                | Extended availability            |
|------------------------------------------|-------------------------|----------------------------------|
| Upgrades from N-3 to a supported version | Supported               | Supported                        |
| Node pool scaling                        | Supported               | Supported                        |
| Cluster or node pool creation            | Supported               | Supported                        |
| Kubernetes components (including Add-ons)| Supported               | Not supported                    |
| Component updates                        | Supported               | Not supported                    |
| Component hotfixes                       | Supported               | Not supported                    |
| Applying Kubernetes bug fixes            | Supported               | Not supported                    |
| Applying security patches                | Supported               | Not supported                    |
| Node image security patches              | Supported               | Not supported                    |

> [!NOTE]
> Operator Nexus relies on the releases and patches from [kubernetes](https://kubernetes.io/releases/), which is an Open Source project that only supports a sliding window of three minor versions. Operator Nexus can only guarantee [full support](#kubernetes-version-support-policy) while those versions are being serviced upstream. Since there's no more patches being produced upstream, Operator Nexus can either leave those versions unpatched or fork. Due to this limitation, extended availability doesn't support anything from relying on kubernetes upstream.

## Supported `kubectl` versions

You can use one minor version older or newer of `kubectl` relative to your *kube-apiserver* version, consistent with the [Kubernetes support policy for kubectl](https://kubernetes.io/docs/setup/release/version-skew-policy/#kubectl).

For example, if your *kube-apiserver* is at *1.17*, then you can use versions *1.16* to *1.18* of `kubectl` with that *kube-apiserver*.

To install or update `kubectl` to the latest version, run:

### [Azure CLI](#tab/azure-cli)

```azurecli
az aks install-cli
```

### [Azure PowerShell](#tab/azure-powershell)

```powershell
Install-AzAksKubectl -Version latest
```

---

## Long Term Support (LTS)

Azure Kubernetes Service (AKS) provides a Long Term Support (LTS) version of Kubernetes for a two-year period. There's only a single minor version of Kubernetes deemed LTS at any one time.  

|   | Community Support  |Long Term Support   |
|---|---|---|
| **When to use** | When you can keep up with upstream Kubernetes releases | Scenarios where your applications aren't compatible with the changes introduced in newer Kubernetes versions, and you can't transition to a continuous release cycle due to technical constraints or other factors  |
|  **Support versions** | Three GA minor versions | One Kubernetes version (currently *1.27*) for two years  |

The upstream community maintains a minor release of Kubernetes for one year from release. After this period, Microsoft creates and applies security updates to the LTS version of Kubernetes to provide a total of two years of support on AKS.

> [!IMPORTANT]
> Kubernetes version 1.27 is the first supported LTS version of Kubernetes on Operator Nexus Kubernetes service.

## FAQ

### How does Microsoft notify me of new Kubernetes versions?

This document is updated periodically with planned dates of the new Kubernetes versions. 

### How often should I expect to upgrade Kubernetes versions to stay in support?

Starting with Kubernetes 1.19, the [open source community has expanded support to one year](https://kubernetes.io/blog/2020/08/31/kubernetes-1-19-feature-one-year-support/). Operator Nexus commits to enabling patches and support matching the upstream commitments. For Operator Nexus clusters on 1.19 and greater, you can upgrade at a minimum of once a year to stay on a supported version.

### What happens when you upgrade a Kubernetes cluster with a minor version that isn't supported?

If you're on the *N-3* version or older, you're outside of the support window. When you upgrade from version N-3 to N-2, you're back within our support window. For example:

* If the oldest supported AKS version is *1.25.x* and you're on *1.24.x* or older, you're outside of support.
* Successfully upgrading from *1.24.x* to *1.25.x* or higher brings you back within our support window.
* "Skip-level upgrades" aren't supported. In order to upgrade from *1.23.x* to *1.25.x*, you must upgrade first to *1.24.x* and then to *1.25.x*.

Downgrades aren't supported.

### What happens if I don't upgrade my cluster?

If you don't upgrade your cluster, you continue to receive support for the Kubernetes version you're running until the end of the support period. After that, you'll no longer receive support for your cluster. You need to upgrade your cluster to a supported version to continue receiving support.

### What happens if I don't upgrade my cluster before the end of the Extended availability period?

If you don't upgrade your cluster before the end of the Extended availability period, you'll no longer be able to upgrade your cluster to a supported version or scale-out agent pools. You need to recreate your cluster using a supported version to continue receiving support.

### What does 'Outside of Support' mean?

'Outside of Support' means that:

* The version you're running is outside of the supported versions list.
* You're asked to upgrade the cluster to a supported version when requesting support.

Additionally, Operator Nexus doesn't make any runtime or other guarantees for clusters outside of the supported versions list.

### What happens when a user scales a Kubernetes cluster with a minor version that isn't supported?

For minor versions not supported by Operator Nexus, scaling in or out should continue to work. Since there are no guarantees with quality of service, we recommend upgrading to bring your cluster back into support.

### Can I skip multiple Kubernetes versions during cluster upgrade?

When you upgrade a supported Operator Nexus Kubernetes cluster, Kubernetes minor versions can't be skipped. Kubernetes control planes [version skew policy](https://kubernetes.io/releases/version-skew-policy/) doesn't support minor version skipping. For example, upgrades between:

* *1.12.x* -> *1.13.x*: allowed.
* *1.13.x* -> *1.14.x*: allowed.
* *1.12.x* -> *1.14.x*: not allowed.

To upgrade from *1.12.x* -> *1.14.x*:

1. Upgrade from *1.12.x* -> *1.13.x*.
2. Upgrade from *1.13.x* -> *1.14.x*.

### Can I create a new cluster during its extended availability window?

Yes, you can create a new 1.xx.x cluster during its extended availability window. However, we recommend that you create a new cluster with the latest supported version.

### Can I upgrade a cluster to a newer version during its extended availability window?

Yes, you can upgrade an N-3 cluster to N-2 during its extended availability window. If your cluster is currently on N-4, you can make use of the extended availability to first upgrade from N-4 to N-3, and then proceed with the upgrade to a supported version (N-2).

### I'm on an extended availability window, can I still add new node pools? Or will I have to upgrade?

Yes, you're allowed to add node pools to the cluster.
