---
title: Step 1: Prerequisites | Microsoft Docs
description: Get Started Tutorial with Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: 'barbkess'

ms.assetid: 52DFC191-E094-4B04-893F-B64D5828A900
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 12/21/2016
ms.author: elbutter

---
# Step 1: Prerequisites
TODO: Finish the introduction here at some point


## Sign Up for Microsoft Azure
If you don't already have a Microsoft Azure account, you must sign up for one to use this service. If you already have an account, you may skip this step. 

1. Navigate to the account pages [https://azure.microsoft.com/account/](https://azure.microsoft.com/account/)
2. Create a free Azure account, or purchase an account.
3. Follow the instructions

## Install appropriate SQL Client Driver and Tools

Most SQL client tools can connect to Azure SQL Data Warehouse using JDBC, ODBC, or ADO.net. Due to product complexity and large number of T-SQL features SQL Data Warehouse supports, not every client application may be fully compatible 
with SQL Data Warehouse.

If you are running a Windows Operating System, we recommend using either [Visual Studio] or [SQL Server Management Studio].


[!INCLUDE [Create a new logical server](../../includes/sql-data-warehouse-create-logical-server.md)] 

[!INCLUDE [SQL Database create server](../../includes/sql-database-create-new-server-firewall-portal.md)]

[!INCLUDE [Additional Resources](../../includes/sql-data-warehouse-article-footer.md)]




<!--Other Web references-->
[Visual Studio]: https://www.visualstudio.com/
[SQL Server Management Studio]: https://msdn.microsoft.com/en-us/library/mt238290.aspx
