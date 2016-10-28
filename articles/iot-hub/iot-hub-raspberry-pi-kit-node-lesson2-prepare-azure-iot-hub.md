<properties
 pageTitle="Create your IoT hub and register your Raspberry Pi 3 | Microsoft Azure"
 description="Create a resource group, create an Azure IoT hub, and register your Pi in the Azure IoT hub using the Azure CLI."
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
 ms.date="10/21/2016"
 ms.author="xshi"/>

# 2.2 Create your IoT hub and register your Raspberry Pi 3

## 2.2.1 What you will do

- Create a resource group.
- Create your Azure IoT hub in the resource group.
- Add your Raspberry Pi 3 to the Azure IoT hub using the Azure CLI.

When you use the Azure CLI to add your Pi to your IoT hub, the service generates a key for your Pi to authenticate with the service. If you meet any problems, seek solutions in the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## 2.2.2 What you will learn

- How to use the Azure CLI to create an Azure IoT Hub.
- How to create a device identity for your Pi in your Azure IoT Hub.

## 2.2.3 What you need

- An Azure account
- A Mac or a Windows computer with the Azure CLI installed

## 2.2.4 Create your Azure IoT hub

Azure IoT Hub helps you connect, monitor, and manage millions of IoT assets. To create your Azure IoT hub, follow these steps:

1. Log in to your Azure account by running the following command:

    ```bash
    az login
    ```

    All your available Azure subscriptions are listed after a successful login.

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

    > [AZURE.NOTE] Most providers are registered automatically by the Azure portal or the Azure CLI you are using, but not all. For more information about the provider, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../resource-manager-common-deployment-errors.md)

4. Create a resource group named iot-sample in the West US region by running the following command:

    ```bash
    az resource group create --name iot-sample --location westus
    ```

5. Create an IoT hub in the iot-sample resource group by running the following command:

    ```bash
    az iot hub create --name {my hub name} --resource-group iot-sample
    ```

    The default edition of the IoT hub you create is **F1**, which is **free**. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

> [AZURE.NOTE] The name of your IoT hub must be globally unique.
>
> You can create only one **F1** edition of Azure IoT Hub under your Azure subscription.

## 2.2.5 Register your Pi in your IoT hub

Each device that sends/receives messages to/from your Azure IoT hub must be registered with a unique ID.

Register your Pi in your Azure IoT hub by running following command:

```bash
az iot device create --device-id myraspberrypi --hub {my hub name} --resource-group iot-sample
```

## 2.2.6 Summary

You've created an Azure IoT hub and registered your Pi with a device identity in your Azure IoT hub. You're ready to move on to the next lesson to learn how to send messages from your Pi to your IoT hub.

## Next Steps

You're now ready to start Lesson 3 that begins with [Create an Azure function app and an Azure Storage account to process and store IoT hub messages](iot-hub-raspberry-pi-kit-node-lesson3-deploy-resource-manager-template.md).