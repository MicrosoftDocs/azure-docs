---
title: Connect Plug and Play device to solution | Microsoft Docs
description: Connect a Plu and Play device to my solution
author: miagdp
ms.author: miag
ms.date: 06/26/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect a Plug and Play device to my solution so I can collect telemetry and control the device.
---

# Quickstart: Connect a Plug and Play device to my solution

Plug and Play simplifies IoT by enabling you to interact with device capabilities without knowledge of the underlying device implementation. This quickstart shows you how to connect a Plug and Play device to your solution.

## Prerequisites

Install [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure that you include the **NuGet package manager** component and the **Desktop Development with C++** workload when you install Visual Studio.

Complete the steps to install the Visual Studio integration and the **azure-iot-sdk-c** package in [Setup C SDK vcpkg for Windows development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/setting_up_vcpkg.md#setup-c-sdk-vcpkg-for-windows-development-environment).

An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prepare your cloud environment

To complete the quickstart, you need an IoT hub to your Azure subscription with a registered device. To create the hub and register the device, complete the following steps using the Azure CLI.

The commands use the values in the following table:

| Name | Value | Notes   |
| ---- | ----- | ------- |
| Resource group name | `pnpqsrg` | Use this value or choose your own. |
| Location | `eastus` | Use this location or chooser one. |
| Hub name | `myiothub` | Replace this value with a unique name. |
| SKU | F1 | Create a free IoT hub, you can only have one free hub in a subscription. |
| Device name | `MyDevice` | Use this value or choose your own. |

Run the following command to add the [IoT extension for Azure CLI](../cli/azure/ext/azure-cli-iot-ext/) to your Cloud Shell instance.

```azurecli-interactive
az extension add --name azure-cli-iot-ext
```

Create a resource group for your IoT hub and then create the hub:

```azurecli-interactive
az group create --name pnpqsrg \
  --location eastus
az iot hub create --name myiothub \
  --resource-group pnpqsrg \
  --sku F1 \
  --location eastus
```

Register a device and retrieve its connection string:

```azurecli-interactive
az iot hub device-identity create \
  --hub-name myiothub \
  --device-id MyDevice
az iot hub device-identity show-connection-string \
  --hub-name myiothub \
  --device-id MyDevice \
  --output table
```

Make a note of the device connection string. It looks like `HostName=myiothub.azure-devices.net;DeviceId=MyDevice;SharedAccessKey={YourSharedAccessKey}`. You use this connection string later in the quickstart.

## Connect your device

In this quickstart, you use a simulated environmental sensor that's written in C as the sample Plug and Play device. When you run the device, it connects to the IoT hub you created in the previous section.

### Configure the simulated device

### Build and run the device sample

## Build the solution

This quickstart uses a sample IoT solution to interact with the simulated environmental sensor.

### View the telemetry

### View properties

### Set properties

### Call commands

## Clean up resources

If you plan to continue with later articles, you can keep these resources. Otherwise you can delete the resource you've created for this quickstart to avoid additional charges.

To delete the hub and registered device, complete the following steps using the Azure CLI:

```azurecli-interactive
az group delete --name pnpqsrg
```

## Next step

In this quickstart, you've learned how to connect a Plug and Play device to a IoT solution. To learn more about how to find Plug and Play devices to connect to your solution, see:

> [!div class="nextstepaction"]
> How-to: Use the device catalog to find devices
