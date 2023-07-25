---
title: Run Anomaly Detector on IoT Edge
titleSuffix: Azure AI services
description: Deploy the Anomaly Detector module to IoT Edge. 
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: how-to
ms.date: 12/03/2020
ms.author: mbullwin
---

# Deploy an Anomaly Detector univariate module to IoT Edge

Learn how to deploy the Azure AI services [Anomaly Detector](../anomaly-detector-container-howto.md) module to an IoT Edge device. Once it's deployed into IoT Edge, the module runs in IoT Edge together with other modules as container instances. It exposes the exact same APIs as an Anomaly Detector container instance running in a standard docker container environment. 

## Prerequisites

* Use an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.
* Install the [Azure CLI](/cli/azure/install-azure-cli).
* An [IoT Hub](../../../iot-hub/iot-hub-create-through-portal.md) and an [IoT Edge](../../../iot-edge/quickstart-linux.md) device.

[!INCLUDE [Create an Azure AI Anomaly Detector resource](../includes/create-anomaly-detector-resource.md)]

## Deploy the Anomaly Detection module to the edge

1. In the Azure portal, enter **Anomaly Detector on IoT Edge** into the search and open the Azure Marketplace result.
2. It will take you to the Azure portal's [Target Devices for IoT Edge Module page](https://portal.azure.com/#create/azure-cognitive-service.edge-anomaly-detector). Provide the following required information.

    1. Select your subscription.

    1. Select your IoT Hub.

    1. Select **Find device** and find an IoT Edge device.

3. Select the **Create** button.

4. Select the **AnomalyDetectoronIoTEdge** module.

    :::image type="content" source="../media/deploy-anomaly-detection-on-iot-edge/iot-edge-modules.png" alt-text="Image of IoT Edge Modules user interface with AnomalyDetectoronIoTEdge link highlighted with a red box to indicate that this is the item to select.":::

5. Navigate to **Environment Variables** and provide the following information.

    1.  Keep the value accept for **Eula**.

    1. Fill out **Billing** with your Azure AI services endpoint.

    1. Fill out **ApiKey** with your Azure AI services API key.

    :::image type="content" source="../media/deploy-anomaly-detection-on-iot-edge/environment-variables.png" alt-text="Environment variables with red boxes around the areas that need values to be filled in for endpoint and API key":::

6. Select **Update**

7. Select **Next: Routes** to define your route. You define all messages from all modules to go to Azure IoT Hub. To learn how to declare a route, see [Establish routes in IoT Edge](../../../iot-edge/module-composition.md?view=iotedge-2020-11&preserve-view=true).

8. Select **Next: Review + create**. You can preview the JSON file that defines all the modules that get deployed to your IoT Edge device.
    
9. Select **Create** to start the module deployment.

10. After you complete module deployment, you'll go back to the IoT Edge page of your IoT hub. Select your device from the list of IoT Edge devices to see its details.

11. Scroll down and see the modules listed. Check that the runtime status is running for your new module. 

To troubleshoot the runtime status of your IoT Edge device, consult the [troubleshooting guide](../../../iot-edge/troubleshoot.md).

## Test Anomaly Detector on an IoT Edge device

You'll make an HTTP call to the Azure IoT Edge device that has the Azure AI services container running. The container provides REST-based endpoint APIs. Use the host, `http://<your-edge-device-ipaddress>:5000`, for module APIs.

Alternatively, you can [create a module client by using the Anomaly Detector client library](../quickstarts/client-libraries.md?tabs=linux&pivots=programming-language-python) on the Azure IoT Edge device, and then call the running Azure AI services container on the edge. Use the host endpoint `http://<your-edge-device-ipaddress>:5000` and leave the host key empty. 

If your edge device does not already allow inbound communication on port 5000, you will need to create a new **inbound port rule**. 

For an Azure VM, this can set under **Virtual Machine** > **Settings** > **Networking** > **Inbound port rule** > **Add inbound port rule**.

There are several ways to validate that the module is running. Locate the *External IP* address and exposed port of the edge device in question, and open your favorite web browser. Use the various request URLs below to validate the container is running. The example request URLs listed below are `http://<your-edge-device-ipaddress:5000`, but your specific container may vary. Keep in mind that you need to use your edge device's *External IP* address.

| Request URL | Purpose |
|:-------------|:---------|
| `http://<your-edge-device-ipaddress>:5000/` | The container provides a home page. |
| `http://<your-edge-device-ipaddress>:5000/status` | Also requested with GET, this verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://<your-edge-device-ipaddress>:5000/swagger` | The container provides a full set of documentation for the endpoints and a **Try it out** feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required. |

![Container's home page](../../../../includes/media/cognitive-services-containers-api-documentation/container-webpage.png)

## Next steps

* Review [Install and run containers](../anomaly-detector-container-configuration.md) for pulling the container image and run the container
* Review [Configure containers](../anomaly-detector-container-configuration.md) for configuration settings
* [Learn more about Anomaly Detector API service](https://go.microsoft.com/fwlink/?linkid=2080698&clcid=0x409)
