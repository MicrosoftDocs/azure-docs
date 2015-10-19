<properties 
   pageTitle="Overview of Microsoft Azure Data Lake Analytics | Azure" 
   description="Data Lake Analytics is an Azure Big Data computation service that lets you use data to drive your business using the insights gained from your data in the cloud, regardless of where it is and regardless of its size. Data Lake Analytics enables this in the simplest, most scalable, and most economical way possible. " 
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
   ms.date="10/19/2015"
   ms.author="jgao"/>

# Overview of Microsoft Azure Data Lake Analytics

## What is Azure Data Lake Analytics?

Azure Data Lake includes Azure Data Lake Analytics - a service that makes it easy to do with Big Data at cloud scale.


## Key capabilities of Data Lake Analytics

### Dynamically scales 

Data Lake Analytics is architected from the ground up for cloud scale and performance.  It dynamically provisions resources and lets you do analytics on terabytes or even exabytes of data. When the job completes, it winds down resources automatically, and you pay only for the processing power used. As you increase or decrease the size of data stored or the amount of compute used, you don’t have to rewrite code. This lets you focus on your business logic only and not on how you process and store large datasets. 

### Develop faster, debug and optimize smarter using familiar tools

Data Lake Analytics has deep integration with Visual Studio, so that you can use familiar tools to run, debug, and tune your code. Visualizations of your U-SQL jobs let you see how your code runs at scale, so you can easily identify performance bottlenecks and optimize costs. 

### U-SQL: simple and familiar, easily extensible

Data Lake Analytics includes U-SQL, a query language that blends the declarative nature of SQL with the expressive power of C#. The U-SQL language is built on the same distributed runtime that powers the big data systems inside Microsoft. Millions of SQL and .NET developers can now process and analyze all of their data with the skills they already have.

### Integrates seamlessly with your IT investments

Data Lake Analytics can use your existing IT investments for identity, management, security, and data warehousing. This simplifies data governance and makes it easy to extend your current data applications. Data Lake Analytics is integrated with Active Directory for user management and permissions and comes with built in monitoring and auditing.

### Affordable and cost effective

Data Lake Analytics is a cost-effective solution for running big data workloads. You pay on a per-job basis when data is processed. No hardware, licenses, or service-specific support agreements are required. The system automatically scales up or down as the job starts and completes, meaning that you never pay for more than what you need. 

## Works with All your Azure Data

Data Lake Analytics can work with a number of Azure data sources: Azure Storage Blobs, Azure SQL DB, Azure SQL DB, and of course Data Lake Analytics is specially optimized to work with Azure Data Lake Store - providing the highest level of performance, throughput, and parallelization for you big data workloads.


### See also

- [Get started with Azure Data Lake Analytics using Preview Portal][data-lake-analytics-get-started-portal.md]