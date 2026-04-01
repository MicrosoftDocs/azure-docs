---
title: Start and stop SAP systems, instances, and HANA database
description: Learn how to start or stop an SAP system, specific instances, and HANA database through the Virtual Instance for SAP solutions resource in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 03/25/2026
ms.author: sagarkeswani
author: sagarkeswani
ms.custom: sfi-image-nochange
# Customer intent: As an SAP system administrator, I want to start and stop SAP systems, instances, and HANA databases using the Virtual Instance for SAP solutions in Azure, so that I can effectively manage system resources and ensure optimal performance.
---

# Start and stop SAP systems, instances, and HANA database

In this article, you learn to start and stop your SAP systems through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions.

Through the Azure portal, [Azure PowerShell](/powershell/module/az.workloads), [Azure CLI](/cli/azure/workloads/sap-virtual-instance), and [REST API](/rest/api/workloads) interfaces, you can start and stop:

- The entire SAP Application tier, which includes ABAP SAP Central Services (ASCS) and Application Server instances.
- A specific SAP instance, such as the application server instance.
- HANA database.
- Instances and HANA database in the following types of deployments:
  - Single-Server
  - High Availability (HA)
  - Distributed Non-HA
- SAP systems that run on Windows, RHEL, and SUSE Linux operating systems.
- SAP HA systems that use SUSE and RHEL Pacemaker clustering software and Windows Server Failover Clustering. Other certified cluster software isn't currently supported.

## Supported scenarios

The following scenarios are supported when starting and stopping SAP systems:

- SAP systems that run on Windows, RHEL, and SUSE Linux operating systems.
- Stopping and starting an SAP system or individual instances from the VIS resource stops or starts only the SAP application. The underlying VMs aren't stopped or started.
- Stopping a highly available SAP system from the VIS resource gracefully stops the SAP instances in the correct order and doesn't result in a failover of the Central Services instance.
- Stopping the HANA database from the VIS resource stops the entire HANA instance. For HANA multitenant database containers with multiple tenant databases, the entire instance is stopped, not a specific tenant database.
- For HA HANA databases, start and stop operations through the VIS resource are supported only when a cluster management solution is in place. Other HANA database high-availability configurations without a cluster aren't currently supported for start and stop operations through the VIS resource.

> [!NOTE]
> When multiple application server instances run on a single virtual machine and you want to stop all instances, you can stop only one instance at a time. If you attempt to stop them in parallel, only one stop request is accepted and all other requests fail.

## Prerequisites

- An SAP system that you [created in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md).
- Make sure your Azure account has **Azure Center for SAP solutions administrator** or equivalent role access on the VIS resources. To learn more about the granular permissions that govern Start and Stop actions on the VIS, individual SAP instances, and HANA database, see [Manage access with Azure RBAC](manage-with-azure-rbac.md#start-sap-system).
- For the start operation to work, the underlying virtual machines (VMs) of the SAP instances must be running. This feature starts or stops the SAP application instances, not the VMs that make up the SAP system resources.
- The `sapstartsrv` service must be running on all VMs related to the SAP system.
- For HA deployments, the HA interface cluster connector for SAP (`sap_vendor_cluster_connector`) must be installed on the ASCS instance. For more information, see the [SUSE connector specifications](https://www.suse.com/c/sap-netweaver-suse-cluster-integration-new-sap_suse_cluster_connector-version-3-0-0/) and [RHEL connector specifications](https://access.redhat.com/solutions/3606101).
- For HANA database, the stop operation runs only when the cluster maintenance mode is **Disabled**. Similarly, the start operation runs only when the cluster maintenance mode is **Enabled**.

> [!NOTE]
> When you deploy an SAP system using Azure Center for SAP solutions, the RHEL and SUSE cluster connector for highly available systems is already configured as part of the SAP software installation process.

## Stop an SAP system

To stop an SAP system in the VIS resource:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Center for SAP solutions** in the search bar.

1. Select **Virtual Instances for SAP solutions** in the sidebar menu.

1. In the table of VIS resources, select the name of the VIS you want to stop.

1. Select the **Stop** button. If you can't select this button, the SAP system is already stopped.

   :::image type="content" source="media/start-stop-sap-systems/stop-button.png" lightbox="media/start-stop-sap-systems/stop-button.png" alt-text="Screenshot of the VIS resource menu in the Azure portal showing the Stop button.":::

1. Select **Yes** in the confirmation prompt to stop the VIS.

   :::image type="content" source="media/start-stop-sap-systems/confirm-stop.png" lightbox="media/start-stop-sap-systems/confirm-stop.png" alt-text="Screenshot of the VIS resource menu in the Azure portal showing the confirmation prompt to stop the VIS resource.":::

   A notification pane then opens with a **Stopping Virtual Instance for SAP solutions** message.

1. Wait for the VIS resource's **Status** to change to **Stopping**.

   A notification pane then opens with a **Stopped Virtual Instance for SAP solutions** message.

## Start an SAP system

To start an SAP system in the VIS resource:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Center for SAP solutions** in the search bar.

1. Select **Virtual Instances for SAP solutions** in the sidebar menu.

1. In the table of VIS resources, select the name of the VIS you want to start.

1. Select the **Start** button. If you can't select this button, make sure that you followed the [prerequisites](#prerequisites) for the VMs within your SAP system.

   :::image type="content" source="media/start-stop-sap-systems/start-button.png" lightbox="media/start-stop-sap-systems/start-button.png" alt-text="Screenshot of the VIS resource menu in the Azure portal showing the Start button.":::

   A notification pane then opens with a **Starting Virtual Instance for SAP solutions** message. The VIS resource's **Status** also changes to **Starting**.

1. Wait for the VIS resource's **Status** to change to **Running**.

   A notification pane then opens with a **Started Virtual Instance for SAP solutions** message.

## Troubleshooting

If the SAP system takes longer than 300 seconds to complete a start or stop operation, the operation terminates. After the operation terminates, the monitoring service continues to check and update the status of the SAP system in the VIS resource.

## Related content

- [Monitor SAP system from the Azure portal](monitor-portal.md)

- [Get quality checks and insights for a VIS resource](get-quality-checks-insights.md)
