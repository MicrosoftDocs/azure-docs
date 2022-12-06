---
title: Using connected registry with Azure IoT Edge
description: Overview of the connected Azure container registry in hierarchical IoT Edge scenarios
author: toddysm
ms.author: memladen
ms.service: container-registry
ms.topic: overview
ms.date: 10/11/2022
ms.custom: ignite-fall-2021
---

# Using connected registry with Azure IoT Edge

In this article, you learn about using an Azure [connected registry](intro-connected-registry.md) in hierarchical [IoT Edge](../iot-edge/about-iot-edge.md) scenarios. The connected container registry can be deployed as an IoT Edge module and play an essential role in serving container images required by the devices in the hierarchy.

## What is a hierarchical IoT Edge deployment?

Azure IoT Edge allows you to deploy IoT Edge devices across networks organized in hierarchical layers. Each layer in a hierarchy is a [gateway device](../iot-edge/iot-edge-as-gateway.md) that handles messages and requests from devices in the layer beneath it. You can structure a hierarchy of devices so that only the top layer has connectivity to the cloud, and the lower layers can only communicate with adjacent north and south layers. This network layering is the foundation of most industrial networks, which follow the [ISA-95 standard](https://en.wikipedia.org/wiki/ANSI/ISA-95).

To learn how to create a hierarchy of IoT Edge devices, see [Tutorial: Create a hierarchy of IoT Edge devices][tutorial-nested-iot-edge]

## How do I use connected registry in hierarchical IoT Edge scenarios?

The following image shows how the connected registry can be used to support the hierarchical deployment of IoT Edge. Solid gray lines show the actual network flow, while the dashed lines show the logical communication between components and the connected registries.

![Connected Registry and hierarchical IoT Edge deployments](media/overview-connected-registry-and-iot-edge/connected-registry-iot-edge-overview.svg)

### Top layer

The top layer of the example architecture, *Layer 5: Enterprise Network*, is managed by IT and can access the container registry for Contoso in the Azure cloud. The connected registry is deployed as an IoT Edge module on the IoT Edge VM and can directly communicate with the cloud registry to pull and push images and artifacts. 

The connected registry is shown as working in the default [ReadWrite mode](intro-connected-registry.md#modes). Clients of this connected registry can pull and push images and artifacts to it. Pushed images will be synchronized with the cloud registry. If pushes are not required in that layer, the connected registry can be changed to operate in [ReadOnly mode](intro-connected-registry.md#modes).

For steps to deploy the connected registry as an IoT Edge module at this level, see [Quickstart - Deploy a connected registry to an IoT Edge device][quickstart-deploy-connected-registry-iot-edge-cli].

### Nested layers

The next lower layer, *Layer 4: Site Business Planning and Logistics*, is configured to communicate only with Layer 5. Thus, when deploying the IoT Edge VM on Layer 4, it needs to pull the module images from the connected registry on Layer 5 instead. 

You can also deploy a connected registry working in ReadOnly mode to serve the layers below. This is illustrated with the IoT Edge VM on *Layer 3: Industrial Security Zone*. That VM must pull the module images from the connected registry on *Layer 4*. If clients on lower layers need to be served, a connected registry in ReadOnly mode can be deployed on Layer 3, and so on.

In this architecture, the connected registries deployed on each layer are configured to synchronize the images with the connected registry on the layer above. The connected registries are deployed as IoT Edge modules and leverage the IoT Edge mechanisms for deployment and network routing.

For steps to deploy the connected registry on nested IoT Edge devices, see [Quickstart: Deploy connected registry on nested IoT Edge devices][tutorial-deploy-connected-registry-nested-iot-edge-cli].

## Next steps

In this overview, you learned about the use of the connected registry in hierarchical IoT Edge scenarios. Continue to the following articles to learn how to configure and deploy a connected registry to your IoT Edge device.

> [!div class="nextstepaction"]
> [Quickstart - Create connected registry using the CLI][quickstart-connected-registry-cli]

> [!div class="nextstepaction"]
> [Quickstart - Create connected registry using the portal][quickstart-connected-registry-portal]

> [!div class="nextstepaction"]
> [Quickstart - Deploy a connected registry to an IoT Edge device][quickstart-deploy-connected-registry-iot-edge-cli]

> [!div class="nextstepaction"]
> [Tutorial: Deploy connected registry on nested IoT Edge devices][tutorial-deploy-connected-registry-nested-iot-edge-cli]

<!-- LINKS - internal -->
[quickstart-connected-registry-cli]:quickstart-connected-registry-cli.md
[quickstart-connected-registry-portal]:quickstart-connected-registry-portal.md
[quickstart-deploy-connected-registry-iot-edge-cli]:quickstart-deploy-connected-registry-iot-edge-cli.md
[tutorial-nested-iot-edge]:../iot-edge/tutorial-nested-iot-edge.md
[tutorial-deploy-connected-registry-nested-iot-edge-cli]: tutorial-deploy-connected-registry-nested-iot-edge-cli.md
