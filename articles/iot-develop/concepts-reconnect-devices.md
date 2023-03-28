---
title: Strategy to reconnect devices to Azure IoT Hub
description: Describes key concepts and strategy for developers to reconnect devices to Azure IoT Hub. 
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: conceptual
ms.date: 03/23/2023
ms.custom: template-concept
---

# Strategy to reconnect devices to Azure IoT Hub
This article describes strategies that developers can use to reconnect devices to Azure IoT Hub.  It explains why devices disconnect and need to reconnect. And it offers a strategy to connect devices whether you use IoT Hub alone, or IoT Hub with Azure IoT Device Provisioning Service (DPS). 

## What causes disconnections
The following are the most common reasons that devices disconnect from IoT Hub: 

- Expired SAS token or X.509 certificate. The device's SAS token or X.509 authentication certificate expired. 
- Network interruption. The device's connection to the network is interrupted.
- Service disruption. The Azure IoT Hub service experiences errors or is unavailable. 
- Service reconfiguration. After you reconfigure IoT Hub service settings, it can force devices to disconnect. 

## Why you need a reconnect strategy

It's important to have a strategy to reconnect devices because there are several scenarios where disconnected devices could negatively affect your solution. 

### Mass reconnection attempts could cause a DDoS

A high number of connection attempts per second can cause a condition similar to a distributed denial-of-service attack (DDoS). This scenario is relevant for large fleets of devices numbering in the millions. The issue can extend beyond the tenant that owns the fleet, and affect the entire scale-unit. A DDoS could drive a large cost increase for your Azure IoT Hub resources, due to a need to scale out.  A DDoS could also hurt your solution's performance due to resource starvation. In the worse case, a DDoS can cause service interruption. 

### Hub failure or reconfiguration could disconnect many devices

After an IoT hub experiences a failure, or after you reconfigure service settings on an IoT hub, devices will disconnect. For proper failover, devices must reconnect.  To learn more about failover options, see [IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md).

### Forced device reprovisioning could increase costs

After devices disconnect from one IoT hub and reconnect to another, they must be reprovisioned. If you use IoT Hub with DPS, DPS has a per provisioning cost. If you reprovision many devices on DPS, it increases the cost of your IoT solution. To learn more about DPS provisioning costs, see [IoT Hub DPS pricing](https://azure.microsoft.com/pricing/details/iot-hub). 

## Reconnection concepts

To reconnect devices, it's helpful to understand several background concepts. 

- Backoff with jitter.  For connectivity issues at all layers (TCP, TLS, MQTT), and cases where there's no `retry-after` response sent by the service, you can use an exponential back-off with random jitter function. The `az_iot_retry_calc_delay` function is available in the [azure-iot-common package](https://www.npmjs.com/package/azure-iot-common).

    ```javascript
    // The previous operation took operation_msec.
    // The application calculates random_jitter_msec between 0 and max_random_jitter_msec.
            
    int32_t delay_msec = az_iot_calculate_retry_delay(operation_msec, attempt, min_retry_delay_msec, max_retry_delay_msec, random_jitter_msec);
    ```
    
- Connections you can retry versus connections you can't (for IoT Hub with DPS only). With DPS, some disconnected devices can't reconnect.  Devices that can't reconnect receive the following HTTP responses from the service:
    - 401
    - Unauthorized or 403
    - Forbidden or 404
    - Not Found
  
- Fall back to DPS after 10 retry attempts (for IoT Hub with DPS only). With DPS, we recommend that you use a `MAX_HUB_RETRY` (with the default set to 10) to handle cases where Microsoft Edge, Azure Stack, or IoT Hub changed the endpoint information.

## Hub reconnection flow

If you use IoT Hub only without DPS, use the following reconnection strategy.  

When a device fails to connect to IoT Hub:

1. Use an exponential back-off with jitter delay function. 
1. Reconnect to IoT Hub. 

The following diagram summarizes the reconnection flow:

:::image type="content" source="media/concepts-reconnect-devices/connect-retry-iot-hub.png" alt-text="Diagram of device reconnect flow for IoT Hub." border="false":::


## Hub with DPS reconnection flow

If you use IoT Hub with DPS, use the following reconnection strategy.  

When a device fails to connect to DPS: 
1. Use an exponential back-off with jitter delay function. 
1. Reprovision the device to DPS. 

When a device fails to connect to IoT Hub, you can reconnect based on the following cases. 

If it's an error that allows retried connections (HTTP response code 500):
1. Use an exponential back-off with jitter delay function. 
1. Reconnect to IoT Hub. 

If it's an error that allows retried connections, but reconnection has failed 10 consecutive times: 
- Reprovision the device to DPS. 

If it's an error that doesn't allow retries (HTTP responses 401, Unauthorized or 403, Forbidden or 404, Not Found):
- Reprovision the device to DPS. 

The following diagram summarizes the reconnection flow:

:::image type="content" source="media/concepts-reconnect-devices/connect-retry-iot-hub-with-DPS.png" alt-text="Diagram of device reconnect flow for IoT Hub with DPS." border="false":::

## Next steps
Learn how to use DPS to deploy devices at scale. 

- [Deploy devices at scale](../iot-dps/concepts-deploy-at-scale.md)

