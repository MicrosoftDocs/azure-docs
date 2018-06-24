---
title: Using SQL databases on Azure Stack | Microsoft Docs
description: Learn how you can deploy SQL databases as a service on Azure Stack and the quick steps to deploy the SQL Server resource provider adapter.
services: azure-stack
documentationCenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/21/2018
ms.author: jeffgilb
ms.reviewer: jeffgo
---

# Use SQL databases on Microsoft Azure Stack

Use the SQL Server resource provider adapter API to expose SQL databases as a service of [Azure Stack](azure-stack-poc.md). After you install the resource provider and connect it to one or more SQL Server instances, you and your users can create:

- Databases for cloud-native apps.
- Websites that use SQL.
- Workloads that use SQL.

The resource provider doesn't provide all the database management abilities of [Azure SQL Database](https://azure.microsoft.com/services/sql-database/). For example, elastic pools that automatically allocate resources aren't supported. However, the resource provider supports similar create, read, update, and delete (CRUD) operations on a SQL Server database. For more information about the resource provider API, see [Windows Azure Pack SQL Server Resource Provider REST API Reference](https://msdn.microsoft.com/library/dn528529.aspx).

>[!NOTE]
The SQL Server resource provider API isn't compatible with Azure SQL Database.

## SQL resource provider adapter architecture

The resource provider consists of the following components:

- **The SQL resource provider adapter virtual machine (VM)**, which is a Windows Server VM that runs the provider services.
- **The resource provider**, which processes requests and accesses database resources.
- **Servers that host SQL Server**, which provide capacity for databases called hosting servers.

You must create at least one instance of SQL Server or provide access to external SQL Server instances.

> [!NOTE]
> Hosting servers that are installed on Azure Stack integrated systems must be created from a tenant subscription. They can't be created from the default provider subscription. They must be created from the tenant portal or by using PowerShell with the appropriate sign-in. All hosting servers are billable virtual machines and must have licenses. The service administrator can be the owner of the tenant subscription.

## Next steps

[Deploy the SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md)
