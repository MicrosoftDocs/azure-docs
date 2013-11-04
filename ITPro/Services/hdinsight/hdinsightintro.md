<properties linkid="manage-services-hdinsight-introduction-hdinsight" urlDisplayName="Introducing HDInsight" pageTitle="Introduction to Windows Azure HDInsight" metaKeywords="hdinsight, hdinsight service, hdinsight azure, what is hdinsight" metaDescription="Windows Azure HDInsight is a service that deploys and provisions Apache Hadoop clusters in the cloud, providing a software framework designed to manage, analyze, and report on big data." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="cgronlun" manager="paulettm" />

# Introduction to Windows Azure HDInsight

##Overview
Windows Azure HDInsight is a service that deploys and provisions Apache™ Hadoop® clusters in the cloud, providing a software framework designed to manage, analyze, and report on big data.

###Big data  
Data is described as "big data" to indicate that it is being collected in ever escalating volumes, at increasingly high velocities, and for a widening variety of unstructured formats and variable semantic contexts. Big data collection does not provide value to an enterprise on its own. For big data to provide value in the form of actionable intelligence or insight, not only must the right questions be asked and data relevant to the issues be collected, the data must be accessible, cleaned, analyzed, and then presented in a useful way, often in combination with data from various other sources that establish perspective and context in what is now referred to as a mashup.

###Apache Hadoop  
Apache Hadoop is a software framework that facilitates big data management and analysis. Apache Hadoop core provides reliable data storage with the Hadoop Distributed File System (HDFS), and a simple MapReduce programming model to process and analyze, in parallel, the data stored in this distributed system. HDFS uses data replication to address hardware failure issues that arise when deploying such highly distributed systems.

###MapReduce 
To simplify the complexities of analyzing unstructured data from various sources, the MapReduce programming model provides a core abstraction that underwrites closure for map and reduce operations. The MapReduce programming model views all of its jobs as computations over datasets consisting of key-value pairs. So both input and output files must contain datasets that consist only of key-value pairs. The primary takeaway from this constraint is the MapReduce jobs are, as a result, composable. 

Other Hadoop-related projects such as Pig and Hive are built on top of HDFS and the MapReduce framework. Projects such as these are used to provide a simpler way to manage a cluster than working with the MapReduce programs directly. Pig, for example, enables you to write programs using a procedural language called Pig Latin that are compiled to MapReduce programs on the cluster. It also provides fluent controls to manage data flow. Hive is a data warehouse infrastructure that provides a table abstraction for data in files stored in a cluster which can then be queried using SQL-like statements in a declarative language called HiveQL.

###HDInsight 
Windows Azure HDInsight makes Apache Hadoop available as a service in the cloud. It makes the HDFS/MapReduce software framework and related projects such as Pig and Hive available in a simpler, more scalable, and cost-efficient environment. 

One of the primary efficiencies introduced by HDInsight is in how it manages and stores data. HDInsight uses Windows Azure Blob storage as the default file system. Blob storage and HDFS are distinct file systems that are optimized, respectively, for the storage of data and for computations on that data.

- Windows Azure Blob storage provides a highly scalable and available, low cost, long term, and shareable storage option for data that is to be processed using HDInsight.
- The Hadoop clusters deployed by HDInsight on HDFS are optimized for running MapReduce computational tasks on the data.
 
HDInsight clusters are deployed in Azure on compute nodes to execute MapReduce tasks and can be dropped by users once these tasks have been completed. Keeping the data in the HDFS clusters after computations have been completed would be an expensive way to store this data. Blob storage is a robust, general purpose Azure storage solution. So storing data in Blob storage enables the clusters used for computation to be safely deleted without losing user data. But Blob storage is not just a low cost solution: It provides a full-featured HDFS file system interface that provides a seamless experience to customers by enabling the full set of components in the Hadoop ecosystem to operate (by default) directly on the data that it manages. 

HDInsight uses Windows Azure PowerShell to configure, run, and post-process Hadoop jobs. HDInsight also provides a Sqoop connector that can be used to import data from a Windows Azure SQL database to HDFS or to export data to a Windows Azure SQL database from HDFS.
  
Microsoft Power Query for Excel is available for importing data from Windows Azure HDInsight or any HDFS into Excel. This add-on enhances the self-service BI experience in Excel by simplifying data discovery and access to a broad range of data sources. In addition to Power Query, the Microsoft Hive ODBC Driver is available to integrate business intelligence (BI) tools such as Excel, SQL Server Analysis Services, and Reporting Services, facilitating and simplifying end-to-end data analysis.

###Outline
This topic describes the Hadoop ecosystem supported by HDInsight, the main use scenarios for HDInsight, and a guide to further resources. It contains the following sections:

 * <a href="#Ecosystem">The Hadoop Ecosystem on HDInsight</a>: HDInsight provides implementations of Pig, Hive and Sqoop, and supports other BI tools such as Excel, SQL Server Analysis Services and Reporting Services that are integrated with Blob storage/HDFS and the MapReduce framework using either the Power Query or the Microsoft Hive ODBC Driver. This section describes what jobs these programs in the Hadoop ecosystem are designed to handle.

 * <a href="#Scenarios">Big data scenarios for HDInsight</a>: This section addresses the question: for what types of jobs is HDInsight an appropriate technology?

 * <a href="#Resources">Resources for HDInsight</a>: This section indicates where to find relevant resources for additional information.


<h2 id="ecosystem"> <a name="Ecosystem">The Hadoop ecosystem on Windows Azure </a></h2>

###Introduction

HDInsight offers a framework implementing Microsoft's cloud-based solution for handling big data. This federated ecosystem manages and analyses large data amounts, exploiting the parallel processing capabilities of the MapReduce programming model. The Apache-compatible Hadoop technologies that can be used with HDInsight are itemized and briefly described in this section.

HDInsight provides implementations of Hive and Pig to integrate data processing and warehousing capabilities.  Microsoft’s big data solution  integrates with Microsoft's BI tools, such as SQL Server Analysis Services, Reporting Services, PowerPivot, and Excel. This enables you to perform a straightforward BI on data stored and managed by HDInsight in Blob storage. 

Other Apache-compatible technologies and sister technologies that are part of the Hadoop ecosystem and have been built to run on top of Hadoop clusters can also be downloaded are used with HDInsight. These include open source technologies such as Sqoop which integrate HDFS with relational data stores. 

###Pig	

Pig is a high-level platform for processing big data on Hadoop clusters. Pig consists of a data flow language, called Pig Latin, supporting writing queries on large datasets and an execution environment running programs from a console. The Pig Latin programs consist of dataset transformation series converted under the covers, to a MapReduce program series. Pig Latin abstractions provide richer data structures than MapReduce, and perform for Hadoop what SQL performs for Relational Database Management Systems (RDBMS). Pig Latin is fully extensible. User Defined Functions (UDFs), written in Java, Python, Ruby, C#, or JavaScript, can be called to customize each processing path stage when composing the analysis. For additional information, see [Welcome to Apache Pig!](http://pig.apache.org/)

###Hive	

Hive is a distributed data warehouse managing data stored in an HDFS. It is the Hadoop query engine. Hive is for analysts with strong SQL skills providing an SQL-like interface and a relational data model. Hive uses a language called HiveQL; a dialect of SQL. Hive, like Pig, is an abstraction on top of MapReduce and when run, Hive translates queries into a series of MapReduce jobs. Scenarios for Hive are closer in concept to those for RDBMS, and so are appropriate for use with more structured data. For unstructured data, Pig is better choice. For additional information, see [Welcome to Apache Hive!](http://hive.apache.org/)

###Sqoop		

Sqoop is tool that transfers bulk data between Hadoop and relational databases such a SQL, or other structured data stores, as efficiently as possible. Use Sqoop to import data from external structured data stores into the HDFS or related systems like Hive. Sqoop can also extract data from Hadoop and export the extracted data to external relational databases, enterprise data warehouses, or any other structured data store type. For additional information, see the  [Apache Sqoop](http://sqoop.apache.org/) Web site.

###Business intelligence tools and connectors

Familiar business intelligence (BI) tool—such as Excel, PowerPivot, SQL Server Analysis Services and Reporting Services—retrieve, analyze, and report data integrated with HDInsight using either the Power Query add-in or the Microsoft Hive ODBC Driver.

 * Microsoft Power Query for Excel can be downloaded from the [Microsoft Download Center](http://go.microsoft.com/fwlink/?LinkID=286689).

 * Microsoft Hive ODBC Driver can be downloaded from this [Download Site](http://go.microsoft.com/fwlink/?LinkID=286698).

 * For information Analysis Services, see [SQL Server 2012 Analysis Services](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-analysis-services.aspx).	

 * For information Reporting Services, see [SQL Server 2012 Reporting](http://www.microsoft.com/en-us/sqlserver/solutions-technologies/business-intelligence/reporting.aspx).	


<h2> <a name="Scenarios"></a>Big data scenarios for HDInsight</h2>
An exemplary scenario providing a use case for an HDInsight service is an ad hoc analysis, in batch fashion, on an entire unstructured dataset stored on Windows Azure nodes, which does not require frequent updates.

These conditions apply to a wide variety of activities in business, science and governance. These might include, for example, monitoring supply chains in retail, suspicious trading patterns in finance, demand patterns for public utilities and services, air and water quality from arrays of environmental sensors, or crime patterns in metropolitan areas.

HDInsight (and Hadoop technologies in general) are most suitable for handling a large amount of logged or archived data that does not require frequent updating once it is written, and that is read often, typically to do a full analysis. This scenario is complementary to data more suitably handled by a RDBMS that requires lesser amounts of data (gigabytes instead of petabytes), and that must be continually updated or queried for specific data points within the full dataset. RDBMS work best with structured data organized and stored according to a fixed schema. MapReduce works well with unstructured data with no predefined schema because it is capable of interpreting that data when it is being processed.

<h2> <a name="Resources"></a>Next steps: Resources for HDInsight</h2>
**Microsoft: HDInsight**	

* [HDInsight Documentation](http://go.microsoft.com/fwlink/?LinkID=285601): The documentation page for Windows Azure HDInsight with links to articles, videos, and more resources.

* [Get started with Windows Azure HDInsight](/en-us/manage/services/hdinsight/get-started-hdinsight/): A tutorial that provides a quickstart for using HDInsight.

* [Run the HDInsight samples](/en-us/manage/services/hdinsight/howto-run-samples/): A tutorial on how the run the samples that ship with HDInsight.

* [Big data and Windows Azure](http://www.windowsazure.com/en-us/home/scenarios/big-data/): Big data scenarios that explore what you can build with Windows Azure.	

**Microsoft: Windows and SQL Database**	

* [Windows Azure home page](https://www.windowsazure.com/en-us/): Scenarios, free trial sign up, development tools and documentation that you need get started building applications.
		
* [Windows Azure SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/ee336279.aspx): MSDN documentation for SQL Database.
	
* [Management Portal for SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/gg442309.aspx): A lightweight and easy-to-use database management tool for managing SQL Database in the cloud.

* [Adventure Works for SQL Database](http://msftdbprodsamples.codeplex.com/releases/view/37304): Download page for SQL Database sample database.	

**Microsoft: Business intelligence**		

* [Connect Excel to Windows Azure HDInsight with Power Query][connect-excel-with-power-query]: Connect Excel to the Windows Azure storage account that stores the data associated with your HDInsight cluster by using Microsoft Power Query for Excel. 

* [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][connect-excel-with-hive-ODBC]: Import data from Windows Azure HDInsight or any HDFS. This add-on enhances the self-service BI experience in Excel by simplifying data discovery and access to a broad range of data sources.

* [Microsoft BI PowerPivot](http://www.microsoft.com/en-us/bi/PowerPivot.aspx): A powerful data mashup and data exploration tool.
			
* [SQL Server 2012 Analysis Services](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-analysis-services.aspx): Build comprehensive, enterprise-scale analytic solutions that deliver actionable insights.	

* [SQL Server 2012 Reporting](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-reporting-services.aspx): A comprehensive, highly scalable solution that enables real-time decision making across the enterprise. 
	
**Apache Hadoop**:			

* [Apache Hadoop](http://hadoop.apache.org/): Software library providing a framework that allows for the distributed processing of large data sets across clusters of computers.	

* [HDFS](http://hadoop.apache.org/docs/r0.18.1/hdfs_design.html): Hadoop Distributed File System (HDFS) is the primary storage system used by Hadoop applications.		

* [MapReduce](http://mapreduce.org/): A programming model and software framework for writing applications that rapidly process vast amounts of data in parallel on large clusters of compute nodes.	

[connect-excel-with-hive-ODBC]: /en-us/manage/services/hdinsight/connect-excel-with-hive-ODBC/

[connect-excel-with-power-query]: /en-us/manage/services/hdinsight/connect-excel-with-power-query/