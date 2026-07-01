---
title: Start and stop SAP systems, instances, HANA database, and underlying VMs
description: Learn how to start and stop SAP systems, individual SAP instances, and HANA databases along with their underlying virtual machines. Use the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions to manage these operations through REST API calls.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 04/09/2026
ms.author: kanamudu
author: kalyaninamuduri
# Customer intent: As an SAP system administrator, I want to efficiently start and stop SAP systems and their underlying VMs in Azure, so that I can manage system resources and optimize costs based on usage.
---

# Start and stop SAP systems, instances, HANA database, and underlying virtual machines

[Azure Center for SAP solutions](overview.md) lets you manage SAP systems on Azure as a unified workload. When your SAP systems aren't actively in use, for example, outside business hours or during maintenance windows, you can stop them and deallocate the underlying virtual machines (VMs) to reduce costs.

In this article, you use REST API calls to start and stop SAP application tiers, individual SAP instances, and HANA databases along with their VMs.

> [!IMPORTANT]
> The ability to start and stop VMs of an SAP system is available from API version 2023-10-01-preview.

> [!NOTE]
> Schedule stop and start of SAP systems and HANA databases at scale for your SAP landscapes by using the [scheduled start and stop ARM template](https://github.com/Azure/Azure-Center-for-SAP-solutions/tree/main/ScheduledStartandStopforSAPSystems). Customize this ARM template per your requirements.

## Unsupported scenarios

The following scenarios aren't currently supported:

- Starting and stopping systems when multiple SAP system IDs (SIDs) run on the same set of VMs.
- Starting and stopping HANA databases with Multiple Components in One System (MCOS) architecture, where multiple HANA instances run on the same set of VMs.
- Starting and stopping SAP application server or central services instances, where instances of multiple SIDs or multiple instances of the same SID run on the same VM.

> [!IMPORTANT]
> For single-server deployments, when you want to stop SAP, HANA database, and the VM, use the stop VIS action to stop the SAP application tier, and then stop the HANA database with `deallocateVm` set to `true`. This approach makes sure that the SAP application and HANA database are both stopped before the VM is stopped.

> [!NOTE]
> When you stop a VIS or an instance with the `deallocateVm` option set to `true`, only that VIS or instance is stopped and then the VM is shut down. SAP instances of other SIDs aren't stopped. Use the VM stop option only after all instances running on the VM are stopped.

## Prerequisites

- An SAP system that you [created in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md).
- An Azure account with **Azure Center for SAP solutions administrator** or equivalent role access on the Virtual Instance for SAP solutions (VIS) resources. For more information about the granular permissions that govern start and stop actions, see [Manage SAP resources with Azure RBAC](manage-with-azure-rbac.md#start-sap-system).
- The **User Assigned Managed Identity** associated with the VIS resource must have **Virtual Machine Contributor** or equivalent role access to start and stop VMs.

## Start and stop SAP system and underlying VMs

Start and stop the entire SAP application tier and underlying VMs by using [REST API version 2023-10-01-preview](/rest/api/workloads).

### Start SAP system and its VMs

To start the VMs and the SAP application, use the following REST API with `startVm` set to `true`. This command starts the VMs associated with the Central Services instance and application server instances.

```http
POST https://management.azure.com/subscriptions/Sub1/resourceGroups/test-rg/providers/Microsoft.Workloads/sapVirtualInstances/X00/start?api-version=2023-10-01-preview

{
  "startVm": true
}
```

### Stop SAP system and its VMs

To stop the SAP application and its VMs, use the following REST API with `deallocateVm` set to `true`.

```http
POST https://management.azure.com/subscriptions/Sub1/resourceGroups/test-rg/providers/Microsoft.Workloads/sapVirtualInstances/X00/stop?api-version=2023-10-01-preview

{
  "deallocateVm": true
}
```

## Start and stop HANA database and its VMs

Start and stop the HANA database and its underlying VMs by using [REST API version 2023-10-01-preview](/rest/api/workloads).

### Start HANA database and its VMs

To start the VMs and the HANA database, use the following REST API with `startVm` set to `true`.

```http
POST https://management.azure.com/subscriptions/Sub1/resourceGroups/test-rg/providers/Microsoft.Workloads/sapVirtualInstances/X00/databaseInstances/db0/start?api-version=2023-10-01-preview

{
  "startVm": true
}
```

### Stop HANA database and its VMs

To stop the HANA database and its underlying VMs, use the following REST API with `deallocateVm` set to `true`.

```http
POST https://management.azure.com/subscriptions/Sub1/resourceGroups/test-rg/providers/Microsoft.Workloads/sapVirtualInstances/X00/databaseInstances/db0/stop?api-version=2023-10-01-preview

{
  "deallocateVm": true
}
```

## Related content

- [What is Azure Center for SAP solutions?](overview.md)
- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Manage SAP resources with Azure RBAC](manage-with-azure-rbac.md)
