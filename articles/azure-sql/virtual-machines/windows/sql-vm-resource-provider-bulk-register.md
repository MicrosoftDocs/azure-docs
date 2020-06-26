---
title: Bulk register SQL virtual machines in Azure with the SQL VM resource provider | Microsoft Docs
description: Bulk register SQL Server VMs with the SQL VM resource provider to improve manageability. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 10/21/2019
ms.author: mathoma
ms.reviewer: jroth

---
# Register multiple SQL virtual machines in Azure with the SQL VM resource provider
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article describes how to register your SQL Server virtual machines (VMs) in bulk in Azure with the SQL VM resource provider by using the `Register-SqlVMs` PowerShell cmdlet.

The `Register-SqlVMs` cmdlet can be used to register all virtual machines in a given list of subscriptions, resource groups, or a list of specific virtual machines. The cmdlet will register the virtual machines in _lightweight_ management mode, and then generate both a [report and a log file](#output-description). 

The registration process carries no risk, has no downtime, and will not restart SQL Server or the virtual machine. 

For more information about the resource provider, see [SQL VM resource provider](sql-vm-resource-provider-register.md). 

## Prerequisites

To register your SQL Server VM with the resource provider, you'll need the following: 

- An [Azure subscription](https://azure.microsoft.com/free/) that has been [registered with the resource provider](sql-vm-resource-provider-register.md#register-a-subscription-with-the-resource-provider) and contains unregistered SQL Server virtual machines. 
- The client credentials used to register the virtual machines exist in any of the following RBAC roles: **Virtual Machine contributor**, **Contributor**, or **Owner**. 
- The latest version of [Az PowerShell](/powershell/azure/new-azureps-module-az). 
- The latest version of [Az.SqlVirtualMachine](https://www.powershellgallery.com/packages/Az.SqlVirtualMachine/0.1.0).

## Get started

Before proceeding, you must first create a local copy of the script, import it as a PowerShell module, and connect to Azure. 

### Create the script

To create the script, copy the [full script](#full-script) from the end of this article and save it locally as `RegisterSqlVMs.psm1`. 

### Import the script

After the script is created, you can import it as a module in the PowerShell terminal. 

Open an administrative PowerShell terminal and navigate to where you saved the `RegisterSqlVMs.psm1` file. Then, run the following PowerShell cmdlet to import the script as a module: 

```powershell-interactive
Import-Module .\RegisterSqlVMs.psm1
```

### Connect to Azure

Use the following PowerShell cmdlet to connect to Azure:

```powershell-interactive
Connect-AzAccount
```


## Register all VMs in a list of subscriptions 

Use the following cmdlet to register all SQL Server virtual machines in a list of subscriptions:

```powershell-interactive
Register-SqlVMs -SubscriptionList SubscriptionId1,SubscriptionId2
```

Example output: 

```
Number of subscriptions registration failed for 
because you do not have access or credentials are wrong: 1
Total VMs Found: 10
VMs Already registered: 1
Number of VMs registered successfully: 4
Number of VMs failed to register due to error: 1
Number of VMs skipped as VM or the guest agent on VM is not running: 3
Number of VMs skipped as they are not running SQL Server On Windows: 1

Please find the detailed report in file RegisterSqlVMScriptReport1571314821.txt
Please find the error details in file VMsNotRegisteredDueToError1571314821.log
```

## Register all VMs in a single subscription

Use the following cmdlet to register all SQL Server virtual machines in a single subscription: 

```powershell-interactive
Register-SqlVMs -Subscription SubscriptionId1
```

Example output:

```
Total VMs Found: 10
VMs Already registered: 1
Number of VMs registered successfully: 5
Number of VMs failed to register due to error: 1
Number of VMs skipped as VM or the  guest agent on VM is not running: 2
Number of VMs skipped as they are not running SQL Server On Windows: 1

Please find the detailed report in file RegisterSqlVMScriptReport1571314821.txt
Please find the error details in file VMsNotRegisteredDueToError1571314821.log
```

## Register all VMs in multiple resource groups

Use the following cmdlet to register all SQL Server virtual machines in multiple resource groups within a single subscription:

```powershell-interactive
Register-SqlVMs -Subscription SubscriptionId1 -ResourceGroupList ResourceGroup1,ResourceGroup2
```

Example output:

```
Total VMs Found: 4
VMs Already registered: 1
Number of VMs registered successfully: 1
Number of VMs failed to register due to error: 1
Number of VMs skipped as they are not running SQL Server On Windows: 1

Please find the detailed report in file RegisterSqlVMScriptReport1571314821.txt
Please find the error details in file VMsNotRegisteredDueToError1571314821.log
```

## Resister all VMs in a resource group

Use the following cmdlet to register all SQL Server virtual machines in a single resource group: 

```powershell-interactive
Register-SqlVMs -Subscription SubscriptionId1 -ResourceGroupName ResourceGroup1
```

Example output:

```
Total VMs Found: 4
VMs Already registered: 1
Number of VMs registered successfully: 1
Number of VMs failed to register due to error: 1
Number of VMs skipped as VM or the guest agent on VM is not running: 1

Please find the detailed report in file RegisterSqlVMScriptReport1571314821.txt
Please find the error details in file VMsNotRegisteredDueToError1571314821.log
```

## Register specific VMs in a single resource group

Use the following cmdlet to register specific SQL Server virtual machines within a single resource group:

```powershell-interactive
Register-SqlVMs -Subscription SubscriptionId1 -ResourceGroupName ResourceGroup1 -VmList VM1,VM2,VM3
```

Example output:

```
Total VMs Found: 3
VMs Already registered: 0
Number of VMs registered successfully: 1
Number of VMs skipped as VM or the guest agent on VM is not running: 1
Number of VMs skipped as they are not running SQL Server On Windows: 1

Please find the detailed report in file RegisterSqlVMScriptReport1571314821.txt
Please find the error details in file VMsNotRegisteredDueToError1571314821.log
```

## Register a specific VM

Use the following cmdlet to register a specific SQL Server virtual machine: 

```powershell-interactive
Register-SqlVMs -Subscription SubscriptionId1 -ResourceGroupName ResourceGroup1 -Name VM1
```

Example output:

```
Total VMs Found: 1
VMs Already registered: 0
Number of VMs registered successfully: 1

Please find the detailed report in  file RegisterSqlVMScriptReport1571314821.txt
```


## Output description

Both a report and a log file are generated every time the `Register-SqlVMs` cmdlet is used. 

### Report

The report is generated as a `.txt` file named `RegisterSqlVMScriptReport<Timestamp>.txt` where the timestamp is the time when the cmdlet was started. The report lists the following details:

| **Output value** | **Description** |
| :--------------  | :-------------- | 
| Number of subscriptions registration failed for because you do not have access or credentials are incorrect | This provides the number and list of subscriptions that had issues with the provided authentication. The detailed error can be found in the log by searching for the subscription ID. | 
| Number of subscriptions that could not be tried because they are not registered to the RP | This section contains the count and list of subscriptions that have not been registered to the SQL VM resource provider. |
| Total VMs found | The count of virtual machines that were found in the scope of the parameters passed to the cmdlet. | 
| VMs already registered | The count of virtual machines that were skipped as they were already registered with the resource provider. |
| Number of VMs registered successfully | The count of virtual machines that were successfully registered after running the cmdlet. Lists the registered virtual machines in the format `SubscriptionID, Resource Group, Virtual Machine`. | 
| Number of VMs failed to register due to error | Count of virtual machines that failed to register due to some error. The details of the error can be found in the log file. | 
| Number of VMs skipped as the VM or the gust agent on VM is not running | Count and list of virtual machines that could not be registered as either the virtual machine or the guest agent on the virtual machine were not running. These can be retried once the virtual machine or guest agent has been started. Details can be found in the log file. |
| Number of VMs skipped as they are not running SQL Server on Windows | Count of virtual machines that were skipped as they are not running SQL Server or are not a Windows virtual machine. The virtual machines are listed in the format `SubscriptionID, Resource Group, Virtual Machine`. | 
| &nbsp; | &nbsp; |

### Log 

Errors are logged in the log file named `VMsNotRegisteredDueToError<Timestamp>.log`, where timestamp is the time when the script started. If the error is at the subscription level, the log contains the comma-separated Subscription ID and the error message. If the error is with the virtual machine registration, the log contains the Subscription ID, Resource group name, virtual machine name, error code, and message separated by commas. 

## Remarks

When you register SQL Server VMs with the resource provider by using the provided script, consider the following:

- Registration with the resource provider requires a guest agent running on the SQL Server VM. Windows Server 2008 images do not have a guest agent, so these virtual machines will fail and must be registered manually using the [NoAgent management mode](sql-vm-resource-provider-register.md#management-modes).
- There is retry logic built-in to overcome transparent errors. If the virtual machine is successfully registered, then it is a rapid operation. However, if the registration fails, then each virtual machine will be retried.  As such, you should allow significant time to complete the registration process -  though actual time requirement is dependent on the type and number of errors. 

## Full script

For the full script on GitHub, see [Bulk register SQL VMs with Az PowerShell](https://github.com/Azure/azure-docs-powershell-samples/blob/master/sql-virtual-machine/register-sql-vms/RegisterSqlVMs.psm1). 

Copy the full script and save it as `RegisterSqLVMs.psm1`.

[!code-powershell-interactive[main](../../../../powershell_scripts/sql-virtual-machine/register-sql-vms/RegisterSqlVMs.psm1 "Bulk register SQL Server virtual machines")]

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](sql-server-on-azure-vm-iaas-what-is-overview.md)
* [FAQ for SQL Server on a Windows VM](frequently-asked-questions-faq.md)
* [Pricing guidance for SQL Server on a Windows VM](pricing-guidance.md)
* [Release notes for SQL Server on a Windows VM](../../database/doc-changes-updates-release-notes.md)
