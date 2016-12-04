---
title: Create your hub and register Raspberry Pi 3 | Microsoft Docs
description: Create a resource group, create an Azure IoT hub, and register Pi in the IoT hub by using Azure CLI.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timlt
tags: ''
keywords: ''

ms.assetid: 736215b6-e7e4-46f9-af30-0ded9ffa5204
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/21/2016
ms.author: xshi

---
# Create your IoT hub and register Raspberry Pi 3
## What you will do
* Create a resource group.
* Create your Azure IoT hub in the resource group.
* Add Raspberry Pi 3 to the Azure IoT hub by using the Azure command-line interface (Azure CLI).

When you use Azure CLI to add Pi to your IoT hub, the service generates a key for Pi to authenticate with the service. If you have any problems, seek solutions on the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## What you will learn
* How to use Azure CLI to create an IoT hub
* How to create a device identity for Pi in your IoT hub

## What you need
* An Azure account
* A Mac or a Windows computer with Azure CLI installed

## Create your IoT hub
Azure IoT Hub helps you connect, monitor, and manage millions of IoT assets. To create your IoT hub, follow these steps:

1. Sign in to your Azure account by running the following command:
   
    ```bash
    az login
    ```
   
    All your available Azure subscriptions are listed after a successful sign-in.
2. Set the default Azure subscription that you want to use by running the following command:
   
    ```bash
    az account set -n {subscription id or name}
    ```
   
    The subscription ID or name can be found in the output of `az login`.
3. Register the provider by running the following command:
   
    ```bash
    az resource provider register -n "Microsoft.Devices"
    ```
   
    You must register the provider before you can deploy the Azure resource that the provider provides.
   
   > [!NOTE]
   > Most providers are registered automatically by the Azure portal or the Azure CLI that you're using, but not all. For more information about the provider, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../resource-manager-common-deployment-errors.md).
   > 
   > 
4. Create a resource group named iot-sample in the West US region by running the following command:
   
    ```bash
    az resource group create --name iot-sample --location westus
    ```
5. Create an IoT hub in the iot-sample resource group by running the following command:
   
    ```bash
    az iot hub create --name {my hub name} --resource-group iot-sample
    ```
   
    The default edition of the IoT hub that you create is F1, which is free. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

> [!NOTE]
> The name of your IoT hub must be globally unique.
> 
> You can create only one F1 edition of an IoT hub under your Azure subscription.
> 
> 

## Register Pi in your IoT hub
Each device that sends messages to your IoT hub and receives messages from your IoT hub must be registered with a unique ID.

Register Pi in your hub by running following command:

```bash
az iot device create --device-id myraspberrypi --hub {my hub name} --resource-group iot-sample
```

## Summary
You've created an Azure IoT hub and registered Pi with a device identity in your IoT hub. You're ready to learn how to send messages from Pi to your IoT hub.

## Next steps
[Create an Azure function app and an Azure storage account to process and store IoT hub messages](iot-hub-raspberry-pi-kit-node-lesson3-deploy-resource-manager-template.md)

