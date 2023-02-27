---
title: Reliability in Azure HDInsight
description: Find out about reliability in Azure HDInsight
author: apurbasroy
ms.service: azure
ms.topic: conceptual
ms.date: 02/27/2023
ms.author: anaharris
ms.custom: references_regions, subject-reliability
CustomerIntent: As a cloud architect/engineer, I need general guidance on migrating HDInsight to using availability zones.
---


# Reliability in Azure HDInsight 
 

This article describes reliability support in Azure HDInsight and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and links to information on [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Availability zone service and regional support](availability-zones-service-support.md).

An Azure HDInsight cluster consists of multiple nodes (head nodes, worker nodes, gateway nodes and zookeeper nodes). In a region that supports availability zones, HDInsight by default automatically spreads the cluster nodes across all zones of the selected region.  In this default deployment model, you choose to have no control over which cluster nodes are provisioned in which availability zone. 

However, Azure HDInsight also supports both [zone-redundant and zonal deployment configurations](availability-zones-service-support.md#azure-services-with-availability-zone-support). 

- **Zonal**. Azure HDInsight cluster nodes are placed in a single zone that you select in the selected region. A zonal HDInsight cluster is isolated from any outages that occur in other zones. However, if an outage impacts the specific zone chosen for the HDInsight cluster, the cluster won't be available.  This deployment model provides inexpensive, low latency network connectivity within the cluster. Replicating this deployment model into multiple availability zones can provide a higher level of availability to protect against hardware failure.

- **Zone-redundant**. If you want application requires availability across multiple availability zones, you can create one primary HDInsight cluster in one availability zone and create a secondary HDInsight cluster in a different availability zone with minimum size to save cost. With this design, if one of the other availability zones goes down, this HDInsight cluster won’t be impacted. If this availability zone goes down, customers need to switch the secondary clusters in a different availability zone to the primary, route the workload to this new primary cluster, and quickly scale up the cluster size to pick up the data processing.


## Prerequisites

- Availability zones are only supported for clusters created after June 15, 2023. Availability zone settings can't be updated after the cluster is created. You also can't update an existing, non-availability zone cluster to use availability zones.

- Clusters must be created under a custom VNet.
 
- You need to bring your own SQL DB for Ambari DB and external metastore, such as Hive metastore, so that you can config these DBs in the same availability zone.
 
- Your HDInsight clusters must be created with the availability zone option in one of the following regions:

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
    - Qatar Central
    - Southeast Asia
    - South Central US
    - UK South
    - US Gov Virginia
    - West Europe
    - West US 2


### SLA improvements
<!-- Need info -->

## Create an HDInsight cluster using availability zone

You can use Azure Resource Manager (ARM) template to launch an HDInsight cluster into a specified availability zone. 

In the resources section, you need to add a section of ‘zones’ and provide which availability zone you want this cluster to be deployed into. 

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
        }
   ]
```
 
### Verify nodes within one availability Zone across zones

When the HDInsight cluster is ready, you can check the location to see which availability zone they're deployed in.

:::image type="content" source="../hdinsight/media/hdinsight-use-availability-zones/cluster-availability-zone-info.png" alt-text="Screenshot that shows availability zone info in cluster overview" border="true":::

**Get API response**: 

```json
 [
        {
            "location": "East US 2",
            "zones": [
                "1"
            ],
        }
 ]
```

### Scale up the cluster

You can scale up an HDInsight cluster with more worker nodes. The newly added worker nodes will be placed in the same availability zone of this cluster. 


### Zonal failover support

{Need more info here.}

Make sure to implement logic to easily route workload to the secondary cluster and regularly back up the configurations in Ambari DB.

### Availability zone redeployment

Azure HDInsight clusters currently doesn't support in-place migration of existing cluster instances to availability zone support. However, you can choose to [recreate your cluster](#create-an-hdinsight-cluster-using-availability-zone), and choose availability zone support during the cluster creation.  

### Zone down experience

When an availability zone goes down:

 - You can't ssh to this cluster
 - You can't delete or scale up or scale down this cluster
 - You can't submit jobs or see job history
 - You still can submit new cluster creation request in a different region


### Low-latency design

{Any more info here?}


## Disaster recovery: cross region failover

<!-- Need info on this -->


## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)
