---
title: Long-term support for Azure Kubernetes Service (AKS) versions
description: Learn about Azure Kubernetes Service (AKS) long-term support for Kubernetes
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 01/24/2024
ms.author: juda
author: justindavies
#Customer intent: As a cluster operator or developer, I want to understand how long-term support for Kubernetes on AKS works.
---

# Long-term support for Azure Kubernetes Service (AKS) versions

The Kubernetes community releases a new minor version approximately every four months, with a support window for each version for one year. In Azure Kubernetes Service (AKS), this support window is called "Community support."

AKS supports versions of Kubernetes that are within this Community support window, to push bug fixes and security updates from community releases.

While innovation delivered with this release cadence provides huge benefits to you, it challenges you to keep up to date with Kubernetes releases, which can be made more difficult based on the number of AKS clusters you have to maintain.  

## AKS support types

After approximately one year, the Kubernetes version exits Community support and your AKS clusters are now at risk as bug fixes and security updates become unavailable.  

AKS provides one year Community support and one year of long-term support (LTS) to back port security fixes from the community upstream in our public repository. Our upstream LTS working group contributes efforts back to the community to provide our customers with a longer support window.

LTS intends to give you an extended period of time to plan and test for upgrades over a two-year period from the General Availability of the designated Kubernetes version.  

|   | Community support  |Long-term support   |
|---|---|---|
| **When to use** | When you can keep up with upstream Kubernetes releases | When you need control over when to migrate from one version to another  |
|  **Support versions** | Three GA minor versions | One Kubernetes version (currently *1.27*) for two years  |

## Enable long-term support

Enabling and disabling long-term support is a combination of moving your cluster to the Premium tier and explicitly selecting the LTS support plan.

> [!NOTE]
> While it's possible to enable LTS when the cluster is in Community support, you'll be charged once you enable the Premium tier.

### Create a cluster with LTS enabled

```azurecli
az aks create --resource-group myResourceGroup --name myAKSCluster --tier premium --k8s-support-plan AKSLongTermSupport --kubernetes-version 1.27
```

> [!NOTE]
> Enabling and disabling LTS is a combination of moving your cluster to the Premium tier, as well as enabling long-term support.  Both must either be turned on or off.

### Enable LTS on an existing cluster

```azurecli
az aks update --resource-group myResourceGroup --name myAKSCluster --tier premium --k8s-support-plan AKSLongTermSupport
```

### Disable LTS on an existing cluster

```azurecli
az aks update --resource-group myResourceGroup --name myAKSCluster --tier [free|standard] --k8s-support-plan KubernetesOfficial
```

## Long term support, add-ons and features

The AKS team currently tracks add-on versions where Kubernetes Community support exists. Once a version leaves Community support, we rely on open source projects for managed add-ons to continue that support. Due to various external factors, some add-ons and features may not support Kubernetes versions outside these upstream Community support windows.

See the following table for a list of add-ons and features that aren't supported and the reason why.  

|  Add-on / Feature | Reason it's unsupported |
---|---|
| Istio |  The Istio support cycle is short (six months), and there will not be maintenance releases for Kubernetes 1.27 |
| Keda | Unable to guarantee future version compatibility with Kubernetes 1.27 |
| Calico  |  Requires Calico Enterprise agreement past Community support |
| Cillium  |  Requires Cillium Enterprise agreement past Community support |
| Key Management Service (KMS) | KMSv2 replaces KMS during this LTS cycle |
| Dapr | AKS extensions are not supported |
| Application Gateway Ingress Controller | Migration to App Gateway for Containers happens during LTS period |
| Open Service Mesh | OSM will be deprecated|
| AAD Pod Identity  | Deprecated in place of Workload Identity |

> [!NOTE]
>You can't move your cluster to long-term support if any of these add-ons or features are enabled.  
>Whilst these AKS managed add-ons aren't supported by Microsoft, you're able to install the Open Source versions of these on your cluster if you wish to use it past Community support.

## How we decide the next LTS version

Versions of Kubernetes LTS are available for two years from General Availability, we mark a later version of Kubernetes as LTS based on the following criteria:

* Sufficient time for customers to migrate from the prior LTS version to the current have passed
* The previous version has had a two year support window

Read the AKS release notes to stay informed of when you're able to plan your migration.

### Migrate from LTS to Community support

Using LTS is a way to extend your window to plan a Kubernetes version upgrade. You may want to migrate to a version of Kubernetes that is within the [standard support window](supported-kubernetes-versions.md#kubernetes-version-support-policy).

To move from an LTS enabled cluster to a version of Kubernetes that is within the standard support window, you need to disable LTS on the cluster:

```azurecli
az aks update --resource-group myResourceGroup --name myAKSCluster --tier [free|standard] --k8s-support-plan KubernetesOfficial
```

And then upgrade the cluster to a later supported version:

```azurecli
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.28.3
```

> [!NOTE]
> Kubernetes 1.28.3 is used as an example here, please check the [AKS release tracker](release-tracker.md) for available Kubernetes releases.

There are approximately two years between one LTS version and the next.  In lieu of upstream support for migrating more than two minor versions, there's a high likelihood your application depends on Kubernetes APIs that have been deprecated.  We recommend you thoroughly test your application on the target LTS Kubernetes version and carry out a blue/green deployment from one version to another.

### Migrate from LTS to the next LTS release

The upstream Kubernetes community supports a two-minor-version upgrade path. The process migrates the objects in your Kubernetes cluster as part of the upgrade process, and provides a tested, and accredited migration path.

For customers that wish to carry out an in-place migration, the AKS service will migrate your control plane from the previous LTS version to the latest, and then migrate your data plane.

To carry out an in-place upgrade to the latest LTS version, you need to specify an LTS enabled Kubernetes version as the upgrade target.

```azurecli
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.32.2
```
> [!NOTE]
>If you use any programming/scripting logic to list and select a minor version of Kubernetes before creating clusters with the `ListKubernetesVersions` API, note that starting from Kubernetes v1.27, the API returns `SupportPlan` as `[KubernetesOfficial, AKSLongTermSupport]`. Please ensure you update any logic to exclude `AKSLongTermSupport` versions to avoid any breaks and choose `KubernetesOfficial` support plan versions.  Otherwise, if LTS is indeed your path forward please first opt-into the Premium tier and the `AKSLongTermSupport` support plan versions from the `ListKubernetesVersions` API before creating clusters.

> [!NOTE]
> The next Long Term Support Version after 1.27 is to be determined. However Customers will get a minimum 6 months of overlap between 1.27 LTS and the next LTS version to plan upgrades.  
> Kubernetes 1.32.2 is used as an example version in this article. Check the [AKS release tracker](release-tracker.md) for available Kubernetes releases.

