---
title: Create an Azure IoT Hub using a PowerShell cmdlet | Microsoft Docs
description: How to use a PowerShell cmdlet to create an IoT hub.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/04/2017
ms.author: dobett

---
# Create an IoT hub using the New-AzureRmIotHub cmdlet

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction

You can use Azure PowerShell cmdlets to create and manage Azure IoT hubs. This tutorial shows you how to create an IoT hub with PowerShell.

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Azure Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md).  This article covers using the Azure Resource Manager deployment model.

To complete this tutorial, you need the following:

* An active Azure account. <br/>If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* [Azure PowerShell cmdlets][lnk-powershell-install].

## Connect to your Azure subscription
In a PowerShell command prompt, enter the following command to sign in to your Azure subscription:

```powershell
Login-AzureRmAccount
```

## Create resource group

You need a resource group to deploy an IoT hub. You can use an existing resource group or create a new one.

You can use the following command to discover the locations where you can deploy an IoT hub:

```powershell
((Get-AzureRmResourceProvider `
  -ProviderNamespace Microsoft.Devices).ResourceTypes `
  | Where-Object ResourceTypeName -eq IoTHubs).Locations
```

To create a resource group for your IoT hub in one of the supported locations for IoT Hub, use the following command. This example creates a resource group called **MyIoTRG1** in the **East US** region:

```powershell
New-AzureRmResourceGroup -Name MyIoTRG1 -Location "East US"
```

## Create an IoT hub

To create an IoT hub in the resource group you created in the previous step, use the following command. This example creates an **S1** hub called **MyTestIoTHub** in the **East US** region:

```powershell
New-AzureRmIotHub `
    -ResourceGroupName MyIoTRG1 `
    -Name MyTestIoTHub `
    -SkuName S1 -Units 1 `
    -Location "East US"
```

> [!NOTE]
> The name of the IoT hub must be unique.

You can list all the IoT hubs in your subscription using the following command:

```powershell
Get-AzureRmIotHub
```

The previous example adds an S1 Standard IoT Hub for which you are billed. You can delete the IoT hub using the following command:

```powershell
Remove-AzureRmIotHub `
    -ResourceGroupName MyIoTRG1 `
    -Name MyTestIoTHub
```

Alternatively, you can remove a resource group and all the resources it contains using the following command:

```powershell
Remove-AzureRmResourceGroup -Name MyIoTRG1
```

## Next steps

Now you have deployed an IoT hub using a PowerShell cmdlet, you may want to explore further:

* Discover other [PowerShell cmdlets for working with your IoT hub][lnk-iothub-cmdlets].
* Read about the capabilities of the [IoT Hub resource provider REST API][lnk-rest-api].

To learn more about developing for IoT Hub, see the following articles:

* [Introduction to C SDK][lnk-c-sdk]
* [Azure IoT SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

* [Simulating a device with the IoT Gateway SDK][lnk-gateway]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-powershell-install]: https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[lnk-iothub-cmdlets]: https://docs.microsoft.com/powershell/module/azurerm.iothub/
[lnk-rest-api]: https://docs.microsoft.com/rest/api/iothub/iothubresource

[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-devguide-sdks.md

[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
