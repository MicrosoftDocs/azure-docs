---
title: Upgrade your HDInsight on AKS clusters and cluster pools 
description: Upgrade your HDInsight on AKS clusters and cluster pools.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 03/22/2024
---

# Upgrade your HDInsight on AKS clusters and cluster pools

Learn how to update your HDInsight on AKS clusters and cluster pools to the latest AKS patches, security updates, cluster patches, and cluster hotfixes with in-place upgrade.

## Why to upgrade
 
HDInsight on AKS is a service that lets you run Apache Flink, Apache Spark, Trino  on Azure Kubernetes Service (AKS). HDInsight on AKS gives you the benefits of cloud scalability, reliability, and flexibility, while also enabling you to use your existing tools and applications.  

One of the important features of HDInsight on AKS is that you can upgrade your clusters and cluster pools with the latest software updates. This means that you can enjoy the latest hotfixes, security updates, and AKS patches, without recreating clusters.  

As HDInsight on AKS relies on the underlying Azure Kubernetes Service (AKS) infrastructure, it needs to be periodically updated to ensure security and compatibility with the latest features. It’s important that you upgrade to apply the latest security releases and to get access to the latest Kubernetes features, and to stay within the AKS support window corresponding to your HDInsight on AKS cluster pool. Microsoft provides patches and new images for image nodes on AKS frequently (weekly), but your running nodes don't get the new images unless you do a node OS upgrade.  

For example, you can upgrade your Spark cluster to get the latest hotfixes enhancements, security fixes for your node OS, and AKS patch updates to keep your cluster and cluster pools software up-to-date.

In this article, we show you how to upgrade your HDInsight on AKS clusters and cluster pools, using the Azure portal.  

We share some best practices to help you with the upgrade process.

## Types of upgrades

The following table summarizes the details of types of upgrades and what frequency you can anticipate the updates to occur for cluster pools and clusters.

| Upgrade Type | Applicability | Frequency of upgrade | In-Place Upgrade |
|-|-|-|-|
|AKS version (minor) upgrade / HDInsight on AKS Minor version upgrade   | Cluster pool, Cluster | Roughly every six months |✅ |
|HDInsight on AKS – Cluster Patch version | Cluster | Approximately monthly |✅ |
|HDInsight on AKS – Cluster Hotfixes  | Cluster | As necessary|✅ |
|AKS patch version upgrade | Cluster pool, Cluster | Approximately weekly (dependent on upstream AKS patching)  |✅ |
|Node OS upgrades |Cluster pool, Cluster  | Weekly |✅ |
|Security patches and hot fixes for node images  |Cluster pool, Cluster  | As necessary |✅ |

Learn more about [HDInsight on AKS versioning](./versions.md).

 

As HDInsight on AKS uses Azure Kubernetes Service (AKS) as the underlying infrastructure, it needs to be periodically updated to ensure security and compatibility with the latest features.  

There are two components of an AKS cluster that are necessary to maintain:

* **AKS Patch and Minor version Upgrades**: Part of the AKS cluster lifecycle involves performing upgrades to the latest Kubernetes version. It’s important that you upgrade to apply the latest security releases and to get access to the latest Kubernetes features, and to stay within the [AKS support window](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). The HDInsight on AKS cluster pool version maps to the AKS Minor versions.  

    * AKS patches are accomplished using AKS patch upgrades, which can be applied to cluster pool and clusters in HDInsight on AKS, starting Cluster pool version 1.1. 
    
    * AKS minor versions are accomplished using AKS minor version upgrade, which upgrades the cluster pool, and clusters to latest AKS minor version supported on HDInsight on AKS starting Cluster pool version 1.* HDInsight on AKS aims to stay on top of the Kubernetes N-2 [support policy](/azure/aks/support-policies) along with the [AKS release calendar](/azure/aks/supported-kubernetes-versions?tabs=azure-cli#aks-kubernetes-release-calendar), to continue to provide you with the ability to perform in-place minor upgrades, and we encourage you to plan for upgrade to latest minor versions as early as they're available. 
    
* **Node OS upgrades**: AKS regularly provides new node images with the latest OS and runtime updates. It's beneficial to upgrade your nodes' images regularly to ensure support for the latest AKS features and to apply essential security patches and hot fixes on the AKS layer. Image upgrade announcements are included in the [AKS release notes](https://github.com/Azure/AKS/releases), and it can take up to a week for these updates to be rolled out across all regions. With this upgrade, we only update the node pool images without upgrading the Kubernetes version. In HDInsight on AKS, this upgrade is accomplished using Node OS upgrades, which can be applied to cluster pool and clusters, starting Cluster pool version 1.1.

To take advantage of the latest HDInsight on AKS features, we recommend regularly updating your HDInsight on AKS clusters with [hotfixes and patches](./versions.md#keep-your-clusters-up-to-date). HDInsight on AKS supports in-place upgrades where existing clusters can be upgraded newer hotfixes and patches. You no need to drop and recreate a new cluster, when your cluster is eligible for an upgrade, the software update status reflects the upgrade pending, and you can perform upgrade with a few clicks, and maintenance windows.  

HDInsight on AKS patch releases occur every 30 to 60 days. It's always good to move to the latest patch as early possible. The recommended maximum duration for cluster upgrades is less than three months. 

**Hotfix Upgrades**: Hotfix releases are done as necessary, and they include only a few fixes for a limited number of modules within the cluster package. The hotfixes are applicable to your clusters, and when such updates are available your cluster would reflect the pending updates on software updates status, for you to perform maintenance operation with in-place upgrade.  


**Patch Upgrades**: Resources in Azure are made available by a Resource provider. HDInsight on AKS Resource provider is responsible for creating, managing, and deleting clusters. HDInsight on AKS updates its images on Azure container registry on an ongoing basis to put together open-source software (OSS) components that can be deployed on a cluster. These images contain the base Azure Linux operating system and core components such as Spark, Flink, Trino. The monthly patches bring in the bug fixes, from resource provider, and also open-source components, and other feature bugs or improvements, which are specific to the cluster you're operating. The patch upgrades are applicable to your clusters, and when such updates are available your cluster would reflect the pending updates on software updates status, for you to perform maintenance operation with in-place upgrade.

## How to check the available upgrades

Before you start the upgrade, you need to check the available upgrades for your HDInsight on AKS cluster.  

The updates depend on the cluster version or cluster pool version, that's current HDInsight on AKS version, and also the AKS version.  

You can check the overview blade for **software update** section to verify if you have software updates – **up to date** or **pending**.  

In case you have a software update available – you observe that your cluster is showing software update in **pending** state, and you can opt for upgrade by using the Azure portal. 

To check the available updates using the Azure portal, follow these steps: 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, type HDInsight on AKS. 

1. Select your HDInsight on AKS cluster pool 

1. In the cluster overview page, check for software update status. 

    :::image type="content" source="./media/in-place-upgrade/software-update.png" alt-text="Screenshot showing software update." border="true" lightbox="./media/in-place-upgrade/software-update.png":::

1. Click upgrade 

   :::image type="content" source="./media/in-place-upgrade/software-update.png" alt-text="Screenshot showing upgrade button." border="true" lightbox="./media/in-place-upgrade/software-update.png":::

1. In the upgrade blade, you see the available upgrades.  

   :::image type="content" source="./media/in-place-upgrade/upgrade-cluster-pool.png" alt-text="Screenshot showing how to upgrade cluster pool." border="true" lightbox="./media/in-place-upgrade/upgrade-cluster-pool.png":::

1.	Based on the upgrade available, you have an option to select and perform upgrade.

       :::image type="content" source="./media/in-place-upgrade/node-os-upgrade.png" alt-text="Screenshot showing node upgrade option." border="true" lightbox="./media/in-place-upgrade/node-os-upgrade.png":::

1. Once you trigger the upgrade, you get the service notification on portal.

    :::image type="content" source="./media/in-place-upgrade/notification.png" alt-text="Screenshot showing cluster pool upgrade in progress." border="true" lightbox="./media/in-place-upgrade/notification.png":::
    
1. The cluster update status moves from pending to upgrading, and cluster pool status moves to NodeOSUpgrading.

    :::image type="content" source="./media/in-place-upgrade/node-os-update-in-progress.png" alt-text="Screenshot showing node OS update in progress." border="true" lightbox="./media/in-place-upgrade/node-os-update-in-progress.png":::

1. As you opted to update both cluster pools and clusters together, the clusters also move to similar states. 

    :::image type="content" source="./media/in-place-upgrade/status-update.png" alt-text="Screenshot showing status update." border="true" lightbox="./media/in-place-upgrade/status-update.png":::


1. Once your upgrade is complete, you have an update on the banner and status on software update is reflected across cluster pool and clusters (if your cluster’s also upgraded with cluster pool), and the notification updates reflect the success of the upgrade.

   :::image type="content" source="./media/in-place-upgrade/os-update-success.png" alt-text="Screenshot showing OS update status as success." border="true" lightbox="./media/in-place-upgrade/os-update-success.png":::
   
   :::image type="content" source="./media/in-place-upgrade/status-up-to-date.png" alt-text="Screenshot showing status is up to date." border="true" lightbox="./media/in-place-upgrade/status-up-to-date.png":::
   
    :::image type="content" source="./media/in-place-upgrade/final-status.png" alt-text="Screenshot showing final status." border="true" lightbox="./media/in-place-upgrade/final-status.png":::

   :::image type="content" source="./media/in-place-upgrade/success-status.png" alt-text="Screenshot showing success status." border="true" lightbox="./media/in-place-upgrade/success-status.png":::

## Planning an upgrade for your HDInsight on AKS clusters and cluster pools

After you checked the available upgrade versions and chosen the one that suits your needs, you can upgrade your HDInsight clusters on AKS using the Azure portal. The upgrade process may take some time, depending on the size and configuration of your clusters and number of clusters within a cluster pool.  

During the upgrade, your cluster remains operational and accessible, but you may experience some performance degradation or temporary interruptions. Therefore, we  recommend you to upgrade your clusters during off-peak hours or when the cluster isn't under heavy load.

## Best practices for in-place upgrade of your HDInsight on AKS clusters and cluster pools

To ensure a smooth and successful upgrade of your HDInsight on AKS clusters and cluster pools, follow these best practices: 

Before you start the upgrade, make sure that your cluster is healthy and stable, and the cluster status isn't in error.   

1. Before the upgrade, review the release notes of the new HDInsight on AKS version and prepare for any necessary changes to your applications or scripts to adapt to the new features or changes. Test them in a lower environment, before moving to production.  

1. Before the upgrade, plan for maintenance window where you can perform the cluster upgrades in the planned window. In-place upgrades (both cluster and cluster pool) affect the performance of your environment and jobs can experience down-time while the upgrade is in progress. 

1. During the upgrade, don't make any changes to your cluster resources, such as adding or removing nodes or perform scaling, updating configurations, or deleting. Doing so may interfere with the upgrade process and cause errors or failures. 

1. During the upgrade, monitor the cluster availability. You can use the Azure portal, to check the software update status.  

1. If the upgrade fails or encounters any issues, you can reach out to Azure support or perform manual rollback operation to restore the upgrade to the version that you used before. 

1. After the upgrade, verify that the cluster is working as expected. You can check the cluster version, health, and configurations by using the Azure portal, Azure CLI, Azure PowerShell, or Service health. You can also run some test jobs or queries to verify the cluster functionality. 

 
## Steps for upgrades 

### Node OS upgrades 
 

1. Once you click upgrade on the overview blade, and select Node OS upgrade on the upgrade pane on the left. 

1. If there's a Node OS upgrade, both cluster pool and clusters go through the upgrade simultaneously.
 
    :::image type="content" source="./media/in-place-upgrade/type-of-upgrade.png" alt-text="Screenshot showing type of upgrade." border="true" lightbox="./media/in-place-upgrade/type-of-upgrade.png":::

1. Once you trigger the upgrade, you get the service notification on portal.
 
   :::image type="content" source="./media/in-place-upgrade/upgrade-in-progress.png" alt-text="Screenshot showing upgrade in progress." border="true" lightbox="./media/in-place-upgrade/upgrade-in-progress.png":::

1. The cluster update status moves from pending to upgrading, and cluster pool status moves to `NodeOSUpgrading`.
 
    :::image type="content" source="./media/in-place-upgrade/node-os-update-in-progress.png" alt-text="Screenshot showing node OS update in progress." border="true" lightbox="./media/in-place-upgrade/node-os-update-in-progress.png":::


1. As you opted to update both cluster pools and clusters together, the clusters also move to similar states. 

   :::image type="content" source="./media/in-place-upgrade/update-status.png" alt-text="Screenshot showing update status." border="true" lightbox="./media/in-place-upgrade/update-status.png":::    

1. Once your upgrade is complete, you have an update on the banner and status on software update is reflected across cluster pool and clusters (if cluster’s were also
upgraded with cluster pool), and the notification updates reflect the success of the upgrade. 

   :::image type="content" source="./media/in-place-upgrade/os-update-success.png" alt-text="Screenshot showing OS update as success." border="true" lightbox="./media/in-place-upgrade/os-update-success.png":::

   :::image type="content" source="./media/in-place-upgrade/status-up-to-date.png" alt-text="Screenshot showing status up to date." border="true" lightbox="./media/in-place-upgrade/status-up-to-date.png":::

   :::image type="content" source="./media/in-place-upgrade/final-status.png" alt-text="Screenshot showing final status." border="true" lightbox="./media/in-place-upgrade/final-status.png":::

   :::image type="content" source="./media/in-place-upgrade/upgrade-successful.png" alt-text="Screenshot showing upgrade success status." border="true" lightbox="./media/in-place-upgrade/upgrade-successful.png":::


### AKS patch upgrades

1. Once you click upgrade on the overview blade, and select AKS patch upgrade on the upgrade pane on the left.

1. In AKS patch upgrade, both cluster pool and clusters don't go through the upgrade simultaneously. Individual clusters need to apply the AKS patch upgrades based on the planned maintenance windows for your clusters.

   :::image type="content" source="./media/in-place-upgrade/aks-version.png" alt-text="Screenshot showing AKS version." border="true" lightbox="./media/in-place-upgrade/aks-version.png":::
   
1. Once you trigger the upgrade you get the service notification on portal.

   :::image type="content" source="./media/in-place-upgrade/notification-upgrade-in-progress.png" alt-text="Screenshot showing notification tray with upgrade in progress." border="true" lightbox="./media/in-place-upgrade/notification-upgrade-in-progress.png"
 
1. The cluster update status moves from pending to upgrading, and cluster pool status moves to AksPatchUpgrading.

   :::image type="content" source="./media/in-place-upgrade/patch-upgrade-status.png" alt-text="Screenshot showing the patch upgrade status." border="true" lightbox="./media/in-place-upgrade/patch-upgrade-status.png"
 
1. Once your upgrade is complete, you get an update on the banner and status on software update is reflected across cluster pool and clusters (in case clusters were also upgraded with cluster pool), and the notification updates reflect the success of the upgrade.

   :::image type="content" source="./media/in-place-upgrade/notification-upgrade-success.png" alt-text="Screenshot showing notification with status upgrade as success." border="true" lightbox="./media/in-place-upgrade/notification-upgrade-success.png"
   
1. Once you apply the patch for the cluster pool, you can apply the AKS patches to the clusters in the cluster pool all at once or go to individual cluster and apply the patch, based on the maintenance schedules.

   :::image type="content" source="./media/in-place-upgrade/status-as-run.png" alt-text="Screenshot showing the status as running." border="true" lightbox="./media/in-place-upgrade/status-as-run.png"

1. When you use upgrade all clusters, on the cluster pool page to complete upgrading all the clusters in the cluster pool at once.

   :::image type="content" source="./media/in-place-upgrade/upgrade-all-clusters.png" alt-text="Screenshot showing how to upgrade all clusters." border="true" lightbox="./media/in-place-upgrade/upgrade-all-clusters.png"
 
1. The upgrade pane on the right side shows the details of the upgrade on AKS patch versions (current and upgrade path).

   :::image type="content" source="./media/in-place-upgrade/upgrade-cluster.png" alt-text="Screenshot showing the type of the upgrade as cluster upgrade." border="true" lightbox="./media/in-place-upgrade/upgrade-cluster.png"
 
1. Once the upgrade commences, the notification icon shows the cluster upgrade is in progress

   :::image type="content" source="./media/in-place-upgrade/notification-cluster-pool-upgrade-success.png" alt-text="Screenshot showing notification tray with cluster pool upgrade is successful." border="true" lightbox="./media/in-place-upgrade/notification-cluster-pool-upgrade-success.png"

1. The cluster overview pane on the cluster pool also reflects the status of the upgrades.

   :::image type="content" source="./media/in-place-upgrade/overview-status.png" alt-text="Screenshot showing status overview page." border="true" lightbox="./media/in-place-upgrade/overview-status.png" 

1.  Once the upgrade is complete, the overview banner and the notification tray are updated.
 
    :::image type="content" source="./media/in-place-upgrade/success-status-message.png" alt-text="Screenshot showing success status message." border="true" lightbox="./media/in-place-upgrade/success-status-message.png"

    :::image type="content" source="./media/in-place-upgrade/notification-all-upgrades-success.png" alt-text="Screenshot showing notification all upgrades success." border="true" lightbox="./media/in-place-upgrade/notification-all-upgrades-success.png" 

 ### Hotfix upgrades

1. On the cluster overview page, you can observe that you have a hotfix upgrade pending for your cluster. 

   :::image type="content" source="./media/in-place-upgrade/hotfix-upgrade.png" alt-text="Screenshot showing hotfix upgrade message." border="true" lightbox="./media/in-place-upgrade/hotfix-upgrade.png"

1. Once you click upgrade, go to the cluster upgrades section with the details of the upgrade pending.

   :::image type="content" source="./media/in-place-upgrade/cluster-upgrade.png" alt-text="Screenshot showing cluster upgrade in progress." border="true" lightbox="./media/in-place-upgrade/cluster-upgrade.png"
 
1.	Once you commence the upgrade, the notification shows the progress of the upgrade, and the cluster overview page reflects the status as hotfix upgrading and software update status changes to upgrading. 
 
    :::image type="content" source="./media/in-place-upgrade/notification-cluster-upgrade-in-progress.png" alt-text="Screenshot showing notification tray of cluster upgrade in progress." border="true" lightbox="./media/in-place-upgrade/notification-cluster-upgrade-in-progress.png"

    :::image type="content" source="./media/in-place-upgrade/hotfix-upgrade-status.png" alt-text="Screenshot showing hotfix upgrade status." border="true" lightbox="./media/in-place-upgrade/hotfix-upgrade-status.png"
 
1.	Once the upgrade is complete, the overview banner for cluster status changes to running, software update status changes to up to date, and the notification banner on the overview section is updated.
 
    :::image type="content" source="./media/in-place-upgrade/hotfix-upgrade-success-message.png" alt-text="Screenshot showing hotfix upgrade successful message." border="true" lightbox="./media/in-place-upgrade/hotfix-upgrade-success-message.png"
  
    :::image type="content" source="./media/in-place-upgrade/software-update-status.png" alt-text="Screenshot showing software update status." border="true" lightbox="./media/in-place-upgrade/software-update-status.png"
     
