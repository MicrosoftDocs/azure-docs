---
title: Create Windows-based Hadoop clusters in HDInsight | Microsoft Docs
description: Learn how to create Windows-based Hadoop in HDInsight by using the Azure portal.
services: hdinsight
documentationcenter: ''
tags: azure-portal
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: c8689ef3-f56f-4708-8a3a-cc00abc54e8d
ms.service: hdinsight
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 01/18/2017
ms.author: jgao

---
# Create Windows-based Hadoop clusters in HDInsight using the Azure portal

[!INCLUDE [selector](../../includes/hdinsight-selector-create-clusters.md)]

Learn how to create Windows-based Hadoop cluster in HDInsight using Azure portal. 

The information in this article only applies to Window-based HDInsight clusters. For information on creating Linux-based clusters, see [Create Hadoop clusters in HDInsight using the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md).

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight Deprecation on Windows](hdinsight-component-versioning.md#hdi-version-32-and-33-nearing-deprecation-date).

## Prerequisites:
[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

Before you begin the instructions in this article, you must have the following:

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

### Access control requirements
[!INCLUDE [access-control](../../includes/hdinsight-access-control-requirements.md)]

## Create clusters
**To create an HDInsight cluster**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **NEW**, click **Intelligence + analytics**, and then click **HDInsight**.
3. Type or select the following values:
   
   * **Cluster Name**: Name your cluster.
   * **Subscription**: Select an Azure subscription used for this cluster.
   * **Cluster configuration**:

     * **Cluster type**: Select **Hadoop** for this tutorial.
     * **Operating system**: Select **Windows** for this tutorial.
     * **Version**: Select **Hadoop 2.7.0 (HDI 3.3)**.  This is the latest version for the Windows-based Hadoop clusters.
     * **Cluster tier**: Select **STANDARD** for this tutorial.

   * **Credentials**:

     * **Cluster login username**: The default name is **admin**. 
     * **Cluster login password**: Enter a password.
     * **Enable Remote Desktop**: You don't need remote desktop for this tutorial.

   * **Data source**:

     * **Selection method**: Select **From all subscriptions**.
     * **Select a Storage account**: Click **Create new**, and then enter a name for teh default storage account.
     * **Default container**: By default, the default container uses the same name as the cluster.
     * **Location**: Select a location that is close to you.  This location is used by both the cluster and the default storage account.
   * **Cluster size**:

     * **Number of Worker nodes**: This tutorial only requires 1 node.
   * **Advanced configurations**: You can skip this part for this tutorial.
   * **Resource group**: Select **Create new**, and then enter a name.

4. Select **Pin to dashboard**, and then click **Create**. Selecting **Pin to Startboard** adds a tile for cluster to the Startboard of your Portal. It takes 15-20 minutes to create a cluster.Use the tile on the Startboard, or the **Notifications** entry on the left of the page to check on the provisioning process.
5. Once the creation completes, click the tile for the cluster from the Startboard to launch the cluster blade. The cluster blade provides essential information about the cluster such as the name, the resource group it belongs to, the location, the operating system, URL for the cluster dashboard, etc.

## Customize clusters
* See [Customize HDInsight clusters using Bootstrap](hdinsight-hadoop-customize-cluster-bootstrap.md).
* See [Customize Windows-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster.md).

## Next steps
In this article, you have learned several ways to create an HDInsight cluster. To learn more, see the following articles:

* [Get started with Azure HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md) - Learn how to start working with your HDInsight cluster
* [Submit Hadoop jobs programmatically](hdinsight-submit-hadoop-jobs-programmatically.md) - Learn how to programmatically submit jobs to HDInsight
* [Manage Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-management-portal.md)

