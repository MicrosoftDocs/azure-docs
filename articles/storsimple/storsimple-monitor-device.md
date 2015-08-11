<properties 
   pageTitle="Use the StorSimple Manager service to monitor your StorSimple device | Microsoft Azure"
   description="Describes how to use the StorSimple Manager service to monitor I/O performance, capacity utilization, network throughput, and device performance."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="08/10/2015"
   ms.author="alkohli" />

# Use the StorSimple Manager service to monitor your StorSimple device 

## Overview

You can use the StorSimple Manager service to monitor specific devices within your StorSimple solution. You can create custom charts based on I/O performance, capacity utilization, network throughput, and device performance metrics. 

To view the monitoring information for a specific device, in the Management Portal, select the StorSimple Manager service, click the **Monitor** tab, and then select from the list of devices. The **Monitor** page contains the following information.

## I/O performance 

**I/O performance** tracks metrics related to the number of read and write operations between either the iSCSI initiator interfaces on the host server and the device or the device and the cloud. This performance can be measured for a specific volume, a specific volume container, or all volume containers.

The chart below shows the IOs for your device for all the volumes for a production device. The metrics plotted are read and write Bytes/s, read and write IOs/s and read and write latencies.

![IO performance from initiator to device](./media/storsimple-monitor-device/StorSimple_IO_Performance_For_InitiatorTODevice_For_AllVolumesM.png)

For the same device, the IOs are plotted for data from device to the cloud for all the volume containers. On this device, the data is only in the linear tier and nothing has spilled to the cloud. Consequently, the peaks in the chart are at an interval of 5 minutes that corresponds to the frequency at which the heartbeat is checked between the device and the service. 

![IO performance from device to cloud](./media/storsimple-monitor-device/StorSimple_IO_Performance_For_DeviceTOCloud_For_AllVolumeContainersM.png)



## Capacity utilization 

**Capacity utilization** tracks metrics related to the amount of data storage space that is used by the volumes, volume containers, or device. You can create reports based on the capacity utilization of your primary storage, your cloud storage, or your device storage. Capacity utilization can be measured on a specific volume, a specific volume container, or all volume containers.

Use the capacity utilization charts in conjunction with the device dashboard. Both the device dashboard and the capacity utilization chart for a production device are shown below.

The dashboard indicates that 2.09 TB of storage is actually used whereas 20 TB is provisioned out of maximum available 200 TB. The primary storage used is 1.16 TB whereas the cloud storage used is 1.25 TB.

![Device dashboard for StorSimple device](./media/storsimple-monitor-device/StorSimple_DeviceDashbaord1M.png)

The primary, cloud and device storage capacity can be described as follows:

- **Primary storage capacity utilization** shows the amount of data written to StorSimple volumes before the data is deduplicated and compressed.

- **Cloud storage capacity utilization** shows the amount of cloud storage used. This data is deduplicated and compressed. This amount includes cloud snapshots which might contain data that isn't reflected in any primary volume and is kept for legacy or required retention purposes. You can compare the primary and cloud storage consumption figures to get an idea of the data reduction rate, although the number will not be exact.

- **Device storage capacity utilization** shows the total utilization for the device, which will be more than primary storage utilization because it includes the SSD linear tier. This tier contain an amount of data that also exists on the device's other tiers. The capacity in the SSD linear tier is cycled so that when new data comes in, the old data is moved to the cloud (at which time it is deduplicated and compressed).

Over time, primary capacity utilization and device capacity utilization will most likely increase together until the data begins to be tiered to the cloud. At that point, the device capacity utilization will probably begin to plateau, but the primary capacity utilization will increase as more data is written.

## Network throughput

**Network throughput** tracks metrics related to the amount of data transferred from the iSCSI initiator network interfaces on the host server and the device and between the device and the cloud. You can monitor this metric for each of the iSCSI network interfaces on your device.

The charts below show the network throughput for the Data 0 and Data 4, both 1 GbE network interfaces on your device. In this instance, Data 0 was cloud-enabled whereas Data 4 was iSCSI-enabled. You can see both the inbound and the outbound traffic for your StorSimple device.

![Network throughput for Data4](./media/storsimple-monitor-device/StorSimple_NetworkThroughput_Data0M.png)

![Network throughput for Data4](./media/storsimple-monitor-device/StorSimple_NetworkThroughput_Data4M.png)


## Device performance 

**Device performance** tracks metrics related to the performance of your device. The chart below shows the CPU utilization stats for a device in production.

![CPU utilization for device](./media/storsimple-monitor-device/StorSimple_DeviceMonitor_DevicePerformance1M.png)

## Next steps

[Learn how to use the StorSimple Manager service device dashboard](storsimple-device-dashboard.md).
