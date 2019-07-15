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

This article describes how to register your Azure SQL Server virtual machine (VM) with the SQL VM resource provider. 

Deploying a SQL Server VM marketplace image through the Azure portal automatically registers the SQL Server VM with the resource provider. However, If you choose to self-install SQL Server on an Azure Virtual Machine instead of choosing an image from the Azure Marketplace, then you should register your SQL Server VM with the resource provider today for:

-  **Compliance** – Per the Microsoft Product Terms, customers using the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) must indicate to Microsoft when using the Azure Hybrid Benefit - and to do so, they must register with the SQL VM resource provider. 

-  **Feature benefits** - Registering your SQL Server VM with the resource provider unlocks [auto patching](virtual-machines-windows-sql-automated-patching.md), [auto backup](virtual-machines-windows-sql-automated-backup-v2.md), monitoring and manageability capabilities, as well as [licensing](virtual-machines-windows-sql-ahb.md) and [edition](virtual-machines-windows-sql-change-edition.md) flexibility. Previously, these were only available to SQL Server VM images from the Azure Marketplace.

Self-installing SQL Server on an Azure VM or provisioning an Azure VM from a custom VHD with SQL Server is compliant through Azure Hybrid Benefit for SQL Server with the condition that customers indicate that use to Microsoft by registering with SQL VM resource provider. 

To utilize the SQL VM resource provider, you must also register the SQL VM resource provider with your subscription. This can be accomplished with the Azure portal, Azure CLI, and PowerShell. 

## Prerequisites

To register your SQL Server VM with the resource provider, you will need the following: 

- An [Azure subscription](https://azure.microsoft.com/free/).
- A [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision). 
- [Azure CLI](/cli/azure/install-azure-cli) and [PowerShell](/powershell/azure/new-azureps-module-az). 

## Register with SQL VM resource provider
If the [SQL IaaS Extension](virtual-machines-windows-sql-server-agent-extension.md) is already installed on the VM, then registering with SQL VM resource provider is simply creating a metadata resource of type Microsoft.SqlVirtualMachine/SqlVirtualMachines. Below is the code snippet to register with SQL VM resource provider if the SQL IaaS Extension is already installed on the VM. You need to provide the type of SQL Server license desired when registering with SQL VM resource provider as either 'PAYG 'or 'AHUB'. 

Register SQL Server VM using PowerShell with the following code snippet:

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register with SQL VM resource provider
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;SqlServerLicenseType='AHUB'}  
  
  ```

If the SQL IaaS Extension is not installed on the VM, then you can register with SQL VM resource provider by specifying the lightweight SQL management mode. In lightweight SQL management mode, SQL VM resource provider will auto install SQL IaaS Extension in [lightweight mode](virtual-machines-windows-sql-server-agent-extension.md#install-in-lightweight-mode) and verify SQL Server instance metadata; this will not restart SQL Server service. You need to provide the type of SQL Server license desired when registering with SQL VM resource provider as either 'PAYG 'or 'AHUB'. 

Register SQL Server VM in lightweight SQL management mode using PowerShell with the following code snippet:

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register SQL VM with 'Lightweight' SQL IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;SqlServerLicenseType='AHUB';sqlManagement='LightWeight'}  
  
  ```

Registering with the SQL VM resource provider in [lightweight mode](virtual-machines-windows-sql-server-agent-extension.md#install-in-lightweight-mode) will assure compliance and enable flexible licensing as well as in-place SQL Server edition updates. Failover Cluster Instances and multi-instance deployments can be registered with SQL VM resource provider only in lightweight mode. You can follow the directions found on Azure portal to upgrade to [full mode](virtual-machines-windows-sql-server-agent-extension.md#full-mode-installation) and enable comprehensive manageability feature set with a SQL Server restart anytime. 

## Register SQL Server 2008/R2 on Windows Server 2008 VMs

SQL Server 2008 and 2008 R2 installed on Windows Server 2008 can be registered with the SQL VM resource provide in the [NoAgent](virtual-machines-windows-sql-server-agent-extension.md) mode. This option assures compliance and allows the SQL Server VM to be monitored in the Azure portal with limited functionality.

The following table details the acceptable values for the parameters provided during registration:

| Parameter | Acceptable values                                 |
| :------------------| :--------------------------------------- |
| **sqlLicenseType** | `'AHUB'`, or `'PAYG'`                    |
| **sqlImageOffer**  | `'SQL2008-WS2008'` or `'SQL2008R2-WS2008`|
| &nbsp;             | &nbsp;                                   |


To register your SQL Server 2008 or 2008 R2 on Windows Server 2008 instance, use the following Powershell code snippet:  

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
    New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
      -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
      -Properties @{virtualMachineResourceId=$vm.Id;SqlServerLicenseType='AHUB'; `
       sqlManagement='NoAgent';sqlImageSku='Standard';sqlImageOffer='SQL2008R2-WS2008'}
  ```

## Verify registration status
You can verify if your SQL Server has already been registered with the SQL VM resource provider using the Azure portal, Azure CLI, or PowerShell. 

### Azure Portal 
To verify the status of registration using the Azure portal, do the following.

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Navigate to your [SQL virtual machines](virtual-machines-windows-sql-manage-portal.md).
1. Select your SQL Server VM from the list. If your SQL Server VM is not listed here, it is likely your SQL Server VM has not been registered with the SQL VM resource provider. 
1. View the value under `Status`. If `Status = Succeeded`, then the SQL Server VM has been registered with the SQL VM resource provider successfully. 

    ![Verify status with SQL RP registration](media/virtual-machines-windows-sql-register-with-rp/verify-registration-status.png)

### Az CLI

Verify current SQL Server VM registration status with the following AZ CLI command. `ProvisioningState` will show `Succeeded` if registration was successful. 

  ```azurecli-interactive
  az sql vm show -n <vm_name> -g <resource_group>
  ```


### PowerShell

Verify current SQL Server VM registration status with the following PowerShell cmdlet. `ProvisioningState` will show `Succeeded` if registration was successful. 

  ```powershell-interactive
  Get-AzResource -ResourceName <vm_name> -ResourceGroupName <resource_group> -ResourceType Microsoft.SqlVirtualMachine/sqlVirtualMachines
  ```
An error indicates that the SQL Server VM has not been registered with the resource provider. 

---

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

### Az CLI
The following code snippet will register the SQL VM resource provider to your Azure subscription. 

```azurecli-interactive
# Register the new SQL VM resource provider to your subscription 
az provider register --namespace Microsoft.SqlVirtualMachine 
```

### PowerShell

The following PowerShell code snippet will register the SQL VM resource provider to your Azure subscription.

```powershell-interactive
# Register the new SQL VM resource provider to your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.SqlVirtualMachine
```
---

## Remarks

 - The SQL VM resource provider only supports SQL Server VMs deployed using the 'Resource Manager'. SQL Server VMs deployed using the 'classic model' are not supported. 
 - The SQL VM resource provider only supports SQL Server VMs deployed to the public cloud. Deployments to the private, or government cloud, are not supported. 

## Facts
1.	Should I register my VM provisioned from a SQL image on Azure Marketplace?
No. Microsoft auto-registers VM’s provisioned from SQL images on Azure Marketplace. Registering with SQL VM RP is required only if VM is NOT provisioned from SQL images on Azure marketplace and SQL Server is self-installed.  

2.	Is the SQL VM resource provider available for all customers?
Yes. Customers should register their SQL VM with SQL VM RP if they did not use a SQL Server image from Azure marketplace and self-installed SQL Server or bring their custom VHD.  VM’s owned by all types of subscriptions (Direct, EA and CSP) can register with SQL VM RP.

3.	Should I register with SQL VM resource provider if my VM has SQL IaaS Extension installed?
If your SQL VM is self-installed, not provisioned from SQL images on Azure marketplace, then you should register with SQL VM RP even if you installed SQL IaaS Extension. Registering with SQL VM RP creates a new resource of type Microsoft.SqlVirtualMachines. Installing SQL IaaS Extension does not create that resource. 

4.	What is the Default SQL Management Mode when registering with SQL VM RP
The default SQL Management mode when registering with SQL VM RP is Full. If SQL Management property is not set when registering with SQL VM RP, then mode will be set as Full Managebility. Having SQL IaaS Extension installed on the VM is the prerequisite to register with SQL VM RP in Full Managebility mode.
5.	What is the prerequisites to register with SQL VM RP?
There is no prerequisites to register with SQL VM RP in lightweight mode or no-agent mode. The prerequisites to register with SQL VM RP in Full mode is having SQL IaaS Extension installed on the VM.
6.	Can I register with SQL VM RP if I do not have the SQL IaaS Extension installed on the VM?
Yes, you can register with SQL VM RP in lightweight management mode if you do not have SQL IaaS Extension installed on the VM. In lightweight mode, SQL VM RP will use a console app to query registry of the VM and verify SQL instance’s version and edition. The console app will die after verifying that there is at least one SQL instance running on the VM. Registering with SQL VM RP in lightweight mode will not restart SQL Server and will not create an agent on the VM.

7.	Will registering with SQL VM RP install an agent on my VM?
No. Registering with SQL VM RP will only create a new metadata resource, and will not install an agent on the VM.  SQL IaaS Extension is needed only for enabling Full Managebility, so upgrading the manageability mode from lightweight to full will install the SQL IaaS Extension and will restart SQL Server. 

8.	Will registering with SQL VM RP restart SQL Server on my VM?
No. Registering with SQL VM RP will only create a new metadata resource, and will not restart the SQL Server on the VM.  Restarting of SQL Server is only needed to install SQL IaaS Extension; and SQL IaaS Extension is needed for enabling Full Managebility. Upgrading the manageability mode from lightweight to full will install the SQL IaaS Extension and will restart SQL Server. 

9.	What is the difference of lightweight and no-agent management modes when registering with SQL VM RP?
No-agent management mode is only available for SQL Server 2008/R2 on Windows Server 2008; and it is the only available management mode for these versions. For all versions of SQL Server, excluding SQL Server 2008/R2 on Windows Server, there are two Managebility modes available as lightweight and full. No-agent mode requires SQL Server version and edition properties set by customer; lightweight mode queries the VM to find the version and edition of the SQL instance.

10.	Can I register with SQL VM RP in Lightweight or no-agent mode with Azure CLI?
NO.  SQL Management mode property is only available when registering with SQL VM RP with Azure Power Shell. Azure CLI do not support setting SQL Managebility property and always registers with SQL VM RP in the default mode- Full manageability.

11.	Can I register with SQL VM RP without specifying the SQL License Type?
No. SQL License type is not an optional property when registering with SQL VM RP. You have to set SQL License type as PAYG or AHB when registering with SQL VM RP in all manageability modes (no-agent, lightweight and Full) both with CLI and PS.

12.	Can I upgrade SQL IaaS Extension from no-agent mode to Full mode?
No. Upgrading SQL Managebility mode to Full or Lightweight is not available for no-agent mode. This is a technical limitation of Windows Server 2008.

13.	Can I upgrade SQL IaaS Extension from lightweight mode to Full mode?
Yes. Upgrading SQL manageability mode from lightweight to Full is supported via PS or Azure Portal; and, it requires restarting SQL Server.

14.	Can I downgrade SQL IaaS Extension from Full mode to no-agent or lightweight management modes?
No. Downgrading SQL IaaS Extension manageability mode is not supported. SQL Managebility mode cannot be downgraded from Full mode to lightweight or no-agent mode; and it cannot be downgraded from Lightweight mode to no-agent mode.
To change the Managebility mode from Full manageability; remove the SQL IaaS extension; drop Micorsoft.SqlVirtualMachine resource and re-register with SQL VM.

15.	Can I register with SQL VM RP from Azure Portal?
No. Registering with SQL VM RP is not available on Azure Portal. Registering with SQL VM RP in Full manageability mode is supported with Azure CLI or Power Shell; and registering with SQL VM RP in lightweight or no-agent manageability modes are only supported by Azure Power Shell APIs.

16.	Can I register a VM with SQL VM RP before SQL Server is installed?
No. VM should have at least one SQL instance to successfully register with SQL VM RP. If there is no SQL instance on the VM, then the new Micosoft.SqlVirtualMachine resource will be in failed state.

17.	Can I register a VM with SQL VM RP if there are multiple SQL instances?
Yes. SQL VM RP will register only one SQL instance. SQL VMRP will register the default SQL instance in the case of multiple instances. If there is no default instance, then only registering in lightweight mode is supported. To upgrade from lightweight to full manageability mode, either the default SQL instance should exist or VM should have only one named SQL instance.

18.	Can I register a SQL Server Failover Cluster Instance with SQL VM RP?
Yes. SQL FCI instances on Azure VM can be registered with SQL VM RP in lightweight mode. But, those cannot be upgraded to full manageability mode.

19.	Can I register my VM with SQL VM RP if Always ON AG was configured?
Yes. There are no restrictions to register a SQL instances on Azure VM with SQL VM RP if participated in an Always ON AG configuration.


## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server on a Windows VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server on a Windows VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server on a Windows VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)


