---
title: Azure Hybrid benefit for Windows server, SQL server, or Linux subscriptions
description: Learn about Azure Hybrid benefit for Windows server, SQL server, or Linux subscriptions.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 3/7/2023
ms.custom: engagement-fy23
---

# Azure Hybrid benefit for Windows server, SQL server, or Linux subscriptions

Azure Hybrid benefit is a cost saving offering from Microsoft you can use to save on cost while optimizing your hybrid environment by applying your existing Windows Server, SQL Server licenses or Linux subscriptions.

- Save up to 85% over standard pay-as-you-go rate leveraging Windows Server and SQL Server licenses with Azure Hybrid benefit.
- Use Azure Hybrid Benefit in Azure SQL platform as a service (PaaS) environment.
- Apply to SQL Server 1 to 4 vCPUs exchange: For every 1 core of SQL Server Enterprise Edition, you get 4 vCPUs of SQL Managed Instance or Azure SQL Database general purpose and Hyperscale tiers, or 4 vCPUs of SQL Server Standard edition on Azure VMs.
- Use existing SQL licensing to adopt Azure Arc–enabled SQL Managed Instance.
- Help meet compliance requirements with unlimited virtualization on Azure Dedicated Host and Azure VMWare Solution.
- Get 180 days of dual-use rights between on-premises and Azure.

Microsoft SQL Server is a core component of many business-critical applications currently running on VMware vSphere and is one of the most widely used database platforms in the market with customers running hundreds of SQL Server instances with VMware vSphere on-premises. 

Azure VMware Solution is an ideal solution for customers looking to migrate and modernize their vSphere-based applications to the cloud including their Microsoft SQL databases.

Microsoft SQL Server 2019 and 2022 were tested with Windows Server 2019 and 2022 Data Center edition with the virtual machines deployed in the on-premises environment. Windows Server and SQL Server have been configured following best practices and recommendations from Microsoft and VMware.

## Prerequisites

These prerequisites and requirements should be met before planning to migrate your SQL server instance to Azure VMware Solution.

- Verify that you have recent backups of the databases and the related applications and/or systems that rely upon the migrated database. 
- Review that connectivity between on-premises and Azure is established and works.
- VMware HCX must be configured between your on-premises datacenter and the Azure VMware Solution private cloud that will run the migrated workloads. Refer to [Azure VMware Solution documentation](https://learn.microsoft.com/en-us/azure/azure-vmware/install-vmware-hcx) for the procedure.
- Ensure that all the network segments in use by the Microsoft SQL Server are extended into your Azure VMware Solution private cloud. Please refer to Configure VMware HCX network extension documentation to verify this step. 
- All scenarios should be considered as downtime for the database, plan for the migration to be executed during off-peak hours with an approved change window.

VMware HCX over VPN is supported in Azure VMware Solution for workload migration. However, due to the size of database workloads it is not recommended for Microsoft SQL Server Failover Cluster Instance and Microsoft SQL Server Always-On migrations, especially for production workloads ExpressRoute connectivity is more performant and reliable. For Microsoft SQL Server Standalone and non-production workloads this can be suitable, depending upon the size of the database, to migrate. 

## Downtime considerations

Predicting downtime during a migration will depend upon the size of the database to be migrated and the speed of the private network connection to Azure cloud. The table below indicates the downtime for each Microsoft SQL Server topology.

| **Scenario** | **Downtime expected** | **Notes** |
|:---:|:---:|:---:|
| **Standalone instance** | LOW | Migration will be done using vMotion, the DB will be available during migration time, but it is not recommended to commit any critical data during it. |
| **Always-On Availability Group** | LOW | The primary replica will always be available during the migration of the first secondary replica and the secondary replica will become the primary after the initial failover to Azure. |
| **Failover Cluster Instance** | HIGH | All nodes of the cluster will be shut down and migrated using VMware HCX Cold Migration. Downtime duration will depend upon database size and private network speed to Azure cloud. |

