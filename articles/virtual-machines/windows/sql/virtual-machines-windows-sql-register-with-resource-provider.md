---
title: Register a SQL Server virtual machine in Azure with the SQL VM resource provider | Microsoft Docs
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
# Register a SQL Server virtual machine in Azure with the SQL VM resource provider

This article describes how to register your SQL Server virtual machine (VM) in Azure with the SQL VM resource provider. 

Deploying a SQL Server VM Azure Marketplace image through the Azure portal automatically registers the SQL Server VM with the resource provider. If you choose to self-install SQL Server on an Azure virtual machine instead of choosing an image from Azure Marketplace, or if you provision an Azure VM from a custom VHD with SQL Server, you should register your SQL Server VM with the resource provider for:

- **Compliance**: According to the Microsoft Product Terms, customers must tell Microsoft when they're using the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/). To do so, they must register with the SQL VM resource provider. 

- **Feature benefits**: Registering your SQL Server VM with the resource provider unlocks [automated patching](virtual-machines-windows-sql-automated-patching.md), [automated backup](virtual-machines-windows-sql-automated-backup-v2.md), and monitoring and manageability capabilities. It also unlocks [licensing](virtual-machines-windows-sql-ahb.md) and [edition](virtual-machines-windows-sql-change-edition.md) flexibility. Previously, these features were available only to SQL Server VM images from Azure Marketplace.

To utilize the SQL VM resource provider, you must also register the SQL VM resource provider with your subscription. You can accomplish this by using the Azure portal, the Azure CLI, or PowerShell. 

## Prerequisites

To register your SQL Server VM with the resource provider, you'll need the following: 

- An [Azure subscription](https://azure.microsoft.com/free/).
- A [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision). 
- The [Azure CLI](/cli/azure/install-azure-cli) and [PowerShell](/powershell/azure/new-azureps-module-az). 


## Register with SQL VM resource provider
If the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md) is not installed on the VM, then you can register with SQL VM resource provider by specifying the lightweight SQL management mode. In lightweight SQL management mode, SQL VM resource provider will auto install SQL IaaS Extension in [lightweight mode](virtual-machines-windows-sql-server-agent-extension.md#install-in-lightweight-mode) and verify SQL Server instance metadata; this will not restart SQL Server service. You need to provide the type of SQL Server license desired when registering with SQL VM resource provider as either 'PAYG 'or 'AHUB'.

Registering with the SQL VM resource provider in [lightweight mode](virtual-machines-windows-sql-server-agent-extension.md#install-in-lightweight-mode) will assure compliance and enable flexible licensing as well as in-place SQL Server edition updates. Failover Cluster Instances and multi-instance deployments can be registered with SQL VM resource provider only in lightweight mode. You can follow the directions found on the Azure portal to upgrade to [full mode](virtual-machines-windows-sql-server-agent-extension.md#install-in-full-mode) and enable comprehensive manageability feature set with a SQL Server restart anytime. 


# [PowerShell](#tab/powershell)
Use the following code snippet to register with the SQL VM resource provider if the SQL Server IaaS extension is already installed on the VM. You need to provide the type of SQL Server license that you want when registering with the SQL VM resource provider: either pay-as-you-go (`PAYG`) or Azure Hybrid Benefit (`AHUB`). 

Register the SQL Server VM by using the following PowerShell code snippet:

  ```powershell-interactive
     # Get the existing compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     # Register SQL VM with 'Lightweight' SQL IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;SqlServerLicenseType='AHUB';sqlManagement='LightWeight'}  
  
  ```

# [AZ CLI](#tab/bash)

For paid editions (Enterprise or Standard):

  ```azurecli-interactive
  # Register Enterprise or Standard self-installed VM in Lightweight mode

  az sql vm create --name <vm_name> --resource-group <resource_group_name> --location <vm_location> --license-type AHUB 

  ```

For free editions (Developer, Web, or Express):

  ```azurecli-interactive
  # Register Developer, Web, or Express self-installed VM in Lightweight mode

  az sql vm create --name <vm_name> --resource-group <resource_group_name> --location <vm_location> --license-type PAYG 
  ```
---

If the SQL IaaS Extension is already installed on the VM, then registering with SQL VM resource provider is simply creating a metadata resource of type Microsoft.SqlVirtualMachine/SqlVirtualMachines. Below is the code snippet to register with SQL VM resource provider if the SQL IaaS Extension is already installed on the VM. You need to provide the type of SQL Server license desired when registering with SQL VM resource provider as either 'PAYG 'or 'AHUB'.

  ```powershell-interactive
  # Get the existing  Compute VM
   $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
        
   # Register with SQL VM resource provider
   New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
      -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
      -Properties @{virtualMachineResourceId=$vm.Id;SqlServerLicenseType='AHUB'}
  ```


## Register SQL Server 2008 or 2008 R2 on Windows Server 2008 VMs

SQL Server 2008 and 2008 R2 installed on Windows Server 2008 can be registered with the SQL VM resource provider in the [no-agent](virtual-machines-windows-sql-server-agent-extension.md) mode. This option assures compliance and allows the SQL Server VM to be monitored in the Azure portal with limited functionality.

The following table details the acceptable values for the parameters provided during registration:

| Parameter | Acceptable values                                 |
| :------------------| :--------------------------------------- |
| **sqlLicenseType** | `AHUB` or `PAYG`                    |
| **sqlImageOffer**  | `SQL2008-WS2008` or `SQL2008R2-WS2008`|
| &nbsp;             | &nbsp;                                   |


To register your SQL Server 2008 or 2008 R2 instance on Windows Server 2008 instance, use the following Powershell or Az CLI code snippet:  

# [PowerShell](#tab/powershell)
  ```powershell-interactive
     # Get the existing compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
    New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
      -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
      -Properties @{virtualMachineResourceId=$vm.Id;SqlServerLicenseType='AHUB'; `
       sqlManagement='NoAgent';sqlImageSku='Standard';sqlImageOffer='SQL2008R2-WS2008'}
  ```

# [AZ CLI](#tab/bash)

  ```azurecli-interactive
   az sql vm create -n sqlvm -g myresourcegroup -l eastus |
   --license-type AHUB --sql-mgmt-type NoAgent 
   --image-sku Enterprise --image-offer SQL2008-WS2008R2
 ```

---

## Verify registration status
You can verify if your SQL Server VM has already been registered with the SQL VM resource provider by using the Azure portal, the Azure CLI, or PowerShell. 

### Azure portal 

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Go to your [SQL Server virtual machines](virtual-machines-windows-sql-manage-portal.md).
1. Select your SQL Server VM from the list. If your SQL Server VM is not listed here, it likely hasn't been registered with the SQL VM resource provider. 
1. View the value under **Status**. If **Status** is **Succeeded**, then the SQL Server VM has been registered with the SQL VM resource provider successfully. 

![Verify status with SQL RP registration](media/virtual-machines-windows-sql-register-with-rp/verify-registration-status.png)

### Command line

Verify current SQL Server VM registration status using either Az CLI or PowerShell. `ProvisioningState` will show `Succeeded` if registration was successful. 

# [AZ CLI](#tab/bash)


  ```azurecli-interactive
  az sql vm show -n <vm_name> -g <resource_group>
 ```


# [PowerShell](#tab/powershell)

  ```powershell-interactive
  Get-AzResource -ResourceName <vm_name> -ResourceGroupName <resource_group> `
  -ResourceType Microsoft.SqlVirtualMachine/sqlVirtualMachines
  ```

---

An error indicates that the SQL Server VM has not been registered with the resource provider. 

## Register the SQL VM resource provider with a subscription 

To register your SQL Server VM with the SQL VM resource provider, you must register the resource provider with your subscription. You can do so by using the Azure portal, the Azure CLI, or PowerShell.

### Azure portal

1. Open the Azure portal and go to **All Services**. 
1. Go to **Subscriptions** and select the subscription of interest.  
1. On the **Subscriptions** page, go to **Resource providers**. 
1. Enter **sql** in the filter to bring up the SQL-related resource providers. 
1. Select **Register**, **Re-register**, or **Unregister** for the  **Microsoft.SqlVirtualMachine** provider, depending on your desired action. 

![Modify the provider](media/virtual-machines-windows-sql-ahb/select-resource-provider-sql.png)


### Command line

Register your SQL VM resource provider to your Azure subscription using either Az CLI or PowerShell. 

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

## Remarks

- The SQL VM resource provider supports only SQL Server VMs deployed through Azure Resource Manager. SQL Server VMs deployed through the classic model are not supported. 
- The SQL VM resource provider supports only SQL Server VMs deployed to the public cloud. Deployments to the private or government cloud are not supported. 
 

## Frequently asked questions 

**Should I register my SQL Server VM provisioned from a SQL Server image in Azure Marketplace?**

No. Microsoft automatically registers VMs provisioned from the SQL Server images in Azure Marketplace. Registering with the SQL VM resource provider is required only if the VM was *not* provisioned from the SQL Server images in Azure Marketplace and SQL Server was self-installed.

**Is the SQL VM resource provider available for all customers?** 

Yes. Customers should register their SQL Server VMs with the SQL VM resource provider if they did not use a SQL Server image from Azure Marketplace and instead self-installed SQL Server, or if they brought their custom VHD. VMs owned by all types of subscriptions (Direct, Enterprise Agreement, and Cloud Solution Provider) can register with the SQL VM resource provider.

**Should I register with the SQL VM resource provider if my SQL Server VM already has the SQL Server IaaS extension installed?**

If your SQL Server VM is self-installed and not provisioned from the SQL Server images in Azure Marketplace, you should register with the SQL VM resource provider even if you installed the SQL Server IaaS extension. Registering with the SQL VM resource provider creates a new resource of type Microsoft.SqlVirtualMachines. Installing the SQL Server IaaS extension does not create that resource.

**What is the default management mode when registering with the SQL VM resource provider?**

The default management mode when you register with the SQL VM resource provider is *full*. If the SQL Server management property isn't set when you register with the SQL VM resource provider, the mode will be set as full manageability. Having the SQL Server IaaS extension installed on the VM is the prerequisite to registering with the SQL VM resource provider in full manageability mode.

**What are the prerequisites to register with the SQL VM resource provider?**

There are no prerequisites to registering with the SQL VM resource provider in lightweight mode or no-agent mode. The prerequisite to registering with the SQL VM resource provider in full mode is having the SQL Server IaaS extension installed on the VM.

**Can I register with the SQL VM resource provider if I don't have the SQL Server IaaS extension installed on the VM?**

Yes, you can register with the SQL VM resource provider in lightweight management mode if you don't have the SQL Server IaaS extension installed on the VM. In lightweight mode, the SQL VM resource provider will use a console app to verify the version and edition of the SQL Server instance. 

The default SQL management mode when registering with SQL VM resource provider is _Full_. If SQL Management property is not set when registering with SQL VM resource provider, then the mode will be set as Full Manageability. Having SQL IaaS Extension installed on the VM is the prerequisite to registering with SQL VM resource provider in Full Manageability mode.

**Will registering with the SQL VM resource provider install an agent on my VM?**

No. Registering with the SQL VM resource provider will only create a new metadata resource. It won't install an agent on the VM.

The SQL Server IaaS extension is needed only for enabling full manageability. Upgrading the manageability mode from lightweight to full will install the SQL Server IaaS extension and will restart SQL Server.

**Will registering with the SQL Server VM resource provider restart SQL Server on my VM?**

No. Registering with the SQL VM resource provider will only create a new metadata resource. It won't restart SQL Server on the VM. 

Restarting SQL Server is needed only to install the SQL Server IaaS extension. And the SQL Server IaaS extension is needed for enabling full manageability. Upgrading the manageability mode from lightweight to full will install the SQL Server IaaS extension and will restart SQL Server.

**What is the difference between lightweight and no-agent management modes when registering with the SQL VM resource provider?** 

No-agent management mode is available only for SQL Server 2008 and SQL Server 2008 R2 on Windows Server 2008. It's the only available management mode for these versions. For all other versions of SQL Server, the two available manageability modes are lightweight and full. 

No-agent mode requires SQL Server version and edition properties to be set by the customer. Lightweight mode queries the VM to find the version and edition of the SQL Server instance.

**Can I register with the SQL VM resource provider in lightweight or no-agent mode by using the Azure CLI?**

No. The management mode property is available only when you're registering with the SQL VM resource provider by using Azure PowerShell. The Azure CLI does not support setting the SQL Server manageability property. It always registers with the SQL VM resource provider in the default mode, full manageability.

**Can I register with the SQL VM resource provider without specifying the SQL Server license type?**

No. The SQL Server license type is not an optional property when you're registering with the SQL VM resource provider. You have to set the SQL Server license type as pay-as-you-go or Azure Hybrid Benefit when registering with the SQL VM resource provider in all manageability modes (no-agent, lightweight, and full) by using both the Azure CLI and PowerShell.

**Can I upgrade the SQL Server IaaS extension from no-agent mode to full mode?**

No. Upgrading the manageability mode to full or lightweight is not available for no-agent mode. This is a technical limitation of Windows Server 2008.

**Can I upgrade the SQL Server IaaS extension from lightweight mode to full mode?**

Yes. Upgrading the manageability mode from lightweight to full is supported via PowerShell or the Azure portal. It requires restarting SQL Server.

**Can I downgrade the SQL Server IaaS extension from full mode to no-agent or lightweight management mode?**

No. Downgrading the SQL Server IaaS extension manageability mode is not supported. The manageability mode can't be downgraded from full mode to lightweight or no-agent mode, and it can't be downgraded from lightweight mode to no-agent mode. 

To change the manageability mode from full manageability, remove the SQL Server IaaS extension. Then, drop the Micorsoft.SqlVirtualMachine resource and re-register the SQL Server VM with the SQL VM resource provider.

**Can I register with the SQL VM resource provider from the Azure portal?**

No. Registering with the SQL VM resource provider is not available in the Azure portal. Registering with the SQL VM resource provider in full manageability mode is supported with the Azure CLI or PowerShell. Registering with the SQL VM resource provider in lightweight or no-agent manageability mode is supported only by Azure PowerShell APIs.

**Can I register a VM with the SQL VM resource provider before SQL Server is installed?**

No. A VM should have at least one SQL Server instance to successfully register with the SQL VM resource provider. If there is no SQL Server instance on the VM, the new Micosoft.SqlVirtualMachine resource will be in a failed state.

**Can I register a VM with the SQL VM resource provider if there are multiple SQL Server instances?**

Yes. The SQL VM resource provider will register only one SQL Server instance. The SQL VM resource provider will register the default SQL Server instance in the case of multiple instances. If there is no default instance, then only registering in lightweight mode is supported. To upgrade from lightweight to full manageability mode, either the default SQL Server instance should exist or the VM should have only one named SQL Server instance.

**Can I register a SQL Server failover cluster instance with the SQL VM resource provider?**

Yes. SQL Server failover cluster instances on an Azure VM can be registered with the SQL VM resource provider in lightweight mode. However, SQL Server failover cluster instances can't be upgraded to full manageability mode.

**Can I register my VM with the SQL VM resource provider if an Always On availability group is configured?**

Yes. There are no restrictions to registering a SQL Server instance on an Azure VM with the SQL VM resource provider if you're participating in an Always On availability group configuration.

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [FAQ for SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-faq.md)
* [Pricing guidance for SQL Server on a Windows VM](virtual-machines-windows-sql-server-pricing-guidance.md)
* [Release notes for SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-release-notes.md)
