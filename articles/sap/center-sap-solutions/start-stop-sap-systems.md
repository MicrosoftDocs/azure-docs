---
title: Start and stop SAP systems, instances and HANA database
description: Learn how to start or stop an SAP system, specific instances and HANA database through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions through the Azure portal, PowerShell, CLI.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 10/19/2022
ms.author: sagarkeswani
author: sagarkeswani
#Customer intent: As a developer, I want to start and stop SAP systems in Azure Center for SAP solutions so that I can control instances through the Virtual Instance for SAP resource.
---

# Start and stop SAP systems, instances and HANA database

In this how-to guide, you'll learn to start and stop your SAP systems through the *Virtual Instance for SAP solutions (VIS)* resource in *Azure Center for SAP solutions*. 

Through the Azure portal, [Azure PowerShell](/powershell/module/az.workloads), [CLI](/cli/azure/workloads/sap-virtual-instance) and [REST API](/rest/api/workloads) interfaces, you can start and stop:

- Entire SAP Application tier in one go, which include ABAP SAP Central Services (ASCS) and Application Server instances.
- Specific SAP instance, such as the application server instance.
- HANA Database
- You can start and stop instances and HANA database in the following types of deployments:
    - Single-Server
    - High Availability (HA)
    - Distributed Non-HA
- SAP systems that run on Windows and, RHEL and SUSE Linux operating systems.
- SAP HA systems that use SUSE and RHEL Pacemaker clustering software and Windows Server Failover Clustering (WSFC). Other certified cluster software isn't currently supported.

## Prerequisites

- An SAP system that you've [created in Azure Center for SAP solutions](prepare-network.md) or [registered with Azure Center for SAP solutions](register-existing-system.md).
- Check that your Azure account has **Azure Center for SAP solutions administrator** or equivalent role access on the Virtual Instance for SAP solutions resources. You can learn more about the granular permissions that govern Start and Stop actions on the VIS, individual SAP instances and HANA Database [in this article](manage-with-azure-rbac.md#start-sap-system).
- For the start operation to work, the underlying virtual machines (VMs) of the SAP instances must be running. This capability starts or stops the SAP application instances, not the VMs that make up the SAP system resources.
- The `sapstartsrv` service must be running on all VMs related to the SAP system.
- For HA deployments, the HA interface cluster connector for SAP (`sap_vendor_cluster_connector`) must be installed on the ASCS instance. For more information, see the [SUSE connector specifications](https://www.suse.com/c/sap-netweaver-suse-cluster-integration-new-sap_suse_cluster_connector-version-3-0-0/) and [RHEL connector specifications](https://access.redhat.com/solutions/3606101).
- For HANA Database, Stop operation is initiated only when the cluster maintenance mode is in **Disabled** status. Similarly, Start operation is initiated only when the cluster maintenance mode is in **Enabled** status.

> [!NOTE]
> When you deploy an SAP system using Azure Center for SAP solutions, RHEL and SUSE cluster connector for highly available systems is already configured on them as part of the SAP software installation process. 

## Supported scenarios
The following scenarios are supported when Starting and Stopping SAP systems:

- SAP systems that run on Windows and, RHEL and SUSE Linux operating systems.
- Stopping and Starting SAP system or individual instances from the VIS resource only stops or starts the SAP application. The underlying VMs are **not** stopped or started.
- Stopping a highly available SAP system from the VIS resource gracefully stops the SAP instances in the right order and does not result in a failover of Central Services instance.
- Stopping the HANA Database from the VIS resource results in the entire HANA instance to be stopped. In case of HANA MDC with multiple tenant DBs, the entire instance is stopped and not the specific Tenant DB.
- For highly available (HA) HANA databases, start and stop operations through Virtual Instance for SAP solutions resource are supported only when cluster management solution is in place. Any other HANA database high availability configurations without a cluster are not currently supported when starting and stopping using Virtual Instance for SAP solutions resource.

> [!NOTE]
> When multiple application server instances run on a single virtual machine and you intend to stop all these instances, you can currently stop them one instance at a time only. If you attempt to stop them in parallel, only one stop request is accepted and all others would fail.

## Stop SAP system

To stop an SAP system in the VIS resource:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Center for SAP solutions** in the search bar.

1. Select **Virtual Instances for SAP solutions** in the sidebar menu.

1. In the table of VIS resources, select the name of the VIS you want to stop.

1. Select the **Stop** button. If you can't select this button, the SAP system already isn't running.

    :::image type="content" source="media/start-stop-sap-systems/stop-button.png" lightbox="media/start-stop-sap-systems/stop-button.png" alt-text="Screenshot of the VIS resource menu in the Azure portal, showing the Stop button.":::

1. Select **Yes** in the confirmation prompt to stop the VIS.

    :::image type="content" source="media/start-stop-sap-systems/confirm-stop.png" lightbox="media/start-stop-sap-systems/confirm-stop.png" alt-text="Screenshot of the VIS resource menu in the Azure portal, showing the confirmation prompt to stop the VIS resource.":::

    A notification pane then opens with a **Stopping Virtual Instance for SAP solutions** message.

1. Wait for the VIS resource's **Status** to change to **Stopping**. 

    A notification pane then opens with a **Stopped Virtual Instance for SAP solutions** message.

## Start SAP system

To start an SAP system in the VIS resource: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Center for SAP solutions** in the search bar.

1. Select **Virtual Instances for SAP solutions** in the sidebar menu.

1. In the table of VIS resources, select the name of the VIS you want to start.

1. Select the **Start** button. If you can't select this button, make sure that you've followed the [prerequisites](#prerequisites) for the VMs within your SAP system.

    :::image type="content" source="media/start-stop-sap-systems/start-button.png" lightbox="media/start-stop-sap-systems/start-button.png" alt-text="Screenshot of the VIS resource menu in the Azure portal, showing the Start button.":::

    A notification pane then opens with a **Starting Virtual Instance for SAP solutions** message. The VIS resource's **Status** also changes to **Starting**.

1. Wait for the VIS resource's **Status** to change to **Running**. 

    A notification pane then opens with a **Started Virtual Instance for SAP solutions** message.

## Troubleshooting

If the SAP system takes longer than 300 seconds to complete a start or stop operation, the operation terminates. After the operation terminates, the monitoring service continues to check and update the status of the SAP system in the VIS resource.

## Next steps

- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Get quality checks and insights for a VIS resource](get-quality-checks-insights.md)
