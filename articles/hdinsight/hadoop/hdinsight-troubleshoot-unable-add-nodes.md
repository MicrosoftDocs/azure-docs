---
title: Unable to add nodes to Azure HDInsight cluster
description: Troubleshoot why unable to add nodes to Apache Hadoop cluster in Azure HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 03/22/2024
---

# Scenario: Unable to add nodes to Azure HDInsight cluster

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Unable to add nodes to Azure HDInsight cluster.

## Cause

Reasons may vary.

## Resolution

Using the [Cluster size](../hdinsight-scaling-best-practices.md) feature, calculate the number of extra cores needed for the cluster. This is based on the total number of cores in the new worker nodes. Then try one or more of the following steps:

* Check to see if there are any cores available in the cluster's location.

* Take a look at the number of available cores in other locations. Consider recreating your cluster in a different location with enough available cores.

* If you'd like to increase the core quota for a specific location, file a support ticket for an HDInsight core quota increase.
