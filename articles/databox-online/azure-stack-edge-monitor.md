---
title: Monitor your Azure Stack Edge device | Microsoft Docs 
description: Describes how to use the Azure portal and local web UI to monitor your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 10/11/2021
ms.author: alkohli
---
# Monitor your Azure Stack Edge device

[!INCLUDE [applies-to-GPU-and-pro-r-mini-r-and-fpga-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-fpga-sku.md)]

This article describes how to monitor your Azure Stack Edge device. To monitor your device, you can use the Azure portal or the local web UI. Use the Azure portal to view metrics, view device events, and configure and manage alerts. Use the local web UI on your physical device to view the hardware status of the various device components.

In this article, you learn how to:

> [!div class="checklist"]
>
> * View capacity and transaction metrics for your device
> * View hardware status of device components


## View metrics

[!INCLUDE [Supported OS for clients connected to device](../../includes/data-box-edge-gateway-view-metrics.md)]

### Metrics on your device

This section describes the monitoring metrics on your device. The metrics can be:

* Capacity metrics. The capacity metrics are related to the capacity of the device.

* Transaction metrics. The transaction metrics are related to the read and write operations to Azure Storage.

* Edge compute metrics. The Edge compute metrics are related to the usage of the Edge compute on your device.

A full list of the metrics is shown in the following table:

|Capacity metrics                     |Description  |
|-------------------------------------|-------------|
|**Available capacity**               | Refers to the size of the data that can be written to the device. In other words, this metric is the capacity that can be made available on the device. <br></br>You can free up the device capacity by deleting the local copy of files that have a copy on both the device and the cloud.        |
|**Total capacity**                   | Refers to the total bytes on the device to write data to, which is also referred to as the total size of the local cache. <br></br> You can now increase the capacity of an existing virtual device by adding a data disk. Add a data disk through the hypervisor management for the VM and then restart your VM. The local storage pool of the Gateway device will expand to accommodate the newly added data disk. <br></br>For more information, go to [Add a hard drive for Hyper-V virtual machine](https://www.youtube.com/watch?v=EWdqUw9tTe4). |

|Transaction metrics              | Description         |
|-------------------------------------|---------|
|**Cloud bytes uploaded (device)**    | Sum of all the bytes uploaded across all the shares on your device        |
|**Cloud bytes uploaded (share)**     | Bytes uploaded per share. This metric can be: <br></br> Avg, which is the (Sum of all the bytes uploaded per share / Number of shares),  <br></br>Max, which is the maximum number of bytes uploaded from a share <br></br>Min, which is the minimum number of bytes uploaded from a share      |
|**Cloud download throughput (share)**| Bytes downloaded per share. This metric can be: <br></br> Avg, which is the (Sum of all bytes read or downloaded to a share / Number of shares) <br></br> Max, which is the maximum number of bytes downloaded from a share<br></br> and Min, which is the minimum number of bytes downloaded from a share  |
|**Cloud read throughput**            | Sum of all the bytes read from the cloud across all the shares on your device     |
|**Cloud upload throughput**          | Sum of all the bytes written to the cloud across all the shares on your device     |
|**Cloud upload throughput (share)**  | Sum of all bytes written to the cloud from a share / # of shares is average, max, and min per share      |
|**Read throughput (network)**           | Includes the system network throughput for all the bytes read from the cloud. This view can include data that is not restricted to shares. <br></br>Splitting will show the traffic over all the network adapters on the device, including adapters that are not connected or enabled.      |
|**Write throughput (network)**       | Includes the system network throughput for all the bytes written to the cloud. This view can include data that is not restricted to shares. <br></br>Splitting will show the traffic over all the network adapters on the device, including adapters that are not connected or enabled.          |

| Edge compute metrics              | Description         |
|-------------------------------------|---------|
|**Edge compute - memory usage**      |           |
|**Edge compute - percentage CPU**    |         |


### View device events

[!INCLUDE [Supported OS for clients connected to device](../../includes/data-box-edge-gateway-view-device-events.md)]


## View hardware status

Take the following steps in the local web UI to view the hardware status of your device components.

1. Connect to the local web UI of your device.
2. Go to **Maintenance > Hardware status**. You can view the health of the various device components.

    ![View hardware status](media/azure-stack-edge-monitor/view-hardware-status.png)


## Next steps

- Learn how to [Manage bandwidth](azure-stack-edge-manage-bandwidth-schedules.md).
- Learn how to [Manage alert notifications](azure-stack-edge-gpu-manage-device-event-alert-notifications.md).