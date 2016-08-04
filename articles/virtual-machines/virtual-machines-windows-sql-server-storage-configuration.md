<properties
	pageTitle="Storage configuration for SQL Server VMs | Microsoft Azure"
	description="This topic describes how Azure configures storage for SQL Server VMs during provisioning (Resource Manager deployment model). It also explains how you can configure storage for your existing SQL Server VMs."
	services="virtual-machines-windows"
	documentationCenter="na"
	authors="ninarn"
	manager="jhubbard"    
	tags="azure-resource-manager"/>
<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="08/04/2016"
	ms.author="ninarn" />

# Storage configuration for SQL Server VMs

When you configure a SQL Server virtual machine image in Azure, the Portal helps to automate your storage configuration. This includes attaching storage to the VM, making that storage accessible to SQL Server, and configuring it to optimize for your specific performance requirements.

This topic explains how Azure configures storage for your SQL Server VMs both during provisioning and for existing VMs. This configuration is based on the [performance best practices](virtual-machines-windows-sql-performance.md) for Azure VMs running SQL Server.

## Next steps
For other topics related to running SQL Server in Azure VMs, see [SQL Server on Azure Virtual Machines](virtual-machines-windows-sql-server-iaas-overview.md).
