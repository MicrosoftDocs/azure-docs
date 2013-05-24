<properties linkid="manage-services-hdinsight-introduction-hdinsight" urlDisplayName="Introducing HDInsight" pageTitle="Introducing Windows Azure HDInsight Service" metaKeywords="hdinsight, hdinsight service, hdinsight azure, what is hdinsight" metaDescription="Learn about the HDInsight Service for Windows Azure." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

# Introduction to Windows Azure HDInsight Service

##Overview
Windows Azure HDInsight Service is a service that deploys and provisions Apache™ Hadoop™ clusters in the cloud, providing a software framework designed to manage, analyze and report on big data.

###Big Data  
Data is described as "big data" to indicate that it is being collected in ever escalating volumes, at increasingly high velocities, and for a widening variety of unstructured formats and variable semantic contexts. Big data collection does not provide value to an enterprise on its own. For big data to provide value in the form of actionable intelligence or insight, not only must the right questions be asked and data relevant to the issues be collected, it must be accessible, cleaned, analyzed, and then presented in a useful way, often in combination with data from various other sources in what is now referred to as a mashup.

###Apache Hadoop  
Apache Hadoop is a software framework that facilitates big data management and analysis. Apache Hadoop core provides reliable data storage with the Hadoop Distributed File System (HDFS), and a simple MapReduce programming model to process and analyze, in parallel, the data stored in this distributed system. HDFS uses data replication to address hardware failure issues that arise when deploying such highly distributed systems.

###MapReduce 
To simplify the complexities of analyzing unstructured data from various sources, the MapReduce programming model provides a core abstraction that provides closure for map and reduce operations. The MapReduce programming model views all of its jobs as computations over datasets consisting of key-value pairs. So both input and output files must contain datasets that consist only of key-value pairs. Other Hadoop-related projects such as Pig and Hive are built on top of HDFS and the MapReduce framework. Projects such as these are used to provide a simpler way to manage a cluster than working with the MapReduce programs directly. Pig, for example, enables you to write programs using JavaScript that are compiled to MapReduce programs on the cluster. It also provides fluent controls to manage data flow. Hive provides a table abstraction for data in files stored in a cluster which can be queried using SQL-like statements.

###The HDInsight Service
The HDInsight Service for Windows Azure makes Apache Hadoop available as a service in the cloud. It makes the HDFS/MapReduce software framework and related projects available in a simpler, more scalable, and cost efficient environment. 

One of the efficiencies introduced by the HDInsight Service is in how it manages and stores data. The HDInsight Service uses Windows Azure Blob Storage as the default file system. Windows Azure Blob Storage and HDFS are distinct file systems that are optimized, respectively, for the storage of data and for computations on that data.

- Windows Azure Blob Storage provides a highly scalable and available, low cost, long term, and shareable storage option for data that is to be processed using the HDInsight Service.
- The Hadoop clusters deployed by the HDInsight Service on HDFS are optimized for running MapReduce computational tasks on the data.
 
HDInsight Service clusters are deployed in Azure on compute nodes to execute MapReduce tasks and can be dropped by users once these tasks have been completed. Keeping the data in the HDFS clusters after computations have been completed would be an expensive way to store this data. Windows Azure Blob Storage is a robust, general purpose Azure storage solution. So storing data in Blob Storage enables the clusters used for computation to be safely deleted without losing user data. But Blob Storage is not just a low cost solution. Azure Vault Storage (ASV) provides a full featured HDFS file system interface for Blob Storage that provides a seamless experience to customers by enabling the full set of components in the Hadoop ecosystem to operate (by default) directly on the data managed by Blog Storage. 

To simplify the configuring, running, and post-processing of Hadoop jobs, the HDInsight Service provides JavaScript and Hive interactive consoles. The JavaScript console is unique to HDInsight. It implements and makes available JavaScript, Pig and the Hadoop file system commands from the console. This simplified JavaScript approach enables IT and database professionals and a wider group of developers to deal with big data management and analysis by providing a more accessible path for them to begin using the Hadoop framework. HDInsight also provides a Sqoop connector that can be used to import data from a Windows Azure SQL database to HDFS or to export data to a Windows Azure SQL database from HDFS.
  
Microsoft Data Explorer Preview for Excel is available for importing data from Windows Azure HDInsight or any HDFS into Excel. This add-on enhances the Self-Service BI experience in Excel by simplifying data discovery and access to a broad range of data sources. In addition to Data Explorer, the HDInsight Service for Windows Azure also provides Open Database Connectivity (ODBC) drivers to integrate Business Intelligence (BI) tools such as Excel, SQL Server Analysis Services, and Reporting Services, facilitating and simplifying end-to-end data analysis.

###Outline
This topic describes the Hadoop ecosystem supported by the HDInsight Service, the main use scenarios for HDInsight Services, and a guide to further resources. It contains the following sections:

 * <a href="#Ecosystem">The Hadoop Ecosystem on HDInsight Service </a> - The HDInsight Service provides implementations of Pig, Hive and Sqoop, and supports other BI tools such as Excel, SQL Server Analysis Services and Reporting Services that are integrated with ASV/HDFS and the MapReduce framework using either the Data Explorer or the Hive ODBC driver. Other open source programs that are part of the Hadoop ecosystem, such as Mahout, Pegasus, and Flume can also be downloaded and used with HDInsight. This section describes what jobs these programs in the Hadoop ecosystem are designed to handle.

 * <a href="#Scenarios">Big Data Scenarios for the HDInsight Service</a> - This section addresses the question: for what types of jobs is the HDInsight Service an appropriate technology?

 * <a href="#Resources">Resources for the HDInsight Service</a> - This section indicates where to find relevant resources for additional information.


<h2 id="ecosystem"> <a name="Ecosystem">The Hadoop Ecosystem on Windows Azure </a></h2>

###Introduction

The HDInsight Service offers a framework implementing Microsoft's cloud-based solution for handling big data. This federated ecosystem manages and analyses large data amounts, exploiting the parallel processing capabilities of the MapReduce programming model. The Apache-compatible Hadoop technologies that can be used with the HDInsight are itemized and briefly described in this section.

The HDInsight Service provides implementations of Hive and Pig to integrate data processing and warehousing capabilities.  Microsoft’s Big Data solution  integrates with Microsoft's BI tools, such as SQL Server Analysis Services, Reporting Services, PowerPivot and Excel. This enables you to perform a straightforward BI on data stored and managed by the HDInsight Service. 

Other Apache-compatible technologies and sister technologies that are part of the Hadoop ecosystem and have been built to run on top of Hadoop clusters can also be downloaded are used with the HDInsight Service. These include open source technologies such as Sqoop and Flume which integrate HDFS with relational data stores and log files, and Pegasus which provides graph-mining capabilities. 

###Pig	

Pig is a high-level platform for processing big data on Hadoop clusters. Pig consists of a data flow language, called Pig Latin, supporting writing queries on large datasets and an execution environment running programs from a console. The Pig Latin programs consist of dataset transformation series converted under the covers, to a MapReduce program series. Pig Latin abstractions provide richer data structures than MapReduce, and perform for Hadoop what SQL performs for RDBMS systems. Pig Latin is fully extensible. User Defined Functions (UDFs), written in Java, Python, C#, or JavaScript, can be called to customize each processing path stage when composing the analysis. For additional information, see [Welcome to Apache Pig!](http://pig.apache.org/)

###Hive	

Hive is a distributed data warehouse managing data stored in an HDFS. It is the Hadoop query engine. Hive is for analysts with strong SQL skills providing an SQL-like interface and a relational data model. Hive uses a language called HiveQL; a dialect of SQL. Hive, like Pig, is an abstraction on top of MapReduce and when run, Hive translates queries into a series of MapReduce jobs. Scenarios for Hive are closer in concept to those for RDBMS, and so are appropriate for use with more structured data. For unstructured data, Pig is better choice. The HDInsight Service includes an ODBC driver for Hive, which provides direct real-time querying from business intelligence tools such as Excel into Hadoop. For additional information, see [Welcome to Apache Hive!](http://hive.apache.org/)

###Mahout

Mahout is an open source machine-learning library facilitating building scalable matching learning libraries. Using the map/reduce paradigm, algorithms for clustering, classification and batch-based collaborative filtering developed for Mahout are implemented on top of Apache Hadoop. For additional information, see [What is Apache Mahout](http://mahout.apache.org/).

###Pagasus	
	
Pegasus is a peta-scale graph mining system running on Hadoop. Graph mining is data mining used to find the patterns, rules, and anomalies characterizing graphs. A graph in this context is a set of objects with links existing between any two objects in the set. This structure type characterizes networks everywhere, including pages linked on the Web, computer and social networks (Facebook, Twitter), and many biological and physical systems. Prior to Pegasus, the maximum graph size that could be mined incorporated millions of objects. By developing algorithms that run in parallel on top of a Hadoop cluster, Pegasus develops algorithms to mine graphs containing billions of objects. For additional information, see the [Project Pegasus](http://www.cs.cmu.edu/~pegasus/) Web site.

###Sqoop		

Sqoop is tool that transfers bulk data between Hadoop and relational databases such a SQL, or other structured data stores, as efficiently as possible. Use Sqoop to import data from external structured data stores into the HDFS or related systems like Hive. Sqoop can also extract data from Hadoop and export the extracted data to external relational databases, enterprise data warehouses, or any other structured data store type. For additional information, see the  [Apache Sqoop](http://sqoop.apache.org/) Web site.

###Flume

Flume is a distributed, reliable, and available service for efficiently collecting, aggregating, and moving large log data amounts to HDFS. Flume's architecture is streaming data flow based. It is robust and fault tolerant with tunable and reliability mechanisms with many failover and recovery mechanisms. It has a simple extensible data model enabling online analytical applications. For additional information, see the  [Flume](http://flume.apache.org/) incubation site.

###Business Intelligence Tools

Familiar Business Intelligence (BI) tools such as Excel, PowerPivot, SQL Server Analysis Services and Reporting Services retrieves, analyzes and reports data integrated with the HDInsight Service using either the Data Explorer or ODBC drivers. The Hive ODBC driver and Hive Add-in for Excel are available for download on the "HDInsight Service" portal.

 * The Data Explorer can be downloaded from the [Microsoft Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=36803).

 * For information Analysis Services, see [SQL Server 2012 Analysis Services](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-analysis-services.aspx).	

 * For information Reporting Services, see [SQL Server 2012 Reporting](http://www.microsoft.com/en-us/sqlserver/solutions-technologies/business-intelligence/reporting.aspx).	


<h2> <a name="Scenarios"></a>Big Data Scenarios for the HDInsight Service</h2>
An exemplary scenario providing a use case for an HDInsight Service is an ad hoc analysis, in batch fashion, on an entire unstructured dataset stored on Windows Azure nodes, which does not require frequent updates.

These conditions apply to a wide variety of activities in business, science and governance. These might include, for example, monitoring supply chains in retail, suspicious trading patterns in finance, demand patterns for public utilities and services, air and water quality from arrays of environmental sensors, or crime patterns in metropolitan areas.

The HDInsight Service (and Hadoop technologies in general) are most suitable for handling a large amount of logged or archived data that does not require frequent updating once it is written, and that is read often, typically to do a full analysis. This scenario is complementary to data more suitably handled by a Relational Database Management System (RDBMS) that require lesser amounts of data (Gigabytes instead of Petabytes), and that must be continually updated or queried for specific data points within the full dataset. RDBMS work best with structured data organized and stored according to a fixed schema. MapReduce works well with unstructured data with no predefined schema because it is capable of interpreting that data when it is being processed.

<h2> <a name="Resources"></a>Next Steps: Resources for the HDInsight Service</h2>
**Microsoft: HDInsight Services**	

* [Welcome to HDInsight Service](http://go.microsoft.com/fwlink/?LinkID=285601) - The welcome page for the Windows Azure HDInsight Service for Windows Azure.

* [Getting Started with the Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/) - A tutorial that provides a quickstart for using the HDInsight Service.

* [How to Run the HDInsight Service Samples](/en-us/manage/services/hdinsight/howto-run-samples/) - A tutorial on how the run the samples that ship with the HDInsight Service.

* [HDInsight Service Interactive JavaScript and Hive Consoles](/en-us/manage/services/hdinsight/interactive-javascript-and-hive-consoles/) - The tutorial that provides an introduction to the HDInsight Interactive consoles.	

* [Big Data and Windows Azure](http://www.windowsazure.com/en-us/home/scenarios/big-data/) - Big Data scenarios that explore what you can build with Windows Azure.	

**Microsoft: Windows and SQL Database**	

* [Windows Azure home page](https://www.windowsazure.com/en-us/) - Scenarios, free trial sign up, development tools and documentation that you need get started building applications.
		
* [Windows Azure SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/ee336279.aspx)	- MSDN documentation for SQL Database.
	
* [Management Portal for SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/gg442309.aspx) - A lightweight and easy-to-use database management tool for managing SQL Database in the cloud.

* [Adventure Works for SQL Database](http://msftdbprodsamples.codeplex.com/releases/view/37304) - Download page for SQL Databse sample database.	

**Microsoft: Business Intelligence**		

* [Microsoft BI PowerPivot](http://www.microsoft.com/en-us/bi/PowerPivot.aspx) - A powerful data mashup and data exploration tool. 

* [Microsoft Data Explorer](http://www.microsoft.com/en-us/download/details.aspx?id=36803) - Import data from Windows Azure HDInsight or any HDFS. This add on enhances the Self-Service BI experience in Excel by simplifying data discovery and access to a broad range of data sources..	
			
* [SQL Server 2012 Analysis Services](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-analysis-services.aspx) - Build comprehensive, enterprise-scale analytic solutions that deliver actionable insights.	

* [SQL Server 2012 Reporting](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-reporting-services.aspx) - A comprehensive, highly scalable solution that enables real-time decision making across the enterprise. 
	
**Apache Hadoop**:			

* [Apache Hadoop](http://hadoop.apache.org/) - Software library providing a framework that allows for the distributed processing of large data sets across clusters of computers.	

* [HDFS](http://hadoop.apache.org/docs/r0.18.1/hdfs_design.html) - Hadoop Distributed File System (HDFS) is the primary storage system used by Hadoop applications.		

* [Map Reduce](http://mapreduce.org/) - A programming model and software framework for writing applications that rapidly process vast amounts of data in parallel on large clusters of compute nodes.	