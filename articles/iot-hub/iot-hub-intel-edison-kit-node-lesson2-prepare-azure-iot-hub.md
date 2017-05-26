---
title: 'Connect Intel Edison (Node) to Azure IoT - Lesson 2: Register device | Microsoft Docs'
description: Create a resource group, create an Azure IoT hub, and register Edison in the Azure IoT hub by using the Azure CLI.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: ''

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-intel-edison-kit-node-get-started

ms.assetid: c1465cc2-d0d9-4326-967c-64d95b61dd54
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Create your IoT hub and register Intel Edison
## What you will do
* Create a resource group.
* Create your Azure IoT hub in the resource group.
* Add Intel Edison to the Azure IoT hub by using the Azure command-line interface (Azure CLI).

When you use the Azure CLI to add Edison to your IoT hub, the service generates a key for Edison to authenticate with the service. If you have any problems, look for solutions on the [troubleshooting page][troubleshooting].

## What you will learn
In this article, you will learn:
* How to use the Azure CLI to create an IoT hub.
* How to create a device identity for Edison in your IoT hub.

## What you need
* An Azure account. If you don't have an Azure account, create a [free Azure trial account](http://azure.microsoft.com/pricing/free-trial/) in just a few minutes.
* You should have the Azure CLI installed.

## Create your IoT hub
Azure IoT Hub helps you connect, monitor, and manage millions of IoT assets. To create your IoT hub, follow these steps:

1. Sign in to your Azure account by running the following command:

   ```bash
   az login
   ```

   All your available subscriptions are listed after a successful sign-in.

2. Set the default subscription that you want to use by running the following command:

   ```bash
   az account set --subscription {subscription id or name}
   ```

   `subscription ID or name` can be found in the output of the `az login` or the `az account list` command.

3. Register the provider by running the following command. Resource providers are services that provide resources for your application. You must register the provider before you can deploy the Azure resource that the provider offers.

   ```bash
   az provider register -n "Microsoft.Devices"
   ```
4. Create a resource group named iot-sample in the West US region by running the following command:

   ```bash
   az group create --name iot-sample --location westus
   ```

   `westus` is the location you create your resource group. If you want to use another location, you can run `az account list-locations -o table` to see all the locations Azure supports.

5. Create an IoT hub in the iot-sample resource group by running the following command:

   ```bash
   az iot hub create --name {my hub name} --resource-group iot-sample
   ```

By default, the tool creates an IoT Hub in the Free pricing tier. For more infomation, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

> [!NOTE] 
> The name of your IoT hub must be globally unique.
> You can create only one F1 edition of Azure IoT Hub under your Azure subscription.


## Register Edison in your IoT hub
Each device that sends messages to your IoT hub and receives messages from your IoT hub must be registered with a unique ID.

Register Edison in your IoT hub by running following command:

```bash
az iot device create --device-id myinteledison --hub-name {my hub name}
```

## Summary
You've created an IoT hub and registered Edison with a device identity in your IoT hub. You're ready to learn how to send messages from Edison to your IoT hub.

## Next steps
[Create an Azure function app and an Azure Storage account to process and store IoT hub messages][process-and-store-iot-hub-messages].


<!-- Images and links -->

[troubleshooting]: iot-hub-intel-edison-kit-node-troubleshooting.md
[process-and-store-iot-hub-messages]: iot-hub-intel-edison-kit-node-lesson3-deploy-resource-manager-template.md