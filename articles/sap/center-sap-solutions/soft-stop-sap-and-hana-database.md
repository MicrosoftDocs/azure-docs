---
title: Soft stop individual SAP instances and HANA database
description: Learn how to soft stop SAP system and HANA database through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 10/25/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to stop SAP systems by draining existing connections gracefully when using Azure Center for SAP solutions.
---
# Soft stop SAP systems, application server instances and HANA database

In this how-to guide, you'll learn to soft stop your SAP systems, individual instances and HANA database through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions. You can stop your system smoothly by making sure that existing user connections, batch processes, etc. are drained first. 

Using the [Azure PowerShell](/powershell/module/az.workloads) and [REST API](/rest/api/workloads) interfaces, you can:

- Soft stop the entire SAP system, that is the application server instances and central services instance.
- Soft stop specific SAP application server instances.
- Soft stop HANA database.


## Prerequisites

- An SAP system that you've [created in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md).
- Check that your Azure account has **Azure Center for SAP solutions administrator** or equivalent role access on the Virtual Instance for SAP solutions resources. For more information, see [how to use granular permissions that govern start and stop actions on the VIS, individual SAP instances and HANA databases](manage-with-azure-rbac.md#start-sap-system).
- For HA deployments, the HA interface cluster connector for SAP (`sap_vendor_cluster_connector`) must be installed on the ASCS instance. For more information, see the [SUSE connector specifications](https://www.suse.com/c/sap-netweaver-suse-cluster-integration-new-sap_suse_cluster_connector-version-3-0-0/) and [RHEL connector specifications](https://access.redhat.com/solutions/3606101).
- For HANA Database, Stop operation is initiated only when the cluster maintenance mode is in **Disabled** status.


## Soft stop SAP system

Currently, you can initiate a soft stop operation from the Azure PowerShell and REST API interfaces. You must use the stop operation along with a soft stop timeout value in seconds to initiate a soft stop. Once you initiate soft stop on VIS and the operation is successfully triggered on the SAP system, then monitor the Health and Status of the VIS to check if the system has stopped. 

> [!NOTE]
> When attempting to soft stop an SAP system or applicaton server instance using Azure Center for SAP solutions, soft stop timeout value must be greater than 0 and less than 82800 seconds. 


### Soft stop system in PowerShell
Use the [Stop-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/Stop-AzWorkloadsSapVirtualInstance) command:

```powershell
     Stop-AzWorkloadsSapVirtualInstance -InputObject /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0 --SoftStopTimeoutSecond 300 `
```

### Soft stop system using REST API
Use this [sample payload](/rest/api/workloads/2023-04-01/sap-virtual-instances/stop?tabs=HTTP#sapvirtualinstances_stop) to soft stop an SAP system. You can specify the soft stop timeout value in seconds.

## Soft stop SAP Application server instance
You can soft stop a specific application server in Azure Center for SAP solutions using Azure PowerShell and REST API interfaces. Once you initiate soft stop on application server and the operation is successfully triggered, then monitor Health and Status of the application server instance to check if it has stopped.

To soft stop an application server represented as an *App server instance for SAP solutions* resource:


### Using PowerShell
Use the [Stop-AzWorkloadsSapApplicationInstance](/powershell/module/az.workloads/stop-azworkloadssapapplicationinstance) command:

```powershell
     Stop-AzWorkloadsSapApplicationInstance -InputObject /subscriptions/Sub1/resourceGroups/RG1/providers/Microsoft.Workloads/sapVirtualInstances/DB0/applicationInstances/app0 --SoftStopTimeoutSecond 300 `
```

### Using REST API
Use this [sample payload](/rest/api/workloads/2023-04-01/sap-application-server-instances/stop-instance?tabs=HTTP#stop-the-sap-application-server-instance) to soft stop an application server instance. You can specify the soft stop timeout value in seconds.

## Soft stop HANA database
You can soft stop the HANA database so that the database stops gracefully after all running statements have finished. You can use the Azure PowerShell and REST API interfaces to soft stop database. Once you initiate soft stop on HANA database and the operation is successfully triggered on the database instance, then monitor the status of the database instance on the VIS to check if it has stopped.

> [!NOTE]
> When attempting to soft stop HANA database instance using Azure Center for SAP solutions, soft stop timeout value must be greater than 0 and less than 1800 seconds.


### Using PowerShell
Use the [Stop-AzWorkloadsSapDatabaseInstance](/powershell/module/az.workloads/stop-azworkloadssapdatabaseinstance) command:

```powershell
     Stop-AzWorkloadsSapDatabaseInstance -InputObject /subscriptions/Sub1/resourceGroups/RG1/providers/Microsoft.Workloads/sapVirtualInstances/DB0/databaseInstances/ab0 --SoftStopTimeoutSecond 300 `
```

### Using REST API
Use this [sample payload](/rest/api/workloads/2023-04-01/sap-database-instances/stop-instance?tabs=HTTP#stop-the-database-instance-of-the-sap-system.) to soft stop HANA database. You can specify the soft stop timeout value in seconds.
