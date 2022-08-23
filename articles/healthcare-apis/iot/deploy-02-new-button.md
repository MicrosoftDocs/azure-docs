---
title: Deploy the MedTech service with a QuickStart template - Azure Health Data Services
description: In this article, you'll learn how to deploy the MedTech service in the Azure portal using a QuickStart template.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 08/22/2022
ms.author: v-smcevoy
---

# Deploy the MedTech service with a QuickStart template

In this quickstart, you'll learn how to deploy the MedTech service in the Azure portal using two different methods: with a [quickstart template](#deploy-the-medtech-service-with-a-quickstart-template) or [manually](#deploy-the-medtech-service-manually). The MedTech service will enable you to ingest data from Internet of Things (IoT) into your Fast Healthcare Interoperability Resources (FHIR&#174;) service.

> [!IMPORTANT]
>
> You'll want to confirm that the **Microsoft.HealthcareApis** and **Microsoft.EventHub** resource providers have been registered with your Azure subscription for a successful deployment. To learn more about registering resource providers, see [Azure resource providers and types](/azure-resource-manager/management/resource-providers-and-types) 

## Deploy the MedTech service with a quickstart template

If you already have an active Azure account, you can use this [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors%2Fazuredeploy.json) button to deploy a MedTech service that will include the following resources and roles:

 * An Azure Event Hubs Namespace and device message Azure event hub (the event hub is named: **devicedata**).
 * An Azure event hub consumer group (the consumer group is named: **$Default**).
 * An Azure event hub sender role (the sender role is named: **devicedatasender**).
 * An Azure Health Data Services workspace.
 * An Azure Health Data Services FHIR service.
 * An Azure Health Data Services MedTech service including the necessary [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles to the device message event hub (**Azure Events Hubs Receiver**) and FHIR service (**FHIR Data Writer**).

> [!TIP]
> 
> By using the drop down menus, you can find all the values that can be selected. You can also begin to type the value to begin the search for the resource, however, selecting the resource from the drop down menu will ensure that there are no typos.
>
> :::image type="content" source="media\iot-deploy-quickstart-in-portal\display-drop-down-box.png" alt-text="Screenshot of Azure portal page displaying drop down menu example." lightbox="media\iot-deploy-quickstart-in-portal\display-drop-down-box.png"::: 


1. When the Azure portal launches, the following fields must be filled out:

   :::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png"::: 

   * **Subscription** - Choose the Azure subscription you would like to use for the deployment.
   * **Resource Group** - Choose an existing Resource Group or create a new Resource Group.
   * **Region** - The Azure region of the Resource Group used for the deployment. This field will auto-fill based on the Resource Group region.
   * **Basename** - Will be used to append the name the Azure resources and services to be deployed.
   * **Location** - Use the drop-down list to select a supported Azure region for the Azure Health Data Services (could be the same or different region than your Resource Group). 

2. Leave the **Device Mapping** and **Destination Mapping** fields with their default values.

3. Select the **Review + create** button once the fields are filled out.

4. After the validation has passed, select the **Create** button to begin the deployment.

   :::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-create.png" alt-text="Screenshot of Azure portal page displaying validation box and Create button for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-create.png"::: 

5. After a successful deployment, there will be remaining configurations that will need to be completed by you for a fully functional MedTech service:
   * Provide a working device mapping. For more information, see [How to use device mappings](how-to-use-device-mappings.md).
   * Provide a working FHIR destination mapping. For more information, see [How to use FHIR destination mappings](how-to-use-fhir-mappings.md).
   * Use the Shared access policies (SAS) key (**devicedatasender**) for connecting your device or application to the MedTech service device message event hub (**devicedata**). For more information, see [Connection string for a specific event hub in a namespace](../../event-hubs/event-hubs-get-connection-string.md#connection-string-for-a-specific-event-hub-in-a-namespace).

   > [!IMPORTANT]
   >
   > If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has  its own event hub consumer group. 
   >
   > Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups). 
   >
   > **Examples:** 
   > * Two MedTech services accessing the same device message event hub.
   > * A MedTech service and a storage writer application accessing the same device message event hub. 
