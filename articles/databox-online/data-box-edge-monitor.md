---
title: Monitor your Azure Data Box Edge device | Microsoft Docs 
description: Describes how to use the Azure portal and local web UI to monitor your Azure Data Box Edge.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 04/10/2019
ms.author: alkohli
---
# Monitor your Azure Data Box Edge

This article describes how to monitor your Azure Data Box Edge. To monitor your device, you can use Azure portal or the local web UI. Use the Azure portal to view device events and configure and view alerts. Use the local web UI to view the hardware status of the various device components.

In this article, you learn how to:

> [!div class="checklist"]
> * View device events
> * View hardware status
> * View alerts

## View device events

Take the following steps in the Azure portal to view a device event.

1. In the Azure portal, go to your Data Box Edge/ Data Box Gateway resource and then go to **Monitoring > Device events**.
2. Select an event and view the alert details. Take appropriate action to resolve the alert condition.

    ![Select event and view details](media/data-box-edge-monitor/view-device-events.png)

## View hardware status

Take the following steps in the local web UI to view the hardware status of your device components.

1. Connect to the local web UI of your device.
2. Go to **Maintenance > Hardware status**. You can view the health of the various device components.

    ![View hardware status](media/data-box-edge-monitor/view-hardware-status.png)

## View alerts

Configure alert rules to inform you of alert conditions related to the consumption of resources on your device. You can configure alert rules to monitor your device for alert conditions. For more detailed information on alerts, go to [Create, view, and manage metric alerts in Azure monitor](../../azure-monitor/platform/alerts-metric.md).

## View metrics

You can also view the metrics to monitor the performance of the device and in some instances for troubleshooting device issues. 

### Create a chart

Take the following steps in the Azure portal to create a chart.

1. For your resource in the Azure portal, go to **Monitoring > Metrics** and select **Add metric**.

    ![Add metric](media/data-box-edge-monitor/view-metrics-1.png)

2. The resource is automatically populated.  

    ![Current resource](media/data-box-edge-monitor/view-metrics-2.png)

    To specify another resource, select the resource. On **Select a resource** blade, select the subscription, resource group, resource type, and the specific resource for which you want to show the metrics and select **Apply**.

    ![Choose another resource](media/data-box-edge-monitor/view-metrics-3.png)

3. From the dropdown list, select a metrics to use to monitor your device. These can be **Capacity metrics** or **Transaction metrics**. The capacity metrics are related to the capacity of the device. The transaction metrics are related to the read and write operations to Azure Storage.

    |Capacity metrics                     |Description  |
    |-------------------------------------|-------------|
    |**Available capacity**               | Refers to the size of the data that can be written to the device. In other words, this is the capacity that can be made available on the device. <br></br>You can free up the device capacity by deleting the local copy of files that have a copy on both the device as well as the cloud.        |
    |**Total capacity**                   | Refers to the total bytes on the device to write data to. This is also referred to as the total size of the local cache. <br></br> You can now increase the capacity of an existing virtual device by adding a data disk. Add a data disk through the hypervisor management for the VM and then restart your VM. The local storage pool of the Gateway device will expand to accommodate the newly added data disk. <br></br>For more information, go to [Add a hard drive for Hyper-V virtual machine](https://www.youtube.com/watch?v=EWdqUw9tTe4). |
    
    |**Transaction metrics**              | Description         |
    |-------------------------------------|---------|
    |**Cloud bytes uploaded (device)**    | Sum of all bytes uploaded across all shares        |
    |**Cloud bytes uploaded (share)**     | Sum of all bytes uploaded per share / # of shares is average, max and min       |
    |**Cloud download throughput (share)**| Sum of all bytes read or downloaded to a share / # of shares is average, max, and min   per share     |
    |**Cloud read throughput**            | Sum of all the bytes read from the cloud across all the shares     |
    |**Cloud upload throughput**          | Sum of all the bytes written to the cloud across all the shares      |
    |**Cloud upload throughput (share)**  | Sum of all bytes written to the cloud from a share / # of shares is average, max, and min per share      |
    |**Read throughput (network)**           | Includes the system network throughput for all the bytes read from the cloud. This view can include data that is not restricted to shares such as updates or support package. <br></br>Splitting will show the traffic over all the network adapters on the device. This includes adapters that are not connected or enabled.      |
    |**Write throughput (network)**       | Includes the system network throughput for all the bytes written to the cloud. This view can include data that is not restricted to shares such as updates or support package. <br></br>Splitting will show the traffic over all the network adapters on the device. This includes adapters that are not connected or enabled.          |
    |**Edge compute - memory usage**      | Memory usage for the IoT Edge device for your Data Box Edge. If you see a high usage and if your performance is affected by the current workloads that you have deployed, contact Microsoft Support to determine next steps. <br></br>This metrics is not populated for Data Box Gateway.          |
    |**Edge compute - percentage CPU**    | CPU usage for IoT Edge device for your Data Box Edge. If you see a high usage and if your performance is affected by the current workloads that you have deployed, contact Microsoft Support to determine next steps. <br></br>This metrics is not populated for Data Box Gateway.        |
4. When a metric is selected from the dropdown list, aggregation can also be defined. Aggregation refers to the actual value aggregated over a specified span of time. The aggregated values can be average, minimum, or the maximum value. Select the Aggregation from Avg, Max or Min.
5. If the metrics you selected has multiple instances, then the splitting option is available. Select Apply splitting and then select the parameter by which you want to see the breakdown.

+ New chart
+ Refresh
+ Share - To export the chart data to an Excel spreadsheet. You can also get a link to this chart that you can share.



## Next steps

- Learn how to [Manage bandwidth](data-box-edge-manage-bandwidth-schedules.md).
