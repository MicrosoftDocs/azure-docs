---
title: Overview of Azure Data Lake Analytics
description: Data Lake Analytics lets you drive your business using insights gained in your cloud data at any scale.
ms.reviewer: whhender
ms.service: data-lake-analytics
ms.topic: overview
ms.date: 10/17/2022
---
# What is Azure Data Lake Analytics?

Azure Data Lake Analytics is an on-demand analytics job service that simplifies big data. Instead of deploying, configuring, and tuning hardware, you write queries to transform your data and extract valuable insights. The analytics service can handle jobs of any scale instantly by setting the dial for how much power you need. You only pay for your job when it's running, making it cost-effective.

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

## Azure Data Lake analytics recent update information

Azure Data Lake analytics service is updated on a periodic basis. We continue to provide the support for this service with component update, component beta preview and so on.

- For recent update general information, refer to [What's new in Data Lake Analytics?](data-lake-analytics-whats-new.md).
- For each update details, refer to [Azure Data Lake analytics release note](https://github.com/Azure/AzureDataLake/tree/master/docs/Release_Notes).

## Dynamic scaling
  
Data Lake Analytics dynamically provisions resources and lets you do analytics on terabytes to petabytes of data. You pay only for the processing power used. As you increase or decrease the size of data stored or the amount of compute resources used, you don’t have to rewrite code.

## Develop faster, debug, and optimize smarter using familiar tools
  
Data Lake Analytics deep integrates with Visual Studio. You can use familiar tools to run, debug, and tune your code. Visualizations of your U-SQL jobs let you see how your code runs at scale, so you can easily identify performance bottlenecks and optimize costs.

## U-SQL: simple and familiar, powerful, and extensible
  
Data Lake Analytics includes U-SQL, a query language that extends the familiar, simple, declarative nature of SQL with the expressive power of C#. The U-SQL language uses the same distributed runtime that powers Microsoft's internal exabyte-scale data lake. SQL and .NET developers can now process and analyze their data with the skills they already have.

## Integrates seamlessly with your IT investments
  
Data Lake Analytics uses your existing IT investments for identity, management, and security. This approach simplifies data governance and makes it easy to extend your current data applications. Data Lake Analytics is integrated with Active Directory for user management and permissions and comes with built-in monitoring and auditing.

## Affordable and cost effective

Data Lake Analytics is a cost-effective solution for running big data workloads. You pay on a per-job basis when data is processed. No hardware, licenses, or service-specific support agreements are required. The system automatically scales up or down as the job starts and completes, so you never pay for more than what you need. [Learn more about controlling costs and saving money](https://aka.ms/adlasavemoney).

## Works with all your Azure data
  
Data Lake Analytics works with **Azure Data Lake Storage Gen1** for the highest performance, throughput, and parallelization, and works with Azure Storage blobs, Azure SQL Database, Azure Synapse Analytics.

   > [!NOTE]
   > Data Lake Analytics doesn't work with Azure Data Lake Storage Gen2 yet until further notice.

## In-region data residency
  
Data Lake Analytics doesn't move or store customer data out of the region in which it's deployed.

## Next steps

- See the Azure Data Lake Analytics recent update using [What's new in Azure Data Lake Analytics?](data-lake-analytics-whats-new.md)
- Get Started with Data Lake Analytics using [Azure portal](data-lake-analytics-get-started-portal.md) | [Azure PowerShell](data-lake-analytics-get-started-powershell.md) | [CLI](data-lake-analytics-get-started-cli.md)
- Manage Azure Data Lake Analytics using [Azure portal](data-lake-analytics-manage-use-portal.md) | [Azure PowerShell](data-lake-analytics-manage-use-powershell.md) | [CLI](data-lake-analytics-manage-use-cli.md) | [Azure .NET SDK](data-lake-analytics-manage-use-dotnet-sdk.md) | [Node.js](data-lake-analytics-manage-use-nodejs.md)
- [How to control costs and save money with Data Lake Analytics](https://1drv.ms/f/s!AvdZLquGMt47h213Hg3rhl-Tym1c)
