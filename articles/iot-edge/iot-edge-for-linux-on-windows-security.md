---
title: Azure IoT Edge for Linux on Windows security | Microsoft Docs 
description: How to update IoT Edge devices to run the latest versions of the security daemon and the IoT Edge runtime
keywords: 
author: PatAltimore

ms.author: fcabrera
ms.date: 03/14/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Security

[!INCLUDE [iot-edge-version-201806-or-202011](../../includes/iot-edge-version-201806-or-202011.md)]

Azure IoT Edge for Linux on Windows benefits from all the security offerings from running on a Windows Client/Server host and ensures all the additional components keep the same security premises.

## Virutal Machine security

The IoT Edge for Linux (EFLOW) curated virutal machine is based on [Microsoft CBL-Mariner](https://github.com/microsoft/CBL-Mariner). CBL-Mariner is an internal Linux distribution for Microsoft’s cloud infrastructure and edge products and services. CBL-Mariner is designed to provide a consistent platform for these devices and services and will enhance Microsoft’s ability to stay current on Linux updates. For more information, refer to [CBL-Mariner security](https://github.com/microsoft/CBL-Mariner/blob/1.0/SECURITY.md). 

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
The EFLOW virutal machine is built on a two-point comprehensive security platform:
1. Servicing updates
1. Read-only root filesystem

:::moniker-end
<!-- end 1.1 -->

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"
The EFLOW virutal machine is built on a three-point comprehensive security platform:
1. Servicing updates
1. Read-only root filesystem
1. DM-Verity
:::moniker-end
<!-- end 1.2 -->

### Servicing updates
When security vulnerabilities arise, CBL-Mariner makes the latest security patches and fixes available for being serviced through [EFLOW Updates](./iot-edge-for-linux-on-windows.md). The virutal machine has no package manager, so it's not possible to manually download and install RPM packages. CBL-Mariner monthly 

### Read-only root filesytem





## Next steps

View the latest [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

Stay up-to-date with recent updates and announcements in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/)