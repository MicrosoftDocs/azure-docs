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
ms.date: 21/10/2021
---
# Overview of Managed Instance link (limited public preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

The new link feature in SQL Managed Instance connects your SQL Servers hosted anywhere to Azure SQL Managed Instance, providing unprecedented hybrid flexibility and database mobility. With an approach that uses near real-time data replication to the cloud, you can offload workloads to read-only secondaries in Azure to take advantage of Azure-only features, performance, and scale. In case of a disaster recovery, you can continue running your on-premises workloads on Managed Instance in Azure. In addition, you can also choose to migrate one or more applications from SQL Server to Managed Instance at the same time, at your own pace, and with the best possible minimum downtime compared to other solutions in Azure today.

The underlying technology of near real-time data replication between SQL Server and SQL Managed Instance is based on Distributed Availability Groups, part of the well-known and proven AlwaysOn - availability groups technology stack. Think of it as extending your SQL Server on-premises availability group to SQL Managed Instance in Azure in a safe and secure manner. There is no need however to have an existing availability groups or multiple nodes setup. The link supports single node SQL Server systems without existing availability groups, and also multiple-node SQL Servers with existing availability groups. Through establishing the link, we are enabling you to get all the modern benefits of Azure cloud used with your SQL Server data, without migrating to the cloud.

You can keep running the link for as long as you need it, for months and years at a time. On your modernization journey, and when\if you are ready to migrate to Azure, the link enables a considerably improved migration experience with minimum downtime possible compared to all other options available today, including a true online migration to Managed Instance Business Critical service tier.

The link feature is released in limited public preview with support for SQL Server 2019 Enterprise Edition with CU13 (or above) and SQL Server 2022 CTP1 only at this time. All editions starting from SQL Server 2016 and beyond are planned to be supported in future releases. [Sign-up now](https://aka.ms/mi-link-signup) to participate in the limited public preview. 

## Scenarios supported

Data replicated from SQL Server to Managed Instance in Azure can be used with a variety of scenarios, as indicated the diagram below. Namely these scenarios are:

(1) Offloading R/O workloads to the cloud without migrating to the cloud
- Examples of these can include reporting, analytics backups, ML and other jobs to Azure
(2) Offloading application R/O workloads to the cloud
- Examples of this includes an application that uses SQL Server for R/W workloads, while offloading R/O workloads to Managed Instance in any of Azure’s 60+ regions worldwide.

![Managed Instance link main scenario](./media/managed-instance-link/mi-link-main-scenario.png)

In addition, managed instance link provides an enhanced migrations experience:
- The most performant minimum downtime migrations, compared to all other solutions available today
- True online migration to Managed Instance Business Critical service tier
- Consolidation and deconsolidation of SQL Server workloads in Azure

The link is database scoped (one link per one database), allowing for consolidation and deconsolidation of workloads in Azure. For example, you can replicate data from multiple SQL Servers to a single Managed Instance in Azure (consolidation), or replicate from a single SQL Server to multiple Managed Instances to any of Azure’s 60+ regions worldwide (deconsolidation). The later provides you with an efficient way to quickly bring your workloads closer to your customers in any region worldwide which you can leverage as R/O replicas.

In a case of a disaster on-premises, you can rely on Managed Instance in Azure as your safe DR site for business continuity – either for R/O access to your on-premises data until the primary node is back online, or to full R/W node in Azure in case you decide to failover to the cloud on-demand.

## How does it work

The underlying technology behind Managed Instance link is Distributed Availability Groups. The solution supports single-node systems without existing availability groups, or multiple node systems with existing availability groups. With the link established, the primary database on SQL Server is R/W accessible, while replicated database to SQL Managed Instance in Azure is R/O accessible. This allows for a variety of scenarios where replicated databases on the secondary SQL Managed Instance can be used for read scale-out and offloading R/O workloads to Azure. Examples of this include offloading on-premises application R/O traffic to any of Azure’s 60+ regions worldwide, or offloading reporting, analytics or ML workloads to Azure. Managed Instance, in parallel, can also host independent R/W databases. This allows for copying an entire, or part of the replicated database from SQL Server to another independent R/W database on Managed Instance for further data processing.

![Managed Instance link how does it work](./media/managed-instance-link/mi-link-ag-dag.png)

Secure connectivity, such is VPN or Express Route is used between an on-premises network and Azure. In case that SQL Server is hosted in Azure VM, internal Azure backbone can be used between the VM and Managed Instance – such is for example global VNet peering. The trust between the two systems is established using certificate-based authentication, in which SQL Server and Managed Instance exchange their public keys.

There could exist up to 100 links from the same, or various SQL Server sources to a single Managed Instance. This limit is governed by the number of databases that could be hosted on Managed Instance at this time. Likewise, a single SQL Server can establish multiple parallel database replication links with several Managed Instances in different Azure regions. The feature requires CU13 or higher to be installed on SQL Server 2019. The new SQL Server 2022 CTP1 can be used out of the box without any additional CUs required.

## Sign-up for managed instance link

To use the link feature, you will need:
- SQL Server 2019 Enterprise Edition with CU13 (or above), or SQL Server 2022 CTP1, installed on-premises or in Azure VM
- In case of running SQL Server on-premises, a VPN link, or Express Route is required to connect on-premises network with Azure
- Managed Instance, either GP or BC service tier, provisioned in Azure

Use the below link to sign-up for managed instance link limited preview. We are onboarding customers on the rolling basis as a limited number of seats is available. You will be placed in a queue and onboarded at the first available opportunity.

> [!div class="nextstepaction"]
> [Sign-up for Managed Instance link](https://aka.ms/mi-link-signup)

## Next steps

For more information on managed instance link, see the following:
- [Managed Instance link technical blogpost](https://aka.ms/mi-link-techblog).

## See also

- [Transactional replication with Azure SQL Managed Instance (Preview)](replication-transactional-overview.md)
