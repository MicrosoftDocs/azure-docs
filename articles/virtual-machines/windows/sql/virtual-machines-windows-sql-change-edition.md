---
title: How to change the SQL Server edition of your SQL Server VM in Azure | Microsoft Docs
description: Learn how to change the edition of your SQL Server VM in Azure. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: jroth
tags: azure-resource-manager
ms.assetid: aa5bf144-37a3-4781-892d-e0e300913d03
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 02/13/2019
ms.author: mathoma
ms.reviewer: jroth

---
# How to change the SQL Server edition of your SQL Server VM in Azure

This article describes how to change both the internal and SKU edition of SQL Server for a SQL Server virtual machine in Azure using the SQL VM resource provider - **Microsoft.SqlVirtualMachine**. 

There are two places where the edition of your SQL Server is specified: 
- **Internal**: This is internal to the SQL Server VM, is determined by the product key, and is specified with the installation process. The internal edition dictates what [features](/sql/sql-server/editions-and-components-of-sql-server-2017) are available within the SQL Server product. Changing the internal edition of SQL Server *does not* modify the SKU of the SQL Server VM. 

- **SKU**: This is external to the VM and dictates the billing SKU of your SQL Server VM, as there are differences in billing between the different editions of SQL Server. Changing the metadata SKU of the SQL Server VM *does not* modify the internal edition of SQL Server. 

The **Internal** edition specification must match the **SKU** specification. If you would like to change the **SKU** edition of your SQL Server VM, you must first change the **internal** edition of your SQL Server. 

## Remarks

 - When changing the SKU edition, you can upgrade or downgrade from any edition, but the SKU must match the internal edition of SQL Server. 
 - If you drop your SQL Server VM resource, you will go back to the hard-coded edition setting of the image. 
 - Adding a SQL Server VM to an availability set requires recreating the VM. As such, any VMs added to an availability set will go back to the default edition SKU type and the edition will need to be modified again. 
 - The ability to change the edition is a feature of the SQL VM resource provider. Deploying a marketplace image through the Azure portal automatically registers a SQL Server VM with the resource provider. However, customers who are self-installing SQL Server will need to manually [register their SQL Server VM](virtual-machines-windows-sql-register-with-rp.md). 

 
## Limitations

 - While it is possible to upgrade from lower internal editions of SQL Server, it is not possible to downgrade fom enterprise or developer to any lower edition, such as standard, or express. 
 - Changing the SKU edition is only supported for virtual machines deployed using the Resource Manager model. VMs deployed using the classic model are not supported. 
 - Changing the SKU edition is only enabled for Public Cloud installations.
 - Changing the SKU edition is supported only on virtual machines that have a single NIC (network interface). On virtual machines that have more than one NIC, you should first remove one of the NICs (by using the Azure portal) before you attempt the procedure. Otherwise, you will run into an error similar to the following: 
   `The virtual machine '\<vmname\>' has more than one NIC associated.` Although you might be able to add the NIC back to the VM after you change the edition, operations done through the SQL configuration blade, like automatic patching and backup, will no longer be considered supported.



## Prerequisites

The use of the SQL VM resource provider requires the SQL IaaS extension. As such, to proceed with utilizing the SQL VM resource provider, you need the following:
- An [Azure subscription](https://azure.microsoft.com/free/).
- [Software assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default). 
- A [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) with the [SQL IaaS extension](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension) installed. 

## Change internal edition

The internal edition of SQL Server is determined by the product key that's entered when SQL Server is installed. Once SQL Server is installed, it's possible to change the edition of SQL Server using the original setup media. **Changing the internal edition of SQL Server will restart the service for SQL Server, as well as any associated services, such as Analysis Services and R Services.** 

To change the internal edition of SQL Server, get your product key ready, and then do the following:

1. Launch Setup.exe from the SQL Server installation media. For marketplace images, this can be found at `C:\SQLServerFull`. 
1. Navigate to **Maintenance** and choose the **Edition Upgrade** option. 

   ![Upgrade edition of SQL Server](media/virtual-machines-windows-sql-change-edition/edition-upgrade.png)

1. Enter the product key associated with your edition of SQL Server. 
1. Select **Next** until you reach the **Ready to upgrade edition** page, and then select **Upgrade**. The setup window may hang for a few minutes while the change is taking effect, and then you will see a **Complete** page confirming that your edition upgrade is complete. 


## Change SKU edition

You can modify the SKU edition of SQL Server using the Azure portal. To do so, do the following:

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Navigate to your SQL Server virtual machine resource. 
1. Under **Settings**, select **Configure** and then select your desired edition of SQL Server from the drop-down under **Edition**. 

   ![Change SKU edition](media/virtual-machines-windows-sql-change-edition/edition-change-in-portal.png)

1. Review the warning that appears, notifying you that you must change the internal SQL Server edition first, and that your SKU edition must match  your internal edition. 
1. Select **Apply** to apply your SKU edition changes. 



## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server on a Windows VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server on a Windows VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server on a Windows VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)


