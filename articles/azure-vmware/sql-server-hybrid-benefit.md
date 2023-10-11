---
title: Azure Hybrid Benefit for Windows Server, SQL Server, or Linux subscriptions
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about Azure Hybrid Benefit for Windows Server, SQL Server, or Linux subscriptions.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 8/28/2023
ms.custom: engagement-fy23
---

# Azure Hybrid Benefit for Windows Server, SQL Server, and Linux subscriptions

Azure Hybrid Benefit is a cost-saving offering from Microsoft you can use to save on cost while optimizing your hybrid environment by applying your existing Windows Server, SQL Server licenses and Linux subscriptions.

- Save up to 85% over standard pay-as-you-go rate leveraging Windows Server and SQL Server licenses with Azure Hybrid Benefit.
- Use Azure Hybrid Benefit in Azure SQL platform as a service (PaaS) environment.
- Apply to SQL Server one to four vCPUs exchange: For every one core of SQL Server Enterprise Edition, you get four vCPUs of SQL Managed Instance or Azure SQL Database general purpose and Hyperscale tiers, or 4 vCPUs of SQL Server Standard edition on Azure VMs.
- Use existing SQL Server licensing to adopt Azure Arc–enabled SQL Server Managed Instance.
- Help meet compliance requirements with unlimited virtualization on Azure Dedicated Host and the Azure VMware Solution.
- Get 180 days of dual-use rights between on-premises and Azure.

## Microsoft SQL Server

Microsoft SQL Server is a core component of many business-critical applications currently running on VMware vSphere and is one of the most widely used database platforms in the market with customers running hundreds of SQL Server instances with VMware vSphere on-premises. 

Azure VMware Solution is an ideal solution for customers looking to migrate and modernize their vSphere-based applications to the cloud, including their SQL Server databases.

Microsoft SQL Server Enterprise licenses are required for each Azure VMware Solution ESXi host core that is used by SQL Server workloads running in a cluster.
This can be further reduced by configuring the [Azure Hybrid Benefit](enable-sql-azure-hybrid-benefit.md) feature within Azure VMware Solution, using placement policies to limit the scope of ESXi host cores that need to be licensed within a cluster.

## Next steps 

Now that you've covered Azure Hybrid benefit, you may want to learn about:

- [Migrate Microsoft SQL Server Standalone to Azure VMware Solution](migrate-sql-server-standalone-cluster.md)
- [Migrate SQL Server failover cluster to Azure VMware Solution](migrate-sql-server-failover-cluster.md)
- [Migrate Microsoft SQL Server Always-On Availability Group to Azure VMware Solution](migrate-sql-server-always-on-availability-group.md)
- [Enable SQL Azure hybrid benefit for Azure VMware Solution](enable-sql-azure-hybrid-benefit.md)
- [Configure Windows Server Failover Cluster on Azure VMware Solution vSAN](configure-windows-server-failover-cluster.md)
