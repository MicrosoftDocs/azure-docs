---
title: Automatic registration with SQL VM resource provider
description: Learn how to enable the automatic registration feature to automatically register all past and future SQL Server VMs with the SQL VM resource provider using the Azure portal. 
author: MashaMSFT
ms.author: mathoma
tags: azure-service-management
ms.service: virtual-machines-sql
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 09/21/2020
---
# Automatic registration with SQL VM resource provider
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

Enable the automatic registration feature in the Azure portal to automatically register all current and future SQL Server on Azure Virtual Machines (VMs) with the SQL VM resource provider in lightweight mode. Registering with the SQL VM resource provider installs the [SQL IaaS Agent extension](sql-server-iaas-agent-extension-automate-management.md).

This article teaches you to enable the automatic registration feature. Alternatively, you can [register a single VM](sql-vm-resource-provider-register.md), or [register your VMs in bulk](sql-vm-resource-provider-bulk-register.md) with the SQL VM resource provider. 

## Overview

Registering your SQL Server VM with the SQL VM resource provider installs the [SQL IaaS Agent extension](sql-server-iaas-agent-extension-automate-management.md). 

When automatic registration is enabled, a job runs daily to detect whether or not SQL Server is installed on all the unregistered VMs in the subscription. This is done by copying the SQL IaaS agent extension binaries to the VM, then running a one-time utility that checks for the SQL Server registry hive. If the SQL Server hive is detected, the virtual machine is registered with the [SQL VM resource provider](sql-vm-resource-provider-register.md) in lightweight mode. If no SQL Server hive exists in the registry, the binaries are removed.

Once automatic registration is enabled for a subscription, all current and future VMs that have SQL Server installed will be registered with the SQL VM resource provider in lightweight mode. You still need to  [manually upgrade to full manageability mode](sql-vm-resource-provider-register.md#upgrade-to-full) to take advantage of the full feature set. 

## Prerequisites

To register your SQL Server VM with the resource provider, you'll need: 

- An [Azure subscription](https://azure.microsoft.com/free/).
- An Azure Resource Model [Windows Server 2008 R2 (or later) virtual machine](../../../virtual-machines/windows/quick-create-portal.md) with [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) deployed to the public or Azure Government cloud. Windows Server 2008 is not supported. 


## Enable

To enable automatic registration of your SQL Server VMs in the Azure portal, follow these steps:

1. Sign into the [Azure portal](https://portal.azure.com).
1. Navigate to the [**SQL virtual machines**](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) resource page. 
1. Select **Automatic SQL Server VM registration** to open the **Automatic registration** page. 

   :::image type="content" source="media/sql-vm-resource-provider-automatic-registration/automatic-registration.png" alt-text="Select Automatic SQL Server VM registration to open the automatic registration page":::

1. Choose your subscription from the drop-down. 
1. Read through the terms and if you agree, select **I accept**. 
1. Select **Register** to enable the feature and automatically register all current and future SQL Server VMs with the SQL VM resource provider. This will not restart the SQL Server service on any of the VMs. 

## Disable

Use the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-az-ps) to disable the automatic registration feature. When the automatic registration feature is disabled, SQL Server VMs added to the subscription need to be manually registered with the SQL VM resource provider. This will not unregister existing SQL Server VMs that have already been registered.



# [Azure CLI](#tab/azure-cli)

To disable automatic registration using Azure CLI, run the following command: 

```azurecli-interactive
az feature unregister --namespace Microsoft.SqlVirtualMachine --name BulkRegistration
```

# [PowerShell](#tab/azure-powershell)

To disable automatic registration using Azure PowerShell, run the following command: 

```powershell-interactive
Unregister-AzProviderFeature -FeatureName BulkRegistration -ProviderNamespace Microsoft.SqlVirtualMachine
```

---

## Enable for multiple subscriptions

You can enable the automatic registration feature for multiple Azure subscriptions by using PowerShell. 

To do so, follow these steps:

1. Save [this script](https://github.com/microsoft/tigertoolbox/blob/master/AzureSQLVM/RegisterSubscriptionsToSqlVmAutomaticRegistration.ps1) to a `.ps1` file, such as `EnableBySubscription.ps1`. 
1. Navigate to where you saved the script by using an administrative Command Prompt or PowerShell window. 
1. Connect to Azure (`az login`).
1. Execute the script, passing in SubscriptionIds as parameters such as   
   `.\EnableBySubscription.ps1 -SubscriptionList SubscriptionId1,SubscriptionId2`

   For example: 

   ```console
   .\EnableBySubscription.ps1 -SubscriptionList a1a1a-aa11-11aa-a1a1-a11a111a1,b2b2b2-bb22-22bb-b2b2-b2b2b2bb
   ```

Failed registration errors are stored in `RegistrationErrors.csv` located in the same directory where you saved and executed the `.ps1` script from. 

## Next steps

Upgrade your manageability mode to [full](sql-vm-resource-provider-register.md#upgrade-to-full) to take advantage of the full feature set provided to you by the SQL VM resource provider. 
