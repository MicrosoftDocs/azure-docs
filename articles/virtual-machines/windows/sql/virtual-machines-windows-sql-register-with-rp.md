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

This article describes how to register your Azure SQL Server virtual machine (VM) with the SQL VM resource provider - . 

Registering your SQL Server VM with the SQL VM resource provider (**Microsoft.SqlVirtualMachine**) creates a resource of type 'SQL virtual machine'. This allows for greater manageability of your SQL Server VM, such as dedicated [portal management](virtual-machines-windows-sql-manage-portal.md#access-sql-virtual-machine-resource), [changing the license type](virtual-machines-windows-sql-ahb.md), and [changing edition](virtual-machines-windows-sql-change-edition.md). 

Deploying a SQL Server VM marketplace image through the Azure portal automatically registers a SQL Server VM with the resource provider. However, there are some specific cases in which manual registration is necessary, such as when the image was deployed using Az CLI or PowerShell, or when SQL Server has been self-installed. 

To utilize the SQL VM resource provider, you must also register the SQL VM resource provider with your subscription. This can be accomplished with the Azure portal, Azure CLI, and PowerShell. 


## Remarks

 - The SQL VM resource provider only supports SQL Server VMs deployed using the 'Resource Manager'. SQL Server VMs deployed using the 'classic model' are not supported. 
 - The SQL VM resource provider only supports SQL Server VMs deployed to the public cloud. Deployments to the private, or government cloud, are not supported. 

## Prerequisites

To register your SQL Server VM with the resource provider, you will need the following: 

- An [Azure subscription](https://azure.microsoft.com/free/).
- A [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision). 
- [Azure CLI](/cli/azure/install-azure-cli) and [PowerShell](/powershell/azure/new-azureps-module-az). 

## Register SQL VM resource provider with subscription 

To register your SQL Server VM with the SQL VM resource provider, you must register the resource provider to your subscription. You can do so with the Azure portal, or Azure CLI.

# [Azure Portal](#tab/azure-portal)

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

The following PowerShell code snippet will register the SQL VM resource provider to your Azure subscription.

```powershell-interactive
# Register the new SQL VM resource provider to your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.SqlVirtualMachine
```
---

## Register SQL Server VM with SQL VM resource provider
Once the SQL VM resource provider has been registered to your subscription, you can then register your SQL Server VM with the resource provider using PowerShell. If the SQL IaaS extension has not already been installed to your SQL Server VM, registering will install the SQL IaaS installation in [lightweight mode](virtual-machines-windows-sql-server-agent-extension.md#modes), which will not restart your SQL Server service. 

The following table details the acceptable values for the parameters provided during registration:

| Parameter | Acceptable values                        |
| :------------------| :-------------------------------|
| **sqlLicenseType** | `'AHUB'`, or `'PAYG'`           |
| &nbsp;             | &nbsp;                          |


Register SQL Server VM using PowerShell with the following code snippet:

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register SQL VM with 'Lightweight' SQL IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;sqlLicenseType='AHUB';sqlManagement='LightWeight'}  
  
  ```

## Register Windows Server 2008 images

SQL Server 2008 and 2008 R2 installed on Windows Server 2008 images can be registered with the SQL VM resource provider by utilizing the [noagent](virtual-machines-windows-sql-server-agent-extension.md#modes) mode of the SQL IaaS extension. This option provides limited functionality but will allow the SQL Server VM to be managed in the Azure portal.  

The following table details the acceptable values for the parameters provided during registration:

| Parameter | Acceptable values                                 |
| :------------------| :--------------------------------------- |
| **sqlLicenseType** | `'AHUB'`, or `'PAYG'`                    |
| **sqlImageOffer**  | `'SQL2008-WS2008'` or `'SQL2008R2-WS2008`|
| &nbsp;             | &nbsp;                                   |



To register your Windows Server 2008 image, user PowerShell:  

  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
    New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
      -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
      -Properties @{virtualMachineResourceId=$vm.Id;sqlLicenseType='AHUB'; `
       sqlManagement='NoAgent';sqlImageSku='Standard';sqlImageOffer='SQL2008R2-WS2008'}
  ```

## Verify registration status
You can verify if your SQL Server has already been registered with the SQL VM resource provider using Azure CLI or PowerShell. 

### Azure Portal
To verify the status of registration using the Azure portal, do the following.

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Navigate to your [SQL virtual machines](virtual-machines-windows-sql-manage-portal.md).
1. Select your SQL Server VM from the list. If your SQL Server VM is not listed here, it is likely your SQL Server VM has not been registered with the SQL VM resource provider. 
1. View the value under `Status`. If `Status = Succeeded`, then the SQL Server VM has been registered with the SQL VM resource provider successfully. 

    ![Verify status with SQL RP registration](media/virtual-machines-windows-sql-register-with-rp/verify-registration-status.png)

# [AZ CLI](#tab/bash)

Verify current SQL Server VM registration status with the following AZ CLI command. `ProvisioningState` will show `Succeeded` if registration was successful. 

  ```azurecli-interactive
  az sql vm show -n <vm_name> -g <resource_group>
  ```

Seeing `Microsoft.SqlVirtualMachine` in the **ID** value of the output indicates your SQL Server VM has been registered with the resource provider. 

# [PowerShell](#tab/powershell)

Verify current SQL Server VM registration status with the following PowerShell cmdlet. `ProvisioningState` will show `Succeeded` if registration was successful. 

  ```powershell-interactive
  Get-AzResource -ResourceName <vm_name> -ResourceGroupName <resource_group> -ResourceType Microsoft.SqlVirtualMachine/sqlVirtualMachines
  ```
An error indicates that the SQL Server VM has not been registered with the resource provider. 




## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server on a Windows VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server on a Windows VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server on a Windows VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)


