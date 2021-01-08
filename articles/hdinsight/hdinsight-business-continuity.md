---
title: Azure HDInsight business continuity
description: This article gives an overview of best practices, single region availability, and optimization options for Azure HDInsight business continuity planning.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
keywords: hadoop high availability
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/08/2020
---

# Azure HDInsight business continuity

Azure HDInsight clusters depend on many Azure services like storage, databases, Active Directory, Active Directory Domain Services, networking, and Key Vault. A well-designed, highly available, and fault-tolerant analytics application should be designed with enough redundancy to withstand regional or local disruptions in one or more of these services. This article gives an overview of best practices, single region availability, and optimization options for business continuity planning.

## General best practices

This section discusses a few best practices for you to consider during business continuity planning.

* Determine the minimal business functionality you will need if there is a disaster and why. For example, evaluate if you need failover capabilities for the data transformation layer (shown in yellow) *and* the data serving layer (shown in blue), or if you only need failover for the data service layer.

   :::image type="content" source="media/hdinsight-business-continuity/data-layers.png" alt-text="data transformation and data serving layers":::

* Segment your clusters based on workload, development lifecycle, and departments. Having more clusters reduces the chances of a single large failure affecting multiple different business processes.

* Make your secondary regions read-only. Failover regions with both read and write capabilities can lead to complex architectures.

* Transient clusters are easier to manage when there is a disaster. Design your workloads in a way that clusters can be cycled and no state is maintained in clusters.

* Often workloads are left unfinished if there is a disaster and need to restart in the new region. Design your workloads to be idempotent in nature.

* Use automation during cluster deployments and ensure cluster configuration settings are scripted as far as possible to ensure rapid and fully automated deployment if there is a disaster.

* Use Azure monitoring tools on HDInsight to detect abnormal behavior in the cluster and set corresponding alert notifications. You can deploy the pre-configured HDInsight cluster-specific management solutions that collect important performance metrics of the specific cluster type. For more information, see [Azure Monitoring for HDInsight](./hdinsight-hadoop-oms-log-analytics-tutorial.md).  

* Subscribe to Azure health alerts to be notified about service issues, planned maintenance, health and security advisories for a subscription, service, or region. Health notifications that include the issue cause and resolute ETA help you to better execute failover and failbacks. For more information, see [Azure Service Health documentation](../service-health/index.yml).

## Single region availability

A basic HDInsight system has the following components. All components have their own single region fault tolerance mechanisms.

* Compute (virtual machines): Azure HDInsight cluster
* Metastore(s): Azure SQL Database
* Storage: Azure Data Lake Gen2 or Blob storage
* Authentication: Azure Active Directory, Azure Active Directory Domain Services, Enterprise Security Package
* Domain name resolution: Azure DNS

There are other optional services that can be used, such as Azure Key Vault and Azure Data Factory.

:::image type="content" source="media/hdinsight-business-continuity/hdinsight-components.png" alt-text="HDInsight components":::

### Azure HDInsight cluster (compute)

HDInsight offers an availability SLA of 99.9%. To provide high availability in a single deployment, HDInsight is accompanied by many services that are in high availability mode by default. Fault tolerance mechanisms in HDInsight are provided by both Microsoft and Apache OSS ecosystem high availability services.

The following services are designed to be highly available:

#### Infrastructure

* Active and Standby Headnodes
* Multiple Gateway Nodes
* Three Zookeeper Quorum nodes
* Worker Nodes distributed by fault and update domains

#### Service

* Apache Ambari Server
* Application timeline severs for YARN
* Job History Server for Hadoop MapReduce
* Apache Livy
* HDFS
* YARN Resource Manager
* HBase Master

Refer documentation on [high availability services supported by Azure HDInsight](./hdinsight-high-availability-components.md) to learn more.

It doesn't always take a catastrophic event to impact business functionality. Service incidents in one or more of the following services in a single region can also lead to loss of expected business functionality.

### HDInsight metastore

HDInsight uses [Azure SQL Database](https://azure.microsoft.com/support/legal/sla/sql-database/v1_4/) as a metastore, which provides an SLA of 99.99%. Three replicas of data persist within a data center with synchronous replication. If there is a replica loss, an alternate replica is served seamlessly. [Active geo-replication](../azure-sql/database/active-geo-replication-overview.md) is supported out of the box with a maximum of four data centers. When there is a failover, either manual or data center, the first replica in the hierarchy will automatically become read-write capable. For more information, see [Azure SQL Database business continuity](../azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview.md).

### HDInsight Storage

HDInsight recommends Azure Data Lake Storage Gen2 as the underlying storage layer. [Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/v1_5/), including Azure Data Lake Storage Gen2, provides an SLA of 99.9%. HDInsight uses the LRS service in which three replicas of data persist within a data center, and replication is synchronous. When there is a replica loss, a replica is served seamlessly.

### Azure Active Directory

[Azure Active Directory](https://azure.microsoft.com/support/legal/sla/active-directory/v1_0/) provides an SLA of 99.9%. Active Directory is a global service with multiple levels of internal redundancy and automatic recoverability. For more information, see how [Microsoft in continually improving the reliability of Azure Active Directory](https://azure.microsoft.com/blog/advancing-azure-active-directory-availability/).

### Azure Active Directory Domain Services (AD DS)

[Azure Active Directory Domain Services](https://azure.microsoft.com/support/legal/sla/active-directory-ds/v1_0/) provides an SLA of 99.9%. Azure AD DS is a highly available service hosted in globally distributed data centers. Replica sets are a preview feature in Azure AD DS that enables geographic disaster recovery if an Azure region goes offline. For more information, see [replica sets concepts and features for Azure Active Directory Domain Services](../active-directory-domain-services/concepts-replica-sets.md) to learn more.  

### Azure DNS

[Azure DNS](https://azure.microsoft.com/support/legal/sla/dns/v1_1/) provides an SLA of 100%. HDInsight uses Azure DNS in various places for domain name resolution.

## Multi-region cost and complexity optimizations

Improving business continuity using cross region high availability disaster recovery requires architectural designs of higher complexity and higher cost. The following tables detail some technical areas that may increase total cost of ownership.

### Cost optimizations

|Area|Cause of cost escalation|Optimization strategies|
|----|------------------------|-----------------------|
|Data Storage|Duplicating primary data/tables in a secondary region|Replicate only curated data|
|Data Egress|Outbound cross region data transfers come at a price. Review Bandwidth pricing guidelines|Replicate only curated data to reduce the region egress footprint|
|Cluster Compute|Additional HDInsight cluster/s in secondary region|Use automated scripts to deploy secondary compute after primary failure. Use Autoscaling to keep secondary cluster size to a minimum. Use cheaper VM SKUs. Create secondaries in regions where VM SKUs may be discounted.|
|Authentication |Multiuser scenarios in secondary region will incur additional Azure AD DS setups|Avoid multiuser setups in secondary region.|

### Complexity optimizations

|Area|Cause of complexity escalation|Optimization strategies|
|----|------------------------|-----------------------|
|Read Write patterns |Requiring both primary and secondary to be Read and Write enabled |Design the secondary to be read only|
|Zero RPO & RTO |Requiring zero data loss (RPO=0) and zero downtime (RTO=0) |Design RPO and RTO in ways to reduce the number of components that need to fail over.|
|Business functionality |Requiring full business functionality of primary in secondary |Evaluate if you can run with bare minimum critical subset of the business functionality in secondary.|
|Connectivity |Requiring all upstream and downstream systems from primary to connect to the secondary as well|Limit the secondary connectivity to a bare minimum critical subset.|

## Next steps

To learn more about the items discussed in this article, see:

* [Azure HDInsight business continuity architectures](./hdinsight-business-continuity-architecture.md)
* [Azure HDInsight highly available solution architecture case study](./hdinsight-high-availability-case-study.md)
* [What is Apache Hive and HiveQL on Azure HDInsight?](./hadoop/hdinsight-use-hive.md)