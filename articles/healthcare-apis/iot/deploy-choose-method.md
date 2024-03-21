---
title: Choose a deployment method for the MedTech service - Azure Health Data Services
description: Learn about the different methods for deploying the MedTech service.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template, devx-track-bicep
ms.topic: quickstart
ms.date: 07/05/2023
ms.author: jasteppe
---

# Quickstart: Choose a deployment method for the MedTech service

The MedTech service provides multiple methods for deployment into Azure. Each deployment method has different advantages that allow you to customize your deployment to suit your needs and use cases.

In this quickstart, learn about these deployment methods:

* Azure Resource Manager template (ARM template) including an Azure Iot Hub using the **Deploy to Azure** button. 
* ARM template using the **Deploy to Azure** button.
* ARM template using Azure PowerShell or the Azure CLI.
* Bicep file using Azure PowerShell or the Azure CLI.
* Azure portal.

## Deployment overview

The following diagram outlines the basic steps of the MedTech service deployment. These steps might help you analyze the deployment options and determine which deployment method is best for you.

:::image type="content" source="media/get-started/get-started-with-medtech-service.png" alt-text="Diagram showing MedTech service deployment overview." lightbox="media/get-started/get-started-with-medtech-service.png":::

## ARM template including an Azure Iot Hub using the Deploy to Azure button

Using an ARM template with the **Deploy to Azure** button is an easy and fast deployment method because it automates the deployment, most configuration steps, and uses the Azure portal. The deployed MedTech service and Azure IoT Hub are fully functional including conforming and valid device and FHIR&reg; destination mappings. Use the Azure IoT Hub to create devices and send device messages to the MedTech service.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors-with-iothub%2Fazuredeploy.json)

To learn more about deploying the MedTech service including an Azure IoT Hub using an ARM template and the **Deploy to Azure** button, see [Receive device messages through Azure IoT Hub](device-messages-through-iot-hub.md).

## ARM template using the Deploy to Azure button

Using an ARM template with the **Deploy to Azure** button is an easy and fast deployment method because it automates the deployment, most configuration steps, and uses the Azure portal. The deployed MedTech service requires conforming and valid device and FHIR destination mappings to be fully functional.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors%2Fazuredeploy.json).

To learn more about deploying the MedTech service using an ARM template and the **Deploy to Azure** button, see [Deploy the MedTech service using an Azure Resource Manager template](deploy-arm-template.md).

## ARM template using Azure PowerShell or the Azure CLI

Using an ARM template with Azure PowerShell or the Azure CLI is a more advanced deployment method. This deployment method can be useful for adding automation and repeatability so that you can scale and customize your deployments. The deployed MedTech service requires conforming and valid device and FHIR destination mappings to be fully functional.

To learn more about deploying the MedTech service using an ARM template and Azure PowerShell or the Azure CLI, see [Deploy the MedTech service using an Azure Resource Manager template and Azure PowerShell or the Azure CLI](deploy-json-powershell-cli.md).

## Bicep file using Azure PowerShell or the Azure CLI

Using a Bicep file with Azure PowerShell or the Azure CLI is a more advanced deployment method. This deployment method can be useful for adding automation and repeatability so that you can scale and customize your deployments. The deployed MedTech service requires conforming and valid device and FHIR destination mappings to be fully functional.

To learn more about deploying the MedTech service using a Bicep file and Azure PowerShell or the Azure CLI, see [Deploy the MedTech service using a Bicep file and Azure PowerShell or the Azure CLI](deploy-bicep-powershell-cli.md).

## Azure portal

Using the Azure portal allows you to see the details of each deployment step. The Azure portal deployment has many steps, but it provides valuable technical information that might be useful for customizing and troubleshooting your MedTech service.

To learn more about deploying the MedTech service using the Azure portal, see [Deploy the MedTech service using the Azure portal](deploy-manual-portal.md).

> [!IMPORTANT]
> If you're going to allow access from multiple services to the event hub, it is highly recommended that each service has its own event hub consumer group.
>
> Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
>
> Examples:
>
> * Two MedTech services accessing the same event hub.
>
> * A MedTech service and a storage writer application accessing the same event hub.

## Next steps

[Choose a deployment method for the MedTech service](deploy-new-choose.md)

[Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)

[Frequently asked questions about the MedTech service](frequently-asked-questions.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
