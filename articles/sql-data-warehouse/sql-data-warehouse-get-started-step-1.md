---
title: Step 1: Prerequisites | Microsoft Docs
description: Enterprise-class distributed database capable of processing petabyte volumes of relational and non-relational data. It is the industry's first cloud data warehouse with grow, shrink, and pause in seconds.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: ''

ms.assetid: 4006c201-ec71-4982-b8ba-24bba879d7bb
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 10/31/2016
ms.author: elbutter

---
# Prerequisites 

Before you begin work with SQL Data Warehouse, be sure you have completed the following:

* Sign up for Microsoft Azure
* Install appropriate SQL Client Driver and Tools
* Create a logical server
* Set Firewall Rules

## Sign Up for Microsoft Azure
If you don't already have a Microsoft Azure account, you must sign up for one to use this service. If you already have an account, you may skip this step. 

1. Navigate to the account pages [https://azure.microsoft.com/account/](https://azure.microsoft.com/account/)
2. Create a free Azure account, or purchase an account.
3. Follow the instructions

## Install appropriate SQL Client Driver and Tools

Most SQL client tools can connect to Azure SQL Data Warehouse using JDBC, ODBC, or ADO.net. Due to product complexity and large number of T-SQL features SQL DW supports, not every client application may be fully compatible 
with SQL DW.

If you are running a Windows Operating System, we recommend using either [Visual Studio] or [SQL Server Management Studio].


[!INCLUDE [Create a new logical server](../../includes/sql-data-warehouse-create-logical-server.md)] 

[!INCLUDE [Additional Resources](../../includes/sql-data-warehouse-article-footer.md)]



<!--Other Web references-->
[Visual Studio]: https://www.visualstudio.com/
[SQL Server Management Studio]: https://msdn.microsoft.com/en-us/library/mt238290.aspx
