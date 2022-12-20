---
title: Choose a deployment method for the MedTech service - Azure Health Data Services
description: In this article, you'll learn how to choose a method to deploy the MedTech service.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 12/15/2022
ms.author: jasteppe
---

# Quickstart: Choose a deployment method for the MedTech service

The MedTech service provides multiple methods for deployment into Azure. Each deployment method has different advantages that will allow you to customize your deployment to suit your needs and use cases.

In this quickstart, you'll learn about these deployment methods:

> [!div class="checklist"]
> - Azure Resource Manager template (ARM template) with the **Deploy to Azure** button.
> - Azure PowerShell or the Azure CLI.
> - Azure portal manual deployment. 

## Azure Resource Manager template with the Deploy to Azure button

Using an ARM template with the **Deploy to Azure** button is an easy and fast deployment method because it automates the deployment, most configuration steps, and uses the Azure portal.

To learn more about using an ARM template and the **Deploy to Azure button**, see [Deploy the MedTech service using an Azure Resource Manager template](deploy-new-button.md).

## Azure PowerShell or the Azure CLI

Using Azure PowerShell or the Azure CLI to deploy an ARM template is a more advanced deployment method. This deployment method can be useful for adding automation and repeatability so that you can scale and customize your deployments.

To learn more about using an ARM template with Azure PowerShell or the Azure CLI, see [Deploy the MedTech service using an Azure Resource Manager template and Azure PowerShell or the Azure CLI](deploy-new-powershell-cli.md).

## Azure portal manual deployment

Using the Azure portal manual deployment will allow you to see the details of each deployment step. The manual deployment has many steps, but it provides valuable technical information that may be useful for customizing and troubleshooting your MedTech service.

To learn more about using a manual deployment with the Azure portal, see [Deploy the MedTech service manually using the Azure portal](deploy-new-manual.md).

## Deployment architecture overview

The following diagram outlines the basic steps of the MedTech service deployment and shows how these steps fit together with its data processing procedures. These basic steps may help you analyze the deployment options and determine which deployment method is best for you.

:::image type="content" source="media/iot-get-started/get-started-with-iot.png" alt-text="Diagram showing MedTech service architecture overview." lightbox="media/iot-get-started/get-started-with-iot.png":::

> [!IMPORTANT]
> If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has its own event hub consumer group.
>
> Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
>
> Examples:
>
> - Two MedTech services accessing the same device message event hub.
>
> - A MedTech service and a storage writer application accessing the same device message event hub.

## Next steps

In this quickstart, you learned about the different types of deployment methods for the MedTech service. 

To learn more about the MedTech service, see

> [!div class="nextstepaction"]
> [What is the MedTech service?](overview.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
