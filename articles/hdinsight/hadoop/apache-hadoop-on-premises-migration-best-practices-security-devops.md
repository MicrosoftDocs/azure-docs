---
title: Migrate on-premises Apache Hadoop clusters to Azure HDInsight - security and DevOps best practices
description: Learn security and DevOps best practices for migrating on-premises Hadoop clusters to Azure HDInsight.
services: hdinsight
author: hrasheed-msft
ms.reviewer: ashishth
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: hrasheed
---
# Migrate on-premises Apache Hadoop clusters to Azure HDInsight - security and DevOps best practices

This article gives recommendations for security and DevOps in Azure HDInsight systems. It's part of a series that provides best practices to assist with migrating on-premises Apache Hadoop systems to Azure HDInsight.

## Use the Enterprise Security Package to secure and govern the cluster

The Enterprise Security Package (ESP) supports Active Directory-based authentication, multiuser support, and role-based access control. With the ESP option chosen, HDInsight cluster is joined to the Active Directory domain and the enterprise admin can configure role-based access control (RBAC) for Hive security by using Apache Ranger. The admin can also audit the data access by employees and any changes done to access control policies.

ESP features are currently in preview and are available only on the following cluster types: Apache Hadoop, Apache Spark, Apache HBase, Apache Kafka, and Apache Interactive Query.

Use the following steps to deploy the Domain-joined HDInsight cluster:

- Deploy Azure Active Directory (AAD) by passing the Domain name
- Deploy Azure Active Directory Domain Services (AAD DS)
- Create the required Virtual Network and subnet
- Deploy a VM in the Virtual Network to manage AAD DS
- Join the VM to the domain
- Install AD and DNS tools
- Have the AAD DS Administrator create an Organizational Unit (OU)
- Enable LDAPS for AAD DS
- Create a service account in Azure Active Directory with delegated read & write admin permission to the OU, so that it can. This service account can then join machines to the domain and place machine principals within the OU. It can also create service principals within the OU that you specify during cluster creation.

    > [!Note]
    > The service account does not need to be AD domain admin account

- Deploy HDInsight ESP cluster by setting the following parameters:
    - **Domain name**: The domain name that's associated with Azure AD DS.
    - **Domain user name**: The service account in the Azure AD DS DC-managed domain that you created in the previous section, for example: `hdiadmin@contoso.onmicrosoft.com`. This domain user will be the administrator of this HDInsight cluster.
    - **Domain password**: The password of the service account.
    - **Organizational unit**: The distinguished name of the OU that you want to use with the HDInsight cluster, for example: `OU=HDInsightOU,DC=contoso,DC=onmicrosoft,DC=com`. If this OU does not exist, the HDInsight cluster tries to create the OU using the privileges of the service account.
    - **LDAPS URL**: for example, `ldaps://contoso.onmicrosoft.com:636`.
    - **Access user group**: The security groups whose users you want to sync to the cluster, for example: `HiveUsers`. If you want to specify multiple user groups, separate them by semicolon ';'. The group(s) must exist in the directory prior to creating the ESP cluster.

For more information, see the following articles:

- [An introduction to Hadoop security with domain-joined HDInsight clusters](../domain-joined/apache-domain-joined-introduction.md)
- [Plan Azure domain-joined Hadoop clusters in HDInsight](../domain-joined/apache-domain-joined-architecture.md)
- [Configure a domain-joined HDInsight cluster by using Azure Active Directory Domain Services](../domain-joined/apache-domain-joined-configure-using-azure-adds.md)
- [Synchronize Azure Active Directory users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md)
- [Configure Hive policies in Domain-joined HDInsight](../domain-joined/apache-domain-joined-run-hive.md)
- [Run Apache Oozie in domain-joined HDInsight Hadoop clusters](../domain-joined/hdinsight-use-oozie-domain-joined-clusters.md)

## Implement end to end enterprise security management

End to end enterprise security can be achieved using the following controls:

- **Private and protected data pipeline** (perimeter level security):
    - Perimeter level Security can be achieved through Azure Virtual Networks, Network Security Groups, and Gateway service

- **Authentication and authorization for data access**
    - Create Domain-joined HDI cluster using Azure Active Directory Domain Services. (Enterprise Security Package)
    - Use Ambari to provide Role-based access to cluster resources for AD users
    - Use Apache Ranger to set access control policies for Hive at the table / column / row level.
    - SSH access to the cluster can be restricted only to the administrator.

- **Auditing**
    - View and report all access to the HDInsight cluster resources and data.
    - View and report all changes to the access control policies

- **Encryption**
    - Transparent Server-Side encryption using Microsoft-managed keys or customer-managed keys.
    - In Transit encryption using Client-Side encryption, https and TLS

For more information, see the following articles:

- [Azure Virtual Networks overview](../../virtual-network/virtual-networks-overview.md)
- [Azure Network Security Groups overview](../../virtual-network/security-overview.md)
- [Azure Virtual Network peering](../../virtual-network/virtual-network-peering-overview.md)
- [Azure storage security guide](../../storage/common/storage-security-guide.md)
- [Azure Storage Service Encryption at rest](../../storage/common/storage-service-encryption.md)

## Use monitoring & alerting

For more information, see the article:

[Azure Monitor Overview](../../azure-monitor/overview.md)

## Upgrade clusters

Regularly upgrade to the latest HDInsight version to take advantage of the latest features. The following steps can be used to upgrade the cluster to the latest version:

- Create a new TEST HDI cluster using the latest available HDI version.
- Test on the new cluster to make sure that the jobs and workloads work as expected.
- Modify jobs or applications or workloads as required.
- Back up any transient data stored locally on the cluster nodes.
- Delete the existing cluster.
- Create a cluster of the latest HDInsight version in the same VNET subnet, using the same default data and meta store as the previous cluster.
- Import any transient data that was backed up.
- Start jobs/continue processing using the new cluster.

For more information, see the article: [Upgrade HDInsight cluster to a new version](../hdinsight-upgrade-cluster.md)

## Patch cluster operating systems

As a managed Hadoop service, HDInsight takes care of patching the OS of the VMs used by HDInsight clusters.

For more information, see the article: [OS patching for HDInsight](../hdinsight-os-patching.md)

## Post-Migration

1. **Remediate applications** - Iteratively make the necessary changes to the jobs, processes, and scripts
2. **Perform Tests** - Iteratively run functional and performance tests
3. **Optimize** - Address any performance issues based on the above test results and then retest to confirm the performance improvements.

## Appendix: gathering details to prepare for a migration

This section provides template questionnaires to help gather important information about:

- The on-premises deployment.
- Project details.
- Azure requirements.

### On-Premises deployment questionnaire

| **Question** | **Example** | **Answer** |
|---|---|---|
|**Topic**: **Environment**|||
|Cluster Distribution type|Hortonworks, Cloudera, MapR| |
|Cluster Distribution version|HDP 2.6.5, CDH 5.7|
|Big Data eco-system components|HDFS, Yarn, Hive, LLAP, Impala, Kudu, HBase, Spark, MapReduce, Kafka, Zookeeper, Solr, Sqoop, Oozie, Ranger, Atlas, Falcon, Zeppelin, R|
|Cluster types|Hadoop, Spark, Confluent Kafka, Storm, Solr|
|Number of clusters|4|
|Number of Master Nodes|2|
|Number of Worker Nodes|100|
|Number of Edge Nodes| 5|
|Total Disk space|100 TB|
|Master Node configuration|m/y, cpu, disk, etc.|
|Data Nodes configuration|m/y, cpu, disk, etc.|
|Edge Nodes configuration|m/y, cpu, disk, etc.|
|HDFS Encryption?|Yes|
|High Availability|HDFS HA, Metastore HA|
|Disaster Recovery / Back up|Backup cluster?|  
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
|No. of Hive metastores|2||
|No. of Hive tables|100||
|No. of Ranger policies|20||
|No. of Oozie workflows|100||
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
|No. of Administrators|2||
|No. of Developers|10||
|No. of end users|100||
|Skills|Hadoop, Spark||
|No. of available resources for Migration efforts|2||
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
|Domain Joined cluster (ESPP)?|     Yes||
|On-Premises AD Sync to Cloud?|     Yes||
|No. of AD users to sync?|          100||
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
|HDI vs HDP on IaaS?|HDI||

## Next steps

- Read more about [HDInsight 4.0](https://docs.microsoft.com/azure/hdinsight/hadoop/apache-hadoop-introduction)