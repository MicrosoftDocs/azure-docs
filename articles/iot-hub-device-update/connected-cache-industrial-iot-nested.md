---
title: Microsoft Connected Cache within an Azure IoT Edge for Industrial IoT configuration | Microsoft Docs
description: Microsoft Connected Cache within an Azure IoT Edge for Industrial IoT configuration tutorial
author: andyriv
ms.author: andyriv
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Microsoft Connected Cache preview deployment scenario sample: Microsoft Connected Cache within an Azure IoT Edge for Industrial IoT configuration

Manufacturing networks are often organized in hierarchical layers following the [Purdue network model](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture) (included in the [ISA 95](https://en.wikipedia.org/wiki/ANSI/ISA-95) and [ISA 99](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa99) standards). In these networks, only the top layer has connectivity to the cloud and the lower layers in the hierarchy can only communicate with adjacent north and south layers.

This GitHub sample, [Azure IoT Edge for Industrial IoT](https://github.com/Azure-Samples/iot-edge-for-iiot), deploys the following:

* Simulated Purdue network in Azure
* Industrial assets 
* Hierarchy of Azure IoT Edge gateways
  
These components will be used to acquire industrial data and securely upload it to the cloud without compromising the security of the network. Microsoft Connected Cache can be deployed to support the download of content at all levels within the ISA 95 compliant network.

The key to configuring Microsoft Connected Cache deployments within an ISA 95 compliant network is configuring both the OT proxy *and* the upstream host at the L3 IoT Edge gateway.

1. Configure Microsoft Connected Cache deployments at the L5 and L4 levels as described in the Two-Level Nested IoT Edge gateway sample 
2. The deployment at the L3 IoT Edge gateway must specify:
   
   * UPSTREAM_HOST - The IP/FQDN of the L4 IoT Edge gateway, which the L3 Microsoft Connected Cache will request content.
   * UPSTREAM_PROXY - The IP/FQDN:PORT of the OT proxy server.

3. The OT proxy must add the L4 MCC FQDN/IP address to the allowlist.

To validate that Microsoft Connected Cache is functioning properly, execute the following command in the terminal of the IoT Edge device, hosting the module, or any device on the network. Replace \<Azure IoT Edge Gateway IP\> with the IP address or hostname of your IoT Edge gateway. (see environment variable details for information on visibility of this report).

```bash
    wget http://<L3 IoT Edge Gateway IP>/mscomtest/wuidt.gif?cacheHostOrigin=au.download.windowsupdate.com
```