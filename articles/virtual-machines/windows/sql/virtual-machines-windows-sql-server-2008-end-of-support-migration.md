---
title: Extend support for SQL Server 2008 and 2008 R2 with Azure
description: Learn how to extend support for SQL Server 2008 and 2008 R2 by migrating your SQL Server instance to Azure, or registering your on-premises instance with Azure. 
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
manager: craigg
tags: azure-service-management
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 04/08/2019
ms.author: mathoma
ms.reviewer: jroth
---
# Extend support for SQL Server 2008 and 2008 R2 with Azure

SQL Server 2008 and SQL Server 2008 R2 are both rapidly approaching the end of their support (EOS) life cycle. Since many of our customers are still using both versions,we are making it easier than ever to continue getting support. There are different benefits available to customers who decide to migrate their SQL Server instance to an Azure VM, and those customers who want to stay on-premises, but register their instance with Azure. 

This topic discusses the options available for extending support for SQL Server 2008 and SQL Server 2008 R2. This topic, however, does not discuss actual migration paths are those are covered exhaustively in [Migrate an on-premises database to an Azure VM](virtual-machines-windows-migrate-sql.md). 

For brevity, SQL Server 2008 and SQL Server 2008 R2 images will be referred to as SQL EOS images. 

## Overview
There are many benefits to either migrating your SQL Server instance to Azure, or registering your on-premises instance with Azure. 

### Benefits to migrating to Azure

- Free and automated security patching.
- Automated backup and log shipping for disaster recovery. 
- One-click migration to managed instance. 

### Benefits to registering instance with Azure

- Discounted security patching. 
- Free DR replica in Azure. 
    - You can add DR on an Azure VM with a one-click button within the portal. 
  - One-click "As is" migration to Azure VM. 
  - Pay as you go licensing
      - Per hour rate including end-of-support security updates (ESU) charges - you'll only have to pay if the instance is running.

For more information on how to register, see [Register on-premises EOS SQL instance with Azure](#register-on-premsies-eos-sql-instance-with-azure) later in the article. 


## Provisioning 

There are several options available when provisioning a SQL 2008 or SQL 2008 R2 image within Azure. 

- There is now a `SQL Server 2008 on Win Server 2008 R2` image available through the portal. 
- It is now possible to register a self-installed SQL Server 2008 and SQL Server 2008 R2 VM with the SQL [resource provider](virtual-machines-windows-sql-ahb.md#register-sql-server-vm-with-sql-resource-provider). 

  > [!NOTE]
  > While the SQL Server `Create` and `Manage` blades will work with an EOS image in the Azure portal, the following features are not supported: Automatic backups, Azure Key Vault integration, R Services, and Storage configuration. 

## Licensing

- SQL EOS image-based deployments are able to utilize the [Azure Hybrid Benefit](https://azure.microsoft.com/en-us/pricing/hybrid-benefit/). 
- Self-installed SQL EOS images are able to register with the SQL [resource provider](virtual-machines-windows-sql-ahb.md#register-sql-server-vm-with-sql-resource-provider) and convert their images to pay-as-you-go. 


## Disaster recovery 

- Backup and restore is the recommended DR option. 
- Log shipping is also available. 

## Patching
When a product reaches the end of its life cycle, then we no longer release free security patches. However, customers who migrate their SQL 2008 or SQL 2008 R2 system to an Azure VM get the benefit of free extended security patches (ESU). 

- ESU patches will be available to download from a gated private website. 
    - Customers will get access to the ESU site after purchasing from the Volume Licensing Support Center (VLSC) portal. 
    - Customers will get access to the ESU site after registering with Azure as "Azure EOS SQL Server" resource. 
    - ESU Patches will be billed for the Azure subscription as a one-time charge for a year (or monthly with the pay-as-you-go option). This option will be available January 2020. 
- ESU contract must be re-purchased every year.  

Additionally, ESU patches are available to purchase for on-premises systems. On-premises systems that are registered with Azure get further discounted ESU patching rates. 


## Register on-premsies EOS SQL instance with Azure
To utilize the Azure EOS benefits, you must register your SQL Server instance with Azure. To do so, do the following:

1. Create a **Jump box server** with internet connectivity that can connect to your EOS SQL Server in a secure way. 
1. Download and install the `EOS SQL Server Azure Connector` on the jump box. This utility will
    1. Export `Instance Discovery` file for the target EOS SQL Server instances, which includes the metadata for the instance, such as the license and host. 
    1. Create an `Azure EOS SQL Server` for each instance. 

  > [!NOTE]
  > The jump box with the `EOS SQL Server Azure Connector` should be live to verify the instances before downloading each security patch, or should be live all the time for pay-as-you-go licensing. 


## Next steps

Migrate your SQL Server VM to Azure

* [Migrate a SQL Server database to SQL Server in an Azure VM](virtual-machines-windows-migrate-sql.md)

Get started with SQL Server on Azure virtual machines:

* [Create a SQL Server VM in the Azure portal](quickstart-sql-vm-create-portal.md)

Get answers to commonly asked questions about SQL VMs:

* [SQL Server on Azure Virtual Machines FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
