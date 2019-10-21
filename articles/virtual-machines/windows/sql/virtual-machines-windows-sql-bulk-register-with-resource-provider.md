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
# Bulk register SQL virtual machines in Azure with the SQL VM resource provider

This article describes how to bulk register your SQL Server virtual machine (VM) in Azure with the SQL VM resource provider using the 'Register-SqlVMs' PowerShell cmdlet.

The 'Register-SqlVMs' cmdlet can be used to register all virtual machines in a given list of subscriptions, resource groups, or a list of specific virtual machines. The cmdlet will register the virtual machines, and then generate both a [report and a log file](#output-description). 

For more information about the resource provider, see [SQL VM resource provider](virtual-machines-windows-sql-register-with-resource-provider.md). 

For the full script on GitHub, see [Bulk register SQL VMs with Az PowerShell](https://github.com/Azure/azure-docs-powershell-samples/blob/4a29e653d93a109c36fa9161625eefcf14f0837d/sql-virtual-machine/register-sql-vms/RegisterSqlVMs.psm1). 

## Prerequisites

To register your SQL Server VM with the resource provider, you'll need the following: 

- An [Azure subscription](https://azure.microsoft.com/free/) with unregistered SQL Server virtual machines. Subscriptions used for the script should be in the same tenant as the PowerShell session. Run `Get-AzSubscription` to verify that the subscription is in the output of the cmdlet. 
- The client credentials used to register the virtual machines exist in any of the following RBAC roles: **Virtual Machine contributor**, **Contributor**, or **Owner**. 
- One or more [SQL Server virtual machines](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision). 
- The latest version of [Az PowerShell](/powershell/azure/new-azureps-module-az). 


## All VMs in list of subscriptions 

Use the following cmdlet to register all SQL Server virtual machines in a list of subscriptions:

```powershell-interactive
Register-SqlVMs -SubscriptionList SubscriptionId1,SubscriptionId2
```

Example output: 

```
Number of Subscriptions registration failed for 
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

## All VMs in a single subscription

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

## All VMs in multiple resource groups

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

## All VMs in a resource group

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

## Specific VMs in single resource group

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

## Specific VM

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

Both a report and log file is generated every time the `Register-SqlVMs` cmdlet is used. 

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

Errors are logged in the log file named `VMsNotRegisteredDueToError<Timestamp>.log` where timestamp is the time when the script started. If the error is at the subscription level, the log contains the comma-separated SubscriptionID and the error message. If the error is with the virtual machine registration, the log contains the Subscription ID, Resource group name, virtual machine name, error code and message separated by commas. 



## Register RP with a subscription 

To register your SQL Server VM with the SQL VM resource provider, you must register the resource provider with your subscription. You can do so by using the Azure portal, the Azure CLI, or PowerShell.

# [Portal](#tab/azure-portal)

1. Open the Azure portal and go to **All Services**. 
1. Go to **Subscriptions** and select the subscription of interest.  
1. On the **Subscriptions** page, go to **Resource providers**. 
1. Enter **sql** in the filter to bring up the SQL-related resource providers. 
1. Select **Register**, **Re-register**, or **Unregister** for the  **Microsoft.SqlVirtualMachine** provider, depending on your desired action. 

![Modify the provider](media/virtual-machines-windows-sql-ahb/select-resource-provider-sql.png)


# [AZ CLI](#tab/bash)
The following code snippet will register the SQL VM resource provider to your Azure subscription. 

```azurecli-interactive
# Register the new SQL VM resource provider to your subscription 
az provider register --namespace Microsoft.SqlVirtualMachine 
```

# [PowerShell](#tab/powershell)

```powershell-interactive
# Register the new SQL VM resource provider to your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.SqlVirtualMachine
```

---

## Full script

[!code-powershell-interactive[main](.../../../powershell_scripts/sql-virtual-machine/register-sql-vms/RegisterSqlVMs.psm1 "Bulk register SQL Server virtual machines")]

[!code-powershell-interactive[main](../../../../../../powershell_scripts/sql-database/failover-groups/add-single-db-to-failover-group-az-ps.ps1 "Add single database to a failover group")]

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [FAQ for SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-faq.md)
* [Pricing guidance for SQL Server on a Windows VM](virtual-machines-windows-sql-server-pricing-guidance.md)
* [Release notes for SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-release-notes.md)
