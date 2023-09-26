---
title: Long Term Support Azure Kubernetes Service (AKS)
description: Learn about Azure Kubernetes Service (AKS) Long Term Support for Kubernetes
ms.topic: article
ms.date: 08/16/2023
ms.author: juda
#Customer intent: As a cluster operator or developer, I want to understand how Long Term Support for Kubernetes on AKS works.
---

# Long Term Support
The Kubernetes community releases a new minor version approximately every four months, with a support window for each version for one year.  This support in terms of AKS is called "Community Support".

AKS supports versions of Kubernetes that are within this Community Support window, to push bug fixes and security updates from community releases.

While innovation delivered with this release cadence provides huge benefits for our customers, it's challenging to keep up to date Kubernetes releases. This is further compounded by the amount of AKS clusters you have to maintain.  


## AKS support types
Once a Kubernetes version is out of Community Support, bug fixes and security updates won't be made available. This leaves unsupported Kubernetes clusters at-risk. The AKS team maintains a version of Kubernetes for a period of two years and work with the upstream LTS (Long Term Support) working group to define LTS for upstream Kubernetes. 

:::image type="content" source="./media/supported-kubernetes-versions/kubernetes-versions-gantt.png" alt-text="Gantt chart showing the lifecycle of all Kubernetes versions currently active in AKS." lightbox="./media/supported-kubernetes-versions/kubernetes-versions-gantt.png":::

AKS provides one year Community Support and one year of Long Term Support (LTS) to back port security fixes from the community upstream in our public repository. Our upstream LTS work group will contribute efforts back to the community to provide our customers with a longer support window.

LTS intends to give you an extended period of time to plan and test for upgrades over a two-year period from the General Availability of the Kubernetes version.

|   | Community Support  |Long Term Support   |
|---|---|---|
| **When to use** | When you can keep up with upstream Kubernetes releases | When you need control over when to migrate from one version to another  |
|  **Support versions** | Three GA minor versions | One Kubernetes version (currently *1.27*) for two years  |
|  **Pricing** | Included  |  Per hour cluster cost |


## Enabling Long Term Support

We will be maintaining a single version of Kubernetes as LTS at any one time, and this is currently version 1.27.  There is a running cost associated with enabling LTS of $0.60 per hour and is enabled as part of the Premium tier of AKS.

> [!NOTE]
> Whilst it is possible to enable LTS when the cluster is in Community Support, you will still be charged when you enable the Premium tier.

### Creating a cluster with LTS enabled
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

## Long Term Support and Addons
Whilst the AKS team will be maintaining the Kubernetes 1.27 code base when it leaves community support, we rely on Open Source projects for the managed add-ons we provide to customers.  Due to various factors, there are some addons that will not be possible to support due to the fact those projects only support Kubernetes versions within upstream community support windows.

As the list of managed add-ons is quite large, we will list the addons that are not supported and the reason why.

|  Add On  | Reason it is unsupported |
---|---|
| Istio |  The Istio support cycle is very short (6 months), and there will not be maintenance releases for k8s 1.27 |
 | Keda | Unable to guarantee future version compatibility with k8s 1.27 |
| Calico  |  Will require Calico Enterprise agreement past community support |
| Cillium  |  Will require Cillium Enterprise agreement past community support |

> [!NOTE]
> Only Generally Available addons (i.e. not Preview or announced as deprecated) will be supported outside of this list.


You will not be able to move a cluster to Long Term support if any of these add-ons are enabled in your cluster.  

Whilst these AKS managed add-ons will not be supported by Microsoft, you will be able to install the Open Source versions of these on your cluster if you wish to use it past Community Support.


## Migrating from LTS 
LTS is meant to extend the support window for customers who need more time to plan their migration to newer Kubernetes releases.  We plan to support a version of Kubernetes for 2 years from General Availability on AKS, and will then mark a later version of Kubernetes as LTS based on:

* Has the previous version had a 2 year support window
* Is there time for customers to migrate from the prior LTS version to the current

The AKS release notes will inform you when we know the two points above are true to plan your migration.

### Migrating from LTS to Community support
Using LTS is a way to extend your planning to upgrade Kubernetes versions. It is likely you will want to migrate to a version of Kubernetes that is within the standard support window, something we call N-2 on AKS.  N being the latest Kubernetes.  

To move from an LTS enabled cluster to a versionof Kubernetes that is within N-2, you first need to disable LTS on the cluster:

```
az aks update --resource-group myResourceGroup --name myAKSCluster --tier [free|standard] --k8s-support KubernetesCommunitySupport
```

And then upgrade the cluster to a later version:

```
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.28.3
```
> [!NOTE]
> Kubernetes 1.28.3 is used as an example here, please check for available releases in the portal or using the get-version parameter in the azure CLI.
There will be approximately 2 years between one LTS version and the next, in lieu of upstream support for migrating more than 2 minor versions as well as the high likelihood your application may be reliant on Kubernetes APIs that may have been deprecated in the new LTS version we recommend you thorougly test your application on the target LTS Kubernetes version and carry out a blue/green deployment from one version to another.

### Migrating from LTS to the next LTS release
The upstream Kubernetes community supports a 2 minor version upgrade path.  This will migrate the objects in your Kubernetes cluster as part of the upgrade process, and provides a tested, and accredited migration path.

There will be approximately 2 years between one LTS version and the next. In the absence of upstream support for migrating more than 2 minor versions, as well as the high likelihood your application may be reliant on Kubernetes APIs that may have been deprecated in the new LTS version, we recommend you thoroughly test your application on the target LTS Kubernetes version and carry out a blue/green deployment from one version to another.


With that taken into account, for customers that wish to carry out an in-place migration, the AKS service will attempt to migrate your control plane from the previous LTS version to the latest, and will then migrate your data plane.

To carry out an in-place upgrade to the latest LTS version, you will need to specify an LTS enabled Kubernetes version as the upgrade target.

```
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.30.2
```

> [!NOTE]
> Kubernetes 1.30.2 is used as an example here, please check for available releases in the portal or using the get-version parameter in the azure CLI.



[add-ons]: integrations.md#add-ons