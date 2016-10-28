<properties
 pageTitle="Create your hub and register Raspberry Pi 3 | Microsoft Azure"
 description="Create a resource group, create an Azure hub, and register Pi in the hub by using Azure CLI."
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

# Create your hub and register Raspberry Pi 3

## What you will do

- Create a resource group.
- Create your hub in the resource group.
- Add Raspberry Pi 3 to the hub by using the Azure command-line interface (Azure CLI).

When you use Azure CLI to add Pi to your hub, the service generates a key for Pi to authenticate with the service. If you have any problems, seek solutions on the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## What you will learn

- How to use Azure CLI to create a hub
- How to create a device identity for Pi in your hub

## What you need

- An Azure account
- A Mac or a Windows computer with Azure CLI installed

## Create your hub

Azure IoT Hub helps you connect, monitor, and manage millions of IoT assets. To create your hub, follow these steps:

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

    > [AZURE.NOTE] Most providers are registered automatically by the Azure portal or the Azure CLI you are using, but not all. For more information about the provider, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../resource-manager-common-deployment-errors.md).

4. Create a resource group named iot-sample in the West US region by running the following command:

    ```bash
    az resource group create --name iot-sample --location westus
    ```

5. Create a hub in the iot-sample resource group by running the following command:

    ```bash
    az iot hub create --name {my hub name} --resource-group iot-sample
    ```

    The default edition of the hub that you create is F1, which is free. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

> [AZURE.NOTE] The name of your hub must be globally unique.
>
> You can create only one F1 edition of a hub under your Azure subscription.

## Register Pi in your hub

Each device that sends messages to your hub and receives messages from your hub must be registered with a unique ID.

Register Pi in your hub by running following command:

```bash
az iot device create --device-id myraspberrypi --hub {my hub name} --resource-group iot-sample
```

## Summary

You've created a hub and registered Pi with a device identity in your hub. You're ready to learn how to send messages from Pi to your hub.

## Next steps

[Create an Azure function app and an Azure storage account to process and store IoT hub messages](iot-hub-raspberry-pi-kit-node-lesson3-deploy-resource-manager-template.md)
