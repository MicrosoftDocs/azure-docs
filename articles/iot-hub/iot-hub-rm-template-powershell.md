---
title: Create an Azure IoT Hub using a template (PowerShell) | Microsoft Docs
description: How to use an Azure Resource Manager template to create an IoT Hub with Azure PowerShell.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/02/2019 
ms.custom: devx-track-azurepowershell
---

# Create an IoT hub using Azure Resource Manager template (PowerShell)

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

Learn how to use an Azure Resource Manager template to create an IoT Hub and a consumer group. Resource Manager templates are JSON files that define the resources you need to deploy for your solution. For more information about developing Resource Manager templates, see [Azure Resource Manager documentation](../azure-resource-manager/index.yml).

## Create an IoT hub

The following [Resource Manager JSON template](https://azure.microsoft.com/resources/templates/iothub-with-consumergroup-create/) used in this article is one of many templates from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/). This template creates an Azure Iot hub with three endpoints (eventhub, cloud-to-device, and messaging) and a consumer group. For more information on the Iot Hub template schema, see [Microsoft.Devices (IoT Hub) resource types](/azure/templates/microsoft.devices/iothub-allversions).

[!code-json[iothub-creation](~/quickstart-templates/quickstarts/microsoft.devices/iothub-with-consumergroup-create/azuredeploy.json)]

There are several methods for deploying a template.  You use Azure PowerShell in this article.

To run the following PowerShell script, select **Try it** to open the Azure Cloud Shell. Copy the script, paste it into the shell, and answer the prompts to create a new resource, choose a region, and create a new IoT hub.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$iotHubName = Read-Host -Prompt "Enter the IoT Hub name"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devices/iothub-with-consumergroup-create/azuredeploy.json" `
    -iotHubName $iotHubName
```

> [!NOTE]
> To use your own template, upload your template file to the Cloud Shell, and then use the `-TemplateFile` switch to specify the file name.  For example, see [Deploy the template](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md?tabs=PowerShell#deploy-the-template).

## Next steps

Since you've deployed an IoT hub, using an Azure Resource Manager template, you may want to explore:

* Capabilities of the [IoT Hub resource provider REST API][lnk-rest-api]
* Capabilities of the [Azure Resource Manager][lnk-azure-rm-overview]
* JSON syntax and properties to use in templates: [Microsoft.Devices resource types](/azure/templates/microsoft.devices/iothub-allversions)

To learn more about developing for IoT Hub, see:

* [Introduction to C SDK][lnk-c-sdk]
* [Azure IoT SDKs][lnk-sdks]

To explore more capabilities of IoT Hub, see:

* [Deploying AI to edge devices with Azure IoT Edge][lnk-iotedge]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-status]: https://azure.microsoft.com/status/
[lnk-powershell-install]: /powershell/azure/install-Az-ps
[lnk-rest-api]: /rest/api/iothub/iothubresource
[lnk-azure-rm-overview]: ../azure-resource-manager/management/overview.md
[lnk-powershell-arm]: ../azure-resource-manager/management/manage-resources-powershell.md

[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-devguide-sdks.md

[lnk-iotedge]: ../iot-edge/quickstart-linux.md
