---
title: Azure Industrial IoT platform versions
description: This article provides an overview of the existing version of the Industrial IoT platform and their support.
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.topic: overview
ms.date: 11/10/2021
---
# Azure Industrial IoT Platform Release 2.8.2
We're pleased to announce the release of version 2.8.2 of our Industrial IoT Platform components as a second patch update of the 2.8 Long-Term Support (LTS) release. This release contains important backward compatibility fixes including Direct Methods API support with version 2.5.x, performance optimizations and security updates and bug fixes.

## Azure Industrial IoT Platform Release 2.8.1
We're pleased to announce the release of version 2.8.1 of our Industrial IoT Platform components. This is the first patch update of the 2.8 Long-Term Support (LTS) release. It contains important security updates, bug fixes, and performance optimizations.

## Azure Industrial IoT Platform Release 2.8

We're pleased to announce the declaration of Long-Term Support (LTS) for version 2.8. While we continue to develop and release updates to our ongoing projects on GitHub, we now also offer a branch that will only get critical bug fixes and security updates starting in July 2021. Customers can rely upon a longer-term support lifecycle for these LTS builds, providing stability and assurance for the planning on longer time horizons our customers require. The LTS branch offers customers a guarantee that they'll benefit from any necessary security or critical bug fixes with minimal impact to their deployments and module interactions.  At the same time, customers can access the latest updates in the [main branch](https://github.com/Azure/Industrial-IoT) to keep pace with the latest developments and fastest cycle time for product updates. 

## Version history 

|Version      |Type                   |Date         |Highlights                             |
|-------------|-----------------------|-------------|---------------------------------------|
|2.5.4        |Stable                 |March 2020   |IoT Hub Direct Method Interface, control from cloud without any microservices (standalone mode), OPC UA Server interface, uses OPC Foundation's OPC stack - [Release notes](https://github.com/Azure/Industrial-IoT/releases/tag/2.5.4)|
| 2.7.206 |Stable                 |January 2021 |Configuration through REST API (orchestrated mode), supports Samples telemetry format and PubSub format - [Release notes](https://github.com/Azure/Industrial-IoT/releases/tag/2.7.206)|
|[2.8](https://github.com/Azure/Industrial-IoT/tree/2.8.0)        |Long-term support (LTS)|July 2021    |IoT Edge update to 1.1 LTS, OPC stack logging and tracing for better OPC Publisher diagnostics, Security fixes - [Release notes](https://github.com/Azure/Industrial-IoT/releases/tag/2.8.0)|
|[2.8.1](https://github.com/Azure/Industrial-IoT/tree/2.8.1)        |Patch release for LTS 2.8|November 2021    |Critical bug fixes, security updates, performance optimizations for LTS v2.8|
|[2.8.2](https://github.com/Azure/Industrial-IoT/tree/2.8.2)        |Patch release for LTS 2.8|March 2022    |Backwards compatibility with 2.5.x, bug fixes, security updates, performance optimizations for LTS v2.8|

## Next steps

> [!div class="nextstepaction"]
> [What is Industrial IoT?](overview-what-is-industrial-iot.md)
