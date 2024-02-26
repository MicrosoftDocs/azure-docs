---
title: Create an Azure HDInsight cluster that uses Availability Zones
description: Learn how to create an Azure HDInsight cluster that uses Availability Zones.
ms.service: hdinsight
ms.topic: how-to
ms.custom: references_regions
ms.date: 05/11/2023
---

# Create an HDInsight cluster that uses Availability Zones

An Azure HDInsight cluster consists of multiple nodes (head nodes, worker nodes, gateway nodes and zookeeper nodes). By default, in a region that supports Availability Zones, the user has no control over which cluster nodes are provisioned in which Availability Zone. 

With this new availability zone feature, the user can now specify which Availability Zone should host all the nodes of the HDInsight cluster. The cluster nodes are physically separated from another availability zone and are isolated from failures in other Availability Zones in the same region. This deployment model also provides inexpensive, low latency network connectivity within the cluster. 

Replicating this deployment model into multiple Availability Zones can provide a higher level of availability to protect against hardware failure.

This article shows you how to create an HDInsight cluster within an Availability Zone and how to use this feature to achieve higher availability. 

## Before you begin
Availability Zone feature is only supported for clusters created after June 15. Availability zone settings can't be updated after the cluster is created. You also can't update an existing, non-availability zone cluster to use availability zones.

## Prerequisites and region availability
Prerequisites:

 - Clusters must be created under a custom VNet. 
 - You need to bring your own SQL DB for Ambari DB and external metastore (like Hive metastore) so that you can config these DBs in the same Availability Zone. 

HDInsight clusters can currently be created using availability zones in the following regions:

 - Australia East
 - Brazil South
 - Canada Central
 - Central US
 - East US
 - East US 2
 - France Central
 - Germany West Central
 - Japan East
 - Korea Central
 - North Europe
 - Southeast Asia
 - South Central US
 - UK South
 - US Gov Virginia
 - West Europe
 - West US 2
 
## Overview of availability zones for HDInsight clusters

Availability zones are unique physical locations within a region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. In Azure, a region contains one or more Availability Zones. This physical separation of availability zones within a region protects applications and data from datacenter failures. For more information, see [What are availability zones in Azure](../availability-zones/az-overview.md).

Azure HDInsight clusters can be configured to deploy within one Availability Zone. All the nodes in this HDInsight cluster including the two head nodes, three zookeeper nodes, two gateway nodes and the worker nodes will be placed in the specified Availability Zone.  For example, there are three Availability zones in East US. A HDInsight cluster in East US can be created with all the nodes in Availability zone 1. 

Using Availability zones with HDInsight cluster in this manner can provide both performance and cost benefits: 

 - Better performance due to low latency network connectivity
 - Lower cost: data transfer within the same Availability zone is free. Across Availability zone data transfer will incur additional networking cost. 

If your application requires high availability across multiple Availability zones, you can create one primary HDInsight cluster in one Availability zone and create a secondary HDInsight cluster in a different Availability zone with minimum size to save cost. With this design, if one of the other Availability zones goes down, this HDInsight cluster won’t be impacted. If this Availability zone goes down, customers need to switch the secondary clusters in a different Availability zone to the primary, route the workload to this new primary cluster and quickly scale up the cluster size to pick up the data processing.   

## Create an HDInsight cluster using availability zone
You can use Azure Resource Manager (ARM) template to launch an HDInsight cluster into a specified Availability zone. 

In the resources section, you need to add a section of ‘zones’ and provide which Availability zone you want this cluster to be deployed into. 

```json
   "resources": [
        {
            "type": "Microsoft.HDInsight/clusters",
            "apiVersion": "2021-06-01",
            "name": "[parameters('cluster name')]",
            "location": "East US 2",
            "zones": [
                "1"
            ],
```
 
## Verify nodes within one Availability Zone across zones
When the HDInsight cluster is ready, you can check the location to see which availability zone they're deployed in.

:::image type="content" source="./media/hdinsight-use-availability-zones/cluster-availability-zone-info.png" alt-text="Screenshot sthat hows availability zone info in cluster overview" border="true":::

**Get API response**: 

```json
 [
        {
            "location": "East US 2",
            "zones": [
                "1"
            ],
```

## Scale up the cluster

You can scale up an HDInsight cluster with more worker nodes. The newly added worker nodes will be placed in the same Availability zone of this cluster. 

## Best practices

 - Regularly back up the configurations in Ambari DB. 
 - Implement logic to easily route workload to secondary cluster.

## When AZ goes down, what to expect
 - You can't ssh to this cluster
 - You can't delete or scale up or scale down this cluster
 - You can't submit jobs or see job history
 - You still can submit new cluster creation request in a different region
