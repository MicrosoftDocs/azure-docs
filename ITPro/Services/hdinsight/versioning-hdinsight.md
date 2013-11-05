<properties linkid="manage-services-hdinsight-version" urlDisplayName="HDInsight Hadoop Version" pageTitle="What version of Hadoop is in Windows Azure HDInsight" metaKeywords="hdinsight, hadoop, hdinsight hadoop, hadoop azure" metaDescription="A list of the Apache Hadoop component versions included in theWindows Azure HDInsight Service" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />


#What Version of Hadoop is in Windows Azure HDInsight?

HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice provisions a specific version of the HortonWorks Data Platform (HDP) distribution and a set of components that are contained within that distribution.

##HDInsight Versions

The default cluster version used by [Windows Azure HDInsight](http://go.microsoft.com/fwlink/?LinkID=285601) is 2.1. It is based on the Hortonworks Data Platform version 1.3.0 and provides Hadoop services with the component versions itemized in the following table:

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


## Selecting a version when provisioning an HDInsight cluster

When creating a cluster through the HDInsight PowerShell Cmdlets or the HDInsight .NET SDK you can choose a version using the “Version” parameter.

If you use the **Quick Create** option, you will get the 2.1 version. If you use the **Custom Create** option from the Windows Azure Portal, you can choose the version of the cluster you will deploy from the HDInsight Version drop-down on the **Cluster Details** page.

![HDI.Versioning.VersionScreen][image-hdi-versioning-versionscreen]


## Supported Versions ##

The following table lists all versions of HDInsight, the release dates and when the deprecation date is know shows the data when the HDInsight version will be deprecated.

<table border="1">
<tr><th>HDInsight Version</th><th><a href="http://go.microsoft.com/fwlink/?LinkID=286746">HDP Version</a></th><th>Release Date</th></tr>
<tr><td>HDI 1.6</td><td>HDP 1.1</td><td>10/28/2013</td></tr>
<tr><td>HDI 2.1</td><td>HDP 1.3</td><td>10/28/2013</td></tr>
</table>

### A note on support for each version 
A “Support Window” refers to the period of time an HDInsight Cluster version is supported by Microsoft Customer Support and bound by this SLA.  An HDInsight Cluster is outside the Support Window if its version has a Support Expiration Date past the current date.  A list of supported HDInsight Cluster versions may be found in the table above.  The Support Expiration Date for a given HDInsight version (denoted as version X) is calculated as the later of:  

- Formula 1:  add 180 days to the date HDInsight version X was released
- Formula 2: add 90 days to the date HDInsight version X+1 (the subsequent version after X) is made available in the Windows Azure management portal.

**Additional Notes on versioning**	

The SQL Server JDBC Driver is used internally by HDInsight and is not used for external operations. If you wish to connect to HDInsight using ODBC, please use the Microsoft Hive ODBC driver. For more information on using Hive ODBC, [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][connect-excel-with-hive-ODBC].

The default Hadoop distribution in Windows Azure HDInsight version 2.1 is based on the [Hortonworks Data Platform 1.3.0][hdp-1-3-0]. 

The Hadoop distribution in Windows Azure HDInsight version 1.6 is based on the [Hortonworks Data Platform 1.1.0][hdp-1-1-0]. 

The component versions associated with HDInsight cluster versions may change in future updates to the HDInsight service. One way to determine the available components and to verify which versions are being used for a cluster is to login to a cluster using remote desktop and examine the contents of the "C:\apps\dist\" directory directly.

[image-hdi-versioning-versionscreen]: ../media/HDI.Versioning.VersionScreen.png

[connect-excel-with-hive-ODBC]: /en-us/manage/services/hdinsight/connect-excel-with-hive-ODBC/

[hdp-1-3-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.0/bk_releasenotes_hdp_1.x/content/ch_relnotes-hdp1.3.0_1.html

[hdp-1-1-0]: http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-Win-1.1/bk_releasenotes_HDP-Win/content/ch_relnotes-hdp-win-1.1.0_1.html

