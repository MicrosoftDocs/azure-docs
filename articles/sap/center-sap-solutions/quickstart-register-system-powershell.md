---
title: Quickstart - Register an existing system with Azure Center for SAP solutions with PowerShell
description: Learn how to register an existing SAP system in Azure Center for SAP solutions through Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 05/04/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to register my existing SAP system so that I can use the system with Azure Center for SAP solutions.
---
# Quickstart: Register an existing SAP system with Azure Center for SAP solutions with PowerShell

The [Azure PowerShell AZ](/powershell/azure/new-azureps-module-az) module is used to create and manage Azure resources from the command line or in scripts.

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. This article shows you how to register an existing SAP system running on Azure with *Azure Center for SAP solutions* using Az PowerShell module. Alternatively, you can register systems using the Azure CLI, or in the [Azure portal.  
After you register an SAP system with *Azure Center for SAP solutions*, you can use its visualization, management and monitoring capabilities through the Azure portal. For example, you can:

- View and track the SAP system as an Azure resource, called the *Virtual Instance for SAP solutions (VIS)*.
- Get recommendations for your SAP infrastructure, Operating System configurations etc. based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and Stop SAP application tier.
- Start and Stop individual instances of ASCS, App server and HANA Database.
- Monitor the Azure infrastructure metrics for the SAP system resources.
- View Cost Analysis for the SAP system.

This quickstart requires the Az PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

## Prerequisites for Registering a system
- Check that you're trying to register a [supported SAP system configuration](/articles/sap/center-sap-solutions/register-existing-system.md)
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
     -CentralServerVmId '/subscriptions/49d64d54-e966-4c46-a868-1999802b762c/resourcegroups/powershell-cli-testrg/providers/microsoft.compute/virtualmachines/l46ascsvm' `
     -Tag @{k1 = "v1"; k2 = "v2"} `
     -ManagedResourceGroupName "L46-rg" `
     -ManagedRgStorageAccountName 'acssstoragel46' `
     -IdentityType 'UserAssigned' `
     -UserAssignedIdentity @{'/subscriptions/49d64d54-e966-4c46-a868-1999802b762c/resourcegroups/SAP-E2ETest-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/E2E-RBAC-MSI'= @{}} `
     ```
