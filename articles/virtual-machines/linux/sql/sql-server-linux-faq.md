---
title: SQL Server on Linux Azure Virtual Machines FAQ | Microsoft Docs
description: This article provides answers to frequently asked questions about running SQL Server on Linux Azure VMs.
services: virtual-machines-linux
documentationcenter: ''
author: rothja
manager: jhubbard
tags: azure-service-management
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: troubleshooting
ms.workload: iaas-sql-server
ms.date: 10/03/2017
ms.author: jroth
---
# Frequently asked questions for SQL Server on Linux Azure Virtual Machines

> [!div class="op_single_selector"]
> * [Windows](../../windows/sql/virtual-machines-windows-sql-server-iaas-faq.md)
> * [Linux](sql-server-linux-faq.md)

This topic provides answers to some of the most common questions about running [SQL Server on Linux Azure Virtual Machines](sql-server-linux-virtual-machines-overview.md).

> [!NOTE]
> This topic focusses on issues specific to SQL Server on Linux VMs. If you are running SQL Server on Windows VMs, see the [Windows FAQ](../../windows/sql/virtual-machines-windows-sql-server-iaas-faq.md).

If your Azure issue is not addressed in this article, visit the Azure forums on [MSDN and Stack Overflow](https://azure.microsoft.com/support/forums). You can post your issue in these forums, or post to [@AzureSupport on Twitter](https://twitter.com/AzureSupport). You also can submit an Azure support request. To submit a support request, on the [Azure support](https://azure.microsoft.com/support/options) page, select Get support.

## Frequently Asked Questions

1. **How do I create an Linux Azure virtual machine with SQL Server?**

   The easiest solution is to create a Linux Virtual Machine that includes SQL Server. For a tutorial on signing up for Azure and creating a SQL VM from the portal, see [Provision a Linux SQL Server virtual machine in the Azure portal](provision-sql-server-linux-virtual-machine.md). You also have the option of manually installing SQL Server on a VM with either a freely licensed edition (Developer or Express) or by reusing an on-premises license. If you bring your own license, you must have [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility).

1. **How do I upgrade to a new version/edition of the SQL Server in an Azure VM?**

   Currently, there is no in-place upgrade for SQL Server running in an Azure VM. Create a new Azure virtual machine with the desired SQL Server version/edition, and then migrate your databases to the new server using [standard data migration techniques](https://docs.microsoft.com/sql/linux/sql-server-linux-migrate-overview).

1. **How can I install my licensed copy of SQL Server on an Azure VM?**

   There are two ways to do this. You can provision one of the virtual machine images that supports licenses. Another option is to copy the SQL Server installation media to a Windows Server VM, and then install SQL Server on the VM. For licensing reasons, you must have [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/).

1. **Can I change a VM to use my own SQL Server license if it was created from one of the pay-as-you-go gallery images?**

   No. You can not switch from pay-per-minute licensing to using your own license. You must create a new Linux VM, install SQL Server, and migrate your data. See the previous question for more details about bringing your own license.

1. **Are there Bring-Your-Own-License (BYOL) Linux virtual machine images for SQL Server?**

   At this time, there are no BYOL Linux virtual machine images for SQL Server. However, you can manually install SQL Server on a Linux-only VM as discussed in the previous questions.

1. **What related SQL Server packages are also installed?**

   To see the SQL Server packages that are installed by default on SQL Server Linux VMs, see [Installed packages](sql-server-linux-virtual-machines-overview.md#packages).

1. **Are SQL Server High Availability solutions supported on Azure VMs?**

   Not at this time. Always On Availability Groups and Failover Clustering both require a clustering solution in Linux, such as Pacemaker. The supported Linux distributions for SQL Server do not support their high availability add-ons in the Cloud.

## Resources

[Overview of SQL Server on a Linux VM](sql-server-linux-virtual-machines-overview.md)
[Provision a SQL Server Linux VM](provision-sql-server-linux-virtual-machine.md)
[SQL Server on Linux documentation](https://docs.microsoft.com/sql/linux/sql-server-linux-overview)
