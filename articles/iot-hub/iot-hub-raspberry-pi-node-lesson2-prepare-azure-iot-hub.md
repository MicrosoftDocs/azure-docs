<properties
 pageTitle="Create your Azure IoT Hub and the register your Raspberry Pi 3 device"
 description="Create your resource group, provision your first Azure IoT Hub, and add your first device to the Azure IoT Hub using Azure CLI. When you use the Azure CLI to add a device to your IoT hub, the service generates a key that your Raspberry Pi must use to authenticate with the service. You might need 10 minutes to complete this section."
 services="iot-hub"
 documentationCenter=""
 authors="shizn"
 manager="timlt"
 tags=""
 keywords=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/28/2016" 
 ms.author="xshi"/>

# 2.2 Create your Azure IoT Hub and the register your Raspberry Pi 3 device

## 2.2.1 What you will do
Create your resource group, provision your first Azure IoT Hub, and add your first device to the Azure IoT Hub using Azure CLI. When you use the Azure CLI to add a device to your IoT hub, the service generates a key that your Raspberry Pi must use to authenticate with the service. You might need 10 minutes to complete this section.

## 2.2.2 What you will learn
In this section, you will learn
- How to use Azure CLI to create an Azure IoT Hub
- How to create a device identity in your Azure IoT Hub

## 2.2.3 What you need
- Your Azure account
- Your Mac or PC with Azure CLI installed

## 2.2.4 Create your Azure IoT Hub
Azure IoT Hub can help you connect, monitor, and manage millions of IoT assets. To get started, you need to provision you own Azure IoT hub. Then, you create an Azure IoT hub in a new resource group. 

Login to your Azure account with the following command. All of your available subscriptions are listed after a successful login.

```bash
az login
```

Use the following command to set the subscription that you want to use by default. The subscription ID or name can be found in the output of `az login`.

```bash
az account set -n {subscription id or name}
```

Run the following command to create a new resource group named iot-sample in the West US region.

```bash
az resource group create --name iot-sample --location westus
```

Next, you need to create a new IoT hub in the iot-sample resource group. The default SKU of this IoT Hub is **F1**, which is **free**. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

```bash
az iot hub create --name {my hub name} --resource-group iot-sample
```

> [AZURE.NOTE] IoT Hub name must be globally unique.


> [AZURE.NOTE] You can only create one Iot hub with **F1** SKU under your subscription.

## 2.2.5 Register your device in the IoT Hub
Each device that sends/receives messages to/from your Azure IoT Hub must be registered with a unique ID. Create a device in the Azure IoT Hub using following command:

```bash
az iot device create --device-id myraspberrypi --hub {my hub name} --resource-group iot-sample
```

## 2.2.6 Summary
You have created an Azure IoT hub and a device identity for your Raspberry Pi 3 in your Azure IoT hub. Continue to the next lesson to learn how to send messages from your Pi to cloud.

## Next Steps
[Lesson 3 - Send device-to-cloud messages](iot-hub-raspberry-pi-node-lesson3.md)
