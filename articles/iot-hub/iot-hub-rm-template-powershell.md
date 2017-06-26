---
title: Create an Azure IoT Hub using a template (PowerShell) | Microsoft Docs
description: How to use an Azure Resource Manager template to create an IoT Hub with PowerShell.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 7eade855-c289-4ffb-b5ef-02be8c5f670f
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/04/2017
ms.author: dobett

---
# Create an IoT hub using Azure Resource Manager template (PowerShell)
[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction
You can use Azure Resource Manager to create and manage Azure IoT hubs programmatically. This tutorial shows you how to use an Azure Resource Manager template to create an IoT hub with PowerShell.

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Azure Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md).  This article covers using the Azure Resource Manager deployment model.
> 
> 

To complete this tutorial, you need the following:

* An active Azure account. <br/>If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* [Azure PowerShell 1.0][lnk-powershell-install] or later.

> [!TIP]
> The article [Using Azure PowerShell with Azure Resource Manager][lnk-powershell-arm] provides more information about how to use PowerShell scripts and Azure Resource Manager templates to create Azure resources. 
> 
> 

## Connect to your Azure subscription
In a PowerShell command prompt, enter the following command to sign in to your Azure subscription:

```
Login-AzureRmAccount
```

You can use the following commands to discover where you can deploy an IoT hub and the currently supported API versions:

```
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Devices).ResourceTypes | Where-Object ResourceTypeName -eq IoTHubs).Locations
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Devices).ResourceTypes | Where-Object ResourceTypeName -eq IoTHubs).ApiVersions
```

Create a resource group to contain your IoT hub using the following command in one of the supported locations for IoT Hub. This example creates a resource group called **MyIoTRG1**:

```
New-AzureRmResourceGroup -Name MyIoTRG1 -Location "East US"
```

## Submit an Azure Resource Manager template to create an IoT hub
Use a JSON template to create an IoT hub in your resource group. You can also use an Azure Resource Manager template to make changes to an existing IoT hub.

1. Use a text editor to create an Azure Resource Manager template called **template.json** with the following resource definition to create a new standard IoT hub. This example adds the IoT Hub in the **East US** region, creates two consumer groups (**cg1** and **cg2**) on the Event Hub-compatible endpoint, and uses the **2016-02-03** API version. This template also expects you to pass in the IoT hub name as a parameter called **hubName**. For the current list of locations that support IoT Hub see [Azure Status][lnk-status].
   
    ```
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "hubName": {
          "type": "string"
        }
      },
      "resources": [
      {
        "apiVersion": "2016-02-03",
        "type": "Microsoft.Devices/IotHubs",
        "name": "[parameters('hubName')]",
        "location": "East US",
        "sku": {
          "name": "S1",
          "tier": "Standard",
          "capacity": 1
        },
        "properties": {
          "location": "East US"
        }
      },
      {
        "apiVersion": "2016-02-03",
        "type": "Microsoft.Devices/IotHubs/eventhubEndpoints/ConsumerGroups",
        "name": "[concat(parameters('hubName'), '/events/cg1')]",
        "dependsOn": [
          "[concat('Microsoft.Devices/Iothubs/', parameters('hubName'))]"
        ]
      },
      {
        "apiVersion": "2016-02-03",
        "type": "Microsoft.Devices/IotHubs/eventhubEndpoints/ConsumerGroups",
        "name": "[concat(parameters('hubName'), '/events/cg2')]",
        "dependsOn": [
          "[concat('Microsoft.Devices/Iothubs/', parameters('hubName'))]"
        ]
      }
      ],
      "outputs": {
        "hubKeys": {
          "value": "[listKeys(resourceId('Microsoft.Devices/IotHubs', parameters('hubName')), '2016-02-03')]",
          "type": "object"
        }
      }
    }
    ```
2. Save the Azure Resource Manager template file on your local machine. This example assumes you save it in a folder called **c:\templates**.
3. Run the following command to deploy your new IoT hub, passing the name of your IoT hub as a parameter. In this example, the name of the IoT hub is **abcmyiothub** (note that this name must be globally unique so it should include your name or initials):
   
    ```
    New-AzureRmResourceGroupDeployment -ResourceGroupName MyIoTRG1 -TemplateFile C:\templates\template.json -hubName abcmyiothub
    ```
4. The output displays the keys for the IoT hub you created.
5. You can verify that your application added the new IoT hub by visiting the [Azure portal][lnk-azure-portal] and viewing your list of resources, or by using the **Get-AzureRmResource** PowerShell cmdlet.

> [!NOTE]
> This example application adds an S1 Standard IoT Hub for which you are billed. You can delete the IoT hub through the [Azure portal][lnk-azure-portal] or by using the **Remove-AzureRmResource** PowerShell cmdlet when you are finished.
> 
> 

## Next steps
Now you have deployed an IoT hub using an Azure Resource Manager template with PowerShell, you may want to explore further:

* Read about the capabilities of the [IoT Hub resource provider REST API][lnk-rest-api].
* Read [Azure Resource Manager overview][lnk-azure-rm-overview] to learn more about the capabilities of Azure Resource Manager.

To learn more about developing for IoT Hub, see the following articles:

* [Introduction to C SDK][lnk-c-sdk]
* [Azure IoT SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

* [Simulating a device with the IoT Gateway SDK][lnk-gateway]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-status]: https://azure.microsoft.com/status/
[lnk-powershell-install]: /powershell/azure/install-azurerm-ps
[lnk-rest-api]: https://docs.microsoft.com/rest/api/iothub/iothubresource
[lnk-azure-rm-overview]: ../azure-resource-manager/resource-group-overview.md
[lnk-powershell-arm]: ../azure-resource-manager/powershell-azure-resource-manager.md

[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-devguide-sdks.md

[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
