---
title: Long Term Support Azure Kubernetes Service (AKS)
description: Learn about Azure Kubernetes Service (AKS) Long Term Support for Kubernetes
ms.topic: article
ms.date: 08/16/2023
ms.author: juda
#Customer intent: As a cluster operator or developer, I want to understand how Long Term Support for Kubernetes on AKS works.
---

# Long Term Support
The Kubernetes community releases a new minor version approximately every four months, with a support window for each version for one year.  This support in terms of AKS is called "Community Support."

AKS supports versions of Kubernetes that are within this Community Support window, to push bug fixes and security updates from community releases.

While innovation delivered with this release cadence provides huge benefits for our customers, it's challenging to keep up to date Kubernetes releases. This is further compounded by the amount of AKS clusters you have to maintain.  


## AKS support types
Once a Kubernetes version is out of Community Support (approximately one year), bug fixes and security updates aren't made available, leaving unsupported Kubernetes clusters at-risk.  

AKS provides one year Community Support and one year of Long Term Support (LTS) to back port security fixes from the community upstream in our public repository. Our upstream LTS working group contributes efforts back to the community to provide our customers with a longer support window.

LTS intends to give you an extended period of time to plan and test for upgrades over a two-year period from the General Availability of the Kubernetes version.

|   | Community Support  |Long Term Support   |
|---|---|---|
| **When to use** | When you can keep up with upstream Kubernetes releases | When you need control over when to migrate from one version to another  |
|  **Support versions** | Three GA minor versions | One Kubernetes version (currently *1.27*) for two years  |
|  **Pricing** | Included  |  Per hour cluster cost |


## Enabling Long Term Support

LTS is enabled on one version of Kubernetes, currently version 1.27.  There is a running cost associated with enabling LTS of $0.60 per hour and is enabled as part of the Premium tier of AKS.

> [!NOTE]
> While it's possible to enable LTS when the cluster is in Community Support, you'll be charged once you enable the Premium tier.

### Create a cluster with LTS enabled
```
az aks create --resource-group myResourceGroup --name myAKSCluster --tier premium --k8s-support-plan AKSLongTermSupport --kubernetes-version 1.27
```

> [!NOTE]
> Enabling and disabling LTS is a combination of moving your cluster to the Premium tier, as well as enabling Long Term Support.  Both must either be turned on or off.

### Enable LTS on an existing cluster
```
az aks update --resource-group myResourceGroup --name myAKSCluster --tier premium --k8s-support-plan AKSLongTermSupport
```

### Disable LTS on an existing cluster
```
az aks update --resource-group myResourceGroup --name myAKSCluster --tier [free|standard] --k8s-support-plan KubernetesOfficial
```

## Long Term Support, Addons and Features
The AKS team currently tracks add-on versions where Kubernetes community support exists. Once a version leaves leaves Community Support, we rely on Open Source projects for managed add-ons to continue that support. Due to various external factors, some add-ons and features may not support Kubernetes versions outside these upstream Community Support windows.

As the list of managed add-ons is large, we list the addons / features that aren't supported and the reason why.

|  Add On / Feature | Reason it is unsupported |
---|---|
| Istio |  The Istio support cycle is short (six months), and there will not be maintenance releases for Kubernetes 1.27 |
| Keda | Unable to guarantee future version compatibility with Kubernetes 1.27 |
| Calico  |  Requires Calico Enterprise agreement past Community Support |
| Cillium  |  Requires Cillium Enterprise agreement past Community Support |
| Azure Linux | Support timeframe for Azure Linux 2 ends during this LTS cycle |
| Key Management Service (KMS) | KMSv2 replaces KMS during this LTS cycle |
| Dapr | AKS extensions are not supported |
| Application Gateway Ingress Controller | Migration to App Gateway for Containers will happen during LTS period |
| Open Service Mesh | OSM will be deprecated|
| AAD Pod Identity  | Deprecated in place of Workload Identity |


> [!NOTE]

You can't move a cluster to Long Term support if any of these add-ons / features are enabled in your cluster.  

Whilst these AKS managed add-ons aren't supported by Microsoft, you're able to install the Open Source versions of these on your cluster if you wish to use it past Community Support.

## How we decide the next LTS version
Versions of Kubernetes LTS are available for two years from General Availability, we'll mark a later version of Kubernetes as LTS based on the following criteria:
* Sufficient time for customers to migrate from the prior LTS version to the current has passed
* The previous version has had a two year support window

Read the AKS release notes to stay informed of when you're able to plan your migration.

### Migrating from LTS to Community support
Using LTS is a way to extend your planning to upgrade Kubernetes versions. You may want to migrate to a version of Kubernetes that is within the standard support window, something we call N-2 on AKS.  N being the latest Kubernetes.  

To move from an LTS enabled cluster to a version of Kubernetes that is within N-2, you first need to disable LTS on the cluster:

```
az aks update --resource-group myResourceGroup --name myAKSCluster --tier [free|standard] --k8s-support KubernetesCommunitySupport
```

And then upgrade the cluster to a later supported version:

```
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.28.3
```
> [!NOTE]
> Kubernetes 1.28.3 is used as an example here, please check for available releases in the portal or using the get-version parameter in the azure CLI.

There are approximately two years between one LTS version and the next.  In lieu of upstream support for migrating more than two minor versions, there's a high likelihood your application depends on Kubernetes APIs that have been deprecated.  We recommend you thoroughly test your application on the target LTS Kubernetes version and carry out a blue/green deployment from one version to another.

### Migrating from LTS to the next LTS release
The upstream Kubernetes community supports a two minor version upgrade path.  The process migrates the objects in your Kubernetes cluster as part of the upgrade process, and provides a tested, and accredited migration path.

For customers that wish to carry out an in-place migration, the AKS service will migrate your control plane from the previous LTS version to the latest, and then migrate your data plane.

To carry out an in-place upgrade to the latest LTS version, you need to specify an LTS enabled Kubernetes version as the upgrade target.

```
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.30.2
```

> [!NOTE]
> Kubernetes 1.30.2 is used as an example here, please check for available releases in the portal or using the get-version parameter in the azure CLI.

