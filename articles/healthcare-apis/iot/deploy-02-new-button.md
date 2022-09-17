---
title: Deploy the MedTech service with a QuickStart template - Azure Health Data Services
description: In this article, you'll learn how to deploy the MedTech service in the Azure portal using a QuickStart template.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 09/17/2022
ms.author: v-smcevoy
---

# Deploy the MedTech service with a QuickStart template

In this quickstart, you'll learn how to deploy the MedTech service in the Azure portal using a Quickstart template. The MedTech service will enable you to ingest data from Internet of Things (IoT) into your Fast Healthcare Interoperability Resources (FHIR&#174;) service.

> [!IMPORTANT]
>
> You'll want to confirm that the **Microsoft.HealthcareApis** and **Microsoft.EventHub** resource providers have been registered with your Azure subscription for a successful deployment. To learn more about registering resource providers, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

## Deploy to Azure button

If you already have an active Azure account, select this button [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors%2Fazuredeploy.json) to deploy a MedTech service.

## Included resources and roles

When you select the **Deploy to Azure** button, the following resources and roles will be implemented:

- An Azure Event Hubs Namespace and device message Azure event hub. In this example, the event hub is named **devicedata**.

- An Azure event hub consumer group. In this example, the consumer group is named **$Default**.

- An Azure event hub sender role. In this example, the sender role is named **devicedatasender**.

- An Azure Health Data Services workspace. [QUESTION: what is this named?](deploy-02-new-button.md)

- An Azure Health Data Services FHIR service. [QUESTION: what is this named?](deploy-02-new-button.md)

- An Azure Health Data Services MedTech service including the necessary [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles to the device message event hub (**Azure Events Hubs Receiver**) and FHIR service (**FHIR Data Writer**).

## After the Deploy to Azure resources and roles are implemented, additional tasks must be completed

The following tasks must be completed after the **Deploy to Azure** button is selected and the initial resources and roles are implemented:

1. When the Azure portal launches, the following fields must be filled out:

   :::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png":::

    Use these values to fill out the highlighted fields:

    - **Subscription** - Choose the Azure subscription you would like to use for the deployment.

    - **Resource Group** - Choose an existing Resource Group or create a new Resource Group.

    - **Region** - The Azure region of the Resource Group used for the deployment. This field will auto-fill, based on the Resource Group region.

    - **Basename** - This value will be appended to the name of the Azure resources and services to be deployed.

    - **Location** - Use the drop-down list to select a supported Azure region for the Azure Health Data Services (the value could be the same or different region than your Resource Group).

2. Leave the **Device Mapping** and **Destination Mapping** fields with their default values.

3. Select the **Review + create** button after all the fields are filled out. This will review your input and check to see if all your values are valid.

4. After the validation has passed, select the **Create** button to begin the deployment.

   :::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-create.png" alt-text="Screenshot of Azure portal page displaying validation box and Create button for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-create.png":::

If all went well, your deployment is successful. But before you can use the MedTech service, you must complete a few post-deployment tasks.

## Necessary post-deployment tasks

If your deployment was successful, there are three remaining post-deployment tasks that must be completed by you for a fully functional MedTech service:

1. You must provide a working device mapping. For more information, see [How to use device mappings](how-to-use-device-mappings.md).

2. You must provide a working FHIR destination mapping. For more information, see [How to use FHIR destination mappings](how-to-use-fhir-mappings.md).

You must use a Shared access policies (SAS) key (**devicedatasender**) to connecting your device or application to the MedTech service device message event hub (**devicedata**). For more information, see [Connection string for a specific event hub in a namespace](../../event-hubs/event-hubs-get-connection-string.md#connection-string-for-a-specific-event-hub-in-a-namespace).

> [!IMPORTANT]
>
> If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has  its own event hub consumer group. 
>
> Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups). 
>
> **Examples:**
>
> - Two MedTech services accessing the same device message event hub.
> - A MedTech service and a storage writer application accessing the same device message event hub.

## Next steps

In this article, you learned how to deploy the MedTech service in the Azure portal using a Quickstart template. To learn more about other methods of deployment, see

>[!div class="nextstepaction"]
>[How to manually deploy MedTech service with Azure portal](deploy-03-new-manual.md)

>[!div class="nextstepaction"]
>[How to deploy MedTech service using an ARM template and Azure PowerShell or Azure CLI](deploy-08-new-ps-cli.md)

To learn about choosing a deployment method for the MedTech service, see

>[!div class="nextstepaction"]
>[Choosing a method of deployment for MedTech service in Azure](deploy-iot-connector-in-azure.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
