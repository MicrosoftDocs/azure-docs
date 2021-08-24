---
title: Using connected registry with Azure IoT Edge
description: Overview of the connected registry use in hierarchical IoT Edge scenario
author: toddysm
ms.author: memladen
ms.service: container-registry
ms.topic: overview
ms.date: 01/13/2021
---

# Using connected registry with Azure IoT Edge

In this article, you learn how you can use the connected registry feature of Azure container registry (ACR) in hierarchical IoT Edge scenarios. The connected registry can be deployed as an IoT Edge module and play an essential role in serving container images required by the devices in the hierarchy.

## What is a hierarchical IoT Edge deployment?

Azure IoT Edge allows you to deploy IoT Edge devices across networks organized in hierarchical layers. Each layer in a hierarchy is a gateway device that handles messages and requests from devices in the layer beneath it. You can structure a hierarchy of devices so that only the top layer has connectivity to the cloud, and the lower layers can only communicate with adjacent north and south layers. This network layering is the foundation of most industrial networks, which follow the [ISA-95 standard](https://en.wikipedia.org/wiki/ANSI/ISA-95).

You can learn how to create a hierarchy of IoT Edge devices in the following tutorial [Tutorial: Create a hierarchy of IoT Edge devices (Preview)][tutorial-nested-iot-edge]

## How to use connected registry in hierarchical IoT Edge scenario?

The picture below shows how the connected registry can be used to support the hierarchical deployment of IoT Edge.

![Connected Registry and Hierarchical IoT Edge Deployments](media/connected-registry/connected-registry-iot-edge-overview.svg)

In the above architecture, the solid gray lines show the actual network flow while the dashed lines show the logical communication between components and the connected registries.

In this example, the top layer of the architecture, *Layer 5: Enterprise Network*, is managed by IT and has access to the Internet. The top layer can access the container registry for Contoso in Azure cloud. The connected registry is deployed as an IoT Edge module on the IoT Edge VM and can directly communicate with the cloud registry to pull and push images and artifacts. The connected registry in the picture is show as working in a *registry* mode. Clients of this connected registry can pull and push images and artifacts to it. Pushed images will be synchronized with the cloud registry. If pushes are not required in that layer, the connected registry can be changed to operate in *mirror* mode.

The lower layer, *Layer 4: Site Business Planning and Logistics*, is configured to communicate only with *Layer 5*. Thus, when deploying the IoT Edge VM on *Layer 4* it needs to pull the module images from the connected registry on *Layer 5* instead. 

You can also deploy a connected registry working in a *mirror* mode to serve the layers below. This is illustrated with the IoT Edge VM on *Layer 3: Industrial Security Zone*. That VM must pull the module images from the connected registry on *Layer 4*. If clients on lower layers need to be served, a connected registry in *mirror* mode can be deployed on *Layer 3* and so on.

In this architecture, the connected registries deployed on each layer are configured to synchronize the images with the connected registry on the layer above. The connected registries are deployed as IoT Edge modules and leverage the IoT Edge mechanisms for deployment and network routing.

## Next steps

In this overview, you learned about the use of the connected registry in hierarchical IoT Edge scenarios. Continue to the one of the following articles to learn how to configure and deploy a connected registry to your IoT Edge device.

> [!div class="nextstepaction"]
> [Quickstart - Create connected registry using the CLI][quickstart-connected-registry-cli]

> [!div class="nextstepaction"]
> [Quickstart - Deploy a connected registry to an IoT Edge device][overview-connected-registry-and-iot-edge]

> [!div class="nextstepaction"]
> [Quickstart: Deploy connected registry on nested IoT Edge device][quickstart-pull-images-from-connected-registry]

<!-- LINKS - internal -->
[quickstart-connected-registry-cli]:quickstart-connected-registry-cli.md
[overview-connected-registry-and-iot-edge]:quickstart-deploy-connected-registry-iot-edge-cli.md
[tutorial-nested-iot-edge]:/iot-edge/tutorial-nested-iot-edge.md
[quickstart-connected-registry-nested]: quickstart-connected-registry-nested-iot-edge-cli.md