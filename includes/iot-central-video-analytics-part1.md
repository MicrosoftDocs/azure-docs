---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 10/06/2020
 ms.author: dobett
 ms.custom: include file
---

The sample application includes two simulated devices and one IoT Edge gateway. The following tutorials show two approaches to experiment with and understand the capabilities of the gateway:

* Create the IoT Edge gateway in an Azure VM and connect a simulated camera.
* Create the IoT Edge gateway on a real device such as an Intel NUC and connect a real camera.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Use the Azure IoT Central video analytics application template to create a retail store application
> * Customize the application settings
> * Create a device template for an IoT Edge gateway device
> * Add a gateway device to your IoT Central application

## Prerequisites

To complete this tutorial series, you need:

* An Azure subscription. If you don't have an Azure subscription, you can create one on the [Azure sign-up page](https://aka.ms/createazuresubscription).
* If you're using a real camera, you need connectivity between the IoT Edge device and the camera, and you need the **Real Time Streaming Protocol** channel.

## Initial setup

In these tutorials, you update and use several configuration files. Initial versions of these files are available in the [LVA-gateway](https://github.com/Azure/live-video-analytics/tree/master/ref-apps/lva-edge-iot-central-gateway) GitHub repository. The repository also includes a scratchpad text file for you to download and use to record configuration values from the services you deploy.

Create a folder called *lva-configuration* on your local machine to save copies of these files. Then right-click on each of the following links and choose **Save as** to save the file into the *lva-configuration* folder:
