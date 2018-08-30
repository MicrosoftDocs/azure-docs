---
title: SQL Server on Windows Azure Virtual Machines FAQ | Microsoft Docs
description: This article provides answers to frequently asked questions about running SQL Server on Azure VMs.
services: virtual-machines-windows
documentationcenter: ''
author: v-shysun
manager: felixwu
editor: ''
tags: azure-service-management

ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 07/12/2018
ms.author: v-shysun
---
# Frequently asked questions for SQL Server running on Windows Azure Virtual Machines

> [!div class="op_single_selector"]
> * [Windows](virtual-machines-windows-sql-server-iaas-faq.md)
> * [Linux](../../linux/sql/sql-server-linux-faq.md)

This article provides answers to some of the most common questions about running [SQL Server on Windows Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/).

> [!NOTE]
> This article focuses on issues specific to SQL Server on Windows VMs. If you are running SQL Server on Linux VMs, see the [Linux FAQ](../../linux/sql/sql-server-linux-faq.md).

[!INCLUDE [support-disclaimer](../../../../includes/support-disclaimer.md)]

## <a id="images"></a> Images

1. **What SQL Server virtual machine gallery images are available?**

   Azure maintains virtual machine images for all supported major releases of SQL Server on all editions for both Windows and Linux. For more details, see the complete list of [Windows VM images](virtual-machines-windows-sql-server-iaas-overview.md#payasyougo) and [Linux VM images](../../linux/sql/sql-server-linux-virtual-machines-overview.md#create).

1. **Are existing SQL Server virtual machine gallery images updated?**

   Every two months, SQL Server images in the virtual machine gallery are updated with the latest Windows and Linux updates. For Windows images, this includes any updates that are marked important in Windows Update, including important SQL Server security updates and service packs. For Linux images, this includes the latest system updates. SQL Server cumulative updates are handled differently for Linux and Windows. For Linux, SQL Server cumulative updates are also included in the refresh. But at this time, Windows VMs are not updated with SQL Server or Windows Server cumulative updates.

1. **Can SQL Server virtual machine images get removed from the gallery?**

   Yes. Azure only maintains one image per major version and edition. For example, when a new SQL Server service pack is released, Azure adds a new image to the gallery for that service pack. The SQL Server image for the previous service pack is immediately removed from the Azure portal. However, it is still available for provisioning from PowerShell for the next three months. After three months, the previous service pack image is no longer available. This removal policy would also apply if a SQL Server version becomes unsupported when it reaches the end of its lifecycle.

1. **Can I create a VHD image from a SQL Server VM?**

   Yes, but there are a few considerations. If you deploy this VHD to a new VM in Azure, you do not ge the SQL Server Configuration section in the portal. You must then manage the SQL Server configuration options through PowerShell. Also, you will be charged for at the rate of the SQL VM your image was originally based on. This is true even if you remove SQL Server from the VHD before deploying. 

1. **Is it possible to set up configurations not shown in the virtual machine gallery (For example Windows 2008 R2 + SQL Server 2012)?**

   No. For virtual machine gallery images that include SQL Server, you must select one of the provided images.

## Creation

1. **How do I create an Azure virtual machine with SQL Server?**

   The easiest solution is to create a Virtual Machine that includes SQL Server. For a tutorial on signing up for Azure and creating a SQL VM from the portal, see [Provision a SQL Server virtual machine in the Azure portal](virtual-machines-windows-portal-sql-server-provision.md). You can select a virtual machine image that uses pay-per-second SQL Server licensing, or you can use an image that allows you to bring your own SQL Server license. You also have the option of manually installing SQL Server on a VM with either a freely licensed edition (Developer or Express) or by reusing an on-premises license. If you bring your own license, you must have [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/). For more information, see [Pricing guidance for SQL Server Azure VMs](virtual-machines-windows-sql-server-pricing-guidance.md).

1. **How can I migrate my on-premises SQL Server database to the Cloud?**

   First create an Azure virtual machine with a SQL Server instance. Then migrate your on-premises databases to that instance. For data migration strategies, see [Migrate a SQL Server database to SQL Server in an Azure VM](virtual-machines-windows-migrate-sql.md).

## Licensing

1. **How can I install my licensed copy of SQL Server on an Azure VM?**

   There are two ways to do this. You can provision one of the [virtual machine images that supports licenses](virtual-machines-windows-sql-server-iaas-overview.md#BYOL), which is also known as bring-your-own-license (BYOL). Another option is to copy the SQL Server installation media to a Windows Server VM, and then install SQL Server on the VM. However, if you install SQL Server manually, there is no portal integration and the SQL Server IaaS Agent Extension is not supported, so features such as Automated Backup and Automated Patching will not work in this scenario. For this reason, we recommend to use one of the BYOL gallery images. To use BYOL or your own SQL Server media on an Azure VM, you must have [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/). For more information, see [Pricing guidance for SQL Server Azure VMs](virtual-machines-windows-sql-server-pricing-guidance.md).

1. **Can I change a VM to use my own SQL Server license if it was created from one of the pay-as-you-go gallery images?**

   No. You cannot switch from pay-per-second licensing to using your own license. Create a new Azure virtual machine using one of the [BYOL images](virtual-machines-windows-sql-server-iaas-overview.md#BYOL), and then migrate your databases to the new server using standard [data migration techniques](virtual-machines-windows-migrate-sql.md).

1. **Do I have to pay to license SQL Server on an Azure VM if it is only being used for standby/failover?**

   If you have Software Assurance and use License Mobility as described in [Virtual Machine Licensing FAQ](http://azure.microsoft.com/pricing/licensing-faq/) then you do not have to pay to license one SQL Server participating as a passive secondary replica in an HA deployment. Otherwise, you need to pay to license it.


## Administration

1. **Can I install a second instance of SQL Server on the same VM? Can I change installed features of the default instance?**

   Yes. The SQL Server installation media is located in a folder on the **C** drive. Run **Setup.exe** from that location to add new SQL Server instances or to change other installed features of SQL Server on the machine. Note that some features, such as Automated Backup, Automated Patching, and Azure Key Vault Integration, only operate against the default instance.

1. **Can I uninstall the default instance of SQL Server?**

   Yes, but there are some considerations. As stated in the previous answer, features that rely on the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md) only operate on the default instance. If you uninstall the default instance, the extension continues to look for it and may generate event log errors. These errors are from the following two sources: **Microsoft SQL Server Credential Management** and **Microsoft SQL Server IaaS Agent**. One of the errors might be similar to the following:

      A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible.

   If you do decide to uninstall the default instance, also uninstall the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md) as well.

1. **Can I remove SQL Server completely from a SQL VM?**

   Yes, but you will continue to be charged for your SQL VM as described in [Pricing guidance for SQL Server Azure VMs](virtual-machines-windows-sql-server-pricing-guidance.md). If you no longer need SQL Server, you can deploy a new virtual machine and migrate the data and applications to the new virtual machine. Then you can remove the SQL Server virtual machine.
   
## Updating and Patching

1. **How do I upgrade to a new version/edition of the SQL Server in an Azure VM?**

   Currently, there is no in-place upgrade for SQL Server running in an Azure VM. Create a new Azure virtual machine with the desired SQL Server version/edition, and then migrate your databases to the new server using standard [data migration techniques](virtual-machines-windows-migrate-sql.md).

1. **How are updates and service packs applied on a SQL Server VM?**

   Virtual machines give you control over the host machine, including when and how you apply updates. For the operating system, you can manually apply windows updates, or you can enable a scheduling service called [Automated Patching](virtual-machines-windows-sql-automated-patching.md). Automated Patching installs any updates that are marked important, including SQL Server updates in that category. Other optional updates to SQL Server must be installed manually.

## General

1. **Are SQL Server Failover Cluster Instances (FCI) supported on Azure VMs?**

   Yes. You can [create a Windows Failover Cluster on Windows Server 2016](virtual-machines-windows-portal-sql-create-failover-cluster.md) and use Storage Spaces Direct (S2D) for the cluster storage. Alternatively, you can use third-party clustering or storage solutions as described in [High availability and disaster recovery for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-high-availability-dr.md#azure-only-high-availability-solutions).

   > [!IMPORTANT]
   > At this time, the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md) is not supported for SQL Server FCI on Azure. We recommend that you uninstall the extension from VMs that participate in the FCI. This extension supports features, such as Automated Backup and Patching and some portal features for SQL. These features will not work for SQL VMs after the agent is uninstalled.

1. **What is the difference between SQL VMs and the SQL Database service?**

   Conceptually, running SQL Server on an Azure virtual machine is not that different from running SQL Server in a remote datacenter. In contrast, [SQL Database](../../../sql-database/sql-database-technical-overview.md) offers database-as-a-service. With SQL Database, you do not have access to the machines that host your databases. For a full comparison, see [Choose a cloud SQL Server option: Azure SQL (PaaS) Database or SQL Server on Azure VMs (IaaS)](../../../sql-database/sql-database-paas-vs-sql-server-iaas.md).

1. **How do I install SQL Data tools on my Azure VM?**

    Download and install the SQL Data tools from [Microsoft SQL Server Data Tools - Business Intelligence for Visual Studio 2013](https://www.microsoft.com/en-us/download/details.aspx?id=42313).

## Resources

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
