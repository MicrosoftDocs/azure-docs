---
title: Understand the IP address of an IoT hub | Microsoft Docs
descrIPtion: Understand how to query your IoT hub IP address and its properties
author: philmea
manager: philmea
ms.author: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/22/2019
---

# Understand the IP address for your IoT hub

The IP address of your IoT hub is a load-balanced public endpoint for your hub and NOT a dedicated IP address. It is determined by the network address range of the Azure region where it is deployed. This IP address is subject to change without notice, due to circumstances such as datacenter network updates, datacenter disaster recovery, or regional failover of an IoT hub. See [IoT Hub high availability and disaster recovery](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-ha-dr) for more detail on Azure IoT Hub regional failover and availability. The IP address changes rarely and mainly after a regional failover.

The IP address of a geo-paired IoT hub changes after a failover to another region. You can test this functionality by following the tutorial [Perform a manual failover of an IoT hub](https://docs.microsoft.com/en-us/azure/iot-hub/tutorial-manual-failover).

## Discover your IoT hub IP address

Your IoT Hub IP address can be discovered by using a reverse DNS lookup on the cname ([*iot-hub-name*].azure-devices.net). You can use nslookup to verify the IP address of an IoT hub instance:\

```cmd/sh
nslookup {YourIoTHubName}.azure-devices.net
```

This IP address is subject to change without notice. In the case of a failover or disaster recovery scenario, you will have to re-discover your IoT hub IP address in the secondary region.

## Outbound firewall rules for IoT hub

If your firewall is configured to allow outbound traffic only to specific addresses, you will need to regularly poll your IoT hub IP address and update your firewall rules.

If your firewall does not allow filtering based on host name or domain, you will need to regularly query your IoT Hub for it's IP address. 



