---
title: Azure Red Hat OpenShift support lifecycle
description: Understand the support lifecycle and supported versions for Azure Red Hat OpenShift
author: joharder
ms.author: joharder
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 07/17/2024
---

# Support lifecycle for Azure Red Hat OpenShift 4

Red Hat releases minor versions of Red Hat OpenShift Container Platform (OCP) approximately every four months. These releases include new features and improvements. Patch releases are more frequent (typically weekly) and may include fixes for security vulnerabilities or bugs.

Azure Red Hat OpenShift is built from specific releases of OCP. This article covers the versions of OCP that are supported for Azure Red Hat OpenShift and details about updates, deprecations, and the support policy.

## Red Hat OpenShift versions

Red Hat OpenShift Container Platform uses semantic versioning. Semantic versioning uses different levels of numbers to specify different versions. The following table illustrates the different parts of a semantic version number, in this case using the example version number 4.15.16.

|Major version (x)|Minor version (y)|Patch version (z)|
|-|-|-|
|4|15|16|

* **Major version**: No major version releases are planned at this time. Major versions involve significant changes to the core service such as large-scale additions of new features and functions, architectural changes, and removal of existing functions.
* **Minor version**: Released approximately every four months. Minor version updates can include feature additions, enhancements, deprecations, removals, bug fixes, security enhancements, and other improvements.
* **Patch version**: Typically released each week, or as needed. Patch version updates can include bug fixes, security enhancements, and other improvements.

You should aim to run the latest minor release of the major version you're running. For example, if your production cluster is on 4.14, and 4.15 is the latest generally available minor version for the 4 series, you should update to 4.15 as soon as you can. 

### Update channels

Update channels are the mechanism by which users state the OpenShift Container Platform minor version they intend to update their clusters to. Update channels are tied to a minor version of Red Hat OpenShift Container Platform. The version number in the channel represents the target minor version that the cluster will eventually be updated to. An update channel doesn't recommend updates to a version above the selected channel's version. For instance, the OCP `stable-4.14` update channel doesn't include an update to a 4.15 release. Update channels only control release selection and don't modify the current version of the cluster. See [Understanding update channels and releases](https://docs.openshift.com/container-platform/latest/updating/understanding_updates/understanding-update-channels-release.html) for more information.

> [!IMPORTANT]
> Azure Red Hat OpenShift provides support for stable channels only. For example: `stable-4.15`.
>

You can use the `stable-4.15` channel to update from a previous minor version of Azure Red Hat OpenShift. Clusters updated using `fast` or `candidate` channels could put your cluster in a [Limited Support state](#limited-support-status).

## Azure Red Hat OpenShift version support policy

### Azure Red Hat OpenShift version availability

An Azure Red Hat OpenShift release is available through one of two mechanisms: 
* When an update to a newer version is available for an existing cluster
* When a new version is available as an install target for a new cluster

#### Update availability
Azure Red Hat OpenShift supports generally available (GA) minor versions of Red Hat OpenShift Container Platform from when an update is available in the OpenShift `stable` channel.  Update availability can be checked at the following page, [Red Hat OpenShift Container Platform Update Graph](https://access.redhat.com/labs/ocpupgradegraph/update_path). 

#### Install availability
Installable versions can be validated by using the [Azure Red Hat OpenShift release calendar](#azure-red-hat-openshift-release-calendar) or by running the following Azure CLI command: 
```
az aro get-versions --location [region]
```

### Version end-of-life
The end-of-life date for a version of Azure Red Hat OpenShift can be found in the [Azure Red Hat OpenShift release calendar](#azure-red-hat-openshift-release-calendar).

> [!NOTE]
> If you are running an unsupported Red Hat OpenShift version, you may be asked to update when requesting support for the cluster. Clusters running unsupported Red Hat OpenShift releases are not covered by the Azure Red Hat OpenShift SLA.

### Mandatory updates
In extreme circumstances and based on the assessment of the CVE criticality to the environment, a critical patch update may be applied to clusters automatically by Azure Red Hat OpenShift Site Reliability Engineers (SRE) which will then be followed with a notification informing you of the change. It's best practice to install patch (z-stream) updates as soon as they're available.  

## Limited support status

When a cluster transitions to a limited support status (or also called outside of support) Azure Red Hat OpenShift SREs no longer proactively monitor the cluster.  Furthermore, the SLA is no longer applicable and credits requested against the SLA are denied, though it doesn't mean that you no longer have product support.

A cluster might transition to a Limited Support status for many reasons, including the following scenarios:
- If you don't update a cluster to a supported version before the end-of-life date. 
  - There are no runtime or SLA guarantees for versions after their end-of-life date. To avoid this and continue receiving full support, update the cluster to a supported version before the end-of-life date. If you don't update the cluster before the end-of-life date, the cluster transitions to a Limited Support status until it's updated to a supported version.
  - Azure Red Hat OpenShift SREs provide commercially reasonable support to update from an unsupported version to a supported version. However, if a supported update path is no longer available, you might have to create a new cluster and migrate your workloads.

- If you remove or replace any native Azure Red Hat OpenShift components or any other component that is installed and managed by the service.
  - If admin permissions were used, Azure Red Hat OpenShift isn't responsible for any of your or your authorized users’ actions, including those that affect infrastructure services, service availability, or data loss. If any such actions are detected, the cluster might transition to a Limited Support status. You should then either revert the action or create a support case to explore remediation steps.
  - In some cases, the cluster can return to a fully supported status if you remediate the violating factors. However, in other cases, you might have to delete and recreate the cluster.
  - See the Azure Red Hat OpenShift support policy for more information about [cluster configuration requirements](./support-policies-v4.md#cluster-configuration-requirements).

## Supported versions policy exceptions

The Azure Red Hat OpenShift SRE team reserves the right to add or remove new/existing versions or delay upcoming minor release versions that have been identified to have one or more critical production impacting bugs or security issues without advance notice.

Specific patch releases may be skipped, or rollout may be accelerated depending on the severity of the bug or security issue.

## Azure Red Hat OpenShift release calendar

See the following guide for the [past Red Hat OpenShift Container Platform (upstream) release history](https://access.redhat.com/support/policy/updates/openshift/#dates).

|OCP Version|OCP GA Availability| ARO Install Availability| ARO End of Life|
|-|-|-|-|
|4.4|May 2020|July 2020|February 2021|
|4.5|July 2020| November 2020|July 15 2021|
|4.6|October 2020| February 2021|September 15 2021|
|4.7|February 2021| July 15 2021|February 1 2022|
|4.8|July 2021| September 15 2021|June 21 2022|
|4.9|November 2021| February 1 2022|March 2 2023|
|4.10|March 2022| June 21 2022|August 19 2023|
|4.11|August 2022| March 2 2023|February 10 2024|
|4.12|January 2023| August 19 2023|October 17 2024|
|4.13|May 2023| December 15 2023|November 17 2024|
|4.14|October 2023| April 25 2024|May 1 2025|
|4.15|February 2024| Coming soon|June 27 2025|

## FAQ

**What happens when a user updates an OpenShift cluster with a minor version that is not supported?**

Azure Red Hat OpenShift supports installing minor versions consistent with the dates in the previous table. A version is supported as soon as an update path to that version is available in the stable channel. If you're running a version past the End of Life date, you're outside of support and may be asked to update to continue receiving support. Updating from an older version to a supported version can be challenging, and in some cases not possible. We recommend you keep your cluster on the latest OpenShift version to avoid potential update issues.

For example, if the oldest supported Azure Red Hat OpenShift version is 4.13 and you are on 4.12 or older, you're outside of support. When the update from 4.12 to 4.13 or higher succeeds, you'll be back within our support policies. 

Reverting your cluster to a previous version, or a rollback, isn't supported. Only updating to a newer version is supported.

**What does "Outside of Support" or "Limited Support" mean?**

If your ARO cluster is running an OpenShift version that isn't on the supported versions list, or is using an [unsupported cluster configuration](./support-policies-v4.md#cluster-configuration-requirements), your cluster is "outside of support". As a result:
- When opening a support ticket for your cluster, you may be asked to update the cluster to a supported version before receiving support. 
- Any runtime or SLA guarantees for clusters outside of support are voided.
- Clusters outside of support will be patched only on a best effort basis.
- Clusters outside of support won't be monitored.
