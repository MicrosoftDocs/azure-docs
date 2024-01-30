---
title: Monitor SAP system from the Azure portal
description: Learn how to monitor the health and status of your SAP system, along with important SAP metrics, using the Azure Center for SAP solutions within the Azure portal.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 10/19/2022
author: sagarkeswani
ms.author: sagarkeswani
#Customer intent: As a developer, I want to set up monitoring for my Virtual Instance for SAP solutions, so that I can monitor the health and status of my SAP system in Azure Center for SAP solutions.
---

# Monitor SAP system from Azure portal 



In this how-to guide, you'll learn how to monitor the health and status of your SAP system with *Azure Center for SAP solutions* through the Azure portal. The following capabilities are available for your *Virtual Instance for SAP solutions* resource:

- Monitor your SAP system, along with its instances and VMs.
- Analyze important SAP infrastructure metrics.
- Create and/or register an instance of Azure Monitor for SAP solutions to monitor SAP platform metrics.

## System health

The *health* of an SAP system within Azure Center for SAP solutions is based on the status of its underlying instances. Codes for health are also determined by the collective impact of these instances on the performance of the SAP system.

Possible values for health are:

- **Healthy**: the system is healthy.
- **Unhealthy**: the system is unhealthy.
- **Degraded**: the system shows signs of degradation and possible failure.
- **Unknown**: the health of the system is unknown.

## System status

The *status* of an SAP system within Azure Center for SAP solutions indicates the current state of the system. 

Possible values for status are:

- **Running**: the system is running.
- **Offline**: the system is offline.
- **Partially running**: the system is partially running.
- **Unavailable**: the system is unavailable.

## Instance properties

When you [check the health or status of your SAP system in the Azure portal](#check-health-and-status), the results for each instance are listed and color-coded.

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

The following are different scenarios with the corresponding status and health values.

| Application instance state | ASCS instance state     | System status | System health |
| -------------------------- | ----------------------- | ------------- | ------------- |
| Running and healthy        | Running and healthy     | Running       | Healthy       |
| Running and degraded       | Running and healthy     | Running       | Degraded      |
| Running and unhealthy      | Running and healthy     | Running       | Unhealthy     |

## Health and status codes

When you [check the health or status of your SAP system in the Azure portal](#check-health-and-status), these values are displayed with corresponding symbols.

Depending on the type of instance, there are different color-coded scenarios with different status and health outcomes.

For ASCS and application server instances, the following color-coding applies:

## Check health and status

> [!NOTE]
> After creating your virtual Instance for SAP solutions (VIS), you might need to wait 2-5 minutes to see health and status information.
> 
> The average latency to get health and status information is about 30 seconds.

To check basic health and status settings:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter `SAP on Azure`, then select **Azure Center for SAP solutions** in the results.

1. On the service's page, select **Virtual Instances for SAP solutions** in the sidebar menu.

1. On the page for the VIS, review the table of instances. There is an overview of health and status information for each VIS.

    :::image type="content" source="media/monitor-portal/all-vis-statuses.png" lightbox="media/monitor-portal/all-vis-statuses.png" alt-text="Screenshot of the Azure Center for SAP solutions service in the Azure portal, showing a page of all VIS resources with their health and status information.":::

1. Select the VIS you want to check.

1. On the **Overview** page for the VIS resource, select the **Properties** tab.

    :::image type="content" source="media/monitor-portal/vis-resource-overview.png" lightbox="media/monitor-portal/vis-resource-overview.png" alt-text="Screenshot of the VIS resource overview in the Azure portal, showing health and status information and the Properties tab highlighted.":::

1. On the properties page for the VIS, review the **SAP status** section to see the health of SAP instances. Review the **Virtual machines** section to see the health of VMs inside the VIS.

    :::image type="content" source="media/monitor-portal/properties-tab.png" lightbox="media/monitor-portal/properties-tab.png" alt-text="Screenshot of the Properties tab for the VIS resource overview, showing the SAP status and Virtual machines details.":::

To see information about ASCS instances:

1. Open the VIS in the Azure portal, as previously described.

1. In the sidebar menu, under **SAP resources**, select **Central service instances**.

1. Select an instance from the table to see its properties.

    :::image type="content" source="media/monitor-portal/ascs-vm-details.png" lightbox="media/monitor-portal/ascs-vm-details.png" alt-text="Screenshot of an ASCS instance in the Azure portal, showing health and status information for the VM.":::

To see information about SAP application server instances:

1. Open the VIS in the Azure portal, as previously described.

1. In the sidebar menu, under **SAP resources**, select **App server instances**.

1. Select an instance from the table to see its properties.
    
    :::image type="content" source="media/monitor-portal/app-server-vm-details.png" lightbox="media/monitor-portal/app-server-vm-details.png" alt-text="Screenshot of an Application Server instance in the Azure portal, showing health and status information for the VM.":::

## Monitor SAP infrastructure

Azure Center for SAP solutions enables you to analyze important SAP infrastructure metrics from the Azure portal. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter `SAP on Azure`, then select **Azure Center for SAP solutions** in the results.

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

1. In the search bar, enter `SAP on Azure`, then select **Azure Center for SAP solutions** in the results.

1. On the service's page, select **SAP Virtual Instances** in the sidebar menu.

1. On the page for the VIS, select the VIS from the table.

1. In the sidebar menu for the VIS, under **Monitoring**, select **Azure Monitor for SAP solutions**.

1. Select whether you want to [create a new Azure Monitor for SAP solutions instance](#create-new-azure-monitor-for-sap-solutions-resource), or [register an existing Azure Monitor for SAP solutions instance](#register-existing-azure-monitor-for-sap-solutions-resource). If you don't see this option, you've already configured this setting.

    :::image type="content" source="media/monitor-portal/monitoring-setup.png" lightbox="media/monitor-portal/monitoring-setup.png" alt-text="Screenshot of Azure Monitor for SAP solutions page inside a VIS resource in the Azure portal, showing the option to create or register a new instance.":::

1. After you create or register your Azure Monitor for SAP solutions instance, you are redirected to the Azure Monitor for SAP solutions instance.

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

    1. For **Route All**, choose to enable or disable the option. When you enable this setting, all outbound traffic from the app is affected by your networking configuration.

1. Select the **Review + Create** tab.

### Register existing Azure Monitor for SAP solutions resource

To register an existing Azure Monitor for SAP solutions resource, select the instance from the drop-down menu on the registration page.

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

## Troubleshooting issues with Health and Status on VIS
If an error appears on a successfully registered or deployed Virtual Instance for SAP solutions resource indicating that service is unable to fetch health and status data, then use the guidance provided here to fix problem.

### Error - Unable to fetch health and status data from primary SAP Central services VM
**Possible causes:** 
1. The SAP central services VM might not be running.
2. The monitoring VM extension might not be running or encountered an unexpected failure on the central services VM.
3. The storage account in the managed resource group isn't reachable from the Central service VM(s) or the storage account or underlying container/blob required by the monitoring service may have been deleted.
4. The Central Service VM(s) system assigned managed identity doesn't have ‘Storage Blob Data Owner’ access on the managed RG or this managed identity may have been disabled.
5. The sapstartsrv process might not be running for the SAP instance or for SAP hostctrl agent on the primary Central service VM.
6. The monitoring VM extension couldn't execute the script to fetch health and status information due to policies or restrictions in place on the VM.

**Solution:** 
1. If the SAP Central services VM is not running, then bring up the virtual machine and SAP services on the VM. Once this is done, wait for a few minutes and check if the Health and Status shows up on the VIS resource.
2. Navigate to the SAP Central Services VM on Azure Portal and check if the status of **Microsoft.Workloads.MonitoringExtension** on the Extensions + applications tab shows **Provisioning Succeeded**. If not, raise a support ticket.
3. Navigate to the VIS resource and go to the Managed Resource Group from the Essentials section on Overview. Check if a Storage Account exists in this resource group. If it exists, then check if your virtual network allows connectivity from the SAP central services VM to this storage account. Enable connectivity if needed. If the storage account doesn't exist, then you will have to delete the VIS resource and register the system again.
4. Check if the SAP central services VM system assigned managed identity has the ‘Storage Blob Data Owner’ access on the managed resource group of the VIS. If not, provide the necessary access. If the system assigned managed identity doesn't exist, then you will have to delete the VIS and re-register the system.
5. Ensure sapstartsrv process for the SAP instance and SAP Hostctrl is running on the Central Services VM.
6. If everything mentioned above is in place, then log a support ticket. 

## Next steps

- [Get quality checks and insights for your VIS](get-quality-checks-insights.md)
