---
title: Create an Azure IoT Hub using a template (PowerShell) | Microsoft Docs
description: How to use an Azure Resource Manager template to create an IoT Hub with Azure PowerShell.
author: robinsh
manager: philmea
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/02/2019
---

# Create an IoT hub using Azure Resource Manager template (PowerShell)

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

Learn how to use an Azure Resource Manager template to create an IoT Hub and a consumer group. Resource Manager templates are JSON files that define the resources you need to deploy for your solution. For more information about developing Resource Manager templates, see [Azure Resource Manager documentation](https://docs.microsoft.com/azure/azure-resource-manager/).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create an IoT hub

The Resource Manager template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-iothub-with-consumergroup-create/). Here is a copy of the template:

[!code-json[iothub-creation](~/quickstart-templates/101-iothub-with-consumergroup-create/azuredeploy.json)]

The template creates an Azure Iot hub with three endpoints (eventhub, cloud-to-device, and messaging), and a consumer group. For more template samples, see [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devices&pageNumber=1&sort=Popular). The Iot Hub template schema can be found  [here](https://docs.microsoft.com/azure/templates/microsoft.devices/iothub-allversions).

There are several methods for deploying a template.  You use Azure PowerShell in this tutorial.

To run the PowerShell script, Select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select Paste:

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$iotHubName = Read-Host -Prompt "Enter the IoT Hub name"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-iothub-with-consumergroup-create/azuredeploy.json" `
    -iotHubName $iotHubName
```

As you can see from the PowerShell script, the template used is from Azure Quickstart templates. To use your own, you need to first upload the template file to the Cloud shell, and then use the `-TemplateFile` switch to specify the file name.  For an example, see [Deploy the template](../azure-resource-manager/resource-manager-quickstart-create-templates-use-visual-studio-code.md?tabs=PowerShell#deploy-the-template).

## Next steps

Now you have deployed an IoT hub by using an Azure Resource Manager template, you may want to explore further:

* Read about the capabilities of the [IoT Hub resource provider REST API][lnk-rest-api].
* Read [Azure Resource Manager overview][lnk-azure-rm-overview] to learn more about the capabilities of Azure Resource Manager.
* For the JSON syntax and properties to use in templates, see [Microsoft.Devices resource types](/azure/templates/microsoft.devices/iothub-allversions).

To learn more about developing for IoT Hub, see the following articles:

* [Introduction to C SDK][lnk-c-sdk]
* [Azure IoT SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

* [Deploying AI to edge devices with Azure IoT Edge][lnk-iotedge]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-status]: https://azure.microsoft.com/status/
[lnk-powershell-install]: /powershell/azure/install-Az-ps
[lnk-rest-api]: https://docs.microsoft.com/rest/api/iothub/iothubresource
[lnk-azure-rm-overview]: ../azure-resource-manager/resource-group-overview.md
[lnk-powershell-arm]: ../azure-resource-manager/manage-resources-powershell.md

[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-devguide-sdks.md

[lnk-iotedge]: ../iot-edge/tutorial-simulate-device-linux.md
