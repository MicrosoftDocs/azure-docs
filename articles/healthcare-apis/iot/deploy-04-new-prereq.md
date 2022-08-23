---
title: Prerequisites for deploying the MedTech service manually using the Azure portal - Azure Health Data Services
description: In this article, you'll learn the prerequisites for manually deploying the MedTech service in the Azure portal.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 08/22/2022
ms.author: v-smcevoy
---

# Prerequisites for manually deploying the MedTech service using the Azure portal

## Prerequisites

It's important that you have the following prerequisites completed before you begin the steps of creating a MedTech service instance in Azure Health Data Services:

* [Azure account](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc)
* [Resource group deployed in the Azure portal](../../azure-resource-manager/management/manage-resource-groups-portal.md)
* [Azure Event Hubs namespace and event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md)
* [Workspace deployed in Azure Health Data Services](../healthcare-apis-quickstart.md)  
* [FHIR service deployed in Azure Health Data Services](../fhir/fhir-portal-quickstart.md)

> [!TIP]
> 
> By using the drop down menus, you can find all the values that can be selected. You can also begin to type the value to begin the search for the resource, however, selecting the resource from the drop down menu will ensure that there are no typos.
>
> :::image type="content" source="media\iot-deploy-quickstart-in-portal\display-drop-down-box.png" alt-text="Screenshot of Azure portal page displaying drop down menu example." lightbox="media\iot-deploy-quickstart-in-portal\display-drop-down-box.png"::: 
>

1. Sign into the [Azure portal](https://portal.azure.com), and then enter your Health Data Services workspace resource name in the **Search** bar field located at the middle top of your screen. The name of the workspace you'll be deploying into will be of your own choosing. For this example deployment of the MedTech service, we'll be using a workspace named `azuredocsdemo`. 
 
   :::image type="content" source="media\iot-deploy-manual-in-portal\find-workspace-in-portal.png" alt-text="Screenshot of Azure portal and entering the workspace that will be used for the MedTech service deployment." lightbox="media\iot-deploy-manual-in-portal\find-workspace-in-portal.png":::

2. Select the **Deploy MedTech service** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-deploy-medtech-service-button.png" alt-text="Screenshot of Azure Health Data Services workspace with a red box around the Deploy MedTech service button." lightbox="media\iot-deploy-manual-in-portal\select-deploy-medtech-service-button.png":::

3. Select the **Add MedTech service** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-add-medtech-service-button.png" alt-text="Screenshot of workspace and red box round the Add MedTech service button." lightbox="media\iot-deploy-manual-in-portal\select-add-medtech-service-button.png":::

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
