---
title: SQL Server IaaS Agent extension for Linux
description: This article describes how the SQL Server IaaS Agent extension helps automate management specific administration tasks of SQL Server on Linux Azure VMs. 
services: virtual-machines-windows
documentationcenter: ''
author: adbadram
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.subservice: management
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 10/26/2021 
ms.author: adbadram
ms.reviewer: mathoma
---
# SQL Server IaaS Agent extension for Linux
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!div class="op_single_selector"]
> * [Windows](../windows/sql-server-iaas-agent-extension-automate-management.md)
> * [Linux](sql-server-iaas-agent-extension-linux.md)

The SQL Server IaaS Agent extension (SqlIaasExtension) runs on SQL Server on Linux Azure Virtual Machines (VMs) to automate management and administration tasks. 

This article provides an overview of the extension. See [Register with the extension](sql-iaas-agent-extension-register-vm-linux.md) to learn more. 


## Overview

The SQL Server IaaS Agent extension enables integration with the Azure portal and unlocks the following benefits for SQL Server on Linux Azure VMs: 

- **Compliance**: The extension offers a simplified method to fulfill the requirement of notifying Microsoft that the Azure Hybrid Benefit has been enabled as is specified in the product terms. This process negates needing to manage licensing registration forms for each resource.  

- **Simplified license management**: The extension simplifies SQL Server license management, and allows you to quickly identify SQL Server VMs with the Azure Hybrid Benefit enabled using the Azure portal, Azure PowerShell or the Azure CLI: 

   # [PowerShell](#tab/azure-powershell)

   ```powershell-interactive
   Get-AzSqlVM | Where-Object {$_.LicenseType -eq 'AHUB'}
   ```

   # [Azure CLI](#tab/azure-cli)

   ```azurecli-interactive
   $ az sql vm list --query "[?sqlServerLicenseType=='AHUB']"
   ```
   ---

- **Free**: There is no additional cost associated with the extension. 



## Installation

[Register](sql-iaas-agent-extension-register-vm-linux.md) your SQL Server VM with the SQL Server IaaS Agent extension to create the **SQL virtual machine** _resource_ within your subscription, which is a _separate_ resource from the virtual machine resource. Unregistering your SQL Server VM from the extension will remove the **SQL virtual machine** _resource_ from your subscription but will not drop the actual virtual machine.

The SQL Server IaaS Agent extension for Linux is currently only available in lightweight mode. 


## Verify extension status

Use the Azure portal or Azure PowerShell to check the status of the extension. 

### Azure portal

Verify the extension is installed by using the Azure portal. 

Go to your **Virtual machine** resource in the Azure portal (not the *SQL virtual machines* resource, but the resource for your VM). Select **Extensions** under **Settings**. You should see the **SqlIaasExtension** extension listed, as in the following example: 

![Check the Status of the SQL Server IaaS Agent extension SqlIaaSExtension in the Azure portal](../windows/media/sql-server-iaas-agent-extension-automate-management/azure-rm-sql-server-iaas-agent-portal.png)




### Azure PowerShell

You can also use the **Get-AzVMSqlServerExtension** Azure PowerShell cmdlet:

```powershell-interactive
  Get-AzVMSqlServerExtension -VMName "vmname" -ResourceGroupName "resourcegroupname"
```

The previous command confirms that the agent is installed and provides general status information. You can get specific status information about automated backup and patching by using the following commands:

```powershell-interactive
 $sqlext = Get-AzVMSqlServerExtension -VMName "vmname" -ResourceGroupName "resourcegroupname"
 $sqlext.AutoPatchingSettings
 $sqlext.AutoBackupSettings
```

## Limitations

The Linux SQL IaaS Agent extension has the following limitations: 

- Only SQL Server VMs running on the Ubuntu Linux operating system are supported. Other Linux distributions are not currently supported.
- SQL Server VMs running Ubuntu Linux Pro are not supported.
- SQL Server VMs running on generalized images are not supported.
- Only SQL Server VMs deployed through the Azure Resource Manager are supported. SQL Server VMs deployed through the classic model are not supported. 
- SQL Server with only a single instance. Multiple instances are not supported. 

## <a id="in-region-data-residency"></a> Privacy statement

When using SQL Server on Azure VMs and the SQL IaaS extension, consider the following privacy statements: 

- **Data collection**:  The SQL IaaS Agent extension collects data for the express purpose of giving customers optional benefits when using SQL Server on Azure Virtual Machines. Microsoft **will not use this data for licensing audits** without the customer's advance consent. See the [SQL Server privacy supplement](/sql/sql-server/sql-server-privacy#non-personal-data) for more information.

- **In-region data residency**: SQL Server on Azure VMs and SQL IaaS Agent Extension do not move or store customer data out of the region in which the VMs are deployed. 


## Next steps

For more information about running SQL Server on Azure Virtual Machines, see the [What is SQL Server on Azure Linux Virtual Machines?](sql-server-on-linux-vm-what-is-iaas-overview.md).

To learn more, see [frequently asked questions](frequently-asked-questions-faq.yml).
