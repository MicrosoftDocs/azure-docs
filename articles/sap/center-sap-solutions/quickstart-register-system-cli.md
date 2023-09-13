---
title: Quickstart - Register an existing system with Azure Center for SAP solutions with CLI
description: Learn how to register an existing SAP system in Azure Center for SAP solutions through Azure CLI.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 05/04/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to register my existing SAP system so that I can use the system with Azure Center for SAP solutions.
---
# Quickstart: Register an existing SAP system with Azure Center for SAP solutions with CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. 

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. This article shows you how to register an existing SAP system running on Azure with *Azure Center for SAP solutions* using Az CLI. Alternatively, you can register systems using the Azure PowerShell or in the Azure portal.
After you register an SAP system with *Azure Center for SAP solutions*, you can use its visualization, management and monitoring capabilities through the Azure portal. For example, you can:

This quickstart enables you to register an existing SAP system with *Azure Center for SAP solutions*.

## Prerequisites for registering a system
- Check that you're trying to register a [supported SAP system configuration](/azure/sap/center-sap-solutions/register-existing-system#supported-systems)
- Grant access to Azure Storage accounts from the virtual network where the SAP system exists. Use one of these options:
    - Allow outbound internet connectivity for the VMs.
    - Use a [**Storage** service tag](../../virtual-network/service-tags-overview.md) to allow connectivity to any Azure storage account from the VMs.
    - Use a [**Storage** service tag with regional scope](../../virtual-network/service-tags-overview.md) to allow storage account connectivity to the Azure storage accounts in the same region as the VMs.
    - Allowlist the region-specific IP addresses for Azure Storage.
- The first time you use Azure Center for SAP solutions, you must register the **Microsoft.Workloads** Resource Provider in the subscription where you have the SAP system with [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider), as follows:

    ```azurecli-interactive
    az provider register --namespace 'Microsoft.Workloads'
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

1. Use the [az workloads sap-virtual-instance create](/cli/azure/workloads/sap-virtual-instance#az-workloads-sap-virtual-instance-create) to register an existing SAP system as a *Virtual Instance for SAP solutions* resource:

     ```azurecli-interactive
     az workloads sap-virtual-instance create -g <Resource Group Name> \
          -n C36 \ 
          --environment NonProd \ 
          --sap-product s4hana \ 
          --central-server-vm <Virtual Machine resource ID> \ 
          --identity "{type:UserAssigned,userAssignedIdentities:{<Managed Identity resource ID>:{}}}" \
          --managed-rg-name "acss-C36" \
     ```
    - **g** is used to specify the name of the existing Resource Group into which you want the Virtual Instance for SAP solutions resource to be deployed. It could be the same RG in which you have Compute, Storage resources of your SAP system or a different one. 
    - **n** parameter is used to specify the SAP System ID (SID) that you are registering with Azure Center for SAP solutions.
    - **environment** parameter is used to specify the type of SAP environment you are registering. Valid values are *NonProd* and *Prod*.
    - **sap-product** parameter is used to specify the type of SAP product you are registering. Valid values are *S4HANA*, *ECC*, *Other*.
    - **managed-rg-name** parameter is used to specify the name of the managed resource group which is deployed by ACSS service in your Subscription. This RG is unique for each SAP system (SID) you register. If you do not specify the name, ACSS service sets a name with this naming convention 'mrg-{SID}-{random string}'.

2. Once you trigger the registration process, you can view its status by getting the status of the Virtual Instance for SAP solutions resource that gets deployed as part of the registration process.

     ```azurecli-interactive
     az workloads sap-virtual-instance show -g <Resource-group-name> -n C36
     ```

## Next steps

- [Monitor SAP system from Azure portal](monitor-portal.md)
- [Manage a VIS](manage-virtual-instance.md)
