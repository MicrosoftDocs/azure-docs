<properties urlDisplayName="HDInsight Hadoop Version" pageTitle="What's new in Hadoop cluster versions of HDInsight? | Azure" metaKeywords="hdinsight, hadoop, hdinsight hadoop, hadoop azure" description="HDInsight supports multiple Hadoop cluster versions deployable at any time. See the Hadoop and HortonWorks Data Platform (HDP) distribution versions supported." services="hdinsight" umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" title="" authors="bradsev" documentationCenter=""/>

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/14/2014" ms.author="bradsev" />


#What's new in the Hadoop cluster versions provided by HDInsight?

##HDInsight versions
HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice provisions a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components that are contained within that distribution. The component version associated with each HDInsight cluster version are itemized in the following table. Note that the default cluster version used by Azure HDInsight is currently 3.1, and, as of 11/7/2014, based on HDP 2.1.7.


<table border="1">
<tr><th>Component</th><th>HDInsight Version 3.1 (Default)</th><th>HDInsight Version 3.0</th><th>HDIinsight Version 2.1</th><th>HDInsight Version 1.6</th></tr>
<tr><td>Hortonworks Data Platform (HDP)</td><td>2.1.7</td><td>2.0</td><td>1.3</td><td>1.1</td></tr>
<tr><td>Apache Hadoop & YARN</td><td>2.4.0</td><td>2.2.0</td><td>1.2.0</td><td>1.0.3</td></tr>
<tr><td>Tez</td><td>0.4.0</td><td></td><td></td><td></td></tr>
<tr><td>Apache Pig</td><td>0.12.1</td><td>0.12.0</td><td>0.11.0</td><td>0.9.3</td></tr>
<tr><td>Apache Hive & HCatalog</td><td>0.13.1</td><td>0.12.0</td><td>0.11.0</td><td>0.9.0</td></tr>
<tr><td>HBase </td><td>0.98.0</td><td></td><td></td><td></td></tr>
<tr><td>Apache Sqoop</td><td>1.4.4</td><td>1.4.4</td><td>1.4.3</td><td>1.4.2</td></tr>
<tr><td>Apache Oozie</td><td>4.0.0</td><td>4.0.0</td><td>3.3.2</td><td>3.2.0</td></tr>
<tr><td>Apache HCatalog</td><td>Merged with Hive</td><td>Merged with Hive</td><td>Merged with Hive</td><td>0.4.1</td></tr>
<tr><td>Apache Templeton</td><td>Merged with Hive</td><td>Merged with Hive</td><td>Merged with Hive</td><td>0.1.4</td></tr>
<tr><td>Ambari</td><td>>=1.5.1</td><td>1.4.1</td><td>API v1.0</td><td></td></tr>
<tr><td>Zookeeper</td><td>3.4.5</td><td>3.4.5</td><td></td><td></td></tr>
<tr><td>Storm</td><td>0.9.1</td><td></td><td></td><td></td></tr>
<tr><td>Mahout</td><td>0.9.0</td><td></td><td></td><td></td></tr>
<tr><td>Phoenix</td><td>4.0.0.2.1.7.0-2162</td><td></td><td></td><td></td></tr>
</table>


**Get current component version information**

The component versions associated with HDInsight cluster versions may change in future updates to HDInsight. One way to determine the available components and to verify which versions are being used for a cluster to use the Ambari REST API. The **GetComponentInformation** command can be used to retrieve information about a service component. For details, see the [Ambari documentation][ambari-docs]. Another way to obtain this information is to login to a cluster using remote desktop and examine the contents of the "C:\apps\dist\" directory directly.


**Release notes**	

See [HDInsight Release Notes](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-release-notes/) for additional release notes on the latest versions of HDInsight.

### Select a version when provisioning an HDInsight cluster

When creating a cluster through the HDInsight PowerShell Cmdlets or the HDInsight .NET SDK, you can choose the version for the HDInsight Hadoop cluster using the "Version" parameter.

If you use the **Quick Create** option, you will get the version 3.1 of HDInsight that creates Hadoop cluster by default. If you use the **Custom Create** option from the Azure Portal, you can choose the version of the cluster you will deploy from the **HDInsight Version** drop-down on the **Cluster Details** page. 

##Feature highlights
Azure HDInsight now supports Hadoop 2.4 with HDInsight cluster version 3.1 (using Hortonworks Data Platform 2.1.7) by default. It takes full advantage of the platform to provide a range of significant benefits to customers. These include, most notably:

- **Script Action (Preview)**: The preview of this cluster customization feature enables the modification of Hadoop clusters in arbitrary ways using custom scripts. With this new feature, users can experiment with and deploy projects available from the Apache Hadoop ecosystem to Azure HDInsight clusters. This customization feature is available on all types of HDInsight clusters including Hadoop, HBase and Storm.

- **HBase**: HBase is a low-latency NoSQL database that allows online transactional processing of big data. HBase is offered as a managed cluster integrated into the Azure environment. The clusters are configured to store data directly in Azure Blob storage, which provides low latency and increased elasticity in performance/cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs.

- **Apache Phoenix**: Apache Phoenix is a SQL query layer over HBase. It supports limited subset of SQL query language specification including secondary indexes support. It is delivered as a client-embedded JDBC driver that targets low latency queries over HBase data. Apache Phoenix takes your SQL query, compiles it into a series of HBase scans and coprocessors calls, and produces regular JDBC result sets.Apache Phoenix is a relational database layer over HBase. It is delivered as a client-embedded JDBC driver that targets low latency queries over HBase data. Apache Phoenix takes your SQL query, compiles it into a series of HBase scans, and orchestrates the running of those scans to produce regular JDBC result sets.

- **Cluster Dashboard**: A new web application that is deployed to your HDInsight cluster.  Use it to run Hive Queries, check job logs, and browse Azure Blob storage. The URL used to access the web application is <*ClusterName*>.azurehdinsight.net.

- **Microsoft Avro Library**: This library implements the Apache Avro data serialization system for the Microsoft.NET environment. Apache Avro provides a compact binary data interchange format for serialization. It uses JSON to define language agnostic schema that underwrites language interoperability. Data serialized in one language can be read in another. Currently C, C++, C#, Java, PHP, Python, and Ruby are supported. The Apache Avro serialization format is widely used in Azure HDInsight to represent complex data structures within a Hadoop MapReduce job.

- **YARN**: A new, general-purpose, distributed, application management framework that has replaced the classic Apache Hadoop MapReduce framework for processing data in Hadoop clusters. It effectively serves as the Hadoop operating system, and takes Hadoop from a single-use data platform for batch processing to a multi-use platform that enables batch, interactive, online and stream processing. This new management framework improves scalability and cluster utilization according to criteria such as capacity guarantees, fairness, and service-level agreements.

- **Tez (HDInsight 3.1 only)**: A general-purpose and customizable framework that creates simplified data-processing tasks across both small scale and large-scale workloads in Hadoop. It provides the ability to execute a complex directed acyclic graph (DAG) of tasks for a single job, so that projects in the Apache Hadoop ecosystem such as Apache Hive and Apache Pig can meet requirements for human-interactive response times and extreme throughput at petabyte scale. Note that Hive 0.13 allows Hive queries to run on top of Tez, rather than on MapReduce.

- **High Availability**: A second headnode has been added to the Hadoop clusters deployed by HDInsight to increase the availability of the service. Standard implementations of Hadoop clusters typically have a single headnode. HDInsight removes this single point of failure with the addition of a secondary headnode. The switch to new HA cluster configuration doesn't change the price of the cluster, unless customers provision clusters with extra large head node instead of the default large size node.

- **Hive performance**: Order of magnitude improvements to Hive query response times (up to 40x) and to data compression (up to 80%) using the **Optimized Row Columnar** (ORC) format.

- **Pig, Sqoop, Oozie, Ambari**: Component version upgrades for HDInsight cluster version 3.0 (HDP 2.0/Hadoop 2.2) that provide parity with HDInsight cluster version 2.1 (HDP 1.3/Hadoop 1.2). See the version tables below for specifics.

- **Mahout**: This library of scalable machine-learning algorithms is preinstalled on HDInsight 3.1 Hadoop clusters. So you can run Mahout jobs without the need for any additional cluster configuration.

- **Virtual Network support**: HDInsight clusters can be used with Azure Virtual Network to support isolation of cloud resources or hybrid scenarios that link cloud resources with those in your datacenter.


## Supported versions
The following table lists the versions of HDInsight currently available, the corresponding Hortonworks Data Platform (HDP) versions that they use, and their release dates. When known, their support expiration and deprecation dates will also be provided. Please note  the following:

* Highly available clusters with two head nodes are deployed by default for HDInsight 2.1, 3.0, and 3.1 clusters. They are not available for HDInsight 1.6 clusters.
* Once the support has expired for a particular version, it may not be available through the Azure management portal. The following table indicates which versions are available on the Azure management portal. Cluster versions will continue to be available using the `Version` parameter in the PowerShell [New-AzureHDInsightCluster](http://msdn.microsoft.com/en-us/library/dn593744.aspx) command  and the .NET SDK until its deprecation date. 

<table border="1">
<tr><th>HDInsight Version</th><th>HDP Version</a><th>High Availability</th></th><th>Release Date</th><th>Available on Azure Management Portal</th><th>Support Expiration Date</th><th>Deprecation Date</th></tr>
<tr><td>HDI 3.1</td><td>HDP 2.1</td><td>Yes</td><td></td><td>Yes</td><td></td><td></td></tr>
<tr><td>HDI 3.0</td><td>HDP 2.0</td><td>Yes</td><td>02/11/2014</td><td>Yes</td><td>09/17/2014</td><td>06/30/2015</td></tr>
<tr><td>HDI 2.1</td><td>HDP 1.3</td><td>Yes</td><td>10/28/2013</td><td>No</td><td>05/12/2014</td><td>05/31/2015</td></tr>
<tr><td>HDI 1.6</td><td>HDP 1.1</td><td>No</td><td>10/28/2013</td><td>No</td><td>04/26/2014</td><td>05/31/2015</td></tr>
</table><br>

**Deployment of non-default clusters**	

Creation of HDInsight 3.1 clusters on Hadoop 2.4 is supported by the Azure Portal, the HDInsight SDK, and by Azure PowerShell. Note that HDInsight 3.1 clusters are created by default on Hadoop 2.4, so the users must use the **Custom Create** option in the portal to specify other HDInsight cluster versions if they need to be created.

### The Service-Level Agreement (SLA) for HDInsight cluster versions

The SLA is defined in terms of a "Support Window". A Support Window refers to the period of time that an HDInsight cluster version is supported by Microsoft Customer Support.  An HDInsight cluster is outside the Support Window if its version has a **Support Expiration Date** past the current date.  A list of supported HDInsight cluster versions may be found in the table above.  The support expiration date for a given HDInsight version X (once a newer X+1 version is available) is calculated as the later of:  

- Formula 1:  Add 180 days to the date HDInsight cluster version X was released
- Formula 2: Add 90 days to the date HDInsight cluster version X+1 (the subsequent version after X) is made available in the Azure Management Portal.

The **Deprecation Date** is the date after which the cluster version can not be created on HDInsight.

> [AZURE.NOTE] Both HDInsight 2.1 and 3.0 cluster run on Azure Guest OS [Family 4](http://msdn.microsoft.com/en-us/library/azure/ee924680.aspx#explanation) which uses the 64-bit version of Windows Server 2012 R2 and supports .NET Framework 4.0, 4.5. and 4.5.1. 

## Hortonworks release notes associated with HDInsight versions##

* HDInsight cluster version 3.1 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 2.1.7][hdp-2-1-7].This is the default Hadoop cluster created when using the Azure HDInsight portal after 11/7/2014. HDInsight 3.1 clusters created before 11/7/2014 were based on the [Hortonworks Data Platform 2.1.1][hdp-2-1-1] 

* HDInsight cluster version 3.0 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 2.0][hdp-2-0-8].

* HDInsight cluster version 2.1 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 1.3][hdp-1-3-0]. 

* HDInsight cluster version 1.6 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 1.1][hdp-1-1-0]. 


[image-hdi-versioning-versionscreen]: ./media/hdinsight-component-versioning/hdi-versioning-version-screen.png

[wa-forums]: http://azure.microsoft.com/en-us/support/forums/

[connect-excel-with-hive-ODBC]: ../hdinsight-connect-excel-hive-ODBC-driver/

[hdp-2-1-7]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.7-Win/bk_releasenotes_HDP-Win/content/ch_relnotes-HDP-2.1.7.html

[hdp-2-1-1]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.1/bk_releasenotes_hdp_2.1/content/ch_relnotes-hdp-2.1.1.html

[hdp-2-0-8]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.8.0/bk_releasenotes_hdp_2.0/content/ch_relnotes-hdp2.0.8.0.html

[hdp-1-3-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.3.0_1.html

[hdp-1-1-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/bk_releasenotes_HDP-Win/content/ch_relnotes-hdp-win-1.1.0_1.html

[ambari-docs]: https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md

[zookeeper]: http://zookeeper.apache.org/ 
