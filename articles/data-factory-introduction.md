<properties title="Introduction to Azure Data Factory" pageTitle="Introduction to Azure Data Factory" description="Learn how you can use the Azure Data Factory service to compose data processing, data storage and data movement services to create pipelines that produce trusted information." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="spelluru" />

# Introduction to Azure Data Factory
Azure Data Factory is a managed service that you can use to produce trusted information from raw data in cloud or on-premises data sources. It allows developers to build data-driven workflows (pipelines) that join, aggregate and transform data sourced from their local, cloud-based and internet services, and set up complex data processing logic with little programming. The Azure Data Factory service enables the easy monitoring and management of these pipelines by providing rich visual experience offered through Azure Management Portal. The information produced by pipelines can be easily consumed from BI, analytics tools, and other applications to reliably drive key business insights and decisions.

This article provides detailed overview of the Azure Data Factory service, the value it provides, and the scenarios it supports.

##Azure Data Factory Overview
Traditionally, data integration projects focused on creating Extract-Transform-Load (ETL) processes that extract data from various data sources within an organization, transform the data to confirm to the target schema of an Enterprise Data Warehouse (EDW), and load the data into EDW – the single source of truth analytics, on top of which, the business intelligence (BI) solutions are built.

![Traditional ETL][image-data-factory-introduction-traditional-ETL]

In the world of Big Data, as organizations look to leverage the data available to their business, the data processing landscape is more diverse than ever: processing data across geographic locations, on-premises and cloud, variety of data types, and volume of data. This explosion of data form, size and velocity has led to a range of new data processing and storage services such as Azure HDInsight to be created to help organizations work with all forms of data at the scale and price point they require.

![Todays Diverse Processing Landscape][image-data-factory-introduction-todays-diverse-processing-landspace]

The Enterprise Data Warehouse and Big Data “worlds” are merging such that a modern information production system needs to use the best of breed technologies across all to produce the richest, and most agile insights possible. Traditional ETL developers extend the scale and reach of their projects to include Big Data technologies and Big Data developers complement their Big Data systems with those that already exist in the enterprise (EDW, custom solutions, etc…). In short, developers need to be able to create workflows that orchestrate data movement and data processing that involve cloud and on-premises data sources, EDW and Big Data systems, and so on. A system that lets IT Professionals monitor and manage these workflows also must be in place. Organizations had to write large amounts of code to deliver such an information production system that supports creation, scheduling, monitoring and management of workflows. 



The Azure Data Factory service empowers organizations to harness such diversity by providing a platform to compose data processing, data storage and data movement services to create and schedule information production pipelines, and manage the data assets the pipelines produce.  Developers can quickly build and chain data pipelines that join, aggregate and transform data sourced from their local, cloud-based and internet services.  IT Professionals can use rich metrics, health and lineage information available for all data assets created by a data factory to easily operate a factory and quickly diagnose any issues that disrupt the generation of business critical data assets.

Azure Data Factory service lets you:

- **Easily work with diverse data storage and processing systems.** 
The data processing landscape is more diverse than ever.  Data and processing solutions are coming from many locations with new forms, volumes, and velocities including on-premises, semi-structured and unstructured data, cloud systems and open-source software.  Data Factory enables you to use data where it is stored and compose services for storage, processing, and data movement using Azure Data Factory pipelines.  
- **Transform your data into trusted data assets.** 
Combining and shaping complex data can take more than one try to get it right, and upgrading to new data models can be costly and time consuming.  The Data Factory service supports Hive, Pig and C# processing on HDInsight to iteratively transform your data until it meets your needs.  
- **Monitor your data production processes in one place.** 
With a diverse data portfolio, it is increasingly important to have a reliable and uniform view of your storage, processing, and data movement services.  The Azure Data Factory provides rich visual experience through Azure Management Portal that you can use to get the information you need to quickly understand end-to-end pipeline health, pinpoint data production issues and quickly take corrective action. You can also visually track data lineage and the relationships between your raw data, processes, and trusted data, and see a full historical accounting of job execution, system health, and dependencies.
- **Produce trusted data**
Organizations need to adapt to the constantly changing questions they need to answer, and stay on top of when their production data is ready to go. The Data Factory service Improves your ability to drive better business insights by producing timely and trusted information that is easily consumed by BI and analytics tools, data marts, and other applications.

With this support from the Azure Data Factory service, organizations can focus on extracting insights from data while the Data Factory service reliably takes care of the plumbing required with key features such as automatic Hadoop (HDInsight) cluster management, retries for transient failures, configurable timeout policies, alerting, and more.

## Scenarios
There are a wide range of use cases for data pipelines that span on-premises systems, cloud systems, Software-as-a-Service (SaaS) systems as well as streaming and batch-based data production.  This section describes a few sample scenarios that the Azure Data Factory supports.

###Scenario #1: Source the Data Hub
![image-data-factory-introduction-secenario1-source-datahub]

Customers have data of disparate types located in disparate sources.  The first step in building an information production pipeline to fulfill a business process that can connect to all the required sources (SaaS services, file shares, FTP, web services, etc…) of data and, if not already there, move the data into a data hub for subsequent processing (join, aggregate, cleanse, enrich, etc…).
  
Organizations had to build custom data movement components or write a lot of glue code to integrate these data sources to a Data Hub.  It also requires a lot of time and resources to develop enterprise grade monitoring and alerting of such systems.
 
Azure Data Factory not only makes it easy to move the data from various data sources to a Data Hub but also provides a rich user-interface as well PowerShell cmdlets to monitor and manage the system.

###Scenario #2: Operationalize Information Production
![image-data-factory-introduction-secenario2-operationalize-infoproduction]

This scenario expands on scenario #1. Once data is present in a Data Hub, you want to author and operationalize (schedule) data processing pipelines that utilize all the compute services of the hub to transform/aggregate/cleanse/etc… their data.  This is a complex infrastructure and pose a number of challenges while implementing, managing, scaling, troubleshooting, and versioning such a pipeline system.

Data processing in Azure Data Factory is enabled through Hive, Pig and custom C# activities running on the Windows Azure HDInsight. Such activities can be used to clean data, mask critical data fields, and transform the data in a wide variety of complex ways.

###Scenario #3:  Integrate Information Production with data discovery and Power BI
Traditional BI approaches and technologies, while providing an “authoritative source of the truth”, almost always have a serious side effect: a constant backlog of requests due to a carefully controlled change request process.  There should be a greater flexibility in being able to connect organization’s information production with information consumption.  Power Query, as a part of Power BI for Office 365, helps address the consumption challenge of allowing business users to discover and consume important data.  Challenges remain for customers on the production side and easily tying the two together.
  
Azure Data Factory supports the following capabilities to enable simple consumption of the data produced:

- Easily move (one time or scheduled) the produced data assets to relational data marts for consumption using existing BI tools (Excel, Tableau, etc…).
- Consume data assets produced by a data factory directly using Power Query in Excel.
- Publish the produced data assets to the Power BI corporate data catalog enabling information workers to easily discover and consume the data.

## Application Model
The following diagram illustrates the application model supported by Azure Data Factory.
![image-data-factory-application-model]

There are three information production stages in an Azure Data Factory:


- **Connect & Collect**. In this stage, data from various data sources is imported into data hubs.
- **Transform & Enrich**. In this stage, the collected data is processed.
- **Publish**. In this stage, the data is published so that it can be consumed by BI tools, analytics tools, and other applications.

Data Factories enable developers to create **pipelines** which are groups of data movement and/or processing **activities** that accept 1…N input **datasets** and produce 1…N output datasets.  Pipelines can be executed once or on a flexible range of schedules (hourly, daily, weekly, etc…).  A **dataset** is a named view of data. The data being described can vary from simple bytes, semi-structured data like CSV files all the way to **tables** or **models**.

**Pipelines** comprised of data movement **activities** (for example: Copy Activity) are often used to import/export data from all the **data sources** (databases, files, SaaS services, etc…) used by the organization into a **data hub**.

    
Once data is in a **hub**, **pipelines** hosted by the compute services of the hub, are used to transform data into a form suitable for consumption (by BI tools, applications, customers, etc.).  Data Factory makes consumption of the data assets it produces simple by providing the following capabilities:

- loading data into relational data marts to be consumed by traditional BI tools
- publishing data to your Power BI data catalog enabling enterprise wide data discovery
- consuming data into Excel via Power Query
- REST APIs for easy integration with applications and business processes
  
Finally, **pipelines** can be chained such that the output **dataset(s)** of one are the input(s) of another.  This allows complex data flows to be factored into **pipelines** that run within a data hub or span multiple hubs.  Using **pipelines** in this way provides organizations the building blocks to compose the best of breed on-premises, cloud and Software-as-a-Service (SaaS) services all through the lens of a single, easily managed data factory.  

The green arrows in diagram depict a set of chained pipelines that work together to perform all phases of an information production system from data ingestion, through transformation using the services of multiple data hubs and finally delivery to a data mart for consumption by BI.
Here is another way of looking at the overall data flow within an Azure Data Factory (data source at the bottom -> BI applications at the top):

Here is another way of looking at the overall data flow within an Azure Data Factory (data source at the bottom -> BI applications at the top)

![Data Factory Data Flow][image-data-factory-data-flow]

##Terminology
This section introduces you to the terminology related to Azure Data Factory.

###Data Factory
A cloud service that consumes, produces, manages and publishes **datasets**. An Azure subscription may have one or more Azure Data Factory instances. An Azure data factory can be linked to one or more storage or compute services (called Linked Services).
 
An Azure data factory may have one or more pipelines that process data in linked storages by using linked compute services such as Azure HDInsight and publish the result information into an enterprise data directory. An Azure data factory does not contain the data within it. The data is rather stored outside of the data factory, in a user’s existing storage system
Linked Service

A linked service is a service that is linked to an Azure data factory. A linked service one of the following:


- A data store such as Azure Storage, Azure SQL Database and on-premises SQL Server database
- A compute service such as Azure HDInsight.

A data store is a container of data or datasets and Azure HDInsight is the only compute service supported at this time. You first create a linked service to point to a data store and then define data sets to represent the data from that data store. 

###Data Set
A named view of data. The data being described can vary from simple bytes, semi-structured data like CSV files all the way up to relational tables or even models. A **table** is a data set that has a schedule and is rectangular.

###Pipeline
A **pipeline** in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performing a specific processing operation. For example, a Copy activity copies data from a source storage to a destination storage and Hive/Pig activities use a Azure HDInsight cluster to process data using Hive queries or Pig scripts.

Typical steps for creating an Azure Data Factory instance are:

1. Create a data factory
2. Create a linked service for each data store or compute service
3. Create input and output datasets
4. Create a pipeline 

###Activity
A data processing step that takes 1…N input datasets and produces 1…N output datasets.  Activities run in an execution environment (for example: Azure HDInsight cluster) and read/write data to a data store associated with the Azure Data Factory instance.
 
###Data Hub
An Azure Data Hub is a container for data storage and compute services. For example, a Hadoop cluster with HDFS as storage and Hive/Pig/etc… as compute (processing) is a data hub. Similarly, an enterprise data warehouse (EDW) can be modelled as a data hub (database as storage, stored procedures and/or ETL tool as compute services). Only HDInsight hub is supported at this moment. Pipelines use data stores and run on compute resources in a data hub. 

The Data Hub allows a data factory to be divided into logical or domain specific groupings, such as the “West US Azure Hub” which manages all of the linked services (data stores and compute) and pipelines focused in the West US data center, or the “Sales EDW Hub” which manages all the linked services and pipelines concerned with populating and processing data for the Sales Enterprise Data Warehouse.

An important characteristic of Hub is that a pipeline runs on a single hub. This means that when defining a pipeline, all of the linked services referenced by tables or activities within that pipeline must have the same hub name as the pipeline itself. If the HubName property is not specified for a linked service, the linked service is placed in the “Default” Hub.

###Slice
A table in an Azure data factory is composed of slices over the time axis. The width of a slice is determined by the schedule – hourly/daily. When the schedule is “hourly”, a slice is produced hourly with the start time and end time of a pipeline and so on.  

Slices provide the ability for IT Professionals to work with a subset of overall data for a specific time window (for example: the slice that is produced for the duration (hour): 1:00 PM to 2:00 PM). They can also view all the downstream data slices for a given time internal and rerun a slice in case of a failure.

The run is a unit of processing for a slice. There could be one or more runs for a slice in case of retries or if you rerun your slice in case of failures. A slice is identified by its start time. 

###Data Management Gateway
Microsoft Data Management Gateway is software that connects on-premises data sources to cloud services for consumption. You must have at least one gateway installed in your corporate environment and register it with the Azure Data Factory portal before adding on-premises data sources as linked services.


##Next Steps
[Get started with Data Factory][datafactory-getstarted]


[datafactory-getstarted]: ../documentdb-get-started/

[image-data-factory-introduction-traditional-ETL]: ./media/data-factory-introduction/TraditionalETL.PNG

[image-data-factory-introduction-todays-diverse-processing-landspace]:./media/data-factory-introduction/TodaysDiverseDataProcessingLandscape.PNG

[image-data-factory-introduction-secenario1-source-datahub]:./media/data-factory-introduction/Scenario#1-Source-DataHub.png

[image-data-factory-introduction-secenario2-operationalize-infoproduction]:./media/data-factory-introduction/Scenario2-OperationalizeInformationProduction.png

[image-data-factory-application-model]:./media/data-factory-introduction/DataFactoryApplicationModel.png

[image-data-factory-data-flow]:./media/data-factory-introduction/DataFactoryDataFlow.png



