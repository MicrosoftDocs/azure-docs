---
title: Register an Existing SAP System with Azure PowerShell
description: Learn how to register an existing SAP system in Azure Center for SAP solutions through an Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: references_regions, devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/18/2026
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As an SAP administrator, I want to register my existing SAP system with Azure Center for SAP solutions by using Azure PowerShell, so that I can use Azure management and monitoring capabilities for my SAP infrastructure.
---
# Register an existing SAP system with Azure Center for SAP solutions by using Azure PowerShell

Use the Azure PowerShell module to register an existing SAP system with Azure Center for SAP solutions. After you register the system, Azure Center for SAP solutions creates a Virtual Instance for SAP solutions (VIS) resource that provides visualization, management, and monitoring capabilities through the Azure portal. You can also register systems by using the [Azure CLI](quickstart-register-system-cli.md) or the [Azure portal](register-existing-system.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The Az PowerShell module version 1.0.0 or later. To find the version, run `Get-Module -ListAvailable Az`. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

- A [supported SAP system configuration](/azure/sap/center-sap-solutions/register-existing-system#supported-systems).

- Network access to Azure Storage accounts from the virtual network where the SAP system exists. Use one of these options:
  
  - Allow outbound internet connectivity for the virtual machines (VMs).
  
  - Use a **Storage** [service tag](../../virtual-network/service-tags-overview.md) to allow connectivity to any Azure Storage account from the VMs.
  
  - Use a **Storage** [service tag with regional scope](../../virtual-network/service-tags-overview.md) to allow storage account connectivity to the Azure Storage accounts in the same region as the VMs.
  
  - Add the region-specific IP addresses for Azure Storage to your allow list.

- The first time you use Azure Center for SAP solutions, you must register the `Microsoft.Workloads` resource provider in the subscription where you have the SAP system with [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider), as follows:

   ```powershell
   Register-AzResourceProvider -ProviderNamespace "Microsoft.Workloads"
   ```

- On the subscription or resource groups where you have the SAP system resources, confirm that your Azure account has **Azure Center for SAP solutions administrator** and **Managed Identity Operator** or equivalent role access.

- Confirm that **User-assigned managed identity** has the following access roles: **Azure Center for SAP solutions service** role access on the compute resource group, and **Reader** role access on the virtual network resource group of the SAP system. Azure Center for SAP solutions uses this identity to discover your SAP system resources and register the system as a VIS resource.

- Make sure that Advanced Business Application Programming SAP Central Services (ASCS), the application server, and database VMs of the SAP system are in the **Running** state.

- `sapcontrol` and `saphostctrl` executable files must exist on ASCS, the application server, and the database.
  
  - File path on Linux VMs: `/usr/sap/hostctrl/exe`
  
  - File path on Windows VMs: `C:\Program Files\SAP\hostctrl\exe\`

- Make sure that the **sapstartsrv** process runs on all SAP instances and for the **SAP hostctrl agent** on all the VMs in the SAP system.
  
  - To start `hostctrl` `sapstartsrv`, use this command for Linux VMs: `hostexecstart -start`.
  
  - To start an instance of `sapstartsrv`, use the command: `sapcontrol -nr instanceNr -function StartService S0S`.
  
  - To check the status of `hostctrl` `sapstartsrv`, use this command for Windows VMs: `C:\Program Files\SAP\hostctrl\exe\saphostexec –status`.

- For successful discovery and registration of the SAP system, ensure that there's network connectivity between ASCS, the application server, and database VMs. The `ping` command for the app instance host name must be successful from an ASCS VM. When you ping the database host name, it must be successful from the app server VM.

- On the app server profile, `SAPDBHOST`, `DBTYPE`, and `DBID` parameters must have the right values configured for the discovery and registration of database instance details.

## Register an SAP system

To register an existing SAP system in Azure Center for SAP solutions:

1. Use the [New-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/New-AzWorkloadsSapVirtualInstance) module to register an existing SAP system as a Virtual Instance for SAP solutions resource:

     ```powershell
     New-AzWorkloadsSapVirtualInstance `
       -ResourceGroupName 'TestRG' `
       -Name L46 `
       -Location eastus `
       -Environment 'NonProd' `
       -SapProduct 'S4HANA' `
       -CentralServerVmId '/subscriptions/sub1/resourcegroups/rg1/providers/microsoft.compute/virtualmachines/l46ascsvm' `
       -Tag @{k1 = "v1"; k2 = "v2"} `
       -ManagedResourceGroupName "acss-L46-rg" `
       -ManagedRgStorageAccountName 'acssstoragel46' `
       -ManagedResourcesNetworkAccessType 'private' `
       -IdentityType 'UserAssigned' `
       -UserAssignedIdentity @{'/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ACSS-MSI'= @{}} `
     ```
  
   - `ResourceGroupName` specifies the name of the existing resource group into which you want the Virtual Instance for SAP solutions resource to be deployed. It can be the same resource group in which you have compute and storage resources of your SAP system, or it can be a different one.
  
   - `Name` specifies the SAP system ID (SID) that you're registering with Azure Center for SAP solutions.
  
   - `Location` specifies the Azure Center for SAP solutions service location. To choose the right service location based on where your SAP system infrastructure is located on Azure, refer to the following table.

       | SAP application location | Azure Center for SAP solutions service location |
       | ------------------------- | --------------------------------------------------- |
       | East US | East US |
       | East US 2 | East US 2 |
       | North Central US | South Central US |
       | South Central US | South Central US |
       | Central US | South Central US |
       | West US | West US 3 |
       | West US 2 | West US 2 |
       | West US 3 | West US 3 |
       | West Europe | West Europe |
       | North Europe | North Europe |
       | Australia East | Australia East |
       | Australia Central | Australia East |
       | East Asia | East Asia |
       | Southeast Asia | East Asia |
       | Korea Central | Korea Central |
       | Japan East | Japan East |
       | Central India | Central India |
       | Canada Central | Canada Central |
       | Brazil South | Brazil South |
       | UK South | UK South |
       | Germany West Central | Germany West Central |
       | Sweden Central | Sweden Central |
       | France Central | France Central |
       | Switzerland North | Switzerland North |
       | Norway East | Norway East |
       | South Africa North | South Africa North |
       | UAE North | UAE North |
  
   - `Environment` specifies the type of SAP environment that you're registering. Valid values are `NonProd` and `Prod`.
  
   - `SapProduct` specifies the type of SAP product that you're registering. Valid values are `S4HANA`, `ECC`, and `Other`.
  
   - `ManagedResourceGroupName` specifies the name of the managed resource group deployed by the Azure Cloud Solution for SAP (ACSS) service in your subscription. This resource group is unique for each SAP SID that you register. If you don't specify the name, the ACSS service sets a name with the following naming convention: `mrg-{SID}-{random string}`.
  
   - `ManagedRgStorageAccountName` specifies the name of the storage account deployed into the managed resource group. This storage account is unique for each SAP SID that you register. The ACSS service sets a default name with the following naming convention: `{SID}{random string}`.
  
   - `ManagedResourcesNetworkAccessType` specifies the network access configuration for the resources deployed in the managed resource group. The options are `public` and `private`. If you choose private, enable the storage account service tag on the subnets in which the SAP VMs exist. This step is required for establishing connectivity between VM extensions and the managed resource group storage account. This setting is currently applicable only to the storage account.

1. After you trigger the registration process, you can view its status by getting the status of the Virtual Instance for SAP solutions resource that gets deployed as part of the registration process.

   ```powershell
   Get-AzWorkloadsSapVirtualInstance -ResourceGroupName TestRG -Name L46
   ```

## Related content

- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Manage a VIS](manage-virtual-instance.md)
