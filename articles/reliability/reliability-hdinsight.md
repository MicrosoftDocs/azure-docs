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

This article describes reliability support in [Azure HDInsight](../hdinsight/hdinsight-overview.md), and covers [availability zones](#availability-zone-support) and [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


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


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Azure HDInsight clusters depend on many Azure services like storage, databases, Active Directory, Active Directory Domain Services, networking, and Key Vault. A well-designed, highly available, and fault-tolerant analytics application should be designed with enough redundancy to withstand regional or local disruptions in one or more of these services. This section gives an overview of best practices, single and multi region availability, and optimization options for business continuity planning.


### Disaster recovery in multi-region geography

Improving business continuity using cross region high availability disaster recovery requires architectural designs of higher complexity and higher cost. The following tables detail some technical areas that may increase total cost of ownership.

### Cost optimizations

|Area|Cause of cost escalation|Optimization strategies|
|----|------------------------|-----------------------|
|Data Storage|Duplicating primary data/tables in a secondary region|Replicate only curated data|
|Data Egress|Outbound cross region data transfers come at a price. Review Bandwidth pricing guidelines|Replicate only curated data to reduce the region egress footprint|
|Cluster Compute|Additional HDInsight cluster/s in secondary region|Use automated scripts to deploy secondary compute after primary failure. Use Autoscaling to keep secondary cluster size to a minimum. Use cheaper VM SKUs. Create secondaries in regions where VM SKUs may be discounted.|
|Authentication |Multiuser scenarios in secondary region will incur additional Microsoft Entra Domain Services setups|Avoid multiuser setups in secondary region.|

### Complexity optimizations

|Area|Cause of complexity escalation|Optimization strategies|
|----|------------------------|-----------------------|
|Read Write patterns |Requiring both primary and secondary to be Read and Write enabled |Design the secondary to be read only|
|Zero RPO & RTO |Requiring zero data loss (RPO=0) and zero downtime (RTO=0) |Design RPO and RTO in ways to reduce the number of components that need to fail over. For more information on RTO and RPO, see [Recovery objectives](./disaster-recovery-overview.md#recovery-objectives).|
|Business functionality |Requiring full business functionality of primary in secondary |Evaluate if you can run with bare minimum critical subset of the business functionality in secondary.|
|Connectivity |Requiring all upstream and downstream systems from primary to connect to the secondary as well|Limit the secondary connectivity to a bare minimum critical subset.|


When you create your multi region disaster recovery plan, consider the following recommendations:

* Determine the minimal business functionality you will need if there is a disaster and why. For example, evaluate if you need failover capabilities for the data transformation layer (shown in yellow) *and* the data serving layer (shown in blue), or if you only need failover for the data service layer.

   :::image type="content" source="../hdinsight/media/hdinsight-business-continuity/data-layers.png" alt-text="data transformation and data serving layers":::

* Segment your clusters based on workload, development lifecycle, and departments. Having more clusters reduces the chances of a single large failure affecting multiple different business processes.

* Make your secondary regions read-only. Failover regions with both read and write capabilities can lead to complex architectures.

* Transient clusters are easier to manage when there is a disaster. Design your workloads in a way that clusters can be cycled and no state is maintained in clusters.

* Often workloads are left unfinished if there is a disaster and need to restart in the new region. Design your workloads to be idempotent in nature.

* Use automation during cluster deployments and ensure cluster configuration settings are scripted as far as possible to ensure rapid and fully automated deployment if there is a disaster.

#### Outage detection, notification, and management

- Use Azure monitoring tools on HDInsight to detect abnormal behavior in the cluster and set corresponding alert notifications. You can deploy the pre-configured HDInsight cluster-specific management solutions that collect important performance metrics of the specific cluster type. For more information, see [Azure Monitoring for HDInsight](../hdinsight/hdinsight-hadoop-oms-log-analytics-tutorial.md).  

- Subscribe to Azure health alerts to be notified about service issues, planned maintenance, health and security advisories for a subscription, service, or region. Health notifications that include the issue cause and resolute ETA help you to better execute failover and failbacks. For more information, see [Azure Service Health documentation](../service-health/index.yml).


### Disaster recovery in single-region geography

Each component in a basic HDInsight system has its own single region fault tolerance mechanisms. Keep in mind that doesn't always take a catastrophic event to impact business 
functionality. Service incidents in one or more of the following services in a single region can also lead to loss of expected business functionality.
 

- **Compute (virtual machines): Azure HDInsight cluster**. HDInsight offers an availability SLA of 99.9%. To provide high availability in a single deployment, HDInsight is accompanied by many services that are in high availability mode by default. Fault tolerance mechanisms in HDInsight are provided by both Microsoft and Apache OSS ecosystem high availability services.
    
    The following infrastructure components are designed to be highly available:
    
    * Active and Standby Headnodes
    * Multiple Gateway Nodes
    * Three Zookeeper Quorum nodes
    * Worker Nodes distributed by fault and update domains
    
    The following services are also designed to be highly available:
    
    * Apache Ambari Server
    * Application timeline severs for YARN
    * Job History Server for Hadoop MapReduce
    * Apache Livy
    * HDFS
    * YARN Resource Manager
    * HBase Master
    
    To learn more, see [high availability services supported by Azure HDInsight](../hdinsight/hdinsight-high-availability-components.md).
    
   
- **Metastore(s): Azure SQL Database**. HDInsight uses [Azure SQL Database](https://azure.microsoft.com/support/legal/sla/azure-sql-database/v1_4/) as a metastore, which provides an SLA of 99.99%. Three replicas of data persist within a data center with synchronous replication. If there is a replica loss, an alternate replica is served seamlessly. [Active geo-replication](/azure/azure-sql/database/active-geo-replication-overview) is supported out of the box with a maximum of four data centers. When there is a failover, either manual or data center, the first replica in the hierarchy will automatically become read-write capable. For more information, see [Azure SQL Database business continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview).


- **Storage: Azure Data Lake Gen2 or Blob storage**. HDInsight recommends Azure Data Lake Storage Gen2 as the underlying storage layer. [Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/v1_5/), including Azure Data Lake Storage Gen2, provides an SLA of 99.9%. HDInsight uses the LRS service in which three replicas of data persist within a data center, and replication is synchronous. When there is a replica loss, a replica is served seamlessly.

- **Authentication: Microsoft Entra ID, Microsoft Entra Domain Services, Enterprise Security Package**. 
    - [Microsoft Entra ID](https://azure.microsoft.com/support/legal/sla/active-directory/v1_0/) provides an SLA of 99.9%. Active Directory is a global service with multiple levels of internal redundancy and automatic recoverability. For more information, see how [Microsoft in continually improving the reliability of Microsoft Entra ID](https://azure.microsoft.com/blog/advancing-azure-active-directory-availability/).
    - [Microsoft Entra Domain Services](https://azure.microsoft.com/support/legal/sla/active-directory-ds/v1_0/) provides an SLA of 99.9%. Microsoft Entra Domain Services is a highly available service hosted in globally distributed data centers. Replica sets are a preview feature in Microsoft Entra Domain Services that enables geographic disaster recovery if an Azure region goes offline. For more information, see [replica sets concepts and features for Microsoft Entra Domain Services](../active-directory-domain-services/concepts-replica-sets.md) to learn more.  
    - [Azure DNS](https://azure.microsoft.com/support/legal/sla/dns/v1_1/) provides an SLA of 100%. HDInsight uses Azure DNS in various places for domain name resolution.
    

 - **Optional services**, such as Azure Key Vault and Azure Data Factory.

:::image type="content" source="../hdinsight/media/hdinsight-business-continuity/hdinsight-components.png" alt-text="HDInsight components":::


## Next steps

To learn more about the items discussed in this article, see:

* [Azure HDInsight business continuity architectures](../hdinsight/hdinsight-business-continuity-architecture.md)
* [Azure HDInsight highly available solution architecture case study](../hdinsight/hdinsight-high-availability-case-study.md)
* [What is Apache Hive and HiveQL on Azure HDInsight?](../hdinsight/hadoop/hdinsight-use-hive.md)

> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)
