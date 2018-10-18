---
title: Archived release notes for Azure HDInsight 
description: Archived release notes and versions of Azure HDInsight. 
services: hdinsight
ms.reviewer: jasonh
author: jasonwhowell

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 03/20/2018
ms.author: jasonh

---
# Archived release notes for Azure HDInsight

For the **most recent** Azure HDInsight release updates, see [HDInsight Release Notes](hdinsight-release-notes.md).

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight versioning article](hdinsight-component-versioning.md).

## Notes for 06/27/2018 - Release of new open source versions, ADLS Gen2 etc. on HDInsight 3.6
The June 2018 release of HDInsight is a significant release with a lot of new updates and capabilities for our customers. Please read this [post](https://azure.microsoft.com/blog/enterprises-get-deeper-insights-with-hadoop-and-spark-updates-on-azure-hdinsight/) for more details.

Following are the highlights. For the detailed release notes, bugs fixed, known issues, etc., please read the [Release notes for Azure HDInsight](hdinsight-release-notes.md).

- **Update Hadoop and other open-source projects** – In addition to 1000+ bug fixes across 20+ open-source projects, this update contains a new version of Spark (2.3) and Kafka (1.0).
- **Update R Server 9.1 to Machine Learning Services 9.3** – With this release, we are providing data scientists and engineers with the best of open-source enhanced with algorithmic innovations and ease of operationalization, all available in their preferred language with the speed of Apache Spark. This release expands upon the capabilities offered in R Server with added support for Python, leading to the cluster name change from R Server to ML Services. 
- **Support for Azure Data Lake Storage Gen2** – HDInsight will support the Preview release of Azure Data Lake Storage Gen2. In the available regions, customers will be able to choose an ADLS Gen2 account as a store for their HDInsight clusters.
- **HDInsight Enterprise Security Package Updates (Preview)** – (Preview) Virtual Network Service Endpoints  support for Azure blob Storage, ADLS Gen1, Cosmos DB and Azure DB. 

## Notes for 03/20/2018 - Release of Spark 2.2 on HDInsight 3.6

- Spark 2.2.0 improves stability across Spark Core, SQL, ML, and brings Structured Streaming to GA status. Spark 2.2.0 is now available on HDInsight 3.6.


## Notes for 08/01/2017 release of HDInsight

| Title | Description | Impacted Area  | Cluster Type  | 
| --- | --- | --- | --- | --- |
| Release of Microsoft R Server 9.1 on HDInsight |HDInsight now supports provisioning R Server 9.1 clusters on HDInsight. For more information on Microsoft R Server 9.1 release, see [this blog](https://blogs.technet.microsoft.com/dataplatforminsider/2017/04/19/introducing-microsoft-r-server-9-1-release/). |Service |R Server |
| HDInsight 3.6 now includes newer versions of the Hadoop stack|<ul><li>For a detailed list of updated versions, see [Hadoop component versions available in HDInsight](hdinsight-component-versioning.md#hadoop-components-available-with-different-hdinsight-versions).</li><li>For a list of bugs fixed in the latest versions of the Hadoop stack, see [Apache Patch Information](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.6.1/bk_release-notes/content/patch_parent.html).</li><li>For a list of breaking changes between HDP 2.6.1 (which is now available in HDInsight 3.6), see [https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.6.1/bk_release-notes/content/behavior_changes.html](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.6.1/bk_release-notes/content/behavior_changes.html).</li><li>For a list of known issues in HDP 2.6.1, see [Known issues](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.6.1/bk_release-notes/content/known_issues.html).</li></ul> |Service |All |N/A |
| Updates to Interactive Hive (Preview) clusters |<ul><li><b>Feature improvement.</b> Implementation of cached metastore that reduces the load on the backend SQL by caching the metadata and improves performance for all metadata operations.  This improvement is now a default on all Interactive Hive clusters. For more information, see [https://issues.apache.org/jira/browse/HIVE-16520](https://issues.apache.org/jira/browse/HIVE-16520).</li><li><b>Feature improvement.</b> Dynamic partition loading is optimized. For more information, see [https://issues.apache.org/jira/browse/HIVE-14204] (https://issues.apache.org/jira/browse/HIVE-14204).</li><li><b>Feature improvement.</b> Configuration optimizations for HDInsight on Linux.</li><li><b>Bug fix.</b> `CredentialProviderFactory$getProviders` is not thread-safe. This issue is now fixed. For more information, see [https://issues.apache.org/jira/browse/HADOOP-14195](https://issues.apache.org/jira/browse/HADOOP-14195).</li><li><b>Bug fix.</b> High CPU usage with WASB driver `liststatus` API resulting in bad ATS performance. This issue is now fixed. For more information, see [https://github.com/Azure/azure-storage-java/pull/154](https://github.com/Azure/azure-storage-java/pull/154).</li></ul> |Service |Interactive Hive (Preview) |
| Updates to Hadoop clusters |Templeton job operation reliability is improved. For more information, see [https://issues.apache.org/jira/browse/HIVE-15947](https://issues.apache.org/jira/browse/HIVE-15947) |Service |Hadoop |
| YARN updates | HDInsight now creates a 250 GB Ambari database (without increasing cost), which results in a better experience for customers. This change should prevent ATS from getting filled up and likely have a better performance. |Service |All |
| Spark updates | Release of Spark 2.1.1. For more information, see [Spark Release 2.1.1](https://spark.apache.org/releases/spark-release-2-1-1.html). | Service | Spark |

  



## 04/06/2017 - General availability of HDInsight 3.6

* With this release, Azure HDInsight adds version 3.6, which is based on HDP 2.6. HDP 2.6 release notes are available [here](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.6.0/bk_release-notes/content/ch_relnotes.html) and more information on HDInsight versions can be found [here](hdinsight-component-versioning.md). HDInsight 3.6 is available for the following workloads:

	* Hadoop v2.7.3
	* HBase v1.1.2
	* Storm v1.1.0
	* Spark v2.1.0
	* Interactive Hive v2.1.0

* **Support for Hive View 2.0**. This should improve the user experience for Interactive Hive. For more information, see [Hortonworks documentation](http://docs.hortonworks.com/HDPDocuments/Ambari-2.5.0.3/bk_ambari-views/content/ch_using_hive_view.html).

* **Performance enhancements with Hive LLAP**. For more information, see [Hortonworks documentation](https://hortonworks.com/blog/top-5-performance-boosters-with-apache-hive-llap/).

* **New features in Hive**. See [Hortonworks documentation](https://hortonworks.com/apache/hive/#section_4).

* **Hive CLI Deprecation**: Hive CLI is being deprecated and customers are encouraged to use Beeline instead. For more information, see [Apache documentation](https://cwiki.apache.org/confluence/display/Hive/Replacing+the+Implementation+of+Hive+CLI+Using+Beeline). For instructions on how to use Beeline with HDInsight, see [Use Beeline with HDInsight Hadoop clusters](hadoop/apache-hadoop-use-hive-beeline.md).

* **New features in Apache Phoenix and HBase**.
	* Storage quota support: Commonly used in multi-tenant environments, allowing limited storage space on a per table and per namespace level.
	* Phoenix indexing improvements: Incremental index creation and rebuild/resume indexing from previous failures.
	* Phoenix data integrity tool: Supports validation of schema, index, and other metadata.


* **Issue with HBase**: While running a CSV bulk upload MapReduce job, the following syntax might result in an error.

		HADOOP_CLASSPATH=$(hbase mapredcp):/path/to/hbase/conf hadoop jar phoenix-<version>-client.jar org.apache.phoenix.mapreduce.CsvBulkLoadTool --table EXAMPLE --input /data/example.csv

	Use the following syntax instead:

		HADOOP_CLASSPATH=/path/to/hbase-protocol.jar:/path/to/hbase/conf hadoop jar phoenix-<version>-client.jar org.apache.phoenix.mapreduce.CsvBulkLoadTool --table EXAMPLE --input /data/example.csv


## 02/28/2017 - Release of Spark 2.1 on HDInsight 3.6 (Preview)
* [Spark 2.1](http://spark.apache.org/releases/spark-release-2-1-0.html) improves many stability and usability issues with previous versions. It also brings new features across all Spark workloads, such as Spark Core, SQL, ML, and Streaming.
* Structured Streaming gets improved scalability with support for event time watermarks and Kafka 0.10 connector.
* Spark SQL partitioning is now handled using new Scalable Partition Handling mechanism. See more details [here](http://spark.apache.org/releases/spark-release-2-1-0.html) on how to upgrade.
* Spark 2.1 on Azure HDInsight 3.6 Preview currently does not support BI Tool connectivity using ODBC driver.
* Azure Data Lake Store access from Spark 2.1 clusters is not supported in this Preview.


## 11/18/2016 - Release of Spark 2.0.1 on HDInsight 3.5
Spark 2.0.1 is now available on Spark clusters (HDInsight version 3.5).

## 11/16/2016 - Release of R Server 9.0 on HDInsight 3.5 (Spark 2.0)
*	R Server clusters now include the option for two versions: R Server 9.0 on HDI 3.5 (Spark 2.0) and R Server 8.0 on HDI 3.4 (Spark 1.6).
*	R Server 9.0 on HDI 3.5 (Spark 2.0) is built on R 3.3.2 and includes new ScaleR data source functions called RxHiveData and RxParquetData for loading data from Hive and Parquet directly to Spark DataFrames for analysis by ScaleR. For more information, see the inline help on these functions in R through use of the **?RxHiveData** and **?RxParquetData** commands.
*	RStudio Server community edition is now installed by default (with an opt-out option) on the Cluster Configuration blade as part of the provisioning flow.

## 11/09/2016 - Release of Spark 2.0 on HDInsight
* Spark 2.0 clusters on HDInsight 3.5 now support Livy and Jupyter services.

## 10/26/2016 - Release of R Server on HDInsight
* The URI for edge node access has changed to **clustername**-ed-ssh.azurehdinsight.net
* R Server on HDInsight cluster provisioning has been streamlined.
* R Server on HDInsight is now available as regular HDInsight "R Server" cluster type and no longer installed as a separate HDInsight application. The edge node and R Server binaries are now provisioned as part of the R Server cluster deployment. This improves speed and reliability of provisioning. Pricing model for R Server is updated accordingly.
* R Server cluster type price is now based on Standard tier price plus R Server surcharge price. This change doesn't affect effective pricing of R Server; it changes only how the charges are presented in the bill. All existing R Server clusters continue to work and Resource Manager templates continue to function until deprecation notice. **It is recommended though to update your scripted deployments to use new Resource Manager template.**






