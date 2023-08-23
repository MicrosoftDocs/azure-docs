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

This article describes reliability support in Azure HDInsight, and covers [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure HDInsight supports a [zonal deployment configuration](availability-zones-service-support.md#azure-services-with-availability-zone-support). Azure HDInsight cluster nodes are placed in a single zone that you select in the selected region. A zonal HDInsight cluster is isolated from any outages that occur in other zones. However, if an outage impacts the specific zone chosen for the HDInsight cluster, the cluster won't be available.  This deployment model provides inexpensive, low latency network connectivity within the cluster. Replicating this deployment model into multiple availability zones can provide a higher level of availability to protect against hardware failure.

>[!IMPORTANT]
>For deployments where users don't specify a specific zone, node types are not zone resilient and can experience downtime during an outage in any zone in that region.

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

:::image type="content" source="../hdinsight/media/hdinsight-use-availability-zones/cluster-availability-zone-info.png" alt-text="Screenshot that shows availability zone info in cluster overview." border="true":::

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

### Availability zone redeployment

Azure HDInsight clusters currently doesn't support in-place migration of existing cluster instances to availability zone support. However, you can choose to [recreate your cluster](#create-an-hdinsight-cluster-using-availability-zone), and choose a different availability zone or region during the cluster creation. A secondary standby cluster in a different region and a different availability zone can be used in disaster recovery scenarios.

### Zone down experience

When an availability zone goes down:

 - You can't ssh to this cluster.
 - You can't delete or scale up or scale down this cluster.
 - You can't submit jobs or see job history.
 - You still can submit new cluster creation request in a different region.


## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)
