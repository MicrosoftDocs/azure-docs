<properties 
	pageTitle="Performance best practices - Azure" 
	description="Learn about best practices for performance in Azure." 
	services="cloud-services, sql-database, storage, service-bus, virtual-network" 
	documentationCenter=".net" 
	authors="Rboucher" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="9/1/2014" 
	ms.author="robb"/>

# Best Practices for Performance in Azure Applications  #

This guide provides prescriptive guidance on the best practices and techniques that should be followed to optimize Azure application performance. 

Note that there are many advantages to using Azure: performance is only one of them. The recommendations in this paper focus primarily on performance. There are other scenarios where performance is not as critical: for example, you may wish to take advantage of off-loading physical hardware management to Azure, or the "pay as you go" feature may be particularly attractive. This paper does not attempt to evaluate scenarios where performance is a lesser priority. 

## Overview ##
 Performance can be defined as ["the amount of useful work accomplished' compared to the time and resources used."](http://go.microsoft.com/fwlink/?LinkId=252650) 


The definition has two sides to it: metrics and resources. Performance metrics are numbers that must be achieved in order to satisfy business requirements. They include things like response time, throughput, availability, etc. Performance also includes the level of resource usage required to reach a given level of performance metrics. Since cost is almost always a business requirement, and resources cost money, performance implies using resources as efficiently as possible. 

### Performance Life Cycle
You can affect performance at two different points in the application life cycle:

- during design, where you make fundamental architectural decisions that can affect performance; and
- at run-time, where you identify bottlenecks, carry out monitoring and measurement, etc.

Both activities are necessary. This whitepaper focuses mainly on the design phase, because architectural mistakes are harder to fix at runtime.

#### Application modeling
It is important to build a model of your application's most important customer scenarios. Here, "important" means having the largest impact on performance. Identifying these scenarios, and the required application activities, will enable you to carry out proof of concept testing.

#### Proof of Concept Performance Testing ###

Full end-to-end performance testing is a critical step during application design and deployment. Azure applications consist of many parts, which may include custom-built components as well as those provided by Microsoft. Microsoft cannot performance test every possible combination of these components. Therefore, fully and properly performance testing your application is a critical step of any deployment. 

Based on the application model you built, next you should carry out proof of concept testing of your application as soon as possible, and load test it to validate the application architecture, to make sure that your application meets performance requirements in terms of scalability and latency. It is extremely important to validate your initial architecture and assumptions. You don't want to find out that your application is unable to sustain the expected load when it goes live! Visual Studio provides facilities for carrying out load testing, described in [Visual Studio Load Test in Azure Overview](http://www.visualstudio.com/get-started/load-test-your-app-vs). 

### What's Different about Performance in Azure ###

The most dramatic performance improvements achievable in Azure applications come from the scaling out and partitioning of resources. Building scalable applications in Azure requires leveraging the scale-out of resources by their physical partitioning: SQL databases, storage, compute nodes, etc. This partitioning enables parallel execution of application tasks, and is thus the basis for high performance, because Azure has the resources of an entire data center available, and handles the physical partitioning for you. To achieve this level of overall performance requires the use of proper scale-out design patterns. 


Paradoxically, while achieving this high performance for the application as a whole, each individual operation is less performant in Azure than its on-premise equivalent, because of increased network latency, increased reliability due to fail-over operations etc. But parallelism, enabled by the proper use of partitioning resources, more than makes up for the individual performance shortfall. 

### Required Design Activities ###

Some performance factors change depending on your application scenario. The next chapter deals with these things: scaling and partitioning of resources, locating data appropriately, and optimizing use of Azure services. 


The chapter after that deals with performance factors that pertain to any Azure application: network latency, transient connections, etc. 

## Designing for Performance in a Cloud Environment ##

You must consider the following scenario-dependent areas when designing an Azure application, or migrating an on-premises application to Azure: 

- Resource scale out and partitioning: this is the fundamental mechanism for achieving parallelism, and thus high performance. 
* Data architecture: what kind of data storage to use for the different parts of your application's data 
* Individual Azure Service Optimizations 

Azure gains its maximum performance advantage from being able to scale out and partition resources, which enables massive parallelization of activities. This is pretty obvious when thinking about a massive Azure SQL database, but it is also true of any resource that can become a bottleneck. 

Azure offers the following choices for data storage, and making the correct choice has a big impact on performance: 

* Azure SQL database 
* Azure Caching 
* Azure table storage 
* Azure blob storage 
* Azure Drives 
* Azure queues 
* Azure Service Bus Brokered Messaging 
* "Big Data" storage solutions such as Hadoop 

Since specifics vary, we will discuss how to do these in terms of the following scenarios: 

* Azure Cloud Service using a SQL database 
* Azure Cloud Service heavily using storage queues 
* Azure Website using MySQL as a backend database 
* "Big Data" applications 
* Applications using a MySQL backend database 

### Scenario: SQL Database in a Cloud Service ###

Most principles of good database design still apply to Azure SQL Database. There is an immense body of material describing how to design effective SQL Server or Azure SQL Database schemas. Several references on SQL database schema design are: 

* [Database Design and Modeling Fundamentals]( http://go.microsoft.com/fwlink/?LinkId=252675) 
* [Stairway to Database Design](http://go.microsoft.com/fwlink/?LinkId=252676) 
* [Database Design](http://go.microsoft.com/fwlink/?LinkId=252677) 

There are two key design activities that are different with Azure: 

* Locating data appropriately: this may entail moving some relational data into Azure Blobs, or Azure Tables when appropriate. 
* Ensuring maximum scalability: deciding whether, and how to partition your data. 

#### Data Architecture: Moving Data out of a SQL Database ####

Some data which often resides in an on-premises SQL Server should be moved elsewhere in Azure. 

##### Moving Data into Azure Blobs ####

Blob data such as images or documents should not be stored in a SQL database, but in Azure Blob storage. Although such data is often stored in on-premises SQL Server, in the cloud it is much cheaper to use Blob Storage. Typically you would replace foreign keys that pointed to the blob data with Blob Storage identifiers, to maintain the ability to retrieve the blob data, and queries that referenced the data would require modification. 

##### Moving SQL Tables into Azure Table Storage #####

In deciding whether to use Azure Table Storage, you must look at cost and performance. Table Storage is much more economical than the same data stored in a SQL database. However you must carefully consider to what extent the data makes use of SQL's relational features such as joins, filtering, queries, etc. If the data makes little use of such features then it is a good candidate for storage in an Azure Table. 

One common design pattern where you can consider Table Storage involves a table with many rows, such as the Customers table in the common AdventureWorks sample database, where a number of columns are not used by a majority of Customers, but only by a small subset of Customers. It is a common design pattern to split the columns off into a second table (perhaps named CustomerMiscellany), with an optional 1-to-0 relationship between Customer and the second table. You could consider moving the second table to Table Storage. You would have to assess whether the size of the table, and the access patterns, made this cost-effective. 

For more discussion of Table Storage, see: 

* [Azure Table Storage and Azure SQL Database - Compared and Contrasted](http://msdn.microsoft.com/library/jj553018.aspx)
* [Azure Table Storage Performance Considerations](http://go.microsoft.com/fwlink/?LinkId=252663) 
* [SQL Database and Azure Table Storage](http://go.microsoft.com/fwlink/?LinkId=252664) 
* [Improving Performance by Batching Azure Table Storage Inserts](http://go.microsoft.com/fwlink/?LinkID=252665), which discusses some performance results. 
* [SQL Database Performance and Elasticity Guide](http://go.microsoft.com/fwlink/?LinkId=221876) 

#### Data Partitioning ####

One of the most frequently partitioned resources is data. If you are creating an Azure Cloud Service, then you should consider the use of SQL Database's built-in sharding available via Federations. 

For an overview of SQL Database Federations, see [Federations in SQL Database]( http://go.microsoft.com/fwlink/?LinkId=252668).  

##### Design Tasks for SQL Federations #####

Use of SQL Database Federations in an Azure Cloud Service requires some modification of classic design principles. However, most things true of good design for an on-premises SQL Server database are a necessary starting point for designing SQL Database Federations. There are two major design tasks, deciding: 

* what to federate on; and 

* where to place non-federated tables. 

In order to decide what to federate on, you need to examine your database schema and identify aggregations of related tables. An aggregate is a set of tables, all of which are related by 1-to-many relationships through their foreign keys, except for the root of the aggregate. 

For example, in the well-known AdventureWorks sample database, one possible aggregate is the set {Customer, Order, OrderLine, and possibly a few more}. Another possible aggregate is {Supplier, Product, OrderLine, Order}. 

Each aggregate is a candidate for federating. You must evaluate where you expect growth in size, and also examine your application's work load: queries that "align well" with the federating scheme, i.e. which don't require data from more than one federation member, will run well. Those that don't align well will require logic in the application layer, because SQL Database does not currently support cross-database joins. 

To see an example of a design analysis that examines the AdventureWorks database in order to federate it, and shows you step-by-step the considerations involved in the design, see [Scale-First Approach to Database Design with Federations: Part 1 - Picking Federations and Picking the Federation Key](http://go.microsoft.com/fwlink/?LinkId=252671). 

Once you decide which tables to federate, you must add the primary key of the aggregate root table as a column to each of the related tables. 

After deciding what tables to federate on, another issue is the location of reference tables, as well as other database objects. There is a thorough discussion of this subject at [Scale-First Approach to Database Design with Federations: Part 2 - Annotating and Deploying Schema for Federations](http://go.microsoft.com/fwlink/?LinkId=252672). Doing more advanced queries is described in [Part 2]( http://go.microsoft.com/fwlink/?LinkId=252673). 

                                            
##### Do-It-Yourself Partitioning #####

There are a number of samples that show ways of partitioning data. If you decide not to use Federations to partition your SQL Database instance, you must choose a method of partitioning that is appropriate to your application. Here are some examples: 

* A comprehensive account written before the release of Federations is [How to Shard with SQL Database](http://go.microsoft.com/fwlink/?LinkId=252678). 
* [SQL Server and SQL Database Shard Library]( http://go.microsoft.com/fwlink/?LinkId=252679) 

##### Partitioning Other Resources #####

You can partition other resources besides SQL Database. For example you might wish to partition application servers and dedicate them to specific databases. Let's assume your application contained N app servers, and also N databases. If each app server is allowed to access each database, that will consume N squared database connections which in some cases may hit a hard Azure limit. But if you restrict each app server to only a few databases, then you will significantly reduce the number of connections used. 

Depending on your application you may be able to apply similar reasoning to other resources. 


#### Caching ####

The Azure Caching Service provides distributed elastic memory for caching things like ASP.net session state, or commonly referenced values from SQL Database reference tables. Because the objects are in distributed memory, there is a considerable performance gain possible. Because Azure handles the caching infrastructure, there is little development cost in implementing it. 

Plan to provide enough caching capacity so that you can cache frequently accessed objects. In SQL Database there are frequently reference tables used to convert numeric codes into longer descriptive character strings. These tables often include data such as Country and City names, valid Postal Code values, names of Departments within your company, etc. For smaller tables it may make sense to store the entire table in cache, for others you might only store the most frequently used values. The performance gain comes in multi-join queries that involve this data: for each value that is found in the cache, several disk accesses are saved. A good introduction and discussion of performance and caching in Azure is [Introducing the Azure Caching Service](http://go.microsoft.com/fwlink/?LinkId=252680). A more recent blog post on the subject is at [Windows #Azure Caching Performance Considerations](http://go.microsoft.com/fwlink/?LinkId=252681). 

#### Scenario: Using Queuing in Azure Applications ####

An example of this scenario is using StreamInsight to populate queues with messages that will be processed later. 

Azure Queues are used to pass messages, temporally decouple subsystems, and to provide load balancing and load leveling. 

Azure has two alternative queue technologies: Azure Storage Queues, and Service Bus. 

Azure Storage Queues provide features such as large queue size, progress tracking, and more. Service Bus provides features such as publish/subscribe, full integration with Windows Communication Foundation ("WCF"), automatic duplicate detection, guaranteed first-in first-out ("FIFO") delivery, and more. 

For a more complete and detailed comparison of the two technologies, see [Azure Queues and Azure Service Bus Queues - Compared and Contrasted](http://go.microsoft.com/fwlink/?LinkId=252682). 

For a discussion of Service Bus performance, see [Best Practices for Performance Improvements Using Service Bus Brokered Messaging](http://go.microsoft.com/fwlink/?LinkID=252683). 

#### Scenario: "Big Data" Applications ####

"Big Data" is often found as a by-product of another system or application. Examples include: 

* Web logs 

* Other diagnostic, audit, and monitoring files 

* Oil company seismic logs 

* Click-data and other information left by people traversing the Internet 

"Big Data" can be identified by the following criteria: 

* Size (typically, hundreds of terabytes or larger) 

* Type: non-relational, variable schema, files in a file system 

The data is generally not suited for processing in a relational database. 

There are four major kinds of non-SQL data storage: 

* Key-value 

* Document 

* Graph 

* Column-Family 

Azure provides direct support for Hadoop, and also enables use of other technologies. For information about Azure HDInsight Service, see: 

* [Big Data](big-data.md) 
* [Azure HDInsight Service](/documentation/services/hdinsight/)
* [Getting Started with Azure HDInsight Service](hdinsight-get-started.md)

For some discussion of issues involved with various noSQL storage methods, see: 

* [Getting Acquainted with NoSQL on Azure](http://go.microsoft.com/fwlink/?LinkId=252729) 
* [AggregateOrientedDatabase](http://go.microsoft.com/fwlink/?LinkID=252731)
* [PolyglotPersistence](http://go.microsoft.com/fwlink/?LinkId=252732) 

#### Other Azure Individual Service Performance Optimizations ####

Many of the individual Azure services have features and settings that can impact performance significantly, and so must be analyzed. 

##### Azure Drives #####

You can simulate an existing application's hard drive usage by an Azure Drive, which is backed by a Windows Blob and is thus persistent across individual machine failure. 

##### Local Storage #####

Although it isn't persistent across machine failure, it can be used to hold frequently accessed information, or to hold intermediate results that will be used elsewhere. This is cost effective since there is no charge for its use. 

##### Azure Access Control Service (ACS) #####

The two main factors affecting ACS resource usage, and thus performance, are the token size, and encryption. Further discussion is at [ACS Performance Guidelines](http://go.microsoft.com/fwlink/?LinkId=252747). 

##### Serialization #####

Serialization is not an obvious part of performance optimization, but reducing network traffic can be significant, in some application scenarios. For an example of how serialization sizes can vary depending on the protocol, see the reductions demonstrated in [Azure Web Applications and Serialization](http://go.microsoft.com/fwlink/?LinkId=252749). 

If the amount of data being moved is a performance issue, then use the smallest available serialization available. In the event that serialization performance isn't sufficient, consider using custom or non-Microsoft third party serialization formats. As always, proof of concept testing is key. 


### Azure Websites using mySQL ###

The following links provide performance advice for MySQL: 

* Searching on *performance* at [http://mysql.com]( http://go.microsoft.com/fwlink/?LinkId=252775) turns up many resources. 
* The forums at[ http://forums.mysql.com/list.php?24]( http://go.microsoft.com/fwlink/?LinkId=252776) are other resources to consult. 



## Designing for Shared Systems ##

Azure is designed to run multiple concurrent applications, replicated for fail-over on multiple machines. This affects application performance in a number of ways: 

* Transient connections 

* Resource throttles that limit maximum usage 

* Network latency 

* Physical location of services 

These considerations apply to all application architectures, because they are determined by the physical infrastructure of Azure data centers. For detailed discussion, see the [SQL Database Performance and Elasticity Guide](http://go.microsoft.com/fwlink/?LinkID=252666). 

### Network latency ###

Azure is a service-based platform of shared resources, and this means that two types of latencies or interruptions regularly occur. The first is the time taken to make a request and receive a response over the internet. Since those requests and responses can travel through any number of routers before they return to the client, timeouts and disconnections are more frequent than in local, fixed networks. The second is the time it takes for a shared-resource system like Azure to create backup versions of data for durability and to replace and reroute requests to any removed instances. These latencies and failures are important to understand how to compensate to achieve any performance requirements in the application. Load testing at a real-world level will give you more information about the latencies that you see. 

Take into account that there probably will be more, since the cloud data center is likely physically further away than your on-premises server. 

### Physical location of services ###

If possible, co-locate different nodes or application layers within the same data center. Otherwise network latency and cost will be greater. 

For example, locate the web application in the same data center as the SQL Database instance that it accesses, rather than in a different data center, or on-premises. 

### Transient connections ###

Your application MUST be able to handle dropped connections. Dropped connections are inevitable and intrinsic to the cloud architecture (e.g. ops like replacing a dead node, splitting a Federation member in SQL Database, etc). The best framework for doing this right now is [The Transient Fault Handling Application Block](http://go.microsoft.com/fwlink/?LinkID=236901). 

### Throttling ###

In the service world, resources can be very granular and you pay only for what you use. However, for all resources there is a minimum guarantee of size, speed, or throughput - important if you need more than a certain size database, for example - but also in some cases are outer limits to a service that is important. Because Azure applications run in a shared environment with other applications, Azure applies a number of resource throttles that you must take into account. If you exceed the throttle limit for a resource, a further request for that resource will result in an exception. 

### Physical Capacity ###

One necessary piece of performance planning is capacity planning: if you fail to provide enough storage of various kinds, your application may fail to run at all. Likewise inadequate memory or processor capacity can dramatically slow the execution of your application. 


Azure dramatically reduces the effort involved in capacity planning because many old activities - particularly obtaining and provisioning computers -- have changed dramatically. In Azure, capacity planning no longer focuses on the physical elements of computing, but instead works at a higher level of abstraction, asking rather, how many of the following are needed: 

* Compute nodes 
* Blob storage 
* Table storage 
* Queues etc. 

And because of Azure's scalability, the initial capacity decisions are not cast in stone: it is relatively easy to scale up (or down) Azure resources. Even so, it is important to do accurate capacity planning, since that will ensure that when the application goes live there is not a period of trial and error regarding capacity. 

For applications whose resource needs fluctuate dramatically over time, consider using [The Autoscaling Application Block](http://go.microsoft.com/fwlink/?LinkId=252873). This Block allows you to set rules for the scaling up and down of role instances. There are two kinds of rules defined: 

* Constraint rules, which set maximum/minimum number of instances by time of day 

* Reactive rules which take effect when some condition such as CPU usage % occurs 

You can also define custom rules. For more information, see [The Autoscaling Application Block](http://go.microsoft.com/fwlink/?LinkId=252873). 



Capacity planning is an entire specialty of its own, and this paper assumes that you have already done it. For a detailed discussion of capacity planning in Azure, see [Capacity Planning for Service Bus Queues and Topics](http://go.microsoft.com/fwlink/?LinkId=252875).



## Performance Monitoring and Tuning at Runtime ##

Even the most careful design cannot guarantee zero performance problems at run-time, so it is necessary to monitor application performance on an on-going basis, to verify that it is achieving the required performance metrics, and to correct situations in which it fails to achieve those metrics. Even well designed applications are subject to unanticipated events such as exponential growth in usage or possible changes to the run-time environment, which can result in performance problems where tuning is required. Often identifying and resolving bottlenecks is a significant part of the process. 


Being able to trouble shoot performance problems at runtime requires up-front work to build in logging and proper exception handling, so that trouble-shooting can be done whenever problems may arise. For a comprehensive treatment of this area, see [Troubleshooting Best Practices for Developing Azure Applications](http://go.microsoft.com/fwlink/?LinkID=252876). 

There are tools available for monitoring the on-going performance of every Azure service. In addition logging facilities should be built into applications that provide detailed information needed for trouble-shooting and resolving performance issues. 

### SQL Database ###

Note that the SQL Profiler is not currently available in Azure. There are several work-arounds to gain the needed performance information.One alternative during development is to do initial testing in an on-premises version of the database, where SQL Profiler is available. 

You can also use the SET STATISTICS Transact-SQL command, and use SQL Server Management Studio to view the execution plan generated by a query, since coding efficient queries is a key to performance. For a detailed discussion, and a step-by-step explanation of how to do this, see [Gaining Performance Insight into SQL Database](http://go.microsoft.com/fwlink/?LinkId=252877). Another interesting approach is at Analyze performance between [SQL Database and SQL Server on premise](http://go.microsoft.com/fwlink/?LinkId=252878). 

Two topics about Dynamic Management Views are: 

* [Monitoring SQL Database Using Dynamic Management Views](http://go.microsoft.com/fwlink/?LinkId=236195) 
* [Useful DMV's for SQL Database to analyze if you miss SQL Profiler](http://go.microsoft.com/fwlink/?LinkId=252879) 

### Analysis Resources and Tools ###

A number of third-party non-Microsoft tools are available for analyzing Azure performance: 

- [Cerebrata](http://go.microsoft.com/fwlink/?LinkId=252880) 
- [SQL Server and SQL Database Performance Testing: Enzo SQL Baseline](http://enzosqlbaseline.codeplex.com/) 

Other Resources 

* [SQL Database Performance and Elasticity Guide](http://go.microsoft.com/fwlink/?LinkID=252666) 
* [SQL Database](http://go.microsoft.com/fwlink/?LinkId=246930) 
* [Storage](http://go.microsoft.com/fwlink/?LinkId=246933) 
* [Networking]( http://go.microsoft.com/fwlink/?LinkId=252882) 
* [Service Bus]( http://go.microsoft.com/fwlink/?LinkId=246934) 
* [Azure Planning - A Post-decision Guide to Integrate Azure in Your Environment](http://go.microsoft.com/fwlink/?LinkId=252884) 
