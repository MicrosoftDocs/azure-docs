---
title: Supported Kubernetes versions in Azure Kubernetes Service (AKS).
description: Learn the Kubernetes version support policy and lifecycle of clusters in Azure Kubernetes Service (AKS).
ms.topic: article
ms.date: 08/31/2023
author: nickomang
ms.author: nickoman
ms.custom: event-tier1-build-2022
---

# Supported Kubernetes versions in Azure Kubernetes Service (AKS)

The Kubernetes community releases minor versions roughly every three months. Recently, the Kubernetes community has [increased the support window for each version from nine months to one year](https://kubernetes.io/blog/2020/08/31/kubernetes-1-19-feature-one-year-support/), starting with version 1.19.

Minor version releases include new features and improvements. Patch releases are more frequent (sometimes weekly) and are intended for critical bug fixes within a minor version. Patch releases include fixes for security vulnerabilities or major bugs.

## Kubernetes versions

Kubernetes uses the standard [Semantic Versioning](https://semver.org/) versioning scheme for each version:

```
[major].[minor].[patch]

Examples:
  1.17.7
  1.17.8
```

Each number in the version indicates general compatibility with the previous version:

* **Major versions** change when incompatible API updates or backwards compatibility may be broken.
* **Minor versions** change when functionality updates are made that are backwards compatible to the other minor releases.
* **Patch versions** change when backwards-compatible bug fixes are made.

Aim to run the latest patch release of the minor version you're running. For example, if your production cluster is on **`1.17.7`**, **`1.17.8`** is the latest available patch version available for the *1.17* series. You should upgrade to **`1.17.8`** as soon as possible to ensure your cluster is fully patched and supported.

## AKS Kubernetes release calendar

View the upcoming version releases on the AKS Kubernetes release calendar. To see real-time updates of region release status and version release notes, visit the [AKS release status webpage][aks-release]. To learn more about the release status webpage, see [AKS release tracker][aks-tracker].

> [!NOTE]
> AKS follows 12 months of support for a generally available (GA) Kubernetes version. To read more about our support policy for Kubernetes versioning, please read our [FAQ](./supported-kubernetes-versions.md#faq).

For the past release history, see [Kubernetes history](https://github.com/kubernetes/kubernetes/releases).

|  K8s version | Upstream release  | AKS preview  | AKS GA  | End of life | Platform support |
|--------------|-------------------|--------------|---------|-------------|-----------------------|
| 1.24 | Apr 2022 | May 2022 | Jul 2022	| Jul 2023 | Until 1.28 GA |
| 1.25 | Aug 2022 | Oct 2022 | Dec 2022 | Jan 2, 2024 | Until 1.29 GA |
| 1.26 | Dec 2022 | Feb 2023 | Apr 2023 | Mar 2024 | Until 1.30 GA |
| 1.27* | Apr 2023 | Jun 2023 | Jul 2023 | Jul 2024, LTS until Jul 2025 | Until 1.31 GA |
| 1.28 | Aug 2023 | Sep 2023 | Oct 2023 || Until 1.32 GA|
| 1.29 | Dec 2023 | Jan 2024 | Feb 2024 | | Until 1.33 GA |

*\* Indicates the version is designated for Long Term Support*

### AKS Kubernetes release schedule Gantt chart

If you prefer to see this information visually, here's a Gantt chart with all the current releases displayed:

:::image type="content" source="./media/supported-kubernetes-versions/kubernetes-versions-gantt.png" alt-text="Gantt chart showing the lifecycle of all Kubernetes versions currently active in AKS." lightbox="./media/supported-kubernetes-versions/kubernetes-versions-gantt.png":::

## AKS Components Breaking Changes by Version

Note the following important changes to make before you upgrade to any of the available minor versions:

|Kubernetes Version | AKS Managed Addons  | AKS Components | OS components | Breaking Changes | Notes
|--------------|------------------------------------------|-------------------------------------------------------------------|---------------------------------------------------------------------------|----------------|---------------------------|
| 1.25 | Azure policy 1.0.1<br>Metrics-Server 0.6.3<br>KEDA 2.9.3<br>Open Service Mesh 1.2.3<br>Core DNS V1.9.4<br>0.12.0</br>Overlay VPA 0.11.0<br>Azure-Keyvault-SecretsProvider 1.4.1<br>Ingress AppGateway 1.2.1<br>Eraser v1.1.1<br>Azure Workload identity v1.0.0<br>ASC Defender 1.0.56<br>Azure Active Directory Pod Identity 1.8.13.6<br>GitOps 1.7.0<br>KMS 0.5.0| Cilium 1.12.8<br>CNI 1.4.44<br> Cluster Autoscaler 1.8.5.3<br> | OS Image Ubuntu 18.04 Cgroups V1 <br>ContainerD 1.7<br>| Ubuntu 22.04 by default with cgroupv2 and Overlay VPA 0.13.0  |CgroupsV2 - If you deploy Java applications with the JDK, prefer to use JDK 11.0.16 and later or JDK 15 and later, which fully support cgroup v2
| 1.26 | Azure policy 1.0.1<br>Metrics-Server 0.6.3<br>KEDA 2.9.3<br>Open Service Mesh 1.2.3<br>Core DNS V1.9.4<br>0.12.0</br>Overlay VPA 0.11.0<br>Azure-Keyvault-SecretsProvider 1.4.1<br>Ingress AppGateway 1.2.1<br>Eraser v1.1.1<br>Azure Workload identity v1.0.0<br>ASC Defender 1.0.56<br>Azure Active Directory Pod Identity 1.8.13.6<br>GitOps 1.7.0<br>KMS 0.5.0| Cilium 1.12.8<br>CNI 1.4.44<br> Cluster Autoscaler 1.8.5.3<br> | OS Image Ubuntu 22.04 Cgroups V2 <br>ContainerD 1.7<br>|No Breaking Changes  |None
| 1.27 | Azure policy 1.1.0<br>Metrics-Server 0.6.3<br>KEDA 2.10.0<br>Open Service Mesh 1.2.3<br>Core DNS V1.9.4<br>0.12.0</br>Overlay VPA 0.11.0<br>Azure-Keyvault-SecretsProvider 1.4.1<br>Ingress AppGateway 1.2.1<br>Eraser v1.1.1<br>Azure Workload identity v1.0.0<br>ASC Defender 1.0.56<br>Azure Active Directory Pod Identity 1.8.13.6<br>GitOps 1.7.0<br>KMS 0.5.0|Cilium 1.12.8<br>CNI 1.4.44<br> Cluster Autoscaler 1.8.5.3<br> | OS Image Ubuntu 22.04 Cgroups V2 <br>ContainerD 1.7 for Linux and 1.6 for Windows<br>|Keda 2.10.0  |Because of Ubuntu 22.04 FIPS certification status, we'll switch AKS FIPS nodes from 18.04 to 20.04 from 1.27 onwards.

## Alias minor version

> [!NOTE]
> Alias minor version requires Azure CLI version 2.37 or above as well as API version 20220401 or above. Use `az upgrade` to install the latest version of the CLI.

AKS allows you to create a cluster without specifying the exact patch version. When you create a cluster without designating a patch, the cluster runs the minor version's latest GA patch. For example, if you create a cluster with **`1.21`**, your cluster runs **`1.21.7`**, which is the latest GA patch version of *1.21*.

When you upgrade by alias minor version, only a higher minor version is supported. For example, upgrading from `1.14.x` to `1.14` doesn't trigger an upgrade to the latest GA `1.14` patch, but upgrading to `1.15` triggers an upgrade to the latest GA `1.15` patch.

To see what patch you're on, run the `az aks show --resource-group myResourceGroup --name myAKSCluster` command. The property `currentKubernetesVersion` shows the whole Kubernetes version.

```
{
 "apiServerAccessProfile": null,
  "autoScalerProfile": null,
  "autoUpgradeProfile": null,
  "azurePortalFqdn": "myaksclust-myresourcegroup.portal.hcp.eastus.azmk8s.io",
  "currentKubernetesVersion": "1.21.7",
}
```

## Kubernetes version support policy

AKS defines a generally available (GA) version as a version available in all regions and enabled in all SLO or SLA measurements. AKS supports three GA minor versions of Kubernetes:

* The latest GA minor version released in AKS (which we refer to as *N*).
* Two previous minor versions.
  * Each supported minor version also supports a maximum of two stable patches.

AKS may also support preview versions, which are explicitly labeled and subject to [preview terms and conditions][preview-terms].

AKS provides platform support only for one GA minor version of Kubernetes after the regular supported versions. The platform support window of Kubernetes versions on AKS is known as "N-3". For more information, see [platform support policy](#platform-support-policy).

> [!NOTE]
> AKS uses safe deployment practices which involve gradual region deployment. This means it may take up to 10 business days for a new release or a new version to be available in all regions.

The supported window of Kubernetes versions on AKS is known as "N-2": (N (Latest release) - 2 (minor versions)), and ".letter" is representative of patch versions.

For example, if AKS introduces *1.17.a* today, support is provided for the following versions:

New minor version    |    Supported Version List
-----------------    |    ----------------------
1.17.a               |    1.17.a, 1.17.b, 1.16.c, 1.16.d, 1.15.e, 1.15.f

When a new minor version is introduced, the oldest supported minor version and patch releases are deprecated and removed. For example, the current supported version list is:

```
1.17.a
1.17.b
1.16.c
1.16.d
1.15.e
1.15.f
```

When AKS releases 1.18.\*, all the 1.15.\* versions go out of support 30 days later.


AKS also supports a maximum of two **patch** releases of a given minor version. For example, given the following supported versions:

```
Current Supported Version List
------------------------------
1.17.8, 1.17.7, 1.16.10, 1.16.9
```

If AKS releases `1.17.9` and `1.16.11`, the oldest patch versions are deprecated and removed, and the supported version list becomes:

```
New Supported Version List
----------------------
1.17.*9*, 1.17.*8*, 1.16.*11*, 1.16.*10*
```

## Platform support policy

Platform support policy is a reduced support plan for certain unsupported kubernetes versions. During platform support, customers only receive support from Microsoft for AKS/Azure platform related issues. Any issues related to Kubernetes functionality and components aren't supported. 

Platform support policy applies to clusters in an n-3 version (where n is the latest supported AKS GA minor version), before the cluster drops to n-4. For example, kubernetes v1.25 is considered platform support when v1.28 is the latest GA version. However, during the v1.29 GA release, v1.25 will then auto-upgrade to v1.26. If you are a running an n-2 version, the moment it becomes n-3 it also becomes deprecated, and you enter into the platform support policy. 

AKS relies on the releases and patches from [kubernetes](https://kubernetes.io/releases/), which is an Open Source project that only supports a sliding window of three minor versions. AKS can only guarantee [full support](#kubernetes-version-support-policy) while those versions are being serviced upstream. Since there's no more patches being produced upstream, AKS can either leave those versions unpatched or fork. Due to this limitation, platform support doesn't support anything from relying on kubernetes upstream.

This table outlines support guidelines for Community Support compared to Platform support.

| Support category | Community Support (N-2) | Platform Support (N-3) | 
|---|---|---|
| Upgrades from N-3 to a supported version| Supported | Supported|
| Platform (Azure) availability | Supported | Supported|
| Node pool scaling| Supported | Supported|
| VM availability| Supported | Supported|
| Storage, Networking related issues| Supported | Supported except for bug fixes and retired components |
| Start/stop | Supported | Supported|
| Rotate certificates | Supported | Supported|
| Infrastructure SLA| Supported | Supported|
| Control Plane SLA| Supported | Supported|
| Platform (AKS) SLA| Supported | Not supported|
| Kubernetes components (including Add-ons) | Supported | Not supported|
| Component updates | Supported | Not supported|
| Component hotfixes | Supported | Not supported|
| Applying bug fixes | Supported | Not supported|
| Applying security patches | Supported | Not supported|
| Kubernetes API support | Supported | Not supported|
| Cluster or node pool creation| Supported | Not supported|
| Node pool snapshot| Supported | Not supported|
| Node image upgrade| Supported | Not supported|

 > [!NOTE]
  > The above table is subject to change and outlines common support scenarios. Any scenarios related to Kubernetes functionality and components aren't supported for N-3. For further support, see [Support and troubleshooting for AKS](./aks-support-help.md).

### Supported `kubectl` versions

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

AKS provides a Long Term Support (LTS) version of Kubernetes for a two-year period. There's only a single minor version of Kubernetes deemed LTS at any one time.  

|   | Community Support  |Long Term Support   |
|---|---|---|
| **When to use** | When you can keep up with upstream Kubernetes releases | When you need control over when to migrate from one version to another  |
|  **Support versions** | Three GA minor versions | One Kubernetes version (currently *1.27*) for two years  |
|  **Pricing** | Included  |  Per hour cluster cost |

The upstream community maintains a minor release of Kubernetes for one year from release. After this period, Microsoft creates and applies security updates to the LTS version of Kubernetes to provide a total of two years of support on AKS.

> [!IMPORTANT]
> Kubernetes version 1.27 will be the first supported LTS version of Kubernetes on AKS. It is not yet available.

## Release and deprecation process

You can reference upcoming version releases and deprecations on the [AKS Kubernetes release calendar](#aks-kubernetes-release-calendar).

For new **minor** versions of Kubernetes:

* AKS publishes an announcement with the planned date of a new version release and respective old version deprecation on the [AKS Release notes](https://aka.ms/aks/releasenotes) at least 30 days prior to removal.
* AKS uses [Azure Advisor](../advisor/advisor-overview.md) to alert you if a new version could cause issues in your cluster because of deprecated APIs. Azure Advisor also alerts you if you're out of support
* AKS publishes a [service health notification](../service-health/service-health-overview.md) available to all users with AKS and portal access and sends an email to the subscription administrators with the planned version removal dates.
  > [!NOTE]
  > To find out who is your subscription administrators or to change it, please refer to [manage Azure subscriptions](../cost-management-billing/manage/add-change-subscription-administrator.md#assign-a-subscription-administrator).
* You have **30 days** from version removal to upgrade to a supported minor version release to continue receiving support.

For new **patch** versions of Kubernetes:

* Because of the urgent nature of patch versions, they can be introduced into the service as they become available. Once available, patches have a two month minimum lifecycle.
* In general, AKS doesn't broadly communicate the release of new patch versions. However, AKS constantly monitors and validates available CVE patches to support them in AKS in a timely manner. If a critical patch is found or user action is required, AKS notifies you to upgrade to the newly available patch.
* You have **30 days** from a patch release's removal from AKS to upgrade into a supported patch and continue receiving support. However, you'll **no longer be able to create clusters or node pools once the version is deprecated/removed.**

### Supported versions policy exceptions

AKS reserves the right to add or remove new/existing versions with one or more critical production-impacting bugs or security issues without advance notice.

Specific patch releases may be skipped or rollout accelerated, depending on the severity of the bug or security issue.

## Azure portal and CLI versions

When you deploy an AKS cluster with Azure portal, Azure CLI, Azure PowerShell, the cluster defaults to the N-1 minor version and latest patch. For example, if AKS supports *1.17.a*, *1.17.b*, *1.16.c*, *1.16.d*, *1.15.e*, and *1.15.f*, the default version selected is *1.16.c*.

### [Azure CLI](#tab/azure-cli)

To find out what versions are currently available for your subscription and region, use the
[`az aks get-versions`][az-aks-get-versions] command. The following example lists the available Kubernetes versions for the *EastUS* region:

```azurecli-interactive
az aks get-versions --location eastus --output table
```

### [Azure PowerShell](#tab/azure-powershell)

To find out what versions are currently available for your subscription and region, use the
[Get-AzAksVersion][get-azaksversion] cmdlet. The following example lists available Kubernetes versions for the *EastUS* region:

```azurepowershell-interactive
Get-AzAksVersion -Location eastus
```

---

## FAQ

### How does Microsoft notify me of new Kubernetes versions?

The AKS team publishes announcements with planned dates of the new Kubernetes versions in our documentation, [GitHub](https://github.com/Azure/AKS/releases), and in emails to subscription administrators who own clusters that are going to fall out of support. AKS also uses [Azure Advisor](../advisor/advisor-overview.md) to alert you inside the Azure portal if you're out of support and inform you of deprecated APIs that can affect your application or development process.

### How often should I expect to upgrade Kubernetes versions to stay in support?

Starting with Kubernetes 1.19, the [open source community has expanded support to one year](https://kubernetes.io/blog/2020/08/31/kubernetes-1-19-feature-one-year-support/). AKS commits to enabling patches and support matching the upstream commitments. For AKS clusters on 1.19 and greater, you can upgrade at a minimum of once a year to stay on a supported version.

**What happens when you upgrade a Kubernetes cluster with a minor version that isn't supported?**

If you're on the *n-3* version or older, it means you're outside of support and will be asked to upgrade. When your upgrade from version n-3 to n-2 succeeds, you're back within our support policies. For example:

* If the oldest supported AKS version is *1.15.a* and you're on *1.14.b* or older, you're outside of support.
* When you successfully upgrade from *1.14.b* to *1.15.a* or higher, you're back within our support policies.

Downgrades aren't supported.

### What does 'Outside of Support' mean?

'Outside of Support' means that:

* The version you're running is outside of the supported versions list.
* You'll be asked to upgrade the cluster to a supported version when requesting support, unless you're within the 30-day grace period after version deprecation.

Additionally, AKS doesn't make any runtime or other guarantees for clusters outside of the supported versions list.

### What happens when a user scales a Kubernetes cluster with a minor version that isn't supported?

For minor versions not supported by AKS, scaling in or out should continue to work. Since there are no guarantees with quality of service, we recommend upgrading to bring your cluster back into support.

### Can a user stay on a Kubernetes version forever?

If a cluster has been out of support for more than three (3) minor versions and has been found to carry security risks, Azure proactively contacts you to upgrade your cluster. If you don't take further action, Azure reserves the right to automatically upgrade your cluster on your behalf.

### What version does the control plane support if the node pool isn't in one of the supported AKS versions?

The control plane must be within a window of versions from all node pools. For details on upgrading the control plane or node pools, visit documentation on [upgrading node pools](manage-node-pools.md#upgrade-a-cluster-control-plane-with-multiple-node-pools).

### Can I skip multiple AKS versions during cluster upgrade?

When you upgrade a supported AKS cluster, Kubernetes minor versions can't be skipped. Kubernetes control planes [version skew policy](https://kubernetes.io/releases/version-skew-policy/) doesn't support minor version skipping. For example, upgrades between:

* *1.12.x* -> *1.13.x*: allowed.
* *1.13.x* -> *1.14.x*: allowed.
* *1.12.x* -> *1.14.x*: not allowed.

To upgrade from *1.12.x* -> *1.14.x*:

1. Upgrade from *1.12.x* -> *1.13.x*.
2. Upgrade from *1.13.x* -> *1.14.x*.

Skipping multiple versions can only be done when upgrading from an unsupported version back into the minimum supported version. For example, you can upgrade from an unsupported *1.10.x* to a supported *1.15.x* if *1.15* is the minimum supported minor version.

When performing an upgrade from an _unsupported version_ that skips two or more minor versions, the upgrade is performed without any guarantee of functionality and is excluded from the service-level agreements and limited warranty. If your version is significantly out of date, we recommend that you re-create the cluster.

### Can I create a new 1.xx.x cluster during its 30 day support window?

No. Once a version is deprecated/removed, you can't create a cluster with that version. As the change rolls out, you'll start to see the old version removed from your version list. This process may take up to two weeks from announcement, progressively by region.

### I'm on a freshly deprecated version, can I still add new node pools? Or will I have to upgrade?

No. You aren't allowed to add node pools of the deprecated version to your cluster. You can add node pools of a new version, but it may require you to update the control plane first.

### How often do you update patches?

Patches have a two month minimum lifecycle. To keep up to date when new patches are released, follow the [AKS release notes](https://github.com/Azure/AKS/releases).

## Next steps

For information on how to upgrade your cluster, see [Upgrade an Azure Kubernetes Service (AKS) cluster][aks-upgrade].

<!-- LINKS - External -->
[azure-update-channel]: https://azure.microsoft.com/updates/?product=kubernetes-service
[aks-release]: https://releases.aks.azure.com/

<!-- LINKS - Internal -->
[aks-upgrade]: upgrade-cluster.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-aks-get-versions]: /cli/azure/aks#az_aks_get_versions
[preview-terms]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
[get-azaksversion]: /powershell/module/az.aks/get-azaksversion
[aks-tracker]: release-tracker.md
