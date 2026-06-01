---
title: Start or stop SAP systems by using Azure PowerShell
description: Learn how to start or stop an SAP system in Azure Center for SAP solutions by using Azure PowerShell.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 04/21/2026
ms.author: kanamudu
author: kalyaninamuduri
# Customer intent: As a system administrator, I want to use Azure PowerShell to start and stop SAP systems in Azure Center for SAP solutions so that I can efficiently manage application instances and optimize use of resources.
---

# Start and stop SAP systems by using Azure PowerShell

This article shows you how to start and stop SAP systems through the Virtual Instance for SAP solutions (VIS) resource in [Azure Center for SAP solutions](overview.md) by using Azure PowerShell.

You can start and stop:

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

- An SAP system that you [created in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md) as a VIS resource.
- An Azure account with the **Azure Center for SAP solutions administrator** role, or equivalent role access on the VIS resource. For more information about the granular permissions that govern start and stop actions on the VIS, individual SAP instances, and HANA database, see [Start SAP system](manage-with-azure-rbac.md#start-sap-system).
- The underlying virtual machines (VMs) of the SAP instances must be running. This capability starts or stops the SAP application instances, not the VMs that make up the SAP system resources.
- The `sapstartsrv` service must be running on all VMs related to the SAP system.
- For HA deployments, the HA interface cluster connector for SAP (`sap_vendor_cluster_connector`) installed on the ASCS instance. For more information, see the [SUSE connector specifications](https://www.suse.com/c/sap-netweaver-suse-cluster-integration-new-sap_suse_cluster_connector-version-3-0-0/) and [RHEL connector specifications](https://access.redhat.com/solutions/3606101).
- For start operations, cluster maintenance mode must be **Enabled**. The start operation for the HANA database can only be initiated when cluster maintenance mode is enabled.
- For stop operations, cluster maintenance mode must be **Disabled**. The stop operation for the HANA database can only be initiated when cluster maintenance mode is disabled.

## Start an SAP system

To start an SAP system represented as a VIS resource, use the [Start-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/Start-AzWorkloadsSapVirtualInstance) command. Choose one of the following options:

- Use the VIS resource `Name` and `ResourceGroupName` to identify the system that you want to start.

   ```azurepowershell
   Start-AzWorkloadsSapVirtualInstance -Name DB0 -ResourceGroupName db0-vis-rg
   ```

- Use the `InputObject` parameter and pass the resource ID of the VIS resource that you want to start.

   ```azurepowershell
   Start-AzWorkloadsSapVirtualInstance -InputObject /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0
   ```

## Stop an SAP system

To stop an SAP system represented as a VIS resource, use the [Stop-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/Stop-AzWorkloadsSapVirtualInstance) command. Choose one of the following options:

- Use the VIS resource `Name` and `ResourceGroupName` to identify the system that you want to stop.

   ```azurepowershell
   Stop-AzWorkloadsSapVirtualInstance -Name DB0 -ResourceGroupName db0-vis-rg
   ```

- Use the `InputObject` parameter and pass the resource ID of the VIS resource that you want to stop.

   ```azurepowershell
   Stop-AzWorkloadsSapVirtualInstance -InputObject /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0
   ```

## Related content

- [Start and stop SAP systems by using the Azure CLI](quick-stop-start-sap-cli.md)
- [Start and stop SAP systems and underlying VMs](stop-start-sap-and-underlying-vm.md)
- [Manage a Virtual Instance for SAP solutions](manage-virtual-instance.md)
- [Monitor SAP system from the Azure portal](monitor-portal.md)
