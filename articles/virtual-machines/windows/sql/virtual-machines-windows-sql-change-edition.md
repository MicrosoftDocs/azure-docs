---
title: How to change the SQL Server edition of your SQL Server VM in Azure | Microsoft Docs
description: Learn how to change the edition of your SQL Server VM in Azure. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: jroth
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/26/2019
ms.author: mathoma
ms.reviewer: jroth

---
# How to change the SQL Server edition of your SQL Server VM in Azure

This article describes how to change the edition of SQL Server for an existing Windows SQL Server virtual machine in Azure. To change the edition, you run setup with the installation media on the SQL Server virtual machine and then configure settings in the Azure portal.


There are two places where the edition of your SQL Server is specified:

- **Internal edition**: This is internal to the SQL Server VM, is determined by the product key, and is specified with the installation process. The internal edition dictates what [features](/sql/sql-server/editions-and-components-of-sql-server-2017) are available within the SQL Server product. Changing the internal edition of SQL Server *does not* modify the edition metadata that Azure tracks for billing purposes. 

- **Edition metadata**: This is external to the VM and dictates the billing SKU of your SQL Server VM, as there are differences in billing between the different editions of SQL Server. Changing the edition metadata of the SQL Server VM *does not* modify the internal edition of SQL Server.

The **internal** edition specification must match the **metadata** specification. If you would like to change the edition metadata of your SQL Server VM, you must first change the **internal** edition of your SQL Server.

## Remarks

 - When changing the edition metadata, you can upgrade or downgrade from any edition, but the edition metadata must match the internal edition of SQL Server.
 - If you drop your SQL Server VM resource, you will go back to the hard-coded edition setting of the image.
 - Adding a SQL Server VM to an availability set requires recreating the VM. As such, any VMs added to an availability set will go back to the default edition metadata and the edition will need to be modified again.
 - The ability to change the edition is a feature of the SQL VM resource provider. Deploying a marketplace image through the Azure portal automatically registers a SQL Server VM with the resource provider. However, customers who are self-installing SQL Server will need to manually [register their SQL Server VM](virtual-machines-windows-sql-register-with-rp.md).

 
## Limitations

 - While it is possible to upgrade from lower internal editions of SQL Server, it is not possible to downgrade from enterprise or developer to any lower edition, such as standard, or express. 
 - Changing the edition metadata is only supported for virtual machines deployed using the Resource Manager model. VMs deployed using the classic model are not supported. 
 - Changing the edition metadata is only enabled for Public Cloud installations.
 - Changing the edition metadata is supported only on virtual machines that have a single NIC (network interface). On virtual machines that have more than one NIC, you should first remove one of the NICs (by using the Azure portal) before you attempt the procedure. Otherwise, you will run into an error similar to the following: 
   `The virtual machine '\<vmname\>' has more than one NIC associated.` Although you might be able to add the NIC back to the VM after you change the edition, operations done through the SQL configuration page in the Azure portal, like automatic patching and backup, will no longer be considered supported.

## Prerequisites

To change the edition of SQL Server, you will need the following: 

- An [Azure subscription](https://azure.microsoft.com/free/).
- [Software assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default). 
- A Windows [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) registered with the [SQL VM resource provider](virtual-machines-windows-sql-register-with-rp.md).

## Obtain installation media  

The internal edition of SQL Server is determined by the setup media used to install SQL Server. After SQL Server is installed, it's possible to upgrade the edition of SQL Server by using the setup media from a different edition of SQL Server.

### Software assurance customers

Customers who have software assurance can obtain their installation media from the [Volume Licensing Center](https://www.microsoft.com/Licensing/servicecenter/default.aspx). 

### Customers without software assurance 

Customers who do not have software assurance can use the setup media from a marketplace SQL Server VM image that has their desired edition. The following steps explain how to do this:

1. Either using an existing SQL Server VM, or deploy a SQL Server VM from the Azure marketplace that has the desired edition of SQL Server. 
1. RDP into this new SQL Server VM and navigate to where the SQL Server setup media is: `C:\SQLServerFull`. 
1. Compress the entire folder by right-clicking the `SQLServerFull` folder, selecting **Send to** and choosing **Compressed (zipped) folder**. 
1. After compression completes, RDP into the SQL Server VM where you plan to upgrade the edition. 
1. Copy (ctrl + c) the compressed installation media `SQLServerFull.zip` from the source SQL Server VM and paste it (ctrl + v) to the target SQL Server VM you are planning to upgrade. 
1. Uncompress the file by right-clicking `SQLServerFull.zip` and choosing to **Extract All...**. Select your destination folder and this will extract the setup media for the desired edition of SQL Server onto the VM you are planning to upgrade. 
 

## Change internal edition

  > [!WARNING]
  > **Changing the internal edition of SQL Server will restart the service for SQL Server, as well as any associated services, such as Analysis Services and R Services.** 

To change the internal edition of SQL Server, [obtain the SQL Server setup media](#obtain-installation-media) for the desired edition of SQL Server, and then do the following:

1. Launch Setup.exe from the SQL Server installation media. 
1. Navigate to **Maintenance** and choose the **Edition Upgrade** option. 

   ![Upgrade edition of SQL Server](media/virtual-machines-windows-sql-change-edition/edition-upgrade.png)

1. Select **Next** until you reach the **Ready to upgrade edition** page, and then select **Upgrade**. The setup window may hang for a few minutes while the change is taking effect, and then you will see a **Complete** page confirming that your edition upgrade is complete. 


## Change edition metadata

You can modify the edition metadata of SQL Server using the Azure portal. To do so, do the following:

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Navigate to your SQL Server virtual machine resource. 
1. Under **Settings**, select **Configure** and then select your desired edition of SQL Server from the drop-down under **Edition**. 

   ![Change edition metadata](media/virtual-machines-windows-sql-change-edition/edition-change-in-portal.png)

1. Review the warning that appears, notifying you that you must change the internal SQL Server edition first, and that your edition metadata must match  your internal edition. 
1. Select **Apply** to apply your edition metadata changes. 

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server on a Windows VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server on a Windows VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server on a Windows VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)


