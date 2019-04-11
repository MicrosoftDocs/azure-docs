---
title: Extend support for SQL Server 2008 and SQL Server 2008 R2 with Azure
description: Learn how to extend support for SQL Server 2008 and SQL Server 2008 R2 by migrating your SQL Server instance to Azure, or registering your on-premises instance with Azure. 
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

SQL Server 2008 and SQL Server 2008 R2 are both rapidly approaching the end of their support (EOS) life cycle. Since many of our customers are still using both versions, we are making it easier than ever to continue getting support. There are different benefits available to customers who decide to migrate their SQL Server instance to an Azure VM, and those customers who want to stay on-premises, but register their instance with Azure. 

For brevity, SQL Server 2008 and SQL Server 2008 R2 images will be referred to as SQL EOS images. 


## End of Support options
Customers with Windows Server 2008, Windows Server 2008 R2, SQL Server 2008 and/or SQL Server 2008 R2  have three options to continue receiving support past the end of the product life cycle.  Extending support helps reduce security risk, and ensures getting regular security updates. 

### Move to Azure SQL VM - IaaS option
Customers can choose to either upgrade to a new version on an Azure VM, or move "as-is" to a SQL Server 2008 / 2008 R2 Azure VM. Extended security updates (ESU) for Windows Server and for SQL EOS images will be offered on Azure Infrastructure-as-a-Service (IaaS) at no additional charge above the standard pricing for Azure VMs. Customers that migrate workloads to Azure VMs will receive security updates and bulletins rated "Critical" and "Important" for EOS Windows Servers, and "Critical" for EOS SQL Server.

Some of the benefits to migrating to Azure:
- Free and automated security patching.
- Automated backup and log shipping for disaster recovery. 
- One-click migration to managed instance.

### Move to Azure SQL Database Managed Instance - PaaS option 
Azure SQL Database Managed Instance combines the rich SQL surface area with the operational and functional benefits of an intelligent, fully managed service. Customers can lift and shift their SQL Server databases without rearchitecting their apps. This option gives customers full compatibility with EOS SQL Server instances, while leveraging the great benefits of a fully managed solution. This option also provides a version-less experience that takes away the need for manual security patching and upgrades, while gaining savings with compute and networking.

### Stay on-premises option
Customers can choose to stay on-premises and upgrade to newer versions of Windows Server or SQL Server. Customers that cannot certify their applications for the newer version of SQL Server have three more years to do that by purchasing Extended Security Updates (ESU) with active Software Assurance (SA). ESU patches can be paid through the Volume Licensing Service Center (VLSC) site yearly and will be available through Microsoft Update. ESU patches will be discounted for the on-premises instances that are registered with the Azure EOS SQL Server Service.


Some of the benefits to registering your SQL Server instance with Azure are:

- Discounted security patching.
- Free DR replica in Azure.
    - You can add DR on an Azure VM with a one-click button within the portal.
- One-click "As is" migration to Azure VM.
- Pay as you go licensing
    - Per hour rate including end-of-support security updates (ESU) charges - you'll only have to pay if the instance is running.


## Provisioning 
There is currently a pay-as-you-go `SQL Server 2008 R2 on Windows Server 2008 R2` image available on the Azure marketplace.

Azure Marketplace only supports WIndows Server 2008 R2 and above; there will be no Windows Server 2008 images.

EOS SQL Server on Windows Server 2008 customers will have two options to migrate to Azure VM:
- Upgrade the OS to Windows Server 2008 R2.
- Deploy a VM from a custom VHD.

Images deployed through the Marketplace come with the SQL IaaS extension pre-installed.  The SQL IaaS extension is a requirement for flexible licensing and automated patching. Customers deploying EOS SQL VMs with custom VHDs will be able to manually install the SQL IaaS extension to gain access to the same benefits of flexible licensing and automated patching.

  > [!NOTE]
  > While the SQL Server `Create` and `Manage` blades will work with an EOS image in the Azure portal, the following features are _not supported_: Automatic backups, Azure Key Vault integration, R Services, and Storage configuration.

## Licensing
Pay-as-you-go SQL Server EOS deployments can convert to [Azure Hybrid Benefit (AHB)](https://azure.microsoft.com/en-us/pricing/hybrid-benefit/).

To convert a Software Assurance (SA) based license to pay-as-you-go, customers should register with the SQL VM [resource provider](virtual-machines-windows-sql-ahb.md#register-sql-server-vm-with-sql-resource-provider). The SQL VM resource provider will also support self-installed EOS SQL Server on Windows Server 2008 and Windows Server 2008 R2. Once registered with the SQL VM resource provider, the SQL license type will be interchangeable between AHB and pay-as-you-go. 

Self-installed SQL EOS images are able to register with the SQL  and convert their images to pay-as-you-go.

## Migration
Customers can migrate EOS SQL Server to Azure VM with manual backup/restore methods; that is the most common migration method from on-prem to VM.

### Azure Site Recovery

For bulk migrations, we recommend Azure Site Recovery service. With Azure Site Recovery, customers can replicate the whole VM including SQL Server from on-premises to an Azure VM.

SQL Server requires app-consistent Azure Site Recovery snapshots to guarantee recovery; and Azure Site Recovery supports app-consistent snapshots with minimum 1-hour interval. The minimum RPO possible for SQL Server with Azure Site Recovery migrations is 1 hour and the RTO is 2 hours plus SQL Server recovery time.

## Disaster recovery 

Disaster recovery solutions for EOS SQL Server on Azure VM are as follows:

- **SQL Server backups**: SQL Server backups can be used to recover SQL Server in case of regional or zone failures. Since managed backup feature is not supported for EOS SQL Server, customers will need to take backups manually.
- **Log shipping**: EOS SQL Server customers can create a log shipping replica in another zone or Azure region with continuous restores to reduce the RTO. Customers will need to manually configure log shipping.
- **Azure Site Recovery**: EOS SQL Server customers can replicate their VM between zones and regions through Azure Site Recovery replication. SQL Server requires App Consistent Snapshots to guarantee recovery in case of a disaster. Azure Site Recovery offers minimum 1-hour RPO and 2 hour + SQL Server recovery time RTO for EOS SQL Server DR.

## Security Patching
SQL Server VM offers automated installation of security updates within the customer-provided maintenance window for SQL Server 2012 and later through the SQL IaaS extension.

However, support has been extended for SQL Server 2008 and 2008 R2 on Windows Server 2008 R2. Extended Security Updates (ESU) for SQL Server will be delivered through the Microsoft Update channels.  

- ESU patches will be available to download from a gated private website. 
    - Customers will get access to the ESU site after purchasing from the Volume Licensing Service Center (VLSC) portal.
    - Customers will get access to the ESU site after registering with Azure as "Azure EOS SQL Server" resource.
    - ESU Patches will be billed to the Azure subscription as a one-time charge for a year (or monthly with the pay-as-you-go option). This option will be available January 2020. 
- ESU contract must be repurchased every year.  

Additionally, ESU patches are available to purchase for on-premises systems. On-premises systems that are registered with Azure get further discounted ESU patching rates. 


## Next steps

Migrate your SQL Server VM to Azure

* [Migrate a SQL Server database to SQL Server in an Azure VM](virtual-machines-windows-migrate-sql.md)

Get started with SQL Server on Azure virtual machines:

* [Create a SQL Server VM in the Azure portal](quickstart-sql-vm-create-portal.md)

Get answers to commonly asked questions about SQL VMs:

* [SQL Server on Azure Virtual Machines FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
