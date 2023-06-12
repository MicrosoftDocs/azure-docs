---
title: Create an Azure IoT Hub using a PowerShell cmdlet
description: Learn how to use the PowerShell cmdlets to create a resource group and then create an IoT hub in the resource group. Also learn how to remove the hub.
author: kgremban

ms.author: kgremban 
ms.service: iot-hub
ms.topic: how-to
ms.date: 08/29/2018
ms.custom: devx-track-azurepowershell
---

# Create an IoT hub using the New-AzIotHub cmdlet

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

You can use Azure PowerShell cmdlets to create and manage Azure IoT hubs. This tutorial shows you how to create an IoT hub with PowerShell.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Alternatively, you can use Azure Cloud Shell, if you'd rather not install additional modules onto your machine. The following section gets you started with Azure Cloud Shell.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

You need a resource group to deploy an IoT hub. You can use an existing resource group or create a new one.

To create a new resource group for your IoT hub, use the [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) command. This example creates a resource group called **MyIoTRG1** in the **East US** region:

```azurepowershell-interactive
New-AzResourceGroup -Name MyIoTRG1 -Location "East US"
```

## Connect to your Azure subscription

If you're using Cloud Shell, you're already logged in to your subscription, so you can skip this section. If you're running PowerShell locally instead, enter the following command to sign in to your Azure subscription:

```powershell
# Log into Azure account.
Login-AzAccount
```

## Create an IoT hub

Create an IoT hub using your resource group. Use the [New-AzIotHub](/powershell/module/az.IotHub/New-azIotHub) command. This example creates an **S1** hub called **MyTestIoTHub** in the **East US** region:

```azurepowershell-interactive
New-AzIotHub `
    -ResourceGroupName MyIoTRG1 `
    -Name MyTestIoTHub `
    -SkuName S1 -Units 1 `
    -Location "East US"
```

The name of the IoT hub must be globally unique.

[!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]

To list all the IoT hubs in your subscription, use the [Get-AzIotHub](/powershell/module/az.IotHub/Get-azIotHub) command.

This example shows the S1 Standard IoT Hub you created in the previous step.

```azurepowershell-interactive
Get-AzIotHub
```

To delete the IoT hub, use the [Remove-AzIotHub](/powershell/module/az.iothub/remove-aziothub) command.

```azurepowershell-interactive
Remove-AzIotHub `
    -ResourceGroupName MyIoTRG1 `
    -Name MyTestIoTHub
```

## Update the IoT hub

You can change the settings of an existing IoT hub after it's created. Here are some properties you can set for an IoT hub:

**Pricing and scale**: Migrate to a different tier or set the number of IoT Hub units.

**IP Filter**: Specify a range of IP addresses that will be accepted or rejected by the IoT hub.

**Properties**: A list of properties that you can copy and use elsewhere, such as the resource ID, resource group, location, and so on.

Explore the [**Set-AzIotHub** commands](/powershell/module/az.iothub/set-aziothub) for a complete list of update options.

## Next steps

Now that you've deployed an IoT hub using a PowerShell cmdlet, explore more articles:

* [PowerShell cmdlets for working with your IoT hub](/powershell/module/az.iothub/).

* [IoT Hub resource provider REST API](/rest/api/iothub/iothubresource).

Develop for IoT Hub:

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)

Explore the capabilities of IoT Hub:

* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/quickstart-linux.md)
