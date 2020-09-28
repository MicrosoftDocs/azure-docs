---
title: Azure HDInsight Business Continuity
description: 
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
keywords: hadoop high availability
ms.service: hdinsight
ms.topic: conceptual
ms.date: 09/28/2020
---

# Azure HDInsight Business Continuity

Azure HDInsight clusters depend on many Azure services like Storage, Databases, Active Directory, Active Directory Domain Services, Networking, and Key Vault. A well-designed, highly available and fault-tolerant analytics application should be designed with enough redundancy to be able to withstand regional or even local disruptions in one or more of these services.

Tolerance for reduced functionality during a disaster is a business decision that varies from one application to the next. It might be acceptable for some applications to be unavailable or to be partially available with reduced functionality or delayed processing for a period. For other applications, any reduced functionality is unacceptable.

> [!NOTE]
> The architectures presented in this article are in no way exhaustive. Design your own unique architectures post objective determinations around expected business continuity, operational complexity, and cost of ownership.

## Best practices

You need to determine, that in the event of a disaster, what is the minimal business functionality that absolutely needs to be available and why? An example could be to evaluate,  if in the event of a disaster , you really need failover capabilities for the data transformation layer (in yellow) and the data serving layer(in blue) or would failover capabilities only the data serving layer suffice.

:::image type="content" source="media/hdinsight-business-continuity/failover-for-data-transformation-data-serving-layers.png" alt-text="diagram of data transportation and data serving layers":::

•	Segment your clusters based on workload, development lifecycle, departments etc. Having more clusters reduces the chances of a single large failure affecting multiple different business processes.

•	Requiring both Read & Write capabilities in the failover region can lead to complex architectures. Keep your secondary regions as Read only. 

•	Transient clusters are easier to manage in the event of a disaster. Design your workloads in a way so that clusters can be cycled, and no state is maintained in clusters. 

•	Often workloads are left unfinished in the event of a disaster and need to restart in the new region. Design your workloads to be idempotent in nature.

•	Use automation during cluster deployments and ensure cluster config settings are scripted as far as possible to ensure rapid fully automated deployment in the event of a disaster. 

•	Use Azure monitoring tools on HDInsight to determine abnormal behavior in the cluster and set corresponding alert notifications. A good place to start may be to deploy the preconfigured HDInsight cluster specific management solutions which collect important performance metrics of the specific cluster type. Refer to Azure Monitoring for HDInsight for more details.  

•	Subscribe to Azure health alerts to be notified about service issues, planned maintenance, health and security advisories at a subscription, service, or region. Notifications related to health of the HDInsight service, cause thereof and corresponding resolution ETAs would enable customers execute their failovers and failbacks better. Refer to Azure Service Health documentation for more details.

## Single region availability 

An HDInsight system minimally comprises of the below components all of which are accompanied by their single region fault tolerance mechanisms.  
Compute(Virtual Machines): Azure HDInsight cluster 
Metastore/s: Azure SQL Database
Storage: Azure Data Lake Gen2 or Blob Store 
Authentication(optional using Enterprise Security Package) : Azure Active Directory and Azure Active directory Domain Services
DNS: Domain Name resolution

:::image type="content" source="media/hdinsight-business-continuity/single-region-availability.png" alt-text="single region availablity":::

Depending on functionality there can be other services that can be used like Azure Key Vault , Azure Data Factory etc. 

HDInsight cluster (Compute) 
HDInsight service offers a Availability SLA of 99.9% . To provide high availability in a single deployment, HDInsight by default is accompanied by many services in HA mode. HA services custom developed by Microsoft along with HA services from Apache OSS ecosystem together provide for mechanisms to support many fault tolerance mechanisms in HDInsight. Below is the list of services that are designed to be highly available. 
•	Infrastructure 
	Active and Standby Headnodes
	Multiple Gateway Nodes 
	Three Zookeeper Quorum nodes
	Worker Nodes distributed by fault and update domains

	Service
	Apache Ambari Server 
	Application timeline sever for YARN 
	Job History Server for Hadoop MapReduce
	Apache Livy
	HDFS
	YARN Resource Manager
	HBase Master
 
Refer documentation on High availability services supported by Azure HDInsight to learn more. 

HDInsight Metastore 
HDInsight uses Azure SQL which provides an SLA of 99.99%. Three replicas of data are persisted within a datacenter with asynchronous replication. In the event of a replica loss, an alternate replica is served seamlessly. Active Geo-replication is supported out of the box with a maximum of 4 datacenters.  In the event of a failover (manual or datacenter), the first in hierarchy will become read-write capable out of the box. Refer documentation on Azure SQL DB business continuity to learn more. 
HDInsight Storage 
HDInsight recommends ADLSGen2 as the underlying storage layer. Azure Storage(including ADLSGen2) provides an SLA of 99.9% . HDInsight uses the LRS service in which three replicas of data are persisted within a datacenter (replication is synchronous), out of the box. In the event of a replica loss, a replica is served seamlessly.
Active directory
Active directory provides an SLA of 99.9%.Active directory is a global service with multiple levels of internal redundancy and automatic recoverability. Refer documentation on how Microsoft in continually improving the reliability of Azure Active directory. 

Active directory domain services (AADDS) 
Active directory domain services provides an SLA of 99.9%. AADDS is a highly available service hosted in globally distributed datacenters. Replica sets is preview feature (as of Sept-2020) in AADDS that enables geographic disaster recovery if an Azure region goes offline. Refer to Replica sets concepts and features for Azure Active Directory Domain Services to learn more.  

Azure DNS
Azure DNS provides an SLA of 100%. HDInsight uses Azure DNS at various places for domain name resolution. 
It does not always take a catastrophic event to impact business functionality. Service incidents  in one or more of these services in a single region can also lead to customers experiencing loss of expected business functionality and hence there arises a need to design a multi-region highly available architecture. 

## Cost and Complexity optimizations for multi region setup

Improving business continuity using cross region HADR accompanies architectural designs of higher complexity and higher cost. Below are some technical areas that may increase total cost of ownership for customers.

Cost Optimizations
Area	Cause of cost escalation 	Optimization Strategies 
Data Storage 	Duplicating primary data/tables in a secondary region	Replicate only curated data
Data Egress	Outbound cross region data transfers come at a price. Review Bandwidth pricing guidelines  
Replicate only curated data to reduce the region egress footprint 
Cluster Compute	Additional HDInsight cluster/s in secondary region		Use automated scripts to deploy secondary compute after primary failure.
	Use Autoscaling to keep secondary cluster size to a minimum.
	Use cheaper VM SKU’s. 
	Create secondaries in regions where VM SKU’s may be discounted 

Authentication 	Multiuser scenarios in secondary region will incur additional AADDS setups	Avoid multiuser setups in secondary region
  
Complexity Optimization
Area	Cause of complexity escalation 	Optimization Strategies 
Read Write patterns 	Requiring both primary and secondary to be Read and Write enabled 	Design the secondary to be read only
Zero RPO & RTO 	Requiring zero data loss (RPO=0) and zero downtime (RTO=0) 	Design RPO and RTO in ways to reduce the number of components that need to fail over.  
Business functionality 	Requiring full business functionality of primary in secondary 	Evaluate if you can run with bare minimum critical subset of the business functionality in secondary
Connectivity 	Requiring all upstream and downstream systems from primary to connect to the secondary as well	Limit the secondary connectivity to a bare minimum critical subset. 

##Apache Hive and Interactive Query
Hive Replication V2 is the recommended way of setting up business continuity in HDInsight Hive and Interactive query clusters. The persistent sections of a standalone Hive cluster that need to be replicated consist of the Storage Layer and the Hive Metastore. If the Hive cluster works in a multiuser scenario with Enterprise Security Package, there would be additional considerations like the AADDS and Ranger Metastore. 
Review Hive replication section for more information. 

:::image type="content" source="media/hdinsight-business-continuity/hive-replication.png" alt-text="Apache Hive replication":::



## Next steps

To learn more about the items discussed in this article, see:

* [Apache Ambari REST Reference](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md)
* [Install and configure the Azure CLI](https://docs.microsoft.com//cli/azure/install-azure-cli?view=azure-cli-latest)
* [Install and configure Azure PowerShell module Az](/powershell/azure/)
* [Manage HDInsight using Apache Ambari](hdinsight-hadoop-manage-ambari.md)
* [Provision Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md)
