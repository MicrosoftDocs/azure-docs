---
title: SQL Server on Azure VM Release Notes| Microsoft Docs
description: Learn about the new features and improvements of SQL Server on an Azure VM
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
manager: craigg
editor: ''
tags: azure-service-management
ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 11/13/2018
ms.author: mathoma
---
# SQL Server on Azure Virtual Machine release notes

Azure allows you to deploy a virtual machine with an image of SQL Server built in. This article lists the new features and improvements that you can expect in the latest version of SQL Server deployed on an Azure virtual machine. 


## November 2018
- **New SQL resource provider**: There is a new resource provider for SQL VMs that allow for better management of your VM. For more information on registering your VM, see [Register existing SQL VM with new resource provider](virtual-machines-windows-sql-ahb.md#register-existing-sql-vm-with-new-resource-provider).
- **Switch licensing model**: You can now switch between the pay-per-usage and bring-your-own license model for your SQL VM using Azure CLI or Powershell. For more information, see [How to change the licensing model for a SQL VM](virtual-machines-windows-sql-ahb.md)



## Additional resources

**Windows VMs**:

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md).
* [Provision a SQL Server Windows VM](virtual-machines-windows-portal-sql-server-provision.md)
* [Migrating a Database to SQL Server on an Azure VM](virtual-machines-windows-migrate-sql.md)
* [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-high-availability-dr.md)
* [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-performance.md)
* [Application Patterns and Development Strategies for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-server-app-patterns-dev-strategies.md)

**Linux VMs**:

* [Overview of SQL Server on a Linux VM](../../linux/sql/sql-server-linux-virtual-machines-overview.md)
* [Provision a SQL Server Linux VM](../../linux/sql/provision-sql-server-linux-virtual-machine.md)
* [FAQ (Linux)](../../linux/sql/sql-server-linux-faq.md)
* [SQL Server on Linux documentation](https://docs.microsoft.com/sql/linux/sql-server-linux-overview)
