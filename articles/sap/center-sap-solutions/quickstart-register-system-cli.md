---
title: Register an Existing SAP System with the Azure CLI
description: Learn how to register an existing SAP system in Azure Center for SAP solutions through the Azure CLI.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/10/2026
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to register my existing SAP system so that I can use the system with Azure Center for SAP solutions.
#Customer intent: As a system administrator, I want to register my existing SAP system with Azure Center for SAP solutions by using the Azure CLI, so that I can use Azure management and monitoring capabilities for my SAP environment.
---

# Register an existing SAP system with Azure Center for SAP solutions with the Azure CLI

Use the Azure CLI to create and manage Azure resources from the command line or in scripts.

With [Azure Center for SAP solutions](overview.md), you can deploy and manage SAP systems on Azure. This article shows you how to register an existing SAP system that runs on Azure with Azure Center for SAP solutions. We use the Azure CLI in this article. Alternatively, you can register systems by using Azure PowerShell or the Azure portal. After you register an SAP system, you can use its visualization, management, and monitoring capabilities through the Azure portal.

## Prerequisites

- Confirm that you're trying to register a [supported SAP system configuration](/azure/sap/center-sap-solutions/register-existing-system#supported-systems).

- Grant access to Azure Storage accounts from the virtual network where the SAP system exists. Use one of these options:
  
  - Allow outbound internet connectivity for the virtual machines (VMs).
  
  - Use a **Storage** [service tag](../../virtual-network/service-tags-overview.md) to allow connectivity to any Azure Storage account from the VMs.
  
  - Use a **Storage** [service tag with regional scope](../../virtual-network/service-tags-overview.md) to allow storage account connectivity to the Azure Storage accounts in the same region as the VMs.
  
  - Add the region-specific IP addresses for Azure Storage to your *allow* list.

- The first time you use Azure Center for SAP solutions, you must register the `Microsoft.Workloads` resource provider in the subscription where you have the SAP system with [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider), as follows:

  ```azurecli-interactive
  az provider register --namespace 'Microsoft.Workloads'
  ```

- On the subscription or resource groups where you have the SAP system resources, confirm that your Azure account has **Azure Center for SAP solutions administrator** and **Managed Identity Operator** or equivalent role access.

- Confirm that **User-assigned managed identity** has the following access roles: **Azure Center for SAP solutions service** role access on the compute resource group, and **Reader** role access on the virtual network resource group of the SAP system. Azure Center for SAP solutions uses this identity to discover your SAP system resources and register the system as a Virtual Instance for SAP solutions (VIS) resource.

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

1. Use [az workloads sap-virtual-instance create](/cli/azure/workloads/sap-virtual-instance#az-workloads-sap-virtual-instance-create) to register an existing SAP system as a Virtual Instance for SAP solutions resource:

   ```azurecli-interactive
   az workloads sap-virtual-instance create -g <Resource Group Name> \
       -n C36 \
       --environment NonProd \
       --sap-product s4hana \
       --central-server-vm <Virtual Machine resource ID> \
       --identity "{type:UserAssigned,userAssignedIdentities:{<Managed Identity resource ID>:{}}}" \
       --managed-rg-name "acss-C36" \
       --managed-resources-network-access-type <private/public> \
   ```

   - `g` specifies the name of the existing resource group into which you want the Virtual Instance for SAP solutions resource to be deployed. It can be the same resource group in which you have compute and storage resources of your SAP system, or it can be a different one.

   - `n` specifies the SAP System ID (SID) that you're registering with Azure Center for SAP solutions.

   - `environment` specifies the type of SAP environment that you're registering. Valid values are `NonProd` and `Prod`.

   - `sap-product` specifies the type of SAP product that you're registering. Valid values are `S4HANA`, `ECC`, and `Other`.

   - `managed-rg-name` specifies the name of the managed resource group deployed by the Azure Cloud Solution for SAP (ACSS) service in your subscription. This resource group is unique for each SAP SID that you register. If you don't specify the name, the ACSS service sets a name with the following naming convention: `mrg-{SID}-{random string}`.

   - `managed-resources-network-access-type` specifies the network access configuration for the resources deployed in the managed resource group. The options are `public` and `private`. If you choose private, enable the storage account service tag on the subnets in which the SAP VMs exist. This step is required for establishing connectivity between VM extensions and the managed resource group storage account. This setting is currently applicable only to the storage account.

1. After you trigger the registration process, you can view its status by getting the status of the Virtual Instance for SAP solutions resource that gets deployed as part of the registration process.

   ```azurecli-interactive
   az workloads sap-virtual-instance show -g <resource-group-name> -n C36
   ```

## Related content

- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Manage a VIS](manage-virtual-instance.md)
