<properties urlDisplayName="HDInsight Introduction" pageTitle="Introduction to Hadoop in HDInsight | Azure" metaKeywords="" description="Learn how Azure HDInsight uses Apache Hadoop clusters in the cloud, to provide a software framework to manage, analyze, and report on big data." metaCanonical="" services="hdinsight" documentationCenter="" title="Introduction to Hadoop in HDInsight" authors="bradsev" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="bradsev" />



# Introduction to Hadoop in HDInsight

##Overview
Azure HDInsight is a service that deploys and provisions Apache™ Hadoop® clusters in the cloud, providing a software framework designed to manage, analyze, and report on big data.

###Big data
Data is described as "big data" to indicate that it is being collected in ever escalating volumes, at increasingly high velocities, and for a widening variety of unstructured formats and variable semantic contexts. Big data collection does not provide value to an enterprise on its own. For big data to provide value in the form of actionable intelligence or insight, not only must the right questions be asked and data relevant to the issues be collected, the data must be accessible, cleaned, analyzed, and then presented in a useful way, often in combination with data from various other sources that establish perspective and context in what is now referred to as a mashup.

###Apache Hadoop
Apache Hadoop is a software framework that facilitates big data management and analysis. Apache Hadoop core provides reliable data storage with the Hadoop Distributed File System (HDFS), and a simple MapReduce programming model to process and analyze, in parallel, the data stored in this distributed system. HDFS uses data replication to address hardware failure issues that arise when deploying such highly distributed systems.

###MapReduce and YARN
To simplify the complexities of analyzing unstructured data from various sources, the MapReduce programming model provides a core abstraction that underwrites closure for map and reduce operations. The MapReduce programming model views all of its jobs as computations over datasets consisting of key-value pairs. So both input and output files must contain datasets that consist only of key-value pairs. The primary takeaway from this constraint is the MapReduce jobs are, as a result, composable.

Other Hadoop-related projects such as Pig and Hive are built on top of HDFS and the MapReduce framework. Projects such as these are used to provide a simpler way to manage a cluster than working with the MapReduce programs directly. Pig, for example, enables you to write programs using a procedural language called Pig Latin that are compiled to MapReduce programs on the cluster. It also provides fluent controls to manage data flow. Hive is a data warehouse infrastructure that provides a table abstraction for data in files stored in a cluster which can then be queried using SQL-like statements in a declarative language called HiveQL.

###HDInsight
Azure HDInsight makes Apache Hadoop available as a service in the cloud. It makes the HDFS/MapReduce software framework and related projects such as Pig, Hive, and Oozie available in a simpler, more scalable, and cost-efficient environment.

A second headnode has been added to the Hadoop clusters deployed by HDInsight to increase the availability of the service. Standard implementations of Hadoop clusters typically have a single headnode. HDInsight removes this single point of failure with the addition of a secondary headnode. The switch to new HA cluster configuration doesn’t change the price of the cluster, unless customer provision clusters with extra large head node.

One of the primary efficiencies introduced by HDInsight is in how it manages and stores data. HDInsight uses Azure Blob storage as the default file system. Blob storage and HDFS are distinct file systems that are optimized, respectively, for the storage of data and for computations on that data.

- Azure Blob storage provides a highly scalable and available, low cost, long term, and shareable storage option for data that is to be processed using HDInsight.
- The Hadoop clusters deployed by HDInsight on HDFS are optimized for running MapReduce computational tasks on the data.

HDInsight clusters are deployed in Azure on compute nodes to execute MapReduce tasks and can be dropped by users once these tasks have been completed. Keeping the data in the HDFS clusters after computations have been completed would be an expensive way to store this data. Blob storage is a robust, general purpose Azure storage solution. So storing data in Blob storage enables the clusters used for computation to be safely deleted without losing user data. But Blob storage is not just a low cost solution: It provides a full-featured HDFS file system interface that provides a seamless experience to customers by enabling the full set of components in the Hadoop ecosystem to operate (by default) directly on the data that it manages.

HDInsight uses Azure PowerShell to configure, run, and post-process Hadoop jobs. HDInsight also provides a Sqoop connector that can be used to import data from an Azure SQL database to HDFS or to export data to an Azure SQL database from HDFS.

HDInsight has also made YARN available. It is a new, general-purpose, distributed, application management framework that replaces the classic Apache Hadoop MapReduce framework for processing data in Hadoop clusters. It effectively serves as the Hadoop operating system, and takes Hadoop from a single-use data platform for batch processing to a multi-use platform that enables batch, interactive, online and stream processing. This new management framework improves scalability and cluster utilization according to criteria such as capacity guarantees, fairness, and service-level agreements.

Microsoft Power Query for Excel is available for importing data from Azure HDInsight or any HDFS into Excel. This add-on enhances the self-service BI experience in Excel by simplifying data discovery and access to a broad range of data sources. In addition to Power Query, the Microsoft Hive ODBC Driver is available to integrate business intelligence (BI) tools such as Excel, SQL Server Analysis Services, and Reporting Services, facilitating and simplifying end-to-end data analysis.

###Outline
This topic describes the Hadoop ecosystem supported by HDInsight, the main use scenarios for HDInsight, and a guide to further resources. It contains the following sections:

 * <a href="#Ecosystem">The Hadoop Ecosystem on HDInsight</a>: HDInsight provides implementations of Pig, Hive, Sqoop, Oozie, and Ambari and supports other BI tools such as Excel, SQL Server Analysis Services and Reporting Services that are integrated with Blob storage/HDFS and the MapReduce framework using either the Power Query or the Microsoft Hive ODBC Driver. This section describes what jobs these programs in the Hadoop ecosystem are designed to handle.

 * <a href="#Scenarios">Big data scenarios for HDInsight</a>: This section addresses the question: for what types of jobs is HDInsight an appropriate technology?

 * <a href="#Resources">Resources for HDInsight</a>: This section indicates where to find relevant resources for additional information.


<h2 id="ecosystem"> <a name="Ecosystem">The Hadoop ecosystem on Azure </a></h2>

###Introduction

HDInsight offers a framework implementing Microsoft's cloud-based solution for handling big data. This federated ecosystem manages and analyses large data amounts, exploiting the parallel processing capabilities of the MapReduce programming model. The Apache-compatible Hadoop technologies that can be used with HDInsight are itemized and briefly described in this section.

HDInsight provides implementations of Hive and Pig to integrate data processing and warehousing capabilities.  Microsoft's big data solution  integrates with Microsoft's BI tools, such as SQL Server Analysis Services, Reporting Services, PowerPivot, and Excel. This enables you to perform a straightforward BI on data stored and managed by HDInsight in Blob storage. 

Other Apache-compatible technologies and sister technologies that are part of the Hadoop ecosystem and have been built to run on top of Hadoop clusters can also be downloaded are used with HDInsight. These include open source technologies such as Sqoop which integrate HDFS with relational data stores. 

###Pig	

Pig is a high-level platform for processing big data on Hadoop clusters. Pig consists of a data flow language, called Pig Latin, supporting writing queries on large datasets and an execution environment running programs from a console. The Pig Latin programs consist of dataset transformation series converted under the covers, to a MapReduce program series. Pig Latin abstractions provide richer data structures than MapReduce, and perform for Hadoop what SQL performs for Relational Database Management Systems (RDBMS). Pig Latin is fully extensible. User Defined Functions (UDFs), written in Java, Python, Ruby, C#, or JavaScript, can be called to customize each processing path stage when composing the analysis. For additional information, see [Welcome to Apache Pig!](http://pig.apache.org/)

###Hive	

Hive is a distributed data warehouse managing data stored in an HDFS. It is the Hadoop query engine. Hive is for analysts with strong SQL skills providing an SQL-like interface and a relational data model. Hive uses a language called HiveQL; a dialect of SQL. Hive, like Pig, is an abstraction on top of MapReduce and when run, Hive translates queries into a series of MapReduce jobs. Scenarios for Hive are closer in concept to those for RDBMS, and so are appropriate for use with more structured data. For unstructured data, Pig is better choice. For additional information, see [Welcome to Apache Hive!](http://hive.apache.org/)

###Sqoop		

Sqoop is tool that transfers bulk data between Hadoop and relational databases such a SQL, or other structured data stores, as efficiently as possible. Use Sqoop to import data from external structured data stores into the HDFS or related systems like Hive. Sqoop can also extract data from Hadoop and export the extracted data to external relational databases, enterprise data warehouses, or any other structured data store type. For additional information, see the  [Apache Sqoop](http://sqoop.apache.org/) Website.

###Oozie

Apache Oozie is a workflow/coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack and supports Hadoop jobs for Apache MapReduce, Apache Pig, Apache Hive, and Apache Sqoop. It can also be used to schedule jobs specific to a system, like Java programs or shell scripts.

###Ambari

Apache Ambari is for provisioning, managing and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. For more information about the APIs, see [Ambari API reference](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md). HDInsight currently only supports the Ambari monitoring feature. Ambari API version 1.0 is supported by HDInsight cluster versions 2.1 and 3.0. For more information about Ambari, see the [Apache Ambari](http://ambari.apache.org/) Website.


###Microsoft Avro Library

The Microsoft Avro Library implements the Apache Avro data serialization system for the Microsoft.NET environment. Apache Avro provides a compact binary data interchange format for serialization. It uses [JSON](http://www.json.org) to define language agnostic schema that underwrites language interoperability. Data serialized in one language can be read in another. Currently C, C++, C#, Java, PHP, Python, and Ruby are supported. Detailed information on the format can be found in the [Apache Avro Specification](http://avro.apache.org/docs/current/spec.html). Note that the current version of the Microsoft Avro Library does not support the Remote Procedure Calls (RPC) part of this specification.

Apache Avro serialization format is widely used in Azure HDInsight and other Apache Hadoop environments. Avro provides a convenient way to represent complex data structures within a Hadoop MapReduce job. The format of Avro files has been designed to support the distributed MapReduce programming model. The key feature that enables the distribution is that the files are “splittable” in the sense that one can seek any point in a file and start reading from a particular block. For additional information, see [Serialize data with the Microsoft Avro Library](../hdinsight-dotnet-avro-serialization/).

###Business intelligence tools and connectors

Familiar business intelligence (BI) tools - such as Excel, PowerPivot, SQL Server Analysis Services and Reporting Services - retrieve, analyze, and report data integrated with HDInsight using either the Power Query add-in or the Microsoft Hive ODBC Driver.

 * Microsoft Power Query for Excel can be downloaded from the [Microsoft Download Center](http://go.microsoft.com/fwlink/?LinkID=286689).

 * Microsoft Hive ODBC Driver can be downloaded from this [Download Site](http://go.microsoft.com/fwlink/?LinkID=286698).

 * For information Analysis Services, see [SQL Server 2012 Analysis Services](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-analysis-services.aspx).	

 * For information Reporting Services, see [SQL Server 2012 Reporting](http://www.microsoft.com/en-us/sqlserver/solutions-technologies/business-intelligence/reporting.aspx).	


<h2> <a name="Scenarios"></a>Big data scenarios for HDInsight</h2>
An exemplary scenario providing a use case for HDInsight is an ad hoc analysis, in batch fashion, on an entire unstructured dataset stored on Azure nodes, which does not require frequent updates.

These conditions apply to a wide variety of activities in business, science and governance. These might include, for example, monitoring supply chains in retail, suspicious trading patterns in finance, demand patterns for public utilities and services, air and water quality from arrays of environmental sensors, or crime patterns in metropolitan areas.

HDInsight (and Hadoop technologies in general) are most suitable for handling a large amount of logged or archived data that does not require frequent updating once it is written, and that is read often, typically to do a full analysis. This scenario is complementary to data more suitably handled by a RDBMS that requires lesser amounts of data (gigabytes instead of petabytes), and that must be continually updated or queried for specific data points within the full dataset. RDBMS work best with structured data organized and stored according to a fixed schema. MapReduce works well with unstructured data with no predefined schema because it is capable of interpreting that data when it is being processed.

<h2> <a name="Resources"></a>Next steps: Resources for HDInsight</h2>
**Microsoft: HDInsight**	

* [HDInsight Documentation](http://go.microsoft.com/fwlink/?LinkID=285601): The documentation page for Azure HDInsight with links to articles, videos, and more resources.

* [HDInsight Release Notes](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-release-notes/): Notes on the latest releases.

* [Get started with Azure HDInsight][hdinsight-get-started]: A tutorial that provides a quickstart for using HDInsight.

* [Run the HDInsight samples][hdinsight-samples]: A tutorial on how the run the samples that ship with HDInsight.

* [Big data and Azure](http://azure.microsoft.com/en-us/solutions/big-data/): Big data scenarios that explore what you can build with Azure.	

* [Azure HDInsight SDK](http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx): Reference documentation for the HDinsight SDK.

**Microsoft: Windows and SQL Database**	

* [Azure home page](http://azure.microsoft.com/en-us/): Scenarios, free trial sign up, development tools and documentation that you need get started building applications.
		
* [Azure SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/ee336279.aspx): MSDN documentation for SQL Database.
	
* [Management Portal for SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/gg442309.aspx): A lightweight and easy-to-use database management tool for managing SQL Database in the cloud.

* [Adventure Works for SQL Database](http://msftdbprodsamples.codeplex.com/releases/view/37304): Download page for SQL Database sample database.	

**Microsoft: Business intelligence**		

* [Connect Excel to HDInsight with Power Query][hdinsight-power-query]: Learn how to connect Excel to the Azure storage account that stores the data associated with your HDInsight cluster by using Microsoft Power Query for Excel. 

* [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][hdinsight-ODBC]: Learn how to import data from Azure HDInsight with the Microsoft Hive ODBC Driver.

* [Microsoft BI PowerPivot](http://www.microsoft.com/en-us/bi/PowerPivot.aspx): Download and get information about a powerful data mashup and exploration tool.
			
* [SQL Server 2012 Analysis Services](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-analysis-services.aspx): Download an evaluation copy of SQL Server 2012 and learn how to build comprehensive, enterprise-scale analytic solutions that deliver actionable insights.	

* [SQL Server 2012 Reporting](http://www.microsoft.com/sqlserver/en/us/solutions-technologies/business-intelligence/SQL-Server-2012-reporting-services.aspx): Download an evaluation copy of SQL Server 2012 and learn how to create comprehensive, highly scalable solutions that enables real-time decision making across the enterprise. 
	
**Apache Hadoop**:			

* [Apache Hadoop](http://hadoop.apache.org/): Learn more about the Apache Hadoop software library, a framework that allows for the distributed processing of large data sets across clusters of computers.	

* [HDFS](http://hadoop.apache.org/docs/r0.18.1/hdfs_design.html): Learn more about the architecture and design of the Hadoop Distributed File System (HDFS), the primary storage system used by Hadoop applications.		

* [MapReduce](http://mapreduce.org/): Learn more about the programming  framework for writing Hadoop applications that rapidly process vast amounts of data in parallel on large clusters of compute nodes.	

[hdinsight-ODBC]: ../hdinsight-connect-excel-hive-ODBC-driver/
[hdinsight-power-query]: ../hdinsight-connect-excel-power-query/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-samples]: ../hdinsight-run-samples/

[zookeeper]: http://zookeeper.apache.org/ 
