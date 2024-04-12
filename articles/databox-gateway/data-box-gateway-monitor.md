---
title: Monitor your Azure Data Box Gateway device | Microsoft Docs 
description: Describes how to use the Azure portal and local web UI to monitor your Azure Data Box Gateway.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: gateway
ms.topic: how-to
ms.date: 10/20/2020
ms.author: shaas
---
# Monitor your Azure Data Box Gateway

This article describes how to monitor your Azure Data Box Gateway. To monitor your device, you can use Azure portal or the local web UI. Use the Azure portal to view device events, configure and manage alerts, and view metrics.

In this article, you learn how to:

> [!div class="checklist"]
>
> * View device events and the corresponding alerts
> * View capacity and transaction metrics for your device
> * Configure and manage alerts

## View device events

[!INCLUDE [data-box-gateway-view-device-events](../../includes/data-box-gateway-view-device-events.md)]

## View metrics

[!INCLUDE [data-box-gateway-view-metrics](../../includes/data-box-gateway-view-metrics.md)]

### Metrics on your device

This section describes the monitoring metrics on your device. The metrics can be:

* Capacity metrics. The capacity metrics are related to the capacity of the device.

* Transaction metrics. The transaction metrics are related to the read and write operations to Azure Storage.

A full list of the metrics is shown in the following table:

|Capacity metrics                     |Description  |
|-------------------------------------|-------------|
|**Available capacity**               | Refers to the size of the data that can be written to the device. In other words, this is the capacity that can be made available on the device. <br></br>You can free up the device capacity by deleting the local copy of files that have a copy on both the device as well as the cloud.        |
|**Total capacity**                   | Refers to the total bytes on the device to write data to. This is also referred to as the total size of the local cache. <br></br> You can now increase the capacity of an existing virtual device by adding a data disk. Add a data disk through the hypervisor management for the VM and then restart your VM. The local storage pool of the Gateway device will expand to accommodate the newly added data disk. <br></br>For more information, go to [Add a hard drive for Hyper-V virtual machine](https://www.youtube.com/watch?v=EWdqUw9tTe4). |

|Transaction metrics              | Description         |
|-------------------------------------|---------|
|**Cloud bytes uploaded (device)**    | Sum of all the bytes uploaded across all the shares on your device        |
|**Cloud bytes uploaded (share)**     | Bytes uploaded per share. This can be: <br></br> Avg, which is the (Sum of all the bytes uploaded per share / Number of shares),  <br></br>Max, which is the maximum number of bytes uploaded from a share <br></br>Min, which is the minimum number of bytes uploaded from a share      |
|**Cloud download throughput (share)**| Bytes downloaded per share. This can be: <br></br> Avg, which is the (Sum of all bytes read or downloaded to a share / Number of shares) <br></br> Max, which is the maximum number of bytes downloaded from a share<br></br> and Min, which is the minimum number of bytes downloaded from a share  |
|**Cloud read throughput**            | Sum of all the bytes read from the cloud across all the shares on your device     |
|**Cloud upload throughput**          | Sum of all the bytes written to the cloud across all the shares on your device     |
|**Cloud upload throughput (share)**  | Sum of all bytes written to the cloud from a share / # of shares is average, max, and min per share      |
|**Read throughput (network)**           | Includes the system network throughput for all the bytes read from the cloud. This view can include data that is not restricted to shares. <br></br>Splitting will show the traffic over all the network adapters on the device. This includes adapters that are not connected or enabled.      |
|**Write throughput (network)**       | Includes the system network throughput for all the bytes written to the cloud. This view can include data that is not restricted to shares. <br></br>Splitting will show the traffic over all the network adapters on the device. This includes adapters that are not connected or enabled.          |

## Manage alerts

[!INCLUDE [data-box-gateway-manage-alerts](../../includes/data-box-gateway-manage-alerts.md)]

## Next steps

Learn how to [Manage bandwidth](data-box-gateway-manage-bandwidth-schedules.md).
