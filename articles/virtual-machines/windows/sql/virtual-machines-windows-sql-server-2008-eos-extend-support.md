---
title: Extend support for SQL Server 2008 and SQL Server 2008 R2 with Azure
description: Learn how to extend support for SQL Server 2008 and SQL Server 2008 R2 by migrating your SQL Server instance to Azure, or purchasing extended support to keep instances on-premises.
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
# Extend support for SQL Server 2008 and SQL Server 2008 R2 with Azure

SQL Server 2008 and SQL Server 2008 R2 are both approaching the [end of their support (EOS) life cycle](https://www.microsoft.com/sql-server/sql-server-2008). Since many of our customers are still using both versions, we are providing several options to continue getting support. You can migrate your on-premises SQL Server instances to Azure virtual machines (VMs), migrate to Azure SQL Database, or stay on-premises and purchase extended security updates.

Unlike with a managed instance, migrating to an Azure VM does not require recertifying your applications. And unlike with staying on-premises, you will receive free extended security patches by migrating to an Azure VM.

The rest of this article provides considerations for migrating your SQL Server instance to an Azure VM.

## Provisioning

There is a pay-as-you-go `SQL Server 2008 R2 on Windows Server 2008 R2` image available on the Azure marketplace.

Customers who are on SQL Server 2008 will either need to self-install, or upgrade to SQL Server 2008 R2. Likewise, customers on Windows Server 2008 will either need to deploy their VM from a custom VHD, or upgrade to Windows Server 2008 R2.

Images deployed through the Marketplace come with the SQL IaaS extension pre-installed. The SQL IaaS extension is a requirement for flexible licensing and automated patching. Customers deploying self-installed VMs will need to manually install the SQL IaaS extension. The SQL IaaS extension is not supported on Windows 2008.

  > [!NOTE]
  > While the SQL Server `Create` and `Manage` blades will work with the SQL Server 2008R2 image in the Azure portal, the following features are _not supported_: Automatic backups, Azure Key Vault integration, R Services, and Storage configuration.

## Licensing
Pay-as-you-go SQL Server 2008R2 deployments can convert to [Azure Hybrid Benefit (AHB)](https://azure.microsoft.com/pricing/hybrid-benefit/).

To convert a Software Assurance (SA) based license to pay-as-you-go, customers should register with the SQL VM [resource provider](virtual-machines-windows-sql-register-with-resource-provider.md). Once registered with the SQL VM resource provider, the SQL license type will be interchangeable between AHB and pay-as-you-go.

Self-installed SQL Server 2008 or SQL Server 2008 R2 instances on Azure VM can register with the SQL resource provider and convert their license type to pay-as-you-go.

## Migration
You can migrate EOS SQL Server instances to an Azure VM with manual backup/restore methods; this is the most common migration method from on-premises to an Azure VM.

### Azure Site Recovery

For bulk migrations, we recommend [Azure Site Recovery](/azure/site-recovery/site-recovery-overview) service. With Azure Site Recovery, customers can replicate the whole VM including SQL Server from on-premises to an Azure VM.

SQL Server requires app-consistent Azure Site Recovery snapshots to guarantee recovery; and Azure Site Recovery supports app-consistent snapshots with minimum 1-hour interval. The minimum RPO possible for SQL Server with Azure Site Recovery migrations is 1 hour and the RTO is 2 hours plus SQL Server recovery time.

### Database Migration Service

The [Database Migration Service](/azure/dms/dms-overview) is an option for customers if migrating from on-premises to Azure VM by upgrading SQL Server to  SQL Server 2012 and greater.

## Disaster recovery

Disaster recovery solutions for EOS SQL Server on Azure VM are as follows:

- **SQL Server backups**: Use Azure Backup to protect your EOS SQL Server against ransomware, accidental deletion and corruption. The solution is currently in preview for EOS SQL Server and supports SQL Server 2008 and 2008 R2 running on Windows 2008 R2 SP1. For more details, refer this [article](https://docs.microsoft.com/azure/backup/backup-azure-sql-database#support-for-sql-server-2008-and-sql-server-2008-r2)
- **Log shipping**: You can create a log shipping replica in another zone or Azure region with continuous restores to reduce the RTO. Customers will need to manually configure log shipping.
- **Azure Site Recovery**: You can replicate your VM between zones and regions through Azure Site Recovery replication. SQL Server requires App Consistent Snapshots to guarantee recovery in case of a disaster. Azure Site Recovery offers minimum 1-hour RPO and 2 hour + SQL Server recovery time RTO for EOS SQL Server DR.

## Security patching
Extended security updates for SQL Server VMs will be delivered through the Microsoft Update channels once the SQL Server VM has been registered with the SQL [resource provider](virtual-machines-windows-sql-register-with-resource-provider.md). Patches can either be downloaded manually, or automatically.

**Automated patching** is enabled by default. Automated patching allows Azure to automatically patch SQL Server and the operating system. You can specify a day of the week, time, and duration for a maintenance window if SQL IaaS Extension is installed. Azure performs patching in this maintenance window. The maintenance window schedule uses the VM locale for time.  For more information, see [Automated Patching for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-automated-patching.md).


## Next steps

Migrate your SQL Server VM to Azure

* [Migrate a SQL Server database to SQL Server in an Azure VM](virtual-machines-windows-migrate-sql.md)

Get started with SQL Server on Azure virtual machines:

* [Create a SQL Server VM in the Azure portal](quickstart-sql-vm-create-portal.md)

Get answers to commonly asked questions about SQL VMs:

* [SQL Server on Azure Virtual Machines FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
