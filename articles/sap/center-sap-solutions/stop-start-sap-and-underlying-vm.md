---
title: Start and stop SAP and underlying VMs
description: Learn how to Stop and Start SAP and underlying VMs through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 10/25/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to start and stop SAP systems including VMs when they are not needed to be run.
---

# Start and Stop SAP systems, instances, HANA database and their underlying Virtual machines
In this how-to guide, you'll learn how to start and stop SAP systems and their underlying virtual machines through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions. This simplifies the process to stop and start SAP systems by shutting down and bringing up underlying infrastructure and SAP application in one command.

Using the [REST API](/rest/api/workloads) interfaces, you can:

- Start and stop the entire SAP application tier and its Virtual machines, which includes ABAP SAP Central Services (ASCS) and Application Server instances.
- Start and stop a specific SAP instance, such as the application server instance, and its Virtual machines.
- Start and stop HANA database instance and its Virtual machines.

> [!IMPORTANT]
> The ability to start and stop virtual machines of an SAP system is available from API Version 2023-10-01.

> [!NOTE]
> You can schedule stop and start of SAP systems, HANA database at scale for your SAP landscapes using the [ARM template](https://aka.ms/SnoozeSAPSystems). This ARM template can be customized to suit your own requirements.

## Prerequisites
- An SAP system that you've [created in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md).
- Check that your Azure account has **Azure Center for SAP solutions administrator** or equivalent role access on the Virtual Instance for SAP solutions resources. You can learn more about the granular permissions that govern Start and Stop actions on the VIS, individual SAP instances and HANA Database [in this article](manage-with-azure-rbac.md#start-sap-system).
- Check that the **User Assigned Managed Identity** associated with the VIS resource has **Virtual Machine Contributor** or equivalent role access. This is needed to be able to Start and Stop VMs.

## Unsupported scenarios
The following scenarios are not currently supported when using the Start and Stop of SAP, individual SAP instances, HANA database and their underlying VMs:

- Starting and stopping systems when multiple SIDs on the same set of Virtual Machines.
- Starting and stopping HANA databases with MCOS (Multiple Components in One System) architecture, where multiple HANA instances run on the same set of virtual machines.
- Starting and stopping SAP application server or central services instances where instances of multiple SIDs or multiple instances of the same SID run on the same virtual machine.

> [!IMPORTANT]
> For single-server deployments, when you want to stop SAP, HANA DB and the VM, use stop VIS action to stop SAP application tier and then stop HANA database with 'deallocateVm' set to true. This ensures that SAP application and HANA database are both stopped before stopping the VM.

> [!NOTE]
> When stopping a VIS or an instance with 'DeallocateVm' option set to true, only that VIS or instance is stopped and then the virtual machine is shutdown. SAP instances of other SIDs are not stopped. Use the virtual machine stop option only after all instances running on the VM are stopped. 


## Start and Stop SAP system and underlying Virtual machines
You can start and stop the entire SAP application tier and underlying VMs using [REST API version 2023-10-01](/rest/api/workloads).

### Start SAP system and its VMs
To start the virtual machines and the SAP application on it, use the following REST API with "startVm" parameter set to true. This command starts the VMs associated with Central services instance and Application server instances.

```http
POST https://management.azure.com/subscriptions/Sub1/resourceGroups/test-rg/providers/Microsoft.Workloads/sapVirtualInstances/X00/start?api-version=2023-10-01-preview

{
  "startVm": true
}
```

### Stop SAP system and its VMs
To stop the SAP application and its VMs, use the following REST API with "deallocateVm" parameter set to true.

```http
POST https://management.azure.com/subscriptions/Sub1/resourceGroups/test-rg/providers/Microsoft.Workloads/sapVirtualInstances/X00/stop?api-version=2023-10-01-preview

{
  "deallocateVm": true
}
```

## Start and Stop HANA Database and its VMs
You can start and stop HANA database and its underlying VMs using [REST API version 2023-10-01](/rest/api/workloads).

### Start HANA database and its VMs
To start the virtual machines and the HANA database on it, use the following REST API with "startVm" parameter set to true.

```http
POST https://management.azure.com/subscriptions/Sub1/resourceGroups/test-rg/providers/Microsoft.Workloads/sapVirtualInstances/X00/databaseInstances/db0/start?api-version=2023-10-01-preview

 {
  "startVm": true
 }
```

### Stop HANA database and its VMs
To stop HANA database and its underlying VMs, use the following REST API with `deallocateVm` parameter set to `true`.

```http
POST https://management.azure.com/subscriptions/Sub1/resourceGroups/test-rg/providers/Microsoft.Workloads/sapVirtualInstances/X00/databaseInstances/db0/stop?api-version=2023-10-01-preview

 {
  "deallocateVm": true
 }
```
