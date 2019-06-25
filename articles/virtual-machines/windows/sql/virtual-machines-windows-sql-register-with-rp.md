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

 - Registering a SQL Server VM with the SQL VM resource provider requires the SQL IaaS extension. If the SQL IaaS extension has not already been installed, it will be installed when you register your VM with the resource provider. You can specify the type of installation mode you want for the SQL IaaS extension. 'Full' mode requires a restart of SQL Server, while ['lightweight' and 'noagent'](#sql-iaas-noagent-and-lightweight-agent-options) do not. For more information about SQL IaaS agent modes, see [SQL IaaS agent modes](virtual-machines-windows-sql-server-agent-extension.md#modes). 
 - When registering a custom SQL Server VM image with the resource provider, specify the license type as = 'AHUB'. Leaving the license type as blank, or specifying 'PAYG' will cause the registration to fail.
 - The SQL VM resource provider only supports SQL Server VMs deployed using the 'Resource Manager', and to the public cloud. 

## Prerequisites

The use of the SQL VM resource provider requires the SQL IaaS extension. As such, to proceed with utilizing the SQL VM resource provider, you need the following:
- An [Azure subscription](https://azure.microsoft.com/free/).
- A [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) with the [SQL IaaS extension](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension) installed. If the SQL IaaS extension has not been installed, it will be installed during registration. 


## Register SQL VM resource provider with subscription 

To register your SQL Server VM with the SQL VM resource provider, you must register the resource provider to your subscription. You can do so with the Azure portal, or Azure CLI. 

# [Azure portal](#tab/azure-portal)

The following steps will register the SQL VM resource provider to your Azure subscription using the Azure portal. 

1. Open the Azure portal and navigate to **All Services**. 
1. Navigate to **Subscriptions** and select the subscription of interest.  
1. On the **Subscriptions** page, navigate to **Resource providers**. 
1. Type `sql` in the filter to bring up the SQL-related resource providers. 
1. Select either *Register*, *Re-register*, or *Unregister* for the  **Microsoft.SqlVirtualMachine** provider depending on your desired action. 

   ![Modify the provider](media/virtual-machines-windows-sql-ahb/select-resource-provider-sql.png)

# [AZ CLI](#tab/bash)
The following code snippet will register the SQL VM resource provider to your Azure subscription. 

```azurecli-interactive
# Register the new SQL VM resource provider to your subscription 
az provider register --namespace Microsoft.SqlVirtualMachine 
```

# [PowerShell](#tab/powershell)

The following code snippet will register the SQL VM resource provider to your Azure subscription.

```powershell-interactive
# Register the new SQL VM resource provider to your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.SqlVirtualMachine
```

---

## Register SQL Server VM with SQL VM resource provider
Once the SQL VM resource provider has been registered to your subscription, you can then register your SQL Server VM with the resource provider using Azure CLI, and PowerShell. 

# [AZ CLI](#tab/bash)

Register SQL Server VM using Azure CLI with the below code snippet: 

```azurecli-interactive
# Register your existing SQL Server VM with the new resource provider
az sql vm create -n <VMName> -g <ResourceGroupName> -l <VMLocation> --license-type AHUB
```

# [PowerShell](#tab/powershell)
Register SQL Server VM using PowerShell with the following code snippet:

```powershell-interactive
# Register your existing SQL Server VM with the new resource provider
# example: $vm=Get-AzVm -ResourceGroupName AHBTest -Name AHBTest
$vm=Get-AzVm -ResourceGroupName <ResourceGroupName> -Name <VMName>
New-AzResource -ResourceName $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location -ResourceType Microsoft.SqlVirtualMachine/sqlVirtualMachines -Properties @{virtualMachineResourceId=$vm.Id}
```

# [Azure portal](#tab/azure-portal)
The ability to register with the SQL VM resource provider is not available with the Azure portal. 

---

## SQL IaaS 'noagent' and 'lightweight' agent options

Registering your SQL Server VM with the SQL VM resource provider automatically installs the SQL IaaS agent on VMs that do not already have the agent installed. By default, the installation type for the agent is 'Full', which restarts the SQL Server service. You can install a **Lightweight** version of the SQL IaaS agent, which does not restart SQL Server, or you can register with the **NoAgent** option, which does not install the extension but allows you to register with the SQL VM resource provider. 

Once the SQL Server VM has been registered with the SQL VM resource provider, you can change the SQL IaaS mode in the portal. 

For more information about SQL IaaS agent modes, see [SQL IaaS agent odes](virtual-machines-windows-sql-server-agent-extension.md#modes). 

You can verify the current mode of your SQL Server VM with PowerShell:

  ```powershell-interactive
      //Get the SqlVirtualMachine
      $sqlvm = Get-AzResource -Name $vm.Name  -ResourceGroupName $vm.ResourceGroupName  -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines
      $sqlvm.Properties 
  ```


### Lightweight mode
To avoid restarting SQL Server during SQL VM resource provider registration, specify the lightweight agent installation mode using PowerShell. This can be done by specifying `sqlManagement=LightWeight` in the registration command. The lightweight option does not restart the SQL Server service but only allows modification of the SQL Server edition and license type. 

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register SQL VM with 'Lightweight' SQL IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;sqlManagement='LightWeight'} -Force 
  
  ```

### NoAgent mode
For SQL Server VMs that do not have the **Windows Guest Agent** service, such as Windows Server 2008 images, register with the SQL VM resource provider with the **NoAgent** option using PowerShell. This can be done by specifying `sqlManagement=NoAgent` in the registration command. The 'noagent' option offers limited functionality but does not restart the SQL Server service.  

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register SQL VM with 'NoAgent' SQL IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;sqlManagement='NoAgent'} -Force 
  
  ```



## Known errors

### Sql IaaS Extension is not installed on Virtual Machine
The SQL IaaS extension is a necessary prerequisite for registering your SQL Server VM with the SQL VM resource provider. If you attempt to register your SQL Server VM before installing the SQL IaaS extension, you will encounter the following error:

`Sql IaaS Extension is not installed on Virtual Machine: '{0}'. Please make sure it is installed and in running state and try again later.`

To resolve this issue, install the SQL IaaS extension before attempting to register your SQL Server VM. 

  > [!NOTE]
  > Installing the SQL IaaS extension will restart the SQL Server service and should only be done during a maintenance window. For more information, see [SQL IaaS Extension installation](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension#installation). 


### The Resource 'Microsoft.SqlVirtualMachine/SqlVirtualMachines/\<resource-group>' under resource group '\<resource-group>' was not found. The property 'sqlServerLicenseType' cannot be found on this object. Verify that the property exists and can be set.
This error occurs when attempting to change the licensing model on a SQL Server VM that has not been registered with the SQL VM resource provider. You'll need to register the resource provider to your [subscription](#register-sql-vm-resource-provider-with-subscription), and then register your SQL Server VM with the SQL [resource provider](virtual-machines-windows-sql-register-with-rp.md). 

### Cannot validate argument on parameter 'Sku'
You may encounter this error when attempting to change your SQL Server VM licensing model when using Azure PowerShell > 4.0:
`Set-AzResource: Cannot validate argument on parameter 'Sku'. The argument is null or empty. Provide an argument that is not null or empty, and then try the command again.`

To resolve this error, uncomment these lines in the previously mentioned PowerShell code snippet when switching your licensing model:

  ```powershell-interactive
  # the following code snippet is necessary if using Azure Powershell version > 4
  $SqlVm.Kind= "LicenseChange"
  $SqlVm.Plan= [Microsoft.Azure.Management.ResourceManager.Models.Plan]::new()
  $SqlVm.Sku= [Microsoft.Azure.Management.ResourceManager.Models.Sku]::new()
  ```
  
  Use the following code to verify your Azure PowerShell version:
  
  ```powershell-interactive
  Get-Module -ListAvailable -Name Azure -Refresh
  ```

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server on a Windows VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server on a Windows VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server on a Windows VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)


