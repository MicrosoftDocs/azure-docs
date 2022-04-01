---
title: Overview of SQL Server on Azure Windows Virtual Machines
description: Learn how to run full editions of SQL Server on Azure Virtual Machines in the cloud without having to manage any on-premises hardware.
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
tags: azure-service-management
ms.assetid: c505089e-6bbf-4d14-af0e-dd39a1872767
ms.service: virtual-machines-sql
ms.subservice: service-overview
ms.topic: overview
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/10/2022
ms.author: mathoma
---
# What is SQL Server on Windows Azure Virtual Machines?
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!div class="op_single_selector"]
> * [Windows](sql-server-on-azure-vm-iaas-what-is-overview.md)
> * [Linux](../linux/sql-server-on-linux-vm-what-is-iaas-overview.md)

This article provides an overview of SQL Server on Azure Virtual Machines (VMs) on the Windows platform. 

If you're new to SQL Server on Azure VMs, check out the *SQL Server on Azure VM Overview* video from our in-depth [Azure SQL video series](/shows/Azure-SQL-for-Beginners?WT.mc_id=azuresql4beg_azuresql-ch9-niner):
> [!VIDEO https://docs.microsoft.com/shows/Azure-SQL-for-Beginners/SQL-Server-on-Azure-VM-Overview-4-of-61/player]


## Overview

[SQL Server on Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/) enables you to use full versions of SQL Server in the cloud without having to manage any on-premises hardware. SQL Server virtual machines (VMs) also simplify licensing costs when you pay as you go.

Azure virtual machines run in many different [geographic regions](https://azure.microsoft.com/regions/) around the world. They also offer a variety of [machine sizes](../../../virtual-machines/sizes.md). The virtual machine image gallery allows you to create a SQL Server VM with the right version, edition, and operating system. This makes virtual machines a good option for many different SQL Server workloads.


## Feature benefits

When you register your SQL Server on Azure VM with the [SQL IaaS agent extension](sql-server-iaas-agent-extension-automate-management.md) you unlock a number of feature benefits. You can register your SQL Server VM in lightweight management mode, which unlocks a few of the benefits, or in full management mode, which unlocks all available benefits. Registering with the extension is completely free. 

The following table details the benefits unlocked by the extension: 

[!INCLUDE [SQL VM feature benefits](../../includes/sql-vm-feature-benefits.md)]


## Getting started

To get started with SQL Server on Azure VMs, review the following resources:

- **Create SQL VM**: To create your SQL Server on Azure VM, review the Quickstarts using the [Azure portal](sql-vm-create-portal-quickstart.md), [Azure PowerShell](sql-vm-create-powershell-quickstart.md) or an [ARM template](create-sql-vm-resource-manager-template.md). For more thorough guidance, review the [Provisioning guide](create-sql-vm-portal.md). 
- **Connect to SQL VM**: To connect to your SQL Server on Azure VMs, review the [ways to connect](ways-to-connect-to-sql.md). 
- **Migrate data**: Migrate your data to SQL Server on Azure VMs from [SQL Server](../../migration-guides/virtual-machines/sql-server-to-sql-on-azure-vm-migration-overview.md), [Oracle](../../migration-guides/virtual-machines/oracle-to-sql-on-azure-vm-guide.md), or [Db2](../../migration-guides/virtual-machines/db2-to-sql-on-azure-vm-guide.md). 
- **Storage configuration**: For information about configuring storage for your SQL Server on Azure VMs, review [Storage configuration](storage-configuration.md). 
- **Performance**: Fine-tune the performance of your SQL Server on Azure VM by reviewing the [Performance best practices checklist](performance-guidelines-best-practices-checklist.md).
- **Pricing**: For information about the pricing structure of your SQL Server on Azure VM, review the [Pricing guidance](pricing-guidance.md).
- **Frequently asked questions**: For commonly asked questions, and scenarios, review the [FAQ](frequently-asked-questions-faq.yml).

## High availability & disaster recovery

On top of the built-in [high availability provided by Azure virtual machines](../../../virtual-machines/availability.md), you can also leverage the high availability and disaster recovery features provided by SQL Server. 

To learn more, see the overview of [Always On availability groups](availability-group-overview.md), and [Always On failover cluster instances](failover-cluster-instance-overview.md). For more details, see the [business continuity overview](business-continuity-high-availability-disaster-recovery-hadr-overview.md). 

To get started, see the tutorials for [availability groups](availability-group-manually-configure-prerequisites-tutorial-multi-subnet.md) or [preparing your VM for a failover cluster instance](failover-cluster-instance-prepare-vm.md). 

## Licensing

To get started, choose a SQL Server virtual machine image with your required version, edition, and operating system. The following sections provide direct links to the Azure portal for the SQL Server virtual machine gallery images.

Azure only maintains one virtual machine image for each supported operating system, version, and edition combination. This means that over time images are refreshed, and older images are removed. For more information, see the **Images** section of the [SQL Server VMs FAQ](./frequently-asked-questions-faq.yml).

> [!TIP]
> For more information about how to understand pricing for SQL Server images, see [Pricing guidance for SQL Server on Azure Virtual Machines](pricing-guidance.md). 

### <a id="payasyougo"></a> Pay as you go

The following table provides a matrix of pay-as-you-go SQL Server images.

| Version | Operating system | Edition |
| --- | --- | --- |
| **SQL Server 2019** | Windows Server 2019 | [Enterprise](https://portal.azure.com/#create/microsoftsqlserver.sql2019-ws2019enterprise), [Standard](https://portal.azure.com/#create/microsoftsqlserver.sql2019-ws2019standard), [Web](https://portal.azure.com/#create/microsoftsqlserver.sql2019-ws2019web), [Developer](https://portal.azure.com/#create/microsoftsqlserver.sql2019-ws2019sqldev) | 
| **SQL Server 2017** |Windows Server 2016 |[Enterprise](https://portal.azure.com/#create/Microsoft.SQLServer2017EnterpriseWindowsServer2016), [Standard](https://portal.azure.com/#create/Microsoft.SQLServer2017StandardonWindowsServer2016), [Web](https://portal.azure.com/#create/Microsoft.SQLServer2017WebonWindowsServer2016), [Express](https://portal.azure.com/#create/Microsoft.FreeSQLServerLicenseSQLServer2017ExpressonWindowsServer2016), [Developer](https://portal.azure.com/#create/Microsoft.FreeSQLServerLicenseSQLServer2017DeveloperonWindowsServer2016) |
| **SQL Server 2016 SP2** |Windows Server 2016 |[Enterprise](https://portal.azure.com/#create/Microsoft.SQLServer2016SP2EnterpriseWindowsServer2016), [Standard](https://portal.azure.com/#create/Microsoft.SQLServer2016SP2StandardWindowsServer2016), [Web](https://portal.azure.com/#create/Microsoft.SQLServer2016SP2WebWindowsServer2016), [Express](https://portal.azure.com/#create/Microsoft.FreeLicenseSQLServer2016SP2ExpressWindowsServer2016), [Developer](https://portal.azure.com/#create/Microsoft.FreeLicenseSQLServer2016SP2DeveloperWindowsServer2016) |
| **SQL Server 2014 SP2** |Windows Server 2012 R2 |[Enterprise](https://portal.azure.com/#create/Microsoft.SQLServer2014SP2EnterpriseWindowsServer2012R2), [Standard](https://portal.azure.com/#create/Microsoft.SQLServer2014SP2StandardWindowsServer2012R2), [Web](https://portal.azure.com/#create/Microsoft.SQLServer2014SP2WebWindowsServer2012R2), [Express](https://portal.azure.com/#create/Microsoft.SQLServer2014SP2ExpressWindowsServer2012R2) |
| **SQL Server 2012 SP4** |Windows Server 2012 R2 |[Enterprise](https://portal.azure.com/#create/Microsoft.SQLServer2012SP4EnterpriseWindowsServer2012R2), [Standard](https://portal.azure.com/#create/Microsoft.SQLServer2012SP4StandardWindowsServer2012R2), [Web](https://portal.azure.com/#create/Microsoft.SQLServer2012SP4WebWindowsServer2012R2), [Express](https://portal.azure.com/#create/Microsoft.SQLServer2012SP4ExpressWindowsServer2012R2) |
| **SQL Server 2008 R2 SP3** |Windows Server 2008 R2|[Enterprise](https://portal.azure.com/#create/Microsoft.SQLServer2008R2SP3EnterpriseWindowsServer2008R2), [Standard](https://portal.azure.com/#create/Microsoft.SQLServer2008R2SP3StandardWindowsServer2008R2), [Web](https://portal.azure.com/#create/Microsoft.SQLServer2008R2SP3WebWindowsServer2008R2), [Express](https://portal.azure.com/#create/Microsoft.SQLServer2008R2SP3ExpressWindowsServer2008R2) |

To see the available SQL Server on Linux virtual machine images, see [Overview of SQL Server on Azure Virtual Machines (Linux)](../linux/sql-server-on-linux-vm-what-is-iaas-overview.md).

> [!NOTE]
> Change the licensing model of a pay-per-usage SQL Server VM to use your own license. For more information, see [How to change the licensing model for a SQL Server VM](licensing-model-azure-hybrid-benefit-ahb-change.md). 

### <a id="BYOL"></a> Bring your own license

You can also bring your own license (BYOL). In this scenario, you only pay for the VM without any additional charges for SQL Server licensing.  Bringing your own license can save you money over time for continuous production workloads. For requirements to use this option, see [Pricing guidance for SQL Server Azure VMs](pricing-guidance.md#byol).

To bring your own license, you can either convert an existing pay-per-usage SQL Server VM, or you can deploy an image with the prefixed **{BYOL}**. For more information about switching your licensing model between pay-per-usage and BYOL, see [How to change the licensing model for a SQL Server VM](licensing-model-azure-hybrid-benefit-ahb-change.md). 

| Version | Operating system | Edition |
| --- | --- | --- |
| **SQL Server 2019** | Windows Server 2019 | [Enterprise BYOL](https://portal.azure.com/#create/microsoftsqlserver.sql2019-ws2019-byolenterprise), [Standard  BYOL](https://portal.azure.com/#create/microsoftsqlserver.sql2019-ws2019-byolstandard)| 
| **SQL Server 2017** |Windows Server 2016 |[Enterprise BYOL](https://portal.azure.com/#create/Microsoft.BYOLSQLServer2017EnterpriseWindowsServer2016), [Standard BYOL](https://portal.azure.com/#create/Microsoft.BYOLSQLServer2017StandardonWindowsServer2016) |
| **SQL Server 2016 SP2** |Windows Server 2016 |[Enterprise BYOL](https://portal.azure.com/#create/Microsoft.BYOLSQLServer2016SP2EnterpriseWindowsServer2016), [Standard BYOL](https://portal.azure.com/#create/Microsoft.BYOLSQLServer2016SP2StandardWindowsServer2016) |
| **SQL Server 2014 SP2** |Windows Server 2012 R2 |[Enterprise BYOL](https://portal.azure.com/#create/Microsoft.BYOLSQLServer2014SP2EnterpriseWindowsServer2012R2), [Standard BYOL](https://portal.azure.com/#create/Microsoft.BYOLSQLServer2014SP2StandardWindowsServer2012R2) |
| **SQL Server 2012 SP4** |Windows Server 2012 R2 |[Enterprise BYOL](https://portal.azure.com/#create/Microsoft.BYOLSQLServer2012SP4EnterpriseWindowsServer2012R2), [Standard  BYOL](https://portal.azure.com/#create/Microsoft.BYOLSQLServer2012SP4StandardWindowsServer2012R2) |

It is possible to deploy an older image of SQL Server that is not available in the Azure portal using PowerShell. To view all available images using PowerShell, use the following command:

  ```powershell
  Get-AzVMImageOffer -Location $Location -Publisher 'MicrosoftSQLServer'
  ```

For more information about deploying SQL Server VMs using PowerShell, view [How to provision SQL Server virtual machines with Azure PowerShell](create-sql-vm-powershell.md).



## Customer experience improvement program (CEIP)

The Customer Experience Improvement Program (CEIP) is enabled by default. This periodically sends reports to Microsoft to help improve SQL Server. There is no management task required with CEIP unless you want to disable it after provisioning. You can customize or disable the CEIP by connecting to the VM with remote desktop. Then run the **SQL Server Error and Usage Reporting** utility. Follow the instructions to disable reporting. For more information about data collection, see the [SQL Server Privacy Statement](/sql/sql-server/sql-server-privacy).

## Related products and services

Since SQL Server on Azure VMs is integrated into the Azure platform, review resources from related products and services that interact with the SQL Server on Azure VM ecosystem: 

- **Windows virtual machines**: [Azure Virtual Machines overview](../../../virtual-machines/windows/overview.md)
- **Storage**: [Introduction to Microsoft Azure Storage](../../../storage/common/storage-introduction.md)
- **Networking**: [Virtual Network overview](../../../virtual-network/virtual-networks-overview.md), [IP addresses in Azure](../../../virtual-network/ip-services/public-ip-addresses.md), [Create a Fully Qualified Domain Name in the Azure portal](../../../virtual-machines/create-fqdn.md)
- **SQL**: [SQL Server documentation](/sql/index), [Azure SQL Database comparison](../../azure-sql-iaas-vs-paas-what-is-overview.md)


## Next steps

Get started with SQL Server on Azure Virtual Machines:

* [Create a SQL Server VM in the Azure portal](sql-vm-create-portal-quickstart.md)

Get answers to commonly asked questions about SQL Server VMs:

* [SQL Server on Azure Virtual Machines FAQ](frequently-asked-questions-faq.yml)

View Reference Architectures for running N-tier applications on SQL Server in IaaS

* [Windows N-tier application on Azure with SQL Server](/azure/architecture/reference-architectures/n-tier/n-tier-sql-server)
* [Run an N-tier application in multiple Azure regions for high availability](/azure/architecture/reference-architectures/n-tier/multi-region-sql-server)
