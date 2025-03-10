---
 title: include file
 description: include file
 services: iot-hub
 author: dominicbetts
 ms.service: azure-iot-hub
 ms.topic: include
 ms.date: 02/20/2023
 ms.author: dobett
 ms.custom: include file
---

These SDKs were designed and created to run on devices with limited compute and memory resources and are implemented using the C language.

The embedded device SDKs are available for **multiple operating systems** providing the flexibility to choose which best suits your scenario.

| RTOS | SDK | Source | Samples | Reference |
| :-- | :-- | :-- | :-- | :-- |
| **Eclipse ThreadX** | Azure RTOS Middleware | [GitHub](https://github.com/eclipse-threadx/netxduo) | [Quickstarts](/azure/iot/tutorial-devkit-mxchip-az3166-iot-hub) | [Reference](https://github.com/eclipse-threadx/netxduo/tree/master/addons/azure_iot) | 
| **FreeRTOS** | FreeRTOS Middleware | [GitHub](https://github.com/Azure/azure-iot-middleware-freertos) | [Samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples) | [Reference](https://azure.github.io/azure-iot-middleware-freertos) |
| **Bare Metal** | Azure SDK for Embedded C | [GitHub](https://github.com/Azure/azure-sdk-for-c) | [Samples](https://github.com/Azure/azure-sdk-for-c/blob/master/sdk/samples/iot/README.md) | [Reference](https://azure.github.io/azure-sdk-for-c) |
