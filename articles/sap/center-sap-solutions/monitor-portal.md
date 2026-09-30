---
title: Monitor SAP system from the Azure portal
description: Learn how to monitor the health and status of your SAP system, along with important SAP metrics, using the Azure Center for SAP solutions within the Azure portal.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 03/30/2026
author: sagarkeswani
ms.author: sagarkeswani
ms.custom: sfi-image-nochange
#Customer intent: As a systems administrator, I want to monitor the health and status of my SAP system from the Azure portal so that I can ensure optimal performance and quickly address any issues that arise.
---

# Monitor an SAP system from the Azure portal

[Azure Center for SAP solutions](overview.md) lets you deploy and manage SAP systems as a unified workload on Azure. When you run SAP workloads in Azure, you need visibility into system health and infrastructure performance to identify degradation and resolve issues before they affect your business processes.

In this article, you check the health and status of your SAP system and its instances, analyze infrastructure metrics such as CPU and IOPS, and configure Azure Monitor for SAP solutions for deeper platform-level monitoring.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A deployed [Virtual Instance for SAP solutions (VIS)](manage-virtual-instance.md) with a running SAP system, including ASCS, application server, and database instances.
- Azure portal access with at least **Reader** permissions on the VIS resource group.
- A virtual network and subnet in your Azure subscription (required only if you plan to [create a new Azure Monitor for SAP solutions instance](#create-new-azure-monitor-for-sap-solutions-resource)).

## System health

The *health* of an SAP system within Azure Center for SAP solutions is based on the status of its underlying instances. Health codes also reflect the collective impact of these instances on SAP system performance.

Possible values for health are:

- **Healthy**: The system is healthy.
- **Unhealthy**: The system is unhealthy.
- **Degraded**: The system shows signs of degradation and possible failure.
- **Unknown**: The health of the system is unknown.

## System status

The *status* of an SAP system within Azure Center for SAP solutions indicates the current state of the system.

Possible values for status are:

- **Running**: The system is running.
- **Offline**: The system is offline.
- **Partially running**: The system is partially running.
- **Unavailable**: The system is unavailable.

## Instance properties

When you [check the health or status of your SAP system in the Azure portal](#check-health-and-status), you see color-coded results for each instance.

### Color-coding for states

For ASCS and application server instances:

| Color code   | Status      | Health      |
| ------------ | ----------- | ----------- |
| Green        | Running     | Healthy     |
| Yellow       | Running     | Degraded    |
| Red          | Running     | Unhealthy   |
| Gray         | Unavailable | Unknown     |

For database instances:

| Color code      | Status      |
| --------------- | ----------- |
| Green           | Running     |
| Yellow          | Unavailable |
| Red             | Unavailable |
| Gray            | Unavailable |

### Example scenarios

The following table shows different scenarios with the corresponding status and health values.

| Application instance state | ASCS instance state     | System status | System health |
| -------------------------- | ----------------------- | ------------- | ------------- |
| Running and healthy        | Running and healthy     | Running       | Healthy       |
| Running and degraded       | Running and healthy     | Running       | Degraded      |
| Running and unhealthy      | Running and healthy     | Running       | Unhealthy     |

## Health and status codes

When you [check the health or status of your SAP system in the Azure portal](#check-health-and-status), the values are displayed with corresponding symbols. The color-coding conventions described in [Color-coding for states](#color-coding-for-states) apply to the values shown on the VIS properties page.

## Check health and status

> [!NOTE]
> After you create your Virtual Instance for SAP solutions (VIS), you might need to wait two to five minutes to see health and status information.
>
> The average latency to get health and status information is about 30 seconds.

To check basic health and status settings:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter `SAP on Azure`, and then select **Azure Center for SAP solutions** in the results.

1. On the service's page, select **Virtual Instances for SAP solutions** in the sidebar menu.

1. On the page for the VIS, review the table of instances. There's an overview of health and status information for each VIS.

   :::image type="content" source="media/monitor-portal/all-vis-statuses.png" lightbox="media/monitor-portal/all-vis-statuses.png" alt-text="Screenshot of the Azure Center for SAP solutions service in the Azure portal, showing a page of all VIS resources with their health and status information.":::

1. Select the VIS you want to check.

1. On the **Overview** page for the VIS resource, select the **Properties** tab.

   :::image type="content" source="media/monitor-portal/vis-resource-overview.png" lightbox="media/monitor-portal/vis-resource-overview.png" alt-text="Screenshot of the VIS resource overview in the Azure portal, showing health and status information and the Properties tab highlighted.":::

1. On the properties page for the VIS, review the **SAP status** section to see the health of SAP instances. Review the **Virtual machines** section to see the health of VMs inside the VIS.

   :::image type="content" source="media/monitor-portal/properties-tab.png" lightbox="media/monitor-portal/properties-tab.png" alt-text="Screenshot of the Properties tab for the VIS resource overview, showing the SAP status and Virtual machines details.":::

To see information about ASCS instances:

1. Open the VIS in the Azure portal, as previously described.

1. In the sidebar menu, under **SAP resources**, select **Central service instances**.

1. To see its properties, select an instance from the table.

   :::image type="content" source="media/monitor-portal/ascs-vm-details.png" lightbox="media/monitor-portal/ascs-vm-details.png" alt-text="Screenshot of an ASCS instance in the Azure portal, showing health and status information for the VM.":::

To see information about SAP application server instances:

1. Open the VIS in the Azure portal, as previously described.

1. In the sidebar menu, under **SAP resources**, select **App server instances**.

1. To see its properties, select an instance from the table.

   :::image type="content" source="media/monitor-portal/app-server-vm-details.png" lightbox="media/monitor-portal/app-server-vm-details.png" alt-text="Screenshot of an Application Server instance in the Azure portal, showing health and status information for the VM.":::

## Monitor SAP infrastructure

Azure Center for SAP solutions enables you to analyze important SAP infrastructure metrics from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter `SAP on Azure`, and then select **Azure Center for SAP solutions** in the results.

1. On the service's page, select **SAP Virtual Instances** in the sidebar menu.

1. On the page for the VIS, select the VIS from the table.

1. On the overview page for the VIS, select the **Monitoring** tab.

   :::image type="content" source="media/monitor-portal/vis-resource-overview-monitoring.png" lightbox="media/monitor-portal/vis-resource-overview-monitoring.png" alt-text="Screenshot of the Monitoring tab for a VIS resource in the Azure portal, showing monitoring charts for CPU utilization and IOPS.":::

1. Review the monitoring charts, which include:

   1. CPU utilization by the Application server and ASCS server

   1. IOPS percentage consumed by the Database server instance

   1. CPU utilization by the Database server instance

1. Select any of the monitoring charts to do more in-depth analysis with Azure Monitor metrics explorer.

## Configure Azure Monitor

You can also set up or register Azure Monitor for SAP solutions to monitor SAP platform-level metrics.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter `SAP on Azure`, and then select **Azure Center for SAP solutions** in the results.

1. On the service's page, select **SAP Virtual Instances** in the sidebar menu.

1. On the page for the VIS, select the VIS from the table.

1. Under **Monitoring**, select **Azure Monitor for SAP solutions**.

1. Choose whether to [create a new Azure Monitor for SAP solutions instance](#create-new-azure-monitor-for-sap-solutions-resource) or [register an existing Azure Monitor for SAP solutions instance](#register-existing-azure-monitor-for-sap-solutions-resource). If you don't see this option, you already configured this setting.

   :::image type="content" source="media/monitor-portal/monitoring-setup.png" lightbox="media/monitor-portal/monitoring-setup.png" alt-text="Screenshot of Azure Monitor for SAP solutions page inside a VIS resource in the Azure portal. It shows the option to create or register a new instance.":::

   After you create or register your Azure Monitor for SAP solutions instance, the portal redirects you to that instance.

### Create new Azure Monitor for SAP solutions resource

To configure a new Azure Monitor for SAP solutions resource:

1. On the **Create new Azure Monitor for SAP solutions resource** page, select the **Basics** tab.

   :::image type="content" source="media/monitor-portal/ams-creation.png" lightbox="media/monitor-portal/ams-creation.png" alt-text="Screenshot of Azure Monitor for SAP solutions creation page, showing the Basics tab and required fields.":::

1. Under **Project details**, configure your resource.

   1. For **Subscription**, select your Azure subscription.

   1. For **Azure Monitor for SAP solutions resource group**, select the same resource group as the VIS.

   > [!IMPORTANT]
   > If you select a resource group that's different from the resource group of the VIS, the deployment fails.

1. Under **Azure Monitor for SAP solutions instance details**, configure your Azure Monitor for SAP solutions instance.

   1. For **Resource name**, enter a name for your Azure Monitor for SAP solutions resource.

   1. For **Workload region**, select an Azure region for your workload.

1. Under **Networking**, configure networking information.

   1. For **Virtual network**, select a virtual network to use.

   1. For **Subnet**, select a subnet in your virtual network.

   1. For **Route All**, choose to enable or disable the option. When you enable this setting, your networking configuration affects all outbound traffic from the app.

1. Select the **Review + Create** tab.

### Register existing Azure Monitor for SAP solutions resource

To register an existing Azure Monitor for SAP solutions resource, select the instance from the dropdown menu on the registration page.

> [!NOTE]
> You can only view and select the current version of Azure Monitor for SAP solutions resources. Azure Monitor for SAP solutions (classic) resources aren't available.

:::image type="content" source="media/monitor-portal/ams-registration.png" lightbox="media/monitor-portal/ams-registration.png" alt-text="Screenshot of Azure Monitor for SAP solutions registration page, showing the selection of an existing Azure Monitor for SAP solutions resource.":::

### Unregister Azure Monitor for SAP solutions from VIS

> [!NOTE]
> This operation only unregisters the Azure Monitor for SAP solutions resource from the VIS. To delete the Azure Monitor for SAP solutions resource, you need to delete the Azure Monitor for SAP solutions instance.

To remove the link between your Azure Monitor for SAP solutions resource and your VIS:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the sidebar menu, under **Monitoring**, select **Azure Monitor for SAP solutions**.

1. On the Azure Monitor for SAP solutions page, select **Delete** to unregister the resource.

1. Wait for the confirmation message, **Azure Monitor for SAP solutions has been unregistered successfully**.

## Troubleshoot health and status issues on VIS

If an error appears on a successfully registered or deployed Virtual Instance for SAP solutions resource that indicates the service can't fetch health and status data, use the following guidance to fix the problem.

### Error: Unable to fetch health and status data from primary SAP Central Services VM

**Possible causes:**

- The SAP Central Services VM might not be running.
- The monitoring VM extension might not be running, or it might encounter an unexpected failure on the Central Services VM.
- The storage account in the managed resource group isn't reachable from the Central Services VMs. Or the storage account or underlying container or blob required by the monitoring service is deleted.
- The Central Services VM system-assigned managed identity doesn't have Storage Blob Data Owner access on the managed resource group, or the managed identity is disabled.
- The `sapstartsrv` process might not be running for the SAP instance or for the SAP host control agent on the primary Central Services VM.
- The monitoring VM extension couldn't execute the script to fetch health and status information due to policies or restrictions in place on the VM.

**Solution:**

1. If the SAP Central Services VM isn't running, start the VM and SAP services on the VM. Wait a few minutes and check whether the health and status information appears on the VIS resource.
1. Go to the SAP Central Services VM in the Azure portal and check whether the status of **Microsoft.Workloads.MonitoringExtension** on the **Extensions + applications** tab shows **Provisioning Succeeded**. If not, create a support ticket.
1. Go to the VIS resource and navigate to the managed resource group from the **Essentials** section on **Overview**. Check whether a storage account exists in this resource group. If the storage account exists, check whether your virtual network allows connectivity from the SAP Central Services VM to this storage account and enable connectivity if needed. If the storage account doesn't exist, you must delete the VIS resource and register the system again.
1. Check whether the SAP Central Services VM system-assigned managed identity has Storage Blob Data Owner access on the managed resource group of the VIS. If not, provide the necessary access. If the system-assigned managed identity doesn't exist, you must delete the VIS and re-register the system.
1. Make sure the `sapstartsrv` process for the SAP instance and SAP host control is running on the Central Services VM.
1. If everything mentioned earlier is in place, create a support ticket.

### Error: Database status shows unavailable in the Azure portal

**Possible causes:**

The database list wasn't passed to the health and status script arguments. This causes the database status to show as unavailable.

This error can happen in two scenarios:

- The SID of the database and HANA instance isn't the same. This causes database details to not be discovered in the discovery workflow.

- You have a multi-database cluster, which also results in this error.

**Solution:**

Make sure the HANA instance and its database are mapped to the same SID.

## Related content

- [Get quality checks and insights for your VIS](get-quality-checks-insights.md)
- [What is Azure Center for SAP solutions?](overview.md)
- [What is Azure Monitor for SAP solutions?](/azure/sap/monitor/about-azure-monitor-sap-solutions)
