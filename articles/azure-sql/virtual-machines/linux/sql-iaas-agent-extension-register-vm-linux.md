---
title: Register with SQL IaaS Agent extension (Linux)
description: Learn how to register your SQL Server on Linux Azure VM with the SQL IaaS Agent extension to enable Azure features, as well as for compliance, and improved manageability.
services: virtual-machines-windows
documentationcenter: na
author: adbadram
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.subservice: management
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: vm-Linux-sql-server
ms.workload: iaas-sql-server
ms.date: 10/26/2021
ms.author: adbadram
ms.reviewer: mathoma 
ms.custom: devx-track-azurecli, devx-track-azurepowershell, contperf-fy21q2

---
# Register Linux SQL Server VM with SQL IaaS Agent extension 
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!div class="op_single_selector"]
> * [Windows](../windows/sql-agent-extension-manually-register-single-vm.md)
> * [Linux](sql-iaas-agent-extension-register-vm-linux.md)


Register your SQL Server VM with the [SQL IaaS Agent extension](sql-server-iaas-agent-extension-linux.md) to unlock a wealth of feature benefits for your SQL Server on Linux Azure VM.

## Overview

Registering with the [SQL Server IaaS Agent extension](sql-server-iaas-agent-extension-linux.md) creates the **SQL virtual machine** _resource_ within your subscription, which is a _separate_ resource from the virtual machine resource. Unregistering your SQL Server VM from the extension removes the **SQL virtual machine** _resource_ but will not drop the actual virtual machine.

To utilize the SQL IaaS Agent extension, you must first [register your subscription with the **Microsoft.SqlVirtualMachine** provider](#register-subscription-with-rp), which gives the SQL IaaS extension the ability to create resources within that specific subscription.

> [!IMPORTANT]
> The SQL IaaS Agent extension collects data for the express purpose of giving customers optional benefits when using SQL Server within Azure Virtual Machines. Microsoft will not use this data for licensing audits without the customer's advance consent. See the [SQL Server privacy supplement](/sql/sql-server/sql-server-privacy#non-personal-data) for more information.

## Prerequisites

To register your SQL Server VM with the extension, you'll need:

- An [Azure subscription](https://azure.microsoft.com/free/).
- An Azure Resource Model [Ubuntu Linux virtual machine](../../../virtual-machines/linux/quick-create-portal.md) with [SQL Server 2017 (or greater)](https://www.microsoft.com/sql-server/sql-server-downloads) deployed to the public or Azure Government cloud.
- The latest version of [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell (5.0 minimum)](/powershell/azure/install-az-ps).

## Register subscription with RP

To register your SQL Server VM with the SQL IaaS Agent extension, you must first register your subscription with the **Microsoft.SqlVirtualMachine** resource provider (RP). This gives the SQL IaaS Agent extension the ability to create resources within your subscription. You can do so by using the Azure portal, the Azure CLI, or Azure PowerShell.

### Azure portal

Register your subscription with the resource provider by using the Azure portal:

1. Open the Azure portal and go to **All Services**.
1. Go to **Subscriptions** and select the subscription of interest.
1. On the **Subscriptions** page, select **Resource providers** under **Settings**.
1. Enter **sql** in the filter to bring up the SQL-related resource providers.
1. Select **Register**, **Re-register**, or **Unregister** for the  **Microsoft.SqlVirtualMachine** provider, depending on your desired action.


![Modify the provider](../windows/media/sql-agent-extension-manually-register-single-vm/select-resource-provider-sql.png)

### Command line

Register your Azure subscription with the **Microsoft.SqlVirtualMachine** provider using either Azure CLI or Azure PowerShell.

# [Azure CLI](#tab/bash)

Register your subscription with the resource provider by using the Azure CLI: 

```azurecli-interactive
# Register the SQL IaaS Agent extension to your subscription 
az provider register --namespace Microsoft.SqlVirtualMachine 
```

# [Azure PowerShell](#tab/powershell)

Register your subscription with the resource provider by using Azure PowerShell: 

```powershell-interactive
# Register the SQL IaaS Agent extension to your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.SqlVirtualMachine
```

---

## Register VM

The SQL IaaS Agent extension on Linux is only available in lightweight mode, which supports only changing the license type and edition of SQL Server. Use the Azure CLI or Azure PowerShell to register your SQL Server VM with the extension in lightweight mode for limited functionality. 

Provide the SQL Server license type as either pay-as-you-go (`PAYG`) to pay per usage, Azure Hybrid Benefit (`AHUB`) to use your own license, or disaster recovery (`DR`) to activate the [free DR replica license](../windows/business-continuity-high-availability-disaster-recovery-hadr-overview.md#free-dr-replica-in-azure).

# [Azure CLI](#tab/bash)

Register a SQL Server VM in lightweight mode with the Azure CLI:

```azurecli-interactive
# Register Enterprise or Standard self-installed VM in Lightweight mode
az sql vm create --name <vm_name> --resource-group <resource_group_name> --location <vm_location> --license-type <license_type> 
```

# [Azure PowerShell](#tab/powershell)

Register a SQL Server VM in lightweight mode with Azure PowerShell:

```powershell-interactive
# Get the existing compute VM
$vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
# Register SQL VM with 'Lightweight' SQL IaaS agent
New-AzSqlVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
  -LicenseType <license_type>  -SqlManagementType LightWeight  
```

---

## Verify registration status

You can verify if your SQL Server VM has already been registered with the SQL IaaS Agent extension by using the Azure portal, the Azure CLI, or Azure PowerShell.


### Azure portal

Verify the registration status by using the Azure portal: 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your SQL virtual machines resource.
1. Select your SQL Server VM from the list. If your SQL Server VM is not listed here, it likely hasn't been registered with the SQL IaaS Agent extension.

### Command line

Verify current SQL Server VM registration status using either Azure CLI or Azure PowerShell. `ProvisioningState` shows as `Succeeded` if registration was successful.

# [Azure CLI](#tab/bash)

Verify the registration status by using the Azure CLI:

```azurecli-interactive
az sql vm show -n <vm_name> -g <resource_group>
```

# [Azure PowerShell](#tab/powershell)

Verify the registration status by using the Azure PowerShell:

```powershell-interactive
Get-AzSqlVM -Name <vm_name> -ResourceGroupName <resource_group>
```

---

An error indicates that the SQL Server VM has not been registered with the extension.


## Next steps

For more information, see the following articles:

* [Overview of SQL Server on a Windows VM](sql-server-on-linux-vm-what-is-iaas-overview.md)
* [FAQ for SQL Server on a Windows VM](frequently-asked-questions-faq.yml)
* [Pricing guidance for SQL Server on a Windows VM](../windows/pricing-guidance.md)
* [Release notes for SQL Server on a Windows VM](../windows/doc-changes-updates-release-notes.md)
