---
title: Overview of SQL Server on Azure Linux Virtual Machines | Microsoft Docs
description: Learn about how to run full SQL Server editions on Azure Linux Virtual machines. Get direct links to all Linux SQL Server VM images and related content.
services: virtual-machines-linux
documentationcenter: ''
author: rothja
manager: jhubbard
tags: azure-service-management

ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: get-started-article
ms.workload: iaas-sql-server
ms.date: 10/02/2017
ms.author: jroth
---
# Overview of SQL Server on Azure Virtual Machines (Linux)

> [!div class="op_single_selector"]
> * [Windows](../../windows/sql/virtual-machines-windows-sql-server-iaas-overview.md)
> * [Linux](sql-server-linux-virtual-machines-overview.md)

This topic describes your options for running SQL Server on Azure Linux virtual machines (VMs), along with [links to portal images](#option-1-create-a-sql-vm-with-per-minute-licensing).

> [!NOTE]
> If you're already familiar with SQL Server and just want to see how to deploy a SQL Server Linux VM, see [Provision a Linux SQL Server VM in Azure](provision-sql-server-linux-virtual-machine.md).

If you are a database administrator or a developer, Azure VMs provide a way to move your on-premises SQL Server workloads and applications to the Cloud.

## Scenarios

There are many reasons that you might choose to host your data in Azure. If you are developing or migrating your application to Azure, it improves performance to also locate the backend data in Azure. You automatically have access to multiple data centers for a global presence and disaster recovery. The data is also highly secured and durable.

SQL Server running on Azure VMs is one option for storing your relational data in Azure. You also have the option of using Azure SQL Database service. For more information about choosing between SQL Server on Virtual Machines versus Azure SQL Database, see [Choose a cloud SQL Server option: Azure SQL (PaaS) Database or SQL Server on Azure VMs (IaaS)](../../../sql-database/sql-database-paas-vs-sql-server-iaas.md).

## Create a new SQL VM

Find step-by-step guidance for creating a new SQL VM in the tutorial, [Provision a Linux SQL Server VM in Azure](provision-sql-server-linux-virtual-machine.md).

The following table provides a matrix of the latest SQL Server images in the virtual machine gallery. Click on any link to begin creating a new SQL VM with your specified version, edition, and operating system.

> [!TIP]
> To understand the VM and SQL pricing for these images, see [the pricing page for Linux SQL Server VMs](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).

| Version | Operating System | Edition |
| --- | --- | --- |
| **SQL Server 2017** | Red Hat Enterprise Linux (RHEL) 7.4 |[Enterprise](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Standard](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Web](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Express](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Developer](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73) |
| **SQL Server 2017** | SUSE Linux Enterprise Server (SLES) v12 SP2 |[Enterprise](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Standard](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Web](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Express](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Developer](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73) |
| **SQL Server 2017** | Ubuntu 16.04 LTS |[Enterprise](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Standard](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Web](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Express](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73), [Developer](https://portal.azure.com/#create/Microsoft.SQLServer2017CTP20onRedHatEnterpriseLinux73) |

## <a id="packages"></a> Installed packages

When you configure SQL Server on Linux, you install the database engine package and then several optional packages depending on your requirements. The Linux virtual machine images for SQL Server automatically install most packages for you. The following table shows which packages are installed for each distribution.

| Distribution | [Database Engine](https://docs.microsoft.com/sql/linux/sql-server-linux-setup) | [Tools](https://docs.microsoft.com/sql/linux/sql-server-linux-setup-tools) | [SQL Server Agent](https://docs.microsoft.com/sql/linux/sql-server-linux-setup-sql-agent) | [Full-Text Search](https://docs.microsoft.com/sql/linux/sql-server-linux-setup-full-text-search) | [SSIS](https://docs.microsoft.com/sql/linux/sql-server-linux-setup-ssis) | [HA add-on](https://docs.microsoft.com/sql/linux/sql-server-linux-business-continuity-dr) |
|---|---|---|---|---|---|---|
| RHEL | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![no](./media/sql-server-linux-virtual-machines-overview/no.png) |
| SLES | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![no](./media/sql-server-linux-virtual-machines-overview/no.png) | ![no](./media/sql-server-linux-virtual-machines-overview/no.png) |
| Ubuntu | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) | ![yes](./media/sql-server-linux-virtual-machines-overview/yes.png) |

## Next steps

To learn more about how to configure and use SQL Server on Linux, see [Overview of SQL Server on Linux](https://docs.microsoft.com/sql/linux/sql-server-linux-overview).
