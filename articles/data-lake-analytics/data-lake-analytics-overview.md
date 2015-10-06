<properties 
   pageTitle="Overview of Microsoft Azure Big Analytics | Azure" 
   description="Big Analytics is an Azure Big Data computation service that lets you use data to drive your business using the insights gained from your data in the cloud, regardless of where it is and regardless of its size. Big Analytics enables this in the simplest, most scalable, and most economical way possible. " 
   services="big-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="big-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="09/29/2015"
   ms.author="jgao"/>

# Overview of Microsoft Azure Big Analytics

## What is Azure Big Analytics

Big Analytics is an Azure Big Data computation service that lets you use data to drive your business using the insights gained from your data in the cloud, regardless of where it is and regardless of its size. Big Analytics enables this in the simplest, most scalable, and most economical way possible.

## Big data form factors

Microsoft deliver Big Data analytics in two form factors:

- A cluster service known as **HDInisght**

	A cluster service lets you provision and manage a cluster of Big Data compute resources and gives you the most control. Every HDInsight account is a cluster. You pay for as long as the cluster (the HDInsight Account) exists - even if it is idle.

- A job Service known as **Big Analytics**

	A job service dispenses with the need to manage cluster resources. Instead you simply run submit jobs using one of several Big Data languages and you pay for only the amount of compute actually consumed to execute your work. Every Big Analytics account is a Job Service and if you do not submit any jobs you pay nothing. 



## Key capabilities of Big Analytics


- **Built for Massive Scale**

	Big Analytics can scale from the smallest datasets to many petabytes of data - especially when used with the Azure Data Lake which has been optimized for use with Big Analytics.

- **World class Developer Experience**

	Big Analytics is integrated into Visual Studio and allowing you to author, monitor, and debug your big data jobs in a familiar enviroment. Furthermore, Big Analytics has sophisticated performance analysis tools allowing you to see where the bottlenecks are in your big data jobs and see how you can optimize them for greater performance.

- **Multiple Language Support**

	Big Analytics supports multiple Big Data languages: standard open-source **Apache Hive** and a new query language called **SQLIP**.

- **Simplified Management** 

	Big Analytics is integrated with Azure Active directory. Enabling you to use Accounts and Groups to control access to your Big Analytics account. Furthermore, Big Analytics has a rich portal experience embedded in Azure that makes managing and  monitoring you account very intuitive. Big Analytics can also be completely managed through standard Windows PowerShell cmdlets - making it simple to automate key tasks.

- **Federated Query**
	
	Big Analytics can use data from Windows Azure Data Lake, Azure Storage Blobs, and Azure SQL DB. This means that you don't have to move data around just to use it with Big Analytics.
	
	
From Saveen's presentation

- A hyper-scale service for preparing data fully managed by Microsoft (Downstream uses: ML, Exploration, Traditional BI, Publishing)
- Users focus on business problems not distributed computing or infrastructure
- Built on open standards (YARN, WebHDFS, Hive, Pig, etc.)
- Includes a new language called U-SQL
- Fully integrated into Visual Studio
- Leverages Azure Data Lake for performance and scale
- Complements HDInsight
	
## ADL Analytics architecture

[the process]

## Development tools	

## the storage


## U-SQL


### Useful links

Browse the following pages:

* [Getting Started](../GettingStarted.md)
* [Migration Guide](../Migration.md)
* Tools
    * [Azure Portal](../AzurePortal/FirstSteps.md)
    * [Kona PowerShell](../PowerShell/FirstSteps.md)
    * [SDK](../SDK/FirstSteps.md)
* Tutorials
    * [SQLIP Developer Guide](../SQLIP/DeveloperGuide)
    * [Terminology](../Terminology)


## additional thoughts

 - What is Kona
 
 	- How is Kona related to Hadoop in HDInsight in addition to service vs. cluster?
	- Is Kona based on Hadoop?

 - the data storage supported by Kona
	 - Kona Catalog / Kona store?
	 - Cabo HDFS store / Azure Data Lake?
	 - Azure Blob storage
	 - Azure SQL database

 - the languages supported by kona
	 - SQLIP
	 - Hive (Future?)
	 - Pig (Future)

 - The process
	 - upload data
	 - run job
	 - donwload the job results

 - The tools
	 - SQLIP studio / SCOPE studio
	 - HDI studio (Is this Visual Studio tools for HDI?)
	 
 - payment