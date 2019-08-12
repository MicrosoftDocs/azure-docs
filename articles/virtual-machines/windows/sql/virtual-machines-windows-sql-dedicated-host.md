---
title: SQL Server VM on an Azure Dedicated Host 
description: Learn about the details for running a SQL Server VM on an Azure Dedicated Host. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: jroth
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 08/12/2019
ms.author: mathoma
ms.reviewer: jroth

---
# SQL Server VM on an Azure Dedicated Host 

This article details the specifics of using a SQL Server VM with an [Azure Dedicated Host](/azure/virtual-machines/windows/dedicated-hosts). Additional information about the azure dedicated host can be found in the blog post [Introducing Azure Dedicated Host](https://azure.microsoft.com/en-us/blog/introducing-azure-dedicated-host/). 

## Overview
[Azure Dedicated Host](/azure/virtual-machines/windows/dedicated-hosts) is a service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in Microsoft's data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.


[!INCLUDE [Connect to SQL Server VM with remote desktop](../../../../includes/virtual-machines-common-dedicated-hosts-preview.md)]


## Licensing

You can choose between two different licensing options when adding your SQL Server VM to an Azure Dedicated Host. 

  - **SQL VM licensing**: This is the existing licensing option, where you pay for each SQL Server VM license individually. 
  - **Host licensing**: Also known as _perpetual_, this is the new licensing model available for the Azure Dedicated Host, where SQL Server licenses are bundled and paid for at the host level. 


### SQL VM Licensing 
When deciding to license your SQL Server VM at the VM level, consider the following: 

- Allows either the pay-as-you-go model, or the bring-your-own-license model through the [Azure Hybrid Benefit](virtual-machines-windows-sql-ahb.md).
- Only available to customers with [Software assurance](https://www.microsoft.com/licensing/licensing-programs/faq-software-assurance).
- Available to SQL Server Enterprise and Standard edition licenses acquired before October 1, 2019. 
- The number of SQL Server Enterprise Edition licenses required depends on the number of VMs running the software and their sizes. A minimum of 4 licenses are required per VM, with 1 license required per vCPU beyond that.

### Host licensing
When deciding to license your SQL Server VM at the host level, consider the following: 

- Available for both customers with and without [Software assurance](https://www.microsoft.com/licensing/licensing-programs/faq-software-assurance) 
- Available only to SQL Server enterprise edition VMs acquired before October 1, 2019. . 
- The number of SQL Server Enterprise Edition licenses required is equal to the total number of physical cores on the Azure Dedicated Host. The software is then covered for a number of VMs equal to that number of physical cores.

## Provisioning  
Provisioning a SQL Server VM to the dedicated host is no different than any other Azure Virtual Machine. You can do so using [Azure PowerShell](../dedicated-hosts-powershell.md), the [Azure portal](../dedicated-hosts-portal.md), and [Azure CLI](../../linux/dedicated-hosts-cli.md).

The process of adding a SQL Server VM to the dedicated host requires downtime, but will not impact data, and will not have data loss. Nonetheless, all databases, including system databases, should be backed up prior to the move.

## Virtualization 

One of the benefits of a dedicated host is unlimited virtualization. For example, you can have licenses for 64 vCores, but you can configure the host to have 128 vCores, so you get double the vCores but only paying for half the SQL Server licenses. 

Since since it's your host, you are eligible to set the virtualization with a 1:2 ratio. 

## FAQ

**Q: How does the Azure Hybrid Benefit work for Windows Server/SQL Server licenses on Azure Dedicated Host?**

A: Customers can use the value of their existing Windows Server and SQL Server licenses with Software Assurance, or qualifying subscription licenses, to pay a reduced rate on Azure Dedicated Host using Azure Hybrid Benefit. Windows Server Datacenter and SQL Server Enterprise Edition customers get unlimited virtualization (deploy as many Windows Server virtual machines as possible on the host subject to the physical capacity of the underlying server) when they license the entire host and use Azure Hybrid Benefit.  All Windows Server and SQL Server workloads in Azure Dedicated Host are also eligible for Extended Security Updates for Windows Server and SQL Server 2008/R2 at no additional charge. 

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [FAQ for SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-faq.md)
* [Pricing guidance for SQL Server on a Windows VM](virtual-machines-windows-sql-server-pricing-guidance.md)
* [Release notes for SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-release-notes.md)


