---
title: SQL Server on Windows Virtual Machines in Azure FAQ | Microsoft Docs
description: This article provides answers to frequently asked questions about running SQL Server on Azure VMs.
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
editor: ''
tags: azure-service-management
ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: virtual-machines-sql

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 08/05/2019
ms.author: mathoma
---
# Frequently asked questions for SQL Server running on Windows virtual machines in Azure
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!div class="op_single_selector"]
> * [Windows](frequently-asked-questions-faq.md)
> * [Linux](../linux/frequently-asked-questions-faq.md)

This article provides answers to some of the most common questions about running [SQL Server on Windows Virtual Machines (VMs) in Azure](https://azure.microsoft.com/services/virtual-machines/sql-server/).

[!INCLUDE [support-disclaimer](../../../../includes/support-disclaimer.md)]

## <a id="images"></a> Images

1. **What SQL Server virtual machine gallery images are available?** 

   Azure maintains virtual machine images for all supported major releases of SQL Server on all editions for both Windows and Linux. For more information, see the complete list of [Windows VM images](sql-server-on-azure-vm-iaas-what-is-overview.md#payasyougo) and [Linux VM images](../linux/sql-server-on-linux-vm-what-is-iaas-overview.md#create).

1. **Are existing SQL Server virtual machine gallery images updated?**

   Every two months, SQL Server images in the virtual machine gallery are updated with the latest Windows and Linux updates. For Windows images, this includes any updates that are marked important in Windows Update, including important SQL Server security updates and service packs. For Linux images, this includes the latest system updates. SQL Server cumulative updates are handled differently for Linux and Windows. For Linux, SQL Server cumulative updates are also included in the refresh. But at this time, Windows VMs are not updated with SQL Server or Windows Server cumulative updates.

1. **Can SQL Server virtual machine images get removed from the gallery?**

   Yes. Azure only maintains one image per major version and edition. For example, when a new SQL Server service pack is released, Azure adds a new image to the gallery for that service pack. The SQL Server image for the previous service pack is immediately removed from the Azure portal. However, it is still available for provisioning from PowerShell for the next three months. After three months, the previous service pack image is no longer available. This removal policy would also apply if a SQL Server version becomes unsupported when it reaches the end of its lifecycle.


1. **Is it possible to deploy an older image of SQL Server that is not visible in the Azure portal?**

   Yes, by using PowerShell. For more information about deploying SQL Server VMs using PowerShell, see [How to provision SQL Server virtual machines with Azure PowerShell](create-sql-vm-powershell.md).
   
1. **Is it possible to create a generalized Azure Marketplace SQL Server image of my SQL Server VM and use it to deploy VMs?**

   Yes, but you must then [register each SQL Server VM with the SQL Server VM resource provider](sql-vm-resource-provider-register.md) to manage your SQL Server VM in the portal, as well as utilize features such as automated patching and automatic backups. When registering with the resource provider, you will also need to specify the license type for each SQL Server VM.

1. **How do I generalize SQL Server on Azure VM and use it to deploy new VMs?**

   You can deploy a Windows Server VM (without SQL Server installed on it) and use the [SQL sysprep](/sql/database-engine/install-windows/install-sql-server-using-sysprep?view=sql-server-ver15) process to generalize SQL Server on Azure VM (Windows) with the SQL Server installation media. Customers who have [Software Assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default?rtc=1&activetab=software-assurance-default-pivot%3aprimaryr3) can obtain their installation media from the [Volume Licensing Center](https://www.microsoft.com/Licensing/servicecenter/default.aspx). Customers who don't have Software Assurance can use the setup media from an Azure Marketplace SQL Server VM image that has the desired edition.

   Alternatively, use one of the SQL Server images from Azure Marketplace to generalize SQL Server on Azure VM. Note that you must delete the following registry key in the source image before creating your own image. Failure to do so can result in the bloating of the SQL Server setup bootstrap folder and/or SQL IaaS extension in failed state.

   Registry Key path:  
   `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Setup\SysPrepExternal\Specialize`

   > [!NOTE]
   > SQL Server on Azure VMs, including those deployed from custom generalized images, should be [registered with the SQL VM resource provider](/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-register-with-resource-provider?tabs=azure-cli%2Cbash) to meet compliance requirements and to utilize optional features such as automated patching and automatic backups. The resource provider also allows you to [specify the license type](/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-ahb?tabs=azure-portal) for each SQL Server VM.

1. **Can I use my own VHD to deploy a SQL Server VM?**

   Yes, but you must then [register each SQL Server VM with the SQL Server VM resource provider](sql-vm-resource-provider-register.md) to manage your SQL Server VM in the portal, as well as utilize features such as automated patching and automatic backups.

1. **Is it possible to set up configurations not shown in the virtual machine gallery (for example Windows 2008 R2 + SQL Server 2012)?**

   No. For virtual machine gallery images that include SQL Server, you must select one of the provided images either through the Azure portal or via [PowerShell](create-sql-vm-powershell.md). However, you have the ability to deploy a Windows VM and self-install SQL Server to it. You must then [register your SQL Server VM with the SQL Server VM resource provider](sql-vm-resource-provider-register.md) to manage your SQL Server VM in the Azure portal, as well as utilize features such as automated patching and automatic backups. 


## Creation

1. **How do I create an Azure virtual machine with SQL Server?**

   The easiest method is to create a virtual machine that includes SQL Server. For a tutorial on signing up for Azure and creating a SQL Server VM from the portal, see [Provision a SQL Server virtual machine in the Azure portal](create-sql-vm-portal.md). You can select a virtual machine image that uses pay-per-second SQL Server licensing, or you can use an image that allows you to bring your own SQL Server license. You also have the option of manually installing SQL Server on a VM with either a freely licensed edition (Developer or Express) or by reusing an on-premises license. Be sure to [register your SQL Server VM with the SQL Server VM resource provider](sql-vm-resource-provider-register.md) to manage your SQL Server VM in the portal, as well as utilize features such as automated patching and automatic backups. If you bring your own license, you must have [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/). For more information, see [Pricing guidance for SQL Server Azure VMs](pricing-guidance.md).

1. **How can I migrate my on-premises SQL Server database to the cloud?**

   First create an Azure virtual machine with a SQL Server instance. Then migrate your on-premises databases to that instance. For data migration strategies, see [Migrate a SQL Server database to SQL Server in an Azure VM](migrate-to-vm-from-sql-server.md).

## Licensing

1. **How can I install my licensed copy of SQL Server on an Azure VM?**

   There are three ways to do this. If you're an Enterprise Agreement (EA) customer, you can provision one of the [virtual machine images that supports licenses](sql-server-on-azure-vm-iaas-what-is-overview.md#BYOL), which is also known as bring-your-own-license (BYOL). If you have [Software Assurance](https://www.microsoft.com/en-us/licensing/licensing-programs/software-assurance-default), you can enable the [Azure Hybrid Benefit](licensing-model-azure-hybrid-benefit-ahb-change.md) on an existing pay-as-you-go (PAYG) image. Or you can copy the SQL Server installation media to a Windows Server VM, and then install SQL Server on the VM. Be sure to register your SQL Server VM with the [resource provider](sql-vm-resource-provider-register.md) for features such as portal management, automated backup and automated patching. 

1. **Can I change a VM to use my own SQL Server license if it was created from one of the pay-as-you-go gallery images?**

   Yes. You can easily switch a pay-as-you-go (PAYG) gallery image to bring-your-own-license (BYOL) by enabling the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/faq/).  For more information, see [How to change the licensing model for a SQL Server VM](licensing-model-azure-hybrid-benefit-ahb-change.md). Currently, this facility is only available for public and Azure Government cloud customers.

1. **Will switching licensing models require any downtime for SQL Server?**

   No. [Changing the licensing model](licensing-model-azure-hybrid-benefit-ahb-change.md) does not require any downtime for SQL Server as the change is effective immediately and does not require a restart of the VM. However, to register your SQL Server VM with the SQL Server VM resource provider, the [SQL IaaS extension](sql-server-iaas-agent-extension-automate-management.md) is a prerequisite and installing the SQL IaaS extension in _full_ mode restarts the SQL Server service. As such, if the SQL IaaS extension needs to be installed, either install it in _lightweight_ mode for limited functionality, or install it in _full_ mode during a maintenance window. The SQL IaaS extension installed in _lightweight_ mode can be upgraded to _full_ mode at any time,  but requires a restart of the SQL Server service. 
   
1. **Is it possible to switch licensing models on a SQL Server VM deployed using classic model?**

   No. Changing licensing models is not supported on a classic VM. You may migrate your VM to the Azure Resource Manager model and register with the SQL Server VM resource provider. Once the VM is registered with the SQL Server VM resource provider, licensing model changes will be available on the VM.

1. **Can I use the Azure portal to manage multiple instances on the same VM?**

   No. Portal management is a feature provided by the SQL Server VM resource provider, which relies on the SQL Server IaaS Agent extension. As such, the same limitations apply to the resource provider as to the extension. The portal can either only manage one default instance, or one named instance, as long as it was configured correctly. For more information on these limitations, see [SQL Server IaaS agent extension](sql-server-iaas-agent-extension-automate-management.md). 

1. **Can CSP subscriptions activate the Azure Hybrid Benefit?**

   Yes, the Azure Hybrid Benefit is available for CSP subscriptions. CSP customers should first deploy a pay-as-you-go image, and then [change the licensing model](licensing-model-azure-hybrid-benefit-ahb-change.md) to bring-your-own-license.
   
 
1. **Do I have to pay to license SQL Server on an Azure VM if it is only being used for standby/failover?**

   To have a free passive license for a standby secondary availability group or failover clustered instance, you must meet all of the following criteria as outlined by the [Product Licensing Terms](https://www.microsoft.com/licensing/product-licensing/products):

   1. You have [license mobility](https://www.microsoft.com/licensing/licensing-programs/software-assurance-license-mobility?activetab=software-assurance-license-mobility-pivot:primaryr2) through [Software Assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default?activetab=software-assurance-default-pivot%3aprimaryr3). 
   1. The passive SQL Server instance does not serve SQL Server data to clients or run active SQL Server workloads. It is only used to synchronize with the primary server and otherwise maintain the passive database in a warm standby state. If it is serving data, such as reports to clients running active SQL Server workloads, or performing any work  other than what is specified in the product terms, it must be a paid licensed SQL Server instance. The following activity is permitted on the secondary instance: database consistency checks or CheckDB, full backups, transaction log backups, and monitoring resource usage data. You may also run the primary and corresponding disaster recovery instance simultaneously for brief periods of disaster recovery testing every 90 days. 
   1. The active SQL Server license is covered by Software Assurance and allows for **one** passive secondary SQL Server instance, with up to the same amount of compute as the licensed active server, only. 
   1. The secondary SQL Server VM utilizes the [Disaster Recovery](business-continuity-high-availability-disaster-recovery-hadr-overview.md#free-dr-replica-in-azure) license in the Azure portal.
   
1. **What is considered a passive instance?**

   The passive SQL Server instance does not serve SQL Server data to clients or run active SQL Server workloads. It is only used to synchronize with the primary server and otherwise maintain the passive database in a warm standby state. If it is serving data, such as reports to clients running active SQL Server workloads, or performing any work other than what is specified in the product terms, it must be a paid licensed SQL Server instance. The following activity is permitted on the secondary instance: database consistency checks or CheckDB, full backups, transaction log backups, and monitoring resource usage data. You may also run the primary and corresponding disaster recovery instance simultaneously for brief periods of disaster recovery testing every 90 days.
   

1. **What scenarios can utilize the Disaster Recovery (DR) benefit?**

   The [licensing guide](https://aka.ms/sql2019licenseguide) provides scenarios in which the Disaster Recovery Benefit can be utilized. Refer to your Product Terms and talk to your licensing contacts or account manager for more information.

1. **Which subscriptions support the Disaster Recovery (DR) benefit?**

   Comprehensive programs that offer Software Assurance equivalent subscription rights as a fixed benefit support the DR benefit. This includes. but is not limited to, the Open Value (OV), Open Value Subscription (OVS), Enterprise Agreement (EA), Enterprise Agreement Subscription (EAS), and the Server and Cloud Enrollment (SCE). Refer to the [product terms](https://www.microsoft.com/licensing/product-licensing/products) and talk to your licensing contacts or account manager for more information. 

   
 ## Resource provider

1. **Will registering my VM with the new SQL Server VM resource provider bring additional costs?**

   No. The SQL Server VM resource provider just enables additional manageability for SQL Server on Azure VM with no additional charges. 

1. **Is the SQL Server VM resource provider available for all customers?**
 
   Yes, as long as the SQL Server VM was deployed on the public cloud using the Resource Manager model, and not the classic model. All other customers are able to register with the new SQL Server VM resource provider. However, only customers with the [Software Assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default?activetab=software-assurance-default-pivot%3aprimaryr3) benefit can use their own license by activating the [Azure Hybrid Benefit (AHB)](https://azure.microsoft.com/pricing/hybrid-benefit/) on a SQL Server VM. 

1. **What happens to the resource provider (_Microsoft.SqlVirtualMachine_) resource if the VM resource is moved or dropped?** 

   When the Microsoft.Compute/VirtualMachine resource is dropped or moved, then the associated Microsoft.SqlVirtualMachine resource is notified to asynchronously replicate the operation.

1. **What happens to the VM if the resource provider (_Microsoft.SqlVirtualMachine_) resource is dropped?**

    The Microsoft.Compute/VirtualMachine resource is not impacted when the Microsoft.SqlVirtualMachine resource is dropped. However, the licensing changes will default back to the original image source. 

1. **Is it possible to register self-deployed SQL Server VMs with the SQL Server VM resource provider?**

    Yes. If you deployed SQL Server from your own media, and installed the SQL IaaS extension you can register your SQL Server VM with the resource provider to get the manageability benefits provided by the SQL IaaS extension.    


## Administration

1. **Can I install a second instance of SQL Server on the same VM? Can I change installed features of the default instance?**

   Yes. The SQL Server installation media is located in a folder on the **C** drive. Run **Setup.exe** from that location to add new SQL Server instances or to change other installed features of SQL Server on the machine. Note that some features, such as Automated Backup, Automated Patching, and Azure Key Vault Integration, only operate against the default instance, or a named instance that was configured properly (See Question 3). 

1. **Can I uninstall the default instance of SQL Server?**

   Yes, but there are some considerations. First, SQL Server-associated billing may continue to occur depending on the license model for the VM. Second, as stated in the previous answer, there are features that rely on the [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md). If you uninstall the default instance without removing the IaaS extension also, the extension continues to look for the default instance and may generate event log errors. These errors are from the following two sources: **Microsoft SQL Server Credential Management** and **Microsoft SQL Server IaaS Agent**. One of the errors might be similar to the following:

      A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible.

   If you do decide to uninstall the default instance, also uninstall the [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md) as well. 

1. **Can I use a named instance of SQL Server with the IaaS extension**?
   
   Yes, if the named instance is the only instance on the SQL Server, and if the original default instance was [uninstalled properly](sql-server-iaas-agent-extension-automate-management.md#install-on-a-vm-with-a-single-named-sql-server-instance). If there is no default instance and there are multiple named instances on a single SQL Server VM, the SQL Server IaaS agent extension will fail to install. 

1. **Can I remove SQL Server completely from a SQL Server VM?**

   Yes, but you will continue to be charged for your SQL Server VM as described in [Pricing guidance for SQL Server Azure VMs](pricing-guidance.md). If you no longer need SQL Server, you can deploy a new virtual machine and migrate the data and applications to the new virtual machine. Then you can remove the SQL Server virtual machine.
   
## Updating and patching

1. **How do I change to a different version/edition of SQL Server in an Azure VM?**

   Customers can change their version/edition of SQL Server by using setup media that contains their desired version or edition of SQL Server. Once the edition has been changed, use the Azure portal to modify the edition property of the VM to accurately reflect billing for the VM. For more information, see [change edition of a SQL Server VM](change-sql-server-edition.md). There is no billing difference for different versions of SQL Server, so once the version of SQL Server has been changed, no further action is needed.

1. **Where can I get the setup media to change the edition or version of SQL Server?**

   Customers who have [Software Assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default) can obtain their installation media from the [Volume Licensing Center](https://www.microsoft.com/Licensing/servicecenter/default.aspx). Customers that do not have Software Assurance can use the setup media from an Azure Marketplace SQL Server VM image that has their desired edition.
   
1. **How are updates and service packs applied on a SQL Server VM?**

   Virtual machines give you control over the host machine, including when and how you apply updates. For the operating system, you can manually apply windows updates, or you can enable a scheduling service called [Automated Patching](automated-patching.md). Automated Patching installs any updates that are marked important, including SQL Server updates in that category. Other optional updates to SQL Server must be installed manually.

1. **Can I upgrade my SQL Server 2008 / 2008 R2 instance after registering it with the SQL Server VM resource provider?**

   Yes. You can use any setup media to upgrade the version and edition of SQL Server, and then you can upgrade your [SQL IaaS extension mode](sql-vm-resource-provider-register.md#management-modes)) from _no agent_ to _full_. Doing so will give you access to all the benefits of the SQL IaaS extension such as portal manageability, automated backups, and automated patching. 

1. **How can I get free extended security updates for my end of support SQL Server 2008 and SQL Server 2008 R2 instances?**

   You can get [free extended security updates](sql-server-2008-extend-end-of-support.md) by moving your SQL Server as-is to an Azure virtual machine. For more information, see [end of support options](/sql/sql-server/end-of-support/sql-server-end-of-life-overview). 
  
   

## General

1. **Are SQL Server failover cluster instances (FCI) supported on Azure VMs?**

   Yes. You can install a failover cluster instance using either [premium file shares (PFS)](failover-cluster-instance-premium-file-share-manually-configure.md) or [storage spaces direct (S2D)](failover-cluster-instance-storage-spaces-direct-manually-configure.md) for the storage subsystem. Premium file shares provide IOPS and throughput capacities that will meet the needs of many workloads. For IO-intensive workloads, consider using storage spaces direct based on manged premium or ultra-disks. Alternatively, you can use third-party clustering or storage solutions as described in [High availability and disaster recovery for SQL Server on Azure Virtual Machines](business-continuity-high-availability-disaster-recovery-hadr-overview.md#azure-only-high-availability-solutions).

   > [!IMPORTANT]
   > At this time, the _full_ [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md) is not supported for SQL Server FCI on Azure. We recommend that you uninstall the _full_ extension from VMs that participate in the FCI, and install the extension in _lightweight_ mode instead. This extension supports features, such as Automated Backup and Patching and some portal features for SQL Server. These features will not work for SQL Server VMs after the _full_ agent is uninstalled.

1. **What is the difference between SQL Server VMs and the SQL Database service?**

   Conceptually, running SQL Server on an Azure virtual machine is not that different from running SQL Server in a remote datacenter. In contrast, [Azure SQL Database](../../database/sql-database-paas-overview.md) offers database-as-a-service. With SQL Database, you do not have access to the machines that host your databases. For a full comparison, see [Choose a cloud SQL Server option: Azure SQL (PaaS) Database or SQL Server on Azure VMs (IaaS)](../../azure-sql-iaas-vs-paas-what-is-overview.md).

1. **How do I install SQL Data tools on my Azure VM?**

    Download and install the SQL Data tools from [Microsoft SQL Server Data Tools - Business Intelligence for Visual Studio 2013](https://www.microsoft.com/download/details.aspx?id=42313).

1. **Are distributed transactions with MSDTC supported on SQL Server VMs?**
   
    Yes. Local DTC is supported for SQL Server 2016 SP2 and greater. However, applications must be tested when utilizing Always On availability groups, as transactions in-flight during a failover will fail and must be retried. Clustered DTC is available starting with Windows Server 2019. 

## Resources

**Windows VMs**:

* [Overview of SQL Server on a Windows VM](sql-server-on-azure-vm-iaas-what-is-overview.md)
* [Provision SQL Server on a Windows VM](create-sql-vm-portal.md)
* [Migrating a Database to SQL Server on an Azure VM](migrate-to-vm-from-sql-server.md)
* [High Availability and Disaster Recovery for SQL Server on Azure Virtual Machines](business-continuity-high-availability-disaster-recovery-hadr-overview.md)
* [Performance best practices for SQL Server on Azure Virtual Machines](performance-guidelines-best-practices.md)
* [Application Patterns and Development Strategies for SQL Server on Azure Virtual Machines](application-patterns-development-strategies.md)

**Linux VMs**:

* [Overview of SQL Server on a Linux VM](../linux/sql-server-on-linux-vm-what-is-iaas-overview.md)
* [Provision SQL Server on a Linux VM](../linux/sql-vm-create-portal-quickstart.md)
* [FAQ (Linux)](../linux/frequently-asked-questions-faq.md)
* [SQL Server on Linux documentation](https://docs.microsoft.com/sql/linux/sql-server-linux-overview)
