---
title: Understanding Azure Digital Twins Data Processing, User-Defined Functions, and computation | Microsoft Docs
description: Using Azure Digital Twins User-Defined Functions for data processing and computation
author: adamgerard
manager: timlt
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: adgera
---

# Azure Digital Twins Data Processing, User-Defined Functions, and Computation

Azure Digital Twins provides **User-Defined Functions** to process data, specify custom logic, and automatically handle events for an IoT Topology.

Digital Twins leverages [Azure Stream Analytics User-Defined Functions](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-javascript-user-defined-functions) written in JavaScript.

## Data Processing

Azure Digital Twins provides [Azure IoT Hub](https://azure.microsoft.com/en-us/resources/samples/functions-js-iot-hub-processing/) event and data processing.

For example, device data can be streamed to event and data ingress endpoints then handled to customized JavaScript handlers.

## User-Defined Functions

A **User-Defined Function** can be assigned to a specific node in order to assign custom repeat or automatic operations like event handling and data processing.

**User-Defined Functions** can be assigned for individual or grouped devices and sensors providing reuse and resource management flexibility.

## Next steps

Read more about User-Defined Functions for Azure Stream Analytics:

> [!div class="nextstepaction"]
> [JavaScript stream UDFs](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-javascript-user-defined-functions)
