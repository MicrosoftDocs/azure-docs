<properties
	pageTitle="Release notes for Hadoop components on Azure HDInsight | Microsoft Azure"
	description="Latest release notes and versions of Hadoop components for Azure HDInsight. Get development tips and details for Hadoop, Apache Storm, and HBase."
	services="hdinsight"
	documentationCenter=""
	editor="cgronlun"
	manager="paulettm"
	authors="nitinme"
	tags="azure-portal"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="nitinme"/>


# Release notes for Hadoop components on Azure HDInsight

## Notes for 07/21/2016 release of HDInsight

The full version numbers for Linux-based HDInsight clusters deployed with this release:

|HDI |HDI cluster version	|HDP |HDP Build   |Ambari Build |
|----|----------------------|----|------------|-------------|
|3.2 |3.2.1000.0.7932505	|2.2 |2.2.9.1-11  |2.2.1.12-2   |
|3.3 |3.3.1000.0.7932505	|2.3 |2.3.3.1-18  |2.2.1.12-2   |
|3.4 |3.4.1000.0.7933003	|2.4 |2.4.2.0     |2.2.1.12-2   |

The full version numbers for Windows-based HDInsight clusters deployed with this release:

|HDI |HDI cluster version	|HDP |HDP Build     |
|----|----------------------|----|--------------|
|2.1 |2.1.10.989.2441725    |1.3 |1.3.12.0-01795|
|3.0 |3.0.6.989.2441725 	|2.0 |2.0.13.0-2117 |
|3.1 |3.1.4.989.2441725		|2.1 |2.1.16.0-2374 |
|3.2 |3.2.7.989.2441725		|2.2 |2.2.9.1-11    |
|3.3 |3.3.0.989.2441725		|2.3 |2.3.3.1-21    |

## Notes for 07/07/2016 release of HDInsight

The full version numbers for Linux-based HDInsight clusters deployed with this release:

|HDI |HDI cluster version	|HDP |HDP Build   |
|----|----------------------|----|------------|
|3.2 |3.2.1000.0.7864996	|2.2 |2.2.9.1-11  |
|3.3 |3.3.1000.0.7864996	|2.3 |2.3.3.1-18  |
|3.4 |3.4.1000.0.7861906	|2.4 |2.4.2.0     |

The full version numbers for Windows-based HDInsight clusters deployed with this release:

|HDI |HDI cluster version	|HDP |HDP Build     |
|----|----------------------|----|--------------|
|2.1 |2.1.10.977.2413853    |1.3 |1.3.12.0-01795|
|3.0 |3.0.6.977.2413853 	|2.0 |2.0.13.0-2117 |
|3.1 |3.1.4.977.2413853		|2.1 |2.1.16.0-2374 |
|3.2 |3.2.7.977.2413853		|2.2 |2.2.9.1-11    |
|3.3 |3.3.0.977.2413853		|2.3 |2.3.3.1-21    |

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example Spark, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| [HDInsight Tools for IntelliJ](hdinsight-apache-spark-intellij-tool-plugin.md) | IntelliJ IDEA plugin for HDInsight Spark clusters is now integrated with Azure Toolkit for IntelliJ. It supports Azure SDK v2.9.1, latest Java SDKs, and includes all the features from the standalone HDInsight Plugin for IntelliJ.| Tools    | Spark| N/A|
| [HDInsight Tools for Eclipse](hdinsight-apache-spark-eclipse-tool-plugin.md) | Azure Toolkit for Eclipse now supports HDInsight Spark clusters. It enables the following features. <ul><li>Create and write a Spark application easily in Scala and Java with first class authoring support for IntelliSense, auto format, error checking, etc.</li><li>Test the Spark application locally.</li><li>Submit jobs to HDInsight Spark cluster and retrieve the results.</li><li>Log into Azure and access all the Spark clusters associated with your Azure subscriptions.</li><li>Navigate all the associated storage resources of your HDInsight Spark cluster.</li></ul>| Tools    | Spark| N/A

Starting with this release, we have changed the guest OS patching policy for Linux-based HDInsight clusters. The goal of the new policy is to significantly reduce the number of reboots due to patching. The new policy will continue to patch virtual machines (VMs) on Linux clusters every Monday or Thursday starting at 12AM UTC in a staggered fashion across nodes in any given cluster. However, any given VM will only reboot at most once every 30 days due to guest OS patching. In addition, the first reboot for a newly created cluster will not happen sooner than 30 days from the cluster creation date.

>[AZURE.NOTE] These changes will only apply to newly created clusters equal or greater than this release version.

## Notes for 06/06/2016 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

|HDP	|HDI Version	|Spark Version	|Ambari Build Number	|HDP Build Number|
|-------|---------------|---------------|-----------------------|----------------|
|2.3	|3.3.1000.0.7702215|	1.5.2|	2.2.1.8-2|	2.3.3.1-18|
|2.4	|3.4.1000.0.7702224|	1.6.1|	2.2.1.8-2|	2.4.2.0|


This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example Spark, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Spark on HDInsight is generally available | This release brings improvements in availability, scalability, and productivity to open source Apache Spark on HDInsight. <ul><li>Industry leading availability SLA of 99.9% which makes it suitable for demanding enterprise workloads.</li><li>Scalable storage layer using Azure Data Lake Store.</li><li>Productivity tools for every phase of data exploration and developement. Jupyter notebooks with customized Spark kernel enable interactive data exploration, integration with BI dashboards like Power BI, Tableau and Qlik is good for quick data sharing and continuous reporting, IntelliJ plugin is reliable option for long term code artifact development and debugging.</li></ul>| Service    | Spark| N/A|
| HDInsight Tools for IntelliJ | This is an IntelliJ IDEA plugin for HDInsight Spark clusters. It enables the following features.<ul><li>Create and write a Spark application easily in Scala and Java with first class authoring support for IntelliSense, auto format, error checking, etc.</li><li>Test the Spark application locally.</li><li>Submit jobs to HDInsight Spark cluster and retrieve the results.</li><li>Log into Azure and access all the Spark clusters associated with your Azure subscriptions.</li><li>Navigate all the associated storage resources of your HDInsight Spark cluster.</li><li>Navigate all the jobs history and job information for your HDInsight Spark cluster.</li><li>Debug Spark jobs remotely from your desktop computer.</li></ul>| Tools    | Spark| N/A

## Notes for 05/13/2016 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.875.2159884 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.875.2159884 (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.922.2266903  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.922.2266903  (HDP 2.2.9.1-11)
* HDInsight (Windows)		3.3.0.922.2266903  (HDP 2.3.3.1-18)
* HDInsight	(Linux)			3.2.1000.0.7565644   (HDP	2.2.9.1-11)
* HDInsight (Linux)			3.3.1000.0.7565644   (HDP 2.3.3.1-18)
* HDInsight (Linux)			3.4.1000.0.7548380   (HDP 2.4.2.0)

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example Spark, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Spark version update and other bug fixes | This release updates the Spark version in HDInsight cluster to 1.6.1, and fixes other bugs| Service    | Spark| N/A

## Notes for 04/11/2016 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.889.2191206 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.889.2191206 (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.889.2191206  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.889.2191206  (HDP 2.2.9.1-10)
* HDInsight (Windows)		3.3.0.889.2191206  (HDP 2.3.3.1-16 -unchanged)
* HDInsight	(Linux)			3.2.1000.0.7339916   (HDP 2.2.9.1-10)
* HDInsight (Linux)			3.3.1000.0.7339916   (HDP 2.3.3.1-16)
* HDInsight (Linux)			3.4.1000.0.7338911   (HDP 2.4.1.1-3)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Custom metastore upgrade issues for HDI 3.4 | Cluster creation would fail if you used a custom metastore, which was previously used on a lower version of another HDInsight cluster. This was due to a upgrade script error that has now been fixed| Cluster creation    | All | N/A
| Livy Crash Recovery | Provides job status resiliency for any job submitted through Livy | Reliability | Spark on Linux| N/A
| Jupyter Content HA | Provides the ability to save and load Jupyter notebook contents to and from the storage account associated with the cluster. For more information, see [Kernels available for Jupyter notebooks](hdinsight-apache-spark-jupyter-notebook-kernels.md).| Notebooks | Spark on Linux| N/A
| Removal of hiveContext in Jupter Notebooks | Use `%%sql` magic instead of `%%hive` magic. SqlContext is equivalent to hiveContext. For more information, see [Kernels available for Jupyter notebooks](hdinsight-apache-spark-jupyter-notebook-kernels.md)| Notebooks    | Spark clusters on Linux| N/A
| Deprecation of older Spark versions | Older version Spark 1.3.1 will be removed from the service on 5/31 | Service | Spark clusters on Windows | N/A

## Notes for 03/29/2016 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.875.2159884 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.875.2159884 (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.875.2159884  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.875.2159884  (HDP 2.2.9.1-7 - unchanged)
* HDInsight (Windows)		3.3.0.875.2159884  (HDP 2.3.3.1-16)
* HDInsight	(Linux)			3.2.1000.0.7193255   (HDP	2.2.9.1-8 - unchanged)
* HDInsight (Linux)			3.3.1000.0.7193255   (HDP 2.3.3.1-7 - unchanged)
* HDInsight (Linux)			3.4.1000.0.7195842   (HDP 2.4.1.0-327)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Added HDInsight 3.4 version and updated HDP versions for all HDInsight clusters | With this release, we have added HDInsight v3.4 (based on HDP 2.4) and have also updated other HDP versions. HDP 2.4 release notes are available [here](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.4.0/bk_HDP_RelNotes/content/ch_relnotes_v240.html) and more information on HDInsight versions can be found [here](hdinsight-component-versioning.md).| Service    | All Linux clusters| N/A
| HDInsight Premium | HDInsight is now available in two categories - Standard and Premium. HDInsight Premium is currently in Preview and available only for Hadoop and Spark clusters on Linux. For more information see [here](hdinsight-component-versioning.md#hdinsight-standard-and-hdinsight-premium).| Service    | Hadoop and Spark on Linux| N/A
| Microsoft R Server | HDInsight Premium provides Microsoft R Server that can be included with Hadoop and Spark clusters on Linux. For more information see [Overview of R Server on HDInsight](hdinsight-hadoop-r-server-overview.md).| Service    | Hadoop and Spark on Linux| N/A
| Spark 1.6.0 | HDInsight 3.4 clusters now include Spark 1.6.0| Service    | Spark clusters on Linux| N/A
| Jupyter notebook enhancements | Jupyter notebooks available with Spark clusters now provide additional Spark kernels. They also include enhancements like use of %%magic, auto-visualization, and integration with Python visualization libraries (such as matplotlib). For more information, see [Kernels available for Jupyter notebooks](hdinsight-apache-spark-jupyter-notebook-kernels.md). | Service | Spark clusters on Linux | N/A

## Notes for 03/22/2016 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.875.2159884 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.875.2159884 (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.875.2159884  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.875.2159884  (HDP 2.2.9.1-7 - unchanged)
* HDInsight (Windows)		3.3.0.875.2159884  (HDP 2.3.3.1-16)
* HDInsight	(Linux)			3.2.1000.0.7193255   (HDP	2.2.9.1-8 - unchanged)
* HDInsight (Linux)			3.3.1000.0.7193255   (HDP 2.3.3.1-7 - unchanged)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Updated HDInsight versions for all HDInsight clusters | With this release, we have updated HDInsight versions for all HDInsight clusters| Service    | All| N/A


## Notes for 03/10/2016 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.859.2123216 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.859.2123216 (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.859.2123216  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.859.2123216  (HDP 2.2.9.1-7)
* HDInsight (Windows)		3.3.0.859.2123216  (HDP 2.3.3.1-5 - unchanged)
* HDInsight	(Linux)			3.2.1000.7076817   (HDP	2.2.9.1-8)
* HDInsight (Linux)			3.3.1000.7076817   (HDP 2.3.3.1-7)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Updated HDInsight versions for all HDInsight clusters | With this release, we have updated HDInsight versions for all HDInsight clusters| Service    | All| N/A

## Notes for 01/27/2016 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.817.2028315 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.817.2028315 (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.817.2028315  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.817.2028315  (HDP 2.2.9.1-1)
* HDInsight (Windows)		3.3.0.817.2028315  (HDP 2.3.3.1-5 - unchanged)
* HDInsight	(Linux)			3.2.1000.4072335   (HDP	2.2.9.1-1)
* HDInsight (Linux)			3.3.1000.4072335   (HDP 2.3.3.1-1)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Updated HDInsight versions for all HDInsight clusters | With this release, we have updated HDInsight versions for all HDInsight clusters| Service    | All| N/A

## Notes for 12/02/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.763.1931434 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.763.1931434 (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.763.1931434  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.763.1931434  (HDP 2.2.7.1-34 - unchanged)
* HDInsight (Windows)		3.3.1000.0		   (HDP 2.3.3.1-5)
* HDInsight	(Linux)			3.2.1000.0.6392801 (HDP	2.2.7.1-34 - unchanged)
* HDInsight (Linux)			3.3.1000.0		   (HDP 2.3.3.0-3039)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Added HDInsight 3.3 version and updated HDP versions for all HDInsight clusters | With this release, we have added HDInsight v3.3 (based on HDP 2.3) and have also updated other HDP versions. HDP 2.3 release notes are available [here](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.3.0/bk_HDP_RelNotes/content/ch_relnotes_v230.html) and more information on HDInsight versions can be found [here](hdinsight-component-versioning.md).| Service    | All| N/A

## Notes for 11/30/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.757.1923908 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.757.1923908  (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.757.1923908  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.757.1923908  (HDP 2.2.7.1-34)
* HDInsight	(Linux)			3.2.1000.0.6392801 (HDP	2.2.7.1-34)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Updated HDInsight versions for all HDInsight clusters and HDP versions for HDInsight 3.2 clusters (Windows and Linux) | With this release, HDInsight and HDP versions have been updated | Service    | All| N/A


## Notes for 10/27/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight	(Windows)	 	2.1.10.726.1866228 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight	(Windows)	 	3.0.6.726.1866228  (HDP 2.0.13.0-2117 - unchanged)
* HDInsight	(Windows)	 	3.1.4.726.1866228  (HDP 2.1.15.0-2374 - unchanged)
* HDInsight	(Windows)		3.2.7.726.1866228  (HDP 2.2.7.1-33)
* HDInsight	(Linux)			3.2.1000.0.6035701 (HDP	2.2.7.1-33)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Updated HDInsight versions for all HDInsight clusters (Windows and Linux) | With this release, HDInsight and HDP versions have been updated | Service    | All| N/A
| Fixed Jupyter for Windows Spark clusters with capital letters clusters | Clusters that had DNS names specified in capital letters had issues with Jupyter notebooks due to an origin request check. The fix was to change the DNS name for Jupyter's configuration to lower case. | Service    | HDInsight Spark (Windows)| N/A


## Notes for 10/20/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.716.1846990 (Windows)	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.716.1846990 (Windows)  	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.4.716.1846990 (Windows)  	(HDP 2.1.16.0-2374)
* HDInsight		3.2.7.716.1846990 (Windows)  	(HDP 2.2.7.1-0004)
* HDInsight		3.2.1000.0.5930166 (Linux)		(HDP 2.2.7.1-0004)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Default HDP version changed to HDP 2.2 | The default version for HDInsight Windows clusters is changed to HDP 2.2. HDInsight version 3.2 (HDP 2.2) has been generally available in since February 2015. This change only flips the default cluster version, when an explicit selection has not been made while provisioning the cluster using the Azure portal, PowerShell cmdlets, or the SDK. | Service    | All| N/A                  |
|Changes in VM name format for deploying multiple HDInsight on Linux clusters in a single Virtual Network | Support for deploying multiple HDInsight Linux clusters in a single virtual network is being added in this release. As part of this, the format of virtual machine names in the cluster has changed from headnode\*, workernode\* and zookeepernode\* to hn\*, wn\*, and zk\* respectively. It is not a recommended practice to take a direct dependency on the format of virtual machine names, since this is subject to change. Please use "hostname -f" on the local machine or Ambari APIs to determine the list of hosts, and the mapping of components to hosts. You can find more info at [https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/hosts.md](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/hosts.md) and [https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/host-components.md](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/host-components.md). | Service | HDInsight clusters on Linux | N/A |
| Configuration changes | For HDInsight 3.1 clusters, the following configurations are now enabled: <ul><li>tez.yarn.ats.enabled and yarn.log.server.url. This enables the Application Timeline Server and the Log server to be able to serve out logs.</li></ul>For HDInsight 3.2 clusters, the following configurations have been modified: <ul><li>mapreduce.fileoutputcommitter.algorithm.version has been set to 2. This enables use of the V2 version of the FileOutputCommitter.</li></ul> | Service | All | N/A |


## Notes for 09/09/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.675.1768697 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.675.1768697  (HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.4.675.1768697  (HDP 2.1.15.0-2334 - unchanged)
* HDInsight		3.2.6.675.1768697  (HDP 2.2.6.1-0012 - unchanged)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Updated HDInsight versions for all HDInsight clusters | With this release, HDInsight versions have been updated | Service    | All| N/A                  |

## Notes for 07/31/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.640.1695824 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.640.1695824  (HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.4.640.1695824  (HDP 2.1.15.0-2334 - unchanged)
* HDInsight		3.2.6.640.1695824  (HDP 2.2.6.1-0012 - unchanged)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Fix Spark cluster node re-imaging workflow | Fixed a bug that was causing Spark cluster nodes to not recover after re-image | Service    | Spark| N/A                  |


## Notes for 07/31/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.635.1684502 (HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.635.1684502  (HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.4.635.1684502  (HDP 2.1.15.0-2334 - unchanged)
* HDInsight		3.2.6.635.1684502  (HDP 2.2.6.1-0012 - unchanged)
* SDK			1.5.8

This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Updated HDInsight versions for all HDInsight clusters | With this release, HDInsight versions have been updated | Service    | All| N/A                  |


## Notes for 07/07/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.610.1630216	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.610.1630216	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.4.610.1630216	(HDP 2.1.15.0-2334 - unchanged)
* HDInsight		3.2.4.610.1630216	(HDP 2.2.6.1-0012)
* SDK			1.5.8


This release contains the following updates.

| Title                                           | Description                                          | Impacted Area (for example, Service, component, or SDK) | Cluster Type (for example, Hadoop, HBase, or Storm) | JIRA (if applicable) |
|-------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|----------------------|
| Updated HDP versions for HDInsight 3.2 clusters | With this release, HDInsight 3.2 deploys HDP 2.2.6.1-0012 | Service    | All                                                 | N/A                  |


## Notes for 06/26/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.601.1610731	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.601.1610731	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.4.601.1610731	(HDP 2.1.15.0-2334 - unchanged)
* HDInsight		3.2.4.601.1610731	(HDP 2.2.6.1-0011)
* SDK			1.5.8


This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Updated HDP versions for HDInsight 3.2 clusters</td>
<td>With this release, HDInsight 3.2 deploys HDP 2.2.6.1</td>
<td>Service</td>
<td>All</td>
<td>N/A</td>
</tr>

</table>

## Notes for 06/18/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.596.1601657	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.596.1601657	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.4.596.1601657	(HDP 2.1.15.0-2334)
* HDInsight		3.2.4.596.1601657	(HDP 2.2.6.1-0002)
* SDK			1.5.8


This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Additional HTTPS ports opened</td>
<td>The cloud service now opens 5 ports 8001 to 8005 on the cluster E.g. at https://<clustername>.azurehdinsight.net:8001/. Requests to these URLs are authenticated using the same basic authentication password mechanism as port 443. These ports bind to the same port on the active headnode. Script actions can be used to make customer services listen on these ports on the headnode and route to outside the  cluster.</td>
<td>Cloud Service</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>Intermittent MapReduce shuffle issue for HDInsight 3.2</td>
<td>Fix for a rare, intermittent race condition  in Map Reduce Shuffle on large clusters resulting in occassional task failures. See <a href="https://issues.apache.org/jira/browse/MAPREDUCE-6361" target="_blank">MAPREDUCE-6361</a> for more information.</td>
<td>Hadoop Core</td>
<td>All</td>
<td><a href="https://issues.apache.org/jira/browse/MAPREDUCE-6361" target="_blank">MAPREDUCE-6361</a></td>
</tr>

<tr>
<td>Move to Latest Azure Java SDK 2.2 for HDInsight 3.2</td>
<td>Moved to latest version of the Azure SDK for Java used by the WASB driver. The latest SDK has a few fixes and the release notes for the same are available at https://github.com/Azure/azure-storage-java/blob/master/ChangeLog.txt.</td>
<td>Hadoop Core</td>
<td>All</td>
<td><a href="https://issues.apache.org/jira/browse/HADOOP-11959" target="_blank">HADOOP-11959</a></td>
</tr>

<tr>
<td>Move to HDP 2.1.15 for HDInsight 3.1 clusters</td>
<td>Hortonworks release notes for the release are available <a href="http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.15-Win/bk_releasenotes_HDP-Win/content/ch_relnotes-HDP-2.1.15.html" target="_blank">here</a>.</td>
<td>HDP</td>
<td>All</td>
<td>N/A</td>
</tr>

</table>

## Notes for 06/04/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.583.1575584	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.583.1575584	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.3.583.1575584	(HDP 2.1.12.1-0003 - unchanged)
* HDInsight		3.2.4.583.1575584	(HDP 2.2.6.1-1)
* SDK			1.5.8


This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Fix for 502 bad gateway error for Storm clusters</td>
<td>This release fixes a bug affecting the job submission API that caused the website to be down after a reboot.</td>
<td>Service</td>
<td>Storm</td>
<td>N/A</td>
</tr>

</table>

## Notes for 06/01/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.577.1563827	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.577.1563827	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.3.577.1563827	(HDP 2.1.12.1-0003 - unchanged))
* HDInsight		3.2.4.577.1563827	(HDP 2.2.6.0-2800 - unchanged)
* SDK			1.5.8


This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Various bug fixes</td>
<td>This release fixes bugs related to cluster provisioning.</td>
<td>Service</td>
<td>All cluster types</td>
<td>N/A</td>
</tr>

</table>

## Notes for 05/27/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight		3.2.4.570.1554102	(HDP 2.2.6.0-2800)
* Other cluster versions and SDK are not deployed as part of this release.


This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>HDP 2.2 update</td>
<td>This release of HDInsight 3.2 contains HDP 2.2.6, and brings several important bug fixes to HDInsight. The full release notes is available at <a href="http://dev.hortonworks.com.s3.amazonaws.com/HDPDocuments/HDP2/HDP-2.2.6/HDP_RelNotes_v226/index.html">HDP 2.2.6 Release Notes</a>.</td>
<td>HDP</td>
<td>All cluster types</td>
<td>N/A</td>
</tr>

<tr>
<td>Change to Default Yarn Container Memory Configuration</td>
<td>In this update, the default available memory to YARN containers (yarn.nodemanager.resource.memory-mb and yarn.scheduler.maximum-allocation-mb), launched by Node Manager, is increased to 5632MB. Previously this was reduced to 4608MB, but based on various job runs, the new value must offer better reliability and performance to most jobs, hence is a better default. As usual, if you a have critical dependency on this memory configuration, please set it explicitly while creating the cluster.</td>
<td>HDP</td>
<td>All cluster types</td>
<td>N/A</td>
</tr>

<tr>
<td>Default Config parity for HBase and Storm clusters</td>
<td>This update restores Hbase and Storm clusters to use the same values of YARN configs as Hadoop clusters. This is done for parity across all cluster types.</td>
<td>HDP</td>
<td>HBase, Storm</td>
<td>N/A</td>
</tr>

</table>

## Notes for 05/20/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.564.1542093	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.564.1542093	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.3.564.1542093	(HDP 2.1.12.1-0003)
* HDInsight		3.2.4.564.1542093	(HDP 2.2.4.6-2)
* SDK			1.5.8

This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>SCP.NET EventHub Support</td>
<td>The updated cluster packages for HDInsight Storm bring new features to SCP.NET. You will now have access to new APIs in topology builder that make it easier to use EventHubSpout or Java Spouts. You must update your SCP.NET client SDK to work with new clusters as the contracts have been updated. For details on the new APIs, usage and release notes (including bug fixes) please refer to the Readme included in the SCP.NET nuget package.</td>
<td>VS Tooling</td>
<td>Storm HDInsight 3.2 clusters</td>
<td>N/A</td>
</tr>

<tr>
<td>JDBC driver update</td>
<td>Updated the driver to the SQL Server supported version in sqljdbc_4.1.5605.100.</td>
<td>Metastore</td>
<td>All</td>
<td>N/A</td>
</tr>
</table>

## Notes for 04/27/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.537.1486660	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.537.1486660	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.3.537.1486660	(HDP 2.1.12.0-2329 - unchanged)
* HDInsight		3.2.3.537.1486660	(HDP 2.2.2.2-4)
* SDK			1.5.8

This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Fix DLL dependency</td>
<td>Removes HDInsight dependency on Unit Test Framework.</td>
<td>SDK</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Bug fix for race condition</td>
<td>A cluster create request now waits on PUT request to be accepted before polling on the status</td>
<td>SDK</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>
</table>

## Notes for 04/14/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.521.1453250	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.521.1453250	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.3.521.1453250	(HDP 2.1.12.0-2329 - unchanged)
* HDInsight		3.2.3.525.1459730	(HDP 2.2.2.2-2)
* SDK			1.5.6

This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Tez bug fixes</td>
<td>Fixes for Apache TEZ 2214 and TEZ 1923 are included in this release of HDI 3.2. These are specifically needed for certain Hive queries on Tez which require to shuffle a significant amount of data.
</td>
<td>HDP</td>
<td>Hadoop</td>
<td><a href="https://issues.apache.org/jira/browse/TEZ-2214">TEZ 2214</a></br><a href="https://issues.apache.org/jira/browse/TEZ-1923">TEZ 1923</a></td>
</tr>
</table>

## Notes for 04/06/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.521.1453250	(HDP 1.3.12.0-01795 - unchanged)
* HDInsight 	3.0.6.521.1453250	(HDP 2.0.13.0-2117 - unchanged)
* HDInsight 	3.1.3.521.1453250	(HDP 2.1.12.0-2329 - unchanged)
* HDInsight		3.2.3.521.1453250	(HDP 2.2.2.2-1)
* SDK			1.5.6

This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>HDInsight .NET SDK 1.5.6</td>
<td>Updates to remove some internal classes for HDInsight on Linux.</td>
<td>SDK</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Avro Library 1.5.6</td>
<td>Added <b>KnownTypeAttribute</b> for method <b>GetAllKnownTypes</b>. Fixed NullReferenceException when a type is null for GetAllKnownTypes method.</td>
<td>SDK</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Bug fixes</td>
<td>Various bug fixes to the service</td>
<td>Service</td>
<td>All</td>
<td>N/A</td>
</tr>

</table>
<br>

## Notes for 04/01/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.513.1431705	(HDP 1.3.12.0-01795)
* HDInsight 	3.0.6.513.1431705	(HDP 2.0.13.0-2117)
* HDInsight 	3.1.3.513.1431705	(HDP 2.1.12.0-2329)
* HDInsight		3.2.3.513.1431705	(HDP 2.2.2.1-2600)
* SDK			1.5.5

This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Ability to enable/disable remote desktop credentials on Windows clusters via .NET SDK</td>
<td>Programmatic support for enabling or disabling RDP credentials on Windows clusters.</td>
<td>SDK</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>Ability to enable remote desktop credentials on clusters while they are being provisioned</td>
<td>Programmatic support for enabling remote desktop credentials as the cluster is being created. This removes the two-step process for first provisioning the cluster and then enabling remote desktop.</td>
<td>SDK</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>Upgraded Python to 2.7.8</td>
<td>Upgraded Python on HDInsight Clusters to Python 2.7.8, which contains some important security fixes for HDInsight versions 2.1, 3.0, 3.1, and 3.2</td>
<td>Service</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>YARN configuration change</td>
<td>Changed YARN configuration yarn.resourcemanager.max-completed-applications to 1000 for all cluster types for HDInsight versions 3.1 and 3.2. This value only controls the list of completed applications in the YARN UI. To get information about applications that were submitted prior to the list of applications shown on the UI, you can directly go to the History Server.</td>
<td>YARN</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>Resizing of nodes in an HBase cluster</td>
<td>HBase clusters now allow resizing of nodes (up and down) for HDInsight versions 3.1 and 3.2</td>
<td>Service</td>
<td>HBase</td>
<td>N/A</td>
</tr>

<tr>
<td>JDBC upgrade</td>
<td>SQL JDBC driver is upgraded to version sqljdbc_4.0.2206.100 for HDInsight version 3.2. This version contains important security enhancements.</td>
<td>HDP</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>JVM configuration update</td>
<td>Updated JVM configuration networkaddress.cache.ttl to 300 seconds from the default value of -1 for HDInsight versions 3.1 and 3.2. This configuration value controls the caching policy for successful name lookups from the name service. This fixes a bug related to growing and shrinking HBase clusters.</td>
<td>Service</td>
<td>HBase</td>
<td>N/A</td>
</tr>

<tr>
<td>Upgrade to Azure Storage SDK for Java 2.0</td>
<td>HDInsight version 3.2 is upgraded to use the latest version of the Azure Storage SDK for Java. This contains several important bug fixes over the current 0.6.0 version.</td>
<td>HDP</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>Upgraded to Apache WASB source code</td>
<td>HDInsight version 3.2 now uses the latest code for the WASB filesystem driver from Apache Hadoop. With this change, the WASB driver is now packaged as a separate
jar. This is purely a packaging change and does not contain any changes to behavior of the WASB driver. The name of this JAR file is hadoop-azure-2.6.0.jar.</td>
<td>HDP</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>Jar File Name updates in HDInsight 3.2</td>
<td>This update to HDInsight version 3.2 contains several bug fixes, and a few internal jars packaged as part of HDP have been upgraded. Note that these JAR files
are internal to the HDP package and not for direct use by customer applications. Applications should package their own version of the JARs so that an upgrade to the HDP internal JARs do not break customer applications.</td>
<td>HDP</td>
<td>All</td>
<td>N/A</td>
</tr>

</table>
<br>

## Notes for 03/03/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.488.1375841	(HDP 1.3.9.0-01351 - unchanged)
* HDInsight 	3.0.6.488.1375841	(HDP 2.0.9.0-2097 -  unchanged)
* HDInsight 	3.1.3.488.1375841	(HDP 2.1.10.0-2290 - unchanged)
* HDInsight		3.2.3.488.1375841	(HDP-2.2.10.0-2340 - unchanged)
* SDK			1.5.0				(unchanged)

This release contains the following update.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA</th>
</tr>


<tr>
<td>Reliability improvements</td>
<td>We made fixes that allow the service to scale better with the increased load with respect to cluster creation.</td>
<td>Service</td>
<td>All</td>
<td>N/A</td>
</tr>



</table>
<br>

## Notes for 02/18/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.471.1342507	(HDP 1.3.9.0-01351 - unchanged)
* HDInsight 	3.0.6.471.1342507	(HDP 2.0.9.0-2097 -  unchanged)
* HDInsight 	3.1.3.471.1342507	(HDP 2.1.10.0-2290 - unchanged)
* HDInsight		3.2.3.471.1342507	(HDP-2.2.10.0-2340)
* SDK			1.5.0

This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>HDInsight 3.2 clusters</td>
<td>Hadoop 2.6/HDP2.2 is available with HDInsight 3.2 clusters. It contains major updates to all of the open-source components. For more details, see What's new in HDInsight and <a href ="http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.0/HDP_2.2.0_Release_Notes_20141202_version/index.html" target="_blank">HDP 2.2.0.0 Release Notes</a>.</td>
<td>Open-source software</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>HDinsight on Linux (Preview)</td>
<td>Clusters can be deployed running on Ubuntu Linux. For more details, see Get Started with HDInsight on Linux.</td>
<td>Service</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Storm General Availability</td>
<td>Apache Storm clusters are generally available. For more details, see Get started using Storm in HDInsight.</td>
<td>Service</td>
<td>Storm</td>
<td>N/A</td>
</tr>

<tr>
<td>Virtual machine sizes</td>
<td>Azure HDInsight is available on more virtual machine types and sizes. HDInsight can utilize A2 to A7 sizes built for general purposes; D-Series nodes that feature solid-state drives (SSDs) and 60-percent faster processors; and A8 and A9 sizes that have InfiniBand support for fast networking.</td>
<td>Service</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>Cluster scaling</td>
<td>You can change the number of data nodes for a running HDInsight cluster without having to delete or re-create it. Currently, only Hadoop Query and Apache Storm cluster types have this ability, but support for Apache HBase cluster type is soon to follow. For more information, see Manage HDInsight clusters.</td>
<td>Service</td>
<td>Hadoop, Storm</td>
<td>N/A</td>
</tr>

<tr>
<td>Visual Studio tooling</td>
<td>In addition to complete tooling for Apache Storm, the tooling for Apache Hive in Visual Studio has been updated to include statement completion, local validation, and improved debugging support. For more information, see Get Started with HDInsight Hadoop Tools for Visual Studio.</td>
<td>Tooling</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Hadoop Connector for DocumentDB</td>
<td>With Hadoop Connector for DocumentDB, you can perform complex aggregations, analysis, and manipulations over your schema-less JSON documents stored across DocumentDB collections or across database accounts. For more information and a tutorial, see Run Hadoop jobs using DocumentDB and HDInsight.</td>
<td>Service</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Bug fixes</td>
<td>We have made various minor bug fixes for HDInsight services. No customer-facing behavior changes are expected.</td>
<td>Service</td>
<td>All</td>
<td>N/A</td>
</tr>

</table>
<br>

## Notes for 02/06/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.463.1325367	(HDP 1.3.9.0-01351 - unchanged)
* HDInsight 	3.0.6.463.1325367	(HDP 2.0.9.0-2097 -  unchanged)
* HDInsight 	3.1.2.463.1325367	(HDP 2.1.10.0-2290)
* SDK			N/A

This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Bug fixes</td>
<td>We have made various minor bug fixes for HDInsight services. No customer-facing behavior changes are expected.</td>
<td>Service</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>HDP 2.1 maintenance update</td>
<td>HDInsight 3.1 is updated to deploy HDP 2.1.10.0. For more information, see <a href ="http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.10/bk_releasenotes_hdp_2.1/content/ch_relnotes-HDP-2.1.10.html" target="_blank">Release Notes HDP-2.1.10</a>. </td>
<td>Open-source software</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>HDP binary updates</td>
<td>There are a few JAR files in HBase for which file names have been updated. These JAR files are used internally by HBase, so it is not expected that customers have a dependency on the names of these JAR files. These include:
<ul>
<li>./lib/jetty-6.1.26.hwx.jar</li>
<li>./lib/jetty-sslengine-6.1.26.hwx.jar</li>
<li>./lib/jetty-util-6.1.26.hwx.jar</li>
</ul>
</td>
<td>Open-source software</td>
<td>HBase</td>
<td>N/A</td>
</tr>

</table>
<br>

## Notes for 1/29/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.455.1309616	(HDP 1.3.9.0-01351 - unchanged)
* HDInsight 	3.0.6.455.1309616	(HDP 2.0.9.0-2097 -  unchanged)
* HDInsight 	3.1.2.455.1309616	(HDP 2.1.9.0-2196 -  unchanged)
* SDK			N/A

This release contains the following update.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Impacted Area
(for example, Service, component, or SDK)</p></th>
<th>Cluster Type (for example, Hadoop, HBase, or Storm)</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>

<td>Bug fixes</td>
<td>We have made a few important bug fixes that improve the reliability of the HDInsight Clusters during Azure upgrades.</td>
<td>Service</td>
<td>All</td>
<td>N/A</td>
</tr>



</table>
<br>

## Notes for 1/5/2015 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release:

* HDInsight 	2.1.10.420.1246118	(HDP 1.3.9.0-01351 - unchanged)
* HDInsight 	3.0.6.420.1246118	(HDP 2.0.9.0-2097 - unchanged)
* HDInsight 	3.1.2.420.1246118	(HDP 2.1.9.0-2196 - unchanged)


This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Component</th>
<th>Cluster Type</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Samples for Twitter trend analysis and Mahout-based movie recommendations</td>
<td><p>In this release, the HDInsight Query console has two additional samples:</p>

<p><b>Twitter Trend Analysis</b><br>
Public APIs provided by sites like Twitter are a useful source of data for analyzing and understanding popular trends. In this tutorial, learn how to use Hive to get a list of Twitter users that sent the most tweets containing a particular word. </p>

<p><b>Mahout Movie Recommendation</b><br>
Apache Mahout is an Apache Hadoop machine learning library. Mahout contains algorithms for processing data (such as filtering, classification, and clustering). In this tutorial, use a recommendation engine to generate movie recommendations based on movies that your friends have seen.</p></td>
<td>Query console</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Change to default value for Hive configuration: hive.auto.convert.join.noconditionaltask.size</td>
<td><p>This size configuration applies to automatically converted map joins. The value represents the sum of the sizes of tables that can be converted to hash maps that fit in memory. In a prior release, this value increased from the default value of 10 MB to 128 MB. However, the new value of 128 MB was causing jobs to fail due to lack of memory. This release reverts the default value back to 10 MB. Customers can still choose to override this value during cluster creation, given their queries and table sizes. For more information about this setting and how to override it, see <a href="http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.0.2/ds_Hive/optimize-joins.html#JoinOptimization-OptimizeAutoJoinConversion" target="_blank">Optimize Auto Join Conversion</a> in Hortonworks documentation. </p></td>
<td>Hive</td>
<td>Hadoop, Hbase</td>
<td>N/A</td>
</tr>

</table>
<br>

## Notes for 12/23/2014 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release are:

* HDInsight 	2.1.10.420.1246783	(HDP version unchanged)
* HDInsight 	3.0.6.420.1246783	(HDP version unchanged)
* HDInsight 	3.1.1.420.1246783	(HDP version unchanged)

This release contains the following update.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Component</th>
<th>Cluster Type</th>
<th>JIRA (if applicable)</th>
</tr>


<tr>
<td>Intermittent cluster creation failures due to excessive load</td>
<td><p>Improved algorithm for downloading HDP packages during cluster creation enables more robust handling of failures due to excessive load.</p></td>
<td>Service</td>
<td>Hadoop, Hbase, Storm</td>
<td>N/A</td>
</tr>



</table>
<br>

## Notes for 12/18/2014 release of HDInsight

This release contains the following component update.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Component</th>
<th>Cluster Type</th>
<th>JIRA (if applicable)</th>
</tr>

<tr>
<td><a href = "hdinsight-hadoop-customize-cluster.md" target="_blank">Cluster customization General Avalability</a></td>
<td><p>Customization provides the ability for you to customize your Azure HDInsight clusters with projects that are available from the Apache Hadoop ecosystem. With this new feature, you can experiment and deploy Hadoop projects to Azure HDInsight. This is enabled through the **Script Action** feature, which can modify Hadoop clusters in arbitrary ways by using custom scripts. This customization is available on all types of HDInsight clusters including Hadoop, HBase, and Storm. To demonstrate the power of this capability, we have documented the process to install the popular <a href = "hdinsight-hadoop-spark-install.md" target="_blank">Spark</a>, <a href = "hdinsight-hadoop-r-scripts.md" target="_blank">R</a>, <a href = "hdinsight-hadoop-solr-install.md" target="_blank">Solr</a>, and <a href = "hdinsight-hadoop-giraph-install.md" target="_blank">Giraph</a> modules. This release also adds the capability for customers to specify their custom script action via the Azure portal, provides guidelines and best practices about how to build custom script actions using helper methods, and provides guidelines about how to test the script action. </p></td>
<td>Feature General Availability</td>
<td>All</td>
<td>N/A</td>
</tr>


</table>
<br>

## Notes for 12/05/2014 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release are:

* HDInsight 	2.1.9.406.1221105	(HDP 1.3.9.0-01351)
* HDInsight 	3.0.5.406.1221105	(HDP 2.0.9.0-2097)
* HDInsight 	3.1.1.406.1221105	(HDP 2.1.9.0-2196)
* HDInsight SDK N/A

This release contains the following component updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Component</th>
<th>Cluster Type</th>
<th>JIRA (if applicable)</th>
</tr>

<tr>
<td>Bug fix: Intermittent error while adding large numbers of partitions to a table in a Hive DDL </td>
<td><p>If there is an intermittent connection error with the Hive metastore database when adding a lot of partitions to a Hive table, the Hive DDL can fail. The following statement will be seen in the Hive error log if this failure occurs: </p><p>"ERROR [main]: ql.Driver (SessionState.java:printError(547)) - FAILED: Execution Error, return code 1 from org.apache.hadoop.hive.ql.exec.DDLTask. MetaException(message:java.lang.RuntimeException: commitTransaction was called but openTransactionCalls = 0. This probably indicates that there are unbalanced calls to openTransaction/commitTransaction)"</p></td>
<td>Hive</td>
<td>Hadoop, Hbase</td>
<td>HIVE-482 (This is an internal JIRA, so it cannot be quoted externally. Noted here for reference.)</td>
</tr>

<tr>
<td>Bug fix: Occasional hang in the HDInsight Query Console</td>
<td>When this happens, the following statement can be seen in the WebHCat log for the WebHCat launcher job: <p>"org.apache.hive.hcatalog.templeton.CatchallExceptionMapper | org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.yarn.exceptions.YarnRuntimeException): Could not load history file {wasb url to the history file}"</p></td>
<td>WebHCat</td>
<td>Hadoop</td>
<td>HIVE-482 (This is an internal JIRA, so it cannot be quoted externally. Noted here for reference.)</td>
</tr>

<tr>
<td>Bug fix: Occasional spike in latency of Hbase queries</td>
<td>If this happens, users will notice an occasional spike of 3 seconds in the latency of Hbase queries. </td>
<td>HDInsight Cluster Gateway</td>
<td>HBase</td>
<td>N/A</td>
</tr>

<tr>
<td>HDP JAR file name changes</td>
<td>For HDI cluster version 3.0, there a couple of changes to the internal JAR files installed by HDP. jetty-6.1.26.jar has been replaced with jetty-6.1.26.hwx.jar. jetty-util-6.1.26.jar has been replaced with jetty-util-6.1.26.hwx.jar. These changes apply to Hadoop, Mahout, WebHCat and Oozie projects.</td>
<td>Hadoop, Mahout, WebHCat, Oozie</td>
<td>Hadoop, HBase</td>
<td>N/A</td>
</tr>

</table>
<br>


## Notes for 11/21/2014 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release are:

* HDInsight 2.1.9.382.1169709 (no change from 11/14/2014)
* HDInsight 3.0.5.382.1169709 (no change from 11/14/2014)
* HDInsight 3.1.1.382.1169709 (no change from 11/14/2014)
* HDINsight SDK 1.4.0

This release contains the following component updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Component</th>
<th>Cluster Type</th>
<th>JIRA (if applicable)</th>
</tr>

<tr>
<td>Accessing application logs</td>
<td>Ability to programmatically enumerate applications that have been run on your clusters and to download relevant application-specific or container-specific logs to help debug problematic applications.</td>
<td>SDK</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Ability to specify region name in IHdInsightClient.DeleteCluster </td>
<td>The Azure HDInsight SDK provides the ability to specify a region name when using **DeleteCluster**. This helps unblock customers who had two resources with same name in different regions and had been unable to delete either of them.</td>
<td>SDK</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>ClusterDetails.DeploymentId</td>
<td>The **ClusterDetails** object returns a **DeploymentID** field that represents a unique identifier for the cluster. It is guaranteed to be unique across cluster creation attempts with the same names.</td>
<td>SDK</td>
<td>All</td>
<td>N/A</td>
</tr>
</table>
<br>

## Notes for 11/14/2014 release of HDInsight

The full version numbers for HDInsight clusters deployed with this release are:

* HDInsight 2.1.9.382.1169709
* HDInsight 3.0.5.382.1169709
* HDInsight 3.1.1.382.1169709

This release contains the following new features, component updates, and bug fixes.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Component</th>
<th>Cluster Type</th>
<th>JIRA (if applicable)</th>
</tr>

<tr>
<td>Script Action (Preview)</td>
<td>Preview of the cluster customization feature that enables modification of Hadoop clusters in arbitrary ways by using custom scripts. With this feature, users can experiment with and deploy projects that are available from the Apache Hadoop ecosystem to Azure HDInsight clusters. This customization feature is available on all types of HDInsight clusters, including Hadoop, HBase, and Storm.</td>
<td>New feature</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>Prebuilt jobs for Azure websites and storage log analysis</td>
<td>The HDInsight Query Console has a Getting Started gallery that supports solutions that work on your data or on sample data.
<p>**Solutions that work on your data**:<br>
We’ve created jobs for some of the most common data analysis scenarios to provide a starting point for creating your own solutions. You can use your data with the job to see how it works. Then when you are ready, use what you have learned to create a solution that is modeled after the prebuilt job.</p>
<p>**Solutions that work on sample data**:<br>
Learn how to work with HDInsight by walking through some basic scenarios (such as analyzing web logs and sensor data). You will learn how to use HDInsight to analyze such data and how you can connect other applications and services to this data. Visualizing data by connecting to Microsoft Excel provides an example of the power of this approach.</p></td>
<td>Query console</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Memory leak fix in Templeton</td>
<td>A memory leak in Templeton that affected customers who had long running clusters or were submitting 100s of job requests a second has been addressed. The issue manifested as Templeton 5xx errors and the workaround was to restart the service. The workaround is no longer needed.</td>
<td>Templeton</td>
<td>All</td>
<td>https://issues.apache.org/jira/browse/HADOOP-11248</td>
</tr>
</table>
<br>


**Note**: To demonstrate the new capabilities made available by cluster customization, the procedures using Script Action to install Spark and R modules on a cluster have been documented. For further information, see:

* [Install and use Spark 1.0 on HDInsight clusters](hdinsight-hadoop-spark-install.md)
* [Install and use R on HDInsight Hadoop clusters](hdinsight-hadoop-r-scripts.md)




## Notes for 11/07/2014 release of HDInsight

The full version numbers for HDInsight clusters that deployed with this release are:

* HDInsight 2.1	2.1.9.374.1153876
* HDInsight 3.0	3.0.5.374.1153876
* HDInsight 3.1	3.1.1.374.1153876

This release contains the following component updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
<th>Component</th>
<th>Cluster Type</th>
<th>JIRA (if applicable)</th>
</tr>

<tr>
<td>HDP 2.1.7</td>
<td>This release is based on Hortonworks Data Platform (HDP) 2.1.7. For more information, see <a href="http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.7-Win/bk_releasenotes_HDP-Win/content/ch_relnotes-HDP-2.1.7.html" target="_blank">Release Notes for HDP 2.1.7</a>.</td>
<td>HDP</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>YARN Timeline Server</td>
<td>The YARN Timeline Server (also known as the Generic Application History Server) has been enabled by default. The Timeline Server provides generic information about completed applications (such as application ID, application name, application status, application submission time, and application completion time).

This application information can be retrieved from the head node by accessing the URI http://headnodehost:8188 or by running the YARN command: yarn application –list –appStates ALL.

This information can also be retrieved remotely though a REST API at https://{ClusterDnsName}. azurehdinsight.net/ws/v1/applicationhistory/.

For more detailed information, see <a href="http://hadoop.apache.org/docs/r2.4.0/hadoop-yarn/hadoop-yarn-site/TimelineServer.html" target="_blank">YARN Timeline Server</a>.</td>
<td>Service, YARN</td>
<td>Hadoop, HBase</td>
<td>N/A</td>
</tr>

<tr>
<td>Cluster deployment ID</td>
<td>Starting with SDK version 1.3.3.1.5426.29232, users can access a unique ID for each cluster, which is issued HDInsight. This enables customers to figure out unique instances of clusters when a DNS name is being reused across create or drop scenarios.</td>
<td>SDK</td>
<td>All</td>
<td>N/A</td>
</tr>
</table>
<br>

**Note**: The bug that prevented the full version number from showing up in the portal or from being returned by the SDK or by Windows PowerShell has been fixed in this release.

## Notes for 10/15/2014 release

This hotfix release fixed a memory leak in Templeton that affected the heavy users of Templeton. In some cases, users who exercised Templeton heavily would see errors manifested as 500 error codes because the requests would not have enough memory to run. The workaround for this issue was to restart the Templeton service. This issue has been fixed.


## Notes for 10/7/2014 release

* When using Ambari endpoint, "https://{clusterDns}.azurehdinsight.net/ambari/api/v1/clusters/{clusterDns}.azurehdinsight.net/services/{servicename}/components/{componentname}", the *host_name* field returns the fully qualified domain name (FQDN) of the node instead of only the host name. For example, instead of returning "**headnode0**", you get the FQDN “**headnode0.{ClusterDNS}.azurehdinsight.net**”. This change was required to facilitate scenarios where multiple cluster types (such as HBase and Hadoop) can be deployed in one virtual network. This happens, for example, when using HBase as a back-end platform for Hadoop.

* We have provided new memory settings for the default deployment of the HDInsight cluster. Previous default memory settings did not adequately account for the guidance for the number of CPU cores being deployed. These new memory settings should provide better defaults (as per Hortonworks recommendations). To change these, please refer to the SDK reference documentation about changing cluster configuration. The new memory settings that are used by the default 4 CPU core (8 container) HDInsight cluster are itemized in the following table. (The values used prior to this release are also provided parenthetically.)

<table border="1">
<tr><th>Component</th><th>Memory Allocation</th></tr>
<tr><td> yarn.scheduler.minimum-allocation</td><td>768 MB (previously 512 MB)</td></tr>
<tr><td> yarn.scheduler.maximum-allocation</td><td>6144 MB (unchanged)</td></tr>
<tr><td>yarn.nodemanager.resource.memory</td><td>6144 MB (unchanged)</td></tr>
<tr><td>mapreduce.map.memory</td><td>768 MB (previously 512 MB)</td></tr>
<tr><td>mapreduce.map.java.opts</td><td>opts=-Xmx512m (previously -Xmx410m)</td></tr>
<tr><td>mapreduce.reduce.memory</td><td>1536 MB (previously 1024 MB)</td></tr>
<tr><td>mapreduce.reduce.java.opts</td><td>opts=-Xmx1024m (previously -Xmx819m)</td></tr>
<tr><td>yarn.app.mapreduce.am.resource</td><td>768 MB (previously 1024 MB)</td></tr>
<tr><td>yarn.app.mapreduce.am.command</td><td>opts=-Xmx512m (previously -Xmx819m)</td></tr>
<tr><td>mapreduce.task.io.sort</td><td>256 MB (previously 200 MB)</td></tr>
<tr><td>tez.am.resource.memory</td><td>1536 MB (unchanged)</td></tr>

</table><br>

For more information about the memory configuration settings used by YARN and MapReduce on the Hortonworks Data Platform that is used by HDInsight, see [Determine HDP Memory Configuration Settings](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/rpm-chap1-11.html). Hortonworks also provided a tool to calculate proper memory settings.

Regarding the Azure PowerShell and the HDInsight SDK error message: "*Cluster is not configured for HTTP services access*":

* This error is a known [compatibility issue](https://social.msdn.microsoft.com/Forums/azure/a7de016d-8de1-4385-b89e-d2e7a1a9d927/hdinsight-powershellsdk-error-cluster-is-not-configured-for-http-services-access?forum=hdinsight) that may occur due to a difference in the version of the  HDInsight SDK or Azure PowerShell and the version of the cluster. Clusters created on 8/15 or later have support for new provisioning capability into virtual networks. But this capability is not correctly interpreted by older versions of the  HDInsight SDK or Azure PowerShell. The result is a failure in some job submission operations. If you use  HDInsight SDK APIs or Azure PowerShell cmdlets (**Use-AzureRmHDInsightCluster** or **Invoke-AzureRmHDInsightHiveJob**) to submit jobs, those operations may fail with the error message "*Cluster <clustername> is not configured for HTTP services access*." Or (depending on the operation), you may get other error messages, such as "*Cannot connect to cluster*".

* These compatibility issues are resolved in the latest versions of the HDInsight SDK and Azure PowerShell. We recommend updating the HDInsight SDK to version 1.3.1.6 or later and Azure PowerShell Tools to version 0.8.8 or later. You can get access to the latest HDInsight SDK from [](http://nuget.codeplex.com/wikipage?title=Getting%20Started) and the Azure PowerShell Tools at [How to install and configure Azure PowerShell](../powershell-install-configure.md).



## Notes for 9/12/2014 release of HDInsight 3.1

* This release is based on Hortonworks Data Platform (HDP) 2.1.5. For a list of the bugs fixed in this release, see the [Fixed in this Release](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.5/bk_releasenotes_hdp_2.1/content/ch_relnotes-hdp-2.1.5-fixed.html) page on the Hortonworks site.
* In the Pig libraries folder, the “avro-mapred-1.7.4.jar” file has been changed to "avro-mapred-1.7.4-hadoop2.jar." The contents of this file contains a minor bug fix that is non-breaking. It is recommended that customers do not make a direct dependency on the name of the JAR file to avoid breaks when files are renamed.


## Notes for 8/21/2014 release

* We are adding the following WebHCat configuration (HIVE-7155), which sets the default memory limit for a Templeton controller job to 1 GB. (The previous default value was 512 MB.)

	 templeton.mapper.memory.mb (=1024)

	* This change addresses the following error which certain Hive queries had run in to due to lower memory limits: “Container is running beyond physical memory limits.”
	* To revert to the old defaults, you can set this configuration value to 512 through Azure PowerShell at cluster creation time by using the following command:

		Add-AzureRmHDInsightConfigValues -Core @{"templeton.mapper.memory.mb"="512";}


* The host name of the zookeeper role was changed to *zookeeper*. This affects name resolution within the cluster, but it doesn't affect external REST APIs. If you have components that use the *zookeepernode* host name, you need to update them to use new name. The new names for the three zookeeper nodes are:
	* zookeeper0
	* zookeeper1
	* zookeeper2
* HBase version support matrix is updated. Only HDInsight version 3.1 (HBase version 0.98) is supported for production for HBase workloads. Version 3.0 (which was available for preview) is not supported moving forward.

## Notes about clusters created prior to 8/15/2014

An Azure PowerShell or HDInsight SDK error message, "Cluster <clustername> is not configured for HTTP services access" (or depending on the operation, other error messages such as: "Cannot connect to cluster") may be encountered due to a version difference between Azure PowerShell or the HDInsight SDK and a cluster. Clusters created on 8/15 or later have support for new provisioning capability into virtual networks. This capability isn’t correctly interpreted by older versions of the Azure PowerShell or the HDInsight SDK, which results in failures of job submission operations. If you use HDInsight SDK APIs or Azure PowerShell cmdlets (such as Use-AzureRmHDInsightCluster or Invoke-AzureRmHDInsightHiveJob) to submit jobs, those operations may fail with one of the error messages described.

These compatibility issues are resolved in the latest versions of the HDInsight SDK and Azure PowerShell. We recommend updating the HDInsight SDK to version 1.3.1.6 or later and Azure PowerShell Tools to version 0.8.8 or later. You can get access to the latest HDInsight SDK from [NuGet][nuget-link]. You can access the Azure PowerShell Tools by using [Microsoft Web Platform Installer][webpi-link].


## Notes for 7/28/2014 release

* **HDInsight available in new regions**:  We expanded HDInsight geographical presence to three regions. HDInsight customers can create clusters in these regions:
	* East Asia
	* North Central US
	* South Central US
* HDInsight version 1.6 (HDP 1.1 and Hadoop 1.0.3) and HDInsight version 2.1 (HDP1.3 and Hadoop 1.2) are being removed from the Azure portal. You can continue to create Hadoop clusters for these versions by using the Azure PowerShell cmdlet, [New-AzureRmHDInsightCluster](http://msdn.microsoft.com/library/dn593744.aspx) or by using the [HDInsight SDK](http://msdn.microsoft.com/library/azure/dn469975.aspx). Please refer to the [HDInsight component versioning](hdinsight-component-versioning.md) page for more information.
* Hortonworks Data Platform (HDP) changes in this release:

<table border="1">
<tr><th>HDP</th><th>Changes</th></tr>
<tr><td>HDP 1.3 / HDI 2.1</td><td>No changes</td></tr>
<tr><td>HDP 2.0 / HDI 3.0</td><td>No changes</td></tr>
<tr><td>HDP 2.1 / HDI 3.1</td><td>zookeeper: ['3.4.5.2.1.3.0-1948'] -> ['3.4.5.2.1.3.2-0002']</td></tr>


</table><br>

## Notes for 6/24/2014 release

This release contains enhancements to the HDInsight service:

* **HDP 2.1 availability**: HDInsight 3.1 (which contains HDP 2.1) is generally available and is the default version for new clusters.
* **HBase – Azure portal improvements**: We are making HBase clusters available in Preview. You can create HBase clusters from the portal with just a few clicks. 

With HBase, you can build a variety of real-time workloads on HDInsight, from interactive websites that work with large datasets to services storing sensor and telemetry data from millions of end points. The next step would be to analyze the data in these workloads with Hadoop jobs, and this is possible in HDInsight through Azure PowerShell and the Hive cluster dashboard.

### Apache Mahout preinstalled on HDInsight 3.1

 [Mahout](http://hortonworks.com/hadoop/mahout/) is pre-installed on HDInsight 3.1 Hadoop clusters, so you can run Mahout jobs without the need for additional cluster configuration. For example, you can remote into an Hadoop cluster by using Remote Desktop Protocol (RDP), and without additional steps, you can run the following Hello World Mahout command:

		mahout org.apache.mahout.classifier.df.tools.Describe -p /user/hdp/glass.data -f /user/hdp/glass.info -d I 9 N L  

		mahout org.apache.mahout.classifier.df.BreimanExample -d /user/hdp/glass.data -ds /user/hdp/glass.info -i 10 -t 100

For a more complete explanation of this procedure, see the documentation for the [Breiman Example](https://mahout.apache.org/users/classification/breiman-example.html) on the Apache Mahout website.


### Hive queries can use Tez in HDInsight 3.1

Hive 0.13 is available in HDInsight 3.1, and it is capable of running queries using Tez, which can be leveraged for substantial performance improvements.
Tez is not enable by default for Hive queries. To use it, you must opt in. You can enable Tez by running the following code snippet:

		set hive.execution.engine=tez;
		select sc_status, count(*), histogram_numeric(sc_bytes,5) from website_logs_orc_local group by sc_status;

Hortonworks has published a detailed breakdown of Hive query performance enhancements with Tez as delivered in standard benchmarks. For details, see [Benchmarking Apache Hive 13 for Enterprise Hadoop](http://hortonworks.com/blog/benchmarking-apache-hive-13-enterprise-hadoop/).

For more details about using Hive with Tez, see [Hive on Tez](https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez).

###Global availability
With the release of HDInsight on Hadoop 2.2, Microsoft has made HDInsight available in all major geographies where Azure is available. Specifically, the west Europe and southeast Asia datacenters have been brought online. This enables customers to locate clusters in a datacenter that is close and potentially in a zone of similar compliance requirements.


###Do's & Dont's between cluster versions

**Oozie metastores used with an HDInsight 3.1 cluster are not backward compatible with HDInsight 2.1 clusters, and they cannot be used with this previous version**.

A custom Oozie metastore database deployed with an HDInsight 3.1 cluster cannot be reused with an HDInsight 2.1 cluster. This is the case even if the metastore originated with an HDInsight 2.1 cluster. This scenario is not supported because the metastore schema gets upgraded when used with an  HDInsight 3.1 cluster, so it is no longer compatible with the metastore required by the HDInsight 2.1 clusters. Any attempt to reuse an Oozie metastore that has been used with an HDInsight 3.1 cluster will render the HDInsight 2.1 cluster useless.

**Oozie metastores cannot be shared across clusters.**

Oozie metastores are attached to specific clusters, and they cannot be shared across clusters.

###Breaking changes

**Prefix syntax**:
Only the "wasb://" syntax is supported in HDInsight 3.1 and 3.0 clusters. The older "asv://" syntax is supported in HDInsight 2.1 and 1.6 clusters, but it is not supported in HDInsight 3.1 or 3.0 clusters. This means that any jobs submitted to an HDInsight 3.1  or 3.0 cluster that explicitly use the "asv://" syntax will fail. The "wasb://" syntax should be used instead. Also, jobs submitted to any HDInsight 3.1 or 3.0 clusters that are created with an existing metastore that contains explicit references to resources using the "asv://" syntax will fail. These metastores need to be re-created using the "wasb://" syntax to address resources.


**Ports**: The ports used by the HDInsight service have changed. The port numbers that were being used were within the ephemeral port range of the Windows operating system. Ports are allocated automatically from a predefined ephemeral range for short-lived Internet protocol-based communications. The new set of allowed Hortonworks Data Platform (HDP) service port numbers are outside this range to avoid encountering conflicts that could arise with the ports used by services running on the head node. The new port numbers should not cause any breaking changes. The numbers used are as follows:

 **HDInsight 1.6 (HDP 1.1)**
<table border="1">
<tr><th>Name</th><th>Value</th></tr>
<tr><td>dfs.http.address</td><td>namenodehost:30070</td></tr>
<tr><td>dfs.datanode.address</td><td>0.0.0.0:30010</td></tr>
<tr><td>dfs.datanode.http.address</td><td>0.0.0.0:30075</td></tr>
<tr><td>dfs.datanode.ipc.address</td><td>0.0.0.0:30020</td></tr>
<tr><td>dfs.secondary.http.address</td><td>0.0.0.0:30090</td></tr>
<tr><td>mapred.job.tracker.http.address</td><td>jobtrackerhost:30030</td></tr>
<tr><td>mapred.task.tracker.http.address</td><td>0.0.0.0:30060</td></tr>
<tr><td>mapreduce.history.server.http.address</td><td>0.0.0.0:31111</td></tr>
<tr><td>templeton.port</td><td>30111</td></tr>
</table><br>

 **HDInsight 3.1 and 3.0 (HDP 2.1 and 2.0)**
<table border="1">
<tr><th>Name</th><th>Value</th></tr>
<tr><td>dfs.namenode.http-address</td><td>namenodehost:30070</td></tr>
<tr><td>dfs.namenode.https-address</td><td>headnodehost:30470</td></tr>
<tr><td>dfs.datanode.address</td><td>0.0.0.0:30010</td></tr>
<tr><td>dfs.datanode.http.address</td><td>0.0.0.0:30075</td></tr>
<tr><td>dfs.datanode.ipc.address</td><td>0.0.0.0:30020</td></tr>
<tr><td>dfs.namenode.secondary.http-address</td><td>0.0.0.0:30090</td></tr>
<tr><td>yarn.nodemanager.webapp.address</td><td>0.0.0.0:30060</td></tr>
<tr><td>templeton.port</td><td>30111</td></tr>
</table><br>

###Dependencies

The following dependencies were added in HDInsight 3.x (HDP2.x):

* guice-servlet
* optiq-core
* javax.inject
* activation
* jsr305
* geronimo-jaspic_1.0_spec
* jul-to-slf4j
* java-xmlbuilder
* ant
* commons-compiler
* jdo-api
* commons-math3
* paranamer
* jaxb-impl
* stringtemplate
* eigenbase-xom
* jersey-servlet
* commons-exec
* jaxb-api
* jetty-all-server
* janino
* xercesImpl
* optiq-avatica
* jta
* eigenbase-properties
* groovy-all
* hamcrest-core
* mail
* linq4j
* jpam
* jersey-client
* aopalliance
* geronimo-annotation_1.0_spec
* ant-launcher
* jersey-guice
* xml-apis
* stax-api
* asm-commons
* asm-tree
* wadl
* geronimo-jta_1.1_spec
* guice
* leveldbjni-all
* velocity
* jettison
* snappy-java
* jetty-all
* commons-dbcp

The following dependencies no longer exist in HDInsight 3.x (HDP2.x):

* jdeb
* kfs
* sqlline
* ivy
* aspectjrt
* json
* core
* jdo2-api
* avro-mapred
* datanucleus-enhancer
* jsp
* commons-logging-api
* commons-math
* JavaEWAH
* aspectjtools
* javolution
* hdfsproxy
* hbase
* snappy

###Version changes

The following version changes were made between HDInsight 2.x (HDP1.x) and HDInsight 3.x (HDP2.x):

* metrics-core: ['2.1.2'] -> ['3.0.0']
* derbynet: ['10.4.2.0'] -> ['10.10.1.1']
* datanucleus: ['rdbms-3.0.8'] -> ['rdbms-3.2.9']
* jasper-compiler: ['5.5.12'] -> ['5.5.23']
* log4j: ['1.2.15', '1.2.16'] -> ['1.2.16', '1.2.17']
* derbyclient: ['10.4.2.0'] -> ['10.10.1.1']
* httpcore: ['4.2.4'] -> ['4.2.5']
* hsqldb: ['1.8.0.10'] -> ['2.0.0']
* jets3t: ['0.6.1'] -> ['0.9.0']
* protobuf-java: ['2.4.1'] -> ['2.5.0']
* derby: ['10.4.2.0'] -> ['10.10.1.1']
* jasper: ['runtime-5.5.12'] -> ['runtime-5.5.23']
* commons-daemon: ['1.0.1'] -> ['1.0.13']
* datanucleus-core: ['3.0.9'] -> ['3.2.10']
* datanucleus-api-jdo: ['3.0.7'] -> ['3.2.6']
* zookeeper: ['3.4.5.1.3.9.0-01320'] -> ['3.4.5.2.1.3.0-1948']
* bonecp: ['0.7.1.RELEASE'] -> ['
* 0.8.0.RELEASE']


### Drivers
The Java Database Connnectivity (JDBC) driver for SQL Server is used internally by HDInsight and is not used for external operations. If you want to connect to HDInsight by using Open Database Connectivity (ODBC), please use the Microsoft Hive ODBC driver. For more information, see [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver](hdinsight-connect-excel-hive-odbc-driver.md).


### Bug fixes

With this release, we have refreshed the following HDInsight versions with several bug fixes:

* HDInsight 2.1 (HDP 1.3)
* HDInsight 3.0 (HDP 2.0)
* HDInsight 3.1 (HDP 2.1)


## Hortonworks release notes

Release notes for the Hortonworks Data Platforms (HDPs) that are used by HDInsight version clusters are available at the following locations:

* HDInsight version 3.1 uses a Hadoop distribution that is based on the [Hortonworks Data Platform 2.1.7][hdp-2-1-7]. This is the default Hadoop cluster created when using the Azure portal after 11/7/2014. HDInsight 3.1 clusters created before 11/7/2014 were based on the [Hortonworks Data Platform 2.1.1][hdp-2-1-1]

* HDInsight version 3.0 uses a Hadoop distribution that is based on the [Hortonworks Data Platform 2.0][hdp-2-0-8].

* HDInsight version 2.1 uses a Hadoop distribution that is based on the [Hortonworks Data Platform 1.3][hdp-1-3-0].

* HDInsight version 1.6 uses a Hadoop distribution that is based on the [Hortonworks Data Platform 1.1][hdp-1-1-0].

[hdp-2-1-7]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.7-Win/bk_releasenotes_HDP-Win/content/ch_relnotes-HDP-2.1.7.html

[hdp-2-1-1]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.1/bk_releasenotes_hdp_2.1/content/ch_relnotes-hdp-2.1.1.html

[hdp-2-0-8]: http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.8.0/bk_releasenotes_hdp_2.0/content/ch_relnotes-hdp2.0.8.0.html

[hdp-1-3-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.3.0_1.html

[hdp-1-1-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/bk_releasenotes_HDP-Win/content/ch_relnotes-hdp-win-1.1.0_1.html

[nuget-link]: https://www.nuget.org/packages/Microsoft.WindowsAzure.Management.HDInsight/

[webpi-link]: http://go.microsoft.com/?linkid=9811175&clcid=0x409

[hdinsight-install-spark]: ../hdinsight-hadoop-spark-install/
[hdinsight-r-scripts]: ../hdinsight-hadoop-r-scripts/
 
