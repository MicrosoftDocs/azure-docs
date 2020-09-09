---
title: Run SQL Server VM on an Azure Dedicated Host 
description: Learn how to run a SQL Server VM on an Azure Dedicated Host. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
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
# Run SQL Server VM on an Azure Dedicated Host 
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article details the specifics of using a SQL Server virtual machine (VM) with [Azure Dedicated Host](/azure/virtual-machines/windows/dedicated-hosts). Additional information about Azure Dedicated Host can be found in the blog post [Introducing Azure Dedicated Host](https://azure.microsoft.com/blog/introducing-azure-dedicated-host/). 

## Overview
[Azure Dedicated Host](/azure/virtual-machines/windows/dedicated-hosts) is a service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in Microsoft's data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.

## Limitations

- Virtual machine scale sets are not currently supported on dedicated hosts.
- The following VM series are supported: DSv3 and ESv3. 

## Licensing

You can choose between two different licensing options when you place your SQL Server VM in an Azure Dedicated Host. 

  - **SQL VM licensing**: This is the existing licensing option, where you pay for each SQL Server VM license individually. 
  - **Dedicated host licensing**: The new licensing model available for the Azure Dedicated Host, where SQL Server licenses are bundled and paid for at the host level. 


Host-level options for using existing SQL Server licenses: 
  - SQL Server Enterprise Edition Azure Hybrid Benefit (AHB)
    - Available to customers with SA or subscription.
    - License all available physical cores and enjoy unlimited virtualization (up to the max vCPUs supported by the host).
        - For more information about applying the AHB to Azure Dedicated Host, see [Azure Hybrid Benefit FAQ](https://azure.microsoft.com/pricing/hybrid-benefit/faq/). 
  - SQL Server licenses acquired before October 1
      - SQL Server Enterprise edition has both host-level and by-VM license options. 
      - SQL Server Standard edition has only a by-VM license option available. 
          - For details, see [Microsoft Product Terms](https://www.microsoft.com/licensing/product-licensing/products). 
  - If no SQL Server dedicated host-level option is selected, you may select SQL Server AHB at the level of individual VMs, just as you would with multi-tenant VMs.



## Provisioning  
Provisioning a SQL Server VM to the dedicated host is no different than any other Azure virtual machine. You can do so using [Azure PowerShell](../../../virtual-machines/windows/dedicated-hosts-powershell.md), the [Azure portal](../../../virtual-machines/windows/dedicated-hosts-portal.md), and the [Azure CLI](../../../virtual-machines/linux/dedicated-hosts-cli.md).

The process of adding an existing SQL Server VM to the dedicated host requires downtime, but will not affect data, and will not have data loss. Nonetheless, all databases, including system databases, should be backed up prior to the move.

## Virtualization 

One of the benefits of a dedicated host is unlimited virtualization. For example, you can have licenses for 64 vCores, but you can configure the host to have 128 vCores, so you get double the vCores but pay only half of what you would for the SQL Server licenses. 

Because since it's your host, you are eligible to set the virtualization with a 1:2 ratio. 

## FAQ

**Q: How does the Azure Hybrid Benefit work for Windows Server/SQL Server licenses on Azure Dedicated Host?**

A: Customers can use the value of their existing Windows Server and SQL Server licenses with Software Assurance, or qualifying subscription licenses, to pay a reduced rate on Azure Dedicated Host using Azure Hybrid Benefit. Windows Server Datacenter and SQL Server Enterprise Edition customers get unlimited virtualization (deploy as many Windows Server virtual machines as possible on the host subject to the physical capacity of the underlying server) when they license the entire host and use Azure Hybrid Benefit.  All Windows Server and SQL Server workloads in Azure Dedicated Host are also eligible for Extended Security Updates for Windows Server and SQL Server 2008/R2 at no additional charge. 

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](sql-server-on-azure-vm-iaas-what-is-overview.md)
* [FAQ for SQL Server on a Windows VM](frequently-asked-questions-faq.md)
* [Pricing guidance for SQL Server on a Windows VM](pricing-guidance.md)
* [Release notes for SQL Server on a Windows VM](doc-changes-updates-release-notes.md)


