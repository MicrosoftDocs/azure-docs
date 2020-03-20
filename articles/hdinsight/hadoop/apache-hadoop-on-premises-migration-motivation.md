---
title: 'Benefits: Migrate on-premises Apache Hadoop to Azure HDInsight'
description: Learn the motivation and benefits for migrating on-premises Hadoop clusters to Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: ashishth
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 11/15/2019
---

# Migrate on-premises Apache Hadoop clusters to Azure HDInsight - motivation and benefits

This article is the first in a series on best-practices for migrating on-premises Apache Hadoop eco-system deployments to Azure HDInsight. This series of articles is for people who are responsible for the design, deployment, and migration of Apache Hadoop solutions in Azure HDInsight. The roles that may benefit from these articles include cloud architects, Hadoop administrators, and DevOps engineers. Software developers, data engineers, and data scientists should also benefit from the explanation of how different types of clusters work in the cloud.

## Why to migrate to Azure HDInsight

Azure HDInsight is a cloud distribution of Hadoop components. Azure HDInsight makes it easy, fast, and cost-effective to process massive amounts of data. HDInsight includes the most popular open-source frameworks such as:

- Apache Hadoop
- Apache Spark
- Apache Hive with LLAP
- Apache Kafka
- Apache Storm
- Apache HBase
- R

## Azure HDInsight advantages over on-premises Hadoop

- **Low cost** - Costs can be reduced by [creating clusters on demand](../hdinsight-hadoop-create-linux-clusters-adf.md) and paying only for what you use. Decoupled compute and storage provides flexibility by keeping the data volume independent of the cluster size.

- **Automated cluster creation** - Automated cluster creation requires minimal setup and configuration. Automation can be used for on-demand clusters.

- **Managed hardware and configuration** - There's no need to worry about the physical hardware or infrastructure with an HDInsight cluster. Just specify the configuration of the cluster, and Azure sets it up.

- **Easily scalable** - HDInsight enables you to [scale](../hdinsight-administer-use-portal-linux.md) workloads up or down. Azure takes care of data redistribution and workload rebalancing without interrupting data processing jobs.

- **Global availability** - HDInsight is available in more [regions](https://azure.microsoft.com/regions/services/) than any other big data analytics offering. Azure HDInsight is also available in Azure Government, China, and Germany, which allows you to meet your enterprise needs in key sovereign areas.

- **Secure and compliant** - HDInsight enables you to protect your enterprise data assets with [Azure Virtual Network](../hdinsight-plan-virtual-network-deployment.md), [encryption](../hdinsight-hadoop-create-linux-clusters-with-secure-transfer-storage.md), and integration with [Azure Active Directory](../domain-joined/hdinsight-security-overview.md). HDInsight also meets the most popular industry and government [compliance standards](https://azure.microsoft.com/overview/trusted-cloud).

- **Simplified version management** - Azure HDInsight manages the version of Hadoop eco-system components and keeps them up to date. Software updates are usually a complex process for on-premises deployments.

- **Smaller clusters optimized for specific workloads with fewer dependencies between components** - A typical on-premises Hadoop setup uses a single cluster that serves many purposes. With Azure HDInsight, workload-specific clusters can be created. Creating clusters for specific workloads removes the complexity of maintaining a single cluster with growing complexity.

- **Productivity** - You can use various tools for Hadoop and Spark in your preferred development environment.

- **Extensibility with custom tools or third-party applications** - HDInsight clusters can be extended with installed components and can also be integrated with the other big data solutions by using [one-click](https://azure.microsoft.com/services/hdinsight/partner-ecosystem/) deployments from the Azure Market place.

- **Easy management, administration, and monitoring** - Azure HDInsight integrates with [Azure Monitor logs](../hdinsight-hadoop-oms-log-analytics-tutorial.md) to provide a single interface with which you can monitor all your clusters.

- **Integration with other Azure services** - HDInsight can easily be integrated with other popular Azure services such as the following:

    - Azure Data Factory (ADF)
    - Azure Blob Storage
    - Azure Data Lake Storage Gen2
    - Azure Cosmos DB
    - Azure SQL Database
    - Azure Analysis Services

- **Self-healing processes and components** - HDInsight constantly checks the infrastructure and open-source components using its own monitoring infrastructure. It also automatically recovers critical failures such as unavailability of open-source components and nodes. Alerts are triggered in Ambari if any OSS component is failed.

For more information, see the article [What is Azure HDInsight and the Apache Hadoop technology stack](../hadoop/apache-hadoop-introduction.md).

## Migration planning process

The following steps are recommended for planning a migration of on-premises Hadoop clusters to Azure HDInsight:

1. Understand the current on-premises deployment and topologies.
2. Understand the current project scope, timelines, and team expertise.
3. Understand the Azure requirements.
4. Build out a detailed plan based on best practices.

## Gathering details to prepare for a migration

This section provides template questionnaires to help gather important information about:

- The on-premises deployment
- Project details
- Azure requirements

### On-premises deployment questionnaire

| **Question** | **Example** | **Answer** |
|---|---|---|
|**Topic**: **Environment**|||
|Cluster Distribution version|HDP 2.6.5, CDH 5.7|
|Big Data eco-system components|HDFS, Yarn, Hive, LLAP, Impala, Kudu, HBase, Spark, MapReduce, Kafka, Zookeeper, Solr, Sqoop, Oozie, Ranger, Atlas, Falcon, Zeppelin, R|
|Cluster types|Hadoop, Spark, Confluent Kafka, Storm, Solr|
|Number of clusters|4|
|Number of master nodes|2|
|Number of worker nodes|100|
|Number of edge nodes| 5|
|Total Disk space|100 TB|
|Master Node configuration|m/y, cpu, disk, etc.|
|Data Nodes configuration|m/y, cpu, disk, etc.|
|Edge Nodes configuration|m/y, cpu, disk, etc.|
|HDFS Encryption?|Yes|
|High Availability|HDFS HA, Metastore HA|
|Disaster Recovery / Backup|Backup cluster?|  
|Systems that are dependent on Cluster|SQL Server, Teradata, Power BI, MongoDB|
|Third-party integrations|Tableau, GridGain, Qubole, Informatica, Splunk|
|**Topic**: **Security**|||
|Perimeter security|Firewalls|
|Cluster authentication & authorization|Active Directory, Ambari, Cloudera Manager, No authentication|
|HDFS Access Control|  Manual, ssh users|
|Hive authentication & authorization|Sentry, LDAP, AD with Kerberos, Ranger|
|Auditing|Ambari, Cloudera Navigator, Ranger|
|Monitoring|Graphite, collectd, statsd, Telegraf, InfluxDB|
|Alerting|Kapacitor, Prometheus, Datadog|
|Data Retention duration| 3 years, 5 years|
|Cluster Administrators|Single Administrator, Multiple Administrators|

### Project details questionnaire

|**Question**|**Example**|**Answer**|
|---|---|---|
|**Topic**: **Workloads and Frequency**|||
|MapReduce jobs|10 jobs -- twice daily||
|Hive jobs|100 jobs -- every hour||
|Spark batch jobs|50 jobs -- every 15 minutes||
|Spark Streaming jobs|5 jobs -- every 3 minutes||
|Structured Streaming jobs|5 jobs -- every minute||
|ML Model training jobs|2 jobs -- once in a week||
|Programming Languages|Python, Scala, Java||
|Scripting|Shell, Python||
|**Topic**: **Data**|||
|Data sources|Flat files, Json, Kafka, RDBMS||
|Data orchestration|Oozie workflows, Airflow||
|In memory lookups|Apache Ignite, Redis||
|Data destinations|HDFS, RDBMS, Kafka, MPP ||
|**Topic**: **Meta data**|||
|Hive DB type|Mysql, Postgres||
|Number of Hive metastores|2||
|Number of Hive tables|100||
|Number of Ranger policies|20||
|Number of Oozie workflows|100||
|**Topic**: **Scale**|||
|Data volume including Replication|100 TB||
|Daily ingestion volume|50 GB||
|Data growth rate|10% per year||
|Cluster Nodes growth rate|5% per year
|**Topic**: **Cluster utilization**|||
|Average CPU % used|60%||
|Average Memory % used|75%||
|Disk space used|75%||
|Average Network % used|25%
|**Topic**: **Staff**|||
|Number of Administrators|2||
|Number of Developers|10||
|Number of end users|100||
|Skills|Hadoop, Spark||
|Number of available resources for Migration efforts|2||
|**Topic**: **Limitations**|||
|Current limitations|Latency is high||
|Current challenges|Concurrency issue||

### Azure requirements questionnaire

|**Topic**: **Infrastructure** |||
|---|---|---|
|**Question**|**Example**|**Answer**|
| Preferred Region|US East||
|VNet preferred?|Yes||
|HA / DR Needed?|Yes||
|Integration with other cloud services?|ADF, CosmosDB||
|**Topic**:   **Data Movement**  |||
|Initial load preference|DistCp, Data box, ADF, WANDisco||
|Data transfer delta|DistCp, AzCopy||
|Ongoing incremental data transfer|DistCp, Sqoop||
|**Topic**:   **Monitoring & Alerting** |||
|Use Azure Monitoring & Alerting Vs Integrate third-party monitoring|Use Azure Monitoring & Alerting||
|**Topic**:   **Security preferences** |||
|Private and protected data pipeline?|Yes||
|Domain Joined cluster (ESP)?|     Yes||
|On-Premises AD Sync to Cloud?|     Yes||
|Number of AD users to sync?|          100||
|Ok to sync passwords to cloud?|    Yes||
|Cloud only Users?|                 Yes||
|MFA needed?|                       No|| 
|Data authorization requirements?|  Yes||
|Role-Based Access Control?|        Yes||
|Auditing needed?|                  Yes||
|Data encryption at rest?|          Yes||
|Data encryption in transit?|       Yes||
|**Topic**:   **Re-Architecture preferences** |||
|Single cluster vs Specific cluster types|Specific cluster types||
|Colocated Storage Vs Remote Storage?|Remote Storage||
|Smaller cluster size as data is stored remotely?|Smaller cluster size||
|Use multiple smaller clusters rather than a single large cluster?|Use multiple smaller clusters||
|Use a remote metastore?|Yes||
|Share metastores between different clusters?|Yes||
|Deconstruct workloads?|Replace Hive jobs with Spark jobs||
|Use ADF for data orchestration?|No||

## Next steps

Read the next article in this series:

- [Architecture best practices for on-premises to Azure HDInsight Hadoop migration](apache-hadoop-on-premises-migration-best-practices-architecture.md)
