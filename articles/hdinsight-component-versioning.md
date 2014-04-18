<properties linkid="manage-services-hdinsight-version" urlDisplayName="HDInsight Hadoop Version" pageTitle="What's new in the cluster versions provided by HDInsight? | Azure" metaKeywords="hdinsight, hadoop, hdinsight hadoop, hadoop azure" description="HDInsight supports multiple Hadoop cluster versions deployable at any time. See the Hadoop and HortonWorks Data Platform (HDP) distribution versions supported." services="HDInsight" umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" title="What's new in the cluster versions provided by HDInsight?" authors="bradsev" />


#What's new in the cluster versions provided by HDInsight?

Azure HDInsight now supports Hadoop 2.2 with HDinsight cluster version 3.0 and takes full advantage of this platform to provide a range of significant benefits to customers. These include, most notably:

- **Microsoft Avro Library**: This library implements the Apache Avro data serialization system for the Microsoft.NET environment. Apache Avro provides a compact binary data interchange format for serialization. It uses JSON to define language agnostic schema that underwrites language interoperability. Data serialized in one language can be read in another. Currently C, C++, C#, Java, PHP, Python, and Ruby are supported. The Apache Avro serialization format is widely used in Azure HDInsight to represent complex data structures within a Hadoop MapReduce job.

- **YARN**: A new, general-purpose, distributed, application management framework that has replaced the classic Apache Hadoop MapReduce framework for processing data in Hadoop clusters. It effectively serves as the Hadoop operating system, and takes Hadoop from a single-use data platform for batch processing to a multi-use platform that enables batch, interactive, online and stream processing. This new management framework improves scalability and cluster utilization according to criteria such as capacity guarantees, fairness, and service-level agreements.

- **High Availability**: A second head node has been added to the Hadoop clusters deployed by HDInsight to increase the availability and reliability of the service needed to manage enterprise workloads. Standard implementations of Hadoop clusters typically have a single head node. These clusters are designed to manage the failure of worker nodes smoothly, but jobs will fail if the head node fails. HDInsight removes this single point of failure with the addition of a secondary head node. [ZooKeeper](http://zookeeper.apache.org/) nodes have been added to monitor the health of the cluster to insure that worker nodes know when to fail over to the secondary head node when the primary head node become inactive.

- **Hive performance**: Order of magnitude improvements to Hive query response times (up to 40x) and to data compression (up to 80%) using the **Optimized Row Columnar** (ORC) format.

- **Pig, Sqoop, Qozie, Ambari**: Component version upgrades for HDinsight cluster version 3.0 (HDP 2.0) that provide parity with HDinsight cluster version 2.1 (HDP 1.3). See the version tables below for specifics. Note that Hbase, Mahout, Flume are not included.

**Deployment**	
Creation of HDInsight 3.0 clusters on Hadoop 2.2 is supported by the Azure Portal, the HDinsight SDK, and by Azure PowerShell.

**Global Availability**		
With the release of Azure HDInsight on Hadoop 2.2, Microsoft has make HDInsight available in all major Azure geographies with the exception of Greater China. Specifically, west Europe and southeast Asia data centers have been brought online. This enables customers to locate clusters in a data center that is close and potentially in a zone of similar compliance requirements. 

**Breaking Changes**	
Only the "wasb://" syntax is supported in HDInsight 3.0 clusters. The older "asv://" syntax is supported in HDInsight 2.1 and 1.6 clusters, but it is not supported in HDInsight 3.0 clusters and it will not be supported in later versions. This means that any jobs submitted to an HDInsight 3.0 cluster that explicitly use the “asv://” syntax will fail. The wasb:// syntax should be used instead. Also, jobs submitted to any HDInsight 3.0 clusters that are created with an existing metastore that contains explicit references to resources using the asv:// syntax will fail. These metastores will need to be recreated using the wasb:// to address resources.

##HDInsight versions
HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice provisions a specific version of the HortonWorks Data Platform (HDP) distribution and a set of components that are contained within that distribution.

###Cluster version 3.0

Azure HDInsight now supports Hadoop 2.2. It is based on the Hortonworks Data Platform version 2.0 and provides Hadoop services with the component versions itemized in the following table:

<table border="1">
<tr><th>Component</th><th>Version</th></tr>
<tr><td>Apache Hadoop</td><td>2.2.0</td></tr>
<tr><td>Apache Hive</td><td>0.12.0</td></tr>
<tr><td>Apache Pig</td><td>0.12</td></tr>
<tr><td>Apache Sqoop</td><td>1.4.4</td></tr>
<tr><td>Apache Oozie</td><td>4.0.0</td></tr>
<tr><td>Apache HCatalog</td><td>Merged with Hive</td></tr>
<tr><td>Apache Templeton</td><td>Merged with Hive</td></tr>
<tr><td>Ambari</td><td>API v1.0</td></tr>
</table>

###Cluster version 2.1

The default cluster version used by [Azure HDInsight](http://go.microsoft.com/fwlink/?LinkID=285601) is 2.1. It is based on the Hortonworks Data Platform version 1.3.0 and provides Hadoop services with the component versions itemized in the following table:

<table border="1">
<tr><th>Component</th><th>Version</th></tr>
<tr><td>Apache Hadoop</td><td>1.2.0</td></tr>
<tr><td>Apache Hive</td><td>0.11.0</td></tr>
<tr><td>Apache Pig</td><td>0.11</td></tr>
<tr><td>Apache Sqoop</td><td>1.4.3</td></tr>
<tr><td>Apache Oozie</td><td>3.2.2</td></tr>
<tr><td>Apache HCatalog</td><td>Merged with Hive</td></tr>
<tr><td>Apache Templeton</td><td>Merged with Hive</td></tr>
<tr><td>Ambari</td><td>API v1.0</td></tr>
</table>


###Cluster version 1.6

[Azure HDInsight](http://go.microsoft.com/fwlink/?LinkID=285601) cluster version 1.6 is also available. It is based on the Hortonworks Data Platform version 1.1.0 and provides Hadoop services with the component versions itemized in the following table:

<table border="1">
<tr><th>Component</th><th>Version</th></tr>
<tr><td>Apache Hadoop</td><td>1.0.3</td></tr>
<tr><td>Apache Hive</td><td>0.9.0</td></tr>
<tr><td>Apache Pig</td><td>0.9.3</td></tr>
<tr><td>Apache Sqoop</td><td>1.4.2</td></tr>
<tr><td>Apache Oozie</td><td>3.2.0</td></tr>
<tr><td>Apache HCatalog</td><td>0.4.1</td></tr>
<tr><td>Apache Templeton</td><td>0.1.4</td></tr>
<tr><td>SQL Server JDBC Driver</td><td>3.0</td></tr>
</table>


### Select a version when provisioning an HDInsight cluster

When creating a cluster through the HDInsight PowerShell Cmdlets or the HDInsight .NET SDK, you can choose the version for the HDInsight Hadoop cluster using the "Version" parameter.

If you use the **Quick Create** option, you will get the version 2.1 of HDInsight Hadoop cluster by default. If you use the **Custom Create** option from the Azure Portal, you can choose the version of the cluster you will deploy from the **HDInsight Version** drop-down on the **Cluster Details** page. Version 3.0 of HDInsight Hadoop cluster is only available as an option on the **Custom Create** wizard.

![HDI.Versioning.VersionScreen][image-hdi-versioning-versionscreen]


## Supported versions
The following table lists the versions of HDInsight currently available, the corresponding Hortonworks Data Platform (HDP) versions that they use, and their release dates. When known, their deprecation dates will also be provided. Highly available clusters with two head nodes are deployed by default for HDInsight 2.1 and 3.0 clusters. They are not available for HDInsight 1.6 clusters.

<table border="1">
<tr><th>HDInsight version</th><th>HDP version</a><th>High Availability</th></th><th>Release date</th></tr>
<tr><td>HDI 3.0</td><td>HDP 2.0</td><td>No</td><td>02/11/2014</td></tr>
<tr><td>HDI 2.1</td><td>HDP 1.3</td><td>Yes</td><td>10/28/2013</td></tr>
<tr><td>HDI 1.6</td><td>HDP 1.1</td><td>Yes</td><td>10/28/2013</td></tr>
</table><br/>


### The Service-Level Agreement (SLA) for HDInsight cluster versions 
The SLA is defined in terms of a "Support Window". A Support Window refers to the period of time that an HDInsight cluster version is supported by Microsoft Customer Support.  An HDInsight cluster is outside the Support Window if its version has a Support Expiration Date past the current date.  A list of supported HDInsight cluster versions may be found in the table above.  The Support Expiration Date for a given HDInsight version (denoted as version X) is calculated as the later of:  

- Formula 1:  Add 180 days to the date HDInsight cluster version X was released
- Formula 2: Add 90 days to the date HDInsight cluster version X+1 (the subsequent version after X) is made available in the Azure Management Portal.

> [WACOM.NOTE] Both HDInsight 2.1 and 3.0 cluster run on Azure Guest OS [Family 4](http://msdn.microsoft.com/en-us/library/azure/ee924680.aspx#explanation) which currently uses the 64-bit version of Windows Server 2012 R2 and supports .NET Framework 4.0, 4.5. and 4.5.1. 

**Additional notes and information on versioning**	

* The SQL Server JDBC Driver is used internally by HDInsight and is not used for external operations. If you wish to connect to HDInsight using ODBC, please use the Microsoft Hive ODBC driver. For more information on using Hive ODBC, [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][connect-excel-with-hive-ODBC].

* HDInsight cluster version 3.0 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 2.0][hdp-2-0-8].

* HDInsight cluster version 2.1 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 1.3][hdp-1-3-0]. This is the default Hadoop cluster created when using the Azure HDInsight portal.

* HDInsight cluster version 1.6 uses an Hadoop distribution that is based on the [Hortonworks Data Platform 1.1][hdp-1-1-0]. 

* The component versions associated with HDInsight cluster versions may change in future updates to HDInsight. One way to determine the available components and to verify which versions are being used for a cluster to use the Ambari REST API. The GetComponentInformation command can be used to retrieve information about a service component. For details, see the [Ambari documentation][ambari-docs]. Another way to obtain this information is to login to a cluster using remote desktop and examine the contents of the "C:\apps\dist\" directory directly.

[image-hdi-versioning-versionscreen]: ./media/hdinsight-component-versioning/hdi-versioning-version-screen.png

[wa-forums]: http://www.windowsazure.com/en-us/support/forums/

[connect-excel-with-hive-ODBC]: /en-us/documentation/articles/hdinsight-connect-excel-hive-ODBC-driver

[hdp-2-0-8]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.8.0/bk_releasenotes_hdp_2.0/content/ch_relnotes-hdp2.0.8.0.html

[hdp-1-3-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.3.0_1.html

[hdp-1-1-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/bk_releasenotes_HDP-Win/content/ch_relnotes-hdp-win-1.1.0_1.html

[ambari-docs]: https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md
