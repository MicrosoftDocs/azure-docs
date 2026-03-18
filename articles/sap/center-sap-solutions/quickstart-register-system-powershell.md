---
title: Register an existing SAP system with Azure Center for SAP solutions using Azure PowerShell
description: Learn how to register an existing SAP system in Azure Center for SAP solutions by using the Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: references_regions, devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/18/2026
ms.author: kanamudu
author: kalyaninamuduri
# Customer intent: As an SAP administrator, I want to register my existing SAP system with Azure Center for SAP solutions by using PowerShell, so that I can use the platform's management and monitoring capabilities for my SAP infrastructure.
---

# Quickstart: Register an existing SAP system with Azure Center for SAP solutions using Azure PowerShell

In this quickstart, you use the Azure PowerShell module to register an existing SAP system with Azure Center for SAP solutions. After you register the system, Azure Center for SAP solutions creates a Virtual Instance for SAP solutions (VIS) resource that provides visualization, management, and monitoring capabilities through the Azure portal. You can also register systems by using the [Azure CLI](quickstart-register-system-cli.md) or the [Azure portal](register-existing-system.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The Az PowerShell module version 1.0.0 or later. To find the version, run `Get-Module -ListAvailable Az`. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).
- A [supported SAP system configuration](/azure/sap/center-sap-solutions/register-existing-system#supported-systems).
- Network access to Azure Storage accounts from the virtual network where the SAP system exists. Use one of these options:

  - Allow outbound internet connectivity for the virtual machines (VMs).
  - Use a [**Storage** service tag](../../virtual-network/service-tags-overview.md) to allow connectivity to any Azure storage account from the VMs.
  - Use a [**Storage** service tag with regional scope](../../virtual-network/service-tags-overview.md) to allow storage account connectivity to the Azure storage accounts in the same region as the VMs.
  - Add the region-specific IP addresses for Azure Storage to an allow list.

- The first time you use Azure Center for SAP solutions, register the **Microsoft.Workloads** resource provider in the subscription where you have the SAP system by using [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider):

  ```azurepowershell
  Register-AzResourceProvider -ProviderNamespace "Microsoft.Workloads"
  ```

- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** or equivalent role access on the subscription or resource groups where the SAP system resources exist.
- A user-assigned managed identity that has **Azure Center for SAP solutions service role** access on the compute resource group and **Reader** role access on the virtual network resource group of the SAP system. Azure Center for SAP solutions uses this identity to discover your SAP system resources and register the system as a VIS resource.
- Advanced Business Application Programming Central Services (ASCS), Application Server, and Database VMs of the SAP system in **Running** state.
- The `sapcontrol` and `saphostctrl` executable files on ASCS, Application Server, and Database VMs:

  - Linux VMs: `/usr/sap/hostctrl/exe`
  - Windows VMs: `C:\Program Files\SAP\hostctrl\exe\`

- The `sapstartsrv` process running on all SAP instances and for the SAP `hostctrl` agent on all VMs in the SAP system.

  - To start `hostctrl` `sapstartsrv` on Linux VMs, run: `hostexecstart -start`
  - To start instance `sapstartsrv`, run: `sapcontrol -nr <instanceNr> -function StartService S0S`
  - To check the status of `hostctrl` `sapstartsrv` on Windows VMs, run: `C:\Program Files\SAP\hostctrl\exe\saphostexec –status`

- Network connectivity between ASCS, Application Server, and Database VMs for successful discovery and registration. The `ping` command for the Application Server instance hostname must succeed from the ASCS VM. The `ping` command for the database hostname must succeed from the Application Server VM.

- On the Application Server profile, the `SAPDBHOST`, `DBTYPE`, and `DBID` parameters must have the correct values configured for discovery and registration of the database instance.

## Register an SAP system

To register an existing SAP system in Azure Center for SAP solutions:

1. Use `New-AzWorkloadsSapVirtualInstance` to register an existing SAP system as a *Virtual Instance for SAP solutions* resource:

   ```azurepowershell
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

1. After you trigger the registration process, view its status by getting the VIS resource status:

   ```azurepowershell
   Get-AzWorkloadsSapVirtualInstance -ResourceGroupName TestRG -Name L46
   ```

The following table describes the parameters:

| Parameter | Description |
|---|---|
| **ResourceGroupName** | The name of the existing resource group where the VIS resource is deployed. This resource group can be the same one that contains your SAP system's compute and storage resources, or a different one. |
| **Name** | The SAP system ID (SID) that you're registering. |
| **Location** | The Azure Center for SAP solutions service location. See the [region mapping table](#region-mapping) for valid values. |
| **Environment** | The SAP environment type. Valid values are `NonProd` and `Prod`. |
| **SapProduct** | The SAP product type. Valid values are `S4HANA`, `ECC`, and `Other`. |
| **ManagedResourceGroupName** | The name of the managed resource group that Azure Center for SAP solutions deploys in your subscription. This group is unique for each SAP system (SID). If you don't specify a name, the default naming convention is `mrg-{SID}-{random string}`. |
| **ManagedRgStorageAccountName** | The name of the storage account deployed into the managed resource group. This account is unique for each SAP system (SID). The default naming convention is `{SID}{random string}`. |
| **ManagedResourcesNetworkAccessType** | The network access configuration for resources in the managed resource group. Options are `Public` and `Private`. If you choose `Private`, enable the Storage Account service tag on the subnets where the SAP VMs exist. This tag is required for connectivity between VM extensions and the managed resource group storage account. |

To learn more, see the [New-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/new-azworkloadssapvirtualinstance) module reference.

### Region mapping

The following table maps SAP application locations to the Azure Center for SAP solutions service location.

| **SAP application location** | **Azure Center for SAP solutions service location** |
|---|---|
| Australia Central | Australia East |
| Australia East | Australia East |
| Brazil South | Brazil South |
| Canada Central | Canada Central |
| Central India | Central India |
| Central US | South Central US |
| East Asia | East Asia |
| East US | East US |
| East US 2 | East US 2 |
| France Central | France Central |
| Germany West Central | Germany West Central |
| Japan East | Japan East |
| Korea Central | Korea Central |
| North Central US | South Central US |
| North Europe | North Europe |
| Norway East | Norway East |
| South Africa North | South Africa North |
| South Central US | South Central US |
| Southeast Asia | East Asia |
| Sweden Central | Sweden Central |
| Switzerland North | Switzerland North |
| UAE North | UAE North |
| UK South | UK South |
| West Europe | West Europe |
| West US | West US 3 |
| West US 2 | West US 2 |
| West US 3 | West US 3 |

## Clean up resources

If you no longer need the Virtual Instance for SAP solutions resource that you created in this quickstart, you can delete it from the Azure portal. Go to the VIS resource in your resource group, and select **Delete**. Deleting the VIS also removes the managed resource group and its instances, but doesn't delete the underlying infrastructure like VMs or disks.

## Related content

- [Monitor SAP system from Azure portal](monitor-portal.md)
- [Manage a VIS](manage-virtual-instance.md)
