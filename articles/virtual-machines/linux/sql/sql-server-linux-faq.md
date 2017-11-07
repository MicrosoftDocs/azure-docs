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
ms.date: 10/05/2017
ms.author: jroth
---
# Frequently asked questions for SQL Server on Linux Azure Virtual Machines

> [!div class="op_single_selector"]
> * [Windows](../../windows/sql/virtual-machines-windows-sql-server-iaas-faq.md)
> * [Linux](sql-server-linux-faq.md)

This topic provides answers to some of the most common questions about running [SQL Server on Linux Azure Virtual Machines](sql-server-linux-virtual-machines-overview.md).

> [!NOTE]
> This topic focuses on issues specific to SQL Server on Linux VMs. If you are running SQL Server on Windows VMs, see the [Windows FAQ](../../windows/sql/virtual-machines-windows-sql-server-iaas-faq.md).

[!INCLUDE [support-disclaimer](../../../../includes/support-disclaimer.md)]

## Frequently Asked Questions

1. **How do I create a Linux Azure virtual machine with SQL Server?**

   The easiest solution is to create a Linux Virtual Machine that includes SQL Server. For a tutorial on signing up for Azure and creating a SQL VM from the portal, see [Provision a Linux SQL Server virtual machine in the Azure portal](provision-sql-server-linux-virtual-machine.md). You also have the option of manually installing SQL Server on a VM with either a freely licensed edition (Developer or Express) or by reusing an on-premises license. If you bring your own license, you must have [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility).

1. **How do I upgrade to a new version/edition of the SQL Server in an Azure VM?**

   Currently, there is no in-place upgrade for SQL Server running in an Azure VM. Create a new Azure virtual machine with the desired SQL Server version/edition, and then migrate your databases to the new server using [standard data migration techniques](https://docs.microsoft.com/sql/linux/sql-server-linux-migrate-overview).

1. **How can I install my licensed copy of SQL Server on an Azure VM?**

   First, create a Linux OS-only virtual machine. Then run the [SQL Server installation steps](https://docs.microsoft.com/sql/linux/sql-server-linux-setup#platforms) for your Linux distribution. Unless you are installing one of the freely licensed editions of SQL Server, you must also have a SQL Server license and [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/).

1. **Are there Bring-Your-Own-License (BYOL) Linux virtual machine images for SQL Server?**

   At this time, there are no BYOL Linux virtual machine images for SQL Server. However, you can manually install SQL Server on a Linux-only VM as discussed in the previous questions.

1. **Can I change a VM to use my own SQL Server license if it was created from one of the pay-as-you-go gallery images?**

   No. You cannot switch from pay-per-minute licensing to using your own license. You must create a new Linux VM, install SQL Server, and migrate your data. See the previous question for more details about bringing your own license.

1. **What related SQL Server packages are also installed?**

   To see the SQL Server packages that are installed by default on SQL Server Linux VMs, see [Installed packages](sql-server-linux-virtual-machines-overview.md#packages).

1. **Are SQL Server High Availability solutions supported on Azure VMs?**

   Not at this time. Always On Availability Groups and Failover Clustering both require a clustering solution in Linux, such as Pacemaker. The supported Linux distributions for SQL Server do not support their high availability add-ons in the Cloud.

1. **Why can’t I provision an RHEL or SLES SQL Server VM with an Azure subscription that has a spending limit?**

   RHEL and SLES virtual machines require a subscription with no spending limit and a verified payment method (usually a credit card) associated with the subscription. If you provision an RHEL or SLES VM without removing the spending limit, your subscription will get disabled and all VMs/services stopped. If you do run into this state, to re-enable the subscription [remove the spending limit](https://account.windowsazure.com/subscriptions). Your remaining credits will be restored for the current billing cycle but an RHEL or SLES VM image surcharge will go against your credit card if you choose to re-start and continue running it.

## Resources

**Linux VMs**:

* [Overview of SQL Server on a Linux VM](sql-server-linux-virtual-machines-overview.md)
* [Provision a SQL Server Linux VM](provision-sql-server-linux-virtual-machine.md)
* [SQL Server on Linux documentation](https://docs.microsoft.com/sql/linux/sql-server-linux-overview)

**Windows VMs**:

* [Overview of SQL Server on a Windows VM](../../windows/sql/virtual-machines-windows-sql-server-iaas-overview.md)
* [Provision a SQL Server Windows VM](../../windows/sql/virtual-machines-windows-portal-sql-server-provision.md)
* [FAQ (Windows)](../../windows/sql/virtual-machines-windows-sql-server-iaas-faq.md)