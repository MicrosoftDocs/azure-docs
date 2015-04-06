<properties 
    pageTitle="Common DocumentDB Use Cases | Azure" 
    description="Learn about the top four use cases for DocumentDB: user generated content, event logging, catalog data, user preferences data and  Internet of Things(IoT)." 
    services="documentdb" 
    authors="h0n" 
    manager="jhubbard" 
    editor="monicar" 
    documentationCenter=""/>

<tags 
    ms.service="documentdb" 
    ms.workload="data-services" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/06/2015" 
    ms.author="hawong"/>

# Common use cases
This article provides an overview of several common use cases for using DocumentDB.  The recommendations in this article serve as a starting point as you develop your application with DocumentDB.   

After reading this article, you'll be able to answer the following questions: 
 
- What are the common use cases for DocumentDB?
- What are the benefits of using DocumentDB as a user generated content store?
- What are the benefits of using DocumentDB as a catalog data store?
- What are the benefits of using DocumentDB as a event log store?
- What are the benefits of using DocumentDB as a user preferences data store?
- What are the benefits of using DocumentDB as a data store for Internet of Things (IoT) systems?

    
##User generated content##
A common use case for DocumentDB is to store and query user generated content (UGC) for web and mobile applications particularly social media applications.  Some examples of UGC are chat sessions, tweets, blog posts, ratings and comments.  Often, the UGC in social media applications is a blend of free form text, images and videos and not bounded by rigid structure.  

Content such as chats, comments and posts can be stored in DocumentDB without requiring any transformations.  Data properties can be added or modified easily to match requirements as developers iterate over the application code and thus promoting rapid development.  As data is automatically indexed by default in DocumentDB, data is ready to be queried at any time.  Hence, downstream applications have the flexibility to retrieve projections as per their respective needs.       

Many of the social applications run at global scale and can exhibit unpredictable usage patterns.  Flexibility in scaling the data store is essential as the application layer scales to match usage demand.  You can scale out by adding additional data partitions under a DocumentDB account.  In addition, you can also create additional DocumentDB accounts across multiple regions.   For DocumentDB service region, please visit [Azure Regions](http://azure.microsoft.com/regions/#services).   

To see how MSN Health and Fitness uses DocumentDB as user data store, please go [here](http://azure.microsoft.com/blog/2014/10/09/azure-documentdb-profile-of-msn-health-and-fitness-2/).


##Catalog data##
Catalog data usage scenarios involve storing and querying a set of attributes for an entity such as people and products.  Some examples of catalog data are user accounts, product catalogs, device registers of IoT and bill of materials.  Attributes for these data may vary and can change over time to fit application requirements.  

Let’s take an example of a product catalog for an automotive parts supplier.  Every part may have its own attributes in addition to the common attributes all parts share.  Furthermore, attributes for a specific part can change the following year when a new model is released.  As a JSON document store, DocumentDB supports flexible schemas and allows you to represent data with nested properties, and thus it is well suited for storing product catalog data.       

##Log data##
Application event log data is often emitted in large volumes and may have varying attributes from time to time.  Log data is not bounded by complex relationships or rigid structures. Increasingly, log data is persisted in JSON format since JSON is lightweight and easy for humans to read.
   
There are typically two major use cases related to event log data.  The first use case is to perform ad-hoc queries over a subset of data for troubleshooting.  Often, during troubleshooting, a subset of data is first retrieved from the logs, typically by time series.  Then, drill-down is performed by filtering the dataset with error levels or error messages.  This is where storing event logs in DocumentDB is an advantage.  Log data stored in DocumentDB is automatically indexed by default, and thus it is ready to be queried at any time.  In addition, log data can be persisted across data partitions as time-series.  Older logs can be rolled out to cold storage per your retention policy.          

The second use case involves long running data analytics jobs performed offline over a large volume of log data.  Examples of this use case include server availability analysis, application error analysis and clickstream data analysis.  Typically, Hadoop is used to perform these types of analyses.  With the Hadoop Connector for DocumentDB, DocumentDB databases function as data sources and sinks for Pig, Hive and Map/Reduce jobs.  For detail on the Hadoop Connector for DocumentDB, please visit [Run a Hadoop job with DocumentDB and HDInsight](../articles/documentdb-run-hadoop-with-hdinsight/).      

##User preferences data##
Nowadays, most modern web and mobile applications come with complex views and experiences. These views and experiences are usually dynamic catering to user preferences or moods and branding needs.  Hence, these application needs to be able to retrieve personalized settings effectively in order to render UI elements and experiences quickly. 

JSON is an effective format to represent UI layout data as it is not only lightweight, but also can be easily interpreted by JavaScript.  DocumentDB offers tunable consistency levels that allow fast reads with low latency writes.  Hence, storing UI layout data including personalized settings as JSON documents in DocumentDB is an effective means to get these data across the wire.

 
##Device sensor data##
There are three basic requirements in IoT use cases.  First, a data intake system that can ingest bursts of data from device sensors of various locales.  Next, an analytics system to derive real time insights from streaming data.  Last but not least, a data store to perform adhoc queries and offline analytics.    

Microsoft Azure offers rich services that can be leveraged for IoT use cases.  Azure IoT services are a bundle of services including Azure Event Hubs, Azure DocumentDB, Azure Stream Analytics, Azure Notification Hub, Azure Machine Learning, Azure HDInsight, and PowerBI. 

First, bursts of data can be ingested by Azure Event Hubs as it offers high throughput data ingestion with low latency.   Data ingested that needs to be processed for real time insight can be funneled to Azure Stream Analytics for real time analytics.  Next, data is loaded into DocumentDB for adhoc querying.  Once the data is loaded into DocumentDB, these data is ready to be queried.  Data can further be refined and processed by connecting DocumentDB data to HDInsight for Pig, Hive or Map/Reduce jobs.  Refined data is then loaded back to DocumentDB for reporting.   

For a sample IoT solution using DocumentDB, EventHubs and Storm, please go [here](https://github.com/hdinsight/hdinsight-storm-examples/).

For more information Azure offerings for IoT, please visit [here](http://www.microsoft.com/en-us/server-cloud/internet-of-things.aspx).

##<a name="NextSteps"></a>Next steps

- To get started with DocumentDB, let's create an [account](http://azure.microsoft.com/pricing/free-trial/).
- To learn more about data modeling, please visit [Modeling Data in DocumentDB](../articles/documentdb-modeling-data).
