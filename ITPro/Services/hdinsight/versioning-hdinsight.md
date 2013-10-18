<properties linkid="manage-services-hdinsight-version" urlDisplayName="HDInsight Hadoop Version" pageTitle="What version of Hadoop is in Windows Azure HDInsight" metaKeywords="hdinsight, hadoop, hdinsight hadoop, hadoop azure" metaDescription="A list of the Apache Hadoop component versions included in theWindows Azure HDInsight Service" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />


#What Version of Hadoop is in Windows Azure HDInsight?

The default cluster version used by [Windows Azure HDInsight](http://go.microsoft.com/fwlink/?LinkID=285601) is 2.1. It is based on the Hortonworks Data Platform version 1.3.0 and provides Hadoop services with the component versions itemized in the following table:

<table border="1">
<tr><th>Component</th><th>Version</th></tr>
<tr><td>Apache Hadoop</td><td>1.2.0</td></tr>
<tr><td>Apache Hive</td><td>0.11.0</td></tr>
<tr><td>Apache Pig</td><td>0.11</td></tr>
<tr><td>Apache Sqoop</td><td>1.4.3</td></tr>
<tr><td>Apache Oozie</td><td>3.2.2</td></tr>
<tr><td>Apache HCatalog</td><td>Merged with Hive</td></tr>
<tr><td>Apache Templeton</td><td>0.1.4</td></tr>
<tr><td>SQL Server JDBC Driver</td><td>3.0</td></tr>
<tr><td>Ambari</td><td>API v1.0</td></tr>
</table><br/>

[Windows Azure HDInsight](http://go.microsoft.com/fwlink/?LinkID=285601) cluster version 1.6 is also available. It is based on the Hortonworks Data Platform version 1.1.0 and provides Hadoop services with the component versions itemized in the following table:

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
</table><br/>

<b>Note</b> 	
The SQL Server JDBC Driver is used internally by HDInsight and is not used for external operations. If you wish to connect to HDInsight using ODBC, please use HiveODBC.

For more information on using HiveODBC, [Connect Excel to HDInsight with the Simba Hive ODBC driver][connect-excel-with-simba-hive-ODBC]</a>.

The default Hadoop distribution in Windows Azure HDInsight version 2.1 is based on the [Hortonworks Data Platform 1.3.0][hdp-1-3-0]. 

The Hadoop distribution in Windows Azure HDInsight version 1.6 is based on the [Hortonworks Data Platform 1.1.0][hdp-1-1-0]. 

The component versions associated with HDInsight cluster versions may change in future updates to the HDInsight service. One way to determine the available components and their versions for a cluster is to login to a cluster and examine the contents of the "C:\apps\dist\" directory directly.

[connect-excel-with-simba-hive-ODBC]: /en-us/manage/services/hdinsight/connect-excel-with-simba-hive-ODBC/

[hdp-1-3-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.3.0_1.html

[hdp-1-1-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/bk_releasenotes_HDP-Win/content/ch_relnotes-hdp-win-1.1.0_1.html

