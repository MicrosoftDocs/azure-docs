---
title: SQL Server licensing in Azure VM | Microsoft Docs
description: Provides best practices for choosing the right SQL Server virtual machine pricing model.
services: virtual-machines-windows
documentationcenter: na
author: luisherring
manager: jhubbard
editor: ''
tags: azure-service-management

ms.assetid: 
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 04/18/2017
ms.author: jroth

---
# SQL Server licensing in Azure VM

This topic provides pricing guidance for SQL Server virtual machines in Azure. There are several options that affect cost, and it is important to pick the right image that balances costs with business requirements.

> [!NOTE]
> The prices used in this page are as of 4/17/17, for the latest pricing refer to [Azure VM pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/sql-server-standard).

## Free-licensed SQL Server editions
If you want to develop, test, or build a proof of concept, then use the free-licensed SQL Server Developer edition. This edition has everything in SQL Server Enterprise edition, thus you can use it to build whatever application you want. It’s just not allowed to run in production.  A SQL Server Developer VM will only charge for the cost of the VM, not for SQL Server licensing.  For example, it costs $0.133/hour to run SQL Developer on a DS1v2 VM (perfectly capable for dev/test). Thus, using the VM for 8 hours for 5 days a week costs $21/month. Just make sure to stop the VM when you don’t need it. You can use the VM auto-shutdown option for this.

If you want to run a lightweight workload in production (<4 cores, <1 GB mem, <10 GB/database), then use the free-licensed SQL Server Express edition. A SQL Express VM will only charge for the cost of the VM, not SQL licensing. For example, running SQL Express on a DS1v2 VM (good enough for lightweight workloads) continuously costs $96/month. 

We have images for both [SQL Server Developer](https://ms.portal.azure.com/#create/Microsoft.FreeLicenseSQLServer2016SP1DeveloperWindowsServer2016-ARM) and [SQL Server Express](https://ms.portal.azure.com/#create/Microsoft.FreeLicenseSQLServer2016SP1ExpressWindowsServer2016-ARM) in the Azure Marketplace.

## Paid SQL Server editions
If you’ll run a non-lightweight production workload, then you have two options to pay for SQL Server licensing: **pay per usage** or **bring your own license**.

**Paying the SQL license per usage** means that the per-minute cost of running the Azure VM includes the cost of the SQL Server license. You can see the pricing for the different SQL Server editions (Web, Standard, Enterprise) in the [Azure VM pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/sql-server-standard). The cost is the same for all versions of SQL Server (2008 R2 to 2016). As with SQL Server licensing in general, the per-minute licensing cost depends on the number of VM cores. For example, it costs $0.32/hour to run SQL Web (for small web sites) on a 4-core VM, $0.40/hour to run SQL Standard (for small to medium workloads), and $1.50/hour to run SQL Enterprise (for large or mission-critical workloads).

Paying the SQL licensing per usage is recommended for:

- Temporary or periodic workloads. For example, an app that needs to support an event for a couple of months every year, or business analysis on Mondays
- Workloads with unknown lifetime or scale. For example, an app that may not be required in a few months, or which may require more, or less compute power, depending on demand

We have images to pay the SQL licensing per usage for [SQL Server Web](https://ms.portal.azure.com/#create/Microsoft.SQLServer2016SP1WebWindowsServer2016), [SQL Server Standard](https://ms.portal.azure.com/#create/Microsoft.SQLServer2016SP1StandardWindowsServer2016), and [SQL Server Enterprise](https://ms.portal.azure.com/#create/Microsoft.SQLServer2016SP1EnterpriseWindowsServer2016) in the Azure Marketplace.

**Bringing your own SQL Server license through License Mobility**, also referred to as **BYOL**, means using an existing SQL Server Volume License with Software Assurance in an Azure VM. A SQL Server VM using BYOL will only charge for the cost of running the VM, not for SQL Server licensing, given that you have already acquired licenses and Software Assurance through a Volume Licensing program.
Bringing your own SQL licensing through License Mobility is recommended for:

- Continuous workloads. For example, an app that needs to support business operations 24x7
- Workloads with known lifetime and scale. For example, an app that will be required for the whole year and which demand has been forecasted.

To use BYOL with a SQL Server VM, you must have  a license for SQL Server Standard or Enterprise and [Software Assurance](https://www.microsoft.com/en-us/licensing/licensing-programs/software-assurance-default.aspx#tab=1), which is a required option through some [Volume Licensing](https://www.microsoft.com/en-us/download/details.aspx?id=10585) programs and an optional purchase with others.  The pricing levels provided through Volume Licensing programs varies, based on the type of agreement and the quantity and or commitment to SQL Server , but as a rule of thumb:

Bringing your own SQL Server license is more cost effective than paying it per usage if a workload will run continuously SQL Server Standard or Enterprise for more than 10 months.

In average, it’s 30% cheaper per year to buy or renew a SQL Server license for the first 3 years. Furthermore, after 3 years, you don’t need to renew the license anymore, just pay for Software Assurance. At that point, it’s 200% cheaper!

Another fantastic benefit of bringing your own license is the [free licensing for one passive secondary replica](https://azure.microsoft.com/en-us/pricing/licensing-faq/) per SQL Server for high availability purposes. This cuts in half the licensing cost of a highly available SQL Server deployment (e.g. using AlwaysOn Availability Groups).  The rights to run the passive secondary are provided through the Fail-Over Servers Software Assurance benefit.

We have BYOL images (prefixed "{BYOL}") for [SQL Server Enterprise](https://ms.portal.azure.com/#create/Microsoft.BYOLSQLServer2016SP1EnterpriseWindowsServer2016) and [SQL Server Standard](https://ms.portal.azure.com/#create/Microsoft.BYOLSQLServer2016SP1StandardWindowsServer2016) in the Azure Marketplace to make it easy for you to use your licenses. No need to do anything special, we simply ask you to please let us know within 10 days how many SQL Server licenses you’ll use in Azure.

## Next steps

Review other SQL Server Virtual Machine topics at [SQL Server on Azure Virtual Machines Overview](virtual-machines-windows-sql-server-iaas-overview.md).
