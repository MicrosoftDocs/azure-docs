---
title: Overview of Microsoft Azure Data Lake Analytics | Microsoft Docs
description: 'Data Lake Analytics is an Azure Big Data service that lets you use data to drive your business using insights gained from your data in the cloud, regardless its size or where it is.'
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.assetid: 1e1d443a-48a2-47fb-bc00-bf88274222de
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/23/2017
ms.author: saveenr

---
# Overview of Microsoft Azure Data Lake Analytics
## What is Azure Data Lake Analytics?
Azure Data Lake Analytics is an on-demand analytics job service to simplify big data analytics. You can focus on writing, running, and managing jobs rather than on operating distributed infrastructure. Instead of deploying, configuring, and tuning hardware, you write queries to transform your data and extract valuable insights. The analytics service can handle jobs of any scale instantly by setting the dial for how much power you need. You only pay for your job when it is running, making it cost-effective. The analytics service supports Azure Active Directory letting you manage access and roles, integrated with your on-premises identity system. It also includes U-SQL, a language that unifies the benefits of SQL with the expressive power of user code. U-SQL’s scalable distributed runtime enables you to efficiently analyze data in the store and across SQL Servers in Azure, Azure SQL Database, and Azure SQL Data Warehouse.

## Key capabilities
* **Dynamic scaling**
  
    Data Lake Analytics is architected for cloud scale and performance.  It dynamically provisions resources and lets you do analytics on terabytes or even exabytes of data. When the job completes, it winds down resources automatically, and you pay only for the processing power used. As you increase or decrease the size of data stored or the amount of compute resources used, you don’t have to rewrite code. You can focus on your business logic only and not on how you process and store large datasets.
* **Develop faster, debug, and optimize smarter using familiar tools**
  
    Data Lake Analytics has deep integration with Visual Studio, so you can use familiar tools to run, debug, and tune your code. Visualizations of your U-SQL jobs let you see how your code runs at scale, so you can easily identify performance bottlenecks and optimize costs.
* **U-SQL: simple and familiar, powerful, and extensible**
  
    Data Lake Analytics includes U-SQL, a query language that extends the familiar, simple, declarative nature of SQL with the expressive power of C#. The U-SQL language is built on the same distributed runtime that powers the big data systems inside Microsoft. Millions of SQL and .NET developers can now process and analyze their data with the skills they already have.
* **Integrates seamlessly with your IT investments**
  
    Data Lake Analytics can use your existing IT investments for identity, management, security, and data warehousing. This approach simplifies data governance and makes it easy to extend your current data applications. Data Lake Analytics is integrated with Active Directory for user management and permissions and comes with built-in monitoring and auditing.
* **Affordable and cost effective**
  
    Data Lake Analytics is a cost-effective solution for running big data workloads. You pay on a per-job basis when data is processed. No hardware, licenses, or service-specific support agreements are required. The system automatically scales up or down as the job starts and completes, so you never pay for more than what you need.
* **Works with all your Azure Data**
  
    Data Lake Analytics is optimized to work with Azure Data Lake - providing the highest level of performance, throughput, and parallelization for your big data workloads.  Data Lake Analytics can also work with Azure Blob storage and Azure SQL Database.

## Next steps
 
  * Get Started with Data Lake Analytics using [Azure portal](data-lake-analytics-get-started-portal.md) | [Azure PowerShell](data-lake-analytics-get-started-powershell.md) | [CLI](data-lake-analytics-get-started-cli2.md)
  * Manage Azure Data Lake Analytics using [Azure portal](data-lake-analytics-manage-use-portal.md) | [Azure PowerShell](data-lake-analytics-manage-use-powershell.md) | [CLI](data-lake-analytics-manage-use-cli.md) | [Azure .NET SDK](data-lake-analytics-manage-use-dotnet-sdk.md) | [Node.js](data-lake-analytics-manage-use-nodejs.md)
  * [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md) 
