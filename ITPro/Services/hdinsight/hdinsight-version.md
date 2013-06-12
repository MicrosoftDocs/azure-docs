<properties linkid="manage-services-hdinsight-version" urlDisplayName="HDInsight Hadoop Version" pageTitle="What version of Hadoop is in Windows Azure HDInsight" metaKeywords="hdinsight, hadoop, hdinsight hadoop, hadoop azure" metaDescription="A list of the Apache Hadoop component versions included in theWindows Azure HDInsight Service" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

#What Version of Hadoop is in Windows Azure HDInsight?

[Windows Azure HDInsight](http://go.microsoft.com/fwlink/?LinkID=285601) provides Hadoop services via components described in the following table:

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

<div class="dev-callout"> 
<b>Note</b> 
	<p>The SQL Server JDBC Driver is used internally by HDInsight and is not used for external operations. If you wish to connect to HDInsight using ODBC, please use HiveODBC.</p>
	<p> For more information on using HiveODBC, see <a href="/en-us/manage/services/hdinsight/use-excel-via-hive-odbc-driver/">How to connect Excel to Windows Azure HDInsight via HiveODBC</a>.</p>
</div>

The Hadoop distribution in Windows Azure HDInsight is based on the [Hortonworks Data Platform 1.1.0](http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/bk_releasenotes_HDP-Win/content/ch_relnotes-hdp-win-1.1.0_1.html). Note that this may change in future updates to the HDInsight service. One way to determine the available components and their versions is to login to a cluster and examine the contents of the "C:\apps\dist\" directory.