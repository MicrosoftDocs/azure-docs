---
title: Extend support for SQL Server 2008 & 2008 R2 
description: Extend support for SQL Server 2008 and SQL Server 2008 R2 by migrating your SQL Server instance to Azure, or purchasing extended support to keep instances on-premises.
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
tags: azure-service-management
ms.service: virtual-machines-sql

ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 04/08/2019
ms.author: mathoma
ms.reviewer: jroth
ms.custom: "seo-lt-2019"
---
# Extend support for SQL Server 2008 and SQL Server 2008 R2 with Azure
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

SQL Server 2008 and SQL Server 2008 R2 have both reached the [end of their support (EOS) life cycle](https://www.microsoft.com/sql-server/sql-server-2008). Because many customers are still using both versions, we're providing several options to continue getting support. You can migrate your on-premises SQL Server instances to Azure virtual machines (VMs), migrate to Azure SQL Database, or stay on-premises and purchase extended security updates.

Unlike with a managed instance, migrating to an Azure VM does not require recertifying your applications. And unlike with staying on-premises, you'll receive free extended security patches by migrating to an Azure VM.

The rest of this article provides considerations for migrating your SQL Server instance to an Azure VM.

For more information about end of support options, see [End of support](/sql/sql-server/end-of-support/sql-server-end-of-life-overview).

## Provisioning

There is a pay-as-you-go **SQL Server 2008 R2 on Windows Server 2008 R2** image available on Azure Marketplace.

Customers who are on SQL Server 2008 will need to either self-install or upgrade to SQL Server 2008 R2. Likewise, customers on Windows Server 2008 will need to either deploy their VM from a custom VHD or upgrade to Windows Server 2008 R2.

Images deployed through Azure Marketplace come with the SQL IaaS extension pre-installed. The SQL IaaS extension is a requirement for flexible licensing and automated patching. Customers who deploy self-installed VMs will need to manually install the SQL IaaS extension. The SQL IaaS extension is not supported on Windows Server 2008.

> [!NOTE]
> Although the SQL Server **Create** and **Manage** blades will work with the SQL Server 2008 R2 image in the Azure portal, the following features are _not supported_: Automatic backups, Azure Key Vault integration, R Services, and storage configuration.

## Licensing
Pay-as-you-go SQL Server 2008 R2 deployments can convert to [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

To convert a Software Assurance (SA)-based license to pay-as-you-go, customers should register with the SQL VM [resource provider](sql-vm-resource-provider-register.md). After that registration, the SQL license type will be interchangeable between Azure Hybrid Benefit and pay-as-you-go.

Self-installed SQL Server 2008 or SQL Server 2008 R2 instances on an Azure VM can register with the SQL VM resource provider and convert their license type to pay-as-you-go.

## Migration
You can migrate EOS SQL Server instances to an Azure VM with manual backup/restore methods. This is the most common migration method from on-premises to an Azure VM.

### Azure Site Recovery

For bulk migrations, we recommend the [Azure Site Recovery](/azure/site-recovery/site-recovery-overview) service. With Azure Site Recovery, customers can replicate the whole VM, including SQL Server from on-premises to Azure VM.

SQL Server requires app-consistent Azure Site Recovery snapshots to guarantee recovery. Azure Site Recovery supports app-consistent snapshots with a minimum 1-hour interval. The minimum recovery point objective (RPO) possible for SQL Server with Azure Site Recovery migrations is 1 hour. The recovery time objective (RTO) is 2 hours plus SQL Server recovery time.

### Database Migration Service

The [Azure Database Migration Service](/azure/dms/dms-overview) is an option for customers if they're migrating from on-premises to an Azure VM by upgrading SQL Server to the 2012 version or later.

## Disaster recovery

Disaster recovery solutions for EOS SQL Server on an Azure VM are as follows:

- **SQL Server backups**: Use Azure Backup to help protect your EOS SQL Server 2008 and 2008 R2 against ransomware, accidental deletion, and corruption with 15-min RPO and point-in-time recovery. For more details, see [this article](https://docs.microsoft.com/azure/backup/sql-support-matrix#scenario-support).
- **Log shipping**: You can create a log shipping replica in another zone or Azure region with continuous restores to reduce the RTO. You need to manually configure log shipping.
- **Azure Site Recovery**: You can replicate your VM between zones and regions through Azure Site Recovery replication. SQL Server requires app-consistent snapshots to guarantee recovery in case of a disaster. Azure Site Recovery offers a minimum 1-hour RPO and a 2-hour (plus SQL Server recovery time) RTO for EOS SQL Server disaster recovery.

## Security patching
Extended security updates for SQL Server VMs are delivered through the Microsoft Update channels after the SQL Server VM has been registered with the SQL VM [resource provider](sql-vm-resource-provider-register.md). Patches can be downloaded manually or automatically.

*Automated patching* is enabled by default. Automated patching allows Azure to automatically patch SQL Server and the operating system. You can specify a day of the week, time, and duration for a maintenance window if the SQL Server IaaS extension is installed. Azure performs patching in this maintenance window. The maintenance window schedule uses the VM locale for time. For more information, see [Automated patching for SQL Server on Azure Virtual Machines](automated-patching.md).


## Next steps

Migrate your SQL Server VM to Azure:

* [Migrate a SQL Server database to SQL Server in an Azure VM](migrate-to-vm-from-sql-server.md)

Get started with SQL Server on Azure Virtual Machines:

* [Create a SQL Server VM in the Azure portal](sql-vm-create-portal-quickstart.md)

Get answers to commonly asked questions about SQL Server VMs:

* [FAQ for SQL Server on Azure Virtual Machines](frequently-asked-questions-faq.md)

Find out more about end of support options, and extended security updates:

* [End of support](/sql/sql-server/end-of-support/sql-server-end-of-life-overview) & [Extended Security Updates](/sql/sql-server/end-of-support/sql-server-extended-security-updates)