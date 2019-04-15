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

SQL Server 2008 and SQL Server 2008 R2 are both approaching the [end of their support (EOS) life cycle](/sql-server/sql-server-2008). Since many of our customers are still using both versions, we are providing several options to continue getting support. You can migrate your on-premises SQL Server instances to Azure virtual machines (VMs), migrate to Azure SQL Database, or stay on-premises and purchase extended security updates. This article covers these options for extending support for SQL Server 2008 and 2008 R2 instances.  

This article discusses the options available for extending support for SQL Server 2008 and SQL Server 2008 R2. This article, however, does not discuss actual on-premises to Azure VM migration paths as those are covered extensively in [Migrate an on-premises database to an Azure VM](virtual-machines-windows-migrate-sql.md). 

## End of Support options
If you're still using SQL Server 2008 and/or SQL Server 2008 R2, you have three options to continue receiving support past the end of the product life cycle. Extending support helps reduce security risk, and ensures getting regular security updates. 

### Move to Azure SQL VM - IaaS option
You can choose to either upgrade to a new version on an Azure VM, or move "as-is" to a SQL Server 2008 / 2008 R2 Azure VM. Extended security updates for Windows Server and for SQL Server 2008/2008R2 images are offered on Azure Infrastructure-as-a-Service (IaaS) at no additional charge above the standard pricing for Azure VMs. Customers that migrate workloads to Azure VMs will receive security updates and bulletins rated "Critical" and "Important" for EOS Windows Servers, and "Critical" for EOS SQL Server. 

Some of the benefits to migrating to an Azure VM: 
- Free and automated security patching.
- Automated backup and log shipping for disaster recovery. 
- One-click migration to an Azure SQL Database Managed Instance. 

### Move to Azure SQL Database Managed Instance - PaaS option 
Azure SQL Database Managed Instance combines the rich SQL surface area with the operational and functional benefits of a fully managed service. You can lift and shift you SQL Server databases without rearchitecting your applications. This option gives you full compatibility with EOS SQL Server instances, while leveraging the  benefits of a fully managed solution. This option also provides a version-free experience that takes away the need for manual security patching and upgrades, while reducing cost with compute and networking. 

### Stay on-premises option
If you choose to stay on-premises, you can either upgrade to a newer version of Windows Server and SQL Server, or purchase extended support. If you are not able to certify your applications for the newer version of SQL Server, you have three more years to do so after purchasing extended security updates with active Software Assurance (SA). Extended security updates patches can be paid through the Volume Licensing Service Center (VLSC) site yearly and will be available through Microsoft Update. 


## Provisioning 
There is currently a pay-as-you-go `SQL Server 2008 R2 on Windows Server 2008 R2` image available on the Azure marketplace.

Azure Marketplace only supports Windows Server 2008 R2 and above; there are no Windows Server 2008 images.

If you're still using Windows Server 2008, you have two options to migrate to Azure VM:
- Upgrade the OS to Windows Server 2008 R2.
- Deploy a VM from a custom VHD.

Images deployed through the Marketplace come with the SQL IaaS extension pre-installed. The SQL IaaS extension is a requirement for flexible licensing and automated patching. Customers deploying EOS SQL Server VMs with custom VHDs will be able to manually install the SQL IaaS extension to gain access to the same benefits of flexible licensing and automated patching.

  > [!NOTE]
  > While the SQL Server `Create` and `Manage` blades will work with a SQL 2008/2008R2 image in the Azure portal, the following features are _not supported_: Automatic backups, Azure Key Vault integration, R Services, and Storage configuration.

## Licensing
Pay-as-you-go SQL Server 2008/2008R2 deployments can convert to [Azure Hybrid Benefit (AHB)](https://azure.microsoft.com/en-us/pricing/hybrid-benefit/).

To convert a Software Assurance (SA) based license to pay-as-you-go, customers should register with the SQL VM [resource provider](virtual-machines-windows-sql-ahb.md#register-sql-server-vm-with-sql-resource-provider). The SQL VM resource provider will also support self-installed EOS SQL Server on Windows Server 2008 and Windows Server 2008 R2. Once registered with the SQL VM resource provider, the SQL license type will be interchangeable between AHB and pay-as-you-go. 

Self-installed SQL EOS images are able to register with the SQL  and convert their images to pay-as-you-go.

## Migration
You can migrate EOS SQL Server instances to an Azure VM with manual backup/restore methods; that is the most common migration method from on-premises to an Azure VM.

### Azure Site Recovery

For bulk migrations, we recommend Azure Site Recovery service. With Azure Site Recovery, customers can replicate the whole VM including SQL Server from on-premises to an Azure VM.

SQL Server requires app-consistent Azure Site Recovery snapshots to guarantee recovery; and Azure Site Recovery supports app-consistent snapshots with minimum 1-hour interval. The minimum RPO possible for SQL Server with Azure Site Recovery migrations is 1 hour and the RTO is 2 hours plus SQL Server recovery time.

## Disaster recovery 

Disaster recovery solutions for EOS SQL Server on Azure VM are as follows:

- **SQL Server backups**: SQL Server backups can be used to recover SQL Server in case of regional or zone failures. Since managed backup feature is not supported for EOS SQL Server, customers will need to take backups manually.
- **Log shipping**: You can create a log shipping replica in another zone or Azure region with continuous restores to reduce the RTO. Customers will need to manually configure log shipping.
- **Azure Site Recovery**: You can replicate your VM between zones and regions through Azure Site Recovery replication. SQL Server requires App Consistent Snapshots to guarantee recovery in case of a disaster. Azure Site Recovery offers minimum 1-hour RPO and 2 hour + SQL Server recovery time RTO for EOS SQL Server DR.

## Security Patching
Extended security updates for on-premises SQL Server instances will be delivered through the Microsoft Update channels.  

-  Extended security updates patches will be available to download from a gated private website. 
    - You will get access to the site after purchasing from the Volume Licensing Service Center (VLSC) portal.
    - Extended security update Patches will be billed to the Azure subscription as a one-time charge for a year. 
- Extended security update contract must be repurchased every year.  


## Next steps

Migrate your SQL Server VM to Azure

* [Migrate a SQL Server database to SQL Server in an Azure VM](virtual-machines-windows-migrate-sql.md)

Get started with SQL Server on Azure virtual machines:

* [Create a SQL Server VM in the Azure portal](quickstart-sql-vm-create-portal.md)

Get answers to commonly asked questions about SQL VMs:

* [SQL Server on Azure Virtual Machines FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
