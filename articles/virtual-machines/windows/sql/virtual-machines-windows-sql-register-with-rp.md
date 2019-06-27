---
title: Register SQL Server virtual machine in Azure with the SQL VM resource provider | Microsoft Docs
description: Register your SQL Server VM with the SQL VM resource provider to improve manageability. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: craigg
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/24/2019
ms.author: mathoma
ms.reviewer: jroth

---
# Register SQL Server virtual machine in Azure with the SQL VM resource provider

This article describes how to register your Azure SQL Server virtual machine (VM) with the SQL VM resource provider - **Microsoft.SqlVirtualMachine**. 

The SQL VM resource provider enables improved and robust management of SQL Server VMs - such as **portal management**, **changing license type**, and **changing edition SKU**. SQL Server VMs created using the Azure marketplace are automatically registered with the SQL VM resource provider. However, there are some specific cases in which manual registration is necessary, such as when SQL Server has been self-installed. You can use Azure CLI or PowerShell to register your SQL Server VM with the SQL VM resource provider. 

To utilize the SQL VM resource provider, you must also register the SQL VM resource provider with your subscription. This can be accomplished with the Azure portal, Azure CLI, and PowerShell. 


## Remarks

 - Registering a SQL Server VM that does not have the SQL IaaS extension will install the extension during the registration process.  You can specify the type of installation mode you want for the SQL IaaS extension. 'Full' mode is default, and will restart SQL Server, while ['lightweight'](#sql-iaas-noagent-and-lightweight-agent-options) will not. For more information about SQL IaaS agent modes, see [SQL IaaS agent modes](virtual-machines-windows-sql-server-agent-extension.md#modes). 
 - When registering a custom SQL Server VM image with the resource provider, specify the license type as = 'AHUB'. Leaving the license type as blank, or specifying 'PAYG' will cause the registration to fail.
 - The SQL VM resource provider only supports SQL Server VMs deployed using the 'Resource Manager', and to the public cloud. 

## Prerequisites

To register your SQL Server VM with the resource provider, you will need the following: 

- An [Azure subscription](https://azure.microsoft.com/free/).
- A [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision). 
- [Azure CLI](/cli/azure/install-azure-cli) or [PowerShell](/powershell/azure/new-azureps-module-az). 

## Verify registration status
You can verify if your SQL Server has already been registered with the SQL VM resource provider using Azure CLI or PowerShell. 

### Azure CLI

Verify current SQL Server VM registration status with the following Azure CLI cmdlet:

  ```azurecli-interactive
  az sql vm show -n <vm_name> -g <resource_group>
  ```

Seeing `Microsoft.SqlVirtualMachine` in the **ID** value of the output indicates your SQL Server VM has been registered with the resource provider. 

### PowerShell 

Verify current SQL Server VM registration status with the following PowerShell cmdlet:

  ```powershell-interactive
  Get-AzResource -ResourceName <vm_name> -ResourceGroupName <resource_group> -ResourceType Microsoft.SqlVirtualMachine/sqlVirtualMachines
  ```
An error indicates that the SQL Server VM has not been registered with the resource provider. 

## Register SQL VM resource provider with subscription 

To register your SQL Server VM with the SQL VM resource provider, you must register the resource provider to your subscription. You can do so with the Azure portal, or Azure CLI. 

### Azure portal

The following steps will register the SQL VM resource provider to your Azure subscription using the Azure portal. 

1. Open the Azure portal and navigate to **All Services**. 
1. Navigate to **Subscriptions** and select the subscription of interest.  
1. On the **Subscriptions** page, navigate to **Resource providers**. 
1. Type `sql` in the filter to bring up the SQL-related resource providers. 
1. Select either *Register*, *Re-register*, or *Unregister* for the  **Microsoft.SqlVirtualMachine** provider depending on your desired action. 

   ![Modify the provider](media/virtual-machines-windows-sql-ahb/select-resource-provider-sql.png)


### Azure CLI
The following code snippet will register the SQL VM resource provider to your Azure subscription. 

```azurecli-interactive
# Register the new SQL VM resource provider to your subscription 
az provider register --namespace Microsoft.SqlVirtualMachine 
```

## PowerShell 

The following PowerShell code snippet will register the SQL VM resource provider to your Azure subscription.

```powershell-interactive
# Register the new SQL VM resource provider to your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.SqlVirtualMachine
```



## Register SQL Server VM with SQL VM resource provider
Once the SQL VM resource provider has been registered to your subscription, you can then register your SQL Server VM with the resource provider using Azure CLI, and PowerShell. 

### Azure CLI

Register SQL Server VM using Azure CLI with the below code snippet: 

```azurecli-interactive
# Register your existing SQL Server VM with the new resource provider
az sql vm create -n <VMName> -g <ResourceGroupName> -l <VMLocation> --license-type AHUB
```

### PowerShell 

Register SQL Server VM using PowerShell with the following code snippet:

```powershell-interactive
# Register your existing SQL Server VM with the new resource provider
# example: $vm=Get-AzVm -ResourceGroupName AHBTest -Name AHBTest
$vm=Get-AzVm -ResourceGroupName <ResourceGroupName> -Name <VMName>
New-AzResource -ResourceName $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location -ResourceType Microsoft.SqlVirtualMachine/sqlVirtualMachines -Properties @{virtualMachineResourceId=$vm.Id}
```


## SQL IaaS 'lightweight' agent option

Registering your SQL Server VM with the SQL VM resource provider automatically installs the SQL IaaS agent on VMs that do not already have the agent installed. By default, the installation type for the agent is 'Full', which restarts the SQL Server service. You can install a **lightweight** version of the SQL IaaS agent, which does not restart SQL Server. 

Once the SQL Server VM has been registered with the SQL VM resource provider, you can change the SQL IaaS mode in the portal. 

For more information about SQL IaaS agent modes, see [SQL IaaS agent odes](virtual-machines-windows-sql-server-agent-extension.md#modes). 

You can verify the current mode of your SQL Server VM with the Azure portal or PowerShell:

  ```powershell-interactive
      //Get the SqlVirtualMachine
      $sqlvm = Get-AzResource -Name $vm.Name  -ResourceGroupName $vm.ResourceGroupName  -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines
      $sqlvm.Properties 
  ```

To avoid restarting SQL Server during SQL VM resource provider registration, specify the lightweight agent installation mode using PowerShell. This can be done by specifying `sqlManagement=LightWeight` in the registration command. The lightweight option does not restart the SQL Server service but results in limited functionality that only allows modification of the SQL Server edition and license type. 

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register SQL VM with 'Lightweight' SQL IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;sqlManagement='LightWeight'} -Force 
  
  ```

## Register Windows Server 2008 images

Windows Server 2008 images can be registered with the SQL VM resource provider by utilizing the **noagent** mode of the SQL IaaS extension. This option provides limited functionality but will allow the SQL Server VM to be managed in the Azure portal. 

To register your Windows Server 2008 image, user PowerShell:  

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register SQL VM with 'NoAgent' SQL IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;sqlManagement='NoAgent'} -Force 
  
  ```


## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server on a Windows VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server on a Windows VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server on a Windows VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)


