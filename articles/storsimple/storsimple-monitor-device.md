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

You can use the StorSimple Manager service to monitor specific devices within your StorSimple solution. You can create custom charts based on I/O performance, capacity utilization, network throughput, and device performance metrics. To view the monitoring information for a specific device, in the Management Portal, select the StorSimple Manager service, click the **Monitor** tab, and then select from the list of devices. The following information will appear.

## I/O performance 

**I/O performance** tracks metrics related to the number of read and write operations between either the iSCSI initiator interfaces on the host server and the device or the device and the cloud. This performance can be measured for a specific volume, a specific volume container, or all volume containers.

## Capacity utilization 

**Capacity utilization** tracks metrics related to the amount of data storage space that is used by the volumes, volume containers, or device. You can create reports based on the capacity utilization of your primary storage, your cloud storage, or your device storage. Capacity utilization can be measured on a specific volume, a specific volume container, or all volume containers.

- **Primary storage capacity utilization** shows the amount of data written to StorSimple volumes before the data is deduplicated and compressed.

- **Cloud storage capacity utilization** shows the amount of cloud storage used. This data is deduplicated and compressed. This amount includes cloud snapshots which might contain data that isn't reflected in any primary volume and is kept for legacy or required retention purposes. You can compare the primary and cloud storage consumption figures to get an idea of the data reduction rate, although the number will not be exact.

- **Device storage capacity utilization** shows the total utilization for the device, which will be more than primary storage utilization because it includes the SSD linear tier. This tier contain an amount of data that also exists on the device's other tiers. The capacity in the SSD linear tier is cycled so that when new data comes in, the old data is moved to the cloud (at which time it is deduplicated and compressed).

Over time, primary capacity utilization and device capacity utilization will most likely increase together until the data begins to be tiered to the cloud. At that point, the device capacity utilization will probably begin to plateau, but the primary capacity utilization will increase as more data is written.

## Network throughput** 

**Network throughput** tracks metrics related to the amount of data transferred from the iSCSI initiator network interfaces on the host server and the device and between the device and the cloud. You can monitor this metric for each of the iSCSI network interfaces on your device.

## Device performance 

**Device performance** tracks metrics related to the performance of your device.

## Next steps

[Learn how to use the StorSimple Manager service device dashboard](storsimple-device-dashboard.md).
