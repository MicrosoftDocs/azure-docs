---
title: Create an Azure IoT Hub using a PowerShell cmdlet | Microsoft Docs
description: How to use a PowerShell cmdlet to create an IoT hub.
author: robinsh
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: robinsh
---

# Create an IoT hub using the New-AzIotHub cmdlet

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction

You can use Azure PowerShell cmdlets to create and manage Azure IoT hubs. This tutorial shows you how to create an IoT hub with PowerShell.

To complete this how-to, you need an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Connect to your Azure subscription

If you are using the Cloud Shell, you are already logged in to your subscription. If you are running PowerShell locally instead, enter the following command to sign in to your Azure subscription:

```powershell
# Log into Azure account.
Login-AzAccount
```

## Create a resource group

You need a resource group to deploy an IoT hub. You can use an existing resource group or create a new one.

To create a resource group for your IoT hub, use the [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.Resources/New-azResourceGroup) command. This example creates a resource group called **MyIoTRG1** in the **East US** region:

```azurepowershell-interactive
New-AzResourceGroup -Name MyIoTRG1 -Location "East US"
```

## Create an IoT hub

To create an IoT hub in the resource group you created in the previous step, use the [New-AzIotHub](https://docs.microsoft.com/powershell/module/az.IotHub/New-azIotHub) command. This example creates an **S1** hub called **MyTestIoTHub** in the **East US** region:

```azurepowershell-interactive
New-AzIotHub `
    -ResourceGroupName MyIoTRG1 `
    -Name MyTestIoTHub `
    -SkuName S1 -Units 1 `
    -Location "East US"
```

The name of the IoT hub must be globally unique.

[!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]

You can list all the IoT hubs in your subscription using the [Get-AzIotHub](https://docs.microsoft.com/powershell/module/az.IotHub/Get-azIotHub) command:

```azurepowershell-interactive
Get-AzIotHub
```

This example shows the S1 Standard IoT Hub you created in the previous step.

You can delete the IoT hub using the [Remove-AzIotHub](https://docs.microsoft.com/powershell/module/az.iothub/remove-aziothub) command:

```azurepowershell-interactive
Remove-AzIotHub `
    -ResourceGroupName MyIoTRG1 `
    -Name MyTestIoTHub
```

Alternatively, you can remove a resource group and all the resources it contains using the [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.Resources/Remove-azResourceGroup) command:

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyIoTRG1
```

## Next steps

Now you have deployed an IoT hub using a PowerShell cmdlet, if you want to explore further, check out the following articles:

* [PowerShell cmdlets for working with your IoT hub](https://docs.microsoft.com/powershell/module/az.iothub/).

* [IoT Hub resource provider REST API](https://docs.microsoft.com/rest/api/iothub/iothubresource).

To learn more about developing for IoT Hub, see the following articles:

* [Introduction to C SDK](iot-hub-device-sdk-c-intro.md)

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)

To further explore the capabilities of IoT Hub, see:

* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/tutorial-simulate-device-linux.md)
