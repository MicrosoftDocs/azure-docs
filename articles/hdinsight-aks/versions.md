---
title: Versioning
description: Versioning in HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/29/2023
---

# Azure HDInsight on AKS versions

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS service has three components, a Resource provider, an Open-source software (OSS), and Controllers that are deployed on a cluster. Microsoft periodically upgrades the images and the aforementioned components to include new improvements and features.

New HDInsight on AKS version may be created when one or more of the following are true: 
* Major or Minor changes or updates to HDInsight on AKS Resource provider functionality.
* Major or Minor releases or updates of Open-source components.
* Major or Minor releases or updates of AKS Infrastructure components.
* Major or Minor changes or updates to underlying operating system.
* Patches or hotfixes for a component part of the package (including the latest security updates and critical bug fixes).

## Introduction

Azure HDInsight on AKS has the concept of Cluster pools and Clusters, which tie together essential component versions such as packages and connectors with a specific open-source component. 
Each of the version upgrade periodically includes new improvements, features, and patches.
> [!NOTE]
> You should test and validate that your applications run properly when using new patch, minor or major versions.

Azure HDInsight on AKS uses the standard [Semantic Versioning](https://semver.org/) scheme for each version:

```
[major].[minor].[patch]
Examples:
  1.0.1
  1.0.2
```
Each number in the version indicates general compatibility with the previous version

- **Major versions** change when incompatible API updates or backwards compatibility may be broken.
- **Minor versions** change when functionality updates are made that are backwards compatible with the other minor releases (except for new feature additions or core security fixes/platform updates controlled by upstream).
- **Patch versions** change when backwards compatible bug fixes are made to a minor version.

> [!IMPORTANT]
> You must aim to run the latest patch release of the minor version you're running. For example, if your production cluster is on **`1.0.1`**, **`1.0.2`** is the latest patch version available for the *1.0* series. You should upgrade to **`1.0.2`** as soon as possible to ensure your cluster is fully patched and supported. 

## Keep your clusters up to date

To take advantage of the latest HDInsight on AKS features, we recommend regularly migrating your clusters to the latest patch or minor versions. Currently, HDInsight on AKS doesn't support in-place upgrades as part of public preview, where existing clusters are upgraded to newer versions. You  need to create a new HDInsight on AKS cluster in your existing cluster pool and migrate your application to use the new cluster with latest minor version or patch. All cluster pools align with the major version, and clusters within the pool align to the same major version, and you can create clusters with subsequent minor or patch versions. 

As part of the best practices, we recommend you to keep your clusters updated on regular basis.

HDInsight on AKS release happens every 30 to 60 days. It's always good to move to the latest releases as early as possible. The recommended maximum duration for cluster upgrades is less than three months.

### Sample Scenarios 

In the below sample, we illustrate a lifecycle of version change with HDInsight on AKS. As an example, a cluster running on cluster Pool version 2.0, cluster version 2.3.6 is considered. This is a sample, and all version updates will be available on release notes on an ongoing basis.

|	Example	|	Version Impact	| Release Notes updates (Sample)	|
|-|-|-|
| AKS Kubernetes version update  |MS-Minor  |  HDInsight on AKS version 2.4.0. This release includes AKS version updated from 1.26.4 to 1.27.4. Clusters  need an update.|
| Operating system version patches |MS-Patch  | HDInsight on AKS version 2.4.1. This release includes maintenance patches for the operating system. Clusters  need an update. |
|  Web SSH is now supported for running client tools |MS-Patch  |  HDInsight on AKS version 2.4.2.  This release includes support for running client tools on your webssh pods. Clusters need an update.  |
| Advanced Auto scale with Load based is now added to HDInsight on AKS |MS-Minor  | HDInsight on AKS version 2.5.0. This release introduces an advanced load based autoscale with more capabilities. Clusters need an update.   |
| Custom autoscale with Load based autoscale is now available  | MS-Patch | HDInsight on AKS version 2.5.1. This release includes customization of load based autoscale. Clusters need an update.  |
| Add Service tag support  |MS-Patch  |HDInsight on AKS version 2.5.2 Starting 2.5.2 release, HDInsight on AKS would add service tag support. Clusters need an update. |
|  Open-source component minor update |MS-Minor  |  HDInsight on AKS version 2.6.0. Starting 2.6.0 release, HDInsight on AKS would add Open-source component update from 1.x to 1.y Clusters need an update. |
|  Open-source component upgrade & AKS upgrade, breaking API change | MS-Major |HDInsight on AKS version 3.0.1. Starting 3.0.1, Open source component Y has been updated from 1.x to 2.x, and AKS upgraded infrastructure to 2.x; Cluster pools  need an update to 3.0, and clusters to 3.0.1.   |


## Versioning using Azure portal

In the below example, you can observe, how to select the versions on cluster pool and clusters.
The cluster pool always aligns to the major version of the clusters. That is, if you're looking for an update on 2.4.5 version of HDInsight on AKS, you need to use 2.0 version of cluster pool. 

:::image type="content" source="./media/versions/cluster-pool-basic-tab.png" alt-text="Screenshot showing cluster pool basic-tab.":::
 
When creating a HDInsight on AKS cluster or Apache Flink cluster, you can choose the minor.patch version from the supported version list.

:::image type="content" source="./media/versions/cluster-details.png" alt-text="Screenshot showing cluster details.":::

The latest supported Open-source component following list as a dropdown for you to get started. 

:::image type="content" source="./media/versions/pool-version.png" alt-text="Screenshot showing pool version.":::

Since HDInsight on AKS exposes and updates a minor version with each regular release, you can now arrange enough tests before upgrade to the new version and control your schedule.

:::image type="content" source="./media/versions/aks-version.png" alt-text="Screenshot showing AKS version.":::


> [!IMPORTANT]
> In case you're using RESTAPI operations, the cluster is always created with the most recent MS-Patch version to ensure you can get the latest security updates and critical bug fixes. 

We're also building in-place upgrade support along with Azure advisor notifications to make the upgrade easier and smooth.

## Release notes
For release notes on the latest versions of HDInsight on AKS, see [release notes](./release-notes/hdinsight-aks-release-notes.md)

## Versioning considerations

* Once a cluster is deployed with a version, that cluster can't automatically upgrade to a newer version. You're required to recreate until in-place upgrade feature is live for minor versions.
* During a new cluster creation, most recent version is deployed or picked.
* Customers should test and validate that applications run properly when using new HDInsight on AKS version.
* HDInsight on AKS reserves the right to change the default version without prior notice. If you have a version dependency, specify the HDInsight on AKS version when you create your clusters.
* HDInsight on AKS may retire an OSS component version before retiring the HDInsight on AKS version, based on the upstream support of open-source or AKS dependencies.


