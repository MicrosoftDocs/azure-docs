---
title: Extend support for SQL Server 2008 and SQL Server 2008 R2 with Azure
description: Learn how to extend support for SQL Server 2008 and SQL Servevr 2008 R2 by migrating your SQL Server instance to Azure, or registering your on-premises instance with Azure. 
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

This article discusses the options available for extending support for SQL Server 2008 and SQL Server 2008 R2. This article, however, does not discuss actual migration paths as those are covered exhaustively in [Migrate an on-premises database to an Azure VM](virtual-machines-windows-migrate-sql.md). 

For brevity, SQL Server 2008 and SQL Server 2008 R2 images will be referred to as SQL EOS images. 

## End of Support options
Customers with Windows Server and SQL Server 2008 or SQL Server 2008 R2  have three options to continue support, help reduce security risk, and continue to get regular security updates. 

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

For more information on how to register, see [Register on-premises EOS SQL instance with Azure](#register-on-premises-eos-sql-instance-with-azure) later in the article. 


## Considerations 

### Patching

There are several options available when provisioning a SQL 2008 or SQL 2008 R2 image within Azure. 

- There is now a `SQL Server 2008 on Win Server 2008 R2` image available through the portal. 
- It is now possible to register a self-installed SQL Server 2008 and SQL Server 2008 R2 VM with the SQL [resource provider](virtual-machines-windows-sql-ahb.md#register-sql-server-vm-with-sql-resource-provider). 

  > [!NOTE]
  > While the SQL Server `Create` and `Manage` blades will work with an EOS image in the Azure portal, the following features are not supported: Automatic backups, Azure Key Vault integration, R Services, and Storage configuration. 

### Licensing

- SQL EOS image-based deployments are able to utilize the [Azure Hybrid Benefit](https://azure.microsoft.com/en-us/pricing/hybrid-benefit/). 
- Self-installed SQL EOS images are able to register with the SQL [resource provider](virtual-machines-windows-sql-ahb.md#register-sql-server-vm-with-sql-resource-provider) and convert their images to pay-as-you-go. 


### Disaster recovery 

- Backup and restore is the recommended DR option. 
- Log shipping is also available. 

### Patching
When a product reaches the end of its life cycle, then we no longer release free security patches. However, customers who migrate their SQL 2008 or SQL 2008 R2 system to an Azure VM get the benefit of free extended security patches (ESU). 

- ESU patches will be available to download from a gated private website. 
    - Customers will get access to the ESU site after purchasing from the Volume Licensing Service Center (VLSC) portal. 
    - Customers will get access to the ESU site after registering with Azure as "Azure EOS SQL Server" resource. 
    - ESU Patches will be billed for the Azure subscription as a one-time charge for a year (or monthly with the pay-as-you-go option). This option will be available January 2020. 
- ESU contract must be repurchased every year.  

Additionally, ESU patches are available to purchase for on-premises systems. On-premises systems that are registered with Azure get further discounted ESU patching rates. 


## Register on-premises EOS SQL instance with Azure
To utilize the Azure EOS benefits, you must register your SQL Server instance with Azure. To do so, do the following:

1. Create an Azure Service Principal Name (SPN). 
1. Download the [Hybrid EOS SQL Server Onboarding Agent (Agent)] package on the host for the on-premises EOS SQL Server instance, or on a proxy machine that can connect to the host. 
1. Install and run the agent to register each target on-premises EOS SQL Server instance with the Azure EOS SQL Server Service:
    1. The Agent gets the instance connection information, physical location, and subscription from user; discovers SQL Server host metadata and generates a unique machine identifier. 
    1. Agent creates the Hybrid EOS SQL Server ARM resource representing the on-premises EOS SQL Server instance. 
    1. Agent registers the host as a Microsoft update target to enable installation of ESU patches. 
1. Use the **EOS SQL Server** service to monitor and manage Hybrid EOS SQL server resources:
    1. Hybrid EOS SQL Server resources have hourly heartbeat channel with the host through the agent; if the heartbeat is not successful, the resource state is set to `Disconnected`. 
    1. Monitor resource states on Azure portal and resolve connectivity issues for disconnected resources.
    1. Regular hourly heartbeat channel autorecovers resource state to `Connected`. 

## Renew registration for on-premises EOS SQL instances 

Registering with the Hybrid EOS SQL Server resource gives access to ESU patches for a year and registration needs to be renewed every year. To do so, do the following:

1. Update the [Hybrid EOS SQL Server Onboarding Agent]. 
1. Use the agent to renew registration of Hybrid EOS SQL Server instances: 
    1. Agent reruns the SQL Server and Host discovery to get updated metadata.
    1. Agent updates Hybrid EOS SQL Server properties. 
    1. Agent re-enables the host as a target for Microsoft Update for ESU patches. 
   
## Manage on-premises EOS instances
 
1. Sign into the Azure portal and select `EOS SQL Server` service in All Services. This service lists all Hybrid EOS SQL and EOS SQL VM resources. 
1. Manage Hybrid EOS SQL Servers through Azure portal:
    1. Display state and all properties on resource overview blade. 
    1. Manage license type on Azure portal (such as convert the licensing from bring-your-own-license and pay-as-you-go). 
    1. Configure automated backup. 
    1. Manage free DR replica on an Azure VM

## Next steps

Migrate your SQL Server VM to Azure

* [Migrate a SQL Server database to SQL Server in an Azure VM](virtual-machines-windows-migrate-sql.md)

Get started with SQL Server on Azure virtual machines:

* [Create a SQL Server VM in the Azure portal](quickstart-sql-vm-create-portal.md)

Get answers to commonly asked questions about SQL VMs:

* [SQL Server on Azure Virtual Machines FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
