---
title: Deploy the MedTech service with a QuickStart template - Azure Health Data Services
description: In this article, you'll learn how to deploy the MedTech service in the Azure portal using a QuickStart template.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 09/21/2022
ms.author: v-smcevoy
---

# Deploy the MedTech service with a Azure ARM QuickStart template

In this article, you'll learn how to deploy the MedTech service in the Azure portal using an Azure ARM Quickstart template. This template will make it easy to provide the information you need to automatically set up the infrastructure and configuration for you project. For more information about Azure ARM templates, see [What are ARM templates?](../../azure-resource-manager/templates/overview).

Using the Azure Arm QuickStart template only requires four simple steps:

- **Prerequisites** - must include an Azure subscription and registered resource providers

- **Deploy to Azure button** - automatically sets up your MedTech service infrastructure using a QuickStart Arm template

- **Provide configuration details** - supplies information on the specific configuration of your service

- **Required Post-Deployment tasks** - enables MedTech service to ingest data from medical devices and translate it into Fast Healthcare Interoperability Resources (FHIR) service

## Prerequisites

In order to begin deployment, you need to have the following:

- An active Azure subscription account. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- Two resource providers registered with your Azure subscription: **Microsoft.HealthcareApis** and **Microsoft.EventHub**. To learn more about registering resource providers, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

When you have fulfilled these two prerequisites, you are ready to begin your Quickstart deployment.

## Deploy to Azure button

The first thing you need to do is select the Deploy to Azure button here::

 [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors%2Fazuredeploy.json).

This button will call a template from the Azure ARM QuickStart template library to get information from your Azure subscription environment and begin deploying the MedTech service.

After you select the Deploy to Azure button, it may take a few minutes to implement the following resources and roles:

- An Azure Event Hubs Namespace and device message Azure event hub. In this example, the event hub is named **devicedata**.

- An Azure event hub consumer group. In this example, the consumer group is named **$Default**.

- An Azure event hub sender role. In this example, the sender role is named **devicedatasender**.

- An Azure Health Data Services workspace.

- An Azure Health Data Services FHIR service.

- An Azure Health Data Services MedTech service instance, including the necessary [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles to the device message event hub (named **Azure Events Hubs Receiver**) and FHIR service (named **FHIR Data Writer**).

When these resources and roles have completed their implementation, an Azure portal will be launched.

## Provide configuration details

When the Azure portal screen appears, you will need to fill out five fields that will provide specific details of your project's configuration.

:::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png":::

Use these values to fill out the five fields:

- **Subscription** - Choose the Azure subscription you would like to use for the deployment.

- **Resource Group** - Choose an existing Resource Group or create a new Resource Group.

- **Region** - The Azure region of the Resource Group used for the deployment. This field will auto-fill, based on the Resource Group region.

- **Basename** - This value will be appended to the name of the Azure resources and services to be deployed.

- **Location** - Use the drop-down list to select a supported Azure region for the Azure Health Data Services (the value could be the same or different region than your Resource Group).

Leave the **Device Mapping** and **Destination Mapping** fields with their default values.

Select the **Review + create** button after all the fields are filled out. This will review your input and check to see if all your values are valid.

After the validation has passed, select the **Create** button to begin the deployment.

## Required post-deployment tasks

After the MedTech service is successfully deploy, there are three remaining post-deployment tasks that must be completed before MedTech is fully functional and ready for use:

1. First, you must provide a working device mapping. For more information, see [How to use device mappings](how-to-use-device-mappings.md).

2. Second, you need to ensure that you have a working FHIR destination mapping. For more information, see [How to use FHIR destination mappings](how-to-use-fhir-mappings.md).

3. Third, you must use a Shared access policies (SAS) key (named **devicedatasender**) to connecting your device or application to the MedTech service device message event hub (named **devicedata**). For more information, see [Connection string for a specific event hub in a namespace](../../event-hubs/event-hubs-get-connection-string.md#connection-string-for-a-specific-event-hub-in-a-namespace).

> [!IMPORTANT]
>
> If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has  its own event hub consumer group. Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
>
> **Examples:**
>
> - Two MedTech services accessing the same device message event hub.
> - A MedTech service and a storage writer application accessing the same device message event hub.

## Next steps

In this article, you learned how to deploy the MedTech service in the Azure portal using a Quickstart ARM template. To learn more about other methods of deployment, see

>[!div class="nextstepaction"]
>[How to manually deploy MedTech service with Azure portal](deploy-03-new-manual.md)

>[!div class="nextstepaction"]
>[How to deploy MedTech service using an ARM template and Azure PowerShell or Azure CLI](deploy-08-new-ps-cli.md)

To learn about choosing a deployment method for the MedTech service, see

>[!div class="nextstepaction"]
>[Choosing a method of deployment for MedTech service in Azure](deploy-iot-connector-in-azure.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
