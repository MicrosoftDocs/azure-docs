---
title: Soft stop SAP instances and HANA database in Azure Center for SAP solutions
description: Learn how to soft stop an SAP system and HANA database through the Virtual Instance for SAP solutions resource in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 04/15/2026
ms.author: kanamudu
author: kalyaninamuduri
# Customer intent: As an SAP administrator, I want to gracefully soft stop SAP systems and HANA databases through Azure resources, so that I can ensure all user connections and processes are properly managed before shutting down to maintain system integrity.
---

# Soft stop SAP instances and HANA database in Azure Center for SAP solutions

You can soft stop your SAP systems, individual instances, and HANA database through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions. A soft stop drains existing user connections and batch processes before stopping the system.

By using [Azure PowerShell](/powershell/module/az.workloads), [Azure CLI](/cli/azure/workloads/sap-virtual-instance), and [REST API](/rest/api/workloads) interfaces, you can:

- Soft stop the entire SAP system, including the application server instances and central services instance.
- Soft stop specific SAP application server instances.
- Soft stop HANA database.

## Prerequisites

- An SAP system that you [deployed in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md).
- Make sure your Azure account has **Azure Center for SAP solutions administrator** or equivalent role access on the Virtual Instance for SAP solutions resources. For more information, see [Manage access with Azure RBAC](manage-with-azure-rbac.md#start-sap-system).
- For HA deployments, the HA interface cluster connector for SAP (`sap_vendor_cluster_connector`) must be installed on the ASCS instance. For more information, see the [SUSE connector specifications](https://www.suse.com/c/sap-netweaver-suse-cluster-integration-new-sap_suse_cluster_connector-version-3-0-0/) and [RHEL connector specifications](https://access.redhat.com/solutions/3606101).
- For HANA database, the stop operation is initiated only when the cluster maintenance mode is **Disabled**.

## Soft stop a resource

You can initiate a soft stop operation from Azure PowerShell, Azure CLI, and REST API interfaces. You must use the stop operation along with a soft stop timeout value in seconds to initiate a soft stop. After you initiate the soft stop and the operation is successfully triggered, monitor the health and status of the resource to check if it stopped.

First, select the resource type you want to soft stop:

# [SAP system](#tab/sap-system)

> [!NOTE]
> When attempting to soft stop an SAP system or application server instance, the timeout value must be greater than `0` and less than `82,800` seconds.

# [Application server](#tab/app-server)

> [!NOTE]
> When attempting to soft stop an SAP system or application server instance, the timeout value must be greater than `0` and less than `82,800` seconds.

# [HANA database](#tab/hana-db)

> [!NOTE]
> When attempting to soft stop a HANA database instance, the timeout value must be greater than `0` and less than `1,800` seconds.

---

Then, select the tool you want to use:

# [Azure PowerShell](#tab/azure-powershell/sap-system)

Use the [Stop-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/Stop-AzWorkloadsSapVirtualInstance) command:

```azurepowershell
Stop-AzWorkloadsSapVirtualInstance -InputObject /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0 -SoftStopTimeoutSecond 300
```

# [Azure PowerShell](#tab/azure-powershell/app-server)

Use the [Stop-AzWorkloadsSapApplicationInstance](/powershell/module/az.workloads/stop-azworkloadssapapplicationinstance) command:

```azurepowershell
Stop-AzWorkloadsSapApplicationInstance -InputObject /subscriptions/Sub1/resourceGroups/RG1/providers/Microsoft.Workloads/sapVirtualInstances/DB0/applicationInstances/app0 -SoftStopTimeoutSecond 300
```

# [Azure PowerShell](#tab/azure-powershell/hana-db)

Use the [Stop-AzWorkloadsSapDatabaseInstance](/powershell/module/az.workloads/stop-azworkloadssapdatabaseinstance) command:

```azurepowershell
Stop-AzWorkloadsSapDatabaseInstance -InputObject /subscriptions/Sub1/resourceGroups/RG1/providers/Microsoft.Workloads/sapVirtualInstances/DB0/databaseInstances/ab0 -SoftStopTimeoutSecond 300
```

# [Azure CLI](#tab/azure-cli/sap-system)

Use the [az workloads sap-virtual-instance stop](/cli/azure/workloads/sap-virtual-instance#az-workloads-sap-virtual-instance-stop) command:

```azurecli-interactive
az workloads sap-virtual-instance stop --id /subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Workloads/sapVirtualInstances/DB0 --soft-stop-timeout-seconds 300
```

# [Azure CLI](#tab/azure-cli/app-server)

Use the [az workloads sap-application-server-instance stop](/cli/azure/workloads/sap-application-server-instance#az-workloads-sap-application-server-instance-stop) command:

```azurecli-interactive
az workloads sap-application-server-instance stop --id /subscriptions/Sub1/resourceGroups/RG1/providers/Microsoft.Workloads/sapVirtualInstances/DB0/applicationInstances/app0 --soft-stop-timeout-seconds 300
```

# [Azure CLI](#tab/azure-cli/hana-db)

Use the [az workloads sap-database-instance stop](/cli/azure/workloads/sap-database-instance#az-workloads-sap-database-instance-stop) command:

```azurecli-interactive
az workloads sap-database-instance stop --id /subscriptions/Sub1/resourceGroups/RG1/providers/Microsoft.Workloads/sapVirtualInstances/DB0/databaseInstances/ab0 --soft-stop-timeout-seconds 300
```

# [REST API](#tab/rest-api/sap-system)

Use this [sample payload](/rest/api/workloads/2023-04-01/sap-virtual-instances/stop?tabs=HTTP#sapvirtualinstances_stop). You can specify the soft stop timeout value in seconds.

# [REST API](#tab/rest-api/app-server)

Use this [sample payload](/rest/api/workloads/2023-04-01/sap-application-server-instances/stop-instance?tabs=HTTP#stop-the-sap-application-server-instance). You can specify the soft stop timeout value in seconds.

# [REST API](#tab/rest-api/hana-db)

Use this [sample payload](/rest/api/workloads/2023-04-01/sap-database-instances/stop-instance?tabs=HTTP#stop-the-database-instance-of-the-sap-system). You can specify the soft stop timeout value in seconds.

---

## Related content

- [Start and stop SAP systems](start-stop-sap-systems.md)
- [Stop and start SAP systems and underlying VMs](stop-start-sap-and-underlying-vm.md)
- [Manage access with Azure RBAC](manage-with-azure-rbac.md)
