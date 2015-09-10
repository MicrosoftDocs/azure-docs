<properties 
   pageTitle="Overview of Azure Data Lake | Azure" 
   description="Understand what is Azure Data Lake and the value it provides over other data stores" 
   services="data-lake" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="09/29/2015"
   ms.author="nitinme"/>

# Overview of Azure Data Lake

A Data Lake is an enterprise-wide repository of every type of data collected in a single place, prior to any formal definition schema has been established. A Data Lake allows any kind of data to be kept. This allows every type of data to be stored in one single repository regardless of its size, structure, or how fast it is ingested. Organizations can then use big data tools to analyze and find patterns in the data.

## What is Azure Data Lake?

Azure Data Lake is Microsoft’s Data Lake offering hosted in Azure, described as a hyper scale repository for big data analytic workloads. Organizations can use Azure Data Lake to store, secure, and scale their data for massive parallel big data analytics in the cloud. Some of the key capabilities of the Azure Data Lake include the following. 

[ TBD: include an illustration here ]

### HDFS for the Cloud

Azure Data Lake is built from the ground-up as a native Hadoop file system compatible with HDFS, working out-of-the-box with the Hadoop ecosystem including Azure HDInsight, Revolution-R Enterprise, and industry Hadoop distributions like Hortonworks and Cloudera. 

### Unlimited storage, petabyte files, and massive throughput

Azure Data Lake has unbounded scale with no limits to the amount of data that can be stored in a single account and can store very large files of petabyte range. Azure Data Lake is built for running large analytic systems that require massive throughput to query and analyze petabytes of data. It can handle high volumes of small writes at low latency making it optimized for near real-time scenarios like website analytics, Internet of Things (IoT), analytics from sensors, etc.

### Enterprise-ready

Azure Data Lake leverages Azure Active Directory to provide identity and access management for all your data. It also provides data reliability by replicating your data assets to guard against any unexpected failures. This enables enterprises to factor Azure Data Lake in their solutions as an important part of their existing data platform.

### Data in any format

Azure Data Lake is built as a distributed file store allowing you to store relational and non-relational data without transformation or schema definition. This allows you to store all of your data and analyze them in their native format.

## How is Azure Data Lake different from Azure Storage?

[ TBD: Add more info ]

Azure Storage is a generic storage repository that allows you to store data for any use case. In contrast, Azure Data Lake is a storage repository optimized for big data solutions. This includes the capability to stores files that are petabytes in size, provides higher throughput, and has built-in integration with Hadoop.

[ TBD: Include a table comparison ]

| Feature                                | Azure Data Lake | Azure Storage |
|----------------------------------------|-----------------|---------------|
| Maximum file size                      | --              | --            |
| Types of data that can be stored       | --              | --            |
| Cost                                   | --              | --            |
| Compatibility with big data offerings  | --              | --            |
| Data access protocol				     | --              | --            |
| Authentication						 | --			   | --			   | 


## Applications compatible with Azure Data Lake

See [Applications and services compatible with Azure Data Lake](azure-data-lake-compatible-oss-other-applications.md) for a list of open source applications, Microsoft applications/services, and other third-party applications that can be used with Azure Data Lake. 


## What is swebhdfs://?

## Best practices for using Azure Data Lake

## How do I start using Azure Data Lake?

See [ TBD: Link to Hero tutorial ], on how to provision an Azure Data Lake account. Once you have provisioned Azure Data Lake, you can learn how to use big data offerings, such as [ TBD: Official name of Kona ], Azure HDInsight, and Hortonworks HDP with Azure Data Lake to run your big data workloads.

- [ TBD: Link to using ADL with Kona ]
- [ TBD: Link to using ADL with HDInsight ]
- [ TBD: Link to using ADL with HDP ]  
