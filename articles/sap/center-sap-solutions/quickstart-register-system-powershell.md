---
title: Quickstart - Register an existing system with Azure Center for SAP solutions with PowerShell
description: Learn how to register an existing SAP system in Azure Center for SAP solutions through Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: references_regions, devx-track-azurepowershell
ms.topic: how-to
ms.date: 05/04/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to register my existing SAP system so that I can use the system with Azure Center for SAP solutions.
---
# Quickstart: Register an existing SAP system with Azure Center for SAP solutions with PowerShell

The [Azure PowerShell AZ](/powershell/azure/new-azureps-module-az) module is used to create and manage Azure resources from the command line or in scripts.

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. This article shows you how to register an existing SAP system running on Azure with *Azure Center for SAP solutions* using Az PowerShell module. Alternatively, you can register systems using the Azure CLI, or in the Azure portal.  
After you register an SAP system with *Azure Center for SAP solutions*, you can use its visualization, management and monitoring capabilities through the Azure portal.

This quickstart requires the Az PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

## Prerequisites for Registering a system
- Check that you're trying to register a [supported SAP system configuration](/azure/sap/center-sap-solutions/register-existing-system#supported-systems)
- Grant access to Azure Storage accounts from the virtual network where the SAP system exists. Use one of these options:
    - Allow outbound internet connectivity for the VMs.
    - Use a [**Storage** service tag](../../virtual-network/service-tags-overview.md) to allow connectivity to any Azure storage account from the VMs.
    - Use a [**Storage** service tag with regional scope](../../virtual-network/service-tags-overview.md) to allow storage account connectivity to the Azure storage accounts in the same region as the VMs.
    - Allowlist the region-specific IP addresses for Azure Storage.
- The first time you use Azure Center for SAP solutions, you must register the **Microsoft.Workloads** Resource Provider in the subscription where you have the SAP system with [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider), as follows:

    ```powershell
    Register-AzResourceProvider -ProviderNamespace "Microsoft.Workloads"
    ```
- Check that your Azure account has **Azure Center for SAP solutions administrator** and **Managed Identity Operator** or equivalent role access on the subscription or resource groups where you have the SAP system resources.
- A **User-assigned managed identity** which has **Azure Center for SAP solutions service role** access on the Compute resource group and **Reader** role access on the Virtual Network resource group of the SAP system. Azure Center for SAP solutions service uses this identity to discover your SAP system resources and register the system as a VIS resource.
- Make sure ASCS, Application Server and Database virtual machines of the SAP system are in **Running** state.
- sapcontrol and saphostctrl exe files must exist on ASCS, App server and Database.
    - File path on Linux VMs: /usr/sap/hostctrl/exe
    - File path on Windows VMs: C:\Program Files\SAP\hostctrl\exe\
- Make sure the **sapstartsrv** process is running on all **SAP instances** and for **SAP hostctrl agent** on all the VMs in the SAP system.
    - To start hostctrl sapstartsrv use this command for Linux VMs: 'hostexecstart -start'
    - To start instance sapstartsrv use the command: 'sapcontrol -nr 'instanceNr' -function StartService S0S'
    - To check status of hostctrl sapstartsrv use this command for Windows VMs: C:\Program Files\SAP\hostctrl\exe\saphostexec –status
- For successful discovery and registration of the SAP system, ensure there is network connectivity between ASCS, App and DB VMs. 'ping' command for App instance hostname must be successful from ASCS VM. 'ping' for Database hostname must be successful from App server VM.
- On App server profile, SAPDBHOST, DBTYPE, DBID parameters must have the right values configured for the discovery and registration of Database instance details.

## Register SAP system

To register an existing SAP system in Azure Center for SAP solutions:

1. Use the  [New-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/New-AzWorkloadsSapVirtualInstance) to register an existing SAP system as a *Virtual Instance for SAP solutions* resource:

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
       -IdentityType 'UserAssigned' `
       -UserAssignedIdentity @{'/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ACSS-MSI'= @{}} `
     ```
   - **ResourceGroupName** is used to specify the name of the existing Resource Group into which you want the Virtual Instance for SAP solutions resource to be deployed. It could be the same RG in which you have Compute, Storage resources of your SAP system or a different one. 
   - **Name** attribute is used to specify the SAP System ID (SID) that you are registering with Azure Center for SAP solutions.
   - **Location** attribute is used to specify the Azure Center for SAP solutions service location. Following table has the mapping that enables you to choose the right service location based on where your SAP system infrastructure is located on Azure.

   | **SAP application location** | **Azure Center for SAP solutions service location** |
   | ------------------------| --------------------------------------------------- |
   | East US | East US |
   | East US 2 | East US 2|
   | South Central US | East US 2 |
   | Central US | East US 2|
   | West US 2 | West US 3 |
   | West US 3 | West US 3 |
   | West Europe | West Europe |
   | North Europe | North Europe |
   | Australia East | Australia East |
   | Australia Central | Australia East |
   | East Asia | East Asia |
   | Southeast Asia | East Asia |
   | Central India | Central India |

   - **Environment** is used to specify the type of SAP environment you are registering. Valid values are *NonProd* and *Prod*.
   - **SapProduct** is used to specify the type of SAP product you are registering. Valid values are *S4HANA*, *ECC*, *Other*.
   - **ManagedResourceGroupName** is used to specify the name of the managed resource group which is deployed by ACSS service in your Subscription. This RG is unique for each SAP system (SID) you register. If you do not specify the name, ACSS service sets a name with this naming convention 'mrg-{SID}-{random string}'.
   - **ManagedRgStorageAccountName** is used to specify the name of the Storage Account which is deployed into the managed resource group. This storage account is unique for each SAP system (SID) you register. ACSS service sets a default name using '{SID}{random string}' naming convention. 

2. Once you trigger the registration process, you can view its status by getting the status of the Virtual Instance for SAP solutions resource that gets deployed as part of the registration process.

   ```powershell
   Get-AzWorkloadsSapVirtualInstance -ResourceGroupName TestRG -Name L46
   ```

## Next steps

- [Monitor SAP system from Azure portal](monitor-portal.md)
- [Manage a VIS](manage-virtual-instance.md)
