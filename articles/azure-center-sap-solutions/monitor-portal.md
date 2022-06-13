---
title: Monitor SAP system from the Azure portal (preview)
description: Learn how to monitor the health and status of your SAP system, along with important SAP metrics, using the Azure Center for SAP Solutions (ACSS) within the Azure portal.
ms.service: azure-center-sap-solutions
ms.topic: how-to
ms.date: 07/01/2022
author: lauradolan
ms.author: ladolan
---

# Monitor SAP system from Azure portal (preview)

[!INCLUDE [Preview content notice](./includes/preview.md)]

You can monitor the health and status of your SAP system with the Azure Center for SAP Solutions (ACSS) in the Azure portal. The following capabilities are available:

- Monitor your SAP system, along with its instances and VMs.
- Analyze important SAP infrastructure metrics.
- Create and/or register an instance of Azure Monitor for SAP solutions to monitor SAP platform metrics.

## System health

The *health* of an SAP system within ACSS is based on the status of its underlying instances. Codes for health are also determined by the collective impact of these instances on the performance of the SAP system.

Possible values for health are:

- **Healthy**: the system is healthy.
- **Unhealthy**: the system is unhealthy.
- **Degraded**: the system shows signs of degradation and possible failure.
- **Unknown**: the health of the system is unknown.

## System status

The *status* of an SAP system within ACSS indicates the current state of the system. 

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
> After creating your virtual instance for SAP (VIS), you might need to wait 2-5 minutes to see health and status information.
> 
> The average latency to get health and status information is about 30 seconds.

To check basic health and status settings:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter `SAP on Azure`, then select **Azure Center for SAP solutions** in the results.

1. On the service's page, select **Virtual Instances for SAP solutions** in the sidebar menu.

1. On the page for the VIS, review the table of instances. There is an overview of health and status information for each VIS.

1. Select the VIS you want to check.

1. On the overview page for the VIS, review basic health and status information.

1. In the sidebar menu, under **Settings**, select **Properties**.

1. On the properties page for the VIS, review the health properties. 

    1. Review the **SAP status** section to see the health of SAP instances. 

    1. Review the **Virtual machines** section to see the health of VMs inside the VIS.

To see information about ASCS instances:

1. Open the VIS in the Azure portal, as previously described.

1. In the sidebar menu, under **SAP resources**, select **Central service instances**.

1. On the page for ASCS instances, select the instance from the table.

1. On the instance's page, select **Virtual machines** to see the status of underlying VMs.

To see information about SAP application server instances:

1. Open the VIS in the Azure portal, as previously described.

1. In the sidebar menu, under **SAP resources**, select **App server instances**.

1. Select a server instance from the table to see its properties.
    

## Monitor SAP infrastructure

ACSS enables you to analyze important SAP infrastructure metrics from the Azure portal. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter `SAP on Azure`, then select **Azure Center for SAP solutions** in the results.

1. On the service's page, select **SAP Virtual Instances** in the sidebar menu.

1. On the page for the VIS, select the VIS from the table.

1. On the overview page for the VIS, select the **Monitoring** tab.


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

1. In the sidebar menu for the VIS, under **Monitoring**, select **Azure Monitor for SAP**.


1. Select whether you want to [create a new Azure Monitor for SAP (AMS) instance](#create-new-ams-resource), or [register an existing AMS instance](#register-existing-ams-resource). If you don't see this option, you've already configured this setting.

1. After you create or register your AMS instance, you are redirected to the AMS instance.

### Create new AMS resource

To configure a new AMS resource:

1. On the **Create new AMS resource** page, select the **Basics** tab.

1. Under **Project details**, configure your resource.

    1. For **Subscription**, select your Azure subscription.

    1. For **AMS resource group**, select the same resource group as the VIS.

    > [!IMPORTANT]
    > If you select a resource group that's different from the resource group of the VIS, the deployment fails.

1. Under **AMS instance details**, configure your AMS instance.

    1. For **Resource name**, enter a name for your AMS resource.

    1. For **Workload region**, select an Azure region for your workload.

1. Under **Networking**, configure networking information.

    1. For **Virtual network**, select a virtual network to use.

    1. For **Subnet**, select a subnet in your virtual network.

    1. For **Route All**, choose to enable or disable the option. When you enable this setting, all outbound traffic from the app is affected by your networking configuration.


1. Select the **Review + Create** tab.

### Register existing AMS resource

To register an existing **AMS resource**, select the instance from the drop-down menu on the **Register AMS** page.

> [!NOTE]
> You can only view and select new AMS 2.0 resources. Previous versions aren't available.

## Unregister AMS from VIS

> [!NOTE]
> This operation only unregisters the AMS resource from the VIS. To delete the AMS resource, you need to delete the AMS instance.

To remove the link between your AMS resource and your VIS:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the sidebar menu, under **Monitoring**, select **Azure Monitor for SAP**.

1. On the AMS resource page, select **Delete** to delete the resource.

1. Wait for the confirmation message, **Azure Monitor for SAP Solutions has been unregistered successfully**.

## Next steps

- [Learn about ACSS](overview.md)
