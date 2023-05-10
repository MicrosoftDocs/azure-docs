---
author: PatAltimore
ms.service: iot-edge
ms.topic: include
ms.date: 12/30/2019
ms.author: patricka
---

## Create a container registry

In this tutorial, you use the [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) and [Azure IoT Hub](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extensions to build a module and create a **container image** from the files. Then you push this image to a **registry** that stores and manages your images. Finally, you deploy your image from your registry to run on your IoT Edge device.

You can use any Docker-compatible registry to hold your container images. Two popular Docker registry services are [Azure Container Registry](/azure/container-registry/index) and [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags). This tutorial uses Azure Container Registry.

If you don't already have a container registry, follow these steps to create a new one in Azure:

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Containers** > **Container Registry**.

1. Provide the following required values to create your container registry:

   | Field | Value |
   | ----- | ----- |
   | Subscription | Select a subscription from the drop-down list. |
   | Resource group | Use the same resource group for all of the test resources that you create during the IoT Edge quickstarts and tutorials. For example, **IoTEdgeResources**. |
   | Registry name | Provide a unique name. |
   | Location | Choose a location close to you. |
   | SKU | Select **Basic**. |

1. Select **Review + create**, then **Create**.

1. Select your new container registry from the **Resources** section of your Azure portal home page to open it.

1. In the left pane of your container registry, select **Access keys** from the menu located under **Settings**.

   :::image type="content" source="../media/iot-edge-create-container-registry/access-keys.png" alt-text="Screenshot of the Access Keys menu location." lightbox="../media/iot-edge-create-container-registry/access-keys.png":::

1. Enable **Admin user** with the toggle button and view the **Username** and **Password** for your container registry.

1. Copy the values for **Login server**, **Username**, and **password** and save them somewhere convenient. You use these values throughout this tutorial to provide access to the container registry.
