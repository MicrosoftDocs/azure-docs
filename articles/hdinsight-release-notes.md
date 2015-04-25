<properties
	pageTitle="HDInsight Release Notes | Azure"
	description="HDInsight release notes."
	services="hdinsight"
	documentationCenter=""
	editor="cgronlun"
	manager="paulettm"
	authors="nitinme"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/27/2015"
	ms.author="nitinme"/>


#Microsoft HDInsight release notes

## Notes for 04/27/2015 release of HDInsight ##

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

## Notes for 04/14/2015 release of HDInsight ##

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

## Notes for 04/06/2015 release of HDInsight ##

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

## Notes for 04/01/2015 release of HDInsight ##

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

## Notes for 03/03/2015 release of HDInsight ##

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

## Notes for 02/18/2015 release of HDInsight ##

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
<td>Hadoop 2.6/HDP2.2 is available with HDInsight 3.2 clusters. It contains major updates to all of the open-source components. For more details, see <a href="http://azure.microsoft.com/documentation/articles/hdinsight-component-versioning/" target="_blank">What's new in HDInsight</a> and <a href ="http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.0/HDP_2.2.0_Release_Notes_20141202_version/index.html" target="_blank">HDP 2.2.0.0 Release Notes</a>.</td>
<td>Open-source software</td>
<td>All</td>
<td>N/A</td>
</tr>

<tr>
<td>HDinsight on Linux (Preview)</td>
<td>Clusters can be deployed running on Ubuntu Linux. For more details, see <a href="http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-linux-get-started/" target ="_blank">Getting Started with HDInsight on Linux</a>.</td>
<td>Service</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Storm General Availability</td>
<td>Apache Storm clusters are generally available. For more details, see <a href="http://azure.microsoft.com/documentation/articles/hdinsight-storm-getting-started/" target="_blank">Getting started using Storm in HDInsight</a>.</td>
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
<td>You can change the number of data nodes for a running HDInsight cluster without having to delete or re-create it. Currently, only Hadoop Query and Apache Storm cluster types have this ability, but support for Apache HBase cluster type is soon to follow. For more information, see <a href="http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-cluster-scaling/" target="_blank">Cluster scaling in HDInsight</a>.</td>
<td>Service</td>
<td>Hadoop, Storm</td>
<td>N/A</td>
</tr>

<tr>
<td>Visual Studio tooling</td>
<td>In addition to complete tooling for Apache Storm, the tooling for Apache Hive in Visual Studio has been updated to include statement completion, local validation, and improved debugging support. For more information, see <a href="http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-visual-studio-tools-get-started/" target="_blank">Get Started with HDInsight Hadoop Tools for Visual Studio</a>.</td>
<td>Tooling</td>
<td>Hadoop</td>
<td>N/A</td>
</tr>

<tr>
<td>Hadoop Connector for DocumentDB</td>
<td>With Hadoop Connector for DocumentDB, you can perform complex aggregations, analysis, and manipulations over your schema-less JSON documents stored across DocumentDB collections or across database accounts. For more information and a tutorial, see <a href="http://azure.microsoft.com/documentation/articles/documentdb-run-hadoop-with-hdinsight/" target="_blank">Run Hadoop jobs using DocumentDB and HDInsight</a>.</td>
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

## Notes for 02/06/2015 release of HDInsight ##

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

## Notes for 1/29/2015 release of HDInsight ##

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

## Notes for 1/5/2015 release of HDInsight ##

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
<td><p>This size configuration applies to automatically converted map joins. The value represents the sum of the sizes of tables that can be converted to hash maps that fit in memory. In a prior release, this value increased from the default value of 10 MB to 128 MB. However, the new value of 128 MB was causing jobs to fail due to lack of memory. This release reverts the default value back to 10 MB. Customers can still choose to override this value during cluster creation, given their queries and table sizes. For more information about this setting and how to override it, see <a href="http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.0.2/ds_Hive/optimize-joins.html#JoinOptimization-OptimizeAutoJoinConversion" target="_blank">Optimize Auto Join Conversion</a> in Hortonworks documentation. </p></td>
<td>Hive</td>
<td>Hadoop, Hbase</td>
<td>N/A</td>
</tr>

</table>
<br>

## Notes for 12/23/2014 release of HDInsight ##

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

## Notes for 12/18/2014 release of HDInsight ##

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
<td><a href = "http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-customize-cluster/" target="_blank">Cluster customization General Avalability</a></td>
<td><p>Customization provides the ability for you to customize your Azure HDInsight clusters with projects that are available from the Apache Hadoop ecosystem. With this new feature, you can experiment and deploy Hadoop projects to Azure HDInsight. This is enabled through the **Script Action** feature, which can modify Hadoop clusters in arbitrary ways by using custom scripts. This customization is available on all types of HDInsight clusters including Hadoop, HBase, and Storm. To demonstrate the power of this capability, we have documented the process to install the popular <a href = "http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-spark-install/" target="_blank">Spark</a>, <a href = "http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-r-scripts/" target="_blank">R</a>, <a href = "http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-solr-install/" target="_blank">Solr</a>, and <a href = "http://azure.microsoft.com/documentation/articles/hdinsight-hadoop-giraph-install/" target="_blank">Giraph</a> modules. This release also adds the capability for customers to specify their custom script action via the Azure portal, provides guidelines and best practices about how to build custom script actions using helper methods, and provides guidelines about how to test the script action. </p></td>
<td>Feature General Availability</td>
<td>All</td>
<td>N/A</td>
</tr>


</table>
<br>

## Notes for 12/05/2014 release of HDInsight ##

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
<td>If this happens, users will notice an occasional spike of 3 seconds in the latency of Hbase queries. </td>
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


## Notes for 11/21/2014 release of HDInsight ##

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

## Notes for 11/14/2014 release of HDInsight ##

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




## Notes for 11/07/2014 release of HDInsight ##

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

## Notes for 10/15/2014 release ##

This hotfix release fixed a memory leak in Templeton that affected the heavy users of Templeton. In some cases, users who exercised Templeton heavily would see errors manifested as 500 error codes because the requests would not have enough memory to run. The workaround for this issue was to restart the Templeton service. This issue has been fixed.


## Notes for 10/7/2014 release ##

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

* This error is a known [compatibility issue](https://social.msdn.microsoft.com/Forums/azure/a7de016d-8de1-4385-b89e-d2e7a1a9d927/hdinsight-powershellsdk-error-cluster-is-not-configured-for-http-services-access?forum=hdinsight) that may occur due to a difference in the version of the  HDInsight SDK or Azure PowerShell and the version of the cluster. Clusters created on 8/15 or later have support for new provisioning capability into virtual networks. But this capability is not correctly interpreted by older versions of the  HDInsight SDK or Azure PowerShell. The result is a failure in some job submission operations. If you use  HDInsight SDK APIs or Azure PowerShell cmdlets (**Use-AzureHDInsightCluster** or **Invoke-Hive**) to submit jobs, those operations may fail with the error message "*Cluster <clustername> is not configured for HTTP services access*." Or (depending on the operation), you may get other error messages, such as "*Cannot connect to cluster*".

* These compatibility issues are resolved in the latest versions of the HDInsight SDK and Azure PowerShell. We recommend updating the HDInsight SDK to version 1.3.1.6 or later and Azure PowerShell Tools to version 0.8.8 or later. You can get access to the latest HDInsight SDK from [](http://nuget.codeplex.com/wikipage?title=Getting%20Started) and the Azure PowerShell Tools at [How to install and configure Azure PowerShell](../powershell-install-configure/).



## Notes for 9/12/2014 release of HDInsight 3.1##

* This release is based on Hortonworks Data Platform (HDP) 2.1.5. For a list of the bugs fixed in this release, see the [Fixed in this Release](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.5/bk_releasenotes_hdp_2.1/content/ch_relnotes-hdp-2.1.5-fixed.html) page on the Hortonworks site.
* In the Pig libraries folder, the “avro-mapred-1.7.4.jar” file has been changed to "avro-mapred-1.7.4-hadoop2.jar." The contents of this file contains a minor bug fix that is non-breaking. It is recommended that customers do not make a direct dependency on the name of the JAR file to avoid breaks when files are renamed.


## Notes for 8/21/2014 release ##

* We are adding the following WebHCat configuration (HIVE-7155), which sets the default memory limit for a Templeton controller job to 1 GB. (The previous default value was 512 MB.)

	 templeton.mapper.memory.mb (=1024)

	* This change addresses the following error which certain Hive queries had run in to due to lower memory limits: “Container is running beyond physical memory limits.”
	* To revert to the old defaults, you can set this configuration value to 512 through Azure PowerShell at cluster creation time by using the following command:

		Add-AzureHDInsightConfigValues -Core @{"templeton.mapper.memory.mb"="512";}


* The host name of the zookeeper role was changed to *zookeeper*. This affects name resolution within the cluster, but it doesn't affect external REST APIs. If you have components that use the *zookeepernode* host name, you need to update them to use new name. The new names for the three zookeeper nodes are:
	* zookeeper0
	* zookeeper1
	* zookeeper2
* HBase version support matrix is updated. Only HDInsight version 3.1 (HBase version 0.98) is supported for production for HBase workloads. Version 3.0 (which was available for preview) is not supported moving forward.

## Notes about clusters created prior to 8/15/2014 ##

An Azure PowerShell or HDInsight SDK error message, "Cluster <clustername> is not configured for HTTP services access" (or depending on the operation, other error messages such as: "Cannot connect to cluster") may be encountered due to a version difference between Azure PowerShell or the HDInsight SDK and a cluster. Clusters created on 8/15 or later have support for new provisioning capability into virtual networks. This capability isn’t correctly interpreted by older versions of the Azure PowerShell or the HDInsight SDK, which results in failures of job submission operations. If you use HDInsight SDK APIs or Azure PowerShell cmdlets (such as Use-AzureHDInsightCluster or Invoke-AzureHDInsightHiveJob) to submit jobs, those operations may fail with one of the error messages described.

These compatibility issues are resolved in the latest versions of the HDInsight SDK and Azure PowerShell. We recommend updating the HDInsight SDK to version 1.3.1.6 or later and Azure PowerShell Tools to version 0.8.8 or later. You can get access to the latest HDInsight SDK from [NuGet][nuget-link]. You can access the Azure PowerShell Tools by using [Microsoft Web Platform Installer][webpi-link].


## Notes for 7/28/2014 release ##

* **HDInsight available in new regions**:  We expanded HDInsight geographical presence to three regions. HDInsight customers can create clusters in these regions:
	* East Asia
	* North Central US
	* South Central US
* HDInsight version 1.6 (HDP 1.1 and Hadoop 1.0.3) and HDInsight version 2.1 (HDP1.3 and Hadoop 1.2) are being removed from the Azure portal. You can continue to create Hadoop clusters for these versions by using the Azure PowerShell cmdlet, [New-AzureHDInsightCluster](http://msdn.microsoft.com/library/dn593744.aspx) or by using the [HDInsight SDK](http://msdn.microsoft.com/library/azure/dn469975.aspx). Please refer to the [HDInsight component versioning](../hdinsight-component-versioning/) page for more information.
* Hortonworks Data Platform (HDP) changes in this release:

<table border="1">
<tr><th>HDP</th><th>Changes</th></tr>
<tr><td>HDP 1.3 / HDI 2.1</td><td>No changes</td></tr>
<tr><td>HDP 2.0 / HDI 3.0</td><td>No changes</td></tr>
<tr><td>HDP 2.1 / HDI 3.1</td><td>zookeeper: ['3.4.5.2.1.3.0-1948'] -> ['3.4.5.2.1.3.2-0002']</td></tr>


</table><br>

## Notes for 6/24/2014 release ##

This release contains enhancements to the HDInsight service:

* **HDP 2.1 availability**: HDInsight 3.1 (which contains HDP 2.1) is generally available and is the default version for new clusters.
* **HBase – Azure portal improvements**: We are making HBase clusters available in Preview. You can create HBase clusters from the portal with three clicks:

![](http://i.imgur.com/cmOl5fM.png)

With HBase, you can build a variety of real-time workloads on HDInsight, from interactive websites that work with large datasets to services storing sensor and telemetry data from millions of end points. The next step would be to analyze the data in these workloads with Hadoop jobs, and this is possible in HDInsight through Azure PowerShell and the Hive cluster dashboard.

### Apache Mahout preinstalled on HDInsight 3.1 ###

 [Mahout](http://hortonworks.com/hadoop/mahout/) is pre-installed on HDInsight 3.1 Hadoop clusters, so you can run Mahout jobs without the need for additional cluster configuration. For example, you can remote into an Hadoop cluster by using Remote Desktop Protocol (RDP), and without additional steps, you can run the following Hello World Mahout command:

		mahout org.apache.mahout.classifier.df.tools.Describe -p /user/hdp/glass.data -f /user/hdp/glass.info -d I 9 N L  

		mahout org.apache.mahout.classifier.df.BreimanExample -d /user/hdp/glass.data -ds /user/hdp/glass.info -i 10 -t 100

For a more complete explanation of this procedure, see the documentation for the [Breiman Example](https://mahout.apache.org/users/classification/breiman-example.html) on the Apache Mahout website.


### Hive queries can use Tez in HDInsight 3.1 ###

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


###Drivers
The Java Database Connnectivity (JDBC) driver for SQL Server is used internally by HDInsight and is not used for external operations. If you want to connect to HDInsight by using Open Database Connectivity (ODBC), please use the Microsoft Hive ODBC driver. For more information, see [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver](hdinsight-connect-excel-hive-odbc-driver.md).


### Bug fixes ###

With this release, we have refreshed the following HDInsight versions with several bug fixes:

* HDInsight 2.1 (HDP 1.3)
* HDInsight 3.0 (HDP 2.0)
* HDInsight 3.1 (HDP 2.1)


## Hortonworks release notes ##

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
