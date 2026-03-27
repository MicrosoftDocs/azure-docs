---
title: Start or Stop SAP Systems with Azure PowerShell
description: Learn how to start or stop an SAP system in Azure Center for SAP solutions by using an Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions 
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 05/04/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to start and stop SAP systems in Azure Center for SAP solutions so that I can control instances through the Virtual Instance for SAP resource.
#Customer intent: As a system administrator, I want to use Azure PowerShell to start and stop SAP systems in Azure Center for SAP solutions, so that I can efficiently manage application instances and optimize use of resources.
---
# Start and stop SAP systems in Azure Center for SAP solutions with Azure PowerShell

Use the [Az PowerShell module](/powershell/azure/new-azureps-module-az) to create and manage Azure resources from the command line or in scripts.

In this guide, you learn to start and stop your SAP systems through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions. You can start and stop SAP systems by using the Azure CLI or by using Azure PowerShell. This article shows you the steps to use Azure PowerShell.

Through the Azure PowerShell module, you can start and stop:

- The entire SAP application tier, which includes Advanced Business Application Programming SAP Central Services (ASCS) and application server instances.
- Individual SAP instances, which include Central Services and application server instances.
- A HANA database.
- Instances in the following types of deployments:
  - Single-server.
  - High availability (HA).
  - Distributed non-HA.
- SAP systems that run on Windows.
- SAP systems that run on RHEL and SUSE Linux operating systems.
- SAP HA systems that use RHEL and SUSE Pacemaker clustering software and Windows Server Failover Clustering. Other certified cluster software isn't currently supported.

## Prerequisites

To start and stop on the VIS solutions resource, you must:

- Use an SAP system that you've [created in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md) as a VIS resource.

- Confirm that your Azure account has the following role, or equivalent role access on the VIS resource: Azure Center for SAP solutions administrator. For more information about the granular permissions that govern start and stop actions on the VIS, individual SAP instances, and HANA database, see [Start SAP system](manage-with-azure-rbac.md#start-sap-system).

- Confirm that the underlying virtual machines (VMs) of the SAP instances are running. This capability starts or stops the SAP application instances, not the VMs that make up the SAP system resources.

- Confirm that the `sapstartsrv` service is running on all VMs related to the SAP system.

- For HA deployments, install the HA interface cluster connector for SAP (`sap_vendor_cluster_connector`) on the ASCS instance. For more information, see the [SUSE connector specifications](https://www.suse.com/c/sap-netweaver-suse-cluster-integration-new-sap_suse_cluster_connector-version-3-0-0/) and [RHEL connector specifications](https://access.redhat.com/solutions/3606101).

- For start operations, ensure that the cluster maintenance mode is in the **Enabled** status. The start operation function for the HANA database can only be initiated when the cluster maintenance mode is enabled.

- For stop operations, ensure that the cluster maintenance mode is in the **Disabled** status. The stop operation function for the HANA database can only be initiated when the cluster maintenance mode is disabled.

## Start an SAP system

To start an SAP system represented as a Virtual Instance for SAP solutions resource, use the [Start-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/Start-AzWorkloadsSapVirtualInstance) command. Choose one of the following options:

- Use the Virtual Instance for SAP solutions resource `Name` and `ResourceGroupName` to identify the system that you want to start.

   ```powershell
     Start-AzWorkloadsSapVirtualInstance -Name DB0 -ResourceGroupName db0-vis-rg `
   ```

- Use the `InputObject` parameter and pass the resource ID of the Virtual Instance for SAP solutions resource that you want to start.

   ```powershell
     Start-AzWorkloadsSapVirtualInstance -InputObject /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0 `
   ```

## Stop an SAP system

To stop an SAP system represented as a Virtual Instance for SAP solutions resource, use the [Stop-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/Stop-AzWorkloadsSapVirtualInstance) command. Choose one of the following options:

- Use the Virtual Instance for SAP solutions resource `Name` and `ResourceGroupName` to identify the system that you want to stop.

   ```powershell
     Stop-AzWorkloadsSapVirtualInstance -Name DB0 -ResourceGroupName db0-vis-rg `
   ```

- Use the `InputObject` parameter and pass the resource ID of the Virtual Instance for SAP solutions resource that you want to stop.

   ```powershell
     Stop-AzWorkloadsSapVirtualInstance -InputObject /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0 `
   ```

## Related content

- [Monitor SAP system from the Azure portal](monitor-portal.md)
