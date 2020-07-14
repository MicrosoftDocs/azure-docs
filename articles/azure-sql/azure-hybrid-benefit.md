---
title: Azure Hybrid Benefit 
titleSuffix: Azure SQL Database & SQL Managed Instance 
description: Use existing SQL Server licenses for Azure SQL Database and SQL Managed Instance discounts.
services: sql-database
ms.service: sql-database
ms.custom: sqldbrb=4
ms.subservice: service
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: sashan, moslake, carlrab
ms.date: 11/13/2019
---
# Azure Hybrid Benefit - Azure SQL Database & SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](includes/appliesto-sqldb-sqlmi.md)]

In the provisioned compute tier of the vCore-based purchasing model, you can exchange your existing licenses for discounted rates on Azure SQL Database and Azure SQL Managed Instance by using [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/). This Azure benefit allows you to save up to 30 percent or even higher on SQL Database & SQL Managed Instance by using your SQL Server licenses with Software Assurance. The [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) page has a calculator to help determine savings.  Note that the Azure Hybrid Benefit does not apply to Azure SQL Database serverless.

> [!NOTE]
> Changing to Azure Hybrid Benefit does not require any downtime.

![pricing](./media/azure-hybrid-benefit/pricing.png)

## Choose a license model

With Azure Hybrid Benefit, you can choose to pay only for the underlying Azure infrastructure by using your existing SQL Server license for the SQL Server database engine itself (Base Compute pricing), or you can pay for both the underlying infrastructure and the SQL Server license (License-Included pricing).

You can choose or change your licensing model in the Azure portal: 
- For new databases, during creation, select **Configure database** on the **Basics** tab and select the option to save money.
- For existing databases, select **Configure** in the **Settings** menu and select the option to save money.

You can also configure a new or existing database by using one of the following APIs:

# [PowerShell](#tab/azure-powershell)

To set or update the license type by using PowerShell:

- [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase)
- [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase)
- [New-AzSqlInstance](/powershell/module/az.sql/new-azsqlinstance)
- [Set-AzSqlInstance](/powershell/module/az.sql/set-azsqlinstance)

# [Azure CLI](#tab/azure-cli)

To set or update the license type by using the Azure CLI:

- [az sql db create](/cli/azure/sql/db#az-sql-db-create)
- [az sql db update](/cli/azure/sql/db#az-sql-db-update)
- [az sql mi create](/cli/azure/sql/mi#az-sql-mi-create)
- [az sql mi update](/cli/azure/sql/mi#az-sql-mi-update)

# [REST API](#tab/rest)

To set or update the license type by using the REST API:

- [Databases - Create Or Update](/rest/api/sql/databases/createorupdate)
- [Databases - Update](/rest/api/sql/databases/update)
- [Managed Instances - Create Or Update](/rest/api/sql/managedinstances/createorupdate)
- [Managed Instances - Update](/rest/api/sql/managedinstances/update)

* * *


### Azure Hybrid Benefit questions

#### Are there dual-use rights with Azure Hybrid Benefit for SQL Server?

You have 180 days of dual use rights of the license to ensure migrations are running seamlessly. After that 180-day period, you can only use the SQL Server license in the cloud in SQL Database. You no longer have dual use rights on-premises and in the cloud.

#### How does Azure Hybrid Benefit for SQL Server differ from license mobility?

We offer license mobility benefits to SQL Server customers with Software Assurance. This allows reassignment of their licenses to a partner's shared servers. You can use this benefit on Azure IaaS and AWS EC2.

Azure Hybrid Benefit for SQL Server differs from license mobility in two key areas:

- It provides economic benefits for moving highly virtualized workloads to Azure. SQL Server Enterprise Edition customers can get four cores in Azure in the General Purpose SKU for every core they own on-premises for highly virtualized applications. License mobility doesn't allow any special cost benefits for moving virtualized workloads to the cloud.
- It provides for a PaaS destination on Azure (SQL Managed Instance) that's highly compatible with SQL Server.

#### What are the specific rights of the Azure Hybrid Benefit for SQL Server?

SQL Database customers have the following rights associated with Azure Hybrid Benefit for SQL Server:

|License footprint|What does Azure Hybrid Benefit for SQL Server get you?|
|---|---|
|SQL Server Enterprise Edition core customers with SA|<li>Can pay base rate on either General Purpose or Business Critical SKU</li><br><li>1 core on-premises = 4 cores in General Purpose SKU</li><br><li>1 core on-premises = 1 core in Business Critical SKU</li>|
|SQL Server Standard Edition core customers with SA|<li>Can pay base rate on General Purpose SKU only</li><br><li>1 core on-premises = 1 core in General Purpose SKU</li>|
|||


## Next steps

- For for help with choosing an Azure SQL deployment option, see [Choose the right deployment option in Azure SQL](azure-sql-iaas-vs-paas-what-is-overview.md).
- For a comparison of SQL Database and SQL Managed Instance features, see [SQL Database & SQL Managed Instance features](database/features-comparison.md).
