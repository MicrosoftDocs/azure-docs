---
title: Upgrade your HDInsight on AKS Clusters & Cluster Pools 
description: Upgrade your HDInsight on AKS Clusters & Cluster Pools.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 03/20/2024
---


# Upgrade your HDInsight on AKS Clusters & Cluster Pools

Learn how to update your HDInsight on AKS clusters and cluster pools to the latest AKS patches, security updates, cluster patches, and cluster hotfixes with in-place upgrade.

Why to upgrade?
 

HDInsight on AKS is a service that lets you run Apache Flink, Apache Spark, Trino  on Azure Kubernetes Service (AKS). HDInsight on AKS gives you the benefits of cloud scalability, reliability, and flexibility, while also enabling you to use your existing tools and applications.  

One of the important features of HDInsight on AKS is that you can upgrade your clusters and cluster pools with the latest software updates. This means that you can enjoy the latest hotfixes, security updates and AKS patches, without recreating clusters.  

As HDInsight on AKS relies on the underlying Azure Kubernetes Service (AKS) infrastructure, it needs to be periodically updated to ensure security and compatibility with the latest features. It’s important that you upgrade to apply the latest security releases and to get access to the latest Kubernetes features, and to stay within the AKS support window corresponding to your HDInsight on AKS cluster pool. Microsoft provides patches and new images for image nodes on AKS frequently ( weekly), but your running nodes don't get the new images unless you do a node OS upgrade.  

For example, you can upgrade your Spark cluster to get the latest hotfixes enhancements, security fixes for your node OS, and AKS patch updates to keep your cluster & cluster pools software up-to-date.

In this article, we show you how to upgrade your HDInsight on AKS clusters and cluster pools, using the Azure portal.  

We share some best practices to help you with the upgrade process.

## Types of Upgrades

The following table summarizes the details of types of upgrades and what frequency you can anticipate the updates to occur for cluster pools and clusters.

| Upgrade Type | Applicability |Frequency of upgrade | In-Place Upgrade |
|-|-|-|-|
|AKS version (minor) upgrade / HDInsight on AKS Minor version upgrade   | Cluster pool, Cluster | Roughly every six months |✅ |
|HDInsight on AKS – Cluster Patch version |Cluster | Approximately monthly |✅ |
|HDInsight on AKS – Cluster Hotfixes  | Cluster | As necessary|✅ |
|AKS patch version upgrade | Cluster pool, Cluster |Approximately weekly (dependent on upstream AKS patching).  |✅ |
| Node OS upgrades |Cluster pool, Cluster  | Weekly |✅ |
|Security patches and hot fixes for node images  |Cluster pool, Cluster  | As necessary |✅ |

Learn more about [HDInsight on AKS versioning](./versions.md)

 

As HDInsight on AKS uses Azure Kubernetes Service (AKS) as the underlying infrastructure, it needs to be periodically updated to ensure security and compatibility with the latest features.  

There are two components of an AKS cluster that are necessary to maintain:

1. **AKS Patch & Minor version Upgrades**: Part of the AKS cluster lifecycle involves performing upgrades to the latest Kubernetes version. It’s important that you upgrade to apply the latest security releases and to get access to the latest Kubernetes features, and to stay within the [AKS support window](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). The HDInsight on AKS cluster pool version maps to the AKS Minor versions.  

    1. AKS patches are accomplished using AKS patch upgrades, which can be applied to cluster pool and clusters in HDInsight on AKS, starting Cluster pool version 1.1. 
    
    1. AKS minor versions are accomplished using AKS minor version upgrade, which upgrades the cluster pool, and clusters to latest AKS minor version supported on HDInsight on AKS starting Cluster pool version 1.2.  HDInsight on AKS aims to stay on top of the Kubernetes N-2 [support policy](/azure/aks/support-policies) along with the [AKS release calendar](/azure/aks/supported-kubernetes-versions?tabs=azure-cli#aks-kubernetes-release-calendar), to continue to provide you the ability to perform in-place minor upgrades, and we encourage to plan for upgrade to latest minor versions as early as they're available. 
    
1. Node OS upgrades: AKS regularly provides new node images with the latest OS and runtime updates. It's beneficial to upgrade your nodes' images regularly to ensure support for the latest AKS features and to apply essential security patches and hot fixes on the AKS layer. Image upgrade announcements are included in the [AKS release notes](https://github.com/Azure/AKS/releases), and it can take up to a week for these updates to be rolled out across all regions. With thisupgrade , we only update the node pool images without upgrading the Kubernetes version. In HDInsight on AKS, this upgrade is accomplished using Node OS upgrades, which can be applied to cluster pool and clusters, starting Cluster pool version 1.1.

To take advantage of the latest HDInsight on AKS features, we recommend regularly updating your HDInsight on AKS clusters with [hotfixes and patches](./versions.md#keep-your-clusters-up-to-date). HDInsight on AKS supports in-place upgrades where existing clusters can be upgraded newer hotfixes and patches. You no need to drop and recreate a new cluster, when your cluster is eligible for an upgrade, the software update status reflects the upgrade pending, and you can perform upgrade with a few clicks, and maintenance windows.  

HDInsight on AKS patch releases occur every 30 to 60 days. It's always good to move to the latest patch as early possible. The recommended maximum duration for cluster upgrades is less than three months. 

**Hotfix Upgrades**: Hotfix releases are done as necessary, and they include only a few fixes for a limited number of modules within the cluster package. The hotfixes are applicable to your clusters, and when such updates are available your cluster would reflect the pending updates on software updates status, for you to perform maintenance operation with in-place upgrade.  


**Patch Upgrades**: Resources in Azure are made available by a Resource provider. HDInsight on AKS Resource provider is responsible for creating, managing, and deleting clusters. HDInsight on AKS updates its images on Azure container registry on an ongoing basis to put together open-source software (OSS) components that can be deployed on a cluster. These images contain the base Azure Linux operating system and core components such as Spark, Flink, Trino. The monthly patches bring in the bug fixes, from resource provider, and also open-source components, and other feature bugs or improvements, which are specific to the cluster you're operating. The patch upgrades are applicable to your clusters, and when such updates are available your cluster would reflect the pending updates on software updates status, for you to perform maintenance operation with in-place upgrade.

## How to check the available upgrades? 

Before you start the upgrade, you need to check the available upgrades for your HDInsight on AKS cluster.  

The updates depend on the cluster version or cluster pool version i.e., current HDInsight on AKS version, and also the AKS version.  

You can check the overview blade for **software update** section to verify if you have software updates – **up to date** or **pending**.  

In case you have a software update available – you observe that your cluster is showing software update in **pending** state, and you can opt for upgrade by using the Azure portal. 

To check the available updates using the Azure portal, follow these steps: 

1. Sign in to the [Azure portal](https://portal.azure.com/). 

1. In the search box, type HDInsight on AKS. 

1. Select your HDInsight on AKS cluster pool 

1. In the cluster overview page, check for software update status. 

image

1. Click upgrade 

image

In the upgrade blade, you see the available upgrades.  

image

1. The cluster update status moves from pending to upgrading, and cluster pool status moves to NodeOSUpgrading. 

image

1. As you opted to update both cluster pools and clusters together, the clusters also move to similar states. 

image


1.  Once your upgrade is complete, you have an update on the banner & status on software update is reflected across cluster pool and clusters (in case cluster’s also upgraded with cluster pool), and the notification updates reflect the success of the upgrade.

image
image
image

## Planning an upgrade for your HDInsight on AKS Clusters & Cluster pools 

After you checked the available upgrade versions and chosen the one that suits your needs, you can upgrade your HDInsight clusters on AKS using the Azure portal. The upgrade process may take some time, depending on the size and configuration of your clusters and number of clusters within a cluster pool.  

During the upgrade, your cluster remain operational and accessible, but you may experience some performance degradation or temporary interruptions. Therefore, it's recommended to upgrade your clusters during off-peak hours or when the cluster is not under heavy load.

## Best practices for In-place Upgrade of your HDInsight on AKS Clusters & Cluster pools? 

To ensure a smooth and successful upgrade of your HDInsight on AKS clusters and cluster pools, follow these best practices: 

Before you start the upgrade, make sure that your cluster is healthy and stable, and the cluster status is not in error.   

1. Before the upgrade, review the release notes of the new HDInsight on AKS version and prepare for any necessary changes to your applications or scripts to adapt to the new features or changes. Test them in a lower environment, before moving to production.  

1. Before the upgrade, plan for maintenance window where you can perform the cluster upgrades in the planned window. In-place upgrades (both cluster and cluster pool) affect the performance of your environment and jobs can experience down-time while the upgrade is in progress. 

1. During the upgrade, don't make any changes to your cluster resources, such as adding or removing nodes or perform scaling, updating configurations, or deleting. Doing so may interfere with the upgrade process and cause errors or failures. 

1. During the upgrade, monitor the cluster availability. You can use the Azure portal, to check the software update status.  

1. If the upgrade fails or encounters any issues, you can reach out to Azure support or perform manual rollback operation to restore the upgrade to the version that you used before. 

1. After the upgrade, verify that the cluster is working as expected. You can check the cluster version, health, and configurations by using the Azure portal, Azure CLI, Azure PowerShell, or Service health. You can also run some test jobs or queries to verify the cluster functionality. 

 
## Steps for Upgrades 

### Node OS upgrades 
 

1. Once you click upgrade on the overview blade and select Node OS upgrade on the upgrade pane on the left. 

1. If there is a Node OS upgrade, both cluster pool and clusters go through the upgrade simultaneously. 
 
image

1. Once you trigger the upgrade, you get the service notification on portal 

image

1. The cluster update status moves from pending to upgrading, and cluster pool status moves to NodeOSUpgrading. 

image

1. As you opted to update both cluster pools and clusters together, the clusters also move to similar states. 

image

1. Once your upgrade is complete, you have an update on the banner & status on software update is reflected across cluster pool and clusters (if cluster’s were also upgraded with cluster pool), and the notification updates reflect the success of the upgrade. 

image
image
image
image

### AKS Patch upgrades 

Once you click upgrade on the overview blade and select AKS patch upgrade on the upgrade pane on the left. 

In case of AKS patch upgrade, both cluster pool and clusters do not go through the upgrade simultaneously. Individual clusters need to apply the AKS patch upgrades based on the planned maintenance windows for your clusters.

image
