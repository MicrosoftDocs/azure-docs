<properties 
   pageTitle="Overview of Microsoft Azure Data Lake Analytics | Azure" 
   description="Data Lake Analytics is an Azure Big Data computation service that lets you use data to drive your business using the insights gained from your data in the cloud, regardless of where it is and regardless of its size. Data Lake Analytics enables this in the simplest, most scalable, and most economical way possible. " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="edmacauley" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="05/16/2016"
   ms.author="edmaca"/>

# Overview of Microsoft Azure Data Lake Analytics

## What is Azure Data Lake Analytics?

Azure Data Lake Analytics is a new service, built to make big data analytics easy. This service lets you focus on writing, running and managing jobs, rather than operating distributed infrastructure. Instead of deploying, configuring and tuning hardware, you write queries to transform your data and extract valuable insights. The analytics service can handle jobs of any scale instantly by simply setting the dial for how much power you need. You only pay for your job when it is running making it cost-effective. The analytics service supports Azure Active Directory letting you simply manage access and roles, integrated with your on-premises identity system. It also includes U-SQL, a language that unifies the benefits of SQL with the expressive power of user code. U-SQL’s scalable distributed runtime enables you to efficiently analyze data in the store and across SQL Servers in Azure, Azure SQL Database and Azure SQL Data Warehouse.


## Key capabilities

- **Dynamic scaling** 

    Data Lake Analytics is architected from the ground up for cloud scale and performance.  It dynamically provisions resources and lets you do analytics on terabytes or even exabytes of data. When the job completes, it winds down resources automatically, and you pay only for the processing power used. As you increase or decrease the size of data stored or the amount of compute used, you don’t have to rewrite code. This lets you focus on your business logic only and not on how you process and store large datasets. 

- **Develop faster, debug and optimize smarter using familiar tools**

    Data Lake Analytics has deep integration with Visual Studio, so that you can use familiar tools to run, debug, and tune your code. Visualizations of your U-SQL jobs let you see how your code runs at scale, so you can easily identify performance bottlenecks and optimize costs. 

- **U-SQL: simple and familiar, powerful and extensible**

    Data Lake Analytics includes U-SQL, a query language that extends the familiar, simple, declarative nature of SQL with the expressive power of C#. The U-SQL language is built on the same distributed runtime that powers the big data systems inside Microsoft. Millions of SQL and .NET developers can now process and analyze all of their data with the skills they already have.

- **Integrates seamlessly with your IT investments**

    Data Lake Analytics can use your existing IT investments for identity, management, security, and data warehousing. This simplifies data governance and makes it easy to extend your current data applications. Data Lake Analytics is integrated with Active Directory for user management and permissions and comes with built in monitoring and auditing.

- **Affordable and cost effective**

    Data Lake Analytics is a cost-effective solution for running big data workloads. You pay on a per-job basis when data is processed. No hardware, licenses, or service-specific support agreements are required. The system automatically scales up or down as the job starts and completes, meaning that you never pay for more than what you need. 

- **Works with all your Azure Data**

    Data Lake Analytics can work with a number of Azure data sources: Azure Blob storage, Azure SQL database, and of course Data Lake Analytics is specially optimized to work with Azure Data Lake Store - providing the highest level of performance, throughput, and parallelization for you big data workloads.

## See also

- Get started
    - [Get started with Data Lake Analytics using Azure Portal](data-lake-analytics-get-started-portal.md)
    - [Get started with Data Lake Analytics using Azure PowerShell](data-lake-analytics-get-started-powershell.md)
    - [Get started with Data Lake Analytics using Azure .NET SDK](data-lake-analytics-get-started-net-sdk.md)
    - [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
    - [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md)
    
- U-SQL & development
    - [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md)
    - [Use U-SQL window functions for Azure Data Lake Analytics jobs](data-lake-analytics-use-window-functions.md)
    - [Develop U-SQL user defined operators for Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-user-defined-operators.md)
    
- Management
    - [Manage Azure Data Lake Analytics using Azure Portal](data-lake-analytics-manage-use-portal.md)
    - [Manage Azure Data Lake Analytics using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)
    - [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)

- End-to-end tutorial
    - [Use Azure Data Lake Analytics interactive tutorials](data-lake-analytics-use-interactive-tutorials.md)
    - [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md)

- Let us know what you think
    - [Comment on our documentation backlog](data-lake-analytics-documentation-backlog.md)
    - [Submit a feature request](http://aka.ms/adlafeedback)
    - [Get help in the forums](http://aka.ms/adlaforums)


