---
title: Azure Red Hat OpenShift support lifecycle
description: Understand the support lifecycle and supported versions for Azure Red Hat OpenShift
author: joharder
ms.author: joharder
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 08/10/2023
---

# Support lifecycle for Azure Red Hat OpenShift 4

Red Hat releases minor versions of Red Hat OpenShift Container Platform (OCP) roughly every four months. These releases include new features and improvements. Patch releases are more frequent (typically weekly) and are only intended for critical bug fixes within a minor version. These patch releases may include fixes for security vulnerabilities or major bugs.

Azure Red Hat OpenShift is built from specific releases of OCP. This article covers the versions of OCP that are supported for Azure Red Hat OpenShift and details about upgrades, deprecations, and support policy.

## Red Hat OpenShift versions

Red Hat OpenShift Container Platform uses semantic versioning. Semantic versioning uses different levels of version numbers to specify different levels of versioning. The following table illustrates the different parts of a semantic version number, in this case using the example version number 4.10.3.

|Major version (x)|Minor version (y)|Patch (z)|
|-|-|-|
|4|10|3|

Each number in the version indicates general compatibility with the previous version:

* **Major version**: No major version releases are planned at this time. Major versions change when incompatible API changes or backwards compatibility may be broken.
* **Minor version**: Released approximately every four months. Minor version upgrades can include feature additions, enhancements, deprecations, removals, bug fixes, security enhancements, and other improvements.
* **Patches**: Typically released each week, or as needed. Patch version upgrades can include bug fixes, security enhancements, and other improvements.

Customers should aim to run the latest minor release of the major version they're running. For example, if your production cluster is on 4.9, and 4.10 is the latest generally available minor version for the 4 series, you should upgrade to 4.10 as soon as you can. 

### Upgrade channels

Upgrade channels are tied to a minor version of Red Hat OpenShift Container Platform (OCP). For instance, OCP 4.9 upgrade channels will never include an upgrade to a 4.10 release. Upgrade channels control only release selection and don't impact the version of the cluster.

Azure Red Hat OpenShift 4 supports stable channels only. For example: stable-4.9.

You can use the stable-4.10 channel to upgrade from a previous minor version of Azure Red Hat OpenShift. Clusters upgraded using fast, prerelease, and candidate channels won't be supported.

If you change to a channel that doesn't include your current release, an alert displays and no updates can be recommended. However, you can safely change back to your original channel at any point.

## Red Hat OpenShift Container Platform version support policy

Azure Red Hat OpenShift supports two generally available (GA) minor versions of Red Hat OpenShift Container Platform:
* The latest GA minor version that is released in Azure Red Hat OpenShift (which we'll refer to as N)
* One previous minor version (N-1)

If available in a stable upgrade channel, newer minor releases (N+1, N+2) available in upstream OCP are supported as well.

Critical patch updates are applied to clusters automatically by Azure Red Hat OpenShift Site Reliability Engineers (SRE). Customers that wish to install patch updates in advance are free to do so.

For example, if Azure Red Hat OpenShift introduces 4.10.z today, support is provided for the following versions:

|New minor version|Supported version list|
|-|-|
|4.10.z|4.10.z, 4.9.z|

> [!NOTE]
> The table above is just an example to illustrate lifecycle support; it is not meant as a list of currently supported versions.
> 
".z" is representative of patch versions. If available in a stable upgrade channel, customers may also upgrade to 4.9.z.

When a new minor version is introduced, the oldest minor version is deprecated and removed. For example, say the current supported version list is 4.10.z and 4.9.z. When Azure Red Hat OpenShift releases 4.11.z, the 4.9.z release will be removed and will be out of support within 30 days.

> [!NOTE]
> Please note that if customers are running an unsupported Red Hat OpenShift version, they may be asked to upgrade when requesting support for the cluster. Clusters running unsupported Red Hat OpenShift releases are not covered by the Azure Red Hat OpenShift SLA.

## Release and deprecation process

You can reference upcoming version releases and deprecations on the [Azure Red Hat OpenShift release calendar](#azure-red-hat-openshift-release-calendar).

For new minor versions of Red Hat OpenShift Container Platform:
* The Azure Red Hat OpenShift SRE team publishes a pre-announcement with the planned date of a new version release, and respective old version deprecation, in the [Azure Red Hat OpenShift Release notes](https://github.com/Azure/OpenShift/releases) at least 30 days prior to removal.
* The Azure Red Hat OpenShift SRE team publishes a service health notification available to all customers with Azure Red Hat OpenShift and portal access, and sends an email to the subscription administrators with the planned version removal dates.
* Customers have 30 days from version removal to upgrade to a supported minor version release to continue receiving support.

For new patch versions of Red Hat OpenShift Container Platform:
* Because of the urgent nature of patch versions, these can be introduced into the service by Azure Red Hat OpenShift SRE team as they become available.
* In general, the Azure Red Hat OpenShift SRE team doesn't perform broad communications for the installation of new patch versions. However, the team constantly monitors and validates available CVE patches to support them in a timely manner. If customer action is required, the team will notify customers about the upgrade.

## Supported versions policy exceptions

The Azure Red Hat OpenShift SRE team reserves the right to add or remove new/existing versions or delay upcoming minor release versions that has been identified to have one or more critical production impacting bugs or security issues without advance notice.

Specific patch releases may be skipped, or rollout may be accelerated depending on the severity of the bug or security issue.

## Azure portal and CLI versions

When you deploy an Azure Red Hat OpenShift cluster in the portal or with the Azure CLI, the cluster is defaulted to the latest (N) minor version and latest critical patch. For example, if Azure Red Hat OpenShift supports 4.10.z and 4.9.z, the default version for new installations is 4.10.z. Customers that wish to use the latest upstream OCP minor version (N+1, N+2) can upgrade their cluster at any time to any release available in the stable upgrade channels.

## Azure Red Hat OpenShift release calendar

See the following guide for the [past Red Hat OpenShift Container Platform (upstream) release history](https://access.redhat.com/support/policy/updates/openshift/#dates).

|OCP Version|Upstream Release|Azure Red Hat OpenShift General Availability|End of Life|
|-|-|-|-|
|4.4|May 2020|July 2020|4.6 GA|
|4.5|July 2020| November 2020|4.7 GA|
|4.6|October 2020| February 2021|4.8 GA|
|4.7|February 2021| July 15 2021|4.9 GA|
|4.8|July 2021| Sept 15 2021|4.10 GA|
|4.9|November 2021| February 1 2022|4.11 GA|
|4.10|March 2022| June 21 2022|4.12 GA|
|4.11|August 2022| March 2 2023|4.13 GA|
|4.12|January 2023| August 19 2023|October 19 2024|

> [!IMPORTANT]
> Starting with ARO version 4.12, the support lifecycle for new versions will be set to 14 months from the day of general availability. That means that the end date for support of each version will no longer be dependent on the previous version (as shown in the table above for version 4.12.) This does not affect support for the previous version; two generally available (GA) minor versions of Red Hat OpenShift Container Platform will continue to be supported, as [explained previously](#red-hat-openshift-container-platform-version-support-policy).
> 
## FAQ

**What happens when a user upgrades an OpenShift cluster with a minor version that is not supported?**

Azure Red Hat OpenShift supports installing two minor versions at install time. A version is supported as soon as an upgrade path to that version is available. If you are running a version past the EOL date above, you are outside of support and will be asked to upgrade to continue receiving support. Upgrading from an older version to a supported version can be challenging, and in some cases not possible. We recommend you keep your cluster on the latest OpenShift version to avoid potential upgrade issues.

<!--If you're on the N-2 version or older, it means you are outside of support and will be asked to upgrade to continue receiving support. When your upgrade from version N-2 to N-1 succeeds, you're back within support. Upgrading from version N-3 version or older to a supported version can be challenging, and in some cases not possible. We recommend you keep your cluster on the latest OpenShift version to avoid potential upgrade issues.-->

For example:
* If the oldest supported Azure Red Hat OpenShift version is 4.9.z and you are on 4.8.z or older, you are outside of support.
* When the upgrade from 4.8.z to 4.9.z or higher succeeds, you're back within our support policies. 

Reverting your cluster to a previous version, or a rollback, isn't supported. Only upgrading to a newer version is supported.

**What does "Outside of Support" mean?**

If your ARO cluster is running an OpenShift version that isn't on the supported versions list, or is using an [unsupported cluster configuration](./support-policies-v4.md), your cluster is "outside of support". As a result:
- When opening a support ticket for your cluster, you'll be asked to upgrade the cluster to a supported version before receiving support, unless you are within the 30-day grace period after version support ends. 
- Any runtime or SLA guarantees for clusters outside of support are voided.
- Clusters outside of support will be patched only on a best effort basis.
- Clusters outside of support won't be monitored.
