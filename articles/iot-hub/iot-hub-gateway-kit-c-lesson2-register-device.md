---
title: 'SensorTag device & Azure IoT Gateway - Lesson 2: Register device | Microsoft Docs'
description:
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'azure iot hub, internet of things cloud, azure iot hub create device, ti sensortag, ti ble'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-gateway-kit-c-lesson1-set-up-nuc

ms.assetid: 2c18f5ae-e39a-48ae-a9fe-04bb595740a0
ms.service: iot-hub
ms.devlang: c
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---

# Create your Azure IoT hub and register your device

## What you will do

- Create a resource group
- Create your first IoT hub
- Register your device in your IoT hub by using the Azure CLI. 

When you register your device in your IoT hub, the Azure IoT Hub service generates a key for your device to use to authenticate with the service. 

If you have any problems, look for solutions on the [troubleshooting page](iot-hub-gateway-kit-c-troubleshooting.md).

## What you will learn

In this lesson, you will learn:

- How to use the Azure CLI to create an IoT hub.
- How to register a device in an IoT hub.

## What you need

- An active Azure subscription. If you don't have an Azure account, you can create a [free Azure trial account](http://azure.microsoft.com/pricing/free-trial/) in just a few minutes.
- You should have the Azure CLI installed.

## Create an IoT hub

To create an IoT hub, follow these steps:

1. Sign in to your Azure account by running the following command:

   ```bash
   az login
   ```

   All your available subscriptions will be listed after a successful sign-in.

2. Set the default Azure subscription that you want to use by running the following command:

   ```bash
   az account set --subscription {subscription id or name}
   ```

   `subscription ID or name` can be found in the output of the `az login` or the `az account list` command.

3. Register the provider by running the following command. Resource providers are services that provide resources for your application. You must register the provider before you can deploy the Azure resource that the provider offers.

   ```bash
   az provider register -n "Microsoft.Devices"
   ```

4. Create a resource group named `iot-gateway` in the West US region by running the following command:

   ```bash
   az group create --name iot-gateway --location westus
   ```
   
   `westus` is the location you create your resource group. If you want to use another location, you can run `az account list-locations -o table` to see all the locations Azure supports.

5. Create an IoT hub in the `iot-gateway` resource group by running the following command:

   ```bash
   az iot hub create --name {my hub name} --resource-group iot-gateway
   ```

By default, the tool creates an IoT Hub in the Free pricing tier. For more infomation, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

> [!NOTE]
> The name of your IoT hub must be globally unique. You can create only one F1 edition of Azure Iot Hub under your Azure subscription.

## Register your device in your IoT hub

Each device that sends messages to your IoT hub and receives messages from your IoT hub must be registered with a unique ID.
Register your device in your IoT hub by running following command:

```bash
az iot device create --device-id mydevice --hub-name {my hub name} --resource-group iot-gateway
```

## Summary

You've created an IoT hub and registered your logical device with a device identity in your IoT hub. You're ready to learn how to configure and run a gateway sample application to send data from your physical device to your IoT hub in the cloud.

## Next steps
[Configure and run a BLE sample app](iot-hub-gateway-kit-c-lesson3-configure-ble-app.md)