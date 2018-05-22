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
ms.date: 05/01/2018
ms.author: jeffgilb
ms.reviewer: jeffgo
---

# Use SQL databases on Microsoft Azure Stack
Use the SQL Server resource provider adapter to expose SQL databases as a service of [Azure Stack](azure-stack-poc.md). After you install the resource provider and connect it to one or more SQL Server instances, you and your users can create:
- Databases for cloud-native apps.
- Websites that are based on SQL.
- Workloads that are based on SQL.
You don't have to provision a virtual machine (VM) that hosts SQL Server each time.

The resource provider does not support all the database management capabilities of [Azure SQL Database](https://azure.microsoft.com/services/sql-database/). For example, Elastic Database pools and the ability to dial database performance up and down automatically aren't available. However, the resource provider does support similar create, read, update, and delete (CRUD) operations. The API is not compatible with SQL Database.

## SQL resource provider adapter architecture
The resource provider consists of three components:

- **The SQL resource provider adapter VM**, which is a Windows virtual machine that runs the provider services.
- **The resource provider itself**, which processes provisioning requests and exposes database resources.
- **Servers that host SQL Server**, which provide capacity for databases called hosting servers.

You must create one (or more) instances of SQL Server and/or provide access to external SQL Server instances.

> [!NOTE]
> Hosting servers that are installed on Azure Stack integrated systems must be created from a tenant subscription. They can't be created from the default provider subscription. They must be created from the tenant portal or from a PowerShell session with an appropriate sign-in. All hosting servers are chargeable VMs and must have appropriate licenses. The service administrator can be the owner of the tenant subscription.


## Next steps

[Deploy the SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md)
