---
title: Queries for monitoring Azure HDInsight clusters using Log Analytics | Microsoft Docs
description: Frequently used queries to monitor Azure HDInsight clusters with Log Analytics.
services: hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/30/2017
ms.author: nitinme

---
#  Queries for monitoring Azure HDInsight clusters using Log Analytics

This article lists the Log Analytics queries that you can use to monitor Azure HDInsight cluster. These queries help you collect data about the cluster, jobs running on the cluster, as well as logs generated on the cluster.

## Queries for cluster health

* List the unhealthy nodes in a cluster for all cluster types

        (Type=metrics_resourcemanager_clustermetrics_CL) |measure max(NumUnhealthyNMs_d) by ClusterName_s

* List the unhealthy nodes in a cluster for a specific cluster type. As an example, the following query lists the unhealthy nodes across all clusters only for Hadoop clusters. 

        (Type=metrics_resourcemanager_clustermetrics_CL)( ClusterType_s=hadoop) |measure max(NumUnhealthyNMs_d) by ClusterName_s

* List all the information for a specific cluster. Replace <cluster_name> with the name of an HDInsight cluster.

        ClusterName_s=<cluster name>

## Queries for cluster jobs

* List all the jobs currently running on all HDInsight clusters

        (Type=metrics_resourcemanager_queue_root_CL) |measure max(AppsRunning_d) as AppsRunning by ClusterName_s interval 1HOUR

* List all the jobs submitted to any HDInsight cluster

        (Type=metrics_resourcemanager_queue_root_CL) |measure max(AppsSubmitted_d) as AppsSubmitted by ClusterName_s interval 1HOUR

* List all the completed jobs that were submitted to any HDInsight cluster

        (Type=metrics_resourcemanager_queue_root_CL) |measure max(AppsCompleted_d) as AppsCompleted by ClusterName_s interval 1HOUR

* List all the jobs that are pending to run on any HDInsight cluster

        (Type=metrics_resourcemanager_queue_root_CL) |measure max(AppsPending_d) as AppsPending by ClusterName_s interval 1HOUR

* List all the jobs that failed to complete successfully on any HDInsight clusters

        (Type=metrics_resourcemanager_queue_root_CL) |measure max(AppsFailed_d) as AppsFailed by ClusterName_s interval 1HOUR

* List all the jobs that were forcefully terminated on any HDInsight cluster

        (Type=metrics_resourcemanager_queue_root_CL) |measure max(AppsKilled_d) as AppsKilled by ClusterName_s interval 1HOUR 

## Queries for cluster logs

        

## See also

* [Working with OMS Log Analytics](https://blogs.msdn.microsoft.com/wei_out_there_with_system_center/2016/07/03/oms-log-analytics-create-tiles-drill-ins-and-dashboards-with-the-view-designer/)
* [Use View Designer to create custom views in Log Analytics](../log-analytics/log-analytics-view-designer.md)
* [Create alert rules in Log Analytics](../log-analytics/log-analytics-alerts-creating.md)
