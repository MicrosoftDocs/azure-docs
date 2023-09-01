---
title: Quickstart - Start and stop SAP systems from Azure Center for SAP solutions with PowerShell
description: Learn how to start or stop an SAP system through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions through Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 05/04/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to start and stop SAP systems in Azure Center for SAP solutions so that I can control instances through the Virtual Instance for SAP resource.
---
# Quickstart: Start and stop SAP systems from Azure Center for SAP solutions with PowerShell

The [Azure PowerShell AZ](/powershell/azure/new-azureps-module-az) module is used to create and manage Azure resources from the command line or in scripts.

In this how-to guide, you'll learn to start and stop your SAP systems through the *Virtual Instance for SAP solutions (VIS)* resource in *Azure Center for SAP solutions* using PowerShell.

Through the Azure PowerShell module, you can start and stop:

- The entire SAP Application tier, which includes ABAP SAP Central Services (ASCS) and Application Server instances.
- Individual SAP instances, which include Central Services and Application server instances.
- HANA Database
- You can start and stop instances in the following types of deployments:
  - Single-Server
  - High Availability (HA)
  - Distributed Non-HA
- SAP systems that run on Windows and, RHEL and SUSE Linux operating systems.
- SAP HA systems that use SUSE and RHEL Pacemaker clustering software and Windows Server Failover Clustering (WSFC). Other certified cluster software isn't currently supported.

## Prerequisites

The following are prerequisites that you need to ensure before using the Start or Stop capability on the Virtual Instance for SAP solutions resource.
- An SAP system that you've [created in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md) as a *Virtual Instance for SAP solutions* resource.
- Check that your Azure account has **Azure Center for SAP solutions administrator** or equivalent role access on the Virtual Instance for SAP solutions resources. You can learn more about the granular permissions that govern Start and Stop actions on the VIS, individual SAP instances and HANA Database [in this article](manage-with-azure-rbac.md#start-sap-system).
- For the start operation to work, the underlying virtual machines (VMs) of the SAP instances must be running. This capability starts or stops the SAP application instances, not the VMs that make up the SAP system resources.
- The `sapstartsrv` service must be running on all VMs related to the SAP system.
- For HA deployments, the HA interface cluster connector for SAP (`sap_vendor_cluster_connector`) must be installed on the ASCS instance. For more information, see the [SUSE connector specifications](https://www.suse.com/c/sap-netweaver-suse-cluster-integration-new-sap_suse_cluster_connector-version-3-0-0/) and [RHEL connector specifications](https://access.redhat.com/solutions/3606101).
- The Stop operation function for the HANA Database can only be initiated when the cluster maintenance mode is in **Disabled** status. Similarly, Start operation can only be initiated when the cluster maintenance mode is in **Enabled** status.

## Start SAP system

To Start an SAP system represented as a *Virtual Instance for SAP solutions* resource:

Use the [Start-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/Start-AzWorkloadsSapVirtualInstance) command:

Option 1:

Use the Virtual Instance for SAP solutions resource Name and ResourceGroupName to identify the system you intend to start.

```powershell
     Start-AzWorkloadsSapVirtualInstance -Name DB0 -ResourceGroupName db0-vis-rg `
```

Option 2:

Use the InputObject parameter and pass the resource ID of the Virtual Instance for SAP solutions resource you intend to start.

 ```powershell
     Start-AzWorkloadsSapVirtualInstance -InputObject /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0 `
 ```

## Stop SAP system

To stop an SAP system represented as a *Virtual Instance for SAP solutions* resource:

Use the [Stop-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/Stop-AzWorkloadsSapVirtualInstance) command:

Option 1:

Use the Virtual Instance for SAP solutions resource Name and ResourceGroupName to identify the system you intend to stop.

```powershell
     Stop-AzWorkloadsSapVirtualInstance -Name DB0 -ResourceGroupName db0-vis-rg `
```

Option 2:

Use the InputObject parameter and pass the resource ID of the Virtual Instance for SAP solutions resource you intend to stop.

```powershell
     Stop-AzWorkloadsSapVirtualInstance -InputObject /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0 `
```

## Next steps

- [Monitor SAP system from the Azure portal](monitor-portal.md)
