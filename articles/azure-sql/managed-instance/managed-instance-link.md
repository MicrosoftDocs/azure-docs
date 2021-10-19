---
title: Managed Instance link
titleSuffix: Azure SQL Managed Instance 
description: This article provides an overview of managed instance link feature
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: danimir
ms.author: danil
ms.reviewer: mathoma, danil
ms.date: 19/10/2021
---
# Overview of Managed Instance link (limited public preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

The new link feature in SQL Managed Instance connects your SQL Servers hosted anywhere to Azure SQL Managed Instance, providing unprecedented hybrid flexibility and database mobility. With an approach that uses near real-time data replication to the cloud, you can offload workloads to read-only secondaries on Azure to take advantage of cloud-only features, performance, and scale. In case of a disaster recovery, you can continue runninng your on-premises workload on Managed Instance in Azure. In addition, you can also choose to migrate one or more applications from SQL Server to Managed Instance at the same time, at your own pace, and with minimum downtime. 

The link feature is in limited public preview with support for SQL Server 2019 Enterprise Edition and SQL Server 2022 CTP1 at this time. All editions starting from SQL Server 2016 and beyond are planned to be supported in the near future. [Sign up now](https://aka.ms/mi-link-signup) to participate in the limited public preview. 

## Scenarios supported

Business scenarios supported
DR, backup-restore with SQL Server 2022

## Components

How does it work

## Sign-up for managed instance link

To use the link feature, you will need:
- SQL Server 2019 Enterprise Edition, or SQL Server 2022 CTP1, installed on-premises or in Azure VM
- In case of running SQL Server on-premises, a VPN link, or Express Route is required to connect on-premises network with Azure
- Managed Instance, either GP or BC service tier, provisioned in Azure

As limited number of seats is available at this time for evaluation, we are onboarding new customers on the rolling basis. You will be placed in a queue and onboarded at first available opportunity.

Use the below link to sign-up for managed instance link limited preview.

> [!div class="nextstepaction"]
> [Sign-up for Managed Instance link](https://aka.ms/mi-link-signup)

## Next steps

For more information on managed instance link, see the following:
- [Managed Instance link technical blogpost](https://aka.ms/mi-link-techblog).

## See also

- [Transactional replication with Azure SQL Managed Instance (Preview)](replication-transactional-overview.md)
