---
title: Microsoft Connected Cache within an Azure IoT Edge for Industrial IoT Configuration | Microsoft Docs
description: Microsoft Connected Cache within an Azure IoT Edge for Industrial IoT Configuration Tutorial
author: andyriv
ms.author: andyriv
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Microsoft Connected Cache Preview Deployment Scenario Sample: Microsoft Connected Cache within an Azure IoT Edge for Industrial IoT Configuration
Manufacturing networks are often organized in hierarchical layers following the [Purdue network model](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture) (included in the [ISA 95](https://en.wikipedia.org/wiki/ANSI/ISA-95) and [ISA 99](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa99) standards). In these networks, only the top layer has connectivity to the cloud and the lower layers in the hierarchy can only communicate with adjacent north and south layers.

This GitHub sample, [Azure IoT Edge for Industrial IoT](https://github.com/Azure-Samples/iot-edge-for-iiot), deploys a simulated Purdue network in Azure, industrial assets and a hierarchy of IoT Edge gateways to acquire industrial data and upload it to the cloud securely without compromising the security of the network. Microsoft Connected Cache can be deployed to support the download of content at all levels within the ISA 95 compliant network.

The key to configuring Microsoft Connected Cache deployments within an ISA 95 compliant network is configuring both the OT proxy *and* the upstream host at the L3 IoT Edge gateway.

1. Configure Microsoft Connected Cache deployments at the L5 and L4 levels as described in the Two-Level Nested IoT Edge gateway sample 
2. The deployment at the L3 IoT Edge gateway must specify:
* UPSTREAM_HOST - This is the IP/FQDN of the L4 IoT Edge gateway, which the L3 Microsoft Connected Cache will request content.
* UPSTREAM_PROXY - This is the IP/FQDN:PORT of the OT proxy server.
3. The OT proxy must add the L4 MCC FQDN/IP address to the allow list.

For a validation of properly functioning Microsoft Connected Cache, execute the following command in the terminal of the IoT Edge device hosting the module or any device on the network.

```bash
    wget "http://<L3 IoT Edge Gateway IP>/mscomtest/wuidt.gif?cacheHostOrigin=au.download.windowsupdate.com
```